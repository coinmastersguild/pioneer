/*
     OSMO Network


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


let URL_OSMO_LCD = process.env['URL_OSMO_LCD']
if(!URL_OSMO_LCD) throw Error('missing env URL_OSMO_LCD')
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
            //push to seed
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

