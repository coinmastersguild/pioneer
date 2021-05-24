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
    'BCH',
    'ETH',
    // 'ATOM',
    'BNB',
    'LTC'
]

let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance']


let run_test = async function(){
    try{
        //get config
        let config = await App.getConfig()

        //if no config
        if(!config){
            console.log("First time startup")

            // software
            let wallet1 = {
                mnemonic:process.env['WALLET_MAIN'],
                username:username,
                password
            }

            //get master for seed
            let walletEth = await ethCrypto.generateWalletFromSeed(wallet1.mnemonic)
            wallet1.masterAddress = walletEth.masterAddress

            console.log("wallet1: ",wallet1)
            //create wallet files
            let successCreate = await App.createWallet('software',wallet1)
            console.log("successCreate: ",successCreate)

            //init config
            //throw Error("Must setup!")
            //create
            //init config
            await App.initConfig("english");
            App.updateConfig({spec:process.env['URL_PIONEER_SPEC']});
            App.updateConfig({wss:process.env['URL_PIONEER_SOCKET']});
            App.updateConfig({username});
            App.updateConfig({temp:password});
            App.updateConfig({blockchains})
            App.updateConfig({created: new Date().getTime()});

        } else {
            //if force keepkey
            let isTestnet = null

            config.password = password
            config.username = username

            let resultInit = await App.init(config,isTestnet)
            //console.log("resultInit: ",resultInit)

            //pair
            let pairResult = await App.pair("C5K4ES")
            console.log("pairResult: ",pairResult)

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
