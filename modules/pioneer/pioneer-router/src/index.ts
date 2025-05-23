/*

    Pioneer API
      A High Availability blockchain api

    Goals:
      v1 compatibility with watchtower with 0 change
      Multi-asset support

    V2 goals:
      Treat Xpubs as passwords
      encrypt long term data storage
      maintain hash table to detect and cache payments



    getTransactions:

    Data: example

    { success: true,
      pagination: { page: 1, total_objects: 88, total_pages: 9 },
      data:
        [ { txid:
          '',
          status: 'confirmed',
          type: 'send',
          amount: -78602,
          date: '2019-05-10T21:01:23Z',
          confirmations: 1055,
          network: 'BTC',
          xpub:
            '' },
         }
       ]
      }
     }

*/

const TAG = " | Pioneer-router | "
const log = require('@pioneer-platform/loggerdog')()
const { redis } = require('@pioneer-platform/default-redis')
let proToken = require("@pioneer-platform/pro-token")


const { caipToRango, caipToNetworkId, caipToThorchain } = require("@pioneer-platform/pioneer-caip");
//rango
let rango = require("@pioneer-platform/rango-client")

//changelly
let changelly = require("@pioneer-platform/changelly-client")

//osmosis
let osmosis = require("@pioneer-platform/osmosis-client")

//
let thorchain = require("@pioneer-platform/thorchain-client")

//osmosis
let mayachain = require("@pioneer-platform/mayachain-client")

//uniswap
let uniswap = require("@pioneer-platform/uniswap-client")

//
let chainflip = require("@pioneer-platform/chainflip-client")

//1inch/0x

// //bridge
// let across = require("@pioneer-platform/across-client")

let MEMOLESS_SUPPORT:any = {
    "changelly": true,
    "chainflip": true,
}

interface Swap {
    memoless?: boolean,
    sellAsset: {
        context: string,
        caip: string,
        identifier: string,
        address: string,
        symbol: string,
        chain: string,
        ticker: string,
        type: string,
        balance: string,
        priceUsd: number,
        rank: number,
        name: string,
        source: string,
        alias: number,
        valueUsd: string
    },
    sellAmount: string,
    buyAsset: {
        context: string,
        caip: string,
        identifier: string,
        address: string,
        symbol: string,
        chain: string,
        ticker: string,
        type: string,
        balance: string,
        priceUsd: number,
        rank: number,
        name: string,
        source: string,
        alias: number,
        valueUsd: string
    },
    senderAddress: string,
    recipientAddress: string,
    slippage: string
}

let NetworksByIntegration:any = {}

let AssetsByIntegration:any = {}

module.exports = {
    init: async function () {
        await rango.init()
        await changelly.init()
        await osmosis.init()
        await mayachain.init()
        await uniswap.init()
        await thorchain.init({})
        NetworksByIntegration['mayachain'] = mayachain.networkSupport()
        NetworksByIntegration['changelly'] = changelly.networkSupport()
        NetworksByIntegration['rango'] = rango.networkSupport()
        NetworksByIntegration['osmosis'] = osmosis.networkSupport()
        NetworksByIntegration['uniswap'] = uniswap.networkSupport()
        // NetworksByIntegration['across'] = across.networkSupport()
        NetworksByIntegration['chainflip'] = chainflip.networkSupport()
        NetworksByIntegration['thorchain'] = thorchain.networkSupport()
        //get assets
        AssetsByIntegration['mayachain'] = mayachain.assetSupport()
        AssetsByIntegration['changelly'] = changelly.assetSupport()
        AssetsByIntegration['rango'] = rango.assetSupport()
        AssetsByIntegration['osmosis'] = osmosis.assetSupport()
        AssetsByIntegration['uniswap'] = uniswap.assetSupport()
        AssetsByIntegration['thorchain'] = thorchain.assetSupport()
        // AssetsByIntegration['across'] = across.assetSupport()
        AssetsByIntegration['chainflip'] = chainflip.assetSupport()
        return true;
    },
    memoless: function(){
        return MEMOLESS_SUPPORT
    },
    assetSupport: function(){
        return AssetsByIntegration
    },
    routes: function(){
        return NetworksByIntegration
    },
    quote: async function (quote: Swap) {
        return get_quote(quote);
    }
}

async function get_quote_from_integration(integration:string, quote: Swap) {
    let tag = TAG + " | get_quote_from_integration | "
    try{
        switch (integration){
            case "thorchain":
                log.info(tag,"thorchain quote: ",quote)
                if(!quote.senderAddress) throw Error('invalid quote! missing senderAddress')
                if(!quote.recipientAddress) throw Error('invalid quote! missing recipientAddress')
                
                let thorchainNameSellAsset = caipToThorchain(quote.sellAsset.caip, quote.sellAsset.ticker || quote.sellAsset.symbol, null)
                let thorchainBuyAsset = caipToThorchain(quote.buyAsset.caip, quote.buyAsset.ticker || quote.buyAsset.symbol, null)
                log.info(tag,"thorchainBuyAsset: ",thorchainBuyAsset)
                log.info(tag,"thorchainNameSellAsset: ",thorchainNameSellAsset)
                if(thorchainBuyAsset === 'THOR.THOR') thorchainBuyAsset = 'THOR.RUNE'
                if(thorchainNameSellAsset === 'THOR.THOR') thorchainNameSellAsset = 'THOR.RUNE'
                if(!thorchainNameSellAsset) throw Error('invalid thorchainNameSellAsset')
                if(!thorchainBuyAsset) throw Error('invalid thorchainBuyAsset')
                let payloadThorchain = {
                    sellAsset: thorchainNameSellAsset,
                    sellAmount: quote.sellAmount,
                    buyAsset: thorchainBuyAsset,
                    senderAddress: quote.senderAddress,
                    recipientAddress: quote.recipientAddress,
                    slippage: 3,
                }
                log.info(tag,"payloadThorchain: ",payloadThorchain)
                let quoteThorchain = await thorchain.getQuote(payloadThorchain)
                return [quoteThorchain]
            break
            case "rango":
                let rangoNameSellAsset = caipToRango(quote.sellAsset.caip, quote.sellAsset.ticker, null)
                let rangoNameBuyAsset = caipToRango(quote.buyAsset.caip, quote.buyAsset.ticker, null)

                let payloadRango = {
                    "from": rangoNameSellAsset,
                    "to": rangoNameBuyAsset,
                    "amount": quote.sellAmount,
                    "connectedWallets": [
                        {
                            "blockchain": rangoNameSellAsset.blockchain,
                            "addresses": [
                                quote.sellAsset.address
                            ]
                        },
                        {
                            "blockchain": rangoNameBuyAsset.blockchain,
                            "addresses": [
                                quote.buyAsset.address
                            ]
                        }
                    ],
                    "selectedWallets": {
                        [rangoNameBuyAsset.blockchain]:quote.buyAsset.address,
                        [rangoNameSellAsset.blockchain]:quote.sellAsset.address,
                    },
                    "checkPrerequisites": false,
                    "affiliateRef": null
                }
                log.info(tag,"payloadRango: ",JSON.stringify(payloadRango))
                let quoteRango = await rango.getQuote(payloadRango)
                return [quoteRango]
            break
            case "osmosis":
                let payloadOsmosis = {
                    sellAsset: quote.sellAsset.caip,
                    buyAsset: quote.buyAsset.caip,
                    sellAmount: quote.sellAmount,
                    senderAddress: quote.senderAddress,
                    recipientAddress: quote.recipientAddress,
                    slippage: quote.slippage
                }
                let quoteOsmosis = await osmosis.getQuote(payloadOsmosis)
                return [quoteOsmosis]
            case "changelly":
                let from = quote.sellAsset.ticker || quote.sellAsset.symbol
                let to = quote.buyAsset.ticker || quote.buyAsset.symbol
                let address = quote.buyAsset.address
                let amount = quote.sellAmount
                log.info({
                    from,
                    to,
                    address,
                    amount
                })
                let quoteChangelly = await changelly.getQuote(from, to, address, amount)
                return [quoteChangelly]
            case "mayachain":
                let payloadMayachain = {
                    sellAsset: quote.sellAsset.identifier,
                    buyAsset: quote.buyAsset.identifier,
                    sellAmount: quote.sellAmount,
                    senderAddress: quote.senderAddress,
                    recipientAddress: quote.recipientAddress,
                    slippage: quote.slippage
                }
                log.info(tag,"payloadMayachain: ",payloadMayachain)
                let quoteMayachain = await mayachain.getQuote(payloadMayachain)
                return [quoteMayachain]
            case "uniswap":
                let payloadUniswap = {
                    sellAsset: quote.sellAsset.caip,
                    buyAsset: quote.buyAsset.caip,
                    sellAmount: quote.sellAmount,
                    senderAddress: quote.senderAddress,
                    recipientAddress: quote.recipientAddress,
                    slippage: quote.slippage
                }
                log.info(tag,"payloadUniswap: ",payloadUniswap)
                let quoteUniswap = await uniswap.getQuote(payloadUniswap)
                log.info(tag,"quoteUniswap: ",quoteUniswap)
                return [quoteUniswap]
            case "chainflip":
                let payloadChainflip = {
                    sellAsset: quote.sellAsset.caip,
                    buyAsset: quote.buyAsset.caip,
                    sellAmount: quote.sellAmount,
                    recipientAddress: quote.recipientAddress,
                    slippage: quote.slippage
                }
                log.info(tag,"payloadChainflip: ",payloadChainflip)
                let quoteChainflip = await chainflip.getQuote(payloadChainflip)
                return [quoteChainflip]
            // case "across":
            //     let payloadAcross = {
            //         sellAsset: quote.sellAsset.caip,
            //         buyAsset: quote.buyAsset.caip,
            //         sellAmount: quote.sellAmount,
            //         senderAddress: quote.senderAddress,
            //         recipientAddress: quote.recipientAddress,
            //         slippage: quote.slippage
            //     }
            //     log.info(tag,"payloadAcross: ",payloadAcross)
            //     let quotedAcross = await accross.getQuote(payloadAcross)
            //     return [quotedAcross]
            default:
                throw new Error("Intergration not found")
        }
    }catch(e){
        log.error(tag,"Error: ",e)
        return null
    }
}

let get_pro_rate_usd = async function(){
    try{
        let cacheValue = await redis.get('proRateUsd')
        if(cacheValue){
            return parseFloat(cacheValue);  // Convert string to float if necessary
        } else {
            let proRateUsd = await proToken.getRateProUsd();
            await redis.setex('proRateUsd', 300, proRateUsd.toString());  // Expiry time in seconds, value as string
            return proRateUsd;
        }
    }catch(e){
        log.error(e)
        return 1
    }
}

async function get_quote(quote: Swap) {
    let tag = " | get_quote | ";
    try {
        let sellChain = caipToNetworkId(quote.sellAsset.caip);
        let buyChain = caipToNetworkId(quote.buyAsset.caip);
        let integrations = Object.keys(NetworksByIntegration);
        let quotes = [];
        log.info("sellChain: ", sellChain);
        log.info("buyChain: ", buyChain);

        // Filter integrations for memoless support if applicable
        if (quote.memoless) {
            integrations = integrations.filter(integration => MEMOLESS_SUPPORT[integration]);
        }

        let supportsInput = [];
        let supportsOutput = [];
        let supportsBoth = [];

        for (let integration of integrations) {
            let supportedAssets = AssetsByIntegration[integration];
            log.info(tag, integration + " supportedAssets: ", supportedAssets);

            let supportsInputOnly = supportedAssets.includes(quote.sellAsset.caip);
            let supportsOutputOnly = !supportedAssets.includes(quote.sellAsset.caip) && supportedAssets.includes(quote.buyAsset.caip);
            let supportsBothAssets = supportedAssets.includes(quote.sellAsset.caip) && supportedAssets.includes(quote.buyAsset.caip);

            if (supportsInputOnly) {
                supportsInput.push(integration);
                log.info(tag, integration + " supports input asset: ", quote.sellAsset.caip);
            }
            if (supportsOutputOnly) {
                supportsOutput.push(integration);
                log.info(tag, integration + " supports output asset: ", quote.buyAsset.caip);
            }
            if (supportsBothAssets) {
                supportsBoth.push(integration);
                log.info(tag, integration + " supports both assets: ", quote.sellAsset.caip, quote.buyAsset.caip);
            }

            if (supportsBothAssets) {
                log.info(tag, "Found supported integration for both assets:", integration);
                let integrationQuotes = await get_quote_from_integration(integration, quote);
                if (integrationQuotes) {
                    for (let i = 0; i < integrationQuotes.length; i++) {
                        let integrationQuote = integrationQuotes[i];
                        integrationQuote.sellAsset = quote.sellAsset.caip;
                        integrationQuote.sellAmount = quote.sellAmount;
                        integrationQuote.buyAsset = quote.buyAsset.caip;
                        integrationQuote.buyAmount = integrationQuote.amountOut;
                        if (integrationQuote.amountOut > 0) {
                            log.info("integrationQuote.amountOut: ", integrationQuote.amountOut);
                            let sellAssetValueUsd = parseFloat(quote.sellAmount) * quote.sellAsset.priceUsd;
                            let buyAssetValueUsd = parseFloat(integrationQuote.amountOut) * quote.buyAsset.priceUsd;
                            //let proTokenEarned = sellAssetValueUsd * 0.1; // For every 1 USD, they earn 0.01 PRO token
                            //integrationQuote.proTokenEarned = proTokenEarned;
                            //integrationQuote.proTokenEarnedUsd = proTokenEarned * await get_pro_rate_usd(); //TODO get dynamic price
                            integrationQuote.sellAssetValueUsd = sellAssetValueUsd;
                            integrationQuote.buyAssetValueUsd = buyAssetValueUsd;
                            quotes.push({ integration, quote: integrationQuote });
                        } else {
                            log.error("Failed to get amountOut from integration: ", integration);
                        }
                    }
                }
            }
        }

        log.info(tag, "Integrations supporting input asset: ", supportsInput);
        log.info(tag, "Integrations supporting output asset: ", supportsOutput);
        log.info(tag, "Integrations supporting both assets: ", supportsBoth);

        //TODO if no quote found for both assets, find a pivot asset
        log.info(tag, "quotes: ", quotes);
        //TODO FUTURE!
        // if (quotes.length === 0) {
        //     log.info(tag, "No direct quotes found. Searching for pivot trades...");
        //
        //     const PIVOT_ASSETS:any = [
        //         { caip: 'eip155:1/slip44:60', name: 'ETH' },
        //         { caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0', name: 'BTC' }
        //     ];
        //    
        //     // Find pivot trades
        //     for (let integration of supportsInput) {
        //         for (let pivotAsset of PIVOT_ASSETS) {
        //             // @ts-ignore
        //             let pivotQuote = await get_quote_from_integration(integration, { ...quote, buyAsset: { caip: pivotAsset } });
        //             if (pivotQuote && pivotQuote.length > 0) {
        //                 let pivotAmount = pivotQuote[0].amountOut;
        //                 log.info(tag, "Pivot trade found: ", pivotAmount, " of ", pivotAsset);
        //
        //                 for (let outputIntegration of supportsOutput) {
        //                     // @ts-ignore
        //                     let finalQuote = await get_quote_from_integration(outputIntegration, { sellAsset: { caip: pivotAsset }, sellAmount: pivotAmount, buyAsset: quote.buyAsset });
        //                     if (finalQuote && finalQuote.length > 0 && finalQuote[0].amountOut > 0) {
        //                         let finalAmount = finalQuote[0].amountOut;
        //                         quotes.push({
        //                             integration: integration + " -> " + outputIntegration,
        //                             quote: {
        //                                 sellAsset: quote.sellAsset.caip,
        //                                 sellAmount: quote.sellAmount,
        //                                 buyAsset: quote.buyAsset.caip,
        //                                 buyAmount: finalAmount,
        //                                 pivotAsset: pivotAsset,
        //                                 pivotAmount: pivotAmount
        //                             }
        //                         });
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        return quotes;
    } catch (err) {
        throw err;
    }
}


// async function get_quote(quote:Swap) {
//     let tag = " | get_quote | "
//     try {
//
//         let sellChain = caipToNetworkId(quote.sellAsset.caip);
//         let buyChain = caipToNetworkId(quote.buyAsset.caip);
//         let integrations = Object.keys(NetworksByIntegration);
//         let quotes = [];
//         log.info("sellChain: ",sellChain)
//         log.info("buyChain: ",buyChain)
//
//         //if memoless filter
//         if (quote.memoless) {
//             integrations = integrations.filter(integration => MEMOLESS_SUPPORT[integration]);
//         }
//
//         for (let integration of integrations) {
//             let supportedAssets = AssetsByIntegration[integration];
//             log.info(tag,integration+" supportedAssets: ",supportedAssets)
//             if (supportedAssets.includes(quote.sellAsset.caip) && supportedAssets.includes(quote.buyAsset.caip)) {
//                 console.log(TAG, "Found supported integration for both assets:", integration);
//                 let integrationQuotes = await get_quote_from_integration(integration, quote);
//                 if(integrationQuotes) {
//                     for(let i = 0; i < integrationQuotes.length; i++){
//                         let integrationQuote = integrationQuotes[i]
//                         integrationQuote.sellAsset = quote.sellAsset.caip
//                         integrationQuote.sellAmount = quote.sellAmount
//                         integrationQuote.buyAsset = quote.buyAsset.caip
//                         integrationQuote.buyAmount = integrationQuote.amountOut
//                         if(integrationQuote.amountOut > 0){
//                             log.info("integrationQuote.amountOut: ",integrationQuote.amountOut)
//                             let sellAssetValueUsd = parseFloat(quote.sellAmount) * quote.sellAsset.priceUsd;
//                             let buyAssetValueUsd = parseFloat(integrationQuote.amountOut) * quote.buyAsset.priceUsd;
//                             let proTokenEarned = sellAssetValueUsd * 0.1; // For every 1 USD, they earn 0.01 PRO token
//                             integrationQuote.proTokenEarned = proTokenEarned;
//                             integrationQuote.proTokenEarnedUsd = proTokenEarned * await get_pro_rate_usd() //TODO get dynamic price
//                             integrationQuote.sellAssetValueUsd = sellAssetValueUsd;
//                             integrationQuote.buyAssetValueUsd = buyAssetValueUsd;
//                             quotes.push({ integration, quote: integrationQuote });    
//                         } else {
//                             log.error("Failed to get amountOut from integration: ",integration)
//                         }
//                     }
//                 }
//             }
//         }
//        
//
//         //return applicable intergrations
//
//         //for each intergration get quote
//
//         //set best quote
//
//         //return quotes
//         return quotes;
//     } catch (err) {
//         throw err;
//     }
// }
//
