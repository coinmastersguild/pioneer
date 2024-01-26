/*
    https://docs.blocknative.com/webhook-api

 */



const TAG = " | thorswap | "
import { SwapKitApi } from '@coinmasters/api';
const log = require('@pioneer-platform/loggerdog')()
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        referer: 'https://sk.thorswap.net', // Correct header key is 'referer'
    }
});
let {ChainToNetworkId} = require("@pioneer-platform/pioneer-caip")

let networkSupport = [
    ChainToNetworkId["GAIA"],
    ChainToNetworkId["BNB"],
    ChainToNetworkId["DOGE"],
    ChainToNetworkId["BTC"],
    ChainToNetworkId["ETH"],
    ChainToNetworkId["LTC"],
    ChainToNetworkId["THOR"],
    ChainToNetworkId["BCH"],
    ChainToNetworkId["GNO"],
    ChainToNetworkId["MATIC"],
    ChainToNetworkId["AVAX"],
]

module.exports = {
    init:function(settings:any){
        return true
    },
    networkSupport: function () {
      return networkSupport
    },
    getQuote: function (quote:any) {
        return get_quote(quote);
    },
    trackSwap: function (hash:string,quoteId:string,route:any, sellAmount:string) {
        return track_swap(hash,quoteId,route,sellAmount);
    },
    getInfo: function (hash:string) {
        return get_info(hash);
    }
}

const track_swap = async function (hash:string,quoteId:string,route:any, sellAmount:string) {
    let tag = TAG + " | track_swap | "
    try {

        const thorswapParams = {
            hash,
            quoteId: quoteId,
            sellAmount: route.sellAmount,
            route: route,
        };
        const thorswapResponse = await axios.post('https://api.thorswap.net/tracker/v2/txn', {
            params: thorswapParams,
        });


        return thorswapResponse.data
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}

const get_info = async function (hash:string) {
    let tag = TAG + " | get_info | "
    try {

        const thorswapParams = {
            hash,
        };
        const thorswapResponse = await axios.get('https://api.thorswap.net/tracker/v2/txn', {
            params: thorswapParams,
        });


        return thorswapResponse.data
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}

/**
 * Logs detailed information about the error and provides a summary of the issues.
 * @param {Error} error The error object caught in the catch block.
 * @param {string} tag The context tag for the log.
 */
const logErrorDetails = (error:any, tag:any) => {
    // Basic error logging
    console.error(tag, "Error caught: ", error.message);

    // Check if the error has a response property
    if (error.response) {
        // Log details from the response
        console.error(tag, "Response Status:", error.response.status);
        console.error(tag, "Response Status Text:", error.response.statusText);

        // Additional details if available
        if (error.response.headers) {
            console.error(tag, "Response Headers:", error.response.headers);
        }
        if (error.response.data) {
            console.error(tag, "Response Data:", error.response.data);
        }
    } else {
        // Log that no response was received
        console.error(tag, "No response was received");
    }

    // Log request details if available
    if (error.request) {
        console.error(tag, "Request Details:", error.request);
    }

    // Summary of the issue
    const summary = error.response ? `An HTTP error occurred: ${error.response.statusText}` : 'An error occurred without a response from the server';
    console.error(tag, "Summary of the issue:", summary);
}

const get_quote = async function (quote:any) {
    let tag = TAG + " | submit_address | "
    try {
        log.info(tag,"quote: ",quote)
        let output:any = []
        //caip to thorchain identifier
        const entry:any = {
            sellAsset: quote.sellAsset,
            sellAmount: quote.sellAmount,
            buyAsset: quote.buyAsset,
            senderAddress: quote.senderAddress,
            recipientAddress: quote.recipientAddress,
            slippage: parseInt(quote.slippage),
        };

        // @ts-ignore
        const result = await SwapKitApi.getQuote(entry);
        // output.result = result;
        
        console.log('result: ', result);
        for(let i = 0; i < result.routes.length; i++){
            let route = result.routes[i]
            
            let quote:any = {}
            //amountOut
            quote.id = result.quoteId
            // @ts-ignore
            quote.meta = route.meta
            quote.amountOut = route.expectedOutput
            quote.txs = route.transaction
            quote.complete = true
            quote.inboundAddress = route.inboundAddress
            // @ts-ignore
            quote.timeEstimates = route.timeEstimates
            quote.route = route
            output.push(quote)
        }

        //txs
        
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        console.error(tag, "e: ", JSON.stringify(e))
        logErrorDetails(e, tag);
    }
}
