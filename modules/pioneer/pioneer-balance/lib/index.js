"use strict";
/*

    Pioneer Balance Chart Module

    Query the balance on any network

    pioneer-network map

    utxo,
    ethereum,
    // eos,
    ripple,
    cosmos,
    binance,
    thorchain,
    osmosis,
    midgard,
    mayachain

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
exports.Balance = exports.SUPPORTED_CAIPS = exports.OTHER_SUPPORT = exports.CAIP_TO_COIN_MAP = exports.TENDERMINT_SUPPORT = exports.UTXO_SUPPORT = void 0;
var TAG = " | pioneer balance | ";
var caipToNetworkId = require('@pioneer-platform/pioneer-caip').caipToNetworkId;
var Network = require("@pioneer-platform/pioneer-network");
exports.UTXO_SUPPORT = [
    'bip122:000000000019d6689c085ae165831e93/slip44:0', // BTC
    'bip122:000000000000000000651ef99cb9fcbe/slip44:145', // BCH
    'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5', // DASH
    'bip122:00000000001a91e3dace36e2be3bf030/slip44:3', // DOGE
    'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2', // LTC
];
exports.TENDERMINT_SUPPORT = [
    'cosmos:mayachain-mainnet-v1/slip44:931',
    'cosmos:osmosis-1/slip44:118',
    'cosmos:cosmoshub-4/slip44:118',
    'cosmos:kaiyo-1/slip44:118',
    'cosmos:thorchain-mainnet-v1/slip44:931', // supportedCaips.ts
];
// Mapping of CAIP identifiers to KeepKey coin names for UTXO chains
exports.CAIP_TO_COIN_MAP = {
    'bip122:000000000019d6689c085ae165831e93/slip44:0': 'Bitcoin',
    'bip122:000000000000000000651ef99cb9fcbe/slip44:145': 'BitcoinCash',
    'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5': 'Dash',
    'bip122:00000000001a91e3dace36e2be3bf030/slip44:3': 'Dogecoin',
    'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2': 'Litecoin',
};
exports.OTHER_SUPPORT = ['ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144'];
exports.SUPPORTED_CAIPS = {
    UTXO: exports.UTXO_SUPPORT,
    TENDERMINT: exports.TENDERMINT_SUPPORT,
    EIP155: ['eip155:*'],
    OTHER: exports.OTHER_SUPPORT,
};
var Balance = /** @class */ (function () {
    function Balance(config) {
        this.blockchains = config.wss || [];
        this.nodes = config.nodes || [];
        this.charts = [];
        this.init = this.init.bind(this);
        this.getBalance = this.getBalance.bind(this);
    }
    Balance.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tag, evmNodes, i, node, nodesInEth, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tag = TAG + " | init_network | ";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        this.networks = new Network.Network({});
                        return [4 /*yield*/, this.networks.init()];
                    case 2:
                        _a.sent();
                        evmNodes = this.nodes.filter(function (node) { return node.networkId.indexOf('eip155') >= 0; });
                        console.log(tag, "evmNodes: ", evmNodes.length);
                        console.log('this.networks: ', this.networks);
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < evmNodes.length)) return [3 /*break*/, 6];
                        node = evmNodes[i];
                        console.log(tag, "node: ", node);
                        return [4 /*yield*/, this.networks.networks.ethereum.addNode(node)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, this.networks.networks.ethereum.getNodes()];
                    case 7:
                        nodesInEth = _a.sent();
                        console.log(tag, "nodesInEth: ", nodesInEth.length);
                        return [2 /*return*/, true];
                    case 8:
                        e_1 = _a.sent();
                        console.error(tag, e_1);
                        throw e_1;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    Balance.prototype.getNodes = function (networkId) {
        return __awaiter(this, void 0, void 0, function () {
            var tag, nodes, nodesEth, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tag = TAG + " | getNodes | ";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        console.log(tag, "networkId: ", networkId);
                        console.log(tag, 'total nodes: ', this.nodes.length);
                        nodes = this.nodes.filter(function (node) { return node.networkId === networkId; });
                        console.log(tag, 'nodes: ', nodes.length);
                        return [4 /*yield*/, this.networks.networks.ethereum.getNodes()];
                    case 2:
                        nodesEth = _a.sent();
                        return [2 /*return*/, nodes];
                    case 3:
                        e_2 = _a.sent();
                        console.error(tag, e_2);
                        throw e_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Balance.prototype.classifyCaip = function (caip) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (exports.SUPPORTED_CAIPS.UTXO.includes(caip))
                    return [2 /*return*/, 'UTXO'];
                if (exports.SUPPORTED_CAIPS.TENDERMINT.includes(caip))
                    return [2 /*return*/, 'TENDERMINT'];
                if (caip.startsWith('eip155'))
                    return [2 /*return*/, 'EIP155'];
                if (exports.SUPPORTED_CAIPS.OTHER.includes(caip))
                    return [2 /*return*/, 'OTHER'];
                throw new Error("Unsupported CAIP: ".concat(caip));
            });
        });
    };
    Balance.prototype.getBalance = function (asset, pubkey) {
        return __awaiter(this, void 0, void 0, function () {
            var tag, networkId, type, _a, networkIdToSymbol, coin, balance, result, result, result, result, balance, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        tag = TAG + " | getBalance | ";
                        if (!asset.caip)
                            throw new Error("caip required!");
                        if (!pubkey.pubkey)
                            throw new Error("pubkey required!");
                        networkId = caipToNetworkId(asset.caip);
                        console.info(tag, "networkId: ", networkId);
                        return [4 /*yield*/, this.classifyCaip(asset.caip)];
                    case 1:
                        type = _c.sent();
                        _a = type;
                        switch (_a) {
                            case 'UTXO': return [3 /*break*/, 2];
                            case 'TENDERMINT': return [3 /*break*/, 4];
                            case 'EIP155': return [3 /*break*/, 13];
                            case 'OTHER': return [3 /*break*/, 15];
                        }
                        return [3 /*break*/, 18];
                    case 2:
                        networkIdToSymbol = {
                            'bip122:000000000019d6689c085ae165831e93': 'BTC', // Bitcoin
                            'bip122:000000000000000000651ef99cb9fcbe': 'BCH', // Bitcoin Cash
                            'bip122:000007d91d1254d60e2dd1ae58038307': 'DASH', // Dash
                            'bip122:00000000001a91e3dace36e2be3bf030': 'DOGE', // Dogecoin
                            'bip122:12a765e31ffd4059bada1e25190f6e98': 'LTC' // Litecoin
                        };
                        coin = networkIdToSymbol[networkId];
                        console.log(tag, 'coin: ', coin);
                        return [4 /*yield*/, this.networks.networks.utxo.getBalanceByXpub(coin, pubkey.pubkey)];
                    case 3:
                        balance = _c.sent();
                        console.log(tag, "balance: ", balance);
                        asset.balance = (parseFloat(balance) / 1e8).toFixed(8);
                        return [3 /*break*/, 19];
                    case 4:
                        console.log(tag, 'Tendermint transaction');
                        if (!(asset.caip === 'cosmos:mayachain-mainnet-v1/slip44:931')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.networks.networks.mayachain.getBalance(pubkey.pubkey)];
                    case 5:
                        result = _c.sent();
                        asset.balance = result;
                        console.log(tag, 'asset.balance: ', asset.balance);
                        _c.label = 6;
                    case 6:
                        if (!(asset.caip === 'cosmos:osmosis-1/slip44:118')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.networks.networks.osmosis.getBalance(pubkey.pubkey)];
                    case 7:
                        result = _c.sent();
                        console.log(tag, 'result: ', result);
                        asset.balance = result;
                        _c.label = 8;
                    case 8:
                        if (!(asset.caip === 'cosmos:cosmoshub-4/slip44:118')) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.networks.networks.cosmos.getBalance(pubkey.pubkey)];
                    case 9:
                        result = _c.sent();
                        console.log(tag, 'result: ', result);
                        asset.balance = result;
                        _c.label = 10;
                    case 10:
                        if (!(asset.caip === 'cosmos:thorchain-mainnet-v1/slip44:931')) return [3 /*break*/, 12];
                        return [4 /*yield*/, this.networks.networks.thorchain.getBalance(pubkey.pubkey)];
                    case 11:
                        result = _c.sent();
                        console.log(tag, 'result: ', result);
                        asset.balance = result;
                        _c.label = 12;
                    case 12: 
                    //TODO tokens/ibc and non-gas assets
                    return [3 /*break*/, 19];
                    case 13: return [4 /*yield*/, this.networks.networks.ethereum.getBalanceAddressByNetwork(networkId, pubkey.pubkey)];
                    case 14:
                        balance = _c.sent();
                        console.log(tag, "balance: ", balance);
                        asset.balance = balance;
                        return [3 /*break*/, 19];
                    case 15:
                        if (!(asset.caip === 'ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144')) return [3 /*break*/, 17];
                        _b = asset;
                        return [4 /*yield*/, this.networks.networks.ripple.getBalance(pubkey.pubkey)];
                    case 16:
                        _b.balance = _c.sent();
                        _c.label = 17;
                    case 17:
                        console.log(tag, 'Other transaction');
                        return [3 /*break*/, 19];
                    case 18:
                        {
                            throw new Error("Unsupported CAIP: ".concat(asset.caip));
                        }
                        _c.label = 19;
                    case 19: return [2 /*return*/, asset];
                }
            });
        });
    };
    return Balance;
}());
exports.Balance = Balance;
