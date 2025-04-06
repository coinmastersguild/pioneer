"use strict";
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
exports.fetchLockedAssets = exports.fetchTransaction = void 0;
exports.getTransactionEndpoint = getTransactionEndpoint;
exports.getSignatureEndpoint = getSignatureEndpoint;
var Transaction_1 = require("./Transaction");
var environment_1 = require("./environment");
var fetchTransaction = function (args, type) { return __awaiter(void 0, void 0, void 0, function () {
    var simulationURL, response, data, result_1, result_2, result, e_1, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                simulationURL = type === Transaction_1.TransactionType.Transaction ?
                    getTransactionEndpoint(args.chainId) : getSignatureEndpoint(args.chainId);
                return [4 /*yield*/, fetch(simulationURL, {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(args),
                    })];
            case 1:
                response = _a.sent();
                console.log("response", response);
                if (!(response.status === 200)) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
            case 3:
                if (response.status === 403) {
                    result_1 = {
                        error: {
                            type: Transaction_1.ErrorType.Unauthorized,
                            message: 'Unauthorized',
                            extraData: null,
                        },
                    };
                    return [2 /*return*/, result_1];
                }
                else if (response.status === 429) {
                    result_2 = {
                        error: {
                            type: Transaction_1.ErrorType.TooManyRequests,
                            message: 'Rate limit hit',
                            extraData: null,
                        },
                    };
                    return [2 /*return*/, result_2];
                }
                _a.label = 4;
            case 4:
                result = {
                    error: {
                        type: Transaction_1.ErrorType.GeneralError,
                        message: 'Unrecognized status code returned',
                        extraData: null,
                    },
                };
                return [2 /*return*/, result];
            case 5:
                e_1 = _a.sent();
                result = {
                    error: {
                        type: Transaction_1.ErrorType.UnknownError,
                        message: 'an unknown error has occurred',
                        extraData: null,
                    },
                };
                return [2 /*return*/, result];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.fetchTransaction = fetchTransaction;
var fetchLockedAssets = function (address) { return __awaiter(void 0, void 0, void 0, function () {
    var response, data, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, fetch("".concat(environment_1.SERVER_URL_PROD, "/soft-lock/locked-assets?address=").concat(address), {
                        method: 'GET',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                    })];
            case 1:
                response = _a.sent();
                if (!(response.status === 200)) return [3 /*break*/, 3];
                return [4 /*yield*/, response.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
            case 3: return [2 /*return*/, null];
            case 4:
                e_2 = _a.sent();
                console.error('error fetching soft locked assets', e_2);
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.fetchLockedAssets = fetchLockedAssets;
function getTransactionEndpoint(chainId) {
    switch (chainId.toLowerCase()) {
        case '0x1':
        case '1':
            return "".concat(environment_1.SERVER_URL_PROD, "/eth/mainnet/transaction");
        case '0xa4b1':
        case '42161':
            return "".concat(environment_1.SERVER_URL_PROD, "/arb/mainnet/transaction");
        case '0x89':
        case '137':
            return "".concat(environment_1.SERVER_URL_PROD, "/polygon/mainnet/transaction");
        case '0xa':
        case '10':
            return "".concat(environment_1.SERVER_URL_PROD, "/optimism/mainnet/transaction");
        case '8453':
        case '0x2105':
            return "".concat(environment_1.SERVER_URL_PROD, "/base/mainnet/transaction");
        case '56':
        case '0x38':
            return "".concat(environment_1.SERVER_URL_PROD, "/bsc/mainnet/transaction");
        case '59144':
        case '0xe708':
            return "".concat(environment_1.SERVER_URL_PROD, "/linea/mainnet/transaction");
        default:
            return "".concat(environment_1.SERVER_URL_PROD, "/eth/mainnet/transaction");
    }
}
function getSignatureEndpoint(chainId) {
    switch (chainId.toLowerCase()) {
        case '0x1':
        case '1':
            return "".concat(environment_1.SERVER_URL_PROD_V1, "/eth/mainnet/signature");
        case '0xa4b1':
        case '42161':
            return "".concat(environment_1.SERVER_URL_PROD_V1, "/arb/mainnet/signature");
        case '0x89':
        case '137':
            return "".concat(environment_1.SERVER_URL_PROD_V1, "/polygon/mainnet/signature");
        case '0xa':
        case '10':
            return "".concat(environment_1.SERVER_URL_PROD_V1, "/optimism/mainnet/signature");
        case '8453':
        case '0x2105':
            return "".concat(environment_1.SERVER_URL_PROD_V1, "/base/mainnet/signature");
        default:
            return "".concat(environment_1.SERVER_URL_PROD_V1, "/eth/mainnet/signature");
    }
}
