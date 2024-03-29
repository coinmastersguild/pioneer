/*

    Pioneer API
      A High Availability blockchain api

    Goals:
      v1 compatibility with watchtower with 0 change
      Multi-asset support

    V2 goals:
      Treat Xpubs as passwords
      encrypt long term data storage
      maintain hash table to detect and cache payments



    getTransactions:

    Data: example

    { success: true,
      pagination: { page: 1, total_objects: 88, total_pages: 9 },
      data:
        [ { txid:
          '',
          status: 'confirmed',
          type: 'send',
          amount: -78602,
          date: '2019-05-10T21:01:23Z',
          confirmations: 1055,
          network: 'BTC',
          xpub:
            '' },
         }
       ]
      }
     }

*/

const TAG = " | Pioneer | "
const queue = require('@pioneer-platform/redis-queue');
const uuid = require('short-uuid');
let blocknative = require("@pioneer-platform/blocknative-client")
blocknative.init()
const blockbook = require('@pioneer-platform/blockbook')
// const foxitar = require("@pioneer-platform/foxitar-client")
let zapper = require("@pioneer-platform/zapper-client")
//@ts-ignore
let {shortListSymbolToCaip,evmCaips} = require("@pioneer-platform/pioneer-caip")



const networks:any = {
    'ETH' : require('@pioneer-platform/eth-network'),
    'ATOM': require('@pioneer-platform/cosmos-network'),
    'OSMO': require('@pioneer-platform/osmosis-network'),
    'BNB' : require('@pioneer-platform/binance-network'),
    // 'EOS' : require('@pioneer-platform/eos-network'),
    // 'FIO' : require('@pioneer-platform/fio-network'),
    'ANY' : require('@pioneer-platform/utxo-network'),
    'RUNE' : require('@pioneer-platform/thor-network'),
}

let {
    get_address_from_xpub,
    getNativeAssetForBlockchain
} = require('@pioneer-platform/cointools')

//const bcrypt = require('bcryptjs');
var numbro = require("numbro");

const log = require('@pioneer-platform/loggerdog')()
const {subscriber, publisher, redis, redisQueue} = require('@pioneer-platform/default-redis')
let connection  = require("@pioneer-platform/default-mongo")


let wait = require('wait-promise');
let sleep = wait.sleep;


let usersDB = connection.get('users')
let txsDB = connection.get('transactions')
let pubkeysDB = connection.get('pubkeys')
let inputsDB = connection.get('unspent')
let assetsDB = connection.get('assets')
let nodesDB = connection.get('nodes')
usersDB.createIndex({id: 1}, {unique: true})
txsDB.createIndex({txid: 1}, {unique: true})
inputsDB.createIndex({txid: 1}, {unique: true})
pubkeysDB.createIndex({pubkey: 1}, {unique: true})
pubkeysDB.createIndex({ tags: 1 })

const BALANCE_ON_REGISTER = true

let onStart = async function(){
    let tag = TAG + " | onStart | "
    try{
        log.debug(tag,"starting...")
        //get servers
        let servers = await nodesDB.find({type:'blockbook'})
        log.debug(tag,"servers: ",servers.length)
        await blockbook.init(servers)
        // networks.ANY.init('full')
        await networks.ETH.init()
        return true
    }catch(e){
        log.error(e)
    }
}
//onStart()

module.exports = {
    init: async function () {
        return onStart();
    },
    refresh: async function (username:string) {
        return get_and_rescan_pubkeys(username);
    },
    register: async function (username:string, pubkeys:any) {
        return register_pubkeys(username, pubkeys);
    },
    getPubkeys: async function (username:string, context?:string) {
        return get_and_verify_pubkeys(username, context);
    },
    update: async function (username:string, xpubs:any, context:string) {
        return update_pubkeys(username, xpubs, context);
    },
    balances: async function (pubkey:any) {
        return get_pubkey_balances(pubkey);
    },
}

async function getFromCache(key:any) {
    try {
        const data = await redis.get(key);
        return data;
    } catch (err) {
        throw err;
    }
}

async function setInCache(key:any, data:any, expiration:any) {
    try {
        await redis.setex(key, expiration, data);
    } catch (err) {
        throw err;
    }
}

let get_pubkey_balances = async function (pubkey: any) {
    let tag = TAG + " | get_pubkey_balances | ";
    try {
        let output: any = {};
        if (!pubkey.symbol && pubkey.asset) pubkey.symbol = pubkey.asset;
        if (!pubkey.type && pubkey.address) pubkey.type = "address";
        if (!pubkey.context) throw Error("100: invalid pubkey! missing context");
        // if (!pubkey.symbol) throw Error("101: invalid pubkey! missing symbol");
        // if (!pubkey.username) throw Error("102: invalid pubkey! missing username");
        if (!pubkey.pubkey) throw Error("103: invalid pubkey! missing pubkey");
        if (!pubkey.type) throw Error("105: invalid pubkey! missing type");
        // if(!pubkey.queueId) throw Error("106: invalid pubkey! missing queueId");
        if (pubkey.type !== 'address' && pubkey.type !== 'xpub' && pubkey.type !== 'zpub' && pubkey.type !== 'contract') throw Error("Unknown type! " + pubkey.type);
        let balances: any = [];
        let nfts: any = [];
        let positions: any = [];
        log.debug(tag," scanning pubkey: ",pubkey.pubkey)
        // By type
        if (pubkey.type === "xpub" || pubkey.type === "zpub") {
            let cacheKey = `balances:blockbook:getBalanceByXpub:${pubkey.symbol}:${pubkey.pubkey}`;
            let cachedData = await getFromCache(cacheKey);
            let balance: any;
            if (cachedData) {
                balance = JSON.parse(cachedData);
            } else {
                balance = await blockbook.getBalanceByXpub(pubkey.symbol, pubkey.pubkey);
                log.debug(tag, pubkey.username + " Balance (" + pubkey.symbol + "): ", balance);
                await setInCache(cacheKey, JSON.stringify(balance), 60 * 60 * 1);
            }
            //
            
            // Update balance
            balances.push({
                network: pubkey.symbol,
                blockchainCaip: shortListSymbolToCaip[pubkey.symbol],
                assetCaip: shortListSymbolToCaip[pubkey.symbol],
                asset: pubkey.symbol,
                symbol: pubkey.symbol,
                pubkey: pubkey.pubkey,
                context: pubkey.context,
                isToken: false,
                lastUpdated: new Date().getTime(),
                balance
            });
        } else if (pubkey.type === "address") {
            switch (pubkey.symbol) {
                case "ETH":
                    let cacheKeyZapper = `balances:zapperInfo:getPortfolio:${pubkey.pubkey}`;
                    let cachedDataZapper = await getFromCache(cacheKeyZapper);
                    let zapperInfo;
                    if (cachedDataZapper) {
                        zapperInfo = JSON.parse(cachedDataZapper);
                    } else {
                        zapperInfo = await zapper.getPortfolio(pubkey.pubkey);
                        log.debug(tag, "zapperInfo: ", zapperInfo);
                        await setInCache(cacheKeyZapper, JSON.stringify(zapperInfo), 60 * 60 * 1);
                    }

                    if (zapperInfo?.tokens?.length > 0) {
                        zapperInfo.tokens.forEach((token:any) => {
                            let balanceInfo = token.token;
                            balanceInfo.network = token.network;
                            //get caip for network
                            balanceInfo.blockchainCaip = token.blockchainCaip || 'caip:placeholder:'+token.network;
                            balanceInfo.assetCaip = token.assetCaip || 'caip:placeholder:'+token.network+":"+token.token.symbol;
                            balanceInfo.asset = token.token.symbol;
                            balanceInfo.symbol = token.token.symbol
                            balanceInfo.pubkey = pubkey.pubkey;
                            balanceInfo.context = pubkey.context;
                            balanceInfo.contract = token.token.address;
                            balanceInfo.source = 'zapper';
                            if (token.token.address !== '0x0000000000000000000000000000000000000000') {
                                balanceInfo.isToken = true;
                                balanceInfo.protocal = 'erc20';
                            }
                            balanceInfo.lastUpdated = new Date().getTime();
                            balanceInfo.price = token.token.price.toString();
                            balanceInfo.coingeckoId = token.token.coingeckoId;
                            balanceInfo.dailyVolume = token.token.price.toString();
                            balanceInfo.marketCap = token.token.marketCap.toString();
                            balanceInfo.balance = token.token.balance.toString();
                            balanceInfo.balanceUSD = token.token.balanceUSD.toString();
                            balanceInfo.balanceRaw = token.token.balanceRaw.toString();
                            balances.push(balanceInfo);
                        });
                    }

                    if (zapperInfo?.nfts?.length > 0) {
                        nfts = zapperInfo.nfts;
                    }

                    let cacheKeyAllPioneers = 'balances:getAllPioneers:ETH';
                    let cachedAllPioneers = await getFromCache(cacheKeyAllPioneers);
                    let allPioneers;
                    if (cachedAllPioneers) {
                        allPioneers = JSON.parse(cachedAllPioneers);
                    } else {
                        allPioneers = await networks['ETH'].getAllPioneers();
                        await setInCache(cacheKeyAllPioneers, JSON.stringify(allPioneers), 60 * 60 * 1);
                    }
                    log.debug(tag, "allPioneers: ", allPioneers);
                    if(!allPioneers || allPioneers.owners) allPioneers = { owners: [], images: [] };
                    let isPioneer = allPioneers.owners.includes(pubkey.pubkey.toLowerCase());
                    if (isPioneer) {
                        log.debug("Pioneer detected!");
                        let updatedUsername = await usersDB.update({ username: pubkey.username }, { $set: { isPioneer: true } }, { multi: true });
                        log.debug("Updated username PIONEER: ", updatedUsername);

                        const pioneerImage = allPioneers.images.find((image:any) => image.address.toLowerCase() === pubkey.pubkey.toLowerCase());
                        if (pioneerImage) {
                            let updatedUsername2 = await usersDB.update({ username: pubkey.username }, { $set: { pioneerImage: pioneerImage.image } }, { multi: true });
                            log.debug("updatedUsername2 PIONEER: ", updatedUsername2);
                            nfts.push({
                                name: "Pioneer",
                                description: "Pioneer",
                                source: "pioneer",
                                blockchainCaip: 'eip155:1/slip44:60',
                                assetCaip: 'eip155:1/slip44:60:'+"0x25EF864904d67e912B9eC491598A7E5A066B102F",
                                pubkey: pubkey.pubkey,
                                context: pubkey.context,
                                number: allPioneers.owners.indexOf(pubkey.pubkey.toLowerCase()),
                                image: pioneerImage.image
                            });
                        }
                    }

                    let cacheKeyBlockbookInfo = `balances:blockbook:getAddressInfo:ETH:${pubkey.pubkey}`;
                    let cachedBlockbookInfo = await getFromCache(cacheKeyBlockbookInfo);
                    let blockbookInfo;
                    if (cachedBlockbookInfo) {
                        blockbookInfo = JSON.parse(cachedBlockbookInfo);
                    } else {
                        blockbookInfo = await blockbook.getAddressInfo('ETH', pubkey.pubkey);
                        await setInCache(cacheKeyBlockbookInfo, JSON.stringify(blockbookInfo), 60 * 60 * 1);
                    }
                    log.debug(tag, 'blockbookInfo: ', blockbookInfo);

                    if (blockbookInfo?.tokens) {
                        blockbookInfo.tokens.forEach((tokenInfo:any) => {
                            if (tokenInfo.symbol && tokenInfo.symbol !== 'ETH') {
                                let balanceInfo: any = {
                                    network: "ETH",
                                    blockchainCaip: 'eip155:1/slip44:60',
                                    assetCaip: 'eip155:1/slip44:60:'+tokenInfo.contract,
                                    type: tokenInfo.type,
                                    asset: tokenInfo.symbol,
                                    symbol: tokenInfo.symbol,
                                    name: tokenInfo.name,
                                    contract: tokenInfo.contract,
                                    pubkey: pubkey.pubkey,
                                    context: pubkey.context,
                                    image: "https://pioneers.dev/coins/ethereum.png",
                                    isToken: true,
                                    protocal: 'erc20',
                                    lastUpdated: new Date().getTime(),
                                    decimals: tokenInfo.decimals,
                                    balance: tokenInfo.balance / Math.pow(10, Number(tokenInfo.decimals)),
                                    balanceNative: tokenInfo.balance / Math.pow(10, Number(tokenInfo.decimals)),
                                    source: "blockbook"
                                };

                                if (tokenInfo.holdersCount === 1) {
                                    balanceInfo.nft = true;
                                }

                                if (balanceInfo.balance > 0) {
                                    balances.push(balanceInfo);
                                }
                            }
                        });
                    }

                    break;
                default:
                    if(pubkey.symbol && networks[pubkey.symbol]){
                        let cacheKeyNetwork = `balances:${pubkey.symbol}:getBalance:${pubkey.pubkey}`;
                        let cachedDataNetwork = await getFromCache(cacheKeyNetwork);
                        let balanceNetwork;
                        if (cachedDataNetwork) {
                            balanceNetwork = JSON.parse(cachedDataNetwork);
                        } else {
                            balanceNetwork = await networks[pubkey.symbol].getBalance(pubkey.pubkey);
                            log.debug(tag, "balance: ", balanceNetwork);
                            await setInCache(cacheKeyNetwork, JSON.stringify(balanceNetwork), 60 * 60 * 1);
                        }

                        if (!balanceNetwork) balanceNetwork = 0;
                        balances.push({
                            network: pubkey.symbol,
                            asset: pubkey.symbol,
                            symbol: pubkey.symbol,
                            blockchainCaip: shortListSymbolToCaip[pubkey.symbol],
                            assetCaip: shortListSymbolToCaip[pubkey.symbol],
                            isToken: false,
                            lastUpdated: new Date().getTime(), //TODO use block heights
                            balance: balanceNetwork,
                            context: pubkey.context,
                            source: "pioneer-network-"+pubkey.symbol
                        });
                    }else{
                        console.error("Unhandled Pubkey: ",pubkey)
                    }
                    break;
            }
        }

        let pubkeyInfo = await pubkeysDB.findOne({ pubkey: pubkey.pubkey });
        if (!pubkeyInfo || !pubkeyInfo.balances) {
            pubkeyInfo = {
                balances: []
            };
        }
        if (!pubkeyInfo.nfts) pubkeyInfo.nfts = [];
        log.debug(tag, "pubkeyInfo: ", pubkeyInfo);
        log.debug(tag, "pubkeyInfo.balances: ", pubkeyInfo.balances.length);
        log.debug(tag, "nfts: ", pubkeyInfo.nfts.length);

        log.debug(tag, "balances: ", balances);
        log.debug(tag, "balances: ", balances.length);

        for (let i = 0; i < nfts.length; i++) {
            let nft = nfts[i];
            log.debug(tag, "pubkeyInfo.nfts: ", pubkeyInfo.nfts.length);
            let existingNft = pubkeyInfo.nfts.find((e: any) => e.name === nft.name);
        }
        output.balances = balances;
        output.nfts = nfts;
        output.success = true;
        return output;
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
};

let get_and_rescan_pubkeys = async function (username:string) {
    let tag = TAG + " | get_and_rescan_pubkeys | "
    try {
        //get pubkeys from mongo with context tagged
        let pubkeysMongo = await pubkeysDB.find({tags:{ $all: [username]}})
        log.debug(tag,"pubkeysMongo: ",pubkeysMongo.length)

        //get user info from mongo
        let userInfo = await usersDB.findOne({username})
        if(!userInfo) throw Error("get_and_rescan_pubkeys user not found!")
        log.debug(tag,"userInfo: ",userInfo)
        let blockchains = userInfo.blockchains
        if(!blockchains) blockchains = []
        // if(!userInfo.blockchains) throw Error("Invalid user!")

        //reformat
        let pubkeys:any = []
        let masters:any = {}
        for(let i = 0; i < pubkeysMongo.length; i++){
            let pubkeyInfo = pubkeysMongo[i]
            delete pubkeyInfo._id

            //for each wallet by user
            for(let j = 0; j < userInfo.wallets.length; j++){
                let context = userInfo.wallets[i]
                if(pubkeyInfo.type === 'zpub'){
                    //if context found in tags
                    let match = pubkeyInfo.tags.filter((e: any) => e === context)
                    if(match.length > 0){
                        register_zpub(username,pubkeyInfo,context)
                    }
                }else if(pubkeyInfo.type === 'xpub'){
                    let match = pubkeyInfo.tags.filter((e: any) => e === context)
                    if(match.length > 0){
                        register_xpub(username,pubkeyInfo,context)
                    }
                }else if(pubkeyInfo.type === 'address'){
                    let match = pubkeyInfo.tags.filter((e: any) => e === context)
                    if(match.length > 0){
                        register_address(username,pubkeyInfo,context)
                    }
                }
            }
        }



        return {pubkeys,masters}
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let get_and_verify_pubkeys = async function (username:string, context?:string) {
    let tag = TAG + " | get_and_verify_pubkeys | "
    try {

        //get pubkeys from mongo with context tagged
        if(!context) context = username
        let pubkeysMongo = await pubkeysDB.find({tags:{ $all: [context]}})
        log.debug(tag,"pubkeysMongo: ",pubkeysMongo.length)

        //get user info from mongo
        let userInfo = await usersDB.findOne({username})
        if(!userInfo) throw Error("get_and_verify_pubkeys User not found!")
        log.debug(tag,"userInfo: ",userInfo)
        let blockchains = userInfo.blockchains
        log.debug(tag,"userInfo: ",userInfo)
        if(!blockchains) blockchains = []
        //if(!userInfo.blockchains) throw Error("Invalid user!")

        //reformat
        let pubkeys:any = []
        let allBalances:any = []
        let synced:any = []
        // let masters:any = {}
        for(let i = 0; i < userInfo.pubkeys.length; i++){
            let pubkeyInfo = userInfo.pubkeys[i]
            delete pubkeyInfo._id
            //TODO validate pubkeys?
            pubkeyInfo.username = username
            //if no balances, get balances
            if(!pubkeyInfo.balances || pubkeyInfo.balances.length === 0){
                log.debug(tag,"no balances, getting balances...")
                let balances = await get_pubkey_balances(pubkeyInfo)
                if(balances.success) synced.push(pubkeyInfo.blockchain)
                // log.debug(tag,"balances: ",balances)
                log.debug(tag,pubkeyInfo.symbol+" balances: ",balances)
                log.debug(tag,context+": "+pubkeyInfo.symbol+" balances: ",balances.balances.length)
                if(balances && balances.balances) {
                    pubkeyInfo.balances = balances.balances
                    allBalances = allBalances.concat(balances.balances)
                    log.debug(tag,context+": "+pubkeyInfo.symbol+" allBalances: ",allBalances.length)
                }
                if(balances && balances.nfts) pubkeys.nfts = balances.nfts
            } else {
                log.debug(tag,"balances already exist! count: ",pubkeyInfo.balances.length)
            }

            // if(!masters[pubkeyInfo.symbol] && pubkeyInfo.master)masters[pubkeyInfo.symbol] = pubkeyInfo.master
            pubkeyInfo.context = context
            pubkeys.push(pubkeyInfo)
        }

        //validate isSynced
        let isSynced = false
        for(let i = 0; i < blockchains.length; i++){
            let blockchain = blockchains[i]
            if(synced.indexOf(blockchain) === -1){
                log.debug(tag,context+ " blockchain not synced: ",blockchain)
                isSynced = false
                break
            }
        }

        return { pubkeys, balances: allBalances }
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let register_zpub = async function (username:string, pubkey:any, context:string) {
    let tag = TAG + " | register_zpub | "
    try {
        if(!context) throw Error("101: context required!")
        if(!pubkey.zpub) throw Error("102: invalid pubkey! missing zpub!")
        if(!pubkey.pubkey) throw Error("103: invalid pubkey! missing pubkey!")
        if(pubkey.pubkey == true) throw Error("104:(zpub) invalid pubkey! == true wtf!")
        if(!pubkey.symbol) throw Error("105: invalid pubkey! missing pubkey!")
        log.debug(tag,"pubkey: ",pubkey)
        //if zpub add zpub
        let queueId = uuid.generate()

        //get master
        let account = 0
        let index = 0
        let address = await get_address_from_xpub(pubkey.zpub,pubkey.scriptType,pubkey.symbol,account,index,false,false)
        log.debug(tag,"Master(Local): ",address)
        log.debug(tag,"Master(hdwallet): ",pubkey.master)
        if(address !== pubkey.master){
            log.error(tag,"Local Master NOT VALID!!")
            log.error(tag,"Local Master: ",address)
            log.error(tag,"hdwallet Master: ",pubkey.master)
            //revert to pubkey (assume hdwallet right)
            address = pubkey.master
        }
        let work = {
            type:'zpub',
            blockchain:pubkey.blockchain,
            pubkey:pubkey.pubkey,
            master:pubkey.master,
            network:pubkey.blockchain,
            asset:pubkey.symbol,
            queueId,
            username,
            context,
            zpub:pubkey.pubkey,
            inserted: new Date().getTime()
        }
        log.debug(tag,"Creating work! ",work)
        queue.createWork("pioneer:pubkey:ingest",work)
        let result = await get_pubkey_balances(work)
        log.debug(result)

        return result
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let register_xpub = async function (username:string, pubkey:any, context:string) {
    let tag = TAG + " | register_xpub | "
    try {
        if(!pubkey.pubkey) throw Error("102: invalid pubkey! missing pubkey!")
        if(pubkey.pubkey == true) throw Error("103:(xpub) invalid pubkey! === true wtf!")
        if(!pubkey.symbol) throw Error("104: invalid pubkey! missing symbol!")
        //log.debug(tag,"pubkey: ",pubkey)
        //if zpub add zpub
        let queueId = uuid.generate()

        //get master
        let account = 0
        let index = 0
        let address = await get_address_from_xpub(pubkey.pubkey,pubkey.scriptType,pubkey.symbol,account,index,false,false)
        log.debug(tag,"Master(Local): ",address)
        log.debug(tag,"Master(hdwallet): ",pubkey.master)
        if(address !== pubkey.master){
            log.error(tag,"Local Master NOT VALID!!")
            //revert to pubkey (assume hdwallet right)
            address = pubkey.master
        }
        let work = {
            context,
            type:'xpub',
            blockchain:pubkey.blockchain,
            pubkey:pubkey.pubkey,
            master:pubkey.master,
            network:pubkey.blockchain,
            asset:pubkey.symbol,
            queueId,
            username,
            xpub:pubkey.xpub,
            inserted: new Date().getTime()
        }
        log.debug(tag,"Creating work! ",work)
        queue.createWork("pioneer:pubkey:ingest",work)
        let {balances,nfts} = await get_pubkey_balances(work)
        log.info(tag, "balances: ",balances.length)

        return {nfts, balances}
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let register_address = async function (username:string, pubkey:any, context:string) {
    let tag = TAG + " | register_address | "
    try {
        let address = pubkey.pubkey
        let queueId = uuid.generate()

        //add to work
        let work = {
            type:'address',
            pubkey:address,
            symbol:pubkey.symbol,
            blockchain:pubkey.blockchain,
            network:pubkey.network,
            asset:pubkey.symbol,
            context,
            queueId,
            username,
            address,
            master:address,
            inserted: new Date().getTime()
        }
        log.debug("adding work: ",work)

        queue.createWork("pioneer:pubkey:ingest",work)
        let result = await get_pubkey_balances(work)
        log.debug(tag,"result: ",result)

        return result
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let update_pubkeys = async function (username:string, pubkeys:any, context:string) {
    let tag = TAG + " | update_pubkeys | "
    try {
        log.debug(tag,"input: ",{username,pubkeys,context})
        let saveActions = []
        //generate addresses
        let output:any = {}
        output.pubkeys = []
        let allPubkeys:any = []
        let PubkeyMap:any = {}
        for (let i = 0; i < pubkeys.length; i++) {
            let pubkeyInfo = pubkeys[i]
            allPubkeys.push(pubkeyInfo.pubkey)
            PubkeyMap[pubkeyInfo.pubkey] = pubkeyInfo
        }
        //remove duplicates
        allPubkeys = Array.from(new Set(allPubkeys))
        let allBalances = []
        //get pubkeys from mongo
        log.debug(tag,"allPubkeys: ",allPubkeys)
        let allKnownPubkeys = await pubkeysDB.find({"pubkey" : {"$in" : allPubkeys}})
        log.debug(tag,"allKnownPubkeys: ",allKnownPubkeys.length)

        //
        let knownPubkeys:any = []
        for(let i = 0; i < allKnownPubkeys.length; i++){
            knownPubkeys.push(allKnownPubkeys[i].pubkey)
        }
        log.debug(tag,"allKnownPubkeys: ",allKnownPubkeys.length)
        log.debug(tag,"allPubkeys: ",allPubkeys.length)
        if(allPubkeys.length > allKnownPubkeys.length){
            //build diff array known
            //@ts-ignore
            let unknown = allPubkeys.filter(x => !knownPubkeys.includes(x));
            log.debug(tag,"unknown: ",unknown)
            log.debug(tag,"Registering pubkeys : ",unknown.length)

            //if(BALANCE_ON_REGISTER){} //TODO dont return till work complete
            for(let i = 0; i < unknown.length; i++){
                let pubkey:any = unknown[i]
                let pubkeyInfo = PubkeyMap[pubkey]
                log.debug(tag,"pubkeyInfo: ",pubkeyInfo)
                if(!pubkeyInfo.pubkey) throw Error("102: invalid pubkey! missing pubkey")
                if(!pubkeyInfo.master) throw Error("102: invalid pubkey! missing master")
                if(!pubkeyInfo.blockchain) throw Error("103: invalid pubkey! missing blockchain")
                if(pubkey.pubkey === true) throw Error("104: invalid pubkey! === true wtf!")
                let nativeAsset = getNativeAssetForBlockchain(pubkeyInfo.blockchain)
                if(!nativeAsset) throw Error("105: invalid pubkey! unsupported by coins module!")
                //hack
                if (!pubkeyInfo.symbol) pubkeyInfo.symbol = nativeAsset

                //hack clean up tags
                if(typeof(context) !== 'string') {
                    //
                    log.error("invalid context!",context)
                    throw Error("Bad walletID!")
                }

                //save to mongo
                let entryMongo:any = {
                    blockchain:pubkeyInfo.blockchain,
                    symbol:nativeAsset,
                    asset:nativeAsset,
                    path:pubkeyInfo.path,
                    pathMaster:pubkeyInfo.pathMaster,
                    master:pubkeyInfo.master,
                    pubkey:pubkeyInfo.pubkey,
                    script_type:pubkeyInfo.script_type,
                    network:pubkeyInfo.network,
                    created:new Date().getTime(),
                    tags:[username,pubkeyInfo.blockchain,pubkeyInfo.network,context],
                }

                if(pubkeyInfo.type === "xpub" || pubkeyInfo.xpub){
                    if(pubkeyInfo.xpub){
                        entryMongo.pubkey = pubkeyInfo.pubkey
                    } else {
                        log.errro(tag,"pubkey: ",pubkeyInfo)
                        throw Error("102: Invalid xpub pubkey!")
                    }
                    saveActions.push({insertOne:entryMongo})
                    let result = await register_xpub(username,pubkeyInfo,context)
                    entryMongo.balances = result.balances
                    allBalances.push(...result.balances);
                } else if(pubkeyInfo.type === "zpub" || pubkeyInfo.zpub){
                    if(pubkeyInfo.zpub){
                        entryMongo.pubkey = pubkeyInfo.pubkey
                    } else {
                        log.errro(tag,"pubkey: ",pubkeyInfo)
                        throw Error("102: Invalid zpub pubkey!")
                    }
                    saveActions.push({insertOne:entryMongo})
                    let result = await register_zpub(username,pubkeyInfo,context)
                    entryMongo.balances = result.balances
                    allBalances.push(...result.balances);
                } else if(pubkeyInfo.type === "address"){
                    entryMongo.pubkey = pubkeyInfo.pubkey
                    let result = await register_address(username,pubkeyInfo,context)
                    entryMongo.balances = result.balances
                    allBalances.push(...result.balances);
                } else {
                    log.error("Unhandled type: ",pubkeyInfo.type)
                }


                //verify write
                log.debug(tag,"entryMongo: ",entryMongo)
                //check exists
                let keyExists = await pubkeysDB.findOne({pubkey:entryMongo.pubkey})
                if(keyExists){
                    log.debug(tag,"Key already registered! key: ",entryMongo)
                    //push wallet to tags
                    //add to tags
                    let pushTagMongo = await pubkeysDB.update({pubkey:entryMongo.pubkey},
                        { $addToSet: { tags: { $each:[context,username] } } })
                    log.debug(tag,"pushTagMongo: ",pushTagMongo)
                }else{
                    // saveActions.push({insertOne: entryMongo})

                    //final check
                    if(!entryMongo.pubkey || entryMongo.pubkey == true){
                        log.error(" **** ERROR INVALID PUBKEY ENTRY! ***** pubkeyInfo: ",pubkeyInfo)
                        log.error(" **** ERROR INVALID PUBKEY ENTRY! ***** entryMongo: ",entryMongo)
                        throw Error("105: unable to save invalid pubkey!")
                    } else {
                        let resultSave = await pubkeysDB.insert(entryMongo)
                        log.debug(tag,"resultSave: ",resultSave)
                        //TODO throw if error (better get error then not fail fast)
                    }

                }
            }


        } else {
            log.debug(tag," No new pubkeys! ")
        }

        log.debug(tag,"output: ",output)
        if(allBalances.length === 0){
            log.error(tag,"No balances found! allBalances: ",allBalances)
            // throw Error("No balances found!")
        }
        output.balances = allBalances

        log.debug(tag," return object: ",output)
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

/*
    Rules:

    only go to network if no pubkey exists

    do not sync balances here (we only sync balances on context change)

 */

const register_pubkeys = async function (username: string, pubkeys: any) {
    let tag = TAG + " | register_pubkeys | ";
    try {
        log.debug(tag, "input: ", { username, pubkeys });
        let saveActions = [];
        let allBalances = [];
        //generate addresses
        let output: any = {};
        output.pubkeys = [];
        output.balances = [];
        output.nfts = [];
        for (let i = 0; i < pubkeys.length; i++) {
            let pubkeyInfo = pubkeys[i];
            log.debug(tag, "pubkeyInfo: ", pubkeyInfo);
            if (!pubkeyInfo.blockchain) throw Error("Invalid pubkey required field: blockchain");
            let nativeAsset = getNativeAssetForBlockchain(pubkeyInfo.blockchain);
            if (!nativeAsset) throw Error("104: invalid pubkey! unsupported by coins module!");
            if (!pubkeyInfo.pubkey) throw Error("104: invalid pubkey! missing pubkey!");
            if (!pubkeyInfo.type) throw Error("104: invalid pubkey! missing type!");
            if (!pubkeyInfo.symbol) pubkeyInfo.symbol = nativeAsset;
            //if (!pubkeyInfo.script_type) throw Error("Invalid pubkey required field: script_type coin:" + pubkeyInfo.blockchain);
            if (!pubkeyInfo.network) throw Error("Invalid pubkey required field: network coin:" + pubkeyInfo.blockchain);
            if (!pubkeyInfo.master) throw Error("Invalid pubkey required field: master coin:" + pubkeyInfo.blockchain);
            //if (!pubkeyInfo.path) throw Error("Invalid pubkey required field: path coin:" + pubkeyInfo.blockchain);
            if (!pubkeyInfo.context) throw Error("Invalid pubkey required field: context:" + pubkeyInfo.blockchain);

            //is pubkey known to mongo
            let pubkeyExists = await pubkeysDB.findOne({ pubkey: pubkeyInfo.pubkey });
            log.info(tag, "pubkeyExists: ", pubkeyExists);
            if (!pubkeyExists) {
                //register pubkey
                //save to mongo
                let entryMongo: any = {
                    pubkey: pubkeyInfo.pubkey,
                    type: pubkeyInfo.type,
                    blockchain: pubkeyInfo.blockchain,
                    symbol: nativeAsset,
                    asset: pubkeyInfo.blockchain,
                    path: pubkeyInfo.path,
                    pathMaster: pubkeyInfo.pathMaster,
                    script_type: pubkeyInfo.script_type,
                    network: pubkeyInfo.blockchain,
                    created: new Date().getTime(),
                    tags: [username, pubkeyInfo.blockchain, pubkeyInfo.symbol, pubkeyInfo.network, pubkeyInfo.context],
                };
                if (pubkeyInfo.type === "xpub") {
                    log.debug(tag, "pubkeyInfo: ", pubkeyInfo);
                    let xpub = pubkeyInfo.pubkey;
                    log.debug(tag, "xpub: ", xpub);

                    entryMongo.pubkey = xpub;
                    entryMongo.xpub = xpub;
                    entryMongo.type = 'xpub';
                    entryMongo.master = pubkeyInfo.address;
                    entryMongo.address = pubkeyInfo.address;
                    let result = await register_xpub(username, pubkeyInfo, pubkeyInfo.context);
                    entryMongo.balances = result.balances;
                    allBalances.push(...result.balances);
                } else if (pubkeyInfo.type === "zpub") {
                    let zpub = pubkeyInfo.pubkey;
                    entryMongo.pubkey = zpub;
                    entryMongo.zpub = zpub;
                    entryMongo.type = 'zpub';
                    entryMongo.master = pubkeyInfo.address;
                    entryMongo.address = pubkeyInfo.address;
                    let result = await register_xpub(username, pubkeyInfo, pubkeyInfo.context);
                    entryMongo.balances = result.balances;
                    allBalances.push(...result.balances);
                } else if (pubkeyInfo.type === "address") {
                    entryMongo.pubkey = pubkeyInfo.pubkey;
                    entryMongo.master = pubkeyInfo.pubkey;
                    entryMongo.type = pubkeyInfo.type;
                    entryMongo.address = pubkeyInfo.address;
                    let result = await register_address(username, pubkeyInfo, pubkeyInfo.context);
                    entryMongo.balances = result.balances;
                    allBalances.push(...result.balances);
                } else {
                    log.error(tag,"Unhandled type: ", pubkeyInfo.type);
                }

                //verify write
                log.info(tag, "entryMongo: ", entryMongo);
                if (!entryMongo.pubkey) throw Error("103: Invalid pubkey! can not save!");
                if (!entryMongo.balances) throw Error("103: Invalid pubkey! no balances set!");
                let action = {
                    insertOne: entryMongo
                }
                log.info(tag,"action: ",action)
                saveActions.push(action)
            } else {
                //add tag for username
                log.info(tag,"pubkeyExists.tags: ",pubkeyExists.tags)
                if(pubkeyExists.tags.indexOf(username) === -1){
                    //add to tags $push
                    let pushTagMongo = await pubkeysDB.update({pubkey:pubkeyInfo.pubkey},
                        { $addToSet: { tags: { $each:[username] } } })
                    log.info(tag,"pushTagMongo: ",pushTagMongo)
                }
            }
        }
        //bulk write to mongo
        log.info(tag,"saveActions: ",saveActions)
        if(saveActions.length > 0){
            try{
                let saveMongoBulk = await pubkeysDB.bulkWrite(saveActions,{ordered:false});
                log.info(tag, "saveMongoBulk: ", saveMongoBulk);    
            }catch(e){
                log.error("Failed to update in bulk!")
            }
        }

        //get all pubkeys for username
        let allPubkeys = await pubkeysDB.find({ tags: { $in: [username] } });
        log.info(tag, "allPubkeys: ", allPubkeys.length);

        //get all balances for username
        for(let i = 0; i < allPubkeys.length; i++){
            let pubkeyInfo = allPubkeys[i];
            if(pubkeyInfo.balances) output.balances.push(...pubkeyInfo.balances);
            if(pubkeyInfo.nfts) output.nfts.push(...pubkeyInfo.nfts);
        }
        return output;
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
};
