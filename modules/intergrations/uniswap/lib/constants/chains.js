"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.L2_CHAIN_IDS = exports.L1_CHAIN_IDS = exports.TESTNET_CHAIN_IDS = exports.SUPPORTED_V2POOL_CHAIN_IDS = exports.SUPPORTED_V2POOL_CHAIN_IDS_DEPRECATED = exports.SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = exports.CHAIN_IDS_TO_NAMES = void 0;
exports.isSupportedChain = isSupportedChain;
exports.asSupportedChain = asSupportedChain;
exports.getChainPriority = getChainPriority;
exports.isUniswapXSupportedChain = isUniswapXSupportedChain;
const sdk_core_1 = require("@uniswap/sdk-core");
exports.CHAIN_IDS_TO_NAMES = {
    [sdk_core_1.ChainId.MAINNET]: 'mainnet',
    [sdk_core_1.ChainId.GOERLI]: 'goerli',
    [sdk_core_1.ChainId.SEPOLIA]: 'sepolia',
    [sdk_core_1.ChainId.POLYGON]: 'polygon',
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: 'polygon_mumbai',
    [sdk_core_1.ChainId.CELO]: 'celo',
    [sdk_core_1.ChainId.CELO_ALFAJORES]: 'celo_alfajores',
    [sdk_core_1.ChainId.ARBITRUM_ONE]: 'arbitrum',
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: 'arbitrum_goerli',
    [sdk_core_1.ChainId.OPTIMISM]: 'optimism',
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: 'optimism_goerli',
    [sdk_core_1.ChainId.BNB]: 'bnb',
    [sdk_core_1.ChainId.AVALANCHE]: 'avalanche',
    [sdk_core_1.ChainId.BASE]: 'base',
    [sdk_core_1.ChainId.BLAST]: 'blast',
};
// Include ChainIds in this array if they are not supported by the UX yet, but are already in the SDK.
const NOT_YET_UX_SUPPORTED_CHAIN_IDS = [
    sdk_core_1.ChainId.BASE_GOERLI,
    sdk_core_1.ChainId.ARBITRUM_SEPOLIA,
    sdk_core_1.ChainId.OPTIMISM_SEPOLIA,
    sdk_core_1.ChainId.ROOTSTOCK,
    sdk_core_1.ChainId.ZORA,
    sdk_core_1.ChainId.ZORA_SEPOLIA,
];
function isSupportedChain(chainId, featureFlags) {
    if (featureFlags && chainId && chainId in featureFlags) {
        return featureFlags[chainId];
    }
    return !!chainId && sdk_core_1.SUPPORTED_CHAINS.indexOf(chainId) !== -1 && NOT_YET_UX_SUPPORTED_CHAIN_IDS.indexOf(chainId) === -1;
}
function asSupportedChain(chainId, featureFlags) {
    if (!chainId)
        return undefined;
    if (featureFlags && chainId in featureFlags && !featureFlags[chainId]) {
        return undefined;
    }
    return isSupportedChain(chainId) ? chainId : undefined;
}
exports.SUPPORTED_GAS_ESTIMATE_CHAIN_IDS = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.POLYGON,
    sdk_core_1.ChainId.CELO,
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.BNB,
    sdk_core_1.ChainId.AVALANCHE,
    sdk_core_1.ChainId.BASE,
    sdk_core_1.ChainId.BLAST,
];
/**
 * @deprecated when v2 pools are enabled on chains supported through sdk-core
 */
exports.SUPPORTED_V2POOL_CHAIN_IDS_DEPRECATED = [sdk_core_1.ChainId.MAINNET, sdk_core_1.ChainId.GOERLI];
exports.SUPPORTED_V2POOL_CHAIN_IDS = Object.keys(sdk_core_1.V2_ROUTER_ADDRESSES).map((chainId) => parseInt(chainId));
exports.TESTNET_CHAIN_IDS = [
    sdk_core_1.ChainId.GOERLI,
    sdk_core_1.ChainId.SEPOLIA,
    sdk_core_1.ChainId.POLYGON_MUMBAI,
    sdk_core_1.ChainId.ARBITRUM_GOERLI,
    sdk_core_1.ChainId.OPTIMISM_GOERLI,
    sdk_core_1.ChainId.CELO_ALFAJORES,
];
/**
 * All the chain IDs that are running the Ethereum protocol.
 */
exports.L1_CHAIN_IDS = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.GOERLI,
    sdk_core_1.ChainId.SEPOLIA,
    sdk_core_1.ChainId.POLYGON,
    sdk_core_1.ChainId.POLYGON_MUMBAI,
    sdk_core_1.ChainId.CELO,
    sdk_core_1.ChainId.CELO_ALFAJORES,
    sdk_core_1.ChainId.BNB,
    sdk_core_1.ChainId.AVALANCHE,
];
/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
exports.L2_CHAIN_IDS = [
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.ARBITRUM_GOERLI,
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.OPTIMISM_GOERLI,
    sdk_core_1.ChainId.BASE,
    sdk_core_1.ChainId.BLAST,
];
/**
 * Get the priority of a chainId based on its relevance to the user.
 * @param {ChainId} chainId - The chainId to determine the priority for.
 * @returns {number} The priority of the chainId, the lower the priority, the earlier it should be displayed, with base of MAINNET=0.
 */
function getChainPriority(chainId) {
    switch (chainId) {
        case sdk_core_1.ChainId.MAINNET:
        case sdk_core_1.ChainId.GOERLI:
        case sdk_core_1.ChainId.SEPOLIA:
            return 0;
        case sdk_core_1.ChainId.ARBITRUM_ONE:
        case sdk_core_1.ChainId.ARBITRUM_GOERLI:
            return 1;
        case sdk_core_1.ChainId.OPTIMISM:
        case sdk_core_1.ChainId.OPTIMISM_GOERLI:
            return 2;
        case sdk_core_1.ChainId.POLYGON:
        case sdk_core_1.ChainId.POLYGON_MUMBAI:
            return 3;
        case sdk_core_1.ChainId.BASE:
            return 4;
        case sdk_core_1.ChainId.BNB:
            return 5;
        case sdk_core_1.ChainId.AVALANCHE:
            return 6;
        case sdk_core_1.ChainId.CELO:
        case sdk_core_1.ChainId.CELO_ALFAJORES:
            return 7;
        case sdk_core_1.ChainId.BLAST:
            return 8;
        default:
            return Infinity;
    }
}
function isUniswapXSupportedChain(chainId) {
    return chainId === sdk_core_1.ChainId.MAINNET;
}
