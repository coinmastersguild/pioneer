/*
    ETH Wallet

    //To be able to send you must BORROW ETH

    (as you need large amounts of ETH to do anything on the network anymore)

    15$ can borrow 3,500 ETH, and this was enable to make a couple transactions

 */
const TAG = " | Pioneer-client-ts | "
const log = require("@pioneer-platform/loggerdog")()

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
    private pioneerApi: any
    private invoke: (type:string, invocation: Invocation) => Promise<void>;
    private online: () => Promise<any>;
    constructor(spec:string,config:any) {
        this.spec = spec
        this.queryKey = config.queryKey
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
        this.invoke = async function (type,invocation:Invocation) {
            let tag = TAG + " | invoke | "
            try{
                //
                let request:any = {
                    type:"payment",
                    //TODO auth
                    //TODO sig
                    invocation
                }
                //
                let result = this.pioneerApi.instance.Invocation(null, request)
                return result
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
    }
}


