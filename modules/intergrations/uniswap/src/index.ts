/*
        Maya Swap Integration 
                - Highlander
 */

const TAG = " | Uniswap | "
import { BaseDecimal } from '@coinmasters/types';
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
const { createMemo, parseMemo } = require('@pioneer-platform/pioneer-coins');
import { ethers } from 'ethers'


let networkSupport = [
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"],
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
        if(!quote.sellAsset) throw new Error("missing sellAsset")
        if(!quote.buyAsset) throw new Error("missing buyAsset")
        if(!quote.sellAmount) throw new Error("missing sellAmount")
        if(!quote.senderAddress) throw new Error("missing senderAddress")
        if(!quote.recipientAddress) throw new Error("missing recipientAddress")
        if(!quote.slippage) throw new Error("missing slippage")

    
        
        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e;
    }
}
