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
    getContext,
    getWallets,
    sendPairingCode,
    cancelTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'ethereum'
let ASSET = 'ETH'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.0002"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
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
        let wallets:any
        let context:any
        let app:any
        let eventPairReceived = false
        let seedChains = ['ethereum','thorchain']
        let code:any
        let user:any
        let client:any
        let balanceSdk:any
        let balanceNative:any
        let balanceBase:any
        let valueBalanceUsd:any
        let estimateCost:any
        let transfer:any
        let invocationId:string
        let signedTx:any
        let transaction:any
        let broadcastResult:any

        it('Starts Wallet', async function() {
            //start app and get wallet
            wallets = await startApp()
            //log(tag,"wallet: ",wallet)
            username = wallets.username
            expect(username).toBeDefined();
        });

        it('Gets Context', async function() {

            //get balance
            let appWallets = getWallets()
            context = appWallets[0]
            let balance = wallets.wallets[context].WALLET_BALANCES[ASSET]
            expect(balance).toBeDefined();
        });

        it('gets balance', async function() {

            //get balance
            balance = wallets.wallets[context].WALLET_BALANCES[ASSET]
            expect(balance).toBeDefined();
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

        it('App initialization', async function() {


            let resultInit = await app.init(seedChains)
            expect(resultInit).toBeDefined();

        });

        it('App pairing with sdk ', async function() {


            //pair sdk
            code = await app.createPairingCode()
            code = code.code
            log("code: ",code)
            expect(code).toBeDefined();

        });

        it('Send Pairing Code ', async function() {

            //pair sdk
            let pairSuccess = await sendPairingCode(code)
            log("pairSuccess: ",pairSuccess)
            expect(pairSuccess).toBeDefined();

        });

        it('Wait for pairing ACK ', async function() {


            //pair sdk
            while(!eventPairReceived){
                await sleep(300)
            }

        });


        it('Get User from SDK ', async function() {


            //get user
            user = await app.getUserParams()
            log("user: ",user)
            expect(user.context).toBeDefined();

        });

        it('Validate user configuration ', async function() {


            //get user
            let blockchains = Object.keys(user.clients)
            log("blockchains: ",blockchains)
            expect(blockchains).toBeDefined();

        });

        it('Get ETH client ', async function() {


            client = user.clients[BLOCKCHAIN]
            expect(client).toBeDefined();

        });

        it('Assert master exists ', async function() {


            let masterAddress = await client.getAddress()
            log(tag,"masterAddress: ",masterAddress)
            expect(masterAddress).toBeDefined();

        });

        it('get client balance SDK ', async function() {

            //Match X-Chain syntax
            balanceSdk = await client.getBalance()
            log(" balanceSdk: ",balanceSdk)
            expect(balanceSdk[0]).toBeDefined();
            expect(balanceSdk[0].amount).toBeDefined();
            expect(balanceSdk[0].amount.amount()).toBeDefined();
            expect(balanceSdk[0].amount.amount().toString()).toBeDefined();

        });

        it('Convert balance to human readable format', async function() {

            balanceNative = balanceSdk[0].amount.amount().toString()
            log(tag,"balanceNative: ",balanceNative)
            expect(balanceNative).toBeDefined();

            balanceBase = await nativeToBaseAmount(ASSET,balanceSdk[0].amount.amount().toString())
            log(tag,"balanceBase: ",balanceBase)
            expect(balanceBase).toBeDefined();

            valueBalanceUsd = await coincap.getValue(ASSET,balanceBase)
            log(tag,"valueBalanceUsd: ",valueBalanceUsd)
            expect(valueBalanceUsd).toBeDefined();

            expect(balanceBase).toBeGreaterThan(Number(TEST_AMOUNT));
        });

        it('Get transfer Params from midgard ', async function() {

            //get pool address
            let poolInfo = await midgard.getPoolAddress()

            //filter by chain
            let thorVault = poolInfo.filter((e:any) => e.chain === 'BCH')
            log(tag,"thorVault: ",thorVault)
            expect(thorVault).toBeDefined();

            log(tag,"thorVault: ",thorVault)
            expect(thorVault[0]).toBeDefined();
            thorVault = thorVault[0]
            expect(thorVault.address).toBeDefined();
            const vaultAddress = thorVault.address
            const gasRate = thorVault.gas_rate
            expect(vaultAddress).toBeDefined();
            expect(gasRate).toBeDefined();

            //test amount in native
            let amountTestNative = baseAmountToNative("RUNE",TEST_AMOUNT)
            expect(amountTestNative).toBeDefined();

            transfer = {
                inboundAddress: thorVault,
                recipient:vaultAddress,
                coin: ASSET,
                asset: ASSET,
                memo: '=:BCH.BCH:'+FAUCET_BCH_ADDRESS,
                "amount":{
                    amount: function(){
                        return BigNumber.BigNumber.from(amountTestNative)
                    }
                },
                fee:gasRate, // fee === gas (xcode inheritance)
                noBroadcast:true
            }
        });

        it('Build transfer (init) ', async function() {
            let options:any = {
                verbose: true,
                txidOnResp: false, // txidOnResp is the output format
            }

            let responseTransfer = await user.clients[BLOCKCHAIN].transfer(transfer,options)
            log(tag,"responseTransfer: ",responseTransfer)
            let invocationId = responseTransfer
            expect(invocationId).toBeDefined();

            transaction = {
                invocationId,
                context:user.context
            }
        });

        it('cancel transfer (with context)', async function() {

            let resultCancel = await cancelTransaction(transaction)
            log(tag,"resultCancel: ",resultCancel)
            expect(resultCancel).toBeDefined();

        });

        //TODO if !noBroadcast


    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
})
