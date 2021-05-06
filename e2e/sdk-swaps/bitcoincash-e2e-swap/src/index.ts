/*
    E2E testing
        k8  "job" pattern

    load test seed

    verify empty

    request deposit from faucet

    watch till confirmed

    send back to faucet

    report



    SDK Arch pattern ***


        Start and configure app

        verify socket connection


    Use sdk to

        * check balances
        * check tx history
        * request faucet addresses
        * send x into faucet
        * request withdrawalf rom faucet
        * verify payment

 */

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
const TAG  = " | e2e-test | "
const log = require("@pioneer-platform/loggerdog")()
let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let midgard = require("@pioneer-platform/midgard-client")
let wait = require('wait-promise');
let sleep = wait.sleep;

const {
    startApp,
    sendPairingCode,
    buildTransaction,
    approveTransaction,
    broadcastTransaction
} = require('./app')

let BLOCKCHAIN = 'bitcoinCash'
let ASSET = 'BCH'
let MIN_BALANCE = process.env['MIN_BALANCE_BTC'] || "0.00002"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.01"
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

        //assert balance local
        log.info(tag,"wallet: ",wallet)

        log.info(tag,"wallet: ",wallet.WALLET_BALANCES)
        let balance = wallet.WALLET_BALANCES[ASSET]
        assert(balance)

        if(wallet.WALLET_BALANCES[ASSET] < MIN_BALANCE){
            log.info(tag," Test wallet low! amount: "+wallet.WALLET_BALANCES[ASSET]+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+await wallet.getMaster(ASSET))
            throw Error("101: Low funds!")
        } else {
            log.info(tag," Attempting e2e test "+ASSET+" balance: ",balance)
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


        let app = new SDK.SDK(spec,config)

        let events = await app.startSocket()

        let eventPairReceived = false
        events.on('message', async (request:any) => {
            assert(request.queryKey)
            assert(request.username)
            assert(request.url)
            eventPairReceived = true
        })

        let seedChains = ['bitcoinCash']
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

        //expect special bitcoin functions

        //getFeeWithMemo
        let feeEstimate = await user.clients.bitcoinCash.getFeesWithMemo()
        log.info(tag,"feeEstimate: ",feeEstimate)
        log.info(tag,"feeEstimate: fast:",feeEstimate.fast.amount())
        log.info(tag,"feeEstimate: average: ",feeEstimate.average.amount())
        log.info(tag,"feeEstimate: fastest: ",feeEstimate.fastest.amount())
        assert(feeEstimate)
        assert(feeEstimate.type)
        assert(feeEstimate.fast)
        assert(feeEstimate.average)
        assert(feeEstimate.fastest)

        //monitor
        //let txid = "9d0e92caea91504263dba97c72699c179b0c1305e9fdff63a7e74242c50fbee2"

        //get pool address
        let poolInfo = await midgard.getPoolAddress()
        //filter by chain
        let bchVault = poolInfo.filter((e:any) => e.chain === 'BTC')
        assert(bchVault[0])
        bchVault = bchVault[0]
        assert(bchVault.address)
        const vaultAddressBch = bchVault.address
        const gasRate = bchVault.gas_rate
        assert(vaultAddressBch)
        assert(gasRate)

        //RUNE output swap
        let faucetAddress
        //raw swap
        let transfer = {
            "amount": {
                "type": "BASE",
                "decimal": 8,
                amount: function(){
                    return TEST_AMOUNT
                }
            },
            "recipient": bchVault,
            "memo": "=:THOR.RUNE:"+FAUCET_RUNE_ADDRESS,
            "feeRate": 1
        }

        /*
               NOTE:
                    Some integrations may wish to match x-chain's format of returning a txid

               To do this

               {
                  txidOnResp: true,
               }

               This will use a SYNC response of the /invoke api and wait for the client to build a tx

               response:
                  txid:string


         */

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        let invocationId = await user.clients.bitcoinCash.transfer(transfer,options)
        log.info(tag,"invocationId: ",invocationId)

        let transaction = {
            invocationId,
            context:user.context
        }
        //build
        let unsignedTx = await buildTransaction(transaction)
        log.info(tag,"unsignedTx: ",unsignedTx)

        //get invocation
        let invocationView1 = await app.getInvocation(invocationId)
        log.info(tag,"invocationView1: (VIEW) ",invocationView1)

        //sign transaction
        let signedTx = await buildTransaction(transaction)
        log.info(tag,"signedTx: ",signedTx)

        //get invocation
        let invocationView2 = await app.getInvocation(invocationId)
        log.info(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        let broadcastResult = await broadcastTransaction(transaction)
        log.info(tag,"broadcastResult: ",broadcastResult)

        let invocationView3 = await app.getInvocation(invocationId)
        log.info(tag,"invocationView3: (VIEW) ",invocationView3)

        //get invocation info EToC

        let isConfirmed = false
        //wait for confirmation

        //wait for swap
        while(!isConfirmed){
            //get invocationInfo
            let invocationInfo = await app.getInvocation(invocationId)
            log.info(tag,"invocationInfo: ",invocationInfo)


            //if
            // let txInfo = await user.clients.bitcoinCash.getTransactionData(txid)
            // log.info(tag,"txInfo: ",txInfo)
            //
            // if(txInfo.confirmations > 0){
            //     isConfirmed = true
            // }

            await sleep(3000)
        }

        //let midgardInfo
        // let fullfilled = false
        // while(!fullfilled){
        //
        //
        //     await sleep(3000)
        // }


        //verify swap amount

        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
