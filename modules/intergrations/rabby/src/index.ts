/*
    https://docs.blocknative.com/webhook-api

 */



const TAG = " | thorswap | "
import { SwapKitApi } from '@coinmasters/api';
const log = require('@pioneer-platform/loggerdog')()
const Axios = require('axios')
const https = require('https')
// @ts-ignore
import { assetData } from '@pioneer-platform/pioneer-discovery';




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

let {ChainToNetworkId} = require("@pioneer-platform/pioneer-caip")

let networkSupport = [
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
]



module.exports = {
    init:function(settings:any){
        return true
    },
    networkSupport: function () {
      return networkSupport
    },
    // assetSupport: function () {
    //     return getAssetSupport()
    // },
    getQuote: function (quote:any) {
        return get_quote(quote);
    },
    // trackSwap: function (hash:string,quoteId:string,route:any, sellAmount:string) {
    //     return track_swap(hash,quoteId,route,sellAmount);
    // },
    // getInfo: function (hash:string) {
    //     return get_info(hash);
    // }
}

const get_quote = async function (quote:any) {
    let tag = TAG + " | get_quote | "
    try {
        log.info(tag,"quote: ",quote)
        let output:any = []
        //caip to thorchain identifier
        const entry:any = {
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
        
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        console.error(tag, "e: ", JSON.stringify(e))
        // logErrorDetails(e, tag);
    }
}
