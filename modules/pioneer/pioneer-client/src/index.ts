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
let pioneerApi:any

module.exports = class Client {
    public pioneer: any
    private init: (spec: string, config: any) => Promise<any>;
    private spec: string;
    private queryKey: any;
    constructor(spec:string,config:any) {
        this.spec = spec
        this.queryKey = config.queryKey
        this.init = async function () {
            let tag = TAG + " | init_wallet | "
            try{
                if(!this.queryKey) throw Error(" You must create an api key! ")
                pioneerApi = new Pioneer({
                    definition:spec,
                    axiosConfigDefaults: {
                        headers: {
                            'Authorization': this.queryKey,
                        },
                    }
                });
                this.pioneer = await pioneerApi.init()
                return await pioneerApi.init()
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
    }
}


