"use strict";
/*
    This is v1, need to migrate to v2
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
var Changelly = require('@bithighlander/changelly');
var TAG = " | Changelly | ";
var CHANGELLY_API_KEY = process.env['CHANGELLY_API_KEY'];
var CHANGELLY_API_SECRET = process.env['CHANGELLY_API_SECRET'];
if (!CHANGELLY_API_KEY)
    throw new Error('CHANGELLY_API_KEY not set');
if (!CHANGELLY_API_SECRET)
    throw new Error('CHANGELLY_API_SECRET not set');
var changelly;
var _a = require("@pioneer-platform/pioneer-caip"), ChainToNetworkId = _a.ChainToNetworkId, caipToNetworkId = _a.caipToNetworkId, shortListSymbolToCaip = _a.shortListSymbolToCaip;
var networkSupport = [
    ChainToNetworkId["XRP"],
    ChainToNetworkId["DASH"],
    ChainToNetworkId["ZEC"],
    // shortListSymbolToCaip["BSV"], //TODO
    // shortListSymbolToCaip["ADA"], //TODO
    // shortListSymbolToCaip["EOS"], //TODO
    ChainToNetworkId["GAIA"],
    ChainToNetworkId["BNB"],
    ChainToNetworkId["DOGE"],
    ChainToNetworkId["BTC"],
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"],
    ChainToNetworkId["LTC"],
    ChainToNetworkId["THOR"],
    ChainToNetworkId["BCH"],
    ChainToNetworkId["GNO"],
    ChainToNetworkId["MATIC"],
    ChainToNetworkId["AVAX"],
];
var assetSupport = [
    shortListSymbolToCaip["BTC"],
    shortListSymbolToCaip["ETH"],
    shortListSymbolToCaip["XRP"],
    shortListSymbolToCaip["DASH"],
    shortListSymbolToCaip["ZEC"],
    shortListSymbolToCaip["DOGE"],
    shortListSymbolToCaip["BASE"],
    shortListSymbolToCaip["LTC"],
    shortListSymbolToCaip["BCH"],
    shortListSymbolToCaip["MATIC"],
    shortListSymbolToCaip["AVAX"],
    shortListSymbolToCaip["BSV"], //TODO
    shortListSymbolToCaip["ADA"], //TODO
    shortListSymbolToCaip["EOS"], //TODO
];
module.exports = {
    init: function (settings) {
        changelly = new Changelly(CHANGELLY_API_KEY, CHANGELLY_API_SECRET);
    },
    networkSupport: function () {
        return networkSupport;
    },
    assetSupport: function () {
        return assetSupport;
    },
    getCurrenciesAsync: function () {
        return get_currencies();
    },
    getQuote: function (from, to, address, amount, extraId) {
        return create_transaction(from, to, address, amount, extraId);
    },
    // createTransactionAsync: function(from: string, to: string, address: string, amount: number, extraId?: string): Promise<any> {
    //     return create_transaction(from, to, address, amount, extraId);
    // },
    getMinAmountAsync: function (from, to) {
        return get_min_amount(from, to);
    },
    getExchangeAmountAsync: function (from, to, amount) {
        return get_exchange_amount(from, to, amount);
    },
    getTransactionAsync: function (id) {
        return get_transaction(id);
    },
    getTransactionsAsync: function (limit, offset, currency, address, extraId) {
        return get_transactions(limit, offset, currency, address, extraId);
    },
    getStatusAsync: function (id) {
        return get_status(id);
    }
};
function get_currencies() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        changelly.getCurrencies(function (err, data) {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })];
            }
            catch (e) {
                console.error(TAG, "get_currencies error:", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
}
function create_transaction(from, to, address, amount, extraId) {
    return __awaiter(this, void 0, void 0, function () {
        var output, data, tx, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    output = {};
                    output.steps = 1;
                    output.complete = true;
                    output.source = 'changelly';
                    output.meta = {
                        quoteMode: "CHANGELLY"
                    };
                    output.complete = true;
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            changelly.createTransaction(from, to, address, amount, extraId, function (err, data) {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(data);
                                }
                            });
                        })];
                case 1:
                    data = _a.sent();
                    console.log("data:", data);
                    data = data.result;
                    output.id = data.id;
                    output.amountOut = data.amountExpectedTo;
                    output.inboundAddress = data.payinAddress;
                    if (!data)
                        throw Error("Failed to create quote@changelly");
                    if (!data.payinAddress)
                        throw Error("Failed to create quote@changelly");
                    if (!data.id)
                        throw Error("Failed to create quote@changelly");
                    output.id = data.id;
                    tx = {
                        type: "transfer",
                        chain: caipToNetworkId(shortListSymbolToCaip[from]),
                        txParams: {
                            address: data.payinAddress,
                            amount: amount,
                            memo: data.payinExtraId,
                        }
                    };
                    output.txs = [tx];
                    output.raw = data;
                    return [2 /*return*/, output];
                case 2:
                    e_1 = _a.sent();
                    console.error(TAG, "create_transaction error:", e_1);
                    throw e_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function get_min_amount(from, to) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        changelly.getMinAmount(from, to, function (err, data) {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })];
            }
            catch (e) {
                console.error(TAG, "get_min_amount error:", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
}
function get_exchange_amount(from, to, amount) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        changelly.getExchangeAmount(from, to, amount, function (err, data) {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })];
            }
            catch (e) {
                console.error(TAG, "get_exchange_amount error:", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
}
function get_transaction(orderId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        changelly.getTransaction(orderId, function (err, data) {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })];
            }
            catch (e) {
                console.error(TAG, "get_transactions error:", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
}
function get_transactions(limit, offset, currency, address, extraId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        changelly.getTransactions(limit, offset, currency, address, extraId, function (err, data) {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })];
            }
            catch (e) {
                console.error(TAG, "get_transactions error:", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
}
function get_status(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        changelly.getStatus(id, function (err, data) {
                            if (err)
                                reject(err);
                            else
                                resolve(data);
                        });
                    })];
            }
            catch (e) {
                console.error(TAG, "get_status error:", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
}
