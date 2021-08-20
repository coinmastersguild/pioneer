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
const log = require("@pioneer-platform/loggerdog")()
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
    forgetUser,
    sendPairingCode,
    cancelTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'thorchain'
let ASSET = 'RUNE'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.0002"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC']
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let wss = process.env['URL_PIONEER_SOCKET']
let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj'

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
        let balance
        let wallet:any
        let app:any
        let eventPairReceived = false

        it('Starts Wallet', async function() {
            //start app and get wallet
            wallet = await startApp()
            //log(tag,"wallet: ",wallet)
            username = wallet.username
            expect(username).toBeDefined();
        });

        it('gets balance', async function() {

            //get balance
            balance = wallet.WALLET_BALANCES[ASSET]
            expect(balance).toBeDefined();
        });

        it('Balance is enough for test', async function() {

            //get balance
            balance = wallet.WALLET_BALANCES[ASSET]
            expect(Number(balance)).toBeGreaterThan(Number(MIN_BALANCE));
        });

        it('SDK initialization', async function() {

            let config = {
                queryKey,
                //username,
                spec,
                wss
            }

            app = new SDK.SDK(spec,config)
            expect(app).toBeDefined();

        });

        it('SDK start events', async function() {
            let events = await app.startSocket()
            events.on('message', async (request:any) => {
                expect(request.queryKey).toBeDefined();
                expect(request.username).toBeDefined();
                expect(request.url).toBeDefined();
                eventPairReceived = true
            })

        });

        it('forget user', async function() {
            let result = await forgetUser()
            expect(result).toBeDefined();
        });


    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
})
