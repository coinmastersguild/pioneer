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
// @ts-ignore
import {checkConfigs, getConfig, innitConfig, updateConfig} from "@pioneer-platform/pioneer-config";

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

const TEST_SEED = process.env['WALLET_MAIN']
if(!TEST_SEED) throw Error("Failed to load seed!")

let shownSetupPioneer = false

let event = {
    sender:{
        send:function (channel:string,data:any){
            log.info("Got EVENT: ",{channel,data})

            switch(data.dialog) {
                case 'SetupPioneer':
                    shownSetupPioneer = true
                    break;
                // case 'SetupPioneer':
                //     shownSetupPioneer = true
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
        log.info(tag,"onStartResult: ",onStartResult)

        event.sender.send('setContext',{context:onStartResult.context})
        return onStartResult
    }catch(e){
        log.error(tag,e)
        throw Error("Failed to start!")
    }
}

let data = {}
const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {
        //confirm config missing
        let config = getConfig()
        log.info(tag,"config: ",config)
        assert(!config)

        // setup process
        config = {
            wss:'offline',
            spec:'offline',
            mode:'offline'
        }
        await App.initConfig(config)

        //create random username
        await App.createUsername(event, data)

        let resultSetup = await App.continueSetup(event, data)

        if(resultSetup && resultSetup.status && resultSetup.status === 2){
            log.info(tag,"Creating Wallet")

            //create new wallet
            let data = {
                password:"123",
                mnemonic:TEST_SEED
            }

            let result = await App.createWallet(event,data)
            log.info(tag,"createWallet result: ",result)

            //TODO user verified wallet?
        } else {
            log.info(tag,"resultSetup: ",resultSetup)
            throw Error("102: failed to setup correct!")
        }

        data = {
            password:"123",
            pionerApi:false,
            isOffline:true
        }
        let onStartResult = await onStartMain(event, data)
        log.info(tag,"onStartResult: ",onStartResult)
        assert(onStartResult)


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