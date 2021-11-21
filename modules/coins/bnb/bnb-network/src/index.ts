
/*
	BNB network tools

	basic fee
	0.000375 BNB


	BNB explorer
	https://explorer.binance.org/address/bnb1nsxpvdupgn87td6jnekc8fhs0fkyschgk26yng


	//nodes
	https://github.com/binance-chain/node-binary


    //API
	https://docs.binance.org/api-reference/node-rpc.html


    //sdk
	https://github.com/binance-chain/javascript-sdk


	//examples
	https://github.com/binance-chain/javascript-sdk/wiki/API-Examples

 */


const TAG = " | bnb-network | "
const moment = require('moment')
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
const log = require('@pioneer-platform/loggerdog')()

// let URL_BNBchaind = process.env["URL_BNB"] || 'http://127.0.0.1:27147'
// let URL_BNBcli = process.env["URL_BNBCLI"] || 'http://127.0.0.1:8333'

//Debug
let URL_BNBchaind = process.env["URL_BNB"] || 'https://dex.binance.org'
let URL_BNBcli = process.env["URL_BNBCLI"] || 'https://dex.binance.org'

let URL_REMOTE = process.env["URL_BNB_REMOTE"] || 'https://dataseed1.binance.org:443'
let URL_DEX = process.env["BNB_FULL_REMOTE"] || 'https://dex.binance.org'

let URL_DEX_0 = process.env["BNB_FULL_REMOTE_1"] || 'https://dex.binance.org'
let URL_DEX_1 = process.env["BNB_FULL_REMOTE_2"] || 'https://dex-atlantic.binance.org'
let URL_DEX_2 = process.env["BNB_FULL_REMOTE_3"] || 'https://dex-asiapacific.binance.org'
let URL_DEX_3 = process.env["BNB_FULL_REMOTE_4"] || 'https://dex-european.binance.org'

// @ts-ignore
var crypto:any = require('crypto');
//console.log(sdk)

//network.getTransactions()

// let client = sdk.BncClient(URL)
// console.log(client)

const ASSET = "BNB"
let ROUND_ROBIN_STATE:any = []
let REMOTE_OVERRIDE_BNB = process.env['REMOTE_OVERRIDE_BNB']

module.exports = {
    init:function (mode:string,config:any) {
        if(mode){
            //TODO override nodes
        } else {
        }
    },
    nodeInfo:function () {
        return get_node_info();
    },
    nodeInfoSyncing:function () {
        return get_node_syncing();
    },
    nodeInfoVersion:function () {
        return get_node_version();
    },
    txs: function (address:string) {
        return get_txs_by_address(address);
    },
    txsByHeight: function (height: any, address: any) {
        return get_txs_by_height(height,address);
    },
    getBlockHeight:function () {
        return get_block_height();
    },
    getTransaction:function (txid:string) {
        return getTransaction(txid);
    },
    getBalance:function (address:string,token:string) {
        return get_balance(address,token);
    },
    getBlock:function (height:string) {
        return get_block(height);
    },
    getBlockRemote:function (height:string) {
        return get_block_remote(height);
    },
    broadcast:function (tx:string) {
        return broadcast_transaction(tx);
    },
    getAccount:function (address:string) {
        return get_account(address);
    },
    // getSequence:function (address:string) {
    //     return get_account_sequence(address);
    // },
    // getValidators:function () {
    //     return get_validators();
    // }
}

let get_block_height = async function(){
    let tag = TAG + " | get_block_height | "
    let output:any = {}
    try{

        //
        let height
        try{
            let bnbncliRemote = await axios({method:'GET',url:URL_BNBchaind+'/abci_info'})
            log.debug(tag,"bnbncliRemote: ",bnbncliRemote.data)
            height = bnbncliRemote.data.result.response.last_block_height
        }catch(e){
            //our node failed, use remote
            let bnbncliRemote = await axios({method:'GET',url:URL_REMOTE+'/abci_info'})
            log.debug(tag,"bnbncliRemote: ",bnbncliRemote.data)
            height = bnbncliRemote.data.result.response.last_block_height
        }


        return height
    }catch(e){
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}

let get_balance = async function(address:string,token:string){
    let tag = TAG + " | get_account | "
    let output:any = {}
    try{
        if(!token) token = ASSET
        log.debug(tag,"get_account: ",address)
        //

        let url = URL_DEX + '/api/v1/account/'+address

        log.debug(tag,"url: ",url)
        let result = await axios({
            url: url,
            method: 'GET'
        })
        let balanceInfo = result.data
        log.debug('balanceInfo: ', balanceInfo)

        if(!balanceInfo || !balanceInfo.balances || balanceInfo.balances.length === 0){
            output = 0
        }

        for(let i = 0; i < balanceInfo.balances.length; i++){
            let assetInfo = balanceInfo.balances[i]
            log.debug(tag,"assetInfo: ",assetInfo)
            if(assetInfo.symbol === token){
                output = parseFloat(assetInfo.free)
            }
        }

        return output
    }catch(e){
        //node 404's on fresh addresses like an asshole
        return 0
    }
}

/*

	https://docs.binance.org/api-reference/dex-api/paths.html#apiv1transactions

 */

let get_txs_by_address = async function (address:string) {
    let tag = ' | get_txs_by_address | '
    let output:any = {}
    try {
        let output = []

        //3 months back
        let startTime = moment().subtract('months', 6).unix()
        startTime = startTime * 1000

        log.debug("startTime: ",startTime)

        //TODO paginate

        //TODO filter by height

        let url = URL_DEX + '/api/v1/transactions?address='+address+'&startTime='+startTime

        log.debug(tag,"url: ",url)
        let resultSends = await axios({
            url: url,
            method: 'GET'
        })
        let sends = resultSends.data
        log.debug('sends: ', sends)

        return sends.tx
    } catch (e) {
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}

// let get_txs_by_address = async function(address){
// 	let tag = TAG + " | get_txs_by_height | "
// 	try{
//
//
// 		//log.debug(network)
// 		let txs = network.getTransactions(address,0)
//
// 		// let txInfo = await axios({method:'GET',url:URL_BNBcli+'/tx_search?address='+address})
// 		// log.debug(tag,"txInfo: ",txInfo.data)
//
//
// 		return txs
// 	}catch(e){
//         //log.error(tag,"e: ",{e})
//         let output:any = {}
//         output.success = false
//         output.error = e
//         return output
// 	}
// }


let get_txs_by_height = async function(height:string,address:string){
    let tag = TAG + " | get_txs_by_height | "
    let output:any = {}
    try{

        //TODO
        //let txs = await network.getTransactions(address)

        // let txInfo = await axios({method:'GET',url:URL+'/api/v1/transactions?blockHeight='+height})
        // log.debug(tag,"txInfo: ",txInfo.data)


        return "TODO"
    }catch(e){
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}


let get_block = async function(height:string){
    let tag = TAG + " | get_block | "
    let output:any = {}
    try{
        if(typeof(height) === 'string') parseInt(height)
        log.debug("checkpoint! ",height)

        //txs
        output.txs = []

        let txInfo
        //txInfo
        //try our node
        try{
            if(REMOTE_OVERRIDE_BNB) throw Error("102: forced remote override")

            txInfo = await axios({method:'GET',url:URL_BNBcli+'/blocks/'+height})
            log.debug(tag,"txInfo: ",txInfo)

            if(txInfo.data.block.data.txs){
                //convert raw tx's
                for(let i = 0; i < txInfo.data.block.data.txs.length; i++){
                    let rawTx = txInfo.data.block.data.txs[i]
                    log.debug(tag,"rawTx: ",rawTx)

                    let txSummary:any = {}

                    //convert
                    const buffer = Buffer.from(rawTx, 'base64');
                    // @ts-ignore
                    let hash = crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase()
                    log.debug(tag,"hash: ",hash)
                    const rawTxHex = buffer.toString('hex');
                    //let decodedTx = bnbDecoder.decodeTransfer(rawTxHex);
                    //log.debug(tag,"decodedTx: ",JSON.stringify(decodedTx))

                    txSummary.txid = hash
                    txSummary.blockHeight = height
                    //txSummary.tx = decodedTx

                    output.txs.push(txSummary)
                }
            }

        }catch(e){
            //throw e

            txInfo = await get_block_remote(height)
            log.debug(tag,"txInfo: ",txInfo)
            let txs = []
            for(let i = 0; i < txInfo.tx.length; i++){
                //
                let entry = txInfo.tx[i]
                entry.txid = entry.txHash
                txs.push(entry)
            }
            output.txs = txs
        }



        return output
    }catch(e){
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}



let get_block_remote = async function(height:string){
    let tag = TAG + " | get_block | "
    let output:any = {}
    try{
        log.debug("checkpoint! ",height)

        let selected
        //rand 1-4
        if(ROUND_ROBIN_STATE.length == 0){
            //add all 5
            ROUND_ROBIN_STATE.push(URL_DEX_0)
            ROUND_ROBIN_STATE.push(URL_DEX_1)
            ROUND_ROBIN_STATE.push(URL_DEX_2)
            ROUND_ROBIN_STATE.push(URL_DEX_3)
            selected = URL_DEX_0
        } else {
            //pop at random
            selected = ROUND_ROBIN_STATE.pop()
        }
        //
        log.debug(tag,"selected: ",selected)
        let txInfo = await axios({method:'GET',url:selected+'/api/v1/transactions-in-block/'+height})
        log.debug(tag,"txInfo: ",txInfo.data)


        return txInfo.data
    }catch(e){
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}

let get_account = async function(address:string){
    let tag = TAG + " | get_account | "
    let output:any = {}
    try{
        log.debug(tag,"get_account: ",address)
        //

        // let txInfo = await network.getAccount(address)
        // log.debug(tag,"txInfo: ",txInfo)
        //
        // if(!txInfo){
        //     txInfo = {}
        //     txInfo.balance = 0
        // }
        // log.debug(tag,"txInfo: ",txInfo)
        //
        // let pubkeyBuffer = new Buffer(txInfo.result.public_key)
        // let pubkeyHex = pubkeyBuffer.toString('hex')
        // txInfo.result.public_key = pubkeyHex
        return "TODO"
    }catch(e){
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}



/*

The tx must be a signed StdTx. The supported broadcast modes include "block"(return after tx commit), "sync"(return afer CheckTx) and "async"(return right away).



    Input tx example:

    {
      "tx": {
        "msg": [
          "string"
        ],
        "fee": {
          "gas": "string",
          "amount": [
            {
              "denom": "stake",
              "amount": "50"
            }
          ]
        },
        "memo": "string",
        "signature": {
          "signature": "MEUCIQD02fsDPra8MtbRsyB1w7bqTM55Wu138zQbFcWx4+CFyAIge5WNPfKIuvzBZ69MyqHsqD8S1IwiEp+iUb6VSdtlpgY=",
          "pub_key": {
            "type": "tendermint/PubKeySecp256k1",
            "value": "Avz04VhtKJh8ACCVzlI8aTosGy0ikFXKIVHQ3jKMrosH"
          },
          "account_number": "0",
          "sequence": "0"
        }
      },
      "mode": "block"
    }


    responce:

    {
      "check_tx": {
        "code": 0,
        "data": "data",
        "log": "log",
        "gas_used": 5000,
        "gas_wanted": 10000,
        "info": "info",
        "tags": [
          "",
          ""
        ]
      },
      "deliver_tx": {
        "code": 5,
        "data": "data",
        "log": "log",
        "gas_used": 5000,
        "gas_wanted": 10000,
        "info": "info",
        "tags": [
          "",
          ""
        ]
      },
      "hash": "EE5F3404034C524501629B56E0DDC38FAD651F04",
      "height": 0
    }

 */


let broadcast_transaction = async function(rawTx:string){
    let tag = TAG + " | broadcast_transaction | "
    let output:any = {}
    try{
        log.debug(tag,"tx: ",rawTx)
        log.debug(tag,"tx: ",typeof(rawTx))
        //tx = JSON.parse(tx)

        //console.log(sdk)
        //let rawTx = sdk.amino.marshalBinary(tx)
        //rawTx = rawTx.toString("hex")
        //let rawTxHex = Buffer.from(rawTx, "hex")




        // let rawTxBufferCheck = "db01f0625dee0a65ce6dc0430a14b6561dcc104130059a7c08f48c64610c1f6f9064122b423635363144434331303431333030353941374330384634384336343631304331463646393036342d31311a0b4254432d3543345f424e42200228013080c2d72f3880989abc044001126e0a26eb5ae9872103baf53d1424f8ea83d03a82f6d157b5401c4ea57ffb8317872e15a19fc9b7ad7b1240e79a6606d28cf07b9cc6f566b524a5282b13beccc3162376c79f392620c95a447b19f64e761e22a7a3bc311a780e7d9fdd521e2f7edec25308c5bac6aa1c0a311801200a"
        // log.debug("EXPECTED: ",rawTxBufferCheck)
        // log.notice("*****GOT: ",rawTx)

        //
        //ca01f0625dee0a482a2c87fa0a200a1441a3320611caffc31d0148880077f71cfb6509fd12080a03424e4210904e12200a147df3840550a997c5e264402642b761958169470f12080a03424e4210904e12700a26eb5ae987210290916077c387b262a940380d250fd8151c42abf9d8072397797844fab14924c1124041afd12e00d126d51f066a331fbb3b99d9f622392c0f5c9023136c396946d0002b9c9a5fa5f37668bdc5ebe626b758862f0ce6ca61d5d154efd0c933572b3ea918eda11120311a08746573746d656d6f

        //tx: Buffer.from(encoded, "hex")
        ///broadcast_tx_sync?tx=
        // let resultBroadcast = await axios({method:'GET',url:URL_DEX+'/api/v1/broadcast?sync=true'+tx})
        // log.debug("resultBroadcast: ",resultBroadcast)

        const buffer = Buffer.from(rawTx, 'hex');
        // @ts-ignore
        let hash = crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase()
        console.log("hash: ",hash)

        let url = URL_DEX_1 + '/api/v1/broadcast?sync=true'
        let result = await axios({
            headers: {
                'Content-Type': 'text/plain'
            },
            url: url,
            method: 'POST',
            data: rawTx,
        })
        log.debug('result: ', result.data)

        if(result.data[0].hash){
            log.debug("success! ")
        }

        return result.data[0].hash
    }catch(e){
        //log.error(tag,"e: ",{e})
        log.error(tag,e)
        log.error(tag,e.response)
        log.error(tag,e.response.data)
        log.error(tag,e.response.data.error)
        output.success = false
        output.error = e
        return output
    }
}


let get_node_info = async function(){
    let tag = TAG + " | get_node_info | "
    let output:any = {}
    try{

        let chaind = await axios({method:'GET',url:URL_BNBchaind+'/abci_info'})
        log.debug(tag,"chaind: ",chaind.data)
        output.bnbchaind = chaind.data

        let bnbncli = await axios({method:'GET',url:URL_BNBcli+'/version'})
        log.debug(tag,"bnbncli: ",bnbncli.data)
        output.bnbncli = bnbncli.data

        let bnbncliRemote = await axios({method:'GET',url:URL_REMOTE+'/abci_info'})
        log.debug(tag,"bnbncliRemote: ",bnbncliRemote.data.result)
        output.bnbncliRemote = bnbncliRemote.data

        return output
    }catch(e){
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}

let get_node_syncing = async function(){
    let tag = TAG + " | get_node_info | "
    let output:any = {}
    try{
        //
        let txInfo = await axios({method:'GET',url:URL+'/syncing'})
        log.debug(tag,"txInfo: ",txInfo.data)


        return txInfo.data
    }catch(e){
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}

let get_node_version = async function(){
    let tag = TAG + " | get_node_info | "
    let output:any = {}
    try{
        //
        let txInfo = await axios({method:'GET',url:URL_BNBcli+'/version'})
        log.debug(tag,"txInfo: ",txInfo.data)


        return txInfo.data
    }catch(e){
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}

/*


    txid:'66b0b99ee373064cdf8ce24b86b45c087ae50f5eaa32d2ee24dd26e39a5e3455',
    status: 'confirmed',
    type: 'send',
    amount: -78602,
    date: '2019-05-10T21:01:23Z',
    confirmations: 1055,
    network: 'BTC',
    xpub:'xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4'


 */

let normalize_tx = function(tx:any,type:string){
    let output:any = {}

    //
    output.txid = tx.txhash
    output.height = tx.height
    if(tx.height) output.status = "confirmed"
    output.type = "transfer"

    let event:any = {}

    //TODO my god this is ugly? and does it always work?
    if(type === 'send'){
        event.amount = tx.tx.value.msg[0].value.amount[0].amount * -1
    } else {
        event.amount = tx.tx.value.msg[0].value.amount[0].amount
    }

    output.date = tx.timestamp
    output.network = ASSET
    output.symbol = 'ATOM'
    output.coin = 'ATOM'
    output.height = tx.height
    output.gas_used = tx.gas_used
    output.gas_wanted = tx.gas_wanted

    return output
}


let getTransaction = async function(txid:string){
    let tag = TAG + " | getTransaction | "
    let output:any = {}
    try{

        let selected
        //rand 1-4
        if(ROUND_ROBIN_STATE.length == 0){
            //add all 5
            ROUND_ROBIN_STATE.push(URL_DEX_0)
            ROUND_ROBIN_STATE.push(URL_DEX_1)
            ROUND_ROBIN_STATE.push(URL_DEX_2)
            ROUND_ROBIN_STATE.push(URL_DEX_3)
            selected = URL_DEX_0
        } else {
            //pop at random
            selected = ROUND_ROBIN_STATE.pop()
        }


        let txInfo = await axios({method:'GET',url:selected+'/api/v1/tx/'+txid+"?format=json"})
        log.debug(tag,"txInfo: ",txInfo.data)

        //
        // let txInfo = await axios({method:'GET',url:URL_DEX+'/api/v1/tx/'+txid+"?format=json"})
        // log.debug(tag,"txInfo: ",txInfo.data)


        return txInfo.data
    }catch(e){
        //log.error(tag,"e: ",{e})
        output.success = false
        output.error = e
        return output
    }
}

