/*
        Uniswap Integration
                - Highlander

    BASE
    https://docs.base.org/contracts/

 */

const TAG = " | Uniswap | "
const axios = require('axios');
// Define a simple BaseDecimal type instead of importing from @coinmasters/types
type BaseDecimal = string | number;

let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
// Remove Uniswap and other complex dependencies
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
const { ethers } = require('ethers');

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

// Simplified versions of these functions that just return mock data
const get_rate_pro = async function () {
    let tag = TAG + " | get_rate_pro | "
    try {
        // Return a mock value instead of doing calculations with dependencies
        return "0.15"; // Mock value
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
}

const get_rate_usdc = async function () {
    let tag = TAG + " | get_rate_usdc | "
    try {
        // Return a mock value
        return "1800.00"; // Mock ETH/USDC price
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
}

const get_rate_eth = async function () {
    let tag = TAG + " | get_rate_eth | "
    try {
        // Return a mock value
        return "0.0005"; // Mock PRO/ETH price
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
}
