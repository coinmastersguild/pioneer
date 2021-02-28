require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let client = require("../lib/index")
client.init()


let address = process.env['TEST_ETH_MASTER']

client.submitAddress('ETH',address)
    .then(function(resp){
        console.log("resp",resp)
    })
