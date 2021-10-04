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

const pjson = require("../package.json");
const TAG = " | " + pjson.name.replace("@pioneer-platform/", "") + " | ";
const log = require('electron-log');
import {checkConfigs, getConfig, innitConfig, updateConfig} from "@pioneer-platform/pioneer-config";

const assert = require('assert')
const CryptoJS = require("crypto-js")
const bip39 = require(`bip39`)
const wait = require('wait-promise');
const sleep = wait.sleep;

//primary
const App = require('@pioneer-platform/pioneer-app-electron')

const Hardware = require("@pioneer-platform/pioneer-hardware")

let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin','osmosis']
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'

const TEST_SEED = process.env['WALLET_MAIN']
if(!TEST_SEED) throw Error("Failed to load seed!")

let shownSetupPioneer = false
let shownSetup = false

let event = {
    sender:{
        send:function (channel:string,data:any){
            log.debug("Got EVENT: ",{channel,data})

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
let bringWindowToFront = function(){}

/*
    App Start
 */

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
