import { ChainId } from '@uniswap/sdk-core';
import { SupportedL1ChainId, SupportedL2ChainId } from './chains';
export declare const AVERAGE_L1_BLOCK_TIME: any;
export declare const DEFAULT_MS_BEFORE_WARNING: any;
/**
 *
 * @param chainId
 * @returns The approximate whole number of blocks written to the corresponding chainId per Ethereum mainnet epoch.
 */
export declare function getBlocksPerMainnetEpochForChainId(chainId: number | undefined): number;
export declare enum NetworkType {
    L1 = 0,
    L2 = 1
}
interface BaseChainInfo {
    readonly networkType: NetworkType;
    readonly blockWaitMsBeforeWarning?: number;
    readonly docs: string;
    readonly bridge?: string;
    readonly explorer: string;
    readonly infoLink: string;
    readonly label: string;
    readonly helpCenterUrl?: string;
    readonly nativeCurrency: {
        name: string;
        symbol: string;
        decimals: number;
    };
    readonly color?: string;
    readonly backgroundColor?: string;
}
interface L1ChainInfo extends BaseChainInfo {
    readonly networkType: NetworkType.L1;
    readonly defaultListUrl?: string;
}
export interface L2ChainInfo extends BaseChainInfo {
    readonly networkType: NetworkType.L2;
    readonly bridge: string;
    readonly statusPage?: string;
    readonly defaultListUrl: string;
}
export declare function getChainInfo(chainId: SupportedL1ChainId, featureFlags?: Record<ChainId | SupportedL1ChainId | SupportedL2ChainId | number, boolean>): L1ChainInfo;
export declare function getChainInfo(chainId: SupportedL2ChainId, featureFlags?: Record<ChainId | SupportedL1ChainId | SupportedL2ChainId | number, boolean>): L2ChainInfo;
export declare function getChainInfo(chainId: ChainId, featureFlags?: Record<ChainId | SupportedL1ChainId | SupportedL2ChainId | number, boolean>): L1ChainInfo | L2ChainInfo;
export declare function getChainInfo(chainId: ChainId | SupportedL1ChainId | SupportedL2ChainId | number | undefined, featureFlags?: Record<ChainId | SupportedL1ChainId | SupportedL2ChainId | number, boolean>): L1ChainInfo | L2ChainInfo | undefined;
export declare function getChainInfoOrDefault(chainId: number | undefined, featureFlags?: Record<number, boolean>): L1ChainInfo | L2ChainInfo;
export {};
