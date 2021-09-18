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

import {IBCdeposit, Transfer} from "@pioneer-platform/pioneer-types";

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
const TAG  = " | e2e-test | "
const log = require("@pioneer-platform/loggerdog")()
let BigNumber = require('@ethersproject/bignumber')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let wait = require('wait-promise');
let sleep = wait.sleep;

let {
    supportedBlockchains,
    baseAmountToNative,
    nativeToBaseAmount,
} = require("@pioneer-platform/pioneer-coins")

const {
    startApp,
    getContext,
    getWallets,
    getInvocations,
    sendPairingCode,
    buildTransaction,
    approveTransaction,
    broadcastTransaction,
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'cosmos'
let ASSET = 'ATOM'
let MIN_BALANCE = process.env['MIN_BALANCE_ATOM'] || "0.004"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'

let noBroadcast = true

describe(' - e2e test '+BLOCKCHAIN+' ibc deposit - ', function() {
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
        let contextAlpha:string
        let wallets:any
        let app:any
        let eventPairReceived = false
        let eventInvokeTransferReceived = false
        let seedChains = ['ethereum','thorchain','osmosis','cosmos']
        let code:any
        let user:any
        let client:any
        let balanceSdk:any
        let balanceNative:any
        let balanceBase:any
        let masterAddress:string
        let valueBalanceUsd:any
        let estimateCost:any
        let invocationId:string
        let signedTx:any
        let transaction:any
        let broadcastResult:any

        it('Starts Wallet', async function() {
            //start app and get wallet
            wallets = await startApp()
            log(tag,"wallets: ",wallets)
            username = wallets.username
            expect(username).toBeDefined();
        });

        it('gets balance', async function() {

            let appContext = getContext()
            expect(appContext).toBeDefined();

            //get wallets
            let appWallets = getWallets()
            contextAlpha = appWallets[0]
            balance = wallets.wallets[contextAlpha].WALLET_BALANCES[ASSET]
            expect(balance).toBeDefined();
        });

        it('Balance is enough for test', async function() {

            //get balance
            balance = wallets.wallets[contextAlpha].WALLET_BALANCES[ASSET]
            expect(Number(balance)).toBeGreaterThan(Number(MIN_BALANCE));
        });

        it('SDK initialization', async function() {

            let config = {
                queryKey,
                spec,
                wss
            }

            app = new SDK.SDK(spec,config)
            expect(app).toBeDefined();

        });

        it('SDK start events', async function() {
            let events = await app.startSocket()
            eventPairReceived = false
            eventInvokeTransferReceived = false
            events.on('message', async (event:any) => {
                switch(event.type) {
                    case 'pairing':
                        eventPairReceived = true
                        break;
                    case 'transfer':
                        //TODO assert valid transfer info
                        //received continue below
                        eventInvokeTransferReceived = true
                        break;
                    default:
                        console.error("ERROR: event: ",event)
                }
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


            masterAddress = await client.getAddress()
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

            // valueBalanceUsd = await coincap.getValue(ASSET,balanceBase)
            // log(tag,"valueBalanceUsd: ",valueBalanceUsd)
            // expect(valueBalanceUsd).toBeDefined();

            expect(balanceBase).toBeGreaterThan(Number(TEST_AMOUNT));
        });

        it('Build IBC deposit (init) ', async function() {
            //get ibc channels

            //get current block height
            let blockheight = await user.clients[BLOCKCHAIN].getBlockHeight()
            //set expiration at +10000
            let expiration =  blockheight + 10000
            log(tag,"expiration: ",expiration)


            let options:any = {
                verbose: true,
                txidOnResp: false, // txidOnResp is the output format
            }
            let clientOsmosis = user.clients['osmosis']
            let osmosisAddy = await clientOsmosis.getAddress()

            //TODO figure out source_channel
            let source_channel = 'channel-141'
            let source_port = 'transfer'

            /*
                Example
                      "value":{
             "msg":[
                {
                   "type":"cosmos-sdk/MsgTransfer",
                   "value":{
                      "source_port":"transfer",
                      "source_channel":"channel-141",
                      "token":{
                         "denom":"uatom",
                         "amount":"200000"
                      },
                      "sender":"cosmos1a7xqkxa4wyjfllme9u3yztgsz363dalzey4myg",
                      "receiver":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6",
                      "timeout_height":{
                         "revision_number":"1",
                         "revision_height":"841428"
                      }
                   }
                }
             ],

             */

            let customTx:IBCdeposit = {
                context:user.context,
                asset: ASSET,
                network: ASSET,
                memo: '',
                // @ts-ignore
                sender:masterAddress,
                receiver:osmosisAddy,
                source_port,
                source_channel,
                token: {
                    "denom":"uatom",
                    "amount":"10000"
                },
                timeout_height: {
                    "revision_number":"1", //TODO wtf is this?
                    "revision_height":expiration.toString()
                },
                fee:{
                    priority:5, //1-5 5 = highest
                },
                noBroadcast
            }
            log(tag,"customTx: ",customTx)

            let responseTransfer = await user.clients[BLOCKCHAIN].ibcDeposit(customTx,options)
            log(tag,"responseTransfer: ",responseTransfer)
            invocationId = responseTransfer

            transaction = {
                invocationId,
                context:user.context
            }
        });

        //TODO fixme (works in dev)
        // it('App received invocation event', async function() {
        //
        //     let invocationReceived = false
        //     while(!invocationReceived){
        //         await sleep(300)
        //         let invocations = await getInvocations()
        //         log(tag,"invocations: ",invocations)
        //         let invocationEventValue = invocations.filter((invocation: { invocationId: any; }) => invocation.invocationId === invocationId)[0]
        //         if(invocationEventValue){
        //             invocationReceived = true
        //         }
        //     }
        //
        // });

        it('Build transfer (with context)', async function() {

            let unsignedTx = await buildTransaction(transaction)
            log(tag,"unsignedTx: ",unsignedTx)
            expect(unsignedTx).toBeDefined();

        });

        it('Review Invocation 1', async function() {
            //get invocation
            let invocationView = await app.getInvocation(invocationId)
            log(tag,"invocationView1: (VIEW) ",invocationView)
            expect(invocationView).toBeDefined();
            expect(invocationView.state).toBe('builtTx');
        });

        it('Approve Invocation ', async function() {

            //sign transaction
            signedTx = await approveTransaction(transaction)
            log(tag,"signedTx: ",signedTx)
            expect(signedTx).toBeDefined();
            expect(signedTx.txid).toBeDefined();

        });

        it('Review Invocation 2', async function() {
            //get invocation
            let invocationView = await app.getInvocation(invocationId)
            log(tag,"invocationView2: (VIEW) ",invocationView)
            expect(invocationView).toBeDefined();
            expect(invocationView.state).toBe('signedTx');
        });

        it('Broadcast Invocation ', async function() {

            broadcastResult = await broadcastTransaction(transaction)
            log(tag,"broadcastResult: ",broadcastResult)

        });

        it('Review Invocation 3', async function() {
            //get invocation
            let invocationView = await app.getInvocation(invocationId)
            log(tag,"invocationView3: (VIEW) ",invocationView)
            expect(invocationView).toBeDefined();
            if(!noBroadcast){
                expect(invocationView.state).toBe('broadcasted');
            }
        });

        it('Closes Websocket ', async function() {

            let result = await app.stopSocket()
            log(tag,"result: ",result)

        });

        //TODO if !noBroadcast monitor till end\
        //process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
})
