
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

import { getBlockBooks } from "./blockbooks";

let BLOCKBOOKS:any = {}
let BLOCKBOOK_URLS:any = {}
let RUNTIME:string

let ETH_BLOCKBOOK_URL = ""

module.exports = {
    init:function (runtime:string,servers:any) {
        return init_network(runtime,servers);
    },
    getInfo:function () {
        return get_node_info();
    },
    getTransaction:function (coin:string,txid:string) {
        return get_transaction(coin,txid);
    },
    getEthInfo:function (address:string,filter?:string) {
        return get_eth_info_by_address(address,filter);
    },
    // txsByXpub: function (coin:string,addresses:any) {
    //     return get_txs_by_xpub(coin,addresses);
    // },
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

let get_eth_info_by_address = async function(address:string,filter?:string){
    let tag = TAG + " | get_eth_info_by_address | "
    try{
        if(!filter) filter = "all"
        let url = ETH_BLOCKBOOK_URL+"/api/v2/address/"+address+"?="+filter

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

        // let output = await BLOCKBOOKS[coin].sendTx(hex)
        // log.debug(tag,"output: ",output)

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

        // let output = await BLOCKBOOKS[coin].getTx(txid)
        // log.debug(tag,"output: ",output)

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

        // let output = await BLOCKBOOKS[coin].getUtxosForXpub(xpub, { confirmed: false })
        // log.debug(tag,"output: ",output)

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
        log.debug(tag,"BLOCKBOOKS: ",BLOCKBOOKS)
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


let init_network = function (runtime:string,servers:any) {
    let tag = ' | get_txs_by_address | '
    try {
        log.debug(tag,"checkpoint: ")
        let output:any = []

        RUNTIME = runtime

        let blockbooks = getBlockBooks()
        for(let i = 0; i < blockbooks.length; i++){
            let coinInfo = blockbooks[i]
            log.debug("coinInfo: ",coinInfo)

            //

            let blockbookurl = coinInfo.explorer.tx
            blockbookurl = blockbookurl.replace("/tx/","")
            if(coinInfo.symbol.toUpperCase() === 'ETH') ETH_BLOCKBOOK_URL = blockbookurl
            BLOCKBOOK_URLS[coinInfo.symbol.toUpperCase()] = blockbookurl
            log.debug("blockbookurl: ",blockbookurl)
            BLOCKBOOKS[coinInfo.symbol.toUpperCase()] = new Blockbook({
                nodes: [blockbookurl],
            })
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
