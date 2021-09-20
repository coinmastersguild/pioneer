/*
    E2E testing
        k8  "job" pattern

    load test seed

    verify empty

    build sign broadcast swap

    watch till confirmed

    report to leeroy server results



    APP pattern

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

describe(' - e2e test '+TAG, function() {
    let tag = TAG + " | test_service | "
    try {
        const log = console.log;

        beforeEach(() => {
            console.log = jest.fn(); // create a new mock function for each test
            jest.setTimeout(90000)
        });
        afterAll(() => {
            console.log = log; // restore original console.log after all tests
        });

        /*
            App Start
         */

        let onStartMain = async function(event:any, data:any){
            const tag = TAG + ' | onStartMain | '
            try{
                let onStartResult = await App.onStart(event,data)

                //on on invocations add to queue
                onStartResult.events.on('message', async (request:any) => {
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
                            log("Unknown event: "+request.type)
                    }
                })
                event.sender.send('setContext',{context:onStartResult.context})
                return onStartResult
            }catch(e){
                throw Error("Failed to start!")
            }
        }

        it('Completes Setup', async function() {
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
                log(tag,"resultSetup: ",resultSetup)

                //if code is need username create

                //if code is need url create

                //if code is wallet needed, create
                if(resultSetup && resultSetup.status && resultSetup.status === 2){
                    log(tag,"Creating Wallet")

                    //create new wallet
                    let data = {
                        password:"123",
                        mnemonic:TEST_SEED
                    }

                    let result = await App.createWallet(event,data)
                    log(tag,"createWallet result: ",result)

                    //TODO user verified wallet?
                }

                if(!resultSetup.setup){
                    //wallet not setup
                    log(tag,"Not setup!")
                }

                if(!resultSetup.success){
                    //wallet not setup
                    log(tag,"Not success!")
                }

                if(resultSetup.setup && resultSetup.success){
                    log(tag,"Setup Successfully!")
                    isSetup = true
                }
            }

        });


        it('Completes startup', async function() {
            //
            let data = {
                password:"123",
                pioneerApi:true

            }
            let onStartResult = await onStartMain(event, data)
            log(tag,"onStartResult: ",onStartResult)
            assert(onStartResult)

            //get wallet in context
            log(tag,"context: ",onStartResult.context)
            log(tag,"wallet 0: ",onStartResult.wallets[0])

        });


    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
})
