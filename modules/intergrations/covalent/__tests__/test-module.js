require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let client = require("../lib/index")
client.init()

let run_test = async function(){
    try {
        let address = "0x658DE0443259a1027caA976ef9a42E6982037A03"
        // let networkId = "155:1"
        let networkId = "eip155:8453"
        let result = await client.getTokenBalances(address,networkId)
        console.log("result: ",result)
        console.log("result: ",result.items)
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
