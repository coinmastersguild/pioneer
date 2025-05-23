"use strict";
/*
    BNB network tools

    basic fee
    0.000375 BNB


    BNB explorer
    https://explorer.binance.org/address/bnb1nsxpvdupgn87td6jnekc8fhs0fkyschgk26yng


    //nodes
    https://github.com/binance-chain/node-binary


    //API
    https://docs.binance.org/api-reference/node-rpc.html


    //sdk
    https://github.com/binance-chain/javascript-sdk


    //examples
    https://github.com/binance-chain/javascript-sdk/wiki/API-Examples




Available endpoints:

Endpoints that require arguments:
//dataseed1.binance.org/abci_info?
//dataseed1.binance.org/abci_query?path=_&data=_&height=_&prove=_
//dataseed1.binance.org/block?height=_
//dataseed1.binance.org/block_by_hash?hash=_
//dataseed1.binance.org/block_results?height=_
//dataseed1.binance.org/blockchain?minHeight=_&maxHeight=_
//dataseed1.binance.org/broadcast_evidence?evidence=_
//dataseed1.binance.org/broadcast_tx_async?tx=_
//dataseed1.binance.org/broadcast_tx_commit?tx=_
//dataseed1.binance.org/broadcast_tx_sync?tx=_
//dataseed1.binance.org/commit?height=_
//dataseed1.binance.org/consensus_params?height=_
//dataseed1.binance.org/consensus_state?
//dataseed1.binance.org/dump_consensus_state?
//dataseed1.binance.org/genesis?
//dataseed1.binance.org/health?
//dataseed1.binance.org/net_info?
//dataseed1.binance.org/num_unconfirmed_txs?
//dataseed1.binance.org/status?
//dataseed1.binance.org/subscribe?query=_
//dataseed1.binance.org/tx?hash=_&prove=_
//dataseed1.binance.org/tx_search?query=_&prove=_&page=_&per_page=_
//dataseed1.binance.org/unconfirmed_txs?limit=_
//dataseed1.binance.org/unsubscribe?query=_
//dataseed1.binance.org/unsubscribe_all?
//dataseed1.binance.org/validators?height=_

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
var TAG = " | bnb-network | ";
var moment = require('moment');
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
var log = require('@pioneer-platform/loggerdog')();
// let URL_BNBchaind = process.env["URL_BNB"] || 'http://127.0.0.1:27147'
// let URL_BNBcli = process.env["URL_BNBCLI"] || 'http://127.0.0.1:8333'
//Debug
var URL_BNBchaind = process.env["URL_BNB"] || 'https://dex.binance.org';
var URL_BNBcli = process.env["URL_BNBCLI"] || 'https://dex.binance.org';
var URL_REMOTE = process.env["URL_BNB_REMOTE"] || 'https://dataseed1.binance.org:443';
var URL_DEX = process.env["BNB_FULL_REMOTE"] || 'https://dex.binance.org';
var URL_DEX_0 = process.env["BNB_FULL_REMOTE_1"] || 'https://dex.binance.org';
var URL_DEX_1 = process.env["BNB_FULL_REMOTE_2"] || 'https://dex-atlantic.binance.org';
var URL_DEX_2 = process.env["BNB_FULL_REMOTE_3"] || 'https://dex-asiapacific.binance.org';
var URL_DEX_3 = process.env["BNB_FULL_REMOTE_4"] || 'https://dex-european.binance.org';
// @ts-ignore
var crypto = require('crypto');
//console.log(sdk)
//network.getTransactions()
// let client = sdk.BncClient(URL)
// console.log(client)
var ASSET = "BNB";
var ROUND_ROBIN_STATE = [];
var REMOTE_OVERRIDE_BNB = process.env['REMOTE_OVERRIDE_BNB'];
module.exports = {
    init: function (mode, config) {
        if (mode) {
            //TODO override nodes
        }
        else {
        }
    },
    nodeInfo: function () {
        return get_node_info();
    },
    nodeInfoSyncing: function () {
        return get_node_syncing();
    },
    nodeInfoVersion: function () {
        return get_node_version();
    },
    txs: function (address) {
        return get_txs_by_address(address);
    },
    txsByHeight: function (height, address) {
        return get_txs_by_height(height, address);
    },
    getBlockHeight: function () {
        return get_block_height();
    },
    getTransaction: function (txid) {
        return getTransaction(txid);
    },
    getBalance: function (address, token) {
        return get_balance(address, token);
    },
    getBlock: function (height) {
        return get_block(height);
    },
    getBlockRemote: function (height) {
        return get_block_remote(height);
    },
    broadcast: function (tx) {
        return broadcast_transaction(tx);
    },
    getAccount: function (address) {
        return get_account(address);
    },
    // getSequence:function (address:string) {
    //     return get_account_sequence(address);
    // },
    // getValidators:function () {
    //     return get_validators();
    // }
};
var get_block_height = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, height, bnbncliRemote, e_1, bnbncliRemote, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_block_height | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    height = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_BNBchaind + '/abci_info' })];
                case 3:
                    bnbncliRemote = _a.sent();
                    log.debug(tag, "bnbncliRemote: ", bnbncliRemote.data);
                    height = bnbncliRemote.data.result.response.last_block_height;
                    return [3 /*break*/, 6];
                case 4:
                    e_1 = _a.sent();
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_REMOTE + '/abci_info' })];
                case 5:
                    bnbncliRemote = _a.sent();
                    log.debug(tag, "bnbncliRemote: ", bnbncliRemote.data);
                    height = bnbncliRemote.data.result.response.last_block_height;
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, height];
                case 7:
                    e_2 = _a.sent();
                    //log.error(tag,"e: ",{e})
                    output.success = false;
                    output.error = e_2;
                    return [2 /*return*/, output];
                case 8: return [2 /*return*/];
            }
        });
    });
};
var get_balance = function (address, token) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, url, result, balanceInfo, i, assetInfo, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_account | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (!token)
                        token = ASSET;
                    log.debug(tag, "get_account: ", address);
                    url = URL_DEX + '/api/v1/account/' + address;
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 2:
                    result = _a.sent();
                    balanceInfo = result.data;
                    log.debug('balanceInfo: ', balanceInfo);
                    if (!balanceInfo || !balanceInfo.balances || balanceInfo.balances.length === 0) {
                        output = 0;
                    }
                    for (i = 0; i < balanceInfo.balances.length; i++) {
                        assetInfo = balanceInfo.balances[i];
                        log.debug(tag, "assetInfo: ", assetInfo);
                        if (assetInfo.symbol === token) {
                            output = parseFloat(assetInfo.free);
                        }
                    }
                    return [2 /*return*/, output];
                case 3:
                    e_3 = _a.sent();
                    //node 404's on fresh addresses like an asshole
                    return [2 /*return*/, 0];
                case 4: return [2 /*return*/];
            }
        });
    });
};
/*

    https://docs.binance.org/api-reference/dex-api/paths.html#apiv1transactions

 */
var get_txs_by_address = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, output_1, startTime, url, resultSends, sends, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = ' | get_txs_by_address | ';
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output_1 = [];
                    startTime = moment().subtract('months', 6).unix();
                    startTime = startTime * 1000;
                    log.debug("startTime: ", startTime);
                    url = URL_DEX + '/api/v1/transactions?address=' + address + '&startTime=' + startTime;
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 2:
                    resultSends = _a.sent();
                    sends = resultSends.data;
                    log.debug('sends: ', sends);
                    return [2 /*return*/, sends.tx];
                case 3:
                    e_4 = _a.sent();
                    //log.error(tag,"e: ",{e})
                    output.success = false;
                    output.error = e_4;
                    return [2 /*return*/, output];
                case 4: return [2 /*return*/];
            }
        });
    });
};
// let get_txs_by_address = async function(address){
// 	let tag = TAG + " | get_txs_by_height | "
// 	try{
//
//
// 		//log.debug(network)
// 		let txs = network.getTransactions(address,0)
//
// 		// let txInfo = await axios({method:'GET',url:URL_BNBcli+'/tx_search?address='+address})
// 		// log.debug(tag,"txInfo: ",txInfo.data)
//
//
// 		return txs
// 	}catch(e){
//         //log.error(tag,"e: ",{e})
//         let output:any = {}
//         output.success = false
//         output.error = e
//         return output
// 	}
// }
var get_txs_by_height = function (height, address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output;
        return __generator(this, function (_a) {
            tag = TAG + " | get_txs_by_height | ";
            output = {};
            try {
                //TODO
                //let txs = await network.getTransactions(address)
                // let txInfo = await axios({method:'GET',url:URL+'/api/v1/transactions?blockHeight='+height})
                // log.debug(tag,"txInfo: ",txInfo.data)
                return [2 /*return*/, "TODO"];
            }
            catch (e) {
                //log.error(tag,"e: ",{e})
                output.success = false;
                output.error = e;
                return [2 /*return*/, output];
            }
            return [2 /*return*/];
        });
    });
};
var get_block = function (height) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, i, rawTx, txSummary, buffer, hash, rawTxHex, e_5, txs, i, entry, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_block | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    if (typeof (height) === 'string')
                        parseInt(height);
                    log.debug("checkpoint! ", height);
                    //txs
                    output.txs = [];
                    txInfo = void 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    if (REMOTE_OVERRIDE_BNB)
                        throw Error("102: forced remote override");
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_BNBcli + '/blocks/' + height })];
                case 3:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo);
                    if (txInfo.data.block.data.txs) {
                        //convert raw tx's
                        for (i = 0; i < txInfo.data.block.data.txs.length; i++) {
                            rawTx = txInfo.data.block.data.txs[i];
                            log.debug(tag, "rawTx: ", rawTx);
                            txSummary = {};
                            buffer = Buffer.from(rawTx, 'base64');
                            hash = crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase();
                            log.debug(tag, "hash: ", hash);
                            rawTxHex = buffer.toString('hex');
                            //let decodedTx = bnbDecoder.decodeTransfer(rawTxHex);
                            //log.debug(tag,"decodedTx: ",JSON.stringify(decodedTx))
                            txSummary.txid = hash;
                            txSummary.blockHeight = height;
                            //txSummary.tx = decodedTx
                            output.txs.push(txSummary);
                        }
                    }
                    return [3 /*break*/, 6];
                case 4:
                    e_5 = _a.sent();
                    return [4 /*yield*/, get_block_remote(height)];
                case 5:
                    //throw e
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo);
                    txs = [];
                    for (i = 0; i < txInfo.tx.length; i++) {
                        entry = txInfo.tx[i];
                        entry.txid = entry.txHash;
                        txs.push(entry);
                    }
                    output.txs = txs;
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/, output];
                case 7:
                    e_6 = _a.sent();
                    //log.error(tag,"e: ",{e})
                    output.success = false;
                    output.error = e_6;
                    return [2 /*return*/, output];
                case 8: return [2 /*return*/];
            }
        });
    });
};
var get_block_remote = function (height) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, selected, txInfo, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_block | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.debug("checkpoint! ", height);
                    selected = void 0;
                    //rand 1-4
                    if (ROUND_ROBIN_STATE.length == 0) {
                        //add all 5
                        ROUND_ROBIN_STATE.push(URL_DEX_0);
                        ROUND_ROBIN_STATE.push(URL_DEX_1);
                        ROUND_ROBIN_STATE.push(URL_DEX_2);
                        ROUND_ROBIN_STATE.push(URL_DEX_3);
                        selected = URL_DEX_0;
                    }
                    else {
                        //pop at random
                        selected = ROUND_ROBIN_STATE.pop();
                    }
                    //
                    log.debug(tag, "selected: ", selected);
                    return [4 /*yield*/, axios({ method: 'GET', url: selected + '/api/v1/transactions-in-block/' + height })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_7 = _a.sent();
                    //log.error(tag,"e: ",{e})
                    output.success = false;
                    output.error = e_7;
                    return [2 /*return*/, output];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_account = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, url, result, balanceInfo, e_8, output_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_account | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.debug(tag, "get_account: ", address);
                    url = URL_DEX + '/api/v1/account/' + address;
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 2:
                    result = _a.sent();
                    balanceInfo = result.data;
                    log.debug('balanceInfo: ', balanceInfo);
                    return [2 /*return*/, balanceInfo];
                case 3:
                    e_8 = _a.sent();
                    output_2 = {
                        account_number: 0,
                        address: address,
                        balances: [],
                        flags: 0,
                        public_key: [],
                        sequence: 0
                    };
                    return [2 /*return*/, output_2];
                case 4: return [2 /*return*/];
            }
        });
    });
};
/*

The tx must be a signed StdTx. The supported broadcast modes include "block"(return after tx commit), "sync"(return afer CheckTx) and "async"(return right away).



    Input tx example:

    {
      "tx": {
        "msg": [
          "string"
        ],
        "fee": {
          "gas": "string",
          "amount": [
            {
              "denom": "stake",
              "amount": "50"
            }
          ]
        },
        "memo": "string",
        "signature": {
          "signature": "MEUCIQD02fsDPra8MtbRsyB1w7bqTM55Wu138zQbFcWx4+CFyAIge5WNPfKIuvzBZ69MyqHsqD8S1IwiEp+iUb6VSdtlpgY=",
          "pub_key": {
            "type": "tendermint/PubKeySecp256k1",
            "value": "Avz04VhtKJh8ACCVzlI8aTosGy0ikFXKIVHQ3jKMrosH"
          },
          "account_number": "0",
          "sequence": "0"
        }
      },
      "mode": "block"
    }


    responce:

    {
      "check_tx": {
        "code": 0,
        "data": "data",
        "log": "log",
        "gas_used": 5000,
        "gas_wanted": 10000,
        "info": "info",
        "tags": [
          "",
          ""
        ]
      },
      "deliver_tx": {
        "code": 5,
        "data": "data",
        "log": "log",
        "gas_used": 5000,
        "gas_wanted": 10000,
        "info": "info",
        "tags": [
          "",
          ""
        ]
      },
      "hash": "EE5F3404034C524501629B56E0DDC38FAD651F04",
      "height": 0
    }

 */
var broadcast_transaction = function (rawTx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, url, config, response, txid, error_1, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | broadcast_transaction | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    log.debug(tag, "tx: ", rawTx);
                    log.debug(tag, "tx: ", typeof (rawTx));
                    url = 'https://dex.binance.org/api/v1/broadcast?sync=true';
                    config = {
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, axios.post(url, rawTx, config)];
                case 3:
                    response = _a.sent();
                    console.log(response.data);
                    txid = response.data[0].hash;
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error(error_1);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 7];
                case 6:
                    e_9 = _a.sent();
                    //log.error(tag,"e: ",{e})
                    log.error(tag, e_9);
                    log.error(tag, e_9.response);
                    log.error(tag, e_9.response.data);
                    log.error(tag, e_9.response.data.error);
                    output.success = false;
                    output.error = e_9;
                    return [2 /*return*/, output];
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_node_info = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, chaind, bnbncli, bnbncliRemote, e_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_BNBchaind + '/abci_info' })];
                case 2:
                    chaind = _a.sent();
                    log.debug(tag, "chaind: ", chaind.data);
                    output.bnbchaind = chaind.data;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_BNBcli + '/version' })];
                case 3:
                    bnbncli = _a.sent();
                    log.debug(tag, "bnbncli: ", bnbncli.data);
                    output.bnbncli = bnbncli.data;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_REMOTE + '/abci_info' })];
                case 4:
                    bnbncliRemote = _a.sent();
                    log.debug(tag, "bnbncliRemote: ", bnbncliRemote.data.result);
                    output.bnbncliRemote = bnbncliRemote.data;
                    return [2 /*return*/, output];
                case 5:
                    e_10 = _a.sent();
                    //log.error(tag,"e: ",{e})
                    output.success = false;
                    output.error = e_10;
                    return [2 /*return*/, output];
                case 6: return [2 /*return*/];
            }
        });
    });
};
var get_node_syncing = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL + '/syncing' })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_11 = _a.sent();
                    //log.error(tag,"e: ",{e})
                    output.success = false;
                    output.error = e_11;
                    return [2 /*return*/, output];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_node_version = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_BNBcli + '/version' })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_12 = _a.sent();
                    //log.error(tag,"e: ",{e})
                    output.success = false;
                    output.error = e_12;
                    return [2 /*return*/, output];
                case 4: return [2 /*return*/];
            }
        });
    });
};
/*


    txid:'66b0b99ee373064cdf8ce24b86b45c087ae50f5eaa32d2ee24dd26e39a5e3455',
    status: 'confirmed',
    type: 'send',
    amount: -78602,
    date: '2019-05-10T21:01:23Z',
    confirmations: 1055,
    network: 'BTC',
    xpub:'xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4'


 */
var normalize_tx = function (tx, type) {
    var output = {};
    //
    output.txid = tx.txhash;
    output.height = tx.height;
    if (tx.height)
        output.status = "confirmed";
    output.type = "transfer";
    var event = {};
    //TODO my god this is ugly? and does it always work?
    if (type === 'send') {
        event.amount = tx.tx.value.msg[0].value.amount[0].amount * -1;
    }
    else {
        event.amount = tx.tx.value.msg[0].value.amount[0].amount;
    }
    output.date = tx.timestamp;
    output.network = ASSET;
    output.symbol = 'ATOM';
    output.coin = 'ATOM';
    output.height = tx.height;
    output.gas_used = tx.gas_used;
    output.gas_wanted = tx.gas_wanted;
    return output;
};
var getTransaction = function (txid) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, selected, txInfo, e_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | getTransaction | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    selected = void 0;
                    //rand 1-4
                    if (ROUND_ROBIN_STATE.length == 0) {
                        //add all 5
                        ROUND_ROBIN_STATE.push(URL_DEX_0);
                        ROUND_ROBIN_STATE.push(URL_DEX_1);
                        ROUND_ROBIN_STATE.push(URL_DEX_2);
                        ROUND_ROBIN_STATE.push(URL_DEX_3);
                        selected = URL_DEX_0;
                    }
                    else {
                        //pop at random
                        selected = ROUND_ROBIN_STATE.pop();
                    }
                    return [4 /*yield*/, axios({ method: 'GET', url: selected + '/api/v1/tx/' + txid + "?format=json" })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    //
                    // let txInfo = await axios({method:'GET',url:URL_DEX+'/api/v1/tx/'+txid+"?format=json"})
                    // log.debug(tag,"txInfo: ",txInfo.data)
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_13 = _a.sent();
                    //log.error(tag,"e: ",{e})
                    output.success = false;
                    output.error = e_13;
                    return [2 /*return*/, output];
                case 4: return [2 /*return*/];
            }
        });
    });
};
