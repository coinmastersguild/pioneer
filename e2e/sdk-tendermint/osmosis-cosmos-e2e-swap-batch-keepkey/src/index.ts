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
let KKSDK = require("@keepkey/keepkey-sdk")

const { NodeWebUSBKeepKeyAdapter } = require('@bithighlander/hdwallet-keepkey-nodewebusb')
const core = require('@shapeshiftoss/hdwallet-core');

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
    // approveTransaction,
    broadcastTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

const BLOCKCHAIN = 'cosmos'
const ASSET = 'ATOM'
const MIN_BALANCE = process.env['MIN_BALANCE_OSMO'] || "0.04"
const TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.001"
const spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
const wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'

let blockchains = [
    'bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin','osmosis'
]


let TRADE_PAIR  = "ATOM_OSMO"
let INPUT_ASSET = ASSET
let OUTPUT_ASSET = "OSMO"

const noBroadcast = false

console.log("spec: ",spec)
console.log("wss: ",wss)

//connect to keepkey
let getDevice = async function(keyring:any) {
    let tag = TAG + " | getDevice | "
    try {
        const keepkeyAdapter = NodeWebUSBKeepKeyAdapter.useKeyring(keyring);
        let wallet = await keepkeyAdapter.pairDevice(undefined, true);
        if (wallet) {
            log.debug(tag,"Device found!")
            log.debug(tag,"wallet: ",wallet)
        }
        return wallet;
    } catch (e) {
        //log.error(tag,"*** e: ",e.toString())
        log.error("failed to get device: ",e)
        //@ts-ignore
        if(e.message.indexOf("no devices found") >= 0){
            return {
                error:true,
                errorCode: 1,
                errorMessage:"No devices"
            }
            //@ts-ignore
        } else if(e.message.indexOf("claimInterface")>= 0){
            return {
                error:true,
                errorCode: -1,
                errorMessage:"Unable to claim!"
            }
        } else {
            return {
                error:true,
                errorMessage:e
            }
        }
    }
}

const test_service = async function () {
    const tag = TAG + " | test_service | "
    try {

        console.time('start2paired');
        console.time('start2build');
        console.time('start2broadcast');
        console.time('start2end');

        //start app and get wallet
        log.debug(tag,"CHECKPOINT 1")
        //connect to keepkey
        const keyring = new core.Keyring();
        log.debug(tag,"CHECKPOINT 2")

        let wallet = await getDevice(keyring);
        log.debug(tag,"wallet: ",wallet)
        log.debug(tag,"CHECKPOINT 3")

        let keepkeySdk
        let pubkeys
        let walletWatch
        if(!wallet.error){
            log.debug(tag,"KKSDK: ",KKSDK)
            keepkeySdk = new KKSDK(wallet,blockchains)
            let pubkeysResp = await keepkeySdk.getPubkeys()
            walletWatch = pubkeysResp.wallet
            pubkeys = pubkeysResp.pubkeys
            log.debug(tag,'pubkeys: ',JSON.stringify(pubkeys))
        } else {
            log.error(" Device error: ",wallet)
            throw Error('wallet error!')
        }

        assert(pubkeys)

        //generate new key
        // const queryKey = "sdk:4339eec1-343a-438f-823a-4f56d1f528c2";
        const queryKey = "sdk:pair-keepkey:"+uuidv4();
        const username = "user:pair-keepkey:"+uuidv4();
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
        let seedChains = ['ethereum','thorchain','bitcoin','osmosis','cosmos']
        let API = await app.init(seedChains)
        assert(API)

        let events = await app.startSocket()
        // let eventPairReceived = false
        // let eventInvokeTransferReceived = false
        // events.on('message', async (event:any) => {
        //     log.debug(tag,"event: ",event)
        //     switch(event.type) {
        //         case 'pairing':
        //             assert(event.queryKey)
        //             assert(event.username)
        //             assert(event.url)
        //             eventPairReceived = true
        //             break;
        //         case 'transfer':
        //             //TODO assert valid transfer info
        //             //received continue below
        //             eventInvokeTransferReceived = true
        //             break;
        //         default:
        //             log.error(tag,"unhandled event: ",event)
        //         // code block
        //     }
        // })

        let pairWalletKeepKey:any = {
            type:'keepkey',
            name:'keepkey',
            format:'keepkey',
            isWatch:'true',
            wallet:keepkeySdk,
            serialized:walletWatch,
            pubkeys:pubkeys,
        }
        log.debug(tag,"pairWalletKeepKey: ",pairWalletKeepKey)
        let registerResult = await app.pairWallet(pairWalletKeepKey)
        log.info("registerResult: ",registerResult)
        assert(registerResult)
        log.info("app: ",app.username)
        log.notice("username: ",username)
        assert(username)
        assert(app)
        assert(app.context)
        assert.equal(username,app.username)

        //sdk info
        log.info("app pubkeys: ",app.pubkeys)
        log.debug("app balances: ",app.balances)
        // log.debug("app balances: ",JSON.stringify(app.balances))
        log.debug("app context: ",app.context)
        assert(app.pubkeys)
        assert(app.balances)
        // assert(app.balances.length > 0)
        assert(app.context)
        log.debug("app balances: ",app.balances)
        if(app.balances.length === 0) throw Error("Invalid balances! empty!")



        //assert sdk user
        let usernameSdk = await app.username
        log.test("app: ",app.username)
        log.test("usernameSdk: ",usernameSdk)
        assert(usernameSdk)
        assert(usernameSdk,username)

        //get channel balance ATOM
        //filter by channels
        let ibcChannels = app.balances.filter((e:any) => e.type === 'ibcChannel')
        log.info(tag,"ibcChannels: ",ibcChannels)

        //filter channels by ATOM
        let atomChannel = ibcChannels.filter((e:any) => e.asset === ASSET)[0]
        log.info(tag,"atomChannel: ",atomChannel)

        let channelNeedsLiquidity = true
        let amountNeeded = parseFloat(TEST_AMOUNT)
        if(atomChannel){
            let channelBalance = atomChannel.balance
            if(channelBalance > TEST_AMOUNT){
                channelNeedsLiquidity = false
                amountNeeded = parseFloat(channelBalance) - parseFloat(TEST_AMOUNT)
                log.notice(tag,"Channel needs more liquidity!: ",amountNeeded)
            }
        }

        assert(app.pubkeys)
        let osmosisAddy = app.pubkeys.filter((e:any) => e.symbol === 'OSMO')[0]
        assert(osmosisAddy)
        assert(osmosisAddy.pubkey)
        osmosisAddy = osmosisAddy.pubkey
        log.notice('osmosisAddy: ',osmosisAddy)

        //if balance AND balance > amount swap
        //skip

        log.notice('channelNeedsLiquidity: ',channelNeedsLiquidity)
        log.notice('amountNeeded: ',amountNeeded)
        assert(app.pubkeys)
        assert(app.context)

        //else deposit difference into channel
        if(channelNeedsLiquidity){
            assert(app.pubkeys)
            //
            let blockheight = await app.getBlockHeight(ASSET)
            log.info(tag,"blockheight: ",blockheight)
            assert(blockheight)
            //set expiration at +10000
            let expiration =  blockheight + 10000
            log.debug(tag,"expiration: ",expiration)
            assert(expiration)

            //get master
            // log.info(tag,"app: ",app)

            assert(app.pubkeys)
            let masterAddress = app.pubkeys.filter((e:any) => e.symbol === ASSET)[0]
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
            log.debug(tag,"amountNeeded: ",amountNeeded)

            //convert to base
            let amountNative = baseAmountToNative('OSMO',amountNeeded)
            log.info(tag,"amountNative: ",amountNative)
            assert(amountNative)
            assert(app)
            assert(app.context)

            let customTx:any = {
                type:'ibcdeposit',
                addressFrom:masterAddress,
                context:app.context,
                asset: ASSET,
                network: ASSET,
                memo: '',
                sender:masterAddress,
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
            log.info(tag,"customTx: ",customTx)

            //build ibcTx
            //build
            let responseTx = await app.buildTx(customTx,options,ASSET)
            assert(responseTx)
            assert(responseTx.HDwalletPayload)
            log.info(tag,"responseTx: ",responseTx)
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
            log.info(tag,"customTx: ",customTx)


            let responseInvoke = await app.invokeUnsigned(transaction,options,ASSET)
            assert(responseInvoke)
            // if(!responseInvoke.success){
            //     assert(responseInvoke.invocationId)
            //     log.error("Failed to invoke!",responseInvoke)
            //     throw Error('Failed to invoke')
            // }
            log.info(tag,"responseInvoke: ",responseInvoke)
            let invocationId = responseInvoke.invocationId



            //get invocation
            let invocationView1 = await app.getInvocation(invocationId)
            log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
            assert(invocationView1)
            assert(invocationView1.state)

            //todo assert state
            assert(invocationView1)
            assert(invocationView1.state)
            assert(invocationView1.invocation)
            assert(invocationView1.invocation.unsignedTx)
            assert(invocationView1.invocation.unsignedTx.HDwalletPayload)

            //sign transaction
            let signedTx = await app.signTx(invocationView1.invocation.unsignedTx)
            log.debug(tag,"signedTx: ",signedTx)
            assert(signedTx)
            // assert(signedTx.txid)

            //updateTx
            let updateBody = {
                network:ASSET,
                invocationId,
                invocation:invocationView1,
                unsignedTx:responseTx,
                signedTx
            }

            //update invocation remote
            let resultUpdate = await app.updateInvocation(updateBody)
            assert(resultUpdate)
            log.debug(tag,"resultUpdate: ",resultUpdate)

            //get invocation
            let invocationView2 = await app.getInvocation(invocationId)
            assert(invocationView2)
            assert(invocationView2.state)
            assert.equal(invocationView2.state,'signedTx')
            log.debug(tag,"invocationView2: (VIEW) ",invocationView2)

            //broadcast transaction
            let broadcastResult = await broadcastTransaction(updateBody)
            log.debug(tag,"broadcastResult: ",broadcastResult)

            let invocationView3 = await app.getInvocation(invocationId)
            assert(invocationView3)
            assert(invocationView3.state)
            assert.equal(invocationView3.state,'broadcasted')
            log.debug(tag,"invocationView3: (VIEW) ",invocationView3)

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
        // //verify balance
        //
        // // if(balanceBase < TEST_AMOUNT){
        // //     throw Error(" YOUR ARE BROKE! send more test funds into test seed! address: ")
        // // }
        //
        // //get current block height
        // let blockheight = await app.getBlockHeight(OUTPUT_ASSET)
        // log.test(tag,"blockheight: ",blockheight)
        // assert(blockheight)
        // //set expiration at +10000
        // let expiration =  blockheight + 10000
        // log.test(tag,"expiration: ",expiration)
        // assert(expiration)
        //
        // //test amount in native
        // let amountTestNative = baseAmountToNative("OSMO",parseFloat(TEST_AMOUNT))
        //
        // //swap tokens
        // let TOKEN_IN = "ATOM"
        // let TOKEN_OUT = "OSMO"
        //
        // //get pool
        // let poolInfo = await app.getPool(TOKEN_OUT)
        // //log.debug(tag,"poolInfo: ",poolInfo)
        // assert(poolInfo)
        //
        // //TODO dont filter here
        // log.debug(tag,"poolInfo: ",poolInfo.pools[0])
        //
        // //get route
        // let poolId = poolInfo.pools[0].id
        // let tokenInDenom = poolInfo.pools[0].poolAssets[0].token.denom
        // log.debug(tag,"poolId: ",poolId)
        // log.debug(tag,"tokenOutDenom: ",tokenInDenom)
        //
        // //get rate
        // //TODO
        //
        // //get out MIN (slippage)
        // let tokenOutMinAmount = "126"
        // let tokenOutDenom = 'uosmo'
        //
        // let options:any = {
        //     verbose: true,
        //     txidOnResp: false, // txidOnResp is the output format
        // }
        //
        // /*
        //     ATOM -> OSMO
        //     {
        //        "type":"osmosis/gamm/swap-exact-amount-in",
        //        "value":{
        //           "sender":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6",
        //           "routes":[
        //              {
        //                 "poolId":"1",
        //                 "tokenOutDenom":"uosmo"
        //              }
        //           ],
        //           "tokenIn":{
        //              "denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
        //              "amount":"100000"
        //           },
        //           "tokenOutMinAmount":"620317"
        //        }
        //     }
        //
        //  */
        //
        // let swap:any = {
        //     type:'osmosisswap',
        //     addressFrom:osmosisAddy,
        //     context:app.context,
        //     asset: OUTPUT_ASSET,
        //     network: OUTPUT_ASSET,
        //     memo: '',
        //     routes:[{
        //         poolId,
        //         tokenOutDenom
        //     }],
        //     tokenIn:{
        //         denom:tokenInDenom,
        //         amount:amountTestNative.toString()
        //     },
        //     tokenOutMinAmount,
        //     fee:{
        //         priority:5, //1-5 5 = highest
        //     },
        //     noBroadcast
        // }
        // log.debug(tag,"swap: ",swap)
        //
        // //build
        // let responseTx = await app.buildTx(swap)
        // assert(responseTx)
        // assert(responseTx.HDwalletPayload)
        // log.debug(tag,"responseTx: ",responseTx)
        // console.timeEnd('start2build');
        //
        // //invoke unsigned
        // let transaction:any = {
        //     type:'pioneer',
        //     fee:{
        //         priority:3
        //     },
        //     unsignedTx:responseTx,
        //     context:app.context,
        //     network:OUTPUT_ASSET //TODO catch when this is wrong, osmo/atom mixxed up
        // }
        //
        // //get invocation
        // log.debug(tag,"transaction: ",transaction)
        //
        // let responseInvoke = await app.invokeUnsigned(transaction,options,OUTPUT_ASSET)
        // assert(responseInvoke)
        // if(!responseInvoke.success){
        //     assert(responseInvoke.invocationId)
        //     log.error()
        // }
        // log.debug(tag,"responseInvoke: ",responseInvoke)
        // let invocationId = responseInvoke.invocationId
        // transaction.invocationId = invocationId
        //
        // //get invocation
        // let invocationView1 = await app.getInvocation(invocationId)
        // log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
        // assert(invocationView1)
        // assert(invocationView1.state)
        // // assert.equal(invocationView1.state,'builtTx')
        //
        // //verify sequence
        // log.debug(tag,"osmosisAddy: ",osmosisAddy.pubkey)
        // let masterInfo = await API.GetAccountInfo({network:'OSMO',address:osmosisAddy.pubkey})
        // masterInfo = masterInfo.data
        // log.debug(tag,"masterInfo.result: ",masterInfo.result)
        // log.debug(tag,"masterInfo.result: ",masterInfo.result.value)
        // log.debug(tag,"masterInfo.result: ",masterInfo.result.value.sequence)
        // let sequenceVerify = masterInfo.result.value.sequence
        //
        // assert(sequenceVerify)
        // assert(invocationView1.unsignedTx.HDwalletPayload.sequence)
        // assert.equal(sequenceVerify,invocationView1.unsignedTx.HDwalletPayload.sequence)
        // assert(masterInfo)
        //
        // log.debug(tag,"masterInfo: ",masterInfo)
        // //todo assert state
        //
        // assert(invocationView1)
        // assert(invocationView1.state)
        // assert(invocationView1.invocation)
        // assert(invocationView1.invocation.unsignedTx)
        // assert(invocationView1.invocation.unsignedTx.HDwalletPayload)
        //
        // //sign transaction
        // let signedTx = await app.signTx(invocationView1.invocation.unsignedTx)
        // log.debug(tag,"signedTx: ",signedTx)
        // assert(signedTx)
        // assert(signedTx.txid)
        // log.test(tag,"signedTx.txid: ",signedTx.txid)
        //
        // //get invocation
        // let invocationView2 = await app.getInvocation(invocationId)
        // assert(invocationView2)
        // assert(invocationView2.state)
        // assert.equal(invocationView2.state,'signedTx')
        // log.debug(tag,"invocationView2: (VIEW) ",invocationView2)
        //
        // //broadcast transaction
        // let broadcastResult = await broadcastTransaction(transaction)
        // log.debug(tag,"broadcastResult: ",broadcastResult)
        //
        // let invocationView3 = await app.getInvocation(invocationId)
        // assert(invocationView3)
        // assert(invocationView3.state)
        // assert.equal(invocationView3.state,'broadcasted')
        // log.debug(tag,"invocationView3: (VIEW) ",invocationView3)
        //
        // //get invocation info EToC
        // //wait for confirmation
        //
        // if(!noBroadcast){
        //
        //     log.test(tag,"Broadcasting!")
        //
        //     let invocationView4 = await app.getInvocation(invocationId)
        //     log.debug(tag,"invocationView4: (VIEW) ",invocationView4)
        //     assert(invocationView4)
        //     assert(invocationView4.state)
        //     assert.equal(invocationView3.state,'broadcasted')
        //
        //     /*
        //
        //         Status codes
        //
        //         -1: errored
        //          0: unknown
        //          1: built
        //          2: broadcasted
        //          3: confirmed
        //          4: fullfilled (swap completed)
        //
        //      */
        //
        //
        //     //monitor tx lifecycle
        //     let isConfirmed = false
        //     let isFullfilled = false
        //     let fullfillmentTxid = false
        //     let currentStatus
        //     let statusCode = 0
        //
        //     while(!isConfirmed){
        //         //get invocationInfo
        //         await sleep(6000)
        //         let invocationInfo = await app.getInvocation(invocationId)
        //         log.test(tag,"invocationInfo: ",invocationInfo.state)
        //
        //         if(invocationInfo && invocationInfo.isConfirmed){
        //             log.test(tag,"Confirmed!")
        //             statusCode = 3
        //             isConfirmed = true
        //             log.notice(" TXID fullfillment AND swap = ",invocationInfo.signedTx.txid)
        //             console.timeEnd('timeToConfirmed')
        //             console.time('confirm2fullfillment')
        //         } else {
        //             log.test(tag,"Not Confirmed!")
        //         }
        //     }
        // }

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
