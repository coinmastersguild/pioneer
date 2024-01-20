/*
    

 */



const TAG = " | thorswap | "
import {
    BestRouteResponse,
    EvmTransaction,
    MetaResponse,
    RangoClient,
    TransactionStatus,
    TransactionStatusResponse,
    WalletRequiredAssets
} from "rango-sdk"

let {
    getRangoBlockchainName
} = require('@pioneer-platform/pioneer-coins')

const log = require('@pioneer-platform/loggerdog')()
let {shortListSymbolToCaip} = require("@pioneer-platform/pioneer-caip")

let rango:any

let networkSupport = [
    //shortListSymbolToCaip["TON"], TODO
    //shortListSymbolToCaip["TRON"], TODO
    //shortListSymbolToCaip["SOLANA"], TODO
    shortListSymbolToCaip["DASH"],
    shortListSymbolToCaip["OSMO"],
    shortListSymbolToCaip["GAIA"],
    shortListSymbolToCaip["BNB"],
    shortListSymbolToCaip["DOGE"],
    shortListSymbolToCaip["BTC"],
    shortListSymbolToCaip["ETH"],
    shortListSymbolToCaip["LTC"],
    shortListSymbolToCaip["THOR"],
    shortListSymbolToCaip["BCH"],
    shortListSymbolToCaip["GNO"],
    shortListSymbolToCaip["MATIC"],
    shortListSymbolToCaip["AVAX"],
]


module.exports = {
    init:function(settings:any){
        let rangoApiKey = settings?.rangoApiKey || '02b14225-f62e-4e4f-863e-a8145e5befe5'
        rango = new RangoClient(rangoApiKey)
    },
    networkSupport: function () {
        return networkSupport
    },
    getChains: async function () {
        return rango.getAllMetadata()
    },
    getQuote: function (quote:any) {
        return get_quote(quote);
    },
    createTransaction: function (id:any, step: number, validateBalance?: boolean, validateFee?: boolean) {
        return create_transaction(id, step, validateBalance, validateFee);
    },
}

const create_transaction = async function (id:any, step: number, validateBalance?: boolean, validateFee?: boolean) {
    let tag = TAG + " | create_transaction | "
    try {
        const transactionResponse = await rango.createTransaction({
            requestId: id,
            step: 1, // In this example, we assumed that route has only one step
            userSettings: { 'slippage': '1' },
            validations: { balance: false, fee: true },
        })

        return transactionResponse
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}

const get_quote = async function (quote:any) {
    let tag = TAG + " | get_quote | "
    try {
        let output = await rango.getBestRoute(quote)
        log.info(tag,"output: ",output)

        let unsignedTx = await create_transaction(output.requestId, 1, false, false)
        log.info(tag,"unsignedTx: ",unsignedTx)
        output.unsignedTx = unsignedTx
        
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}
