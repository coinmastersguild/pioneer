"use strict";
/*
        Maya Swap Integration
                - Highlander
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var TAG = " | maya | ";
// Replace BaseDecimal import with local definition
// Define BaseDecimal as a simple record of string chains to number values
var BaseDecimal = {
    "BTC": 8,
    "ETH": 18,
    "DOGE": 8,
    "BCH": 8,
    "LTC": 8,
    "THOR": 8
};
var uuid = require('uuidv4').uuid;
var log = require('@pioneer-platform/loggerdog')();
var _a = require("@pioneer-platform/pioneer-caip"), caipToNetworkId = _a.caipToNetworkId, shortListSymbolToCaip = _a.shortListSymbolToCaip, ChainToNetworkId = _a.ChainToNetworkId;
var _b = require('@pioneer-platform/pioneer-coins'), createMemo = _b.createMemo, parseMemo = _b.parseMemo;
var networkSupport = [
    ChainToNetworkId["BTC"],
    ChainToNetworkId["ETH"],
    ChainToNetworkId["DOGE"],
    ChainToNetworkId["BCH"],
    ChainToNetworkId["LTC"],
    ChainToNetworkId["THOR"],
];
// Function to make a request to the node
function nodeRequest(path) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://thornode.ninerealms.com".concat(path))];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Node request failed with status: ".concat(response.status, ", message: ").concat(response.statusText));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    error_1 = _a.sent();
                    log.error("".concat(TAG, " Error fetching from node:"), error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
var assets = [
    'bip122:000000000019d6689c085ae165831e93/slip44:0', // BTC
    'eip155:1/slip44:60', // ETH
    'cosmos:thorchain-mainnet-v1/slip44:931', // RUNE
    'bip122:00000000001a91e3dace36e2be3bf030/slip44:3', // Doge
    'bip122:000000000000000000651ef99cb9fcbe/slip44:145', // BCH
];
module.exports = {
    init: function (settings) {
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    assetSupport: function () {
        return assets;
    },
    getQuote: function (quote) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, get_quote(quote)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    },
};
function getPools() {
    return __awaiter(this, void 0, void 0, function () {
        var tag, pools, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | getPools | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, nodeRequest('/thorchain/pools')];
                case 2:
                    pools = _a.sent();
                    if (!pools || pools.length === 0) {
                        throw new Error("No pools fetched from network!");
                    }
                    log.info(tag, "Pools fetched: ", pools.map(function (p) { return p.asset; }));
                    return [2 /*return*/, pools];
                case 3:
                    e_1 = _a.sent();
                    log.error(tag, "Error fetching pools: ", e_1);
                    throw new Error("Unable to fetch pools");
                case 4: return [2 /*return*/];
            }
        });
    });
}
var get_quote = function (quote) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, pools, poolIn, poolOut, sellAssetChain, DECIMALS, BASE_UNIT, sellAmountInBaseUnits, URL_1, quoteFromNode, amountOutMin, amountOutEstimated, memoInput, memo, txType, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_quote | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    output = {};
                    if (!quote.sellAsset)
                        throw new Error("missing sellAsset");
                    if (!quote.buyAsset)
                        throw new Error("missing buyAsset");
                    if (!quote.sellAmount)
                        throw new Error("missing sellAmount");
                    if (!quote.senderAddress)
                        throw new Error("missing senderAddress");
                    if (!quote.recipientAddress)
                        throw new Error("missing recipientAddress");
                    if (!quote.slippage)
                        throw new Error("missing slippage");
                    return [4 /*yield*/, getPools()];
                case 2:
                    pools = _a.sent();
                    poolIn = pools.find(function (p) { return p.asset === quote.sellAsset; });
                    poolOut = pools.find(function (p) { return p.asset === quote.buyAsset; });
                    // If the sellAsset is RUNE, use the pool for the buyAsset
                    if (quote.sellAsset === 'THOR.RUNE') {
                        poolIn = null; // RUNE does not need an "in" pool, only "out"
                        poolOut = pools.find(function (p) { return p.asset === quote.buyAsset; });
                    }
                    // If the buyAsset is RUNE, use the pool for the sellAsset
                    if (quote.buyAsset === 'THOR.RUNE') {
                        poolOut = null; // RUNE does not need an "out" pool, only "in"
                        poolIn = pools.find(function (p) { return p.asset === quote.sellAsset; });
                    }
                    // Handle case where pools are not found
                    if (!poolIn && quote.sellAsset !== 'THOR.RUNE') {
                        log.error(tag, "Pool for sellAsset (".concat(quote.sellAsset, ") not found."));
                        throw new Error("Pool for sellAsset (".concat(quote.sellAsset, ") not found."));
                    }
                    if (!poolOut && quote.buyAsset !== 'THOR.RUNE') {
                        log.error(tag, "Pool for buyAsset (".concat(quote.buyAsset, ") not found."));
                        throw new Error("Pool for buyAsset (".concat(quote.buyAsset, ") not found."));
                    }
                    log.info(tag, "poolIn: ", poolIn, "poolOut: ", poolOut);
                    sellAssetChain = quote.sellAsset.split(".")[0];
                    DECIMALS = Number(BaseDecimal[sellAssetChain]);
                    if (isNaN(DECIMALS))
                        throw new Error("Invalid DECIMALS value for asset: ".concat(sellAssetChain));
                    BASE_UNIT = Math.pow(10, DECIMALS);
                    sellAmountInBaseUnits = parseFloat(quote.sellAmount) * BASE_UNIT;
                    URL_1 = "/thorchain/quote/swap?from_asset=".concat(quote.sellAsset, "&to_asset=").concat(quote.buyAsset, "&amount=").concat(sellAmountInBaseUnits, "&destination=").concat(quote.recipientAddress);
                    log.info(tag, "URL: ", URL_1);
                    return [4 /*yield*/, nodeRequest(URL_1)];
                case 3:
                    quoteFromNode = _a.sent();
                    if (quoteFromNode.error)
                        throw new Error(quoteFromNode.error);
                    log.info(tag, "quoteFromNode: ", quoteFromNode);
                    amountOutMin = quoteFromNode.amount_out_min;
                    amountOutEstimated = (parseInt(quoteFromNode.expected_amount_out) / BASE_UNIT).toFixed(DECIMALS);
                    output.amountOut = amountOutEstimated;
                    memoInput = {
                        type: 'SWAP',
                        asset: quote.buyAsset,
                        destAddr: quote.recipientAddress,
                        lim: amountOutMin,
                    };
                    memo = createMemo(memoInput);
                    log.info(tag, "memo: ", memo);
                    txType = sellAssetChain === "THOR" ? 'deposit' : 'transfer';
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
                    output.raw = quoteFromNode;
                    return [2 /*return*/, output];
                case 4:
                    e_2 = _a.sent();
                    log.error(tag, "Error: ", e_2);
                    throw e_2;
                case 5: return [2 /*return*/];
            }
        });
    });
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
