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

        //if no config
        if(!config){
            console.log("First time startup")

            //keepkey
            let success = await App.pairKeepkey()
            console.log("success: ",success)

            //

            // let wallet1 = {
            //     isTestnet:true,
            //     mnemonic:process.env['WALLET_TEST_SEED'],
            //     username:username,
            //     password
            // }
            // console.log("wallet1: ",wallet1)
            //
            // //create wallet files
            // let successCreate = await App.createWallet('software',wallet1)
            // console.log("successCreate: ",successCreate)
            //
            // //init config
            // //throw Error("Must setup!")
            // //create
            // //init config
            // await App.initConfig("english");
            // App.updateConfig({isTestnet:true});
            // App.updateConfig({username});
            // App.updateConfig({temp:password});
            // App.updateConfig({created: new Date().getTime()});

        } else {
            //if force keepkey
            let isTestnet = true

            config.password = password
            config.username = username

            let resultInit = await App.init(config,isTestnet)
            //console.log("resultInit: ",resultInit)

            //pair
            // let pairResult = await App.pair("BH4IK4")
            // console.log("pairResult: ",pairResult)

            //get wallets
            let wallets = await App.getWallets()
            //console.log("wallets: ",wallets)

            let context = wallets[0]
            if(!context) throw Error("No Wallets on startup!")


        }


    }catch(e){
        console.error(e)
    }
}

run_test()
