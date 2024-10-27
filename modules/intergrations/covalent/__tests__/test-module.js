require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let client = require("../lib/index")
client.init()

let run_test = async function(){
    try {
        let address = "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        let networkId = "eip155:1"
        // let networkId = "eip155:8453"

        // let result = await client.getTokenBalances(address,networkId)
        // console.log("result: ",result)
        // console.log("result: ",result.items)

        let result = await client.getNftBalances(address,networkId)
        console.log("result: ",result)
        console.log("result: ",result.items)
        console.log("result: ",result.items[1].nft_data[0])
    }   catch (e) {
        console.error(e)
    }
}
run_test()


// let address = process.env['TEST_ETH_MASTER']
//
// client.submitAddress('ETH',address)
//     .then(function(resp){
//         console.log("resp",resp)
//     })
