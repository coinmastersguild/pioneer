/*
    This is a test module for the uniswap integration

 */



require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let client = require("../lib/index")
const { KeepKeySdk } = require("@keepkey/keepkey-sdk")
let spec = 'http://localhost:1646/spec/swagger.json'

// console.log("servers: ",servers)
let run_test = async function(){
    try{
        let config = {
            apiKey: process.env['SERVICE_KEY'] || '1fa0c776-eaa9-499d-a2e5-f76af6073912',
            pairingInfo: {
                name: process.env['SERVICE_NAME'] || 'KeepKey SDK Demo App',
                imageUrl: process.env['SERVICE_IMAGE_URL'] || 'https://github.com/BitHighlander/keepkey-desktop/raw/master/electron/icon.png',
                basePath:spec,
                url:"http://localhost:1646"
            }
        }
        //init
        const sdk = await KeepKeySdk.create(config)
        console.log("newKey: ",config.apiKey)

        //
        await client.init({})


        // let swap = {
        //     sellAsset: 'eip155:8453/slip44:60',
        //     sellAmount: '0.01',
        //     buyAsset: 'eip155:8453/erc20:0XEF743DF8EDA497BCF1977393C401A636518DD630',
        //     senderAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     recipientAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     slippage: 3
        // }

        let swap = {
            buyAsset: 'eip155:8453/slip44:60',
            sellAmount: '10',
            sellAsset: 'eip155:8453/erc20:0XEF743DF8EDA497BCF1977393C401A636518DD630',
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

        //
        // let result = await client.getRateUsd('0xef743df8eda497bcf1977393c401a636518dd630','8453')
        // console.log("result: ",result)



        // let from = swap.senderAddress
        // let token = '0xEF743df8eDa497bCf1977393c401A636518DD630'
        // let amount = '1000000000000000000000000'
        // let chainId = 8453
        // let address = '0x141D9959cAe3853b035000490C03991eB70Fc4aC'
        // //build permit tx
        // let permit = {
        //     from, token, amount, chainId
        // }
        // console.log("permit: ",permit)
        // let resultPermit = await client.buildPermitTx(permit)
        // console.log("resultPermit: ",resultPermit)
        //
        // //sign with kk
        // let input = {
        //     "addressNList":[
        //         2147483692,
        //         2147483708,
        //         2147483648,
        //         0,
        //         0
        //     ],
        //     address,
        //     "typedData":resultPermit.txParams
        // }
        // console.log("input: ",input)
        // console.log("input: ",JSON.stringify(input))
        // let responseSign = await sdk.eth.ethSignTypedData(input)
        // console.log("responseSign: ",responseSign)
        //
        // swap.permit2 = responseSign
        console.log("swap: ",swap)
        let result = await client.getQuote(swap)
        console.log("result: ",result)
        console.log("result: ",result.txs[0])
        console.log("result: ",JSON.stringify(result.txs[0]))

        let txParams = result.txs[0].txParams
        console.log("txParams: ",txParams)
        //sign
        let unsignedTx = {
            "addressNList": [
                2147483692,
                2147483708,
                2147483648,
                0,
                0
            ],
            "from": txParams.from,
            "chainId": txParams.chainId,
            "nonce": txParams.nonce,
            "value": txParams.value || '0x0',
            "data": txParams.data,
            "gasLimit": txParams.gas,
            "gas": txParams.gas,
            "to": txParams.to,
            "gasPrice": txParams.gasPrice,
            // "maxFeePerGas": txParams.maxFeePerGas,
            // "maxPriorityFeePerGas": txParams.maxPriorityFeePerGas
        }
        //push tx to api
        console.log("unsignedTx: ",unsignedTx)

        let responseSignTx = await sdk.eth.ethSignTransaction(unsignedTx)
        console.log("responseSignTx: ", responseSignTx)

        //broadcast

    }catch(e){
        console.error(e)
    }
}
run_test()
