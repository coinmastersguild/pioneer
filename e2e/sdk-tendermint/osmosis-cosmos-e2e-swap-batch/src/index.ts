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

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

const TAG  = " | e2e-test | "
const log = require("log")
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


let TRADE_PAIR  = "OSMO_ATOM"
let INPUT_ASSET = ASSET
let OUTPUT_ASSET = "ATOM"

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

        //assert sdk user
        let usernameSdk = await app.username
        log.debug("app: ",app.username)
        log.debug("usernameSdk: ",usernameSdk)
        assert(usernameSdk)
        assert(usernameSdk,username)



        //value USD
        //TODO not in coincap yet!
        // let valueBalanceUsd = await coincap.getValue(ASSET,balanceBase)
        // log.debug(tag,"valueBalanceUsd: ",valueBalanceUsd)
        // assert(valueBalanceUsd)

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

        //TODO
        //get osmosis channel id
        //let poolInfo = await

        //select first

        //get ibc channels

        // let options:any = {
        //     verbose: true,
        //     txidOnResp: false, // txidOnResp is the output format
        // }
        //

        // let pubkey = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === ASSET)[0]
        // log.test(tag,"pubkey: ",pubkey.pubkey)

        let osmosisAddy = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === OUTPUT_ASSET)[0]
        log.test(tag,"osmosisAddy: ",osmosisAddy)
        assert(osmosisAddy)
        assert(osmosisAddy.pubkey)

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
                      "source_channel":"channel-0",
                      "token":{
                         "denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                         "amount":"100000"
                      },
                      "sender":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn",
                      "receiver":"cosmos1k0kzs2ygjsext3hx7mf00dfrfh8hl3e8utepqp",
                      "timeout_height":{
                         "revision_number":"4",
                         "revision_height":"8146033"
                      }
                   }
                }
             ],

         */

        let customTx:any = {
            context:app.context,
            asset: ASSET,
            network: ASSET,
            memo: '',
            sender:pubkey.pubkey,
            receiver:osmosisAddy.pubkey,
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
        log.debug(tag,"customTx: ",customTx)

        let responseTransfer = await app.ibcDeposit(customTx, {})
        assert(responseTransfer)
        log.test(tag,"responseTransfer: ",responseTransfer)
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
        log.debug(tag,"invocationView3: (VIEW) ",invocationView3)

        //get invocation info
        let isConfirmed = false
        //wait for confirmation

        if(!noBroadcast && false){
            //TODO
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
            let currentStatus
            let statusCode = 0
            let txid

            //wait till confirmed in block
            while(!isConfirmed){
                //get invocationInfo
                let invocationInfo = await app.getInvocation(invocationId)
                log.debug(tag,"invocationInfo: ",invocationInfo)

                txid = invocationInfo.signedTx.txid
                assert(txid)
                if(!currentStatus) currentStatus = 'transaction built!'
                if(statusCode <= 0) statusCode = 1

                //lookup txid
                let txInfo = await app.getTransactionData(txid)
                log.debug(tag,"txInfo: ",txInfo)

                if(txInfo && txInfo.blockNumber){
                    log.debug(tag,"Confirmed!")
                    statusCode = 3
                } else {
                    log.debug(tag,"Not confirmed!")
                    //get gas price recomended

                    //get tx gas price
                }

                await sleep(6000)
            }


            let isFullfilled = false
            //wait till swap is fullfilled
            while(!isFullfilled){
                //get midgard info
                let txInfoMidgard = midgard.getTransaction(txid)
                log.debug(tag,"txInfoMidgard: ",txInfoMidgard)

                //
                if(txInfoMidgard && txInfoMidgard.actions && txInfoMidgard.actions[0]){
                    let depositInfo = txInfoMidgard.actions[0].in
                    log.debug(tag,"deposit: ",depositInfo)

                    let fullfillmentInfo = txInfoMidgard.actions[0].out
                    log.debug(tag,"fullfillmentInfo: ",fullfillmentInfo)

                    if(fullfillmentInfo.status === 'success'){
                        statusCode = 4
                        isFullfilled = true
                    }
                }

                await sleep(6000)
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
