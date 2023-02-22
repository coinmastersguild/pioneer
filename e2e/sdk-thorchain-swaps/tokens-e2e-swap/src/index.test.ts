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
const TAG  = " | e2e-test | "
const log = require("log")

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
    buildTransaction,
    approveTransaction,
    broadcastTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'ethereum'
let ASSET = 'SUSHI'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.0002"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC']
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let wss = process.env['URL_PIONEER_SOCKET']
let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'

describe(' - e2e test ETH Swaps - ', function() {
    let tag = TAG + " | test_service | "
    try {
        const log = console.log;

        beforeEach(() => {
            console.log = jest.fn(); // create a new mock function for each test
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
        let seedChains = ['ethereum','thorchain']
        let code:any
        let user:any
        let client:any
        let balanceSdk:any
        let balanceNative:any
        let balanceBase:any
        let valueBalanceUsd:any
        let estimateCost:any
        let swap:any
        let invocationId:string
        let signedTx:any
        let transaction:any
        let broadcastResult:any

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


            client = user.clients['ethereum']
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

            balanceBase = await nativeToBaseAmount('ETH',balanceSdk[0].amount.amount().toString())
            log(tag,"balanceBase: ",balanceBase)
            expect(balanceBase).toBeDefined();

            valueBalanceUsd = await coincap.getValue("ETH",balanceBase)
            log(tag,"valueBalanceUsd: ",valueBalanceUsd)
            expect(valueBalanceUsd).toBeDefined();

            expect(balanceBase).toBeGreaterThan(Number(TEST_AMOUNT));
        });

        it('Get Estimate Fees for swap ', async function() {
            console.log = jest.fn();
            //get estimate
            let asset = {
                chain:"ETH",
                symbol:"ETH",
                ticker:"ETH",
            }

            let estimatePayload = {
                asset:asset,
                amount:balanceBase.toString(),
                recipient: '0xf10e1893b2fd736c40d98a10b3a8f92d97d5095e' // dummy value only used to estimate ETH transfer
            }
            log(tag,"estimatePayload: ",estimatePayload)

            estimateCost = await client.estimateFeesWithGasPricesAndLimits(estimatePayload);
            log(tag,"estimateCost: ",estimateCost)
            expect(estimateCost).toBeDefined();

        });

        it('Get Swap Params from midgard ', async function() {

            //get pool address
            let poolInfo = await midgard.getPoolAddress()

            //filter by chain
            let ethVault = poolInfo.filter((e:any) => e.chain === 'ETH')
            log(tag,"ethVault: ",ethVault)
            expect(ethVault).toBeDefined();

            log(tag,"ethVault: ",ethVault)
            expect(ethVault[0]).toBeDefined();
            ethVault = ethVault[0]
            expect(ethVault.address).toBeDefined();
            expect(ethVault.router).toBeDefined();
            const vaultAddressEth = ethVault.address
            const gasRate = ethVault.gas_rate
            expect(vaultAddressEth).toBeDefined();
            expect(gasRate).toBeDefined();

            swap = {
                inboundAddress: ethVault,
                coin: "ETH",
                asset: "ETH",
                memo: '=:THOR.RUNE:'+FAUCET_RUNE_ADDRESS,
                "amount":{
                    // "type":"BASE",
                    // "decimal":18,
                    //TODO bignum like asgardx?
                    amount: function(){
                        return TEST_AMOUNT
                    }
                },
                noBroadcast:true
            }
        });

        it('Build Swap (init) ', async function() {
            let options:any = {
                verbose: true,
                txidOnResp: false, // txidOnResp is the output format
            }

            let responseSwap = await user.clients.ethereum.buildSwap(swap,options)
            log(tag,"responseSwap: ",responseSwap)
            let invocationId = responseSwap.invocationId
            expect(invocationId).toBeDefined();

            transaction = {
                invocationId,
                context:user.context
            }
        });

        it('Build Swap (with context)', async function() {
            let options:any = {
                verbose: true,
                txidOnResp: false, // txidOnResp is the output format
            }

            let unsignedTx = await buildTransaction(transaction)
            log(tag,"unsignedTx: ",unsignedTx)
            expect(unsignedTx).toBeDefined();

        });

        it('Review Invocation ', async function() {
            //get invocation
            let invocationView1 = await app.getInvocation(invocationId)
            log(tag,"invocationView1: (VIEW) ",invocationView1)
            expect(invocationView1).toBeDefined();
        });

        it('Approve Invocation ', async function() {

            //sign transaction
            signedTx = await approveTransaction(transaction)
            log(tag,"signedTx: ",signedTx)
            expect(signedTx).toBeDefined();
            expect(signedTx.txid).toBeDefined();

        });

        it('Broadcast Invocation ', async function() {

            broadcastResult = await broadcastTransaction(transaction)
            log(tag,"broadcastResult: ",broadcastResult)

        });

        it('Broadcast Invocation ', async function() {

            broadcastResult = await broadcastTransaction(transaction)
            log(tag,"broadcastResult: ",broadcastResult)

        });

        //TODO if !noBroadcast


    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
})
