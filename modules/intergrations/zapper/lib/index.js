"use strict";
/*
    https://docs.blocknative.com/webhook-api

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
Object.defineProperty(exports, "__esModule", { value: true });
var TAG = " | zapper | ";
var log = require('@pioneer-platform/loggerdog')();
//@ts-ignore
var pioneer_caip_1 = require("@pioneer-platform/pioneer-caip");
var Axios = require('axios');
var https = require('https');
var API_KEY = process.env['ZAPPER_API_KEY'];
if (!API_KEY)
    throw Error("api key required! set env ZAPPER_API_KEY");
var axios = Axios.create();
var Authorization = "Basic ".concat(Buffer.from("".concat(API_KEY, ":"), "binary").toString("base64"));
console.log(Authorization);
var URL_SERVICE = "https://api.zapper.xyz";
var axiosRetry = require('axios-retry');
axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: function (retryCount) {
        log.debug(TAG, "retry attempt: ".concat(retryCount));
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: function (error) {
        log.error(TAG, error);
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});
module.exports = {
    getTokens: function (address) {
        return get_tokens(address);
    },
    getNFTs: function (address) {
        return get_nfts(address);
    },
    getPortfolio: function (address) {
        return get_portfolio(address);
    },
    getTotalNetworth: function (address) {
        return get_total_networth(address);
    },
};
var get_portfolio = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output_1, appsResponse, apps, totalBalanceUSDApp_1, i, app, j, product, k, asset, l, token, balance, tokensResponse, totalBalanceUsdTokens_1, tokens, limit, allTokens, cursor, url, response, tokens, error_1, nftResponse, nftUsdNetWorth, totalNetWorth, e_1;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tag = TAG + " | get_portfolio | ";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 11, , 12]);
                    output_1 = {
                        balances: []
                    };
                    return [4 /*yield*/, Axios.get("https://api.zapper.xyz/v2/balances/apps?addresses%5B%5D=".concat(address), {
                            headers: {
                                accept: "*/*",
                                Authorization: Authorization,
                            },
                        })];
                case 2:
                    appsResponse = _c.sent();
                    log.info(tag, "appsResponse: ", appsResponse.data);
                    apps = appsResponse.data;
                    totalBalanceUSDApp_1 = 0;
                    apps.forEach(function (app) {
                        totalBalanceUSDApp_1 += app.balanceUSD;
                    });
                    for (i = 0; i < apps.length; i++) {
                        app = apps[i];
                        for (j = 0; j < app.products.length; j++) {
                            product = app.products[j];
                            log.info(tag, "product: ", product);
                            for (k = 0; k < product.assets.length; k++) {
                                asset = product.assets[k];
                                log.info(tag, "asset: ", asset);
                                for (l = 0; l < asset.tokens.length; l++) {
                                    token = asset.tokens[l];
                                    balance = {};
                                    balance.pubkey = app.address;
                                    balance.balance = token === null || token === void 0 ? void 0 : token.balance.toString();
                                    balance.chain = app.network;
                                    balance.networkId = pioneer_caip_1.evmCaips[app.network].split('/')[0];
                                    if (token.type !== 'base-token' && token.address !== '0x0000000000000000000000000000000000000000') {
                                        balance.caip = balance.networkId + "/erc20:" + token.address;
                                    }
                                    else {
                                        balance.caip = balance.networkId + '/slip44:60';
                                    }
                                    balance.metaType = token.metaType || product.metaType;
                                    balance.name = asset.displayProps.label;
                                    balance.appId = app.appId;
                                    balance.icon = asset.displayProps.images[0];
                                    balance.display = asset.displayProps.images;
                                    balance.groupId = asset.groupId;
                                    balance.symbol = token.symbol;
                                    balance.ticker = token.symbol;
                                    balance.priceUsd = ((_a = token === null || token === void 0 ? void 0 : token.price) === null || _a === void 0 ? void 0 : _a.toString()) || '0';
                                    balance.valueUsd = ((_b = token === null || token === void 0 ? void 0 : token.balanceUSD) === null || _b === void 0 ? void 0 : _b.toString()) || '0';
                                    output_1.balances.push(balance);
                                }
                            }
                        }
                    }
                    return [4 /*yield*/, Axios.get("https://api.zapper.xyz/v2/balances/tokens?addresses%5B%5D=".concat(address), {
                            headers: {
                                accept: "*/*",
                                Authorization: Authorization,
                            },
                        })];
                case 3:
                    tokensResponse = _c.sent();
                    console.log("tokensResponse: ", tokensResponse.data);
                    if (tokensResponse.data && tokensResponse.data[address.toLowerCase()]) {
                        tokens = tokensResponse.data;
                        totalBalanceUsdTokens_1 = 0;
                        tokens = tokens[address.toLowerCase()];
                        output_1.tokens = tokens;
                        log.info(tag, "tokens: ", tokens.length);
                        if (tokens) {
                            tokens.forEach(function (token) {
                                log.debug(tag, "token: ", token);
                                var network = token.network;
                                log.debug(tag, "network: ", network);
                                var caip = pioneer_caip_1.evmCaips[network];
                                if (caip) {
                                    token.networkId = caip.split('/')[0];
                                    if (token.token.address !== '0x0000000000000000000000000000000000000000') {
                                        token.assetCaip = token.networkId + "/erc20:" + token.token.address;
                                    }
                                    else {
                                        token.assetCaip = caip;
                                    }
                                    var balance = {
                                        balance: token.token.balance.toString(),
                                        networkId: token.networkId,
                                        chain: token.network,
                                        caip: token.assetCaip,
                                        type: 'erc20',
                                        name: token.token.name,
                                        symbol: token.token.symbol,
                                        ticker: token.token.symbol,
                                        decimals: token.token.decimals,
                                        priceUsd: token.token.price,
                                        valueUsd: token.token.balanceUSD.toString(),
                                    };
                                    output_1.balances.push(balance);
                                    log.debug(tag, "token.balanceUSD: ", token.token.balanceUSD);
                                    totalBalanceUsdTokens_1 += token.token.balanceUSD;
                                }
                                else {
                                    log.error(tag, "No caip found for network: ", network);
                                }
                            });
                        }
                    }
                    else {
                        totalBalanceUsdTokens_1 = 0;
                    }
                    limit = 100;
                    allTokens = [];
                    cursor = null;
                    _c.label = 4;
                case 4:
                    if (!true) return [3 /*break*/, 9];
                    _c.label = 5;
                case 5:
                    _c.trys.push([5, 7, , 8]);
                    url = "https://api.zapper.xyz/v2/nft/user/tokens?userAddress=".concat(address, "&limit=").concat(limit);
                    if (cursor) {
                        url += "&cursor=".concat(cursor);
                    }
                    return [4 /*yield*/, Axios.get(url, {
                            headers: {
                                accept: "*/*",
                                Authorization: Authorization,
                            },
                        })];
                case 6:
                    response = _c.sent();
                    tokens = response.data;
                    //console.log("tokens: ",tokens)
                    allTokens = allTokens.concat(tokens.items);
                    cursor = response.data.cursor;
                    if (!cursor) {
                        return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _c.sent();
                    console.error(error_1);
                    return [3 /*break*/, 8];
                case 8: return [3 /*break*/, 4];
                case 9:
                    output_1.nfts = allTokens;
                    return [4 /*yield*/, Axios.get("https://api.zapper.xyz/v2/nft/balances/net-worth?addresses%5B%5D=".concat(address), {
                            headers: {
                                accept: "*/*",
                                Authorization: Authorization,
                            },
                        })];
                case 10:
                    nftResponse = _c.sent();
                    nftUsdNetWorth = nftResponse.data;
                    output_1.nftUsdNetWorth = nftUsdNetWorth;
                    output_1.totalBalanceUsdTokens = totalBalanceUsdTokens_1;
                    output_1.totalBalanceUSDApp = totalBalanceUSDApp_1;
                    totalNetWorth = totalBalanceUSDApp_1 + totalBalanceUsdTokens_1 + parseFloat(nftUsdNetWorth[address.toLowerCase()]);
                    //console.log("totalNetWorth: ",totalNetWorth);
                    output_1.totalNetWorth = totalNetWorth;
                    return [2 /*return*/, output_1];
                case 11:
                    e_1 = _c.sent();
                    console.error(tag, "e: ", e_1);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
};
var get_total_networth = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, appsResponse, apps, totalBalanceUSDApp_2, tokensResponse, tokens, totalBalanceUsdTokens_2, nftResponse, nftUsdNetWorth, totalNetWorth, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_tokens | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, Axios.get("https://api.zapper.xyz/v2/balances/apps?addresses%5B%5D=".concat(address), {
                            headers: {
                                accept: "*/*",
                                Authorization: Authorization,
                            },
                        })];
                case 2:
                    appsResponse = _a.sent();
                    apps = appsResponse.data;
                    totalBalanceUSDApp_2 = 0;
                    apps.forEach(function (app) {
                        totalBalanceUSDApp_2 += app.balanceUSD;
                    });
                    return [4 /*yield*/, Axios.get("https://api.zapper.xyz/v2/balances/tokens?addresses%5B%5D=".concat(address), {
                            headers: {
                                accept: "*/*",
                                Authorization: Authorization,
                            },
                        })];
                case 3:
                    tokensResponse = _a.sent();
                    log.debug("tokensResponse: ", tokensResponse.data);
                    tokens = tokensResponse.data;
                    totalBalanceUsdTokens_2 = 0;
                    tokens = tokens[address.toLowerCase()];
                    // log.debug("tokens: ",tokens)
                    tokens.forEach(function (token) {
                        log.debug("token: ", token);
                        var network = token.network;
                        log.debug("network: ", token);
                        var caip = pioneer_caip_1.evmCaips[network];
                        token.caip = caip;
                        log.debug("token.balanceUSD: ", token.token.balanceUSD);
                        totalBalanceUsdTokens_2 += token.token.balanceUSD;
                    });
                    return [4 /*yield*/, Axios.get("https://api.zapper.xyz/v2/nft/balances/net-worth?addresses%5B%5D=".concat(address), {
                            headers: {
                                accept: "*/*",
                                Authorization: Authorization,
                            },
                        })];
                case 4:
                    nftResponse = _a.sent();
                    nftUsdNetWorth = nftResponse.data;
                    log.debug("nftUsdNetWorth: ", nftUsdNetWorth);
                    log.debug("totalBalanceUsdTokens: ", totalBalanceUsdTokens_2);
                    log.debug("totalBalanceUSDApp: ", totalBalanceUSDApp_2);
                    totalNetWorth = totalBalanceUSDApp_2 + totalBalanceUsdTokens_2 + parseFloat(nftUsdNetWorth[address.toLowerCase()]);
                    log.debug("totalNetWorth: ", totalNetWorth);
                    return [2 /*return*/, totalNetWorth];
                case 5:
                    e_2 = _a.sent();
                    console.error(tag, "e: ", e_2);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
};
var get_tokens = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, apiKey, appsResponse, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_tokens | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    apiKey = API_KEY;
                    log.debug(Authorization);
                    return [4 /*yield*/, Axios.get("https://api.zapper.xyz/v2/balances/apps?addresses%5B%5D=".concat(address), {
                            headers: {
                                accept: "*/*",
                                Authorization: Authorization,
                            },
                        })];
                case 2:
                    appsResponse = _a.sent();
                    // @ts-ignore
                    // const appsResponse = await Axios.get(
                    //     `https://api.zapper.xyz/v2/balances/apps?addresses%5B%5D=${address}`,
                    //     {
                    //         headers: {
                    //             accept: "*/*",
                    //             Authorization,
                    //         },
                    //     }
                    // );
                    // let url = URL_SERVICE + "/v2/balances/apps?addresses=" + address+",api_key="+API_KEY
                    // const headers = {
                    //     headers: {
                    //         "Authorization": "Bearer "+process.env['ZAPPER_API_KEY'],
                    //     }
                    // }
                    // let result = await axios({
                    //     url,
                    //     method: 'GET'
                    // },headers)
                    return [2 /*return*/, appsResponse.data];
                case 3:
                    e_3 = _a.sent();
                    console.error(tag, "e: ", e_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_nfts = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, result, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_tokens | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = URL_SERVICE + "/v2/nft/user/tokens?userAddress=" + address;
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET',
                        })];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result.data];
                case 3:
                    e_4 = _a.sent();
                    console.error(tag, "e: ", e_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
