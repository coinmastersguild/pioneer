/*
    BTC hex to magic hdwallet format

    This tool deserializes a raw transaction hex to a JSON format the keepkey reconizes

*/
const TAG = " | utxo-tx-parser | "


const txHexDecoder = require("transaction-hex-decoder");
const log = require('@pioneer-platform/loggerdog')()


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
}


/**********************************
 // Lib
 //**********************************/


let decode_hex_to_tx = function(hex:string){
    let tag = TAG + " | decode_hex_to_tx | "
    try{
        let output:any = {}

        const btcDecodedRawTx = txHexDecoder.decodeBtcRawTx(hex);
        log.info(tag,"btcDecodedRawTx: ",btcDecodedRawTx)

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
