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
            log.info("Got EVENT: ",JSON.stringify({channel,data}))

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
                    log.info(tag,"transfer Received!")
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
        log.info("walletFiles: ",resultStart.walletFiles)
        log.info("wallets: ",resultStart.wallets.length)

        //TODO get wallet Descriptions

        //TODO validate total value:

        //TODO let current context
        //addresses masters coininfo
        // log.info("wallets: ",resultStart.wallets[0].pubkeys)

        //let context wallet
        let walletContext = resultStart.wallets[0]

        //for each pubkey
        for(let i = 0; i < walletContext.pubkeys.length; i++){
            let pubkey = walletContext.pubkeys[i]

            if(pubkey.balances){
                //for each balance
                for(let j = 0; j < pubkey.balances.length; j++){
                    let balance = pubkey.balances[j]
                    log.info(tag,balance.symbol+" balance: ",balance.balance)

                    //how old
                    let age = new Date().getTime() - balance.lastUpdated
                    log.info(tag,"age: ",age/1000)
                }
            } else {
                log.error("Invalid pubkey! pubkey:  ",pubkey)
                //throw Error('Invalid pubkey! missing balance!')
            }

        }
        //validate



        // let pairSuccess = await App.getInfo()
        // log.info("pairSuccess: ",pairSuccess)
        // assert(pairSuccess)








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
