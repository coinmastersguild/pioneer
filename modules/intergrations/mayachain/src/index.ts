/*
        Maya Swap Integration 
                - Highlander
 */

const TAG = " | maya | "
import { BaseDecimal } from '@coinmasters/types';
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
let network = require("@pioneer-platform/maya-network")
const { createMemo, parseMemo } = require('@pioneer-platform/pioneer-coins');

let networkSupport = [
    ChainToNetworkId["BTC"],
    ChainToNetworkId["MAYA"],
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

        //Get pools from network
        let pools = await network.getPools()
        if(!pools) throw Error("Unable to get pools from network!")
        // log.info(tag, "pools: ", pools)

        //get poolIn
        let poolIn = pools.find((p:any)=>p.asset == quote.sellAsset)
        // log.info(tag,"poolIn: ",poolIn)

        //get poolOut
        let poolOut = pools.find((p:any)=>p.asset == quote.buyAsset)

        output.meta = {
            quoteMode: "MAYA_SUPPORTED_TO_MAYA_SUPPORTED"
        }
        output.steps = 1
        output.complete = true
        output.id = uuid()

        let BaseDecimal = {
            ARB:18,
            AVAX:18,
            BCH:8,
            BNB:8,
            BSC:18,
            BTC:8,
            DASH:8,
            DGB:8,
            DOGE:8,
            ETH:18,
            BASE:18,
            EOS:6,
            GAIA:6,
            KUJI:6,
            LTC:8,
            MATIC:18,
            MAYA:10,
            OP:18,
            OSMO:6,
            XRP:6,
            THOR:8,
            ZEC:8
        }

        let asset = quote.sellAsset.split(".")[0]
        if(!asset) throw Error("unable to pasre asset from quote.sellAsset")
        // @ts-ignore
        const DECIMALS = BaseDecimal[asset];
        if(!DECIMALS) throw Error("unable to get DECIMALS for asset: "+asset)
        let BASE_UNIT = Math.pow(10, DECIMALS); // Dynamically set BASE_UNIT based on asset

        //TODO dynamic by asset?

        const sellAmountInBaseUnits = parseFloat(quote.sellAmount) * BASE_UNIT;

        //get quote
        let quoteFromNode:any
        let URL = `/quote/swap?from_asset=${quote.sellAsset}&to_asset=${quote.buyAsset}&amount=${sellAmountInBaseUnits}&destination=${quote.recipientAddress}`
        log.info("URL: ",URL)
        quoteFromNode = await nodeRequest(
            URL,
        )
        log.info("quoteFromNode: ",quoteFromNode)
        if(quoteFromNode.error) throw Error(quoteFromNode.error)
        // let amountOutEstimated = quoteFromNode.expected_amount_out
        let amountOutMin = quoteFromNode.amount_out_min
        let inboundAddress = quoteFromNode.inbound_address
        let amountOutEstimated = (parseInt(quoteFromNode.expected_amount_out) / BASE_UNIT).toFixed(DECIMALS);
        output.amountOut = amountOutEstimated
        
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

        let type:string

        //if input is thor or maya
        let chain = quote.sellAsset.split(".")[0]
        if(chain == "MAYA"){
            type = 'deposit'
        } else {
            type = 'transfer'
        }

        let tx = {
            type,
            chain: ChainToNetworkId[quote.sellAsset.split(".")[0]],
            txParams: {
                senderAddress: quote.senderAddress, 
                recipientAddress: quoteFromNode.inbound_address,
                amount: quote.sellAmount, 
                token: quote.sellAsset.split(".")[1],
                memo:quoteFromNode.memo || memo
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
