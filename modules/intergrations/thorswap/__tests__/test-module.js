require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let thorswap = require("../lib/index")

let run_test = async function(){
    try {
        thorswap.init()
        //
        // let support = thorswap.networkSupport()
        // console.log("support: ",support)

        let assetSupport = thorswap.assetSupport()
        console.log("assetSupport: ",assetSupport)
        
        // let swap = {
        //     sellAsset: 'BCH.BCH',
        //     sellAmount: '100',
        //     buyAsset: 'ETH.ETH',
        //     senderAddress: 'qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
        //     recipientAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     slippage: 3
        // }

        // let swap = {
        //     sellAsset: 'ETH.ETH',
        //     sellAmount: '0.04',
        //     buyAsset: 'BCH.BCH',
        //     senderAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     recipientAddress: 'qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
        //     slippage: 3
        // }
        
        // let swap = {
        //     sellAsset: 'DOGE.DOGE',
        //     buyAsset: 'BCH.BCH',
        //     sellAmount: '200.0',
        //     senderAddress: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
        //     recipientAddress: 'qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
        //     slippage: '3'
        // }
        //
        // let result = await thorswap.getQuote(swap)
        // console.log("result: ",result.length)
        // console.log("result: ",JSON.stringify(result))
        // for(let i = 0; i < result.length; i++){
        //     console.log("result: ",result[i].routes[0].swap)
        //    
        //    
        // }
        
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
