import { ChainId, SupportedChainsType } from '@uniswap/sdk-core';
export declare const CHAIN_IDS_TO_NAMES: {
    readonly [ChainId.MAINNET]: "mainnet";
    readonly [ChainId.GOERLI]: "goerli";
    readonly [ChainId.SEPOLIA]: "sepolia";
    readonly [ChainId.POLYGON]: "polygon";
    readonly [ChainId.POLYGON_MUMBAI]: "polygon_mumbai";
    readonly [ChainId.CELO]: "celo";
    readonly [ChainId.CELO_ALFAJORES]: "celo_alfajores";
    readonly [ChainId.ARBITRUM_ONE]: "arbitrum";
    readonly [ChainId.ARBITRUM_GOERLI]: "arbitrum_goerli";
    readonly [ChainId.OPTIMISM]: "optimism";
    readonly [ChainId.OPTIMISM_GOERLI]: "optimism_goerli";
    readonly [ChainId.BNB]: "bnb";
    readonly [ChainId.AVALANCHE]: "avalanche";
    readonly [ChainId.BASE]: "base";
    readonly [ChainId.BLAST]: "blast";
};
export type SupportedInterfaceChain = Exclude<SupportedChainsType, ChainId.BASE_GOERLI | ChainId.ARBITRUM_SEPOLIA | ChainId.OPTIMISM_SEPOLIA | ChainId.ROOTSTOCK | ChainId.ZORA | ChainId.ZORA_SEPOLIA>;
export declare function isSupportedChain(chainId: number | null | undefined | ChainId, featureFlags?: Record<number, boolean>): chainId is SupportedInterfaceChain;
export declare function asSupportedChain(chainId: number | null | undefined | ChainId, featureFlags?: Record<number, boolean>): SupportedInterfaceChain | undefined;
export declare const SUPPORTED_GAS_ESTIMATE_CHAIN_IDS: readonly [any, any, any, any, any, any, any, any, any];
/**
 * @deprecated when v2 pools are enabled on chains supported through sdk-core
 */
export declare const SUPPORTED_V2POOL_CHAIN_IDS_DEPRECATED: readonly [any, any];
export declare const SUPPORTED_V2POOL_CHAIN_IDS: number[];
export declare const TESTNET_CHAIN_IDS: readonly [any, any, any, any, any, any];
/**
 * All the chain IDs that are running the Ethereum protocol.
 */
export declare const L1_CHAIN_IDS: readonly [any, any, any, any, any, any, any, any, any];
export type SupportedL1ChainId = (typeof L1_CHAIN_IDS)[number];
/**
 * Controls some L2 specific behavior, e.g. slippage tolerance, special UI behavior.
 * The expectation is that all of these networks have immediate transaction confirmation.
 */
export declare const L2_CHAIN_IDS: readonly [any, any, any, any, any, any];
export type SupportedL2ChainId = (typeof L2_CHAIN_IDS)[number];
/**
 * Get the priority of a chainId based on its relevance to the user.
 * @param {ChainId} chainId - The chainId to determine the priority for.
 * @returns {number} The priority of the chainId, the lower the priority, the earlier it should be displayed, with base of MAINNET=0.
 */
export declare function getChainPriority(chainId: ChainId): number;
export declare function isUniswapXSupportedChain(chainId: number): boolean;
