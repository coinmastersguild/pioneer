"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeRoutes = computeRoutes;
exports.transformQuickRouteToTrade = transformQuickRouteToTrade;
exports.getUSDCostPerGas = getUSDCostPerGas;
exports.transformQuoteToTrade = transformQuoteToTrade;
exports.isExactInput = isExactInput;
exports.currencyAddressForSwapQuote = currencyAddressForSwapQuote;
exports.isClassicTrade = isClassicTrade;
exports.isPreviewTrade = isPreviewTrade;
exports.isSubmittableTrade = isSubmittableTrade;
exports.isUniswapXTrade = isUniswapXTrade;
exports.isLimitTrade = isLimitTrade;
const bignumber_1 = require("@ethersproject/bignumber");
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const v2_sdk_1 = require("@uniswap/v2-sdk");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const misc_1 = require("../constants/misc");
const tokens_1 = require("../constants/tokens");
const PRECISION = 10000;
const DENOMINATOR = PRECISION * 100;
function toSlippagePercent(slippage) {
    const numerator = Number(slippage) * PRECISION;
    return new sdk_core_1.Percent(numerator, DENOMINATOR);
}
const gas_1 = require("./gas");
const types_1 = require("./types");
/**
 * Transforms a Routing API quote into an array of routes that can be used to
 * create a `Trade`.
 */
function computeRoutes(args, routes) {
    if (routes.length === 0)
        return [];
    const [currencyIn, currencyOut] = getTradeCurrencies(args, false, routes);
    try {
        return routes.map((route) => {
            if (route.length === 0) {
                throw new Error('Expected route to have at least one pair or pool');
            }
            const rawAmountIn = route[0].amountIn;
            const rawAmountOut = route[route.length - 1].amountOut;
            if (!rawAmountIn || !rawAmountOut) {
                throw new Error('Expected both amountIn and amountOut to be present');
            }
            const isOnlyV2 = isVersionedRoute(types_1.PoolType.V2Pool, route);
            const isOnlyV3 = isVersionedRoute(types_1.PoolType.V3Pool, route);
            return {
                routev3: isOnlyV3 ? new v3_sdk_1.Route(route.map(parsePool), currencyIn, currencyOut) : null,
                routev2: isOnlyV2 ? new v2_sdk_1.Route(route.map(parsePair), currencyIn, currencyOut) : null,
                mixedRoute: !isOnlyV3 && !isOnlyV2 ? new router_sdk_1.MixedRouteSDK(route.map(parsePoolOrPair), currencyIn, currencyOut) : null,
                inputAmount: sdk_core_1.CurrencyAmount.fromRawAmount(currencyIn, rawAmountIn),
                outputAmount: sdk_core_1.CurrencyAmount.fromRawAmount(currencyOut, rawAmountOut),
            };
        });
    }
    catch (e) {
        console.error('Error computing routes', e);
        return;
    }
}
const parsePoolOrPair = (pool) => {
    return pool.type === types_1.PoolType.V3Pool ? parsePool(pool) : parsePair(pool);
};
function isVersionedRoute(type, route) {
    return route.every((pool) => pool.type === type);
}
function toDutchOrderInfo(orderInfoJSON) {
    const { nonce, input, outputs, exclusivityOverrideBps } = orderInfoJSON;
    return {
        ...orderInfoJSON,
        nonce: bignumber_1.BigNumber.from(nonce),
        exclusivityOverrideBps: bignumber_1.BigNumber.from(exclusivityOverrideBps),
        input: {
            ...input,
            startAmount: bignumber_1.BigNumber.from(input.startAmount),
            endAmount: bignumber_1.BigNumber.from(input.endAmount),
        },
        outputs: outputs.map((output) => ({
            ...output,
            startAmount: bignumber_1.BigNumber.from(output.startAmount),
            endAmount: bignumber_1.BigNumber.from(output.endAmount),
        })),
    };
}
// Prepares the currencies used for the actual Swap (either UniswapX or Universal Router)
// May not match `currencyIn` that the user selected because for ETH inputs in UniswapX, the actual
// swap will use WETH.
function getTradeCurrencies(args, isUniswapXTrade, routes) {
    const { tokenInAddress, tokenInChainId, tokenInDecimals, tokenInSymbol, tokenOutAddress, tokenOutChainId, tokenOutDecimals, tokenOutSymbol, } = args;
    const tokenInIsNative = Object.values(types_1.SwapRouterNativeAssets).includes(tokenInAddress);
    const tokenOutIsNative = Object.values(types_1.SwapRouterNativeAssets).includes(tokenOutAddress);
    const serializedTokenIn = routes?.[0]?.[0]?.tokenIn;
    const serializedTokenOut = routes?.[0]?.[routes[0]?.length - 1]?.tokenOut;
    const currencyIn = tokenInIsNative
        ? (0, tokens_1.nativeOnChain)(tokenInChainId)
        : parseToken({
            address: tokenInAddress,
            chainId: tokenInChainId,
            decimals: tokenInDecimals,
            symbol: tokenInSymbol,
            buyFeeBps: serializedTokenIn?.buyFeeBps,
            sellFeeBps: serializedTokenIn?.sellFeeBps,
        });
    const currencyOut = tokenOutIsNative
        ? (0, tokens_1.nativeOnChain)(tokenOutChainId)
        : parseToken({
            address: tokenOutAddress,
            chainId: tokenOutChainId,
            decimals: tokenOutDecimals,
            symbol: tokenOutSymbol,
            buyFeeBps: serializedTokenOut?.buyFeeBps,
            sellFeeBps: serializedTokenOut?.sellFeeBps,
        });
    if (!isUniswapXTrade) {
        return [currencyIn, currencyOut];
    }
    return [currencyIn.isNative ? currencyIn.wrapped : currencyIn, currencyOut];
}
function getSwapFee(data) {
    const { portionAmount, portionBips, portionRecipient } = data;
    if (!portionAmount || !portionBips || !portionRecipient)
        return undefined;
    return {
        recipient: portionRecipient,
        percent: new sdk_core_1.Percent(portionBips, misc_1.BIPS_BASE),
        amount: portionAmount,
    };
}
function getClassicTradeDetails(args, data) {
    const classicQuote = data.routing === types_1.URAQuoteType.CLASSIC ? data.quote : data.allQuotes.find(types_1.isClassicQuoteResponse)?.quote;
    if (!classicQuote) {
        return {};
    }
    return {
        gasUseEstimate: classicQuote.gasUseEstimate ? parseFloat(classicQuote.gasUseEstimate) : undefined,
        gasUseEstimateUSD: classicQuote.gasUseEstimateUSD ? parseFloat(classicQuote.gasUseEstimateUSD) : undefined,
        blockNumber: classicQuote.blockNumber,
        routes: computeRoutes(args, classicQuote.route),
        swapFee: getSwapFee(classicQuote),
    };
}
function transformQuickRouteToTrade(args, data) {
    const { amount, tradeType } = args;
    const [currencyIn, currencyOut] = getTradeCurrencies(args, false);
    const [rawAmountIn, rawAmountOut] = data.tradeType === 'EXACT_IN' ? [amount, data.quote.amount] : [data.quote.amount, amount];
    const inputAmount = sdk_core_1.CurrencyAmount.fromRawAmount(currencyIn, rawAmountIn);
    const outputAmount = sdk_core_1.CurrencyAmount.fromRawAmount(currencyOut, rawAmountOut);
    return new types_1.PreviewTrade({ inputAmount, outputAmount, tradeType });
}
function getUSDCostPerGas(gasUseEstimateUSD, gasUseEstimate) {
    // Some sus javascript float math but it's ok because its just an estimate for display purposes
    if (!gasUseEstimateUSD || !gasUseEstimate)
        return undefined;
    return gasUseEstimateUSD / gasUseEstimate;
}
async function transformQuoteToTrade(args, data, quoteMethod) {
    const { tradeType, needsWrapIfUniswapX, routerPreference, account, amount } = args;
    const showUniswapXTrade = data.routing === types_1.URAQuoteType.DUTCH_LIMIT && routerPreference === types_1.RouterPreference.X;
    const [currencyIn, currencyOut] = getTradeCurrencies(args, showUniswapXTrade);
    const { gasUseEstimateUSD, blockNumber, routes, gasUseEstimate, swapFee } = getClassicTradeDetails(args, data);
    const usdCostPerGas = getUSDCostPerGas(gasUseEstimateUSD, gasUseEstimate);
    const approveInfo = await (0, gas_1.getApproveInfo)(account, currencyIn, amount, usdCostPerGas);
    const classicTrade = new types_1.ClassicTrade({
        v2Routes: routes
            ?.filter((r) => r.routev2 !== null)
            .map(({ routev2, inputAmount, outputAmount }) => ({
            routev2,
            inputAmount,
            outputAmount,
        })) ?? [],
        v3Routes: routes
            ?.filter((r) => r.routev3 !== null)
            .map(({ routev3, inputAmount, outputAmount }) => ({
            routev3,
            inputAmount,
            outputAmount,
        })) ?? [],
        mixedRoutes: routes
            ?.filter((r) => r.mixedRoute !== null)
            .map(({ mixedRoute, inputAmount, outputAmount }) => ({
            mixedRoute,
            inputAmount,
            outputAmount,
        })) ?? [],
        tradeType,
        gasUseEstimateUSD,
        gasUseEstimate,
        approveInfo,
        blockNumber,
        requestId: data.quote.requestId,
        quoteMethod,
        swapFee,
    });
    // If the top-level URA quote type is DUTCH_LIMIT, then UniswapX is better for the user
    const isUniswapXBetter = data.routing === types_1.URAQuoteType.DUTCH_LIMIT;
    if (isUniswapXBetter) {
        const orderInfo = toDutchOrderInfo(data.quote.orderInfo);
        const swapFee = getSwapFee(data.quote);
        const wrapInfo = await (0, gas_1.getWrapInfo)(needsWrapIfUniswapX, account, currencyIn.chainId, amount, usdCostPerGas);
        const uniswapXTrade = new types_1.DutchOrderTrade({
            currencyIn,
            currenciesOut: [currencyOut],
            orderInfo,
            tradeType,
            quoteId: data.quote.quoteId,
            requestId: data.quote.requestId,
            classicGasUseEstimateUSD: classicTrade.totalGasUseEstimateUSD,
            wrapInfo,
            approveInfo,
            auctionPeriodSecs: data.quote.auctionPeriodSecs,
            startTimeBufferSecs: data.quote.startTimeBufferSecs,
            deadlineBufferSecs: data.quote.deadlineBufferSecs,
            slippageTolerance: toSlippagePercent(data.quote.slippageTolerance),
            swapFee,
        });
        return {
            state: types_1.QuoteState.SUCCESS,
            trade: uniswapXTrade,
        };
    }
    return { state: types_1.QuoteState.SUCCESS, trade: classicTrade };
}
function parseToken({ address, chainId, decimals, symbol, buyFeeBps, sellFeeBps }) {
    const buyFeeBpsBN = buyFeeBps ? bignumber_1.BigNumber.from(buyFeeBps) : undefined;
    const sellFeeBpsBN = sellFeeBps ? bignumber_1.BigNumber.from(sellFeeBps) : undefined;
    return new sdk_core_1.Token(chainId, address, parseInt(decimals.toString()), symbol, undefined, false, buyFeeBpsBN, sellFeeBpsBN);
}
function parsePool({ fee, sqrtRatioX96, liquidity, tickCurrent, tokenIn, tokenOut }) {
    return new v3_sdk_1.Pool(parseToken(tokenIn), parseToken(tokenOut), parseInt(fee), sqrtRatioX96, liquidity, parseInt(tickCurrent));
}
const parsePair = ({ reserve0, reserve1 }) => new v2_sdk_1.Pair(sdk_core_1.CurrencyAmount.fromRawAmount(parseToken(reserve0.token), reserve0.quotient), sdk_core_1.CurrencyAmount.fromRawAmount(parseToken(reserve1.token), reserve1.quotient));
// TODO(WEB-2050): Convert other instances of tradeType comparison to use this utility function
function isExactInput(tradeType) {
    return tradeType === sdk_core_1.TradeType.EXACT_INPUT;
}
function currencyAddressForSwapQuote(currency) {
    if (currency.isNative) {
        if ((0, tokens_1.isPolygon)(currency.chainId))
            return types_1.SwapRouterNativeAssets.MATIC;
        if ((0, tokens_1.isBsc)(currency.chainId))
            return types_1.SwapRouterNativeAssets.BNB;
        if ((0, tokens_1.isAvalanche)(currency.chainId))
            return types_1.SwapRouterNativeAssets.AVAX;
        return types_1.SwapRouterNativeAssets.ETH;
    }
    return currency.address;
}
function isClassicTrade(trade) {
    return trade?.fillType === types_1.TradeFillType.Classic;
}
function isPreviewTrade(trade) {
    return trade?.fillType === types_1.TradeFillType.None;
}
function isSubmittableTrade(trade) {
    return trade?.fillType === types_1.TradeFillType.Classic || trade?.fillType === types_1.TradeFillType.UniswapX;
}
function isUniswapXTrade(trade) {
    return trade?.fillType === types_1.TradeFillType.UniswapX;
}
function isLimitTrade(trade) {
    return trade?.fillType === types_1.TradeFillType.UniswapX && trade?.offchainOrderType === types_1.OffchainOrderType.LIMIT_ORDER;
}
