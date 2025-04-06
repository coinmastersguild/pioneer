"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouter = getRouter;
exports.getClientSideQuote = getClientSideQuote;
const sdk_core_1 = require("@uniswap/sdk-core");
// This file is lazy-loaded, so the import of smart-order-router is intentional.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
const smart_order_router_1 = require("@uniswap/smart-order-router");
const chains_1 = require("../constants/chains");
const providers_1 = require("../constants/providers");
const tokens_1 = require("../constants/tokens");
const jsbi_1 = __importDefault(require("jsbi"));
const types_1 = require("../routing/types");
const transformSwapRouteToGetQuoteResult_1 = require("../utils/transformSwapRouteToGetQuoteResult");
const CLIENT_SIDE_ROUTING_ALLOW_LIST = [
    sdk_core_1.ChainId.MAINNET,
    sdk_core_1.ChainId.OPTIMISM,
    sdk_core_1.ChainId.OPTIMISM_GOERLI,
    sdk_core_1.ChainId.ARBITRUM_ONE,
    sdk_core_1.ChainId.ARBITRUM_GOERLI,
    sdk_core_1.ChainId.POLYGON,
    sdk_core_1.ChainId.POLYGON_MUMBAI,
    sdk_core_1.ChainId.GOERLI,
    sdk_core_1.ChainId.SEPOLIA,
    sdk_core_1.ChainId.CELO_ALFAJORES,
    sdk_core_1.ChainId.CELO,
    sdk_core_1.ChainId.BNB,
    sdk_core_1.ChainId.AVALANCHE,
    sdk_core_1.ChainId.BASE,
];
const routers = new Map();
function getRouter(chainId) {
    const router = routers.get(chainId);
    if (router)
        return router;
    const supportedChainId = (0, chains_1.asSupportedChain)(chainId);
    if (supportedChainId && CLIENT_SIDE_ROUTING_ALLOW_LIST.includes(chainId)) {
        const provider = providers_1.RPC_PROVIDERS[supportedChainId];
        const router = new smart_order_router_1.AlphaRouter({ chainId, provider });
        routers.set(chainId, router);
        return router;
    }
    throw new Error(`Router does not support this chain (chainId: ${chainId}).`);
}
async function getQuote({ tradeType, tokenIn, tokenOut, amount: amountRaw, }, router, routerConfig) {
    console.log("Checkpoint: getQuote");
    const tokenInIsNative = Object.values(types_1.SwapRouterNativeAssets).includes(tokenIn.address);
    const tokenOutIsNative = Object.values(types_1.SwapRouterNativeAssets).includes(tokenOut.address);
    console.log("Checkpoint: getQuote2");
    let currencyIn;
    if (tokenInIsNative) {
        console.log("Checkpoint: tokenInIsNative");
        currencyIn = (0, tokens_1.nativeOnChain)(tokenIn.chainId); // Use the native token for the chain if tokenIn is native
    }
    else {
        console.log("Checkpoint: !tokenInIsNative tokenIn: ", tokenIn);
        currencyIn = new sdk_core_1.Token(tokenIn.chainId, tokenIn.address, tokenIn.decimals, tokenIn.symbol); // Otherwise, create a new token
    }
    // Determine the output currency type
    let currencyOut;
    if (tokenOutIsNative) {
        console.log("Checkpoint: tokenOutIsNative");
        currencyOut = (0, tokens_1.nativeOnChain)(tokenOut.chainId); // Use the native token for the chain if tokenOut is native
    }
    else {
        console.log("Checkpoint: !tokenOutIsNative");
        currencyOut = new sdk_core_1.Token(tokenOut.chainId, tokenOut.address, tokenOut.decimals, tokenOut.symbol); // Otherwise, create a new token
    }
    const baseCurrency = tradeType === sdk_core_1.TradeType.EXACT_INPUT ? currencyIn : currencyOut;
    const quoteCurrency = tradeType === sdk_core_1.TradeType.EXACT_INPUT ? currencyOut : currencyIn;
    console.log("baseCurrency", baseCurrency);
    console.log("quoteCurrency", quoteCurrency);
    const amount = sdk_core_1.CurrencyAmount.fromRawAmount(baseCurrency, jsbi_1.default.BigInt(amountRaw));
    // TODO (WEB-2055): explore initializing client side routing on first load (when amountRaw is null) if there are enough users using client-side router preference.
    const swapRoute = await router.route(amount, quoteCurrency, tradeType, /*swapConfig=*/ undefined, routerConfig);
    console.log("swapRoute", swapRoute);
    if (!swapRoute) {
        return { state: types_1.QuoteState.NOT_FOUND };
    }
    return (0, transformSwapRouteToGetQuoteResult_1.transformSwapRouteToGetQuoteResult)(tradeType, amount, swapRoute);
}
async function getClientSideQuote({ tokenInAddress, tokenInChainId, tokenInDecimals, tokenInSymbol, tokenOutAddress, tokenOutChainId, tokenOutDecimals, tokenOutSymbol, amount, tradeType, }, router, config) {
    return getQuote({
        tradeType,
        tokenIn: {
            address: tokenInAddress,
            chainId: tokenInChainId,
            decimals: tokenInDecimals,
            symbol: tokenInSymbol,
        },
        tokenOut: {
            address: tokenOutAddress,
            chainId: tokenOutChainId,
            decimals: tokenOutDecimals,
            symbol: tokenOutSymbol,
        },
        amount,
    }, router, config);
}
