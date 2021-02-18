
/*


 */


const TAG = " | blockbook-client | "

import { Blockbook } from 'blockbook-client'
const log = require('@pioneer-platform/loggerdog')()

import { getBlockBooks } from "./blockbooks";

let BLOCKBOOKS:any = {}
let RUNTIME:string

module.exports = {
    init:function (runtime:string,servers:any) {
        return init_network(runtime,servers);
    },
    getInfo:function () {
        return get_node_info();
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
}

let get_utxos_by_xpub = async function(coin:string,xpub:string){
    let tag = TAG + " | get_utxos_by_xpub | "
    try{
        let output = await BLOCKBOOKS[coin].getUtxosForXpub(xpub, { confirmed: true })
        log.debug(tag,"output: ",output)

        return output
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
        let output = await BLOCKBOOKS[coin].getUtxosForXpub(xpub, { confirmed: true })
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


let init_network = async function (runtime:string,servers:any) {
    let tag = ' | get_txs_by_address | '
    try {
        log.debug(tag,"checkpoint: ")
        let output:any = []

        RUNTIME = runtime

        let blockbooks = getBlockBooks()
        for(let i = 0; i < blockbooks.length; i++){
            let coinInfo = blockbooks[i]
            log.debug("coinInfo: ",coinInfo)

            let blockbookurl = coinInfo.explorer.tx
            blockbookurl = blockbookurl.replace("/tx/","")
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
