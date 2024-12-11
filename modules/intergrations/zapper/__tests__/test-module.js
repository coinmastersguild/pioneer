require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let client = require("../lib/index")



let run_test = async function(){
    try {
        let address = "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        // let address = "0x41CB654D1F47913ACAB158a8199191D160DAbe4A"
        // let address = "0x21c9a94AF76B59b171b32fD125A4edF0e9A2Ad3e"
        // let address = "0x87Ab2637bc4231604ad708c5e8aAC92A260c7704"
        // let result = await client.getTotalNetworth(address)
        // console.log("result: ",result)

        //getPortfolio
        let result = await client.getPortfolio(address.toLowerCase())
        console.log("result: ",result.balances)
        console.log("result: ",result.balances.length)
        // console.log("result: ",result.tokens[0])
        // console.log("result: ",result.nfts)
        // console.log("result: ",JSON.stringify(result.nfts))

        // let result = await client.getTokens(address)
        // console.log("result: ",result)

        // let result = await client.getTokens(address)
        // console.log("result: ",result)

        // let result = await client.getNFTs(address)
        // console.log("result: ",result)

    }   catch (e) {
        console.error(e)
    }
}
run_test()

