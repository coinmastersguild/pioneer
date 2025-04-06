import { Currency, Token } from '@uniswap/sdk-core';
type ChainTokenList = {
    readonly [chainId: number]: Token[];
};
type ChainCurrencyList = {
    readonly [chainId: number]: Currency[];
};
/**
 * Shows up in the currency select for swap and add liquidity
 */
export declare const COMMON_BASES: ChainCurrencyList;
export declare const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList;
export declare const PINNED_PAIRS: {
    readonly [chainId: number]: [Token, Token][];
};
export {};
