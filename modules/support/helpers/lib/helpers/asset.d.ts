import { Chain, FeeOption } from '@coinmasters/types';
export type CommonAssetString = 'MAYA.MAYA' | 'ETH.THOR' | 'ETH.vTHOR' | Chain;
export declare const getDecimal: ({ chain, symbol }: {
    chain: Chain;
    symbol: string;
}) => Promise<number>;
export declare const gasFeeMultiplier: Record<FeeOption, number>;
export declare const isGasAsset: ({ chain, symbol }: {
    chain: Chain;
    symbol: string;
}) => boolean | undefined;
export declare const getCommonAssetInfo: (assetString: CommonAssetString) => {
    identifier: string;
    decimal: number;
};
export declare const getAssetType: ({ chain, symbol }: {
    chain: Chain;
    symbol: string;
}) => Chain.Avalanche | Chain.Cosmos | Chain.Kujira | "Synth" | "Native" | "ERC20" | "POLYGON" | "ARBITRUM" | "OPTIMISM" | undefined;
export declare const assetFromString: (assetString: string) => {
    chain: Chain;
    symbol: string;
    ticker: string;
    synth: boolean;
};
export declare const filterAssets: (tokens: {
    value: string;
    decimal: number;
    chain: Chain;
    symbol: string;
}[]) => {
    value: string;
    decimal: number;
    chain: Chain;
    symbol: string;
}[];
