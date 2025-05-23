"use strict";
/*

yarn add @pioneer-platform/utxo-network @pioneer-platform/eth-network @pioneer-platform/ripple-network @pioneer-platform/cosmos-network @pioneer-platform/binance-network @pioneer-platform/thor-network @pioneer-platform/osmosis-network

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
exports.Network = void 0;
var TAG = " | pioneer network | ";
var utxo = require('@pioneer-platform/utxo-network');
var ethereum = require('@pioneer-platform/eth-network');
// let eos = require('@pioneer-platform/eos-network')
var ripple = require('@pioneer-platform/ripple-network');
var cosmos = require('@pioneer-platform/cosmos-network');
var binance = require('@pioneer-platform/binance-network');
var thorchain = require('@pioneer-platform/thor-network');
var osmosis = require('@pioneer-platform/osmosis-network');
var midgard = require("@pioneer-platform/midgard-client");
var mayachain = require('@pioneer-platform/maya-network');
var Network = /** @class */ (function () {
    function Network(config) {
        this.blockchains = config.wss;
        this.networks = {
            utxo: utxo,
            ethereum: ethereum,
            // eos,
            ripple: ripple,
            cosmos: cosmos,
            binance: binance,
            thorchain: thorchain,
            osmosis: osmosis,
            midgard: midgard,
            mayachain: mayachain
        };
        this.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tag, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tag = TAG + " | init_network | ";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 10, , 11]);
                            //TODO custom node config
                            //TODO audit all nodes
                            return [4 /*yield*/, utxo.init()];
                        case 2:
                            //TODO custom node config
                            //TODO audit all nodes
                            _a.sent();
                            return [4 /*yield*/, ethereum.init()
                                // await eos.init()
                            ];
                        case 3:
                            _a.sent();
                            // await eos.init()
                            return [4 /*yield*/, ripple.init()];
                        case 4:
                            // await eos.init()
                            _a.sent();
                            return [4 /*yield*/, cosmos.init()];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, binance.init()];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, thorchain.init()];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, mayachain.init()];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, osmosis.init()
                                // await midgard.init() //TODO add init
                            ];
                        case 9:
                            _a.sent();
                            // await midgard.init() //TODO add init
                            return [2 /*return*/, true];
                        case 10:
                            e_1 = _a.sent();
                            console.error(e_1);
                            throw e_1;
                        case 11: return [2 /*return*/];
                    }
                });
            });
        };
    }
    return Network;
}());
exports.Network = Network;
