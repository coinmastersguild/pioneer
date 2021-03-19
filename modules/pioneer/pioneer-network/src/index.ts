/*


 */

const TAG = " | Pioneer network | "


// const tokenData = require("@pioneer-platform/pioneer-eth-token-data")
const bitcoin = require("bitcoinjs-lib");
const ethUtils = require('ethereumjs-util');
const ripemd160 = require("crypto-js/ripemd160")
const CryptoJS = require("crypto-js")
const sha256 = require("crypto-js/sha256")
const bech32 = require(`bech32`)
// const EventEmitter = require('events');
// const emitter = new EventEmitter();
// const io = require('socket.io-client');

let {
    supportedBlockchains,
    supportedAssets,
    getPaths,
    get_address_from_xpub
} = require('@pioneer-platform/pioneer-coins')

//crypto
let cloneCrypto = require("@pioneer-platform/utxo-crypto")
let coincap = require('@pioneer-platform/pioneer-coincap')

//networks
const tokenData = require("@pioneer-platform/pioneer-eth-token-data")
const log = require("@pioneer-platform/loggerdog")()
const networks:any = {
    'ETH' : require('@pioneer-platform/eth-network'),
    'ATOM': require('@pioneer-platform/cosmos-network'),
    // 'BNB' : require('@pioneer-platform/bnb-network'),
    'RUNE': require('@pioneer-platform/thor-network'),
    // 'EOS' : require('@pioneer-platform/eos-network'),
    // 'FIO' : require('@pioneer-platform/fio-network'),
    'ANY' : require('@pioneer-platform/utxo-network'),
}
networks['ETH'].init()

const blockbook = require('@pioneer-platform/blockbook')
const BigNumber = require('bignumber.js');

let IS_TESTNET = false

let PUBLIC_WALLET:any = {}

interface Tx {
    txid?:string
    serialized?:string
}

let prefurredScripts:any = {
    BTC:"p2pkh",
    LTC:"p2pkh",
    ETH:"eth",
    EOS:"eos",
    BNB:"binance",
    ATOM:"cosmos"
}

let WT_COINS = ['BTC','LTC','DASH','DOGE','BCH','ETH','EOS','BNB','ATOM']
let WT_PUBKEYS_FORMATTED:any

let BLOCKBOOK_COINS = ['BTC','BCH','LTC','DOGE']

let BLOCKBOOK_COINS_TESTNET = [ 'BTC' , 'ETH'] //

//prescisions
const CURRENCY_DECIMALS:any = {
    'btc': 8,
    'dash': 8,
    'atom': 6,
    'ltc': 8,
    'doge': 8,
    'eth': 18,
    'gnt': 18,
    'usdt': 6,
    'trx': 6,
    'bnb': 8,
    'poly': 18,
    'gno': 18,
    'sngls': 0,
    'icn': 18,
    'dgd': 9,
    'mln': 18,
    'rep': 18,
    'swt': 18,
    'wings': 18,
    'trst': 6,
    'rlc': 9,
    'gup': 3,
    'ant': 18,
    'bat': 18,
    'bnt': 18,
    'snt': 18,
    'nmr': 18,
    'edg': 0,
    'eos': 18,
    'cvc': 8,
    'link': 18,
    'knc': 18,
    'mtl': 8,
    'pay': 18,
    'fun': 8,
    'dnt': 18,
    'zrx': 18,
    '1st': 18,
    'omg': 18,
    'salt': 8,
    'rcn': 18,
    'storj': 8,
    'zil': 12,
    'mana': 18,
    'tusd': 18,
    'ae': 18,
    'dai': 18,
    'mkr': 18
}

//TODO
//script type array
//network array

interface Recipient{
    address:string
    amount:string,
    sendMax:boolean
}

interface Input{
    network:string
    xpub:string,
    account_address_n:[number]
    script_type:string
}

interface UnsignedUtxoRequest {
    network:string
    recipients:[Recipient]
    include_txs:boolean
    include_hex:boolean
    effort:number
    inputs:[Input]
}

module.exports = {
    init: function (type:string,config:any,isTestnet:boolean) {
        return init_wallet(type,config,isTestnet);
    },
    getInfo: function () {
        return get_wallet_info();
    },
    getBlockHeight: function (coin:string) {
        return get_block_height(coin);
    },
    getBalance: function (address:string) {
        return get_balance(address);
    },
    getMaster: function (coin:string) {
        return get_address_master(coin);
    },
    getEosPubkey: function () {
        return get_eos_pubkey();
    },
    getFioPubkey: function () {
        return get_fio_pubkey();
    },
    getFioActor: function (pubkey:string) {
        return get_fio_actor_from_pubkey(pubkey);
    },
    // getEosAccountsByPubkey: function (pubkey:string) {
    //     return get_eos_accounts_by_pubkey(pubkey);
    // },
    getFioAccountsByPubkey: function (pubkey:string) {
        return get_fio_accounts_by_pubkey(pubkey);
    },
    validateEosUsername: function (username:string) {
        return validate_EOS_username(username);
    },
    validateFioUsername: function (username:string) {
        return validate_FIO_username(username);
    },
    getAddress: function (coin:string,scriptType:string,account:number,index:number,isChange:boolean,isTestnet:boolean) {
        return get_address(coin,scriptType,account,index,isChange,isTestnet);
    },
    getNewAddress: function (coin:string) {
        return get_new_address(coin);
    },
    multiBalanceHistory: function (coin:string) {
        return balance_history(coin);
    },
    createUnsignedTransaction: function (unsignedUtxoRequest:UnsignedUtxoRequest) {
        return create_unsigned_transaction(unsignedUtxoRequest);
    },
    broadcast: function (coin:string, tx:Tx) {
        return broadcast_transaction(coin,tx);
    },
}

const get_fio_actor_from_pubkey = async function (publicKey:string) {
    let tag = TAG + " | get_fio_actor_from_pubkey | "
    try {

        let account = networks['FIO'].getActor(publicKey)
        log.debug(tag,"account: ",account)


        return account
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const get_fio_accounts_by_pubkey = async function (publicKey:string) {
    let tag = TAG + " | get_eos_pubkey | "
    try {
        let accounts = []
        try{
            accounts = networks['FIO'].getAccounts(publicKey)
            log.debug(tag,"accounts: ",accounts)
        }catch(e){
            //no accounts found (wtf 404?)
        }
        return accounts
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

// const get_eos_accounts_by_pubkey = async function (publicKey:string) {
//     let tag = TAG + " | get_eos_pubkey | "
//     try {
//
//         let account = networks['EOS'].getAccountsFromPubkey(publicKey)
//         log.debug(tag,"account: ",account)
//
//
//         return account
//     } catch (e) {
//         log.error(tag, "e: ", e)
//     }
// }

const get_fio_pubkey = async function () {
    let tag = TAG + " | get_eos_pubkey | "
    try {
        log.debug(tag,"checkpoint")
        let output = PUBLIC_WALLET['FIO'].pubkey
        log.debug(tag,"output: ",output)


        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const get_eos_pubkey = async function () {
    let tag = TAG + " | get_eos_pubkey | "
    try {
        log.debug(tag,"checkpoint")
        let output = PUBLIC_WALLET['EOS'].pubkey
        log.debug(tag,"output: ",output)


        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const validate_FIO_username = async function (username:string) {
    let tag = TAG + " | validate_FIO_username | "
    try {
        // let output:any = {}

        let output = await networks['FIO'].getAccount(username)
        // log.debug(tag,"isAvailable: ",isAvailable)

        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const validate_EOS_username = async function (username:string) {
    let tag = TAG + " | validate_EOS_username | "
    try {
        // let output:any = {}

        let output = await networks['EOS'].getAccount(username)
        // log.debug(tag,"isAvailable: ",isAvailable)

        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const balance_history = async function (coin:string) {
    let tag = TAG + " | balance_history | "
    try {

        return "TODO"
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const create_unsigned_transaction = async function (unsignedUtxoRequest:UnsignedUtxoRequest) {
    let tag = TAG + " | create_unsigned_transaction | "
    try {


        return "TODO"
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const get_new_address = async function (coin:string) {
    let tag = TAG + " | get_new_address | "
    try {

        return "TODO"
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const get_block_height = async function (coin:string) {
    let tag = TAG + " | broadcast_transaction | "
    try {

        //broadcast
        let result = await networks[coin].getBlockHeight()

        return result
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const broadcast_transaction = async function (coin:string,tx:Tx) {
    let tag = TAG + " | broadcast_transaction | "
    try {

        //broadcast
        let result = await networks[coin].broadcast(tx.serialized)

        return result
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

function bech32ify(address:any, prefix:string) {
    const words = bech32.toWords(address)
    return bech32.encode(prefix, words)
}

// NOTE: this only works with a compressed public key (33 bytes)
function createBech32Address(publicKey:any,prefix:string) {
    const message = CryptoJS.enc.Hex.parse(publicKey.toString(`hex`))
    const hash = ripemd160(sha256(message)).toString()
    const address = Buffer.from(hash, `hex`)
    const cosmosAddress = bech32ify(address, prefix)
    return cosmosAddress
}

/*
    Watch only wallet compatible!
 */
//TODO do this in coin!
const get_address = async function (coin:string,scriptType:string,account:number,index:number,isChange:boolean, isTestnet:boolean) {
    let tag = TAG + " | get_address | "
    try {
        log.info(tag,"get_address: ",{coin,account,index,isChange})
        let output
        //if xpub get next unused
        if(!PUBLIC_WALLET[coin]) {
            log.error(tag,"Error: ",coin)
            throw Error("unknown coin!: "+coin)
        }

        if(PUBLIC_WALLET[coin].type === 'xpub'){
            if(!PUBLIC_WALLET[coin].xpub) {
                log.error(tag,"Invalid entry in public wallet: ",PUBLIC_WALLET[coin])
                throw Error("Invalid coin! coin: "+coin)
            }
            //
            output = await get_address_from_xpub(PUBLIC_WALLET[coin].xpub,scriptType,coin,account,index,isChange,isTestnet)
        } else {
            if(PUBLIC_WALLET[coin].master){
                output = PUBLIC_WALLET[coin].master
            } else if(PUBLIC_WALLET[coin].address){
                output = PUBLIC_WALLET[coin].address
            } else {
                throw Error("invalid pubkey info")
            }
        }

        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}


/*
    Get address given index and account

    Watch only wallet compatible!
 */

const get_address_master = async function (coin:string) {
    let tag = TAG + " | get_address_master | "
    try {
        let output

        output = PUBLIC_WALLET[coin].master

        // if(coin === "EOS"){
        //     // log.debug(tag,"pubkey: ",PUBLIC_WALLET[coin].pubkey)
        //     //
        //     // let account = await networks['EOS'].getAccountsFromPubkey(PUBLIC_WALLET[coin].pubkey)
        //     // log.debug(tag,"account: ",account)
        //     //
        //     // if(!account.account_names[0]){
        //     //     output = "No Accounts Found!"
        //     // }else{
        //     //     output = account.account_names[0]
        //     // }
        //     output = "TODO-EOS"
        // }else{
        //     output = await get_address_from_xpub(coin,0,0,false,IS_TESTNET)
        // }

        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const get_balance = async function (coin:string, isTestnet?:boolean) {
    let tag = TAG + " | get_balance | "
    try {
        log.debug("coin detected: ",coin)
        let output

        //TODO utxo's

        if(coin === "ETH"){
            log.debug("ETH detected ")
            let master = await get_address_master('ETH')
            if(isTestnet)networks['ETH'].init({testnet:true})
            output = await networks['ETH'].getBalanceAddress(master)
        }else if(tokenData.tokens.indexOf(coin) >=0 && coin !== 'EOS'){
            log.debug("token detected ")
            if(isTestnet)networks['ETH'].init({testnet:true})
            let master = await get_address_master('ETH')
            output = await networks['ETH'].getBalanceToken(master,coin)
        } else if(coin === 'ATOM'){
            let master = await get_address_master('ATOM')
            output = await networks[coin].getBalance(master)
        } else if(coin === 'RUNE'){
            let master = await get_address_master('RUNE')
            output = await networks[coin].getBalance(master)
        }else if(coin === 'BNB'){
            // let master = await get_address_master('BNB')
            // output = await networks[coin].getBalance(master)
            // output = output.free
            output = 0
        }else if(coin === 'EOS'){
            let master = await get_address_master('EOS')
            log.debug("master: ",master)
            output = await networks[coin].getBalance(master)
            if(output.success === false){
                output = 0
            }
        }else if(coin === 'FIO'){
            let master = await get_address_master('FIO')
            log.debug("master: ",master)
            output = await networks[coin].getBalance(master)
            if(output.success === false){
                output = 0
            }
        }else{
            log.error("Coin not yet implemented!")
            // @ts-ignore
            //output = await networks[coin].getBalance(PUBLIC_WALLET[coin].pubkey)
        }

        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}


function divideBy10ToTheNthAndRoundDown(n: any, num: any): any {
    return num.dividedBy(new BigNumber(10).exponentiatedBy(n)).decimalPlaces(8, BigNumber.ROUND_DOWN)
}

const get_wallet_info = async function () {
    let tag = TAG + " | get_wallet_info | "
    try {
        let output:any = {}
        let syncStatus:any = {}
        let txCount:any = {}
        let masters:any = {}
        let balances:any = {}
        let valueUsds:any = {}
        let coinInfo:any = {}
        let stakes:any = {}

        let startTime = new Date().getTime()


        //masters
        let coinsGiven = Object.keys(PUBLIC_WALLET)
        let coins:any = []
        let publicWallet:any = []
        for(let i = 0; i < coinsGiven.length; i++){
            let coin = coinsGiven[i]
            if(supportedAssets.indexOf(coin) >= 0){
                coins.push(coin)
                publicWallet.push(PUBLIC_WALLET[coin])
            }
        }
        log.info(tag,"supportedAssets: ",supportedAssets)
        log.debug(tag,"coins: ",coins)

        //pubkeys
        output.isTestnet = IS_TESTNET
        log.info(tag,"IS_TESTNET: ",IS_TESTNET)
        //filter by support


        output.public = publicWallet

        //get masters
        for(let i = 0; i < coins.length; i++){
            let coin = coins[i]
            log.info("coin: ",coin)
            let pubkeyInfo = PUBLIC_WALLET[coin]
            log.info(tag,"pubkeyInfo: ",pubkeyInfo)
            masters[coin] = await get_address_master(coin)
        }


        //blockbook coins
        if(IS_TESTNET){
            log.info(tag,"blockbook IS_TESTNET")
            for(let i = 0; i < coins.length; i++){
                let coin = coins[i]
                log.info(tag,"blockbook IS_TESTNET coin: ",coin)
                if(BLOCKBOOK_COINS_TESTNET.indexOf(coin) >= 0 && PUBLIC_WALLET[coin] && PUBLIC_WALLET[coin].xpub || PUBLIC_WALLET[coin].tpub ){
                    if(coin === 'BTC') {
                        log.info(tag,"BTC testnet blockbook tpub: ",PUBLIC_WALLET[coin].tpub)
                        let balance = await blockbook.getBalanceByXpub('TEST',PUBLIC_WALLET[coin].tpub)
                        log.info(tag,"BTC testnet blockbook balance: ",balance)
                        //get balance by xpub
                        balances[coin] = balance
                    } else {
                        log.error(" Asset not supprted on testnet! ")
                    }
                }
            }
        }else{
            for(let i = 0; i < BLOCKBOOK_COINS.length; i++){
                let coin = BLOCKBOOK_COINS[i]
                if(PUBLIC_WALLET[coin] && PUBLIC_WALLET[coin].xpub){
                    let balance = await blockbook.getBalanceByXpub(coin,PUBLIC_WALLET[coin].xpub)
                    //get balance by xpub
                    balances[coin] = balance
                }
            }
        }



        /*
               RUNE asset info

         */
        try{
            if(PUBLIC_WALLET['RUNE'] && supportedAssets.indexOf('RUNE') >= 0){
                if(IS_TESTNET){
                    const balanceRUNE = await get_balance('RUNE')

                    if(balanceRUNE){
                        balances['RUNE'] = balanceRUNE
                    } else {
                        balances['RUNE'] = 0
                    }
                    masters['RUNE'] = PUBLIC_WALLET['RUNE'].master
                    valueUsds['RUNE'] = ""
                    coinInfo['RUNE'] = ""
                } else {
                    //not in mainnet yet
                    //TODO mainnet

                }


            }
        }catch(e){
            console.error("Failed to get ATOM balances! for account: ",PUBLIC_WALLET['ATOM'])
        }

        /*
               ATOM asset info

         */
        try{
            if(PUBLIC_WALLET['ATOM'] && supportedAssets.indexOf('ATOM') >= 0){
                if(IS_TESTNET){
                    //TODO

                }else{
                    const balanceATOM = await get_balance('ATOM')

                    if(balanceATOM){
                        balances['ATOM'] = balanceATOM
                    } else {
                        balances['ATOM'] = 0
                    }
                    masters['ATOM'] = PUBLIC_WALLET['ATOM'].master
                    valueUsds['ATOM'] = ""
                    coinInfo['ATOM'] = ""

                    // //get staking positions
                    // await networks['ATOM'].init('full')
                    // let delegations = await networks['ATOM'].getDelegations()
                    // log.debug(tag,"delegations: ",delegations)
                    // if(delegations.length > 0){
                    //     stakes['ATOM'] = {}
                    //     stakes['ATOM'].delegations = []
                    //     log.debug(tag,"delegations: ",delegations)
                    //     for(let i = 0; i < delegations.length; i++){
                    //         let delegation = delegations[i]
                    //         stakes['ATOM'].delegations.push(delegation)
                    //     }
                    // }
                }

            }
        }catch(e){
            console.error("Failed to get ATOM balances! for account: ",PUBLIC_WALLET['ATOM'])
        }

        /*
               EOS asset info

         */
        try{
            // if(PUBLIC_WALLET['EOS']){
            //get registered accounts
            // let master = await get_address_master('EOS')
            // masters['EOS'] = master
            // masters['EOS'] = "n/a"
            // valueUsds['EOS'] = ""
            // coinInfo['EOS'] = ""
            // balances['EOS'] = 0
            //     const balanceEOS = await get_balance('EOS')
            //     log.debug(tag,"balanceEOS: ",balanceEOS)
            //
            //     if(balanceEOS){
            //         balances['EOS'] = parseFloat(balanceEOS)
            //     } else {
            //         balances['EOS'] = 0
            //     }
            //
            //     let stakeInfo:any = {}
            //     stakeInfo.pubkey = PUBLIC_WALLET['EOS'].pubkey
            //     //get eos accounts by username
            //     log.debug(tag,"pubkey: ",PUBLIC_WALLET['EOS'].pubkey)
            //     let accountsFromPubkey = await networks['EOS'].getAccountsFromPubkey(PUBLIC_WALLET['EOS'].pubkey)
            //     log.debug(tag,"accountsFromPubkey: ",accountsFromPubkey)
            //     if(accountsFromPubkey.account_names.length > 0){
            //         stakeInfo.usernames = accountsFromPubkey.account_names
            //         //get staking positions
            //         for(let i = 0; i < accountsFromPubkey.account_names.length; i++){
            //             let username = accountsFromPubkey[i]
            //             stakeInfo.accounts = await networks['EOS'].getAccount(username)
            //         }
            //     }
            //     log.debug(tag,"stakeInfo: ",stakeInfo)
            //     stakes['EOS'] = stakeInfo
            // }
        }catch(e){
            console.error("Failed to get EOS info! for account: ",PUBLIC_WALLET['EOS'])
        }


        // /*
        //     FIO asset info
        //
        // */
        // try{
        //     if(PUBLIC_WALLET['FIO']){
        //         //get registered accounts
        //         let master = await get_address_master('FIO')
        //         masters['FIO'] = master
        //         valueUsds['FIO'] = ""
        //         coinInfo['FIO'] = ""
        //
        //         const balanceFIO = await get_balance('FIO')
        //         log.debug(tag,"balanceFIO: ",balanceFIO)
        //
        //         if(balanceFIO){
        //             balances['FIO'] = parseFloat(balanceFIO)
        //         } else {
        //             balances['FIO'] = 0
        //         }
        //
        //     }
        // }catch(e){
        //     console.error("Failed to get EOS info! for account: ",PUBLIC_WALLET['EOS'])
        // }

        /*
           BNB asset info

         */
        try{
            if(PUBLIC_WALLET['BNB'] && supportedAssets.indexOf('BNB') >= 0){
                if(IS_TESTNET){
                    //TODO
                }else{
                    const balanceBNB = await get_balance('BNB')

                    if(balanceBNB){
                        masters['BNB'] = PUBLIC_WALLET['BNB'].pubkey
                        balances['BNB'] = balanceBNB
                        valueUsds['BNB'] = ""
                        coinInfo['BNB'] = ""
                    }
                }

            }
        }catch(e){
            console.error("Failed to get BNB balances! for account: ",PUBLIC_WALLET['BNB'])
        }


        /*
            ETH asset info

          */
        try{
            if(PUBLIC_WALLET['ETH'] && supportedAssets.indexOf('ETH') >= 0){
                if(IS_TESTNET){
                    const balanceETH = await get_balance('ETH',true)

                    if(balanceETH){
                        masters['ETH'] = PUBLIC_WALLET['ETH'].pubkey
                        balances['ETH'] = balanceETH
                        valueUsds['ETH'] = ""
                        coinInfo['ETH'] = ""
                    }

                }else{
                    const balanceETH = await get_balance('ETH')

                    if(balanceETH){
                        masters['ETH'] = PUBLIC_WALLET['ETH'].pubkey
                        balances['ETH'] = balanceETH
                        valueUsds['ETH'] = ""
                        coinInfo['ETH'] = ""
                    }

                    //balances
                    log.debug(tag,"PUBLIC_WALLET: ",PUBLIC_WALLET['ETH'])
                    log.debug(tag,"eth master: ",PUBLIC_WALLET['ETH'].master)
                    let ethInfo = await networks['ETH'].getBalanceTokens(PUBLIC_WALLET['ETH'].master)
                    log.debug(tag,"ethInfo: ",ethInfo)

                    //for each token use eth master
                    for(let i = 0; i < tokenData.tokens.length; i++){
                        let token:string = tokenData.tokens[i]
                        //only there if a balance
                        if(ethInfo.balances[token]){
                            balances[token] = await get_balance(token)
                            masters[token] = await get_address_master('ETH')
                            valueUsds[token] = ethInfo.valueUsds[token]
                            coinInfo[token] = ethInfo.coinInfo[token]
                        } else {
                            //nerf dont show 0 balances
                            //balances[token] = 0
                        }

                    }
                }

            }
        }catch(e){
            console.error("Failed to get ETH TOKEN balances! for account: ",PUBLIC_WALLET['ETH'], e)
        }

        valueUsds = await coincap.valuePortfolio(balances)
        log.debug(tag,"valueUsds: ",valueUsds)

        let totalUsd = valueUsds.total
        valueUsds = valueUsds.values

        let endTime = new Date().getTime()
        let duration = endTime - startTime
        log.debug(tag,"duration: ",duration)

        output.totalValueUsd = totalUsd
        output.duration = duration
        output.masters = masters
        output.txCount = txCount
        output.balances = balances
        output.valueUsds = valueUsds
        output.coinInfo = coinInfo
        output.syncStatus = syncStatus
        output.stakes = stakes
        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}



const init_wallet = async function (type:string,config:any,isTestnet:boolean) {
    let tag = TAG + " | init_wallet | "
    try {
        log.debug("Checkpoint1  ",config)
        if(isTestnet) IS_TESTNET = true

        await blockbook.init()

        //pubkeys
        PUBLIC_WALLET = config.pubkeys

        let formatted = []
        let coins = Object.keys(PUBLIC_WALLET)
        //
        for(let i = 0; i < coins.length; i++){
            let coin = coins[i]
            let pubKeyInfo = PUBLIC_WALLET[coin]
            pubKeyInfo.symbol = pubKeyInfo.coin
            if(!pubKeyInfo.script_type) throw Error("102: missing script_type")
            //pubKeyInfo.script_type = prefurredScripts[coin]
            log.debug("pubKeyInfo: ",pubKeyInfo)

            if(coin === 'BNB' || coin === 'ATOM'){
                pubKeyInfo.xpub = pubKeyInfo.master
            }
            formatted.push(pubKeyInfo)
        }


        return true
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}
