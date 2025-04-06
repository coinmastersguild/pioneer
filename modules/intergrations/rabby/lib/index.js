"use strict";
/*
    https://docs.blocknative.com/webhook-api

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
var TAG = " | thorswap | ";
var log = require('@pioneer-platform/loggerdog')();
var Axios = require('axios');
var https = require('https');
// const axios = Axios.create({
//     httpsAgent: new https.Agent({
//         rejectUnauthorized: false
//     }),
//     headers: {
//         referer: 'kttps://sk.thorswap.net',
//         ['x-api-key']: process.env.THORSWAP_API_KEY
//     }
// });
// import {
//     DEX_SUPPORT_CHAINS as RS_DEX_SUPPORT_CHAINS,
//     DEX_ROUTER_WHITELIST as RS_DEX_ROUTER_WHITELIST,
//     DEX_SPENDER_WHITELIST as RS_DEX_SPENDER_WHITELIST,
// } from '@rabby-wallet/rabby-swap';
var ChainToNetworkId = require("@pioneer-platform/pioneer-caip").ChainToNetworkId;
var networkSupport = [
    ChainToNetworkId["GAIA"],
    ChainToNetworkId["BNB"],
    ChainToNetworkId["DOGE"],
    ChainToNetworkId["BTC"],
    ChainToNetworkId["ETH"],
    ChainToNetworkId["LTC"],
    ChainToNetworkId["THOR"],
    ChainToNetworkId["BCH"],
    ChainToNetworkId["GNO"],
    ChainToNetworkId["MATIC"],
    ChainToNetworkId["AVAX"],
];
module.exports = {
    init: function (settings) {
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    // assetSupport: function () {
    //     return getAssetSupport()
    // },
    getQuote: function (quote) {
        return get_quote(quote);
    },
    // trackSwap: function (hash:string,quoteId:string,route:any, sellAmount:string) {
    //     return track_swap(hash,quoteId,route,sellAmount);
    // },
    // getInfo: function (hash:string) {
    //     return get_info(hash);
    // }
};
var get_quote = function (quote) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, entry;
        return __generator(this, function (_a) {
            tag = TAG + " | get_quote | ";
            try {
                log.info(tag, "quote: ", quote);
                output = [];
                entry = {
                    sellAsset: quote.sellAsset,
                    sellAmount: quote.sellAmount,
                    buyAsset: quote.buyAsset,
                    senderAddress: quote.senderAddress,
                    recipientAddress: quote.recipientAddress,
                    slippage: parseInt(quote.slippage),
                };
                // dexSwap = async (
                //     {
                //         chain,
                //         quote,
                //         needApprove,
                //         spender,
                //         pay_token_id,
                //         unlimited,
                //         gasPrice,
                //         shouldTwoStepApprove,
                //     }: {
                //         chain: CHAINS_ENUM;
                //         quote: QuoteResult;
                //         needApprove: boolean;
                //         spender: string;
                //         pay_token_id: string;
                //         unlimited: boolean;
                //         gasPrice?: number;
                //         shouldTwoStepApprove: boolean;
                //     },
                //     $ctx?: any
                // ) => {
                //     const account = await preferenceService.getCurrentAccount();
                //     if (!account) throw new Error('no current account');
                //     const chainObj = findChainByEnum(chain);
                //     if (!chainObj) throw new Error(`Can not find chain ${chain}`);
                //     try {
                //         let approvalTxHash: string | undefined;
                //         if (shouldTwoStepApprove) {
                //             unTriggerTxCounter.increase(3);
                //             approvalTxHash = await this.approveToken(
                //                 chainObj.serverId,
                //                 pay_token_id,
                //                 spender,
                //                 0,
                //                 {
                //                     ga: {
                //                         ...$ctx?.ga,
                //                         source: 'approvalAndSwap|tokenApproval',
                //                     },
                //                 },
                //                 gasPrice,
                //                 { isSwap: true }
                //             );
                //             unTriggerTxCounter.decrease();
                //         }
                //
                //         if (needApprove) {
                //             if (!shouldTwoStepApprove) {
                //                 unTriggerTxCounter.increase(2);
                //             }
                //             approvalTxHash = await this.approveToken(
                //                 chainObj.serverId,
                //                 pay_token_id,
                //                 spender,
                //                 unlimited ? MAX_UNSIGNED_256_INT : quote.fromTokenAmount,
                //                 {
                //                     ga: {
                //                         ...$ctx?.ga,
                //                         source: 'approvalAndSwap|tokenApproval',
                //                     },
                //                 },
                //                 gasPrice,
                //                 { isSwap: true }
                //             );
                //             unTriggerTxCounter.decrease();
                //         }
                //         if (approvalTxHash) {
                //             return approvalTxHash;
                //         }
                //         const tx: string = await this.sendRequest({
                //             $ctx:
                //                 needApprove && pay_token_id !== chainObj.nativeTokenAddress
                //                     ? {
                //                         ga: {
                //                             ...$ctx?.ga,
                //                             source: 'approvalAndSwap|swap',
                //                         },
                //                     }
                //                     : $ctx,
                //             method: 'eth_sendTransaction',
                //             params: [
                //                 {
                //                     from: quote.tx.from,
                //                     to: quote.tx.to,
                //                     data: quote.tx.data || '0x',
                //                     value: `0x${new BigNumber(quote.tx.value || '0').toString(16)}`,
                //                     chainId: chainObj.id,
                //                     gasPrice: gasPrice
                //                         ? `0x${new BigNumber(gasPrice).toString(16)}`
                //                         : undefined,
                //                     isSwap: true,
                //                 },
                //             ],
                //         });
                //
                //         unTriggerTxCounter.decrease();
                //         return tx;
                //     } catch (e) {
                //         unTriggerTxCounter.reset();
                //     }
                // };
                return [2 /*return*/, output];
            }
            catch (e) {
                console.error(tag, "e: ", e);
                console.error(tag, "e: ", JSON.stringify(e));
                // logErrorDetails(e, tag);
            }
            return [2 /*return*/];
        });
    });
};
