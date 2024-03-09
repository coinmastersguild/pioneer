

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let osmosis = require("../lib/index")

// console.log("servers: ",servers)
let run_test = async function(){
    try{
        //
        await osmosis.init({})

        let swap = {
            sellAsset: 'cosmos:osmosis-1/slip44:118',
            sellAmount: '1',
            buyAsset: 'cosmos:cosmoshub-4/slip44:118',
            senderAddress: 'osmo1rs7fckgznkaxs4sq02pexwjgar43p5wnkx9s92',
            recipientAddress: 'cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc',
            slippage: 3
        }
        
        let result = await osmosis.getQuote(swap)
        console.log("result: ",result)
        // console.log("result: ",result.txs[0])
        // console.log("result: ",result.txs[1])
    }catch(e){
        console.error(e)
    }
}
run_test()
