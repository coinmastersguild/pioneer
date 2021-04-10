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
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"


let seed_1 = process.env['WALLET_MAINNET_DEV']
let password = process.env['WALLET_PASSWORD']
// let username = process.env['TEST_USERNAME_1']

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

//console.log("password: ",password)

let TEST_COINS = [
    'BTC',
    // 'BCH',
    // 'ETH',
    // 'ATOM'
]

let run_test = async function(){
    try{
        //get config
        let config = await App.getConfig()

        console.log("config: ",config)

        //if no config
        if(!config){
            console.log("use Pair test")
        } else {

            config.password = password
            config.username = username

            let resultInit = await App.init(config)
            //console.log("resultInit: ",resultInit)

            //pair
            // let pairResult = await App.pair("ZEKOTO")
            // console.log("pairResult: ",pairResult)

            //get wallets
            let wallets = await App.getWallets()
            //console.log("wallets: ",wallets)

            let context = wallets[0]
            if(!context) throw Error("No Wallets on startup!")

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

                //TODO request from faucet

                //send

                //TODO coin control
            }



            /*
               BCH
            */




            /*
                ETH
             */
            if(TEST_COINS.indexOf('ETH') >= 0){
                let ethBalance = await context.getBalance("ETH")
                console.log("ethBalance: ",ethBalance)

                let ethMaster = await context.getMaster("ETH")
                console.log("ethMaster: ",ethMaster)

                //send tx
                let intent = {
                    coin:"ETH",
                    address:"0xc3affff54122658b89c31183cec4f15514f34624",
                    amount:"0.001",
                    memo:null,
                    noBroadcast:true,
                    invocationId:"workyplzbro"
                }
                // let txid = await context.sendToAddress(intent)
                // console.log("txid: ",txid)
            }

            /*
                ATOM
             */
            if(TEST_COINS.indexOf('ATOM') >= 0){
                let atomBalance = await context.getBalance("ATOM")
                console.log("atomBalance: ",atomBalance)

                let atomMaster = await context.getMaster("ATOM")
                console.log("atomMaster: ",atomMaster)

                //send tx
                // let intent = {
                //     coin:"ATOM",
                //     address:"cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj",
                //     amount:"0.001"
                // }
                // let txid = await context.sendToAddress(intent.coin, intent.address, intent.amount)
                // console.log("txid: ",txid)
            }




        }


    }catch(e){
        console.error(e)
    }
}

run_test()
