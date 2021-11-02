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
    baseAmountToNative,
    nativeToBaseAmount,
} = require("@pioneer-platform/pioneer-coins")

const {
    startApp,
    sendPairingCode,
    getContext,
    getWallets,
    cancelTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'ethereum'
let ASSET = 'ETH'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.004"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj'
let TEST_ADDRESS_METAMASK = process.env['TEST_ADDRESS_METAMASK'] || "0x727e17d0b8e5c793a64a3ff8dab748abfee46757"
const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

        // start app and get wallet
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
        let walletDescriptionContext = wallets.user.walletDescriptions.filter((e:any) => e.context === appContext)[0]
        log.debug(tag,"walletDescriptionContext: ",walletDescriptionContext)

        //balance
        let pubkey = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === ASSET)[0]
        log.debug(tag,"pubkey: ",pubkey)
        let balance = pubkey.balances.filter((e:any) => e.asset === ASSET)[0]
        log.debug(tag,"balance: ",balance)
        balance = balance.balance
        log.debug(tag,"balance: ",balance)

        if(!balance){
            log.error(tag,"Failed to get balance! asset: "+ASSET,pubkey)
        }
        assert(balance)

        let master = pubkey.master
        //assert balance local
        log.debug(tag,"master: ",master)
        if(balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+master)
            throw Error("101: Low funds!")
        } else {
            log.debug(tag," Attempting e2e test "+ASSET+" balance: ",balance)
        }

        //generate new key
        //sdk:4339eec1-343a-438f-823a-4f56d1f528c2
        const queryKey = "sdk:4339eec1-343a-438f-823a-4f56d1f528c2";
        // const queryKey = uuidv4();
        assert(queryKey)

        let config = {
            queryKey,
            //username,
            spec,
            wss
        }

        let app = new SDK.SDK(spec,config)
        let events = await app.startSocket()
        let eventPairReceived = false
        events.on('message', async (message:any) => {
            log.debug(tag,"message: ",message)
            assert(message.queryKey)
            assert(message.username)
            assert(message.url)
            eventPairReceived = true
        })

        let seedChains = [
            'bitcoin',
            'ethereum',
            'thorchain',
            'bitcoincash',
            'binance',
            'litecoin',
            'cosmos',
            'osmosis']
        await app.init(seedChains)

        //pair metamask
        let pairWalletOnboard:any = {
            name:'MetaMask',
            network:1,
            initialized:true,
            address:TEST_ADDRESS_METAMASK
        }
        log.debug(tag,"pairWalletOnboard: ",pairWalletOnboard)

        //pair wallet
        let resultRegister = await app.pairWallet(pairWalletOnboard)
        log.debug(tag,"resultRegister: ",resultRegister)

        //sdk info
        log.debug("app pubkeys: ",app.pubkeys)
        log.debug("app balances: ",app.balances)
        log.debug("app context: ",app.context)
        assert(app.pubkeys)
        assert(app.balances)
        // assert(app.balances.length > 0)
        assert(app.context)

        let isSyncing = true
        while(!isSyncing){
            let pubkeys = app.pubkeys
            let user = await app.getUserParams()
            log.debug("user: ",user)
            let allSynced = []
            for(let i = 0; i < pubkeys.length; i++){
                let pubkey = pubkeys[i]
                log.debug(tag,"pubkey: ",pubkey)

                assert(pubkey.pubkey)
                //pubkey
                log.debug(tag,"isSyncing: ",pubkey.isSyncing)
                if(!pubkey.lastUpdated){
                    isSyncing = true
                } else {
                    allSynced.push(pubkey)
                }
                if(allSynced.length >= pubkeys.length && pubkeys.length > 0){
                    isSyncing = false
                }
            }
            //done syncing
            //sleep
            await sleep(3000)
        }

        log.debug("app balances: ",app.balances)
        //check balances
        //verify icons

        //pair with pioneer
        let code = await app.createPairingCode()
        code = code.code
        log.debug("code: ",code)
        assert(code)

        let pairSuccess = await sendPairingCode(code)
        log.debug("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
        }

        //TODO verify username migration to app username in sdk

        //get user
        // let user = await app.getUserParams()
        // log.debug("user: ",user)
        // assert(user.context)
        assert(app.balances)
        // log.debug("balances: ",app.balances.length)
        log.debug("balances: ",app.balances)
        log.debug("app: ",app)
        //verify pairing has metamask wallet

        //verify metamask pubkey is found in balances
        let metamaskPubkeyInfo = app.balances.filter((e:any) => e.pubkey == TEST_ADDRESS_METAMASK)[0]
        log.debug("metamaskPubkeyInfo: ",metamaskPubkeyInfo)
        assert(metamaskPubkeyInfo)

        //12?
        // assert(app.balances,12)


        //switch context


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
