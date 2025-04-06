"use strict";
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
var TAG = " | Pioneer-router | ";
var log = require('@pioneer-platform/loggerdog')();
var redis = require('@pioneer-platform/default-redis').redis;
var proToken = require("@pioneer-platform/pro-token");
var _a = require("@pioneer-platform/pioneer-caip"), caipToRango = _a.caipToRango, caipToNetworkId = _a.caipToNetworkId, caipToThorchain = _a.caipToThorchain;
//rango
var rango = require("@pioneer-platform/rango-client");
//changelly
var changelly = require("@pioneer-platform/changelly-client");
//osmosis
var osmosis = require("@pioneer-platform/osmosis-client");
//
var thorchain = require("@pioneer-platform/thorchain-client");
//osmosis
var mayachain = require("@pioneer-platform/mayachain-client");
//uniswap
var uniswap = require("@pioneer-platform/uniswap-client");
//
var chainflip = require("@pioneer-platform/chainflip-client");
//1inch/0x
// //bridge
// let across = require("@pioneer-platform/across-client")
var MEMOLESS_SUPPORT = {
    "changelly": true,
    "chainflip": true,
};
var NetworksByIntegration = {};
var AssetsByIntegration = {};
module.exports = {
    init: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, rango.init()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, changelly.init()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, osmosis.init()];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, mayachain.init()];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, uniswap.init()];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, thorchain.init({})];
                    case 6:
                        _a.sent();
                        NetworksByIntegration['mayachain'] = mayachain.networkSupport();
                        NetworksByIntegration['changelly'] = changelly.networkSupport();
                        NetworksByIntegration['rango'] = rango.networkSupport();
                        NetworksByIntegration['osmosis'] = osmosis.networkSupport();
                        NetworksByIntegration['uniswap'] = uniswap.networkSupport();
                        // NetworksByIntegration['across'] = across.networkSupport()
                        NetworksByIntegration['chainflip'] = chainflip.networkSupport();
                        NetworksByIntegration['thorchain'] = thorchain.networkSupport();
                        //get assets
                        AssetsByIntegration['mayachain'] = mayachain.assetSupport();
                        AssetsByIntegration['changelly'] = changelly.assetSupport();
                        AssetsByIntegration['rango'] = rango.assetSupport();
                        AssetsByIntegration['osmosis'] = osmosis.assetSupport();
                        AssetsByIntegration['uniswap'] = uniswap.assetSupport();
                        AssetsByIntegration['thorchain'] = thorchain.assetSupport();
                        // AssetsByIntegration['across'] = across.assetSupport()
                        AssetsByIntegration['chainflip'] = chainflip.assetSupport();
                        return [2 /*return*/, true];
                }
            });
        });
    },
    memoless: function () {
        return MEMOLESS_SUPPORT;
    },
    assetSupport: function () {
        return AssetsByIntegration;
    },
    routes: function () {
        return NetworksByIntegration;
    },
    quote: function (quote) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, get_quote(quote)];
            });
        });
    }
};
function get_quote_from_integration(integration, quote) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, _a, thorchainNameSellAsset, thorchainBuyAsset, payloadThorchain, quoteThorchain, rangoNameSellAsset, rangoNameBuyAsset, payloadRango, quoteRango, payloadOsmosis, quoteOsmosis, from, to, address, amount, quoteChangelly, payloadMayachain, quoteMayachain, payloadUniswap, quoteUniswap, payloadChainflip, quoteChainflip, e_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tag = TAG + " | get_quote_from_integration | ";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 18, , 19]);
                    _a = integration;
                    switch (_a) {
                        case "thorchain": return [3 /*break*/, 2];
                        case "rango": return [3 /*break*/, 4];
                        case "osmosis": return [3 /*break*/, 6];
                        case "changelly": return [3 /*break*/, 8];
                        case "mayachain": return [3 /*break*/, 10];
                        case "uniswap": return [3 /*break*/, 12];
                        case "chainflip": return [3 /*break*/, 14];
                    }
                    return [3 /*break*/, 16];
                case 2:
                    log.info(tag, "thorchain quote: ", quote);
                    if (!quote.senderAddress)
                        throw Error('invalid quote! missing senderAddress');
                    if (!quote.recipientAddress)
                        throw Error('invalid quote! missing recipientAddress');
                    thorchainNameSellAsset = caipToThorchain(quote.sellAsset.caip, quote.sellAsset.ticker || quote.sellAsset.symbol, null);
                    thorchainBuyAsset = caipToThorchain(quote.buyAsset.caip, quote.buyAsset.ticker || quote.buyAsset.symbol, null);
                    log.info(tag, "thorchainBuyAsset: ", thorchainBuyAsset);
                    log.info(tag, "thorchainNameSellAsset: ", thorchainNameSellAsset);
                    if (thorchainBuyAsset === 'THOR.THOR')
                        thorchainBuyAsset = 'THOR.RUNE';
                    if (thorchainNameSellAsset === 'THOR.THOR')
                        thorchainNameSellAsset = 'THOR.RUNE';
                    if (!thorchainNameSellAsset)
                        throw Error('invalid thorchainNameSellAsset');
                    if (!thorchainBuyAsset)
                        throw Error('invalid thorchainBuyAsset');
                    payloadThorchain = {
                        sellAsset: thorchainNameSellAsset,
                        sellAmount: quote.sellAmount,
                        buyAsset: thorchainBuyAsset,
                        senderAddress: quote.senderAddress,
                        recipientAddress: quote.recipientAddress,
                        slippage: 3,
                    };
                    log.info(tag, "payloadThorchain: ", payloadThorchain);
                    return [4 /*yield*/, thorchain.getQuote(payloadThorchain)];
                case 3:
                    quoteThorchain = _c.sent();
                    return [2 /*return*/, [quoteThorchain]];
                case 4:
                    rangoNameSellAsset = caipToRango(quote.sellAsset.caip, quote.sellAsset.ticker, null);
                    rangoNameBuyAsset = caipToRango(quote.buyAsset.caip, quote.buyAsset.ticker, null);
                    payloadRango = {
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
                        "selectedWallets": (_b = {},
                            _b[rangoNameBuyAsset.blockchain] = quote.buyAsset.address,
                            _b[rangoNameSellAsset.blockchain] = quote.sellAsset.address,
                            _b),
                        "checkPrerequisites": false,
                        "affiliateRef": null
                    };
                    log.info(tag, "payloadRango: ", JSON.stringify(payloadRango));
                    return [4 /*yield*/, rango.getQuote(payloadRango)];
                case 5:
                    quoteRango = _c.sent();
                    return [2 /*return*/, [quoteRango]];
                case 6:
                    payloadOsmosis = {
                        sellAsset: quote.sellAsset.caip,
                        buyAsset: quote.buyAsset.caip,
                        sellAmount: quote.sellAmount,
                        senderAddress: quote.senderAddress,
                        recipientAddress: quote.recipientAddress,
                        slippage: quote.slippage
                    };
                    return [4 /*yield*/, osmosis.getQuote(payloadOsmosis)];
                case 7:
                    quoteOsmosis = _c.sent();
                    return [2 /*return*/, [quoteOsmosis]];
                case 8:
                    from = quote.sellAsset.ticker || quote.sellAsset.symbol;
                    to = quote.buyAsset.ticker || quote.buyAsset.symbol;
                    address = quote.buyAsset.address;
                    amount = quote.sellAmount;
                    log.info({
                        from: from,
                        to: to,
                        address: address,
                        amount: amount
                    });
                    return [4 /*yield*/, changelly.getQuote(from, to, address, amount)];
                case 9:
                    quoteChangelly = _c.sent();
                    return [2 /*return*/, [quoteChangelly]];
                case 10:
                    payloadMayachain = {
                        sellAsset: quote.sellAsset.identifier,
                        buyAsset: quote.buyAsset.identifier,
                        sellAmount: quote.sellAmount,
                        senderAddress: quote.senderAddress,
                        recipientAddress: quote.recipientAddress,
                        slippage: quote.slippage
                    };
                    log.info(tag, "payloadMayachain: ", payloadMayachain);
                    return [4 /*yield*/, mayachain.getQuote(payloadMayachain)];
                case 11:
                    quoteMayachain = _c.sent();
                    return [2 /*return*/, [quoteMayachain]];
                case 12:
                    payloadUniswap = {
                        sellAsset: quote.sellAsset.caip,
                        buyAsset: quote.buyAsset.caip,
                        sellAmount: quote.sellAmount,
                        senderAddress: quote.senderAddress,
                        recipientAddress: quote.recipientAddress,
                        slippage: quote.slippage
                    };
                    log.info(tag, "payloadUniswap: ", payloadUniswap);
                    return [4 /*yield*/, uniswap.getQuote(payloadUniswap)];
                case 13:
                    quoteUniswap = _c.sent();
                    log.info(tag, "quoteUniswap: ", quoteUniswap);
                    return [2 /*return*/, [quoteUniswap]];
                case 14:
                    payloadChainflip = {
                        sellAsset: quote.sellAsset.caip,
                        buyAsset: quote.buyAsset.caip,
                        sellAmount: quote.sellAmount,
                        recipientAddress: quote.recipientAddress,
                        slippage: quote.slippage
                    };
                    log.info(tag, "payloadChainflip: ", payloadChainflip);
                    return [4 /*yield*/, chainflip.getQuote(payloadChainflip)];
                case 15:
                    quoteChainflip = _c.sent();
                    return [2 /*return*/, [quoteChainflip]
                        // case "across":
                        //     let payloadAcross = {
                        //         sellAsset: quote.sellAsset.caip,
                        //         buyAsset: quote.buyAsset.caip,
                        //         sellAmount: quote.sellAmount,
                        //         senderAddress: quote.senderAddress,
                        //         recipientAddress: quote.recipientAddress,
                        //         slippage: quote.slippage
                        //     }
                        //     log.info(tag,"payloadAcross: ",payloadAcross)
                        //     let quotedAcross = await accross.getQuote(payloadAcross)
                        //     return [quotedAcross]
                    ];
                case 16: throw new Error("Intergration not found");
                case 17: return [3 /*break*/, 19];
                case 18:
                    e_1 = _c.sent();
                    log.error(tag, "Error: ", e_1);
                    return [2 /*return*/, null];
                case 19: return [2 /*return*/];
            }
        });
    });
}
var get_pro_rate_usd = function () {
    return __awaiter(this, void 0, void 0, function () {
        var cacheValue, proRateUsd, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    return [4 /*yield*/, redis.get('proRateUsd')];
                case 1:
                    cacheValue = _a.sent();
                    if (!cacheValue) return [3 /*break*/, 2];
                    return [2 /*return*/, parseFloat(cacheValue)]; // Convert string to float if necessary
                case 2: return [4 /*yield*/, proToken.getRateProUsd()];
                case 3:
                    proRateUsd = _a.sent();
                    return [4 /*yield*/, redis.setex('proRateUsd', 300, proRateUsd.toString())];
                case 4:
                    _a.sent(); // Expiry time in seconds, value as string
                    return [2 /*return*/, proRateUsd];
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_2 = _a.sent();
                    log.error(e_2);
                    return [2 /*return*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
};
function get_quote(quote) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, sellChain, buyChain, integrations, quotes, supportsInput, supportsOutput, supportsBoth, _i, integrations_1, integration, supportedAssets, supportsInputOnly, supportsOutputOnly, supportsBothAssets, integrationQuotes, i, integrationQuote, sellAssetValueUsd, buyAssetValueUsd, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | get_quote | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    sellChain = caipToNetworkId(quote.sellAsset.caip);
                    buyChain = caipToNetworkId(quote.buyAsset.caip);
                    integrations = Object.keys(NetworksByIntegration);
                    quotes = [];
                    log.info("sellChain: ", sellChain);
                    log.info("buyChain: ", buyChain);
                    // Filter integrations for memoless support if applicable
                    if (quote.memoless) {
                        integrations = integrations.filter(function (integration) { return MEMOLESS_SUPPORT[integration]; });
                    }
                    supportsInput = [];
                    supportsOutput = [];
                    supportsBoth = [];
                    _i = 0, integrations_1 = integrations;
                    _a.label = 2;
                case 2:
                    if (!(_i < integrations_1.length)) return [3 /*break*/, 5];
                    integration = integrations_1[_i];
                    supportedAssets = AssetsByIntegration[integration];
                    log.info(tag, integration + " supportedAssets: ", supportedAssets);
                    supportsInputOnly = supportedAssets.includes(quote.sellAsset.caip);
                    supportsOutputOnly = !supportedAssets.includes(quote.sellAsset.caip) && supportedAssets.includes(quote.buyAsset.caip);
                    supportsBothAssets = supportedAssets.includes(quote.sellAsset.caip) && supportedAssets.includes(quote.buyAsset.caip);
                    if (supportsInputOnly) {
                        supportsInput.push(integration);
                        log.info(tag, integration + " supports input asset: ", quote.sellAsset.caip);
                    }
                    if (supportsOutputOnly) {
                        supportsOutput.push(integration);
                        log.info(tag, integration + " supports output asset: ", quote.buyAsset.caip);
                    }
                    if (supportsBothAssets) {
                        supportsBoth.push(integration);
                        log.info(tag, integration + " supports both assets: ", quote.sellAsset.caip, quote.buyAsset.caip);
                    }
                    if (!supportsBothAssets) return [3 /*break*/, 4];
                    log.info(tag, "Found supported integration for both assets:", integration);
                    return [4 /*yield*/, get_quote_from_integration(integration, quote)];
                case 3:
                    integrationQuotes = _a.sent();
                    if (integrationQuotes) {
                        for (i = 0; i < integrationQuotes.length; i++) {
                            integrationQuote = integrationQuotes[i];
                            integrationQuote.sellAsset = quote.sellAsset.caip;
                            integrationQuote.sellAmount = quote.sellAmount;
                            integrationQuote.buyAsset = quote.buyAsset.caip;
                            integrationQuote.buyAmount = integrationQuote.amountOut;
                            if (integrationQuote.amountOut > 0) {
                                log.info("integrationQuote.amountOut: ", integrationQuote.amountOut);
                                sellAssetValueUsd = parseFloat(quote.sellAmount) * quote.sellAsset.priceUsd;
                                buyAssetValueUsd = parseFloat(integrationQuote.amountOut) * quote.buyAsset.priceUsd;
                                //let proTokenEarned = sellAssetValueUsd * 0.1; // For every 1 USD, they earn 0.01 PRO token
                                //integrationQuote.proTokenEarned = proTokenEarned;
                                //integrationQuote.proTokenEarnedUsd = proTokenEarned * await get_pro_rate_usd(); //TODO get dynamic price
                                integrationQuote.sellAssetValueUsd = sellAssetValueUsd;
                                integrationQuote.buyAssetValueUsd = buyAssetValueUsd;
                                quotes.push({ integration: integration, quote: integrationQuote });
                            }
                            else {
                                log.error("Failed to get amountOut from integration: ", integration);
                            }
                        }
                    }
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    log.info(tag, "Integrations supporting input asset: ", supportsInput);
                    log.info(tag, "Integrations supporting output asset: ", supportsOutput);
                    log.info(tag, "Integrations supporting both assets: ", supportsBoth);
                    //TODO if no quote found for both assets, find a pivot asset
                    log.info(tag, "quotes: ", quotes);
                    //TODO FUTURE!
                    // if (quotes.length === 0) {
                    //     log.info(tag, "No direct quotes found. Searching for pivot trades...");
                    //
                    //     const PIVOT_ASSETS:any = [
                    //         { caip: 'eip155:1/slip44:60', name: 'ETH' },
                    //         { caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0', name: 'BTC' }
                    //     ];
                    //    
                    //     // Find pivot trades
                    //     for (let integration of supportsInput) {
                    //         for (let pivotAsset of PIVOT_ASSETS) {
                    //             // @ts-ignore
                    //             let pivotQuote = await get_quote_from_integration(integration, { ...quote, buyAsset: { caip: pivotAsset } });
                    //             if (pivotQuote && pivotQuote.length > 0) {
                    //                 let pivotAmount = pivotQuote[0].amountOut;
                    //                 log.info(tag, "Pivot trade found: ", pivotAmount, " of ", pivotAsset);
                    //
                    //                 for (let outputIntegration of supportsOutput) {
                    //                     // @ts-ignore
                    //                     let finalQuote = await get_quote_from_integration(outputIntegration, { sellAsset: { caip: pivotAsset }, sellAmount: pivotAmount, buyAsset: quote.buyAsset });
                    //                     if (finalQuote && finalQuote.length > 0 && finalQuote[0].amountOut > 0) {
                    //                         let finalAmount = finalQuote[0].amountOut;
                    //                         quotes.push({
                    //                             integration: integration + " -> " + outputIntegration,
                    //                             quote: {
                    //                                 sellAsset: quote.sellAsset.caip,
                    //                                 sellAmount: quote.sellAmount,
                    //                                 buyAsset: quote.buyAsset.caip,
                    //                                 buyAmount: finalAmount,
                    //                                 pivotAsset: pivotAsset,
                    //                                 pivotAmount: pivotAmount
                    //                             }
                    //                         });
                    //                     }
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }
                    return [2 /*return*/, quotes];
                case 6:
                    err_1 = _a.sent();
                    throw err_1;
                case 7: return [2 /*return*/];
            }
        });
    });
}
// async function get_quote(quote:Swap) {
//     let tag = " | get_quote | "
//     try {
//
//         let sellChain = caipToNetworkId(quote.sellAsset.caip);
//         let buyChain = caipToNetworkId(quote.buyAsset.caip);
//         let integrations = Object.keys(NetworksByIntegration);
//         let quotes = [];
//         log.info("sellChain: ",sellChain)
//         log.info("buyChain: ",buyChain)
//
//         //if memoless filter
//         if (quote.memoless) {
//             integrations = integrations.filter(integration => MEMOLESS_SUPPORT[integration]);
//         }
//
//         for (let integration of integrations) {
//             let supportedAssets = AssetsByIntegration[integration];
//             log.info(tag,integration+" supportedAssets: ",supportedAssets)
//             if (supportedAssets.includes(quote.sellAsset.caip) && supportedAssets.includes(quote.buyAsset.caip)) {
//                 console.log(TAG, "Found supported integration for both assets:", integration);
//                 let integrationQuotes = await get_quote_from_integration(integration, quote);
//                 if(integrationQuotes) {
//                     for(let i = 0; i < integrationQuotes.length; i++){
//                         let integrationQuote = integrationQuotes[i]
//                         integrationQuote.sellAsset = quote.sellAsset.caip
//                         integrationQuote.sellAmount = quote.sellAmount
//                         integrationQuote.buyAsset = quote.buyAsset.caip
//                         integrationQuote.buyAmount = integrationQuote.amountOut
//                         if(integrationQuote.amountOut > 0){
//                             log.info("integrationQuote.amountOut: ",integrationQuote.amountOut)
//                             let sellAssetValueUsd = parseFloat(quote.sellAmount) * quote.sellAsset.priceUsd;
//                             let buyAssetValueUsd = parseFloat(integrationQuote.amountOut) * quote.buyAsset.priceUsd;
//                             let proTokenEarned = sellAssetValueUsd * 0.1; // For every 1 USD, they earn 0.01 PRO token
//                             integrationQuote.proTokenEarned = proTokenEarned;
//                             integrationQuote.proTokenEarnedUsd = proTokenEarned * await get_pro_rate_usd() //TODO get dynamic price
//                             integrationQuote.sellAssetValueUsd = sellAssetValueUsd;
//                             integrationQuote.buyAssetValueUsd = buyAssetValueUsd;
//                             quotes.push({ integration, quote: integrationQuote });    
//                         } else {
//                             log.error("Failed to get amountOut from integration: ",integration)
//                         }
//                     }
//                 }
//             }
//         }
//        
//
//         //return applicable intergrations
//
//         //for each intergration get quote
//
//         //set best quote
//
//         //return quotes
//         return quotes;
//     } catch (err) {
//         throw err;
//     }
// }
//
