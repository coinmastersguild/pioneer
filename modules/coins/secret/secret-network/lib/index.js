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
     Secret Network

        https://github.com/cosmostation/cosmosjs/blob/14114ddb5e74f237421cc2c1f8cd0f8aca4fbb95/example/scrt.js



*/
var TAG = " | thorchain-api | ";
require("dotenv").config({ path: '../../../.env' });
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
var log = require('@pioneer-platform/loggerdog')();
/*
Known seed node list:
5d9b8ac70000bd4ab1de3ccaf85eb43f8e315146@seed.terra.delightlabs.io:26656
6d8e943c049a80c161a889cb5fcf3d184215023e@public-seed2.terra.dev:26656
87048bf71526fb92d73733ba3ddb79b7a83ca11e@public-seed.terra.dev:26656
*/
var URL_SECRET_LCD = process.env['URL_SECRET_LCD'] || 'https://lcd-secret.keplr.app';
var BASE_SECRET = 100000000;
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
    getAccount: function (address) {
        return get_account_info(address);
    },
    getAccountInfo: function (address) {
        return get_account_info(address);
    },
    txs: function (address) {
        return get_txs_by_address(address);
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
var get_transaction = function (txid) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, txInfo, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_SECRET_LCD + '/txs/' + txid })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_1 = _a.sent();
                    throw Error(e_1);
                case 4: return [2 /*return*/];
            }
        });
    });
};
var broadcast_transaction = function (tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, urlRemote, result2, logSend, e_2, e_3;
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
                    urlRemote = URL_SECRET_LCD + '/txs';
                    log.debug(tag, "urlRemote: ", urlRemote);
                    return [4 /*yield*/, axios({
                            url: urlRemote,
                            method: 'POST',
                            data: tx,
                        })];
                case 3:
                    result2 = _a.sent();
                    log.debug(tag, '** Broadcast ** REMOTE: result: ', result2.data);
                    if (result2.data.txhash)
                        output.txid = result2.data.txhash;
                    //verify success
                    if (result2.data.raw_log) {
                        logSend = result2.data.raw_log;
                        log.debug(tag, "logSend: ", logSend);
                    }
                    output.height = result2.height;
                    output.gas_wanted = result2.gas_wanted;
                    output.gas_used = result2.gas_used;
                    output.raw = result2.data;
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    //log.error(tag,"failed second broadcast e: ",e.response)
                    log.error(tag, e_2);
                    log.error(tag, e_2.response);
                    log.error(tag, e_2.response.data);
                    log.error(tag, e_2.response.data.error);
                    log.error(tag, e_2.response.data.error.indexOf('RPC error -32603 - Internal error: Tx already exists in cache'));
                    //throw e
                    output.success = false;
                    output.error = e_2.response.data.error;
                    return [3 /*break*/, 5];
                case 5:
                    if (output.txid) {
                        output.success = true;
                    }
                    return [2 /*return*/, output];
                case 6:
                    e_3 = _a.sent();
                    console.error(tag, "throw error: ", e_3);
                    return [2 /*return*/, output];
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_account_info = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, txInfo, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_account_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    //
                    console.log("URL ", URL_SECRET_LCD + '/auth/accounts/' + address);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_SECRET_LCD + '/auth/accounts/' + address })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_4 = _a.sent();
                    log.error(tag, "e: ", e_4);
                    throw e_4;
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
        var tag, output, url, resultSends, sends, i, tx, resultRecieves, receives, i, tx, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_txs_by_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    output = [];
                    url = URL_SECRET_LCD + '/txs?message.sender=' + address;
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 2:
                    resultSends = _a.sent();
                    sends = resultSends.data;
                    //log.debug('sends: ', sends)
                    // TODO//pagnation
                    // let pagesSends = sends.page_number
                    // for(let i = 0; i < pagesSends; i++){
                    //
                    // }
                    for (i = 0; i < sends.txs.length; i++) {
                        tx = sends.txs[i];
                        //pretty json
                        //normalize
                        tx = normalize_tx(tx, address);
                        output.push(tx);
                    }
                    //receives
                    url = URL_SECRET_LCD + '/txs?transfer.recipient=' + address;
                    console.log("URL_SECRET_LCD: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 3:
                    resultRecieves = _a.sent();
                    receives = resultRecieves.data;
                    log.debug('receives: ', receives);
                    for (i = 0; i < receives.txs.length; i++) {
                        tx = receives.txs[i];
                        //normalize
                        tx = normalize_tx(tx, address);
                        output.push(tx);
                    }
                    return [2 /*return*/, output];
                case 4:
                    e_5 = _a.sent();
                    log.error(tag, "e: ", e_5);
                    throw e_5;
                case 5: return [2 /*return*/];
            }
        });
    });
};
var get_balance = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, accountInfo, i, entry, e_6, e_7;
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
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_SECRET_LCD + '/bank/balances/' + address })];
                case 3:
                    accountInfo = _b.sent();
                    log.debug(tag, "accountInfo: ", accountInfo.data);
                    //
                    if ((_a = accountInfo.data) === null || _a === void 0 ? void 0 : _a.result) {
                        for (i = 0; i < accountInfo.data.result.length; i++) {
                            entry = accountInfo.data.result[i];
                            if (entry.denom === 'rune') {
                                output = entry.amount;
                            }
                        }
                    }
                    output = output / BASE_SECRET;
                    return [3 /*break*/, 5];
                case 4:
                    e_6 = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, output];
                case 6:
                    e_7 = _b.sent();
                    log.error(tag, "e: ", e_7);
                    throw e_7;
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_node_info_verbose = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, syncInfo, nodeInfo, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    output = {};
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_SECRET_LCD + '/syncing' })];
                case 2:
                    syncInfo = _a.sent();
                    log.debug(tag, "syncInfo: ", syncInfo.data);
                    output.isSyncing = syncInfo.data;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_SECRET_LCD + '/node_info' })];
                case 3:
                    nodeInfo = _a.sent();
                    log.debug(tag, "nodeInfo: ", nodeInfo.data);
                    output = nodeInfo.data;
                    // let lastBlock = await axios({method:'GET',url: URL_SECRET_LCD+'/blocks/latest'})
                    // log.debug(tag,"lastBlock: ",lastBlock.data)
                    //let height
                    //output.height = lastBlock.data.block.header.height
                    return [2 /*return*/, output];
                case 4:
                    e_8 = _a.sent();
                    log.error(tag, "e: ", e_8);
                    throw e_8;
                case 5: return [2 /*return*/];
            }
        });
    });
};
