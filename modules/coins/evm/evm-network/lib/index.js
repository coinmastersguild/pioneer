"use strict";
/*
   ETH Network tools


       Goals:

        *


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
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = " | eth-network | ";
const ethers_1 = require("ethers");
module.exports = {
    init: function (settings) {
        return true;
    },
    // getInfo:function () {
    // 	return check_online_status();
    // },
    // getNonce: function (address:string, networkId:string) {
    // 	return get_nonce(networkId, address)
    // },
    getFees: function (networkId) {
        return get_fees(networkId);
    },
    getPending: function (networkId, address) {
        return get_pending(networkId, address);
    },
    getTransaction: function (networkId, txid) {
        return get_transaction(networkId, txid);
    },
    // estimateFee: function (sourceAsset:any,params:any): Promise<any> {
    // 	return estimate_fee(sourceAsset,params)
    // },
    // getBalance: function (address:string, networkId:string) {
    // 	return get_balance(address)
    // },
    // getBalances: function (addresses:string, networkId:string) {
    // 	return get_balances(addresses)
    // },
    // getBalanceAddress: function (address:string, networkId:string) {
    // 	return get_balance(address)
    // },
    // getBalanceToken: function (address:string,token:string, networkId:string) {
    // 	return get_balance_token(address,token)
    // },
    // getBalanceTokens: function (address:string, networkId:string) {
    // 	return get_balance_tokens(address)
    // },
    // broadcast:function (tx:any, networkId:string) {
    // 	return broadcast_transaction(tx);
    // }
};
const get_transaction = function (networkId, txid) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = TAG + " | get_pending | ";
        try {
            //get total LP tokens
            let rpcUrl = "https://mainnet.base.org";
            const provider = new ethers_1.JsonRpcProvider(rpcUrl);
            //
            const tx = yield provider.getTransaction(txid);
            console.log("tx:", tx);
        }
        catch (e) {
            console.error(tag, e);
        }
    });
};
const get_pending = function (networkId, address) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = TAG + " | get_pending | ";
        try {
            //get total LP tokens
            let rpcUrl = "https://mainnet.base.org";
            const provider = new ethers_1.JsonRpcProvider(rpcUrl);
            // Fetch the "pending" block which includes pending transactions.
            const blockWithPendingTxs = yield provider.send("eth_getBlockByNumber", ["pending", true]);
            console.log("blockWithPendingTxs:", blockWithPendingTxs);
            // Filter transactions that are either to or from the specified address.
            const relevantTransactions = blockWithPendingTxs.transactions.filter((tx) => tx.to === address.toLowerCase() || tx.from === address.toLowerCase());
            // For demonstration, let's limit the output to the first 20 relevant transactions.
            const first20RelevantTransactions = relevantTransactions.slice(0, 20);
            console.log("First 20 relevant transactions for address:", first20RelevantTransactions);
            return first20RelevantTransactions;
        }
        catch (e) {
            console.error(tag, e);
        }
    });
};
const get_fees = function (networkId) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = TAG + " | get_stream | ";
        try {
            //get total LP tokens
            let rpcUrl = "https://mainnet.base.org";
            const provider = new ethers_1.JsonRpcProvider(rpcUrl);
            const feeData = yield provider.getFeeData();
            console.log("feeData: ", feeData);
            //convert to base units
            let gas = BigInt(feeData.gasPrice) / BigInt(1000);
            console.log("gas: ", gas.toString());
            //hex
            let gasHex = '0x' + gas.toString(16);
            console.log("gasHex: ", gasHex);
            return feeData;
        }
        catch (e) {
            console.error(tag, e);
        }
    });
};
