"use strict";
/*
    TX builder
        Normalizing tx building

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
var TAG = " | kava-tx-builder | ";
var cosmosjs = require("@cosmostation/cosmosjs");
var log = require('@pioneer-platform/loggerdog')();
module.exports = {
    signTx: function (to, from, amount, memo, seed) {
        return sign_transaction(to, from, amount, memo, seed);
    }
};
/**********************************
 // Lib
 //**********************************/
var sign_transaction = function (to, from, amount, memo, seed) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, chainId, kava, ecpairPriv, accountInfo, stdSignMsg, signedTx, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | sign_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    chainId = "kava-6";
                    kava = cosmosjs.network("https://lcd-kava.keplr.app", chainId);
                    ecpairPriv = kava.getECPairPriv(seed);
                    log.debug(tag, "ecpairPriv: ", ecpairPriv);
                    return [4 /*yield*/, kava.getAccounts(from)];
                case 2:
                    accountInfo = _a.sent();
                    stdSignMsg = kava.newStdMsg({
                        msgs: [
                            {
                                type: "cosmos-sdk/MsgSend",
                                value: {
                                    amount: [
                                        {
                                            amount: String(100000), // 6 decimal places (1000000 ukava = 1 KAVA)
                                            denom: "ukava"
                                        }
                                    ],
                                    from_address: from,
                                    to_address: to
                                }
                            }
                        ],
                        chain_id: chainId,
                        fee: { amount: [{ amount: String(5000), denom: "ukava" }], gas: String(200000) },
                        memo: "",
                        account_number: String(accountInfo.result.value.account_number), // If the address is a vesting account, use account_number of base_vesting_account
                        sequence: String(accountInfo.result.value.sequence) // If the address is a vesting account, use sequence of base_vesting_account
                    });
                    signedTx = kava.sign(stdSignMsg, ecpairPriv);
                    log.debug(tag, "signedTx: ", signedTx);
                    log.debug(tag, "signedTx: ", JSON.stringify(signedTx));
                    return [2 /*return*/, signedTx];
                case 3:
                    e_1 = _a.sent();
                    throw Error(e_1);
                case 4: return [2 /*return*/];
            }
        });
    });
};
