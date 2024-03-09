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


        let swap = {
            sellAsset: 'THOR.RUNE',
            sellAmount: '30',
            buyAsset: 'MAYA.CACAO',
            senderAddress: 'thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx',
            recipientAddress: 'maya1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfqkl5k',
            slippage: 3
        }

        let result = await client.getQuote(swap)
        console.log("result: ",result)
        console.log("result: ",result.txs[0])

    }catch(e){
        console.error(e)
    }
}
run_test()
