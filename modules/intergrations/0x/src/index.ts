/*
        0x Swap Integration 
                - Highlander
 */

const TAG = " | 0x | "
// Define a simple BaseDecimal type instead of importing from @coinmasters/types
type BaseDecimal = string | number;

const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
let network = require("@pioneer-platform/maya-network")
const axios = require('axios');

const API_KEY = process.env['0X_API_SECRET']
if(!API_KEY) throw Error("Missing 0X_API_SECRET")

let networkSupport = [
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"]
]

const EIP155_MAINNET_CHAINS: any = {
    'eip155:1': {
        chainId: 1,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        name: 'Ethereum',
        rgb: '99, 125, 234',
        rpc: 'https://eth.llamarpc.com',
        defaultGasLimit: 250000,
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
        rgb: '242, 242, 242',
        rpc: 'https://mainnet.base.org',
        defaultGasLimit: 135120,
        namespace: 'eip155'
    }
}

const networkApis:any = {
    "eip155:1": "https://api.0x.org/",
    "eip155:11155111": "https://sepolia.api.0x.org/",
    "eip155:137": "https://polygon.api.0x.org/",
    "eip155:56": "https://bsc.api.0x.org/",
    "eip155:10": "https://optimism.api.0x.org/",
    "eip155:250": "https://fantom.api.0x.org/",
    "eip155:42220": "https://celo.api.0x.org/",
    "eip155:43114": "https://avalanche.api.0x.org/",
    "eip155:42161": "https://arbitrum.api.0x.org/",
    "eip155:8453": "https://base.api.0x.org/"
};

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

interface QuoteResult {
    amountOutMin: string;
    amountOut: string;
    slippage: string;
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

        let inputChain = caipToNetworkId(quote.sellAsset)
        let outputChain = caipToNetworkId(quote.buyAsset)
        if(inputChain != outputChain) throw new Error("Cross Chain not supported")

        let buyToken = quote.buyAsset.split(':')[2];
        log.info(tag,"buyToken: ", buyToken)
        if (buyToken === "60") { // Assuming the '60' refers to ETH
            buyToken = EIP155_MAINNET_CHAINS[outputChain].WETH; // Use WETH address if available, else fallback to the original token
        }

        let sellToken = quote.sellAsset.split(':')[2];
        log.info(tag,"sellToken: ", sellToken)
        if (sellToken === "slip44:60") { // Assuming the '60' refers to ETH
            sellToken = EIP155_MAINNET_CHAINS[inputChain].WETH; // Use WETH address if available, else fallback to the original token
        }
        
        let sellAmount = quote.sellAmount
        
        output.meta = {
            quoteMode: "ERC20-ERC20"
        }
        output.steps = 1
        output.complete = true
        output.id = uuid()
        
        log.info(tag,"sellToken: ", sellToken)
        log.info(tag,"buyToken: ", buyToken)
        log.info(tag,"sellAmount: ", sellAmount)
        // @ts-ignore
        const apiUrl = networkApis[inputChain];
        if (!apiUrl) throw new Error("Network not supported");
        if(!sellToken || !buyToken || !sellAmount) throw new Error("missing required params")
        const url = `${apiUrl}swap/v1/quote?sellToken=${sellToken.toLowerCase()}&buyToken=${buyToken.toLowerCase()}&sellAmount=${sellAmount}`;
        const headers = {
            '0x-api-key': API_KEY
        };

        const response = await axios.get(url, { headers });
        log.info(tag, "response: ", response.data);

        output.txs = [
            // tx
        ]
        
        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        console.error(tag, "e: ", JSON.stringify(e))
        throw e;
    }
}
