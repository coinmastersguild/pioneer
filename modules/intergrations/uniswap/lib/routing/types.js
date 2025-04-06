"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.URAQuoteType = exports.SwapRouterNativeAssets = exports.PoolType = exports.QuoteState = exports.LimitOrderTrade = exports.PreviewTrade = exports.DutchOrderTrade = exports.OFFCHAIN_ORDER_TYPE_TO_SIGNATURE_TYPE = exports.OffchainOrderType = exports.ClassicTrade = exports.TradeFillType = exports.QuoteIntent = exports.RouterPreference = exports.INTERNAL_ROUTER_PREFERENCE_PRICE = exports.QuoteMethod = exports.TradeState = void 0;
exports.isClassicQuoteResponse = isClassicQuoteResponse;
const constants_1 = require("@ethersproject/constants");
const router_sdk_1 = require("@uniswap/router-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const uniswapx_sdk_1 = require("@uniswap/uniswapx-sdk");
const misc_1 = require("../constants/misc");
const ethers_1 = require("ethers/lib/ethers");
var SignatureType;
(function (SignatureType) {
    SignatureType["SIGN_UNISWAPX_ORDER"] = "signUniswapXOrder";
    SignatureType["SIGN_UNISWAPX_V2_ORDER"] = "signUniswapXV2Order";
    SignatureType["SIGN_LIMIT"] = "signLimit";
})(SignatureType || (SignatureType = {}));
var TradeState;
(function (TradeState) {
    TradeState["LOADING"] = "loading";
    TradeState["INVALID"] = "invalid";
    TradeState["STALE"] = "stale";
    TradeState["NO_ROUTE_FOUND"] = "no_route_found";
    TradeState["VALID"] = "valid";
})(TradeState || (exports.TradeState = TradeState = {}));
var QuoteMethod;
(function (QuoteMethod) {
    QuoteMethod["ROUTING_API"] = "ROUTING_API";
    QuoteMethod["QUICK_ROUTE"] = "QUICK_ROUTE";
    QuoteMethod["CLIENT_SIDE_FALLBACK"] = "CLIENT_SIDE_FALLBACK";
})(QuoteMethod || (exports.QuoteMethod = QuoteMethod = {}));
// This is excluded from `RouterPreference` enum because it's only used
// internally for token -> USDC trades to get a USD value.
exports.INTERNAL_ROUTER_PREFERENCE_PRICE = 'price';
var RouterPreference;
(function (RouterPreference) {
    RouterPreference["X"] = "uniswapx";
    RouterPreference["API"] = "api";
})(RouterPreference || (exports.RouterPreference = RouterPreference = {}));
// TODO(limits): add Limit market price intent
var QuoteIntent;
(function (QuoteIntent) {
    QuoteIntent["Pricing"] = "pricing";
    QuoteIntent["Quote"] = "quote";
})(QuoteIntent || (exports.QuoteIntent = QuoteIntent = {}));
function isClassicQuoteResponse(data) {
    return data.routing === URAQuoteType.CLASSIC;
}
var TradeFillType;
(function (TradeFillType) {
    TradeFillType["Classic"] = "classic";
    TradeFillType["UniswapX"] = "uniswap_x";
    TradeFillType["None"] = "none";
})(TradeFillType || (exports.TradeFillType = TradeFillType = {}));
class ClassicTrade extends router_sdk_1.Trade {
    constructor({ gasUseEstimate, gasUseEstimateUSD, blockNumber, requestId, quoteMethod, approveInfo, swapFee, ...routes }) {
        super(routes);
        this.fillType = TradeFillType.Classic;
        this.blockNumber = blockNumber;
        this.gasUseEstimateUSD = gasUseEstimateUSD;
        this.requestId = requestId;
        this.quoteMethod = quoteMethod;
        this.approveInfo = approveInfo;
        this.swapFee = swapFee;
        this.gasUseEstimate = gasUseEstimate;
    }
    get executionPrice() {
        if (this.tradeType === sdk_core_1.TradeType.EXACT_INPUT || !this.swapFee) { // @ts-ignore
            return super.executionPrice;
        }
        // Fix inaccurate price calculation for exact output trades
        return new sdk_core_1.Price({ baseAmount: this.inputAmount, quoteAmount: this.postSwapFeeOutputAmount });
    }
    get postSwapFeeOutputAmount() {
        // Routing api already applies the swap fee to the output amount for exact-in
        if (this.tradeType === sdk_core_1.TradeType.EXACT_INPUT)
            return this.outputAmount;
        const swapFeeAmount = sdk_core_1.CurrencyAmount.fromRawAmount(this.outputAmount.currency, this.swapFee?.amount ?? 0);
        return this.outputAmount.subtract(swapFeeAmount);
    }
    // gas estimate for maybe approve + swap
    get totalGasUseEstimateUSD() {
        if (this.approveInfo.needsApprove && this.gasUseEstimateUSD) {
            return this.approveInfo.approveGasEstimateUSD + this.gasUseEstimateUSD;
        }
        return this.gasUseEstimateUSD;
    }
}
exports.ClassicTrade = ClassicTrade;
var OffchainOrderType;
(function (OffchainOrderType) {
    OffchainOrderType["DUTCH_AUCTION"] = "Dutch";
    OffchainOrderType["DUTCH_V2_AUCTION"] = "Dutch_V2";
    OffchainOrderType["LIMIT_ORDER"] = "Limit";
})(OffchainOrderType || (exports.OffchainOrderType = OffchainOrderType = {}));
exports.OFFCHAIN_ORDER_TYPE_TO_SIGNATURE_TYPE = {
    [OffchainOrderType.DUTCH_AUCTION]: SignatureType.SIGN_UNISWAPX_ORDER,
    [OffchainOrderType.DUTCH_V2_AUCTION]: SignatureType.SIGN_UNISWAPX_V2_ORDER,
    [OffchainOrderType.LIMIT_ORDER]: SignatureType.SIGN_LIMIT,
};
class DutchOrderTrade extends uniswapx_sdk_1.DutchOrderTrade {
    constructor({ currencyIn, currenciesOut, orderInfo, tradeType, quoteId, requestId, wrapInfo, approveInfo, classicGasUseEstimateUSD, auctionPeriodSecs, startTimeBufferSecs, deadlineBufferSecs, slippageTolerance, swapFee, }) {
        super({ currencyIn, currenciesOut, orderInfo, tradeType });
        this.fillType = TradeFillType.UniswapX;
        this.offchainOrderType = OffchainOrderType.DUTCH_AUCTION;
        this.inputTax = misc_1.ZERO_PERCENT;
        this.outputTax = misc_1.ZERO_PERCENT;
        this.quoteId = quoteId;
        this.requestId = requestId;
        this.approveInfo = approveInfo;
        this.wrapInfo = wrapInfo;
        this.classicGasUseEstimateUSD = classicGasUseEstimateUSD;
        this.auctionPeriodSecs = auctionPeriodSecs;
        this.deadlineBufferSecs = deadlineBufferSecs;
        this.slippageTolerance = slippageTolerance;
        this.startTimeBufferSecs = startTimeBufferSecs;
        this.swapFee = swapFee;
    }
    get totalGasUseEstimateUSD() {
        if (this.wrapInfo.needsWrap && this.approveInfo.needsApprove) {
            return this.wrapInfo.wrapGasEstimateUSD + this.approveInfo.approveGasEstimateUSD;
        }
        if (this.wrapInfo.needsWrap)
            return this.wrapInfo.wrapGasEstimateUSD;
        if (this.approveInfo.needsApprove)
            return this.approveInfo.approveGasEstimateUSD;
        return 0;
    }
    asDutchOrderTrade() {
        return this;
    }
}
exports.DutchOrderTrade = DutchOrderTrade;
class PreviewTrade {
    constructor({ inputAmount, outputAmount, tradeType, }) {
        this.fillType = TradeFillType.None;
        this.quoteMethod = QuoteMethod.QUICK_ROUTE;
        this.inputAmount = inputAmount;
        this.outputAmount = outputAmount;
        this.tradeType = tradeType;
    }
    // below methods are copied from router-sdk
    // Trade https://github.com/Uniswap/router-sdk/blob/main/src/entities/trade.ts#L10
    minimumAmountOut(slippageTolerance, amountOut = this.outputAmount) {
        if (this.tradeType === sdk_core_1.TradeType.EXACT_OUTPUT) {
            return amountOut;
        }
        else {
            const slippageAdjustedAmountOut = new sdk_core_1.Fraction(router_sdk_1.ONE)
                .add(slippageTolerance)
                .invert()
                .multiply(amountOut.quotient).quotient;
            return sdk_core_1.CurrencyAmount.fromRawAmount(amountOut.currency, slippageAdjustedAmountOut);
        }
    }
    maximumAmountIn(slippageTolerance, amountIn = this.inputAmount) {
        if (this.tradeType === sdk_core_1.TradeType.EXACT_INPUT) {
            return amountIn;
        }
        else {
            const slippageAdjustedAmountIn = new sdk_core_1.Fraction(router_sdk_1.ONE).add(slippageTolerance).multiply(amountIn.quotient).quotient;
            return sdk_core_1.CurrencyAmount.fromRawAmount(amountIn.currency, slippageAdjustedAmountIn);
        }
    }
    /**
     * Returns the sell tax of the input token
     */
    get inputTax() {
        const inputCurrency = this.inputAmount.currency;
        if (inputCurrency.isNative || !inputCurrency.wrapped.sellFeeBps)
            return misc_1.ZERO_PERCENT;
        return new sdk_core_1.Percent(inputCurrency.wrapped.sellFeeBps.toNumber(), 10000);
    }
    /**
     * Returns the buy tax of the output token
     */
    get outputTax() {
        const outputCurrency = this.outputAmount.currency;
        if (outputCurrency.isNative || !outputCurrency.wrapped.buyFeeBps)
            return misc_1.ZERO_PERCENT;
        return new sdk_core_1.Percent(outputCurrency.wrapped.buyFeeBps.toNumber(), 10000);
    }
    /**
     * The price expressed in terms of output amount/input amount.
     */
    get executionPrice() {
        return (this._executionPrice ??
            (this._executionPrice = new sdk_core_1.Price(this.inputAmount.currency, this.outputAmount.currency, this.inputAmount.quotient, this.outputAmount.quotient)));
    }
    worstExecutionPrice(slippageTolerance) {
        return new sdk_core_1.Price(this.inputAmount.currency, this.outputAmount.currency, this.maximumAmountIn(slippageTolerance).quotient, this.minimumAmountOut(slippageTolerance).quotient);
    }
}
exports.PreviewTrade = PreviewTrade;
// TODO(limits): get this from uniswapx-sdk
const UNISWAPX_REACTOR = '0x6000da47483062a0d734ba3dc7576ce6a0b645c4';
class LimitOrderTrade {
    constructor({ tradeType, amountIn, amountOut, deadlineBufferSecs, swapFee, wrapInfo, approveInfo, swapper, }) {
        this.fillType = TradeFillType.UniswapX;
        this.offchainOrderType = OffchainOrderType.LIMIT_ORDER;
        // Placeholder values that aren't used in a limit trade
        this.inputTax = misc_1.ZERO_PERCENT;
        this.outputTax = misc_1.ZERO_PERCENT;
        this.slippageTolerance = misc_1.ZERO_PERCENT;
        this.quoteId = undefined;
        this.requestId = undefined;
        this.deadlineBufferSecs = deadlineBufferSecs;
        this.swapFee = swapFee;
        this.wrapInfo = wrapInfo;
        this.approveInfo = approveInfo;
        this.amountIn = amountIn;
        this.amountOut = amountOut;
        this.tradeType = tradeType;
        this.swapper = swapper;
        // deadline is shown in the review modal, but updated on submission
        const nowSecs = Math.floor(Date.now() / 1000);
        this.deadline = (nowSecs + deadlineBufferSecs) * 1000;
    }
    asDutchOrderTrade(options) {
        const swapperOutput = {
            token: this.amountOut.currency.isNative ? constants_1.AddressZero : this.amountOut.currency.address,
            recipient: options?.swapper ?? this.swapper,
            startAmount: ethers_1.BigNumber.from(this.amountOut.quotient.toString()),
            endAmount: ethers_1.BigNumber.from(this.amountOut.quotient.toString()),
        };
        const swapFee = this.swapFee && {
            token: this.amountOut.currency.isNative ? constants_1.AddressZero : this.amountOut.currency.address,
            recipient: this.swapFee.recipient,
            startAmount: ethers_1.BigNumber.from(this.amountOut.multiply(this.swapFee.percent).quotient.toString()),
            endAmount: ethers_1.BigNumber.from(this.amountOut.multiply(this.swapFee.percent).quotient.toString()),
        };
        const outputs = swapFee ? [swapperOutput, swapFee] : [swapperOutput];
        const nowSecs = Math.floor(Date.now() / 1000);
        return new uniswapx_sdk_1.DutchOrderTrade({
            currencyIn: this.amountIn.currency,
            currenciesOut: [this.amountOut.currency],
            orderInfo: {
                reactor: UNISWAPX_REACTOR,
                swapper: options?.swapper ?? this.swapper,
                deadline: (nowSecs + this.deadlineBufferSecs) * 1000,
                additionalValidationContract: constants_1.AddressZero,
                additionalValidationData: '0x',
                nonce: options?.nonce ?? ethers_1.BigNumber.from(0),
                // decay timings dont matter at all
                decayStartTime: nowSecs,
                decayEndTime: nowSecs,
                exclusiveFiller: constants_1.AddressZero,
                exclusivityOverrideBps: ethers_1.BigNumber.from(0),
                input: {
                    token: this.amountIn.currency.isNative ? constants_1.AddressZero : this.amountIn.currency.address,
                    startAmount: ethers_1.BigNumber.from(this.amountIn.quotient.toString()),
                    endAmount: ethers_1.BigNumber.from(this.amountIn.quotient.toString()),
                },
                outputs,
            },
            tradeType: this.tradeType,
        });
    }
    get inputAmount() {
        return this.amountIn;
    }
    get outputAmount() {
        return this.amountOut;
    }
    /** For UniswapX, handling token taxes in the output amount is outsourced to quoters */
    get postTaxOutputAmount() {
        return this.outputAmount;
    }
    get totalGasUseEstimateUSD() {
        return this.wrapInfo.needsWrap ? this.wrapInfo.wrapGasEstimateUSD : 0;
    }
    get classicGasUseEstimateUSD() {
        return 0;
    }
    // no decay for limit orders
    get startTimeBufferSecs() {
        return 0;
    }
    // no decay auction for limit orders
    get auctionPeriodSecs() {
        return 0;
    }
    get executionPrice() {
        return new sdk_core_1.Price(this.amountIn.currency, this.amountOut.currency, this.amountIn.quotient, this.amountOut.quotient);
    }
    worstExecutionPrice() {
        return this.executionPrice;
    }
    maximumAmountIn() {
        return this.inputAmount;
    }
    minimumAmountOut() {
        return this.outputAmount;
    }
}
exports.LimitOrderTrade = LimitOrderTrade;
var QuoteState;
(function (QuoteState) {
    QuoteState["SUCCESS"] = "Success";
    QuoteState["NOT_FOUND"] = "Not found";
})(QuoteState || (exports.QuoteState = QuoteState = {}));
var PoolType;
(function (PoolType) {
    PoolType["V2Pool"] = "v2-pool";
    PoolType["V3Pool"] = "v3-pool";
})(PoolType || (exports.PoolType = PoolType = {}));
// swap router API special cases these strings to represent native currencies
// all chains except for bnb chain and polygon
// have "ETH" as native currency symbol
var SwapRouterNativeAssets;
(function (SwapRouterNativeAssets) {
    SwapRouterNativeAssets["MATIC"] = "MATIC";
    SwapRouterNativeAssets["BNB"] = "BNB";
    SwapRouterNativeAssets["AVAX"] = "AVAX";
    SwapRouterNativeAssets["ETH"] = "ETH";
})(SwapRouterNativeAssets || (exports.SwapRouterNativeAssets = SwapRouterNativeAssets = {}));
var URAQuoteType;
(function (URAQuoteType) {
    URAQuoteType["CLASSIC"] = "CLASSIC";
    URAQuoteType["DUTCH_LIMIT"] = "DUTCH_LIMIT";
})(URAQuoteType || (exports.URAQuoteType = URAQuoteType = {}));
