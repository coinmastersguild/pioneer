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
//let coincap = require("@pioneer-platform/coincap")

import {
    Transfer,
    Delegate,
    OsmosisSwap
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
let MIN_BALANCE = process.env['MIN_BALANCE_OSMO'] || "0.004"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let FAUCET_OSMO_ADDRESS = process.env['FAUCET_OSMO_ADDRESS'] || 'osmo1ayn76qwdd5l2d66nu64cs0f60ga7px8zmvng6k'

let TRADE_PAIR  = "ATOM_OSMO"
let INPUT_ASSET = ASSET
let OUTPUT_ASSET = "OSMO"

let noBroadcast = false

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
        // log.debug(tag,"wallets: ",wallets)
        let username = wallets.username
        assert(username)

        let appContext = getContext()
        assert(appContext)
        log.debug(tag,"appContext: ",appContext)

        //get wallets
        let appWallets = getWallets()
        log.debug(tag,"appWallets: ",appWallets)

        //filter wallets with current context
        let walletDescriptionContext = wallets.user.walletDescriptions.filter((e:any) => e.context === appContext)[0]
        log.debug(tag,"walletDescriptionContext: ",walletDescriptionContext)

        //get pubkey
        let pubkey = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === ASSET)[0]
        log.test(tag,"pubkey: ",pubkey.pubkey)
        assert(pubkey)

        //get master output
        let pubkeyOutput = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === OUTPUT_ASSET)[0]
        log.debug(tag,"pubkeyOutput: ",pubkeyOutput.master)
        assert(pubkeyOutput)
        assert(pubkeyOutput.master)

        //balance
        let balance = walletDescriptionContext.balances.filter((e:any) => e.symbol === ASSET)[0]
        log.notice(tag,ASSET+" balance: ",balance.balance)
        log.notice(tag,ASSET+" context: ",balance.context)
        assert(balance)
        assert(balance.balance)


        let master = pubkey.master
        assert(master)

        // //assert balance local
        log.debug(tag,"master: ",master)
        if(balance.balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+master)
            throw Error("101: Low funds!")
        } else {
            log.debug(tag," Attempting e2e test "+ASSET+" balance: ",balance)
        }


        //generate new key
        const queryKey = uuidv4();
        assert(queryKey)

        let config = {
            queryKey,
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

        let seedChains = ['ethereum','thorchain','bitcoin','osmosis','cosmos']
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
        log.debug(tag,"CHECKPOINT 2 pairing")

        //get master
        let masterAddress = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === ASSET)[0]
        masterAddress = masterAddress.pubkey
        log.test(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)
        log.debug(tag,"CHECKPOINT 4 master address")



        //value USD
        //TODO not in coincap yet!
        // let valueBalanceUsd = await coincap.getValue(ASSET,balanceBase)
        // log.debug(tag,"valueBalanceUsd: ",valueBalanceUsd)
        // assert(valueBalanceUsd)

        let balanceBase = walletDescriptionContext.balances.filter((e:any) => e.symbol === ASSET)[0]
        balanceBase = balanceBase.balance
        assert(balanceBase)

        if(balanceBase < TEST_AMOUNT){
            throw Error(" YOUR ARE BROKE! send more test funds into test seed! address: ")
        }

        //estimate BCH fee? lol
        let asset = {
            chain:ASSET,
            symbol:ASSET,
            ticker:ASSET,
        }

        //test amount in native
        let amountTestNative = baseAmountToNative("OSMO",TEST_AMOUNT)

        //swap tokens
        let TOKEN_IN = "ATOM"
        let TOKEN_OUT = "OSMO"

        //get pool
        let poolInfo = await app.getPool(TOKEN_OUT)
        //log.debug(tag,"poolInfo: ",poolInfo)
        assert(poolInfo)

        //TODO dont filter here
        log.debug(tag,"poolInfo: ",poolInfo.pools[0])

        //get route
        let poolId = poolInfo.pools[0].id
        let tokenInDenom = poolInfo.pools[0].poolAssets[0].token.denom
        log.debug(tag,"poolId: ",poolId)
        log.debug(tag,"tokenOutDenom: ",tokenInDenom)

        //get rate
        //TODO

        //get out MIN (slippage)
        let tokenOutMinAmount = "126"
        let tokenOutDenom = 'uosmo'

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        /*
            Example
            OSMO -> ATOM
               "type":"osmosis/gamm/swap-exact-amount-in",
               "value":{
                  "sender":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn",
                  "routes":[
                     {
                        "poolId":"1",
                        "tokenOutDenom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2"
                     }
                  ],
                  "tokenIn":{
                     "denom":"uosmo",
                     "amount":"1000000"
                  },
                  "tokenOutMinAmount":"126"
               }

            ATOM -> OSMO
            {
               "type":"osmosis/gamm/swap-exact-amount-in",
               "value":{
                  "sender":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6",
                  "routes":[
                     {
                        "poolId":"1",
                        "tokenOutDenom":"uosmo"
                     }
                  ],
                  "tokenIn":{
                     "denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                     "amount":"100000"
                  },
                  "tokenOutMinAmount":"620317"
               }
            }

         */

        let swap:any = {
            type:'osmosisswap',
            addressFrom:masterAddress,
            context:app.context,
            asset: ASSET,
            network: ASSET,
            memo: '',
            routes:[{
                poolId,
                tokenOutDenom
            }],
            tokenIn:{
                denom:tokenInDenom,
                amount:amountTestNative.toString()
            },
            tokenOutMinAmount,
            fee:{
                priority:5, //1-5 5 = highest
            },
            noBroadcast
        }
        log.debug(tag,"swap: ",swap)

        //build
        let responseTx = await app.buildTx(swap,options,ASSET)
        assert(responseTx)
        assert(responseTx.HDwalletPayload)
        log.debug(tag,"responseTx: ",responseTx)
        console.timeEnd('start2build');

        //invoke unsigned
        let transaction:any = {
            type:'pioneer',
            fee:{
                priority:3
            },
            unsignedTx:responseTx,
            context:app.context,
            network:ASSET
        }

        //get invocation
        log.debug(tag,"transaction: ",transaction)

        let responseInvoke = await app.invokeUnsigned(transaction,options,ASSET)
        assert(responseInvoke)
        if(!responseInvoke.success){
            assert(responseInvoke.invocationId)
            log.error()
        }
        log.debug(tag,"responseInvoke: ",responseInvoke)
        let invocationId = responseInvoke.invocationId
        transaction.invocationId = invocationId

        //get invocation
        let invocationView1 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
        assert(invocationView1)
        assert(invocationView1.state)
        // assert.equal(invocationView1.state,'builtTx')

        //todo assert state

        //sign transaction
        let signedTx = await approveTransaction(transaction)
        log.debug(tag,"signedTx: ",signedTx)
        assert(signedTx)
        assert(signedTx.txid)
        log.test(tag,"signedTx.txid: ",signedTx.txid)

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
        //wait for confirmation

        if(!noBroadcast){

            log.test(tag,"Broadcasting!")

            let invocationView4 = await app.getInvocation(invocationId)
            log.debug(tag,"invocationView4: (VIEW) ",invocationView4)
            assert(invocationView4)
            assert(invocationView4.state)
            assert.equal(invocationView3.state,'broadcasted')

            /*

                Status codes

                -1: errored
                 0: unknown
                 1: built
                 2: broadcasted
                 3: confirmed
                 4: fullfilled (swap completed)

             */


            //monitor tx lifecycle
            let isConfirmed = false
            let isFullfilled = false
            let fullfillmentTxid = false
            let currentStatus
            let statusCode = 0

            while(!isConfirmed){
                //get invocationInfo
                await sleep(6000)
                let invocationInfo = await app.getInvocation(invocationId)
                log.test(tag,"invocationInfo: ",invocationInfo.state)

                if(invocationInfo && invocationInfo.isConfirmed){
                    log.test(tag,"Confirmed!")
                    statusCode = 3
                    isConfirmed = true
                    log.notice(" TXID fullfillment AND swap = ",invocationInfo.signedTx.txid)
                    console.timeEnd('timeToConfirmed')
                    console.time('confirm2fullfillment')
                } else {
                    log.test(tag,"Not Confirmed!")
                }
            }
        }

        let result = await app.stopSocket()
        log.debug(tag,"result: ",result)

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
