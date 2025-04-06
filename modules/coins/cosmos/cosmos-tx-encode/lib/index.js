"use strict";
/*
    cosmos-tx-encoder

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
var TAG = " | cosmos-tx-encoder | ";
var proto_signing_1 = require("@cosmjs/proto-signing");
var tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
var keys_1 = require("cosmjs-types/cosmos/crypto/secp256k1/keys");
var tx_2 = require("cosmjs-types/cosmos/bank/v1beta1/tx");
var prettyjson = require('prettyjson');
module.exports = {
    encodeTx: function (tx) {
        return encode_transaction(tx);
    }
};
/**********************************
 // Lib
 //**********************************/
var encode_transaction = function (tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, registry, txBody, decodedTxBody, broadCastTx, encodedTx, decodedTx, realBroadcast;
        return __generator(this, function (_a) {
            tag = TAG + " | encode_transaction | ";
            try {
                registry = new proto_signing_1.Registry();
                txBody = registry.encode({
                    typeUrl: "/cosmos.tx.v1beta1.TxBody",
                    // @ts-ignore
                    value: {
                        // @ts-ignore
                        messages: tx.msg.map(function (_a) {
                            var type = _a.type, value = _a.value;
                            switch (type) {
                                case "cosmos-sdk/MsgSend":
                                    return {
                                        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                                        value: {
                                            fromAddress: value.from_address,
                                            toAddress: value.to_address,
                                            amount: value.amount,
                                        }
                                    };
                                default: throw new Error("wat");
                            }
                        }),
                        memo: tx.memo
                    }
                });
                console.log("txBody: ", txBody);
                decodedTxBody = registry.decodeTxBody(txBody);
                console.log("decodedTxBody: ", decodedTxBody);
                broadCastTx = tx_1.Tx.fromJSON({
                    body: {
                        // @ts-ignore
                        messages: tx.msg.map(function (_a) {
                            var type = _a.type, value = _a.value;
                            switch (type) {
                                case "cosmos-sdk/MsgSend":
                                    return {
                                        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                                        // @ts-ignore
                                        value: Buffer.from(tx_2.MsgSend.encode(tx_2.MsgSend.fromJSON({
                                            fromAddress: value.from_address,
                                            toAddress: value.to_address,
                                            amount: value.amount,
                                        })).finish()).toString("base64")
                                    };
                                default: throw new Error("wat");
                            }
                        }),
                        memo: tx.memo
                    },
                    authInfo: {
                        // @ts-ignore
                        signerInfos: tx.signatures.map(function (_a) {
                            var sequence = _a.sequence, pub_key = _a.pub_key;
                            switch (pub_key.type) {
                                case "tendermint/PubKeySecp256k1":
                                    console.log("sequence: ", sequence);
                                    return {
                                        publicKey: {
                                            typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                                            value: Buffer.from(keys_1.PubKey.encode(keys_1.PubKey.fromJSON({
                                                key: pub_key.value
                                            })).finish()).toString("base64")
                                        },
                                        modeInfo: {
                                            single: {
                                                mode: "SIGN_MODE_LEGACY_AMINO_JSON"
                                            }
                                        },
                                        sequence: "17",
                                    };
                                default: throw new Error("wat");
                            }
                        }),
                        fee: {
                            amount: tx.fee.amount,
                            gasLimit: tx.fee.gas,
                        }
                    },
                    // @ts-ignore
                    signatures: tx.signatures.map(function (_a) {
                        var signature = _a.signature;
                        return signature;
                    })
                });
                encodedTx = tx_1.Tx.encode(broadCastTx).finish();
                decodedTx = tx_1.Tx.decode(encodedTx);
                console.log("decodedTx: ", tx_1.Tx.toJSON(decodedTx));
                // console.log("decodedTx: ",JSON.stringify(Tx.toJSON(decodedTx)))
                console.log("decodedTx: (pretty) ", prettyjson.render(tx_1.Tx.toJSON(decodedTx), {
                    dashColor: 'magenta',
                    stringColor: 'white',
                    multilineStringColor: 'cyan'
                }));
                console.log("decodedTx: (JSON) ", JSON.parse(JSON.stringify(tx_1.Tx.toJSON(decodedTx))));
                console.log("decodedTx: (String) ", JSON.stringify(tx_1.Tx.toJSON(decodedTx)));
                realBroadcast = Buffer.from(tx_1.TxRaw.encode(tx_1.TxRaw.fromJSON({
                    // @ts-ignore
                    bodyBytes: Buffer.from(tx_1.TxBody.encode(broadCastTx.body).finish()).toString("base64"),
                    // @ts-ignore
                    authInfoBytes: Buffer.from(tx_1.AuthInfo.encode(broadCastTx.authInfo).finish()).toString("base64"),
                    // @ts-ignore
                    signatures: broadCastTx.signatures.map(function (x) {
                        console.log("x: ", x);
                        return Buffer.from(x).toString("base64");
                    })
                })).finish()).toString("base64");
                console.log("realBroadcast: ", realBroadcast);
                return [2 /*return*/, realBroadcast
                    // @ts-ignore
                ];
                // @ts-ignore
            }
            catch (e) {
                throw Error(e);
            }
            return [2 /*return*/];
        });
    });
};
