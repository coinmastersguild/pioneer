/*
       chainflip Integration 
                - Highlander
                
      Notes:
      lol polkadot cant ts bro, https://substrate.stackexchange.com/questions/4542/typescript-errors-when-using-polkadot-api          
                
 */

const TAG = " | chainflip | "
import { BaseDecimal } from '@coinmasters/types';
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
let { Chain, caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId, NetworkIdToChain, getChainEnumValue } = require("@pioneer-platform/pioneer-caip")
const { createMemo, parseMemo } = require('@pioneer-platform/pioneer-coins');
import { ApiPromise, WsProvider } from "@polkadot/api";
const axios = require('axios');

let networkSupport = [
    ChainToNetworkId["BTC"],
    ChainToNetworkId["ETH"],
]

let assetSupport = [
    shortListSymbolToCaip["BTC"],
    shortListSymbolToCaip["ETH"],
]

module.exports = {
    init:function(settings:any){
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    assetSupport: function () {
        return assetSupport;
    },
    getQuote: function (quote:any) {
        return get_quote(quote);
    },
    lookupTx: function (quoteId:string) {
        return get_quote_info(quoteId);
    },
}

const get_quote_info = async function (quoteId:string) {
    let tag = TAG + " | get_quote_info | "
    try {
        let output:any = {}
        // Make a GET request using Axios
        const response = await axios.get(`https://chainflip-swap.chainflip.io/swaps/${quoteId}`);

        // Assuming the response data is what you want to use
        output.data = response.data;

        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e;
    }
}

const get_quote = async function (quote:any) {
    let tag = TAG + " | get_quote | "
    try {
        let output:any = {}
        output.steps = 1
        output.memoless = true
        output.complete = true
        output.meta = {
            quoteMode: "CHANGELLY"
        }
        output.complete = true
        if(!quote.sellAsset) throw new Error("missing sellAsset")
        if(!quote.buyAsset) throw new Error("missing buyAsset")
        if(!quote.sellAmount) throw new Error("missing sellAmount")
        if(!quote.recipientAddress) throw new Error("missing recipientAddress")
        if(!quote.slippage) throw new Error("missing slippage")
        if (!networkSupport.includes(caipToNetworkId(quote.buyAsset))) {
            throw new Error("unsupported buyAsset");
        }
        if (!networkSupport.includes(caipToNetworkId(quote.sellAsset))) {
            throw new Error("unsupported sellAsset");
        }
        output.sellAsset = {}
        output.sellAsset.caip = quote.sellAsset
        output.sellAmount = quote.sellAmount
        output.buyAsset = {}
        output.buyAsset.caip = quote.buyAsset
        
        let chainSell = NetworkIdToChain[caipToNetworkId(quote.sellAsset)]
        let chainBuy = NetworkIdToChain[caipToNetworkId(quote.buyAsset)]
        log.info(tag,"chainSell: ",chainSell)
        log.info(tag,"chainBuy: ",chainBuy)
        let longNameSell = Object.keys(Chain).find(key => Chain[key] === chainSell)
        let longNameBuy = Object.keys(Chain).find(key => Chain[key] === chainBuy)
        log.info(tag,"chainSell: ",longNameSell)
        log.info(tag,"chainBuy: ",longNameBuy)
        const decimals:any = {
            'BTC': 8,   // Bitcoin uses 8 decimal places
            'ETH': 18,  // Ethereum uses 18 decimal places
        };

        // Helper function to scale the amount by the number of decimals
        function scaleAmount(amount:any, decimals:any) {
            return amount * Math.pow(10, decimals);
        }

        // Adjusting the amount according to the asset's decimals
        const amountToQuote = scaleAmount(quote.sellAmount, decimals[chainSell]);  // Assumes 1 unit of the selling asset
        log.info(tag,"amountToQuote: ",amountToQuote)

        //get quote
        let params = {
            amount: amountToQuote,
            srcChain: longNameSell,
            srcAsset: chainSell,
            destChain: longNameBuy,
            destAsset: chainBuy
        }
        log.info(tag,"params: ",params)
        const responseQuote = await axios.get('https://chainflip-swap.chainflip.io/quote', {
            params
        });

        function convertToReadableAmount(amount:any, decimals:any) {
            return amount / Math.pow(10, decimals);
        }
        console.log("responseQuote: ",responseQuote.data); // Handle the response data as needed
        const egressAmountReadable = convertToReadableAmount(responseQuote.data.egressAmount, decimals[chainBuy]);
        log.info(tag,"egressAmountReadable: ",egressAmountReadable)
        output.amountOut = egressAmountReadable



        // //https://chainflip-swap.chainflip.io/trpc/openSwapDepositChannel?batch=1
        const url = 'https://chainflip-swap.chainflip.io/trpc/openSwapDepositChannel?batch=1';
        const data = {
            "0": {
                "json": {
                    "srcChain": longNameSell,
                    "destChain": longNameBuy,
                    "srcAsset": chainSell,
                    "destAsset": chainBuy,
                    "amount": amountToQuote.toString(),
                    "quote": responseQuote.data,
                    "destAddress": quote.recipientAddress,
                }
            }
        };
        log.info("data good: ",data)    
        const headers = {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9',
            'Content-Type': 'application/json',
            'Origin': 'https://swap.chainflip.io',
            'Referer': 'https://swap.chainflip.io/',
            'Sec-Ch-Ua': '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"macOS"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-site',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
        };

        const response = await axios.post(url, data, { headers });
        // console.log(response); // Log the response data
        // console.log(response.data); // Log the response data
        // console.log(JSON.stringify(response.data)); // Log the response data

        let result = response.data[0].result.data.json;
        log.info(tag,"result: ",result)

        output.id = result.id
        output.source = 'chainflip'
        output.inboundAddress = result.depositAddress
        output.estimatedExpiryTime = result.estimatedExpiryTime
        let tx = {
            type:"transfer",
            chain:caipToNetworkId(quote.sellAsset),
            txParams: {
                address: result.depositAddress,
                amount: quote.sellAmount
            }
        }
        output.txs = [tx]
        output.raw = data

        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        console.error(tag, "e: ", JSON.stringify(e))
        throw e;
    }
}
