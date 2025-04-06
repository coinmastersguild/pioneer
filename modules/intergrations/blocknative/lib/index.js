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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var TAG = " | blocknative | ";
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
var micro_ftch_1 = __importDefault(require("micro-ftch"));
var URL_BLOCKNATIVE = "https://api.blocknative.com";
var BLOCKNATIVE_API_KEY = process.env['BLOCKNATIVE_API_KEY'];
var BLOCKNATIVE_API_SECRET = process.env['BLOCKNATIVE_API_SECRET'];
module.exports = {
    init: function (settings) {
        if (settings === null || settings === void 0 ? void 0 : settings.apiKey) {
            BLOCKNATIVE_API_KEY = settings.apiKey;
        }
        if (!BLOCKNATIVE_API_KEY)
            throw Error("api key required! set env BLOCKNATIVE_API_KEY");
    },
    submitAddress: function (coin, address) {
        return submit_address(coin, address);
    },
    pushExample: function (url, coin, address, type) {
        return push_sample_tx(url, coin, address, type);
    },
    simulateTx: function (network, transaction) {
        return simulate_tx(network, transaction);
    }
};
var simulate_tx = function (network, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, apiURL, fetchOptions, response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | simulate_tx | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    apiURL = "https://api.blocknative.com/simulate";
                    fetchOptions = {
                        method: 'POST',
                        type: 'json',
                        full: true,
                        expectStatusCode: false,
                        headers: {
                            'Content-Type': 'application/json',
                            'credentials': BLOCKNATIVE_API_KEY + ":" + BLOCKNATIVE_API_SECRET
                        },
                        data: {
                            system: "ethereum",
                            network: "main",
                            transaction: {
                                to: transaction.to,
                                from: transaction.from,
                                gas: Number(600000),
                                gasPrice: 0,
                                input: transaction.input,
                                value: 0
                            }
                        }
                    };
                    console.time('Simulate-shutdown');
                    return [4 /*yield*/, (0, micro_ftch_1.default)(apiURL, fetchOptions)];
                case 2:
                    response = _a.sent();
                    if (response.status !== 200) {
                        console.log("Simulation error code: ".concat(response.status, " - ").concat(JSON.stringify(response.body)));
                        process.exit(1);
                    }
                    console.timeEnd('Simulate-shutdown');
                    return [2 /*return*/, response.body];
                case 3:
                    e_1 = _a.sent();
                    // console.error(tag, "e: ", e.response)
                    console.log("Error response data parsed: ".concat(JSON.stringify(e_1.response.data.msg)));
                    // console.error(tag, "e: ", e.toJSON())
                    return [2 /*return*/, e_1.response.data];
                case 4: return [2 /*return*/];
            }
        });
    });
};
// const simulate_tx = async function (network:string,transaction:any) {
//     let tag = TAG + " | simulate_tx | "
//     try {
//         const apiURL = `https://api.blocknative.com/simulate`
//         const body = {
//             "system":"ethereum",
//             "network":"main",
//             "transactions":[transaction]
//         }
//
//         const headers = {
//             headers: {
//                 'credentials': BLOCKNATIVE_API_KEY+":"+BLOCKNATIVE_API_SECRET,
//                 'Content-Type': 'application/json'
//             }
//         }
//         const resp = await axios.post(apiURL, JSON.stringify(body), headers);
//
//         return resp.data
//     } catch (e) {
//         // console.error(tag, "e: ", e.response)
//         console.log(`Error response data parsed: ${JSON.stringify(e.response.data.msg)}`);
//         // console.error(tag, "e: ", e.toJSON())
//         return e.response.data
//     }
// }
var push_sample_tx = function (url, coin, address, type) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output;
        return __generator(this, function (_a) {
            tag = TAG + " | push_sample_tx | ";
            try {
                output = {};
                //
                if (!type || type === 'transfer') {
                    //TODO send?
                    //receive
                    output = {
                        test: true,
                        status: 'pending',
                        system: 'ethereum',
                        network: 'main',
                        monitorId: 'GETH_1_D_PROD',
                        monitorVersion: '0.79.12',
                        serverVersion: '0.93.3',
                        timeStamp: '2021-02-28T03:45:07.841Z',
                        pendingTimeStamp: '2021-02-28T03:45:07.844Z',
                        pendingBlockNumber: 11943498,
                        hash: '0x60348d3718d3da2a43cdf3c9aa898559176eca38cdd6853d18a6ba43e84a448c',
                        from: '0xC3aFFff54122658b89C31183CeC4F15514F34624',
                        to: address,
                        value: '719864665442897',
                        gas: 21000,
                        gasPrice: '99000000000',
                        nonce: 28,
                        blockHash: null,
                        blockNumber: null,
                        input: '0x',
                        asset: 'ETH',
                        watchedAddress: address,
                        direction: 'incoming',
                        counterparty: '0xC3aFFff54122658b89C31183CeC4F15514F34624',
                        apiKey: 'apikeyNERF'
                    };
                }
                else if (type === 'erc20') {
                    //TODO send?
                    //receive
                    output = {
                        test: true,
                        status: 'pending',
                        system: 'ethereum',
                        network: 'main',
                        monitorId: 'GETH_1_D_PROD',
                        monitorVersion: '0.79.12',
                        serverVersion: '0.93.3',
                        timeStamp: '2021-02-28T03:45:45.422Z',
                        pendingTimeStamp: '2021-02-28T03:45:45.554Z',
                        pendingBlockNumber: 11943500,
                        hash: '0x4f7259e33f3b0c6b95421d6e4cad4e8d155d8757551ae42b47db9e390d6c117e',
                        from: '0xC3aFFff54122658b89C31183CeC4F15514F34624',
                        to: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                        value: '0',
                        gas: 55509,
                        gasPrice: '104000000000',
                        nonce: 29,
                        blockHash: null,
                        blockNumber: null,
                        input: '0xa9059cbb00000000000000000000000033b35c665496ba8e71b22373843376740401f1060000000000000000000000000000000000000000000000000f43fc2c04ee0000',
                        contractCall: { contractType: 'erc20',
                            contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                            methodName: 'transfer',
                            params: { _to: address,
                                _value: '1100000000000000000' },
                            contractDecimals: 18,
                            contractName: 'Dai Stablecoin',
                            decimalValue: '1.1' },
                        asset: 'DAI',
                        watchedAddress: address,
                        direction: 'incoming',
                        counterparty: '0xC3aFFff54122658b89C31183CeC4F15514F34624',
                        apiKey: 'apiKeyNerf'
                    };
                }
                //TODO NFT's
                return [2 /*return*/, output];
            }
            catch (e) {
                console.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
var submit_address = function (coin, address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, blockchain, data, body, resp, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | submit_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    blockchain = void 0;
                    if (coin === 'ETH') {
                        blockchain = 'ethereum';
                    }
                    else {
                        throw Error("Other assets not supported! " + coin);
                    }
                    data = {
                        apiKey: BLOCKNATIVE_API_KEY,
                        address: address,
                        blockchain: blockchain,
                        networks: ["main"],
                    };
                    body = {
                        url: URL_BLOCKNATIVE + "/address",
                        method: 'POST',
                        data: data,
                    };
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_2 = _a.sent();
                    console.error(tag, "e: ", e_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
