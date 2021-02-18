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
// process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let password = process.env['WALLET_PASSWORD']
let username = "test-user-554433"

console.log("password: ",password)
let run_test = async function(){
    try{

        //get config
        let config = await App.getConfig()
        config.password = password
        console.log("config: ",config)

        config.username = username

        //if no config
        if(!config){
            //init config
            throw Error("Must setup!")
        }
        //

        console.log("config: ",config)
        let resultInit = await App.init(config)
        console.log("resultInit: ",resultInit)

        //get wallets
        let wallets = await App.getWallets()
        console.log("wallets: ",wallets)

        let context = wallets[0]

        let ethBalance = await context.getBalance("ETH")
        console.log("ethBalance: ",ethBalance)




    }catch(e){
        console.error(e)
    }
}

run_test()
