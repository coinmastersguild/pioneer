/*



    https://www.coingecko.com/api/documentations/v3

 */

const TAG = " | market-module | "
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        headers: {
            "Authorization": "Bearer "+process.env['COINCAP_API_KEY'],
        }
    })
});

const log = require("@pioneer-platform/loggerdog")()

// const axiosRetry = require('axios-retry');
//
// axiosRetry(axios, {
//     retries: 5, // number of retries
//     retryDelay: (retryCount: number) => {
//         console.log(`retry attempt: ${retryCount}`);
//         return retryCount * 1000; // time interval between retries
//     },
//     retryCondition: (error: { response: { status: number; }; }) => {
//         console.error(error)
//         // if retry condition is not specified, by default idempotent requests are retried
//         return error.response.status === 503;
//     },
// });

const URL_SCAMDB = "https://api.cryptoscamdb.org/v1/"

module.exports = {
    checkAddress: function (address:string) {
        return check_address(address);
    }
}


const check_address = async function (address:string) {
    let tag = " | check_address | "
    try{
        let url = URL_SCAMDB + "check/"+address
        log.info(url)
        let result = await axios({
            url,
            method: 'GET'
        })


        return result.data
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}
