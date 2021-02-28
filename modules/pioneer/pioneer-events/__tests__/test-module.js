require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let client = require("../lib")

let WALLET_PASSWORD = process.env['WALLET_PASSWORD']
if(!WALLET_PASSWORD) throw Error(".env not found!")

//force
//process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let seed_1 = process.env['WALLET_MAINNET_DEV_OLD']
let seed_2 = process.env['WALLET_MAINNET_DEV_NEW']

let wallet_1_name = process.env['TEST_USERNAME_1']
let wallet_2_name = process.env['TEST_USERNAME_2']

let TEST_QUERY_KEY_1 = process.env['TEST_QUERY_KEY_1']

let password = process.env['WALLET_PASSWORD']
let username = wallet_1_name
console.log("password: ",password)

let run_test = async function(){
    try{

        let config = {
            username,
            queryKey:TEST_QUERY_KEY_1,
            pioneerWs:"ws://127.0.0.1:9001"
        }

        //sub ALL events
        let events = await client.init(config)

        //info
        events.on('message',function(request){
            console.log("message: ",request)
        })

        //Filter
        //blocks
        //payments
        //requests

    }catch(e){
        console.error(e)
    }
}
run_test()
