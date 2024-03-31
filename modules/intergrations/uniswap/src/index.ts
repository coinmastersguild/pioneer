/*
        Uniswap Integration
                - Highlander

    BASE
    https://docs.base.org/contracts/



 */

const TAG = " | Uniswap | "
import { BaseDecimal } from '@coinmasters/types';
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
const { createMemo, parseMemo } = require('@pioneer-platform/pioneer-coins');
const { Pair, WETH, Route, Trade, TokenAmount } = require('@uniswap/v2-sdk'); // Import necessary components from v2-sdk

import { BaseProvider } from '@ethersproject/providers'
import JSBI from 'jsbi'
// import { ethers } from 'ethers'
import { TradeType, Token, CurrencyAmount, BigintIsh, ChainId } from '@uniswap/sdk-core'
import { Trade as V2TradeSDK } from '@uniswap/v2-sdk'
import { Trade as V3TradeSDK } from '@uniswap/v3-sdk'
import { SwapRouter, MixedRouteTrade, MixedRouteSDK, Trade as RouterTrade } from '@uniswap/router-sdk'
import {
    UNIVERSAL_ROUTER_ADDRESS,
    ROUTER_AS_RECIPIENT,
    PERMIT2_ADDRESS,
    CommandType,
    UniswapTrade,
    RoutePlanner,
    SeaportTrade,
    SeaportData
} from "@uniswap/universal-router-sdk";

const { ethers } = require('ethers');

let PERMIT2_BASE = '0x000000000022D473030F116dDEE9F6B43aC78BA3'

import type { AlphaRouterConfig } from '@uniswap/smart-order-router'
// This file is lazy-loaded, so the import of smart-order-router is intentional.
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import {
    AlphaRouter,
    OnChainQuoteProvider,
    routeAmountsToString,
    StaticV2SubgraphProvider,
    UniswapMulticallProvider,
} from '@uniswap/smart-order-router'

//TODO - add all networks
let networkSupport = [
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"],
]
import { Protocol } from '@uniswap/router-sdk'
const protocols: Protocol[] = [Protocol.V2, Protocol.V3, Protocol.MIXED]

module.exports = {
    init:function(settings:any){
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    getQuote: function (quote:any) {
        return get_quote(quote);
    },
}
// Router Helpers
export const MAX_UINT = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
export const MAX_UINT160 = '0xffffffffffffffffffffffffffffffffffffffff'
export const DEADLINE = 2000000000
export const CONTRACT_BALANCE = '0x8000000000000000000000000000000000000000000000000000000000000000'
export const ALREADY_PAID = 0
export const ALICE_ADDRESS = '0x28c6c06298d514db089934071355e5743bf21d60'
export const ETH_ADDRESS = ethers.constants.AddressZero
export const ZERO_ADDRESS = ethers.constants.AddressZero
export const ONE_PERCENT_BIPS = 100
export const MSG_SENDER: string = '0x0000000000000000000000000000000000000001'
export const ADDRESS_THIS: string = '0x0000000000000000000000000000000000000002'
export const SOURCE_MSG_SENDER: boolean = true
export const SOURCE_ROUTER: boolean = false

// Protocol Data
export const OPENSEA_CONDUIT = '0x1E0049783F008A0085193E00003D00cd54003c71'
export const OPENSEA_CONDUIT_KEY = '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000'

// NFT Addresses
export const COVEN_ADDRESS = '0x5180db8f5c931aae63c74266b211f580155ecac8'
export const DECENTRA_DRAGON_ADDRESS = '0xAA107cCFe230a29C345Fd97bc6eb9Bd2fccD0750'
export const TOWNSTAR_ADDRESS = '0xc36cF0cFcb5d905B8B513860dB0CFE63F6Cf9F5c'
export const TWERKY_ADDRESS = '0xf4680c917a873e2dd6ead72f9f433e74eb9c623c'
export const MILADY_ADDRESS = '0x5af0d9827e0c53e4799bb226655a1de152a425a5'
export const ALPHABETTIES_ADDRESS = '0x6d05064fe99e40f1c3464e7310a23ffaded56e20'
export const MENTAL_WORLDS_ADDRESS = '0xEf96021Af16BD04918b0d87cE045d7984ad6c38c'
export const CAMEO_ADDRESS = '0x93317E87a3a47821803CAADC54Ae418Af80603DA'
export const ENS_NFT_ADDRESS = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'
export const CRYPTOPUNKS_MARKET_ADDRESS = '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB'
export const NFTX_COVEN_VAULT = '0xd89b16331f39ab3878daf395052851d3ac8cf3cd'
export const NFTX_COVEN_VAULT_ID = '333'
export const NFTX_MILADY_VAULT = '0x227c7df69d3ed1ae7574a1a7685fded90292eb48'
export const NFTX_MILADY_VAULT_ID = '392'
export const NFTX_ERC_1155_VAULT = '0x78e09c5ec42d505742a52fd10078a57ea186002a'
export const NFTX_ERC_1155_VAULT_ID = '61'

// Constructor Params
export const V2_FACTORY_MAINNET = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
export const V3_FACTORY_MAINNET = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const V3_INIT_CODE_HASH_MAINNET = '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
export const V2_INIT_CODE_HASH_MAINNET = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

export const ROUTER_REWARDS_DISTRIBUTOR = '0x0000000000000000000000000000000000000000'
export const LOOKSRARE_REWARDS_DISTRIBUTOR = '0x0554f068365eD43dcC98dcd7Fd7A8208a5638C72'
export const LOOKSRARE_TOKEN = '0xf4d2888d29D722226FafA5d9B24F9164c092421E'

let BASE_UNIVERSIAL_ROUTER = {
    "UniversalRouterV1_2": "0xeC8B0F7Ffe3ae75d7FfAb09429e3675bb63503e4",
    "UniversalRouterV1_2_V2Support": "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    "UnsupportedProtocol": "0x9E18Efb3BE848940b0C92D300504Fb08C287FE85"
}

let ETH_UNIVERSIAL_ROUTER = {
    "UniversalRouter": "0xEf1c6E67703c7BD7107eed8303Fbe6EC2554BF6B",
    "UniversalRouterV1_2": "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
    "UnsupportedProtocol": "0x76D631990d505E4e5b432EEDB852A60897824D68"
}

const BASE_CONTRACTS = {
    Permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    UniversalRouter: "0x198EF79F1F515F02dFE9e3115eD9fC07183f02fC",
    V3CoreFactory: "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
    Multicall: "0x091e99cb1C49331a94dD62755D168E941AbD0693",
    ProxyAdmin: "0x3334d83e224aF5ef9C2E7DDA7c7C98Efd9621fA9",
    TickLens: "0x0CdeE061c75D43c82520eD998C23ac2991c9ac6d",
    NftDescriptor: "0xF9d1077fd35670d4ACbD27af82652a8d84577d9F",
    NonfungibleTokenPositionDescriptor: "0x4f225937EDc33EFD6109c4ceF7b560B2D6401009",
    DescriptorProxy: "0x4615C383F85D0a2BbED973d83ccecf5CB7121463",
    NonfungibleTokenPositionManager: "0x03a520b32C04BF3bEEf7BEb72E919cf822Ed34f1",
    V3Migrator: "0x23cF10b1ee3AdfCA73B0eF17C07F7577e7ACd2d7",
    V3Staker: "0x42bE4D6527829FeFA1493e1fb9F3676d2425C3C1",
    QuoterV2: "0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a",
    SwapRouter: "0x2626664c2603336E57B271c5C0b26F421741e481"
};

const EIP155_MAINNET_CHAINS: any = {
    'eip155:1': {
        chainId: 1,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        name: 'Ethereum',
        logo: '/chain-logos/eip155-1.png',
        rgb: '99, 125, 234',
        permit2: PERMIT2_ADDRESS,
        rpc: 'https://eth.llamarpc.com',
        namespace: 'eip155'
    },
    // 'eip155:43114': {
    //     chainId: 43114,
    //     name: 'Avalanche C-Chain',
    //     logo: '/chain-logos/eip155-43113.png',
    //     rgb: '232, 65, 66',
    //     rpc: 'https://api.avax.network/ext/bc/C/rpc',
    //     namespace: 'eip155'
    // },
    // 'eip155:137': {
    //     chainId: 137,
    //     name: 'Polygon',
    //     logo: '/chain-logos/eip155-137.png',
    //     rgb: '130, 71, 229',
    //     rpc: 'https://polygon-rpc.com/',
    //     namespace: 'eip155'
    // },
    // 'eip155:10': {
    //     chainId: 10,
    //     name: 'Optimism',
    //     logo: '/chain-logos/eip155-10.png',
    //     rgb: '235, 0, 25',
    //     rpc: 'https://mainnet.optimism.io',
    //     namespace: 'eip155'
    // },
    // 'eip155:324': {
    //     chainId: 324,
    //     name: 'zkSync Era',
    //     logo: '/chain-logos/eip155-324.svg',
    //     rgb: '242, 242, 242',
    //     rpc: 'https://mainnet.era.zksync.io/',
    //     namespace: 'eip155'
    // },
    'eip155:8453': {
        chainId: 8453,
        WETH: '0x4200000000000000000000000000000000000006',
        name: 'Base',
        logo: '/chain-logos/base.png',
        rgb: '242, 242, 242',
        permit2: BASE_CONTRACTS.Permit2,
        rpc: 'https://mainnet.base.org',
        namespace: 'eip155'
    }
}

const ERC20_ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)"
];

const routersCache = new WeakMap<BaseProvider, { [chainId: number]: AlphaRouter }>()


function getRouter(chainId: any, provider: any): any {
    const routers = routersCache.get(provider) || {}
    const cached = routers[chainId]
    if (cached) return cached

    // V2 is unsupported for chains other than mainnet.
    // TODO(zzmp): Upstream to @uniswap/smart-order-router, exporting an enum of supported v2 chains for clarity.
    let v2SubgraphProvider
    if (chainId !== ChainId.MAINNET) {
        v2SubgraphProvider = new StaticV2SubgraphProvider(chainId)
    }

    // V3 computes on-chain, so the quoter must have gas limits appropriate to the provider.
    // Most defaults are fine, but polygon needs a lower gas limit.
    // TODO(zzmp): Upstream to @uniswap/smart-order-router, possibly making this easier to modify
    // (eg allowing configuration without an instance to avoid duplicating multicall2Provider).
    let onChainQuoteProvider
    let multicall2Provider
    if ([ChainId.POLYGON, ChainId.POLYGON_MUMBAI].includes(chainId)) {
        multicall2Provider = new UniswapMulticallProvider(chainId, provider, 375_000)
        // See https://github.com/Uniswap/smart-order-router/blob/98c58bdee9981fd9ffac9e7d7a97b18302d5f77a/src/routers/alpha-router/alpha-router.ts#L464-L487
        onChainQuoteProvider = new OnChainQuoteProvider(
            chainId,
            provider,
            multicall2Provider,
            {
                retries: 2,
                minTimeout: 100,
                maxTimeout: 1000,
            },
            {
                multicallChunk: 10,
                gasLimitPerCall: 5_000_000,
                quoteMinSuccessRate: 0.1,
            },
            {
                gasLimitOverride: 5_000_000,
                multicallChunk: 5,
            },
            {
                gasLimitOverride: 6_250_000,
                multicallChunk: 4,
            }
        )
    }

    const router = new AlphaRouter({ chainId, provider, v2SubgraphProvider, multicall2Provider, onChainQuoteProvider })
    routers[chainId] = router
    routersCache.set(provider, routers)
    return router
}

enum SwapRouterNativeAssets {
    MATIC = 'MATIC',
    ETH = 'ETH',
}


const getMinAmountOut = async function({
                                           path,
                                           chainId,
                                           amountIn,
                                           slippageTolerance,
                                           provider
                                       }:any) {
    const tag = " | getMinAmountOut | ";
    try {
        // Ensure addresses are checksummed
        const [sellTokenAddress, buyTokenAddress] = path.map((address: any) => ethers.utils.getAddress(address));
        console.info(`${tag} sellTokenAddress: ${sellTokenAddress}, buyTokenAddress: ${buyTokenAddress}`);

        // Fetch decimals for tokens dynamically, defaulting to 18 for ETH
        const sellTokenDecimals = sellTokenAddress !== ethers.constants.AddressZero ?
            await new ethers.Contract(sellTokenAddress, ERC20_ABI, provider).decimals() : 18;
        const buyTokenDecimals = buyTokenAddress !== ethers.constants.AddressZero ?
            await new ethers.Contract(buyTokenAddress, ERC20_ABI, provider).decimals() : 18;

       log.info(`${tag} sellTokenDecimals: ${sellTokenDecimals}, buyTokenDecimals: ${buyTokenDecimals}`);

        // Parse amountIn to BigNumber using sell token's decimals
        const amountInBigNumber = ethers.utils.parseUnits(amountIn.toString(), sellTokenDecimals);
        log.info(`${tag} amountInBigNumber: ${amountInBigNumber.toString()}`)

        let chainIdInt = parseInt(chainId.replace('eip155:',''))
        log.info(tag,"chainIdInt: ",chainIdInt)

        // Create Token instances for Uniswap SDK
        const sellToken = sellTokenAddress === ethers.constants.AddressZero ?
            WETH[ChainId.MAINNET] : new Token(chainIdInt, sellTokenAddress, sellTokenDecimals);

        const buyToken = buyTokenAddress === ethers.constants.AddressZero ?
            WETH[ChainId.MAINNET] : new Token(chainIdInt, buyTokenAddress, buyTokenDecimals);

        log.info(tag,"sellToken: ",sellToken)
        log.info(tag,"buyToken: ",buyToken)
        const router = getRouter(chainIdInt, provider)
        // log.info(tag,"router: ",router)
        const amount = CurrencyAmount.fromRawAmount(buyToken, JSBI.BigInt(amountInBigNumber ?? '1')) // a null amountRaw should initialize the route
        log.info(tag,"amount: ",amount)
        
        const route = await router.route(amount, sellToken, TradeType.EXACT_INPUT, /*swapConfig=*/ undefined, { protocols })
        log.info(tag,"route: ",route)


    } catch (e) {
        console.error(tag, "Error in getMinAmountOut: ", e);
        throw e;
    }
};
const get_quote = async function (quote:any) {
    let tag = TAG + " | get_quote | "
    try {
        let output:any = {}
        if(!quote.sellAsset) throw new Error("missing sellAsset")
        if(!quote.buyAsset) throw new Error("missing buyAsset")
        if(!quote.sellAmount) throw new Error("missing sellAmount")
        if(!quote.senderAddress) throw new Error("missing senderAddress")
        if(!quote.recipientAddress) throw new Error("missing recipientAddress")
        if(!quote.slippage) throw new Error("missing slippage")

        let slippageTolerance = quote.slippage
        let recipient = quote.recipientAddress

        //NO CROSS CHAIN
        let inputChain = caipToNetworkId(quote.sellAsset)
        let outputChain = caipToNetworkId(quote.buyAsset)
        if(inputChain != outputChain) throw new Error("Cross Chain not supported")
        let providerUrl = EIP155_MAINNET_CHAINS[inputChain].rpc
        if(!providerUrl) throw new Error("missing providerUrl")
        log.info("providerUrl: ",providerUrl)
        
        //TODO TEST provider for liveness
        //get procider for chain
        const provider = new ethers.providers.JsonRpcProvider(providerUrl); // Set your Ethereum RPC URL

        // Initialize contracts based on whether they are tokens
        let sellTokenContract, buyTokenContract;

        //get pool for contract
        if(quote.buyAsset.indexOf('erc20') > -1) {
            //token input get pool for input
            let buyTokenAddress = quote.buyAsset.split(":")[2]
            log.info("buyTokenAddress: ",buyTokenAddress)
            buyTokenContract = new ethers.Contract(buyTokenAddress, ERC20_ABI, provider);
            //get balance
            let balance = await buyTokenContract.balanceOf(quote.senderAddress)
            log.info("balance: ",balance.toString())
        }
        
        if(quote.sellAsset.indexOf('erc20') > -1) {
            //token output get pools for output
            let sellTokenAddress = quote.sellAsset.split(":")[2]
            log.info("sellTokenAddress: ",sellTokenAddress)
            sellTokenContract = new ethers.Contract(sellTokenAddress, ERC20_ABI, provider);
        }
        //permit2
        let permit2 = PERMIT2_ADDRESS
        let router = UNIVERSAL_ROUTER_ADDRESS
        let planner = new RoutePlanner()

        //sellAmountBigNumber
        const sellAmountBigNumber = ethers.utils.parseUnits(quote.sellAmount.toString(), 'ether');

        let path
        //build path
        if(sellTokenContract && !buyTokenContract){
            path = [sellTokenContract.address, EIP155_MAINNET_CHAINS[inputChain].WETH]
        } else if(!sellTokenContract && buyTokenContract){
            path = [EIP155_MAINNET_CHAINS[inputChain].WETH, buyTokenContract.address]
        } else if(sellTokenContract && buyTokenContract){
            path = [sellTokenContract.address, buyTokenContract.address]
        }
        log.info("path: ",path)
        // @ts-ignore
        if ((path[0] !== undefined && path[1] !== undefined) && path[0] === path[1]) {
            throw new Error("Both tokens are the same");
        }
        //get minOut based on spread. quote.slippage is a percentage sent as int
        let minAmountOut = await getMinAmountOut(            {
            path,
            chainId:inputChain,
            sellTokenContract,
            buyTokenContract,
            amountIn: quote.sellAmount,
            slippageTolerance: quote.slippage,
            provider
        })
        console.log("minAmountOut: ",minAmountOut)
        
        //this is ONLY on input token
        //before we begin we need to check if the token is approved
        if(sellTokenContract){
            const permit2Address = EIP155_MAINNET_CHAINS[inputChain].permit2; // Permit2 contract address or Uniswap Router address
            if(!permit2Address) throw new Error("missing permit2Address for chain: "+inputChain)
            console.log("sellTokenContract: ",sellTokenContract.toString())
            // Check current allowance
            const currentAllowance = await sellTokenContract.allowance(quote.senderAddress, permit2Address);
            console.log("currentAllowance: ",currentAllowance.toString())
            
            console.log("sellAmountBigNumber: ",sellAmountBigNumber.toString())
            if (currentAllowance.lt(sellAmountBigNumber)) {
                // Requesting approval: Setting allowance to Max UINT256 for simplicity
                throw Error("TODO write code for allowance!")
            }
        }



        // Uniswap V2 Factory Address (on Ethereum Mainnet)
        // planner.addCommand(CommandType.V3_SWAP_EXACT_IN, [
        //     MSG_SENDER,
        //     sellAmountBigNumber,
        //     minAmountOut,
        //     path,
        //     quote.senderAddress,
        // ])
        //
        //TODO build call data
        

        // const options = { slippageTolerance, recipient }
        // const tradeType = TradeType.EXACT_INPUT;
        //
        // const routerTrade = new RouterTrade({
        //     v2Routes,
        //     v3Routes,
        //     mixedRoutes,
        //     tradeType
        // }, options);
        
        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e;
    }
}
