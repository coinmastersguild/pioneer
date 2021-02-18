/*
   Cosmos Network tools

                             .-.
                            ( (
                             `-'



                        .   ,- To the Cosmos!
                       .'.
                       |o|
                      .'o'.
                      |.-.|
                      '   '
                       ( )
                        )
                       ( )

                   ____
              .-'""p 8o""`-.
           .-'8888P'Y.`Y[ ' `-.
         ,']88888b.J8oo_      '`.
       ,' ,88888888888["        Y`.
      /   8888888888P            Y8\
     /    Y8888888P'             ]88\
    :     `Y88'   P              `888:
    :       Y8.oP '- >            Y88:
    |          `Yb  __             `'|
    :            `'d8888bo.          :
    :             d88888888ooo.      ;
     \            Y88888888888P     /
      \            `Y88888888P     /
       `.            d88888P'    ,'
         `.          888PP'    ,'
           `-.      d8P'    ,-'   -CJ-
              `-.,,_'__,,.-'


       Goals:

        *


 */

/*
    Tendermint API


    https://rpc.cosmos.network/txs?recipient=cosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3


    //API

    https://cosmos.network/rpc/

 */


const TAG = " | cosmos-api | "
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
});
const log = require('@pioneer-platform/loggerdog')()
let wait = require('wait-promise');
let sleep = wait.sleep;


const ASSET = "ATOM"
let ATOM_BASE = process.env["ATOM_BASE"] || '1000000'
let URL_GAIAD = process.env['URL_GAIAD'] || 'https://lcd.nylira.net'
let URL_GAIACLI= process.env['URL_GAIACLI'] || 'https://lcd.nylira.net'
let URL_PIONEER = process.env['URL_PIONEER'] || 'https://lcd.nylira.net'
let URL_REMOTE = process.env['URL_REMOTE'] || 'https://lcd.nylira.net'
let RUNTIME

module.exports = {
	init:function (mode,gaiad,gaiacli,pioneer) {
		if(mode){
			RUNTIME = mode
			// if(gaiad) URL_GAIAD = gaiad
			// if(gaiacli) URL_GAIACLI = gaiacli
			// if(pioneer) URL_PIONEER = pioneer
		} else {
			RUNTIME = 'pioneer'
		}

		if(RUNTIME === 'pioneer'){
			if(!URL_PIONEER) throw Error("102: missing URL_PIONEER")
		} else {
			if(!URL_GAIAD) throw Error("102: missing URL_GAIAD")
			if(!URL_GAIACLI) throw Error("103: missing URL_GAIACLI")
		}
	},
	isOnline:function () {
		return check_online_status();
	},
	nodeInfo:function () {
		return get_node_info_verbose();
	},
	nodeInfoSyncing:function () {
		return get_node_syncing();
	},
	nodeInfoVersion:function () {
		return get_node_version();
	},
	txs: function (address) {
		return get_txs_by_address(address);
	},
	txsByHeight: function (height) {
		return get_txs_by_height(height);
	},
	getTransaction:function (txid) {
		return getTransaction(txid);
	},
	getTransactionRemote:function (txid) {
		return getTransactionRemote(txid);
	},
    getMempool:function () {
        return get_mempool();
    },
	getDelegationsByValidator:function (address,validator) {
		return get_delegations_by_validator(address,validator);
	},
	getDelegations:function (address) {
		return get_delegations_by_address(address);
	},
	getDelegationTxs:function (address) {
		return get_delegations_txs_address(address);
	},
	getBalance:function (address) {
		return get_balance(address);
	},
    getBalances:function (address) {
        return get_balances(address);
    },
	getBlock:function (height) {
		return get_block(height);
	},
	getRewards:function (address) {
		return get_rewards(address);
	},
	getBlockHeight:function () {
		return get_block_height();
	},
	getBlockHeightRemote:function () {
		return get_block_height_remote();
	},
	broadcast:function (tx) {
		return broadcast_transaction(tx);
	},
	getAccount:function (address) {
		return get_account(address);
	},
	getAccountRemote:function (address) {
		return get_account_remote(address);
	},
	getLastCommit:function () {
		return get_last_commit();
	},
	getValidators:function () {
		return get_validators();
	},
	getCurrentValidators:function () {
		return get_current_validators();
	},
	getValidatorsByHeight:function (height) {
		return get_validators_at_height(height);
	},
	// txs: function(addr) {
	//   return Promise.all([
	//     req(`GET`, `/txs?sender=${addr}`)(),
	//     req(`GET`, `/txs?recipient=${addr}`)()
	//   ]).then(([senderTxs, recipientTxs]) => [].concat(senderTxs, recipientTxs))
	// },
}


let get_mempool = async function(){
    let tag = TAG + " | check_online_status | "
	let output = {}
	try{
        let resp = await axios({method:'GET',url: URL_GAIAD+'/unconfirmed_txs'})
        log.debug(tag,"resp: ",resp.data)

        let output = resp.data
        return output
    }catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
    }
}


let check_online_status = async function(){
	let tag = TAG + " | check_online_status | "
	let output = {}
	try{
		let output = {}



		if(RUNTIME === 'pioneer'){
			output.pioneer = false

			try{
				let isOnlinePioneer = await get_pioneer_status()
				log.debug(tag,"isOnlinePioneer: ",isOnlinePioneer)
				if(isOnlinePioneer) output.pioneer = true
			}catch(e){
				log.error(tag,e)
			}
		}else{
			output.gaiad = false
			output.gaiaCli = false

			try{
				let isOnlineGaiad = await get_last_commit()
				log.debug(tag,"isOnlineGaiad: ",isOnlineGaiad)
				if(isOnlineGaiad) output.gaiad = true
			}catch(e){
				log.error(tag,e)
			}

			try{
				let isOnlineGaiacli = await get_node_info()
				log.debug(tag,"isOnlineGaiacli: ",isOnlineGaiacli)
				if(isOnlineGaiacli) output.gaiaCli = true
			}catch(e){
				log.error(tag,e)
			}

		}

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_balance = async function(address){
	let tag = TAG + " | get_pioneer_status | "
	let output = {}
	try{

		let accountInfo = await get_account(address)
		log.info(tag,"accountInfo: ",accountInfo)
		log.info(tag,"accountInfo.result.value: ",accountInfo.result.value.coins[0].amount)
		if(accountInfo && accountInfo.result && accountInfo.result.value.coins[0]){
			log.debug(tag,"accountInfo: ", accountInfo.result.value.coins[0].amount )
			output.available = accountInfo.result.value.coins[0].amount / ATOM_BASE
		} else {
			output.available = 0
		}

		return output.available
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}


let get_balances = async function(address){
	let tag = TAG + " | get_pioneer_status | "
	let output = {}
	try{

		let accountInfo = await get_account(address)
		log.info(tag,"accountInfo: ",accountInfo)
		log.info(tag,"accountInfo.result.value: ",accountInfo.result.value.coins[0].amount)
		if(accountInfo && accountInfo.result && accountInfo.result.value.coins[0]){
			log.debug(tag,"accountInfo: ", accountInfo.result.value.coins[0].amount )
			output.available = accountInfo.result.value.coins[0].amount / ATOM_BASE
		} else {
			output.available = 0
		}


		let rewards = await get_rewards(address)
		log.debug(tag,"rewards: ",rewards)

		if(rewards && rewards.result && rewards.result.total[0]){
			log.debug(tag,"rewards: ",rewards.result.total[0].amount)
			output.rewards = rewards.result.total[0].amount / ATOM_BASE
		} else {
			output.rewards = 0
		}

		//get current blockheight
		//let lastBlock = await get_block_height()

		let delegations = await get_delegations_by_address(address)
		log.debug(tag,"delegations: ",delegations)
		let totalDelegated = 0
		for(let i = 0; i < delegations.length; i++){
			let delegation = delegations[i]
			log.debug(tag,"delegation: ",delegation)
			totalDelegated = totalDelegated + parseFloat(delegation.balance)
		}
		totalDelegated = totalDelegated / ATOM_BASE
		log.debug(tag,"totalDelegated: ",totalDelegated)
		output.delegated = totalDelegated

		//TODO totalRewardsPerBlock
		// let totalRewardsPerBlock = 0
		// for(let i = 0; i < rewards.result.rewards.length; i++){
		// 	let reward = rewards.result.rewards[i]
		// 	log.debug(tag,"reward: ",reward)
		// 	//get rewards per block
		//
		// }
		output.totalRewardsPerBlock = 0
		//output.rewardsPerBlock = rewardsPerBlock
		//TODO unbonding
		output.unbonding = 0

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_pioneer_status = async function(){
	let tag = TAG + " | get_pioneer_status | "
	let output = {}
	try{

		let resp = await axios({method:'GET',url: URL_PIONEER+'/api/v1/health'})
		log.debug(tag,"resp: ",resp.data)

		let output = resp.data

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}


let get_delegations_txs_address = async function(address){
	let tag = TAG + " | get_delegations_txs_address | "
	let output = {}
	try{

		let resp = await axios({method:'GET',url: URL_GAIACLI+'/staking/delegators/'+address+'/txs'})
		log.debug(tag,"resp: ",resp.data)

		let output = resp.data

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_rewards = async function(address){
	let tag = TAG + " | get_rewards | "
	let output = {}
	try{

		let resp = await axios({method:'GET',url: URL_GAIACLI+'/distribution/delegators/'+address+'/rewards'})
		log.debug(tag,"resp: ",resp.data)

		let output = resp.data

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}


let get_delegations_by_address = async function(address){
	let tag = TAG + " | get_delegations_by_validator | "
	let output = {}
	try{

		let resp = await axios({method:'GET',url: URL_GAIACLI+'/staking/delegators/'+address+'/delegations'})
		log.debug(tag,"resp: ",resp.data)

		let output = resp.data.result

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_delegations_by_validator = async function(address,validator){
	let tag = TAG + " | get_delegations_by_validator | "
	let output = {}
	try{

		let resp = await axios({method:'GET',url:  URL_GAIACLI+'/staking/delegators/'+address+'/delegations/'+validator})
		log.debug(tag,"resp: ",resp.data)

		let output = resp.data.result

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_current_validators = async function(){
	let tag = TAG + " | get_current_validators | "
	let output = {}
	try{

		let resp = await axios({method:'GET',url: URL_GAIAD+'/validators'})
		log.debug(tag,"resp: ",resp.data)

		let output = resp.data.result

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_last_commit = async function(){
	let tag = TAG + " | get_last_commit | "
	let output = {}
	try{

		let resp = await axios({method:'GET',url:URL_GAIAD+'/commit'})
		log.debug(tag,"resp: ",resp.data)

		let output = resp.data

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_block_height = async function(){
	let tag = TAG + " | get_block_height | "
	let output = {}
	try{

		let resp = await axios({method:'GET',url: URL_GAIACLI+'/blocks/latest'})
		log.debug(tag,"resp: ",resp.data)

		let height = resp.data.block.header.height

		return parseInt(height)
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_block_height_remote = async function(){
	let tag = TAG + " | get_block_height_remote | "
	let output = {}
	try{

		//TODO pioneer api call
		let lastBlockRemote = await axios({method:'GET',url: URL_REMOTE+'/blocks/latest'})
		log.debug(tag,"lastBlockRemote: ",lastBlockRemote.data.block.header.height)
		return lastBlockRemote.data
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_validators_at_height = async function(height){
	let tag = TAG + " | get_validators | "
	let output = {}
	try{
		let txInfo

			//
			txInfo = await axios({method:'GET',url: URL_GAIACLI+'/validatorsets/'+height})
			log.debug(tag,"txInfo: ",txInfo.data)

		return txInfo.data
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}


let get_validators = async function(){
	let tag = TAG + " | get_validators | "
	let output = {}
	try{
		let txInfo
		if(RUNTIME === 'pioneer'){
			//
			txInfo = await axios({method:'GET',url: URL_PIONEER+'/api/v1/getValidators'})
			log.debug(tag,"txInfo: ",txInfo.data)

		}else{
			//
			txInfo = await axios({method:'GET',url: URL_GAIACLI+'/staking/validators'})
			log.debug(tag,"txInfo: ",txInfo.data)
		}

		return txInfo.data
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}


let get_txs_by_height = async function(height){
	let tag = TAG + " | get_txs_by_height | "
	let output = {}
	try{

		//get height
		let nodeHeight = await get_block_height()

		//if > request error
		if(nodeHeight < height) throw Error("102: unable to get block! ")

		let txInfo = await axios({method:'GET',url: URL_GAIACLI+'/txs?tx.height='+height})
		log.debug(tag,"txInfo: ",txInfo.data)

		return txInfo.data.txs
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_block = async function(height){
	let tag = TAG + " | get_block | "
	let output = {}
	try{

		//
		log.debug(tag," URL_GAIACLI: ",URL_GAIACLI)
		let txInfo = await axios({method:'GET',url: URL_GAIACLI+'/blocks/'+height})
		log.debug(tag,"txInfo: ",txInfo.data)


		return txInfo.data
	}catch(e){
		//TODO dont shh error fix em
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

/*
	Method: getAccount

	Output:

		{
		   type:'auth/Account',
		   value:{
			  address:'cosmos1a7xqkxa4wyjfllme9u3yztgsz363dalzey4myg',
			  coins:[
				 [
					Object
				 ]
			  ],
			  public_key:{
				 type:'tendermint/PubKeySecp256k1',
				 value:'A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B'
			  },
			  account_number:'19785',
			  sequence:'31'
		   }
		}

 */

let get_account = async function(address){
	let tag = TAG + " | get_account | "
	let output = {}
	try{
		let txInfo

		if(RUNTIME === 'pioneer'){
			//
			txInfo = await axios({method:'GET',url: URL_PIONEER+'/api/v1/getAccount/'+address})
			log.debug(tag,"txInfo: ",txInfo.data)

		}else{
			//
			txInfo = await axios({method:'GET',url: URL_GAIACLI+'/auth/accounts/'+address})
			log.debug(tag,"txInfo: ",txInfo.data)
		}


		return txInfo.data
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_account_remote = async function(address){
	let tag = TAG + " | get_account | "
	let output = {}
	try{
		let txInfo

		if(RUNTIME === 'pioneer'){
			//
			txInfo = await axios({method:'GET',url: URL_PIONEER+'/api/v1/getAccount/'+address})
			log.debug(tag,"txInfo: ",txInfo.data)

		}else{
			//
			txInfo = await axios({method:'GET',url: URL_REMOTE+'/auth/accounts/'+address})
			log.debug(tag,"txInfo: ",txInfo.data)
		}


		return txInfo.data
	}catch(e){
		log.error(tag,"e: ",e)
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


let broadcast_transaction = async function(tx){
	let tag = TAG + " | broadcast_transaction | "
	let output = {}
	try{
		log.debug(tag,"CHECKPOINT 1")

		output.success = false


		try{
			//push to seed
			let urlRemote = URL_REMOTE+ '/txs'
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
				let logSend = JSON.parse(result2.data.raw_log)
				log.debug(tag,"logSend: ",logSend)
			}
			output.height = result2.height
			output.gas_wanted = result2.gas_wanted
			output.gas_used = result2.gas_used
			output.raw = result2.data
		}catch(e){
			//log.error(tag,"failed second broadcast e: ",e.response)
			//log.error(tag,e)
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


let get_node_info = async function(){
	let tag = TAG + " | get_node_info | "
	let output = {}
	try{
		let output = {}

		//gaiad abci_info
		let nodeInfo = await axios({method:'GET',url: URL_GAIACLI+'/node_info'})
		log.debug(tag,"nodeInfo: ",nodeInfo.data)

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_node_info_verbose = async function(){
	let tag = TAG + " | get_node_info | "
	let output = {}
	try{
		let output = {}

		//get syncing status
		let syncInfo = await axios({method:'GET',url: URL_GAIACLI+'/syncing'})
		log.debug(tag,"syncInfo: ",syncInfo.data)

		output.isSyncing = syncInfo.data

		//gaiad abci_info
		let nodeInfo = await axios({method:'GET',url: URL_GAIACLI+'/node_info'})
		log.debug(tag,"nodeInfo: ",nodeInfo.data)


		output = nodeInfo.data

		let lastBlockRemote = await axios({method:'GET',url: URL_REMOTE+'/blocks/latest'})
		log.debug(tag,"lastBlockRemote: ",lastBlockRemote.data)

		//let hheight
		output.remoteHeight = lastBlockRemote.data.block_meta.header.height

		let lastBlock = await axios({method:'GET',url: URL_GAIACLI+'/blocks/latest'})
		log.debug(tag,"lastBlock: ",lastBlock.data)

		//let height

		output.height = lastBlock.data.block_meta.header.height

		//estimate time till synced
		//get block height
		// await sleep(1000)
		// //wait 1 seconds
		// let lastBlock2 = await axios({method:'GET',url: URL_GAIACLI+'/blocks/latest'})
		// log.debug(tag,"lastBlock2: ",lastBlock2.data)
		//
		// let difference = output.height - lastBlock2.data.block_meta.header.height
		// log.debug(tag,"difference: ",difference)
		//
		// output.blocksPerSecond = Math.abs(difference)
		//
		// let remaining = parseInt(output.height) - parseInt(2036386)
		// log.debug(tag,"remaining: ",remaining)
		//
		// let timeRemaining =  parseInt(output.blocksPerSecond) * Math.abs(parseInt(remaining))
		// output.timeRemaining = timeRemaining / 60

		//get block height
		//let lastBlock = await axios({method:'GET',url:URL+'/node_info'})

		return output
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_node_syncing = async function(){
	let tag = TAG + " | get_node_info | "
	let output = {}
	try{
		//
		let txInfo = await axios({method:'GET',url: URL_GAIACLI+'/syncing'})
		log.debug(tag,"txInfo: ",txInfo.data)


		return txInfo.data
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

let get_node_version = async function(){
	let tag = TAG + " | get_node_info | "
	let output = {}
	try{
		//
		let txInfo = await axios({method:'GET',url: URL_GAIACLI+'/node_version'})
		log.debug(tag,"txInfo: ",txInfo.data)


		return txInfo.data
	}catch(e){
		log.error(tag,"e: ",e)
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

let normalize_tx = function(tx,type){
	let output = {}

	//
	output.txid = tx.txhash
	output.height = tx.height
	if(tx.height) output.status = "confirmed"
	output.type = "transfer"

	let event = {}

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


let get_txs_by_address = async function (address) {
	let tag = ' | get_txs_by_address | '
	let output = {}
	try {
		log.debug(tag,"checkpoint: ",address)
		let output = []

		//sends
		let url = URL_GAIACLI+ '/txs?message.sender='+address
		log.debug(tag,"url: ",url)
		let resultSends = await axios({
			url: url,
			method: 'GET'
		})
		let sends = resultSends.data
		log.debug('sends: ', sends)

		// TODO//pagnation
		// let pagesSends = sends.page_number
		// for(let i = 0; i < pagesSends; i++){
		//
		// }
		for(let i = 0; i < sends.txs.length; i++ ){
			let tx = sends.txs[i]
			//normalize
			//tx = normalize_tx(tx,'send')
			output.push(tx)
		}

		//receives
		url = URL_GAIACLI+ '/txs?transfer.recipient='+address
		let resultRecieves = await axios({
			url: url,
			method: 'GET'
		})
		let receives = resultRecieves.data
		log.debug('receives: ', receives)

		for(let i = 0; i < receives.txs.length; i++ ){
			let tx = receives.txs[i]
			//normalize
			//tx = normalize_tx(tx,'receive')
			output.push(tx)
		}

		//staking tx's
		// let resultStaking = await axios({method:'GET',url: URL_GAIACLI+'/txs?delegator='+address})
		// let stakings = resultStaking.data
		// for(let i = 0; i < stakings.length; i++) {
		// 	let stake = stakings[i]
		// 	let stakeTx = {}
		//
		//
		// 	log.debug(tag,"stakeTX: ",stake)
		// 	log.debug(tag,"stake: ",stake.tx.value.msg[0].value.amount.amount)
		//
		// 	let tagInfo = {}
		// 	for(let i = 0; i < stake.tags.length; i++){
		// 		let tag = stake.tags[i]
		// 		log.debug(tag,"tag: ",tag)
		// 		tagInfo[tag.key] = tag.value
		// 	}
		// 	log.debug(tag,"tagInfo: ",tagInfo)
		//
		// 	//if unbonding else
		// 	if(tagInfo.action === "begin_unbonding"){
		// 		stakeTx.amount = parseInt(stake.tx.value.msg[0].value.amount.amount)
		// 		stakeTx.txid = stake.txhash
		// 		stakeTx.status = 'confirmed'
		// 		stakeTx.type = 'unDelegate'
		// 		stakeTx.stake = true
		// 		stakeTx.unBonding = true
		// 		stakeTx.unBondingTime = tagInfo['end-time']
		// 		stakeTx.height = stake.height
		// 		stakeTx.gas_used = stake.gas_used
		// 		stakeTx.gas_wanted = stake.gas_wanted
		//
		// 		stakeTx.validator =  tagInfo['source-validator']
		// 		// stakeTx.validatorLink = deligationTxInfo.tx.value.msg[0].value.Description.website
		// 		// stakeTx.validatorDetails = deligationTxInfo.tx.value.msg[0].value.Description.details
		// 		// stakeTx.validatorAddress = deligationTxInfo.tx.value.msg[0].value.Description.address
		// 		// stakeTx.validatorCommision = deligationTxInfo.tx.value.msg[0].value.Description.commission_rate
		// 		stakeTx.network = 'ATOM'
		// 		stakeTx.symbol = 'ATOM'
		// 		stakeTx.coin = 'ATOM'
		// 		// stakeTx.date = deligationTxInfo.timestamp
		// 	}else{
		// 		stakeTx.amount = parseInt(stake.tx.value.msg[0].value.amount.amount)
		// 		stakeTx.txid = stake.txhash
		// 		stakeTx.status = 'confirmed'
		// 		stakeTx.type = 'delegate'
		// 		stakeTx.stake = true
		// 		stakeTx.height = stake.height
		// 		stakeTx.gas_used = stake.gas_used
		// 		stakeTx.gas_wanted = stake.gas_wanted
		//
		// 		stakeTx.validator = tagInfo['destination-validator']
		// 		// stakeTx.validatorLink = deligationTxInfo.tx.value.msg[0].value.Description.website
		// 		// stakeTx.validatorDetails = deligationTxInfo.tx.value.msg[0].value.Description.details
		// 		// stakeTx.validatorAddress = deligationTxInfo.tx.value.msg[0].value.Description.address
		// 		// stakeTx.validatorCommision = deligationTxInfo.tx.value.msg[0].value.Description.commission_rate
		// 		stakeTx.network = 'ATOM'
		// 		stakeTx.symbol = 'ATOM'
		// 		stakeTx.coin = 'ATOM'
		// 		// stakeTx.date = deligationTxInfo.timestamp
		// 	}
		//
		// 	log.debug(tag,"stakeTx: ",stakeTx)
		// 	output.push(stakeTx)
		// }

		return output
	} catch (e) {
		console.error(tag, 'Error: ', e)
		throw e
	}
}

let getTransactionRemote = async function(txid){
	let tag = TAG + " | getTransaction | "
	let output = {}
	try{
		//
		let txInfo


		txInfo = await axios({method:'GET',url:  URL_REMOTE+'/txs/'+txid})


		log.debug(tag,"txInfo: ",txInfo.data)
		return txInfo.data
	}catch(e){
		output.success = false
		output.error = e.message
		return output
	}
}

let getTransaction = async function(txid){
	let tag = TAG + " | getTransaction | "
	let output = {}
	try{
		//
		let txInfo

		if(RUNTIME === 'pioneer'){
			log.debug("pioneer lookup tx")

			txInfo = await axios({method:'GET',url:  URL_PIONEER+'/api/v1/getTransaction/'+txid})
			//if pioneer
		}else{
			log.debug("gaiacli get tx")

			txInfo = await axios({method:'GET',url:  URL_GAIACLI+'/txs/'+txid})
		}


		log.debug(tag,"txInfo: ",txInfo.data)
		return txInfo.data
	}catch(e){
		output.success = false
		output.error = e.message
		return output
	}
}


let getStakingInfo = async function(address, valAddress) {
	let tag = TAG + " | getStakingTxs | "
	let output = {}
	try{
		//
		// let txInfo = await axios({method:'GET',url: URL_GAIACLI+'/staking/delegators/'+address+'/delegations/'+valAddress})
		// log.debug(tag,"txInfo: ",txInfo.data)

		let txInfo = await axios({method:'GET',url: URL_GAIACLI+'/txs?delegator='+address})
		log.debug(tag,"txInfo: ",txInfo.data)


		return txInfo.data
	}catch(e){
		log.error(tag,"e: ",e)
		output.success = false
		output.error = e
		return output
	}
}

