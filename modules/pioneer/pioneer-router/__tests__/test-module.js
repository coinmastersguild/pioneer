require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let client = require("../lib/index")

let run_test = async function(){
    try {
        await client.init()
        
        // let swap = {
        //     sellAsset: {
        //         context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
        //         caip: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
        //         identifier: 'BCH.BCH',
        //         address: 'bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
        //         symbol: 'BCH',
        //         chain: 'BCH',
        //         ticker: 'BCH',
        //         type: 'Native',
        //         balance: '0.09640062',
        //         priceUsd: 233.01,
        //         rank: 23,
        //         name: 'bitcoin-cash',
        //         source: 'coingecko',
        //         alias: 2,
        //         valueUsd: '22.4623084662'
        //     },
        //     sellAmount: '0.09',
        //     buyAsset: {
        //         context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
        //         caip: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
        //         identifier: 'DOGE.DOGE',
        //         address: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
        //         symbol: 'DOGE',
        //         chain: 'DOGE',
        //         ticker: 'DOGE',
        //         type: 'Native',
        //         balance: '292.3294878',
        //         priceUsd: 0.076766,
        //         rank: 11,
        //         name: 'dogecoin',
        //         source: 'coingecko',
        //         alias: 2,
        //         valueUsd: '22.440965460454798'
        //     },
        //     senderAddress: 'bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
        //     recipientAddress: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
        //     slippage: '3'
        // }
        
        // let swap = {
        //     sellAsset: {
        //         context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
        //         caip: 'cosmos:osmosis-1/slip44:118',
        //         identifier: 'OSMO.OSMO',
        //         address: 'osmo1rs7fckgznkaxs4sq02pexwjgar43p5wnkx9s92',
        //         symbol: 'OSMO',
        //         chain: 'OSMO',
        //         ticker: 'OSMO',
        //         type: 'Native',
        //         balance: '20.797169',
        //         priceUsd: 1.61,
        //         rank: 70,
        //         name: 'osmosis',
        //         source: 'coingecko',
        //         alias: 2,
        //         valueUsd: '33.483442090000004'
        //     },
        //     sellAmount: '0.0100',
        //     buyAsset: {
        //         context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
        //         caip: 'cosmos:cosmoshub-4/slip44:118',
        //         identifier: 'GAIA.GAIA',
        //         address: 'cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc',
        //         symbol: 'ATOM',
        //         chain: 'GAIA',
        //         ticker: 'ATOM',
        //         type: 'Native',
        //         balance: '0.186822',
        //         priceUsd: 9.79,
        //         rank: 24,
        //         name: 'cosmos',
        //         source: 'coingecko',
        //         alias: 2,
        //         valueUsd: '1.8289873799999998'
        //     },
        //     senderAddress: 'osmo1rs7fckgznkaxs4sq02pexwjgar43p5wnkx9s92',
        //     recipientAddress: 'cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc',
        //     slippage: 3
        // }

        
        // let swap = {
        //     sellAsset: {
        //         context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
        //         caip: 'eip155:1/slip44:60',
        //         identifier: 'ETH.ETH',
        //         address: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //         symbol: 'ETH',
        //         chain: 'ETH',
        //         ticker: 'ETH',
        //         type: 'Native',
        //         balance: '0.02000275',
        //         priceUsd: 2310.31,
        //         rank: 2,
        //         name: 'ethereum',
        //         source: 'coingecko',
        //         alias: 2,
        //         valueUsd: '46.212553352499995'
        //     },
        //     sellAmount: '0.0200',
        //     buyAsset: {
        //         context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
        //         caip: 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2/slip44:144',
        //         identifier: 'XRP.XRP',
        //         address: 'rLRYvj3RXU16THYgwhWR3ZN639XAE68RLB',
        //         symbol: 'XRP',
        //         chain: 'XRP',
        //         ticker: 'XRP',
        //         type: 'Native',
        //         balance: '10.796',
        //         priceUsd: 0.52817,
        //         rank: 6,
        //         name: 'ripple',
        //         source: 'coingecko',
        //         alias: 2,
        //         valueUsd: '5.70212332'
        //     },
        //     senderAddress: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     recipientAddress: 'rLRYvj3RXU16THYgwhWR3ZN639XAE68RLB',
        //     slippage: 3
        // }
        
        let swap = {
            sellAsset: {
                context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
                caip: 'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
                identifier: 'DASH.DASH',
                address: 'Xursn5XQzLEa2J91uEWeAVsKpLsBTf393x',
                symbol: 'DASH',
                chain: 'DASH',
                ticker: 'DASH',
                type: 'Native',
                balance: '0.19009623',
                priceUsd: 27.08,
                rank: 170,
                name: 'dash',
                source: 'coingecko',
                alias: 2,
                valueUsd: '5.1478059084'
            },
            sellAmount: '0.0100',
            buyAsset: {
                context: 'keepkey:0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet',
                caip: 'cosmos:thorchain-mainnet-v1/slip44:931',
                identifier: 'THOR.THOR',
                address: 'thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx',
                symbol: 'RUNE',
                chain: 'THOR',
                ticker: 'RUNE',
                type: 'Native',
                balance: '3.05832433',
                priceUsd: 4.08,
                rank: 59,
                name: 'thorchain',
                source: 'coingecko',
                alias: 2,
                valueUsd: '12.4779632664'
            },
            senderAddress: 'Xursn5XQzLEa2J91uEWeAVsKpLsBTf393x',
            recipientAddress: 'thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx',
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
