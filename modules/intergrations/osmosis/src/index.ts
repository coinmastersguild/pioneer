/*
    Osmosis Swap Intergration
                -Highlander

 */



const TAG = " | osmosis | "


const log = require('@pioneer-platform/loggerdog')()
let {shortListSymbolToCaip, ChainToNetworkId} = require("@pioneer-platform/pioneer-caip")
let networkOsmo = require("@pioneer-platform/osmosis-network")
let networkAtom = require("@pioneer-platform/cosmos-network")
const { uuid } = require('uuidv4');
let networkSupport = [
    ChainToNetworkId["OSMO"],
    ChainToNetworkId["GAIA"],
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
}


interface QuoteResult {
    amountOut: string;
    slippage: string;
}

function quoteFromPool(amountAtomSwap: string, amountAtomPool: string, amountOsmoPool: string): QuoteResult {
    // Convert string inputs to numbers and scale the swap amount
    const swapAmount = parseFloat(amountAtomSwap) * 1e6;
    const atomPoolAmount = parseFloat(amountAtomPool);
    const osmoPoolAmount = parseFloat(amountOsmoPool);

    // Calculate the constant product
    const k = atomPoolAmount * osmoPoolAmount;

    // New amount of ATOM in the pool after the swap
    const newAtomPoolAmount = atomPoolAmount + swapAmount;

    // Calculate the amount of OSMO received
    const newOsmoPoolAmount = k / newAtomPoolAmount;
    const osmoReceived = osmoPoolAmount - newOsmoPoolAmount;

    // Scale back down the amount of OSMO received
    const scaledOsmoReceived = osmoReceived / 1e6;

    // Calculate the actual rate of the swap
    const actualRate = scaledOsmoReceived / (swapAmount / 1e6);

    // Calculate the ideal rate
    const idealRate = osmoPoolAmount / atomPoolAmount;

    // Calculate the slippage
    const slippage = ((idealRate - actualRate) / idealRate) * 100;

    return {
        amountOut: scaledOsmoReceived.toFixed(6),
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
        
        //get pools
        let pools = await networkOsmo.getPools()
        if(!pools.pools[0]) throw Error("Unable to get pools from network!")
        log.info(tag,"resp: ",pools.pools[0].pool_assets)
        let amountAtom = pools.pools[0].pool_assets[0].token.amount; // ATOM amount
        let amountOsmo = pools.pools[0].pool_assets[1].token.amount; // OSMO amount
        let rate = amountOsmo / amountAtom;
        output.rate = rate
        log.info(tag,"rate: ", rate);
        
        //issue invocationId
        let invocationId = uuid()
        output.invocationId = invocationId
        
        output.meta = {
            quoteMode: "OSMOSIS-IBC"
        }
        
        // get amountOut
        //2 steps
        output.steps = 2
        output.complete = true
        let result;
        if (quote.sellAsset === shortListSymbolToCaip["OSMO"]) {
            result = quoteFromPool(quote.sellAmount, amountAtom, amountOsmo);
            output.result = result
            //build first TX
            //swap osmo for Atom IBC
            let tx1 = {
                type:"sendSwapTx",
                chain:shortListSymbolToCaip["OSMO"],
                txParams: {
                    senderAddress: quote.senderAddress,
                    sellAsset: quote.sellAsset,
                    buyAsset: quote.buyAsset,
                    sellAmount: quote.sellAmount,
                    buyAmountMin: result.amountOut
                }
            };
            log.info(tag,"tx1: ",tx1)
            
            //get balance ibc?
            
            //IBC withdrawal from osmo:atom to atom
            let tx2 = {
                type: "ibcTransfer",
                chain: shortListSymbolToCaip["ATOM"], // Assuming ATOM is the target chain for the IBC withdrawal
                txParams: {
                    senderAddress: quote.senderAddress, // Address initiating the IBC withdrawal
                    recipientAddress: quote.recipientAddress, // Destination address for the ATOM tokens
                    amount: result.amountOut, // Amount of ATOM tokens to withdraw
                    // Other parameters required for the IBC withdrawal can be added here
                }
            };
            log.info(tag, "tx2: ", tx2);

            output.txs = [tx1,tx2]
        } else if (quote.sellAsset === shortListSymbolToCaip["ATOM"]) {
            result = quoteFromPool(quote.sellAmount, amountAtom, amountOsmo);
            output.result = result
            //TODO audit this
            //deposit atom to osmo:atom IBC
            // Deposit ATOM to osmo:atom IBC
            let tx1 = {
                type: "ibcTransfer",
                chain: shortListSymbolToCaip["ATOM"],
                txParams: {
                    senderAddress: quote.senderAddress, // Address initiating the IBC deposit
                    recipientAddress: quote.recipientAddress, // Osmosis address to receive ATOM
                    amount: quote.sellAmount, // Amount of ATOM tokens to deposit
                    // Other parameters for the IBC deposit can be added here
                }
            };
            log.info(tag, "tx1: ", tx1);

            // Swap ATOM for OSMO
            let tx2 = {
                type: "sendSwapTx",
                chain: shortListSymbolToCaip["OSMO"],
                txParams: {
                    senderAddress: quote.senderAddress,
                    sellAsset: shortListSymbolToCaip["ATOM"],
                    buyAsset: quote.buyAsset,
                    sellAmount: result.amountOut, // Amount of ATOM obtained from the IBC deposit
                    buyAmountMin: quote.sellAmount // Minimum amount of OSMO to buy
                }
            };
            log.info(tag, "tx2: ", tx2);

            output.txs = [tx1, tx2];
        } else {
            throw Error("Asset not supported! asset:" + quote.sellAsset);
        }
        
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}
