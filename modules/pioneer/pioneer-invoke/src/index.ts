/*
    ETH Wallet

    //To be able to send you must BORROW ETH

    (as you need large amounts of ETH to do anything on the network anymore)

    15$ can borrow 3,500 ETH, and this was enable to make a couple transactions

 */
const TAG = " | Pioneer-invoke | "
const log = require('@pioneer-platform/loggerdog')()
const short = require('short-uuid');
//Pioneer follows OpenAPI spec
const Pioneer = require('openapi-client-axios').default;

import {
    Error,
    Invocation,
    InvocationBody
} from "@pioneer-platform/pioneer-types";

// const getAssetInfo = (identifier: string) => {
//     const isSynthetic = identifier.slice(0, 14).includes('/');
//     const [synthChain, synthSymbol] = identifier.split('.').pop()!.split('/');
//     const adjustedIdentifier =
//         identifier.includes('.') && !isSynthetic ? identifier : `${Chain.THORChain}.${synthSymbol}`;
//
//     const [chain, symbol] = adjustedIdentifier.split('.') as [Chain, string];
//     const [ticker, address] = (isSynthetic ? synthSymbol : symbol).split('-') as [string, string?];
//
//     return {
//         address: address?.toLowerCase(),
//         chain,
//         isGasAsset: isGasAsset({ chain, symbol }),
//         isSynthetic,
//         symbol:
//             (isSynthetic ? `${synthChain}/` : '') +
//             (address ? `${ticker}-${address?.toLowerCase() ?? ''}` : symbol),
//         ticker,
//     };
// };
//
// export const getMinAmountByChain = (chain: Chain) => {
//     const asset = AssetValue.fromChainOrSignature(chain);
//
//     switch (chain) {
//         case Chain.Bitcoin:
//         case Chain.Litecoin:
//         case Chain.Dash:
//         case Chain.Zcash:
//         case Chain.BitcoinCash:
//             return asset.set(0.00010001);
//
//         case Chain.Dogecoin:
//             return asset.set(1.00000001);
//
//         case Chain.Base:
//         case Chain.Arbitrum:
//         case Chain.Avalanche:
//         case Chain.Ethereum:
//             return asset.set(0.00000001);
//
//         case Chain.THORChain:
//         case Chain.Mayachain:
//             return asset.set(0.0000000001);
//
//         default:
//             return asset.set(0.00000001);
//     }
// };

module.exports = class wallet {
    private init: (type: string, config: any) => Promise<any>;
    private spec: string;
    private queryKey: any;
    private pioneerApi: any;
    private appName: string;
    // private signingPubkey: string;
    // private signingPrivkey: string;
    // private invoke: (invocation: Invocation) => Promise<any>;
    // private fromChainOrSignature: (invocation: Invocation) => Promise<any>;
    // //fromChainOrSignature
    // //fromIdentifier
    // private fromIdentifier: (invocation: Invocation) => Promise<any>;
    // //fromStringSync
    // private fromStringSync: (invocation: Invocation) => Promise<any>;
    // //fromString
    // private fromString: (invocation: Invocation) => Promise<any>;
    
    private online: () => Promise<any>;
    constructor(spec:string,config:any) {
        this.spec = spec
        this.appName = config.appName || 'notSet'
        this.queryKey = config.queryKey
        // this.signingPubkey = config.signingPubkey
        // this.signingPrivkey = config.signingPrivkey
        this.init = async function () {
            let tag = TAG + " | init_wallet | "
            try{
                if(!this.queryKey) throw Error(" You must create an api key! ")
                this.pioneerApi = new Pioneer({
                    definition:spec,
                    axiosConfigDefaults: {
                        headers: {
                            'Authorization': this.queryKey,
                        },
                    }
                });
                await this.pioneerApi.init()
                return this.pioneerApi
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        this.online = async function () {
            let tag = TAG + " | online | "
            try{
                let result = await this.pioneerApi.instance.Online()
                return result.data
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        // this.invoke = async function (invocation:Invocation) {
        //     let tag = TAG + " | invoke | "
        //     try{
        //         log.debug(tag,"invocation: ",invocation)
        //         if(!invocation.type) throw Error("invocation Type required!")
        //         if(!invocation.context) throw Error("invocation Context required!")
        //         //create invocationId
        //         if(!invocation.invocationId){
        //             invocation.invocationId = "pioneer:invocation:v0.01:"+invocation.network+":"+short.generate()
        //         }
        //         let invocationId = invocation.invocationId
        //
        //         //TODO sign
        //         let msg = JSON.stringify(invocation)
        //         //let invocationSig = sign.sign(this.signingPubkey,msg,this.signingPrivkey)
        //         if(invocation.type === 'swap' && !invocation.addressFrom){
        //             throw Error("AddressFrom required! on swaps")
        //         }
        //
        //         //Dapps sign all invocations
        //         let request:InvocationBody = {
        //             addressFrom:invocation.addressFrom,
        //             network:invocation.network,
        //             context:invocation.context,
        //             // pubkey:this.signingPubkey,
        //             appName:this.appName,
        //             username:invocation.username,
        //             type:invocation.type,
        //             invocation,
        //             // invocationSig,
        //             invocationId
        //         }
        //         //
        //         log.debug(tag,"invocation BODY: ",request)
        //         let result = await this.pioneerApi.instance.Invoke(null, request)
        //         //log.debug(tag,"result: ",result)
        //         return result.data
        //     }catch(e){
        //         log.error(tag,e)
        //         throw e
        //     }
        // }
    }
}


