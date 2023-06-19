/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})
const Pioneer = require("../lib").default;

let signer = require("eth_mnemonic_signer")

//force
// process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let spec = process.env['URL_PIONEER_SPEC']
const log = require('@pioneer-platform/loggerdog')()
const mnemonic = 'all all all all all all all all all all all all'
//let mnemonic = process.env['WALLET_MAINNET_DEV']

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

        let config = {
            queryKey:'key:public',
            // username:"user:cfd27e74",
            spec
        }

        // let config = {
        //     queryKey:'sdk:pair-keepkey:test-1234',
        //     username,
        //     spec
        // }
        // let config = {
        //     queryKey:"79d94b78-eb50-445d-b97f-e524dca80b58",
        //     username:'test-user-2',
        //     spec
        // }
        console.log("config: ",config)
        
        // Create an instance of the Pioneer class
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();
        //list developers
        console.log("pioneer: ",pioneer)
        // let txInfo = await pioneer.ListDevelopers({limit:10,skip:0})
        // log.debug("devs: ",txInfo.data)

        // console.log(signer)
        // let globals = await pioneer.instance.Globals()
        // console.log("globals: ",globals.data)

        let address = await signer.getAddress(mnemonic)
        console.log("address: ",address)

        //is address logged in?
        let user = await pioneer.GetUser({publicAddress:address})
        console.log("user: ",user.data)

        let nonce = user.data.nonce

        //signup
        //get message to sign
        let message = `I am signing my one-time nonce: ${nonce}`

        //sign
        let signature = await signer.signMessage(message,mnemonic)
        log.info("signature: ",signature)

        //login
        let loginInput = {publicAddress:address,signature,message}
        log.info("loginInput: ",loginInput)        
        let loginResp = await pioneer.Login(loginInput)
        console.log("loginResp: ",loginResp.data)


    }catch(e){
        console.error(e)
    }
}

run_test()
