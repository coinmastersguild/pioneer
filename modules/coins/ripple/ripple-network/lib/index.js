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
Object.defineProperty(exports, "__esModule", { value: true });
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
// const axiosRetry = require('axios-retry');
// axiosRetry(axios, {
//     retries: 3, // number of retries
//     retryDelay: (retryCount: number) => {
//         console.log(`retry attempt: ${retryCount}`);
//         return retryCount * 2000; // time interval between retries
//     },
//     retryCondition: (error: { response: { status: number; }; }) => {
//         console.error(error)
//         // if retry condition is not specified, by default idempotent requests are retried
//         return error.response.status === 503;
//     },
// });
var xrpl = require("xrpl");
var log = require('@pioneer-platform/loggerdog')();
var URL_THORNODE = process.env['URL_THORNODE'] || 'https://thornode.ninerealms.com';
//let URL_MIDGARD = process.env['URL_THORNODE'] || 'https://testnet.midgard.thorchain.info/v2'
var BASE_THOR = 100000000;
/**********************************
 // Module
 //**********************************/
var client;
var URL_NODE = "https://xrplcluster.com";
//https://s1.ripple.com:51234
// let URL_NODE = "https://s1.ripple.com:51234"
module.exports = {
    init: function (url, settings) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
                        client = new xrpl.Client("wss://xrplcluster.com/");
                        // console.log(client)
                        return [4 /*yield*/, client.connect()];
                    case 1:
                        // console.log(client)
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    },
    isOnline: function () {
        return true;
    },
    // info:function () {
    //     return get_node_info_verbose();
    // },
    getBalance: function (address) {
        return get_balance(address);
    },
    getAccount: function (address) {
        return get_account_info(address);
    },
    // getLastBlock:function () {
    //     return get_last_block();
    // },
    // getBlockHeight:function () {
    //     return get_block_height();
    // },
    // getAccountInfo:function (address:string) {
    //     return get_account_info(address);
    // },
    // txs: function (address:string) {
    //     return get_txs_by_address(address);
    // },
    // getTransaction: function (txid:string) {
    //     return get_transaction(txid);
    // },
    // transaction: function (txid:string) {
    //     return get_transaction(txid);
    // },
    broadcast: function (tx) {
        return broadcast_transaction(tx);
    },
};
/**********************************
 // Lib
 //**********************************/
// let get_last_block = async function(){
//     let tag = TAG + " | get_last_block | "
//     try{
//
//         let lastBlock = await axios({method:'GET',url: URL_THORNODE+'/blocks/latest'})
//         log.debug(tag,"lastBlock: ",lastBlock.data)
//
//         return lastBlock.data.block
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }
//
// let get_block_height = async function(){
//     let tag = TAG + " | get_block_height | "
//     try{
//
//         let lastBlock = await axios({method:'GET',url: URL_THORNODE+'/blocks/latest'})
//         log.debug(tag,"lastBlock: ",lastBlock.data)
//
//         return lastBlock.data.block.header.height
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }
//
// let get_transaction = async function(txid:string){
//     let tag = TAG + " | get_transaction | "
//     try{
//         let txInfo = await axios({method:'GET',url:  URL_THORNODE+'/txs/'+txid})
//         log.debug(tag,"txInfo: ",txInfo.data)
//         return txInfo.data
//     }catch(e){
//         // log.error(tag,e.response.data)
//         // log.error(tag,e.response.data.error)
//         if(e.response.status === 404){
//             let output:any = {}
//             output.success = false
//             output.error = e.response.data.error
//             return output
//         } else {
//             throw Error(e)
//         }
//     }
// }
var broadcast_transaction = function (tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, buffer, bufString, data, urlRemote, result, responseData, resultObject, txJson, txid, engineResult, engineResultCode, engineResultMessage, validatedLedgerIndex, accountSequenceNext, applied, wasSuccessful, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | broadcast_transaction | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.debug(tag, "CHECKPOINT 1");
                    buffer = Buffer.from(tx, 'base64');
                    bufString = buffer.toString('hex');
                    output.success = false;
                    data = {
                        'method': 'submit',
                        "id": 2,
                        "command": "submit",
                        "fail_hard": true,
                        'params': [
                            {
                                'tx_blob': bufString
                            }
                        ]
                    };
                    urlRemote = URL_NODE + '/';
                    log.debug(tag, "urlRemote: ", urlRemote);
                    return [4 /*yield*/, axios({
                            url: urlRemote,
                            headers: {},
                            method: 'POST',
                            data: data,
                        })];
                case 2:
                    result = _a.sent();
                    log.info(tag, '** Broadcast ** REMOTE: result: ', result.data);
                    log.info(tag, '** Broadcast ** REMOTE: result: ', JSON.stringify(result.data));
                    responseData = result.data || {};
                    resultObject = responseData.result || {};
                    txJson = resultObject.tx_json || {};
                    txid = txJson.hash;
                    engineResult = resultObject.engine_result;
                    engineResultCode = resultObject.engine_result_code;
                    engineResultMessage = resultObject.engine_result_message;
                    validatedLedgerIndex = resultObject.validated_ledger_index;
                    accountSequenceNext = resultObject.account_sequence_next;
                    applied = resultObject.applied;
                    wasSuccessful = (engineResult === 'tesSUCCESS' && engineResultCode === 0);
                    output = {
                        success: wasSuccessful,
                        txid: txid,
                        engineResult: engineResult,
                        engineResultCode: engineResultCode,
                        engineResultMessage: engineResultMessage,
                        validatedLedgerIndex: validatedLedgerIndex,
                        accountSequenceNext: accountSequenceNext,
                        applied: applied
                    };
                    return [2 /*return*/, output];
                case 3:
                    e_1 = _a.sent();
                    console.error(tag, "throw error: ", e_1);
                    // output.success is false by default here
                    return [2 /*return*/, output];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_account_info = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, response, ledgerIndexCurrent, output, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_account_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, client.request({
                            "command": "account_info",
                            "account": address,
                            "ledger_index": "validated"
                        })
                        //get recent ledger as well
                    ];
                case 2:
                    response = _a.sent();
                    return [4 /*yield*/, client.getLedgerIndex()];
                case 3:
                    ledgerIndexCurrent = _a.sent();
                    output = response.result.account_data;
                    output.ledger_index_current = ledgerIndexCurrent;
                    return [2 /*return*/, output];
                case 4:
                    e_2 = _a.sent();
                    log.error(tag, "e: ", e_2);
                    throw e_2;
                case 5: return [2 /*return*/];
            }
        });
    });
};
// let normalize_tx = function(tx:any,address?:string){
//     let tag = TAG + " | normalize_tx | "
//     try{
//         let output:any = {}
//
//         let sender
//         let receiver
//         let memo
//         let amount
//
//         let rawlog = JSON.parse(tx.raw_log)
//         rawlog = rawlog
//         //log.debug("rawlog: ",rawlog)
//
//         //txTypes
//         let txTypes = [
//             'send',
//             'receive',
//             'governence',
//             'swap',
//             'other'
//         ]
//
//         for(let i = 0; i < rawlog.length; i++){
//             let txEvents = rawlog[i]
//
//             //log.debug(tag,"txEvents: ",txEvents)
//             txEvents = txEvents.events
//
//             for(let j = 0; j < txEvents.length; j++){
//                 let event = txEvents[j]
//
//                 //
//                 //log.debug(tag,"event: ",event)
//                 //log.debug(tag,"attributes: ",prettyjson.render(event.attributes))
//
//                 //detect event type
//                 log.debug(tag,"type: ",event.type)
//                 switch(event.type) {
//                     case 'message':
//                         // ignore
//                         break;
//                     case 'transfer':
//                         log.debug(tag,"attributes: ",event.attributes)
//                         for(let k = 0; k < event.attributes.length; k++){
//                             let attribute = event.attributes[k]
//                             if(attribute.key === 'recipient'){
//                                 receiver = attribute.value
//                                 output.receiver = receiver
//                                 if(receiver === address) output.type = txTypes[1]
//                             }
//                             if(attribute.key === 'sender'){
//                                 sender = attribute.value
//                                 output.sender = sender
//                                 if(sender === address) output.type = txTypes[0]
//                             }
//                             if(attribute.key === 'amount'){
//                                 amount = attribute.value
//                                 amount = amount.replace('rune','')
//                                 output.amount = amount / 100000000
//                             }
//                         }
//                         break;
//                     default:
//                     // code block
//                 }
//             }
//
//             // console.log("log: ",prettyjson.render(log))
//         }
//
//         return output
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }
//
// let get_txs_by_address = async function(address:string){
//     let tag = TAG + " | get_txs_by_address | "
//     try{
//         let output:any = []
//
//         //sends
//         let url = URL_THORNODE+ '/txs?message.sender='+address
//         log.debug(tag,"url: ",url)
//         let resultSends = await axios({
//             url: url,
//             method: 'GET'
//         })
//         let sends = resultSends.data
//         log.debug('sends: ', sends)
//         if(!sends.txs) sends.txs = []
//         // TODO//pagnation
//         for(let i = 0; i < sends?.txs.length; i++ ){
//             let tx = sends.txs[i]
//
//             //pretty json
//
//             //normalize
//             tx = normalize_tx(tx,address)
//             output.push(tx)
//         }
//
//         //receives
//         url = URL_THORNODE+ '/txs?transfer.recipient='+address
//         console.log("URL_THORNODE: ",url)
//         let resultRecieves = await axios({
//             url: url,
//             method: 'GET'
//         })
//         let receives = resultRecieves.data
//         if(!receives.txs) receives.txs = []
//         log.debug('receives: ', receives)
//
//         for(let i = 0; i < receives?.txs.length; i++ ){
//             let tx = receives.txs[i]
//             //normalize
//             tx = normalize_tx(tx,address)
//             output.push(tx)
//         }
//
//
//         return output
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }
var get_balance = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, response, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_balance | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = 0;
                    return [4 /*yield*/, client.request({
                            "command": "account_info",
                            "account": address,
                            "ledger_index": "validated"
                        })
                        // console.log(response)
                        // console.log(response.result)
                        // console.log(response.result.account_data)
                        // console.log(response.result.account_data.Account)
                        // console.log(response.result.account_data.Balance)
                        // console.log(response.result.account_data.Balance / 1000000)
                    ];
                case 2:
                    response = _a.sent();
                    // console.log(response)
                    // console.log(response.result)
                    // console.log(response.result.account_data)
                    // console.log(response.result.account_data.Account)
                    // console.log(response.result.account_data.Balance)
                    // console.log(response.result.account_data.Balance / 1000000)
                    response.result.account_data.Balance = parseFloat(response.result.account_data.Balance) / 1000000;
                    return [2 /*return*/, response.result.account_data.Balance];
                case 3:
                    e_3 = _a.sent();
                    log.error(tag, "e: ", e_3);
                    throw e_3;
                case 4: return [2 /*return*/];
            }
        });
    });
};
// let get_node_info_verbose = async function(){
//     let tag = TAG + " | get_node_info | "
//     try{
//         let output:any = {}
//
//         //get syncing status
//         let syncInfo = await axios({method:'GET',url: URL_THORNODE+'/syncing'})
//         log.debug(tag,"syncInfo: ",syncInfo.data)
//
//         output.isSyncing = syncInfo.data
//
//         //gaiad abci_info
//         let nodeInfo = await axios({method:'GET',url: URL_THORNODE+'/node_info'})
//         log.debug(tag,"nodeInfo: ",nodeInfo.data)
//         output = nodeInfo.data
//
//         // let network = await axios({method:'GET',url: URL_THORNODE+'/network'})
//         // log.debug(tag,"nodeInfo: ",network.data)
//         // output.network = network.data
//
//
//         let lastBlock = await axios({method:'GET',url: URL_THORNODE+'/blocks/latest'})
//         log.debug(tag,"lastBlock: ",lastBlock.data)
//
//         //let height
//         output.height = lastBlock.data.block.header.height
//
//         return output
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }
