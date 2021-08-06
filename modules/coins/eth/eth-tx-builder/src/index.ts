/*

    Ethereum TX tools

    //encode/decode

    //validate

    //sign

 */


import * as support from "@pioneer-platform/pioneer/lib/support";

const bip39 = require(`bip39`)
const bip32 = require(`bip32`)
const bech32 = require(`bech32`)
const secp256k1 = require(`secp256k1`)
const sha256 = require("crypto-js/sha256")
const ripemd160 = require("crypto-js/ripemd160")
const CryptoJS = require("crypto-js")
const HDKey = require('hdkey')
//const coininfo = require('coininfo')
const hdPathEth = `m/44'/60'/0'/0/0` // ETH
let bitcoin = require("bitcoinjs-lib");
const ethUtils = require('ethereumjs-util');
const log = require('@pioneer-platform/loggerdog')()
/**********************************
 // Module
 //**********************************/


module.exports = {
    signTx: async function () {
        return sign_tx()
    },
}

const sign_tx = async function(){
    let tag = " | sign_tx | "
    try{
        //
        //TODO
        // log.debug(tag,"checkpoint")
        // let balanceEth = await this.getBalance('ETH')
        // log.debug(tag,"balanceEth: ",balanceEth)
        //
        // let nonceRemote = await this.pioneerClient.instance.GetNonce(addressFrom)
        // nonceRemote = nonceRemote.data
        // let nonce = transaction.nonce || nonceRemote
        // log.debug(tag,"nonce: ",nonce)
        //
        // let gas_limit = 80000 //TODO dynamic gas limit?
        // let gas_price = await this.pioneerClient.instance.GetGasPrice()
        // gas_price = gas_price.data
        // log.debug(tag,"gas_price: ",gas_price)
        // gas_price = parseInt(gas_price)
        // gas_price = gas_price + 1000000000
        //
        // let txParams
        // if(asset === "ETH"){
        //     let amountNative = parseFloat(amount) * support.getBase('ETH')
        //     amountNative = Number(parseInt(String(amountNative)))
        //     txParams = {
        //         nonce: nonce,
        //         to: address,
        //         gasPrice: gas_price,
        //         gasLimit : gas_limit,
        //         value: amountNative,
        //         data:memo
        //     }
        //     log.debug(tag,"txParams: ",txParams)
        // } else {
        //     throw Error("103: tokens incomplete!")
        //     //TODO tokens
        // }
        // // else{
        // //     //TODO tokens
        // //     // let knownCoins = tokenData.tokens
        // //     // log.debug(tag,"knownCoins: ",knownCoins)
        // //     // if(knownCoins.indexOf(coin) === -1) throw Error("107: unknown token! "+coin)
        // //     //
        // //     let balanceToken = await this.getBalance(coin)
        // //
        // //     //verify token balance
        // //     if(amount > balanceToken) throw Error("103: Insufficient balance! ")
        // //
        // //     let abiInfo = "NERF"
        // //     let metaData = "NERF"
        // //
        // //     let amountNative = parseFloat(amount) * metaData.BASE
        // //     amountNative = Number(parseInt(String(amountNative)))
        // //
        // //     log.debug({coin:coin,address, amountNative})
        // //     let transfer_data = await this.pioneerClient.instance.GetTransferData({coin,address,amount:amountNative})
        // //     transfer_data = transfer_data.data
        // //     log.debug(tag,"transfer_data: ",transfer_data)
        // //
        // //     txParams = {
        // //         nonce: nonce,
        // //         to: "NERF",
        // //         gasPrice: gas_price,
        // //         data: transfer_data,
        // //         gasLimit : gas_limit
        // //
        // //     }
        // //     log.debug(tag,"txParams: ",txParams)
        // // }
        // if(!txParams) throw Error("tokens not supported")
        //
        // //send FROM master
        // let masterPathEth  = "m/44'/60'/0'/0/0" //TODO moveme to support
        //
        // log.debug(tag,"txParams: ",txParams)
        //
        // //verify from address
        // //verify from address
        // let fromAddress = await this.WALLET.ethereumGetAddress({
        //     addressNList: bip32ToAddressNList(HD_RUNE_KEYPATH),
        //     showDisplay: false,
        // });
        // log.debug(tag,"fromAddressHDwallet: ",fromAddress)
        // log.debug(tag,"fromAddress: ",addressFrom)
        //
        // let chainId = 1
        // if(this.isTestnet){
        //     chainId = 3 //ropsten
        // }
        //
        // let ethTx = {
        //     addressNList: support.bip32ToAddressNList(masterPathEth),
        //     // "addressNList":[
        //     //     2147483692,
        //     //     2147483708,
        //     //     2147483648,
        //     //     0,
        //     //     0
        //     // ],
        //     nonce: numberToHex(txParams.nonce),
        //     gasPrice: numberToHex(txParams.gasPrice),
        //     gasLimit: numberToHex(txParams.gasLimit),
        //     value: numberToHex(txParams.value || 0),
        //     to: txParams.to,
        //     data:txParams.data,
        //     chainId
        // }
        // log.debug("TX: ",JSON.stringify(ethTx))
        //
        // //import Broke
        //
        //
        // let unsignedTx = {
        //     network:network,
        //     asset:network,
        //     transaction,
        //     HDwalletPayload:ethTx,
        //     verbal:"Ethereum transaction"
        // }

        //return unsignedTx
    }catch(e){
        console.error(e)
    }
}
