/*


 */
const TAG = " | Pioneer-client-ts | "

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
                console.error(e)
                throw e
            }
        }
    }
}


