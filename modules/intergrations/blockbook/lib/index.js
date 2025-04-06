"use strict";
/*


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
var TAG = " | blockbook-client | ";
var Blockbook = require('blockbook-client').Blockbook;
var log = require('@pioneer-platform/loggerdog')();
var fakeUa = require('fake-useragent');
var Axios = require('axios');
var https = require('https');
var nodes = require("@pioneer-platform/nodes");
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    timeout: 30000 // 10 seconds
});
var axiosRetry = require('axios-retry');
var NOW_NODES_API = process.env['NOW_NODES_API'];
axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: function (retryCount) {
        log.error(TAG, "retry attempt: ".concat(retryCount));
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: function (error) {
        var _a;
        log.error(TAG, error);
        //@TODO mark node offline, and punish
        // if retry condition is not specified, by default idempotent requests are retried
        return ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 503;
    },
});
var BLOCKBOOK_URLS = {};
var BLOCKBOOK_SOCKETS = {};
module.exports = {
    init: function (servers) {
        return init_network(servers);
    },
    getInfo: function () {
        return get_node_info();
    },
    getBlockbooks: function () {
        return BLOCKBOOK_URLS;
    },
    getBlockbookSockets: function () {
        return BLOCKBOOK_SOCKETS;
    },
    getFees: function (coin) {
        return get_fees(coin);
    },
    getTransaction: function (coin, txid) {
        return get_transaction(coin, txid);
    },
    getAddressInfo: function (coin, address, filter) {
        return get_info_by_address(coin, address, filter);
    },
    getPubkeyInfo: function (coin, pubkey, filter) {
        return get_info_by_pubkey(coin, pubkey, filter);
    },
    txidsByAddress: function (coin, address, page) {
        return get_txids_by_address(coin, address, page);
    },
    txsByXpub: function (coin, addresses) {
        return get_txs_by_xpub(coin, addresses);
    },
    utxosByXpub: function (coin, xpub) {
        return get_utxos_by_xpub(coin, xpub);
    },
    getBalanceByXpub: function (coin, xpub) {
        return get_balance_by_xpub(coin, xpub);
    },
    broadcast: function (coin, hex) {
        return broadcast_transaction(coin, hex);
    },
};
var init_network = function (servers) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, SEED_NODES, blockbooks, i, blockbook, url, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = ' | get_txs_by_address | ';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.debug(tag, "checkpoint: ");
                    return [4 /*yield*/, nodes.getBlockbooks()];
                case 2:
                    SEED_NODES = _a.sent();
                    log.info(tag, "SEED_NODES: ", SEED_NODES);
                    blockbooks = [];
                    if (servers && Array.isArray(servers)) { // Type checking for array
                        blockbooks = servers.concat(SEED_NODES); // Combine arrays
                    }
                    else {
                        console.error("Invalid 'servers' parameter. Expected an array.");
                        blockbooks = SEED_NODES;
                    }
                    log.debug(tag, "blockbooks: ", blockbooks.length);
                    for (i = 0; i < blockbooks.length; i++) {
                        blockbook = blockbooks[i];
                        //get swagger
                        if (blockbook && blockbook.service)
                            BLOCKBOOK_URLS[blockbook.symbol.toUpperCase()] = blockbook.service;
                        if (blockbook && blockbook.websocket) {
                            url = blockbook.websocket.replace("/websocket", "");
                            url = blockbook.websocket.replace("wss://", "https://");
                            BLOCKBOOK_SOCKETS[blockbook.symbol.toUpperCase()] = new Blockbook({
                                nodes: [url],
                                disableTypeValidation: true,
                            });
                        }
                        else {
                            log.error(tag, "invalid unchained service: ", blockbook);
                            // throw Error("invalid unchained service!")
                        }
                    }
                    log.debug(tag, "BLOCKBOOK_URLS: ", BLOCKBOOK_URLS);
                    log.debug(tag, "BLOCKBOOK_SOCKETS: ", BLOCKBOOK_SOCKETS);
                    return [2 /*return*/, true];
                case 3:
                    e_1 = _a.sent();
                    // console.error(tag, 'Error: ', e)
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_fees = function (coin) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, body, resp, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_fees | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = BLOCKBOOK_URLS[coin.toUpperCase()] + "/api/v2/fees";
                    log.debug(tag, "url: ", url);
                    body = {
                        method: 'GET',
                        url: url,
                        headers: {
                            'content-type': 'application/json',
                            'User-Agent': fakeUa()
                        },
                    };
                    return [4 /*yield*/, axios(body)
                        //log.debug(tag,"resp: ",resp)
                        //TODO paginate?
                    ];
                case 2:
                    resp = _a.sent();
                    //log.debug(tag,"resp: ",resp)
                    //TODO paginate?
                    return [2 /*return*/, resp.data];
                case 3:
                    e_2 = _a.sent();
                    console.error(tag, e_2);
                    throw e_2;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_info_by_pubkey = function (coin, pubkey, page) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, body, resp, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_info_by_pubkey | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (!page)
                        page = "1";
                    url = BLOCKBOOK_URLS[coin.toUpperCase()] + "/api/v2/xpub/" + pubkey;
                    log.debug(tag, "url: ", url);
                    body = {
                        method: 'GET',
                        url: url,
                        headers: {
                            'content-type': 'application/json',
                            'User-Agent': fakeUa()
                        },
                    };
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp);
                    //TODO paginate?
                    return [2 /*return*/, resp.data];
                case 3:
                    e_3 = _a.sent();
                    console.error(tag, e_3);
                    throw e_3;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_txids_by_address = function (coin, address, page) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, body, resp, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_txids_by_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (!page)
                        page = 1;
                    url = BLOCKBOOK_URLS[coin.toUpperCase()] + "/api/v2/address/" + address + "?page=" + page + "&details=all";
                    log.debug(tag, "url: ", url);
                    body = {
                        method: 'GET',
                        url: url,
                        headers: {
                            'content-type': 'application/json',
                            'User-Agent': fakeUa()
                        },
                    };
                    return [4 /*yield*/, axios(body)
                        //TODO paginate?
                    ];
                case 2:
                    resp = _a.sent();
                    //TODO paginate?
                    return [2 /*return*/, resp.data];
                case 3:
                    e_4 = _a.sent();
                    console.error(tag, e_4);
                    throw e_4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_info_by_address = function (coin, address, filter) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, body, resp, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_info_by_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (!filter)
                        filter = "all";
                    //let url = ETH_BLOCKBOOK_URL+"/api/v2/address/"+address+"?="+filter
                    if (!BLOCKBOOK_URLS[coin.toUpperCase()])
                        throw Error("invalid coin: " + coin);
                    url = BLOCKBOOK_URLS[coin.toUpperCase()] + "/api/v2/address/" + address + "?details=all";
                    body = {
                        method: 'GET',
                        url: url,
                        headers: {
                            'content-type': 'application/json',
                            'User-Agent': fakeUa()
                        },
                    };
                    return [4 /*yield*/, axios(body)
                        //TODO paginate?
                    ];
                case 2:
                    resp = _a.sent();
                    //TODO paginate?
                    return [2 /*return*/, resp.data];
                case 3:
                    e_5 = _a.sent();
                    console.error(tag, e_5);
                    throw e_5;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_txs_by_xpub = function (coin, xpub) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, body, resp, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | FA get_txs_by_xpub | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = BLOCKBOOK_URLS[coin.toUpperCase()] + "/api/v2/xpub/" + xpub + "?details=all";
                    body = {
                        method: 'GET',
                        url: url,
                        headers: {
                            'content-type': 'application/json',
                            'User-Agent': fakeUa()
                        },
                    };
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_6 = _a.sent();
                    console.error(tag, e_6);
                    throw e_6;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var broadcast_transaction = function (coin, hex) {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | broadcast_transaction | ";
            try {
                // Mock implementation
                log.info(tag, "Broadcasting transaction:", hex.substring(0, 20) + "..." + " for coin " + coin);
                // Return a mock response
                return [2 /*return*/, {
                        txid: "0x" + Math.random().toString(16).substring(2, 34),
                        success: true
                    }];
            }
            catch (e) {
                console.error(tag, e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
var get_transaction = function (coin, txid) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, body, resp, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = BLOCKBOOK_URLS[coin.toUpperCase()] + "/api/v2/tx/" + txid;
                    console.log("url: ", url);
                    body = {
                        method: 'GET',
                        url: url,
                        headers: {
                            'content-type': 'application/json',
                            'User-Agent': fakeUa()
                        },
                    };
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_7 = _a.sent();
                    console.error(tag, e_7);
                    throw e_7;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_utxos_by_xpub = function (coin, xpub) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, body, resp, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | FA get_utxos_by_xpub | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.info(tag, "get_utxos_by_xpub: ", BLOCKBOOK_URLS);
                    url = BLOCKBOOK_URLS[coin.toUpperCase()] + "/api/v2/utxo/" + xpub + "?confirmed=false";
                    console.log("url: ", url);
                    body = {
                        method: 'GET',
                        url: url,
                        // headers: {
                        //     'api-key': NOW_NODES_API,
                        //     'content-type': 'application/json',
                        //     'User-Agent': fakeUa()
                        // },
                    };
                    return [4 /*yield*/, axios(body)];
                case 2:
                    resp = _a.sent();
                    return [2 /*return*/, resp.data];
                case 3:
                    e_8 = _a.sent();
                    console.error(tag, e_8);
                    throw e_8;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_balance_by_xpub = function (coin, xpub) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, balance, i, uxto, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_balance_by_xpub | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.debug(tag, "coin: ", coin);
                    log.debug(tag, "xpub: ", xpub);
                    return [4 /*yield*/, get_utxos_by_xpub(coin, xpub)];
                case 2:
                    output = _a.sent();
                    log.debug(tag, "output: ", output);
                    balance = 0;
                    //tally
                    for (i = 0; i < output.length; i++) {
                        uxto = output[i];
                        balance = balance + parseInt(uxto.value);
                    }
                    return [2 /*return*/, balance / 100000000];
                case 3:
                    e_9 = _a.sent();
                    console.error(tag, e_9);
                    throw e_9;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_node_info = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | get_node_info | ";
            try {
                return [2 /*return*/, true];
            }
            catch (e) {
                console.error(tag, e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
