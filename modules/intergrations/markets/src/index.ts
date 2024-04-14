/*



    https://www.coingecko.com/api/documentations/v3

 */

const TAG = " | market-module | "
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        headers: {
            "Authorization": "Bearer "+process.env['COINCAP_API_KEY'],
        }
    })
});
const axiosRetry = require('axios-retry');

const { ethers, BigNumber } = require('ethers');
const { Token, Fetcher, WETH, Route, Trade, TradeType, TokenAmount } = require('@uniswap/sdk');



axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount: number) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 1000; // time interval between retries
    },
    retryCondition: (error: { response: { status: number; }; }) => {
        console.error(error)
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});

import {
    Pubkey,
} from "@pioneer-platform/pioneer-types";

const log = require('@pioneer-platform/loggerdog')()
let {
    getExplorerAddressUrl,
    needsMemoByNetwork,
    COIN_MAP_LONG
} = require("@pioneer-platform/pioneer-coins")

const URL_COINCAP = "https://api.coincap.io/v2/"
let URL_COINGECKO = "https://api.coingecko.com/api/v3/"
let COINGECKO_API_KEY = process.env['COINGECKO_API_KEY']

let GLOBAL_RATES_COINCAP:any
let GLOBAL_RATES_COINGECKO:any

module.exports = {
    init:function(settings:any){
        if(settings?.apiKey){
            COINGECKO_API_KEY = settings.apiKey
        }
        //if(!COINGECKO_API_KEY) throw Error("api key required! set env COINGECKO_API_KEY")
    },
    getAssetsCoinCap: function () {
        return get_assets_coincap();
    },
    getAssetsCoingecko: function (limit:number,skip:number){
        return get_assets_coingecko(limit,skip);
    },
    getRatePro: function (){
        return get_pro_rate();
    },
    getPrice: function (asset:string) {
        return get_price(asset);
    },
    getPricesInQuote: function (assets:[any], quote:string) {
        return get_prices_in_quote(assets,quote);
    },
    buildBalances:function(marketInfoCoinCap:any, marketInfoCoinGecko:any, pubkeys:any, context:string){
        return build_balances(marketInfoCoinCap,marketInfoCoinGecko,pubkeys)
    }
}

const get_pro_rate = async function() {
    try {
        const url = 'https://pioneers.dev/api/v1/uniswap/rateEth/0xef743df8eda497bcf1977393c401a636518dd630/8453';
        let ratePro = await axios.get(url)
        return ratePro.data
    } catch(e) {
        console.error(e);
        return undefined;
    }
};

let build_balances = async function (marketInfoCoinCap:any, marketInfoCoinGecko:any, pubkeys:any) {
    let tag = TAG + ' | build_balances | '
    try {
        if(!pubkeys) throw Error("No pubkeys given!")
        //GLOBAL_RATES
        if(!marketInfoCoinCap) marketInfoCoinCap = await get_assets_coincap()
        if(!marketInfoCoinGecko) marketInfoCoinGecko = await get_assets_coingecko()
        // console.log(Object.keys(marketInfoCoinCap))
        // console.log(Object.keys(marketInfoCoinGecko))
        // console.log(Object.keys(marketInfoCoinCap).length)
        // console.log(Object.keys(marketInfoCoinGecko).length)
        let valuesUsd:any = {}
        let totalValueUsd = 0
        let outputBalances:any = []
        let unknownTokens:any = []
        let unPricedTokens:any = []

        let proRate = await get_pro_rate()

        for(let i = 0; i < pubkeys.length; i++){
            let entry:any = pubkeys[i]
            // console.log("entry: ",entry)
            //clone
            if(entry.ticker === 'PRO'){
                console.log("proRate: ",proRate)
                //pro rate is rate in ETH
                let ethToUsdRate = marketInfoCoinCap['ETH'].priceUsd || marketInfoCoinGecko['ETH'].current_price; // Example, adjust based on your actual data structure
                console.log("ethToUsdRate: ",ethToUsdRate)
                let proToUsdRate = (1/proRate) * ethToUsdRate; // Calculating PRO to USD rate
                console.log("proToUsdRate: ",proToUsdRate)
                entry.priceUsd = proToUsdRate;
                //TODO get rate in USD
                entry.rank = 10
                entry.alias = []
                entry.alias.push('PRO')
                entry.source = "uniswap"
                entry.symbol = "PRO"
            }else{
                //get hit on symbol @TODO FUCK THIS SHIT DONT DO THIS, caip slug something
                let coincap = marketInfoCoinCap[entry.ticker]
                let coingecko = marketInfoCoinGecko[entry.ticker]
                // log.info("coincap: ",coincap)
                // log.info("coingecko: ",coingecko)

                if(!coincap && !coingecko) {
                    console.error("unknown token! ",entry.symbol)
                    unknownTokens.push(entry)
                }

                if(coincap && coincap.priceUsd){
                    entry.priceUsd = coincap.priceUsd
                    entry.rank = coincap.rank
                    entry.alias = []
                    if(!entry.name) entry.name = coincap.name
                    if(entry.name) entry.alias.push(entry.name)
                    // entry.marketInfo = coincap
                    entry.source = "coincap"
                }
                //preference coinGecko as more accurate
                if(coingecko && coingecko.current_price){
                    entry.alias = []
                    if(entry.name) entry.alias.push(entry.name)
                    entry.priceUsd = coingecko.current_price
                    if(!entry.name) entry.name = coingecko.id
                    entry.alias = entry.alias.push(coingecko.name)
                    entry.rank = coingecko.market_cap_rank
                    entry.source = "coingecko"
                }
            }

            const priceUsd = Number(entry.priceUsd);
            if (!isNaN(priceUsd) && priceUsd !== 0) {
                // Convert entry.balance to a number, defaulting to 0 if NaN
                const balance = Number(entry.balance) || 0;

                // Calculate valueUsd
                const valueUsd = balance * priceUsd;

                // Convert valueUsd to string and store back on the entry
                entry.valueUsd = String(valueUsd);

                // Add valueUsd to totalValueUsd, ensure totalValueUsd is a number
                totalValueUsd += valueUsd;

                // Push the entry to the output balances
                outputBalances.push(entry);
            } else {
                // Push the entry to unPricedTokens if priceUsd is not valid
                unPricedTokens.push(entry);
            }

            //get value

            //get hit on ticker

            //validate on chain

            // //network from asset
            // let network = COIN_MAP_LONG[symbol]
            // if(network){
            //     //address explorer URL
            //     entry.addressUrl = getExplorerAddressUrl(entry.address,network,symbol,false)
            //     // needsMemo
            //     let needsMemo = needsMemoByNetwork(network)
            //     if(needsMemo) entry.needsMemo = true
            // }
            //
            //
            // //log.debug(tag,"entry: ",entry)
            // //coinInfo
            // let coinInfoCoinCap = marketInfoCoinCap[symbol]
            // log.debug(tag,"coinInfoCoinCap: ",coinInfoCoinCap)
            //
            // //log.debug(tag,"marketInfoCoinGecko: ",marketInfoCoinGecko)
            // let coinInfoCoinGecko = marketInfoCoinGecko[symbol]
            // log.debug(tag,"coinInfoCoinGecko: ",coinInfoCoinGecko)
            //
            // let rateUsdCoinCap = 0
            // if(coinInfoCoinCap && coinInfoCoinCap.priceUsd){
            //     rateUsdCoinCap = coinInfoCoinCap.priceUsd
            // } else {
            //     //log.error(tag," COINCAP Missing rate data for "+symbol)
            // }
            //
            // //
            // let rateUsdCoinGecko = 0
            // if(coinInfoCoinGecko && coinInfoCoinGecko.current_price){
            //     rateUsdCoinGecko = coinInfoCoinGecko.current_price
            // } else {
            //     //log.error(tag," COINGECKO Missing rate data for "+symbol)
            // }
            //
            // log.debug(symbol," rateUsdCoinCap: ",rateUsdCoinCap)
            // log.debug(symbol," rateUsdCoinGecko: ",rateUsdCoinGecko)
            //
            // let relDiff = function(a:number, b:number) {
            //     return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
            // }
            //
            // //if either = 0, then accept other price
            // //flag Danger
            //
            // //Calculate the percent.
            // var percent = relDiff(Number(rateUsdCoinCap),Number(rateUsdCoinGecko))
            // log.debug(symbol," percent: ",percent)
            // //percent diff
            //
            // /*
            //     Algo
            //     if any are 0, use other
            //     if both, choose lowest
            //  */
            //
            // let chosenRate = 0
            // if(rateUsdCoinCap === 0){
            //     chosenRate = rateUsdCoinGecko
            // } else if(rateUsdCoinGecko === 0){
            //     chosenRate = rateUsdCoinCap
            // } else if(rateUsdCoinGecko > rateUsdCoinCap){
            //     chosenRate = rateUsdCoinCap
            // } else {
            //     chosenRate = rateUsdCoinGecko
            // }
            // chosenRate = Number(chosenRate)
            // entry.priceUsd = String(chosenRate)
            // let valueUsd = entry.balance * chosenRate
            // entry.valueUsd = String(valueUsd)
            //
            // //valueUsd
            // totalValueUsd = Number(totalValueUsd) + Number(valueUsd)
            //
            // //TODO if quote !== USD
            // //calc conversion
            //
            // let balance:any = JSON.parse(JSON.stringify(pubkey))
            // delete balance.balances
            // balance = {...balance,...entry}
            // log.debug(tag,"pubkey: at (init):",pubkey)
            // log.debug(tag,"balance: (init):",balance)
            //
            //
            // if(coinInfoCoinCap){
            //     balance.onCoinCap = true
            //     if(balance.symbol && balance.symbol !== coinInfoCoinCap.symbol){
            //         //symbol mismatch
            //         balance.coincapAgreeSymbol = false
            //         balance.coincapSymbol = coinInfoCoinCap.symbol
            //     }
            //     let coincapInfo = {
            //         id_coincap: coinInfoCoinCap.id,
            //         rank_coincap: coinInfoCoinCap.rank,
            //         name_coincap: coinInfoCoinCap.name,
            //         supply: coinInfoCoinCap.supply,
            //         maxSupply: coinInfoCoinCap.maxSupply,
            //         marketCapUsd: coinInfoCoinCap.marketCapUsd,
            //         volumeUsd24Hr: coinInfoCoinCap.volumeUsd24Hr,
            //         priceUsd: coinInfoCoinCap.priceUsd,
            //         changePercent24Hr: coinInfoCoinCap.changePercent24Hr,
            //         vwap24Hr: coinInfoCoinCap.vwap24Hr,
            //         explorer: coinInfoCoinCap.explorer,
            //     }
            //     balance = {...balance,...coincapInfo}
            // }else{
            //     balance.onCoinCap = false
            // }
            //
            // if(coinInfoCoinGecko){
            //     log.debug(coinInfoCoinGecko.symbol," cginfo: ",coinInfoCoinGecko)
            //     balance.onCoinGecko = true
            //     if(balance.symbol && balance.symbol !== coinInfoCoinGecko.symbol){
            //         //symbol mismatch
            //         balance.coinGeckoAgreeSymbol = false
            //         balance.coinGeckoSymbol = coinInfoCoinGecko.symbol
            //     }
            //     let coinGeckoInfo = {
            //         name_coingecko: coinInfoCoinGecko.name,
            //         rank_coingecko: coinInfoCoinGecko.market_cap_rank,
            //         id_coingecko: coinInfoCoinGecko.id,
            //         image: coinInfoCoinGecko.image,
            //         current_price: coinInfoCoinGecko.current_price,
            //         market_cap: coinInfoCoinGecko.market_cap,
            //         fully_diluted_valuation: coinInfoCoinGecko.fully_diluted_valuation,
            //         total_volume: coinInfoCoinGecko.total_volume,
            //         high_24h: coinInfoCoinGecko.high_24h,
            //         low_24h: coinInfoCoinGecko.low_24h,
            //         price_change_24h: coinInfoCoinGecko.price_change_24h,
            //         price_change_percentage_24h: coinInfoCoinGecko.price_change_percentage_24h,
            //         market_cap_change_24h: coinInfoCoinGecko.market_cap_change_24h,
            //         market_cap_change_percentage_24h: coinInfoCoinGecko.market_cap_change_percentage_24h,
            //         circulating_supply: coinInfoCoinGecko.circulating_supply,
            //         total_supply: coinInfoCoinGecko.total_supply,
            //         max_supply: coinInfoCoinGecko.max_supply,
            //         ath: coinInfoCoinGecko.ath,
            //         ath_change_percentage: coinInfoCoinGecko.ath_change_percentage,
            //         ath_date: coinInfoCoinGecko.ath_date,
            //         atl: coinInfoCoinGecko.atl,
            //         atl_change_percentage: coinInfoCoinGecko.atl_change_percentage,
            //         atl_date: coinInfoCoinGecko.atl_date,
            //         roi: coinInfoCoinGecko.roi,
            //         last_updated: coinInfoCoinGecko.last_updated
            //     }
            //     balance = {...balance,...coinGeckoInfo}
            // }else{
            //     balance.onCoinCap = false
            // }
            //
            // //figure out icon
            // if(!balance.image){
            //     //TODO lookup if icon exists, else use network icon
            //     //use network image? coincap
            //     balance.image = `https://static.coincap.io/assets/icons/${balance.symbol.toLowerCase()}@2x.png`
            // }
            // balances.push(balance)
        }

        return {outputBalances,unPricedTokens, unknownTokens, total:totalValueUsd}
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
    }
}


let get_assets_coincap = async function () {
    let tag = TAG + ' | get_order | '
    try {
        let output:any =  {}

        let url = URL_COINCAP + 'assets?limit=2000'
        log.debug(tag,"url: ",url)
        let result = await axios({
            url: url,
            method: 'GET'
        })

        //parse into keys array off ticker
        let allCoinsArray = result.data.data
        log.debug(tag,"allCoinsArray: ",allCoinsArray.length)

        for(let i = 0; i < allCoinsArray.length; i++){
            //
            let coinInfo = allCoinsArray[i]
            log.debug(tag,"coinInfo: ",coinInfo)

            output[coinInfo.symbol] = coinInfo
        }
        log.debug('result: ', output)

        return output
    } catch (e) {
        //handle error gracefully
        return {}
    }
}

const get_assets_coingecko = async function (limit?: number, skip?: number) {
    let tag = TAG + ' | get_assets_coingecko | '
    try {
        let output = {}
        if(!limit) limit = 250
        if(!skip) skip = 0
        let url = URL_COINGECKO + `coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${limit}&page=${skip}&sparkline=false`
        log.debug(tag, "url: ", url)

        let result = await axios({
            url: url,
            method: 'GET'
        })

        log.debug(tag, "result: ", result.data)
        let allCoinsArray = result.data
        log.debug(tag, "allCoinsArray: ", allCoinsArray.length)

        for (let i = 0; i < allCoinsArray.length; i++) {
            let coinInfo = allCoinsArray[i]
            log.debug(tag, "coinInfo: ", coinInfo)
            // @ts-ignore
            output[coinInfo.symbol.toUpperCase()] = coinInfo
        }

        log.debug('result: ', output)
        return output
    } catch (e) {
        //handle error gracefully
        return {}
    }
}



const get_prices_in_quote = async function (assets:[any], quote:string) {
    let tag = " | get_prices_in_quote | "
    try{

        const { data }: { data: any } = await axios.get(
            `${URL_COINGECKO}/simple/price?ids=`+assets.toString()+`&vs_currencies=`+quote
        )

        return data
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}



const get_price = async function (asset:string) {
    let tag = " | get_price | "
    try{
        // @ts-ignore
        // const id = coingeckoIDMap[blockchain]
        // const isToken = !!asset
        // const contractUrl = isToken ? `/contract/${asset}` : ''

        const { data }: { data: any } = await axios.get(
            `${URL_COINGECKO}/coins/${asset}`
        )

        // TODO: get correct localizations
        const currency = 'usd'
        const marketData = data?.market_data
        return {
            price: marketData?.current_price?.[currency],
            marketCap: marketData?.market_cap?.[currency],
            changePercent24Hr: marketData?.price_change_percentage_24h,
            volume: marketData?.total_volume?.[currency],
            icon:data?.image?.large
        }
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}
