require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

const prettyjson = require('prettyjson');
let WalletClass = require('../lib/index.js')

//let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
let urlSpec = process.env['URL_PIONEER_SPEC']

let walletName = "local_new_2"

let TEST_COINS = [
    'BTC',
    // 'BCH',
    // 'ETH',
    // 'ATOM'
]

let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin','osmosis']

let FAUCET_ADDRESSES = {

}

let username = process.env['TEST_USERNAME_2'] || 'offlineuser'


let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        //pioneer
        let config = {
            blockchains,
            mnemonic: process.env['WALLET_MAIN'],
            username,
            pioneerApi:false
        }

        //init wallet offline
        let Wallet = new WalletClass('pioneer',config);

        let info = await Wallet.init()
        console.log("INFO: ",info)

        //RUNE
        let masterRUNE = await Wallet.getMaster("RUNE")
        console.log("masterRUNE: ",masterRUNE)

        let balanceRUNE = await Wallet.getBalance("RUNE")
        console.log("balanceRUNE: ",balanceRUNE)

        /*
            BTC
         */

        let masterBTC = await Wallet.getMaster("BTC")
        console.log("masterBTC: ",masterBTC)

        let balanceBTC = await Wallet.getBalance("BTC")
        console.log("balanceBTC: ",balanceBTC)



        let masterBCH = await Wallet.getMaster("BCH")
        console.log("masterBCH: ",masterBCH)

        let balanceBCH = await Wallet.getBalance("BCH")
        console.log("balanceBCH: ",balanceBCH)


    }catch(e){
        console.error(e)
    }
}

run_test()
