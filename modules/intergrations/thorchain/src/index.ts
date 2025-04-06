/*
        Maya Swap Integration 
                - Highlander
 */

const TAG = " | maya | ";
// Replace BaseDecimal import with local definition
// Define BaseDecimal as a simple record of string chains to number values
const BaseDecimal: Record<string, number> = {
    "BTC": 8,
    "ETH": 18,
    "DOGE": 8,
    "BCH": 8,
    "LTC": 8,
    "THOR": 8
};
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')();
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip");
const { createMemo, parseMemo } = require('@pioneer-platform/pioneer-coins');

let networkSupport = [
    ChainToNetworkId["BTC"],
    ChainToNetworkId["ETH"],
    ChainToNetworkId["DOGE"],
    ChainToNetworkId["BCH"],
    ChainToNetworkId["LTC"],
    ChainToNetworkId["THOR"],
];

// Function to make a request to the node
async function nodeRequest(path: string) {
    try {
        const response = await fetch(`https://thornode.ninerealms.com${path}`);
        if (!response.ok) {
            throw new Error(`Node request failed with status: ${response.status}, message: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        log.error(`${TAG} Error fetching from node:`, error);
        throw error;
    }
}

let assets = [
    'bip122:000000000019d6689c085ae165831e93/slip44:0', // BTC
    'eip155:1/slip44:60', // ETH
    'cosmos:thorchain-mainnet-v1/slip44:931', // RUNE
    'bip122:00000000001a91e3dace36e2be3bf030/slip44:3', // Doge
    'bip122:000000000000000000651ef99cb9fcbe/slip44:145', // BCH
];

module.exports = {
    init: function (settings: any) {
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    assetSupport: function () {
        return assets;
    },
    getQuote: async function (quote: any) {
        return await get_quote(quote);
    },
};

async function getPools() {
    const tag = TAG + " | getPools | ";
    try {
        const pools = await nodeRequest('/thorchain/pools');
        if (!pools || pools.length === 0) {
            throw new Error("No pools fetched from network!");
        }
        log.info(tag, "Pools fetched: ", pools.map((p: any) => p.asset));
        return pools;
    } catch (e) {
        log.error(tag, "Error fetching pools: ", e);
        throw new Error("Unable to fetch pools");
    }
}

const get_quote = async function (quote: any) {
    const tag = TAG + " | get_quote | ";
    try {
        let output: any = {};
        if (!quote.sellAsset) throw new Error("missing sellAsset");
        if (!quote.buyAsset) throw new Error("missing buyAsset");
        if (!quote.sellAmount) throw new Error("missing sellAmount");
        if (!quote.senderAddress) throw new Error("missing senderAddress");
        if (!quote.recipientAddress) throw new Error("missing recipientAddress");
        if (!quote.slippage) throw new Error("missing slippage");

        // Fetch pools
        const pools = await getPools();

        // Determine poolIn and poolOut
        let poolIn = pools.find((p: any) => p.asset === quote.sellAsset);
        let poolOut = pools.find((p: any) => p.asset === quote.buyAsset);

        // If the sellAsset is RUNE, use the pool for the buyAsset
        if (quote.sellAsset === 'THOR.RUNE') {
            poolIn = null; // RUNE does not need an "in" pool, only "out"
            poolOut = pools.find((p: any) => p.asset === quote.buyAsset);
        }

        // If the buyAsset is RUNE, use the pool for the sellAsset
        if (quote.buyAsset === 'THOR.RUNE') {
            poolOut = null; // RUNE does not need an "out" pool, only "in"
            poolIn = pools.find((p: any) => p.asset === quote.sellAsset);
        }

        // Handle case where pools are not found
        if (!poolIn && quote.sellAsset !== 'THOR.RUNE') {
            log.error(tag, `Pool for sellAsset (${quote.sellAsset}) not found.`);
            throw new Error(`Pool for sellAsset (${quote.sellAsset}) not found.`);
        }
        if (!poolOut && quote.buyAsset !== 'THOR.RUNE') {
            log.error(tag, `Pool for buyAsset (${quote.buyAsset}) not found.`);
            throw new Error(`Pool for buyAsset (${quote.buyAsset}) not found.`);
        }

        log.info(tag, "poolIn: ", poolIn, "poolOut: ", poolOut);

        const sellAssetChain = quote.sellAsset.split(".")[0];
        const DECIMALS = Number(BaseDecimal[sellAssetChain]);
        if (isNaN(DECIMALS)) throw new Error(`Invalid DECIMALS value for asset: ${sellAssetChain}`);
        const BASE_UNIT = Math.pow(10, DECIMALS);
        const sellAmountInBaseUnits = parseFloat(quote.sellAmount) * BASE_UNIT;

        // Create URL for the API
        const URL = `/thorchain/quote/swap?from_asset=${quote.sellAsset}&to_asset=${quote.buyAsset}&amount=${sellAmountInBaseUnits}&destination=${quote.recipientAddress}`;
        log.info(tag, "URL: ", URL);

        const quoteFromNode = await nodeRequest(URL);
        if (quoteFromNode.error) throw new Error(quoteFromNode.error);
        log.info(tag, "quoteFromNode: ", quoteFromNode);
        const amountOutMin = quoteFromNode.amount_out_min;
        const amountOutEstimated = (parseInt(quoteFromNode.expected_amount_out) / BASE_UNIT).toFixed(DECIMALS);

        output.amountOut = amountOutEstimated;

        const memoInput = {
            type: 'SWAP',
            asset: quote.buyAsset,
            destAddr: quote.recipientAddress,
            lim: amountOutMin,
        };
        const memo = createMemo(memoInput);
        log.info(tag, "memo: ", memo);

        const txType = sellAssetChain === "THOR" ? 'deposit' : 'transfer';
        output.id = uuid();
        output.txs = [
            {
                type: txType,
                chain: ChainToNetworkId[sellAssetChain],
                txParams: {
                    senderAddress: quote.senderAddress,
                    recipientAddress: quoteFromNode.inbound_address,
                    amount: quote.sellAmount,
                    token: quote.sellAsset.split(".")[1],
                    memo: quoteFromNode.memo || memo,
                },
            },
        ];
        output.meta = {
            quoteMode: "TC_SUPPORTED_TO_TC_SUPPORTED",
        };
        output.steps = 1;
        output.complete = true;
        output.source = 'thorchain';
        output.raw = quoteFromNode
        
        return output;
    } catch (e) {
        log.error(tag, "Error: ", e);
        throw e;
    }
};


// const get_quote = async function (quote: any) {
//     const tag = TAG + " | get_quote | ";
//     try {
//         let output: any = {};
//         if (!quote.sellAsset) throw new Error("missing sellAsset");
//         if (!quote.buyAsset) throw new Error("missing buyAsset");
//         if (!quote.sellAmount) throw new Error("missing sellAmount");
//         if (!quote.senderAddress) throw new Error("missing senderAddress");
//         if (!quote.recipientAddress) throw new Error("missing recipientAddress");
//         if (!quote.slippage) throw new Error("missing slippage");
//
//         // Get pools from network
//         const pools = await getPools();
//
//         // Find the pool for the sellAsset
//         const poolIn = pools.find((p: any) => p.asset === quote.sellAsset);
//         if (!poolIn) {
//             log.error(tag, `Pool for sellAsset (${quote.sellAsset}) not found.`);
//             throw new Error(`Pool for sellAsset (${quote.sellAsset}) not found.`);
//         }
//
//         let poolOut: any = null;
//
//         // Skip poolOut lookup if buyAsset is RUNE/THOR
//         if (quote.buyAsset === 'THOR.RUNE' || quote.buyAsset === 'RUNE.RUNE') {
//             log.info(tag, `BuyAsset (${quote.buyAsset}) is RUNE/THOR. Skipping poolOut lookup.`);
//         } else {
//             poolOut = pools.find((p: any) => p.asset === quote.buyAsset);
//             if (!poolOut) {
//                 log.error(tag, `Pool for buyAsset (${quote.buyAsset}) not found.`);
//                 throw new Error(`Pool for buyAsset (${quote.buyAsset}) not found.`);
//             }
//         }
//
//         log.info(tag, "poolIn: ", poolIn, "poolOut: ", poolOut || 'N/A (RUNE/THOR as buyAsset)');
//
//         const sellAssetChain = quote.sellAsset.split(".")[0];
//         const DECIMALS = Number(BaseDecimal[sellAssetChain]);
//         if (isNaN(DECIMALS)) throw new Error(`Invalid DECIMALS value for asset: ${sellAssetChain}`);
//         const BASE_UNIT = Math.pow(10, DECIMALS);
//         const sellAmountInBaseUnits = parseFloat(quote.sellAmount) * BASE_UNIT;
//
//         // Create URL for the API
//         const URL = `/thorchain/quote/swap?from_asset=${quote.sellAsset}&to_asset=${quote.buyAsset}&amount=${sellAmountInBaseUnits}&destination=${quote.recipientAddress}`;
//         log.info(tag, "URL: ", URL);
//
//         const quoteFromNode = await nodeRequest(URL);
//         if (quoteFromNode.error) throw new Error(quoteFromNode.error);
//
//         const amountOutMin = quoteFromNode.amount_out_min;
//         const amountOutEstimated = (parseInt(quoteFromNode.expected_amount_out) / BASE_UNIT).toFixed(DECIMALS);
//
//         output.amountOut = amountOutEstimated;
//
//         const memoInput = {
//             type: 'SWAP',
//             asset: quote.buyAsset,
//             destAddr: quote.recipientAddress,
//             lim: amountOutMin,
//         };
//         const memo = createMemo(memoInput);
//         log.info(tag, "memo: ", memo);
//
//         const txType = sellAssetChain === "MAYA" ? 'deposit' : 'transfer';
//
//         output.txs = [
//             {
//                 type: txType,
//                 chain: ChainToNetworkId[sellAssetChain],
//                 txParams: {
//                     senderAddress: quote.senderAddress,
//                     recipientAddress: quoteFromNode.inbound_address,
//                     amount: quote.sellAmount,
//                     token: quote.sellAsset.split(".")[1],
//                     memo: quoteFromNode.memo || memo,
//                 },
//             },
//         ];
//
//         output.meta = {
//             quoteMode: "TC_SUPPORTED_TO_TC_SUPPORTED",
//         };
//         output.steps = 1;
//         output.complete = true;
//         output.source = 'thorchain';
//         output.id = uuid();
//
//         return output;
//     } catch (e) {
//         log.error(tag, "Error: ", e);
//         throw e;
//     }
// };
