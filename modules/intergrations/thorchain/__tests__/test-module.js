

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
        //     sellAsset: 'DOGE.DOGE',
        //     sellAmount: '30',
        //     buyAsset: 'THOR.RUNE',
        //     senderAddress: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
        //     recipientAddress: 'thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx',
        //     slippage: 3
        // }

        let swap = {
            sellAsset: 'THOR.RUNE',
            sellAmount: '9.8265900',
            buyAsset: 'ETH.ETH',
            senderAddress: 'thor1qnxqpu6a6m5wwsh4k2rt74xfunz259caqyqw27',
            recipientAddress: '0x27de622cc44c55b53caF299eCedccdAB29aC98A8',
            slippage: 3
        }

        // let swap = {
        //     sellAsset: 'DOGE.DOGE',
        //     sellAmount: '30',
        //     buyAsset: 'BCH.BCH',
        //     senderAddress: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
        //     recipientAddress: 'qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
        //     slippage: 3,
        // }

        // let swap = {
        //     sellAsset: 'GAIA.ATOM',
        //     sellAmount: '30',
        //     buyAsset: 'BCH.BCH',
        //     senderAddress: 'cosmos1hp7gnr07wprd75f4j4aze9a94aejfcqdsrnape',
        //     recipientAddress: 'qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
        //     slippage: 3,
        // }

        let result = await client.getQuote(swap)
        console.log("result: ",result)
        console.log("result: ",result.txs[0])

    }catch(e){
        console.error(e)
    }
}
run_test()
