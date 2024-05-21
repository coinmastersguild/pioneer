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
        
        //LP create
        let input = {
            fromAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
            chain: 'eip155:8453',
        }
        let result = await client.buildLpTx(input)
        console.log("result: ",result)
        
        //Burn LP and redeem
        

        // let swap = {
        //     sellAsset: 'eip155:8453/slip44:60',
        //     sellAmount: '0.01',
        //     buyAsset: 'eip155:8453/erc20:0XEF743DF8EDA497BCF1977393C401A636518DD630',
        //     senderAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     recipientAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     slippage: 3
        // }

        //Uniswap buy pro working
        //uniswap data
        //0x24856bc30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000020b000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000000000000000000000000000039349e82357b4a66c00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002b4200000000000000000000000000000000000006000bb8ef743df8eda497bcf1977393c401a636518dd630000000000000000000000000000000000000000000
        //https://basescan.org/tx/0x79c99de81abe7bbd718bd7f2690e1f5fcbcfc3e581e6fe93487e27b5a7f33e1e

        //my buy pro that failed
        //https://basescan.org/tx/0x398bddc977527e6dbebc5b172f6f0f2ef1d01c49399261a3171a64cdf8772d2c
        //0x24856bc30000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000100000000000000000000000000141d9959cae3853b035000490c03991eb70fc4ac0000000000000000000000000000000000000000000000008ac7230489e8000000000000000000000000000000000000000000000000000a33c9de05d43ed6ff00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002b4200000000000000000000000000000000000006000bb8ef743df8eda497bcf1977393c401a636518dd630000000000000000000000000000000000000000000

        // let swap = {
        //     buyAsset: 'eip155:8453/slip44:60',
        //     sellAmount: '10',
        //     sellAsset: 'eip155:8453/erc20:0XEF743DF8EDA497BCF1977393C401A636518DD630',
        //     senderAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     recipientAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     slippage: 3
        // }

        // let swap = {
        //     sellAsset: 'eip155:8453/erc20:0xef743df8eda497bcf1977393c401a636518dd630',
        //     sellAmount: '3',
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


        //eth_signTypedData_v4
        // let from = swap.senderAddress
        // let token = '0xEF743df8eDa497bCf1977393c401A636518DD630'
        // let amount = '1461501637330902918203684832716283019655932542975'
        // let router = 'universalRouter'
        // let expiry = '1716521188'
        // let sigDeadline = '1716521188'
        // let chainId = '8453'
        // let nonce = '1'
        // let address = '0x141D9959cAe3853b035000490C03991eB70Fc4aC'
        // //build permit tx
        // let permit = {
        //     from, token, amount, chainId, expiry, sigDeadline, nonce, router
        // }
        // console.log("permit: ",permit)
        // let resultPermit = await client.buildPermitTx(permit)
        // console.log("resultPermit: ",resultPermit)
        
        //sign with kk
        // let input = {
        //     "addressNList":[
        //         2147483692,
        //         2147483708,
        //         2147483648,
        //         0,
        //         0
        //     ],
        //     address,
        //     "typedData":resultPermit
        // }
        // console.log("input: ",input)
        // console.log("input: ",JSON.stringify(input))

        //let responseSign = await sdk.eth.ethSignTypedData(input)
        //console.log("responseSign: ",responseSign)
        //swap.permit2 = responseSign
        //0x7767b83cd7c92630e7a0d8f9dca99cd7d3567c888162f1abdf5e63aa4ab593a601c3fdefe8ef24a78a7f7938fc7ce7b9e6f42246f59550732f0536d8175e6f7a1c

        //swap.permit2 = '0x7767b83cd7c92630e7a0d8f9dca99cd7d3567c888162f1abdf5e63aa4ab593a601c3fdefe8ef24a78a7f7938fc7ce7b9e6f42246f59550732f0536d8175e6f7a1c'
        // console.log("swap: ",swap)
        // let result = await client.getQuote(swap)
        // console.log("result: ",result)
        // console.log("result: ",result.txs[0])
        // console.log("result: ",JSON.stringify(result.txs[0]))
        //

        // let txParams = result.txs[0].txParams
        //
        // console.log("txParams: ",txParams)
        // // //sign
        // let unsignedTx = {
        //     "addressNList": [
        //         2147483692,
        //         2147483708,
        //         2147483648,
        //         0,
        //         0
        //     ],
        //     "from": txParams.from,
        //     "chainId": txParams.chainId,
        //     "nonce": txParams.nonce,
        //     "value": txParams.value || '0x0',
        //     "data": txParams.data,
        //     "gasLimit": txParams.gas,
        //     "gas": txParams.gas,
        //     "to": txParams.to,
        //     "gasPrice": txParams.gasPrice,
        //     // "maxFeePerGas": txParams.maxFeePerGas,
        //     // "maxPriorityFeePerGas": txParams.maxPriorityFeePerGas
        // }
        // //push tx to api
        // console.log("unsignedTx: ",unsignedTx)
        //
        // let responseSignTx = await sdk.eth.ethSignTransaction(unsignedTx)
        // console.log("responseSignTx: ", responseSignTx)

        //broadcast

    }catch(e){
        console.error(e)
    }
}
run_test()
