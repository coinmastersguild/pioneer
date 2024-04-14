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
//thorswap
let thorswap = require("@pioneer-platform/thorswap-client")
const { caipToRango, caipToNetworkId } = require("@pioneer-platform/pioneer-caip");
//rango
let rango = require("@pioneer-platform/rango-client")

//changelly
let changelly = require("@pioneer-platform/changelly-client")

//osmosis
let osmosis = require("@pioneer-platform/osmosis-client")

//osmosis
let mayachain = require("@pioneer-platform/mayachain-client")

//uniswap
let uniswap = require("@pioneer-platform/uniswap-client")

//1inch/0x

//bridge
let across = require("@pioneer-platform/across-client")


interface Swap {
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

module.exports = {
    init: async function () {
        await thorswap.init()
        await rango.init()
        await changelly.init()
        await osmosis.init()
        await mayachain.init()
        await uniswap.init()
        NetworksByIntegration['mayachain'] = mayachain.networkSupport()
        NetworksByIntegration['changelly'] = changelly.networkSupport()
        NetworksByIntegration['thorswap'] = thorswap.networkSupport()
        NetworksByIntegration['rango'] = rango.networkSupport()
        NetworksByIntegration['osmosis'] = osmosis.networkSupport()
        NetworksByIntegration['uniswap'] = uniswap.networkSupport()
        NetworksByIntegration['across'] = across.networkSupport()
        return true;
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
            case "thorswap":
                let payloadThorswap = {
                    sellAsset: quote.sellAsset.identifier,
                    buyAsset: quote.buyAsset.identifier,
                    sellAmount: quote.sellAmount,
                    senderAddress: quote.senderAddress,
                    recipientAddress: quote.recipientAddress,
                    slippage: quote.slippage
                }
                log.info(tag,"payloadThorswap: ",payloadThorswap)
                let quoteThorswap = await thorswap.getQuote(payloadThorswap)
                return quoteThorswap
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
                let from = quote.sellAsset.ticker
                let to = quote.buyAsset.ticker
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
                return [quoteUniswap]
            case "across":
                let payloadAcross = {
                    sellAsset: quote.sellAsset.caip,
                    buyAsset: quote.buyAsset.caip,
                    sellAmount: quote.sellAmount,
                    senderAddress: quote.senderAddress,
                    recipientAddress: quote.recipientAddress,
                    slippage: quote.slippage
                }
                log.info(tag,"payloadAcross: ",payloadAcross)
                let quotedAcross = await uniswap.getQuote(payloadAcross)
                return [quotedAcross]
            default:
                throw new Error("Intergration not found")
        }
    }catch(e){
        log.error(tag,"Error: ",e)
        return null
    }
}

async function get_quote(quote:Swap) {
    let tag = " | get_quote | "
    try {

        let sellChain = caipToNetworkId(quote.sellAsset.caip);
        let buyChain = caipToNetworkId(quote.buyAsset.caip);
        let integrations = Object.keys(NetworksByIntegration);
        let quotes = [];
        log.info("sellChain: ",sellChain)
        log.info("buyChain: ",buyChain)
        
        for (let integration of integrations) {
            let supportedNetworks = NetworksByIntegration[integration];
            log.info(tag,integration+" supportedNetworks: ",supportedNetworks)
            if (supportedNetworks.includes(sellChain) && supportedNetworks.includes(buyChain)) {
                console.log(TAG, "Found supported integration for both networks:", integration);
                let integrationQuotes = await get_quote_from_integration(integration, quote);
                if(integrationQuotes) {
                    for(let i = 0; i < integrationQuotes.length; i++){
                        let integrationQuote = integrationQuotes[i]
                        integrationQuote.sellAsset = quote.sellAsset.caip
                        integrationQuote.sellAmount = quote.sellAmount
                        integrationQuote.buyAsset = quote.buyAsset.caip
                        integrationQuote.buyAmount = integrationQuote.amountOut
                        if(integrationQuote.amountOut > 0){
                            log.info("integrationQuote.amountOut: ",integrationQuote.amountOut)
                            let sellAssetValueUsd = parseFloat(quote.sellAmount) * quote.sellAsset.priceUsd;
                            let buyAssetValueUsd = parseFloat(integrationQuote.amountOut) * quote.buyAsset.priceUsd;
                            let proTokenEarned = sellAssetValueUsd * 0.1; // For every 1 USD, they earn 0.01 PRO token
                            integrationQuote.proTokenEarned = proTokenEarned;
                            integrationQuote.proTokenEarnedUsd = proTokenEarned * 1 //TODO get dynamic price
                            integrationQuote.sellAssetValueUsd = sellAssetValueUsd;
                            integrationQuote.buyAssetValueUsd = buyAssetValueUsd;
                            quotes.push({ integration, quote: integrationQuote });    
                        }
                    }
                }
            }
        }
        

        //return applicable intergrations

        //for each intergration get quote

        //set best quote

        //return quotes
        return quotes;
    } catch (err) {
        throw err;
    }
}

