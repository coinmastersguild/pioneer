import axios from "axios";
import https from "https";
import { ethers } from "ethers";

const TAG = " | tenderly | ";

// Ensure API key is set
const TENDERLY_ACCESS_KEY = process.env.TENDERLY_ACCESS_KEY;
if (!TENDERLY_ACCESS_KEY) {
    throw new Error("API key required! Set env TENDERLY_ACCESS_KEY");
}

const TENDERLY_USER = 'highlander2';
const TENDERLY_PROJECT = 'project';

// Axios instance with custom HTTPS agent
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

module.exports = {
    validateTransaction: function (tx:any) {
        return simulateTransaction(tx);
    },
};


// Function to simulate a transaction
async function simulateTransaction(tx:any) {
    let tag = " | simulateTransaction | "
    try {
        const apiURL = `https://api.tenderly.co/api/v1/account/highlander2/project/project/simulate`;

        const body:any = {
            network_id: tx.chainId || "1",
            from: tx.from,
            to: tx.to,
            input: tx.data,
            value: tx.value || 0,
            save_if_fails: true
        };

        //eip1559
        if(tx.gas){
            body.gas = tx.gas
            body.gas_price = tx.gasPrice
        }
        if(tx.maxPriorityFeePerGas){
            body.max_priority_fee_per_gas = tx.maxPriorityFeePerGas
            body.max_fee_per_gas = tx.maxFeePerGas
        }
        // gas: 21204,
        //     gas_price: "0",

        const headers = {
            headers: {
                'Content-Type': 'application/json',
                'X-Access-Key': TENDERLY_ACCESS_KEY,
            }
        };
        // console.log(tag,'apiURL: ',apiURL)
        // console.log(tag,'headers: ',headers)
        const response = await axiosInstance.post(apiURL, body, headers);

        // console.log(tag,'response: ',Object.keys(response.data))
        // console.log(tag,'response simulation: ',Object.keys(response.data.simulation))
        console.log(tag,'response simulation: ',response.data.simulation)
        // // console.log(tag,'response simulation: ',response.data.contracts)
        // console.log(tag,'response simulation status: ',response.data.simulation.status)

        // if (!response.data.simulation.status) {
        //     console.error("Simulation failed:", response.data);
        // }

        let summary:any = {
            isValid: response.data.simulation.status,
            method: response.data.simulation.method,
            gas_used: response.data.simulation.gas_used,
            nonce: response.data.simulation.nonce,
            addresses: response.data.simulation.addresses,
        }
        if(!response.data.simulation.status){
            summary.error = response.data.simulation.error_message
        }
        summary.raw = response.data.simulation

        return summary;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            console.error(TAG, "Axios error in simulateTransaction:", error.response?.data || error.message);
        } else {
            console.error(TAG, "Unknown error in simulateTransaction:", error);
        }
        throw new Error("Transaction simulation failed.");
    }
}

