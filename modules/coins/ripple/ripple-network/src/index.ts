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
import {SubmitRequest} from "xrpl/dist/npm/models/methods";

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
// const axiosRetry = require('axios-retry');
// axiosRetry(axios, {
//     retries: 3, // number of retries
//     retryDelay: (retryCount: number) => {
//         console.log(`retry attempt: ${retryCount}`);
//         return retryCount * 2000; // time interval between retries
//     },
//     retryCondition: (error: { response: { status: number; }; }) => {
//         console.error(error)
//         // if retry condition is not specified, by default idempotent requests are retried
//         return error.response.status === 503;
//     },
// });
const xrpl = require("xrpl")
const log = require('@pioneer-platform/loggerdog')()

let URL_THORNODE = process.env['URL_THORNODE'] || 'https://thornode.ninerealms.com'
//let URL_MIDGARD = process.env['URL_THORNODE'] || 'https://testnet.midgard.thorchain.info/v2'

let BASE_THOR = 100000000

/**********************************
 // Module
 //**********************************/
let client: any
let URL_NODE = "https://xrplcluster.com"
//https://s1.ripple.com:51234
// let URL_NODE = "https://s1.ripple.com:51234"

module.exports = {
    init:async function (url:string,settings:any) {
        // client = new xrpl.Client("wss://s.altnet.rippletest.net:51233")
        client = new xrpl.Client("wss://xrplcluster.com/")
        // console.log(client)
        await client.connect()
        return true
    },
    isOnline:function () {
        return true;
    },
    // info:function () {
    //     return get_node_info_verbose();
    // },
    getBalance:function (address:string) {
        return get_balance(address);
    },
    getAccount:function (address:string) {
        return get_account_info(address);
    },
    // getLastBlock:function () {
    //     return get_last_block();
    // },
    // getBlockHeight:function () {
    //     return get_block_height();
    // },
    // getAccountInfo:function (address:string) {
    //     return get_account_info(address);
    // },
    // txs: function (address:string) {
    //     return get_txs_by_address(address);
    // },
    // getTransaction: function (txid:string) {
    //     return get_transaction(txid);
    // },
    // transaction: function (txid:string) {
    //     return get_transaction(txid);
    // },
    broadcast: function (tx:string) {
        return broadcast_transaction(tx);
    },
}


/**********************************
 // Lib
 //**********************************/

// let get_last_block = async function(){
//     let tag = TAG + " | get_last_block | "
//     try{
//
//         let lastBlock = await axios({method:'GET',url: URL_THORNODE+'/blocks/latest'})
//         log.debug(tag,"lastBlock: ",lastBlock.data)
//
//         return lastBlock.data.block
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }
//
// let get_block_height = async function(){
//     let tag = TAG + " | get_block_height | "
//     try{
//
//         let lastBlock = await axios({method:'GET',url: URL_THORNODE+'/blocks/latest'})
//         log.debug(tag,"lastBlock: ",lastBlock.data)
//
//         return lastBlock.data.block.header.height
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }
//
// let get_transaction = async function(txid:string){
//     let tag = TAG + " | get_transaction | "
//     try{
//         let txInfo = await axios({method:'GET',url:  URL_THORNODE+'/txs/'+txid})
//         log.debug(tag,"txInfo: ",txInfo.data)
//         return txInfo.data
//     }catch(e){
//         // log.error(tag,e.response.data)
//         // log.error(tag,e.response.data.error)
//         if(e.response.status === 404){
//             let output:any = {}
//             output.success = false
//             output.error = e.response.data.error
//             return output
//         } else {
//             throw Error(e)
//         }
//     }
// }

let broadcast_transaction = async function(tx:string) {
    let tag = TAG + " | broadcast_transaction | "
    let output:any = {}
    try {
        log.debug(tag,"CHECKPOINT 1")

        const buffer = Buffer.from(tx, 'base64');
        const bufString = buffer.toString('hex');

        output.success = false
        let data = {
            'method': 'submit',
            "id": 2,
            "command": "submit",
            "fail_hard": true,
            'params': [
                {
                    'tx_blob': bufString
                }
            ]
        }

        let urlRemote = URL_NODE + '/'
        log.debug(tag,"urlRemote: ",urlRemote)
        let result = await axios({
            url: urlRemote,
            headers: {},
            method: 'POST',
            data,
        })

        log.info(tag,'** Broadcast ** REMOTE: result: ', result.data)
        log.info(tag,'** Broadcast ** REMOTE: result: ', JSON.stringify(result.data))

        const responseData = result.data || {};
        const resultObject = responseData.result || {};
        const txJson = resultObject.tx_json || {};

        const txid = txJson.hash;
        const engineResult = resultObject.engine_result;
        const engineResultCode = resultObject.engine_result_code;
        const engineResultMessage = resultObject.engine_result_message;
        const validatedLedgerIndex = resultObject.validated_ledger_index;
        const accountSequenceNext = resultObject.account_sequence_next;
        const applied = resultObject.applied;

        // Determine success based on known Ripple conditions:
        // Typically, success is indicated by `engine_result = "tesSUCCESS"` and `engine_result_code = 0`.
        const wasSuccessful = (engineResult === 'tesSUCCESS' && engineResultCode === 0);

        output = {
            success: wasSuccessful,
            txid,
            engineResult,
            engineResultCode,
            engineResultMessage,
            validatedLedgerIndex,
            accountSequenceNext,
            applied
        };

        return output
    } catch (e) {
        console.error(tag,"throw error: ", e)
        // output.success is false by default here
        return output
    }
}

let get_account_info = async function(address:string){
    let tag = TAG + " | get_account_info | "
    try{
        const response = await client.request({
            "command": "account_info",
            "account": address,
            "ledger_index": "validated"
        })
        
        //get recent ledger as well
        let ledgerIndexCurrent = await client.getLedgerIndex()
        let output:any = response.result.account_data
        output.ledger_index_current = ledgerIndexCurrent
        return output
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

// let normalize_tx = function(tx:any,address?:string){
//     let tag = TAG + " | normalize_tx | "
//     try{
//         let output:any = {}
//
//         let sender
//         let receiver
//         let memo
//         let amount
//
//         let rawlog = JSON.parse(tx.raw_log)
//         rawlog = rawlog
//         //log.debug("rawlog: ",rawlog)
//
//         //txTypes
//         let txTypes = [
//             'send',
//             'receive',
//             'governence',
//             'swap',
//             'other'
//         ]
//
//         for(let i = 0; i < rawlog.length; i++){
//             let txEvents = rawlog[i]
//
//             //log.debug(tag,"txEvents: ",txEvents)
//             txEvents = txEvents.events
//
//             for(let j = 0; j < txEvents.length; j++){
//                 let event = txEvents[j]
//
//                 //
//                 //log.debug(tag,"event: ",event)
//                 //log.debug(tag,"attributes: ",prettyjson.render(event.attributes))
//
//                 //detect event type
//                 log.debug(tag,"type: ",event.type)
//                 switch(event.type) {
//                     case 'message':
//                         // ignore
//                         break;
//                     case 'transfer':
//                         log.debug(tag,"attributes: ",event.attributes)
//                         for(let k = 0; k < event.attributes.length; k++){
//                             let attribute = event.attributes[k]
//                             if(attribute.key === 'recipient'){
//                                 receiver = attribute.value
//                                 output.receiver = receiver
//                                 if(receiver === address) output.type = txTypes[1]
//                             }
//                             if(attribute.key === 'sender'){
//                                 sender = attribute.value
//                                 output.sender = sender
//                                 if(sender === address) output.type = txTypes[0]
//                             }
//                             if(attribute.key === 'amount'){
//                                 amount = attribute.value
//                                 amount = amount.replace('rune','')
//                                 output.amount = amount / 100000000
//                             }
//                         }
//                         break;
//                     default:
//                     // code block
//                 }
//             }
//
//             // console.log("log: ",prettyjson.render(log))
//         }
//
//         return output
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }
//
// let get_txs_by_address = async function(address:string){
//     let tag = TAG + " | get_txs_by_address | "
//     try{
//         let output:any = []
//
//         //sends
//         let url = URL_THORNODE+ '/txs?message.sender='+address
//         log.debug(tag,"url: ",url)
//         let resultSends = await axios({
//             url: url,
//             method: 'GET'
//         })
//         let sends = resultSends.data
//         log.debug('sends: ', sends)
//         if(!sends.txs) sends.txs = []
//         // TODO//pagnation
//         for(let i = 0; i < sends?.txs.length; i++ ){
//             let tx = sends.txs[i]
//
//             //pretty json
//
//             //normalize
//             tx = normalize_tx(tx,address)
//             output.push(tx)
//         }
//
//         //receives
//         url = URL_THORNODE+ '/txs?transfer.recipient='+address
//         console.log("URL_THORNODE: ",url)
//         let resultRecieves = await axios({
//             url: url,
//             method: 'GET'
//         })
//         let receives = resultRecieves.data
//         if(!receives.txs) receives.txs = []
//         log.debug('receives: ', receives)
//
//         for(let i = 0; i < receives?.txs.length; i++ ){
//             let tx = receives.txs[i]
//             //normalize
//             tx = normalize_tx(tx,address)
//             output.push(tx)
//         }
//
//
//         return output
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }

let get_balance = async function(address:string){
    let tag = TAG + " | get_balance | "
    try{
        let output = 0

        const response = await client.request({
            "command": "account_info",
            "account": address,
            "ledger_index": "validated"
        })
        // console.log(response)
        // console.log(response.result)
        // console.log(response.result.account_data)
        // console.log(response.result.account_data.Account)
        // console.log(response.result.account_data.Balance)
        // console.log(response.result.account_data.Balance / 1000000)
        response.result.account_data.Balance = parseFloat(response.result.account_data.Balance) / 1000000
        return response.result.account_data.Balance
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

// let get_node_info_verbose = async function(){
//     let tag = TAG + " | get_node_info | "
//     try{
//         let output:any = {}
//
//         //get syncing status
//         let syncInfo = await axios({method:'GET',url: URL_THORNODE+'/syncing'})
//         log.debug(tag,"syncInfo: ",syncInfo.data)
//
//         output.isSyncing = syncInfo.data
//
//         //gaiad abci_info
//         let nodeInfo = await axios({method:'GET',url: URL_THORNODE+'/node_info'})
//         log.debug(tag,"nodeInfo: ",nodeInfo.data)
//         output = nodeInfo.data
//
//         // let network = await axios({method:'GET',url: URL_THORNODE+'/network'})
//         // log.debug(tag,"nodeInfo: ",network.data)
//         // output.network = network.data
//
//
//         let lastBlock = await axios({method:'GET',url: URL_THORNODE+'/blocks/latest'})
//         log.debug(tag,"lastBlock: ",lastBlock.data)
//
//         //let height
//         output.height = lastBlock.data.block.header.height
//
//         return output
//     }catch(e){
//         log.error(tag,"e: ",e)
//         throw e
//     }
// }
