/*
  const thorMainnetClient: CosmosSDKClient = new CosmosSDKClient({
    server: 'http://104.248.96.152:1317',
    chainId: 'thorchain',
    prefix: 'thor',
    derive_path: "44'/931'/0'/0/0",
  })


    get nodes
    curl https://testnet-seed.thorchain.info

    //testnet
    https://main.d3mbd42yfy75lz.amplifyapp.com/#/nodes

*/
const TAG = " | thorchain-api | "
require("dotenv").config({path:'../../../.env'})

const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

const log = require('@pioneer-platform/loggerdog')()

let URL_MIDGARD = process.env['URL_MIDGARD'] || 'http://135.181.112.20:1317'

let BASE_THOR = 100000000

/**********************************
 // Module
 //**********************************/

module.exports = {
    init:function (url:string,settings:any) {
        return true
    },
    isOnline:function () {
        return true;
    },
    info:function () {
        return get_node_info_verbose();
    },
    getBalance:function (address:string) {
        return get_balance(address);
    },
    getAccount:function (address:string) {
        return get_account_info(address);
    },
    getAccountInfo:function (address:string) {
        return get_account_info(address);
    },
    txs: function (address:string) {
        return get_txs_by_address(address);
    },
    transaction: function (txid:string) {
        return get_transaction(txid);
    },
    broadcast: function (tx:string) {
        return broadcast_transaction(tx);
    },
}


/**********************************
 // Lib
 //**********************************/

let get_transaction = async function(txid:string){
    let tag = TAG + " | get_transaction | "
    try{
        let txInfo = await axios({method:'GET',url:  URL_MIDGARD+'/txs/'+txid})
        log.debug(tag,"txInfo: ",txInfo.data)
        return txInfo.data
    }catch(e){
        throw Error(e)
    }
}

let broadcast_transaction = async function(tx:string){
    let tag = TAG + " | broadcast_transaction | "
    let output:any = {}
    try{
        log.debug(tag,"CHECKPOINT 1")

        output.success = false


        try{
            //push to seed
            let urlRemote = URL_MIDGARD+ '/txs'
            log.debug(tag,"urlRemote: ",urlRemote)
            let result2 = await axios({
                url: urlRemote,
                method: 'POST',
                data: tx,
            })
            log.info(tag,'** Broadcast ** REMOTE: result: ', result2.data)
            if(result2.data.txhash) output.txid = result2.data.txhash

            //verify success
            if(result2.data.raw_log){
                let logSend = result2.data.raw_log
                log.info(tag,"logSend: ",logSend)
            }
            output.height = result2.height
            output.gas_wanted = result2.gas_wanted
            output.gas_used = result2.gas_used
            output.raw = result2.data
        }catch(e){
            //log.error(tag,"failed second broadcast e: ",e.response)
            log.error(tag,e)
            log.error(tag,e.response)
            log.error(tag,e.response.data)
            log.error(tag,e.response.data.error)
            log.error(tag,e.response.data.error.indexOf('RPC error -32603 - Internal error: Tx already exists in cache'))
            //throw e

            output.success = false
            output.error = e.response.data.error

        }

        if(output.txid){
            output.success = true
        }

        return output
    }catch(e){

        console.error(tag,"throw error: ",e)
        return output

    }
}

let get_account_info = async function(address:string){
    let tag = TAG + " | get_account_info | "
    try{
        //
        let txInfo = await axios({method:'GET',url: URL_MIDGARD+'/auth/accounts/'+address})
        log.info(tag,"txInfo: ",txInfo.data)

        return txInfo.data
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

let get_txs_by_address = async function(address:string){
    let tag = TAG + " | get_balance | "
    try{
        let output:any = []

        //sends
        let url = URL_MIDGARD+ '/txs?message.sender='+address
        log.debug(tag,"url: ",url)
        let resultSends = await axios({
            url: url,
            method: 'GET'
        })
        let sends = resultSends.data
        log.info('sends: ', sends)

        // TODO//pagnation
        // let pagesSends = sends.page_number
        // for(let i = 0; i < pagesSends; i++){
        //
        // }
        // for(let i = 0; i < sends.txs.length; i++ ){
        //     let tx = sends.txs[i]
        //     //normalize
        //     //tx = normalize_tx(tx,'send')
        //     output.push(tx)
        // }

        //receives
        url = URL_MIDGARD+ '/txs?transfer.recipient='+address
        let resultRecieves = await axios({
            url: url,
            method: 'GET'
        })
        let receives = resultRecieves.data
        log.info('receives: ', receives)

        // for(let i = 0; i < receives.txs.length; i++ ){
        //     let tx = receives.txs[i]
        //     //normalize
        //     //tx = normalize_tx(tx,'receive')
        //     output.push(tx)
        // }


        return output
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

let get_balance = async function(address:string){
    let tag = TAG + " | get_balance | "
    try{
        let output = 0

        let accountInfo = await axios({method:'GET',url: URL_MIDGARD+'/bank/balances/'+address})
        log.info(tag,"accountInfo: ",accountInfo.data)

        //
        if(accountInfo.data?.result){
            for(let i = 0; i < accountInfo.data.result.length; i++){
                let entry = accountInfo.data.result[i]
                if(entry.denom === 'rune'){
                    output = entry.amount
                }
            }
        }

        return output / BASE_THOR
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

let get_node_info_verbose = async function(){
    let tag = TAG + " | get_node_info | "
    try{
        let output:any = {}

        //get syncing status
        let syncInfo = await axios({method:'GET',url: URL_MIDGARD+'/syncing'})
        log.info(tag,"syncInfo: ",syncInfo.data)

        output.isSyncing = syncInfo.data

        //gaiad abci_info
        let nodeInfo = await axios({method:'GET',url: URL_MIDGARD+'/node_info'})
        log.debug(tag,"nodeInfo: ",nodeInfo.data)
        output = nodeInfo.data


        let lastBlock = await axios({method:'GET',url: URL_MIDGARD+'/blocks/latest'})
        log.info(tag,"lastBlock: ",lastBlock.data)

        //let height

        output.height = lastBlock.data.block.header.height


        return output
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}
