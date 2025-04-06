"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PINNED_PAIRS = exports.BASES_TO_TRACK_LIQUIDITY_FOR = exports.COMMON_BASES = void 0;
// a list of tokens by chain
const sdk_core_1 = require("@uniswap/sdk-core");
const tokens_1 = require("./tokens");
// @ts-ignore
const WRAPPED_NATIVE_CURRENCIES_ONLY = Object.fromEntries(Object.entries(tokens_1.WRAPPED_NATIVE_CURRENCY)
    .map(([key, value]) => [key, [value]])
    .filter(Boolean));
/**
 * Shows up in the currency select for swap and add liquidity
 */
exports.COMMON_BASES = {
    [sdk_core_1.ChainId.MAINNET]: [
        (0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.MAINNET),
        tokens_1.DAI,
        tokens_1.USDC_MAINNET,
        tokens_1.USDT,
        tokens_1.WBTC,
        tokens_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.MAINNET],
    ],
    [sdk_core_1.ChainId.GOERLI]: [(0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.GOERLI), tokens_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.GOERLI]],
    [sdk_core_1.ChainId.SEPOLIA]: [(0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.SEPOLIA), tokens_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.SEPOLIA]],
    [sdk_core_1.ChainId.ARBITRUM_ONE]: [
        (0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.ARBITRUM_ONE),
        tokens_1.ARB,
        tokens_1.DAI_ARBITRUM_ONE,
        tokens_1.USDC_ARBITRUM,
        tokens_1.USDT_ARBITRUM_ONE,
        tokens_1.WBTC_ARBITRUM_ONE,
        tokens_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.ARBITRUM_ONE],
    ],
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: [
        (0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.ARBITRUM_GOERLI),
        tokens_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.ARBITRUM_GOERLI],
        tokens_1.USDC_ARBITRUM_GOERLI,
    ],
    [sdk_core_1.ChainId.OPTIMISM]: [
        (0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.OPTIMISM),
        tokens_1.OP,
        tokens_1.DAI_OPTIMISM,
        tokens_1.USDC_OPTIMISM,
        tokens_1.USDT_OPTIMISM,
        tokens_1.WBTC_OPTIMISM,
        sdk_core_1.WETH9[sdk_core_1.ChainId.OPTIMISM],
    ],
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: [(0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.OPTIMISM_GOERLI), tokens_1.USDC_OPTIMISM_GOERLI],
    [sdk_core_1.ChainId.BASE]: [(0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.BASE), tokens_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.BASE], tokens_1.USDC_BASE],
    [sdk_core_1.ChainId.BLAST]: [(0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.BLAST), tokens_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.BLAST]],
    [sdk_core_1.ChainId.POLYGON]: [
        (0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.POLYGON),
        tokens_1.WETH_POLYGON,
        tokens_1.USDC_POLYGON,
        tokens_1.DAI_POLYGON,
        tokens_1.USDT_POLYGON,
        tokens_1.WBTC_POLYGON,
    ],
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: [
        (0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.POLYGON_MUMBAI),
        tokens_1.WRAPPED_NATIVE_CURRENCY[sdk_core_1.ChainId.POLYGON_MUMBAI],
        tokens_1.USDC_POLYGON_MUMBAI,
        tokens_1.WETH_POLYGON_MUMBAI,
    ],
    [sdk_core_1.ChainId.CELO]: [(0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.CELO), tokens_1.CEUR_CELO, tokens_1.CUSD_CELO, tokens_1.PORTAL_ETH_CELO, tokens_1.USDC_CELO, tokens_1.WBTC_CELO],
    [sdk_core_1.ChainId.CELO_ALFAJORES]: [(0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.CELO_ALFAJORES), tokens_1.CUSD_CELO_ALFAJORES, tokens_1.CEUR_CELO_ALFAJORES],
    [sdk_core_1.ChainId.BNB]: [(0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.BNB), tokens_1.DAI_BSC, tokens_1.USDC_BSC, tokens_1.USDT_BSC, tokens_1.ETH_BSC, tokens_1.BTC_BSC, tokens_1.BUSD_BSC],
    [sdk_core_1.ChainId.AVALANCHE]: [
        (0, tokens_1.nativeOnChain)(sdk_core_1.ChainId.AVALANCHE),
        tokens_1.DAI_AVALANCHE,
        tokens_1.USDC_AVALANCHE,
        tokens_1.USDT_AVALANCHE,
        tokens_1.WETH_AVALANCHE,
    ],
};
// used to construct the list of all pairs we consider by default in the frontend
exports.BASES_TO_TRACK_LIQUIDITY_FOR = {
    ...WRAPPED_NATIVE_CURRENCIES_ONLY,
    [sdk_core_1.ChainId.MAINNET]: [...WRAPPED_NATIVE_CURRENCIES_ONLY[sdk_core_1.ChainId.MAINNET], tokens_1.DAI, tokens_1.USDC_MAINNET, tokens_1.USDT, tokens_1.WBTC],
    [sdk_core_1.ChainId.BNB]: [
        ...WRAPPED_NATIVE_CURRENCIES_ONLY[sdk_core_1.ChainId.BNB],
        tokens_1.DAI_BSC,
        tokens_1.USDC_BSC,
        tokens_1.USDT_BSC,
        tokens_1.BTC_BSC,
        tokens_1.BUSD_BSC,
        tokens_1.ETH_BSC,
    ],
    [sdk_core_1.ChainId.AVALANCHE]: [
        ...WRAPPED_NATIVE_CURRENCIES_ONLY[sdk_core_1.ChainId.AVALANCHE],
        tokens_1.DAI_AVALANCHE,
        tokens_1.USDC_AVALANCHE,
        tokens_1.USDT_AVALANCHE,
        tokens_1.WETH_AVALANCHE,
    ],
};
exports.PINNED_PAIRS = {
    [sdk_core_1.ChainId.MAINNET]: [
        [
            new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
            new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin'),
        ],
        [tokens_1.USDC_MAINNET, tokens_1.USDT],
        [tokens_1.DAI, tokens_1.USDT],
    ],
};
