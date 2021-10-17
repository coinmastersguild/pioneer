/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let App = require("../lib")

let WALLET_PASSWORD = process.env['WALLET_PASSWORD']
if(!WALLET_PASSWORD) throw Error(".env not found!")

//force
//process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
//process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"


let seed_1 = process.env['WALLET_MAINNET_DEV']
let password = process.env['WALLET_PASSWORD']
// let username = process.env['TEST_USERNAME_1']

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

//console.log("password: ",password)

let TEST_COINS = [
    'BTC',
    'BCH',
    'ETH',
    // 'ATOM'
    'LTC',
    'BNB',
    'USDT',
    'SUSHI'
]

let run_test = async function(){
    try{
        //get config
        let config = await App.getConfig()

        console.log("config: ",config)

        //if no config
        if(!config){
            console.log("First time startup, run pair first")
        } else {
            //blockchains
            if(!config.blockchains) throw Error("Invalid configuration! missing blockchains")

            config.password = password
            config.username = username

            let resultInit = await App.init(config)
            console.log("resultInit: ",resultInit)

            //pair
            let code = "GJULOT"
            console.log("code: ",code)
            let pairResult = await App.pair(code)
            console.log("pairResult: ",pairResult)

            //get wallets
            let wallets = await App.getWallets()
            console.log("wallets: ",wallets)

            let contextName = await App.context()
            console.log("Wallet selected: ",contextName)

            let context = wallets[contextName]
            if(!context) throw Error("No Wallets on startup!")

            //AutonomousOn
            resultInit.events.on('message', async (request) => {
                switch(request.type) {
                    //TODO swap/approve
                    case 'transfer':
                        console.log(" **** PROCESS EVENT ****  request: ",request)
                        //approve
                        console.log(" Approving transaction! ")
                        let signedTx = await App.approveTransaction(App.context(),request.invocation.invocationId)
                        console.log(" ***  signedTx: ",signedTx)
                        break
                    default:
                        console.log("Unhandled type: ",request.type)
                }
            })

            /*
                FIO
             */
            //let fioPublicInfo = await context.getFioAccountInfo("highlander@scatter")
            //console.log("fioPublicInfo: ",fioPublicInfo)

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

                //USDT
                let usdtBalance = await context.getBalance("USDT")
                console.log("usdtBalance: ",usdtBalance)

                //SUSHI
                let sushiBalance = await context.getBalance("SUSHI")
                console.log("sushiBalance: ",sushiBalance)
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
