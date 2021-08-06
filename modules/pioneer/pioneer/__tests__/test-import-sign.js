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

let blockchains = ['bitcoin','ethereum','thorchain']

let FAUCET_ADDRESSES = {

}

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']
let privkeyExample = process.env['SAMPLE_PRIVKEY_ETH']

let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        let isTestnet = null

        //pioneer
        //TODO Cant do this with hdwallet
        //sign without hdwallet???
        //abort
        // let config = {
        //     blockchains,
        //     privkeys:[
        //         {
        //             network:'ETH',
        //             format:'',
        //             key:privkeyExample,
        //         }
        //     ],
        //     username,
        //     pioneerApi:true,
        //     spec:urlSpec,
        //     queryKey,
        //     auth:process.env['SHAPESHIFT_AUTH'] || 'lol',
        //     authProvider:'shapeshift'
        // }

        //init wallet offline
        let Wallet = new WalletClass('pioneer',config,isTestnet);

        let info = await Wallet.init()
        console.log("total Value: ",info)
        // console.log("total Value: ",info.totalValueUsd)


    }catch(e){
        console.error(e)
    }
}

run_test()
