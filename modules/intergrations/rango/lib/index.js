"use strict";
/*
    Rango Integration
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
var TAG = " | rango | ";
var getRangoBlockchainName = require('@pioneer-platform/pioneer-coins').getRangoBlockchainName;
var log = require('@pioneer-platform/loggerdog')();
var _a = require("@pioneer-platform/pioneer-caip"), shortListSymbolToCaip = _a.shortListSymbolToCaip, caipToNetworkId = _a.caipToNetworkId;
// Mock rango client
var mockRangoClient = {
    getAllMetadata: function () { return Promise.resolve({}); },
    getBestRoute: function () { return Promise.resolve({ requestId: 'mock-id', result: { outputAmount: "1.23" } }); },
    createTransaction: function () { return Promise.resolve({ transaction: { to: '0x123...', from: '0x456...' } }); },
    checkStatus: function () { return Promise.resolve({ status: 'SUCCESS' }); }
};
var rango = mockRangoClient;
var networkSupport = [
    caipToNetworkId(shortListSymbolToCaip["BASE"]),
    caipToNetworkId(shortListSymbolToCaip["ARB"]),
    caipToNetworkId(shortListSymbolToCaip["DOGE"]),
    caipToNetworkId(shortListSymbolToCaip["BTC"]),
    caipToNetworkId(shortListSymbolToCaip["ETH"]),
    caipToNetworkId(shortListSymbolToCaip["BCH"]),
    caipToNetworkId(shortListSymbolToCaip["GNO"]),
    caipToNetworkId(shortListSymbolToCaip["MATIC"]),
    caipToNetworkId(shortListSymbolToCaip["AVAX"]),
];
var assetSupport = [
    shortListSymbolToCaip["SOLANA"],
    shortListSymbolToCaip["BTC"],
    shortListSymbolToCaip["ETH"],
    shortListSymbolToCaip["BASE"],
    shortListSymbolToCaip["GNO"],
    shortListSymbolToCaip["MATIC"],
    shortListSymbolToCaip["AVAX"],
    shortListSymbolToCaip["DOGE"],
    shortListSymbolToCaip["BCH"],
];
module.exports = {
    init: function (settings) {
        // Just return true, no need to initialize real client
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    assetSupport: function () {
        return assetSupport;
    },
    getChains: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, { chains: [] }]; // Mock response
            });
        });
    },
    getQuote: function (quote) {
        return get_quote(quote);
    },
    createTransaction: function (id, step, validateBalance, validateFee) {
        return create_transaction(id, step, validateBalance, validateFee);
    },
    getTransactionStatus: function (requestId, step, txid) {
        return get_transaction_status(requestId, step, txid);
    }
};
var get_transaction_status = function (requestId, step, txid) {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | get_transaction_status | ";
            try {
                // Return mock status
                return [2 /*return*/, { status: 'SUCCESS', txId: txid, requestId: requestId, step: step }];
            }
            catch (e) {
                console.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
var create_transaction = function (id, step, validateBalance, validateFee) {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | create_transaction | ";
            try {
                // Return mock transaction
                return [2 /*return*/, {
                        transaction: {
                            to: '0x1234567890123456789012345678901234567890',
                            from: '0x0987654321098765432109876543210987654321',
                            data: '0x',
                            value: '0x0',
                            gasLimit: '0x1',
                            gasPrice: '0x1',
                            maxPriorityFeePerGas: '0x1',
                            maxFeePerGas: '0x1',
                            nonce: 0
                        }
                    }];
            }
            catch (e) {
                console.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
var get_quote = function (quote) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, mockRequestId;
        var _a;
        return __generator(this, function (_b) {
            tag = TAG + " | get_quote | ";
            try {
                output = {};
                mockRequestId = 'mock-' + Math.random().toString(36).substring(2, 15);
                output.meta = {
                    quoteMode: "RANGO"
                };
                output.id = mockRequestId;
                output.source = 'rango';
                output.complete = true;
                output.amountOut = "1.23"; // Mock amount
                output.inboundAddress = '0x1234567890123456789012345678901234567890';
                // Create mock transaction
                output.txs = [{
                        type: "evm",
                        chain: caipToNetworkId(((_a = quote.from) === null || _a === void 0 ? void 0 : _a.blockchain) ? shortListSymbolToCaip[quote.from.blockchain] : shortListSymbolToCaip["ETH"]),
                        txParams: {
                            to: '0x1234567890123456789012345678901234567890',
                            from: '0x0987654321098765432109876543210987654321',
                            data: '0x',
                            value: '0x0',
                            gasLimit: '0x1',
                            gasPrice: '0x1',
                            maxPriorityFeePerGas: '0x1',
                            maxFeePerGas: '0x1',
                            nonce: 0
                        }
                    }];
                return [2 /*return*/, output];
            }
            catch (e) {
                console.error(tag, "e: ", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
