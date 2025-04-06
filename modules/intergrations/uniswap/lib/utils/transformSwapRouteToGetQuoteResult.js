"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformSwapRouteToGetQuoteResult = transformSwapRouteToGetQuoteResult;
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
// This file is lazy-loaded, so the import of smart-order-router is intentional.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
const smart_order_router_1 = require("@uniswap/smart-order-router");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const types_1 = require("../routing/types");
// from routing-api (https://github.com/Uniswap/routing-api/blob/main/lib/handlers/quote/quote.ts#L243-L311)
function transformSwapRouteToGetQuoteResult(tradeType, amount, { quote, quoteGasAdjusted, route, estimatedGasUsed, estimatedGasUsedQuoteToken, estimatedGasUsedUSD, gasPriceWei, methodParameters, blockNumber, }) {
    const routeResponse = [];
    for (const subRoute of route) {
        const { amount, quote, tokenPath } = subRoute;
        const pools = subRoute.protocol === router_sdk_1.Protocol.V2 ? subRoute.route.pairs : subRoute.route.pools;
        const curRoute = [];
        for (let i = 0; i < pools.length; i++) {
            const nextPool = pools[i];
            const tokenIn = tokenPath[i];
            const tokenOut = tokenPath[i + 1];
            let edgeAmountIn = undefined;
            if (i === 0) {
                edgeAmountIn = tradeType === sdk_core_1.TradeType.EXACT_INPUT ? amount.quotient.toString() : quote.quotient.toString();
            }
            let edgeAmountOut = undefined;
            if (i === pools.length - 1) {
                edgeAmountOut = tradeType === sdk_core_1.TradeType.EXACT_INPUT ? quote.quotient.toString() : amount.quotient.toString();
            }
            if (nextPool instanceof v3_sdk_1.Pool) {
                curRoute.push({
                    type: 'v3-pool',
                    tokenIn: {
                        chainId: tokenIn.chainId,
                        decimals: tokenIn.decimals,
                        address: tokenIn.address,
                        symbol: tokenIn.symbol,
                    },
                    tokenOut: {
                        chainId: tokenOut.chainId,
                        decimals: tokenOut.decimals,
                        address: tokenOut.address,
                        symbol: tokenOut.symbol,
                    },
                    fee: nextPool.fee.toString(),
                    liquidity: nextPool.liquidity.toString(),
                    sqrtRatioX96: nextPool.sqrtRatioX96.toString(),
                    tickCurrent: nextPool.tickCurrent.toString(),
                    amountIn: edgeAmountIn,
                    amountOut: edgeAmountOut,
                });
            }
            else {
                const reserve0 = nextPool.reserve0;
                const reserve1 = nextPool.reserve1;
                curRoute.push({
                    type: 'v2-pool',
                    tokenIn: {
                        chainId: tokenIn.chainId,
                        decimals: tokenIn.decimals,
                        address: tokenIn.address,
                        symbol: tokenIn.symbol,
                    },
                    tokenOut: {
                        chainId: tokenOut.chainId,
                        decimals: tokenOut.decimals,
                        address: tokenOut.address,
                        symbol: tokenOut.symbol,
                    },
                    reserve0: {
                        token: {
                            chainId: reserve0.currency.wrapped.chainId,
                            decimals: reserve0.currency.wrapped.decimals,
                            address: reserve0.currency.wrapped.address,
                            symbol: reserve0.currency.wrapped.symbol,
                        },
                        quotient: reserve0.quotient.toString(),
                    },
                    reserve1: {
                        token: {
                            chainId: reserve1.currency.wrapped.chainId,
                            decimals: reserve1.currency.wrapped.decimals,
                            address: reserve1.currency.wrapped.address,
                            symbol: reserve1.currency.wrapped.symbol,
                        },
                        quotient: reserve1.quotient.toString(),
                    },
                    amountIn: edgeAmountIn,
                    amountOut: edgeAmountOut,
                });
            }
        }
        routeResponse.push(curRoute);
    }
    const result = {
        methodParameters,
        blockNumber: blockNumber.toString(),
        amount: amount.quotient.toString(),
        amountDecimals: amount.toExact(),
        quote: quote.quotient.toString(),
        quoteDecimals: quote.toExact(),
        quoteGasAdjusted: quoteGasAdjusted.quotient.toString(),
        quoteGasAdjustedDecimals: quoteGasAdjusted.toExact(),
        gasUseEstimateQuote: estimatedGasUsedQuoteToken.quotient.toString(),
        gasUseEstimateQuoteDecimals: estimatedGasUsedQuoteToken.toExact(),
        gasUseEstimate: estimatedGasUsed.toString(),
        gasUseEstimateUSD: estimatedGasUsedUSD.toExact(),
        gasPriceWei: gasPriceWei.toString(),
        route: routeResponse,
        routeString: (0, smart_order_router_1.routeAmountsToString)(route),
    };
    return { state: types_1.QuoteState.SUCCESS, data: { routing: types_1.URAQuoteType.CLASSIC, quote: result, allQuotes: [] } };
}
