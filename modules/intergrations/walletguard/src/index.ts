/*
        Uniswap Integration
                - Highlander

    BASE
    https://docs.base.org/contracts/



 */

const TAG = " | walletgaurd | "
import axios from 'axios';
const log = require('@pioneer-platform/loggerdog')()
import {
    TransactionType,
    SimulationMethodType,
} from './Transaction'; // Make sure to import necessary modules

import { fetchTransaction } from './server'

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
