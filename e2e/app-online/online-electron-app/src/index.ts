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

let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'

const TEST_SEED = process.env['WALLET_MAIN']
if(!TEST_SEED) throw Error("Failed to load seed!")

let event = {
    sender:{
        send:function (channel:string,data:any){
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

        //on on invocations add to queue
        onStartResult.events.on('message', async (request:any) => {
            log.info(tag,"**** message MAIN: ", request)
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


const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {
        //confirm config missing
        let config = getConfig()
        log.info(tag,"config: ",config)

        // setup process
        // Iterate through setup

        let isSetup = false
        let i = 1
        while(!isSetup){
            i++
            //Cap attempts
            if(i > 5){
                throw Error("Failed to configure!")
            }
            //
            let data = {}
            let resultSetup = await App.continueSetup(event, data)
            log.info(tag,"resultSetup: ",resultSetup)

            //if code is need username create

            //if code is need url create

            //if code is wallet needed, create
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
            }

            if(!resultSetup.setup){
                //wallet not setup
                log.info(tag,"Not setup!")
            }

            if(!resultSetup.success){
                //wallet not setup
                log.info(tag,"Not success!")
            }

            if(resultSetup.setup && resultSetup.success){
                log.info(tag,"Setup Successfully!")
                isSetup = true
            }
        }


        //
        let data = {
            password:"123"
        }
        let onStartResult = await onStartMain(event, data)
        log.info(tag,"onStartResult: ",onStartResult)
        assert(onStartResult)

        //get wallet in context
        log.info(tag,"context: ",onStartResult.context)
        log.info(tag,"wallet 0: ",onStartResult.wallets[0])

        //TODO filter wallets by context

        //get balances

        //build

        //sign

        //broadcast



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
