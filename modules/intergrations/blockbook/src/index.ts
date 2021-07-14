
/*


 */


const TAG = " | blockbook-client | "

import { Blockbook } from 'blockbook-client'
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
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});

import { getBlockBooks } from "./blockbooks";

let BLOCKBOOK_URLS:any = {}

module.exports = {
    init:function (servers:any,runtime?:string) {
        return init_network(servers,runtime);
    },
    getInfo:function () {
        return get_node_info();
    },
    getTransaction:function (coin:string,txid:string) {
        return get_transaction(coin,txid);
    },
    getAddressInfo:function (coin:string,address:string,filter?:string) {
        return get_info_by_address(coin,address,filter);
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

let get_txids_by_address = async function(coin:string,address:string,page?:number){
    let tag = TAG + " | get_txids_by_address | "
    try{
        if(!page) page = 1

        let url = BLOCKBOOK_URLS[coin.toUpperCase()]+"/api/v2/address/"+address+"?page="+page+"&details=all"
        log.info(tag,"url: ",url)
        let body = {
            method: 'GET',
            url,
            headers: {
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
                'content-type': 'application/json',
                'User-Agent': fakeUa()
            },
            method: 'POST',
            json:false,
            data,
        }
        let resp = await axios(body)

        return resp.data
    }catch(e){
        console.error(tag,e)
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
    }
}

let get_balance_by_xpub = async function(coin:string,xpub:any){
    let tag = TAG + " | get_balance_by_xpub | "
    try{
        log.debug(tag,"coin: ",coin)
        log.debug(tag,"xpub: ",xpub)
        let output = await get_utxos_by_xpub(coin,xpub)
        log.info(tag,"output: ",output)

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


        let blockbooks = getBlockBooks()
        for(let i = 0; i < blockbooks.length; i++){
            let coinInfo = blockbooks[i]
            coinInfo.symbol = coinInfo.symbol.toUpperCase()
            log.debug("coinInfo: ",coinInfo)
            let blockbookurl = coinInfo.explorer.tx
            blockbookurl = blockbookurl.replace("/tx/","")

            if(servers && servers[coinInfo.symbol]){
                //use configured
                BLOCKBOOK_URLS[coinInfo.symbol] = servers[coinInfo.symbol]
                log.info(coinInfo.symbol+ " blockbookurl: ",servers[coinInfo.symbol])
            }else{
                if(!runtime || runtime === 'public'){
                    //use public
                    BLOCKBOOK_URLS[coinInfo.symbol] = blockbookurl
                    log.info(coinInfo.symbol+ " blockbookurl: ",blockbookurl)
                }
                //TODO use pioneer's
            }
        }


        return true
    } catch (e) {
        console.error(tag, 'Error: ', e)
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
