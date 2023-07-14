
/*


 */


const TAG = " | blockbook-client | "

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

axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: (retryCount: number) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error: { response: { status: number; }; }) => {
        //console.error(error)
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});

module.exports = {
    init:function (servers:any,runtime?:string) {
        return init_network(servers,runtime);
    },
    getInfo:function () {
        return get_node_info();
    },
    getFees:function (coin:string) {
        return get_fees(coin);
    },
}

let get_fees = async function (coin: string){
    let tag = TAG + " | get_fees | "
    try{


        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/fees"
        log.info(tag,"url: ",url)
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
        //log.info(tag,"resp: ",resp)
        //TODO paginate?

        return resp.data
    }catch(e){
        console.error(tag,e)
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
    }
}

let get_info_by_address = async function(coin:string,address:string,filter?:string){
    let tag = TAG + " | get_info_by_address | "
    try{
        if(!filter) filter = "all"
        //let url = ETH_BLOCKBOOK_URL+"/api/v2/address/"+address+"?="+filter
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
    }
}


let get_txs_by_xpub = async function(coin:string,xpub:string){
    let tag = TAG + " | FA get_txs_by_xpub | "
    try{

        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/xpub/"+xpub+"?details=all"
        console.log("url: ",url)
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
            // log.info(tag,"data0: ",e)
            // log.info(tag,"resp: ",resp)
            // log.info(tag,"data0: ",Object.keys(e))
            // log.info(tag,"data1: ",e.response.req)
            // log.info(tag,"data2: ",e.response.data)
            // log.info(tag,"data2: ",e.response.data.error)
            // log.info(tag,"error3: ",e.toJSON().request)
            // log.info(tag,"erro4: ",e.toJSON().data)
            // log.info(tag,"error5: ",e.toJSON().code)
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
    }
}

let get_utxos_by_xpub = async function(coin:string,xpub:string){
    let tag = TAG + " | FA get_utxos_by_xpub | "
    try{

        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/utxo/"+xpub+"?confirmed=false"
        console.log("url: ",url)

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
    }
}


let init_network = function (servers:any,runtime?:string) {
    let tag = ' | get_txs_by_address | '
    try {
        log.debug(tag,"checkpoint: ")
        let output:any = []

        //get all Unchained nodes networks from pioneer

        //select a primary by ping time
        


        return true
    } catch (e) {
        // console.error(tag, 'Error: ', e)
        throw e
    }
}

let get_node_info = async function(){
    let tag = TAG + " | get_node_info | "
    try{


        return true
    }catch(e){
        console.error(tag,e)
    }
}
