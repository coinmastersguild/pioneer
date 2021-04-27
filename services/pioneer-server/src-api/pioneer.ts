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

let {
    supportedBlockchains,
    supportedAssets,
    getPaths,
    get_address_from_xpub,
    getNativeAssetForBlockchain
} = require('@pioneer-platform/pioneer-coins')

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

usersDB.createIndex({id: 1}, {unique: true})
txsDB.createIndex({txid: 1}, {unique: true})
inputsDB.createIndex({txid: 1}, {unique: true})
pubkeysDB.createIndex({pubkey: 1}, {unique: true})

const BALANCE_ON_REGISTER = true

module.exports = {
    register: async function (username:string, xpubs:any, walletId:string) {
        return register_pubkeys(username, xpubs, walletId);
    },
    getPubkeys: async function (username:string, walletId:string) {
        return get_and_verify_pubkeys(username, walletId);
    },
    update: async function (username:string, xpubs:any, walletId:string) {
        return update_pubkeys(username, xpubs, walletId);
    },
}

let get_and_verify_pubkeys = async function (username:string, walletId:string) {
    let tag = TAG + " | get_and_verify_pubkeys | "
    try {
        //get pubkeys from mongo with walletId tagged
        let pubkeysMongo = await pubkeysDB.find({tags:{ $all: [walletId]}})
        log.info(tag,"pubkeysMongo: ",pubkeysMongo)

        //get user info from mongo
        let userInfo = await usersDB.findOne({username})
        log.info(tag,"userInfo: ",userInfo)
        let blockchains = userInfo.blockchains
        if(!userInfo.blockchains) throw Error("Invalid user!")

        //reformat
        let pubkeys:any = []
        let masters:any = {}
        for(let i = 0; i < pubkeysMongo.length; i++){
            let pubkeyInfo = pubkeysMongo[i]
            delete pubkeyInfo._id
            //TODO validate pubkeys?

            if(!masters[pubkeyInfo.symbol] && pubkeyInfo.master)masters[pubkeyInfo.symbol] = pubkeyInfo.master
            pubkeys.push(pubkeyInfo)
        }

        //verify pubkey list match's blockchains enabled
        for(let i = 0; i < blockchains.length; i++){
            let blockchain = blockchains[i]
            let nativeAsset = getNativeAssetForBlockchain(blockchain)
            if(!masters[nativeAsset]) {
                log.error(tag,"blockchain: ",blockchain)
                log.error(tag,"nativeAsset: ",nativeAsset)
                log.error(tag,"masters: ",masters)
                log.error(tag,"blockchains: ",blockchains)
                throw Error(" Missing Master for supported blockchain! "+blockchain)
            }
        }

        return {pubkeys,masters}
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let register_zpub = async function (username:string, pubkey:any, walletId:string) {
    let tag = TAG + " | register_zpub | "
    try {
        if(!walletId) throw Error("101: walletId required!")
        if(!pubkey.zpub) throw Error("102: invalid pubkey! missing zpub!")
        if(!pubkey.pubkey) throw Error("103: invalid pubkey! missing pubkey!")
        if(!pubkey.symbol) throw Error("104: invalid pubkey! missing pubkey!")
        log.info(tag,"pubkey: ",pubkey)
        //if zpub add zpub
        let queueId = uuid.generate()

        //get master
        let account = 0
        let index = 0
        let address = await get_address_from_xpub(pubkey.zpub,pubkey.scriptType,pubkey.symbol,account,index,false,false)
        log.info(tag,"Master(Local): ",address)
        log.info(tag,"Master(hdwallet): ",pubkey.master)
        if(address !== pubkey.master){
            log.error(tag,"Local Master NOT VALID!!")
            //revert to pubkey (assume hdwallet right)
            address = pubkey.master
        }
        let work = {
            type:'zpub',
            blockchain:pubkey.blockchain,
            pubkey:pubkey.pubkey,
            master:address,
            network:pubkey.blockchain,
            asset:pubkey.symbol,
            queueId,
            username,
            walletId,
            zpub:pubkey.pubkey,
            inserted: new Date().getTime()
        }
        await queue.createWork("pioneer:pubkey:ingest",work)

        return queueId
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let register_xpub = async function (username:string, pubkey:any, walletId:string) {
    let tag = TAG + " | register_xpub | "
    try {
        if(!pubkey.pubkey) throw Error("103: invalid pubkey! missing pubkey!")
        if(!pubkey.symbol) throw Error("104: invalid pubkey! missing symbol!")

        //if zpub add zpub
        let queueId = uuid.generate()

        //get master
        let account = 0
        let index = 0
        let address = await get_address_from_xpub(pubkey.xpub,pubkey.scriptType,pubkey.symbol,account,index,false,false)
        if(address !== pubkey.master){
            log.error(tag,"Local Master NOT VALID!!")
            //revert to pubkey (assume hdwallet right)
            address = pubkey.master
        }
        let work = {
            walletId,
            type:'xpub',
            blockchain:pubkey.blockchain,
            pubkey:pubkey.xpub,
            master:address,
            network:pubkey.blockchain,
            asset:pubkey.symbol,
            queueId,
            username,
            xpub:pubkey.xpub,
            inserted: new Date().getTime()
        }
        await queue.createWork("pioneer:pubkey:ingest",work)


        return queueId
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let register_address = async function (username:string, pubkey:any, walletId:string) {
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
            walletId,
            queueId,
            username,
            address,
            master:address,
            inserted: new Date().getTime()
        }
        log.info("adding work: ",work)

        queue.createWork("pioneer:pubkey:ingest",work)

        return queueId
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let update_pubkeys = async function (username:string, pubkeys:any, walletId:string) {
    let tag = TAG + " | update_pubkeys | "
    try {
        log.info(tag,"input: ",{username,pubkeys,walletId})
        let saveActions = []
        //generate addresses
        let output:any = {}
        output.work = []

        let allPubkeys = []
        let PubkeyMap = {}
        for (let i = 0; i < pubkeys.length; i++) {
            let pubkeyInfo = pubkeys[i]
            allPubkeys.push(pubkeyInfo.pubkey)
            PubkeyMap[pubkeyInfo.pubkey] = pubkeyInfo
        }
        //remove duplicates
        allPubkeys = Array.from(new Set(allPubkeys))

        //get pubkeys from mongo
        log.info(tag,"allPubkeys: ",allPubkeys)
        let allKnownPubkeys = await pubkeysDB.find({"pubkey" : {"$in" : allPubkeys}})
        log.info(tag,"allKnownPubkeys: ",allKnownPubkeys)

        //
        let knownPubkeys = []
        for(let i = 0; i < allKnownPubkeys.length; i++){
            knownPubkeys.push(allKnownPubkeys[i].pubkey)
        }
        log.info(tag,"allKnownPubkeys: ",allKnownPubkeys.length)
        log.info(tag,"allPubkeys: ",allPubkeys.length)
        if(allPubkeys.length > allKnownPubkeys.length){
            //build diff array known
            let unknown = allPubkeys.filter(x => !knownPubkeys.includes(x));
            log.info(tag,"unknown: ",unknown)
            log.info(tag,"Registering pubkeys : ",unknown.length)

            //TODO register unkonw!

            //if(BALANCE_ON_REGISTER){} //TODO dont return till work complete
            for(let i = 0; i < unknown.length; i++){
                let pubkey = unknown[i]
                let pubkeyInfo = PubkeyMap[pubkey]
                if(!pubkeyInfo.pubkey) throw Error("102: invalid pubkey! missing pubkey")
                if(!pubkeyInfo.master) throw Error("102: invalid pubkey! missing master")
                if(!pubkeyInfo.blockchain) throw Error("103: invalid pubkey! missing blockchain")

                let nativeAsset = getNativeAssetForBlockchain(pubkeyInfo.blockchain)
                if(!nativeAsset) throw Error("104: invalid pubkey! unsupported by coins module!")
                //hack
                if (!pubkeyInfo.symbol) pubkeyInfo.symbol = nativeAsset

                //save to mongo
                let entryMongo:any = {
                    blockchain:pubkeyInfo.blockchain,
                    symbol:nativeAsset,
                    asset:nativeAsset,
                    path:pubkeyInfo.path,
                    master:pubkeyInfo.master,
                    script_type:pubkeyInfo.script_type,
                    network:pubkeyInfo.network,
                    created:new Date().getTime(),
                    tags:[username,pubkeyInfo.blockchain,pubkeyInfo.network,walletId],
                }

                if(pubkeyInfo.type === "xpub" || pubkeyInfo.xpub){
                    if(pubkeyInfo.xpub){
                        entryMongo.pubkey = pubkeyInfo.xpub
                        entryMongo.xpub = true
                    } else {
                        log.errro(tag,"pubkey: ",pubkeyInfo)
                        throw Error("102: Invalid xpub pubkey!")
                    }
                    saveActions.push({insertOne:entryMongo})
                    let queueId = await register_xpub(username,pubkeyInfo,walletId)
                    //add to Mutex array for async xpub register option
                    output.work.push(queueId)
                } else if(pubkeyInfo.type === "zpub" || pubkeyInfo.zpub){
                    if(pubkeyInfo.zpub){
                        entryMongo.pubkey = pubkeyInfo.zpub
                        entryMongo.zpub = true
                    } else {
                        log.errro(tag,"pubkey: ",pubkeyInfo)
                        throw Error("102: Invalid zpub pubkey!")
                    }
                    saveActions.push({insertOne:entryMongo})
                    let queueId = await register_zpub(username,pubkeyInfo,walletId)
                    //add to Mutex array for async xpub register option
                    output.work.push(queueId)
                } else if(pubkeyInfo.type === "address"){
                    entryMongo.pubkey = pubkeyInfo.pubkey
                    let queueId = await register_address(username,pubkeyInfo,walletId)
                    output.work.push(queueId)
                } else {
                    log.error("Unhandled type: ",pubkeyInfo.type)
                }


                //verify write
                log.info(tag,"entryMongo: ",entryMongo)
                //check exists
                let keyExists = await pubkeysDB.findOne({pubkey:entryMongo.pubkey})
                if(keyExists){
                    log.info(tag,"Key already registered! key: ",entryMongo)
                    //push wallet to tags
                    //add to tags
                    let pushTagMongo = await usersDB.update({pubkey:entryMongo.pubkey},
                        { $addToSet: { tags: walletId } })
                    log.info(tag,"pushTagMongo: ",pushTagMongo)
                }else{
                    saveActions.push({insertOne: entryMongo})
                }
            }

            //save pubkeys in mongo
            try {
                let result = await pubkeysDB.bulkWrite(saveActions, {ordered: false})
                log.info(tag, "result: ", result)
            } catch (e) {
                log.error(tag,"Failed to update pubkeys! e: ",e)
            }

            if (BALANCE_ON_REGISTER) {
                output.results = []
                //verifies balances returned are final
                log.info(tag, " BALANCE VERIFY ON")
                //let isDone
                let isDone = false
                while (!isDone) {
                    //block on
                    log.info(tag, "output.work: ", output.work)
                    let promised = []
                    for (let i = 0; i < output.work.length; i++) {
                        let promise = redisQueue.blpop(output.work[i], 30)
                        promised.push(promise)
                    }

                    output.results = await Promise.all(promised)

                    isDone = true
                }
            }


        } else {
            log.info(tag," No new pubkeys! ")
        }



        log.info(tag," return object: ",output)
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}

let register_pubkeys = async function (username: string, pubkeys: any, walletId: string) {
    let tag = TAG + " | register_pubkeys | "
    try {
        log.info(tag, "input: ", {username, pubkeys, walletId})
        let saveActions = []
        //generate addresses
        let output: any = {}
        output.work = []

        for (let i = 0; i < pubkeys.length; i++) {
            let pubkeyInfo = pubkeys[i]
            let nativeAsset = getNativeAssetForBlockchain(pubkeyInfo.blockchain)
            if(!nativeAsset) throw Error("104: invalid pubkey! unsupported by coins module!")
            //hack
            if (!pubkeyInfo.symbol) pubkeyInfo.symbol = nativeAsset

            log.info(tag, "pubkeyInfo: ", pubkeyInfo)
            if (!pubkeyInfo.blockchain) throw Error("Invalid pubkey required field: blockchain")
            if (!pubkeyInfo.script_type) throw Error("Invalid pubkey required field: script_type coin:" + pubkeyInfo.blockchain)
            if (!pubkeyInfo.network) throw Error("Invalid pubkey required field: network coin:" + pubkeyInfo.blockchain)
            if (!pubkeyInfo.master) throw Error("Invalid pubkey required field: master coin:" + pubkeyInfo.blockchain)


            //save to mongo
            let entryMongo: any = {
                blockchain: pubkeyInfo.blockchain,
                symbol:nativeAsset,
                asset: pubkeyInfo.blockchain,
                path: pubkeyInfo.path,
                script_type: pubkeyInfo.script_type,
                network: pubkeyInfo.blockchain,
                created: new Date().getTime(),
                tags: [username, pubkeyInfo.blockchain,pubkeyInfo.symbol, pubkeyInfo.network, walletId],
            }

            if (pubkeyInfo.type === "xpub") {
                let xpub = pubkeyInfo.xpub

                entryMongo.pubkey = xpub
                entryMongo.xpub = xpub
                entryMongo.xpub = true
                entryMongo.type = 'xpub'
                entryMongo.master = pubkeyInfo.address
                entryMongo.address = pubkeyInfo.address

                let queueId = await register_xpub(username, pubkeyInfo, walletId)

                //add to Mutex array for async xpub register option
                output.work.push(queueId)

            } else if (pubkeyInfo.type === "zpub") {
                let zpub = pubkeyInfo.zpub

                entryMongo.pubkey = zpub
                entryMongo.zpub = zpub
                entryMongo.zpub = true
                entryMongo.type = 'zpub'
                entryMongo.master = pubkeyInfo.address
                entryMongo.address = pubkeyInfo.address

                let queueId = await register_xpub(username, pubkeyInfo, walletId)

                //add to Mutex array for async xpub register option
                output.work.push(queueId)

            } else if (pubkeyInfo.type === "address") {
                entryMongo.pubkey = pubkeyInfo.pubkey
                entryMongo.master = pubkeyInfo.pubkey
                entryMongo.address = pubkeyInfo.address
                let queueId = await register_address(username, pubkeyInfo, walletId)

                output.work.push(queueId)
            } else {
                log.error("Unhandled type: ", pubkeyInfo.type)
            }

            //verify write
            log.info(tag,"entryMongo: ",entryMongo)
            //check exists
            let keyExists = await pubkeysDB.findOne({pubkey:entryMongo.pubkey})
            if(keyExists){
                log.info(tag,"Key already registered! key: ",entryMongo)
                //push wallet to tags
                //add to tags
                let pushTagMongo = await usersDB.update({pubkey:entryMongo.pubkey},
                    { $addToSet: { tags: walletId } })
                log.info(tag,"pushTagMongo: ",pushTagMongo)
            }else{
                let saveMongo = await pubkeysDB.insert(entryMongo)
                log.info(tag,"saveMongo: ",saveMongo)
            }

        }


        if (BALANCE_ON_REGISTER) {
            output.results = []
            //verifies balances returned are final
            log.info(tag, " BALANCE VERIFY ON")
            //let isDone
            let isDone = false
            while (!isDone) {
                //block on
                log.info(tag, "output.work: ", output.work)
                let promised = []
                for (let i = 0; i < output.work.length; i++) {
                    let promise = redisQueue.blpop(output.work[i], 30)
                    promised.push(promise)
                }

                output.results = await Promise.all(promised)
                isDone = true
            }
        }


        log.info(tag, " return object: ", output)
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}
