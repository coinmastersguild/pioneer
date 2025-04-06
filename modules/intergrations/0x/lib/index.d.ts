declare const TAG = " | 0x | ";
type BaseDecimal = string | number;
declare const uuid: any;
declare const log: any;
declare let caipToNetworkId: any, shortListSymbolToCaip: any, ChainToNetworkId: any;
declare let network: any;
declare const axios: any;
declare const API_KEY: string | undefined;
declare let networkSupport: any[];
declare const EIP155_MAINNET_CHAINS: any;
declare const networkApis: any;
interface QuoteResult {
    amountOutMin: string;
    amountOut: string;
    slippage: string;
}
declare const get_quote: (quote: any) => Promise<any>;
