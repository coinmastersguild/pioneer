

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let client = require("../lib/index")

// console.log("servers: ",servers)
let run_test = async function(){
    try{
        //
        await client.init({})

        // let swap = {
        //     sellAsset: 'DASH.DASH',
        //     sellAmount: '1',
        //     buyAsset: 'MAYA.CACAO',
        //     senderAddress: 'Xursn5XQzLEa2J91uEWeAVsKpLsBTf393x',
        //     recipientAddress: 'maya1ls33ayg26kmltw7jjy55p32ghjna09zp7z4etj',
        //     slippage: 3
        // }

        // let swap = {
        //     sellAsset: 'MAYA.CACAO',
        //     sellAmount: '30',
        //     buyAsset: 'THOR.RUNE',
        //     senderAddress: 'maya1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfqkl5k',
        //     recipientAddress: 'thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx',
        //     slippage: 3
        // }

        let swap = {
            sellAsset: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
            sellAmount: '0.007',
            buyAsset: 'eip155:1/slip44:60',
            recipientAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
            slippage: 3
        }

        // let swap = {
        //     sellAsset: 'eip155:1/slip44:60',
        //     sellAmount: '0.1',
        //     buyAsset: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
        //     senderAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     recipientAddress: 'bc1qu3ghkz8788ysk7gqcvke5l0mr7skhgvpuk6dk4',
        //     slippage: 3
        // }

        let result = await client.getQuote(swap)
        console.log("result: ",result)
        // console.log("result: ",result.txs[0])

        // let quoteId = '2258444-Ethereum-141'
        // let result = await client.lookupTx(quoteId)
        // console.log("result: ",result)
        
    }catch(e){
        console.error(e)
    }
}
run_test()
