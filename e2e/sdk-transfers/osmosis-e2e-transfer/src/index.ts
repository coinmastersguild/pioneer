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
let BigNumber = require('@ethersproject/bignumber')
let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let wait = require('wait-promise');
let sleep = wait.sleep;
let midgard = require("@pioneer-platform/midgard-client")
// let coincap = require("@pioneer-platform/coincap")

import {
    Transfer
} from "@pioneer-platform/pioneer-types";

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
    broadcastTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'osmosis'
let ASSET = 'OSMO'
let MIN_BALANCE = process.env['MIN_BALANCE_OSMO'] || "0.04"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let FAUCET_OSMO_ADDRESS = process.env['FAUCET_OSMO_ADDRESS'] || 'osmo1ayn76qwdd5l2d66nu64cs0f60ga7px8zmvng6k'

let noBroadcast = true

console.log("spec: ",spec)
console.log("wss: ",wss)

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {
        console.time('start2paired');
        console.time('start2build');
        console.time('start2broadcast');
        console.time('start2end');

        //start app and get wallet
        let wallets = await startApp()
        log.info(tag,"wallets: ",wallets)
        let username = wallets.username
        assert(username)

        let appContext = getContext()
        assert(appContext)
        log.info(tag,"appContext: ",appContext)

        //get wallets
        let appWallets = getWallets()
        let contextAlpha = appWallets[0]
        log.info(tag,"wallets.wallets[contextAlpha].WALLET_BALANCES: ",wallets.wallets[contextAlpha].WALLET_BALANCES)

        let balance = wallets.wallets[contextAlpha].WALLET_BALANCES.filter((e:any) => e.symbol === ASSET)[0]
        log.info(tag,"balance: ",balance)
        assert(balance)
        assert(balance.balance)
        balance = balance.balance

        let masterAddress = wallets.wallets[contextAlpha].getAddress(ASSET)
        log.info(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)

        //assert balance local
        //log.debug(tag,"wallet: ",wallet)
        if(balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+masterAddress)
            throw Error("101: Low funds!")
        } else {
            log.test(tag," Attempting e2e test "+ASSET+" balance: ",balance)
        }
        log.info(tag,"CHECKPOINT 1 balance check")


        //generate new key
        const queryKey = "sdk:pair-keepkey:"+uuidv4();
        if(!username) username = "user:pair-pioneer:"+uuidv4();
        assert(queryKey)
        assert(username)

        let config = {
            queryKey,
            username,
            spec,
            wss
        }
        log.debug(tag,"config: ",config)
        let app = new SDK.SDK(spec,config)
        let events = await app.startSocket()
        let eventPairReceived = false
        let eventInvokeTransferReceived = false
        events.on('message', async (event:any) => {
            log.debug(tag,"event: ",event)
            switch(event.type) {
                case 'pairing':
                    assert(event.queryKey)
                    assert(event.username)
                    assert(event.url)
                    eventPairReceived = true
                    break;
                case 'unsignedHook':
                    //TODO assert valid transfer info
                    //received continue below
                    eventInvokeTransferReceived = true
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

        let seedChains = ['ethereum','thorchain','bitcoin','osmosis']
        await app.init(seedChains)

        //pair sdk
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
            //TODO timeout & fail?
        }
        log.test(tag,"CHECKPOINT 2 pairing")

        let asset = {
            chain:ASSET,
            symbol:ASSET,
            ticker:ASSET,
        }

        //test amount in native
        let amountTestNative = baseAmountToNative("OSMO",TEST_AMOUNT)

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        let transfer:any = {
            type:'transfer',
            addressFrom:masterAddress,
            context:app.context,
            recipient: FAUCET_OSMO_ADDRESS,
            asset: ASSET,
            network: ASSET,
            memo: '',
            "amount":amountTestNative,
            fee:{
                priority:5, //1-5 5 = highest
            },
            noBroadcast
        }
        log.debug(tag,"transfer: ",transfer)

        let responseTx = await app.buildTx(transfer,options,ASSET)
        assert(responseTx)
        assert(responseTx.HDwalletPayload)
        log.info(tag,"responseTx: ",responseTx)
        console.timeEnd('start2build');
        //invoke unsigned
        let transaction:any = {
            type:transfer.type,
            fee:{
                priority:3
            },
            unsignedTx:responseTx,
            context:app.context,
            network:ASSET
        }


        //get invocation
        log.info(tag,"transaction: ",transaction)


        let responseInvoke = await app.invokeUnsigned(transaction,options,ASSET)
        assert(responseInvoke)
        log.info(tag,"responseInvoke: ",responseInvoke)
        let invocationId = responseInvoke.invocationId
        assert(invocationId)
        transaction.invocationId = invocationId

        //wait until app get's invocation event
        //TODO
        // let invocationReceived = false
        // while(!invocationReceived){
        //     await sleep(1000)
        //     let invocations = await getInvocations()
        //     log.debug(tag,"invocations: ",invocations)
        //     let invocationEventValue = invocations.filter((invocation: { invocationId: any; }) => invocation.invocationId === invocationId)[0]
        //     log.debug(tag,"invocationEventValue: ",invocationEventValue)
        //     if(invocationEventValue){
        //         assert(invocationEventValue.invocationId)
        //         invocationReceived = true
        //     }
        // }

        //get invocation
        // let invocationView1 = await app.getInvocation(invocationId)
        // log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
        // assert(invocationView1)
        // assert(invocationView1.state)
        // assert.equal(invocationView1.state,'builtTx')

        //todo assert state

        //sign transaction
        let signedTx = await approveTransaction(transaction)
        log.info(tag,"signedTx: ",signedTx)
        assert(signedTx)
        // assert(signedTx.txid)

        //get invocation
        let invocationView2 = await app.getInvocation(invocationId)
        assert(invocationView2)
        assert(invocationView2.state)
        assert.equal(invocationView2.state,'signedTx')
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        let broadcastResult = await broadcastTransaction(transaction)
        log.debug(tag,"broadcastResult: ",broadcastResult)

        let invocationView3 = await app.getInvocation(invocationId)
        assert(invocationView3)
        assert(invocationView3.state)
        assert.equal(invocationView3.state,'broadcasted')
        log.debug(tag,"invocationView3: (VIEW) ",invocationView3)

        //get invocation info EToC
        let isConfirmed = false
        //wait for confirmation

        // if(!noBroadcast){
        //     //TODO
        //     /*
        //         Status codes
        //
        //         -1: errored
        //          0: unknown
        //          1: built
        //          2: broadcasted
        //          3: confirmed
        //          4: fullfilled (swap completed)
        //      */
        //
        //     //monitor tx lifecycle
        //     let currentStatus
        //     let statusCode = 0
        //     let txid
        //
        //     //wait till confirmed in block
        //     while(!isConfirmed){
        //         //get invocationInfo
        //         let invocationInfo = await app.getInvocation(invocationId)
        //         log.debug(tag,"invocationInfo: ",invocationInfo)
        //
        //         txid = invocationInfo.signedTx.txid
        //         assert(txid)
        //         if(!currentStatus) currentStatus = 'transaction built!'
        //         if(statusCode <= 0) statusCode = 1
        //
        //         //lookup txid
        //         let txInfo = await client.getTransactionData(txid)
        //         log.debug(tag,"txInfo: ",txInfo)
        //
        //         if(txInfo && txInfo.blockNumber){
        //             log.debug(tag,"Confirmed!")
        //             statusCode = 3
        //         } else {
        //             log.debug(tag,"Not confirmed!")
        //             //get gas price recomended
        //
        //             //get tx gas price
        //         }
        //
        //         await sleep(6000)
        //     }
        //
        //
        //     let isFullfilled = false
        //     //wait till swap is fullfilled
        //     while(!isFullfilled){
        //         //get midgard info
        //         let txInfoMidgard = midgard.getTransaction(txid)
        //         log.debug(tag,"txInfoMidgard: ",txInfoMidgard)
        //
        //         //
        //         if(txInfoMidgard && txInfoMidgard.actions && txInfoMidgard.actions[0]){
        //             let depositInfo = txInfoMidgard.actions[0].in
        //             log.debug(tag,"deposit: ",depositInfo)
        //
        //             let fullfillmentInfo = txInfoMidgard.actions[0].out
        //             log.debug(tag,"fullfillmentInfo: ",fullfillmentInfo)
        //
        //             if(fullfillmentInfo.status === 'success'){
        //                 statusCode = 4
        //                 isFullfilled = true
        //             }
        //         }
        //
        //         await sleep(6000)
        //     }
        //
        //
        // }

        // let result = await app.stopSocket()
        // log.debug(tag,"result: ",result)

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
