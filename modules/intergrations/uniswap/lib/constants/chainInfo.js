"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkType = exports.DEFAULT_MS_BEFORE_WARNING = exports.AVERAGE_L1_BLOCK_TIME = void 0;
exports.getBlocksPerMainnetEpochForChainId = getBlocksPerMainnetEpochForChainId;
exports.getChainInfo = getChainInfo;
exports.getChainInfoOrDefault = getChainInfoOrDefault;
const sdk_core_1 = require("@uniswap/sdk-core");
// @ts-ignore
const ms_1 = __importDefault(require("ms"));
const lists_1 = require("./lists");
exports.AVERAGE_L1_BLOCK_TIME = (0, ms_1.default)(`12s`);
exports.DEFAULT_MS_BEFORE_WARNING = (0, ms_1.default)(`10m`);
/**
 *
 * @param chainId
 * @returns The approximate whole number of blocks written to the corresponding chainId per Ethereum mainnet epoch.
 */
function getBlocksPerMainnetEpochForChainId(chainId) {
    // Average block times were pulled from https://dune.com/jacobdcastro/avg-block-times on 2024-03-14,
    // and corroborated with that chain's documentation/explorer.
    // Blocks per mainnet epoch is computed as `Math.floor(12s / AVG_BLOCK_TIME)` and hard-coded.
    switch (chainId) {
        case sdk_core_1.ChainId.ARBITRUM_ONE:
            return 46;
        case sdk_core_1.ChainId.OPTIMISM:
            return 6;
        case sdk_core_1.ChainId.POLYGON:
            return 5;
        case sdk_core_1.ChainId.BASE:
            return 6;
        case sdk_core_1.ChainId.BNB:
            return 4;
        case sdk_core_1.ChainId.AVALANCHE:
            return 6;
        case sdk_core_1.ChainId.CELO:
            return 2;
        default:
            return 1;
    }
}
var NetworkType;
(function (NetworkType) {
    NetworkType[NetworkType["L1"] = 0] = "L1";
    NetworkType[NetworkType["L2"] = 1] = "L2";
})(NetworkType || (exports.NetworkType = NetworkType = {}));
const CHAIN_INFO = {
    [sdk_core_1.ChainId.MAINNET]: {
        networkType: NetworkType.L1,
        docs: 'https://docs.uniswap.org/',
        explorer: 'https://etherscan.io/',
        infoLink: 'https://info.uniswap.org/#/',
        label: 'Ethereum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        color: '#fcfc03',
    },
    [sdk_core_1.ChainId.GOERLI]: {
        networkType: NetworkType.L1,
        docs: 'https://docs.uniswap.org/',
        explorer: 'https://goerli.etherscan.io/',
        infoLink: 'https://info.uniswap.org/#/',
        label: 'Görli',
        nativeCurrency: { name: 'Görli Ether', symbol: 'görETH', decimals: 18 },
        color: '#fcfc03',
    },
    [sdk_core_1.ChainId.SEPOLIA]: {
        networkType: NetworkType.L1,
        docs: 'https://docs.uniswap.org/',
        explorer: 'https://sepolia.etherscan.io/',
        infoLink: 'https://info.uniswap.org/#/',
        label: 'Sepolia',
        nativeCurrency: { name: 'Sepolia Ether', symbol: 'SepoliaETH', decimals: 18 },
        color: '#fcfc03',
    },
    [sdk_core_1.ChainId.OPTIMISM]: {
        networkType: NetworkType.L2,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`25m`),
        bridge: 'https://app.optimism.io/bridge',
        defaultListUrl: lists_1.OPTIMISM_LIST,
        docs: 'https://optimism.io/',
        explorer: 'https://optimistic.etherscan.io/',
        infoLink: 'https://info.uniswap.org/#/optimism/',
        label: 'Optimism',
        statusPage: 'https://optimism.io/status',
        helpCenterUrl: 'https://help.uniswap.org/en/collections/3137778-uniswap-on-optimistic-ethereum-oξ',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        color: '#fcfc03',
        backgroundColor: '#fcfc03',
    },
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: {
        networkType: NetworkType.L2,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`25m`),
        bridge: 'https://app.optimism.io/bridge',
        defaultListUrl: lists_1.OPTIMISM_LIST,
        docs: 'https://optimism.io/',
        explorer: 'https://goerli-optimism.etherscan.io/',
        infoLink: 'https://info.uniswap.org/#/optimism/',
        label: 'Optimism Görli',
        statusPage: 'https://optimism.io/status',
        helpCenterUrl: 'https://help.uniswap.org/en/collections/3137778-uniswap-on-optimistic-ethereum-oξ',
        nativeCurrency: { name: 'Optimism Goerli Ether', symbol: 'görOpETH', decimals: 18 },
        color: '#fcfc03',
    },
    [sdk_core_1.ChainId.ARBITRUM_ONE]: {
        networkType: NetworkType.L2,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`10m`),
        bridge: 'https://bridge.arbitrum.io/',
        docs: 'https://offchainlabs.com/',
        explorer: 'https://arbiscan.io/',
        infoLink: 'https://info.uniswap.org/#/arbitrum',
        label: 'Arbitrum',
        defaultListUrl: lists_1.ARBITRUM_LIST,
        helpCenterUrl: 'https://help.uniswap.org/en/collections/3137787-uniswap-on-arbitrum',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        color: '#fcfc03',
        backgroundColor: '#fcfc03',
    },
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: {
        networkType: NetworkType.L2,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`10m`),
        bridge: 'https://bridge.arbitrum.io/',
        docs: 'https://offchainlabs.com/',
        explorer: 'https://goerli.arbiscan.io/',
        infoLink: 'https://info.uniswap.org/#/arbitrum/',
        label: 'Arbitrum Goerli',
        defaultListUrl: lists_1.ARBITRUM_LIST, // TODO: use arbitrum goerli token list
        helpCenterUrl: 'https://help.uniswap.org/en/collections/3137787-uniswap-on-arbitrum',
        nativeCurrency: { name: 'Goerli Arbitrum Ether', symbol: 'goerliArbETH', decimals: 18 },
        color: '#fcfc03',
    },
    [sdk_core_1.ChainId.POLYGON]: {
        networkType: NetworkType.L1,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`10m`),
        bridge: 'https://wallet.polygon.technology/polygon/bridge',
        docs: 'https://polygon.io/',
        explorer: 'https://polygonscan.com/',
        infoLink: 'https://info.uniswap.org/#/polygon/',
        label: 'Polygon',
        nativeCurrency: { name: 'Polygon Matic', symbol: 'MATIC', decimals: 18 },
        color: '#fcfc03',
        backgroundColor: '#fcfc03',
    },
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: {
        networkType: NetworkType.L1,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`10m`),
        bridge: 'https://wallet.polygon.technology/polygon/bridge/deposit',
        docs: 'https://polygon.io/',
        explorer: 'https://mumbai.polygonscan.com/',
        infoLink: 'https://info.uniswap.org/#/polygon/',
        label: 'Polygon Mumbai',
        nativeCurrency: { name: 'Polygon Mumbai Matic', symbol: 'mMATIC', decimals: 18 },
    },
    [sdk_core_1.ChainId.CELO]: {
        networkType: NetworkType.L1,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`10m`),
        bridge: 'https://www.portalbridge.com/#/transfer',
        docs: 'https://docs.celo.org/',
        explorer: 'https://celoscan.io/',
        infoLink: 'https://info.uniswap.org/#/celo/',
        label: 'Celo',
        nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
        defaultListUrl: lists_1.CELO_LIST,
    },
    [sdk_core_1.ChainId.CELO_ALFAJORES]: {
        networkType: NetworkType.L1,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`10m`),
        bridge: 'https://www.portalbridge.com/#/transfer',
        docs: 'https://docs.celo.org/',
        explorer: 'https://alfajores-blockscout.celo-testnet.org/',
        infoLink: 'https://info.uniswap.org/#/celo/',
        label: 'Celo Alfajores',
        nativeCurrency: { name: 'Celo', symbol: 'CELO', decimals: 18 },
        defaultListUrl: lists_1.CELO_LIST,
    },
    [sdk_core_1.ChainId.BNB]: {
        networkType: NetworkType.L1,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`10m`),
        bridge: 'https://cbridge.celer.network/1/56',
        docs: 'https://docs.bnbchain.org/',
        explorer: 'https://bscscan.com/',
        infoLink: 'https://info.uniswap.org/#/bnb/',
        label: 'BNB Chain',
        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
        defaultListUrl: lists_1.PLASMA_BNB_LIST,
        color: '#fcfc03',
        backgroundColor: '#fcfc03',
    },
    [sdk_core_1.ChainId.AVALANCHE]: {
        networkType: NetworkType.L1,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`10m`),
        bridge: 'https://core.app/bridge/',
        docs: 'https://docs.avax.network/',
        explorer: 'https://snowtrace.io/',
        infoLink: 'https://info.uniswap.org/#/avax/', // TODO(WEB-2336): Add avax support to info site
        label: 'Avalanche',
        nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
        defaultListUrl: lists_1.AVALANCHE_LIST,
        color: '#fcfc03',
        backgroundColor: '#fcfc03',
    },
    [sdk_core_1.ChainId.BASE]: {
        networkType: NetworkType.L2,
        blockWaitMsBeforeWarning: (0, ms_1.default)(`25m`),
        bridge: 'https://bridge.base.org/deposit',
        defaultListUrl: lists_1.BASE_LIST,
        docs: 'https://docs.base.org',
        explorer: 'https://basescan.org/',
        infoLink: 'https://info.uniswap.org/#/base/',
        label: 'Base',
        statusPage: 'https://status.base.org/',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        color: '#fcfc03',
    },
    [sdk_core_1.ChainId.BLAST]: {
        networkType: NetworkType.L2,
        bridge: 'https://blast.io/bridge',
        defaultListUrl: '',
        docs: 'https://docs.blast.io',
        explorer: 'https://blastscan.io/',
        infoLink: 'https://info.uniswap.org/#/blast/',
        label: 'Blast',
        nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
        color: '#fcfc03', //'#fcfc03'
    },
};
/**
 * Overloaded method for returning ChainInfo given a chainID
 * Return type varies depending on input type:
 * number | undefined -> returns chaininfo | undefined
 * ChainId -> returns L1ChainInfo | L2ChainInfo
 * SupportedL1ChainId -> returns L1ChainInfo
 * SupportedL2ChainId -> returns L2ChainInfo
 */
function getChainInfo(chainId, featureFlags) {
    if (featureFlags && chainId in featureFlags) {
        return featureFlags[chainId] ? CHAIN_INFO[chainId] : undefined;
    }
    if (chainId) {
        return CHAIN_INFO[chainId] ?? undefined;
    }
    return undefined;
}
const MAINNET_INFO = CHAIN_INFO[sdk_core_1.ChainId.MAINNET];
function getChainInfoOrDefault(chainId, featureFlags) {
    return getChainInfo(chainId, featureFlags) ?? MAINNET_INFO;
}
