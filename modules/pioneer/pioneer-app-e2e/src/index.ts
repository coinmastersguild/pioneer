/*
   *** E2E TEST ***
        App Module


    Init from env vars
    * verify empty env at start
    * verify creation

 */
require("dotenv")
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let assert = require('assert')

//test app
let App = require("@pioneer-platform/pioneer-app")
const log = require("@pioneer-platform/loggerdog")()
const ethCrypto = require("@pioneer-platform/eth-crypto")

//general dev envs
let seed = process.env['WALLET_MAIN']
// let seed2 = process.env['WALLET_TEST']
if(!seed) throw Error("Failed to find test seed!")
// if(seed === seed2) throw Error("bravo seed MUST be eunique!")
let password = process.env['WALLET_PASSWORD'] || '123'
let username = process.env['TEST_USERNAME_2'] || 'e2e-user-134'
let queryKey = process.env['TEST_QUERY_KEY_2'] || 'testkey12346'
// let username2 = process.env['TEST_USERNAME_2'] || 'e2e-user-134'
// let queryKey2 = process.env['TEST_QUERY_KEY_2'] || 'testkey1234'

let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'

console.log("spec: ",spec)
console.log("wss: ",wss)

//Globals
let WALLET_INIT = false
let WALLETS_LOADED:any = []
let WALLETS_NAMES:any = []
let WALLET_CONTEXT = ""
let INVOCATIONS:any = []
let INVOCATIONS_SIGNED:any = []
let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin','osmosis']


export function getContext() {
    let tag = " | getContext | "
    try {
        return WALLET_CONTEXT
    } catch (e) {
        log.error(e)
        throw e
    }
}

export function getWallets() {
    let tag = " | getWallets | "
    try {
        return WALLETS_NAMES
    } catch (e) {
        log.error(e)
        throw e
    }
}

export function getInvocations() {
    let tag = " | getInvocations | "
    try {
        return INVOCATIONS
    } catch (e) {
        log.error(e)
        throw e
    }
}

export async function startApp() {
    let tag = " | app_assert_env_start | "
    try {

        //assert env correct
        assert(seed)
        assert(password)
        assert(username)
        assert(queryKey)

        //get config
        let config = await App.getConfig()
        assert(config === null)

        let wallet1:any = {
            mnemonic:seed,
            password
        }

        //get master for seed
        let walletEth = await ethCrypto.generateWalletFromSeed(wallet1.mnemonic)
        wallet1.masterAddress = walletEth.masterAddress

        //create wallet files
        log.debug(tag,"wallet1: ",wallet1)
        let successCreate = await App.createWallet('software',wallet1)
        assert(successCreate)
        log.debug(tag,"successCreate: ",successCreate)

        //create bravo
        //get master for seed
        // let walletEth2 = await ethCrypto.generateWalletFromSeed(wallet2.mnemonic)
        // wallet2.masterAddress = walletEth2.masterAddress

        //create wallet files
        // log.debug(tag,"wallet2: ",wallet2)
        // let successCreate2 = await App.createWallet('software',wallet2)
        // assert(successCreate2)

        await App.initConfig("english");
        App.updateConfig({username});
        App.updateConfig({temp:password});
        App.updateConfig({created: new Date().getTime()});
        assert(spec)
        assert(wss)
        App.updateConfig({blockchains})
        App.updateConfig({spec});
        App.updateConfig({wss});
        App.updateConfig({pioneerApi:true});
        //get config
        config = await App.getConfig()
        config.blockchains = blockchains
        config.spec = spec
        config.pioneerSocket = wss
        config.queryKey = queryKey

        //verify startup
        log.debug(tag,"config: ",config)
        let resultInit = await App.init(config)
        let isInit2 = App.isInitialized()
        assert(isInit2)

        //AutonomousOn
        resultInit.events.on('unsignedTx', async (transaction:any) => {
            log.debug("unsigned transaction received! transaction: ",transaction)
            log.debug("unsigned transaction received! transaction: ",JSON.stringify(transaction))
            if(!transaction.invocationId) throw Error("102: invalid transaction invocationId")
            if(!transaction.invocation) throw Error("103: invalid transaction invocation")
            if(!transaction.unsignedTx) throw Error("104: invalid transaction unsignedTx")
            //get invocationId

            //only sign each once (if NOT in array)
            if(INVOCATIONS_SIGNED.indexOf(transaction.invocationId) < 0){
                INVOCATIONS_SIGNED.push(transaction.invocationId)
                INVOCATIONS.push(transaction)
            }
        })

        config.password = password
        config.username = username

        //get wallets
        let wallets = await App.getWallets()
        WALLETS_LOADED = wallets
        let walletNames = await App.getWalletNames()
        WALLETS_NAMES = walletNames

        //get user info
        let userInfo = await App.getUserInfo()
        let context = userInfo.context
        assert(context)
        WALLET_CONTEXT = context
        assert(WALLETS_LOADED[WALLET_CONTEXT])
        return {
            context:WALLET_CONTEXT,
            wallets:WALLETS_LOADED,
            user:userInfo,
            username:userInfo.username
        }
    } catch (e) {
        log.error(e)
        throw e
    }
}

export async function setUsername(usernameNew:string) {
    let tag = " | setUsername | "
    try {
        username = usernameNew
        return username
    } catch (e) {
        log.error(e)
        throw e
    }
}

export async function sendPairingCode(code:string) {
    let tag = " | sendPairingCode | "
    try {
        let result = await App.pair(code)
        log.debug(tag,"result: ",result)

        return result
    } catch (e) {
        log.error(e)
        throw e
    }
}

export async function forgetUser() {
    let tag = " | sendPairingCode | "
    try {
        let result = await App.forget()
        log.debug(tag,"result: ",result)

        return result
    } catch (e) {
        log.error(e)
        throw e
    }
}

export async function cancelTransaction(tranaction:any) {
    let tag = " | cancelTransaction | "
    try {
        let cancelResult = await App.deleteInvocation(tranaction.invocationId)
        console.log("cancelResult: ",cancelResult)

        return cancelResult
    } catch (e) {
        log.error(e)
        throw e
    }
}

export async function buildTransaction(transaction:any) {
    let tag = " | buildTransaction | ";
    try {
        log.debug(tag,"transaction: ",transaction)
        if(!transaction.invocationId) throw Error("invocationId required!")

        //get invocation

        //TODO validate type and fields

        let invocation = await App.getInvocation(transaction.invocationId)
        if(!invocation) throw Error("103: failed to get invocation")
        log.debug(tag," APP invocation: ",invocation)

        if(!invocation.type) invocation.type = invocation.invocation.type

        let context
        if(!transaction.context){
            context = WALLET_CONTEXT
        } else {
            context = transaction.context
            WALLET_CONTEXT = context
        }
        if(!context || !WALLETS_LOADED[context]) {
            log.error("context: ",context)
            log.error("Available: ",WALLETS_LOADED)
            throw Error("103: could not find context in WALLETS_LOADED! "+context)
        }
        let walletContext = WALLETS_LOADED[context]
        if(!walletContext.walletId){
            walletContext.walletId = walletContext.context
        }
        if(!walletContext.walletId) throw Error("Invalid wallet! missing walletId!")
        log.debug(tag,"walletContext: ",walletContext.walletId)
        log.debug(tag,"invocation: ",invocation)

        let unsignedTx
        switch(invocation.type) {
            case 'transfer':
                log.debug(" **** BUILD TRANSACTION ****  invocation: ",invocation.invocation)
                //TODO validate transfer object
                unsignedTx = await walletContext.buildTransfer(invocation.invocation)
                log.debug(" **** RESULT TRANSACTION ****  unsignedTx: ",unsignedTx)
                break
            case 'redelegate':
            case 'undelegate':
            case 'ibcdeposit':
            case 'delegate':
                log.debug(" **** BUILD delegate ****  invocation: ",invocation.invocation)
                unsignedTx = await walletContext.buildTx(invocation.invocation)
                log.debug(" **** RESULT delegate ****  delegateUnSigned: ",unsignedTx)
                break
            case 'osmosislpadd':
                log.debug(" **** BUILD osmosislpadd ****  invocation: ",invocation.invocation)
                unsignedTx = await walletContext.buildTx(invocation.invocation)
                log.debug(" **** RESULT osmosisswap ****  osmosislpaddUnSigned: ",unsignedTx)
                break
            case 'osmosisswap':
                log.debug(" **** BUILD osmosisswap ****  invocation: ",invocation.invocation)
                unsignedTx = await walletContext.buildTx(invocation.invocation)
                log.debug(" **** RESULT osmosisswap ****  osmosisswapUnSigned: ",unsignedTx)
                break
            case 'redelegate':
                log.debug(" **** BUILD redelegate ****  invocation: ",invocation.invocation)
                unsignedTx = await walletContext.buildTx(invocation.invocation)
                log.debug(" **** RESULT delegate ****  redelegateUnSigned: ",unsignedTx)
                break
            case 'approve':
                log.debug(" **** BUILD Approval ****  invocation: ",invocation.invocation)
                unsignedTx = await walletContext.buildApproval(invocation.invocation)
                log.debug(" **** RESULT TRANSACTION ****  approvalUnSigned: ",unsignedTx)
                break
            case 'deposit':
                log.debug(" **** BUILD DEPOSIT ****  invocation: ",invocation.invocation)
                unsignedTx = await walletContext.deposit(invocation.invocation)
                log.debug(" **** RESULT TRANSACTION ****  depositUnSigned: ",unsignedTx)
                break
            case 'swap':
                log.debug(" **** BUILD SWAP ****  invocation: ",invocation.invocation)
                unsignedTx = await walletContext.buildSwap(invocation.invocation)
                log.debug(" **** RESULT TRANSACTION ****  swapUnSigned: ",unsignedTx)
                break
            default:
                console.error("APP E2E Unhandled type: ",invocation.type)
                console.error("Unhandled: ",invocation)
                throw Error("Unhandled type: "+invocation.type)
        }
        if(!unsignedTx && !unsignedTx.txid) throw Error("Failed to build tx!")
        //update invocation
        let invocationId = invocation.invocationId
        let updateBody = {
            network:invocation.network,
            invocationId,
            invocation,
            unsignedTx
        }

        //update invocation remote
        let resultUpdate = await App.updateInvocation(updateBody)
        log.debug(tag,"resultUpdate: ",resultUpdate)

        return unsignedTx
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e
    }
}

export async function metamaskMock(transaction:any) {
    let tag = " | metamaskMock | ";
    try {
        let context
        if(!transaction.context){
            context = WALLET_CONTEXT
        } else {
            context = transaction.context
        }

        //get context
        if(!context || Object.keys(WALLETS_LOADED).indexOf(context) < 0) {
            log.error("context: ",context)
            log.error("Available: ",Object.keys(WALLETS_LOADED))
            throw Error("103: could not find context in WALLETS_LOADED! "+context)
        }
        let walletContext = WALLETS_LOADED[context]
        if(!walletContext.walletId){
            walletContext.walletId = walletContext.context
        }
        if(!walletContext.walletId) throw Error("Invalid wallet! missing walletId!")
        log.debug(tag,"walletContext: ",walletContext.walletId)

        //signTx manually outside hook
        let signedTx = await walletContext.signTransaction(transaction.unsignedTx)
        log.info(tag,"signedTx: ",signedTx)
        signedTx.network = 'ETH'
        //broadcast manually outside hook
        // let broadcastResult = await walletContext.broadcastTransaction('ETH',signedTx)
        // log.info(tag,"broadcastResult: ",broadcastResult)

        //TODO return metamask formated txInfo


        return signedTx
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e
    }
}

export async function updateInvocation(updateBody:any) {
    let tag = " | approveTransaction | ";
    try {

        let resultUpdate = await App.updateInvocation(updateBody)
        log.debug(tag,"resultUpdate: ",resultUpdate)

        return resultUpdate
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e
    }
}

export async function approveTransaction(transaction:any) {
    let tag = " | approveTransaction | ";
    try {
        //get invocation

        let invocation = await App.getInvocation(transaction.invocationId)
        log.debug(tag,"invocation: ",invocation)
        if(!invocation.unsignedTx) throw Error("invalid invocation! missing unsignedTx")
        if(!invocation.unsignedTx.HDwalletPayload) throw Error("invalid invocation! invalid unsignedTx missing HDwalletPayload")

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
        if(!walletContext.walletId){
            walletContext.walletId = walletContext.context
        }
        if(!walletContext.walletId) throw Error("Invalid wallet! missing walletId!")
        log.debug(tag,"walletContext: ",walletContext.walletId)

        //unsinged TX
        log.debug(tag,"invocation.unsignedTx: ",JSON.stringify(invocation.unsignedTx))
        log.debug(tag,"invocation.unsignedTx: ",invocation.unsignedTx)
        log.debug(tag,"invocation.unsignedTx HDwalletPayload: ",JSON.stringify(invocation.unsignedTx.HDwalletPayload))

        //TODO verify app?
        //verify amounts
        //verify intent

        let signedTx = await walletContext.signTransaction(invocation.unsignedTx)

        //update invocation
        let invocationId = invocation.invocationId
        let updateBody = {
            network:invocation.network,
            invocationId,
            invocation,
            unsignedTx:invocation.unsignedTx,
            signedTx
        }

        //update invocation remote
        let resultUpdate = await App.updateInvocation(updateBody)
        log.debug(tag,"resultUpdate: ",resultUpdate)

        return signedTx
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e
    }
}

export async function broadcastTransaction(transaction:any) {
    let tag = " | broadcastTransaction | ";
    try {
        //get invocation

        let invocation = await App.getInvocation(transaction.invocationId)
        log.debug(tag,"invocation: ",invocation)

        //
        if(!invocation.signedTx) throw Error("102: Unable to broadcast transaction! signedTx not found!")

        //
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
        if(!walletContext.walletId){
            walletContext.walletId = walletContext.context
        }
        if(!walletContext.walletId) throw Error("Invalid wallet! missing walletId!")
        log.debug(tag,"walletContext: ",walletContext.walletId)

        //TODO fix this tech debt
        //normalize
        if(!invocation.network) invocation.network = invocation.invocation.network
        if(!invocation.invocation.invocationId) invocation.invocation.invocationId = invocation.invocation.invocationId
        if(!invocation.signedTx.network) invocation.signedTx.network = invocation.network
        if(!invocation.signedTx.invocationId) invocation.signedTx.invocationId = invocation.invocationId
        if(invocation.signedTx && invocation.noBroadcast) invocation.signedTx.noBroadcast = true
        if(invocation.signedTx && invocation.invocation.noBroadcast) invocation.signedTx.noBroadcast = true

        //force noBroadcast
        //invocation.signedTx.noBroadcast = true
        log.debug(tag,"invocation.signed BROADCASTBODY: ",invocation.signedTx)
        let broadcastResult = await walletContext.broadcastTransaction(invocation.signedTx.network,invocation.signedTx)
        log.debug(tag,"broadcastResult: ",broadcastResult)

        return broadcastResult
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e
    }
}
