

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
        //
        // let result = await client.getQuote(swap)
        // console.log("result: ",result)

    }catch(e){
        console.error(e)
    }
}
run_test()
