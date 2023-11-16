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
const MIDGARD_API = process.env['URL_MIDGARD'] ||'https://indexer.thorchain.shapeshift.com/v2'
const URL_THORNODE = process.env['URL_THORNODE'] || 'https://thornode.ninerealms.com'
log.debug("URL_THORNODE: ",URL_THORNODE)
log.debug("MIDGARD_API: ",MIDGARD_API)

const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});


module.exports = {
    // init: function (type:string,config:any,isTestnet:boolean) {
    //     return init_wallet(type,config,isTestnet);
    // },
    getInfo: function () {
        return get_info();
    },
    getPools: function () {
        return get_pools();
    },
    getOutboundQueue: function () {
        return get_outbound_queue();
    },
    getPrice: function (asset:string) {
        return get_price(asset);
    },
    getPool: function (poolId:string) {
        return get_pool(poolId);
    },
    getPoolAddress: function () {
        return get_pool_addresses();
    },
    getNewAddress: function () {
        return get_new_addresses();
    },
    getActions: function () {
        return get_actions();
    },
    getActionsByAddress: function (address:string) {
        return get_actions_by_address(address);
    },
    getTransaction: function (txid:string) {
        return get_transaction(txid);
    },
    getTransactionsByAffiliate: function (address:string) {
        return get_transactions_by_affiliate(address);
    },
    getTransactionsByAddress: function (address:string) {
        return get_transactions_by_address(address);
    }
}

const get_transactions_by_address = async function (address:string) {
    let tag = TAG + " | get_transactions_by_address | "
    try {

        //params
        let params = {
            address,
        }
        console.log(params)
        let resp = await axios.get(MIDGARD_API+"/actions",{params})


        return resp.data
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}

const get_transactions_by_affiliate = async function (address:string) {
    let tag = TAG + " | get_transactions_by_affiliate | "
    try {

        //params
        let params = {
            affiliate:address,
        }
        console.log(params)
        let resp = await axios.get(MIDGARD_API+"/actions",{params})


        return resp.data
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}

const get_outbound_queue = async function () {
    let tag = TAG + " | get_outbound_queue | "
    try {
            //URL_THORNODE
        const outboundReq = await axios.get(`${URL_THORNODE}/thorchain/queue/outbound`);

        return outboundReq
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}



const get_actions = async function () {
    let tag = TAG + " | get_transaction | "
    try {

        //params
        let params = {
            // txid,
            // address,
            // type:"swap",
            fromHeight:12169490,
            // offset:1,
            // limit:10
        }
        console.log(params)
        let resp = await axios.get(MIDGARD_API+"/actions",{params})


        return resp.data
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}

const get_actions_by_address = async function (address:string) {
    let tag = TAG + " | get_transaction | "
    try {

        //params
        let params = {
            // txid,
            address,
            // type:"swap",
            // fromHeight:12169490,
            // offset:1,
            // limit:1000
        }
        console.log(params)
        let resp = await axios.get(MIDGARD_API+"/actions",{params})


        return resp.data
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}

const get_transaction = async function (txid:string) {
    let tag = TAG + " | get_transaction | "
    try {
        const inDetails = (
            await axios.get(`${URL_THORNODE}/thorchain/tx/details/${txid}`)
        ).data;


        return inDetails
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}

const get_new_addresses = async function () {
    let tag = TAG + " | get_new_addresses | "
    try {
        let output = {}

        let params = {
        }


        let body = {
            method: 'GET',
            url: URL_THORNODE+"/thorchain/inbound_addresses",
            headers: {'content-type': 'application/json'},
        };

        log.debug(body)
        let resp = await axios(body)


        return resp.data
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const get_price = async function (asset:string) {
    let tag = TAG + " | get_price | "
    try {
        let output = {}

        // full /simple /balances

        let params = {
            asset:asset
        }

        let body = {
            method: 'GET',
            url: MIDGARD_API+"/assets",
            headers: {'content-type': 'application/json'},
            params
        };

        log.debug(body)
        let resp = await axios(body)


        return resp.data
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

//https://testnet.thornode.thorchain.info/thorchain/inbound_addresses
const get_pool_addresses = async function () {
    let tag = TAG + " | get_pool_addresses | "
    try {
        let output = {}

        let body = {
            method: 'GET',
            url: URL_THORNODE+"/thorchain/inbound_addresses",
            headers: {'content-type': 'application/json'},
            // body: {account_name: actor},
            // json: true
        };

        log.debug(body)
        let resp = await axios(body)


        return resp.data
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const get_info = async function () {
    let tag = TAG + " | get_info | "
    try {
        let output:any = {}

        let body = {
            method: 'GET',
            url: MIDGARD_API+"/health",
            headers: {'content-type': 'application/json'},
            // body: {account_name: actor},
            // json: true
        };

        log.debug(body.url)
        let resp = await axios(body)


        let bodyStats = {
            method: 'GET',
            url: MIDGARD_API+"/stats",
            headers: {'content-type': 'application/json'},
            // body: {account_name: actor},
            // json: true
        };

        const outboundReq = await axios.get(`${URL_THORNODE}/thorchain/queue/outbound`);
        const scheduledReq = await axios.get(
            `${URL_THORNODE}/thorchain/queue/scheduled`
        );
        const streamingReq = await axios.get(
            `${URL_THORNODE}/thorchain/swaps/streaming`
        );
        output.outboundReq = outboundReq.data
        output.scheduledReq = scheduledReq.data
        output.streamingReq = streamingReq.data
        
        log.debug(bodyStats)
        let respStats = await axios(bodyStats)
        log.debug(tag,"respStats: ",respStats.data)

        output.stats = respStats.data
        output.health = resp.data

        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

const get_pools = async function () {
    let tag = TAG + " | get_pools | "
    try {
        //
        let body = {
            method: 'GET',
            url: MIDGARD_API+"/pools",
            headers: {'content-type': 'application/json'},
            // body: {account_name: actor},
            // json: true
        };

        log.debug(body.url)
        let resp = await axios(body)


        return resp.data
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}



const get_pool = async function (poolId:string) {
    let tag = TAG + " | get_pool | "
    try {
        //


        // full /simple /balances
        let params = {
            view:"full",
            asset:poolId
        }

        let body = {
            method: 'GET',
            url: MIDGARD_API+"/pools/detail",
            headers: {'content-type': 'application/json'},
            params
        };

        log.debug(body)
        let resp = await axios(body)

        return resp.data

    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}
