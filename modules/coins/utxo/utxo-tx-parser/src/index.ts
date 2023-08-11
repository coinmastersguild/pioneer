/*
    BTC hex to magic hdwallet format

    This tool deserializes a raw transaction hex to a JSON format the keepkey reconizes

*/
const TAG = " | utxo-tx-parser | "

const tinysecp = require('tiny-secp256k1');

// @ts-ignore
const ECPair = await import('ecpair')

const ecp = ECPair.ECPairFactory(tinysecp);

const txHexDecoder = require("transaction-hex-decoder");
const log = require('@pioneer-platform/loggerdog')()

const psbt = require("")

/**********************************
 // Module
 //**********************************/

module.exports = {
    init:function (url:string,settings:any) {
        return true
    },
    decodeHex:function (hex:string) {
        return decode_hex_to_tx(hex);
    },
    decodePsbt:function (psbt:string) {
        return decode_psbt_to_tx(psbt);
    },
}


/**********************************
 // Lib
 //**********************************/

let decode_psbt_to_tx = function(hex:string){
    let tag = TAG + " | decode_psbt_to_tx | "
    try{
        let output:any = {}

        // @ts-ignore
        const btcDecodedRawTx = ecp.decodePsbt(hex);
        log.debug(tag,"btcDecodedRawTx: ",btcDecodedRawTx)

        output.txid = ""
        // output.hash = ""
        output.version = ""
        // output.size = ""
        // output.vsize = ""
        // output.weight = ""
        output.locktime = ""

        output.vin = []
        output.vout = []
        output.hex = hex



        return output


        return output
    }catch(e){
        // log.error(tag,"e: ",e)
        throw e
    }
}

let decode_hex_to_tx = function(hex:string){
    let tag = TAG + " | decode_hex_to_tx | "
    try{
        let output:any = {}

        const btcDecodedRawTx = txHexDecoder.decodeBtcRawTx(hex);
        log.debug(tag,"btcDecodedRawTx: ",btcDecodedRawTx)

        output.txid = ""
        // output.hash = ""
        output.version = ""
        // output.size = ""
        // output.vsize = ""
        // output.weight = ""
        output.locktime = ""

        output.vin = []
        output.vout = []
        output.hex = hex



        return output
    }catch(e){
        // log.error(tag,"e: ",e)
        throw e
    }
}
