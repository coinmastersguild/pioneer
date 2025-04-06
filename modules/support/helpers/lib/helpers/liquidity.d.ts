import { SwapKitNumber } from '../index';
type ShareParams<T = {}> = T & {
    liquidityUnits: string;
    poolUnits: string;
};
type PoolParams<T = {}> = T & {
    runeAmount: string;
    assetAmount: string;
    runeDepth: string;
    assetDepth: string;
};
/**
 *  Ref: https://gitlab.com/thorchain/thornode/-/issues/657
 *  share = (s * A * (2 * T^2 - 2 * T * s + s^2))/T^3
 *  s = stakeUnits for member (after factoring in withdrawBasisPoints)
 *  T = totalPoolUnits for pool
 *  A = assetDepth to be withdrawn
 *
 *  Formula:
 *  share = (s * A * (2 * T^2 - 2 * T * s + s^2))/T^3
 *  (part1 * (part2 - part3 + part4)) / part5
 */
export declare const getAsymmetricRuneShare: ({ liquidityUnits, poolUnits, runeDepth, }: ShareParams<{
    runeDepth: string;
}>) => SwapKitNumber;
export declare const getAsymmetricAssetShare: ({ liquidityUnits, poolUnits, assetDepth, }: ShareParams<{
    assetDepth: string;
}>) => SwapKitNumber;
export declare const getAsymmetricRuneWithdrawAmount: ({ percent, runeDepth, liquidityUnits, poolUnits, }: ShareParams<{
    percent: number;
    runeDepth: string;
}>) => SwapKitNumber;
export declare const getAsymmetricAssetWithdrawAmount: ({ percent, assetDepth, liquidityUnits, poolUnits, }: ShareParams<{
    percent: number;
    assetDepth: string;
}>) => SwapKitNumber;
export declare const getSymmetricPoolShare: ({ liquidityUnits, poolUnits, runeDepth, assetDepth, }: ShareParams<{
    runeDepth: string;
    assetDepth: string;
}>) => {
    assetAmount: SwapKitNumber;
    runeAmount: SwapKitNumber;
};
export declare const getSymmetricWithdraw: ({ liquidityUnits, poolUnits, runeDepth, assetDepth, percent, }: ShareParams<{
    runeDepth: string;
    assetDepth: string;
    percent: number;
}>) => {
    [k: string]: SwapKitNumber;
};
export declare const getEstimatedPoolShare: ({ runeDepth, poolUnits, assetDepth, liquidityUnits, runeAmount, assetAmount, }: ShareParams<{
    runeAmount: string;
    assetAmount: string;
    runeDepth: string;
    assetDepth: string;
}>) => number;
export declare const getLiquiditySlippage: ({ runeAmount, assetAmount, runeDepth, assetDepth, }: PoolParams) => number;
export {};
