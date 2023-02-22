require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let client = require("../lib/index")
client.init()

let run_test = async function(){
    try {
        let tx = {
            to:"0xa3c81f1f2598d5fb5447d95aa03f31bba7f1dd21",
            from:"0x2356a15042f98f0a53784f42237bd4b2873aadcf",
            data:"0xa22cb4650000000000000000000000007273d1671fcd37ef5b949ebf88234aa9c3e439570000000000000000000000000000000000000000000000000000000000000001"
        }
        let transaction = {
            "to":tx.to,
            "from":tx.from,
            "gas":104070560,
            "maxFeePerGas":1023066356340,
            "maxPriorityFeePerGas":2.14,
            "value":100000000000000000,
            "input":tx.data
        }
        let result = await client.simulateTx('ethereum',transaction)
        console.log("result: ",result)
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
