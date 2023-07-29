
/*


 */


const TAG = " | unchained-client | "
let pioneerApi = require("@pioneer-platform/pioneer-client").default
const log = require('@pioneer-platform/loggerdog')()
const fakeUa = require('fake-useragent');
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
const axiosRetry = require('axios-retry');
const ALL_UNCHAINED_APIS:any = {}
axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: (retryCount: number) => {
        log.info(TAG,`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error: { response: { status: number; }; }) => {
        //console.error(error)
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});

module.exports = {
    init:function (servers?:any) {
        return init_network(servers);
    },
    unchained:function () {
        return ALL_UNCHAINED_APIS();
    },
    getFees:function (caip:string) {
        return get_fees(caip);
    },
}

let init_network = async function (servers?: any){
    let tag = TAG + " | init_network | "
    try{
        let spec = process.env['PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
        // let spec = 'https://pioneers.dev/spec/swagger.json'

        let allUnchaineds:any = []
        if(servers){
            allUnchaineds = servers
        }
        
        try{
            //get config
            let config = {
                queryKey:'unchained:npm',
                spec
            }
            //console.log("config: ",config)
            //get config
            let pioneer = new pioneerApi(spec,config)
            pioneer = await pioneer.init()
            let allUnchainedsRemote = await pioneer.SearchNodesByType({type:"unchained"});
            allUnchainedsRemote = allUnchainedsRemote.data
            allUnchaineds(...allUnchainedsRemote)
        }catch(e){
            //console.error(tag,"e: ",e)
        }
        
        for(let i = 0; i < allUnchaineds.length; i++){
            let unchainedInfo = allUnchaineds[i]
            //get swagger
            if(unchainedInfo.service && unchainedInfo.caip && unchainedInfo.swagger){
                //log.info("unchainedInfo.swagger: ",unchainedInfo.swagger)
                let config = { queryKey:"foobaz", spec:unchainedInfo.swagger}
                let Unchained = new pioneerApi(unchainedInfo.swagger,config)
                try {
                    //if already set, check pings, choose lowest ping
                    ALL_UNCHAINED_APIS[unchainedInfo.caip] = await Unchained.init()
                } catch(e) {
                    //@TODO mark offline on api
                    log.debug(tag," service if offline: ",unchainedInfo.service)
                }
            } else {
                log.debug(tag,"invalid unchained service: ",unchainedInfo.service)
                // throw Error("invalid unchained service!")
            }
        }
        
        return ALL_UNCHAINED_APIS
    }catch(e){
        console.error(tag,e)
    }
}

let get_fees = async function (caip: string){
    let tag = TAG + " | get_fees | "
    try{
        //log.info(ALL_UNCHAINED_APIS[caip])
        let output
        if(ALL_UNCHAINED_APIS[caip].GetNetworkFees){
            output = await ALL_UNCHAINED_APIS[caip].GetNetworkFees()
        } else if(ALL_UNCHAINED_APIS[caip].GetGasFees) {
            output = await ALL_UNCHAINED_APIS[caip].GetGasFees()
        }
        return output
    }catch(e){
        console.error(tag,e)
    }
}
