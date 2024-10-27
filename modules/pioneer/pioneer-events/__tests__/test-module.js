require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let Events = require("../lib")

let WALLET_PASSWORD = process.env['WALLET_PASSWORD']
if(!WALLET_PASSWORD) throw Error(".env not found!")

//force
//process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let seed_1 = process.env['WALLET_MAINNET_DEV_OLD']
let seed_2 = process.env['WALLET_MAINNET_DEV_NEW']

let wallet_1_name = process.env['TEST_USERNAME_1']
let wallet_2_name = process.env['TEST_USERNAME_2']

let TEST_QUERY_KEY_1 = process.env['TEST_QUERY_KEY_1']
let TEST_QUERY_KEY_2 = process.env['TEST_QUERY_KEY_2']

// let password = process.env['WALLET_PASSWORD']
// let username = wallet_2_name
// console.log("password: ",password)

let run_test = async function(){
    try{

        let config = {
            // queryKey:TEST_QUERY_KEY_2,
            username:"tester123",
            queryKey:"12312312ssdasas",
            wss:"ws://127.0.0.1:9001"
        }

        //sub ALL events
        let clientEvents = new Events.Events(config)
        clientEvents.init()
        clientEvents.setUsername(config.username)
        //let invocation = ""

        // clientEvents.subscribeToKey()

        //info
        clientEvents.events.on('message',function(request){
            console.log("message: ",request)
        })

        clientEvents.send('event','hello world')
        //Filter
        //blocks
        //payments
        //requests

    }catch(e){
        console.error(e)
    }
}
run_test()
