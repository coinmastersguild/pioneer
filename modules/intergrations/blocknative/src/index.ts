/*
    https://docs.blocknative.com/webhook-api

 */



const TAG = " | blocknative | "
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
import fetchUrl, { FETCH_OPT } from 'micro-ftch'

let URL_BLOCKNATIVE = "https://api.blocknative.com"
let BLOCKNATIVE_API_KEY = process.env['BLOCKNATIVE_API_KEY']
let BLOCKNATIVE_API_SECRET = process.env['BLOCKNATIVE_API_SECRET']

module.exports = {
    init:function(settings:any){
        if(settings?.apiKey){
            BLOCKNATIVE_API_KEY = settings.apiKey
        }
        if(!BLOCKNATIVE_API_KEY) throw Error("api key required! set env BLOCKNATIVE_API_KEY")
    },
    submitAddress: function (coin:string,address:string) {
        return submit_address(coin,address);
    },
    pushExample: function (url:string,coin:string,address:string,type:string) {
        return push_sample_tx(url,coin,address,type);
    },
    simulateTx: function (network:string,transaction:any) {
        return simulate_tx(network,transaction);
    }
}

const simulate_tx = async function (network:string,transaction:any) {
    let tag = TAG + " | simulate_tx | "
    try {
        const apiURL = `https://api.blocknative.com/simulate`
        const fetchOptions = {
            method: 'POST',
            type: 'json',
            full: true,
            expectStatusCode: false,
            headers: {
                'Content-Type': 'application/json',
                'credentials': BLOCKNATIVE_API_KEY+":"+BLOCKNATIVE_API_SECRET
            },
            data: {
                system: "ethereum",
                network: "main",
                transaction: {
                    to: transaction.to,
                    from: transaction.from,
                    gas: Number(600000),
                    gasPrice: 0,
                    input: transaction.input,
                    value: 0
                }
            }
        }

        console.time('Simulate-shutdown')

        // Fetch simulation via Blocknative RESTful endpoint
        // @ts-ignore
        const response = await fetchUrl(apiURL, fetchOptions)

        if (response.status !== 200) {
            console.log(`Simulation error code: ${response.status} - ${JSON.stringify(response.body)}`)
            process.exit(1)
        }

        console.timeEnd('Simulate-shutdown')

        return response.body
    } catch (e) {
        // console.error(tag, "e: ", e.response)
        console.log(`Error response data parsed: ${JSON.stringify(e.response.data.msg)}`);
        // console.error(tag, "e: ", e.toJSON())
        return e.response.data
    }
}

// const simulate_tx = async function (network:string,transaction:any) {
//     let tag = TAG + " | simulate_tx | "
//     try {
//         const apiURL = `https://api.blocknative.com/simulate`
//         const body = {
//             "system":"ethereum",
//             "network":"main",
//             "transactions":[transaction]
//         }
//
//         const headers = {
//             headers: {
//                 'credentials': BLOCKNATIVE_API_KEY+":"+BLOCKNATIVE_API_SECRET,
//                 'Content-Type': 'application/json'
//             }
//         }
//         const resp = await axios.post(apiURL, JSON.stringify(body), headers);
//
//         return resp.data
//     } catch (e) {
//         // console.error(tag, "e: ", e.response)
//         console.log(`Error response data parsed: ${JSON.stringify(e.response.data.msg)}`);
//         // console.error(tag, "e: ", e.toJSON())
//         return e.response.data
//     }
// }

const push_sample_tx = async function (url:string,coin:string,address:string,type:string) {
    let tag = TAG + " | push_sample_tx | "
    try {
        let output:any = {}
        //
        if(!type || type === 'transfer'){
            //TODO send?
            //receive
            output = {
                test:true,
                status: 'pending',
                system: 'ethereum',
                network: 'main',
                monitorId: 'GETH_1_D_PROD',
                monitorVersion: '0.79.12',
                serverVersion: '0.93.3',
                timeStamp: '2021-02-28T03:45:07.841Z',
                pendingTimeStamp: '2021-02-28T03:45:07.844Z',
                pendingBlockNumber: 11943498,
                hash:
                '0x60348d3718d3da2a43cdf3c9aa898559176eca38cdd6853d18a6ba43e84a448c',
                    from: '0xC3aFFff54122658b89C31183CeC4F15514F34624',
                to: address,
                value: '719864665442897',
                gas: 21000,
                gasPrice: '99000000000',
                nonce: 28,
                blockHash: null,
                blockNumber: null,
                input: '0x',
                asset: 'ETH',
                watchedAddress: address,
                direction: 'incoming',
                counterparty: '0xC3aFFff54122658b89C31183CeC4F15514F34624',
                apiKey: 'apikeyNERF' }

        }else if(type === 'erc20'){
            //TODO send?
            //receive
            output = {
                test:true,
                status: 'pending',
                system: 'ethereum',
                network: 'main',
                monitorId: 'GETH_1_D_PROD',
                monitorVersion: '0.79.12',
                serverVersion: '0.93.3',
                timeStamp: '2021-02-28T03:45:45.422Z',
                pendingTimeStamp: '2021-02-28T03:45:45.554Z',
                pendingBlockNumber: 11943500,
                hash:
                    '0x4f7259e33f3b0c6b95421d6e4cad4e8d155d8757551ae42b47db9e390d6c117e',
                from: '0xC3aFFff54122658b89C31183CeC4F15514F34624',
                to: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                value: '0',
                gas: 55509,
                gasPrice: '104000000000',
                nonce: 29,
                blockHash: null,
                blockNumber: null,
                input:
                    '0xa9059cbb00000000000000000000000033b35c665496ba8e71b22373843376740401f1060000000000000000000000000000000000000000000000000f43fc2c04ee0000',
                contractCall:
                    { contractType: 'erc20',
                        contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
                        methodName: 'transfer',
                        params:
                            { _to: address,
                                _value: '1100000000000000000' },
                        contractDecimals: 18,
                        contractName: 'Dai Stablecoin',
                        decimalValue: '1.1' },
                asset: 'DAI',
                watchedAddress: address,
                direction: 'incoming',
                counterparty: '0xC3aFFff54122658b89C31183CeC4F15514F34624',
                apiKey: 'apiKeyNerf' }
        }
        //TODO NFT's

        return output
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}

const submit_address = async function (coin:string,address:string) {
    let tag = TAG + " | submit_address | "
    try {
        let blockchain
        if(coin === 'ETH'){
            blockchain = 'ethereum'
        } else {
            throw Error("Other assets not supported! "+coin)
        }
        let data = {
            apiKey:BLOCKNATIVE_API_KEY,
            address,
            blockchain:blockchain,
            networks:["main"],
        }

        let body = {
            url: URL_BLOCKNATIVE+"/address",
            method: 'POST',
            data,
        }
        let resp = await axios(body)

        return resp.data
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}
