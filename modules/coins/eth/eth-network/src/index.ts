/*
   ETH Network tools


       Goals:

        *


 */


const TAG = " | eth-network | "
let Web3 = require('web3');
import { ethers, BigNumberish, BigNumber } from 'ethers'
//
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
	httpsAgent: new https.Agent({
		rejectUnauthorized: false
	})
});

import { Provider, TransactionResponse } from '@ethersproject/abstract-provider'
import { EtherscanProvider, getDefaultProvider } from '@ethersproject/providers'

import {
	GasOracleResponse,
	Network as EthNetwork,
	ExplorerUrl,
	TxOverrides,
	GasPrices,
	FeesParams,
	FeesWithGasPricesAndLimits,
	InfuraCreds,
} from './types'

import {
	ETH_DECIMAL,
	ethNetworkToXchains,
	xchainNetworkToEths,
	getTokenAddress,
	validateAddress,
	SIMPLE_GAS_COST,
	BASE_TOKEN_GAS_COST,
	getFee,
	MAX_APPROVAL,
	ETHAddress,
	getDefaultGasPrices,
	erc20ABI
} from './utils'

import {
	Fees,
	FeeOptionKey,
	FeesParams as XFeesParams,
} from '@xchainjs/xchain-client'


import { AssetETH, baseAmount, BaseAmount, assetToString, Asset, delay } from '@xchainjs/xchain-util'
import * as etherscanAPI from './etherscan-api'

//
const tokenData = require("@pioneer-platform/pioneer-eth-token-data")
const log = require('@pioneer-platform/loggerdog')()
let ETHPLORER_API_KEY = process.env['ETHPLORER_API_KEY'] || 'freekey'

import { toUtf8Bytes, parseUnits } from 'ethers/lib/utils'

//
let web3:any
let ETHERSCAN:any
let ETHPLORER:any
let PROVIDER:any

//TODO precision module
let BASE = 1000000000000000000;

module.exports = {
	init:function (settings:any) {
		if(!settings){
			//use default
			web3 = new Web3(process.env['PARITY_ARCHIVE_NODE']);
			ETHERSCAN = new EtherscanProvider('mainnet', process.env['ETHERSCAN_API_KEY'])
			PROVIDER = new ethers.providers.InfuraProvider('mainnet', process.env['INFURA_API_KEY'])

		} else if(settings.testnet){
			if(!process.env['INFURA_TESTNET_ROPSTEN']) throw Error("Missing INFURA_TESTNET_ROPSTEN")
			if(!process.env['ETHERSCAN_API_KEY']) throw Error("Missing ETHERSCAN_API_KEY")

			//if testnet
			web3 = new Web3(process.env['INFURA_TESTNET_ROPSTEN']);
			ETHERSCAN = new EtherscanProvider('ropsten', process.env['ETHERSCAN_API_KEY'])
			PROVIDER = new ethers.providers.InfuraProvider('ropsten', process.env['INFURA_API_KEY'])
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
	getFees: function (params:any): Promise<any> {
		return get_fees(params)
	},
	// getFees: function (params: XFeesParams & FeesParams): Promise<Fees> {
	// 	return get_fees()
	// },
	// estimateGasNormalTx: function (address:string): Promise<BaseAmount> {
	// 	return get_balance_tokens(address)
	// },
	// estimateGasERC20Tx: function (address:string): Promise<BaseAmount> {
	// 	return get_balance_tokens(address)
	// },
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

let get_gas_limit = async function({ asset, recipient, amount, memo }: FeesParams){
	let tag = TAG + " | get_gas_limit | "
	try{
		log.info(tag,"input: ",{ asset, recipient, amount, memo })
		const txAmount = BigNumber.from(amount?.amount().toFixed())

		let assetAddress
		if (asset && assetToString(asset) !== assetToString(AssetETH)) {
			assetAddress = getTokenAddress(asset)
		}

		let estimate

		//NOTE: I changed the from to recipient because this module has no context to address of the sender.
		// I hope I dont skrew the pooch and the differnce +-1 byte between addresses actually matter
		if (assetAddress && assetAddress !== ETHAddress) {
			// ERC20 gas estimate
			const contract = new ethers.Contract(assetAddress, erc20ABI, PROVIDER)

			estimate = await contract.estimateGas.transfer(recipient, txAmount, {
				from: recipient,
			})
		} else {
			// ETH gas estimate
			const transactionRequest = {
				from: recipient,
				to: recipient,
				value: txAmount,
				data: memo ? toUtf8Bytes(memo) : undefined,
			}

			estimate = await PROVIDER.estimateGas(transactionRequest)
		}

		return estimate

	}catch(e){
		log.error(tag,e)
		throw e
	}
}

let get_fees = async function(params: XFeesParams & FeesParams){
	let tag = TAG + " | broadcast_transaction | "
	try{
		const response: any = await etherscanAPI.getGasOracle(ETHERSCAN.baseUrl, ETHERSCAN.apiKey)

		// Convert result of gas prices: `Gwei` -> `Wei`
		const averageWei = parseUnits(response.SafeGasPrice, 'gwei')
		const fastWei = parseUnits(response.ProposeGasPrice, 'gwei')
		const fastestWei = parseUnits(response.FastGasPrice, 'gwei')

		let gasPrices:any =  {
			average: baseAmount(averageWei.toString(), ETH_DECIMAL),
			fast: baseAmount(fastWei.toString(), ETH_DECIMAL),
			fastest: baseAmount(fastestWei.toString(), ETH_DECIMAL),
		}
		const { fast: fastGP, fastest: fastestGP, average: averageGP } = gasPrices

		if(!params.amount || !params?.amount?.amount){
			// @ts-ignore
			params.amount = {
				// @ts-ignore
				amount:function(){ return .98 }
			}
		}

		const gasLimit = await get_gas_limit({
			asset: params.asset,
			amount: params.amount,
			recipient: params.recipient,
			memo: params.memo,
		})

		let output = {
			gasPrices,
			fees: {
				type: 'byte',
				average: getFee({ gasPrice: averageGP, gasLimit }).amount().toString(),
				fast: getFee({ gasPrice: fastGP, gasLimit }).amount().toString(),
				fastest: getFee({ gasPrice: fastestGP, gasLimit }).amount().toString(),
			},
			gasLimit,
		}

		return output
	}catch(e){
		log.error(tag,e)
		throw e
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

		output.height = await web3.eth.getBlockNumber()

		//TODO get peer count
		output.peers = await web3.eth.net.getPeerCount()

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
