"use strict";
/*

    https://www.coingecko.com/api/documentations/v3

 */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var TAG = " | market-module | ";
// @ts-ignore
var pioneer_discovery_1 = require("@pioneer-platform/pioneer-discovery");
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        headers: {
            "Authorization": "Bearer " + process.env['COINCAP_API_KEY'],
        }
    })
});
var axiosRetry = require('axios-retry');
var _a = require('ethers'), ethers = _a.ethers, BigNumber = _a.BigNumber;
var _b = require('@uniswap/sdk'), Token = _b.Token, Fetcher = _b.Fetcher, WETH = _b.WETH, Route = _b.Route, Trade = _b.Trade, TradeType = _b.TradeType, TokenAmount = _b.TokenAmount;
axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: function (retryCount) {
        console.log("retry attempt: ".concat(retryCount));
        return retryCount * 1000; // time interval between retries
    },
    retryCondition: function (error) {
        console.error(error);
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});
var ProToken = require("@pioneer-platform/pro-token");
var log = require('@pioneer-platform/loggerdog')();
var _c = require("@pioneer-platform/pioneer-coins"), getExplorerAddressUrl = _c.getExplorerAddressUrl, needsMemoByNetwork = _c.needsMemoByNetwork, COIN_MAP_LONG = _c.COIN_MAP_LONG;
var _d = require('@pioneer-platform/default-redis'), subscriber = _d.subscriber, publisher = _d.publisher, redis = _d.redis, redisQueue = _d.redisQueue;
var URL_COINCAP = "https://api.coincap.io/v2/";
var URL_COINGECKO = "https://api.coingecko.com/api/v3/";
var COINGECKO_API_KEY = process.env['COINGECKO_API_KEY'];
var GLOBAL_RATES_COINCAP;
var GLOBAL_RATES_COINGECKO;
module.exports = {
    init: function (settings) {
        if (settings === null || settings === void 0 ? void 0 : settings.apiKey) {
            COINGECKO_API_KEY = settings.apiKey;
        }
        //if(!COINGECKO_API_KEY) throw Error("api key required! set env COINGECKO_API_KEY")
    },
    getAssetsCoinCap: function () {
        return get_assets_coincap();
    },
    getAssetsCoingecko: function (limit, skip) {
        return get_assets_coingecko(limit, skip);
    },
    getRatePro: function () {
        return ProToken.getRateProUsd();
    },
    updateCache: function () {
        return update_cache();
    },
    getPrice: function (asset) {
        return get_price(asset);
    },
    getPricesInQuote: function (assets, quote) {
        return get_prices_in_quote(assets, quote);
    },
    buildBalances: function (marketInfoCoinCap, marketInfoCoinGecko, pubkeys, context) {
        return build_balances(marketInfoCoinCap, marketInfoCoinGecko, pubkeys);
    }
};
var update_cache = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, entries, populatedCaips_1, limit, totalAssets, totalPages, page, url, result, allCoinsArray, _loop_1, _i, allCoinsArray_1, coin, missingCaips, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + ' | update_cache | ';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, , 12]);
                    entries = Object.entries(pioneer_discovery_1.assetData).map(function (_a) {
                        var caip = _a[0], asset = _a[1];
                        if (typeof asset === 'object' && asset !== null) {
                            return __assign(__assign({}, asset), { caip: caip });
                        }
                        else {
                            throw new Error("Invalid asset type for CAIP ".concat(caip));
                        }
                    });
                    log.debug(tag, "entries: ", entries);
                    log.info(tag, "entries: ", entries[0]);
                    log.info(tag, "entries: ", entries.length);
                    populatedCaips_1 = new Set();
                    limit = 250;
                    totalAssets = 2000;
                    totalPages = Math.ceil(totalAssets / limit);
                    page = 1;
                    _a.label = 2;
                case 2:
                    if (!(page <= totalPages)) return [3 /*break*/, 10];
                    url = "".concat(URL_COINGECKO, "coins/markets?vs_currency=usd&order=market_cap_desc&per_page=").concat(limit, "&page=").concat(page, "&sparkline=false");
                    log.debug(tag, "Fetching URL: ", url);
                    return [4 /*yield*/, axios.get(url)];
                case 3:
                    result = _a.sent();
                    allCoinsArray = result.data;
                    log.debug(tag, "Fetched ".concat(allCoinsArray.length, " coins for page ").concat(page));
                    _loop_1 = function (coin) {
                        var matchingAssets, _b, matchingAssets_1, matchingAsset, key;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    matchingAssets = entries.filter(function (asset) { return asset.symbol === coin.symbol.toUpperCase(); });
                                    _b = 0, matchingAssets_1 = matchingAssets;
                                    _c.label = 1;
                                case 1:
                                    if (!(_b < matchingAssets_1.length)) return [3 /*break*/, 4];
                                    matchingAsset = matchingAssets_1[_b];
                                    key = "coingecko:".concat(matchingAsset.caip);
                                    return [4 /*yield*/, redis.setex(key, 3600, JSON.stringify(coin))];
                                case 2:
                                    _c.sent();
                                    log.info(tag, "Saved ".concat(coin.symbol, " under ").concat(key));
                                    populatedCaips_1.add(matchingAsset.caip);
                                    _c.label = 3;
                                case 3:
                                    _b++;
                                    return [3 /*break*/, 1];
                                case 4: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, allCoinsArray_1 = allCoinsArray;
                    _a.label = 4;
                case 4:
                    if (!(_i < allCoinsArray_1.length)) return [3 /*break*/, 7];
                    coin = allCoinsArray_1[_i];
                    return [5 /*yield**/, _loop_1(coin)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 4];
                case 7:
                    if (!(page < totalPages)) return [3 /*break*/, 9];
                    log.debug(tag, "Waiting 10 seconds before next query...");
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 30000); })];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    page++;
                    return [3 /*break*/, 2];
                case 10:
                    missingCaips = entries.filter(function (asset) { return !populatedCaips_1.has(asset.caip); }).map(function (asset) { return asset.caip; });
                    log.info(tag, "Missing CAIPs: ", missingCaips);
                    return [2 /*return*/, missingCaips];
                case 11:
                    e_1 = _a.sent();
                    log.error(e_1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
};
// const update_cache = async function() {
//     let tag = TAG + ' | update_cache | '
//     try{
//         // log.info(tag,"assetData: ",assetData)
//         // let entries = Object.values(assetData)
//         // @ts-ignore
//         let entries = Object.entries(assetData).map(([caip, asset]) => ({...asset, caip}));
//
//         log.debug(tag,"entries: ",entries)
//         log.info(tag,"entries: ",entries[0])
//         log.info(tag,"entries: ",entries.length)
//        
//        
//         let url = URL_COINCAP + 'assets?limit=2000'
//         log.debug(tag,"url: ",url)
//         let result = await axios({
//             url: url,
//             method: 'GET'
//         })
//
//         //parse into keys array off ticker
//         let allCoinsArray = result.data.data
//         log.debug(tag,"allCoinsArray: ",allCoinsArray.length)
//
//         // let marketInfoCoinGecko = await get_assets_coingecko()
//         for(let i = 0; i < allCoinsArray.length; i++){
//             let entry = allCoinsArray[i]
//             // log.debug(tag,"entry: ",entry)
//
//             //hits by symbol
//             // @ts-ignore
//             let assetsMatchSymbol = entries.filter(asset => asset.symbol === entry.symbol);
//             //for now ignore this stuffs
//             // if(assetsMatchSymbol.length > 1){ // @ts-ignore
//             //     console.log(assetsMatchSymbol[0].symbol+ " assetsMatchSymbol: ",assetsMatchSymbol.length)
//             //     console.log("0: ",assetsMatchSymbol[0])
//             //     console.log("1: ",assetsMatchSymbol[1])
//             // }
//
//             for(let j = 0; j < assetsMatchSymbol.length; j++){
//                 let asset = assetsMatchSymbol[j]
//                 // log.debug(tag,"asset: ",asset)
//                 // @ts-ignore
//                 let key = "coincap:"+asset.caip
//                 // log.debug(tag,"key: ",key)
//                 //save cache by caip with 1hour cache
//                 let result = await redis.setex(key, 3600, JSON.stringify(entry))
//                 log.debug(tag,"saved: "+key+" result: ",result)
//             }
//         }
//
//         // Handling pagination for CoinGecko
//         const limit = 250; // assets per request
//         const totalAssets = 2000; // total assets to fetch
//         const totalPages = Math.ceil(totalAssets / limit); // calculate total pages needed
//
//         for (let page = 1; page <= totalPages; page++) {
//             let url = `${URL_COINGECKO}coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false`;
//             log.debug(tag, "Fetching URL: ", url);
//
//             let result = await axios.get(url);
//             let allCoinsArray = result.data;
//             log.debug(tag, `Fetched ${allCoinsArray.length} coins for page ${page}`);
//             // log.debug(tag,"allCoinsArray: ",allCoinsArray)
//             // Process each coin
//             for (let coin of allCoinsArray) {
//                 // log.debug(tag,"coin: ",coin)
//                 let matchingAssets = entries.filter(asset => asset.symbol === coin.symbol.toUpperCase());
//                 for (let matchingAsset of matchingAssets) {
//                     let key = `coingecko:${matchingAsset.caip}`;
//                     await redis.setex(key, 3600, JSON.stringify(coin));
//                     log.debug(tag, `Saved ${coin.symbol} under ${key}`);
//                 }
//             }
//
//             // Wait 10 seconds before the next page request if it's not the last page
//             if (page < totalPages) {
//                 log.debug(tag, `Waiting 10 seconds before next query...`);
//                 await new Promise(resolve => setTimeout(resolve, 30000));
//             }
//         }
//
//
//         //mayachain info
//         // const response = await axios.get('https://www.mayascan.org/api/cacao/price?days=1');
//         // const latestCandle = response.data.candles.pop(); // Assuming you want the latest price
//         // let cacaoPrice = latestCandle.close; // Using the close price as the current price
//
//
//     }catch(e){
//         log.error(e)
//     }
// }
var build_balances = function (marketInfoCoinCap, marketInfoCoinGecko, pubkeys) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, valuesUsd, totalValueUsd, outputBalances, unknownTokens, unPricedTokens, i, entry, proUsdRate, coincap, coingecko, priceUsd, balance, valueUsd, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + ' | build_balances | ';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, , 13]);
                    if (!pubkeys)
                        throw Error("No pubkeys given!");
                    if (!!marketInfoCoinCap) return [3 /*break*/, 3];
                    return [4 /*yield*/, get_assets_coincap()];
                case 2:
                    marketInfoCoinCap = _a.sent();
                    _a.label = 3;
                case 3:
                    if (!!marketInfoCoinGecko) return [3 /*break*/, 5];
                    return [4 /*yield*/, get_assets_coingecko()
                        // console.log(Object.keys(marketInfoCoinCap))
                        // console.log(Object.keys(marketInfoCoinGecko))
                        // console.log(Object.keys(marketInfoCoinCap).length)
                        // console.log(Object.keys(marketInfoCoinGecko).length)
                    ];
                case 4:
                    marketInfoCoinGecko = _a.sent();
                    _a.label = 5;
                case 5:
                    valuesUsd = {};
                    totalValueUsd = 0;
                    outputBalances = [];
                    unknownTokens = [];
                    unPricedTokens = [];
                    i = 0;
                    _a.label = 6;
                case 6:
                    if (!(i < pubkeys.length)) return [3 /*break*/, 11];
                    entry = pubkeys[i];
                    if (!(entry.ticker === 'PRO')) return [3 /*break*/, 8];
                    return [4 /*yield*/, ProToken.getRateProUsd()];
                case 7:
                    proUsdRate = _a.sent();
                    redis.set('proUsdRate', proUsdRate);
                    console.log("proToUsdRate: ", proUsdRate);
                    entry.priceUsd = proUsdRate;
                    //TODO get rate in USD
                    entry.rank = 10;
                    entry.alias = [];
                    entry.alias.push('PRO');
                    entry.source = "uniswap";
                    entry.symbol = "PRO";
                    return [3 /*break*/, 9];
                case 8:
                    coincap = marketInfoCoinCap[entry.ticker];
                    coingecko = marketInfoCoinGecko[entry.ticker];
                    // log.debug("coincap: ",coincap)
                    // log.debug("coingecko: ",coingecko)
                    if (!coincap && !coingecko) {
                        //console.error("unknown token! ",entry.symbol)
                        unknownTokens.push(entry);
                    }
                    if (coincap && coincap.priceUsd) {
                        entry.priceUsd = coincap.priceUsd;
                        entry.rank = coincap.rank;
                        entry.alias = [];
                        if (!entry.name)
                            entry.name = coincap.name;
                        if (entry.name)
                            entry.alias.push(entry.name);
                        // entry.marketInfo = coincap
                        entry.source = "coincap";
                    }
                    //preference coinGecko as more accurate
                    if (coingecko && coingecko.current_price) {
                        entry.alias = [];
                        if (entry.name)
                            entry.alias.push(entry.name);
                        entry.priceUsd = coingecko.current_price;
                        if (!entry.name)
                            entry.name = coingecko.id;
                        entry.alias = entry.alias.push(coingecko.name);
                        entry.rank = coingecko.market_cap_rank;
                        entry.source = "coingecko";
                    }
                    _a.label = 9;
                case 9:
                    priceUsd = Number(entry.priceUsd);
                    if (!isNaN(priceUsd) && priceUsd !== 0) {
                        balance = Number(entry.balance) || 0;
                        valueUsd = balance * priceUsd;
                        // Convert valueUsd to string and store back on the entry
                        entry.valueUsd = String(valueUsd);
                        // Add valueUsd to totalValueUsd, ensure totalValueUsd is a number
                        totalValueUsd += valueUsd;
                        // Push the entry to the output balances
                        outputBalances.push(entry);
                    }
                    else {
                        // Push the entry to unPricedTokens if priceUsd is not valid
                        unPricedTokens.push(entry);
                    }
                    _a.label = 10;
                case 10:
                    i++;
                    return [3 /*break*/, 6];
                case 11: return [2 /*return*/, { outputBalances: outputBalances, unPricedTokens: unPricedTokens, unknownTokens: unknownTokens, total: totalValueUsd }];
                case 12:
                    e_2 = _a.sent();
                    console.error(tag, 'Error: ', e_2);
                    throw e_2;
                case 13: return [2 /*return*/];
            }
        });
    });
};
var get_assets_coincap = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, url, result, allCoinsArray, i, coinInfo, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + ' | get_order | ';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = {};
                    url = URL_COINCAP + 'assets?limit=2000';
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })
                        //parse into keys array off ticker
                    ];
                case 2:
                    result = _a.sent();
                    allCoinsArray = result.data.data;
                    log.debug(tag, "allCoinsArray: ", allCoinsArray.length);
                    for (i = 0; i < allCoinsArray.length; i++) {
                        coinInfo = allCoinsArray[i];
                        log.debug(tag, "coinInfo: ", coinInfo);
                        output[coinInfo.symbol] = coinInfo;
                    }
                    log.debug('result: ', output);
                    return [2 /*return*/, output];
                case 3:
                    e_3 = _a.sent();
                    //handle error gracefully
                    return [2 /*return*/, {}];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_assets_coingecko = function (limit, skip) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, url, result, allCoinsArray, i, coinInfo, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + ' | get_assets_coingecko | ';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = {};
                    if (!limit)
                        limit = 250;
                    if (!skip)
                        skip = 0;
                    url = URL_COINGECKO + "coins/markets?vs_currency=usd&order=market_cap_desc&per_page=".concat(limit, "&page=").concat(skip, "&sparkline=false");
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 2:
                    result = _a.sent();
                    log.debug(tag, "result: ", result.data);
                    allCoinsArray = result.data;
                    log.debug(tag, "allCoinsArray: ", allCoinsArray.length);
                    for (i = 0; i < allCoinsArray.length; i++) {
                        coinInfo = allCoinsArray[i];
                        log.debug(tag, "coinInfo: ", coinInfo);
                        // @ts-ignore
                        output[coinInfo.symbol.toUpperCase()] = coinInfo;
                    }
                    log.debug('result: ', output);
                    return [2 /*return*/, output];
                case 3:
                    e_4 = _a.sent();
                    //handle error gracefully
                    return [2 /*return*/, {}];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_prices_in_quote = function (assets, quote) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, data, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | get_prices_in_quote | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get("".concat(URL_COINGECKO, "/simple/price?ids=") + assets.toString() + "&vs_currencies=" + quote)];
                case 2:
                    data = (_a.sent()).data;
                    return [2 /*return*/, data];
                case 3:
                    e_5 = _a.sent();
                    log.error(tag, "e: ", e_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_price = function (asset) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, data, currency, marketData, e_6;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    tag = " | get_price | ";
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get("".concat(URL_COINGECKO, "/coins/").concat(asset))
                        // TODO: get correct localizations
                    ];
                case 2:
                    data = (_e.sent()).data;
                    currency = 'usd';
                    marketData = data === null || data === void 0 ? void 0 : data.market_data;
                    return [2 /*return*/, {
                            price: (_a = marketData === null || marketData === void 0 ? void 0 : marketData.current_price) === null || _a === void 0 ? void 0 : _a[currency],
                            marketCap: (_b = marketData === null || marketData === void 0 ? void 0 : marketData.market_cap) === null || _b === void 0 ? void 0 : _b[currency],
                            changePercent24Hr: marketData === null || marketData === void 0 ? void 0 : marketData.price_change_percentage_24h,
                            volume: (_c = marketData === null || marketData === void 0 ? void 0 : marketData.total_volume) === null || _c === void 0 ? void 0 : _c[currency],
                            icon: (_d = data === null || data === void 0 ? void 0 : data.image) === null || _d === void 0 ? void 0 : _d.large
                        }];
                case 3:
                    e_6 = _e.sent();
                    log.error(tag, "e: ", e_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
