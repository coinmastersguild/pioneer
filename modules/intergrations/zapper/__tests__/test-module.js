require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let client = require("../lib/index")



let run_test = async function(){
    try {
        // let address = "0x41CB654D1F47913ACAB158a8199191D160DAbe4A"
        let address = "0x2356A15042F98f0a53784F42237bd4b2873AADCF"
        // let result = await client.getTotalNetworth(address)
        // console.log("result: ",result)

        //getPortfolio
        let result = await client.getPortfolio(address)
        console.log("result: ",result)
        console.log("result: ",JSON.stringify(result))

        // let result = await client.getTokens(address)
        // console.log("result: ",result)

        // let result = await client.getTokens(address)
        // console.log("result: ",result)

    }   catch (e) {
        console.error(e)
    }
}
run_test()

