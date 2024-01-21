/*
    Osmosis Swap Intergration
                -Highlander

 */



const TAG = " | osmosis | "


const log = require('@pioneer-platform/loggerdog')()
let {shortListSymbolToCaip} = require("@pioneer-platform/pioneer-caip")
let networkOsmo = require("@pioneer-platform/osmosis-network")
let networkAtom = require("@pioneer-platform/cosmos-network")
let networkSupport = [
    shortListSymbolToCaip["OSMO"], 
    shortListSymbolToCaip["GAIA"],
]


module.exports = {
    init:function(settings:any){
        return true
    },
    networkSupport: function () {
        return networkSupport
    },
    getQuote: function (quote:any) {
        return get_quote(quote);
    },
}


interface QuoteResult {
    amountOut: string;
    slippage: string;
}

function quoteFromPool(amountAtomSwap: string, amountAtomPool: string, amountOsmoPool: string): QuoteResult {
    // Convert string inputs to numbers and scale the swap amount
    const swapAmount = parseFloat(amountAtomSwap) * 1e6;
    const atomPoolAmount = parseFloat(amountAtomPool);
    const osmoPoolAmount = parseFloat(amountOsmoPool);

    // Calculate the constant product
    const k = atomPoolAmount * osmoPoolAmount;

    // New amount of ATOM in the pool after the swap
    const newAtomPoolAmount = atomPoolAmount + swapAmount;

    // Calculate the amount of OSMO received
    const newOsmoPoolAmount = k / newAtomPoolAmount;
    const osmoReceived = osmoPoolAmount - newOsmoPoolAmount;

    // Scale back down the amount of OSMO received
    const scaledOsmoReceived = osmoReceived / 1e6;

    // Calculate the actual rate of the swap
    const actualRate = scaledOsmoReceived / (swapAmount / 1e6);

    // Calculate the ideal rate
    const idealRate = osmoPoolAmount / atomPoolAmount;

    // Calculate the slippage
    const slippage = ((idealRate - actualRate) / idealRate) * 100;

    return {
        amountOut: scaledOsmoReceived.toFixed(6),
        slippage: Math.max(slippage, 0).toFixed(6)
    };
}

//
const build_swap_tx = async function (from:string, tokenIn:string, tokenOut:string, amountIn:string, tokenOutMinAmount:string) {
    let tag = TAG + " | build_swap_tx | "
    try{
        //get account info
        let accountInfo = await networkOsmo.getAccount(from)
        log.info(tag,"accountInfo: ",accountInfo)
        if(!accountInfo.account.account_number) throw new Error("missing account_number")
        
        let tx = {
            "account_number": accountInfo.account.account_number,
            "chain_id": 'osmosis-1',
            "fee": {
                "amount": [
                    {
                        "amount": "2291",
                        "denom": "uosmo"
                    }
                ],
                "gas": "100000"
            },
            "memo": "memo",
            "msg": [
                {
                    "type": "osmosis/gamm/swap-exact-amount-in",
                    "value": {
                        "routes": [
                            {
                                "pool_id": "1",
                                "token_out_denom": tokenOut
                            }
                        ],
                        "sender": from,
                        "token_in": {
                            "amount": amountIn,
                            "denom": tokenIn
                        },
                        "token_out_min_amount": "8204"
                    }
                }
            ],
            "sequence": "90"
        }
        
        return tx
    }catch(e){
        log.error(e)
    }
}

const build_ibc_tx = async function (from:string, to:string, amount:string) {
    let tag = TAG + " | build_ibc_tx | "
    try{
        log.info(tag,"from: ",from)
        log.info(tag,"to: ",to)
        log.info(tag,"amount: ",amount)
        
        //switch depending on pair
        
        //get account info
        let accountInfo = await networkAtom.getAccount(to)
        log.info(tag,"accountInfo: ",accountInfo)
        if(!accountInfo.result.value.account_number) throw new Error("missing account_number")
        if(!accountInfo.result.value.sequence) throw new Error("missing account_number")
        
        let currentHeight = accountInfo.height
        let expireBlockHeight = parseInt(currentHeight) + 10000
        
        let tx = {
            "account_number": accountInfo.result.value.account_number,
            "chain_id": "cosmoshub-4",
            "fee": {
                "amount": [
                    {
                        "amount": "2800",
                        "denom": "uatom"
                    }
                ],
                "gas": "290000"
            },
            "memo": "",
            "msg": [
                {
                    "type": "cosmos-sdk/MsgTransfer",
                    "value": {
                        "receiver": to,
                        "sender": from,
                        "source_channel": "channel-141",
                        "source_port": "transfer",
                        "timeout_height": {
                            "revision_height": expireBlockHeight.toString(),
                            "revision_number": "1"
                        },
                        "token": {
                            "amount": amount,
                            "denom": "uatom"
                        }
                    }
                }
            ],
            "signatures": [],
            "sequence": accountInfo.result.value.sequence
        }

        return tx
    }catch(e){
        log.error(e)
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
        
        //get pools
        let pools = await networkOsmo.getPools()
        if(!pools.pools[0]) throw Error("Unable to get pools from network!")
        log.info(tag,"resp: ",pools.pools[0].pool_assets)
        let amountAtom = pools.pools[0].pool_assets[0].token.amount; // ATOM amount
        let amountOsmo = pools.pools[0].pool_assets[1].token.amount; // OSMO amount
        let rate = amountOsmo / amountAtom;
        log.info(tag,"rate: ", rate);

        //issue invocationId

        // get amountOut
        //2 steps
        let result;
        if (quote.sellAsset === shortListSymbolToCaip["OSMO"]) {
            result = quoteFromPool(quote.sellAmount, amountAtom, amountOsmo);

            //build first TX
            //swap osmo for Atom IBC
            let tx1 = await build_swap_tx(quote.senderAddress, quote.sellAsset, quote.buyAsset, quote.sellAmount, result.amountOut)
            log.info(tag,"tx1: ",tx1)
            
            //get balance ibc?
            
            //IBC withdrawal from osmo:atom to atom
            let tx2 = await build_ibc_tx(quote.senderAddress, quote.recipientAddress, result.amountOut)
            log.info(tag,"tx2: ",tx2)
            

        } else if (quote.sellAsset === shortListSymbolToCaip["ATOM"]) {
            result = quoteFromPool(quote.sellAmount, amountAtom, amountOsmo);
            
            //TODO audit this
            //deposit atom to osmo:atom IBC
            let tx2 = await build_ibc_tx(quote.recipientAddress, quote.senderAddress, result.amountOut)
            log.info(tag,"tx2: ",tx2)
            
            //swap atom for osmo
            let tx1 = await build_swap_tx(quote.senderAddress, quote.sellAsset, quote.buyAsset, quote.sellAmount, result.amountOut)
            log.info(tag,"tx1: ",tx1)
            
        } else {
            throw Error("Asset not supported! asset:" + quote.sellAsset);
        }

        
        return result
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}
