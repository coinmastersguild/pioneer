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
        let onlineUsers = await pioneer.instance.Online()
        onlineUsers = onlineUsers.data
        console.log("onlineUsers: ",onlineUsers)

        // let isOnline = false
        // if(onlineUsers.indexOf(username) >= 0) isOnline = true
        // if(!isOnline) throw Error("User not connected!")

        // let info = await pioneer.instance.Info()
        // console.log("info: ",info.data)

    }catch(e){
        console.error(e)
    }
}

run_test()
