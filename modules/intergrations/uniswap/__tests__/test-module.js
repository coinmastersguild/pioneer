/*
    This is a test module for the uniswap integration

 */



require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let client = require("../lib/index")

// console.log("servers: ",servers)
let run_test = async function(){
    try{
        //
        await client.init({})
        //
        let swap = {
            sellAsset: 'eip155:8453/slip44:60',
            sellAmount: '0.01',
            buyAsset: 'eip155:8453/erc20:0XEF743DF8EDA497BCF1977393C401A636518DD630',
            senderAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
            recipientAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
            slippage: 3
        }

        // let swap = {
        //     sellAsset: 'eip155:8453/erc20:0xef743df8eda497bcf1977393c401a636518dd630',
        //     sellAmount: '0.01',
        //     buyAsset: 'eip155:8453/erc20:0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
        //     senderAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     recipientAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     slippage: 3
        // }

        // let swap = {
        //     sellAsset: 'eip155:8453/slip44:60',
        //     sellAmount: '0.01',
        //     buyAsset: 'eip155:8453/erc20:0xef743df8eda497bcf1977393c401a636518dd630',
        //     senderAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     recipientAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     slippage: 3
        // }
        // console.log("swao: ",swap)
        let result = await client.getQuote(swap)
        console.log("result: ",result)
        console.log("result: ",result.txs[0])

    }catch(e){
        console.error(e)
    }
}
run_test()
