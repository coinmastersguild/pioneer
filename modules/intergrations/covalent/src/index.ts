/*
    https://docs.blocknative.com/webhook-api

 */



const TAG = " | covalenthq | "
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
import fetchUrl, { FETCH_OPT } from 'micro-ftch'

let URL_SERVICE = "https://api.covalenthq.com"
let COVALENT_API_KEY = process.env['COVALENT_API_KEY']


module.exports = {
    init:function(settings:any){
        if(settings?.apiKey){
            COVALENT_API_KEY = settings.apiKey
        }
        if(!COVALENT_API_KEY) throw Error("api key required! set env BLOCKNATIVE_API_KEY")
    },
    getTokenBalances: function (address:string, networkId:string) {
        return get_balances(address,networkId);
    },
}



const get_balances = async function (address:string,networkId:string) {
    let tag = TAG + " | get_balances | "
    try {
        console.log("networkId: ",networkId)
        if(networkId.indexOf('eip155') === -1) throw Error("EVM chains only! ex: eip155:1")
        let chainId = networkId.split(":")[1]
        const url = `https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`;

        // Perform the GET request
        let resp = await axios.get(url, {
            params: {
                key: COVALENT_API_KEY,
            },
        });

        return resp.data.data
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}
