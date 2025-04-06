import { ChainId } from '@uniswap/sdk-core';
import { AlphaRouter, AlphaRouterConfig } from '@uniswap/smart-order-router';
import { GetQuoteArgs, QuoteResult } from '../routing/types';
export declare function getRouter(chainId: ChainId): AlphaRouter;
export declare function getClientSideQuote({ tokenInAddress, tokenInChainId, tokenInDecimals, tokenInSymbol, tokenOutAddress, tokenOutChainId, tokenOutDecimals, tokenOutSymbol, amount, tradeType, }: GetQuoteArgs, router: AlphaRouter, config: Partial<AlphaRouterConfig>): Promise<QuoteResult>;
