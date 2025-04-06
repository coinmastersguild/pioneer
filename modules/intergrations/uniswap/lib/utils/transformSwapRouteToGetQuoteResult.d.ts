import { Currency, CurrencyAmount, TradeType } from '@uniswap/sdk-core';
import { SwapRoute } from '@uniswap/smart-order-router';
import { QuoteResult } from '../routing/types';
export declare function transformSwapRouteToGetQuoteResult(tradeType: TradeType, amount: CurrencyAmount<Currency>, { quote, quoteGasAdjusted, route, estimatedGasUsed, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, gasPriceWei, methodParameters, blockNumber, }: SwapRoute): QuoteResult;
