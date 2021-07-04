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
const TAG  = " | e2e-test | "
const log = require("@pioneer-platform/loggerdog")()

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
    sendPairingCode,
    getWallets,
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'thorchain'
let ASSET = 'RUNE'
let MIN_BALANCE = process.env['MIN_BALANCE_RUNE'] || "0.04"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC']
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let wss = process.env['URL_PIONEER_SOCKET']
let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj'
let noBroadcast = true

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

        //start app and get wallet
        let wallet = await startApp()
        let username = wallet.username
        assert(username)
        log.info("username: ",username)

        let balance = wallet.WALLET_BALANCES[ASSET]
        assert(balance)

        //assert balance local
        //log.info(tag,"wallet: ",wallet)
        log.debug(tag,"wallet: ",wallet.WALLET_BALANCES)
        if(balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+await wallet.getMaster(ASSET))
            throw Error("101: Low funds!")
        } else {
            log.info(tag," Attempting e2e test "+ASSET+" balance: ",balance)
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
        log.info(tag,"config: ",config)
        let app = new SDK.SDK(spec,config)
        let events = await app.startSocket()
        let eventPairReceived = false
        let eventInvokeTransferReceived = false
        let eventContextReceived = false
        events.on('message', async (event:any) => {
            log.info(tag,"event: ",event)
            switch(event.type) {
                case 'pairing':
                    assert(event.queryKey)
                    assert(event.username)
                    assert(event.url)
                    eventPairReceived = true
                    break;
                case 'context':
                    log.info(tag,"context event!")
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
        log.info("code: ",code)
        assert(code)


        let pairSuccess = await sendPairingCode(code)
        assert(pairSuccess.user.username,username)
        log.info("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
        }

        let userInfo = await app.getUserInfo()
        log.info("userInfo: ",userInfo)
        assert(userInfo.walletDescriptions)
        assert(userInfo.walletDescriptions.length,2)
        assert(userInfo.context)
        assert(userInfo.assetContext)


        //should be 2 wallet descriptions
        let wallets = userInfo.walletDescriptions
        log.info("wallets: ",wallets)


        //get user
        let user = await app.getUserParams()
        log.info("user: ",user)
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
        log.info("blockchains: ",blockchains)

        let client = user.clients[BLOCKCHAIN]

        //get master
        let masterAddress = await client.getAddress()
        log.info(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)

        /*
            3 ways to express balance
                Sdk (x-chain compatible object type)
                native (satoshi/wei)
                base (normal 0.001 ETH)
         */

        let balanceSdk = await client.getBalance()
        log.info(" balanceSdk: ",balanceSdk)
        assert(balanceSdk[0])
        assert(balanceSdk[0].amount)
        assert(balanceSdk[0].amount.amount())
        assert(balanceSdk[0].amount.amount().toString())

        let availableWallets = await getWallets()
        log.info(tag,"availableWallets: ",availableWallets)
        log.info(tag,"availableWallets.indexOf(user.context): ",availableWallets.indexOf(user.context))
        if(availableWallets.indexOf(user.context) === 1){
            log.info(tag,"setting to 0: ",availableWallets[0])
            let success = await app.setContext(availableWallets[0])
            log.info(tag,"success: ",success)
        }else if(availableWallets.indexOf(user.context) === 0){
            log.info(tag,"setting to 1: ",availableWallets[1])
            let success = await app.setContext(availableWallets[1])
            log.info(tag,"success: ",success)
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
        log.info("userInfoPOST: ",userInfoPOST)

        log.info(tag,"userInfo.context: ",userInfo.context)
        log.info(tag,"userInfoPOST.context: ",userInfoPOST.context)
        if(userInfoPOST.context === userInfo.context){
            log.info(tag,"userInfo.context: ",userInfo.context)
            log.info(tag,"userInfoPOST.context: ",userInfoPOST.context)
            throw Error("CONTEXT Context Switched and client did NOT switch context! 1")
        }

        user = await app.getUserParams()
        client = user.clients[BLOCKCHAIN]
        log.info("user: ",user)
        assert(user.context)
        assert(user.assetContext)
        assert(user.valueUsdContext)
        assert(user.assetBalanceNativeContext)
        assert(user.assetBalanceUsdValueContext)
        assert(user.wallet)

        //verify clients changed context
        //get master
        let masterAddressPOST = await client.getAddress()
        log.info(tag,"masterAddressPOST: ",masterAddressPOST)
        assert(masterAddressPOST)

        /*
            3 ways to express balance
                Sdk (x-chain compatible object type)
                native (satoshi/wei)
                base (normal 0.001 ETH)
         */

        let balanceSdkPOST = await client.getBalance()
        log.info(" balanceSdkPOST: ",balanceSdkPOST)
        assert(balanceSdkPOST[0])
        assert(balanceSdkPOST[0].amount)
        assert(balanceSdkPOST[0].amount.amount())
        assert(balanceSdkPOST[0].amount.amount().toString())

        if(masterAddressPOST === masterAddress){
            log.info(tag,"masterAddress: ",masterAddress)
            log.info(tag,"balanceSdkPOST: ",balanceSdkPOST)
            throw Error("ADDRESS Context Switched and client did NOT switch context! 2")
        }


        log.info("****** TEST PASS 2******")
        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
