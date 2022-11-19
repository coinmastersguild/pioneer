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

        //get config
        let pioneer = new pioneerApi(spec,config)
        pioneer = await pioneer.init()

        //list developers
        let txInfo = await pioneer.instance.ListDevelopers()
        console.log("devs: ",txInfo.data)

        // console.log(signer)
        // // let globals = await pioneer.instance.Globals()
        // // console.log("globals: ",globals.data)
        //
        // let info = await pioneer.instance.Info()
        // console.log("info: ",info.data)
        //
        // //get address

        // let address = await signer.getAddress(mnemonic)
        // console.log("address: ",address)
        //
        // //is address logged in?
        // let user = await pioneer.instance.GetUser({publicAddress:address})
        // console.log("user: ",user.data)
        //
        // let nonce = user.data.nonce
        //
        // //signup
        // //get message to sign
        // let message = `I am signing my one-time nonce: ${nonce}`
        //
        // //sign
        // let signature = await signer.signMessage(message,mnemonic)
        // console.log("signature: ",signature)
        //
        // //login
        // let loginResp = await pioneer.instance.Login({},{publicAddress:address,signature,message})
        // console.log("loginResp: ",loginResp.data)


        //signup
        //get message to sign
        // let message = `nonce: ${nonce} MOTD: Welcome to the Dapp store!`
        //
        // //sign
        // let signature = await signer.signMessage(message,mnemonic)
        // console.log("signature: ",signature)
        //
        // //update MOTD
        // let updateResp = await pioneer.instance.UpdateMOTD({},{publicAddress:address,signature,message})
        // console.log("updateResp: ",updateResp)


        //add token to auth header

        //see public info
        //see public info + private

        // let status = await pioneer.instance.Status()
        // console.log("status: ",status.data)

        // console.log("tokens: ",status.data.rango.tokens[0])
        // console.log("blockchains: ",status.data.rango.blockchains)
        // console.log("blockchains: ",status.data.rango.blockchains[0])
        // console.log("swappers: ",status.data.rango.swappers)
        // console.log("swappers: ",status.data.rango.swappers[0])

        // console.log("status: ",status.data.exchanges.thorchain)
        // console.log("status: ",status.data.exchanges.thorchain.assets)
        // console.log("status: ",status.data.exchanges.osmosis.assets)


        // let invocation = '7dbdd41c-ce39-4e28-9493-08e3c56e5c5b'
        // let txInfo = await pioneer.instance.Invocation(invocation)
        // console.log("invocation: ",txInfo.data)

        //Submit new dev
        // let dev = {
        //     username: 'highlander',
        //     address:"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //     signature:"asfasdd"
        // }
        //
        //
        // let txInfo = await pioneer.instance.CreateDeveloper(dev)
        // console.log("apps: ",txInfo.data)


        //remove developer







    }catch(e){
        console.error(e)
    }
}

run_test()
