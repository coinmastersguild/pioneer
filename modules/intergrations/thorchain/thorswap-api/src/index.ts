/*



https://defi.delphidigital.io/testnet/v1/thorchain/constants

http://174.138.103.9:8080/v1/doc

 */



const TAG = " | midgard network | "

const log = require('@pioneer-platform/loggerdog')()
let SEED_TESTNET = "https://testnet-seed.thorchain.info/"

//let MIDGARD_API = "https://chaosnet-midgard.bepswap.com/v1"
//let MIDGARD_API = "https://testnet-midgard.bepswap.com/v1"
//let MIDGARD_API = "https://54.0.0.27/v1"
//let MIDGARD_API = "https://testnet.multichain.midgard.thorchain.info/v2"

// const MIDGARD_API = 'http://174.138.103.9:8080/v1'
// let MIDGARD_API_RAW = 'https://testnet.thornode.thorchain.info'

//const MIDGARD_API = process.env['URL_MIDGARD'] ||'https://midgard.ninerealms.com/v2'

const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        referer: 'https://sk.thorswap.net', // Correct header key is 'referer'
    }
});


module.exports = {
    // init: function (type:string,config:any,isTestnet:boolean) {
    //     return init_wallet(type,config,isTestnet);
    // },
    trackSwap: function (hash:string,quoteId:string,route:any, sellAmount:string) {
        return track_swap(hash,quoteId,route,sellAmount);
    },
    getInfo: function (hash:string) {
        return get_info(hash);
    }
}

const track_swap = async function (hash:string,quoteId:string,route:any, sellAmount:string) {
    let tag = TAG + " | track_swap | "
    try {

        const thorswapParams = {
            hash,
            quoteId: quoteId,
            sellAmount: route.sellAmount,
            route: route,
        };
        const thorswapResponse = await axios.post('https://api.thorswap.net/tracker/v2/txn', {
            params: thorswapParams,
        });


        return thorswapResponse.data
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}

const get_info = async function (hash:string) {
    let tag = TAG + " | get_info | "
    try {

        const thorswapParams = {
            hash,
        };
        const thorswapResponse = await axios.get('https://api.thorswap.net/tracker/v2/txn', {
            params: thorswapParams,
        });


        return thorswapResponse.data
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}

