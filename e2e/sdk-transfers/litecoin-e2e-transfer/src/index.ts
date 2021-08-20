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

let pjson = require("../package.json");
let TAG = " | " + pjson.name.replace("@pioneer-platform/", "") + " | ";
const log = require("@pioneer-platform/loggerdog")()
let BigNumber = require('@ethersproject/bignumber')
let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let wait = require('wait-promise');
let sleep = wait.sleep;
let midgard = require("@pioneer-platform/midgard-client")
let coincap = require("@pioneer-platform/coincap")

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

let BLOCKCHAIN = 'litecoin'
let ASSET = 'LTC'
let MIN_BALANCE = process.env['MIN_BALANCE_LTC'] || "0.001"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let FAUCET_LTC_ADDRESS = process.env['FAUCET_LTC_ADDRESS'] || 'LLe4PciAJgMMJSAtQQ5nkC13t6SSMmERJ3'

let noBroadcast = true

console.log("spec: ",spec)
console.log("wss: ",wss)

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

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
        let balance = wallets.wallets[contextAlpha].WALLET_BALANCES[ASSET]
        assert(balance)

        let masterAlpha = await wallets.wallets[contextAlpha].getMaster(ASSET)
        //assert balance local
        //log.debug(tag,"wallet: ",wallet)
        if(balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+masterAlpha)
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
        log.info(tag,"config: ",config)
        let app = new SDK.SDK(spec,config)
        let events = await app.startSocket()
        let eventPairReceived = false
        let eventInvokeTransferReceived = false
        events.on('message', async (event:any) => {
            log.info(tag,"event: ",event)
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

        let seedChains = ['ethereum','thorchain','bitcoin','bitcoincash']
        await app.init(seedChains)

        //pair sdk
        let code = await app.createPairingCode()
        code = code.code
        log.info("code: ",code)
        assert(code)


        let pairSuccess = await sendPairingCode(code)
        log.info("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
            //TODO timeout & fail?
        }

        //assert sdk user
        //get user
        let user = await app.getUserParams()
        log.info("user: ",user)

        log.info("user: ",user.context)
        assert(user.context)
        //assert user clients
        assert(user.clients[BLOCKCHAIN])

        //intergration test asgard-exchange
        let blockchains = Object.keys(user.clients)
        log.info("blockchains: ",blockchains)

        let client = user.clients[BLOCKCHAIN]

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

        let balanceBase = await nativeToBaseAmount(ASSET,balanceSdk[0].amount.amount().toString())
        log.info(tag,"balanceBase: ",balanceBase)
        assert(balanceBase)

        //value USD
        let valueBalanceUsd = await coincap.getValue(ASSET,balanceBase)
        log.info(tag,"valueBalanceUsd: ",valueBalanceUsd)
        assert(valueBalanceUsd)

        if(balanceBase < TEST_AMOUNT){
            throw Error(" YOUR ARE BROKE! send more test funds into test seed! address: ")
        }

        //estimate LTC fee? lol
        let asset = {
            chain:ASSET,
            symbol:ASSET,
            ticker:ASSET,
        }

        //TODO estimate cost
        // assert(estimateCost)

        //max cost - balance

        //you have x max amount spendable

        //you are attempting to spend x

        //this is x percent of total available

        //get pool address
        let poolInfo = await midgard.getPoolAddress()

        //filter by chain
        let thorVault = poolInfo.filter((e:any) => e.chain === 'LTC')
        log.info(tag,"thorVault: ",thorVault)
        assert(thorVault[0])
        thorVault = thorVault[0]
        assert(thorVault.address)

        const vaultAddress = thorVault.address
        const gasRate = thorVault.gas_rate
        assert(vaultAddress)
        assert(gasRate)

        //test amount in native
        let amountTestNative = baseAmountToNative("LTC",TEST_AMOUNT)

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        let transfer:Transfer = {
            context:user.context,
            recipient: FAUCET_LTC_ADDRESS,
            asset: ASSET,
            network: ASSET,
            memo: '',
            "amount":{
                amount: function(){
                    return BigNumber.BigNumber.from(amountTestNative)
                }
            },
            fee:{
                priority:3, //1-5 5 = highest
            },
            noBroadcast
        }
        log.info(tag,"transfer: ",transfer)
        //if monitor
        //let invocationId = "pioneer:invocation:v0.01:ETH:sKxuLRKdaCKHHKAJ1t4iYm"

        let responseTransfer = await user.clients[BLOCKCHAIN].transfer(transfer,options)
        assert(responseTransfer)
        log.info(tag,"responseTransfer: ",responseTransfer)
        let invocationId = responseTransfer
        //do not continue without invocationId
        assert(invocationId)

        //wait until app get's invocation event
        let invocationReceived = false
        while(!invocationReceived){
            await sleep(1000)
            let invocations = await getInvocations()
            log.info(tag,"invocations: ",invocations)
            let invocationEventValue = invocations.filter((invocation: { invocationId: any; }) => invocation.invocationId === invocationId)[0]
            log.info(tag,"invocationEventValue: ",invocationEventValue)
            if(invocationEventValue){
                assert(invocationEventValue.invocationId)
                invocationReceived = true
            }
        }

        let transaction = {
            invocationId,
            context:user.context
        }

        //build
        let unsignedTx = await buildTransaction(transaction)
        log.info(tag,"unsignedTx: ",unsignedTx)
        assert(unsignedTx)

        //get invocation
        let invocationView1 = await app.getInvocation(invocationId)
        log.info(tag,"invocationView1: (VIEW) ",invocationView1)
        assert(invocationView1)
        assert(invocationView1.state)
        assert.equal(invocationView1.state,'builtTx')

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
        log.info(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        let broadcastResult = await broadcastTransaction(transaction)
        log.info(tag,"broadcastResult: ",broadcastResult)

        let invocationView3 = await app.getInvocation(invocationId)
        assert(invocationView3)
        assert(invocationView3.state)
        assert.equal(invocationView3.state,'broadcasted')
        log.info(tag,"invocationView3: (VIEW) ",invocationView3)

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

            //monitor tx lifecycle
            let currentStatus
            let statusCode = 0
            let txid

            //wait till confirmed in block
            while(!isConfirmed){
                //get invocationInfo
                let invocationInfo = await app.getInvocation(invocationId)
                log.info(tag,"invocationInfo: ",invocationInfo)

                txid = invocationInfo.signedTx.txid
                assert(txid)
                if(!currentStatus) currentStatus = 'transaction built!'
                if(statusCode <= 0) statusCode = 1

                //lookup txid
                let txInfo = await client.getTransactionData(txid)
                log.info(tag,"txInfo: ",txInfo)

                if(txInfo && txInfo.blockNumber){
                    log.info(tag,"Confirmed!")
                    statusCode = 3
                } else {
                    log.info(tag,"Not confirmed!")
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
                log.info(tag,"txInfoMidgard: ",txInfoMidgard)

                //
                if(txInfoMidgard && txInfoMidgard.actions && txInfoMidgard.actions[0]){
                    let depositInfo = txInfoMidgard.actions[0].in
                    log.info(tag,"deposit: ",depositInfo)

                    let fullfillmentInfo = txInfoMidgard.actions[0].out
                    log.info(tag,"fullfillmentInfo: ",fullfillmentInfo)

                    if(fullfillmentInfo.status === 'success'){
                        statusCode = 4
                        isFullfilled = true
                    }
                }

                await sleep(6000)
            }


        }

        let result = await app.stopSocket()
        log.info(tag,"result: ",result)

        log.info("****** TEST PASS 2******")
        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
