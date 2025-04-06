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
/*
  const thorMainnetClient: CosmosSDKClient = new CosmosSDKClient({
    server: 'http://104.248.96.152:1317',
    chainId: 'thorchain',
    prefix: 'thor',
    derive_path: "44'/931'/0'/0/0",
  })


    get nodes
    curl https://testnet-seed.thorchain.info

    //testnet
    https://main.d3mbd42yfy75lz.amplifyapp.com/#/nodes

*/
var TAG = " | thorchain-api | ";
var prettyjson = require('prettyjson');
require("dotenv").config({ path: '../../../.env' });
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
var axiosRetry = require('axios-retry');
axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: function (retryCount) {
        console.log("retry attempt: ".concat(retryCount));
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: function (error) {
        console.error(error);
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});
var log = require('@pioneer-platform/loggerdog')();
var URL_THORNODE = 'https://mayanode.mayachain.info';
var URL_MIDGARD = 'https://midgard.mayachain.info/v2';
var BASE_THOR = 10000000000;
/**********************************
 // Module
 //**********************************/
module.exports = {
    init: function (url, settings) {
        return true;
    },
    isOnline: function () {
        return true;
    },
    info: function () {
        return get_node_info_verbose();
    },
    getBalance: function (address) {
        return get_balance(address);
    },
    getBalances: function (address) {
        return get_balances(address);
    },
    getAccount: function (address) {
        return get_account_info(address);
    },
    getLastBlock: function () {
        return get_last_block();
    },
    getBlockHeight: function () {
        return get_block_height();
    },
    getAccountInfo: function (address) {
        return get_account_info(address);
    },
    getPools: function () {
        return get_pools();
    },
    getPool: function (poolId) {
        return get_pool(poolId);
    },
    getPoolAddress: function () {
        return get_pool_addresses();
    },
    txs: function (address) {
        return get_txs_by_address(address);
    },
    getTransaction: function (txid) {
        return get_transaction(txid);
    },
    transaction: function (txid) {
        return get_transaction(txid);
    },
    broadcast: function (tx) {
        return broadcast_transaction(tx);
    },
};
/**********************************
 // Lib
 //**********************************/
var get_pool = function (poolId) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, params, body, resp, e_1;
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
                        url: URL_MIDGARD + "/pools/detail",
                        headers: { 'content-type': 'application/json' },
                        params: params
                    };
                    log.debug(body);
                    return [4 /*yield*/, axios(body)];
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
var get_pools = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, body, resp, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_pools | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    body = {
                        method: 'GET',
                        url: URL_MIDGARD + "/pools",
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
                    e_2 = _a.sent();
                    log.error(tag, "e: ", e_2);
                    throw e_2;
                case 4: return [2 /*return*/];
            }
        });
    });
};
//https://testnet.thornode.thorchain.info/thorchain/inbound_addresses
var get_pool_addresses = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, body, resp, e_3;
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
                    e_3 = _a.sent();
                    log.error(tag, "e: ", e_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_last_block = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, lastBlock, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_last_block | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_THORNODE + '/blocks/latest' })];
                case 2:
                    lastBlock = _a.sent();
                    log.debug(tag, "lastBlock: ", lastBlock.data);
                    return [2 /*return*/, lastBlock.data.block];
                case 3:
                    e_4 = _a.sent();
                    log.error(tag, "e: ", e_4);
                    throw e_4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_block_height = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, lastBlock, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_block_height | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_THORNODE + '/blocks/latest' })];
                case 2:
                    lastBlock = _a.sent();
                    log.debug(tag, "lastBlock: ", lastBlock.data);
                    return [2 /*return*/, lastBlock.data.block.header.height];
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
        var tag, txInfo, e_6, output;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_THORNODE + '/txs/' + txid })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_6 = _a.sent();
                    // log.error(tag,e.response.data)
                    // log.error(tag,e.response.data.error)
                    if (e_6.response.status === 404) {
                        output = {};
                        output.success = false;
                        output.error = e_6.response.data.error;
                        return [2 /*return*/, output];
                    }
                    else {
                        throw Error(e_6);
                    }
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var broadcast_transaction = function (tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, payload, urlRemote, result2, logSend, e_7, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | broadcast_transaction | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    log.debug(tag, "CHECKPOINT 1");
                    output.success = false;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    payload = {
                        // "tx_bytes": btoa(tx),
                        // "tx_bytes":broadcastTx,
                        "tx_bytes": tx,
                        "mode": "BROADCAST_MODE_SYNC"
                    };
                    urlRemote = URL_THORNODE + '/cosmos/tx/v1beta1/txs';
                    // let urlRemote = URL_GAIAD+ '/txs'
                    log.info(tag, "urlRemote: ", urlRemote);
                    return [4 /*yield*/, axios({
                            url: urlRemote,
                            headers: {
                                'api-key': process.env['NOW_NODES_API'],
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            data: payload,
                        })];
                case 3:
                    result2 = _a.sent();
                    log.info(tag, '** Broadcast ** REMOTE: result: ', result2.data);
                    log.info(tag, '** Broadcast ** REMOTE: result: ', JSON.stringify(result2.data));
                    if (result2.data.txhash)
                        output.txid = result2.data.txhash;
                    //tx_response
                    if (result2.data.tx_response.txhash)
                        output.txid = result2.data.tx_response.txhash;
                    if (result2.data.tx_response.raw_log && result2.data.tx_response.raw_log !== '[]') {
                        logSend = result2.data.tx_response.raw_log;
                        log.debug(tag, "logSend: ", logSend);
                        output.success = false;
                        output.error = logSend;
                    }
                    else {
                        output.success = true;
                    }
                    return [2 /*return*/, output];
                case 4:
                    e_7 = _a.sent();
                    //log.error(tag,"failed second broadcast e: ",e.response)
                    log.error(tag, e_7);
                    log.error(tag, e_7.response);
                    log.error(tag, e_7.response.data);
                    log.error(tag, e_7.response.data.error);
                    log.error(tag, e_7.response.data.error.indexOf('RPC error -32603 - Internal error: Tx already exists in cache'));
                    //throw e
                    output.success = false;
                    output.error = e_7.response.data.error;
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, output];
                case 6:
                    e_8 = _a.sent();
                    console.error(tag, "throw error: ", e_8);
                    return [2 /*return*/, output];
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_account_info = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, txInfo, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_account_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    //
                    console.log("URL ", URL_THORNODE + '/auth/accounts/' + address);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_THORNODE + '/auth/accounts/' + address })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_9 = _a.sent();
                    log.error(tag, "e: ", e_9);
                    throw e_9;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var normalize_tx = function (tx, address) {
    var tag = TAG + " | normalize_tx | ";
    try {
        var output = {};
        var sender = void 0;
        var receiver = void 0;
        var memo = void 0;
        var amount = void 0;
        var rawlog = JSON.parse(tx.raw_log);
        rawlog = rawlog;
        //log.debug("rawlog: ",rawlog)
        //txTypes
        var txTypes = [
            'send',
            'receive',
            'governence',
            'swap',
            'other'
        ];
        for (var i = 0; i < rawlog.length; i++) {
            var txEvents = rawlog[i];
            //log.debug(tag,"txEvents: ",txEvents)
            txEvents = txEvents.events;
            for (var j = 0; j < txEvents.length; j++) {
                var event_1 = txEvents[j];
                //
                //log.debug(tag,"event: ",event)
                //log.debug(tag,"attributes: ",prettyjson.render(event.attributes))
                //detect event type
                log.debug(tag, "type: ", event_1.type);
                switch (event_1.type) {
                    case 'message':
                        // ignore
                        break;
                    case 'transfer':
                        log.debug(tag, "attributes: ", event_1.attributes);
                        for (var k = 0; k < event_1.attributes.length; k++) {
                            var attribute = event_1.attributes[k];
                            if (attribute.key === 'recipient') {
                                receiver = attribute.value;
                                output.receiver = receiver;
                                if (receiver === address)
                                    output.type = txTypes[1];
                            }
                            if (attribute.key === 'sender') {
                                sender = attribute.value;
                                output.sender = sender;
                                if (sender === address)
                                    output.type = txTypes[0];
                            }
                            if (attribute.key === 'amount') {
                                amount = attribute.value;
                                amount = amount.replace('rune', '');
                                output.amount = amount / 100000000;
                            }
                        }
                        break;
                    default:
                    // code block
                }
            }
            // console.log("log: ",prettyjson.render(log))
        }
        return output;
    }
    catch (e) {
        log.error(tag, "e: ", e);
        throw e;
    }
};
var get_txs_by_address = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, url, resultSends, sends, i, tx, resultRecieves, receives, i, tx, e_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_txs_by_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    output = [];
                    url = URL_THORNODE + '/txs?message.sender=' + address;
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 2:
                    resultSends = _a.sent();
                    sends = resultSends.data;
                    log.debug('sends: ', sends);
                    if (!sends.txs)
                        sends.txs = [];
                    // TODO//pagnation
                    for (i = 0; i < (sends === null || sends === void 0 ? void 0 : sends.txs.length); i++) {
                        tx = sends.txs[i];
                        //pretty json
                        //normalize
                        tx = normalize_tx(tx, address);
                        output.push(tx);
                    }
                    //receives
                    url = URL_THORNODE + '/txs?transfer.recipient=' + address;
                    console.log("URL_THORNODE: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 3:
                    resultRecieves = _a.sent();
                    receives = resultRecieves.data;
                    if (!receives.txs)
                        receives.txs = [];
                    log.debug('receives: ', receives);
                    for (i = 0; i < (receives === null || receives === void 0 ? void 0 : receives.txs.length); i++) {
                        tx = receives.txs[i];
                        //normalize
                        tx = normalize_tx(tx, address);
                        output.push(tx);
                    }
                    return [2 /*return*/, output];
                case 4:
                    e_10 = _a.sent();
                    log.error(tag, "e: ", e_10);
                    throw e_10;
                case 5: return [2 /*return*/];
            }
        });
    });
};
var get_balance = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, accountInfo, i, entry, e_11, e_12;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tag = TAG + " | get_balance | ";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    output = 0;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_THORNODE + '/bank/balances/' + address })];
                case 3:
                    accountInfo = _b.sent();
                    log.info(tag, "accountInfo: ", accountInfo.data);
                    //
                    if ((_a = accountInfo.data) === null || _a === void 0 ? void 0 : _a.result) {
                        for (i = 0; i < accountInfo.data.result.length; i++) {
                            entry = accountInfo.data.result[i];
                            if (entry.denom === 'cacao') {
                                output = entry.amount;
                            }
                        }
                    }
                    output = output / BASE_THOR;
                    return [3 /*break*/, 5];
                case 4:
                    e_11 = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, output];
                case 6:
                    e_12 = _b.sent();
                    log.error(tag, "e: ", e_12);
                    throw e_12;
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_balances = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, accountInfo, i, entry, e_13, e_14;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tag = TAG + " | get_balances | ";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 6, , 7]);
                    output = [];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_THORNODE + '/bank/balances/' + address })];
                case 3:
                    accountInfo = _b.sent();
                    log.info(tag, "accountInfo: ", accountInfo.data);
                    //
                    if ((_a = accountInfo.data) === null || _a === void 0 ? void 0 : _a.result) {
                        for (i = 0; i < accountInfo.data.result.length; i++) {
                            entry = accountInfo.data.result[i];
                            if (entry.denom === 'cacao') {
                                output.push({
                                    denom: entry.denom,
                                    amountBase: entry.amount,
                                    amount: entry.amount / 10000000000,
                                    decimals: 10
                                });
                            }
                            if (entry.denom === 'maya') {
                                output.push({
                                    denom: entry.denom,
                                    amountBase: entry.amount,
                                    amount: entry.amount / 10000,
                                    decimals: 4
                                });
                            }
                        }
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_13 = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, output];
                case 6:
                    e_14 = _b.sent();
                    log.error(tag, "e: ", e_14);
                    throw e_14;
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_node_info_verbose = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, syncInfo, nodeInfo, lastBlock, e_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    output = {};
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_THORNODE + '/syncing' })];
                case 2:
                    syncInfo = _a.sent();
                    log.debug(tag, "syncInfo: ", syncInfo.data);
                    output.isSyncing = syncInfo.data;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_THORNODE + '/node_info' })];
                case 3:
                    nodeInfo = _a.sent();
                    log.debug(tag, "nodeInfo: ", nodeInfo.data);
                    output = nodeInfo.data;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_THORNODE + '/blocks/latest' })];
                case 4:
                    lastBlock = _a.sent();
                    log.debug(tag, "lastBlock: ", lastBlock.data);
                    //let height
                    output.height = lastBlock.data.block.header.height;
                    return [2 /*return*/, output];
                case 5:
                    e_15 = _a.sent();
                    log.error(tag, "e: ", e_15);
                    throw e_15;
                case 6: return [2 /*return*/];
            }
        });
    });
};
