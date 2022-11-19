/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let pioneerApi = require("../lib")

let signer = require("eth_mnemonic_signer")

//force
// process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let spec = process.env['URL_PIONEER_SPEC']

//const mnemonic = 'all all all all all all all all all all all all'
let mnemonic = process.env['WALLET_MAINNET_DEV']

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

// let queryKey = 'key:d9c55eff-a8d0-48e1-bb0f-db131e5576a0'
// let username  = 'user:1911ccde-89df-4fc4-8a71-56097b9d418b'

// let username = process.env['TEST_USERNAME_1']
// let queryKey = process.env['TEST_QUERY_KEY_1']

// let context = 'keepkey-pubkeys-343733331147363327003800'


let run_test = async function(){
    try{
        //get config

        let config = { queryKey:'key:public', spec }
        let Api = new pioneerApi(spec,config)
        let api = await Api.init()
        let info = await api.Info()
        console.log("info: ",info)

    }catch(e){
        console.error(e)
    }
}

run_test()
