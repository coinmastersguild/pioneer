require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let client = require("../lib/index")

let run_test = async function(){
    try {
        await client.init()
        
        let swap = {
            sellAsset: {
                context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
                caip: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
                identifier: 'BCH.BCH',
                address: 'bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
                symbol: 'BCH',
                chain: 'BCH',
                ticker: 'BCH',
                type: 'Native',
                balance: '0.09640062',
                priceUsd: 233.01,
                rank: 23,
                name: 'bitcoin-cash',
                source: 'coingecko',
                alias: 2,
                valueUsd: '22.4623084662'
            },
            sellAmount: '0.09',
            buyAsset: {
                context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
                caip: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
                identifier: 'DOGE.DOGE',
                address: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
                symbol: 'DOGE',
                chain: 'DOGE',
                ticker: 'DOGE',
                type: 'Native',
                balance: '292.3294878',
                priceUsd: 0.076766,
                rank: 11,
                name: 'dogecoin',
                source: 'coingecko',
                alias: 2,
                valueUsd: '22.440965460454798'
            },
            senderAddress: 'bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
            recipientAddress: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
            slippage: '3'
        }
        
        //get router options
        let result = await client.quote(swap)
        console.log("result: ",result)
        console.log("result: ",JSON.stringify(result))
        //get quote

        //get tx
    } catch (e) {
        console.error(e)
    }
}
run_test()

