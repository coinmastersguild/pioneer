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
let pjson = require("../package.json");
let TAG = " | " + pjson.name.replace("@pioneer-platform/", "") + " | ";
const log = require("log")
let BigNumber = require('@ethersproject/bignumber')
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
    sendPairingCode,
    cancelTransaction
} = require('@pioneer-platform/pioneer-app-e2e')
let pioneerApi = require("@pioneer-platform/pioneer-client")

let BLOCKCHAIN = 'thorchain'
let ASSET = 'RUNE'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.0002"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC']
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let wss = process.env['URL_PIONEER_SOCKET']
let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj'
let queryKey = process.env['TEST_QUERY_KEY_2'] || 'e2e-user-1-migration'

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

describe(' - e2e test '+TAG, function() {
    let tag = TAG + " | test_service | "
    try {
        const log = console.log;

        beforeEach(() => {
            console.log = jest.fn(); // create a new mock function for each test
            jest.setTimeout(90000)
        });
        afterAll(() => {
            console.log = log; // restore original console.log after all tests
        });


        const queryKey = uuidv4();
        let username
        let wallet:any


        it(' Pre-Register wrong username with queryKey', async function() {

            //start app and get wallet
            let successRegister = await pre_register()
            expect(successRegister).toBeDefined();
        });

        it('Starts Wallet', async function() {

            //start app and get wallet
            wallet = await startApp()
            log(tag,"wallet: ",wallet)
            username = wallet.username
            expect(username).toBeDefined();
        });

        //TODO if !noBroadcast


    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
})
