require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let thorswap = require("../lib/index")

let run_test = async function(){
    try {
        thorswap.init()
        //
        let support = thorswap.networkSupport()
        console.log("support: ",support)

        let swap = {
            sellAsset: 'BCH.BCH',
            sellAmount: '0.01',
            buyAsset: 'DOGE.DOGE',
            senderAddress: 'bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
            recipientAddress: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
            slippage: 3
        }
        
        let result = await thorswap.getQuote(swap)
        console.log("result: ",result)

    } catch (e) {
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
