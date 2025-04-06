"use strict";
/*
    TX builder
        Normalizing tx building


https://tutorials.cosmos.network/academy/4-my-own-chain/cosmjs.html


https://github.com/cosmos/cosmjs/blob/main/packages/stargate/CUSTOM_PROTOBUF_CODECS.md

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
var TAG = " | osmosis-tx-builder | ";
var proto_signing_1 = require("@cosmjs/proto-signing");
var stargate_1 = require("@cosmjs/stargate");
var proto_signing_2 = require("@cosmjs/proto-signing");
var tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
// import {
//     BaseAccount,
//     cosmos,
//     google,
//     TendermintTxTracer,
// } from "@keplr-wallet/cosmos";
// A message type auto-generated from .proto files using ts-proto. @cosmjs/stargate ships some
// common types but don't rely on those being available. You need to set up your own code generator
// for the types you care about. How this is done should be documented, but is not yet:
// https://github.com/cosmos/cosmjs/issues/640
var log = require('@pioneer-platform/loggerdog')();
module.exports = {
    signTx: function (to, from, amount, memo, seed) {
        return sign_transaction(to, from, amount, memo, seed);
    }
};
/**********************************
 // Lib
 //**********************************/
// let getHdWallet = async function(chainId:string, mnemonic:string): Promise<any>{
//     try{
//         let wallet = await Secp256k1HdWallet.fromMnemonic(
//             mnemonic,
//             makeCosmoshubPath(0)
//         );
//
//         return wallet
//     }catch(e){
//         throw Error(e)
//     }
// }
//
// let sign_amino = async function(signerAddress: string, signDoc: StdSignDoc, chainId:string): Promise<any>{
//     try{
//         //sign_amino
//         if (chainId !== signDoc.chain_id) {
//             throw new Error("Unmatched chain id with the offline signer");
//         }
//
//         //
//         const hdWallet = await getHdWallet(chainId);
//
//     }catch(e){
//         throw Error(e)
//     }
// }
var sign_transaction = function (to, from, amount, memo, seed) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, chainId, rpcEndpoint, gasPrice, client, accountInfo, msgSend, msg, gasLimit, fee, txData, signerData, wallet, clientOffline, txRaw, txBytes, e_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tag = TAG + " | sign_transaction | ";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 8, , 9]);
                    chainId = "cosmoshub-4";
                    rpcEndpoint = process.env['URL_GAIAD_RPC'];
                    console.log("rpcEndpoint: ", rpcEndpoint);
                    gasPrice = stargate_1.GasPrice.fromString("0.0025uatom");
                    return [4 /*yield*/, stargate_1.StargateClient.connect(rpcEndpoint)];
                case 2:
                    client = _b.sent();
                    return [4 /*yield*/, client.getAccount(from)];
                case 3:
                    accountInfo = _b.sent();
                    log.debug(tag, "accountInfo: ", accountInfo);
                    msgSend = {
                        fromAddress: from,
                        toAddress: "cosmos19rvl6ja9h0erq9dc2xxfdzypc739ej8k5esnhg",
                        amount: (0, proto_signing_2.coins)(1234, "ucosm"),
                    };
                    msg = {
                        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                        value: msgSend,
                    };
                    gasLimit = 200000;
                    fee = {
                        amount: (0, proto_signing_2.coins)(2000, "ucosm"),
                        gas: gasLimit.toString(),
                    };
                    _a = {
                        // @ts-ignore
                        accountNumber: accountInfo.accountNumber,
                        // @ts-ignore
                        sequence: accountInfo.sequence
                    };
                    return [4 /*yield*/, client.getChainId()];
                case 4:
                    txData = (_a.chainId = _b.sent(),
                        _a.msgs = [msg],
                        _a.fee = fee,
                        _a.memo = "Use your tokens wisely",
                        _a);
                    signerData = {
                        accountNumber: txData.accountNumber,
                        sequence: txData.sequence,
                        chainId: txData.chainId,
                    };
                    return [4 /*yield*/, proto_signing_1.DirectSecp256k1HdWallet.fromMnemonic(seed)];
                case 5:
                    wallet = _b.sent();
                    return [4 /*yield*/, stargate_1.SigningStargateClient.offline(wallet)];
                case 6:
                    clientOffline = _b.sent();
                    return [4 /*yield*/, clientOffline.sign(from, txData.msgs, txData.fee, txData.memo, signerData)];
                case 7:
                    txRaw = _b.sent();
                    console.log("txRaw: ", txRaw);
                    txBytes = tx_1.TxRaw.encode(txRaw).finish().toString("base64");
                    console.log("txBytes: ", txBytes);
                    return [3 /*break*/, 9];
                case 8:
                    e_1 = _b.sent();
                    throw Error(e_1);
                case 9: return [2 /*return*/];
            }
        });
    });
};
