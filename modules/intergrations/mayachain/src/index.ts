/*
        Maya Swap Integration 
                - Highlander
 */

const TAG = " | maya | "

const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
let network = require("@pioneer-platform/maya-network")
const { createMemo, parseMemo } = require('@pioneer-platform/pioneer-coins');

let networkSupport = [
    ChainToNetworkId["BTC"],
    ChainToNetworkId["CACAO"],
    ChainToNetworkId["ETH"],
    ChainToNetworkId["THOR"],
    ChainToNetworkId["DASH"],
]

// Function to make a request to the node
async function nodeRequest(path: any) {
    try {
        const response = await fetch(`https://mayanode.mayachain.info/mayachain${path}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching from node:', error);
        throw error;
    }
}

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

interface QuoteResult {
    amountOutMin: string;
    amountOut: string;
    slippage: string;
}

function quoteFromPool(sellAmount: string, assetPoolAmount: string, runePoolAmount: string, maxSlippage: number): QuoteResult {
    // Convert string inputs to numbers and scale the sell amount
    const swapAmount = parseFloat(sellAmount) * 1e8; // Assuming 1e6 is the scaling factor for Maya
    const assetDepth = parseFloat(assetPoolAmount);
    const runeDepth = parseFloat(runePoolAmount);

    // Calculate the constant product
    const k = assetDepth * runeDepth;

    // New amount of the asset in the pool after the swap
    const newAssetDepth = assetDepth + swapAmount;

    // Calculate the amount of Rune received (or the other asset in the pool)
    const newRuneDepth = k / newAssetDepth;
    const runeReceived = runeDepth - newRuneDepth;

    // Scale back down the amount of Rune received
    const scaledRuneReceived = runeReceived / 1e6; // Adjust as per Rune's scaling factor

    // Calculate the actual rate of the swap
    const actualRate = scaledRuneReceived / (swapAmount / 1e6);

    // Calculate the ideal rate
    const idealRate = runeDepth / assetDepth;

    // Calculate the slippage
    const slippage = ((idealRate - actualRate) / idealRate) * 100;

    // Calculate amountOutMin considering the maximum slippage
    const amountOutMin = scaledRuneReceived * (1 - maxSlippage / 100);

    return {
        amountOutMin: amountOutMin.toFixed(6).toString(),
        amountOut: scaledRuneReceived.toFixed(6),
        slippage: Math.max(slippage, 0).toFixed(6)
    };
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

        // Get pools from network
        let pools = await network.getPools()
        if(!pools) throw Error("Unable to get pools from network!")
        log.info(tag, "pools: ", pools)

        output.meta = {
            quoteMode: "MAYA-OUT"
        }
        output.steps = 1
        output.complete = true
        
        // Find the relevant pool
        // let relevantPool = pools.find((pool: { asset: any; }) => pool.asset === quote.sellAsset);
        // if (!relevantPool) throw new Error("Relevant pool not found");
        //
        // // Calculate quote from the pool
        // let quoteResult = quoteFromPool(
        //     quote.sellAmount,
        //     relevantPool.assetDepth,
        //     relevantPool.runeDepth,
        //     quote.slippage
        // );

        // // Assign results to output
        // output.amountOutMin = quoteResult.amountOutMin;
        // output.amountOut = quoteResult.amountOut;
        // output.slippage = quoteResult.slippage;
        // output.invocationId = uuid();
        // output.meta = { quoteMode: "MAYA-OUT" };
        //
        // // Build memo for transaction (adjust as needed)
        // output.memo = `Swap:${quote.sellAsset}:${quote.buyAsset}:${quoteResult.amountOutMin}:Slippage:${output.slippage}`;

        let memoInput = {
            type: 'SWAP',
            asset: quote.buyAsset,
            destAddr: quote.recipientAddress,
            lim: null,
            interval: null,
            quantity: null,
            affiliate: null,
            fee: null,
            dexAggregatorAddr: null,
            finalAssetAddr: null,
            minAmountOut: null
        }
        const memo = createMemo(memoInput);
        log.info(tag,"memo: ",memo)

        let tx = {
            type: "transfer",
            chain: quote.sellAsset.split(".")[0],
            txParams: {
                senderAddress: quote.senderAddress, 
                recipientAddress: quote.recipientAddress, 
                amount: quote.sellAmount, 
                token: quote.sellAsset.split(".")[1],
                memo
            }
        }
        output.txs = [
            tx
        ]
        
        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e;
    }
}
