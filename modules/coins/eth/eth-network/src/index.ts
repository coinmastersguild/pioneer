/*
   ETH Network tools


       Goals:

        *


 */


const TAG = " | eth-network | "
let Web3 = require('web3');
//
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
});

//
const tokenData = require("@pioneer-platform/pioneer-eth-token-data")
const log = require('@pioneer-platform/loggerdog')()
let ETHPLORER_API_KEY = process.env['ETHPLORER_API_KEY'] || 'freekey'

//
let web3:any

//TODO precision module
let BASE = 1000000000000000000;

module.exports = {
	init:function (settings:any) {
		if(!settings){
			//use default
			web3 = new Web3(process.env['PARITY_ARCHIVE_NODE']);
		} else if(settings.testnet){
			//TODO if testnet
			web3 = new Web3(process.env['INFURA_TESTNET_ROPSTEN']);
		}else {
			//TODO if custom
			web3 = new Web3(process.env['PARITY_ARCHIVE_NODE']);
		}
	},
	getInfo:function () {
		return check_online_status();
	},
	getNonce: function (address:string) {
		return web3.eth.getTransactionCount(address,'pending')
	},
	getGasPrice: function () {
		return web3.eth.getGasPrice()
	},
	getTransaction: function (txid:string) {
		return get_transaction(txid)
	},
	getBalance: function (address:string) {
		return get_balance(address)
	},
	getBalanceAddress: function (address:string) {
		return get_balance(address)
	},
	getBalanceToken: function (address:string,token:string) {
		return get_balance_token(address,token)
	},
	getBalanceTokens: function (address:string) {
		return get_balance_tokens(address)
	},
	broadcast:function (tx:any) {
		return broadcast_transaction(tx);
	}
}

let broadcast_transaction = async function(tx:any){
	let tag = TAG + " | broadcast_transaction | "
	try{
		if(!tx) throw Error("101: missing tx!")
		let result = await web3.eth.sendSignedTransaction(tx)

		let output = {
			success:true,
			blockIncluded:result.result,
			block:result.blockNumber,
			txid:result.transactionHash,
			gas:result.cumulativeGasUsed
		}

		return output
	}catch(e){
		log.error(tag,e)
		throw e
	}
}

const get_balance_tokens = async function(address:string){
	let tag = TAG + " | get_balance | "
	try{
		let balances:any = {}
		let valueUsds:any = {}
		let coinInfo:any = {}

		//TODO other? backup?
		//ethpolorer.io
		let resp = await axios({
			method:'GET',
			url: 'http://api.ethplorer.io/getAddressInfo/'+address+'?apiKey='+ETHPLORER_API_KEY
		})

		log.debug(tag,"resp: ",resp.data)

		balances['ETH'] = resp.data.ETH.balance
		valueUsds['ETH'] = parseFloat(resp.data.ETH.balance) * parseFloat(resp.data.ETH.price.rate)

		//infura
		let tokenInfo = resp.data.tokens
		log.debug(tag,"tokenInfo: ",tokenInfo)

		//
		if(tokenInfo && Object.keys(tokenInfo).length > 0){
			for(let i = 0; i < tokenInfo.length; i++){
				let info = tokenInfo[i]
				if(info){
					log.debug(tag,"info: ",info)

					//let symbol
					let symbol  = info.tokenInfo.symbol
					log.debug(tag,"symbol: ",symbol)


					//rate
					let rate = 0
					if(info.tokenInfo.price && info.tokenInfo.price.rate){
						log.debug(tag,"rate: ",info.tokenInfo.price.rate)
						rate = info.tokenInfo.price.rate
					}

					// @ts-ignore
					let balance = info.balance / parseInt(Math.pow(10,info.tokenInfo.decimals))
					log.debug({rate,symbol,balance})

					balances[symbol] = balance
					valueUsds[symbol] = balance * rate
					coinInfo[symbol] = info.tokenInfo
				}
			}
		}

		return {balances,valueUsds,coinInfo}
	}catch(e){
		console.error(tag,e)
	}
}



const get_balance_token = async function(address:string,token:string){
	let tag = TAG + " | get_balance | "
	try{
		//
		let abiInfo = tokenData.ABI[token]
		if(!abiInfo) return 0
		//console.log(tag,"abiInfo: ",abiInfo)

		//
		let ABI = abiInfo.ABI
		let metaData = abiInfo.metaData

		//
		let contract = new web3.eth.Contract(ABI,metaData.contractAddress);
		let balance = await contract.methods.balanceOf(address).call()
		log.info(tag,"balance: ",balance)

		return balance/metaData.BASE
	}catch(e){
		console.error(tag,e)
	}
}

const get_balance = async function(address:string){
	let tag = TAG + " | get_balance | "
	try{
		let output:any = {}

		//normal tx info
		output = (await web3.eth.getBalance(address))/BASE

		return output
	}catch(e){
		console.error(tag,e)
	}
}

const get_transaction = async function(txid:string){
	let tag = TAG + " | get_transaction | "
	try{
		let output:any = {}

		//normal tx info
		output.txInfo = await web3.eth.getTransaction(txid)

		//if contract
		output.receipt = await web3.eth.getTransactionReceipt(txid)

		return output
	}catch(e){
		console.error(tag,e)
	}
}

let check_online_status = async function(){
	let tag = TAG + " | check_online_status | "
	try{
		let output:any = {}
		//isTestnet
		output.version = await web3.eth.getNodeInfo()

		output.chainId = await web3.eth.getChainId()

		let networkName
		switch (output.chainId.toString()) {
			case "1":
				networkName = "Main";
				break;
			case "2":
				networkName = "Morden";
				break;
			case "3":
				networkName = "Ropsten";
				break;
			case "4":
				networkName = "Rinkeby";
				break;
			case "42":
				networkName = "Kovan";
				break;
			default:
				networkName = "Unknown";
		}
		output.networkName = networkName

		//
		output.gasPrice = await web3.eth.getGasPrice()

		//
		output.syncing = await web3.eth.isSyncing()

		return output
	}catch(e){
		console.error(tag,e)
	}
}
