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
const request = require("request-promise")
//blockbook
let blockbook = require("@pioneer-platform/blockbook")
const Web3Utils = require('web3-utils');
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
const log = require('@pioneer-platform/loggerdog')()
let ETHPLORER_API_KEY = process.env['ETHPLORER_API_KEY'] || 'freekey'

import { toUtf8Bytes, parseUnits } from 'ethers/lib/utils'

//
let web3:any
let ETHERSCAN:any
let ETHPLORER:any
let PROVIDER:any
let NODE_URL:any
//TODO precision module
let BASE = 1000000000000000000;

import { Interface } from '@ethersproject/abi'

import {
	UNISWAP_V2_WETH_FOX_POOL_ADDRESS,
	UNISWAP_V2_USDC_ETH_POOL_ADDRESS,
	UNISWAP_V2_ROUTER,
	FOX_TOKEN_CONTRACT_ADDRESS,
	WETH_TOKEN_CONTRACT_ADDRESS,
	PROXY_CONTRACT_SABLIER,
	FOX_ETH_TEST_FARMING_ADDRESS,
	FOX_ETH_FARMING_ADDRESS,
	FOX_AIRDROP_ADDRESS,
	PIONEER_CONTRACT_ADDRESS,
	THORCHAIN_ROUTER_TESTNET,
	AIRDROP_CONTRACT,
	CLAIM_URL,
	SABLIER_ABI,
	TCRopstenAbi,
	ERC20ABI,
	AIRDROP_ABI,
	ERC721_ABI,
	METADATA_ABI,
	PIONEER_METADATA_CONTRACT_ADDRESS
} from './constant'; // Replace with your actual module file path


module.exports = {
	init:function (settings:any) {
		//blockbook.init()
		//log.debug("node: ",process.env['PARITY_ARCHIVE_NODE'])
		if(!settings){
			//use default
			web3 = new Web3(process.env['PARITY_ARCHIVE_NODE']);
			ETHERSCAN = new EtherscanProvider('mainnet', process.env['ETHERSCAN_API_KEY'])
			PROVIDER = new ethers.providers.InfuraProvider('mainnet', process.env['INFURA_API_KEY'])
			NODE_URL = process.env['PARITY_ARCHIVE_NODE']
		} else if(settings.testnet){
			if(!process.env['INFURA_TESTNET_ROPSTEN']) throw Error("Missing INFURA_TESTNET_ROPSTEN")
			if(!process.env['ETHERSCAN_API_KEY']) throw Error("Missing ETHERSCAN_API_KEY")

			//if testnet
			web3 = new Web3(process.env['INFURA_TESTNET_ROPSTEN']);
			NODE_URL = process.env['INFURA_TESTNET_ROPSTEN']
			ETHERSCAN = new EtherscanProvider('ropsten', process.env['ETHERSCAN_API_KEY'])
			PROVIDER = new ethers.providers.InfuraProvider('ropsten', process.env['INFURA_API_KEY'])
		} else if(settings.network){
			//force a network setting
			//TODO
		}else{
			//TODO if custom
			web3 = new Web3(process.env['PARITY_ARCHIVE_NODE']);
		}
	},
	decodeTx:function (tx:string) {
		return decode_tx(tx);
	},
	getInfo:function () {
		return check_online_status();
	},
	getAllowance:function (token:string,spender:string,sender:string) {
		return get_allowance(token,spender,sender);
	},
	getNonce: function (address:string) {
		return web3.eth.getTransactionCount(address,'pending')
	},
	getTxCount: function (address:string,options:any) {
		return get_tx_count(address,options)
	},
	getFees: function (params:any): Promise<any> {
		return get_fees(params)
	},
	estimateFee: function (sourceAsset:any,params:any): Promise<any> {
		return estimate_fee(sourceAsset,params)
	},
	getMemoEncoded: function (params:any): Promise<any> {
		return get_memo_data(params)
	},
	getStreamInfo:function (streamId:string) {
		return get_stream(streamId);
	},
	getSymbolFromContract:function (contract:string) {
		return get_symbol_from_contract(contract);
	},
	getPoolPositions:function (address:string) {
		return get_pool_positions(address);
	},
	getAllPioneers:function () {
		return get_all_pioneers();
	},
	getAllTokensEth:function (address:string) {
		return get_all_tokens_blockbook(address);
	},
	getPercentPool:function (amountFox:number,amountEth:string,poolAddress:string) {
		return get_pool_percent(amountFox, amountEth, poolAddress);
	},
	checkAirdropClaim:function (address:string) {
		return check_airdrop_claim(address);
	},
	buildAirdropClaim:function (address:string) {
		return build_airdrop_claim(address);
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
	getTransactions: function (address:string,options:any) {
		return get_transactions(address,options)
	},
	getBalance: function (address:string) {
		return get_balance(address)
	},
	getBalances: function (addresses:string) {
		return get_balances(addresses)
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

const get_all_pioneers = async function() {
	let tag = TAG + " | get_all_pioneers | ";
	try {
		let output:any = {};

		const nftContract = new web3.eth.Contract(ERC721_ABI, PIONEER_CONTRACT_ADDRESS);
		const metadataContract = new web3.eth.Contract(METADATA_ABI, PIONEER_METADATA_CONTRACT_ADDRESS);
		// Fetch the total supply of the NFTs
		const totalSupply = await nftContract.methods.totalSupply().call();

		output['totalSupply'] = totalSupply;
		output['owners'] = []
		output['images'] = [] // add an images array to output
		for (let i = 0; i < totalSupply; i++) {
			const owner = await nftContract.methods.ownerOf(i).call();
			output['owners'].push(owner.toLowerCase())
			//get images
			const imageInfo = await metadataContract.methods.getAttributes(i).call();
			//log.info(tag,"imageInfo: ",imageInfo)

			// Parse the JSON string and get the image name
			const imageName = JSON.parse(imageInfo['0'])["0-backgrounds"];

			// Build the full image URL by replacing the image name in the base URL
			const baseImageUrl = "https://ipfs.io/ipfs/bafybeiezdzjofkcpiwy5hlvxwzkgcztxc6xtodh3q7eddfjmqsguqs47aa/0-backgrounds/";
			const fullImageUrl = baseImageUrl + imageName + ".png";

			// Add this image URL to the images array in output
			output['images'].push({address:owner.toLowerCase(), image:fullImageUrl});
		}
		return output;
	} catch(e) {
		console.error(tag, e);
	}
}

const decode_tx = async function(tx:string){
	let tag = TAG + " | decode_tx | "
	try{
		const data = ethers.utils.parseTransaction(tx)

		return data
	}catch(e){
		console.error(tag,e)
	}
}

const build_airdrop_claim = async function(address:string){
	let tag = TAG + " | build_airdrop_claim | "
	try{
		const airdropContract = new web3.eth.Contract(AIRDROP_ABI, AIRDROP_CONTRACT)

		let accountInfo = await axios({method:'GET',url: CLAIM_URL+'/'+address})
		//console.log("accountInfo: ",accountInfo)

		if(!accountInfo.data.index) throw Error("Not found in db! ")

		//

		//console.log("airdropContract: ",accountInfo.data.contract)

		const AirDropInterface = new Interface(AIRDROP_ABI)

		// const data = airdropContract.methods.claim(
		// 	accountInfo.data.index,
		// 	address,
		// 	150,
		// 	accountInfo.data.proof
		// )

		// console.log("airdropContract: ",[
		// 	accountInfo.data.index as number,
		// 	address,
		// 	'0x0821ab0d4414980000',
		// 	accountInfo.data.proof
		// ])

		const data = AirDropInterface.encodeFunctionData('claim', [
			accountInfo.data.index as number,
			address,
			'0x0821ab0d4414980000',
			accountInfo.data.proof
		])

		return data
	}catch(e){
		console.error(tag,e)
	}
}

const check_airdrop_claim = async function(address:string){
	let tag = TAG + " | check_airdrop_claim | "
	try{
		//
		let accountInfo = await axios({method:'GET',url: CLAIM_URL+'/'+address})
		//console.log("accountInfo: ",accountInfo)

		let output:any = {
		}

		if(accountInfo.data.index){
			output.isElgible = true
			output.contract = accountInfo.data.contractAddress

			//get index?

			//check contract

			//const AirDropInterface = new Interface(AirDropABI)
			const airdropContract = new web3.eth.Contract(AIRDROP_ABI, accountInfo.data.contractAddress)

			//get index by address?
			//log.debug("index: ",accountInfo.data.index)

			let isClaimed = await airdropContract.methods.isClaimed(accountInfo.data.index as number).call()
			output.isClaimed = isClaimed
		} else {
			output.isElgible = false
		}



		return output
	}catch(e){
		console.error(tag,e)
	}
}

const get_symbol_from_contract = async function(address:string){
	let tag = TAG + " | get_symbol_from_contract | "
	try{
		//get total LP tokens

		//LP token
		const contract:any = new web3.eth.Contract(ERC20ABI, address)
		//log.debug(tag,"contract: ",contract)

		let tokenName = await contract.methods.name().call()
		//log.debug(tag,"tokenName: ",tokenName)

		return tokenName
	}catch(e){
		console.error(tag,e)
	}
}

const get_stream = async function(streamId:any){
	let tag = TAG + " | get_stream | "
	try{
		//get total LP tokens

		//LP token
		const sablierContract = new web3.eth.Contract(SABLIER_ABI, PROXY_CONTRACT_SABLIER)
		//log.debug(tag,"sablierContract: ",sablierContract)

		//log.debug(tag,"streamId: ",streamId)
		streamId = parseInt(streamId)
		let totalFox = await sablierContract.methods.getSalary(streamId).call()
		//log.debug(tag,"totalFox: ",totalFox)

		return totalFox
	}catch(e){
		console.error(tag,e)
	}
}


const get_tx_count = async function(address:string,options?:any){
	let tag = TAG + " | get_tx_count | "
	try{
		log.debug(tag,"address: ",address)
		if(!address) throw Error("102: address required!")
		//confirmed
		let txsConfirmed = await web3.eth.getTransactionCount(address)
		//pending
		let txsWithPending = await web3.eth.getTransactionCount(address,'pending')

		//count pending
		let pending = txsConfirmed - txsWithPending

		return {
			confirmed:txsConfirmed,
			total:txsWithPending,
			pending
		}
	}catch(e){
		console.error(tag,e)
	}
}

const get_pool_percent = async function(amountFox:number,amountEth:string,poolAddress:string){
	let tag = TAG + " | get_pool_percent | "
	try{
		//get total LP tokens

		//LP token
		const lpContract = new web3.eth.Contract(ERC20ABI, UNISWAP_V2_WETH_FOX_POOL_ADDRESS)
		const foxContract = new web3.eth.Contract(ERC20ABI, FOX_TOKEN_CONTRACT_ADDRESS)
		const wethContract = new web3.eth.Contract(ERC20ABI, WETH_TOKEN_CONTRACT_ADDRESS)

		//log.debug("lpContract: ",lpContract)

		let totalSupply = await lpContract.methods.totalSupply().call()
		totalSupply = totalSupply / BASE
		log.debug("LP totalSupply: ",totalSupply)

		//get total fox in pool
		let totalFox = await foxContract.methods.balanceOf(UNISWAP_V2_WETH_FOX_POOL_ADDRESS).call()
		totalFox = totalFox / BASE
		log.debug("totalFox: ",totalFox / BASE)

		//get total eth in pool
		let totalEth = await wethContract.methods.balanceOf(UNISWAP_V2_WETH_FOX_POOL_ADDRESS).call()
		totalEth = totalEth / BASE
		log.debug("totalEth: ",totalEth)

		//token math
		let result = totalFox / totalEth
		log.debug("result: ",result)

		//balance
		let lpTokens = (amountFox * totalSupply)/totalFox
		log.debug("lpTokens: ",lpTokens)
		//total LP tokens
		//liquidity = Math.min(amount0.mul(_totalSupply) / _reserve0, amount1.mul(_totalSupply) / _reserve1);

		let percent = (lpTokens / totalSupply) * 100
		log.debug("percent: ",percent)

		return percent
	}catch(e){
		console.error(tag,e)
	}
}


const get_balances = async function(addresses:string){
	let tag = TAG + " | get_balances | "
	try{

		let actions = []
		for(let i = 0; i < addresses.length; i++){
			let address = addresses[i]
			let action = {
				method:"eth_getBalance",
				params:[address]
			}
			actions.push(action)
		}

		let result = await rpcCallBatch(actions)

		//covert
		let output:any = []
		for(let i = 0; i < result.length; i++){
			let entry = result[i]
			let balance = entry.result
			balance = Web3Utils.hexToNumberString(balance);
			balance = balance / BASE
			output.push(balance)
		}

		return output
	}catch(e){
		console.error(tag,e)
	}
}

const rpcCallBatch = async (actions:any)=>{
	let tag = TAG + " | post_request | ";
	try{

		let body = []

		for(let i = 0; i < actions.length; i++){
			let action = actions[i]

			let req = {
				"jsonrpc":"2.0",
				"method" : action.method,
				"params": action.params,
				"id": 1
			};

			body.push(req)
		}

		let options = {
			method : "POST",
			url : NODE_URL,
			headers :{'content-type':'application/json'},
			body : JSON.stringify(body)
		};
		//console.log("options: ",options)
		let result = await request(options);
		//console.log("result: ",result)
		result = JSON.parse(result);
		if(result.error) throw JSON.stringify(result.error)
		return result;
	}catch(err:any){
		throw new Error(err)
	}
};

//get_approval_status
const get_allowance = async function(tokenAddress:string,spender:string,sender:string){
	let tag = TAG + " | get_allowance | "
	try{

		let contract = new web3.eth.Contract(ERC20ABI,tokenAddress);
		let allowance = await contract.methods.allowance(spender,sender).call()

		return allowance
	}catch(e){
		console.error(tag,e)
	}
}

const get_all_tokens_blockbook = async function(address:string){
	let tag = TAG + " | get_all_tokens_blockbook | "
	try{
		//
		let ethInto = await blockbook.getEthInfo(address)

		log.debug(tag,"ethInto: ",ethInto)

		return true
	}catch(e){
		console.error(tag,e)
	}
}

const get_nfts = async function(address:string){
	let tag = TAG + " | get_nfts | "
	try{
		//get nfts from etherscan (v3 uniswap)

		//
		let ethInfo = await blockbook.getAddressInfo('ETH',address)

		//TODO filter by LP contracts
		log.debug(tag,"ethInfo: ",ethInfo)

		return ethInfo
	}catch(e){
		console.error(tag,e)
	}
}

const get_pool_positions = async function(address:string){
	let tag = TAG + " | get_pool_positions | "
	try{
		//get nfts from etherscan (v3 uniswap)

		//
		let ethInfo = await blockbook.getAddressInfo('ETH',address)

		//TODO filter by LP contracts
		log.debug(tag,"ethInfo: ",ethInfo)

		return ethInfo
	}catch(e){
		console.error(tag,e)
	}
}


/*
let swap = {
    inboundAddress: {
        chain: 'ETH',
        pub_key: 'tthorpub1addwnpepqvuy8vh6yj4h28xp6gfpjsztpj6p46y2rs0763t6uw9f6lkky0ly5uvwla6',
        address: '0x36286e570c412531aad366154eea9867b0e71755',
        router: '0x9d496De78837f5a2bA64Cb40E62c19FBcB67f55a',
        halted: false
    },
    asset: {
        chain: 'ETH',
        symbol: 'ETH',
        ticker: 'ETH',
        iconPath: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png'
    },
    memo: '=:THOR.RUNE:tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh',
    amount: "0.1"
}
 */
let get_memo_data = async function(swap:any){
	let tag = TAG + " | get_memo_data | "
	try{
		const web3 = new Web3()
		if(!swap.inboundAddress.router) throw Error("Router required!")
		const routerContract = new web3.eth.Contract(TCRopstenAbi, swap.inboundAddress.router)

		const memo = swap.memo
		//TODO support tokens?
		const data = routerContract.methods
			.deposit(
				swap.inboundAddress.address,
				'0x0000000000000000000000000000000000000000', // 0 = ETH
				web3.utils.toBN(swap.amount * BASE),
				memo
			)
			.encodeABI()

		return data
	}catch(e){
		log.error(tag,e)
		throw e
	}
}

/*
	X-chain compatible call
 */
let estimate_fee = async function(sourceAsset:any, params:any){
	let tag = TAG + " | estimate_fee | "
	try{

		let checkSummedAddress;
		let decimal;

		if (sourceAsset.symbol === 'ETH') {
			checkSummedAddress = '0x0000000000000000000000000000000000000000';
			decimal = ETH_DECIMAL;
		} else {
			throw Error("TODO")
			// const assetAddress = sourceAsset.symbol.slice(sourceAsset.ticker.length + 1);
			// const strip0x = assetAddress.substr(2);
			// checkSummedAddress = ethers.utils.getAddress(strip0x);
			//
			// const tokenContract = new ethers.Contract(checkSummedAddress, erc20ABI, wallet);
			// const tokenDecimals = await tokenContract.decimals();
			// decimal = tokenDecimals.toNumber();
		}
		// Connect to the network
		let provider = PROVIDER;
		//
		const contract = new ethers.Contract(THORCHAIN_ROUTER_TESTNET, TCRopstenAbi, provider);

		console.log('checkppint estimateFee: params', params);
		const estimateGas = await contract.estimateGas.deposit(...params);
		console.log('checkppint estimateFee: params', params);

		let entry = {
			asset: {
				chain:"ETH",
				symbol:"ETH",
				ticker:"ETH",
			},
			amount: params[2],
			recipient: params[0],
			memo: params[3],
		}

		const {fees} = await get_fees(entry);
		let minimumWeiCost = BigNumber.from(fees.average)
		minimumWeiCost = minimumWeiCost.mul(estimateGas.toNumber())
		return minimumWeiCost;
	}catch(e){
		log.error(tag,e)
		throw e
	}
}


let get_gas_limit = async function({ asset, recipient, amount, memo }: FeesParams){
	let tag = TAG + " | get_gas_limit | "
	try{
		log.debug(tag,"input: ",{ asset, recipient, amount, memo })
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
				from: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", //address with lots of eth
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

let get_fees = async function(params: any){
	let tag = TAG + " | get_fees | "
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

		log.debug(tag,"get_gas_limit: ",{
			asset: params.asset,
			amount: params.amount,
			recipient: params.recipient,
			memo: params.memo,
		})

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
		let output:any = {}
		output.success = false

		log.debug(tag,"tx: ",tx)
		if(!tx) throw Error("101: missing tx!")

		//push node
		// web3.eth.sendSignedTransaction(tx)

		//push etherscan
		//https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=0xf904808000831cfde080&apikey=YourApiKeyToken
		let resp = await axios({
			method:'GET',
			url: 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex='+tx+'&apikey='+process.env['ETHERSCAN_API_KEY']
		})
		resp = resp.data
		console.log(resp)

		//push blockbook


		//TODO lifecycle hook?
		// let resp2 = await web3.eth.sendSignedTransaction(tx)
		// 	.on('transactionHash', function(hash:any){
		// 		console.log("hash: ",hash)
		// 	})
		// 	.on('receipt', function(receipt:any){
		// 		console.log("receipt: ",receipt)
		// 	})
		// 	.on('confirmation', function(confirmationNumber:any, receipt:any){
		// 		console.log(confirmationNumber,receipt)
		// 	})
		// 	.on('error', console.error);

		//console.log("resp: ",resp)
		if(!resp.error) output.success = true
		if(resp.error) output.error = resp
		if(resp.result) output.txid = resp.result

		return output
	}catch(e){
		log.error(tag,e)
		throw e
	}
}

const get_balance_tokens = async function(address:string){
	let tag = TAG + " | get_balance_tokens | "
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
		//decimals
		let contract = new web3.eth.Contract(ERC20ABI,token);
		let decimals = await contract.methods.decimals().call()
		//log.debug(tag,"decimals: ",decimals)

		let balance = await contract.methods.balanceOf(address).call()
		//log.debug(tag,"balance: ",balance)

		return balance / Math.pow(10, decimals);
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

const get_transactions = async function(address:string,options:any){
	let tag = TAG + " | get_transactions | "
	try{
		let output:any = {}

		let ethInfo = await blockbook.getAddressInfo('ETH',address)

		return ethInfo
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
