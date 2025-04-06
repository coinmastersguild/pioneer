import { MixedRouteSDK } from '@uniswap/router-sdk';
import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { Route as V2Route } from '@uniswap/v2-sdk';
import { Route as V3Route } from '@uniswap/v3-sdk';
import { ClassicQuoteData, ClassicTrade, DutchOrderTrade, GetQuickQuoteArgs, GetQuoteArgs, InterfaceTrade, LimitOrderTrade, PreviewTrade, QuickRouteResponse, QuoteMethod, SubmittableTrade, TradeResult, URAQuoteResponse } from './types';
interface RouteResult {
    routev3: V3Route<Currency, Currency> | null;
    routev2: V2Route<Currency, Currency> | null;
    mixedRoute: MixedRouteSDK<Currency, Currency> | null;
    inputAmount: CurrencyAmount<Currency>;
    outputAmount: CurrencyAmount<Currency>;
}
/**
 * Transforms a Routing API quote into an array of routes that can be used to
 * create a `Trade`.
 */
export declare function computeRoutes(args: GetQuoteArgs, routes: ClassicQuoteData['route']): RouteResult[] | undefined;
export declare function transformQuickRouteToTrade(args: GetQuickQuoteArgs, data: QuickRouteResponse): PreviewTrade;
export declare function getUSDCostPerGas(gasUseEstimateUSD?: number, gasUseEstimate?: number): number | undefined;
export declare function transformQuoteToTrade(args: GetQuoteArgs, data: URAQuoteResponse, quoteMethod: QuoteMethod): Promise<TradeResult>;
export declare function isExactInput(tradeType: TradeType): boolean;
export declare function currencyAddressForSwapQuote(currency: Currency): string;
export declare function isClassicTrade(trade?: InterfaceTrade): trade is ClassicTrade;
export declare function isPreviewTrade(trade?: InterfaceTrade): trade is PreviewTrade;
export declare function isSubmittableTrade(trade?: InterfaceTrade): trade is SubmittableTrade;
export declare function isUniswapXTrade(trade?: InterfaceTrade): trade is DutchOrderTrade | LimitOrderTrade;
export declare function isLimitTrade(trade?: InterfaceTrade): trade is LimitOrderTrade;
export {};
