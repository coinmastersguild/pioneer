"use strict";
/*
        Uniswap Integration
                - Highlander

    BASE
    https://docs.base.org/contracts/

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
var TAG = " | Uniswap | ";
var axios = require('axios');
var _a = require("@pioneer-platform/pioneer-caip"), caipToNetworkId = _a.caipToNetworkId, shortListSymbolToCaip = _a.shortListSymbolToCaip, ChainToNetworkId = _a.ChainToNetworkId;
// Remove Uniswap and other complex dependencies
var uuid = require('uuidv4').uuid;
var log = require('@pioneer-platform/loggerdog')();
var ethers = require('ethers').ethers;
var networkSupport = [
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"],
];
var EIP155_MAINNET_CHAINS = {
    'eip155:1': {
        chainId: 1,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        name: 'Ethereum',
        logo: '/chain-logos/eip155-1.png',
        rgb: '99, 125, 234',
        universalRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        rpc: 'https://ethereum-rpc.publicnode.com',
        defaultGasLimit: 250000,
        namespace: 'eip155'
    },
    'eip155:8453': {
        chainId: 8453,
        WETH: '0x4200000000000000000000000000000000000006',
        name: 'Base',
        logo: '/chain-logos/base.png',
        rgb: '242, 242, 242',
        universalRouter: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        rpc: 'https://mainnet.base.org',
        defaultGasLimit: 135120,
        namespace: 'eip155'
    }
};
var ERC20_ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
];
module.exports = {
    init: function (settings) {
        return true;
    },
    getRateEthPro: function () {
        return get_rate_eth();
    },
    getRateEth: function () {
        return get_rate_usdc();
    },
    getRateProUsd: function () {
        return get_rate_pro();
    }
};
// Simplified versions of these functions that just return mock data
var get_rate_pro = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | get_rate_pro | ";
            try {
                // Return a mock value instead of doing calculations with dependencies
                return [2 /*return*/, "0.15"]; // Mock value
            }
            catch (e) {
                console.error(tag, "e: ", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
var get_rate_usdc = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | get_rate_usdc | ";
            try {
                // Return a mock value
                return [2 /*return*/, "1800.00"]; // Mock ETH/USDC price
            }
            catch (e) {
                console.error(tag, "e: ", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
var get_rate_eth = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | get_rate_eth | ";
            try {
                // Return a mock value
                return [2 /*return*/, "0.0005"]; // Mock PRO/ETH price
            }
            catch (e) {
                console.error(tag, "e: ", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
