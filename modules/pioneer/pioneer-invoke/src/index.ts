/*
    ETH Wallet

    //To be able to send you must BORROW ETH

    (as you need large amounts of ETH to do anything on the network anymore)

    15$ can borrow 3,500 ETH, and this was enable to make a couple transactions

 */
const TAG = " | Pioneer-client-ts | "
const log = require("@pioneer-platform/loggerdog")()
const short = require('short-uuid');
let sign = require('@pioneer-platform/signing')
//Pioneer follows OpenAPI spec
const Pioneer = require('openapi-client-axios').default;

enum AuthProviders {
    shapeshift = 'shapeshift',
    bitcoin = 'bitcoin'
}

interface Invocation {
    type:string
    sender:string
    recipient:string
    asset:string
    payload:any
}

module.exports = class wallet {
    private init: (type: string, config: any) => Promise<any>;
    private spec: string;
    private queryKey: any;
    private pioneerApi: any;
    private appName: string;
    private signingPubkey: string;
    private signingPrivkey: string;
    private invoke: (type:string, invocation: Invocation) => Promise<void>;
    private online: () => Promise<any>;
    constructor(spec:string,config:any) {
        this.spec = spec
        this.appName = config.appName || 'notSet'
        this.queryKey = config.queryKey
        this.signingPubkey = config.signingPubkey
        this.signingPrivkey = config.signingPrivkey
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
        this.invoke = async function (type,invocation:any) {
            let tag = TAG + " | invoke | "
            try{
                //create invocationId
                let invocationId = "pioneer:invocation:v0.01:"+invocation.coin+":"+short.generate()

                //sign
                let msg = JSON.stringify(invocation)
                let invocationSig = sign.sign(this.signingPubkey,msg,this.signingPrivkey)

                //Dapps sign all invocations
                let request:any = {
                    pubkey:this.signingPubkey,
                    appName:this.appName,
                    username:invocation.username,
                    type,
                    invocation,
                    invocationSig,
                    invocationId
                }
                //
                let result = this.pioneerApi.instance.Invoke(null, request)
                return result
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
    }
}


