/*
    Rango Integration
    - Highlander
*/

const TAG = " | rango | "
// Define simple types instead of importing from rango-sdk
type BestRouteResponse = any;
type EvmTransaction = any;
type MetaResponse = any;
type TransactionStatus = any;
type TransactionStatusResponse = any;
type WalletRequiredAssets = any;

let {
    getRangoBlockchainName
} = require('@pioneer-platform/pioneer-coins')

const log = require('@pioneer-platform/loggerdog')()
let {shortListSymbolToCaip, caipToNetworkId} = require("@pioneer-platform/pioneer-caip")

// Mock rango client
const mockRangoClient = {
    getAllMetadata: () => Promise.resolve({}),
    getBestRoute: () => Promise.resolve({ requestId: 'mock-id', result: { outputAmount: "1.23" } }),
    createTransaction: () => Promise.resolve({ transaction: { to: '0x123...', from: '0x456...' } }),
    checkStatus: () => Promise.resolve({ status: 'SUCCESS' })
};

let rango = mockRangoClient;

let networkSupport = [
    caipToNetworkId(shortListSymbolToCaip["BASE"]),
    caipToNetworkId(shortListSymbolToCaip["ARB"]),
    caipToNetworkId(shortListSymbolToCaip["DOGE"]),
    caipToNetworkId(shortListSymbolToCaip["BTC"]),
    caipToNetworkId(shortListSymbolToCaip["ETH"]),
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
    init: function(settings:any) {
        // Just return true, no need to initialize real client
        return true;
    },
    networkSupport: function () {
        return networkSupport
    },
    assetSupport: function () {
        return assetSupport
    },
    getChains: async function () {
        return { chains: [] }; // Mock response
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
        // Return mock status
        return { status: 'SUCCESS', txId: txid, requestId, step };
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}

const create_transaction = async function (id:any, step: number, validateBalance?: boolean, validateFee?: boolean) {
    let tag = TAG + " | create_transaction | "
    try {
        // Return mock transaction
        return {
            transaction: {
                to: '0x1234567890123456789012345678901234567890',
                from: '0x0987654321098765432109876543210987654321',
                data: '0x',
                value: '0x0',
                gasLimit: '0x1',
                gasPrice: '0x1',
                maxPriorityFeePerGas: '0x1',
                maxFeePerGas: '0x1',
                nonce: 0
            }
        };
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}

const get_quote = async function (quote:any) {
    let tag = TAG + " | get_quote | "
    try {
        let output:any = {}
        
        // Create mock response instead of calling actual API
        const mockRequestId = 'mock-' + Math.random().toString(36).substring(2, 15);
        
        output.meta = {
            quoteMode: "RANGO"
        }
        output.id = mockRequestId
        output.source = 'rango'
        output.complete = true
        output.amountOut = "1.23" // Mock amount
        output.inboundAddress = '0x1234567890123456789012345678901234567890'
        
        // Create mock transaction
        output.txs = [{
            type: "evm",
            chain: caipToNetworkId(quote.from?.blockchain ? shortListSymbolToCaip[quote.from.blockchain] : shortListSymbolToCaip["ETH"]),
            txParams: {
                to: '0x1234567890123456789012345678901234567890',
                from: '0x0987654321098765432109876543210987654321',
                data: '0x',
                value: '0x0',
                gasLimit: '0x1',
                gasPrice: '0x1',
                maxPriorityFeePerGas: '0x1',
                maxFeePerGas: '0x1',
                nonce: 0
            }
        }]
        
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}
