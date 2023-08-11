
/*
    Anycoin Nodes:

    Types of nodes

    Daemons: raw coin nodes

    Blockbook: blockbook indexed nodes (address index)

    Unchained: shapeshift custom API nodes



    Uncchained Spec
    {
      GetInfo: [Function (anonymous)],
      GetAccount: [Function (anonymous)],
      GetTxHistory: [Function (anonymous)],
      GetUtxos: [Function (anonymous)],
      GetTransaction: [Function (anonymous)],
      GetRawTransaction: [Function (anonymous)],
      SendTx: [Function (anonymous)],
      GetNetworkFees: [Function (anonymous)]
    }


 */


const TAG = " | utxo-api | "
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
const log = require('@pioneer-platform/loggerdog')()

import {
    Fees,
} from '@xchainjs/xchain-client'

const BitcoinRpc = require('bitcoin-rpc-promise');
// import { Blockbook } from 'blockbook-client'

let Unchained = require("@pioneer-platform/unchained")
const blockbook = require('@pioneer-platform/blockbook')
import * as sochain from './sochain-api'
import { FeeRates } from './types/client-types'
import * as Utils from './utils'

let coins = [
    'TBTC',
    'BCH'
    //'BTC',
    //'DOGE','DASH','DGB','BCH','LTC'
]

let nodeMap:any = {}
for(let i = 0; i < coins.length; i++){
    let coin = coins[i]
    let connString = 'https://user:hunter2@'+process.env[coin+'_RPC_HOST']
    nodeMap[coin] = new BitcoinRpc(connString);
}

const URL_BLOCKCHAIN_INFO = "http://blockchain.info"

const URL_BLOCKBOOK_BTC = ""

let SYMBOL_TO_CAIP:any = {
    "BCH":"bip122:000000000000000000651ef99cb9fcbe/slip44:145",
    // "ETH":"eip155:1/slip44:60",
    "BTC":"bip122:000000000019d6689c085ae165831e93/slip44:0",
    "DASH":"bip122:dash-hash/slip44:5",
    "DOGE":"bip122:00000000001a91e3dace36e2be3bf030/slip44:3",
    "LTC":"bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2",
}

let RUNTIME = 'pioneer'

const ONLINE = []
const OFFLINE = []

let unchained:any

module.exports = {
    init:function (servers:any) {
    	return init_network(servers);
    },
    getInfo:function (coin:string) {
        return get_node_info(coin);
    },
    // nodeInfoSyncing:function () {
    //     return get_node_syncing();
    // },
    // nodeInfoVersion:function () {
    //     return get_node_version();
    // },
    // txsByAddress: function (coin:string,address:string) {
    //     return get_txs_by_address(coin,address);
    // },
    txsMulti: function (coin:string,addresses:any) {
        return get_txs_by_addresses(coin,addresses);
    },
    txsByXpub: function (coin:string,addresses:any) {
        return get_txs_by_xpub(coin,addresses);
    },
    utxosByXpub: function (coin:string,xpub:any) {
        return get_utxos_by_xpub(coin,xpub);
    },
    getPubkeyInfo: function (coin:string,xpub:any) {
        return get_pubkey_info(coin,xpub);
    },
    getBalanceByXpub: function (coin:string,xpub:any) {
        return get_balance_by_xpub(coin,xpub);
    },
    getBalance: function (coin:string,address:string) {
        return get_balance_by_address(coin,address);
    },
    getBalances: function (coin:string,addresses:any) {
        return get_balance_by_addresses(coin,addresses);
    },
    // unspentInputs: function (coin:string,address:string) {
    //     return get_unspent_by_address(coin,address);
    // },
    // txsByHeight: function (height,address) {
    //     return get_txs_by_height(height,address);
    // },
    getBlockHeight:async function (coin:string) {
        return nodeMap[coin].getBlockCount();
    },
    getTransaction:function (coin:string,txid:string,format?:string) {
        return get_transaction(coin,txid,format);
    },
    // getBalance:function (address) {
    //     return get_balance(address);
    // },
    getFee:function (coin:string) {
        return get_fee(coin);
    },
    getFeeRates:function (coin:string,memo?:string) {
        return get_fees_with_rates(coin,memo);
    },
    getFeesWithMemo:function (coin:string,memo?:string) {
        return get_fees_with_memo(coin,memo);
    },
    getFeesWithRates:function (coin:string,memo?:string) {
        return get_fees_with_rates(coin,memo);
    },
    getBlock:function (coin:string,height:number) {
        return get_block(coin,height);
    },
    getBlockHash:function (coin:string,height:number) {
        return get_block_hash(coin,height);
    },
    decodeRawTransaction:function (coin:string,hex:string) {
        return nodeMap[coin].decodeRawTransaction(hex);
    },
    createRawTransaction:function (coin:string,hex:string) {
        return nodeMap[coin].decodeRawTransaction(hex);
    },
    broadcast:function (coin:string,tx:string) {
        return broadcast_transaction(coin,tx);
    },
    // getAccount:function (address) {
    //     return get_account(address);
    // },
    // getSequence:function (address) {
    //     return get_account_sequence(address);
    // },
    // getValidators:function () {
    //     return get_validators();
    // }
}


let init_network = async function (servers:any) {
    let tag = ' | init_network | '
    try {
        log.debug(tag,"checkpoint: ")
        let output:any = []

        // @TODO
        // const blockbooks = servers.filter((server: { type: string; }) => server.type === 'blockbook');
        // log.debug(tag,"blockbooks: ",blockbooks)
        
        await blockbook.init()
        
        // @TODO
        //load daemon servers

        //load unchained servers
        const unchainedServers = servers.filter((server: { type: string; }) => server.type === 'unchained');
        //log.info(tag,"unchainedServers: ",unchainedServers)
        unchained = await Unchained.init(unchainedServers)
        //log.info("unchained: ",unchained)

        //figure out what is online, and if can meet blockchain requirements

        //return online servers

        return true
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}

let get_pubkey_info = async function(coin:string,xpub:string){
    let tag = TAG + " | get_pubkey_info | "
    try{
        let output = await blockbook.getPubkeyInfo(coin,xpub)
        log.debug(tag,"output: ",output)

        return output
    }catch(e){
        console.error(tag,e)
    }
}


let get_fees_with_memo = async function(coin:string,memo?:string){
    let tag = TAG + " | get_fees_with_memo | "
    try{
        // @ts-ignore
        const { fees } = await get_fees_with_rates(<string>memo)
        return fees
    }catch(e){
        console.error(tag,e)
    }
}

let get_fees_with_rates = async function(coin:string,memo?:string){
    let tag = TAG + " | get_fees_with_rates | "
    try{
        let output:any = {}
        const txFee = await sochain.getSuggestedTxFee(coin.toLowerCase())
        console.log("txFee: ",txFee)

        const rates: FeeRates = {
            fastest: txFee * 5, //holy fuck
            fast: txFee * 1,
            average: txFee * 0.5,
        }

        const fees: Fees = {
            type: 'byte',
            fast: Utils.calcFee(rates.fast, memo),
            average: Utils.calcFee(rates.average, memo),
            fastest: Utils.calcFee(rates.fastest, memo),
        }

        return { fees, rates }
    }catch(e){
        console.error(tag,e)
        throw e
    }
}

let get_fee = async function(coin:string){
    let tag = TAG + " | get_fee | "
    try{
        let output:any = {}
        log.info(tag,"coin: ",coin)
        log.info(tag,"caip: ",SYMBOL_TO_CAIP[coin])
        //get caip for symbol
        // @ts-ignore
        if(unchained[SYMBOL_TO_CAIP[coin]]){
            let result = await unchained[SYMBOL_TO_CAIP[coin]].GetNetworkFees()
            //console.log("result: ",result.data)
            output = result.data
        } else {
            let fee = await get_fees_with_rates(coin)
            console.log("fee: ",fee)
            // console.log("fee.rates: ",fee.fees)
            // console.log("fee.rates: ",fee.fees.rates)
            if(fee && fee.rates)output = fee.rates

            //@TODO fall back to node
        }

        return output
    }catch(e){
        console.error(tag,e)
    }
}

/*
    TODO - this is a mess
    
    - need to figure out how to handle unchained vs node
    
    We should broadcast many nodes
    
    - unchained
    - daemon
    - blockbook
    
    shotgun approach
    push too all
    first txid returns success
 */

let broadcast_transaction = async function(coin:string,tx:string){
    let tag = TAG + " | broadcast_transaction | "
    try{

        let output:any = {
            success:false
        }
        log.info(tag,"coin: ",coin)
        if(unchained[SYMBOL_TO_CAIP[coin]]){
            // log.info("unchained[SYMBOL_TO_CAIP[coin]]: ",unchained[SYMBOL_TO_CAIP[coin]])
            let result = await unchained[SYMBOL_TO_CAIP[coin]].SendTx({hex:tx})
            log.info(tag,"result.data: ",result.data)
            output.txid = result.data
            output.success = true
        } else {
            let responseBroadcast = await blockbook.broadcast(coin,tx)
            log.info(tag,'responseBroadcast: ',responseBroadcast)
            if(responseBroadcast.success && responseBroadcast.success !== false){
                output.success = true
                if(responseBroadcast.txid){
                    output.txid = responseBroadcast.resp.data.result
                }
                if(responseBroadcast.resp.data.result){
                    output.txid = responseBroadcast.resp.data.result
                }
            } else if(responseBroadcast.error) {
                output.error = responseBroadcast.error
            } else {
                output.error = "unknown error"
                output.debug = responseBroadcast
            }
            // console.log("no unchained for coin: ",coin)
            // //@TODO fall back to node
            // output.success = false
            // output.error = "no unchained for coin: "+coin
        }


        //Jesus fuck
        // try{
        //     //TODO use for non-bitcoin? wtf why bitcoin blockbook broke?
        //     let responseBroadcast
        //     if(coin === 'BTC'){
        //         log.info(tag,"BTC detected!")
        //         let url = "https://api.bitcoin.shapeshift.com/api/v1/send"
        //         let body = {
        //             url,
        //             method: 'POST',
        //             json:false,
        //             data:{hex:tx},
        //         }
        //         let output:any = {
        //             success:false
        //         }
        //         try{
        //             responseBroadcast = await axios(body)
        //             responseBroadcast = responseBroadcast.data
        //             log.info(tag,'responseBroadcast: ',responseBroadcast)
        //             output.txid = responseBroadcast
        //             if(output.txid)output.success = true
        //
        //         }catch(e:any){
        //             // log.info(tag,"error: ",e)
        //             // log.info(tag,"data0: ",e)
        //             // log.info(tag,"resp: ",resp)
        //             // log.info(tag,"data0: ",Object.keys(e))
        //             // log.info(tag,"data1: ",e.response.req)
        //             log.info(tag,"data2: ",e.response.data)
        //             log.info(tag,"data2: ",e.response.data.message)
        //             // log.info(tag,"error3: ",e.toJSON().request)
        //             // log.info(tag,"erro4: ",e.toJSON().data)
        //             // log.info(tag,"error5: ",e.toJSON().code)
        //             if(e.response.data.message){
        //                 log.info(tag,"saving message! ")
        //                 output.error = e.response.data.message
        //             }else{
        //                 output.error = e
        //             }
        //         }
        //         log.info(tag,"output: ",output)
        //         return output
        //     } else {
        //         responseBroadcast = await blockbook.broadcast(coin,tx)
        //         log.info(tag,'responseBroadcast: ',responseBroadcast)
        //         if(responseBroadcast.success && responseBroadcast.success !== false){
        //             output.success = true
        //             if(responseBroadcast.txid){
        //                 output.txid = responseBroadcast.resp.data.result
        //             }
        //             if(responseBroadcast.resp.data.result){
        //                 output.txid = responseBroadcast.resp.data.result
        //             }
        //         } else if(responseBroadcast.error) {
        //             output.error = responseBroadcast.error
        //         } else {
        //             output.error = "unknown error"
        //             output.debug = responseBroadcast
        //         }
        //         return output
        //     }
        //
        //     //use nodes
        //     // log.info(tag,'nodeMap: ',nodeMap)
        //     // let responseBroadcast = await nodeMap[coin].sendRawTransaction(tx)
        //     // log.info(tag,'responseBroadcast: ',responseBroadcast)
        //
        //
        // }catch(e){
        //     //TODO handle errors
        //     if(!output.error)output.error = e
        //     return output
        // }
        return output
    }catch(e){
        console.error(tag,e)
        throw e
    }
}

let get_balance_by_addresses = async function(coin:string,addresses:any){
    let tag = TAG + " | get_balance_by_address | "
    try{

        let query = URL_BLOCKCHAIN_INFO + "/multiaddr?active="
        for(let i = 0; i < addresses.length; i++){
            let address = addresses[i]
            query = query + address + "|"
        }

        console.log(query)
        //let query =

        let balanceInfo = await axios({method:'GET',url:query})


        //https://blockchain.info/multiaddr?active=$address|$address

        return balanceInfo.data
    }catch(e){
        console.error(tag,e)
    }
}

let get_balance_by_address = async function(coin:string,address:string){
    let tag = TAG + " | get_balance_by_address | "
    try{
        //
        let balanceInfo = await axios({method:'GET',url:URL_BLOCKBOOK_BTC+'/address/'+address})


        return balanceInfo.data.balance
    }catch(e){
        console.error(tag,e)
    }
}

let get_utxos_by_xpub = async function(coin:string,xpub:string){
    let tag = TAG + " | get_utxos_by_xpub | "
    try{
        //
        let output:any = {}

        if(unchained[SYMBOL_TO_CAIP[coin]]){
            // log.info("unchained[SYMBOL_TO_CAIP[coin]]: ",unchained[SYMBOL_TO_CAIP[coin]])
            let result = await unchained[SYMBOL_TO_CAIP[coin]].GetUtxos({pubkey:xpub})
            //console.log("result: ",result.data)
            output = result.data
        } else {
            try{
                output = await blockbook.utxosByXpub(coin,xpub)
                log.info(tag,"output: ",output)
                //@TODO fall back to node                
            }catch(e){
                output.error = e
            }
        }

        return output
    }catch(e){
        console.error(tag,e)
        throw e
    }
}

let get_balance_by_xpub = async function(coin:string,xpub:any){
    let tag = TAG + " | get_balance_by_xpub | "
    try{
        let output = await blockbook.utxosByXpub(coin,xpub)
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

let get_block_hash = async function(coin:string,height:number){
    let tag = TAG + " | get_node_info | "
    try{
        let blockHash = await nodeMap[coin].getBlockHash(height)
        log.debug(tag,"blockHash: ",blockHash)

        return blockHash
    }catch(e){
        console.error(tag,e)
    }
}

let get_transaction = async function (coin:string,txid:string,format?:string) {
    let tag = ' | get_transaction | '
    try {
        log.debug(tag,"checkpoint: ")
        let txInfo:any = {}

        let output = await blockbook.getTransaction(coin,txid)
        log.debug(tag,"output: ",output)


        return output
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}

let get_txs_by_xpub = async function (coin:string,xpub:string) {
    let tag = ' | get_txs_by_xpub | '
    try {
        log.debug(tag,"checkpoint: ",xpub)
        let output:any = []


        let url = "https://blockchain.info/" +"rawaddr/"+xpub

        //
        // let txInfo = await axios({method:'GET',url})


        // return txInfo.data
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}

// let get_unspent_by_address = async function (coin:string,address:string) {
//     let tag = ' | get_txs_by_address | '
//     try {
//         log.debug(tag,"checkpoint: ",address)
//         let output:any = []
//
//
//         let client = new ElectrumClient(DEFAULT_SERVERS[coin].port,DEFAULT_SERVERS[coin].host, 'tcp')
//         await client.connect()
//
//         //get script hash of address
//         let script = bitcoin.address.toOutputScript(address)
//         let hash = bitcoin.crypto.sha256(script)
//         let reversedHash = new Buffer(hash.reverse())
//
//         log.debug(tag,address, ' maps to ', reversedHash.toString('hex'))
//         let scriptHex = reversedHash.toString('hex')
//
//         let unspent = await client.blockchainScripthash_listunspent(scriptHex)
//         await client.close()
//
//         return unspent
//     } catch (e) {
//         console.error(tag, 'Error: ', e)
//         throw e
//     }
// }

let get_txs_by_addresses = async function (coin:string,addresses:any) {
    let tag = ' | get_txs_by_address | '
    try {
        log.debug(tag,"checkpoint: ",addresses)
        let output:any = []

        //tier 0



        //tier 1
        // let url = "https://blockchain.info/" +"multiaddr?active="+address
        // //
        // let txInfo = await axios({method:'GET',url})
        //
        //
        // return txInfo.data
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}

let get_txs_by_xpubs = async function (coin:string,xpub:string) {
    let tag = ' | get_txs_by_xpubs | '
    try {
        log.debug(tag,"checkpoint: ",xpub)
        let output:any = []

        //tier 0
        let txInfo
        if(coin !== "BTC"){

            //tier 1
            let url = "https://blockchain.info/" +"multiaddr?active="+xpub
            //
            // txInfo = await axios({method:'GET',url})


        } else {
            //TODO
            throw Error("not supported! '")
        }

        // return txInfo.data
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}


// let get_txs_by_address = async function (coin:string,address:string) {
//     let tag = ' | get_txs_by_address | '
//     try {
//         log.debug(tag,"checkpoint: ",address)
//
//         let client = new ElectrumClient(DEFAULT_SERVERS[coin].port,DEFAULT_SERVERS[coin].host, 'tcp')
//         await client.connect()
//
//         //get script hash of address
//         let script = bitcoin.address.toOutputScript(address)
//         let hash = bitcoin.crypto.sha256(script)
//         let reversedHash = new Buffer(hash.reverse())
//
//         log.debug(tag,address, ' maps to ', reversedHash.toString('hex'))
//         let scriptHex = reversedHash.toString('hex')
//
//         let history = await client.blockchainScripthash_getHistory(scriptHex)
//         await client.close()
//
//         return history
//     } catch (e) {
//         console.error(tag, 'Error: ', e)
//         throw e
//     }
// }

let get_block = async function(coin:string,height:number){
    let tag = TAG + " | get_node_info | "
    try{
        let blockHash = await nodeMap[coin].getBlockHash(height)
        log.debug(tag,"blockHash: ",blockHash)

        log.debug(tag, 'blockHash: ', blockHash)
        let blockInfo = await nodeMap[coin].getBlock(blockHash,2)
        log.debug(tag,"blockInfo: ",blockInfo)

        return blockInfo
    }catch(e){
        console.error(tag,e)
    }
}

// let get_node_info = async function(){
//     let tag = TAG + " | get_node_info | "
//     try{
//
//         //
//         let results = await client.getBlockchainInfo()
//
//         return results
//     }catch(e){
//         console.error(tag,e)
//     }
// }


// let get_node_info = async function(){
//     let tag = TAG + " | get_node_info | "
//     try{
//
//         //
//         let results = await client.getBlockchainInfo()
//
//         return results
//     }catch(e){
//         console.error(tag,e)
//     }
// }

let get_node_info = async function(coin:string){
    let tag = TAG + " | get_node_info | "
    try{
        log.debug(nodeMap)
        //
        //let results = await nodeMap[coin].getBlockchainInfo()
        // let results = await nodeMap[coin].getBlockchainInfo()

        let results = await nodeMap[coin].getBlockchainInfo()
        results.coin = coin

        return results
    }catch(e){
        console.error(tag,e)
    }
}
