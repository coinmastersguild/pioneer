"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = " | utxo-api | ";
const Axios = require('axios');
const https = require('https');
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
const log = require('@pioneer-platform/loggerdog')();
const BitcoinRpc = require('bitcoin-rpc-promise');
// import { Blockbook } from 'blockbook-client'
let Unchained = require("@pioneer-platform/unchained");
const blockbook = require('@pioneer-platform/blockbook');
const sochain = __importStar(require("./sochain-api"));
const Utils = __importStar(require("./utils"));
let coins = [
    'TBTC',
    'BCH'
    //'BTC',
    //'DOGE','DASH','DGB','BCH','LTC'
];
let nodeMap = {};
for (let i = 0; i < coins.length; i++) {
    let coin = coins[i];
    let connString = 'https://user:hunter2@' + process.env[coin + '_RPC_HOST'];
    nodeMap[coin] = new BitcoinRpc(connString);
}
const URL_BLOCKCHAIN_INFO = "http://blockchain.info";
const URL_BLOCKBOOK_BTC = "";
let { shortListNameToCaip, shortListSymbolToCaip, evmCaips } = require("@pioneer-platform/pioneer-caip");
let RUNTIME = 'pioneer';
const ONLINE = [];
const OFFLINE = [];
let unchained;
module.exports = {
    init: function (servers) {
        return init_network(servers);
    },
    getInfo: function (coin) {
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
    txsMulti: function (coin, addresses) {
        return get_txs_by_addresses(coin, addresses);
    },
    txsByXpub: function (coin, addresses) {
        return get_txs_by_xpub(coin, addresses);
    },
    utxosByXpub: function (coin, xpub) {
        return get_utxos_by_xpub(coin, xpub);
    },
    getPubkeyInfo: function (coin, xpub) {
        return get_pubkey_info(coin, xpub);
    },
    getBalanceByXpub: function (coin, xpub) {
        return get_balance_by_xpub(coin, xpub);
    },
    getBalance: function (coin, address) {
        return get_balance_by_address(coin, address);
    },
    getBalances: function (coin, addresses) {
        return get_balance_by_addresses(coin, addresses);
    },
    // unspentInputs: function (coin:string,address:string) {
    //     return get_unspent_by_address(coin,address);
    // },
    // txsByHeight: function (height,address) {
    //     return get_txs_by_height(height,address);
    // },
    getBlockHeight: async function (coin) {
        return nodeMap[coin].getBlockCount();
    },
    getTransaction: function (coin, txid, format) {
        return get_transaction(coin, txid, format);
    },
    // getBalance:function (address) {
    //     return get_balance(address);
    // },
    getFee: function (coin) {
        return get_fee(coin);
    },
    getFeeRates: function (coin, memo) {
        return get_fees_with_rates(coin, memo);
    },
    getFeesWithMemo: function (coin, memo) {
        return get_fees_with_memo(coin, memo);
    },
    getFeesWithRates: function (coin, memo) {
        return get_fees_with_rates(coin, memo);
    },
    getBlock: function (coin, height) {
        return get_block(coin, height);
    },
    getBlockHash: function (coin, height) {
        return get_block_hash(coin, height);
    },
    decodeRawTransaction: function (coin, hex) {
        return nodeMap[coin].decodeRawTransaction(hex);
    },
    createRawTransaction: function (coin, hex) {
        return nodeMap[coin].decodeRawTransaction(hex);
    },
    broadcast: function (coin, tx) {
        return broadcast_transaction(coin, tx);
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
};
let init_network = async function (servers) {
    let tag = ' | init_network | ';
    try {
        log.debug(tag, "checkpoint: ");
        let output = [];
        // @TODO
        // const blockbooks = servers.filter((server: { type: string; }) => server.type === 'blockbook');
        // log.debug(tag,"blockbooks: ",blockbooks)
        await blockbook.init();
        // @TODO
        //load daemon servers
        //load unchained servers
        if (servers) {
            const unchainedServers = servers.filter((server) => server.type === 'unchained');
            //log.debug(tag,"unchainedServers: ",unchainedServers)
            unchained = await Unchained.init();
        }
        else {
            unchained = await Unchained.init();
        }
        //log.debug("unchained: ",unchained)
        //figure out what is online, and if can meet blockchain requirements
        //return online servers
        return true;
    }
    catch (e) {
        log.error(tag, 'Error: ', e);
        throw e;
    }
};
let get_pubkey_info = async function (coin, xpub) {
    let tag = TAG + " | get_pubkey_info | ";
    try {
        let output = await blockbook.getPubkeyInfo(coin, xpub);
        log.debug(tag, "output: ", output);
        return output;
    }
    catch (e) {
        console.error(tag, e);
    }
};
let get_fees_with_memo = async function (coin, memo) {
    let tag = TAG + " | get_fees_with_memo | ";
    try {
        // @ts-ignore
        const { fees } = await get_fees_with_rates(memo);
        return fees;
    }
    catch (e) {
        console.error(tag, e);
    }
};
let get_fees_with_rates = async function (coin, memo) {
    let tag = TAG + " | get_fees_with_rates | ";
    try {
        let output = {};
        const txFee = await sochain.getSuggestedTxFee(coin.toLowerCase());
        console.log("txFee: ", txFee);
        const rates = {
            fastest: txFee * 5, //holy fuck
            fast: txFee * 1,
            average: txFee * 0.5,
        };
        const fees = {
            type: 'byte',
            fast: Utils.calcFee(rates.fast, memo),
            average: Utils.calcFee(rates.average, memo),
            fastest: Utils.calcFee(rates.fastest, memo),
        };
        return { fees, rates };
    }
    catch (e) {
        console.error(tag, e);
        throw e;
    }
};
let get_fee = async function (coin) {
    let tag = TAG + " | get_fee | ";
    try {
        let output = {};
        log.debug(tag, "coin: ", coin);
        log.debug(tag, "caip: ", shortListSymbolToCaip[coin]);
        //get caip for symbol
        // @ts-ignore
        if (unchained[shortListSymbolToCaip[coin]]) {
            let result = await unchained[shortListSymbolToCaip[coin]].GetNetworkFees();
            //console.log("result: ",result.data)
            output = result.data;
        }
        else {
            let fee = await get_fees_with_rates(coin);
            console.log("fee: ", fee);
            // console.log("fee.rates: ",fee.fees)
            // console.log("fee.rates: ",fee.fees.rates)
            if (fee && fee.rates)
                output = fee.rates;
            //@TODO fall back to node
        }
        return output;
    }
    catch (e) {
        console.error(tag, e);
    }
};
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
let broadcast_transaction = async function (coin, tx) {
    let tag = TAG + " | broadcast_transaction | ";
    try {
        let output = {
            success: false
        };
        try {
            let responseBroadcast = await blockbook.broadcast(coin, tx);
            log.info(tag, 'responseBroadcast: ', responseBroadcast);
            if (responseBroadcast.success && responseBroadcast.success !== false) {
                output.success = true;
                if (responseBroadcast.txid) {
                    output.txid = responseBroadcast.resp.data.result;
                }
                if (responseBroadcast.resp.data.result) {
                    output.txid = responseBroadcast.resp.data.result;
                }
            }
            else if (responseBroadcast.error) {
                output.error = responseBroadcast.error;
            }
            else {
                output.error = "unknown error";
                output.debug = responseBroadcast;
            }
        }
        catch (e) {
            console.log(tag, "e: ", e);
            console.log(tag, "e: ", e.toString());
        }
        //Jesus fuck
        // try{
        //     //TODO use for non-bitcoin? wtf why bitcoin blockbook broke?
        //     let responseBroadcast
        //     if(coin === 'BTC'){
        //         log.debug(tag,"BTC detected!")
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
        //             log.debug(tag,'responseBroadcast: ',responseBroadcast)
        //             output.txid = responseBroadcast
        //             if(output.txid)output.success = true
        //
        //         }catch(e:any){
        //             // log.debug(tag,"error: ",e)
        //             // log.debug(tag,"data0: ",e)
        //             // log.debug(tag,"resp: ",resp)
        //             // log.debug(tag,"data0: ",Object.keys(e))
        //             // log.debug(tag,"data1: ",e.response.req)
        //             log.debug(tag,"data2: ",e.response.data)
        //             log.debug(tag,"data2: ",e.response.data.message)
        //             // log.debug(tag,"error3: ",e.toJSON().request)
        //             // log.debug(tag,"erro4: ",e.toJSON().data)
        //             // log.debug(tag,"error5: ",e.toJSON().code)
        //             if(e.response.data.message){
        //                 log.debug(tag,"saving message! ")
        //                 output.error = e.response.data.message
        //             }else{
        //                 output.error = e
        //             }
        //         }
        //         log.debug(tag,"output: ",output)
        //         return output
        //     } else {
        //         responseBroadcast = await blockbook.broadcast(coin,tx)
        //         log.debug(tag,'responseBroadcast: ',responseBroadcast)
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
        //     // log.debug(tag,'nodeMap: ',nodeMap)
        //     // let responseBroadcast = await nodeMap[coin].sendRawTransaction(tx)
        //     // log.debug(tag,'responseBroadcast: ',responseBroadcast)
        //
        //
        // }catch(e){
        //     //TODO handle errors
        //     if(!output.error)output.error = e
        //     return output
        // }
        return output;
    }
    catch (e) {
        console.error(tag, e);
        throw e;
    }
};
let get_balance_by_addresses = async function (coin, addresses) {
    let tag = TAG + " | get_balance_by_address | ";
    try {
        let query = URL_BLOCKCHAIN_INFO + "/multiaddr?active=";
        for (let i = 0; i < addresses.length; i++) {
            let address = addresses[i];
            query = query + address + "|";
        }
        console.log(query);
        //let query =
        let balanceInfo = await axios({ method: 'GET', url: query });
        //https://blockchain.info/multiaddr?active=$address|$address
        return balanceInfo.data;
    }
    catch (e) {
        console.error(tag, e);
    }
};
let get_balance_by_address = async function (coin, address) {
    let tag = TAG + " | get_balance_by_address | ";
    try {
        //
        let balanceInfo = await axios({ method: 'GET', url: URL_BLOCKBOOK_BTC + '/address/' + address });
        return balanceInfo.data.balance;
    }
    catch (e) {
        console.error(tag, e);
    }
};
let get_utxos_by_xpub = async function (coin, xpub) {
    let tag = TAG + " | get_utxos_by_xpub | ";
    try {
        //
        let output = {};
        try {
            output = await blockbook.utxosByXpub(coin, xpub);
            log.debug(tag, "output: ", output);
            //@TODO fall back to node                
        }
        catch (e) {
            output.error = e;
        }
        // if(unchained[shortListSymbolToCaip[coin]]){
        //     log.info('USING UNCHAINED!@!!!!!! ')
        //     log.info("unchained[SYMBOL_TshortListSymbolToCaipO_CAIP[coin]]: ",unchained[shortListSymbolToCaip[coin]])
        //     let result = await unchained[shortListSymbolToCaip[coin]].GetUtxos({pubkey:xpub})
        //     //console.log("result: ",result.data)
        //     output = result.data
        // } else {
        //     try{
        //         output = await blockbook.utxosByXpub(coin,xpub)
        //         log.debug(tag,"output: ",output)
        //         //@TODO fall back to node                
        //     }catch(e){
        //         output.error = e
        //     }
        // }
        return output;
    }
    catch (e) {
        console.error(tag, e);
        throw e;
    }
};
let get_balance_by_xpub = async function (coin, xpub) {
    let tag = TAG + " | get_balance_by_xpub | ";
    try {
        let output = await blockbook.utxosByXpub(coin, xpub);
        log.info(tag, "output: ", output);
        let balance = 0;
        //tally
        for (let i = 0; i < output.length; i++) {
            let uxto = output[i];
            balance = balance + parseInt(uxto.value);
        }
        return balance;
    }
    catch (e) {
        console.error(tag, e);
    }
};
let get_block_hash = async function (coin, height) {
    let tag = TAG + " | get_node_info | ";
    try {
        let blockHash = await nodeMap[coin].getBlockHash(height);
        log.debug(tag, "blockHash: ", blockHash);
        return blockHash;
    }
    catch (e) {
        console.error(tag, e);
    }
};
let get_transaction = async function (coin, txid, format) {
    let tag = ' | get_transaction | ';
    try {
        log.debug(tag, "checkpoint: ");
        let txInfo = {};
        let output = await blockbook.getTransaction(coin, txid);
        log.debug(tag, "output: ", output);
        return output;
    }
    catch (e) {
        console.error(tag, 'Error: ', e);
        throw e;
    }
};
let get_txs_by_xpub = async function (coin, xpub) {
    let tag = ' | get_txs_by_xpub | ';
    try {
        log.debug(tag, "checkpoint: ", xpub);
        let output = [];
        let url = "https://blockchain.info/" + "rawaddr/" + xpub;
        //
        // let txInfo = await axios({method:'GET',url})
        // return txInfo.data
    }
    catch (e) {
        console.error(tag, 'Error: ', e);
        throw e;
    }
};
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
let get_txs_by_addresses = async function (coin, addresses) {
    let tag = ' | get_txs_by_address | ';
    try {
        log.debug(tag, "checkpoint: ", addresses);
        let output = [];
        //tier 0
        //tier 1
        // let url = "https://blockchain.info/" +"multiaddr?active="+address
        // //
        // let txInfo = await axios({method:'GET',url})
        //
        //
        // return txInfo.data
    }
    catch (e) {
        console.error(tag, 'Error: ', e);
        throw e;
    }
};
let get_txs_by_xpubs = async function (coin, xpub) {
    let tag = ' | get_txs_by_xpubs | ';
    try {
        log.debug(tag, "checkpoint: ", xpub);
        let output = [];
        //tier 0
        let txInfo;
        if (coin !== "BTC") {
            //tier 1
            let url = "https://blockchain.info/" + "multiaddr?active=" + xpub;
            //
            // txInfo = await axios({method:'GET',url})
        }
        else {
            //TODO
            throw Error("not supported! '");
        }
        // return txInfo.data
    }
    catch (e) {
        console.error(tag, 'Error: ', e);
        throw e;
    }
};
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
let get_block = async function (coin, height) {
    let tag = TAG + " | get_node_info | ";
    try {
        let blockHash = await nodeMap[coin].getBlockHash(height);
        log.debug(tag, "blockHash: ", blockHash);
        log.debug(tag, 'blockHash: ', blockHash);
        let blockInfo = await nodeMap[coin].getBlock(blockHash, 2);
        log.debug(tag, "blockInfo: ", blockInfo);
        return blockInfo;
    }
    catch (e) {
        console.error(tag, e);
    }
};
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
let get_node_info = async function (coin) {
    let tag = TAG + " | get_node_info | ";
    try {
        log.debug(nodeMap);
        //
        //let results = await nodeMap[coin].getBlockchainInfo()
        // let results = await nodeMap[coin].getBlockchainInfo()
        let results = await nodeMap[coin].getBlockchainInfo();
        results.coin = coin;
        return results;
    }
    catch (e) {
        console.error(tag, e);
    }
};
