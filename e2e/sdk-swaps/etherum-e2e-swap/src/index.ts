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
const log = require("@pioneer-platform/loggerdog")()

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
    sendPairingCode,
    buildTransaction,
    approveTransaction,
    broadcastTransaction
} = require('./app')

let BLOCKCHAIN = 'ethereum'
let ASSET = 'ETH'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.0002"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC']
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let wss = process.env['URL_PIONEER_SOCKET']
let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

        //start app and get wallet
        let wallet = await startApp()
        let username = wallet.username
        assert(username)

        let balance = wallet.WALLET_BALANCES[ASSET]
        assert(balance)

        //assert balance local
        //log.info(tag,"wallet: ",wallet)
        log.debug(tag,"wallet: ",wallet.WALLET_BALANCES)
        if(balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+await wallet.getMaster(ASSET))
            throw Error("101: Low funds!")
        } else {
            log.info(tag," Attempting e2e test "+ASSET+" balance: ",balance)
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

        let seedChains = ['ethereum','thorchain']
        await app.init(seedChains)

        //pair sdk
        let code = await app.createPairingCode()
        code = code.code
        log.info("code: ",code)
        assert(code)

        //
        let pairSuccess = await sendPairingCode(code)
        log.info("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
        }

        //assert sdk user
        //get user
        let user = await app.getUserParams()
        log.info("user: ",user)
        assert(user.context)

        //intergration test asgard-exchange
        let blockchains = Object.keys(user.clients)
        log.info("blockchains: ",blockchains)

        let client = user.clients['ethereum']

        //get master
        let masterAddress = await client.getAddress()
        log.info(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)

        /*
            3 ways to express balance
                Sdk (x-chain compatible object type)
                native (satoshi/wei)
                base (normal 0.001 ETH)
         */

        let balanceSdk = await client.getBalance()
        log.info(" balanceSdk: ",balanceSdk)
        assert(balanceSdk[0])
        assert(balanceSdk[0].amount)
        assert(balanceSdk[0].amount.amount())
        assert(balanceSdk[0].amount.amount().toString())


        let balanceNative = balanceSdk[0].amount.amount().toString()
        log.info(tag,"balanceNative: ",balanceNative)
        assert(balanceNative)

        let balanceBase = await nativeToBaseAmount('ETH',balanceSdk[0].amount.amount().toString())
        log.info(tag,"balanceBase: ",balanceBase)
        assert(balanceBase)

        //value USD
        let valueBalanceUsd = await coincap.getValue("ETH",balanceBase)
        log.info(tag,"valueBalanceUsd: ",valueBalanceUsd)
        assert(valueBalanceUsd)

        if(balanceBase < TEST_AMOUNT){
            throw Error(" YOUR ARE BROKE! send more test funds into test seed! address: ")
        }

        let asset = {
            chain:"ETH",
            symbol:"ETH",
            ticker:"ETH",
        }

        //get estimate
        let estimatePayload = {
            asset,
            amount:balanceBase,
            recipient: '0xf10e1893b2fd736c40d98a10b3a8f92d97d5095e' // dummy value only used to estimate ETH transfer
        }
        log.info(tag,"estimatePayload: ",estimatePayload)

        let estimateCost = await client.estimateFeesWithGasPricesAndLimits(estimatePayload);
        log.info(tag,"estimateCost: ",estimateCost)
        assert(estimateCost)

        //max cost - balance

        //you have x max amount spendable

        //you are attempting to spend x

        //this is x percent of total available

        //get pool address
        // let poolInfo = await midgard.getPoolAddress()

        //filter by chain
        //let ethVault = poolInfo.filter((e:any) => e.chain === 'ETH')

        let ethVault:any = [
            {
                "chain": "ETH",
                "pub_key": "thorpub1addwnpepqtthd089x6h3qg2tflq8ukhpplxg5s8v8zx3l00crvhsyg9xk43qgal9tnm",
                "address": "0xf10e1893b2fd736c40d98a10b3a8f92d97d5095e",
                "router": "0x42A5Ed456650a09Dc10EBc6361A7480fDd61f27B",
                "gas_rate": "100"
            }
        ]

        log.info(tag,"ethVault: ",ethVault)
        assert(ethVault[0])
        ethVault = ethVault[0]
        assert(ethVault.address)
        assert(ethVault.router)
        const vaultAddressEth = ethVault.address
        const gasRate = ethVault.gas_rate
        assert(vaultAddressEth)
        assert(gasRate)

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        let swap = {
            inboundAddress: ethVault,
            coin: "ETH",
            asset: "ETH",
            memo: '=:THOR.RUNE:thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5',
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

        //if monitor
        let invocationId = "pioneer:invocation:v0.01:ETH:sKxuLRKdaCKHHKAJ1t4iYm"

        //if create new
        // let responseSwap = await user.clients.ethereum.buildSwap(swap,options)
        // log.info(tag,"responseSwap: ",responseSwap)
        // let invocationId = responseSwap.invocationId

        //do not continue invocation
        assert(invocationId)

        let transaction = {
            invocationId,
            context:user.context
        }
        //build
        // let unsignedTx = await buildTransaction(transaction)
        // log.info(tag,"unsignedTx: ",unsignedTx)
        // assert(unsignedTx)
        //
        // //get invocation
        // let invocationView1 = await app.getInvocation(invocationId)
        // log.info(tag,"invocationView1: (VIEW) ",invocationView1)
        // assert(invocationView1)
        //
        // //sign transaction
        // let signedTx = await approveTransaction(transaction)
        // log.info(tag,"signedTx: ",signedTx)
        // assert(signedTx)
        // assert(signedTx.txid)
        // //get invocation
        // let invocationView2 = await app.getInvocation(invocationId)
        // log.info(tag,"invocationView2: (VIEW) ",invocationView2)
        //
        // //broadcast transaction
        // let broadcastResult = await broadcastTransaction(transaction)
        // log.info(tag,"broadcastResult: ",broadcastResult)
        //
        // let invocationView3 = await app.getInvocation(invocationId)
        // log.info(tag,"invocationView3: (VIEW) ",invocationView3)

        //get invocation info EToC

        let isConfirmed = false
        //wait for confirmation

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
        while(!isConfirmed){
            //get invocationInfo
            let invocationInfo = await app.getInvocation(invocationId)
            log.info(tag,"invocationInfo: ",invocationInfo)

            let txid = invocationInfo.signedTx.txid
            assert(txid)
            if(!currentStatus) currentStatus = 'transaction built!'
            if(statusCode <= 0) statusCode = 1

            //lookup txid
            let txInfo = await client.getTransactionData(txid)
            log.debug(tag,"txInfo: ",txInfo)

            if(txInfo.blockNumber){
                log.info(tag,"Confirmed!")

            } else {
                log.info(tag,"Not confirmed!")
                //get gas price recomended

                //get tx gas price
            }

            //get midgard info
            let txInfoMidgard =
            //update invocation

            //if
            // let txInfo = await user.clients.bitcoinCash.getTransactionData(txid)
            // log.info(tag,"txInfo: ",txInfo)
            //
            // if(txInfo.confirmations > 0){
            //     isConfirmed = true
            // }

            await sleep(10000)
        }


        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
