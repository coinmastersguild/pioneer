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

let event = {
    sender:{
        send:function (channel:string,data:any){
            log.info("Got EVENT: ",{channel,data})

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

let bringWindowToFront = function(){
    console.log("bringWindowToFront: called")
}

/*
    App Start
 */

let onStartMain = async function(event:any, data:any){
    const tag = TAG + ' | onStartMain | '
    try{
        let onStartResult = await App.onStart(event,data)
        log.info(tag,"onStartResult: ",onStartResult)

        //on on invocations add to queue
        onStartResult.events.on('message', async (request:any) => {
            log.info(tag,"**** message MAIN: ", request)
            if(!request.invocationId) throw Error("102: invalid invocation!")
            switch(request.type) {
                case 'pair':
                    log.info("PAIR EVENT: ")
                    break;
                case 'swap':
                    break;
                case 'approve':
                    break;
                case 'transfer':
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
        log.info(tag,"config: ",config)
        assert(!config)

        //should show pioneer init if not configured
        let resultSetup = await App.continueSetup(event, data)
        log.info(tag,"resultSetup: ",resultSetup)

        assert(shownSetupPioneer)

        //default init
        await App.initConfig(config)

        // set username
        data.username = USERNAME_TEST
        await App.createUsername(event, data)

        //verify correct username
        let config2 = getConfig()
        log.info(tag,"config2: ",config2)
        assert(config2.username, USERNAME_TEST)

        //select wallet type
        //should show no wallets setup!
        let resultSetup2 = await App.continueSetup(event, data)
        log.info(tag,"resultSetup2: ",resultSetup2)

        assert(resultSetup2.status,2)
        assert(shownSetup)

        //if software display seed
        data = {
            password:"123",
            mnemonic:TEST_SEED
        }

        let result = await App.createWallet(event,data)
        log.info(tag,"createWallet result: ",result)

        //todo all balance's are defined

        //todo verify all balances externally

        //
        let resultStart = await onStartMain(event,data)
        assert(resultStart)
        log.info("resultStart: ",resultStart)

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
        log.info(tag,"configSDK: ",configSDK)
        let app = new SDK.SDK(spec,configSDK)
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

        let seedChains = ['ethereum','thorchain','bitcoin','osmosis']
        await app.init(seedChains)

        //pair sdk
        let code = await app.createPairingCode()
        code = code.code
        log.info("code: ",code)
        assert(code)


        let pairSuccess = await App.sendPairingCode(code)
        log.info("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //verify balances
        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
            //TODO timeout & fail?
        }
        log.info(tag,"CHECKPOINT 2 pairing")

        //assert sdk user
        //get user
        let user = await app.getUserParams()
        log.info("user: ",user)

        log.info("user: ",user.context)
        assert(user.context)
        //assert user clients
        if(!user.clients[BLOCKCHAIN]){
            log.error(tag,"Blockchain missing from sdk client! BLOCKCHAIN: ",BLOCKCHAIN)
        }
        assert(user.clients[BLOCKCHAIN])

        //intergration test asgard-exchange
        let blockchains = Object.keys(user.clients)
        log.info("blockchains: ",blockchains)

        let client = user.clients[BLOCKCHAIN]
        log.info(tag,"CHECKPOINT 3 sdk client")

        //get master
        let masterAddress = await client.getAddress()
        log.info(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)
        log.info(tag,"CHECKPOINT 4 master address")

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


        //build invocation with sdk

        //invoke

        //verify client tx event


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
