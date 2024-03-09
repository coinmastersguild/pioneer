"use strict";
/*



https://defi.delphidigital.io/testnet/v1/thorchain/constants

http://174.138.103.9:8080/v1/doc

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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var TAG = " | midgard network | ";
var log = require('@pioneer-platform/loggerdog')();
var SEED_TESTNET = "https://testnet-seed.thorchain.info/";
//let MIDGARD_API = "https://chaosnet-midgard.bepswap.com/v1"
//let MIDGARD_API = "https://testnet-midgard.bepswap.com/v1"
//let MIDGARD_API = "https://54.0.0.27/v1"
//let MIDGARD_API = "https://testnet.multichain.midgard.thorchain.info/v2"
// const MIDGARD_API = 'http://174.138.103.9:8080/v1'
// let MIDGARD_API_RAW = 'https://testnet.thornode.thorchain.info'
//const MIDGARD_API = process.env['URL_MIDGARD'] ||'https://midgard.ninerealms.com/v2'
var MIDGARD_API = process.env['URL_MIDGARD'] || 'https://indexer.thorchain.shapeshift.com/v2';
var URL_THORNODE = process.env['URL_THORNODE'] || 'https://thornode.ninerealms.com';
log.debug("URL_THORNODE: ", URL_THORNODE);
log.debug("MIDGARD_API: ", MIDGARD_API);
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
module.exports = {
    // init: function (type:string,config:any,isTestnet:boolean) {
    //     return init_wallet(type,config,isTestnet);
    // },
    getInfo: function () {
        return get_info();
    },
    getPools: function () {
        return get_pools();
    },
    getOutboundQueue: function () {
        return get_outbound_queue();
    },
    getPrice: function (asset) {
        return get_price(asset);
    },
    getPool: function (poolId) {
        return get_pool(poolId);
    },
    getPoolAddress: function () {
        return get_pool_addresses();
    },
    getNewAddress: function () {
        return get_new_addresses();
    },
    getActions: function () {
        return get_actions();
    },
    getActionsByAddress: function (address) {
        return get_actions_by_address(address);
    },
    getTransaction: function (txid) {
        return get_transaction(txid);
    },
    getTransactionsByAffiliate: function (address) {
        return get_transactions_by_affiliate(address);
    },
    getTransactionsByAddress: function (address) {
        return get_transactions_by_address(address);
    }
};
var get_transactions_by_address = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, params, resp, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_transactions_by_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    params = {
                        address: address,
                    };
                    console.log(params);
                    return [4 /*yield*/, axios.get(MIDGARD_API + "/actions", { params: params })];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_1 = _a.sent();
                    log.error(tag, "e: ", e_1);
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_transactions_by_affiliate = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, params, resp, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_transactions_by_affiliate | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    params = {
                        affiliate: address,
                    };
                    console.log(params);
                    return [4 /*yield*/, axios.get(MIDGARD_API + "/actions", { params: params })];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_2 = _a.sent();
                    log.error(tag, "e: ", e_2);
                    throw e_2;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_outbound_queue = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, outboundReq, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_outbound_queue | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get("".concat(URL_THORNODE, "/thorchain/queue/outbound"))];
                case 2:
                    outboundReq = _a.sent();
                    return [2 /*return*/, outboundReq];
                case 3:
                    e_3 = _a.sent();
                    log.error(tag, "e: ", e_3);
                    throw e_3;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_actions = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, params, resp, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    params = {
                        // txid,
                        // address,
                        // type:"swap",
                        fromHeight: 12169490,
                        // offset:1,
                        // limit:10
                    };
                    console.log(params);
                    return [4 /*yield*/, axios.get(MIDGARD_API + "/actions", { params: params })];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_4 = _a.sent();
                    log.error(tag, "e: ", e_4);
                    throw e_4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_actions_by_address = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, params, resp, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    params = {
                        // txid,
                        address: address,
                        // type:"swap",
                        // fromHeight:12169490,
                        // offset:1,
                        // limit:1000
                    };
                    console.log(params);
                    return [4 /*yield*/, axios.get(MIDGARD_API + "/actions", { params: params })];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_5 = _a.sent();
                    log.error(tag, "e: ", e_5);
                    throw e_5;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_transaction = function (txid) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, inDetails, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios.get("".concat(URL_THORNODE, "/thorchain/tx/details/").concat(txid))];
                case 2:
                    inDetails = (_a.sent()).data;
                    return [2 /*return*/, inDetails];
                case 3:
                    e_6 = _a.sent();
                    log.error(tag, "e: ", e_6);
                    throw e_6;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_new_addresses = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, params, body, resp, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_new_addresses | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = {};
                    params = {};
                    body = {
                        method: 'GET',
                        url: URL_THORNODE + "/thorchain/inbound_addresses",
                        headers: { 'content-type': 'application/json' },
                    };
                    log.debug(body);
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_7 = _a.sent();
                    log.error(tag, "e: ", e_7);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_price = function (asset) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, params, body, resp, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_price | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = {};
                    params = {
                        asset: asset
                    };
                    body = {
                        method: 'GET',
                        url: MIDGARD_API + "/assets",
                        headers: { 'content-type': 'application/json' },
                        params: params
                    };
                    log.debug(body);
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_8 = _a.sent();
                    log.error(tag, "e: ", e_8);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
//https://testnet.thornode.thorchain.info/thorchain/inbound_addresses
var get_pool_addresses = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, body, resp, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_pool_addresses | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = {};
                    body = {
                        method: 'GET',
                        url: URL_THORNODE + "/thorchain/inbound_addresses",
                        headers: { 'content-type': 'application/json' },
                        // body: {account_name: actor},
                        // json: true
                    };
                    log.debug(body);
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_9 = _a.sent();
                    log.error(tag, "e: ", e_9);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_info = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, body, resp, bodyStats, outboundReq, scheduledReq, streamingReq, respStats, e_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    output = {};
                    body = {
                        method: 'GET',
                        url: MIDGARD_API + "/health",
                        headers: { 'content-type': 'application/json' },
                        // body: {account_name: actor},
                        // json: true
                    };
                    log.debug(body.url);
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    bodyStats = {
                        method: 'GET',
                        url: MIDGARD_API + "/stats",
                        headers: { 'content-type': 'application/json' },
                        // body: {account_name: actor},
                        // json: true
                    };
                    return [4 /*yield*/, axios.get("".concat(URL_THORNODE, "/thorchain/queue/outbound"))];
                case 3:
                    outboundReq = _a.sent();
                    return [4 /*yield*/, axios.get("".concat(URL_THORNODE, "/thorchain/queue/scheduled"))];
                case 4:
                    scheduledReq = _a.sent();
                    return [4 /*yield*/, axios.get("".concat(URL_THORNODE, "/thorchain/swaps/streaming"))];
                case 5:
                    streamingReq = _a.sent();
                    output.outboundReq = outboundReq.data;
                    output.scheduledReq = scheduledReq.data;
                    output.streamingReq = streamingReq.data;
                    log.debug(bodyStats);
                    return [4 /*yield*/, axios(bodyStats)];
                case 6:
                    respStats = _a.sent();
                    log.debug(tag, "respStats: ", respStats.data);
                    output.stats = respStats.data;
                    output.health = resp.data;
                    return [2 /*return*/, output];
                case 7:
                    e_10 = _a.sent();
                    log.error(tag, "e: ", e_10);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
};
var get_pools = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, body, resp, e_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_pools | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    body = {
                        method: 'GET',
                        url: MIDGARD_API + "/pools",
                        headers: { 'content-type': 'application/json' },
                        // body: {account_name: actor},
                        // json: true
                    };
                    log.debug(body.url);
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_11 = _a.sent();
                    log.error(tag, "e: ", e_11);
                    throw e_11;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_pool = function (poolId) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, params, body, resp, e_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_pool | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    params = {
                        view: "full",
                        asset: poolId
                    };
                    body = {
                        method: 'GET',
                        url: MIDGARD_API + "/pools/detail",
                        headers: { 'content-type': 'application/json' },
                        params: params
                    };
                    log.debug(body);
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_12 = _a.sent();
                    log.error(tag, "e: ", e_12);
                    throw e_12;
                case 4: return [2 /*return*/];
            }
        });
    });
};
