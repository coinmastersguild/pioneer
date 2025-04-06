/*
        WalletGuard Integration
                - Highlander

    BASE
    https://docs.base.org/contracts/



 */

const TAG = " | WalletGuard | "
// Define a simple BaseDecimal type instead of importing from @coinmasters/types
type BaseDecimal = string | number;

const axios = require('axios');
const log = require('@pioneer-platform/loggerdog')()

// Mock enums instead of importing
enum TransactionType {
    Transaction = 'transaction',
    Message = 'message'
}

enum SimulationMethodType {
    EthSendTransaction = 'eth_sendTransaction',
    EthSignTransaction = 'eth_signTransaction'
}

// Mock the fetchTransaction function
const fetchTransaction = async (transactionArgs: any, type: TransactionType) => {
    // Return mock data
    return {
        success: true,
        risk: {
            score: 0,
            level: 'SAFE',
            alerts: []
        },
        simulation: {
            status: 'SUCCESS',
            gasUsed: '100000'
        }
    };
};

module.exports = {
    init:function(settings:any){
        return true;
    },
    getSimulation: function (chainId:string, tx:any) {
        return simulate_tx(chainId, tx);
    }
}

const simulate_tx = async function (chainId:any, tx:any) {
    let tag = TAG + " | simulate_tx | "
    try {
        let output:any = {}
        log.info(tag, "tx: ", tx)

        // Constructing TransactionArgs from the given transaction details
        const transactionArgs = {
            id: "some-unique-id", // You should generate a unique id
            chainId: chainId,
            signer: tx.from,
            origin: "your-dapp-origin.com", // Specify the domain origin of your dApp
            method: SimulationMethodType.EthSendTransaction, // Using EthSendTransaction as the method type
            transaction: tx, // the actual transaction data provided
        };

        // Fetching the transaction simulation
        let result = await fetchTransaction(transactionArgs, TransactionType.Transaction);
        
        return result;
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e;
    }
}
