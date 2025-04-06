import type { CoinGeckoList, MayaList, PancakeswapETHList, PancakeswapList, PangolinList, PioneerList, StargateARBList, SushiswapList, ThorchainList, TraderjoeList, UniswapList, WoofiList } from '@coinmasters/tokens';
import { Chain } from '@coinmasters/types';
import type { CommonAssetString } from '../helpers/asset';
import { getAssetType } from '../helpers/asset';
import type { NumberPrimitives } from './bigIntArithmetics';
import { BigIntArithmetics } from './bigIntArithmetics';
import type { SwapKitValueType } from './swapKitNumber';
type TokenTax = {
    buy: number;
    sell: number;
};
export declare function safeValue(value: NumberPrimitives, decimal: number): bigint;
type AssetValueParams = {
    decimal: number;
    value: SwapKitValueType;
    tax?: TokenTax;
} & ({
    chain: Chain;
    symbol: string;
} | {
    identifier: string;
});
type TCTokenNames = (typeof ThorchainList)['tokens'][number]['identifier'];
type TokenNames = TCTokenNames | (typeof CoinGeckoList)['tokens'][number]['identifier'] | (typeof MayaList)['tokens'][number]['identifier'] | (typeof PancakeswapETHList)['tokens'][number]['identifier'] | (typeof PancakeswapList)['tokens'][number]['identifier'] | (typeof PangolinList)['tokens'][number]['identifier'] | (typeof StargateARBList)['tokens'][number]['identifier'] | (typeof SushiswapList)['tokens'][number]['identifier'] | (typeof TraderjoeList)['tokens'][number]['identifier'] | (typeof WoofiList)['tokens'][number]['identifier'] | (typeof UniswapList)['tokens'][number]['identifier'] | (typeof PioneerList)['tokens'][number]['identifier'];
export declare class AssetValue extends BigIntArithmetics {
    address?: string;
    caip?: string;
    pubkey?: string;
    identifier?: string;
    chain: Chain;
    isGasAsset: boolean;
    isSynthetic: boolean;
    symbol: string;
    tax?: TokenTax;
    ticker: string;
    type: ReturnType<typeof getAssetType>;
    constructor(params: AssetValueParams);
    toString(short?: boolean): string | undefined;
    toUrl(): string | undefined;
    eq({ chain, symbol }: {
        chain: Chain;
        symbol: string;
    }): boolean | undefined;
    static fromString(assetString: string, value?: NumberPrimitives): Promise<AssetValue | undefined>;
    static fromStringSync(assetString: string, value?: NumberPrimitives): AssetValue | undefined;
    static fromIdentifier(assetString: `${Chain}.${string}` | `${Chain}/${string}` | `${Chain}.${string}-${string}`, value?: NumberPrimitives): Promise<AssetValue | undefined>;
    static fromIdentifierSync(identifier: TokenNames, value?: NumberPrimitives): AssetValue | undefined;
    static fromChainOrSignature(assetString: CommonAssetString, value?: NumberPrimitives): AssetValue | undefined;
    static loadStaticAssets(): Promise<{
        ok: true;
    } | {
        ok: false;
        message: string;
        error: any;
    } | undefined>;
}
export declare const getMinAmountByChain: (chain: Chain) => any;
export {};
