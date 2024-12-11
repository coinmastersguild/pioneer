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
const prettyjson = require('prettyjson');
require("dotenv").config({path:'../../../.env'})

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
        console.error(error)
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});

const log = require('@pioneer-platform/loggerdog')()

let URL_THORNODE = 'https://mayanode.mayachain.info'
let URL_MIDGARD = 'https://midgard.mayachain.info/v2'

let BASE_THOR = 10000000000

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
    getBalances:function (address:string) {
        return get_balances(address);
    },
    getAccount:function (address:string) {
        return get_account_info(address);
    },
    getLastBlock:function () {
        return get_last_block();
    },
    getBlockHeight:function () {
        return get_block_height();
    },
    getAccountInfo:function (address:string) {
        return get_account_info(address);
    },
    getPools: function () {
        return get_pools();
    },
    getPool: function (poolId:string) {
        return get_pool(poolId);
    },
    getPoolAddress: function () {
        return get_pool_addresses();
    },
    txs: function (address:string) {
        return get_txs_by_address(address);
    },
    getTransaction: function (txid:string) {
        return get_transaction(txid);
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
            url: URL_MIDGARD+"/pools/detail",
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

const get_pools = async function () {
    let tag = TAG + " | get_pools | "
    try {
        //
        let body = {
            method: 'GET',
            url: URL_MIDGARD+"/pools",
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

let get_last_block = async function(){
    let tag = TAG + " | get_last_block | "
    try{

        let lastBlock = await axios({method:'GET',url: URL_THORNODE+'/blocks/latest'})
        log.debug(tag,"lastBlock: ",lastBlock.data)

        return lastBlock.data.block
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

let get_block_height = async function(){
    let tag = TAG + " | get_block_height | "
    try{

        let lastBlock = await axios({method:'GET',url: URL_THORNODE+'/blocks/latest'})
        log.debug(tag,"lastBlock: ",lastBlock.data)

        return lastBlock.data.block.header.height
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

let get_transaction = async function(txid:string){
    let tag = TAG + " | get_transaction | "
    try{
        let txInfo = await axios({method:'GET',url:  URL_THORNODE+'/txs/'+txid})
        log.debug(tag,"txInfo: ",txInfo.data)
        return txInfo.data
    }catch(e:any){
        // log.error(tag,e.response.data)
        // log.error(tag,e.response.data.error)
        if(e.response.status === 404){
            let output:any = {}
            output.success = false
            output.error = e.response.data.error
            return output
        } else {
            throw Error(e)
        }
    }
}

let broadcast_transaction = async function(tx:string){
    let tag = TAG + " | broadcast_transaction | "
    let output:any = {}
    try{
        log.debug(tag,"CHECKPOINT 1")

        output.success = false


        try{
            let payload = {
                // "tx_bytes": btoa(tx),
                // "tx_bytes":broadcastTx,
                "tx_bytes":tx,
                "mode": "BROADCAST_MODE_SYNC"
            }

            let urlRemote = URL_THORNODE+ '/cosmos/tx/v1beta1/txs'
            // let urlRemote = URL_GAIAD+ '/txs'
            log.info(tag,"urlRemote: ",urlRemote)
            let result2 = await axios({
                url: urlRemote,
                headers: {
                    'api-key': process.env['NOW_NODES_API'],
                    'Content-Type': 'application/json'
                },
                method: 'POST',
                data: payload,
            })
            log.info(tag,'** Broadcast ** REMOTE: result: ', result2.data)
            log.info(tag,'** Broadcast ** REMOTE: result: ', JSON.stringify(result2.data))
            if(result2.data.txhash) output.txid = result2.data.txhash
            //tx_response
            if(result2.data.tx_response.txhash) output.txid = result2.data.tx_response.txhash

            if(result2.data.tx_response.raw_log && result2.data.tx_response.raw_log !== '[]'){
                let logSend = result2.data.tx_response.raw_log
                log.debug(tag,"logSend: ",logSend)
                output.success = false
                output.error = logSend
            } else {
                output.success = true
            }

            return output
        }catch(e:any){
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
        console.log("URL ",URL_THORNODE+'/auth/accounts/'+address)
        let txInfo = await axios({method:'GET',url: URL_THORNODE+'/auth/accounts/'+address})
        log.debug(tag,"txInfo: ",txInfo.data)

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
        //log.debug("rawlog: ",rawlog)

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

            //log.debug(tag,"txEvents: ",txEvents)
            txEvents = txEvents.events

            for(let j = 0; j < txEvents.length; j++){
                let event = txEvents[j]

                //
                //log.debug(tag,"event: ",event)
                //log.debug(tag,"attributes: ",prettyjson.render(event.attributes))

                //detect event type
                log.debug(tag,"type: ",event.type)
                switch(event.type) {
                    case 'message':
                        // ignore
                        break;
                    case 'transfer':
                        log.debug(tag,"attributes: ",event.attributes)
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
        let url = URL_THORNODE+ '/txs?message.sender='+address
        log.debug(tag,"url: ",url)
        let resultSends = await axios({
            url: url,
            method: 'GET'
        })
        let sends = resultSends.data
        log.debug('sends: ', sends)
        if(!sends.txs) sends.txs = []
        // TODO//pagnation
        for(let i = 0; i < sends?.txs.length; i++ ){
            let tx = sends.txs[i]

            //pretty json

            //normalize
            tx = normalize_tx(tx,address)
            output.push(tx)
        }

        //receives
        url = URL_THORNODE+ '/txs?transfer.recipient='+address
        console.log("URL_THORNODE: ",url)
        let resultRecieves = await axios({
            url: url,
            method: 'GET'
        })
        let receives = resultRecieves.data
        if(!receives.txs) receives.txs = []
        log.debug('receives: ', receives)

        for(let i = 0; i < receives?.txs.length; i++ ){
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
            let accountInfo = await axios({method:'GET',url: URL_THORNODE+'/bank/balances/'+address})
            log.info(tag,"accountInfo: ",accountInfo.data)

            //
            if(accountInfo.data?.result){
                for(let i = 0; i < accountInfo.data.result.length; i++){
                    let entry = accountInfo.data.result[i]
                    if(entry.denom === 'cacao'){
                        output = entry.amount
                    }
                }
            }

            output = output / BASE_THOR
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

let get_balances = async function(address:string){
    let tag = TAG + " | get_balances | "
    try{
        let output = []

        try{
            let accountInfo = await axios({method:'GET',url: URL_THORNODE+'/bank/balances/'+address})
            log.info(tag,"accountInfo: ",accountInfo.data)

            //
            if(accountInfo.data?.result){
                for(let i = 0; i < accountInfo.data.result.length; i++){
                    let entry = accountInfo.data.result[i]
                    if(entry.denom === 'cacao'){
                        output.push({
                            denom: entry.denom,
                            amountBase: entry.amount,
                            amount: entry.amount / 10000000000,
                            decimals: 10
                        })
                    }
                    if(entry.denom === 'maya'){
                        output.push({
                            denom: entry.denom,
                            amountBase: entry.amount,
                            amount: entry.amount / 10000,
                            decimals: 4
                        })
                    }
                }
            }
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
        let syncInfo = await axios({method:'GET',url: URL_THORNODE+'/syncing'})
        log.debug(tag,"syncInfo: ",syncInfo.data)

        output.isSyncing = syncInfo.data

        //gaiad abci_info
        let nodeInfo = await axios({method:'GET',url: URL_THORNODE+'/node_info'})
        log.debug(tag,"nodeInfo: ",nodeInfo.data)
        output = nodeInfo.data

        // let network = await axios({method:'GET',url: URL_THORNODE+'/network'})
        // log.debug(tag,"nodeInfo: ",network.data)
        // output.network = network.data


        let lastBlock = await axios({method:'GET',url: URL_THORNODE+'/blocks/latest'})
        log.debug(tag,"lastBlock: ",lastBlock.data)

        //let height
        output.height = lastBlock.data.block.header.height

        return output
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}
