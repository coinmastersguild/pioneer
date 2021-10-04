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
const log = require("@pioneer-platform/loggerdog")()

let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let wait = require('wait-promise');
let sleep = wait.sleep;
let midgard = require("@pioneer-platform/midgard-client")
let coincap = require("@pioneer-platform/coincap")

let {
    supportedBlockchains,
    baseAmountToNative,
    nativeToBaseAmount,
} = require("@pioneer-platform/pioneer-coins")

const {
    startApp,
    getContext,
    getWallets,
    sendPairingCode,
    forget_user,
    buildTransaction,
    approveTransaction,
    broadcastTransaction,
    cancelTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let pioneerApi = require("@pioneer-platform/pioneer-client")

let password = process.env['WALLET_PASSWORD'] || '123'
let username = process.env['TEST_USERNAME_2'] || 'e2e-user-1'
let queryKey = process.env['TEST_QUERY_KEY_2']

let BLOCKCHAIN = 'thorchain'
let ASSET = 'RUNE'
let MIN_BALANCE = process.env['MIN_BALANCE_RUNE'] || "0.04"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj'

let noBroadcast = true
let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin','osmosis']

//pre-register username on key
const pre_register = async function () {
    let tag = TAG + " | pre_register | "
    try {
        //register wrong username
        let wrongUsername = 'wrongUsername'

        //init
        let config = {
            queryKey,
            username:wrongUsername,
            spec
        }
        console.log("config: ",config)

        //get config
        let pioneer = new pioneerApi(spec,config)
        pioneer = await pioneer.init()

        //register
        let register = {
            username:wrongUsername,
            blockchains,
            context:"fakecontext",
            walletDescription:{
                context:"fakecontext",
                type:"pioneer"
            },
            data:{
                pubkeys:[]
            },
            auth:"lol",
            queryKey,
        }
        //log.debug("pioneer: ",pioneer)
        let registerResp = await pioneer.instance.Register(null,register)
        log.debug("registerResp: ",registerResp.body)

        return true
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

        let success = await pre_register()
        assert(success)
        log.debug(tag,"success: ",success)


        //start app and get wallet
        let wallets = await startApp()
        log.debug(tag,"wallets: ",wallets)
        let username = wallets.username
        assert(username)

        let appContext = getContext()
        assert(appContext)
        log.debug(tag,"appContext: ",appContext)

        //get wallets
        let appWallets = getWallets()
        let contextAlpha = appWallets[0]
        let balance = wallets.wallets[contextAlpha].WALLET_BALANCES[ASSET]
        assert(balance)

        let masterAlpha = wallets.wallets[contextAlpha].getMaster(ASSET)
        //assert balance local
        //log.debug(tag,"wallet: ",wallet)
        if(balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+masterAlpha)
            throw Error("101: Low funds!")
        } else {
            log.debug(tag," Attempting e2e test "+ASSET+" balance: ",balance)
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
