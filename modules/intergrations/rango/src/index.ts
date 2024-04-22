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
let {shortListSymbolToCaip, caipToNetworkId} = require("@pioneer-platform/pioneer-caip")

let rango:any

let networkSupport = [
    //shortListSymbolToCaip["TON"], TODO
    //shortListSymbolToCaip["TRON"], TODO
    //shortListSymbolToCaip["SOLANA"], TODO
    // caipToNetworkId(shortListSymbolToCaip["DASH"]),
    // shortListSymbolToCaip["OSMO"], //TODO Rango uses WASM for osmosis, not support by KK
    caipToNetworkId(shortListSymbolToCaip["BASE"]),
    caipToNetworkId(shortListSymbolToCaip["ARB"]),
    // caipToNetworkId(shortListSymbolToCaip["GAIA"]),
    // shortListSymbolToCaip["BNB"],
    // caipToNetworkId(shortListSymbolToCaip["BSC"]),
    caipToNetworkId(shortListSymbolToCaip["DOGE"]),
    caipToNetworkId(shortListSymbolToCaip["BTC"]),
    caipToNetworkId(shortListSymbolToCaip["ETH"]),
    // caipToNetworkId(shortListSymbolToCaip["LTC"]),
    // caipToNetworkId(shortListSymbolToCaip["THOR"]),
    caipToNetworkId(shortListSymbolToCaip["BCH"]),
    caipToNetworkId(shortListSymbolToCaip["GNO"]),
    caipToNetworkId(shortListSymbolToCaip["MATIC"]),
    caipToNetworkId(shortListSymbolToCaip["AVAX"]),
]

let assetSupport = [
    shortListSymbolToCaip["SOLANA"],
    shortListSymbolToCaip["BTC"],
    shortListSymbolToCaip["ETH"],
    shortListSymbolToCaip["BASE"],
    shortListSymbolToCaip["GNO"],
    shortListSymbolToCaip["MATIC"],
    shortListSymbolToCaip["AVAX"],
    shortListSymbolToCaip["DOGE"],
    shortListSymbolToCaip["BCH"],
]



module.exports = {
    init:function(settings:any){
        let rangoApiKey = settings?.rangoApiKey || '02b14225-f62e-4e4f-863e-a8145e5befe5'
        rango = new RangoClient(rangoApiKey)
    },
    networkSupport: function () {
        return networkSupport
    },
    assetSupport: function () {
        return assetSupport
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
    getTransactionStatus: function (requestId:string, step:number, txid:string) {
        return get_transaction_status(requestId, step, txid);
    }
}

const get_transaction_status = async function (requestId:string, step:number, txid:string) {
    let tag = TAG + " | get_transaction_status | "
    try {
        console.log("rango: ", rango)
        const transactionStatusResponse = await rango.checkStatus({requestId, step, txId:txid})
        return transactionStatusResponse
    } catch (e) {
        console.error(tag, "e: ", e)
    }
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
        let output:any = {}
        let quoteRango = await rango.getBestRoute(quote)
        log.info(tag,"quoteRango: ",quoteRango)

        let unsignedTx = await create_transaction(quoteRango.requestId, 1, false, false)
        log.info(tag,"unsignedTx: ",unsignedTx)
        
        //validate that input is in supported network
        if(!networkSupport.includes(caipToNetworkId(shortListSymbolToCaip[quote.from.blockchain]))) throw new Error("Unsupported input network: "+quote.from.blockchain)
        if(!networkSupport.includes(caipToNetworkId(shortListSymbolToCaip[quote.to.blockchain]))) throw new Error("Unsupported output network: "+quote.from.blockchain)

        
        output.meta = {
            quoteMode: "RANGO"
        }
        output.id = quoteRango.requestId
        output.complete = true
        output.amountOut = quoteRango.result.outputAmount
        output.inboundAddress = unsignedTx.transaction.to
        output.txs = [{
            type:"evm",
            chain:caipToNetworkId(shortListSymbolToCaip[quote.from.blockchain]),
            txParams:{
                to:unsignedTx.transaction.to,
                from:unsignedTx.transaction.from,
                data:unsignedTx.transaction.data,
                value:unsignedTx.transaction.value,
                gasLimit:unsignedTx.transaction.gasLimit,
                gasPrice: unsignedTx.transaction.gasPrice,
                maxPriorityFeePerGas: unsignedTx.transaction.maxPriorityFeePerGas,
                maxFeePerGas: unsignedTx.transaction.maxFeePerGas,
                nonce: unsignedTx.transaction.nonce
            }
        }]
        output.rawUnsigned = unsignedTx
        output.raw = quoteRango
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}
