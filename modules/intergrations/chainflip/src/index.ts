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
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
const { createMemo, parseMemo } = require('@pioneer-platform/pioneer-coins');
import { ApiPromise, WsProvider } from "@polkadot/api";
const axios = require('axios');

let networkSupport = [
    ChainToNetworkId["BTC"],
    ChainToNetworkId["ETH"],
]


module.exports = {
    init:function(settings:any){
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    getQuote: function (quote:any) {
        return get_quote(quote);
    },
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
        // let providerUrl = "wss://rpc.polkadot.io"
        // const provider = new WsProvider(providerUrl);
        // const api = await ApiPromise.create({ provider });

        //https://chainflip-swap.chainflip.io/quote?amount=100000000&srcChain=Bitcoin&srcAsset=BTC&destChain=Ethereum&destAsset=ETH
        //get quote
        const responseQuote = await axios.get('https://chainflip-swap.chainflip.io/quote', {
            params: {
                amount: 100000000,
                srcChain: 'Bitcoin',
                srcAsset: 'BTC',
                destChain: 'Ethereum',
                destAsset: 'ETH'
            }
        });
        // console.log(responseQuote.data); // Handle the response data as needed
        


        //https://chainflip-swap.chainflip.io/trpc/openSwapDepositChannel?batch=1
        const url = 'https://chainflip-swap.chainflip.io/trpc/openSwapDepositChannel?batch=1';
        const data = {
            "0": {
                "json": {
                    "srcChain": "Ethereum",
                    "destChain": "Bitcoin",
                    "srcAsset": "ETH",
                    "destAsset": "BTC",
                    "amount": "20427368230548824399",
                    "quote": responseQuote.data,
                    "destAddress": "bc1qu3ghkz8788ysk7gqcvke5l0mr7skhgvpuk6dk4"
                }
            }
        };
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
        output.estimatedExpiryTime = result.estimatedExpiryTime
        output.amountOut = responseQuote.data.egressAmount;
        console.log("caipToNetworkId(ChainToNetworkId[\"BTC\"]): ",caipToNetworkId(ChainToNetworkId["BTC"]))
        console.log("caipToNetworkId(quote.sellAsset): ",caipToNetworkId(quote.sellAsset))
        if (caipToNetworkId(quote.sellAsset) == caipToNetworkId(ChainToNetworkId["BTC"])) {
            // Convert from satoshis to BTC
            output.amountOut /= 1e8;
        } else if (caipToNetworkId(quote.sellAsset) == caipToNetworkId(ChainToNetworkId["ETH"])) {
            // Convert from wei to ETH
            output.amountOut /= 1e18;
        } else {
            throw Error("Chain not supported!")
        }
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
        throw e;
    }
}
