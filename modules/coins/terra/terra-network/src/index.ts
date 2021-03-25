/*
    Terra network

    https://github.com/terra-project/mainnet


export const DEFAULT_NETWORK = networksConfig[0].key || "columbus-4";
export const DEFAULT_FCD = `https://fcd.terra.dev`;
export const DEFAULT_MANTLE = "https://mantle.terra.dev";
export const BASE_DENOM = `uluna`;

*/
const TAG = " | thorchain-api | "
const prettyjson = require('prettyjson');
require("dotenv").config({path:'../../../.env'})

const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

const log = require('@pioneer-platform/loggerdog')()

/*
Known seed node list:
5d9b8ac70000bd4ab1de3ccaf85eb43f8e315146@seed.terra.delightlabs.io:26656
6d8e943c049a80c161a889cb5fcf3d184215023e@public-seed2.terra.dev:26656
87048bf71526fb92d73733ba3ddb79b7a83ca11e@public-seed.terra.dev:26656

 */

const networks = [
    {
        key: "columbus-4",
        fcd: "https://fcd.terra.dev",
        mantle: "https://mantle.terra.dev"
    },
    {
        key: "columbus-3",
        fcd: "https://columbus-3-fcd.terra.dev",
        selectable: false
    },
    {
        key: "columbus-2",
        fcd: "https://columbus-2-fcd.terra.dev",
        selectable: false
    },
    {
        key: "columbus-1",
        fcd: "https://columbus-1-fcd.terra.dev",
        selectable: false
    },
    {
        // separator
    },
    {
        key: "tequila-0004",
        fcd: "https://tequila-fcd.terra.dev",
        mantle: "https://tequila-mantle.terra.dev"
    },
    {
        // separator
    },
    {
        key: "localterra",
        fcd: "http://localhost:3060",
        mantle: "http://localhost:1337"
    }
];

let URL_TERRA_FCD = process.env['URL_TERRA_FCD'] || networks[0].fcd
let URL_TERRA_MANTLE = process.env['URL_TERRA_MANTLE'] || networks[0].fcd

const DEFAULT_NETWORK = "columbus-4";
const DEFAULT_FCD = `https://fcd.terra.dev`;
const DEFAULT_MANTLE = "https://mantle.terra.dev";
const BASE_DENOM = `uluna`;


let BASE_TERRA = 100000000

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
        let txInfo = await axios({method:'GET',url:  URL_TERRA_FCD+'/txs/'+txid})
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
            let urlRemote = URL_TERRA_FCD+ '/txs'
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
        console.log("URL ",URL_TERRA_FCD+'/auth/accounts/'+address)
        let txInfo = await axios({method:'GET',url: URL_TERRA_FCD+'/auth/accounts/'+address})
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
        //log.info("rawlog: ",rawlog)

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
                                amount = amount.replace('rune','')
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
        let url = URL_TERRA_FCD+ '/txs?message.sender='+address
        log.debug(tag,"url: ",url)
        let resultSends = await axios({
            url: url,
            method: 'GET'
        })
        let sends = resultSends.data
        //log.info('sends: ', sends)

        // TODO//pagnation
        // let pagesSends = sends.page_number
        // for(let i = 0; i < pagesSends; i++){
        //
        // }
        for(let i = 0; i < sends.txs.length; i++ ){
            let tx = sends.txs[i]

            //pretty json

            //normalize
            tx = normalize_tx(tx,address)
            output.push(tx)
        }

        //receives
        url = URL_TERRA_FCD+ '/txs?transfer.recipient='+address
        console.log("URL_TERRA_FCD: ",url)
        let resultRecieves = await axios({
            url: url,
            method: 'GET'
        })
        let receives = resultRecieves.data
        log.info('receives: ', receives)

        for(let i = 0; i < receives.txs.length; i++ ){
            let tx = receives.txs[i]
            //normalize
            tx = normalize_tx(tx,address)
            output.push(tx)
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
            let accountInfo = await axios({method:'GET',url: URL_TERRA_FCD+'/bank/balances/'+address})
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

            output = output / BASE_TERRA
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
        let syncInfo = await axios({method:'GET',url: URL_TERRA_FCD+'/syncing'})
        log.info(tag,"syncInfo: ",syncInfo.data)

        output.isSyncing = syncInfo.data

        //gaiad abci_info
        let nodeInfo = await axios({method:'GET',url: URL_TERRA_FCD+'/node_info'})
        log.debug(tag,"nodeInfo: ",nodeInfo.data)
        output = nodeInfo.data


        let lastBlock = await axios({method:'GET',url: URL_TERRA_FCD+'/blocks/latest'})
        log.info(tag,"lastBlock: ",lastBlock.data)

        //let height

        output.height = lastBlock.data.block.header.height


        return output
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}
