/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let pioneerApi = require("../lib")

//force
//process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
// process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let spec = process.env['URL_PIONEER_SPEC']


let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

// let queryKey = 'key:d9c55eff-a8d0-48e1-bb0f-db131e5576a0'
// let username  = 'user:1911ccde-89df-4fc4-8a71-56097b9d418b'

// let username = process.env['TEST_USERNAME_1']
// let queryKey = process.env['TEST_QUERY_KEY_1']

let walletId = 'keepkey-pubkeys-343733331147363327003800'

let run_test = async function(){
    try{
        //get config


        let config = {
            queryKey,
            username,
            spec
        }
        // let config = {
        //     queryKey:"79d94b78-eb50-445d-b97f-e524dca80b58",
        //     username:'test-user-2',
        //     spec
        // }
        console.log("config: ",config)

        //get config
        let pioneer = new pioneerApi(spec,config)
        pioneer = await pioneer.init()

        let status = await pioneer.instance.Status()
        console.log("status: ",status.data.exchanges.markets)

        // console.log("pioneer: ",pioneer)

        //get new address
        //
        // let newAddy = await pioneer.instance.GetNewAddress({network:'BTC',xpub:""})
        // console.log("newAddy: ",newAddy.data)
        //
        // let newAddyChange = await pioneer.instance.GetChangeAddress({network:'BTC',xpub:""})
        // console.log("newAddyChange: ",newAddyChange.data)

        //get change address

        // let xpub = ""
        // let data = await pioneer.instance.ListUnspent({network:'BTC',xpub:"xpub6CDvS4rkJBfqEyBdTo7omDxv3BwDr5XmWeKsU9HAaLSG28GztaywbAsm6SBWPyEsZ6QDubVnXtNEfDZ74RkDVeLUSkjdZDbsLZCqNWqy7wQ"})
        // data = data.data
        // console.log("txData: ",JSON.stringify(data))

        // let data = await pioneer.instance.GetAccountInfo({network:'OSMO',address:"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6"})
        // data = data.data
        // console.log("txData: ",data)

        //get online

        //get txid {coin,txid}
        // let coin = "BTC"
        // let txid = "83fab6e9084fd3b99bc69221db5c923fa7a8ff1046845940105f88fc551e4d18"
        // let txInfo = await pioneer.instance.GetTransaction({coin,txid})
        // console.log("txInfo: ",txInfo)

        //if username not online abort
        // let onlineUsers = await pioneer.instance.Online()
        // onlineUsers = onlineUsers.data
        // console.log("onlineUsers: ",onlineUsers)

        // let blockheight = await pioneer.instance.BlockHeight({network:"OSMO"})
        // blockheight = blockheight.data
        // console.log("blockheight: ",blockheight)

        // let validators = await pioneer.instance.GetValidators('osmosis')
        // validators = validators.data
        // console.log("validators: ",validators)

        // let validators = await pioneer.instance.GetDelegations({network:'osmosis',address:'osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn',validator:'osmovaloper1cyw4vw20el8e7ez8080md0r8psg25n0cq98a9n'})
        // validators = validators.data
        // console.log("validators: ",validators)

        // let isOnline = false
        // if(onlineUsers.indexOf(username) >= 0) isOnline = true
        // if(!isOnline) throw Error("User not connected!")

        // let user = await pioneer.instance.User()
        // console.log("user: ",user.data)
        // console.log("user: ",JSON.stringify(user.data))
        //
        // let info = await pioneer.instance.Info(user.data.context)
        // console.log("info: ",info.data)

        // let data = await pioneer.instance.GetThorchainMemoEncoded(null, {})
        // data = data.data
        // console.log("txData: ",data)

        // let code = "GNF1RC"
        // let data = await pioneer.instance.Pair(null, {code})
        // data = data.data
        // console.log("txData: ",data)


        //broadcast
        // let broadcast = {
        //     serialized: 'c101f0625dee0a482a2c87fa0a200a1441a3320611caffc31d0148880077f71cfb6509fd12080a03424e4210904e12200a142023e508399b9f0ff4ff784c14bce6427e69a66812080a03424e4210904e12710a26eb5ae987210290916077c387b262a940380d250fd8151c42abf9d8072397797844fab14924c11240370d580aa0ce77496e0fa213e12027d9f635b7b4046369d58e5f2d5ae05d555110d751f1ffe70089ff126d9a9cec85f16f5fb092cb7314be07d5f74b7e3b9adf18eda111208d01',
        //     coin: 'BNB'
        // }
        // let data = await pioneer.instance.Broadcast(null, broadcast)
        // data = data.data
        // console.log("data: ",data)

        // let broadcast = {
        //     serialized: '0xf901511085028fa6ae008301388094a13beb789f721253077faefd9bf604e1929e0e7487038d7ea4c68000b8e41fece7b4000000000000000000000000a13beb789f721253077faefd9bf604e1929e0e74000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000003d535741503a756e646566696e65642e4554483a3078336534383565326337646637313265633137306330383765636635633135303136613033663933660000001ca021214c47d7977f78b2beed0f4c7dfcdf0fcd9bf4232dc2cb2e85372b78908d80a05c86dd58a3d5fc3105c61283b1fff866da9889f33a4a58e6d782b6c4e733d2fd',
        //     coin: 'ETH',
        //     isTestnet:true
        // }
        // let data = await pioneer.instance.Broadcast(null, broadcast)
        // data = data.data
        // console.log("data: ",data)

    }catch(e){
        console.error(e)
    }
}

run_test()
