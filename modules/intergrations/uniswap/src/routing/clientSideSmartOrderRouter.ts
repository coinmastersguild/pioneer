import { BigintIsh, ChainId, CurrencyAmount, Token, TradeType } from '@uniswap/sdk-core'
// This file is lazy-loaded, so the import of smart-order-router is intentional.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { AlphaRouter, AlphaRouterConfig } from '@uniswap/smart-order-router'
import { asSupportedChain } from '../constants/chains'
import { RPC_PROVIDERS } from '../constants/providers'
import { nativeOnChain } from '../constants/tokens'
import JSBI from 'jsbi'
import { GetQuoteArgs, QuoteResult, QuoteState, SwapRouterNativeAssets } from '../routing/types'
import { transformSwapRouteToGetQuoteResult } from '../utils/transformSwapRouteToGetQuoteResult'

const CLIENT_SIDE_ROUTING_ALLOW_LIST = [
  ChainId.MAINNET,
  ChainId.OPTIMISM,
  ChainId.OPTIMISM_GOERLI,
  ChainId.ARBITRUM_ONE,
  ChainId.ARBITRUM_GOERLI,
  ChainId.POLYGON,
  ChainId.POLYGON_MUMBAI,
  ChainId.GOERLI,
  ChainId.SEPOLIA,
  ChainId.CELO_ALFAJORES,
  ChainId.CELO,
  ChainId.BNB,
  ChainId.AVALANCHE,
  ChainId.BASE,
]
const routers = new Map<ChainId, AlphaRouter>()
export function getRouter(chainId: ChainId): AlphaRouter {
  const router = routers.get(chainId)
  if (router) return router

  const supportedChainId = asSupportedChain(chainId)
  if (supportedChainId && CLIENT_SIDE_ROUTING_ALLOW_LIST.includes(chainId)) {
    const provider = RPC_PROVIDERS[supportedChainId]
    const router = new AlphaRouter({ chainId, provider })
    routers.set(chainId, router)
    return router
  }

  throw new Error(`Router does not support this chain (chainId: ${chainId}).`)
}

async function getQuote(
  {
    tradeType,
    tokenIn,
    tokenOut,
    amount: amountRaw,
  }: {
    tradeType: TradeType
    tokenIn: any
    tokenOut: any
    amount: BigintIsh
  },
  router: AlphaRouter,
  routerConfig: Partial<AlphaRouterConfig>
): Promise<QuoteResult> {

  console.log("Checkpoint: getQuote")
  const tokenInIsNative = Object.values(SwapRouterNativeAssets).includes(tokenIn.address as SwapRouterNativeAssets)
  const tokenOutIsNative = Object.values(SwapRouterNativeAssets).includes(tokenOut.address as SwapRouterNativeAssets)
  console.log("Checkpoint: getQuote2")
    let currencyIn;
    if (tokenInIsNative) {
        console.log("Checkpoint: tokenInIsNative")
        currencyIn = nativeOnChain(tokenIn.chainId);  // Use the native token for the chain if tokenIn is native
    } else {
        console.log("Checkpoint: !tokenInIsNative tokenIn: ", tokenIn)
        currencyIn = new Token(tokenIn.chainId, tokenIn.address, tokenIn.decimals, tokenIn.symbol);  // Otherwise, create a new token
    }

    // Determine the output currency type
    let currencyOut;
    if (tokenOutIsNative) {
        console.log("Checkpoint: tokenOutIsNative")
        currencyOut = nativeOnChain(tokenOut.chainId);  // Use the native token for the chain if tokenOut is native
    } else {
        console.log("Checkpoint: !tokenOutIsNative")
        currencyOut = new Token(tokenOut.chainId, tokenOut.address, tokenOut.decimals, tokenOut.symbol);  // Otherwise, create a new token
    }

  const baseCurrency = tradeType === TradeType.EXACT_INPUT ? currencyIn : currencyOut
  const quoteCurrency = tradeType === TradeType.EXACT_INPUT ? currencyOut : currencyIn
    
  console.log("baseCurrency", baseCurrency)
  console.log("quoteCurrency", quoteCurrency)
  const amount = CurrencyAmount.fromRawAmount(baseCurrency, JSBI.BigInt(amountRaw))
  // TODO (WEB-2055): explore initializing client side routing on first load (when amountRaw is null) if there are enough users using client-side router preference.
  const swapRoute = await router.route(amount, quoteCurrency, tradeType, /*swapConfig=*/ undefined, routerConfig)
  console.log("swapRoute", swapRoute)
  if (!swapRoute) {
    return { state: QuoteState.NOT_FOUND }
  }

  return transformSwapRouteToGetQuoteResult(tradeType, amount, swapRoute)
}

export async function getClientSideQuote(
  {
    tokenInAddress,
    tokenInChainId,
    tokenInDecimals,
    tokenInSymbol,
    tokenOutAddress,
    tokenOutChainId,
    tokenOutDecimals,
    tokenOutSymbol,
    amount,
    tradeType,
  }: GetQuoteArgs,
  router: AlphaRouter,
  config: Partial<AlphaRouterConfig>
) {
  return getQuote(
    {
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
    },
    router,
    config
  )
}
