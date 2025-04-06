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
var uuid = require('uuidv4').uuid;
var log = require('@pioneer-platform/loggerdog')();
var _a = require("@pioneer-platform/pioneer-caip"), caipToNetworkId = _a.caipToNetworkId, shortListSymbolToCaip = _a.shortListSymbolToCaip, ChainToNetworkId = _a.ChainToNetworkId;
var network = require("@pioneer-platform/maya-network");
var _b = require('@pioneer-platform/pioneer-coins'), createMemo = _b.createMemo, parseMemo = _b.parseMemo;
var axios = require('axios');
var Web3 = require('web3');
var service = process.env['PARITY_ARCHIVE_NODE'];
if (!service)
    throw Error("Missing PARITY_ARCHIVE_NODE in .env");
var web3 = new Web3(service);
var networkSupport = [
    ChainToNetworkId["BTC"],
    ChainToNetworkId["MAYA"],
    ChainToNetworkId["ETH"],
    // ChainToNetworkId["THOR"],
    ChainToNetworkId["DASH"],
    ChainToNetworkId["ARB"],
];
var assetSupport = [
    shortListSymbolToCaip["BTC"],
    shortListSymbolToCaip["ETH"],
    shortListSymbolToCaip["MAYA"],
    // shortListSymbolToCaip["THOR"],  Eats money, need to handle msgDeposit?
    shortListSymbolToCaip["DASH"],
    shortListSymbolToCaip["ARB"],
];
// Function to make a request to the node
function nodeRequest(path) {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://mayanode.mayachain.info/mayachain".concat(path))];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching from node:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    init: function (settings) {
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    assetSupport: function () {
        return assetSupport;
    },
    getQuote: function (quote) {
        return get_quote(quote);
    },
};
var get_quote = function (quote) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, pools, BaseDecimal, asset, DECIMALS, BASE_UNIT, sellAmountInBaseUnits, quoteFromNode, URL_1, amountOutEstimated, memoInput, memo, type, chain, tx, inbounds, inbound, tokenAddress, depositAbi, routerContract, quoteSellAmountInEther, numberBN, numberHex, data, gasLimit, block, baseFeePerGas, gasPrice, maxPriorityFeePerGas, maxFeePerGas, feeData, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_quote | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
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
                    return [4 /*yield*/, network.getPools()];
                case 2:
                    pools = _a.sent();
                    if (!pools)
                        throw Error("Unable to get pools from network!");
                    // log.info(tag, "pools: ", pools)
                    output.meta = {
                        quoteMode: "MAYA_SUPPORTED_TO_MAYA_SUPPORTED"
                    };
                    output.source = 'mayachain';
                    output.steps = 1;
                    output.complete = true;
                    output.id = uuid();
                    BaseDecimal = {
                        ARB: 18,
                        AVAX: 18,
                        BCH: 8,
                        BNB: 8,
                        BSC: 18,
                        BTC: 8,
                        DASH: 8,
                        DGB: 8,
                        DOGE: 8,
                        ETH: 18,
                        BASE: 18,
                        EOS: 6,
                        GAIA: 6,
                        KUJI: 6,
                        LTC: 8,
                        MATIC: 18,
                        MAYA: 10,
                        OP: 18,
                        OSMO: 6,
                        XRP: 6,
                        THOR: 8,
                        ZEC: 8
                    };
                    asset = quote.sellAsset.split(".")[0];
                    if (!asset)
                        throw Error("unable to pasre asset from quote.sellAsset");
                    DECIMALS = BaseDecimal[asset];
                    if (!DECIMALS)
                        throw Error("unable to get DECIMALS for asset: " + asset);
                    BASE_UNIT = Math.pow(10, DECIMALS);
                    sellAmountInBaseUnits = parseFloat(quote.sellAmount) * BASE_UNIT;
                    quoteFromNode = void 0;
                    URL_1 = "/quote/swap?from_asset=".concat(quote.sellAsset, "&to_asset=").concat(quote.buyAsset, "&amount=").concat(sellAmountInBaseUnits, "&destination=").concat(quote.recipientAddress);
                    log.info("URL: ", URL_1);
                    return [4 /*yield*/, nodeRequest(URL_1)];
                case 3:
                    quoteFromNode = _a.sent();
                    log.info("quoteFromNode: ", quoteFromNode);
                    if (quoteFromNode.error)
                        throw Error(quoteFromNode.error);
                    amountOutEstimated = (parseInt(quoteFromNode.expected_amount_out) / BASE_UNIT).toFixed(DECIMALS);
                    output.amountOut = amountOutEstimated;
                    memoInput = {
                        type: 'SWAP',
                        asset: quote.buyAsset,
                        destAddr: quote.recipientAddress,
                        lim: null,
                        interval: null,
                        quantity: null,
                        affiliate: null,
                        fee: null,
                        dexAggregatorAddr: null,
                        finalAssetAddr: null,
                        minAmountOut: null
                    };
                    memo = createMemo(memoInput);
                    log.info(tag, "memo: ", memo);
                    type = void 0;
                    chain = quote.sellAsset.split(".")[0];
                    if (chain == "MAYA") {
                        type = 'deposit';
                    }
                    else {
                        type = 'transfer';
                    }
                    tx = void 0;
                    if (!(chain === "ETH")) return [3 /*break*/, 8];
                    type = 'EVM';
                    return [4 /*yield*/, nodeRequest('/inbound_addresses')];
                case 4:
                    inbounds = _a.sent();
                    console.log("inbounds: ", inbounds);
                    inbound = inbounds.find(function (i) { return i.chain === 'ETH'; });
                    console.log("inbound: ", inbound);
                    tokenAddress = (quote.sellAsset.split('-')[1] || '').toLowerCase();
                    log.info("tokenAddress: ", tokenAddress);
                    depositAbi = [
                        {
                            "constant": false,
                            "inputs": [
                                { "name": "tokenAddress", "type": "address" },
                                { "name": "to", "type": "address" },
                                { "name": "amount", "type": "uint256" },
                                { "name": "data", "type": "string" }
                            ],
                            "name": "deposit",
                            "outputs": [],
                            "payable": false,
                            "stateMutability": "nonpayable",
                            "type": "function"
                        }
                    ];
                    routerContract = new web3.eth.Contract(depositAbi, inbound.router);
                    log.info("routerContract: ", routerContract);
                    quoteSellAmountInEther = web3.utils.toWei(quote.sellAmount, 'ether');
                    numberBN = web3.utils.toBN(quoteSellAmountInEther);
                    numberHex = '0x' + numberBN.toString(16);
                    console.log("numberHex: ", numberHex);
                    data = routerContract.methods
                        .deposit(inbound.address, '0x0000000000000000000000000000000000000000', // 0 = ETH
                    numberHex, memo)
                        .encodeABI();
                    return [4 /*yield*/, web3.eth.estimateGas({
                            from: quote.senderAddress,
                            to: inbound.router,
                            value: 0,
                            data: data,
                        })];
                case 5:
                    gasLimit = _a.sent();
                    gasLimit = gasLimit + gasLimit * 0.2;
                    gasLimit = parseInt(gasLimit);
                    log.info(tag, 'gasLimit: ', gasLimit);
                    return [4 /*yield*/, web3.eth.getBlock("latest")];
                case 6:
                    block = _a.sent();
                    baseFeePerGas = block.baseFeePerGas;
                    return [4 /*yield*/, web3.eth.getGasPrice()];
                case 7:
                    gasPrice = _a.sent();
                    maxPriorityFeePerGas = baseFeePerGas ? web3.utils.toBN(baseFeePerGas).div(web3.utils.toBN(2)).toString() : '0';
                    maxFeePerGas = baseFeePerGas ? web3.utils.toBN(baseFeePerGas).mul(web3.utils.toBN(2)).toString() : gasPrice;
                    feeData = {
                        gasPrice: gasPrice, // Legacy networks
                        baseFeePerGas: baseFeePerGas, // EIP-1559 networks
                        maxPriorityFeePerGas: maxPriorityFeePerGas, // EIP-1559 calculation
                        maxFeePerGas: maxFeePerGas // EIP-1559 calculation
                    };
                    console.log("feeData: ", feeData);
                    // Calculate a 20% buffer and add it to the gasLimit
                    // const buffer = gasLimit.mul(20).div(100); // 20% buffer
                    // gasLimit = gasLimit.add(buffer);
                    // //if gas limit is < 21000 then set to 21000
                    // if (gasLimit.lt(ethers.BigNumber.from('36000'))) {
                    //     gasLimit = ethers.BigNumber.from('36000');
                    // }
                    // const nonce = await web3.eth.getTransactionCount(quote.senderAddress, 'latest'); // 'latest' can be replaced with the desired block number
                    // console.log("nonce: ",nonce)
                    tx = {
                        type: type,
                        chain: ChainToNetworkId[quote.sellAsset.split(".")[0]],
                        txParams: {
                            to: inbound.router,
                            from: quote.senderAddress,
                            data: data,
                            value: numberHex,
                            "gasLimit": Web3.utils.toHex(gasLimit),
                            "maxPriorityFeePerGas": maxPriorityFeePerGas,
                            "maxFeePerGas": maxFeePerGas,
                            "nonce": null
                        }
                    };
                    return [3 /*break*/, 9];
                case 8:
                    tx = {
                        type: type,
                        chain: ChainToNetworkId[quote.sellAsset.split(".")[0]],
                        txParams: {
                            senderAddress: quote.senderAddress,
                            recipientAddress: quoteFromNode.inbound_address,
                            amount: quote.sellAmount,
                            token: quote.sellAsset.split(".")[1],
                            memo: quoteFromNode.memo || memo
                        }
                    };
                    _a.label = 9;
                case 9:
                    output.txs = [
                        tx
                    ];
                    return [2 /*return*/, output];
                case 10:
                    e_1 = _a.sent();
                    console.error(tag, "e: ", e_1);
                    throw e_1;
                case 11: return [2 /*return*/];
            }
        });
    });
};
