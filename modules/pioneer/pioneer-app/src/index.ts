/*
      🧭U+1F9ED

      Pioneer APP

 */

const TAG = " | pioneer-app | ";

import {
    getConfig,
    getWallet,
    getWallets,
    walletDataDir,
    pioneerConfig,
    pioneerPath,
    getApps,
    initWallet,
    innitConfig,
    updateConfig,
    getWalletPublic
} from "@pioneer-platform/pioneer-config";
import {v4 as uuidv4} from 'uuid';

const CryptoJS = require("crypto-js");
const bip39 = require(`bip39`);
const fs = require("fs-extra");
const bcrypt = require("bcryptjs");
const mkdirp = require("mkdirp");
const log = require("@pioneer-platform/loggerdog")()
const prettyjson = require('prettyjson');
const queue = require('queue')
const ethCrypto = require("@pioneer-platform/eth-crypto")
const pendingQueue = queue({ pending: [] })
const approvedQueue = queue({ approved: [] })

//dbs
// let nedb = require("@pioneer-platform/nedb")

//@pioneer-platform/pioneer-events
let Events = require("@pioneer-platform/pioneer-events")

let {
    getPaths,
    get_address_from_xpub,
    getNativeAssetForBlockchain
} = require('@pioneer-platform/pioneer-coins')

// @ts-ignore
import { Crypto } from "@peculiar/webcrypto";
import * as native from "@bithighlander/hdwallet-native";
let Pioneer = require('@pioneer-platform/pioneer')
let Network = require("@pioneer-platform/pioneer-client")

//hardware
let Hardware = require("@pioneer-platform/pioneer-hardware")

let wait = require('wait-promise');
let sleep = wait.sleep;

const ONLINE: never[] = [];
let AUTH_TOKEN: string;
let IS_LOGGED_IN = false;

let DATABASES:any = {}

let WALLET_CONTEXT = ""
let ACCOUNT = ''
let WALLET_PUBLIC:any = {}
let WALLET_PRIVATE:any = {}
let WALLET_PUBKEYS:any = []
let WALLET_PASSWORD:any = ""
let APPROVE_QUEUE:any = []
let ALL_PENDING:any = []
//
let SOCKET_CLIENT:any

//
let WALLETS_VERBOSE:any = []
let TOTAL_VALUE_USD_LOADED:number = 0
let WALLETS_LOADED: any = {}
let IS_SEALED =false
let MASTER_MAP:any = {}
let WALLET_VALUE_MAP:any = {}
let CONTEXT_WALLET_SELECTED
//urlSpec
let URL_PIONEER_SPEC = process.env['URL_PIONEER_SPEC']
let URL_PIONEER_SOCKET = process.env['URL_PIONEER_SOCKET']
// let URL_PIONEER_SPEC = process.env['URL_PIONEER_SPEC'] || 'http://127.0.0.1:9001/spec/swagger.json'
// let URL_PIONEER_SOCKET = process.env['URL_PIONEER_SOCKET'] || 'ws://127.0.0.1:9001'


let KEEPKEY:any
let network:any
//chingle
// let opts:any = {}
// var player = require('play-sound')(opts = {})

let AUTONOMOUS = false
let IS_INIT = false

import {
    UpdateInvocationBody,
    Wallet,
    CitadelWallet,
    AppConfig,
    EventsConfig,
    PioneerConfig
} from "@pioneer-platform/pioneer-types";

module.exports = {
    isInitialized: function () {
        return IS_INIT;
    },
    init: function (config: any) {
        return init_wallet(config);
    },
    initConfig: function (language: any) {
        return innitConfig(language);
    },
    context: async function () {
        if(!WALLET_CONTEXT){
            //get from remote
            if(network && network.instance){
                let output = await network.instance.User()
                if(output.data.context){
                    log.debug("Found remote context! context: ",output.data.context)
                    WALLET_CONTEXT = output.data.context
                } else {
                    //failed to get remote!
                    log.debug("failed to get remote context!",output.data)
                    let contexts = await Object.keys(WALLETS_LOADED)
                    if(contexts.length > 0){
                        WALLET_CONTEXT = contexts[0]
                        let resultUpdateContextRemote = await network.instance.SetContext(null,{context:WALLET_CONTEXT})
                        log.debug("resultUpdateContextRemote: ",resultUpdateContextRemote)
                    }
                }
            } else {
                //set to 0
                let contexts = await Object.keys(WALLETS_LOADED)
                WALLET_CONTEXT = contexts[0]
            }
        }
        return WALLET_CONTEXT;
    },
    forget: function () {
        return forget_user();
    },
    getAutonomousStatus: function () {
        return AUTONOMOUS;
    },
    autonomousOn: function () {
        AUTONOMOUS = true
        return AUTONOMOUS;
    },
    autonomousOff: function () {
        AUTONOMOUS = false
        return AUTONOMOUS;
    },
    hardwareStart: function () {
        return Hardware.start();
    },
    hardwareState: function () {
        return Hardware.state();
    },
    hardwareLocked: function () {
        return Hardware.isLocked();
    },
    hardwareInfo: function () {
        return Hardware.info();
    },
    hardwareWipe: function () {
        return Hardware.wipe();
    },
    hardwareLoad: function (mnemonic:string) {
        return Hardware.load(mnemonic);
    },
    hardwareShowPin: function () {
        return Hardware.displayPin();
    },
    hardwareEnterPin: function (pin:string) {
        return Hardware.enterPin(pin);
    },
    buildTransaction: function (transaction:any) {
        return build_transaction(transaction);
    },
    approveTransaction: function (transaction:any) {
        return approve_transaction(transaction);
    },
    broadcastTransaction: function (transaction:any) {
        return broadcast_transaction(transaction);
    },
    updateInvocation: async function (updateBody:UpdateInvocationBody) {
        return update_invocation(updateBody)
    },
    deleteInvocation: async function (invocationId:string) {
        return delete_invocation(invocationId)
    },
    getInvocation: async function (invocationId:string) {
        return get_invocation(invocationId)
    },
    getInvocations: async function (context?:string) {
        if(network && network.instance){
            let output = await network.instance.Invocations()
            return output.data;
        } else {
            log.error("Can not get invocations offline!")
            return []
        }
    },
    getConfig: function () {
        return getConfig();
    },
    updateConfig: function (params:any) {
        return updateConfig(params);
    },
    createWallet: function (type:string,wallet:Wallet) {
        return create_wallet(type,wallet);
    },
    backupWallet: function () {
        return backup_wallet();
    },
    getWallet: function () {
        return getWallet();
    },
    getWallets: function () {
        return WALLETS_LOADED;
    },
    getWalletNames: function () {
        return getWallets();
    },
    getWalletDescriptions: function () {
        return WALLETS_VERBOSE;
    },
    setContext: async function (context:string) {
        return set_context(context)
    },
    importKey: function () {
        //TODO sweep funds into HD wallet
        return true;
    },
    setPassword: function (pw: string) {
        WALLET_PASSWORD = pw;
        return true;
    },
    setAuth: function (auth: string) {
        AUTH_TOKEN = auth;
        return true;
    },
    pairKeepkey: function (wallet:any,blockchains:any) {
        return pair_keepkey(wallet,blockchains);
    },
    getAuth: function () {
        return AUTH_TOKEN;
    },
    getAccount: function () {
        return ACCOUNT;
    },
    migrateQueryKey: function () {
        return migrate_query_key();
    },
    pair: function (code:string) {
        return pair_sdk_user(code);
    },
    getUserInfo: async function () {
        let output = await network.instance.User()
        return output.data;
    },
    getUsersOnline: async function () {
        let output = await network.instance.Online()
        return output.data;
    },
    pingUser: function () {
        return [];
    },
    sendRequest: function (sender:string,receiver:string,amount:string,asset:string) {
        //TODO use invoke
        let payment_request = {
            sender,
            receiver,
            amount,
            asset
        }
        //emit
        return SOCKET_CLIENT.emit('message',payment_request);
    },
    listAppsRemote: function () {
        return list_apps_remote();
    },
    listAppsLocal: function () {
        return getApps();
    },
    registerFioUsername: async function () {
        try{
            const open = require("open");
            let pubkey = await Pioneer.getFioPubkey()
            open("https://reg.fioprotocol.io/ref/shapeshift?publicKey="+pubkey)
            return true;
        }catch(e){
            log.error(e)
        }
    },
    exportWallet: function (context:string,format:string) {
        return export_wallet(context, format);
    },
    getCoins: function () {
        return ONLINE;
    },
    sendToAddress: function (intent:any) {
      return send_to_address(intent);
    },
};

let migrate_query_key = function () {
    let tag = " | migrate_query_key | ";
    try {
        //save current key into /old
        let currentConfig = getConfig();
        let oldKeys = currentConfig.old || []
        oldKeys.push(currentConfig.queryKey)
        updateConfig({old:oldKeys})

        //generate new key
        let newKey = uuidv4();
        //save to config
        updateConfig({queryKey:newKey})

        let newConfig = getConfig()

        return newConfig
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let forget_user = async function () {
    let tag = " | forget_user | ";
    try {
        let output = []
        //for each wallet
        let contexts = await Object.keys(WALLETS_LOADED)
        for(let i = 0; i < contexts.length; i++){
            let context = contexts[i]
            let result = await WALLETS_LOADED[context].forget()
            output.push(result)
        }
        return output
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let delete_invocation = async function (invocationId:string) {
    let tag = " | delete_invocation | ";
    try {
        let output = await network.instance.DeleteInvocation(null,{invocationId})
        return output.data;
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let get_invocation = async function (invocationId:any) {
    let tag = " | get_invocation | ";
    try {
        //TODO if local? get from cache?
        let output = await network.instance.Invocation(invocationId)
        return output.data;
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let build_transaction = async function (transaction:any) {
    let tag = " | build_transaction | ";
    try {
        log.debug(tag,"transaction: ",transaction)
        if(!transaction.invocationId) throw Error("invocationId required!")
        //get invocation

        //TODO validate type and fields

        let invocation = await get_invocation(transaction.invocationId)
        log.debug(tag,"invocation: ",invocation)

        if(!invocation.type) invocation.type = invocation.invocation.type

        let context
        if(!transaction.context){
            context = WALLET_CONTEXT
        } else {
            context = transaction.context
        }
        if(!context || !WALLETS_LOADED[context]) {
            log.error("context: ",context)
            log.error("Available: ",WALLETS_LOADED)
            throw Error("103: could not find context in WALLETS_LOADED! "+context)
        }
        let walletContext = WALLETS_LOADED[context]
        if(!walletContext.context){
            walletContext.context = walletContext.context
        }
        if(!walletContext.context) throw Error("Invalid wallet! missing context!")
        log.debug(tag,"walletContext: ",walletContext.context)

        let unsignedTx
        switch(invocation.type) {
            case 'osmosislpadd':
            case 'osmosisswap':
            case 'redelegate':
            case 'undelegate':
            case 'ibcdeposit':
            case 'delegate':
                log.debug(" **** BUILD delegate ****  invocation: ",invocation.invocation)

                //TODO validate transfer object
                unsignedTx = await walletContext.buildTx(invocation.invocation)
                unsignedTx.invocation = invocation.invocation
                log.debug(" **** RESULT buildTransfer ****  unsignedTx: ",unsignedTx)

                break
            case 'transfer':
                log.debug(" **** BUILD transfer ****  invocation: ",invocation.invocation)

                //TODO validate transfer object
                unsignedTx = await walletContext.buildTransfer(invocation.invocation)
                unsignedTx.invocation = invocation.invocation
                log.debug(" **** RESULT buildTransfer ****  unsignedTx: ",unsignedTx)

                break
            case 'approve':
                log.debug(" **** BUILD Approval ****  invocation: ",invocation.invocation)
                unsignedTx = await walletContext.buildApproval(invocation.invocation)
                unsignedTx.invocation = invocation.invocation
                log.debug(" **** RESULT buildApproval ****  approvalUnSigned: ",unsignedTx)
                break
            case 'swap':
                log.debug(" **** BUILD SWAP ****  invocation: ",invocation.invocation)
                unsignedTx = await walletContext.buildSwap(invocation.invocation)
                unsignedTx.invocation = invocation.invocation
                log.debug(" **** RESULT buildSwap ****  swapUnSigned: ",unsignedTx)
                break
            default:
                console.error("APP Unhandled type: ",invocation.type)
                console.error("Unhandled: ",invocation)
                throw Error("Unhandled type: "+invocation.type)
        }

        //update invocation
        let invocationId = invocation.invocationId
        let updateBody = {
            invocationId,
            invocation,
            unsignedTx
        }

        //update invocation remote
        let resultUpdate = await update_invocation(updateBody)
        log.debug(tag,"resultUpdate: ",resultUpdate)

        return unsignedTx
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let broadcast_transaction = async function (transaction:any) {
    let tag = " | broadcast_transaction | ";
    try {
        //get invocation

        let invocation = await get_invocation(transaction.invocationId)
        log.debug(tag,"invocation: ",invocation)

        //signedTx
        if(!invocation.signedTx) throw Error("102: Unable to broadcast transaction! signedTx not found!")

        //context
        let context
        if(!transaction.context){
            context = WALLET_CONTEXT
        } else {
            context = transaction.context
        }

        if(!context || Object.keys(WALLETS_LOADED).indexOf(context) < 0) {
            log.error("context: ",context)
            log.error("Available: ",Object.keys(WALLETS_LOADED))
            throw Error("103: could not find context in WALLETS_LOADED! "+context)
        }
        let walletContext = WALLETS_LOADED[context]
        if(!walletContext.context){
            walletContext.context = walletContext.context
        }
        if(!walletContext.context) throw Error("Invalid wallet! missing context!")
        log.debug(tag,"walletContext: ",walletContext.context)

        //TODO fix tech debt
        //normalize
        if(!invocation.invocation.invocationId) invocation.invocation.invocationId = invocation.invocationId

        //override noBroadcast
        if(invocation.signedTx && invocation.signedTx.noBroadcast) invocation.signedTx.noBroadcast = false

        let broadcastResult = await walletContext.broadcastTransaction(invocation.invocation.coin,invocation.signedTx)

        let updateBody = {
            invocationId:invocation.invocation.invocationId,
            invocation:invocation.invocation,
            unsignedTx:invocation.unsignedTx,
            signedTx:invocation.signedTx,
            broadcastResult
        }
        log.debug(tag,"updateBody: ",updateBody)
        //update invocation remote
        let resultUpdate = await update_invocation(updateBody)
        log.debug(tag,"resultUpdate: ",resultUpdate)


        return broadcastResult
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let update_invocation = async function (updateBody:any) {
    let tag = " | set_context | ";
    try {
            let output = await network.instance.UpdateInvocation(null,updateBody)
            return output.data;
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};


let set_context = async function (context:string) {
    let tag = " | set_context | ";
    try {

        log.debug("context: ",context)
        if(context && WALLETS_LOADED[context]){
            //does it match current
            if(context !== WALLET_CONTEXT){
                WALLET_CONTEXT = context
            }
            network.instance.SetContext(null,{context})
        } else {
            log.error("WALLETS_LOADED: ",WALLETS_LOADED)
            throw Error("invalid wallet context! context: "+context)
        }

        return true
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

/*

    approve_transaction

    Notes:
        Source:
        Dapp:
        amountUSD known:
        expected Fee in USD:

 */

let approve_transaction = async function (transaction:any) {
    let tag = " | approve_transaction | ";
    try {
        log.debug(tag,"transaction: ",transaction)
        //get invocation
        if(!transaction) throw Error("101: invocation required!")
        if(!transaction.invocationId) throw Error("102: invocationId required!")

        let invocation = await get_invocation(transaction.invocationId)
        log.debug(tag,"invocation: ",invocation)
        if(!invocation.unsignedTx) throw Error("invalid invocation! missing unsignedTx")
        if(!invocation.unsignedTx.HDwalletPayload) throw Error("invalid invocation! invalid unsignedTx missing HDwalletPayload")

        let context = WALLET_CONTEXT

        if(!context || Object.keys(WALLETS_LOADED).indexOf(context) < 0) {
            log.error("context: ",context)
            log.error("Available: ",Object.keys(WALLETS_LOADED))
            throw Error("103: could not find context in WALLETS_LOADED! "+context)
        }
        let walletContext = WALLETS_LOADED[context]
        if(!walletContext.context){
            walletContext.context = walletContext.context
        }
        if(!walletContext.context) throw Error("Invalid wallet! missing context!")
        log.debug(tag,"walletContext: ",walletContext.context)

        //TODO kill the coin! field
        //invocation.unsignedTx.HDwalletPayload.coin = invocation.invocation.coin
        //get
        //if(invocation.unsignedTx.HDwalletPayload.coin === 'BitcoinCash') invocation.unsignedTx.HDwalletPayload.coin = 'BCH'

        //unsinged TX
        log.debug(tag,"invocation.unsignedTx: ",JSON.stringify(invocation.unsignedTx))
        let signedTx = await walletContext.signTransaction(invocation.unsignedTx)
        log.debug(tag,"invocation.signedTx: ",JSON.stringify(signedTx))

        //update invocation
        let updateBody = {
            invocationId:transaction.invocationId,
            invocation,
            unsignedTx:invocation.unsignedTx,
            signedTx
        }

        //update invocation remote
        let resultUpdate = await update_invocation(updateBody)
        log.debug(tag,"resultUpdate: ",resultUpdate)

        return signedTx
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};


let pair_sdk_user = async function (code:string) {
    let tag = " | pair_sdk_user | ";
    try {
        log.debug(tag,"code: ",code)
        //send code

        log.debug(tag,"network: ",network)
        log.debug(tag,"network: ",network.instance)
        let result = await network.instance.Pair(null,{code})

        return result.data
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let pair_keepkey = async function (keepkeyWallet:any,blockchains:any) {
    let tag = " | pair_keepkey | ";
    try {

        log.debug(tag, "config: ", keepkeyWallet)
        let deviceId = keepkeyWallet.features.deviceId

        //get config
        let config = getConfig()
        log.debug(tag, "config: ", config)

        if(!config || Object.keys(config).length === 0){
            await innitConfig("english");
            config = getConfig()
        }

        //enable hardware
        let paired = config.paired
        if(!paired) paired = []
        if(paired.indexOf(deviceId) === -1){
            paired.push(deviceId)
            updateConfig({paired});
        }

        //verify pubkeys
        log.debug(tag,"pubkeys: ",keepkeyWallet.pubkeys)
        for(let i = 0; i < blockchains.length; i++){
            let blockchain = blockchains[i]
            let symbol = getNativeAssetForBlockchain(blockchain)
            log.debug(tag,"symbol: ",symbol)
            //find in pubkeys
            let isFound = keepkeyWallet.pubkeys.find((path: { blockchain: string; }) => {
                return path.blockchain === blockchain
            })
            if(!isFound){
                throw Error("Failed to find path for blockchain: "+blockchain)
            }
            //verify master
        }

        //use as ID
        keepkeyWallet.deviceId = deviceId
        //createWallet
        await create_wallet('hardware',keepkeyWallet)
        return true
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let list_apps_remote = async function () {
    let tag = " | list_apps | ";
    try {

        let appList = await network.apps()
        return appList;
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let export_wallet = async function (context:string,format:string) {
    let tag = " | export_wallet | ";
    try {
        let output

        if(format === 'citadel' || format === 'keepkey'){
            //if(!outDir) outDir = pioneerPath
            let outDir = pioneerPath
            let isCreated = await mkdirp(outDir);
            log.debug("create path: ",isCreated)
            //verify path

            //load seed

            //build wallet
            log.debug(tag,"WALLET_PUBLIC: ",WALLET_PUBLIC)
            log.debug(tag,"WALLET_PRIVATE: ",WALLET_PRIVATE)

            if(Object.keys(WALLET_PUBLIC).length === 0) throw Error("102: Failed to find WALLET_PUBLIC")
            if(Object.keys(WALLET_PUBLIC).length === 0) throw Error("103: Failed to find WALLET_PRIVATE")

            let walletInfo = {
                WALLET_ID:context,
                TYPE:'full',
                CREATED: new Date().getTime(),
                VERSION:"0.1.3",
                WALLET_PUBLIC,
                WALLET_PRIVATE,
                WALLET_PUBKEYS
            }

            let walletInfoPub = {
                WALLET_ID:context,
                TYPE:'watch',
                CREATED: new Date().getTime(),
                VERSION:"0.1.3",
                WALLET_PUBLIC,
                WALLET_PUBKEYS
            }

            //write to foxpath, name wallet context
            let writePathPub = outDir+"/"+context+".watch.wallet.json"
            log.debug(tag,"writePathPub: ",writePathPub)
            let writeSuccessPub = fs.writeFileSync(writePathPub, JSON.stringify(walletInfoPub));

            //for each coin
            let coins = Object.keys(walletInfo.WALLET_PUBLIC)

            let configFileEnv = ""
            configFileEnv = configFileEnv + "WALLET_ID="+walletInfo.WALLET_ID + "\n"
            configFileEnv = configFileEnv + "TYPE="+walletInfo.TYPE + "\n"
            configFileEnv = configFileEnv + "VERSION="+walletInfo.VERSION + "\n"

            //write .env //TODO depricated
            for(let i = 0; i < coins.length; i++){
                let coin = coins[i]
                log.debug(tag,"coin: ",coin)

                let keypairInfo = WALLET_PUBLIC[coin]
                log.debug(tag,"keypairInfo: ",keypairInfo)

                //if(coin === 'EOS'){}

                //if eth
                configFileEnv = configFileEnv + "WALLET_"+coin+"_MASTER="+keypairInfo.master + "\n"

                //if type xpub
                if(keypairInfo.type === 'xpub'){
                    configFileEnv = configFileEnv + "WALLET_"+coin+"_XPUB="+keypairInfo.xpub+ "\n"
                }
            }


            log.debug(tag,"configFileEnv: ",configFileEnv)
            //write to foxpath, name wallet context
            let writePathEnv = outDir+"/"+context+".env"
            log.debug(tag,"writePath: ",writePathEnv)
            let writeSuccessEnv = fs.writeFileSync(writePathEnv, configFileEnv);
            log.debug(tag,"writeSuccessEnv: ",writeSuccessEnv)

            //backupWallet(outDir,hash,seed_encrypted,context)
        }else{
            //
            throw Error("format not supported "+format)
        }

        return output;
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let app_to_queue = async function (invocation:any) {
    let tag = " | app_to_queue | ";
    try {
        if(!invocation.invocationId) throw Error("102: invalid intent missing invocationId!")
        if(!invocation.type) throw Error("102: invalid intent missing type!")
        //if(!invocation.address) throw Error("102: invalid intent missing address!")
        //if(!invocation.coin) throw Error("102: invalid intent missing coin!")
        if(!invocation.amount) throw Error("102: invalid intent missing amount!")
        log.debug(tag,"invocation: ",invocation)
        invocation.addressTo = invocation.address

        log.debug(tag,"Building TX on context: ",WALLET_CONTEXT)
        if(!invocation.context) invocation.context = invocation.context
        //TODO check remote context match's local

        //add to queue
        let resultAdd = await WALLETS_LOADED[WALLET_CONTEXT].addUnsigned(invocation)
        log.debug(tag,"resultAdd: ",resultAdd)

        //verify added
        let resultNewQueue = await WALLETS_LOADED[WALLET_CONTEXT].getApproveQueue()
        log.debug(tag,"resultNewQueue: ",resultNewQueue)

        let output = {
            invocationId:invocation.invocationId,
            invocation,
            queue:resultNewQueue,
        }
        return output
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let send_to_address = async function (intent:any) {
    let tag = " | send_to_address | ";
    try {
        if(!intent.address) throw Error("102: invalid intent missing address!")
        if(!intent.coin) throw Error("102: invalid intent missing coin!")
        if(!intent.amount) throw Error("102: invalid intent missing amount!")
        log.debug(tag,"params: ",intent)
        intent.addressTo = intent.address

        log.debug(tag,"Building TX on context: ",WALLET_CONTEXT)
        if(!intent.context) intent.context = intent.context
        //TODO check remote context match's local

        //build tx add to approve queue
        let unsignedTx = await WALLETS_LOADED[WALLET_CONTEXT].sendToAddress(intent)
        log.debug(tag,"unsignedTx: ",unsignedTx)

        log.debug(tag,"WALLET_CONTEXT: ",WALLET_CONTEXT)

        //push unsigned to invocation
        let updateInno = {
            invocationId:intent.invocationId,
            invocation:intent,
            unsignedTx
        }
        //log.debug(tag,"Network.instance: ",network.instance)
        let resultUpdateInvocation = await network.instance.UpdateInvocation(null,updateInno)
        log.debug(tag,"resultUpdateInvocation: ",resultUpdateInvocation.data)

        //add to queue
        let resultAdd = await WALLETS_LOADED[WALLET_CONTEXT].addUnsigned(unsignedTx)
        log.debug(tag,"resultAdd: ",resultAdd)

        //verify added
        let resultNewQueue = await WALLETS_LOADED[WALLET_CONTEXT].getApproveQueue()
        log.debug(tag,"resultNewQueue: ",resultNewQueue)

        return unsignedTx
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};

let backup_wallet = async function () {
    let tag = " | backup_wallet | ";
    try {
        //TODO validate seed

        //does wallet already exist?
        const wallet = await getWallet()
        if(!wallet) throw Error("Wallet not found!")

        //save wallet in new dir
        let time = new Date().getTime()

        let filename = "backup:"+time
        let passwordHash = wallet.password
        let encryptedSeed = wallet.vault

        //
        //TODO fixme
        //let success = await backupWallet("backup",passwordHash ,encryptedSeed, filename)

        // let success = sa


        //return success;
    } catch (e) {
        if(e.response && e.response.data){
            log.error(tag, "Error: ", e.response.data);
        }else{
            log.error(tag, "Error: ", e);
        }
        throw e;
    }
};

let create_wallet = async function (type:string,wallet:any,isTestnet?:boolean) {
    let tag = " | create_wallet | ";
    try {
        if(!isTestnet) isTestnet = false
        let output = false
        //if software
        switch(type){
            case "software":
                //TODO validate seed
                if(!wallet.mnemonic) throw Error("101: mnemonic required!")
                if(!wallet.password) throw Error("102: password required!")
                if(!wallet.masterAddress) throw Error("103: masterAddress required!")

                //filename
                let filename = wallet.masterAddress+".wallet.json"
                log.debug(tag,"filename: ",filename)
                //does wallet exist
                let alreadyExists = getWallet(filename)
                log.debug(tag,"alreadyExists: ",alreadyExists)

                //pw hash
                const hash = bcrypt.hashSync(wallet.password, 10);

                //if doesnt exist write file
                if(!alreadyExists){
                    // @ts-ignore
                    globalThis.crypto = new Crypto();
                    // @ts-ignore
                    const engine = new native.crypto.engines.WebCryptoEngine();
                    // @ts-ignore
                    const walletCrypto = new native.crypto.EncryptedWallet(engine);
                    const result = await walletCrypto.init('placeholder', wallet.password);
                    await walletCrypto.createWallet(wallet.mnemonic);
                    let seed_encrypted = result.encryptedWallet

                    //
                    log.debug(tag, "seed_encrypted: ", seed_encrypted);
                    log.debug(tag, "hash: ", hash);

                    let walletNew:CitadelWallet = {
                        isTestnet,
                        masterAddress:wallet.masterAddress,
                        TYPE:"citadel",
                        seed_encrypted,
                        hash,
                        filename
                    }
                    if(wallet.temp) walletNew.temp = wallet.temp

                    await initWallet(walletNew);
                    //TODO verify exists?
                    output = true
                } else {
                    throw Error("already exists")
                    //TODO verify?
                    //createWallet
                }
                break
            case "hardware":
                log.debug(tag,"wallet hardware: ",wallet)
                if(!wallet.deviceId) throw Error("102: deviceId require for keepkey wallets!")
                if(!wallet.wallet.WALLET_PUBLIC) throw Error("103: WALLET_PUBLIC require for keepkey wallets!")

                log.debug("hardware watch create!")
                let walletFileNew:any = {
                    isTestnet,
                    features:wallet.features,
                    WALLET_ID:"keepkey:"+wallet.deviceId,
                    TYPE:'keepkey',
                    CREATED: new Date().getTime(),
                    VERSION:"0.1.3",
                    WALLET_PUBLIC:wallet.wallet.WALLET_PUBLIC,
                    WALLET_PUBKEYS:wallet.pubkeys
                }
                walletFileNew.pubkeys = wallet.pubkeys
                walletFileNew.KEEPKEY = true
                walletFileNew.DEVICE_ID = wallet.deviceId
                walletFileNew.LABEL = wallet.label
                walletFileNew.deviceId = wallet.deviceId
                walletFileNew.filename = wallet.deviceId + ".wallet.json"
                await initWallet(walletFileNew);
                //TODO verify exists?
                output = true
                break
            default:
                throw Error("unhandled wallet type! "+type)
                break

        }
        return output
    } catch (e) {
        if(e.response && e.response.data){
            log.error(tag, "Error: ", e.response.data);
        }else{
            log.error(tag, "Error: ", e);
        }
        throw e;
    }
};

let init_wallet = async function (config:AppConfig) {
    let tag = TAG+" | init_wallet | ";
    try {
        if(IS_INIT) throw Error("App already initialized!")
        log.debug(tag,"config: ",config)
        if(!config.pioneerApi){
            config.spec = 'offline'
            config.wss = 'offline'
        }
        if(!config.spec) throw Error("100: invalid config! missing pioneer server!")
        if(!config.wss) throw Error("100a: invalid config! missing pioneer wss!")
        URL_PIONEER_SPEC = config.spec
        URL_PIONEER_SOCKET = config.wss
        if(!config.username) throw Error("102: username required!")
        if(!config.queryKey) throw Error("103: queryKey required!")

        let output:any = {}
        log.debug(tag,"config: ",config)
        //get wallets
        let walletFiles = await getWallets()
        log.debug(tag,"walletFiles: ",walletFiles)
        let walletDescriptions:any = []
        //TODO if testnet flag only show testnet wallets!

        //TODO get public wallets from wallet_data dir
            //if missing generate

        if(config.pioneerApi){
            network = new Network(URL_PIONEER_SPEC,{
                queryKey:config.queryKey
            })
            network = await network.init()

            //get remote has more wallets
            let userInfoRemote = await network.instance.User()
            userInfoRemote = userInfoRemote.data
            log.debug(tag,"userInfoRemote: ",userInfoRemote)
            //check if username matches config
            //if doesnt, create new apiKey
            if(userInfoRemote.success && userInfoRemote.username !== config.username){
                log.debug(tag,"Migrating API key!")
                //migrate
                config = migrate_query_key()
                // throw Error("103: queryKey migration! restart application")

                //migrate
                network = new Network(URL_PIONEER_SPEC,{
                    queryKey:config.queryKey
                })
                network = await network.init()
            }
            //sync wallets
            if(userInfoRemote.wallets){
                for(let i = 0; i < userInfoRemote.wallets; i++){
                    let walletRemote = userInfoRemote[i]
                    //if found in local
                    let match = walletFiles.filter((e: any) => e === walletRemote)
                    if(match[0]){
                        log.debug(tag,"Found remote wallet locally! wallet: ",walletRemote)
                        let walletDescription = {
                            name:walletRemote,
                            remote:true,
                            local:true,
                            status:'online'
                        }
                        walletDescriptions.push(walletDescription)
                    } else {
                        log.debug(tag,"Remote wallet NOT found localy: ",walletRemote)
                        //push it anyway
                        walletFiles.push(walletRemote)
                        //mark it offline
                        output.offline(walletRemote)
                        //remote wallet not found locally
                        //else mark offline
                    }
                }
            }else{
                log.debug(tag,'new user detected!')
            }
            log.debug(tag,"Checkpoint0: status remote wallets: output: ",output)
            //note, if local has more wallets then remote, its ok, we register them below!
        }




        //if missing, mark "offline" add
        output.offline = []
        output.walletFiles = walletFiles
        output.wallets = []

        //get wallets remote

        //if diff mark missing wallets
        //if context not loaded change context


        if(!walletFiles){
            throw Error(" No wallets found! ")
        }

        if(config.hardware){
            log.debug(tag,"Hardware enabled!")
            //start
            KEEPKEY = await Hardware.start()
            KEEPKEY.events.on('event', async function(event:any) {
                //events.emit('keepkey',{event})
            });

        }

        if(!config.blockchains){
            //no more missing coins bs
            throw Error("Must specify blockchain configuration!")
        }


        //Load wallets if setup
        for(let i = 0; i < walletFiles.length; i++){
            let context = walletFiles[i]
            //if !offline aka, online!
            log.debug(tag,"output.offline: ",output.offline)
            if(output.offline.indexOf(context) < 0){
                log.debug(tag,"wallet is online! ",context)

                log.debug(tag,"context: ",context)
                let walletFile = getWallet(context)
                log.debug(tag,"walletFile: ",walletFile)
                if(!walletFile.TYPE) walletFile.TYPE = walletFile.type
                if(walletFile.TYPE === 'keepkey'){
                    if(!KEEPKEY){
                        //start
                        KEEPKEY = await Hardware.start()

                        KEEPKEY.events.on('event', async function(event:any) {
                            //TODO keepkey events?
                            //events.emit('keepkey',{event})
                        });
                    }
                    if(!KEEPKEY.features) throw Error("102: failed to pair keepkey! features")
                    if(!KEEPKEY.features.deviceId) throw Error("103: failed to pair keepkey! deviceId")
                    if(!output.devices) output.devices = []
                    log.debug(tag,"Loading keepkey wallet! ")

                    if(!walletFile.pubkeys) throw Error("102: invalid keepkey wallet!")
                    //if(!walletFile.wallet) throw Error("103: invalid keepkey wallet!")

                    //if wallet paths custom load
                    log.debug(tag,"context: ",context)
                    let fileNameWatch = context.replace(".wallet.json",".watch.wallet.json")
                    let watchWallet = getWalletPublic(fileNameWatch)
                    let walletPaths
                    if(watchWallet){
                        walletPaths = watchWallet.paths
                    } else {
                        log.debug(tag,"walletFile: ",walletFile)
                    }
                    //get device info from walletFile
                    if(!walletFile.features) throw Error("Invalid wallet file missing device features!")
                    output.devices.push(walletFile.features)

                    //load
                    let configPioneer:PioneerConfig = {
                        hardware:true,
                        vendor:"keepkey",
                        blockchains:config.blockchains,
                        pubkeys:walletFile.pubkeys,
                        wallet:walletFile,
                        context,
                        walletDescription:{
                            context:context,
                            type:walletFile.TYPE
                        },
                        username:config.username,
                        pioneerApi:true,
                        spec:config.spec,
                        wss:config.wss,
                        queryKey:config.queryKey
                    }
                    log.debug(tag,"KEEPKEY init config: ",configPioneer)
                    let wallet = new Pioneer('keepkey',configPioneer);
                    //init
                    if(!KEEPKEY) throw Error("Can not start hardware wallet without global KEEPKEY")
                    let walletInfo = await wallet.init(KEEPKEY)

                    //TODO handle errors
                    //username already taken?
                        //kick back to user
                    //querykey already registered
                        //rotate queryKey

                    log.debug(tag,"walletInfo: ",walletInfo)
                    WALLETS_LOADED[context] = wallet

                    //info
                    let info = await wallet.getInfo(context)
                    info.name = walletFile.username
                    info.type = 'keepkey'
                    output.wallets.push(info)
                    log.debug(tag,"info: ",info)

                    //validate at least 1 pubkey per enabled blockchain
                    let pubkeyNetworks =  new Set()
                    for(let i = 0; i < info.pubkeys.length; i++){
                        let pubkey = info.pubkeys[i]
                        pubkeyNetworks.add(pubkey.coin)
                    }
                    log.debug(tag,"pubkeyNetworks: ",pubkeyNetworks)

                    //TODO iterate over blockchains config and verify

                    //else register individual pubkeys until complete

                    //TODO write pubkeys
                    // let writePathPub = pioneerPath+"/"+info.name+".watch.wallet.json"
                    // log.debug(tag,"writePathPub: ",writePathPub)
                    // let writeSuccessPub = fs.writeFileSync(writePathPub, JSON.stringify(info.public));
                    // log.debug(tag,"writeSuccessPub: ",writeSuccessPub)

                    //add wallet info
                    let walletInfoVerbose = {
                        context:context,
                        type:walletFile.TYPE,
                        totalValueUsd:info.totalValueUsd
                    }
                    WALLETS_VERBOSE.push(walletInfoVerbose)

                    //global total valueUSD
                    TOTAL_VALUE_USD_LOADED = TOTAL_VALUE_USD_LOADED + info.totalValueUsd
                    WALLET_VALUE_MAP[context] = info.totalValueUsd
                }else if(walletFile.TYPE === 'seedwords'){
                    //decrypt
                    // @ts-ignore
                    globalThis.crypto = new Crypto();
                    // @ts-ignore
                    const engine = new native.crypto.engines.WebCryptoEngine();
                    // @ts-ignore
                    const walletCrypto = new native.crypto.EncryptedWallet(engine);

                    //if wallet has pw, use it
                    let password
                    if(walletFile.password) {
                        log.debug(tag,"Password in wallet file, using password")
                        password = walletFile.password
                    }
                    //password ovrrides temp
                    if(!password && config.password){
                        log.debug(tag,"Password in config file, using password")
                        password = config.password
                    }
                    if(!password && config.temp){
                        log.debug(tag,"Password in config temp file, using password")
                        password = config.temp
                    }
                    if(!password) {
                        log.error(tag,"invalid config! config: ",config)
                        throw Error("unable to find a Password!")
                    }
                    const resultOut = await walletCrypto.init('placeholder', password, walletFile.vault);
                    if(!walletFile.vault) throw Error("Wallet vault not found! ")

                    let mnemonic = await resultOut.decrypt()

                    //Load public wallet file
                    //Loads wallet state and custom pathing
                    log.debug(tag,"context: ",context)
                    let fileNameWatch = context.replace(".wallet.json",".watch.wallet.json")
                    let watchWallet = getWalletPublic(fileNameWatch)
                    let walletPaths
                    if(watchWallet){
                        walletPaths = watchWallet.paths
                    }

                    //TODO validate seed
                    if(!mnemonic) throw Error("unable to start wallet! invalid seed!")
                    // log.debug(tag,"mnemonic: ",mnemonic)
                    //load wallet to global
                    let configPioneer:PioneerConfig = {
                        mnemonic,
                        context,
                        walletDescription:{
                            context,
                            type:walletFile.TYPE
                        },
                        blockchains:config.blockchains,
                        username:config.username,
                        pioneerApi:config.pioneerApi,
                        spec:config.spec,
                        wss:config.wss,
                        queryKey:config.queryKey,
                        password:config.temp || config.password
                    }
                    if(walletPaths) configPioneer.paths = walletPaths

                    log.debug(tag,"creating wallet with config (pioneer): ",configPioneer)
                    let wallet = new Pioneer('pioneer',configPioneer);
                    //init
                    let walletClient = await wallet.init()

                    //get address, verify it is correct in hdwallet
                    let walletEthVerify = await ethCrypto.generateWalletFromSeed(mnemonic)
                    let masterEthMenomic = walletEthVerify.masterAddress
                    let masterEthHdWallet = await wallet.getMaster('ETH')
                    masterEthHdWallet = masterEthHdWallet.toLowerCase()
                    log.debug(tag,"masterEthMenomic: ",masterEthMenomic)
                    log.debug(tag,"masterEthHdWallet: ",masterEthHdWallet)
                    if(masterEthMenomic !== masterEthHdWallet) throw Error("HDwallet wallet loaded invalid!")

                    //load
                    WALLETS_LOADED[context] = wallet

                    let info = await wallet.getInfo(context)
                    log.debug(tag,"INFO: ",info)
                    if(!info.pubkeys) throw Error(" invalid wallet info returned! missing pubkeys!")
                    if(!info.masters) throw Error(" invalid wallet info returned! missing masters!")

                    info.name = walletFile.username
                    info.type = 'software'
                    output.wallets.push(info)
                    log.debug(tag,"info: ",info)

                    let pubkeyNetworks =  new Set()
                    for(let i = 0; i < info.pubkeys.length; i++){
                        let pubkey = info.pubkeys[i]
                        pubkeyNetworks.add(pubkey.coin)
                    }
                    log.debug(tag,"pubkeyNetworks: ",pubkeyNetworks)

                    let walletInfoPub = {
                        WALLET_ID:walletFile.username,
                        TYPE:'watch',
                        CREATED: new Date().getTime(),
                        VERSION:"0.1.4",
                        WALLET_PUBLIC:info.public,
                        WALLET_PUBKEYS:info.pubkeys
                    }

                    let writePathPub = walletDataDir+"/"+fileNameWatch
                    log.debug(tag,"writePathPub: ",writePathPub)
                    let writeSuccessPub = fs.writeFileSync(writePathPub, JSON.stringify(walletInfoPub));
                    log.debug(tag,"writeSuccessPub: ",writeSuccessPub)

                    //add wallet info
                    let walletInfoVerbose = {
                        context,
                        type:walletFile.TYPE,
                        totalValueUsd:info.totalValueUsd
                    }
                    WALLETS_VERBOSE.push(walletInfoVerbose)
                    //
                    log.debug(tag,"info: ",info)

                    //global total valueUSD
                    TOTAL_VALUE_USD_LOADED = TOTAL_VALUE_USD_LOADED + info.totalValueUsd
                    WALLET_VALUE_MAP[context] = info.totalValueUsd

                }else{
                    throw Error("unhandled wallet type! "+walletFile.TYPE)
                }
            } else {
                log.debug(tag,"wallet is offline!")
            }
        }
        output.TOTAL_VALUE_USD_LOADED = TOTAL_VALUE_USD_LOADED
        output.WALLET_VALUE_MAP = WALLET_VALUE_MAP
        log.debug(tag,"TOTAL_VALUE_USD_LOADED: ",TOTAL_VALUE_USD_LOADED)

        //get remote user info
        if(network && network.instance){
            log.debug(tag,"checkpoint getting user from network!")
            let userInfo = await network.instance.User()
            userInfo = userInfo.data
            log.debug(tag,"userInfo: ",userInfo)
            if(!userInfo.context) {
                if(walletFiles.length === 0){
                    throw Error("You must first create/pair a wallet to use app!")
                } else {
                    //no context found remote
                    //setting a context from 0
                    log.debug(tag,"offline: ",output.offline)
                    for(let i = 0; i < walletFiles.length; i++){
                        let walletFile = walletFiles[i]
                        if(output.offline.indexOf(walletFile) >= 0){
                            log.debug(tag,"wallet is offline: ",walletFile)
                        } else {
                            log.debug(tag,"Setting New Context newContext: ",walletFile)
                            let resultUpdateContext = await network.instance.SetContext(null,{context:walletFile})
                            resultUpdateContext = resultUpdateContext.data
                            log.debug(tag,"resultUpdateContext: ",resultUpdateContext)
                            WALLET_CONTEXT = walletFile
                            output.context = WALLET_CONTEXT
                        }
                    }
                }
            }
            if(walletFiles.indexOf(userInfo.context) >= 0){
                log.debug(tag,"userInfo: ",userInfo)
                log.debug(tag,"context: ",userInfo.context)
                WALLET_CONTEXT = userInfo.context
                output.context = WALLET_CONTEXT
            } else {
                log.debug(tag,"remote context NOT in loaded wallet")
                //set remote context to position0 local
                log.debug(tag,"contexts: ",walletFiles)
                log.debug(tag,"Position 0 context: ",walletFiles[0])
                //
                set_context(walletFiles[0])
                WALLET_CONTEXT = walletFiles[0]
            }
        } else {
            log.debug(tag,"checkpoint using position 0 for context")
            //set_context(walletFiles[0])
            WALLET_CONTEXT = walletFiles[0]
        }

        //after registered start socket
        //sub all to events
        if(!config.username) throw Error("102: config.username not set!")
        if(!config.queryKey) throw Error("103: config.queryKey not set!")

        let configEvents:EventsConfig = {
            username:config.username,
            queryKey:config.queryKey,
            wss:config.wss
        }

        //sub ALL events
        if(config.pioneerApi){
            let clientEvents = new Events.Events(configEvents)
            await clientEvents.init()
            await clientEvents.subscribeToKey()
            await clientEvents.pair()
            //on blocks update lastBlockHeight

            //on payments update balances

            //on on invocations add to queue
            clientEvents.events.on('message', async (request: any) => {
                log.debug(tag,"**** message: ", request)
                //TODO filter invocations by subscribers

                //TODO autonomousOn/Off

                //TODO verify auth to paired keys

                //TODO filter by preferences
                //if swaps allowed (no transfers)
                //verify swap to wallet

                //if transfer / whitelist rules

                //if swap

                //if transfer

                //if liquidity event
                //add/withdrawal

                let unsignedTx
                let context
                let invokeQueue
                let invocationId
                let resultUpdate
                let updateBody

                // switch(request.type) {
                //     //custom txs fio/tendermint
                //     case 'osmosislpadd':
                //     case 'osmosisswap':
                //     case 'redelegate':
                //     case 'undelegate':
                //     case 'ibcdeposit':
                //     case 'delegate':
                //         //thorchain deposit (native RUNE inputs to swaps)
                //         if(!request.invocation) throw Error("103: invalid invocation! missing invocation!")
                //         if(!request.invocationId) throw Error("102: invalid invocation! missing id!")
                //         request.invocation.invocationId = request.invocationId
                //
                //         if(request.invocation.context) context = request.invocation.context
                //         if(!context) context = WALLET_CONTEXT
                //         if(!WALLETS_LOADED[context]) {
                //             log.error(tag,"WALLETS_LOADED: ",WALLETS_LOADED)
                //             log.error(tag,"context: ",context)
                //             throw Error("Unable to build transaction! context not found!")
                //         }
                //         log.debug(tag,"Building transaction with context: ",context)
                //         log.debug(tag,"invocation: ",request.invocation)
                //         //TODO validate tx object to type delegate
                //         unsignedTx = await WALLETS_LOADED[context].buildTx(request.invocation)
                //         log.debug(tag,"txid: ", unsignedTx.txid)
                //         log.debug(tag,"unsignedTx: ", unsignedTx)
                //
                //         //update invocation
                //         invocationId = request.invocation.invocationId
                //         unsignedTx.invocationId = invocationId
                //         updateBody = {
                //             invocationId,
                //             invocation:request.invocation,
                //             unsignedTx
                //         }
                //
                //         //update invocation remote
                //         resultUpdate = await update_invocation(updateBody)
                //         log.debug(tag,"resultUpdate: ",resultUpdate)
                //         clientEvents.events.emit('unsignedTx',updateBody)
                //
                //         break;
                //     case 'deposit':
                //         //thorchain deposit (native RUNE inputs to swaps)
                //         if(!request.invocation) throw Error("103: invalid invocation! missing invocation!")
                //         if(!request.invocationId) throw Error("102: invalid invocation! missing id!")
                //         request.invocation.invocationId = request.invocationId
                //
                //         if(request.invocation.context) context = request.invocation.context
                //         if(!context) context = WALLET_CONTEXT
                //         if(!WALLETS_LOADED[context]) {
                //             log.error(tag,"WALLETS_LOADED: ",WALLETS_LOADED)
                //             log.error(tag,"context: ",context)
                //             throw Error("Unable to build transaction! context not found!")
                //         }
                //         log.debug(tag,"Building transaction with context: ",context)
                //         log.debug(tag,"invocation: ",request.invocation)
                //         //TODO validate object to type Deposit
                //         unsignedTx = await WALLETS_LOADED[context].deposit(request.invocation)
                //         log.debug(tag,"txid: ", unsignedTx.txid)
                //         log.debug(tag,"unsignedTx: ", unsignedTx)
                //
                //         //update invocation
                //         invocationId = request.invocation.invocationId
                //         unsignedTx.invocationId = invocationId
                //         updateBody = {
                //             invocationId,
                //             invocation:request.invocation,
                //             unsignedTx
                //         }
                //
                //         //update invocation remote
                //         resultUpdate = await update_invocation(updateBody)
                //         log.debug(tag,"resultUpdate: ",resultUpdate)
                //         clientEvents.events.emit('unsignedTx',updateBody)
                //
                //         break;
                //     case 'swap':
                //         if(!request.invocation) throw Error("103: invalid invocation! missing invocation!")
                //         if(!request.invocationId) throw Error("102: invalid invocation! missing id!")
                //         request.invocation.invocationId = request.invocationId
                //
                //         if(request.invocation.context) context = request.invocation.context
                //         if(!context) context = WALLET_CONTEXT
                //         if(!WALLETS_LOADED[context]) {
                //             log.error(tag,"WALLETS_LOADED: ",WALLETS_LOADED)
                //             log.error(tag,"context: ",context)
                //             throw Error("Unable to build transaction! context not found!")
                //         }
                //         log.debug(tag,"Building transaction with context: ",context)
                //         log.debug(tag,"invocation: ",request.invocation)
                //         unsignedTx = await WALLETS_LOADED[context].buildSwap(request.invocation)
                //         log.debug(tag,"txid: ", unsignedTx.txid)
                //         log.debug(tag,"unsignedTx: ", unsignedTx)
                //
                //         //update invocation
                //         invocationId = request.invocation.invocationId
                //         updateBody = {
                //             invocationId,
                //             invocation:request.invocation,
                //             unsignedTx
                //         }
                //
                //         //update invocation remote
                //         resultUpdate = await update_invocation(updateBody)
                //         log.debug(tag,"resultUpdate: ",resultUpdate)
                //         clientEvents.events.emit('unsignedTx',updateBody)
                //
                //         break;
                //     case 'approve':
                //         if(!request.invocation) throw Error("103: invalid invocation! missing invocation!")
                //         if(!request.invocationId) throw Error("102: invalid invocation! missing id!")
                //         request.invocation.invocationId = request.invocationId
                //
                //         if(request.invocation.context) context = request.invocation.context
                //         if(!context) context = WALLET_CONTEXT
                //         if(!WALLETS_LOADED[context]) {
                //             log.error(tag,"WALLETS_LOADED: ",WALLETS_LOADED)
                //             log.error(tag,"context: ",context)
                //             throw Error("Unable to build transaction! context not found!")
                //         }
                //         log.debug(tag,"Building transaction with context: ",context)
                //         log.debug(tag,"invocation: ",request.invocation)
                //
                //         unsignedTx = await WALLETS_LOADED[context].buildApproval(request.invocation)
                //         log.debug(tag,"txid: ", unsignedTx.txid)
                //         log.debug(tag,"unsignedTx: ", unsignedTx)
                //
                //         //update invocation
                //         invocationId = request.invocation.invocationId
                //         updateBody = {
                //             invocationId,
                //             invocation:request.invocation,
                //             unsignedTx
                //         }
                //
                //         //update invocation remote
                //         resultUpdate = await update_invocation(updateBody)
                //         log.debug(tag,"resultUpdate: ",resultUpdate)
                //         clientEvents.events.emit('unsignedTx',updateBody)
                //
                //         break;
                //     case 'transfer':
                //         if(!request.invocation) throw Error("103: invalid invocation! missing invocation!")
                //         if(!request.invocationId) throw Error("102: invalid invocation! missing id!")
                //         request.invocation.invocationId = request.invocationId
                //
                //         if(request.invocation.context) {
                //             context = request.invocation.context
                //             //context specified
                //             log.debug(tag,"Context Specified: ",context)
                //             log.debug(tag,"Current Context: ",WALLET_CONTEXT)
                //             WALLET_CONTEXT = context
                //         }
                //         if(!context) context = WALLET_CONTEXT
                //         if(!WALLETS_LOADED[context]) {
                //             log.error(tag,"WALLETS_LOADED: ",WALLETS_LOADED)
                //             log.error(tag,"context: ",context)
                //             throw Error("Unable to build transaction! context not found!")
                //         }
                //         log.debug(tag,"Building transaction with context: ",context)
                //         //log.debug(tag,"invocation: ",request.invocation)
                //
                //         unsignedTx = await WALLETS_LOADED[context].buildTransfer(request.invocation)
                //         log.debug(tag,"unsignedTx: ", unsignedTx)
                //         //update invocation
                //         invocationId = request.invocation.invocationId
                //         updateBody = {
                //             invocationId,
                //             invocation:request.invocation,
                //             unsignedTx
                //         }
                //
                //         //update invocation remote
                //         resultUpdate = await update_invocation(updateBody)
                //         log.debug(tag,"resultUpdate: ",resultUpdate)
                //         clientEvents.events.emit('unsignedTx',updateBody)
                //
                //         break;
                //     case 'context':
                //         log.debug(tag,"context event! event: ",request)
                //         //switch context
                //         if(WALLETS_LOADED[request.context]){
                //             WALLET_CONTEXT = request.context
                //             clientEvents.events.emit('context',request)
                //
                //             // log.debug(tag,"wallet context is now: ",request.context)
                //             if(request.context !== WALLET_CONTEXT){
                //                 WALLET_CONTEXT = request.context
                //                 clientEvents.events.emit('context',request)
                //             }else{
                //                 log.error("context already: ",request.context)
                //             }
                //         } else {
                //             log.error(tag,"Failed to switch! invalid context: ",request.context)
                //         }
                //         break;
                //     default:
                //         log.error("Unknown event: "+request.type)
                //     //push error
                //     // code block
                // }

                //push txid to invocationId

                //update status on server

                //add to history
            })
            output.events = clientEvents.events
        }
        output.context = WALLET_CONTEXT
        if(!output.context) throw Error("")

        output.walletsDescriptions = WALLETS_VERBOSE

        //global init
        IS_INIT = true

        return output
    } catch (e) {
        if(e.response && e.response.data){
            log.error(tag, "Error: ", e.response.data);
        }else{
            log.error(tag, "Error: ", e);
        }
        throw e;
    }
};
