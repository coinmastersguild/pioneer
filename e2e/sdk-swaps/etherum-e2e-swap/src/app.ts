/*
   *** E2E TEST ***
        App Module


    Init from env vars
    * verify empty env at start
    * verify creation

 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let assert = require('assert')

//test app
let App = require("@pioneer-platform/pioneer-app")
const log = require("@pioneer-platform/loggerdog")()
const ethCrypto = require("@pioneer-platform/eth-crypto")

//general dev envs
let seed = process.env['WALLET_MAINNET_DEV_OLD']
let password = process.env['WALLET_PASSWORD']
let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']
let spec = process.env['URL_PIONEER_SPEC']
let wss = process.env['URL_PIONEER_SOCKET']

//Globals
let WALLET_INIT = false
let WALLETS_LOADED:any = []
let WALLETS_NAMES:any = []
let WALLET_CONTEXT = ""

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
            isTestnet:true,
            mnemonic:seed,
            username:username,
            password
        }
        //get master for seed
        let walletEth = await ethCrypto.generateWalletFromSeed(wallet1.mnemonic)
        wallet1.masterAddress = walletEth.masterAddress

        //create wallet files
        let successCreate = await App.createWallet('software',wallet1)
        assert(successCreate)

        await App.initConfig("english");
        App.updateConfig({isTestnet:true});
        App.updateConfig({username});
        App.updateConfig({temp:password});
        App.updateConfig({created: new Date().getTime()});

        //get config
        config = await App.getConfig()
        config.blockchains = ['ethereum','thorchain']
        config.spec = spec
        config.pioneerSocket = wss

        //verify startup
        let isTestnet = true
        let resultInit = await App.init(config,isTestnet)

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
        return WALLETS_LOADED[WALLET_CONTEXT]
    } catch (e) {
        log.error(e)
        throw e
    }
}

export async function sendPairingCode(code:string) {
    let tag = " | sendPairingCode | "
    try {
        let pairResult = await App.pair(code)
        console.log("pairResult: ",pairResult)

        return true
    } catch (e) {
        log.error(e)
        throw e
    }
}

export async function buildTransaction(transaction:any) {
    let tag = " | buildTransaction | ";
    try {
        log.info(tag,"transaction: ",transaction)
        //get invocation

        //TODO validate type and fields

        let invocation = await App.getInvocation(transaction.invocationId)
        log.info(tag,"invocation: ",invocation)

        if(!invocation.type) invocation.type = invocation.invocation.type

        let context
        if(!transaction.context){
            context = WALLET_CONTEXT
        }
        if(!context) {
            log.error("context: ",context)
            log.error("Available: ",Object.keys(WALLETS_LOADED))
            throw Error("103: could not find context!")
        }
        let walletContext = WALLETS_LOADED[context]
        log.info(tag,"walletContext: ",walletContext.walletId)

        let unsignedTx
        switch(invocation.type) {
            case 'transfer':
                console.log(" **** BUILD TRANSACTION ****  invocation: ",invocation.invocation)

                //TODO validate transfer object

                unsignedTx = await walletContext.buildTransfer(invocation.invocation)
                log.info(" **** RESULT TRANSACTION ****  unsignedTx: ",unsignedTx)

                let invocationId = invocation.invocationId
                let updateBody = {
                    invocationId,
                    invocation,
                    unsignedTx
                }
                log.info(tag,"updateBody: ",updateBody)

                //update invocation remote
                let resultUpdate = await App.updateInvocation(updateBody)
                log.info(tag,"resultUpdate: ",resultUpdate)

                break
            case 'approve':
                throw Error("unhandled")
                // console.log(" **** BUILD SWAP ****  invocation: ",invocation.invocation)
                // let approvalSigned = await walletContext.buildApproval(invocation.invocation)
                // console.log(" **** RESULT TRANSACTION ****  approvalSigned: ",approvalSigned)
                break
            case 'swap':
                throw Error("unhandled")
                // console.log(" **** BUILD SWAP ****  invocation: ",invocation.invocation)
                // let swapSigned = await walletContext.buildSwap(invocation.invocation)
                // console.log(" **** RESULT TRANSACTION ****  swapSigned: ",swapSigned)
                break
            default:
                console.error("Unhandled type: ",invocation.type)
                console.error("Unhandled: ",invocation)
        }

        return unsignedTx
    } catch (e) {
        console.error(tag, "e: ", e);
        return {error:e};
    }
}

export async function approveTransaction(transaction:any) {
    let tag = " | approveTransaction | ";
    try {
        //get invocation

        let invocation = await App.getInvocation(transaction.invocationId)
        log.info(tag,"invocation: ",invocation)

        //
        let context
        if(!transaction.context){
            context = WALLET_CONTEXT
        }
        if(!context) {
            log.error("context: ",context)
            log.error("Available: ",Object.keys(WALLETS_LOADED))
            throw Error("103: could not find context!")
        }
        let walletContext = WALLETS_LOADED[context]
        log.info(tag,"walletContext: ",walletContext.walletId)

        //get
        //if(invocation.unsignedTx.HDwalletPayload.coin === 'BitcoinCash') invocation.unsignedTx.HDwalletPayload.coin = 'BCH'

        //unsinged TX
        log.info(tag,"invocation.unsignedTx: ",JSON.stringify(invocation.unsignedTx))
        let signedTx = await walletContext.signTransaction(invocation.unsignedTx)

        //update invocation
        let invocationId = invocation.invocationId
        let updateBody = {
            invocationId,
            invocation,
            unsignedTx:invocation.unsignedTx,
            signedTx
        }

        //update invocation remote
        let resultUpdate = await App.updateInvocation(updateBody)
        log.info(tag,"resultUpdate: ",resultUpdate)

        return signedTx
    } catch (e) {
        console.error(tag, "e: ", e);
        return {error:e};
    }
}

export async function broadcastTransaction(transaction:any) {
    let tag = " | broadcastTransaction | ";
    try {
        //get invocation

        let invocation = await App.getInvocation(transaction.invocationId)
        log.info(tag,"invocation: ",invocation)

        //
        let context
        if(!transaction.context){
            context = WALLET_CONTEXT
        }
        if(!context) {
            log.error("context: ",context)
            log.error("Available: ",Object.keys(WALLETS_LOADED))
            throw Error("103: could not find context!")
        }
        let walletContext = WALLETS_LOADED[context]
        log.info(tag,"walletContext: ",walletContext.walletId)

        //normalize
        if(!invocation.invocation.invocationId) invocation.invocation.invocationId = invocation.invocationId
        //override noBroadcast
        if(invocation.signedTx.noBroadcast) invocation.signedTx.noBroadcast = false

        let broadcastResult = await walletContext.broadcastTransaction(invocation.invocation.coin,invocation.signedTx)



        //update invocation
        let invocationId = invocation.invocationId
        let updateBody = {
            invocationId:invocation.invocation.invocationId,
            invocation:invocation.invocation,
            unsignedTx:invocation.unsignedTx,
            signedTx:invocation.signedTx,
            broadcastResult
        }
        log.info(tag,"updateBody: ",updateBody)
        //update invocation remote
        let resultUpdate = await App.updateInvocation(updateBody)
        log.info(tag,"resultUpdate: ",resultUpdate)


        return broadcastResult
    } catch (e) {
        console.error(tag, "e: ", e);
        return {error:e};
    }
}
