require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

const prettyjson = require('prettyjson');
let SDK = require('../lib/index.js')

// let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
let urlSpec = process.env['URL_PIONEER_SPEC']

let spec = process.env['URL_PIONEER_SPEC']
let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        //enums blockchains supported
        let blockchains = [
            'bitcoin',
            'ethereum',
            'thorchain',
            'binance'
        ]

        let config = {
            network:'testnet',
            blockchain:blockchains[0],
            queryKey,
            username,
            spec:urlSpec
        }


        //init
        let app = new SDK(urlSpec,config)
        await app.init()

        console.log(app)

        let network = app.getNetwork()
        console.log("network: ",network)

        let explorerUrl = app.getExplorerUrl()
        console.log("explorerUrl: ",explorerUrl)

        let explorerAddressUrl = app.getExplorerAddressUrl()
        console.log("explorerAddressUrl: ",explorerAddressUrl)

        let explorerTxUrl = app.getExplorerTxUrl()
        console.log("explorerTxUrl: ",explorerTxUrl)

        //

    }catch(e){
        console.error(e)
    }
}

run_test()
