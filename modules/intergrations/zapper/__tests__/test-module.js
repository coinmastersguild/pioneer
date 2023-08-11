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
        //let address = "0x21c9a94AF76B59b171b32fD125A4edF0e9A2Ad3e"
        let address = "0x141d9959cae3853b035000490c03991eb70fc4ac"
        // let result = await client.getTotalNetworth(address)
        // console.log("result: ",result)

        //getPortfolio
        let result = await client.getPortfolio(address)
        console.log("result: ",result)
        console.log("result: ",result.tokens)
        console.log("result: ",result.tokens[0])
        // console.log("result: ",result.nfts)
        // console.log("result: ",JSON.stringify(result.nfts))

        // let result = await client.getTokens(address)
        // console.log("result: ",result)

        // let result = await client.getTokens(address)
        // console.log("result: ",result)

        // let result = await client.getTokens(address)
        // console.log("result: ",result)

    }   catch (e) {
        console.error(e)
    }
}
run_test()

