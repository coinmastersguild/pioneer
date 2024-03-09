/*
        Maya Swap Integration 
                - Highlander
 */

const TAG = " | maya | "
import { BaseDecimal } from '@coinmasters/types';
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')()
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip")
let network = require("@pioneer-platform/maya-network")
const { createMemo, parseMemo } = require('@pioneer-platform/pioneer-coins');

let Web3 = require('web3');
let service = process.env['PARITY_ARCHIVE_NODE']
if(!service) throw Error("Missing PARITY_ARCHIVE_NODE in .env")
let web3 = new Web3(service);

let networkSupport = [
    ChainToNetworkId["BTC"],
    ChainToNetworkId["MAYA"],
    ChainToNetworkId["ETH"],
    ChainToNetworkId["THOR"],
    ChainToNetworkId["DASH"],
]

// Function to make a request to the node
async function nodeRequest(path: any) {
    try {
        const response = await fetch(`https://mayanode.mayachain.info/mayachain${path}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching from node:', error);
        throw error;
    }
}

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

function quoteFromPool(sellAmount: string, assetPoolAmount: string, runePoolAmount: string, maxSlippage: number): QuoteResult {
    // Convert string inputs to numbers and scale the sell amount
    const swapAmount = parseFloat(sellAmount) * 1e8; // Assuming 1e6 is the scaling factor for Maya
    const assetDepth = parseFloat(assetPoolAmount);
    const runeDepth = parseFloat(runePoolAmount);

    // Calculate the constant product
    const k = assetDepth * runeDepth;

    // New amount of the asset in the pool after the swap
    const newAssetDepth = assetDepth + swapAmount;

    // Calculate the amount of Rune received (or the other asset in the pool)
    const newRuneDepth = k / newAssetDepth;
    const runeReceived = runeDepth - newRuneDepth;

    // Scale back down the amount of Rune received
    const scaledRuneReceived = runeReceived / 1e6; // Adjust as per Rune's scaling factor

    // Calculate the actual rate of the swap
    const actualRate = scaledRuneReceived / (swapAmount / 1e6);

    // Calculate the ideal rate
    const idealRate = runeDepth / assetDepth;

    // Calculate the slippage
    const slippage = ((idealRate - actualRate) / idealRate) * 100;

    // Calculate amountOutMin considering the maximum slippage
    const amountOutMin = scaledRuneReceived * (1 - maxSlippage / 100);

    return {
        amountOutMin: amountOutMin.toFixed(6).toString(),
        amountOut: scaledRuneReceived.toFixed(6),
        slippage: Math.max(slippage, 0).toFixed(6)
    };
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

        //Get pools from network
        let pools = await network.getPools()
        if(!pools) throw Error("Unable to get pools from network!")
        // log.info(tag, "pools: ", pools)

        //get poolIn
        let poolIn = pools.find((p:any)=>p.asset == quote.sellAsset)
        // log.info(tag,"poolIn: ",poolIn)

        //get poolOut
        let poolOut = pools.find((p:any)=>p.asset == quote.buyAsset)

        output.meta = {
            quoteMode: "MAYA_SUPPORTED_TO_MAYA_SUPPORTED"
        }
        output.steps = 1
        output.complete = true
        output.id = uuid()

        let BaseDecimal = {
            ARB:18,
            AVAX:18,
            BCH:8,
            BNB:8,
            BSC:18,
            BTC:8,
            DASH:8,
            DGB:8,
            DOGE:8,
            ETH:18,
            BASE:18,
            EOS:6,
            GAIA:6,
            KUJI:6,
            LTC:8,
            MATIC:18,
            MAYA:10,
            OP:18,
            OSMO:6,
            XRP:6,
            THOR:8,
            ZEC:8
        }

        let asset = quote.sellAsset.split(".")[0]
        if(!asset) throw Error("unable to pasre asset from quote.sellAsset")
        // @ts-ignore
        const DECIMALS = BaseDecimal[asset];
        if(!DECIMALS) throw Error("unable to get DECIMALS for asset: "+asset)
        let BASE_UNIT = Math.pow(10, DECIMALS); // Dynamically set BASE_UNIT based on asset

        //TODO dynamic by asset?

        const sellAmountInBaseUnits = parseFloat(quote.sellAmount) * BASE_UNIT;

        //get quote
        let quoteFromNode:any
        let URL = `/quote/swap?from_asset=${quote.sellAsset}&to_asset=${quote.buyAsset}&amount=${sellAmountInBaseUnits}&destination=${quote.recipientAddress}`
        log.info("URL: ",URL)
        quoteFromNode = await nodeRequest(
            URL,
        )
        log.info("quoteFromNode: ",quoteFromNode)
        if(quoteFromNode.error) throw Error(quoteFromNode.error)
        // let amountOutEstimated = quoteFromNode.expected_amount_out
        let amountOutMin = quoteFromNode.amount_out_min
        let inboundAddress = quoteFromNode.inbound_address
        let amountOutEstimated = (parseInt(quoteFromNode.expected_amount_out) / BASE_UNIT).toFixed(DECIMALS);
        output.amountOut = amountOutEstimated
        
        let memoInput = {
            type: 'SWAP',
            asset: quote.buyAsset,
            destAddr: quote.recipientAddress,
            lim: null,
            interval: null,
            quantity: null,
            affiliate: null,
            fee: null,
            dexAggregatorAddr: null,
            finalAssetAddr: null,
            minAmountOut: null
        }
        const memo = createMemo(memoInput);
        log.info(tag,"memo: ",memo)

        let type:string

        //if input is thor or maya
        let chain = quote.sellAsset.split(".")[0]
        if(chain == "MAYA"){
            type = 'deposit'
        } else {
            type = 'transfer'
        }

        //if ETH or TOKEN
        /*
                 "type":"evm",
                 "chain":"eip155:1",
                 "txParams":{
                    "to":"0xD37BbE5744D730a1d98d8DC97c42F0Ca46aD7146",
                    "from":"0x141D9959cAe3853b035000490C03991eB70Fc4aC",
                    "data":"0x44bc937b0000000000000000000000006b3d972f26a721a7d0ee268eacdde4dd376d78c3000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000470de4df82000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000065ca5732000000000000000000000000000000000000000000000000000000000000003b3d3a633a717a667a756b6d7072793879346d647036787a3763793635656167747768616a7a766a373439323537703a313732323765333a72673a300000000000",
                    "value":"0x470de4df820000",
                    "gasLimit":null,
                    "gasPrice":null,
                    "maxPriorityFeePerGas":"14124574016",
                    "maxFeePerGas":"102050508454",
                    "nonce":null
                 }
         */
        let tx
        //create EVM tx
        if(chain === "ETH"){
            type = 'EVM'
            //got routers
            const inbounds = await nodeRequest('/inbound_addresses')
            console.log("inbounds: ",inbounds)
            const inbound = inbounds.find((i:any) => i.chain === 'ETH')
            console.log("inbound: ",inbound)
            let tokenAddress = (quote.sellAsset.split('-')[1] || '').toLowerCase()
            log.info("tokenAddress: ",tokenAddress)

            // const tokenContract = new web3.eth.Contract( tokenAddress,
            //     [
            //         'function decimals() view returns (uint8)',
            //         'function allowance(address owner, address spender) view returns (uint)',
            //         'function approve(address spender, uint value)',
            //     ]);

            //verify if token is approved
            // if (asset !== 'ETH.ETH') decimals = await contractToken.decimals()
            // const n = parseUnits(amount, decimals)
            // if (asset !== 'ETH.ETH') {
            //     const allowance = await contractToken.allowance(this.address, inbound.router)
            //     if (allowance < n) {
            //         await contractToken.approve(inbound.router, MaxUint256)
            //     }
            // }

            //if NOT then build BOTH tx's
            const depositAbi: any = [
                {
                    "constant": false,
                    "inputs": [
                        { "name": "tokenAddress", "type": "address" },
                        { "name": "to", "type": "address" },
                        { "name": "amount", "type": "uint256" },
                        { "name": "data", "type": "string" }
                    ],
                    "name": "deposit",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ];

            //create deposit tx
            const routerContract = new web3.eth.Contract(
                depositAbi,
                inbound.router,

            );
            log.info("routerContract: ",routerContract)
            //@TODO handle tokens and token decimals
            let quoteSellAmountInEther = web3.utils.toWei(quote.sellAmount, 'ether'); // Convert sell amount to Wei
            let numberBN = web3.utils.toBN(quoteSellAmountInEther); // Now it's safe to convert to BN
            // Convert BigNumber to a hex string
            let numberHex:string = '0x' + numberBN.toString(16);
            console.log("numberHex: ",numberHex)
            
            const data = routerContract.methods
                .deposit(
                    inbound.address,
                    '0x0000000000000000000000000000000000000000', // 0 = ETH
                    numberHex,
                    memo
                )
                .encodeABI()
            
            //TODO validate data
            
            //get price recommendation
            let gasLimit = await web3.eth.estimateGas({
                from: quote.senderAddress,
                to: inbound.router,
                value: 0,
                data: data,
            });
            gasLimit = gasLimit + gasLimit * 0.2;
            gasLimit = parseInt(gasLimit)
            log.info(tag, 'gasLimit: ', gasLimit);
            
            const block = await web3.eth.getBlock("latest");
            const baseFeePerGas = block.baseFeePerGas; // This is available in EIP-1559 compatible networks
            const gasPrice = await web3.eth.getGasPrice();

            // Calculate maxPriorityFeePerGas and maxFeePerGas dynamically based on the network conditions
            // These calculations are simplified and might need adjustment based on your specific requirements
            const maxPriorityFeePerGas = baseFeePerGas ? web3.utils.toBN(baseFeePerGas).div(web3.utils.toBN(2)).toString() : '0'; // Example calculation
            const maxFeePerGas = baseFeePerGas ? web3.utils.toBN(baseFeePerGas).mul(web3.utils.toBN(2)).toString() : gasPrice; // Example calculation

            const feeData = {
                gasPrice, // Legacy networks
                baseFeePerGas, // EIP-1559 networks
                maxPriorityFeePerGas, // EIP-1559 calculation
                maxFeePerGas // EIP-1559 calculation
            };
            console.log("feeData: ",feeData)
            // Calculate a 20% buffer and add it to the gasLimit
            // const buffer = gasLimit.mul(20).div(100); // 20% buffer
            // gasLimit = gasLimit.add(buffer);
            // //if gas limit is < 21000 then set to 21000
            // if (gasLimit.lt(ethers.BigNumber.from('36000'))) {
            //     gasLimit = ethers.BigNumber.from('36000');
            // }
            // const nonce = await web3.eth.getTransactionCount(quote.senderAddress, 'latest'); // 'latest' can be replaced with the desired block number
            // console.log("nonce: ",nonce)
            
            tx = {
                type,
                chain: ChainToNetworkId[quote.sellAsset.split(".")[0]],
                txParams: {
                    to:inbound.router,
                    from: quote.senderAddress,
                    data,
                    value:numberHex,
                    "gasLimit":Web3.utils.toHex(gasLimit),
                    "maxPriorityFeePerGas":maxPriorityFeePerGas,
                    "maxFeePerGas":maxFeePerGas,
                    "nonce":null
                }
            }
        } else {
            tx = {
                type,
                chain: ChainToNetworkId[quote.sellAsset.split(".")[0]],
                txParams: {
                    senderAddress: quote.senderAddress,
                    recipientAddress: quoteFromNode.inbound_address,
                    amount: quote.sellAmount,
                    token: quote.sellAsset.split(".")[1],
                    memo:quoteFromNode.memo || memo
                }
            }
        }

        output.txs = [
            tx
        ]
        
        return output;
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e;
    }
}
