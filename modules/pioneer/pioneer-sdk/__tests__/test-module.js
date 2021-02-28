require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

const prettyjson = require('prettyjson');
let SDK = require('../lib/index.js')

// let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
let urlSpec = process.env['URL_PIONEER_SPEC']

let walletName = "local_new_2"


let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        //address
        let address = process.env['TEST_ETH_MASTER']

        //
        let domain = "www.fakedomain123.com"

        let config = {
            addresses:[address],
            domain,
            spec:urlSpec
        }

        //init
        let app = new SDK('testapp',config)

        //init metamask
        let info = await app.init()
        console.log("total Value: ",info.totalValueUsd)

    }catch(e){
        console.error(e)
    }
}

run_test()
