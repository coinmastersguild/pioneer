/*
    E2E testing
        k8  "job" pattern

    load test seed

    verify empty

    build sign broadcast swap

    watch till confirmed

    report to leeroy server results



    SDK Arch pattern ***

        Start and configure app

        verify socket connection


    Use sdk to

        * check balances
        * check tx history
        * verify payment

 */

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let BigNumber = require('@ethersproject/bignumber')
let pjson = require("../package.json");
let TAG = " | " + pjson.name.replace("@pioneer-platform/", "") + " | ";
const log = require("log")

let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let wait = require('wait-promise');
let sleep = wait.sleep;
let midgard = require("@pioneer-platform/midgard-client")
let coincap = require("@pioneer-platform/coincap")

let {
} = require("@pioneer-platform/pioneer-coins")

const {
    startApp,
    getContext,
    sendPairingCode,
    getWallets,
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'ethereum'
let ASSET = 'ETH'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.0002"
let spec = process.env['URL_PIONEER_SPEC']
let wss = process.env['URL_PIONEER_SOCKET']
let contextAlpha
let contextBravo

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

        //start app and get wallet
        let App = await startApp()
        log.debug(tag,"App: ",App)
        let username = App.username
        assert(username)

        let appContext = getContext()
        assert(appContext)
        log.debug(tag,"appContext: ",appContext)

        //get wallets
        let appWallets = getWallets()

        //multi-wallet
        assert(appWallets.length,2)
        log.debug(tag,"appWallets: ",appWallets)

        //TODO bounce funds between and test max amounts
        //set highest balance to main
        log.debug(tag,"appWallets[0]: ",appWallets[0])
        log.debug(tag,"appWallets[1]: ",appWallets[1])

        let balance1 = App.wallets[appWallets[0]].WALLET_BALANCES[ASSET]
        let balance2 = App.wallets[appWallets[1]].WALLET_BALANCES[ASSET]
        log.debug(tag,"balance1: ",balance1)
        log.debug(tag,"balance2: ",balance2)

        if(balance1 > balance2){
            contextAlpha = App.wallets[appWallets[0]].context
            contextBravo = App.wallets[appWallets[1]].context
        } else {
            contextAlpha = App.wallets[appWallets[1]].context
            contextBravo = App.wallets[appWallets[0]].context
        }
        log.debug(tag,"contextAlpha: ",contextAlpha)
        log.debug(tag,"contextBravo: ",contextBravo)

        //set context to main
        //set faucet addresses to secondary
        //send MAX to secondary (next time test runs it will switch)

        let balance = App.wallets[contextAlpha].WALLET_BALANCES[ASSET]
        assert(balance)

        let masterBravo = await App.wallets[contextBravo].getMaster(ASSET)
        log.debug(tag,"masterBravo: ",masterBravo)

        let masterAlpha = await App.wallets[contextAlpha].getMaster(ASSET)
        log.debug(tag,"masterAlpha: ",masterAlpha)



        //assert balance local
        //log.debug(tag,"wallet: ",wallet)
        if(balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+masterAlpha)
            throw Error("101: Low funds!")
        } else {
            log.debug(tag," Attempting e2e test "+ASSET+" balance: ",balance)
        }


        //generate new key
        const queryKey = uuidv4();
        assert(queryKey)

        let config:any = {
            queryKey,
            //username,
            spec,
            wss
        }
        log.debug(tag,"config: ",config)
        let app = new SDK.SDK(spec,config)
        let events = await app.startSocket()
        let eventPairReceived = false
        let eventInvokeTransferReceived = false
        let eventContextReceived = false
        events.on('message', async (event:any) => {
            log.debug(tag,"event: ",event)
            switch(event.type) {
                case 'pairing':
                    assert(event.queryKey)
                    assert(event.username)
                    assert(event.url)
                    eventPairReceived = true
                    break;
                case 'context':
                    log.debug(tag,"context event!")
                    //get new params
                    await app.getUserParams()
                    eventContextReceived = true
                    break;
                case 'transfer':
                    //TODO assert valid transfer info
                    //received continue below
                    eventInvokeTransferReceived = true
                    break;
                default:
                    log.error(tag,"unhandled event: ",event)
                // code block
            }
        })



        let seedChains = ['ethereum','thorchain']
        await app.init(seedChains)

        //pair sdk
        let code = await app.createPairingCode()
        code = code.code
        log.debug("code: ",code)
        assert(code)


        let pairSuccess = await sendPairingCode(code)
        assert(pairSuccess.user.username,username)
        log.debug("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
        }

        let userInfo = await app.getUserInfo()
        log.debug("userInfo: ",userInfo)
        assert(userInfo.walletDescriptions)
        assert(userInfo.walletDescriptions.length,2)
        assert(userInfo.context)
        assert(userInfo.assetContext)


        //should be 2 wallet descriptions
        let wallets = userInfo.walletDescriptions
        log.debug("wallets: ",wallets)


        //get user
        let user = await app.getUserParams()
        log.debug("user: ",user)
        assert(user.context)
        assert(user.assetContext)
        assert(user.valueUsdContext)
        assert(user.assetBalanceNativeContext)
        assert(user.assetBalanceUsdValueContext)
        assert(user.wallet)
        //should only be 2 contexts?
        //assert user clients
        assert(user.clients[BLOCKCHAIN])

        //intergration test asgard-exchange
        let blockchains = Object.keys(user.clients)
        log.debug("blockchains: ",blockchains)

        let client = user.clients[BLOCKCHAIN]

        //get master
        let masterAddress = await client.getAddress()
        log.debug(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)

        /*
            3 ways to express balance
                Sdk (x-chain compatible object type)
                native (satoshi/wei)
                base (normal 0.001 ETH)
         */

        let balanceSdk = await client.getBalance()
        log.debug(" balanceSdk: ",balanceSdk)
        assert(balanceSdk[0])
        assert(balanceSdk[0].amount)
        assert(balanceSdk[0].amount.amount())
        assert(balanceSdk[0].amount.amount().toString())

        let availableWallets = await getWallets()
        log.debug(tag,"availableWallets: ",availableWallets)
        log.debug(tag,"availableWallets.indexOf(user.context): ",availableWallets.indexOf(user.context))
        if(availableWallets.indexOf(user.context) === 1){
            log.debug(tag,"setting to 0: ",availableWallets[0])
            let success = await app.setContext(availableWallets[0])
            log.debug(tag,"success: ",success)
        }else if(availableWallets.indexOf(user.context) === 0){
            log.debug(tag,"setting to 1: ",availableWallets[1])
            let success = await app.setContext(availableWallets[1])
            log.debug(tag,"success: ",success)
        }

        //fail test after 30 seconds
        let failTest = function(){
            log.error("Failed to get context event!")
            process.exit(4)
        }
        let timeout = setTimeout(failTest,30 * 1000)
        //dont release till context event
        while(!eventContextReceived){
            await sleep(300)
        }
        clearTimeout(timeout)
        //asset switch event received
        //switch context

        //get context from remote
        let userInfoPOST = await app.getUserInfo()
        log.debug("userInfoPOST: ",userInfoPOST)

        log.debug(tag,"userInfo.context: ",userInfo.context)
        log.debug(tag,"userInfoPOST.context: ",userInfoPOST.context)
        if(userInfoPOST.context === userInfo.context){
            log.debug(tag,"userInfo.context: ",userInfo.context)
            log.debug(tag,"userInfoPOST.context: ",userInfoPOST.context)
            throw Error("CONTEXT Context Switched and client did NOT switch context! 1")
        }

        user = await app.getUserParams()
        client = user.clients[BLOCKCHAIN]
        log.debug("user: ",user)
        assert(user.context)
        assert(user.assetContext)
        assert(user.valueUsdContext)
        assert(user.assetBalanceNativeContext)
        assert(user.assetBalanceUsdValueContext)
        assert(user.wallet)

        //verify clients changed context
        //get master
        let masterAddressPOST = await client.getAddress()
        log.debug(tag,"masterAddressPOST: ",masterAddressPOST)
        assert(masterAddressPOST)

        /*
            3 ways to express balance
                Sdk (x-chain compatible object type)
                native (satoshi/wei)
                base (normal 0.001 ETH)
         */

        let balanceSdkPOST = await client.getBalance()
        log.debug(" balanceSdkPOST: ",balanceSdkPOST)
        assert(balanceSdkPOST[0])
        assert(balanceSdkPOST[0].amount)
        assert(balanceSdkPOST[0].amount.amount())
        assert(balanceSdkPOST[0].amount.amount().toString())

        if(masterAddressPOST === masterAddress){
            log.debug(tag,"masterAddress: ",masterAddress)
            log.debug(tag,"balanceSdkPOST: ",balanceSdkPOST)
            throw Error("ADDRESS Context Switched and client did NOT switch context! 2")
        }


        log.notice("****** TEST PASS 2******")
        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
