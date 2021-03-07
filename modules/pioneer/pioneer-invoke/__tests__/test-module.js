/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let Invoke = require("../lib")

//force
//process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let spec = process.env['URL_PIONEER_SPEC']
let seed_1 = process.env['WALLET_MAINNET_DEV']
let password = process.env['WALLET_PASSWORD']
let username = process.env['TEST_USERNAME_1']
let queryKey = process.env['TEST_QUERY_KEY_1']

let run_test = async function(){
    try{
        let config = {
            queryKey,
            username,
            spec
        }


        //get config
        let invoke = new Invoke(spec,config)
        await invoke.init()

        //get online

        //if username not online abort
        let onlineUsers = await invoke.online()
        console.log("onlineUsers: ",onlineUsers)

        let isOnline = false
        if(onlineUsers.indexOf(username) >= 0) isOnline = true
        if(!isOnline) throw Error("User not connected!")

        //
        let coin = "BTC"
        let amount = "1"
        let to = "asd"
        let memo = "asd"

        let invocation = {
            username,
            coin,
            amount,
            to,
            memo
        }

        let result = await invoke.invoke('PaymentRequest',invocation)
        console.log("result: ",result.data)

    }catch(e){
        console.error(e)
    }
}

run_test()
