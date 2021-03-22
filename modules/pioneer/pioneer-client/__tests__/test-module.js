/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let pioneerApi = require("../lib")

//force
//process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let spec = process.env['URL_PIONEER_SPEC']


// let username = process.env['TEST_USERNAME_2']
// let queryKey = process.env['TEST_QUERY_KEY_2']

let queryKey = 'key:d9c55eff-a8d0-48e1-bb0f-db131e5576a0'
let username  = 'user:1911ccde-89df-4fc4-8a71-56097b9d418b'

// let username = process.env['TEST_USERNAME_1']
// let queryKey = process.env['TEST_QUERY_KEY_1']

let run_test = async function(){
    try{
        let config = {
            queryKey,
            username,
            spec
        }


        //get config
        let pioneer = new pioneerApi(spec,config)
        pioneer = await pioneer.init()

        console.log("pioneer: ",pioneer)

        //get online

        //if username not online abort
        // let onlineUsers = await pioneer.instance.Online()
        // onlineUsers = onlineUsers.data
        // console.log("onlineUsers: ",onlineUsers)

        // let isOnline = false
        // if(onlineUsers.indexOf(username) >= 0) isOnline = true
        // if(!isOnline) throw Error("User not connected!")

        // let info = await pioneer.instance.Info()
        // console.log("info: ",info.data)

        // let data = await pioneer.instance.GetThorchainMemoEncoded(null, {})
        // data = data.data
        // console.log("txData: ",data)

        //broadcast
        let broadcast = {
            serialized: '0xf901511085028fa6ae008301388094a13beb789f721253077faefd9bf604e1929e0e7487038d7ea4c68000b8e41fece7b4000000000000000000000000a13beb789f721253077faefd9bf604e1929e0e74000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000003d535741503a756e646566696e65642e4554483a3078336534383565326337646637313265633137306330383765636635633135303136613033663933660000001ca021214c47d7977f78b2beed0f4c7dfcdf0fcd9bf4232dc2cb2e85372b78908d80a05c86dd58a3d5fc3105c61283b1fff866da9889f33a4a58e6d782b6c4e733d2fd',
            coin: 'ETH',
            isTestnet:true
        }
        let data = await pioneer.instance.Broadcast(null, broadcast)
        data = data.data
        console.log("data: ",data)

    }catch(e){
        console.error(e)
    }
}

run_test()
