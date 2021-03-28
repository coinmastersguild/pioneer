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
// let username = process.env['TEST_USERNAME_1']

let queryKey = process.env['TEST_QUERY_KEY_1']

//single party evoketion
//invoker can only request from OWNED username
let invoker = process.env['TEST_USERNAME_2']

//
// let invoker = process.env['TEST_USERNAME_1']
// let invokee = process.env['TEST_USERNAME_2']

let run_test = async function(){
    try{
        let config = {
            queryKey,
            username:invoker,
            spec
        }


        //get config
        let invoke = new Invoke(spec,config)
        await invoke.init()

        //get online
        console.log("invoker: ",invoker)
        //if username not online abort
        let onlineUsers = await invoke.online()
        console.log("onlineUsers: ",onlineUsers)

        let isOnline = false
        if(onlineUsers.indexOf(invoker) >= 0) isOnline = true
        if(!isOnline) throw Error("User not connected!")


        let txInput = {
            "asset":
                {
                    "chain":"BTC",
                    "symbol":"BTC",
                    "ticker":"BTC"
                },
            "amount":
                {
                    "type":"BASE",
                    "decimal":18,
                    amount: function(){
                        return "0.0123"
                    }
                },
            "recipient":"mwFBhs7o4TzLRtZ8XZDB39JmiZSPCCmgMn",
            "memo":"=:ETH.ETH:0x3e485e2C7df712Ec170C087ecf5C15016A03F93F"
        }

        let invocation = {
            username:invoker,
            coin:txInput.asset.symbol,
            amount:txInput.amount.amount(),
            to:txInput.recipient,
            memo:txInput.memo
        }

        let result = await invoke.invoke('swap',invocation)
        console.log("result: ",result.data)

    }catch(e){
        console.error(e)
    }
}

run_test()
