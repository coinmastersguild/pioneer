/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let App = require("../lib")

// let WALLET_PASSWORD = process.env['WALLET_PASSWORD']
// if(!WALLET_PASSWORD) throw Error(".env not found!")

//force
//process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

//coin crypto modules
const ethCrypto = require("@pioneer-platform/eth-crypto")

let seed_1 = process.env['WALLET_MAINNET_DEV']
let password = process.env['WALLET_PASSWORD'] || 'password'
// let username = process.env['TEST_USERNAME_1']

// let username = process.env['TEST_USERNAME_2'] || 'test-user-2'
let queryKey = process.env['TEST_QUERY_KEY_2']

//console.log("password: ",password)

let TEST_COINS = [
    // 'BTC',
    // 'BCH',
    // 'ETH',
    // // 'ATOM',
    // 'BNB',
    // 'LTC'
]

let run_test = async function(){
    try{
        //get config
        let config = await App.getConfig()

        //if no config
        if(!config){
            console.log("First time startup (run pair multi)")

        } else {
            //blockchains
            if(!config.blockchains) throw Error("Invalid configuration!")

            config.password = password
            // config.username = username

            let resultInit = await App.init(config)
            console.log("resultInit: ",resultInit)

            resultInit.events.on('message', async (request) => {

                //on request

                //display for review

                //approve

                //
                switch(request.type) {
                    case 'transfer':
                        console.log(" **** PROCESS EVENT ****  request: ",request)
                        //review

                        //approve
                        console.log(" Approving transaction! ")
                        // let signedTx = await App.approveTransaction(App.context(),request.invocation.invocationId)
                        // console.log(" ***  signedTx: ",signedTx)

                        // if(signedTx.success){
                        //     //broadcast
                        //     // let broadcastResult = await App.broadcastTransaction(request.invocation.coin,signedTx)
                        //     // console.log("broadcastResult: ",broadcastResult)
                        // }


                        break
                    default:
                        console.log("Unhandled type: ",request.type)
                }
            })


            //pair
            let pairResult = await App.pair("1B5NI8")
            console.log("pairResult: ",pairResult)

            //get wallets
            let wallets = await App.getWallets()
            // console.log("wallets: ",wallets)

            let contextName = App.context()
            console.log("contextName: ",contextName)

            let context = wallets[contextName]
            if(!context) throw Error("No Wallets on startup!")

            //get invocations
            let invocations = await App.getInvocations()
            console.log("invocations: ",invocations)

            App.playChingle()


            /*
                FIO
             */
            // let fioPublicInfo = await context.getFioAccountInfo("highlander@scatter")
            // console.log("fioPublicInfo: ",fioPublicInfo)

            /*
                BTC
             */
            if(TEST_COINS.indexOf('BTC') >= 0){
                let btcBalance = await context.getBalance("BTC")
                console.log("btcBalance: ",btcBalance)

                //get address
                let btcMaster = await context.getMaster("BTC")
                console.log("btcMaster: ",btcMaster)

            }

            /*
               LTC
            */
            if(TEST_COINS.indexOf('LTC') >= 0){
                let ltcBalance = await context.getBalance("LTC")
                console.log("ltcBalance: ",ltcBalance)

                let ltcMaster = await context.getMaster("LTC")
                console.log("ltcMaster: ",ltcMaster)

            }

            /*
               BCH
            */
            if(TEST_COINS.indexOf('BCH') >= 0){
                let bchBalance = await context.getBalance("BCH")
                console.log("bchBalance: ",bchBalance)

                let bchMaster = await context.getMaster("BCH")
                console.log("bchMaster: ",bchMaster)

            }

            /*
                ETH
             */
            if(TEST_COINS.indexOf('ETH') >= 0){
                let ethBalance = await context.getBalance("ETH")
                console.log("ethBalance: ",ethBalance)

                let ethMaster = await context.getMaster("ETH")
                console.log("ethMaster: ",ethMaster)

            }

            /*
                ATOM
             */
            if(TEST_COINS.indexOf('ATOM') >= 0){
                let atomBalance = await context.getBalance("ATOM")
                console.log("atomBalance: ",atomBalance)

                let atomMaster = await context.getMaster("ATOM")
                console.log("atomMaster: ",atomMaster)

            }

        }


    }catch(e){
        console.error(e)
    }
}

run_test()
