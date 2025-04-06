"use strict";
/*
    Pioneer nodes

        Get fresh node list from pioneer server

        test node

        Replenish node list

     GOALS:
        Pioneer has a large healty pool of a whole ecosystem of nodes



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
var TAG = " | Pioneer Nodes | ";
var log = require('@pioneer-platform/loggerdog')();
var _a = require("@pioneer-platform/pioneer-caip"), shortListNameToCaip = _a.shortListNameToCaip, shortListSymbolToCaip = _a.shortListSymbolToCaip, evmCaips = _a.evmCaips;
var seeds_1 = require("./seeds");
var web3_1 = require("./web3");
var NODES = web3_1.web3Seeds;
module.exports = {
    init: function (type, config, isTestnet) {
        return init_nodes(type, config, isTestnet);
    },
    getWeb3Nodes: function () {
        return web3_1.web3Seeds;
    },
    getNodes: function () {
        return NODES;
    },
    getNode: function (network, serviceId) {
        return get_node(network, serviceId);
    },
    getBlockbooks: function () {
        return seeds_1.blockbooks;
    },
    getUnchaineds: function () {
        return get_unchaineds();
    }
};
var get_unchaineds = function () {
    var tag = TAG + " | get_unchaineds | ";
    try {
        // unchaineds filter
        var unchaineds = seeds_1.shapeshift.filter(function (node) { return node.type === "unchained"; });
        //console.log(tag, "unchaineds: ", unchaineds);
        //all networks
        var allNetworks = [];
        var swaggersByNetwork = {};
        var servicesByNetwork = {};
        var wssByNetwork = {};
        for (var i = 0; i < unchaineds.length; i++) {
            var unchaind = unchaineds[i];
            log.debug(tag, "unchaind: ", unchaind.network);
            if (!allNetworks.includes(unchaind.network))
                allNetworks.push(unchaind.network);
            if (unchaind.swagger)
                swaggersByNetwork[unchaind.network] = unchaind.swagger;
            if (unchaind.value && unchaind.protocol == 'http')
                servicesByNetwork[unchaind.network] = unchaind.value;
            if (unchaind.protocol == 'websocket')
                wssByNetwork[unchaind.network] = unchaind.value;
        }
        var output = [];
        for (var i = 0; i < allNetworks.length; i++) {
            var network = allNetworks[i];
            var caip = shortListNameToCaip[network];
            log.debug(tag, "caip: ", caip);
            //build unchaineds
            var unchainedEntry = {
                caip: caip,
                swagger: swaggersByNetwork[network],
                service: servicesByNetwork[network],
                wss: wssByNetwork[network],
                type: 'unchained',
                blockchain: network,
            };
            output.push(unchainedEntry);
        }
        return output;
    }
    catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
};
var get_node = function (network, serviceId) {
    var tag = TAG + " | get_node | ";
    try {
        // @ts-ignore
        return seeds_1.CURRENT_CONTEXT_NODE_MAP[network.toUpperCase()][serviceId.toUpperCase()];
    }
    catch (e) {
        log.error(tag, "e: ", e);
        throw e;
    }
};
var init_nodes = function (type, config, isTestnet) {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | init_wallet | ";
            try {
                log.debug("Checkpoint1  ", config);
                return [2 /*return*/, true];
            }
            catch (e) {
                log.error(tag, "e: ", e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
