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

import {Transfer} from "@pioneer-platform/pioneer-types";

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let BigNumber = require('@ethersproject/bignumber')
const TAG  = " | e2e-test | "
const log = require("log")

let assert = require('assert')
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
    buildTransaction,
    approveTransaction,
    broadcastTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'bitcoinCash'
let ASSET = 'BCH'
let MIN_BALANCE = process.env['MIN_BALANCE_RUNE'] || "0.004"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC']
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let wss = process.env['URL_PIONEER_SOCKET']
//let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj'

let TRADE_PAIR  = "BCH_LTC"
let INPUT_ASSET = ASSET
let OUTPUT_ASSET = "LTC"

let noBroadcast = true

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

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
        log.debug(tag,"pubkey: ",pubkey)
        assert(pubkey)

        //get master output
        let pubkeyOutput = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === OUTPUT_ASSET)[0]
        log.debug(tag,"pubkeyOutput: ",pubkeyOutput.master)
        assert(pubkeyOutput)
        assert(pubkeyOutput.master)

        //balance
        let balance = walletDescriptionContext.balances.filter((e:any) => e.symbol === ASSET)[0]
        log.debug(tag,"balance: ",balance)
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
            //username,
            spec,
            wss
        }

        let app = new SDK.SDK(spec,config)
        let events = await app.startSocket()
        let eventPairReceived = false
        events.on('message', async (request:any) => {
            assert(request.queryKey)
            assert(request.username)
            assert(request.url)
            eventPairReceived = true
        })

        let seedChains = ['ethereum','thorchain','bitcoincash']
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
        }

        //assert sdk user
        let usernameSdk = await app.username
        log.debug("app: ",app.username)
        log.test("usernameSdk: ",usernameSdk)
        assert(usernameSdk)
        assert(usernameSdk,username)

        await app.updateContext()

        //verify context
        log.test("app.context: ",app.context)
        assert(app.context)

        //TODO estimate cost
        // assert(estimateCost)

        //max cost - balance

        //you have x max amount spendable

        //you are attempting to spend x

        //this is x percent of total available

        //estimate output fee?

        //get pool address
        let poolInfo = await midgard.getPoolAddress()
        assert(poolInfo)
        log.debug(tag,"poolInfo: ",poolInfo)

        //filter by chain
        let thorVault = poolInfo.filter((e:any) => e.chain === ASSET)
        assert(thorVault)
        log.debug(tag,"thorVault: ",thorVault)

        log.debug(tag,"thorVault: ",thorVault)
        assert(thorVault[0])
        thorVault = thorVault[0]
        assert(thorVault.address)

        const vaultAddress = thorVault.address
        const gasRate = thorVault.gas_rate
        assert(vaultAddress)
        assert(gasRate)

        //test amount in native
        let amountTestNative = baseAmountToNative(ASSET,TEST_AMOUNT)
        assert(amountTestNative)

        //get rate from thorchain
        let markets = app.markets
        assert(markets)
        log.debug(tag,"markets: ",markets)
        log.debug(tag,"markets: ",markets.exchanges)
        log.debug(tag,"markets: ",markets.exchanges.markets)
        let marketInfo = markets.exchanges.markets.filter((e:any) => e.pair == TRADE_PAIR)
        log.debug(tag,"marketInfo: ",marketInfo)
        assert(marketInfo)
        //todo handle multi?
        marketInfo = marketInfo[0]
        assert(marketInfo)
        log.debug(tag,"marketInfo: ",marketInfo)

        //amountOut = amountIn * rate
        let amountOut = parseFloat(TEST_AMOUNT) * marketInfo.rate
        assert(amountOut)

        //estimate output
        log.debug(tag,"amountOut: ",amountOut)

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        let transfer:Transfer = {
            context:app.context,
            recipient: vaultAddress,
            fee:{
                // gasLimit: 20000,
                priority:3, //1-5 5 = highest
            },
            asset: ASSET,
            network: ASSET,
            memo: '=:LTC.LTC:'+pubkeyOutput.master,
            "amount":{
                // "type":"BASE",
                // "decimal":18,
                amount: function(){
                    return BigNumber.BigNumber.from(amountTestNative)
                }
            },
        }
        if(noBroadcast) transfer.noBroadcast = true
        log.debug(tag,"transfer: ",transfer)

        //if monitor
        //let invocationId = "pioneer:invocation:v0.01:ETH:sKxuLRKdaCKHHKAJ1t4iYm"

        // let responseTransfer = await user.clients[BLOCKCHAIN].transfer(transfer,options)
        // log.debug(tag,"responseTransfer: ",responseTransfer)

        //build swap
        let responseTransfer = await app.transfer(transfer,options,ASSET)
        log.debug(tag,"responseTransfer: ",responseTransfer)

        let invocationId = responseTransfer

        //do not continue without invocationId
        assert(invocationId)

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

        //sign transaction
        let signedTx = await approveTransaction(transaction)
        log.debug(tag,"signedTx: ",signedTx)
        assert(signedTx)
        // assert(signedTx.txid)

        //get invocation
        let invocationView2 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        // let broadcastResult = await broadcastTransaction(transaction)
        // log.debug(tag,"broadcastResult: ",broadcastResult)
        //
        // let invocationView3 = await app.getInvocation(invocationId)
        // log.debug(tag,"invocationView3: (VIEW) ",invocationView3)

        //get invocation info EToC

        let isConfirmed = false
        //wait for confirmation

        if(!noBroadcast){
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

            let isFullfilled = false
            let fullfillmentTxid
            let currentStatus
            let statusCode = 0

            while(!isConfirmed && !isFullfilled){
                //get invocationInfo
                await sleep(10000)
                let invocationInfo = await app.getInvocation(invocationId)
                log.debug(tag,"invocationInfo: ",invocationInfo)


                if(invocationInfo && invocationInfo.isConfirmed){
                    log.debug(tag,"Confirmed!")
                    statusCode = 3
                    isConfirmed = true
                } else if(invocationInfo && invocationInfo.isConfirmed && invocationInfo.isFullfilled) {
                    log.debug(tag,"Not confirmed!")
                    fullfillmentTxid = invocationInfo.fullfillmentTxid
                    isFullfilled = true
                    //get tx gas price
                }
            }


            //monitor tx lifecycle
            // let currentStatus
            // let statusCode = 0
            // while(!isConfirmed){
            //     //get invocationInfo
            //     let invocationInfo = await app.getInvocation(invocationId)
            //     log.debug(tag,"invocationInfo: ",invocationInfo)
            //
            //     let txid = invocationInfo.signedTx.txid
            //     assert(txid)
            //     if(!currentStatus) currentStatus = 'transaction built!'
            //     if(statusCode <= 0) statusCode = 1
            //
            //     //lookup txid
            //     let txInfo = await app.getTransactionData(txid)
            //     log.debug(tag,"txInfo: ",txInfo)
            //
            //     if(txInfo.blockNumber){
            //         log.debug(tag,"Confirmed!")
            //
            //     } else {
            //         log.debug(tag,"Not confirmed!")
            //         //get gas price recomended
            //
            //         //get tx gas price
            //     }
            //
            //     //get midgard info
            //     let txInfoMidgard =
            //     //update invocation
            //
            //     //if
            //     // let txInfo = await user.clients.bitcoinCash.getTransactionData(txid)
            //     // log.debug(tag,"txInfo: ",txInfo)
            //     //
            //     // if(txInfo.confirmations > 0){
            //     //     isConfirmed = true
            //     // }
            //
            //     await sleep(10000)
            // }
        }


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
