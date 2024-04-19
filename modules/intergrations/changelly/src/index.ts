/*
    This is v1, need to migrate to v2
 */

let Changelly = require('@bithighlander/changelly');

const TAG = " | Changelly | ";
const CHANGELLY_API_KEY = process.env['CHANGELLY_API_KEY'];
const CHANGELLY_API_SECRET = process.env['CHANGELLY_API_SECRET'];

if (!CHANGELLY_API_KEY) throw new Error('CHANGELLY_API_KEY not set');
if (!CHANGELLY_API_SECRET) throw new Error('CHANGELLY_API_SECRET not set');

let changelly: any;

let {ChainToNetworkId, caipToNetworkId, shortListSymbolToCaip} = require("@pioneer-platform/pioneer-caip")


let networkSupport = [
    ChainToNetworkId["XRP"],
    ChainToNetworkId["DASH"],
    ChainToNetworkId["ZEC"],
    // shortListSymbolToCaip["BSV"], //TODO
    // shortListSymbolToCaip["ADA"], //TODO
    // shortListSymbolToCaip["EOS"], //TODO
    ChainToNetworkId["GAIA"],
    ChainToNetworkId["BNB"],
    ChainToNetworkId["DOGE"],
    ChainToNetworkId["BTC"],
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"],
    ChainToNetworkId["LTC"],
    ChainToNetworkId["THOR"],
    ChainToNetworkId["BCH"],
    ChainToNetworkId["GNO"],
    ChainToNetworkId["MATIC"],
    ChainToNetworkId["AVAX"],
]

let assetSupport = [
    shortListSymbolToCaip["BTC"],
    shortListSymbolToCaip["ETH"],
    shortListSymbolToCaip["XRP"],
    shortListSymbolToCaip["DASH"],
    shortListSymbolToCaip["ZEC"],
    shortListSymbolToCaip["BASE"],
    shortListSymbolToCaip["LTC"],
    shortListSymbolToCaip["BCH"],
    shortListSymbolToCaip["MATIC"],
    shortListSymbolToCaip["AVAX"],
    shortListSymbolToCaip["BSV"], //TODO
    shortListSymbolToCaip["ADA"], //TODO
    shortListSymbolToCaip["EOS"], //TODO
]

module.exports = {
    init: function(settings: any): void {
        changelly = new Changelly(CHANGELLY_API_KEY, CHANGELLY_API_SECRET);
    },
    networkSupport: function () {
        return networkSupport
    },
    assetSupport: function () {
        return assetSupport
    },
    getCurrenciesAsync: function(): Promise<any> {
        return get_currencies();
    },
    getQuote: function(from: string, to: string, address: string, amount: number, extraId?: string): Promise<any> {
        return create_transaction(from, to, address, amount, extraId);
    },
    // createTransactionAsync: function(from: string, to: string, address: string, amount: number, extraId?: string): Promise<any> {
    //     return create_transaction(from, to, address, amount, extraId);
    // },
    getMinAmountAsync: function(from: string, to: string): Promise<any> {
        return get_min_amount(from, to);
    },
    getExchangeAmountAsync: function(from: string, to: string, amount: number): Promise<any> {
        return get_exchange_amount(from, to, amount);
    },
    getTransactionsAsync: function(limit: number, offset: number, currency?: string, address?: string, extraId?: string): Promise<any> {
        return get_transactions(limit, offset, currency, address, extraId);
    },
    getStatusAsync: function(id: string): Promise<any> {
        return get_status(id);
    }
};

async function get_currencies(): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getCurrencies((err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_currencies error:", e);
        throw e;
    }
}

async function create_transaction(from: string, to: string, address: string, amount: number, extraId?: string): Promise<any> {
    try {
        let output:any = {}
        output.steps = 1
        output.complete = true
        output.meta = {
            quoteMode: "CHANGELLY"
        }
        output.complete = true
        let data:any = await new Promise((resolve, reject) => {
            changelly.createTransaction(from, to, address, amount, extraId, (err: any, data: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        console.log("data:",data)
        data = data.result
        output.id = data.id
        output.amountOut = data.amountExpectedTo
        output.inboundAddress = data.payinAddress
        if(!data) throw Error("Failed to create quote@changelly")
        if(!data.payinAddress) throw Error("Failed to create quote@changelly")
        if(!data.id) throw Error("Failed to create quote@changelly")
        output.id = data.id
        let tx = {
            type:"transfer",
            chain:caipToNetworkId(shortListSymbolToCaip[from]),
            txParams: {
                address: data.payinAddress,
                amount: amount,
                memo: data.payinExtraId,
            }
        }
        output.txs = [tx]
        output.raw = data
        return output
    } catch (e) {
        console.error(TAG, "create_transaction error:", e);
        throw e;
    }
}
async function get_min_amount(from: string, to: string): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getMinAmount(from, to, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_min_amount error:", e);
        throw e;
    }
}

async function get_exchange_amount(from: string, to: string, amount: number): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getExchangeAmount(from, to, amount, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_exchange_amount error:", e);
        throw e;
    }
}

async function get_transactions(limit: number, offset: number, currency?: string, address?: string, extraId?: string): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getTransactions(limit, offset, currency, address, extraId, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_transactions error:", e);
        throw e;
    }
}

async function get_status(id: string): Promise<any> {
    try {
        return new Promise((resolve, reject) => {
            changelly.getStatus(id, (err: any, data: any) => {
                if (err) reject(err);
                else resolve(data);
            });
        });
    } catch (e) {
        console.error(TAG, "get_status error:", e);
        throw e;
    }
}
