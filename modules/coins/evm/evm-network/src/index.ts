/*
   ETH Network tools


       Goals:

        *


 */


const TAG = " | eth-network | "

import { JsonRpcProvider } from 'ethers'

module.exports = {
	init:function (settings:any) {
		return true
	},
	// getInfo:function () {
	// 	return check_online_status();
	// },
	// getNonce: function (address:string, networkId:string) {
	// 	return get_nonce(networkId, address)
	// },
	getFees: function (networkId: string): Promise<any> {
		return get_fees(networkId)
	},
	getPending: function (networkId: string,address:string): Promise<any> {
		return get_pending(networkId,address)
	},
	getTransaction: function (networkId:string, txid:string) {
		return get_transaction(networkId,txid)
	},
	// estimateFee: function (sourceAsset:any,params:any): Promise<any> {
	// 	return estimate_fee(sourceAsset,params)
	// },
	// getBalance: function (address:string, networkId:string) {
	// 	return get_balance(address)
	// },
	// getBalances: function (addresses:string, networkId:string) {
	// 	return get_balances(addresses)
	// },
	// getBalanceAddress: function (address:string, networkId:string) {
	// 	return get_balance(address)
	// },
	// getBalanceToken: function (address:string,token:string, networkId:string) {
	// 	return get_balance_token(address,token)
	// },
	// getBalanceTokens: function (address:string, networkId:string) {
	// 	return get_balance_tokens(address)
	// },
	// broadcast:function (tx:any, networkId:string) {
	// 	return broadcast_transaction(tx);
	// }
}

const get_transaction = async function(networkId: string,txid:string){
	let tag = TAG + " | get_pending | "
	try{
		//get total LP tokens
		let rpcUrl = "https://mainnet.base.org"
		const provider = new JsonRpcProvider(rpcUrl);

		//
		const tx = await provider.getTransaction(txid);
		console.log("tx:", tx);
	}catch(e){
		console.error(tag,e)
	}
}

const get_pending = async function(networkId: string,address:string){
	let tag = TAG + " | get_pending | "
	try{
		//get total LP tokens
		let rpcUrl = "https://mainnet.base.org"
		const provider = new JsonRpcProvider(rpcUrl);

		// Fetch the "pending" block which includes pending transactions.
		const blockWithPendingTxs = await provider.send("eth_getBlockByNumber", ["pending", true]);
		console.log("blockWithPendingTxs:", blockWithPendingTxs);
		
		// Filter transactions that are either to or from the specified address.
		const relevantTransactions = blockWithPendingTxs.transactions.filter((tx: any) =>
			tx.to === address.toLowerCase() || tx.from === address.toLowerCase()
		);

		// For demonstration, let's limit the output to the first 20 relevant transactions.
		const first20RelevantTransactions = relevantTransactions.slice(0, 20);

		console.log("First 20 relevant transactions for address:", first20RelevantTransactions);
		return first20RelevantTransactions;
	}catch(e){
		console.error(tag,e)
	}
}

const get_fees = async function(networkId:any){
	let tag = TAG + " | get_stream | "
	try{
		//get total LP tokens
		let rpcUrl = "https://mainnet.base.org"
		const provider = new JsonRpcProvider(rpcUrl);
		
		const feeData:any = await provider.getFeeData();
		console.log("feeData: ",feeData)

		//convert to base units
		let gas = BigInt(feeData.gasPrice) / BigInt(1000)
		console.log("gas: ",gas.toString())
		
		//hex
		let gasHex = '0x' + gas.toString(16);
		console.log("gasHex: ",gasHex)
		
		return feeData
	}catch(e){
		console.error(tag,e)
	}
}
