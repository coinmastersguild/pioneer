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

        console.log("First time startup")

        // software 1
        try{
            let wallet1 = {
                mnemonic:process.env['FOUND_KEY'],
                password
            }

            //get master for seed
            let walletEth = await ethCrypto.generateWalletFromSeed(wallet1.mnemonic)
            wallet1.masterAddress = walletEth.masterAddress

            console.log("wallet1: ",wallet1)
            //create wallet files
            let successCreate = await App.createWallet('software',wallet1)
            console.log("successCreate: ",successCreate)

        }catch(e){

        }

        try{
            let wallet2 = {
                mnemonic:process.env['WALLET_MAINNET_DEV_NEW'],
                password
            }

            //get master for seed
            let wallet2Eth = await ethCrypto.generateWalletFromSeed(wallet2.mnemonic)
            wallet2.masterAddress = wallet2Eth.masterAddress

            console.log("wallet2: ",wallet2)
            //create wallet files
            let successCreate2 = await App.createWallet('software',wallet2)
            console.log("successCreate2: ",successCreate2)
        }catch(e){

        }



        //init config
        //throw Error("Must setup!")
        //create
        //init config
        await App.initConfig("english");
        // App.updateConfig({isTestnet:true});
        App.updateConfig({username});
        App.updateConfig({temp:password});
        App.updateConfig({blockchains})
        App.updateConfig({created: new Date().getTime()});



    }catch(e){
        console.error(e)
    }
}

run_test()
