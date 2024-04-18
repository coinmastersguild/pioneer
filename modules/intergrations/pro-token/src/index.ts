/*
        Uniswap Integration
                - Highlander

    BASE
    https://docs.base.org/contracts/



 */

const TAG = " | Uniswap | "
import axios from 'axios';
import { BaseDecimal } from '@coinmasters/types';
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
import { MaxUint160, AllowanceTransfer, MaxAllowanceTransferAmount, PERMIT2_ADDRESS, PermitSingle } from '@uniswap/permit2-sdk'
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
const { ethers, BigNumber } = require('ethers');
import { utils, Wallet } from 'ethers'
import { CurrencyAmount, TradeType, Ether, Token, Percent, Currency } from '@uniswap/sdk-core'
import {
    SwapRouter,
} from "@uniswap/universal-router-sdk";
import { AlphaRouter, AlphaRouterConfig } from '@uniswap/smart-order-router'

import {
    Trade as V3Trade,
    Pool,
    Route as RouteV3,
    nearestUsableTick,
    TickMath,
    TICK_SPACINGS,
    FeeAmount,
    toHex
} from '@uniswap/v3-sdk'
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'

let networkSupport = [
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"],
]

const EIP155_MAINNET_CHAINS: any = {
    'eip155:1': {
        chainId: 1,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        name: 'Ethereum',
        logo: '/chain-logos/eip155-1.png',
        rgb: '99, 125, 234',
        universalRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        rpc: 'https://ethereum-rpc.publicnode.com',
        defaultGasLimit: 250000,
        namespace: 'eip155'
    },
    'eip155:8453': {
        chainId: 8453,
        WETH: '0x4200000000000000000000000000000000000006',
        name: 'Base',
        logo: '/chain-logos/base.png',
        rgb: '242, 242, 242',
        universalRouter: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        rpc: 'https://mainnet.base.org',
        defaultGasLimit: 135120,
        namespace: 'eip155'
    }
}

const ERC20_ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
];

module.exports = {
    init:function(settings:any){
        return true;
    },
    getRateEthPro: function () {
        return get_rate_eth();
    },
    getRateEth: function () {
        return get_rate_usdc();
    },
    getRateProUsd: function () {
        return get_rate_pro();
    }
}

const get_rate_pro = async function () {
    let tag = TAG + " | get_rate_pro | "
    try {
        // Fetch the rate of 1 PRO in terms of ETH
        let proEth = await get_rate_eth(); // Ensure this returns the number of ETH per 1 PRO
        // Fetch the rate of 1 ETH in terms of USDC
        let ethUSD = await get_rate_usdc(); // Ensure this returns the number of USDC per 1 ETH
        //console.log(`proEth: ${proEth}, ethUSD: ${ethUSD}`);
        
        // Calculate the value of 1 PRO in USDC
        let proUSD = (1 /parseFloat(proEth)) * parseFloat(ethUSD);
        //console.log(`1 PRO is approximately worth ${proUSD} USDC`);

        return proUSD.toFixed(2); // Formatting the output for consistency
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
}


const get_rate_usdc = async function () {
    let tag = TAG + " | get_rate_usdc | "
    try {
        let SELL_TOKEN = new Token(1, '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', 18, 'WETH', 'Wrapped Ether'); // WETH Address on Ethereum Mainnet
        let BUY_TOKEN = new Token(1, '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', 6, 'USDC', 'USD Coin'); // USDC Address on Ethereum Mainnet
        let chainId = 1; // Ethereum Mainnet
        let provider = new ethers.providers.JsonRpcProvider(EIP155_MAINNET_CHAINS['eip155:1'].rpc);
        const router = new AlphaRouter({ chainId, provider });
        let amount = CurrencyAmount.fromRawAmount(SELL_TOKEN, BigNumber.from("1000000000000000000")); // 1 ETH in wei
        enum Protocol {
            V2 = "V2",
            V3 = "V3",
            MIXED = "MIXED"
        }
        const swapRoute = await router.route(amount, BUY_TOKEN, TradeType.EXACT_INPUT, /*swapConfig=*/ undefined, {
            protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED],
        });
        if(!swapRoute) throw Error("Failed to get swapRoute");

        let output = swapRoute.route[0].quote.toFixed(6); // Formatting to USDC decimals
        return output;
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
}

const get_rate_eth = async function () {
    let tag = TAG + " | get_rate_eth | "
    try {

        //get pool for contract
        let BUY_TOKEN, SELL_TOKEN;
        
        BUY_TOKEN = new Token(8453, '0xef743df8eda497bcf1977393c401a636518dd630', 18, 'PRO', 'swaps.PRO')
        // SELL_TOKEN = new Token(8453, '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', 18, 'USD')
        SELL_TOKEN = new Token(8453, '0x4200000000000000000000000000000000000006', 18, 'WETH')
        let chainId = 8453
        let provider = new ethers.providers.JsonRpcProvider(EIP155_MAINNET_CHAINS['eip155:8453'].rpc)
        const router = new AlphaRouter({ chainId, provider })
        let amount = CurrencyAmount.fromRawAmount(SELL_TOKEN, BigNumber.from("1000000000000000"))
        enum Protocol {
            V2 = "V2",
            V3 = "V3",
            MIXED = "MIXED"
        }
        const swapRoute = await router.route(amount, BUY_TOKEN, TradeType.EXACT_INPUT, /*swapConfig=*/ undefined, {
            protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED],
        })
        if(!swapRoute) throw Error("Failed to get swapRoute")
        //console.log("swapRoute details:", JSON.stringify(swapRoute, null, 2));

        // @ts-ignore
        let output:any = swapRoute.route[0].quote.toFixed(18)
        output = parseFloat(output) * 1000
        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e;
    }
}
