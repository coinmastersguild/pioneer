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

import {v4 as uuidv4} from "uuid";

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

const pjson = require("../package.json");
const TAG = " | " + pjson.name.replace("@pioneer-platform/", "") + " | ";
let SDK = require('@pioneer-platform/pioneer-sdk')
const log = require('electron-log');
import {checkConfigs, getConfig, innitConfig, updateConfig} from "@pioneer-platform/pioneer-config";
import {Transfer} from "@pioneer-platform/pioneer-types";

let {
    supportedBlockchains,
    baseAmountToNative,
    nativeToBaseAmount,
} = require("@pioneer-platform/pioneer-coins")

const assert = require('assert')
const CryptoJS = require("crypto-js")
const bip39 = require(`bip39`)
const wait = require('wait-promise');
const sleep = wait.sleep;

//primary
const App = require('@pioneer-platform/pioneer-app-electron')
let BigNumber = require('@ethersproject/bignumber')
const Hardware = require("@pioneer-platform/pioneer-hardware")

let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'

let BLOCKCHAIN = 'osmosis'
let ASSET = 'OSMO'
let MIN_BALANCE = process.env['MIN_BALANCE_OSMO'] || "0.04"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let FAUCET_OSMO_ADDRESS = process.env['FAUCET_OSMO_ADDRESS'] || 'osmo1ayn76qwdd5l2d66nu64cs0f60ga7px8zmvng6k'

const TEST_SEED = process.env['WALLET_MAIN']
if(!TEST_SEED) throw Error("Failed to load seed!")

let shownSetupPioneer = false
let shownSetup = false
let noBroadcast = false

let event = {
    sender:{
        send:function (channel:string,data:any){
            log.debug("Got EVENT: ",JSON.stringify({channel,data}))

            switch(data.dialog) {
                case 'SetupPioneer':
                    shownSetupPioneer = true
                    //accept default server pioneers.dev
                    break;
                case 'Setup':
                    shownSetup = true
                    break;
                default:
                // code block
            }


            return true
        }
    }
}

let broughtWindowFront = false
let bringWindowToFront = function(){
    broughtWindowFront = true
    console.log("bringWindowToFront: called")
}

/*
    App Start
 */

let eventInvokeReceived = false
let onStartMain = async function(event:any, data:any){
    const tag = TAG + ' | onStartMain | '
    try{
        let onStartResult = await App.onStart(event,data)
        log.debug(tag,"onStartResult: ",onStartResult)

        //on on invocations add to queue
        onStartResult.events.on('message', async (request:any) => {
            log.debug(tag,"**** message MAIN: ", request)
            if(!request.invocationId) throw Error("102: invalid invocation!")
            switch(request.type) {
                case 'pair':
                    log.debug("PAIR EVENT: ")
                    break;
                case 'swap':
                    break;
                case 'approve':
                    break;
                case 'transfer':
                    log.debug(tag,"transfer Received!")
                    eventInvokeReceived = true
                    //open invocation window
                    event.sender.send('navigation',{ dialog: 'Invocation', action: 'open'})
                    //set invocationConext to invocationId
                    event.sender.send('setInvocationContext',{ invocationId:request.invocationId })
                    bringWindowToFront()
                    break;
                case 'context':
                    break;
                default:
                    log.error("Unknown event: "+request.type)
            }
        })
        event.sender.send('setContext',{context:onStartResult.context})
        return onStartResult
    }catch(e){
        log.error(tag,e)
        throw Error("Failed to start!")
    }
}

let data:any = {}

let USERNAME_TEST = "testOnlineElectron"

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {
        //confirm config missing
        let config = getConfig()
        log.debug(tag,"config: ",config)
        assert(!config)

        //should show pioneer init if not configured
        let resultSetup = await App.continueSetup(event, data)
        log.debug(tag,"resultSetup: ",resultSetup)

        assert(shownSetupPioneer)

        //default init
        await App.initConfig(config)

        // set username
        data.username = USERNAME_TEST
        await App.createUsername(event, data)

        //verify correct username
        let config2 = getConfig()
        log.debug(tag,"config2: ",config2)
        assert(config2.username, USERNAME_TEST)

        //select wallet type
        //should show no wallets setup!
        let resultSetup2 = await App.continueSetup(event, data)
        log.debug(tag,"resultSetup2: ",resultSetup2)

        assert(resultSetup2.status,2)
        assert(shownSetup)

        //if software display seed
        data = {
            password:"123",
            mnemonic:TEST_SEED
        }

        let result = await App.createWallet(event,data)
        log.debug(tag,"createWallet result: ",result)

        //todo all balance's are defined

        //todo verify all balances externally

        //onStartMain
        let resultStart = await onStartMain(event,data)
        assert(resultStart)
        log.debug("resultStart: ",resultStart)

        //await sleep(2000)

        /*
            SDK

         */
        //generate new key
        const queryKey = uuidv4();
        assert(queryKey)

        let configSDK = {
            queryKey,
            spec,
            wss
        }
        log.debug(tag,"configSDK: ",configSDK)
        let app = new SDK.SDK(spec,configSDK)
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

        let seedChains = ['ethereum','thorchain','bitcoin','osmosis']
        await app.init(seedChains)

        //pair sdk
        let code = await app.createPairingCode()
        code = code.code
        log.debug("code: ",code)
        assert(code)


        let pairSuccess = await App.sendPairingCode(code)
        log.debug("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //verify balances
        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
            //TODO timeout & fail?
        }
        log.debug(tag,"CHECKPOINT 2 pairing")

        //assert sdk user
        //get user
        let user = await app.getUserParams()
        log.debug("user: ",user)

        log.debug("user: ",user.context)
        assert(user.context)
        //assert user clients
        if(!user.clients[BLOCKCHAIN]){
            log.error(tag,"Blockchain missing from sdk client! BLOCKCHAIN: ",BLOCKCHAIN)
        }
        assert(user.clients[BLOCKCHAIN])

        //intergration test asgard-exchange
        let blockchains = Object.keys(user.clients)
        log.debug("blockchains: ",blockchains)

        let client = user.clients[BLOCKCHAIN]
        log.debug(tag,"CHECKPOINT 3 sdk client")

        //get master
        let masterAddress = await client.getAddress()
        log.debug(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)
        log.debug(tag,"CHECKPOINT 4 master address")

        /*
            3 ways to express balance
                Sdk (x-chain compatible object type)
                native (satoshi/wei)
                base (normal 0.001 ETH)
         */

        let balanceSdk = await client.getBalance()
        log.debug(" balanceSdk: ",balanceSdk)
        assert(balanceSdk[0])
        assert(balanceSdk[0].amount)
        assert(balanceSdk[0].amount.amount())
        assert(balanceSdk[0].amount.amount().toString())

        let balanceNative = balanceSdk[0].amount.amount().toString()
        log.debug(tag,"balanceNative: ",balanceNative)
        assert(balanceNative)

        let balanceBase = await nativeToBaseAmount(ASSET,balanceSdk[0].amount.amount().toString())
        log.debug(tag,"balanceBase: ",balanceBase)
        assert(balanceBase)


        //build invocation with sdk
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

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        let transfer:Transfer = {
            context:user.context,
            recipient: FAUCET_OSMO_ADDRESS,
            asset: ASSET,
            network: ASSET,
            memo: '',
            "amount":{
                amount: function(){
                    return BigNumber.BigNumber.from(amountTestNative)
                }
            },
            fee:{
                priority:5, //1-5 5 = highest
            },
            noBroadcast
        }
        log.debug(tag,"transfer: ",transfer)

        let responseTransfer = await user.clients[BLOCKCHAIN].transfer(transfer,options)
        assert(responseTransfer)
        log.debug(tag,"responseTransfer: ",responseTransfer)
        let invocationId = responseTransfer
        //do not continue without invocationId
        assert(invocationId)

        //invoke
        // do this thing (id)
        //with context x

        let transaction = {
            invocationId,
            context:user.context
        }
        assert(transaction.context)
        log.debug(tag,"transaction: ",transaction)
        //verify client tx event

        //build
        let unsignedTx = await App.buildTransaction(event,transaction)
        log.debug(tag,"unsignedTx: ",unsignedTx)
        assert(unsignedTx)

        //get invocation
        let invocationView1 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
        if(noBroadcast){
            assert(invocationView1.noBroadcast)
        } else {
            assert(!invocationView1.noBroadcast)
        }
        assert(invocationView1)
        assert(invocationView1.state)
        assert.equal(invocationView1.state,'builtTx')

        //TODO
        //verify App got event invoke
        while(!eventInvokeReceived){
            await sleep(1000)
            console.log("eventInvokeReceived")
            //TODO timeout & fail?
        }
        log.debug(tag,"CHECKPOINT 3 GOT INVOKE EVENT!")

        //broughtWindowFront
        while(!broughtWindowFront){
            await sleep(1000)
            console.log("broughtWindowFront")
            //TODO timeout & fail?
        }
        log.debug(tag,"CHECKPOINT 4 brought window forward!")

        //TODO verify transaction is what I think it should be

        //TODO
        // let invocation = await App.getInvocation()
        // log.debug(tag,"invocation: App: ",invocation)

        //TODO verify I like context x

        //TODO offer change in fee's

        //TODO offer change in context

        //then approve
        //sign transaction
        let signedTx = await App.approveTransaction(event,transaction)
        log.debug(tag,"signedTx: ",signedTx)
        assert(signedTx)
        assert(signedTx.txid)

        //get invocation
        let invocationView2 = await app.getInvocation(invocationId)
        assert(invocationView2)
        assert(invocationView2.state)
        assert.equal(invocationView2.state,'signedTx')
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        let broadcastResult = await App.broadcastTransaction(event, transaction)
        log.debug(tag,"broadcastResult: ",broadcastResult)

        let invocationView3 = await app.getInvocation(invocationId)
        assert(invocationView3)
        assert(invocationView3.state)
        assert.equal(invocationView3.state,'broadcasted')
        log.debug(tag,"invocationView3: (VIEW) ",JSON.stringify(invocationView3))

        //get invocation info EToC
        let isConfirmed = false

        //wait for confirmation
        if(!noBroadcast){
            log.debug(tag," Monitoring tx for confirmations...")

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
                let txInfo = await client.getTransactionData(txid)
                log.debug(tag,"txInfo: ",txInfo)

                if(txInfo && txInfo.blockNumber){
                    log.debug(tag,"Confirmed!")
                    statusCode = 3
                } else {
                    log.debug(tag,"Not confirmed!")
                    //get gas price recommended
                    //get tx gas price
                }

                //verify tx is in pending

                //

                await sleep(6000)
            }


            let isFullfilled = false
        }

        let resultEnd = await app.stopSocket()
        log.debug(tag,"resultEnd: ",resultEnd)



        log.debug("****** TEST PASS 2******")
        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
