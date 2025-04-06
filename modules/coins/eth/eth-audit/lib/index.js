"use strict";
/*
    Digest transaction data into credit/debits

    Maintain atlas of known contracts and events

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
var TAG = " | audit | ";
var log = require('@pioneer-platform/loggerdog')();
var util = require('ethereumjs-util');
var BASE = 1000000000000000000;
var Web3 = require('web3');
module.exports = {
    auditTransaction: function (txInfo, source) {
        return audit_transaction(txInfo, source);
    },
    auditReceipt: function (contract, receipt) {
        return audit_receipt(contract, receipt);
    },
    auditTrace: function (trace) {
        return audit_trace_receipt(trace);
    },
    auditTokenTransfer: function (tokenTxInfo) {
        return audit_token_transfer(tokenTxInfo);
    },
};
/*
    Sablier Contract audit

    TODO gneratic import from atlas
 */
var audit_sablier_create = function (contract, receipt) {
    var tag = TAG + " | audit_sablier_create | ";
    try {
        return true;
    }
    catch (e) {
        throw tag + e;
    }
};
var audit_receipt = function (contract, receipt) {
    var _a, _b;
    var tag = TAG + " | audit_receipt | ";
    try {
        log.debug(tag, "contract: ", contract);
        log.debug(tag, "receipt.logs: ", receipt.logs);
        log.debug(tag, "receipt last : ", receipt.logs[6]);
        if (contract === 'sablier (proxy)' && receipt.logs.length === 7) {
            log.debug(tag, "receipt.logs: ", receipt.logs.length);
            // let streamStart = receipt.logs[5].address
            log.debug(tag, "receipt.receipt: ", receipt);
            //token
            var streamAsset = receipt.logs[0].address;
            log.debug(tag, "streamAsset: ", streamAsset);
            var streamAmount = receipt.logs[0].data;
            log.debug(tag, "streamAmount: ", streamAmount);
            streamAmount = util.unpadHexString(streamAmount);
            log.debug(tag, "streamAmount: ", streamAmount);
            streamAmount = parseInt(streamAmount, 16);
            log.debug(tag, "streamAmount: ", streamAmount);
            //get address
            var recipient = (_a = receipt.logs[5]) === null || _a === void 0 ? void 0 : _a.topics[3];
            log.debug(tag, "recipient: ", recipient);
            recipient = util.unpadHexString(recipient);
            log.debug(tag, "recipient: ", recipient);
            //repad
            recipient = "0x" + recipient;
            var saleryId = (_b = receipt.logs[6]) === null || _b === void 0 ? void 0 : _b.topics[1];
            log.debug(tag, "saleryId: ", saleryId);
            saleryId = util.unpadHexString(saleryId);
            log.debug(tag, "saleryId: ", saleryId);
            saleryId = parseInt(saleryId, 16);
            log.debug(tag, "saleryId: ", saleryId);
            var txid = receipt.logs[0].transactionHash;
            var logId = receipt.logs[0].id;
            var blockNumber = receipt.logs[0].blockNumber;
            var txFinal = {};
            //indexs for search
            txFinal.asset = "saleryId:" + saleryId;
            txFinal.Type = 'streamCreate';
            txFinal.logId = logId;
            txFinal.ecr20 = false;
            txFinal.ecr721 = false;
            txFinal.txid = txid;
            if (!txFinal.txid)
                throw Error("Invalid tx! missing txid! ");
            txFinal.addresses = [];
            txFinal.events = [];
            txFinal.type = "transfer";
            txFinal.height = blockNumber;
            txFinal.addresses.push(recipient);
            txFinal.tags = [
                recipient,
                'streamCreate',
                'stream',
                'credit',
                logId
            ];
            //event, create asset class stream
            var eventCredit = {
                type: "credit",
                address: recipient,
                amount: 1,
                asset: 'stream',
                stream: {
                    saleryId: saleryId,
                    streamAsset: streamAsset,
                    streamAmount: streamAmount,
                    // streamStart,
                    // streamStop
                },
                txid: txid
            };
            //TODO debit erc20 from sender
            txFinal.events.push(eventCredit);
            // txFinal.events.push(eventDebit)
            //txFinal.events.push(eventFee)
            return txFinal;
        }
        else {
            //unknown
            return {
                type: 'unknown',
                contract: contract,
            };
        }
    }
    catch (e) {
        throw e;
    }
};
/*
    Token transfer


 { block: '10008638',
  token: 'SAI',
  transaction:
   { contractAddress: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
     confirmed: true,
     blockHash:
      '0xa72ddb5c241a62511d9435ab65ae8c85d0d269f1afd8c9ebf8571546d8accec3',
     blockNumber: 10008638,
     from: '0xc45d23f7f6fdb991cfdad1acd15381874f9e0120',
     to: '0x8134d518e0cef5388136c0de43d7e12278701ac5',
     amount: 0.4179204961215084,
     txid:
      '0x1b17a2df6d3f13a44b9ee21835eba764022abcc127e65dd291f3ac9c996c8fc5',
     index: 75 } }

 */
var audit_token_transfer = function (tokenTxInfo) {
    var tag = TAG + " | audit_transaction | ";
    try {
        var txFinal = {};
        //indexs for search
        txFinal.asset = tokenTxInfo.token;
        txFinal.txid = tokenTxInfo.transaction.txid;
        if (!txFinal.txid)
            throw Error("Invalid tx! missing txid! ");
        txFinal.addresses = [];
        txFinal.events = [];
        txFinal.type = "transfer";
        txFinal.height = parseInt(tokenTxInfo.block);
        //if no logs, then not token transfer
        if (tokenTxInfo.receipt.logs.length === 0) {
            //Not an erc20 transfer
        }
        else {
            txFinal.addresses.push(tokenTxInfo.transaction.to);
            txFinal.addresses.push(tokenTxInfo.transaction.from);
            //2 events, send receive
            var eventCredit = {
                type: "credit",
                address: tokenTxInfo.transaction.to,
                amount: tokenTxInfo.transaction.amount,
                asset: tokenTxInfo.token,
                txid: tokenTxInfo.transaction.txid
            };
            var eventDebit = {
                type: "debit",
                address: tokenTxInfo.transaction.from,
                amount: tokenTxInfo.transaction.amount * -1,
                asset: tokenTxInfo.token,
                txid: tokenTxInfo.transaction.txid
            };
            // let eventFee = {
            //     type:"debit",
            //     asset:"ETH", //Fees paid in ETH
            //     fee:true,
            //     address:tokenTxInfo.transaction.from,
            //     //amount:tx.gas_wanted / 1000, // NOTE mintscan shows fees as wanted. default fee currently 2x gas used
            //     txid
            // }
            txFinal.events.push(eventCredit);
            txFinal.events.push(eventDebit);
            //txFinal.events.push(eventFee)
        }
        return txFinal;
    }
    catch (e) {
        throw tag + e;
    }
};
/*

 */
var audit_transaction = function (txInfo, source) {
    var tag = TAG + " | audit_transaction | ";
    try {
        var tx = {};
        var txFinal = {};
        if (!source || source !== 'etherscan') {
            //if token
            if (txInfo.token) {
                //tx.value = txInfo.receipt.value
                tx.from = txInfo.receipt.from;
                //decode erc20 transfer info
                //TODO for each log?
                //transfer
                var topic = txInfo.receipt.logs[0].topics[0];
                if (topic !== "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef")
                    throw Error(' Not erc20 token! ');
                tx.value = txInfo.receipt.logs[0].data;
                tx.to = txInfo.receipt.logs[0].topics[2];
                log.debug(tag, "tx.to: ", tx.to);
                //if ERC20
                //Remove padding?
                tx.to = tx.to.replace("0000000000000000000000000", 0);
            }
        }
        else {
            if (txInfo.tokenSymbol) {
                txInfo.asset = txInfo.tokenSymbol;
            }
            if (!txInfo.asset)
                txInfo.asset = 'ETH';
            //indexs for search
            txFinal.asset = txInfo.asset;
            txFinal.txid = txInfo.hash;
            if (!txFinal.txid)
                throw Error("Invalid tx! missing txid! ");
            txFinal.addresses = [];
            txFinal.events = [];
            txFinal.type = "transfer";
            txFinal.time = txInfo.timeStamp;
            txFinal.height = parseInt(txInfo.blockNumber);
            txFinal.addresses.push(txInfo.to);
            txFinal.addresses.push(txInfo.from);
            var amount = void 0;
            if (txInfo.asset === 'ETH') {
                amount = txInfo.value / BASE;
            }
            else {
                amount = txInfo.value / Math.pow(10, parseInt(txInfo.tokenDecimal));
            }
            //2 events, send receive
            var eventCredit = {
                type: "credit",
                address: txInfo.to,
                amount: amount,
                asset: txInfo.asset,
            };
            var eventDebit = {
                type: "debit",
                address: txInfo.from,
                amount: amount * -1,
                asset: txInfo.asset,
            };
            //TODO get eth amount from gasUsed and gasPrice
            // let eventFee = {
            //     type:"debit",
            //     asset:"ETH", //Fees paid in ETH
            //     fee:true,
            //     address:tokenTxInfo.transaction.from,
            //     //amount:tx.gas_wanted / 1000, // NOTE mintscan shows fees as wanted. default fee currently 2x gas used
            //     txid
            // }
            txFinal.events.push(eventCredit);
            txFinal.events.push(eventDebit);
        }
        return txFinal;
    }
    catch (e) {
        throw tag + e;
    }
};
/*

 { block: '10027762',
  hash:
   '0xa6d85beba4bbb3c0d1e6e8250371807bba48826271052f64e4b61ca84d570ff0',
  trace:
   { action:
      { callType: 'call',
        from: '0x33b35c665496ba8e71b22373843376740401f106',
        gas: '0x0',
        input: '0x',
        to: '0x079f8bb0102759fb2f6247382be7e40f77899e6b',
        value: '0x2386f26fc10000' },
     blockHash:
      '0xa6d85beba4bbb3c0d1e6e8250371807bba48826271052f64e4b61ca84d570ff0',
     blockNumber: 10027762,
     result: { gasUsed: '0x0', output: '0x' },
     subtraces: 0,
     traceAddress: [],
     transactionHash:
      '0x8ce7593d82220399f4632c2496bbad784aa80699b30c99b179898b6fe93443c7',
     transactionPosition: 9,
     type: 'call' } }


 */
var audit_trace_receipt = function (trace) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, txFinal, amount, eventCredit, eventDebit;
        return __generator(this, function (_a) {
            tag = TAG + " | audit_trace_receipt | ";
            try {
                txFinal = {};
                //indexs for search
                txFinal.asset = "ETH";
                txFinal.addresses = [];
                txFinal.events = [];
                txFinal.type = "transfer";
                txFinal.height = parseInt(trace.block);
                txFinal.txid = trace.trace.transactionHash;
                if (!txFinal.txid)
                    throw Error("102: invalid tx trace! need txid");
                txFinal.addresses.push(trace.trace.action.to);
                txFinal.addresses.push(trace.trace.action.from);
                amount = parseInt(trace.trace.action.value, 16) / BASE;
                eventCredit = {
                    type: "credit",
                    address: trace.trace.action.to,
                    amount: amount,
                    txid: trace.trace.transactionHash
                };
                eventDebit = {
                    type: "debit",
                    address: trace.trace.action.from,
                    amount: amount * -1,
                    txid: trace.trace.transactionHash
                };
                // let eventFee = {
                //     type:"debit",
                //     asset:"ETH", //Fees paid in ETH
                //     fee:true,
                //     address:tokenTxInfo.transaction.from,
                //     //amount:tx.gas_wanted / 1000, // NOTE mintscan shows fees as wanted. default fee currently 2x gas used
                //     txid
                // }
                txFinal.events.push(eventCredit);
                txFinal.events.push(eventDebit);
                //txFinal.events.push(eventFee)
                return [2 /*return*/, txFinal];
            }
            catch (e) {
                throw tag + e;
            }
            return [2 /*return*/];
        });
    });
};
