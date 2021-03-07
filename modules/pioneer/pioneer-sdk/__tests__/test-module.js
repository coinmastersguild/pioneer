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
            spec:urlSpec
        }


        //init
        let app = new SDK(urlSpec,config)
        await app.init()

        //is paired?
        let info = await app.getInfo()
        console.log("info: ",info)

        // if(!info){
        //     console.log("Not paired! ")
        //     //create pairing code
        //     let code = await app.createPairingCode()
        //     console.log("code: ",code)
        // }



    }catch(e){
        console.error(e)
    }
}

run_test()
