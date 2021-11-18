/*
    E2E testing
        k8  "job" pattern

    Osmo batched swap tx's

    load test seed

    verify empty

    build sign broadcast swap

    watch till confirmed

    report to leeroy server results



    SDK Arch pattern ***

        Start and configure app

        verify socket connection




 */

import {baseAmountToNative} from "@pioneer-platform/pioneer-coins/lib";

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

const TAG  = " | e2e-test | "
const log = require("@pioneer-platform/loggerdog")()
const assert = require('assert')
import {v4 as uuidv4} from 'uuid';
const SDK = require('@pioneer-platform/pioneer-sdk')
const wait = require('wait-promise');
const sleep = wait.sleep;
const midgard = require("@pioneer-platform/midgard-client")

import {
    IBCdeposit
} from "@pioneer-platform/pioneer-types";

const {
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

const BLOCKCHAIN = 'cosmos'
const ASSET = 'ATOM'
const MIN_BALANCE = process.env['MIN_BALANCE_OSMO'] || "0.04"
const TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.001"
const spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
const wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'


let TRADE_PAIR  = "ATOM_OSMO"
let INPUT_ASSET = ASSET
let OUTPUT_ASSET = "OSMO"

const noBroadcast = false

console.log("spec: ",spec)
console.log("wss: ",wss)

const test_service = async function () {
    const tag = TAG + " | test_service | "
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
        assert(balance)
        assert(balance.balance)
        log.notice(tag,ASSET+" balance: ",balance.balance)
        log.notice(tag,ASSET+" context: ",balance.context)

        let master = pubkey.master
        assert(master)

        let osmosisAddy = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === OUTPUT_ASSET)[0]
        log.test(tag,"osmosisAddy: ",osmosisAddy)
        assert(osmosisAddy)
        assert(osmosisAddy.pubkey)

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
        let API = await app.init(seedChains)
        assert(API)

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

        //assert sdk user
        let usernameSdk = await app.username
        log.debug("app: ",app.username)
        log.debug("usernameSdk: ",usernameSdk)
        assert(usernameSdk)
        assert(usernameSdk,username)

        //get channel balance ATOM
        //filter by channels
        let ibcChannels = walletDescriptionContext.balances.filter((e:any) => e.type === 'ibcChannel')
        log.info(tag,"ibcChannels: ",ibcChannels)

        //filter channels by ATOM
        let atomChannel = ibcChannels.filter((e:any) => e.asset === ASSET)[0]
        log.info(tag,"atomChannel: ",atomChannel)

        let channelNeedsLiquidity = true
        let amountNeeded = 0
        if(atomChannel){
            let channelBalance = atomChannel.balance
            if(channelBalance > TEST_AMOUNT){
                channelNeedsLiquidity = false
                amountNeeded = parseFloat(channelBalance) - parseFloat(TEST_AMOUNT)
                log.notice(tag,"Channel needs more liquidity!: ",amountNeeded)
            }
        }



        //if balance AND balance > amount swap
            //skip

        //else deposit difference into channel
        if(channelNeedsLiquidity){

            //
            let blockheight = await app.getBlockHeight(ASSET)
            log.debug(tag,"blockheight: ",blockheight)
            assert(blockheight)
            //set expiration at +10000
            let expiration =  blockheight + 10000
            log.debug(tag,"expiration: ",expiration)
            assert(expiration)

            //get master
            let masterAddress = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === ASSET)[0]
            masterAddress = masterAddress.pubkey
            log.test(tag,"masterAddress: ",masterAddress)
            assert(masterAddress)
            log.debug(tag,"CHECKPOINT 4 master address")


            //TODO
            //get osmosis channel id
            //let poolInfo = await

            //select first

            //get ibc channels

            let options:any = {
                verbose: true,
                txidOnResp: false, // txidOnResp is the output format
            }

            log.debug(tag,"osmosisAddy: ",osmosisAddy)
            assert(osmosisAddy)

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

            //
            log.info(tag,"amountNeeded: ",amountNeeded)

            //convert to base
            let amountNative = baseAmountToNative('OSMO',amountNeeded)
            log.info(tag,"amountNative: ",amountNative)
            assert(amountNative)


            let customTx:any = {
                context:app.context,
                asset: ASSET,
                network: ASSET,
                memo: '',
                sender:master,
                receiver:osmosisAddy,
                source_port,
                source_channel,
                token: {
                    "denom":"uatom",
                    "amount":amountNative
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
            log.debug(tag,"customTx: ",customTx)

            let responseTransfer = await app.ibcDeposit(customTx,ASSET)
            assert(responseTransfer)
            log.debug(tag,"responseTransfer: ",responseTransfer)
            let invocationId = responseTransfer
            //do not continue without invocationId
            assert(invocationId)

            //wait until app get's invocation event
            let invocationReceived = false
            while(!invocationReceived){
                await sleep(1000)
                let invocations = await getInvocations()
                log.debug(tag,"invocations: ",invocations)
                let invocationEventValue = invocations.filter((invocation: { invocationId: any; }) => invocation.invocationId === invocationId)[0]
                log.debug(tag,"invocationEventValue: ",invocationEventValue)
                if(invocationEventValue){
                    assert(invocationEventValue.invocationId)
                    invocationReceived = true
                }
            }

            let transaction = {
                invocationId,
                context:app.context
            }

            //build
            let unsignedTx = await buildTransaction(transaction)
            log.debug(tag,"unsignedTx: ",unsignedTx)
            assert(unsignedTx)

            //get invocation
            let invocationView1 = await app.getInvocation(invocationId)
            log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
            assert(invocationView1)
            assert(invocationView1.state)
            assert.equal(invocationView1.state,'builtTx')

            //todo assert state

            //sign transaction
            let signedTx = await approveTransaction(transaction)
            log.debug(tag,"signedTx: ",signedTx)
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
            log.info(tag,"invocationView3: (VIEW) ",invocationView3)

            //get invocation info
            let isConfirmed = false
            //wait for confirmation

            if(!noBroadcast){
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
                        console.timeEnd('timeToConfirmed')
                        console.time('confirm2fullfillment')
                    } else {
                        log.test(tag,"Not Confirmed!")
                    }

                }
            }
        }
        log.test("CHECKPOINT BUILD SWAP")
        //verify balance

        // if(balanceBase < TEST_AMOUNT){
        //     throw Error(" YOUR ARE BROKE! send more test funds into test seed! address: ")
        // }

        //get current block height
        let blockheight = await app.getBlockHeight(OUTPUT_ASSET)
        log.test(tag,"blockheight: ",blockheight)
        assert(blockheight)
        //set expiration at +10000
        let expiration =  blockheight + 10000
        log.test(tag,"expiration: ",expiration)
        assert(expiration)

        //test amount in native
        let amountTestNative = baseAmountToNative("OSMO",parseFloat(TEST_AMOUNT))

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
            addressFrom:osmosisAddy.pubkey,
            context:app.context,
            asset: OUTPUT_ASSET,
            network: OUTPUT_ASSET,
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
        log.info(tag,"swap: ",swap)

        //build
        let responseTx = await app.buildTx(swap)
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
            network:OUTPUT_ASSET //TODO catch when this is wrong, osmo/atom mixxed up
        }

        //get invocation
        log.debug(tag,"transaction: ",transaction)

        let responseInvoke = await app.invokeUnsigned(transaction,options,OUTPUT_ASSET)
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
        log.info(tag,"invocationView1: (VIEW) ",invocationView1)
        assert(invocationView1)
        assert(invocationView1.state)
        // assert.equal(invocationView1.state,'builtTx')

        //verify sequence
        log.info(tag,"osmosisAddy: ",osmosisAddy.pubkey)
        let masterInfo = await API.GetAccountInfo({network:'OSMO',address:osmosisAddy.pubkey})
        masterInfo = masterInfo.data
        log.info(tag,"masterInfo.result: ",masterInfo.result)
        log.info(tag,"masterInfo.result: ",masterInfo.result.value)
        log.info(tag,"masterInfo.result: ",masterInfo.result.value.sequence)
        let sequenceVerify = masterInfo.result.value.sequence

        assert(sequenceVerify)
        assert(invocationView1.unsignedTx.HDwalletPayload.sequence)
        assert.equal(sequenceVerify,invocationView1.unsignedTx.HDwalletPayload.sequence)
        assert(masterInfo)

        log.info(tag,"masterInfo: ",masterInfo)
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
