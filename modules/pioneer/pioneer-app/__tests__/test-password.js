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

//coin crypto modules
const ethCrypto = require("@pioneer-platform/eth-crypto")

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
            config.password = password
            config.username = username
            config.queryKey = queryKey

            config.blockchains = ['bitcoin', 'ethereum', 'thorchain', 'litecoin', 'bitcoincash']

            let resultInit = await App.init(config)
            console.log("resultInit: ", resultInit)

            //pair
            // let pairResult = await App.pair("DQW2FW")
            // console.log("pairResult: ",pairResult)

            //get wallets
            let wallets = await App.getWallets()
            console.log("wallets: ", wallets)

            let contextName = await App.context()
            console.log("contextName: ", contextName)

            let context = wallets[contextName]
            if (!context) throw Error("No Wallets on startup!")

            //for each context

        }

    }catch(e){
        console.error(e)
    }
}

run_test()
