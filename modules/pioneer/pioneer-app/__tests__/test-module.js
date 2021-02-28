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
//process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let seed_1 = process.env['WALLET_MAINNET_DEV']
let password = process.env['WALLET_PASSWORD']
let username = "test-user-554433"

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
            let wallet1 = {
                mnemonic:seed_1,
                username:username,
                password
            }
            console.log("wallet1: ",wallet1)
            //create wallet files
            let successCreate = await App.createWallet('software',wallet1)
            console.log("successCreate: ",successCreate)
            //init config
            //throw Error("Must setup!")
            //create
            //init config
            await App.initConfig("english");
            App.updateConfig({username});
            App.updateConfig({temp:password});
            App.updateConfig({created: new Date().getTime()});
        } else {
            //if force keepkey

            // let resultPair = await App.pairKeepkey()
            // console.log("resultPair: ",resultPair)

            config.password = password
            console.log("config: ",config)
            config.username = username

            console.log("config: ",config)
            let resultInit = await App.init(config)
            console.log("resultInit: ",resultInit)

            //get wallets
            let wallets = await App.getWallets()
            console.log("wallets: ",wallets)

            let context = wallets[0]

            if(!context) throw Error("No Wallets on startup!")

            /*
                FIO
             */
            let fioPublicInfo = await context.getFioAccountInfo("highlander@scatter")
            console.log("fioPublicInfo: ",fioPublicInfo)

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
