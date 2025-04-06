"use strict";
/*
        0x Swap Integration
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
var TAG = " | 0x | ";
var uuid = require('uuidv4').uuid;
var log = require('@pioneer-platform/loggerdog')();
var _a = require("@pioneer-platform/pioneer-caip"), caipToNetworkId = _a.caipToNetworkId, shortListSymbolToCaip = _a.shortListSymbolToCaip, ChainToNetworkId = _a.ChainToNetworkId;
var network = require("@pioneer-platform/maya-network");
var axios = require('axios');
var API_KEY = process.env['0X_API_SECRET'];
if (!API_KEY)
    throw Error("Missing 0X_API_SECRET");
var networkSupport = [
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"]
];
var EIP155_MAINNET_CHAINS = {
    'eip155:1': {
        chainId: 1,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        name: 'Ethereum',
        rgb: '99, 125, 234',
        rpc: 'https://eth.llamarpc.com',
        defaultGasLimit: 250000,
        namespace: 'eip155'
    },
    // 'eip155:43114': {
    //     chainId: 43114,
    //     name: 'Avalanche C-Chain',
    //     logo: '/chain-logos/eip155-43113.png',
    //     rgb: '232, 65, 66',
    //     rpc: 'https://api.avax.network/ext/bc/C/rpc',
    //     namespace: 'eip155'
    // },
    // 'eip155:137': {
    //     chainId: 137,
    //     name: 'Polygon',
    //     logo: '/chain-logos/eip155-137.png',
    //     rgb: '130, 71, 229',
    //     rpc: 'https://polygon-rpc.com/',
    //     namespace: 'eip155'
    // },
    // 'eip155:10': {
    //     chainId: 10,
    //     name: 'Optimism',
    //     logo: '/chain-logos/eip155-10.png',
    //     rgb: '235, 0, 25',
    //     rpc: 'https://mainnet.optimism.io',
    //     namespace: 'eip155'
    // },
    // 'eip155:324': {
    //     chainId: 324,
    //     name: 'zkSync Era',
    //     logo: '/chain-logos/eip155-324.svg',
    //     rgb: '242, 242, 242',
    //     rpc: 'https://mainnet.era.zksync.io/',
    //     namespace: 'eip155'
    // },
    'eip155:8453': {
        chainId: 8453,
        WETH: '0x4200000000000000000000000000000000000006',
        name: 'Base',
        rgb: '242, 242, 242',
        rpc: 'https://mainnet.base.org',
        defaultGasLimit: 135120,
        namespace: 'eip155'
    }
};
var networkApis = {
    "eip155:1": "https://api.0x.org/",
    "eip155:11155111": "https://sepolia.api.0x.org/",
    "eip155:137": "https://polygon.api.0x.org/",
    "eip155:56": "https://bsc.api.0x.org/",
    "eip155:10": "https://optimism.api.0x.org/",
    "eip155:250": "https://fantom.api.0x.org/",
    "eip155:42220": "https://celo.api.0x.org/",
    "eip155:43114": "https://avalanche.api.0x.org/",
    "eip155:42161": "https://arbitrum.api.0x.org/",
    "eip155:8453": "https://base.api.0x.org/"
};
module.exports = {
    init: function (settings) {
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    getQuote: function (quote) {
        return get_quote(quote);
    },
};
var get_quote = function (quote) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, inputChain, outputChain, buyToken, sellToken, sellAmount, apiUrl, url, headers, response, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_quote | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
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
                    inputChain = caipToNetworkId(quote.sellAsset);
                    outputChain = caipToNetworkId(quote.buyAsset);
                    if (inputChain != outputChain)
                        throw new Error("Cross Chain not supported");
                    buyToken = quote.buyAsset.split(':')[2];
                    log.info(tag, "buyToken: ", buyToken);
                    if (buyToken === "60") { // Assuming the '60' refers to ETH
                        buyToken = EIP155_MAINNET_CHAINS[outputChain].WETH; // Use WETH address if available, else fallback to the original token
                    }
                    sellToken = quote.sellAsset.split(':')[2];
                    log.info(tag, "sellToken: ", sellToken);
                    if (sellToken === "slip44:60") { // Assuming the '60' refers to ETH
                        sellToken = EIP155_MAINNET_CHAINS[inputChain].WETH; // Use WETH address if available, else fallback to the original token
                    }
                    sellAmount = quote.sellAmount;
                    output.meta = {
                        quoteMode: "ERC20-ERC20"
                    };
                    output.steps = 1;
                    output.complete = true;
                    output.id = uuid();
                    log.info(tag, "sellToken: ", sellToken);
                    log.info(tag, "buyToken: ", buyToken);
                    log.info(tag, "sellAmount: ", sellAmount);
                    apiUrl = networkApis[inputChain];
                    if (!apiUrl)
                        throw new Error("Network not supported");
                    if (!sellToken || !buyToken || !sellAmount)
                        throw new Error("missing required params");
                    url = "".concat(apiUrl, "swap/v1/quote?sellToken=").concat(sellToken.toLowerCase(), "&buyToken=").concat(buyToken.toLowerCase(), "&sellAmount=").concat(sellAmount);
                    headers = {
                        '0x-api-key': API_KEY
                    };
                    return [4 /*yield*/, axios.get(url, { headers: headers })];
                case 2:
                    response = _a.sent();
                    log.info(tag, "response: ", response.data);
                    output.txs = [
                    // tx
                    ];
                    return [2 /*return*/, output];
                case 3:
                    e_1 = _a.sent();
                    console.error(tag, "e: ", e_1);
                    console.error(tag, "e: ", JSON.stringify(e_1));
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
};
