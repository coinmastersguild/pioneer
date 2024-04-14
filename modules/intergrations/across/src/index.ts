/*
        Uniswap Integration
                - Highlander

    BASE
    https://docs.base.org/contracts/



 */

const TAG = " | Uniswap | "
import { BaseDecimal } from '@coinmasters/types';
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
import {
    ERC20__factory,
    HubPool__factory,
    SpokePool,
    SpokePool__factory,
} from "@across-protocol/contracts-v2/dist/typechain";

import { ethers } from "ethers";
import { utils, pool } from "@across-protocol/sdk-v2";
import * as sdk from "@across-protocol/sdk-v2";

const EIP155_MAINNET_CHAINS: any = {
    'eip155:1': {
        chainId: 1,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        name: 'Ethereum',
        logo: '/chain-logos/eip155-1.png',
        rgb: '99, 125, 234',
        rpc: 'https://eth.llamarpc.com',
        defaultGasLimit: 250000,
        namespace: 'eip155'
    },
    // 'eip155:43114': {
    //     chainId: 43114,
    //     name: 'Avalanche C-Chain',
    //     logo: '/chain-logos/eip155-43113.png',
    //     rgb: '232, 65, 66',
    //     rpc: 'https://api.avax.network/ext/bc/C/rpc',
    //     namespace: 'eip155'
    // },
    // 'eip155:137': {
    //     chainId: 137,
    //     name: 'Polygon',
    //     logo: '/chain-logos/eip155-137.png',
    //     rgb: '130, 71, 229',
    //     rpc: 'https://polygon-rpc.com/',
    //     namespace: 'eip155'
    // },
    // 'eip155:10': {
    //     chainId: 10,
    //     name: 'Optimism',
    //     logo: '/chain-logos/eip155-10.png',
    //     rgb: '235, 0, 25',
    //     rpc: 'https://mainnet.optimism.io',
    //     namespace: 'eip155'
    // },
    // 'eip155:324': {
    //     chainId: 324,
    //     name: 'zkSync Era',
    //     logo: '/chain-logos/eip155-324.svg',
    //     rgb: '242, 242, 242',
    //     rpc: 'https://mainnet.era.zksync.io/',
    //     namespace: 'eip155'
    // },
    'eip155:8453': {
        chainId: 8453,
        WETH: '0x4200000000000000000000000000000000000006',
        name: 'Base',
        logo: '/chain-logos/base.png',
        rgb: '242, 242, 242',
        rpc: 'https://mainnet.base.org',
        defaultGasLimit: 135120,
        namespace: 'eip155'
    }
}

let networkSupport = [
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"],
]

module.exports = {
    init:function(settings:any){
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    getQuote: function (quote:any) {
        return get_quote(quote);
    },
}

const buildTx = async function(txData:any, from:string, chainId:string, provider:any){
    let tag = TAG + " | buildTx | "
    try{
        //buildTx
        log.info(tag,"txData: ",txData)
        
        // let { callData: data, value} = responseRouter
        let data = txData.data
        let value = "0x0"
        //get fee's
        const nonce = await provider.getTransactionCount(from, "latest");

        let gas = `0x${BigInt("135120").toString(16)}`
        try{
            const estimatedGas = await provider.estimateGas({
                from: from,
                to: EIP155_MAINNET_CHAINS['eip155:'+chainId].universalRouter, // Uniswap Router address
                data: data,
                value: ethers.utils.parseEther("0"), // Value for token swaps
            });
            console.log("estimatedGas: ", estimatedGas);
            gas = `0x${estimatedGas.toString(16)}`;
        }catch(e){
            console.error("Error in estimateGas: ", e);
            //@TODO get custom gas limit defaults per chain
            gas = `0x${BigInt("335120").toString(16)}`;
        }


        // Get current gas price from the network
        const gasPrice = await provider.getGasPrice();

        // Optional: Adjust gas price based on your strategy (e.g., increase for faster confirmation)
        const adjustedGasPrice = gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100)); // Example: Increase by 10%

        /*
            Nonce

            Fee's
            @TODO make sure +1 if creationg multiple tx's
         */
        const tx = {
            from,
            to: txData.to,
            chainId,
            data,
            value,
            gas,
            gasPrice,
            nonce,
        }
        return tx
    }catch(e){
        console.error(e)
    }
}
const get_token = async function (caip:any) {
    let tag = TAG + " | get_token | "
    try {
        //if native get WETH token?

    } catch(e){
        console.error()
    }
}
const get_quote = async function (quote:any) {
    let tag = TAG + " | get_quote | "
    try {
        let output:any = {}
        if(!quote.sellAsset) throw new Error("missing sellAsset")
        if(!quote.buyAsset) throw new Error("missing buyAsset")
        if(!quote.sellAmount) throw new Error("missing sellAmount")
        if(!quote.senderAddress) throw new Error("missing senderAddress")
        if(!quote.recipientAddress) throw new Error("missing recipientAddress")
        if(!quote.slippage) throw new Error("missing slippage")
        output.txs = []
        log.info(tag,"quote.sellAsset: ",quote.sellAsset)
        let originChainId = caipToNetworkId(quote.sellAsset).replace('eip155:', '');
        log.info(tag, "originChainId: ", originChainId);
        let destinationChainId = caipToNetworkId(quote.buyAsset).replace('eip155:', '');
        log.info(tag, "destinationChainId: ", destinationChainId);
        
        let pools = await sdk.utils.getDeployedAddress("SpokePool", originChainId);
        log.info(tag,"pools: ",pools)

        let providerUrl = EIP155_MAINNET_CHAINS[caipToNetworkId(quote.sellAsset)].rpc
        const provider = new ethers.providers.JsonRpcProvider(providerUrl); // Set your Ethereum RPC URL
        
        const spokePoolCode = await provider.getCode(pools);
        log.info(tag,"spokePoolCode: ",spokePoolCode)
        if (!spokePoolCode || spokePoolCode === "0x") {
            throw new Error(`SpokePool not deployed at ${pools}`);
        }

        const getSpokePool = (_chainId: number, address: string, provider: any): any => {
            return SpokePool__factory.connect(address, provider);
        };

        let spokePool = await getSpokePool(originChainId, pools, provider);
        log.info(tag,"spokePool: ",spokePool)
        
        let recipient = quote.recipientAddress
        let token = EIP155_MAINNET_CHAINS[caipToNetworkId(quote.sellAsset)].WETH
        let amount = ethers.BigNumber.from(quote.sellAmount)
        let relayerFeePct = 0
        let quoteTimestamp = 0
        let message = "0x"
        let maxCount = ethers.constants.MaxUint256.toString()
        let value = 0
        log.info(tag,"inputs: ",{recipient, token, amount, destinationChainId, relayerFeePct, quoteTimestamp, message, maxCount, value})

        const txData = await spokePool.populateTransaction.deposit(
            recipient,
            token,
            amount,
            destinationChainId,
            relayerFeePct,
            quoteTimestamp,
            message,
            maxCount,
            { value }
        );
        log.info(tag,"tx: ",txData)
        
        let tx = await buildTx(txData, quote.senderAddress, originChainId, provider)
        
        output.meta = {
            quoteMode: "ERC20-ERC20"
        }
        output.steps = 1
        output.complete = true
        output.type = 'EVM'
        output.id = uuid()
        output.txs.push({
            type:"evm",
            description:'swap tokens',
            chain:caipToNetworkId(quote.sellAsset),
            txParams:tx
        })
        
        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e;
    }
}
