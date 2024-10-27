import type {
  CoinGeckoList,
  MayaList,
  PancakeswapETHList,
  PancakeswapList,
  PangolinList,
  PioneerList,
  StargateARBList,
  SushiswapList,
  ThorchainList,
  TraderjoeList,
  UniswapList,
  WoofiList,
} from '@coinmasters/tokens';
import { BaseDecimal, Chain } from '@coinmasters/types';

import type { CommonAssetString } from '../helpers/asset';
import { getAssetType, getCommonAssetInfo, getDecimal, isGasAsset } from '../helpers/asset';
import { validateIdentifier } from '../helpers/validators';

import type { NumberPrimitives } from './bigIntArithmetics';
import { BigIntArithmetics, formatBigIntToSafeValue } from './bigIntArithmetics';
import type { SwapKitValueType } from './swapKitNumber';

const TAG = " | assetValue | ";

type TokenTax = { buy: number; sell: number };

export function safeValue(value: NumberPrimitives, decimal: number) {
  let tag = TAG + " | safeValue | ";
  try {
    if (typeof value === 'bigint') {
      return value;
    } else if (typeof value === 'number') {
      return BigInt(Math.round(value * Math.pow(10, decimal)));
    } else if (typeof value === 'string') {
      return BigInt(Math.round(parseFloat(value) * Math.pow(10, decimal)));
    }
    return BigInt(0);
  } catch (error) {
    console.error(tag + 'Error in safeValue:', error);
    return BigInt(0);
  }
}

type AssetValueParams = { decimal: number; value: SwapKitValueType; tax?: TokenTax } & (
    | { chain: Chain; symbol: string }
    | { identifier: string }
    );

type TCTokenNames = (typeof ThorchainList)['tokens'][number]['identifier'];

type TokenNames =
    | TCTokenNames
    | (typeof CoinGeckoList)['tokens'][number]['identifier']
    | (typeof MayaList)['tokens'][number]['identifier']
    | (typeof PancakeswapETHList)['tokens'][number]['identifier']
    | (typeof PancakeswapList)['tokens'][number]['identifier']
    | (typeof PangolinList)['tokens'][number]['identifier']
    | (typeof StargateARBList)['tokens'][number]['identifier']
    | (typeof SushiswapList)['tokens'][number]['identifier']
    | (typeof TraderjoeList)['tokens'][number]['identifier']
    | (typeof WoofiList)['tokens'][number]['identifier']
    | (typeof UniswapList)['tokens'][number]['identifier']
    | (typeof PioneerList)['tokens'][number]['identifier'];

let staticTokensMap:
    | Map<TokenNames, { tax?: TokenTax; decimal: number; identifier: string }>
    | undefined;

const getStaticToken = (identifier: TokenNames) => {
  let tag = TAG + " | getStaticToken | ";
  try {
    if (!staticTokensMap) {
      throw new Error('Static assets not loaded, call await AssetValue.loadStaticAssets() first');
    }
    const tokenInfo = staticTokensMap.get(identifier.toUpperCase() as TokenNames);

    return tokenInfo || { decimal: BaseDecimal.THOR, identifier: '' };
  } catch (error) {
    console.error(tag + 'Error in getStaticToken:', error);
  }
};

const createAssetValue = async (assetString: string, value: NumberPrimitives = 0) => {
  let tag = TAG + " | createAssetValue | ";
  try {
    validateIdentifier(assetString);
    //console.log(tag + 'assetString', assetString);

    //@ts-ignore
    const decimal = await getDecimal(getAssetInfo(assetString));
    //console.log(tag + 'decimal', decimal);

    const parsedValue = safeValue(value, decimal);
    //console.log(tag + 'parsedValue', parsedValue);

    // @ts-ignore
    return new AssetValue({ decimal, value: parsedValue, identifier: assetString });
  } catch (error) {
    console.error(tag + 'Error in createAssetValue:', error);
  }
};

export class AssetValue extends BigIntArithmetics {
  address?: string;
  caip?: string;
  pubkey?: string;
  identifier?: string;
  //@ts-ignore
  chain: Chain;
  isGasAsset = false;
  isSynthetic = false;
  //@ts-ignore
  symbol: string;
  tax?: TokenTax;
  //@ts-ignore
  ticker: string;
  type: ReturnType<typeof getAssetType>;

  //@ts-ignore
  constructor(params: AssetValueParams) {
    let tag = TAG + " | constructor | ";
    try {
      const identifier =
          'identifier' in params ? params.identifier : `${params.chain}.${params.symbol}`;

      let value;
      if (params.value instanceof BigIntArithmetics) {
        value = params.value;
      } else {
        value = { decimal: params.decimal, value: safeValue(params.value, params.decimal) };
      }
      // @ts-ignore
      super(value);

      const assetInfo:any = getAssetInfo(identifier);
      this.type = getAssetType(assetInfo);
      this.identifier = identifier;
      this.chain = assetInfo.chain;
      this.ticker = assetInfo.ticker;
      this.symbol = assetInfo.symbol;
      this.address = assetInfo.address;
      this.isSynthetic = assetInfo.isSynthetic;
      // @ts-ignore
      this.isGasAsset = assetInfo.isGasAsset;
      this.tax = params.tax;
    } catch (error) {
      console.error(tag + 'Error in constructor:', error);
    }
  }

  toString(short = false) {
    let tag = TAG + " | toString | ";
    try {
      const shortFormat = this.isSynthetic ? this.symbol : this.ticker;

      return short
          ? shortFormat
          : `${this.chain}.${this.symbol}`;
    } catch (error) {
      console.error(tag + 'Error in toString:', error);
    }
  }

  toUrl() {
    let tag = TAG + " | toUrl | ";
    try {
      return this.isSynthetic ? `${this.chain}.${this.symbol.replace('/', '.')}` : this.toString();
    } catch (error) {
      console.error(tag + 'Error in toUrl:', error);
    }
  }

  eq({ chain, symbol }: { chain: Chain; symbol: string }) {
    let tag = TAG + " | eq | ";
    try {
      return this.chain === chain && this.symbol === symbol;
    } catch (error) {
      console.error(tag + 'Error in eq:', error);
    }
  }

  static async fromString(assetString: string, value: NumberPrimitives = 0) {
    let tag = TAG + " | fromString | ";
    try {
      return createAssetValue(assetString, value);
    } catch (error) {
      console.error(tag + 'Error in fromString:', error);
    }
  }

  static fromStringSync(assetString: string, value: NumberPrimitives = 0) {
    let tag = TAG + " | fromStringSync | ";
    try {
      //@ts-ignore
      const { isSynthetic, symbol, chain, isGasAsset, ticker, address } = getAssetInfo(assetString);
      const {
        tax,
        decimal,
        identifier: tokenIdentifier,
      }:any = getStaticToken(assetString as unknown as TokenNames);
      const parsedValue = safeValue(value, decimal);
      let asset: AssetValue | undefined;

      if (tokenIdentifier) {
        asset = new AssetValue({
          tax,
          decimal,
          identifier: tokenIdentifier,
          // @ts-ignore
          value: parsedValue,
        });
      } else if (isSynthetic) {
        asset = new AssetValue({
          tax,
          decimal: 8, // Synthetic assets use a fixed decimal value
          identifier: assetString,
          // @ts-ignore
          value: parsedValue,
        });
      } else {
        asset = undefined;
      }

      return asset;
    } catch (error) {
      console.error(tag + 'Error in fromStringSync:', error);
    }
  }

  static async fromIdentifier(
      assetString: `${Chain}.${string}` | `${Chain}/${string}` | `${Chain}.${string}-${string}`,
      value: NumberPrimitives = 0,
  ) {
    let tag = TAG + " | fromIdentifier | ";
    try {
      return createAssetValue(assetString, value);
    } catch (error) {
      console.error(tag + 'Error in fromIdentifier:', error);
    }
  }

  static fromIdentifierSync(identifier: TokenNames, value: NumberPrimitives = 0) {
    let tag = TAG + " | fromIdentifierSync | ";
    try {
      //@ts-ignore
      const { decimal, identifier: tokenIdentifier } = getStaticToken(identifier);
      const parsedValue = safeValue(value, decimal);

      // @ts-ignore
      return new AssetValue({ decimal, identifier: tokenIdentifier, value: parsedValue });
    } catch (error) {
      console.error(tag + 'Error in fromIdentifierSync:', error);
    }
  }

  static fromChainOrSignature(assetString: CommonAssetString, value: NumberPrimitives = 0) {
    let tag = TAG + " | fromChainOrSignature | ";
    try {
      const { decimal, identifier } = getCommonAssetInfo(assetString);
      if (!decimal || !identifier) throw Error('unknown coin! ' + assetString);
      const parsedValue = safeValue(value, decimal);
      //console.log(tag + "parsedValue: ", parsedValue);
      //console.log(tag + "decimal: ", decimal);
      //console.log(tag + "identifier: ", identifier);

      // @ts-ignore
      return new AssetValue({ value: parsedValue, decimal, identifier });
    } catch (error) {
      console.error(tag + 'Error in fromChainOrSignature:', error);
    }
  }

  static async loadStaticAssets() {
    let tag = TAG + " | loadStaticAssets | ";
    try {
      return new Promise<{ ok: true } | { ok: false; message: string; error: any }>(
          async (resolve, reject) => {
            try {
              const {
                ThorchainList: _ThorchainList,
                NativeList,
                ...tokensPackage
              } = await import('@coinmasters/tokens');

              const tokensMap = [NativeList, ...Object.values(tokensPackage)].reduce(
                  (acc, { tokens }: any) => {
                    if (!tokens) {
                      console.warn(tag + "No tokens found in the current package, skipping.");
                      return acc;
                    }

                    // @ts-ignore
                    tokens.forEach(({ identifier, chain, ...rest }) => {
                      const decimal = 'decimals' in rest ? rest.decimals : BaseDecimal[chain as Chain];

                      acc.set(identifier as TokenNames, { identifier, decimal });
                    });

                    return acc;
                  },
                  new Map<TokenNames, { decimal: number; identifier: string }>(),
              );

              staticTokensMap = tokensMap;

              resolve({ ok: true });
            } catch (error) {
              console.error(tag + "Error loading static assets:", error);
              reject({
                ok: false,
                error,
                message: "Couldn't load static assets. Ensure you have installed @coinmasters/tokens package",
              });
            }
          },
      );
    } catch (error) {
      console.error(tag + 'Error in loadStaticAssets:', error);
    }
  }
}

export const getMinAmountByChain = (chain: Chain) => {
  let tag = TAG + " | getMinAmountByChain | ";
  try {
    const asset:any = AssetValue.fromChainOrSignature(chain);

    switch (chain) {
      case Chain.Bitcoin:
      case Chain.Litecoin:
      case Chain.Dash:
      case Chain.Zcash:
      case Chain.BitcoinCash:
        return asset.set(0.00010001);

      case Chain.Dogecoin:
        return asset.set(1.00000001);

      case Chain.Base:
      case Chain.Arbitrum:
      case Chain.Avalanche:
      case Chain.Ethereum:
        return asset.set(0.00000001);

      case Chain.THORChain:
      case Chain.Mayachain:
        return asset.set(0.0000000001);

      default:
        return asset.set(0.00000001);
    }
  } catch (error) {
    console.error(tag + 'Error in getMinAmountByChain:', error);
  }
};

const getAssetInfo = (identifier: string) => {
  let tag = TAG + " | getAssetInfo | ";
  try {
    const isSynthetic = identifier.slice(0, 14).includes('/');
    const [synthChain, synthSymbol] = identifier.split('.').pop()!.split('/');
    const adjustedIdentifier =
        identifier.includes('.') && !isSynthetic ? identifier : `${Chain.THORChain}.${synthSymbol}`;

    const [chain, symbol] = adjustedIdentifier.split('.') as [Chain, string];
    const [ticker, address] = (isSynthetic ? synthSymbol : symbol).split('-') as [string, string?];

    return {
      address: address?.toLowerCase(),
      chain,
      isGasAsset: isGasAsset({ chain, symbol }),
      isSynthetic,
      symbol:
          (isSynthetic ? `${synthChain}/` : '') +
          (address ? `${ticker}-${address?.toLowerCase() ?? ''}` : symbol),
      ticker,
    };
  } catch (error) {
    console.error(tag + 'Error in getAssetInfo:', error);
  }
};
