/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let Invoke = require("../lib")

//force
process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
//process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
const open = require("open");
let spec = process.env['URL_PIONEER_SPEC']
let seed_1 = process.env['WALLET_MAINNET_DEV']
let password = process.env['WALLET_PASSWORD']
// let username = process.env['TEST_USERNAME_1']

let queryKey = process.env['TEST_QUERY_KEY_2']

//single party evoketion
//invoker can only request from OWNED username
let invoker = process.env['TEST_USERNAME_2']

//
// let invoker = process.env['TEST_USERNAME_1']
// let invokee = process.env['TEST_USERNAME_2']


let signingPubkey = process.env['DAPP_SIGNING_PUBKEY']
let signingPrivkey = process.env['DAPP_SIGNING_PRIVKEY']
console.log("signingPubkey: ",signingPubkey)
console.log("signingPrivkey: ",signingPrivkey)

//open webpage with invocation


let run_test = async function(){
    try{
        let config = {
            queryKey,
            // signingPubkey,
            // signingPrivkey,
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

        // let txInput = {
        //     "asset":
        //         {
        //             "chain":"ETH",
        //             "symbol":"ETH",
        //             "ticker":"ETH"
        //         },
        //     "amount":
        //         {
        //             "type":"BASE",
        //             "decimal":18,
        //             amount: function(){
        //                 return "0.0123"
        //             }
        //         },
        //     "recipient":"0xb7d23e939d64156980055be472197698e6cf7ed2",
        //     "memo":"=:ETH.ETH:0x3e485e2C7df712Ec170C087ecf5C15016A03F93F"
        // }
        //
        // //TODO Dont use this! old!
        // let inboundAddress = {
        //     chain: 'ETH',
        //     pub_key: 'thorpub1addwnpepqfflwuyaz7ca82uv5wjasd8zphrqvcstx7vle9mxv3nr8qf239z5zt9clnj',
        //     address: '0xb7d23e939d64156980055be472197698e6cf7ed2',
        //     router: '0x42A5Ed456650a09Dc10EBc6361A7480fDd61f27B',
        //     halted: false,
        //     gas_rate: '100'
        // }
        //
        // let invocation = {
        //     type:"swap",
        //     username:invoker,
        //     coin:txInput.asset.symbol,
        //     asset:txInput.asset.symbol,
        //     amount:txInput.amount.amount(),
        //     inboundAddress,
        //     memo:txInput.memo
        // }
        //
        // let result = await invoke.invoke('swap',invocation)
        // console.log("result: ",result.data)



        // let txInput = {
        //     "asset":
        //         {
        //             "chain":"BTC",
        //             "symbol":"BTC",
        //             "ticker":"BTC"
        //         },
        //     "amount":
        //         {
        //             "type":"BASE",
        //             "decimal":18,
        //             amount: function(){
        //                 return "0.0123"
        //             }
        //         },
        //     "recipient":"mwFBhs7o4TzLRtZ8XZDB39JmiZSPCCmgMn",
        //     "memo":"=:ETH.ETH:0x3e485e2C7df712Ec170C087ecf5C15016A03F93F"
        // }
        //
        // let invocation = {
        //     username:invoker,
        //     coin:txInput.asset.symbol,
        //     amount:txInput.amount.amount(),
        //     to:txInput.recipient,
        //     memo:txInput.memo
        // }
        //
        // let result = await invoke.invoke('swap',invocation)
        // console.log("result: ",result.data)


        // let txInput = {
        //     "asset":
        //         {
        //             "chain":"ETH",
        //             "symbol":"ETH",
        //             "ticker":"ETH"
        //         },
        //     "amount":
        //         {
        //             "type":"BASE",
        //             "decimal":18,
        //             amount: function(){
        //                 return "0.02"
        //             }
        //         },
        //     "recipient":"0xc3affff54122658b89c31183cec4f15514f34624",
        //     "memo":""
        // }
        //
        // let invocation = {
        //     type:"transfer",
        //     context:"343733331147363327003800.wallet.json",
        //     username:invoker,
        //     coin:txInput.asset.symbol,
        //     amount:txInput.amount.amount(),
        //     address:txInput.recipient,
        //     memo:txInput.memo,
        //     noBroadcast:true
        // }

        // let testSwap = {
        //     type: 'transfer',
        //     username: 'test-user-2',
        //     invocation: {
        //         username: 'test-user-2',
        //         coin: 'BCH',
        //         amount: '0.0751396',
        //         address: 'qqmjn5apwwge6yeehlvdfru4hm2u4yjrjyyn78wfwz',
        //         invocationId: 'pioneer:invocation:v0.01:BCH:eWSEefK85hMVYqGfsZsWCv',
        //         addressTo: 'qqmjn5apwwge6yeehlvdfru4hm2u4yjrjyyn78wfwz',
        //         context: undefined
        //     },
        //     invocationId: 'pioneer:invocation:v0.01:BCH:eWSEefK85hMVYqGfsZsWCv',
        //     auth: 'key:2ec1460e-c460-41ce-99d1-c324c5a3b977'
        // }

        // let invocation =  {
        //     "type":"transfer",
        //     "context":"0x9a3a6824340baa81e2b7095a4d9d1a2c850879a9.wallet.json",
        //     "username":"testerconfigenv",
        //     "coin":"OSMO",
        //     "fee":{
        //         "priority":5
        //     },
        //     "network":"OSMO",
        //     "asset":"OSMO",
        //     "amount":"0.04",
        //     "address":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6",
        //     "memo":"",
        //     "noBroadcast":true,
        //     "invocationId":"pioneer:invocation:v0.01:OSMO:9cPFW69QNmoSjmmHVdzy12"
        // }

        let invocation =  {
            "type":"evm",
            "context":"0x9a3a6824340baa81e2b7095a4d9d1a2c850879a9.wallet.json",
            "username":"testerconfigenv",
            "coin":"OSMO",
            "fee":{
                "priority":5
            },
            "network":"OSMO",
            "asset":"OSMO",
            "amount":"0.04",
            "address":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6",
            "memo":"",
            "noBroadcast":true,
            "invocationId":"pioneer:invocation:v0.01:OSMO:9cPFW69QNmoSjmmHVdzy12"
        }

        let result = await invoke.invoke('transfer',invocation)
        console.log("result: ",result.data)

        //open invoke page
        // open("http://localhost:8080/#/invocation/"+result.data.invocationId)
        // open("https://pioneers.dev/#/invocation/"+result.data.invocationId)

        // open("http://localhost:9001/#/invocation/"+result.data.invocationId)

    }catch(e){
        console.error(e)
    }
}

run_test()
