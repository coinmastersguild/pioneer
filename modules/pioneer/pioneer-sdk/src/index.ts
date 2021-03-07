/*

     Pioneer SDK
        A typescript sdk for integration for native wallets

 */



const TAG = " | Pioneer-sdk | "
const log = require("@pioneer-platform/loggerdog")()

//Pioneer follows OpenAPI spec
const Pioneer = require('openapi-client-axios').default;


export interface config {
    spec:string,
    env:string,
    mode:string,
    username:string,
    addresses?:[]
    wallet?:any,
    pubkeys?:any,
    auth?:string,
    paths?:any,
    privWallet?:any,
    mnemonic?:string,
    queryKey?:string
    offline?:boolean
    pioneerApi?:boolean
}


module.exports = class wallet {
    private spec: string;
    private pioneerApi: any;
    private getInfo: (verbosity: string) => any;
    private init: () => Promise<any>;
    private config: config;
    private app: any;
    private createPairingCode: () => Promise<any>;
    private queryKey: string;
    private service: string;
    constructor(spec:string,config:any) {
        this.service = config.service || 'unknown'
        this.config = config
        this.spec = spec
        this.queryKey = config.queryKey
        this.spec = config.spec
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
        this.getInfo = async function () {
            let tag = TAG + " | getInfo | "
            try {
                let result = await this.pioneerApi.instance.Info()
                return result.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.createPairingCode = async function () {
            let tag = TAG + " | createPairingCode | "
            try {
                //
                let pairingBody:any = {
                    service:this.service
                }
                // console.log(tag,"this.pioneerApi: ",this.pioneerApi)
                // console.log(tag,"this.pioneerApi: ",this.pioneerApi.instance)
                let result = this.pioneerApi.instance.CreatePairingCode(null, pairingBody)

                return result
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
    }
}

