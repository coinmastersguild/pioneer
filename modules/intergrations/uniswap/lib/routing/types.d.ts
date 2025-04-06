import { MixedRouteSDK, Protocol, Trade } from '@uniswap/router-sdk';
import { ChainId, Currency, CurrencyAmount, Percent, Price, Token, TradeType } from '@uniswap/sdk-core';
import { DutchOrderInfo, DutchOrderInfoJSON, DutchOrderTrade as IDutchOrderTrade } from '@uniswap/uniswapx-sdk';
import { Route as V2Route } from '@uniswap/v2-sdk';
import { Route as V3Route } from '@uniswap/v3-sdk';
import { BigNumber } from 'ethers/lib/ethers';
declare enum SignatureType {
    SIGN_UNISWAPX_ORDER = "signUniswapXOrder",
    SIGN_UNISWAPX_V2_ORDER = "signUniswapXV2Order",
    SIGN_LIMIT = "signLimit"
}
export declare enum TradeState {
    LOADING = "loading",
    INVALID = "invalid",
    STALE = "stale",
    NO_ROUTE_FOUND = "no_route_found",
    VALID = "valid"
}
export declare enum QuoteMethod {
    ROUTING_API = "ROUTING_API",
    QUICK_ROUTE = "QUICK_ROUTE",
    CLIENT_SIDE_FALLBACK = "CLIENT_SIDE_FALLBACK"
}
export declare const INTERNAL_ROUTER_PREFERENCE_PRICE: "price";
export declare enum RouterPreference {
    X = "uniswapx",
    API = "api"
}
export declare enum QuoteIntent {
    Pricing = "pricing",
    Quote = "quote"
}
export interface GetQuoteArgs {
    tokenInAddress: string;
    tokenInChainId: ChainId;
    tokenInDecimals: number;
    tokenInSymbol?: string;
    tokenOutAddress: string;
    tokenOutChainId: ChainId;
    tokenOutDecimals: number;
    tokenOutSymbol?: string;
    amount: string;
    account?: string;
    routerPreference: RouterPreference | typeof INTERNAL_ROUTER_PREFERENCE_PRICE;
    tradeType: TradeType;
    needsWrapIfUniswapX: boolean;
    uniswapXForceSyntheticQuotes: boolean;
    sendPortionEnabled: boolean;
}
export type GetQuickQuoteArgs = {
    amount: string;
    tokenInAddress: string;
    tokenInChainId: ChainId;
    tokenInDecimals: number;
    tokenInSymbol?: string;
    tokenOutAddress: string;
    tokenOutChainId: ChainId;
    tokenOutDecimals: number;
    tokenOutSymbol?: string;
    tradeType: TradeType;
    inputTax: Percent;
    outputTax: Percent;
};
export type TokenInRoute = Pick<Token, 'address' | 'chainId' | 'symbol' | 'decimals'> & {
    buyFeeBps?: string;
    sellFeeBps?: string;
};
export type V3PoolInRoute = {
    type: 'v3-pool';
    tokenIn: TokenInRoute;
    tokenOut: TokenInRoute;
    sqrtRatioX96: string;
    liquidity: string;
    tickCurrent: string;
    fee: string;
    amountIn?: string;
    amountOut?: string;
    address?: string;
};
type V2Reserve = {
    token: TokenInRoute;
    quotient: string;
};
export type V2PoolInRoute = {
    type: 'v2-pool';
    tokenIn: TokenInRoute;
    tokenOut: TokenInRoute;
    reserve0: V2Reserve;
    reserve1: V2Reserve;
    amountIn?: string;
    amountOut?: string;
    address?: string;
};
export interface ClassicQuoteData {
    quoteId?: string;
    requestId?: string;
    blockNumber: string;
    amount: string;
    amountDecimals: string;
    gasPriceWei?: string;
    gasUseEstimate?: string;
    gasUseEstimateQuote?: string;
    gasUseEstimateQuoteDecimals?: string;
    gasUseEstimateUSD?: string;
    methodParameters?: {
        calldata: string;
        value: string;
    };
    quote: string;
    quoteDecimals: string;
    quoteGasAdjusted: string;
    quoteGasAdjustedDecimals: string;
    route: Array<(V3PoolInRoute | V2PoolInRoute)[]>;
    routeString: string;
    portionBips?: number;
    portionRecipient?: string;
    portionAmount?: string;
    portionAmountDecimals?: string;
    quoteGasAndPortionAdjusted?: string;
    quoteGasAndPortionAdjustedDecimals?: string;
}
export type URADutchOrderQuoteData = {
    auctionPeriodSecs: number;
    deadlineBufferSecs: number;
    startTimeBufferSecs: number;
    orderInfo: DutchOrderInfoJSON;
    quoteId?: string;
    requestId?: string;
    slippageTolerance: string;
    portionBips?: number;
    portionRecipient?: string;
    portionAmount?: string;
};
export type URADutchOrderQuoteResponse = {
    routing: URAQuoteType.DUTCH_LIMIT;
    quote: URADutchOrderQuoteData;
    allQuotes: Array<URAQuoteResponse>;
};
type URAClassicQuoteResponse = {
    routing: URAQuoteType.CLASSIC;
    quote: ClassicQuoteData;
    allQuotes: Array<URAQuoteResponse>;
};
export type URAQuoteResponse = URAClassicQuoteResponse | URADutchOrderQuoteResponse;
export type QuickRouteResponse = {
    tokenIn: {
        address: string;
        decimals: number;
        symbol: string;
        name: string;
    };
    tokenOut: {
        address: string;
        decimals: number;
        symbol: string;
        name: string;
    };
    tradeType: 'EXACT_IN' | 'EXACT_OUT';
    quote: {
        amount: string;
        path: string;
    };
};
export declare function isClassicQuoteResponse(data: URAQuoteResponse): data is URAClassicQuoteResponse;
export declare enum TradeFillType {
    Classic = "classic",// Uniswap V1, V2, and V3 trades with on-chain routes
    UniswapX = "uniswap_x",// off-chain trades, no routes
    None = "none"
}
export type ApproveInfo = {
    needsApprove: true;
    approveGasEstimateUSD: number;
} | {
    needsApprove: false;
};
export type WrapInfo = {
    needsWrap: true;
    wrapGasEstimateUSD: number;
} | {
    needsWrap: false;
};
export type SwapFeeInfo = {
    recipient: string;
    percent: Percent;
    amount: string;
};
export declare class ClassicTrade extends Trade<Currency, Currency, TradeType> {
    readonly fillType = TradeFillType.Classic;
    approveInfo: ApproveInfo;
    gasUseEstimate?: number;
    gasUseEstimateUSD?: number;
    blockNumber: string | null | undefined;
    requestId: string | undefined;
    quoteMethod: QuoteMethod;
    swapFee: SwapFeeInfo | undefined;
    constructor({ gasUseEstimate, gasUseEstimateUSD, blockNumber, requestId, quoteMethod, approveInfo, swapFee, ...routes }: {
        gasUseEstimate?: number;
        gasUseEstimateUSD?: number;
        totalGasUseEstimateUSD?: number;
        blockNumber?: string | null;
        requestId?: string;
        quoteMethod: QuoteMethod;
        approveInfo: ApproveInfo;
        swapFee?: SwapFeeInfo;
        v2Routes: {
            routev2: V2Route<Currency, Currency>;
            inputAmount: CurrencyAmount<Currency>;
            outputAmount: CurrencyAmount<Currency>;
        }[];
        v3Routes: {
            routev3: V3Route<Currency, Currency>;
            inputAmount: CurrencyAmount<Currency>;
            outputAmount: CurrencyAmount<Currency>;
        }[];
        tradeType: TradeType;
        mixedRoutes?: {
            mixedRoute: MixedRouteSDK<Currency, Currency>;
            inputAmount: CurrencyAmount<Currency>;
            outputAmount: CurrencyAmount<Currency>;
        }[];
    });
    get executionPrice(): Price<Currency, Currency>;
    get postSwapFeeOutputAmount(): CurrencyAmount<Currency>;
    get totalGasUseEstimateUSD(): number | undefined;
}
export declare enum OffchainOrderType {
    DUTCH_AUCTION = "Dutch",
    DUTCH_V2_AUCTION = "Dutch_V2",
    LIMIT_ORDER = "Limit"
}
export declare const OFFCHAIN_ORDER_TYPE_TO_SIGNATURE_TYPE: Record<OffchainOrderType, SignatureType>;
export declare class DutchOrderTrade extends IDutchOrderTrade<Currency, Currency, TradeType> {
    readonly fillType = TradeFillType.UniswapX;
    readonly offchainOrderType = OffchainOrderType.DUTCH_AUCTION;
    quoteId?: string;
    requestId?: string;
    wrapInfo: WrapInfo;
    approveInfo: ApproveInfo;
    classicGasUseEstimateUSD?: number;
    auctionPeriodSecs: number;
    startTimeBufferSecs: number;
    deadlineBufferSecs: number;
    slippageTolerance: Percent;
    inputTax: any;
    outputTax: any;
    swapFee: SwapFeeInfo | undefined;
    constructor({ currencyIn, currenciesOut, orderInfo, tradeType, quoteId, requestId, wrapInfo, approveInfo, classicGasUseEstimateUSD, auctionPeriodSecs, startTimeBufferSecs, deadlineBufferSecs, slippageTolerance, swapFee, }: {
        currencyIn: Currency;
        currenciesOut: Currency[];
        orderInfo: DutchOrderInfo;
        tradeType: TradeType;
        quoteId?: string;
        requestId?: string;
        approveInfo: ApproveInfo;
        wrapInfo: WrapInfo;
        classicGasUseEstimateUSD?: number;
        auctionPeriodSecs: number;
        startTimeBufferSecs: number;
        deadlineBufferSecs: number;
        slippageTolerance: Percent;
        swapFee?: SwapFeeInfo;
    });
    get totalGasUseEstimateUSD(): number;
    asDutchOrderTrade(): this;
}
export declare class PreviewTrade {
    readonly fillType = TradeFillType.None;
    readonly quoteMethod = QuoteMethod.QUICK_ROUTE;
    readonly tradeType: TradeType;
    readonly inputAmount: CurrencyAmount<Currency>;
    readonly outputAmount: CurrencyAmount<Currency>;
    constructor({ inputAmount, outputAmount, tradeType, }: {
        inputAmount: CurrencyAmount<Currency>;
        outputAmount: CurrencyAmount<Currency>;
        tradeType: TradeType;
    });
    minimumAmountOut(slippageTolerance: Percent, amountOut?: CurrencyAmount<Currency>): CurrencyAmount<Currency>;
    maximumAmountIn(slippageTolerance: Percent, amountIn?: CurrencyAmount<Currency>): CurrencyAmount<Currency>;
    /**
     * Returns the sell tax of the input token
     */
    get inputTax(): Percent;
    /**
     * Returns the buy tax of the output token
     */
    get outputTax(): Percent;
    private _executionPrice;
    /**
     * The price expressed in terms of output amount/input amount.
     */
    get executionPrice(): Price<Currency, Currency>;
    worstExecutionPrice(slippageTolerance: Percent): Price<Currency, Currency>;
}
export declare class LimitOrderTrade {
    readonly fillType = TradeFillType.UniswapX;
    readonly offchainOrderType = OffchainOrderType.LIMIT_ORDER;
    deadlineBufferSecs: number;
    wrapInfo: WrapInfo;
    approveInfo: ApproveInfo;
    swapFee: SwapFeeInfo | undefined;
    amountIn: CurrencyAmount<Token>;
    amountOut: CurrencyAmount<Currency>;
    tradeType: TradeType;
    swapper: string;
    deadline: number;
    inputTax: any;
    outputTax: any;
    slippageTolerance: any;
    quoteId: any;
    requestId: any;
    constructor({ tradeType, amountIn, amountOut, deadlineBufferSecs, swapFee, wrapInfo, approveInfo, swapper, }: {
        tradeType: TradeType;
        amountIn: CurrencyAmount<Token>;
        amountOut: CurrencyAmount<Currency>;
        deadlineBufferSecs: number;
        swapFee?: SwapFeeInfo;
        wrapInfo: WrapInfo;
        approveInfo: ApproveInfo;
        swapper: string;
    });
    asDutchOrderTrade(options?: {
        nonce: BigNumber;
        swapper: string;
    }): IDutchOrderTrade<Currency, Currency, TradeType>;
    get inputAmount(): CurrencyAmount<Token>;
    get outputAmount(): CurrencyAmount<Currency>;
    /** For UniswapX, handling token taxes in the output amount is outsourced to quoters */
    get postTaxOutputAmount(): CurrencyAmount<Currency>;
    get totalGasUseEstimateUSD(): number;
    get classicGasUseEstimateUSD(): number;
    get startTimeBufferSecs(): number;
    get auctionPeriodSecs(): number;
    get executionPrice(): Price<Currency, Currency>;
    worstExecutionPrice(): Price<Currency, Currency>;
    maximumAmountIn(): CurrencyAmount<Currency>;
    minimumAmountOut(): CurrencyAmount<Currency>;
}
export type SubmittableTrade = ClassicTrade | DutchOrderTrade | LimitOrderTrade;
export type InterfaceTrade = SubmittableTrade | PreviewTrade;
export declare enum QuoteState {
    SUCCESS = "Success",
    NOT_FOUND = "Not found"
}
export type QuoteResult = {
    state: QuoteState.NOT_FOUND;
    data?: undefined;
} | {
    state: QuoteState.SUCCESS;
    data: URAQuoteResponse;
};
export type TradeResult = {
    state: QuoteState.NOT_FOUND;
    trade?: undefined;
    latencyMs?: number;
} | {
    state: QuoteState.SUCCESS;
    trade: SubmittableTrade;
    latencyMs?: number;
};
export type PreviewTradeResult = {
    state: QuoteState.NOT_FOUND;
    trade?: undefined;
    latencyMs?: number;
} | {
    state: QuoteState.SUCCESS;
    trade: PreviewTrade;
    latencyMs?: number;
};
export declare enum PoolType {
    V2Pool = "v2-pool",
    V3Pool = "v3-pool"
}
export declare enum SwapRouterNativeAssets {
    MATIC = "MATIC",
    BNB = "BNB",
    AVAX = "AVAX",
    ETH = "ETH"
}
export declare enum URAQuoteType {
    CLASSIC = "CLASSIC",
    DUTCH_LIMIT = "DUTCH_LIMIT"
}
type ClassicAPIConfig = {
    protocols: Protocol[];
};
type UniswapXConfig = {
    swapper?: string;
    exclusivityOverrideBps?: number;
    auctionPeriodSecs?: number;
    startTimeBufferSecs?: number;
};
export type RoutingConfig = (UniswapXConfig | ClassicAPIConfig)[];
export {};
