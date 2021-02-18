"use strict";
/*
   ETH Network tools


       Goals:

        *


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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var TAG = " | eth-network | ";
var Web3 = require('web3');
//
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
//
var tokenData = require("@pioneer-platform/pioneer-eth-token-data");
var log = require('@pioneer-platform/loggerdog')();
var ETHPLORER_API_KEY = process.env['ETHPLORER_API_KEY'] || 'freekey';
//
var web3;
//TODO precision module
var BASE = 1000000000000000000;
module.exports = {
    init: function (settings) {
        if (!settings) {
            //use default
            web3 = new Web3(process.env['PARITY_ARCHIVE_NODE']);
        }
        else if (settings.testnet) {
            //TODO if testnet
            web3 = new Web3(process.env['PARITY_ARCHIVE_NODE']);
        }
        else {
            //TODO if custom
            web3 = new Web3(process.env['PARITY_ARCHIVE_NODE']);
        }
    },
    getInfo: function () {
        return check_online_status();
    },
    getNonce: function (address) {
        return web3.eth.getTransactionCount(address, 'pending');
    },
    getTransaction: function (txid) {
        return get_transaction(txid);
    },
    getBalance: function (address) {
        return get_balance(address);
    },
    getBalanceAddress: function (address) {
        return get_balance(address);
    },
    getBalanceToken: function (address, token) {
        return get_balance_token(address, token);
    },
    getBalanceTokens: function (address) {
        return get_balance_tokens(address);
    }
};
var get_balance_tokens = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, balances, valueUsds, coinInfo, resp, tokenInfo, i, info, symbol, rate, balance, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_balance | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    balances = {};
                    valueUsds = {};
                    coinInfo = {};
                    return [4 /*yield*/, axios({
                            method: 'GET',
                            url: 'http://api.ethplorer.io/getAddressInfo/' + address + '?apiKey=' + ETHPLORER_API_KEY
                        })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    balances['ETH'] = resp.data.ETH.balance;
                    valueUsds['ETH'] = parseFloat(resp.data.ETH.balance) * parseFloat(resp.data.ETH.price.rate);
                    tokenInfo = resp.data.tokens;
                    log.debug(tag, "tokenInfo: ", tokenInfo);
                    //
                    if (tokenInfo && Object.keys(tokenInfo).length > 0) {
                        for (i = 0; i < tokenInfo.length; i++) {
                            info = tokenInfo[i];
                            if (info) {
                                log.debug(tag, "info: ", info);
                                symbol = info.tokenInfo.symbol;
                                log.debug(tag, "symbol: ", symbol);
                                rate = 0;
                                if (info.tokenInfo.price && info.tokenInfo.price.rate) {
                                    log.debug(tag, "rate: ", info.tokenInfo.price.rate);
                                    rate = info.tokenInfo.price.rate;
                                }
                                balance = info.balance / parseInt(Math.pow(10, info.tokenInfo.decimals));
                                log.debug({ rate: rate, symbol: symbol, balance: balance });
                                balances[symbol] = balance;
                                valueUsds[symbol] = balance * rate;
                                coinInfo[symbol] = info.tokenInfo;
                            }
                        }
                    }
                    return [2 /*return*/, { balances: balances, valueUsds: valueUsds, coinInfo: coinInfo }];
                case 3:
                    e_1 = _a.sent();
                    console.error(tag, e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_balance_token = function (address, token) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, abiInfo, ABI, metaData, contract, balance, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_balance | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    abiInfo = tokenData.ABI[token];
                    if (!abiInfo)
                        return [2 /*return*/, 0
                            //console.log(tag,"abiInfo: ",abiInfo)
                            //
                        ];
                    ABI = abiInfo.ABI;
                    metaData = abiInfo.metaData;
                    contract = new web3.eth.Contract(ABI, metaData.contractAddress);
                    return [4 /*yield*/, contract.methods.balanceOf(address).call()];
                case 2:
                    balance = _a.sent();
                    log.info(tag, "balance: ", balance);
                    return [2 /*return*/, balance / metaData.BASE];
                case 3:
                    e_2 = _a.sent();
                    console.error(tag, e_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_balance = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_balance | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = {};
                    return [4 /*yield*/, web3.eth.getBalance(address)];
                case 2:
                    //normal tx info
                    output = (_a.sent()) / BASE;
                    return [2 /*return*/, output];
                case 3:
                    e_3 = _a.sent();
                    console.error(tag, e_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_transaction = function (txid) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, _a, _b, e_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tag = TAG + " | get_transaction | ";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    output = {};
                    //normal tx info
                    _a = output;
                    return [4 /*yield*/, web3.eth.getTransaction(txid)
                        //if contract
                    ];
                case 2:
                    //normal tx info
                    _a.txInfo = _c.sent();
                    //if contract
                    _b = output;
                    return [4 /*yield*/, web3.eth.getTransactionReceipt(txid)];
                case 3:
                    //if contract
                    _b.receipt = _c.sent();
                    return [2 /*return*/, output];
                case 4:
                    e_4 = _c.sent();
                    console.error(tag, e_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
};
var check_online_status = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, _a, _b, networkName, _c, _d, e_5;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    tag = TAG + " | check_online_status | ";
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 6, , 7]);
                    output = {};
                    //isTestnet
                    _a = output;
                    return [4 /*yield*/, web3.eth.getNodeInfo()];
                case 2:
                    //isTestnet
                    _a.version = _e.sent();
                    _b = output;
                    return [4 /*yield*/, web3.eth.getChainId()];
                case 3:
                    _b.chainId = _e.sent();
                    networkName = void 0;
                    switch (output.chainId.toString()) {
                        case "1":
                            networkName = "Main";
                            break;
                        case "2":
                            networkName = "Morden";
                            break;
                        case "3":
                            networkName = "Ropsten";
                            break;
                        case "4":
                            networkName = "Rinkeby";
                            break;
                        case "42":
                            networkName = "Kovan";
                            break;
                        default:
                            networkName = "Unknown";
                    }
                    output.networkName = networkName;
                    //
                    _c = output;
                    return [4 /*yield*/, web3.eth.getGasPrice()
                        //
                    ];
                case 4:
                    //
                    _c.gasPrice = _e.sent();
                    //
                    _d = output;
                    return [4 /*yield*/, web3.eth.isSyncing()];
                case 5:
                    //
                    _d.syncing = _e.sent();
                    return [2 /*return*/, output];
                case 6:
                    e_5 = _e.sent();
                    console.error(tag, e_5);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
};
