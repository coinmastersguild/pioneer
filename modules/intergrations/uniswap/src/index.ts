/*
        Uniswap Integration
                - Highlander

    BASE
    https://docs.base.org/contracts/



 */

const TAG = " | Uniswap | "
import axios from 'axios';
import { BaseDecimal } from '@coinmasters/types';
// @ts-ignore
import { assetData } from '@pioneer-platform/pioneer-discovery';
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
import { MaxUint160, AllowanceTransfer, MaxAllowanceTransferAmount, PERMIT2_ADDRESS, PermitSingle } from '@uniswap/permit2-sdk'
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
const { ethers, BigNumber } = require('ethers');
import { utils, Wallet } from 'ethers'
import { CurrencyAmount, TradeType, Ether, Token, Percent, Currency } from '@uniswap/sdk-core'
import {
    SwapRouter,
} from "@uniswap/universal-router-sdk";
import {
    Trade as V3Trade,
    Pool,
    Route as RouteV3,
    nearestUsableTick,
    TickMath,
    TICK_SPACINGS,
    FeeAmount,
    toHex
} from '@uniswap/v3-sdk'
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/UniswapV3Pool.sol/UniswapV3Pool.json'

let networkSupport = [
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"],
]

const EIP155_MAINNET_CHAINS: any = {
    'eip155:1': {
        chainId: 1,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        name: 'Ethereum',
        logo: '/chain-logos/eip155-1.png',
        rgb: '99, 125, 234',
        universalRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
        rpc: 'https://eth.llamarpc.com',
        defaultGasLimit: 250000,
        namespace: 'eip155'
    },
    'eip155:8453': {
        chainId: 8453,
        WETH: '0x4200000000000000000000000000000000000006',
        name: 'Base',
        logo: '/chain-logos/base.png',
        rgb: '242, 242, 242',
        universalRouter: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
        rpc: 'https://mainnet.base.org',
        defaultGasLimit: 135120,
        namespace: 'eip155'
    }
}

const ERC20_ABI = [
    "function allowance(address owner, address spender) view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function transfer(address to, uint256 amount) returns (bool)",
    "function symbol() view returns (string)",
    "function decimals() view returns (uint8)"
];

module.exports = {
    init:function(settings:any){
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    assetSupport: function () {
        return getAssetSupport();
    },
    getQuote: function (quote:any) {
        return get_quote(quote);
    }
}

let getAssetSupport = function(){
    let tag = TAG + " | getAssetSupport | "
    try{
        //iterate over chains
        let allAssets = Object.keys(assetData)
        log.info(tag,"allAssets: ",allAssets)

        let supportedAssets:any = []
        for(let i =0; i < allAssets.length; i++){
            let asset = allAssets[i]
            let networkId = caipToNetworkId(asset)
            // console.log("networkId: ",networkId)
            if(networkSupport.indexOf(networkId) > -1){
                supportedAssets.push(asset)
            }
        }
        return supportedAssets
    }catch(e){
        console.error(e)
    }
}


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
        if (!networkSupport.includes(caipToNetworkId(quote.buyAsset))) {
            throw new Error("unsupported buyAsset");
        }
        if (!networkSupport.includes(caipToNetworkId(quote.sellAsset))) {
            throw new Error("unsupported sellAsset");
        }
        // if(!quote.permit2) throw new Error("missing permit2, required for uniswap")
        output.txs = []
        let from = quote.senderAddress
        // let slippageTolerance = quote.slippage
        let recipient = quote.recipientAddress
        output.sellAsset = {}
        output.source = 'uniswap'
        output.sellAsset.caip = quote.sellAsset
        output.sellAmount = quote.sellAmount
        output.buyAsset = {}
        output.buyAsset.caip = quote.buyAsset
        
        //NO CROSS CHAIN
        let inputChain = caipToNetworkId(quote.sellAsset)
        let outputChain = caipToNetworkId(quote.buyAsset)
        if(inputChain != outputChain) throw new Error("Cross Chain not supported")
        log.info("inputChain: ",inputChain)
        let providerUrl = EIP155_MAINNET_CHAINS[inputChain].rpc
        if(!providerUrl) throw new Error("missing providerUrl")
        log.info("providerUrl: ",providerUrl)

        let chainIdInt = parseInt(inputChain.replace('eip155:',''))
        log.info(tag,"chainIdInt: ",chainIdInt)
        let chainId = chainIdInt
        //TODO TEST provider for liveness
        //get procider for chain
        const provider = new ethers.providers.JsonRpcProvider(providerUrl); // Set your Ethereum RPC URL

        // Initialize contracts based on whether they are tokens
        let sellTokenContract, buyTokenContract;

        //get pool for contract
        let BUY_TOKEN, SELL_TOKEN;
        let BUY_TOKEN_ADDRESS, SELL_TOKEN_ADDRESS;
        if(quote.buyAsset.indexOf('erc20') > -1) {
            //token input get pool for input
            let buyTokenAddress = quote.buyAsset.split(":")[2].toLowerCase()
            BUY_TOKEN_ADDRESS = buyTokenAddress
            log.info("buyTokenAddress: ",buyTokenAddress)
            buyTokenContract = new ethers.Contract(buyTokenAddress.toLowerCase(), ERC20_ABI, provider);
            const symbolBuy = await buyTokenContract.symbol();
            const decimalsBuy = await buyTokenContract.decimals();

            //get balance
            let balance = await buyTokenContract.balanceOf(quote.senderAddress)
            log.info("balance: ",balance.toString())
            
            BUY_TOKEN = new Token(8453, buyTokenAddress, decimalsBuy, symbolBuy, symbolBuy.toLowerCase())
        } else {
            BUY_TOKEN = new Token(8453, '0x4200000000000000000000000000000000000006', 18, 'WETH')
            BUY_TOKEN_ADDRESS = '0x4200000000000000000000000000000000000006'
        }
        
        if(quote.sellAsset.indexOf('erc20') > -1) {
            //token output get pools for output
            let sellTokenAddress = quote.sellAsset.split(":")[2].toLowerCase()
            SELL_TOKEN_ADDRESS = sellTokenAddress
            log.info("sellTokenAddress: ",sellTokenAddress)
            sellTokenContract = new ethers.Contract(sellTokenAddress, ERC20_ABI, provider);
            const symbolSell = await sellTokenContract.symbol();
            const decimalsSell = await sellTokenContract.decimals();
            SELL_TOKEN = new Token(8453, sellTokenAddress, decimalsSell, symbolSell, symbolSell.toLowerCase())
            
        } else {
            //WETH
            SELL_TOKEN = new Token(8453, '0x4200000000000000000000000000000000000006', 18, 'WETH')
            SELL_TOKEN_ADDRESS = '0x4200000000000000000000000000000000000006'
        }

        // @ts-ignore
        // let POOL_PRO = await get_pool(BUY_TOKEN, SELL_TOKEN, FeeAmount.MEDIUM, 0, provider)
        // if(!POOL_PRO) throw new Error("missing POOL_PRO")
        
        const FEE_AMOUNT = FeeAmount.MEDIUM

        const inputPRO = utils.parseUnits('1000', 18).toString()
        
        //let mockedTrade = {"swaps":[{"route":{"_midPrice":{"numerator":[0,0,0,0,0,0,4096],"denominator":[61675844,569729604,374875920,86073376,789779649,857607051,27312043],"baseCurrency":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"quoteCurrency":{"chainId":8453,"decimals":18,"symbol":"ETH","name":"Ethereum","isNative":true,"isToken":false},"scalar":{"numerator":[660865024,931322574],"denominator":[660865024,931322574]}},"pools":[{"token0":{"chainId":8453,"decimals":18,"symbol":"WETH","isNative":false,"isToken":true,"address":"0x4200000000000000000000000000000000000006"},"token1":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"fee":3000,"sqrtRatioX96":[976906734,801624171,99421808,5226],"liquidity":[669390988,785588334,1],"tickCurrent":88055,"tickDataProvider":{},"_token1Price":{"numerator":[0,0,0,0,0,0,4096],"denominator":[61675844,569729604,374875920,86073376,789779649,857607051,27312043],"baseCurrency":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"quoteCurrency":{"chainId":8453,"decimals":18,"symbol":"WETH","isNative":false,"isToken":true,"address":"0x4200000000000000000000000000000000000006"},"scalar":{"numerator":[660865024,931322574],"denominator":[660865024,931322574]}}}],"tokenPath":[{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},{"chainId":8453,"decimals":18,"symbol":"WETH","isNative":false,"isToken":true,"address":"0x4200000000000000000000000000000000000006"}],"input":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"output":{"chainId":8453,"decimals":18,"symbol":"ETH","name":"Ethereum","isNative":true,"isToken":false},"protocol":"V3","path":[{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},{"chainId":8453,"decimals":18,"symbol":"WETH","isNative":false,"isToken":true,"address":"0x4200000000000000000000000000000000000006"}]},"inputAmount":{"numerator":[166199296,723291154,8],"denominator":[1],"currency":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"decimalScale":[660865024,931322574]},"outputAmount":{"numerator":[711636223,1308984],"denominator":[1],"currency":{"chainId":8453,"decimals":18,"symbol":"ETH","name":"Ethereum","isNative":true,"isToken":false},"decimalScale":[660865024,931322574]}}],"routes":[{"_midPrice":{"numerator":[0,0,0,0,0,0,4096],"denominator":[61675844,569729604,374875920,86073376,789779649,857607051,27312043],"baseCurrency":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"quoteCurrency":{"chainId":8453,"decimals":18,"symbol":"ETH","name":"Ethereum","isNative":true,"isToken":false},"scalar":{"numerator":[660865024,931322574],"denominator":[660865024,931322574]}},"pools":[{"token0":{"chainId":8453,"decimals":18,"symbol":"WETH","isNative":false,"isToken":true,"address":"0x4200000000000000000000000000000000000006"},"token1":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"fee":3000,"sqrtRatioX96":[976906734,801624171,99421808,5226],"liquidity":[669390988,785588334,1],"tickCurrent":88055,"tickDataProvider":{},"_token1Price":{"numerator":[0,0,0,0,0,0,4096],"denominator":[61675844,569729604,374875920,86073376,789779649,857607051,27312043],"baseCurrency":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"quoteCurrency":{"chainId":8453,"decimals":18,"symbol":"WETH","isNative":false,"isToken":true,"address":"0x4200000000000000000000000000000000000006"},"scalar":{"numerator":[660865024,931322574],"denominator":[660865024,931322574]}}}],"tokenPath":[{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},{"chainId":8453,"decimals":18,"symbol":"WETH","isNative":false,"isToken":true,"address":"0x4200000000000000000000000000000000000006"}],"input":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"output":{"chainId":8453,"decimals":18,"symbol":"ETH","name":"Ethereum","isNative":true,"isToken":false},"protocol":"V3","path":[{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},{"chainId":8453,"decimals":18,"symbol":"WETH","isNative":false,"isToken":true,"address":"0x4200000000000000000000000000000000000006"}]}],"tradeType":0,"fillType":"classic","approveInfo":{"needsApprove":false},"gasUseEstimate":164000,"gasUseEstimateUSD":0.005144,"blockNumber":"13097036","requestId":"747525fe-2ccf-494b-b0d3-677e2ebda037","quoteMethod":"ROUTING_API","swapFee":{"recipient":"0x067170777BA8027cED27E034102D54074d062d71","percent":{"numerator":[25],"denominator":[10000],"isPercent":true},"amount":"3522585411987"},"_outputAmount":{"numerator":[711636223,1308984],"denominator":[1],"currency":{"chainId":8453,"decimals":18,"symbol":"ETH","name":"Ethereum","isNative":true,"isToken":false},"decimalScale":[660865024,931322574]},"_inputAmount":{"numerator":[166199296,723291154,8],"denominator":[1],"currency":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"decimalScale":[660865024,931322574]},"_priceImpact":{"numerator":[941165072,174164585,107079465,969784123,796584146,369125678,162674660,985493716,122670731,392389178,573847026,872116559,752945511,679526963,814010822,56],"denominator":[0,0,0,0,0,0,0,706548328,653255527,1067448068,1064290579,550590138,219848419,764239412,729848924,903],"isPercent":true},"_executionPrice":{"numerator":[711636223,1308984],"denominator":[166199296,723291154,8],"baseCurrency":{"chainId":8453,"decimals":18,"symbol":"PRO","isNative":false,"isToken":true,"address":"0xEF743df8eDa497bCf1977393c401A636518DD630"},"quoteCurrency":{"chainId":8453,"decimals":18,"symbol":"ETH","name":"Ethereum","isNative":true,"isToken":false},"scalar":{"numerator":[660865024,931322574],"denominator":[660865024,931322574]}}}
        let args:any = {
            tokenInAddress: SELL_TOKEN_ADDRESS,
            tokenInChainId: chainIdInt,
            tokenOutAddress: BUY_TOKEN_ADDRESS,
            tokenOutChainId: chainIdInt,
            amount:
                "10000000000000000000",
            tradeType:'EXACT_INPUT',
            sendPortionEnabled:true,
        }
        enum Protocol {
            V2 = "V2",
            V3 = "V3",
            MIXED = "MIXED"
        }
        enum QuoteIntent {
            Pricing = 'pricing',
            Quote = 'quote',
        }
        const CLIENT_PARAMS = {
            protocols: [Protocol.V2, Protocol.V3, Protocol.MIXED],
        }


        const {
            tokenInAddress: tokenIn,
            tokenInChainId,
            tokenOutAddress: tokenOut,
            tokenOutChainId,
            amount,
            tradeType,
            sendPortionEnabled,
        } = args
        const requestBody = {
            tokenInChainId,
            tokenIn,
            tokenOutChainId,
            tokenOut,
            amount,
            sendPortionEnabled,
            type: 'EXACT_INPUT',
            intent: QuoteIntent.Quote,
            configs: [
                {
                    "protocols": [
                        "V2",
                        "V3",
                        "MIXED"
                    ],
                    "enableUniversalRouter": true,
                    "routingType": "CLASSIC",
                    "recipient": from,
                    "enableFeeOnTransferFeeFetching": true
                }
            ],
        }
        // const UNISWAP_GATEWAY_DNS_URL = 'https://interface.gateway.uniswap.org/v2'
        log.info("requestBody: ", requestBody)
        log.info("requestBody: ", JSON.stringify(requestBody))
        let response:any = await axios({
            method: 'POST',
            url: 'https://interface.gateway.uniswap.org/v2/quote',
            data: requestBody,
            headers: {
                'x-request-source': 'uniswap-web',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
                'Origin': 'http://localhost:3000',
                'Referer': 'http://localhost:3000',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            }
        });
        log.info(tag,'response', response.data)
        const uraQuoteResponse = response.data as any
        log.info(tag,'uraQuoteResponse', uraQuoteResponse)
        output.amountOut = uraQuoteResponse.quote.quoteDecimals
        output.gas = uraQuoteResponse.quote.gasUseEstimate
        output.gasUsd = uraQuoteResponse.quote.gasUseEstimateUSD
        output.id = uraQuoteResponse.quote.requestId
        output.slippage = uraQuoteResponse.quote.slippage
        // @ts-ignore
        let calldata = uraQuoteResponse.quote.methodParameters.calldata
        // @ts-ignore
        let value = uraQuoteResponse.quote.methodParameters.value
 
        log.info("calldata: ",calldata)
        log.info("value: ",value)
        const nonce = await provider.getTransactionCount(from, "latest");
        log.info("nonce: ",nonce)
        let gas = `0x${BigInt("935120").toString(16)}` // 935120
        const gasPrice = await provider.getGasPrice();
        log.info("gasPrice: ",gasPrice.toString())
        const adjustedGasPrice = gasPrice.mul(ethers.BigNumber.from(110)).div(ethers.BigNumber.from(100)); // Example: Increase by 10%
        let  isZero = function isZero(hexNumberString: string) {
            return hexNumberString === '0' || /^0x0*$/.test(hexNumberString)
        }
        const tx = {
            from,
            to: EIP155_MAINNET_CHAINS['eip155:'+chainId].universalRouter,
            chainId,
            data: calldata,
            // TODO: universal-router-sdk returns a non-hexlified value.
            ...(value && !isZero(value) ? { value: toHex(value) } : {}),
            gas,
            gasPrice: toHex(adjustedGasPrice),
            nonce: toHex(nonce),
        }
        output.txs.push({
            type:"evm",
            description:'swap tokens',
            chain:inputChain,
            txParams: tx
        })

        output.meta = {
            quoteMode: "ERC20-ERC20"
        }
        output.steps = 1
        output.complete = true
        output.type = 'EVM'

        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e;
    }
}
