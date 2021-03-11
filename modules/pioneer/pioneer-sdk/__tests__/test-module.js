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

        let config = {
            queryKey,
            username,
            spec
        }

        //console.log(SDK)
        let app = new SDK.SDK(spec,config)
        //console.log(app)
        await app.init()

        //init
        // let app = new SDK(urlSpec,config)
        // await app.init()
        //
        //console.log("app: ",app)

        let code = await app.createPairingCode()
        console.log("code: ",code)

        //is paired?
        // let info = await app.getInfo()
        // console.log("info: ",info)

        // if(!info){
        //     console.log("Not paired! ")
        //     //create pairing code
        //     let code = await app.createPairingCode()
        //     console.log("code: ",code)
        // }

        //get user
        // let user = await app.getUserParams()
        //console.log("user: ",user)

        //binance
        // const address = await user.binance.client.getAddress();
        // const bncBalances = await user.binance.bncClient.getBalance(address);
        //
        // console.log("user: ",address)
        // console.log("bncBalances: ",bncBalances)
        //BTC

        //ETH


    }catch(e){
        console.error(e)
    }
}

run_test()
