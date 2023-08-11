/*
    https://docs.blocknative.com/webhook-api

 */



const TAG = " | blocknative | "
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

let URL_HARPIE = "https://api.harpie.io"
let TENDERLY_ACCESS_KEY = process.env['TENDERLY_ACCESS_KEY']
if(!TENDERLY_ACCESS_KEY) throw Error("api key required! set env TENDERLY_ACCESS_KEY")

let TENDERLY_USER = 'highlander2'
let TENDERLY_PROJECT = 'keepkey'


module.exports = {
    validateTransaction: function (from:string,to:string,data:string) {
        return submit_tx(from,to,data);
    },
}

const submit_tx = async function (from:string,to:string,data:string) {
    let tag = TAG + " | submit_address | "
    try {
        const apiURL = `https://api.tenderly.co/api/v1/account/highlander2/project/keepkey/simulate`
        const body = {
            "network_id": "1",
            "from": from,
            "to": to,
            "input": data,
            "gas": 21204,
            "gas_price": "0",
            "value": 0,
            "save_if_fails": true
        }
        const headers = {
            headers: {
                'content-type': 'application/JSON',
                'X-Access-Key': TENDERLY_ACCESS_KEY,
            }
        }
        const resp = await axios.post(apiURL, body, headers);

        if (resp.data.simulation.status === false) {
            // it failed, do as you please
        }

        return resp.data
    } catch (e) {
        console.error(tag, "e: ", e)
        // console.error(tag, "e: ", e?.response)
        // console.error(tag, "e: ", e?.response?.status)
        // console.error(tag, "e: ", JSON.stringify(e.data))
    }
}
