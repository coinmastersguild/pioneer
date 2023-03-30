/*

    Fio Network

 */

const { FIOSDK } = require('@fioprotocol/fiosdk')

const fetchJson = async (uri:string, opts = {}) => {
    return fetch(uri, opts)
}

const TAG = " | fio-network | "
const log = require("log")

const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});


const FIO_BASE=1000000000

const baseUrl = 'https://fioprotocol.io:443/v1'

const testnetUrl = 'http://testnet.fioprotocol.io/v1'

//const fioNode = 'https://testnet.fioprotocol.io:443/v1'
const fioNode = process.env['FIO_NODE'] || 'https://fio.eu.eosamsterdam.net/v1'
//const fioNode = process.env['FIO_NODE'] || 'https://fio.greymass.com/v1'

const historyNode = process.env['FIO_NODE_HISTORY'] || 'https://api.fio.eosdetroit.io/v1'

// let urlSpec = "https://developers.fioprotocol.io/api/api-spec/FIOChainAPI.oas2.json"

const fioTestnetDomain = 'fiotestnet'
const fioTokenCode = 'FIO'
const fioChainCode = 'FIO'
const defaultFee = 800 * FIOSDK.SUFUnit

interface FioTx {
    "signatures": [
        "string"
    ],
    "compression": "string",
    "packed_context_free_data": "string",
    "packed_trx": "string"
}

module.exports = {
    nodeInfo:function () {
        return get_node_info_verbose();
    },
    getAccountsFromPubkey:function (pubkey:string) {
        return get_accounts_from_pubkey(pubkey);
    },
    getBlockHeight:function () {
        return get_latest_block_height();
    },
    getActor:function (pubkey:string) {
        return get_actor(pubkey);
    },
    getPubkeyFromAccount:function (account:string) {
        return get_pubkey_from_account(account);
    },
    getAccount:function (account:string) {
        return get_account_info_from_account(account);
    },
    getAccountInfo:function (account:string) {
        return get_account_info_from_account(account);
    },
    getPendingRequests:function (pubkey:string) {
        return get_pending_requests(pubkey);
    },
    getAccountFromActor:function (pubkey:string) {
        return get_account_from_actor(pubkey);
    },
    getAccounts:function (pubkey:string) {
        return get_accounts_from_pubkey(pubkey);
    },
    getBalance:function (pubkey:string) {
        return get_balance(pubkey);
    },
    getBlock:function (height:string) {
        return get_block(height);
    },
    txs:function (account:string) {
        return get_txs(account);
    },
    getObtData:function (account:string) {
        return get_obt_data(account);
    },
    getAccountAddress:function (username:string,asset:string) {
        return get_account_address(username,asset);
    },
    isAvailable:function (username:string) {
        return is_available(username);
    },
    broadcast:function (tx:any) {
        return broadcast_tx(tx);
    },
    broadcastBundle:function (tx:any) {
        return broadcast_tx_bundle(tx);
    },
    broadcastSubmitPaymentRequest:function (tx:any) {
        return broadcast_payment_request(tx);
    },
    broadcastNewFundsRequestTx:function (tx:any) {
        return broadcast_new_funds_request_tx(tx);
    },
    // broadcastRegisterAddress:function (tx:any) {
    //     return broadcast_register_address(tx);
    // },
    broadcastAddPubAddressTx:function (tx:any) {
        return broadcast_add_pub_address_tx(tx);
    }
}

let get_pending_requests = async function(pubkey:string){
    let tag = TAG + " | get_pending_requests | "
    let output:any = {}
    try{
        let output
        let data = {
            "fio_public_key": pubkey,
        }

        let body = {method:'POST',url: fioNode+'/chain/get_pending_fio_requests',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp)
        return resp.data
    }catch(e){
        return {
            requests: []
        }
    }
}

let get_account_info_from_account = async function(account:string){
    let tag = TAG + " | get_account_info_from_account | "
    let output:any = {}
    try{
        let output:any = {}
        output.account = account

        log.debug(tag,"account: ",account)

        //TODO is valid?
        output.isValid = true

        //is available?
        let isAvailable = await is_available(account)
        log.debug(tag,"isAvailable: ",isAvailable)

        if(isAvailable){
            output.isAvailable = true
        } else {

            const chainCode = "FIO"
            const tokenCode = "FIO"
            let data = {
                "fio_address": account,
                "chain_code": chainCode,
                "token_code": tokenCode
            }

            let body = {method:'POST',url: fioNode+'/chain/get_pub_address',data}
            log.debug(body)
            let resp = await axios(body)
            log.debug(tag,"resp: ",resp.data)

            output.pubkey = resp.data.public_address
            log.debug(tag,"output.pubkey: ",output.pubkey)

            //get balance
            // let balance = await get_balance(output.pubkey)
            // output.balance = balance

            //for each asset get address
            let coins = [
                'EOS',
                'ETH'
            ]
            for(let i = 0; i < coins.length; i++){
                let coin = coins[i]
                log.debug(tag,"coin: ",coin)
                let address = await get_account_address(account,coin)
                log.debug(tag,"address: ",address)
                output[coin] = address.public_address
            }
            // get aliases (other names with same pubkey)


            //all all registered addresses

        }



        return output
    }catch(e){
        log.error(tag,"e: ",e)
        output.success = false
        output.error = e
        return output
    }
}

let get_pubkey_from_account = async function(account:string){
    let tag = TAG + " | get_account_pubkey | "
    let output:any = {}
    try{
        let output
        const chainCode = "FIO"
        const tokenCode = "FIO"
        let data = {
            "fio_address": account,
            "chain_code": chainCode,
            "token_code": tokenCode
        }

        let body = {method:'POST',url: fioNode+'/chain/get_pub_address',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        output = resp.data

        return output.public_address
    }catch(e){
        log.error(tag,"e: ",e)
        output.success = false
        output.error = e
        return output
    }
}

let broadcast_new_funds_request_tx = async function(tx:any){
    let tag = TAG + " | broadcast_new_funds_request_tx | "
    let output:any = {}
    try{
        console.log(tag,"Checkpoint")
        var request = require("request");

        var options = {
            method: 'POST',
            url: fioNode+'/chain/new_funds_request',
            headers: {'content-type': 'application/json'},
            body: tx,
            json: true
        };

        request(options, function (error:any, response:any, body:any) {
            console.log(error,response,body)
            if (error) {
                console.log(JSON.stringify(error))
                throw new Error(error);
            }

            //console.log(JSON.stringify(body));
            return body
        });

    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        // log.error(tag,"e: ",e.response.data.error)
        // log.error(tag,"e: ",e.response.data.error)
        output.success = false
        output.error = e
        return output
    }
}

let broadcast_payment_request = async function(tx:any){
    let tag = TAG + " | broadcast_payment_request | "
    let output:any = {}
    try{
        console.log(tag,"Checkpoint")
        var request = require("request");

        var options = {
            method: 'POST',
            url: fioNode+'/chain/new_funds_request',
            headers: {'content-type': 'application/json'},
            body: tx,
            json: true
        };

        request(options, function (error:any, response:any, body:any) {
            console.log(error,response,body)
            if (error) {
                console.log(JSON.stringify(error))
                throw new Error(error);
            }

            //console.log(JSON.stringify(body));
            return body
        });

        // let body = {method:'POST',url: fioNode+'/chain/push_transaction',body:""}
        // log.debug(body)
        // let resp = await axios(body)
        // log.debug(tag,"resp: ",resp.data)
        //
        // output = resp.data


        // return output
    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        // log.error(tag,"e: ",e.response.data.error)
        // log.error(tag,"e: ",e.response.data.error)
        output.success = false
        output.error = e
        return output
    }
}

let broadcast_register_address = async function(tx:any){
    let tag = TAG + " | broadcast_register_address | "
    let output:any = {}
    try{
        console.log(tag,"Checkpoint")
        var request = require("request");

        var options = {
            method: 'POST',
            url: fioNode+'/chain/new_funds_request',
            headers: {'content-type': 'application/json'},
            body: tx,
            json: true
        };

        request(options, function (error:any, response:any, body:any) {
            console.log(error,response,body)
            if (error) {
                console.log(JSON.stringify(error))
                throw new Error(error);
            }

            //console.log(JSON.stringify(body));
            return body
        });

        // let body = {method:'POST',url: fioNode+'/chain/push_transaction',body:""}
        // log.debug(body)
        // let resp = await axios(body)
        // log.debug(tag,"resp: ",resp.data)
        //
        // output = resp.data


        // return output
    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        // log.error(tag,"e: ",e.response.data.error)
        // log.error(tag,"e: ",e.response.data.error)
        output.success = false
        output.error = e
        return output
    }
}

let broadcast_add_pub_address_tx = async function(tx:any){
    let tag = TAG + " | broadcast_add_pub_address_tx | "
    let output:any = {}
    try{
        console.log(tag,"Checkpoint")
        var request = require("request");

        var options = {
            method: 'POST',
            url: fioNode+'/chain/add_pub_address',
            headers: {'content-type': 'application/json'},
            body: tx,
            json: true
        };

        request(options, function (error:any, response:any, body:any) {
            console.log(error,response,body)
            if (error) {
                console.log(JSON.stringify(error))
                throw new Error(error);
            }

            console.log(JSON.stringify(body));
            return body
        });

    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        // log.error(tag,"e: ",e.response.data.error)
        // log.error(tag,"e: ",e.response.data.error)
        output.success = false
        output.error = e
        return output
    }
}


let broadcast_tx_bundle = async function(tx:any){
    let tag = TAG + " | broadcast_tx_bundle | "
    let output:any = {}
    try{
        console.log(tag,"Checkpoint")
        var request = require("request");

        var options = {
            method: 'POST',
            url: fioNode+'/chain/submit_bundle',
            headers: {'content-type': 'application/json'},
            body: tx,
            json: true
        };

        request(options, function (error:any, response:any, body:any) {
            console.log(error,response,body)
            if (error) {
                console.log(JSON.stringify(error))
                throw new Error(error);
            }

            console.log(JSON.stringify(body));
            return body
        });

        // let body = {method:'POST',url: fioNode+'/chain/push_transaction',body:""}
        // log.debug(body)
        // let resp = await axios(body)
        // log.debug(tag,"resp: ",resp.data)
        //
        // output = resp.data


        // return output
    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        // log.error(tag,"e: ",e.response.data.error)
        // log.error(tag,"e: ",e.response.data.error)
        output.success = false
        output.error = e
        return output
    }
}


let broadcast_tx = async function(tx:any){
    let tag = TAG + " | broadcast_tx | "
    let output:any = {}
    try{
        console.log("CHeckpoint")
        var request = require("request");

        var options = {
            method: 'POST',
            url: fioNode+'/chain/push_transaction',
            headers: {'content-type': 'application/json'},
            body: tx,
            json: true
        };

        request(options, function (error:any, response:any, body:any) {
            console.log(error,response,body)
            if (error) {
                console.log(JSON.stringify(error))
                throw new Error(error);
            }

            console.log(JSON.stringify(body));
            return body
        });

        // let body = {method:'POST',url: fioNode+'/chain/push_transaction',body:""}
        // log.debug(body)
        // let resp = await axios(body)
        // log.debug(tag,"resp: ",resp.data)
        //
        // output = resp.data


        // return output
    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        // log.error(tag,"e: ",e.response.data.error)
        // log.error(tag,"e: ",e.response.data.error)
        output.success = false
        output.error = e
        return output
    }
}

let get_block = async function(height:string){
    let tag = TAG + " | get_txs | "
    let output:any = {}
    try{

        let data = {
            "block_num_or_id":height
        }

        let body = {method:'POST',url: fioNode+'/chain/get_block',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        output = resp.data

        output = resp.data
        return output
    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        output.success = false
        output.error = e
        return output
    }
}


let get_latest_block_height = async function(){
    let tag = TAG + " | get_latest_block_height | "
    let output:any = {}
    try{
        let body = {method:'POST',url: fioNode+'/chain/get_info'}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        output = resp.data
        return output
    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        output.success = false
        output.error = e
        return output
    }
}

/*
Get transactions by account
This provides action traces, not just transaction history which has several implications:

Multiple actions can be submitted in a single transaction, so several (different) actions can have the same transaction ID
Not all of the actions may be been performed by the account being queried (triggering internal actions within a contract for example.) It may or may not be beneficial to only show the actions directly performed by the account being queried, for example filtering out internal actions that have a different actor may result in missing some important FIO transactions, such as rewards payouts.
Note: there are some peculiarities in how paging works on this endpoint, this is not a FIO specific issue. We haven’t diverged from how EOS works in this case to avoid unexpected behavior for block explorers etc.

The getactions endpoint does allow a negative position for finding the most recent actions, but if a negative number is specified, the following caveats apply:

it will only start at the most recent transaction, only -1 is valid, cannot specify a lower offset.
it will not allow paging
it will always return 10 records.
Because of this limitation, getting the last 100 transactions for an account (for example) requires a call with the negative offset to find the highest position (using the last action in the returned array,) and then paging through the actions using positive pos and offset values. accountactionseq is the transaction count for the account, and is what should be used for paging.

https://developers.fioprotocol.io/fio-chain/history

 */

let get_txs = async function(account:string){
    let tag = TAG + " | get_txs | "
    let output:any = {}
    try{
        let data = {
            "account_name":account,
            "pos": -1
        }

        let body = {method:'POST',url: historyNode+'/history/get_actions',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        output = resp.data


        return output
    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        output.success = false
        output.error = e
        return output
    }
}

let get_obt_data = async function(fio_public_key:string){
    let tag = TAG + " | get_txs | "
    let output:any = {}
    try{
        let data = {
            "fio_public_key": fio_public_key,
            "limit": 100,
            "offset": 0
        }
        let url = fioNode+'/chain/get_obt_data'
        console.log(url)
        let body = {method:'POST',url: fioNode+'/chain/get_obt_data',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        output = resp.data


        return output
    }catch(e){
        // log.error(tag,"e: ",e.response.data)
        output.success = false
        output.error = e
        return output
    }
}

let get_balance = async function(pubkey:string){
    let tag = TAG + " | get_balance | "
    let output:any = {}
    try{

        let data = {
            "fio_public_key":pubkey
        }

        let body = {method:'POST',url: fioNode+'/chain/get_fio_balance',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        let output = resp.data
        return output.balance / FIO_BASE
    }catch(e){
        log.error(tag,"e: ",e)
        output.success = false
        output.error = e
        return output
    }
}


let is_available = async function(username:string){
    let tag = TAG + " | get_account | "
    let output:any = {}
    try{
        let output = false

        let data = {
            "fio_name":username
        }

        let body = {method:'POST',url: fioNode+'/chain/avail_check',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        if(resp.data.is_registered === 0){
            output = true
        }
        return output
    }catch(e){
        log.error(tag,"e: ",e)
        output.success = false
        output.error = e
        return output
    }
}

let get_actor = async function(pubkey:string){
    let tag = TAG + " | get_account | "
    let output:any
    try{

        let data = {
            "fio_public_key":pubkey
        }

        let body = {method:'POST',url: fioNode+'/chain/get_actor',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)



        return resp.data
    }catch(e){
        log.error(tag,"e: ",e)
        output.success = false
        output.error = e
        return output
    }
}

// let get_accounts = async function(pubkey:string){
//     let tag = TAG + " | get_account | "
//     let output:any
//     try{
//         let output:any = []
//         let data = {
//             "fio_public_key":pubkey
//         }
//
//         let body = {method:'POST',url: fioNode+'/chain/get_fio_names',data}
//         log.debug(body)
//         let resp = await axios(body)
//         log.debug(tag,"resp: ",resp.data)
//
//         //if more then 1
//         for(let i =0; i < resp.data.fio_addresses.length; i++){
//             let fioAccount = resp.data.fio_addresses[i].fio_address
//             output.push(fioAccount)
//         }
//
//         return output
//     }catch(e){
//         log.error(tag,"e: ",e)
//         output.success = false
//         output.error = e
//         return output
//     }
// }

let get_account_from_actor = async function(actor:string){
    let tag = TAG + " | get_account | "
    let output:any
    try{

        let body = {
                method: 'GET',
                url: fioNode+"/chain/get_account?data='{account_name: actor}'",
                headers: {'content-type': 'application/json'},
                // body: {account_name: actor},
                // json: true
                };

        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        //TODO how tf do you do this in axios????
        // let request = require("request");
        //
        // let options = {
        //     method: 'GET',
        //     url: fioNode+'/chain/get_account',
        //     headers: {'content-type': 'application/json'},
        //     body: {account_name: actor},
        //     json: true
        // };
        //
        // request(options, function (error:any, response:any, body:any) {
        //     if (error) throw new Error(error);
        //     console.log("response: ",response)
        //     return response
        // });

    }catch(e){
        log.error(tag,"e: ",e)
        output.success = false
        output.error = e
        return output
    }
}

let get_account_address = async function(username:string,asset:string){
    let tag = TAG + " | get_account_pubkey | "
    let output:any = {}
    try{
        let output = {}
        const chainCode = asset
        const tokenCode = asset
        let data = {
            "fio_address": username,
            "chain_code": chainCode,
            "token_code": tokenCode
        }

        let body = {method:'POST',url: fioNode+'/chain/get_pub_address',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        output = resp.data

        return output
    }catch(e){
        log.error(tag,"e: ",e)
        output.success = false
        output.error = e
        return output
    }
}

let get_accounts_from_pubkey = async function(pubkey:string){
    let tag = TAG + " | get_accounts_from_pubkey | "
    let output:any = {}
    try{

        let data = {
            "fio_public_key": pubkey
        }

        let body = {method:'POST',url: fioNode+'/chain/get_fio_names',data}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        output = resp.data

        return output
    }catch(e){
        //if 404 :rabble"
        //throw e
        // if(e.response.status === 404){
        //     //NOT AN ERROR!!!!
        //     output = []
        //     return output
        // } else {
        //     //REALLY AN ERROR
        //     // log.error(tag,"e: ",JSON.stringify(e))
        //     // log.error(tag,"e: ",e)
        //     throw e
        // }
    }
}

let get_node_info_verbose = async function(){
    let tag = TAG + " | get_node_info | "
    let output:any = {}
    try{
        let output = {}

        let body = {method:'POST',url: fioNode+'/chain/get_info'}
        log.debug(body)
        let resp = await axios(body)
        log.debug(tag,"resp: ",resp.data)

        output = resp.data

        return output
    }catch(e){
        // log.error(tag,"e: ",e)
        output.success = false
        output.error = e
        return output
    }
}
