/*
     OSMO Network


*/
const pjson = require("../package.json")
const TAG = " | "+pjson.name.replace("@pioneer-platform/","")+" | "

require("dotenv").config({path:'../../../.env'})

const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
const request = require("request-promise")
const log = require('@pioneer-platform/loggerdog')()

let URL_OSMO_RPC = process.env['URL_OSMO_RPC']
if(!URL_OSMO_RPC) throw Error('missing env URL_OSMO_RPC')

let URL_OSMO_LCD = process.env['URL_OSMO_LCD']
if(!URL_OSMO_LCD) throw Error('missing env URL_OSMO_LCD')

let URL_OSMO_POOLS = process.env['URL_OSMO_POOLS'] || `https://api-osmosis.imperator.co`

let BASE_OSMO = 100000000

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
    getBlockHeight:function () {
        return get_block_height();
    },
    getBalance:function (address:string) {
        return get_balance(address);
    },
    getBalances:function (address:string) {
        return get_balances(address);
    },
    getAccount:function (address:string) {
        return get_account_info(address);
    },
    getPools:function () {
        return get_pools();
    },
    getValidators:function () {
        return get_validators();
    },
    getDelegations:function (address:string,validator:string) {
        return get_delegations(address,validator);
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

//
let get_block_height = async function(){
    let tag = TAG + " | get_block_height | "
    let output:any = {}
    try{

        let resp = await axios({method:'GET',url: URL_OSMO_LCD+'/blocks/latest'})
        log.debug(tag,"resp: ",resp.data)

        let height = resp.data.block.header.height

        return parseInt(height)
    }catch(e){
        throw e
    }
}

//get pools
let get_pools = async function(){
    let tag = TAG + " | get_pools | "
    let output:any = {}
    try{
        let poolInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/osmosis/gamm/v1beta1/pools'})
        log.debug(tag,"poolInfo: ",poolInfo.data)

        //wtf is imperator?
        // let txInfo
        // let poolInfo = await axios({method:'GET',url: URL_OSMO_POOLS+'/search/v1/pools'})
        // log.debug(tag,"txInfo: ",poolInfo.data)

        return poolInfo.data
    }catch(e){
        throw e
    }
}

let get_delegations = async function(address:string,valAddress:string){
    let tag = TAG + " | get_delegations | "
    let output:any = {}
    try{
        // let txInfo
        let txInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/staking/delegators/'+address+'/delegations/'+valAddress})
        log.debug(tag,"txInfo: ",txInfo.data)

        // let txInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/txs?delegator='+address})
        // log.debug(tag,"txInfo: ",txInfo.data)

        return txInfo.data
    }catch(e){
        throw e
    }
}

let get_validators = async function(){
    let tag = TAG + " | get_validators | "
    let output:any = {}
    try{
        let txInfo
        txInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/staking/validators'})
        log.debug(tag,"txInfo: ",txInfo.data)

        if(!txInfo.data.result) throw Error("103: failed to get validators! ")
        //result
        let validators = txInfo.data.result

        //sort by tokens
        validators.sort(function(a:any, b:any){
            return parseInt(a.tokens)-parseInt(b.tokens)
        })
        validators.reverse()

        return validators
    }catch(e){
        throw e
    }
}

let get_transaction = async function(txid:string){
    let tag = TAG + " | get_transaction | "
    try{
        let txInfo = await axios({method:'GET',url:  URL_OSMO_LCD+'/txs/'+txid})
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
            //push to rpc
            // let urlRemote = URL_OSMO_RPC

            const txBytesBase64 = Buffer.from(tx, 'binary').toString('base64');

            // let options = {
            //     method : "POST",
            //     url : URL_OSMO_RPC+'/BroadcastTx',
            //     headers :{'content-type':'application/json'},
            //     body :  {
            //         "jsonrpc":"2.0",
            //         "method" : "BROADCAST_MODE_SYNC",
            //         "params": txBytesBase64,
            //         "id": 1
            //     }
            // };
            // //console.log("options: ",options)
            // let result = await request(options);
            // console.log("result: ",result)

            // if(result2.data.txhash) output.txid = result2.data.txhash
            //
            // //verify success
            // if(result2.data.raw_log){
            //     let logSend = result2.data.raw_log
            //     log.info(tag,"logSend: ",logSend)
            // }
            // output.height = result2.height
            // output.gas_wanted = result2.gas_wanted
            // output.gas_used = result2.gas_used
            // output.raw = result2.data

            // console.log("tx: ",tx)
            // let txInfo = await axios({method:'GET',url: URL_OSMO_RPC+'/broadcast_tx_sync?tx='+txBytesBase64})
            // log.info(tag,"txInfo: ",txInfo.data)

            // const txBytesBase64 = Buffer.from(tx, 'binary').toString('base64');
            //
            // var options = {
            //     method: 'POST',
            //     url: URL_OSMO_LCD + '/tx/v1beta1/txs',
            //     headers:
            //         { 'Content-Type': 'application/json' },
            //     body: { tx_bytes: txBytesBase64, mode: 'BROADCAST_MODE_SYNC' },
            //     json: true
            // };
            //
            // let result = await request(options);
            // console.log("result: ",result)

            //push to rest
            let urlRemote = URL_OSMO_LCD+ '/txs'
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
        console.log("URL ",URL_OSMO_LCD+'/auth/accounts/'+address)
        let txInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/auth/accounts/'+address})
        log.info(tag,"txInfo: ",txInfo.data)

        return txInfo.data
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

let normalize_tx = function(tx:any,address?:string){
    let tag = TAG + " | normalize_tx | "
    try{
        let output:any = {}

        let sender
        let receiver
        let memo
        let amount

        let rawlog = JSON.parse(tx.raw_log)
        rawlog = rawlog
        log.info("rawlog: ",rawlog)

        output.txid = tx.txhash
        output.height = tx.height

        output.gas = {
            gas_wanted:tx.gas_wanted,
            gas_used:tx.gas_used
        }

        //txTypes
        let txTypes = [
            'send',
            'receive',
            'governence',
            'swap',
            'other'
        ]

        for(let i = 0; i < rawlog.length; i++){
            let txEvents = rawlog[i]

            //log.info(tag,"txEvents: ",txEvents)
            txEvents = txEvents.events

            for(let j = 0; j < txEvents.length; j++){
                let event = txEvents[j]

                //
                //log.info(tag,"event: ",event)
                //log.info(tag,"attributes: ",prettyjson.render(event.attributes))

                //detect event type
                log.info(tag,"type: ",event.type)
                switch(event.type) {
                    case 'message':
                        // ignore
                        break;
                    case 'transfer':
                        log.info(tag,"attributes: ",event.attributes)
                        for(let k = 0; k < event.attributes.length; k++){
                            let attribute = event.attributes[k]
                            if(attribute.key === 'recipient'){
                                receiver = attribute.value
                                output.receiver = receiver
                                if(receiver === address) output.type = txTypes[1]
                            }
                            if(attribute.key === 'sender'){
                                sender = attribute.value
                                output.sender = sender
                                if(sender === address) output.type = txTypes[0]
                            }
                            if(attribute.key === 'amount'){
                                amount = attribute.value
                                amount = amount.replace('uosmo','')
                                output.amount = amount / 100000000
                            }
                        }
                        break;
                    default:
                    // code block
                }
            }

            // console.log("log: ",prettyjson.render(log))
        }

        return output
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

let get_txs_by_address = async function(address:string){
    let tag = TAG + " | get_txs_by_address | "
    try{
        let output:any = []

        //sends
        let url = URL_OSMO_LCD+ '/txs?message.sender='+address
        log.info(tag,"url: ",url)
        let resultSends = await axios({
            url: url,
            method: 'GET'
        })
        let sends = resultSends.data
        log.info('sends: ', sends)

        if(sends.txs){
            for(let i = 0; i < sends.txs.length; i++ ){
                let tx = sends.txs[i]
                tx = normalize_tx(tx,address)
                output.push(tx)
            }
        }

        //receives
        url = URL_OSMO_LCD+ '/txs?transfer.recipient='+address
        console.log("URL_OSMO_LCD: ",url)
        let resultRecieves = await axios({
            url: url,
            method: 'GET'
        })
        let receives = resultRecieves.data
        log.info('receives: ', receives)
        if(receives.txs){
            for(let i = 0; i < receives.txs.length; i++ ){
                let tx = receives.txs[i]
                //normalize
                tx = normalize_tx(tx,address)
                output.push(tx)
            }
        }

        return output
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

let get_balances = async function(address:string){
    let tag = TAG + " | get_balances | "
    try{
        let output = 0

        try{
            let accountInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/bank/balances/'+address})
            log.info(tag,"accountInfo: ",accountInfo.data)

            //
            if(accountInfo.data?.result){
                for(let i = 0; i < accountInfo.data.result.length; i++){
                    let entry = accountInfo.data.result[i]
                    if(entry.denom === 'uosmo'){
                        output = entry.amount
                    }
                }
            }

            output = output / BASE_OSMO
        }catch(e){
            //TODO stupid node 404's on new addresses!
            //if !404
            //really thow
        }


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

        try{
            let accountInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/bank/balances/'+address})
            log.info(tag,"accountInfo: ",accountInfo.data)

            //
            if(accountInfo.data?.result){
                for(let i = 0; i < accountInfo.data.result.length; i++){
                    let entry = accountInfo.data.result[i]
                    if(entry.denom === 'uosmo'){
                        output = entry.amount
                    }
                }
            }

            output = output / BASE_OSMO
        }catch(e){
            //TODO stupid node 404's on new addresses!
            //if !404
                //really thow
        }


        return output
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
        let syncInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/syncing'})
        log.info(tag,"syncInfo: ",syncInfo.data)

        output.isSyncing = syncInfo.data

        //gaiad abci_info
        let nodeInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/node_info'})
        log.debug(tag,"nodeInfo: ",nodeInfo.data)
        output = nodeInfo.data


        // let lastBlock = await axios({method:'GET',url: URL_OSMO_LCD+'/blocks/latest'})
        // log.info(tag,"lastBlock: ",lastBlock.data)

        //let height

        //output.height = lastBlock.data.block.header.height


        return output
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}
