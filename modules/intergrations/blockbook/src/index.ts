
/*


 */


const TAG = " | blockbook-client | "
const { Blockbook } = require('blockbook-client')

const log = require('@pioneer-platform/loggerdog')()
const fakeUa = require('fake-useragent');
const Axios = require('axios')
const https = require('https')
const nodes = require("@pioneer-platform/nodes")
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    timeout: 30000 // 10 seconds
});
const axiosRetry = require('axios-retry');
let NOW_NODES_API = process.env['NOW_NODES_API']
if(!NOW_NODES_API) throw Error("NOW_NODES_API is required")
    
    
axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: (retryCount: number) => {
        log.error(TAG,`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error: { response: { status: number; }; }) => {
        log.error(TAG,error)
        //@TODO mark node offline, and punish
        // if retry condition is not specified, by default idempotent requests are retried
        return error?.response?.status === 503;
    },
});

let BLOCKBOOK_URLS:any = {}
let BLOCKBOOK_SOCKETS:any = {}

module.exports = {
    init:function (servers?:any) {
        return init_network(servers);
    },
    getInfo:function () {
        return get_node_info();
    },
    getBlockbooks:function () {
        return BLOCKBOOK_URLS;
    },
    getBlockbookSockets:function () {
        return BLOCKBOOK_SOCKETS;
    },
    getFees:function (coin:string) {
        return get_fees(coin);
    },
    getTransaction:function (coin:string,txid:string) {
        return get_transaction(coin,txid);
    },
    getAddressInfo:function (coin:string,address:string,filter?:string) {
        return get_info_by_address(coin,address,filter);
    },
    getPubkeyInfo:function (coin:string,pubkey:string,filter?:string | undefined) {
        return get_info_by_pubkey(coin,pubkey,filter);
    },
    txidsByAddress:function (coin:string,address:string,page?:number) {
        return get_txids_by_address(coin,address,page);
    },
    txsByXpub: function (coin:string,addresses:any) {
        return get_txs_by_xpub(coin,addresses);
    },
    utxosByXpub: function (coin:string,xpub:any) {
        return get_utxos_by_xpub(coin,xpub);
    },
    getBalanceByXpub: function (coin:string,xpub:any) {
        return get_balance_by_xpub(coin,xpub);
    },
    broadcast: function (coin:string,hex:string) {
        return broadcast_transaction(coin,hex);
    },
}

let init_network = async function (servers?: any[]) {
    let tag = ' | get_txs_by_address | '
    try {
        log.debug(tag,"checkpoint: ")

        let SEED_NODES = await nodes.getBlockbooks()
        log.debug(tag,"SEED_NODES: ",SEED_NODES)

        let blockbooks = []
        if (servers && Array.isArray(servers)) { // Type checking for array
            blockbooks = servers.concat(SEED_NODES); // Combine arrays
        } else {
            console.error("Invalid 'servers' parameter. Expected an array.");
            blockbooks = SEED_NODES;
        }

        log.debug(tag,"blockbooks: ",blockbooks.length)
        for(let i = 0; i < blockbooks.length; i++){
            let blockbook = blockbooks[i]
            //get swagger
            if(blockbook && blockbook.service) BLOCKBOOK_URLS[blockbook.symbol.toUpperCase()] = blockbook.service
            if(blockbook && blockbook.websocket){
                let url = blockbook.websocket.replace("/websocket","")
                url = blockbook.websocket.replace("wss://","https://")
                BLOCKBOOK_SOCKETS[blockbook.symbol.toUpperCase()] = new Blockbook({
                    nodes: [url],
                    disableTypeValidation: true,
                })
            } else {
                log.error(tag,"invalid unchained service: ",blockbook)
                // throw Error("invalid unchained service!")
            }
        }
        log.debug(tag,"BLOCKBOOK_URLS: ",BLOCKBOOK_URLS)
        log.debug(tag,"BLOCKBOOK_SOCKETS: ",BLOCKBOOK_SOCKETS)
        return true
    } catch (e) {
        // console.error(tag, 'Error: ', e)
        throw e
    }
}

let get_fees = async function (coin: string){
    let tag = TAG + " | get_fees | "
    try{


        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/fees"
        log.debug(tag,"url: ",url)
        let body = {
            method: 'GET',
            url,
            headers: {
                'api-key': process.env['NOW_NODES_API'],
                'content-type': 'application/json',
                'User-Agent': fakeUa()
            },
        };
        let resp = await axios(body)
        //log.debug(tag,"resp: ",resp)
        //TODO paginate?

        return resp.data
    }catch(e){
        console.error(tag,e)
        throw e
    }
}

let get_info_by_pubkey = async function (coin: string, pubkey: string, page?: string | undefined){
    let tag = TAG + " | get_info_by_pubkey | "
    try{
        if(!page) page = "1"

        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/xpub/"+pubkey
        log.debug(tag,"url: ",url)
        let body = {
            method: 'GET',
            url,
            headers: {
                'api-key': process.env['NOW_NODES_API'],
                'content-type': 'application/json',
                'User-Agent': fakeUa()
            },
        };
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp)
        //TODO paginate?

        return resp.data
    }catch(e){
        console.error(tag,e)
        throw e
    }
}


let get_txids_by_address = async function(coin:string,address:string,page?:number){
    let tag = TAG + " | get_txids_by_address | "
    try{
        if(!page) page = 1

        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/address/"+address+"?page="+page+"&details=all"
        log.debug(tag,"url: ",url)
        let body = {
            method: 'GET',
            url,
            headers: {
                'api-key': process.env['NOW_NODES_API'],
                'content-type': 'application/json',
                'User-Agent': fakeUa()
            },
        };
        let resp = await axios(body)

        //TODO paginate?

        return resp.data
    }catch(e){
        console.error(tag,e)
        throw e
    }
}

let get_info_by_address = async function(coin:string,address:string,filter?:string){
    let tag = TAG + " | get_info_by_address | "
    try{
        if(!filter) filter = "all"
        //let url = ETH_BLOCKBOOK_URL+"/api/v2/address/"+address+"?="+filter
        if(!BLOCKBOOK_URLS[coin.toUpperCase()]) throw Error("invalid coin: "+coin)
        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/address/"+address+"?details=all"
        let body = {
            method: 'GET',
            url,
            headers: {
                'api-key': process.env['NOW_NODES_API'],
                'content-type': 'application/json',
                'User-Agent': fakeUa()
            },
        };
        let resp = await axios(body)

        //TODO paginate?

        return resp.data
    }catch(e){
        console.error(tag,e)
        throw e
    }
}


let get_txs_by_xpub = async function(coin:string,xpub:string){
    let tag = TAG + " | FA get_txs_by_xpub | "
    try{

        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/xpub/"+xpub+"?details=all"
        //console.log("url: ",url)
        let body = {
            method: 'GET',
            url,
            headers: {
                'api-key': process.env['NOW_NODES_API'],
                'content-type': 'application/json',
                'User-Agent': fakeUa()
            },
        };
        let resp = await axios(body)

        return resp.data
    }catch(e){
        console.error(tag,e)
        throw e
    }
}

let broadcast_transaction = async function(coin:string,hex:string){
    let tag = TAG + " | broadcast_transaction | "
    try{

        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/sendtx/"

        let data = hex

        let body = {
            url,
            headers: {
                'api-key': process.env['NOW_NODES_API'],
                'content-type': 'application/json',
                'User-Agent': fakeUa()
            },
            method: 'POST',
            json:false,
            data,
        }
        let output:any = {
            success:false
        }
        let resp
        try{
            resp = await axios(body)
            output.resp = resp
            output.success = true
        }catch(e){
            log.error(tag,"error: ",e)
            //log.debug(tag,"data0: ",e)
            //log.debug(tag,"resp: ",resp)
            //log.debug(tag,"data0: ",Object.keys(e))
            //log.debug(tag,"data1: ",e.response.req)
            //log.debug(tag,"data2: ",e.response.data)
            //log.debug(tag,"data2: ",e.response.data.error)
            //log.debug(tag,"error3: ",e.toJSON().request)
            //log.debug(tag,"erro4: ",e.toJSON().data)
            //log.debug(tag,"error5: ",e.toJSON().code)
            // if(e.response.data.error){
            //     output.error = e.response.data.error
            // }else{
            //     output.error = e
            // }
        }

        return output
    }catch(e){
        //console.error(tag,e)
        throw e
    }
}

let get_transaction = async function(coin:string,txid:string){
    let tag = TAG + " | get_transaction | "
    try{

        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/tx/"+txid
        console.log("url: ",url)
        let body = {
            method: 'GET',
            url,
            headers: {
                'content-type': 'application/json',
                'User-Agent': fakeUa()
            },
        };

        let resp = await axios(body)

        return resp.data
    }catch(e){
        console.error(tag,e)
        throw e
    }
}

let get_utxos_by_xpub = async function(coin:string,xpub:string){
    let tag = TAG + " | FA get_utxos_by_xpub | "
    try{
        log.info(tag,"get_utxos_by_xpub: ",BLOCKBOOK_URLS)
        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/utxo/"+xpub+"?confirmed=false"
        console.log("url: ",url)
        
        
        let body = {
            method: 'GET',
            url,
            // headers: {
            //     'api-key': NOW_NODES_API,
            //     'content-type': 'application/json',
            //     'User-Agent': fakeUa()
            // },
        };
        let resp = await axios(body)

        return resp.data
    }catch(e){
        console.error(tag,e)
        throw e
    }
}

let get_balance_by_xpub = async function(coin:string,xpub:any){
    let tag = TAG + " | get_balance_by_xpub | "
    try{
        log.debug(tag,"coin: ",coin)
        log.debug(tag,"xpub: ",xpub)
        let output = await get_utxos_by_xpub(coin,xpub)
        log.debug(tag,"output: ",output)

        let balance = 0

        //tally
        for(let i = 0; i < output.length; i++){
            let uxto = output[i]
            balance = balance + parseInt(uxto.value)

        }

        return balance / 100000000
    }catch(e){
        console.error(tag,e)
        throw e
    }
}




let get_node_info = async function(){
    let tag = TAG + " | get_node_info | "
    try{


        return true
    }catch(e){
        console.error(tag,e)
        throw e
    }
}
