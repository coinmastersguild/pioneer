/*
    ETH Wallet

    //To be able to send you must BORROW ETH

    (as you need large amounts of ETH to do anything on the network anymore)

    15$ can borrow 3,500 ETH, and this was enable to make a couple transactions

 */
const TAG = " | Pioneer-invoke | "
const log = require("@pioneer-platform/loggerdog")()
const short = require('short-uuid');
let sign = require('@pioneer-platform/signing')
//Pioneer follows OpenAPI spec
const Pioneer = require('openapi-client-axios').default;

import {
    Error,
    Invocation,
    InvocationBody
} from "@pioneer-platform/pioneer-types";

module.exports = class wallet {
    private init: (type: string, config: any) => Promise<any>;
    private spec: string;
    private queryKey: any;
    private pioneerApi: any;
    private appName: string;
    // private signingPubkey: string;
    // private signingPrivkey: string;
    private invoke: (invocation: Invocation) => Promise<any>;
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
        this.invoke = async function (invocation:Invocation) {
            let tag = TAG + " | invoke | "
            try{
                log.debug(tag,"invocation: ",invocation)
                if(!invocation.type) throw Error("invocation Type required!")
                if(!invocation.context) throw Error("invocation Context required!")
                //create invocationId
                if(!invocation.invocationId){
                    invocation.invocationId = "pioneer:invocation:v0.01:"+invocation.network+":"+short.generate()
                }
                let invocationId = invocation.invocationId

                //TODO sign
                let msg = JSON.stringify(invocation)
                //let invocationSig = sign.sign(this.signingPubkey,msg,this.signingPrivkey)
                if(invocation.type === 'swap' && !invocation.addressFrom){
                    throw Error("AddressFrom required! on swaps")
                }

                //Dapps sign all invocations
                let request:InvocationBody = {
                    addressFrom:invocation.addressFrom,
                    network:invocation.network,
                    context:invocation.context,
                    // pubkey:this.signingPubkey,
                    appName:this.appName,
                    username:invocation.username,
                    type:invocation.type,
                    invocation,
                    // invocationSig,
                    invocationId
                }
                //
                log.debug(tag,"invocation BODY: ",request)
                let result = await this.pioneerApi.instance.Invoke(null, request)
                //log.debug(tag,"result: ",result)
                return result.data
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
    }
}


