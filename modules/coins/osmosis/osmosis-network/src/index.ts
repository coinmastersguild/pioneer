/*
     OSMO Network

     https://api-osmosis.imperator.co/swagger/#/

    OSMO version of cosmoSDK
    https://v1.cosmos.network/rpc/v0.41.4


https://github.com/osmosis-labs/osmosis-frontend/tree/master/src/stores/osmosis/query

    endpoints
    '/osmosis/gamm/v1beta1/num_pools'
    `/osmosis/pool-incentives/v1beta1/distr_info`
    `/osmosis/mint/v1beta1/epoch_provisions`
    '/osmosis/pool-incentives/v1beta1/lockable_durations'
    `/cosmos/params/v1beta1/params?subspace=gamm&key=PoolCreationFee`
    `/osmosis/mint/v1beta1/params`
    `/osmosis/claim/v1beta1/params`
    `/osmosis/gamm/v1beta1/pools/${poolId}`
    `/osmosis/claim/v1beta1/total_claimable/${bech32Address}`
    `/osmosis/lockup/v1beta1/account_unlockable_coins/${bech32Address}`
    `/osmosis/lockup/v1beta1/account_locked_coins/${bech32Address}`
    `/osmosis/lockup/v1beta1/account_unlocking_coins/${bech32Address}`
    `/osmosis/claim/v1beta1/claim_record/${bech32Address}`
    `/osmosis/incentives/v1beta1/gauge_by_id/${id}`
    `/osmosis/gamm/v1beta1/pools?pagination.limit=500`
    `/osmosis/lockup/v1beta1/account_locked_longer_duration/${bech32Address}`
    '/osmosis/pool-incentives/v1beta1/incentivized_pools'


    IBC
    `/ibc/core/channel/v1beta1/channels/${params.channelId}/ports/${params.portId}`
    `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/client_state`
    "/cosmos/base/tendermint/v1beta1/node_info"

    voucher denoum trace
    /ibc/applications/transfer/v1beta1/denom_traces


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
import { marshalTx, unmarshalTx } from '@tendermint/amino-js';

const request = require("request-promise")
const log = require('@pioneer-platform/loggerdog')()

let URL_OSMO_RPC = process.env['URL_OSMO_RPC']
if(!URL_OSMO_RPC) throw Error('missing env URL_OSMO_RPC')

let URL_OSMO_LCD = process.env['URL_OSMO_LCD']
if(!URL_OSMO_LCD) throw Error('missing env URL_OSMO_LCD')

let URL_OSMO_POOLS = process.env['URL_OSMO_POOLS'] || `https://api-osmosis.imperator.co`

let BASE_OSMO = 1000000

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
    getDelegations:function (address:string) {
        return get_delegations_by_address(address);
    },
    getRewards:function (address:string) {
        return get_rewards(address);
    },
    getAccount:function (address:string) {
        return get_account_info(address);
    },
    getIbcTrace:function (voucher:string) {
        return get_voucher_info(voucher);
    },
    getPools:function () {
        return get_pools();
    },
    getValidators:function () {
        return get_validators();
    },
    getDelegationsByValidator:function (address:string,validator:string) {
        return get_delegations(address,validator);
    },
    getAccountInfo:function (address:string) {
        return get_account_info(address);
    },
    txs: function (address:string) {
        return get_txs_by_address(address);
    },
    txsAtHeight: function (height:any) {
        return get_txs_at_height(height);
    },
    getBlock: function (block:string) {
        return get_block(block);
    },
    getTransaction: function (txid:string) {
        return get_transaction(txid);
    },
    getStakingTxs: function (address:string) {
        return get_staking_txs(address);
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

let get_voucher_info = async function(voucher:string) {
    let tag = TAG + " | get_voucher_info | "
    try{
        let url = URL_OSMO_LCD+'/ibc/applications/transfer/v1beta1/denom_traces/'+voucher
        log.debug(tag,"url: ",url)
        let txInfo = await axios({method:'GET',url})
        log.debug(tag,"txInfo: ",txInfo.data)

        return txInfo.data
    }catch(e){
        throw e
    }
}


let get_block = async function(height:string){
    let tag = TAG + " | get_block | "
    let output:any = {}
    try{

        //
        log.debug(tag," URL_OSMO_LCD: ",URL_OSMO_LCD)
        let txInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/blocks/'+height})
        // log.debug(tag,"txInfo: ",txInfo.data)

        //for each tx in block decode
        // log.debug(tag,"txInfo: ",txInfo.data.block)
        log.debug(tag,"txInfo: ",txInfo.data.block.data.txs)

        // txInfo.data.block.data.txsDecoded = []
        // for(let i = 0; i < txInfo.data.block.data.txs.length; i++){
        //     let txEncoded = txInfo.data.block.data.txs[i]
        //     let txDecoded = unmarshalTx(txEncoded)
        //     log.debug(tag,"txDecoded: ", txDecoded )
        //     txInfo.data.block.data.txsDecoded(txDecoded)
        // }

        log.debug(tag,"txInfo: ",txInfo.data.block.data.txs)
        return txInfo.data
    }catch(e){
        //TODO dont shh error fix em
        throw e
    }
}


let get_staking_txs = async function(address:string) {
    let tag = TAG + " | get_staking_txs | "
    let output:any = {}
    try{

        let txInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/txs?delegator='+address})
        log.debug(tag,"txInfo: ",txInfo.data)


        return txInfo.data
    }catch(e){
        throw e
    }
}

let get_rewards = async function(address:string){
    let tag = TAG + " | get_rewards | "
    let output:any = {}
    try{

        let resp = await axios({method:'GET',url: URL_OSMO_LCD+'/distribution/delegators/'+address+'/rewards'})
        log.debug(tag,"resp: ",resp.data)

        let output = resp.data

        return output
    }catch(e){
        throw e
    }
}

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

let get_pool = async function(poolId:string){
    let tag = TAG + " | get_pools | "
    let output:any = {}
    try{
        let poolInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/osmosis/gamm/v1beta1/pool/'+poolId})
        log.debug(tag,"poolInfo: ",poolInfo.data)

        return poolInfo.data
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

let get_delegations_by_address = async function(address:string){
    let tag = TAG + " | get_delegations_by_validator | "
    let output:any = {}
    try{

        let resp = await axios({method:'GET',url: URL_OSMO_LCD+'/staking/delegators/'+address+'/delegations'})
        log.debug(tag,"resp: ",resp.data)

        let output = resp.data.result

        return output
    }catch(e){
        throw e
    }
}

let get_delegations = async function(address:string,valAddress:string){
    let tag = TAG + " | get_delegations | "
    let output:any = {}
    try{
        // let txInfo
        log.debug(URL_OSMO_LCD+'/staking/delegators/'+address+'/delegations/'+valAddress)
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
        //if not found
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
            //     log.debug(tag,"logSend: ",logSend)
            // }
            // output.height = result2.height
            // output.gas_wanted = result2.gas_wanted
            // output.gas_used = result2.gas_used
            // output.raw = result2.data

            // console.log("tx: ",tx)
            // let txInfo = await axios({method:'GET',url: URL_OSMO_RPC+'/broadcast_tx_sync?tx='+txBytesBase64})
            // log.debug(tag,"txInfo: ",txInfo.data)

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
            log.debug(tag,'** Broadcast ** REMOTE: result: ', result2.data)
            if(result2.data.txhash) output.txid = result2.data.txhash

            //verify success
            if(result2.data.raw_log){
                let logSend = result2.data.raw_log
                log.debug(tag,"logSend: ",logSend)
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
        log.debug("rawlog: ",rawlog)

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

let get_txs_at_height = async function(height:string){
    let tag = TAG + " | get_txs_by_address | "
    try{
        let output:any = []

        //sends
        // let url = URL_OSMO_LCD+ '/cosmos/tx/v1beta1/txs?transfer.height='+height
        // let url = URL_OSMO_LCD+ '/tx_search?tx.height='+height
        // let url = URL_OSMO_LCD+ '/cosmos/tx/v1beta1/txs?events=tx.height='+height
        // let url = URL_OSMO_LCD+ '/cosmos/tx/v1beta1/txs?events=blockHeight='+height
        //blockHeight=$FOO
        //let url = URL_OSMO_LCD+ '/cosmos/tx/v1beta1/txs?blockHeight='+height
        // let url = URL_OSMO_LCD+ '/cosmos/tx/v1beta1/txs?events=block.height='+height
        // let url = URL_OSMO_LCD+ '/txs?block.height='+height
        let url = URL_OSMO_LCD+ '/txs?tx.height='+height
        //tx.height=
        //?tx.height=1891147&page=1
        log.debug(tag,"url: ",url)
        let resultSends = await axios({
            url: url,
            method: 'GET'
        })
        let sends = resultSends.data
        //log.debug('sends: ', sends)


        return sends
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
        let url = URL_OSMO_LCD+ '/cosmos/tx/v1beta1/txs?events=transfer.sender=%27'+address+'%27'
        //let url = URL_OSMO_LCD+ '/txs?message.sender='+address
        log.debug(tag,"url: ",url)
        let resultSends = await axios({
            url: url,
            method: 'GET'
        })
        let sends = resultSends.data
        //log.debug('sends: ', sends)

        if(sends.txs){
            for(let i = 0; i < sends.txs.length; i++ ){
                let tx = sends.txs[i]
                //tx = normalize_tx(tx,address)
                output.push(tx)
            }
        }

        //receives
        //url = URL_OSMO_LCD+ '/txs?transfer.recipient='+address
        //
        // url = URL_OSMO_LCD+ '/cosmos/tx/v1beta1/txs?events=transfer.recipient=%27'+address+'%27'
        // //console.log("URL_OSMO_LCD: ",url)
        // let resultRecieves = await axios({
        //     url: url,
        //     method: 'GET'
        // })
        // let receives = resultRecieves.data
        // //log.debug('receives: ', JSON.stringify(receives.tx_responses))
        // if(receives.tx_responses){
        //     for(let i = 0; i < receives.txs.length; i++ ){
        //         let tx = receives.txs[i]
        //         //normalize
        //         // tx = normalize_tx(tx,address)
        //         output.push(tx)
        //     }
        // }

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
            let accountInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/bank/balances/'+address})
            log.debug(tag,"accountInfo: ",accountInfo.data)

            //
            if(accountInfo.data?.result){
                for(let i = 0; i < accountInfo.data.result.length; i++){
                    let entry = accountInfo.data.result[i]
                    if(entry.denom === 'uosmo'){
                        let balance = {
                            type:'balance',
                            asset:'OSMO',
                            denom:'uosmo',
                            balance:entry.amount
                        }
                        output.push(balance)
                    }

                    //if ibc channel, lookup
                    if(entry.denom.indexOf('ibc/') >= 0){
                        //lookup on each
                        let voucher = entry.denom.replace('ibc/','')
                        log.debug(tag,"voucher: ",voucher)
                        let voucherInfo = await get_voucher_info(voucher)
                        log.debug(tag,"voucherInfo: ",voucherInfo)
                        if(voucherInfo.denom_trace.base_denom === 'uatom'){
                            let balance = {
                                type:'ibcChannel',
                                ibc:true,
                                voucherId: entry.denom,
                                asset:'ATOM',
                                denom:voucherInfo.denom_trace.base_denom,
                                channel:voucherInfo.denom_trace.path,
                                balance:entry.amount / 1000000
                            }
                            output.push(balance)
                        } else {
                            //TODO lookup base_denum to asset
                            //handle more assets
                        }
                    }

                    //if LP pool
                    if(entry.denom === 'gamm/pool/1'){
                        //get pool info
                        let poolInfo = await get_pools()
                        poolInfo = poolInfo.pools[0]
                        log.debug(tag,"poolInfo: ",poolInfo)
                        let totalShares = poolInfo.totalShares.amount / 1000000000000000000
                        log.debug(tag,"totalShares: ",totalShares)
                        //total ATOM
                        //total OSMO
                        //percent of your LP to total
                        //your balance is percent / total

                        let poolAssets = poolInfo.poolAssets
                        log.debug(tag,"poolAssets: ",poolAssets)

                        let assetAtom = poolAssets[0]
                        log.debug(tag,"assetAtom: ",assetAtom)

                        let assetOsmo = poolAssets[1]
                        log.debug(tag,"assetOsmo: ",assetOsmo)

                        //total ATOM in pool
                        let totalAtom = assetAtom.token.amount / 10000000
                        log.debug(tag,"totalAtom: ",totalAtom)

                        //total OSMO in pool
                        let totalOsmo = assetOsmo.token.amount / 1000000
                        log.debug(tag,"totalOsmo: ",totalOsmo)

                        //percent of your LP to total
                        let yourLpTokens = entry.amount / 1000000000000000000
                        log.debug(tag,"yourLpTokens: ",yourLpTokens)

                        let yourLpPercent = yourLpTokens / totalShares
                        log.debug(tag,"yourLpPercent: ",yourLpPercent)

                        //your balance is percent / total
                        let yourAtomInPool = totalAtom * yourLpPercent
                        log.debug(tag,"yourAtomInPool: ",yourAtomInPool)

                        let yourOsmoInPool = totalOsmo * yourLpPercent
                        log.debug(tag,"yourOsmoInPool: ",yourOsmoInPool)


                        //share out amount = (token in amount * total share) / pool asset
                        // let atomAmount = (assetAtom.token.denom * totalShares ) /

                        let balance = {
                            type:'lptoken',
                            lp:true,
                            amountATOM:yourAtomInPool,
                            amountOSMO:yourOsmoInPool,
                            poolPercent:yourLpPercent,
                            poolPair: "ATOM_OSMO",
                            asset:'gamm/pool/1',
                            balance:yourLpTokens
                        }
                        output.push(balance)
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

let get_balance = async function(address:string){
    let tag = TAG + " | get_balance | "
    try{
        let output = 0

        try{
            console.log("URL: ",URL_OSMO_LCD+'/bank/balances/'+address)
            let accountInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/bank/balances/'+address})
            log.debug(tag,"accountInfo: ",accountInfo.data)

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
        log.debug(tag,"syncInfo: ",syncInfo.data)

        output.isSyncing = syncInfo.data

        //gaiad abci_info
        let nodeInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/node_info'})
        log.debug(tag,"nodeInfo: ",nodeInfo.data)
        output = nodeInfo.data


        // let lastBlock = await axios({method:'GET',url: URL_OSMO_LCD+'/blocks/latest'})
        // log.debug(tag,"lastBlock: ",lastBlock.data)

        //let height

        //output.height = lastBlock.data.block.header.height


        return output
    }catch(e){
        log.error(tag,"e: ",e)
        throw e
    }
}

