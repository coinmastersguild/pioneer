declare const TAG = " | osmosis | ";
declare const log: any;
declare let caipToNetworkId: any, shortListSymbolToCaip: any, ChainToNetworkId: any;
declare let networkOsmo: any;
declare let networkAtom: any;
declare const uuid: any;
declare let networkSupport: any[];
declare let assetSupport: any[];
interface QuoteResult {
    amountOutMin: string;
    amountOut: string;
    slippage: string;
}
declare function quoteFromPool(amountAtomSwap: string, amountAtomPool: string, amountOsmoPool: string, maxSlippage: number): QuoteResult;
declare const get_quote: (quote: any) => Promise<any>;
