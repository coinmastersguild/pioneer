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
            "authorization": process.env['COINCAP_API_KEY'],
            "Authorization": "Bearer "+process.env['COINCAP_API_KEY'],
        }
    })
});

import {
    Pubkey,
} from "@pioneer-platform/pioneer-types";

const log = require("@pioneer-platform/loggerdog")()

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
    getAssetsCoincap: function () {
        return get_assets_coincap();
    },
    getAssetsCoingecko: function () {
        return get_assets_coingecko();
    },
    getPrice: function (asset:string) {
        return get_price(asset);
    },
    getPricesInQuote: function (assets:[any], quote:string) {
        return get_prices_in_quote(assets,quote);
    },
    hydratePubkeys:function(pubkeys:any){
        return hydrate_pubkeys(pubkeys)
    }
}

let hydrate_pubkeys = async function (pubkeys:any) {
    let tag = TAG + ' | hydrate_pubkeys | '
    try {
        //GLOBAL_RATES
        if(!GLOBAL_RATES_COINCAP) GLOBAL_RATES_COINCAP = await get_assets_coincap()
        if(!GLOBAL_RATES_COINGECKO) GLOBAL_RATES_COINGECKO = await get_assets_coingecko()


        let valuesUsd:any = {}
        let totalValueUsd = 0

        let allNames = []
        let hydratedPubkeys:any = []
        for(let i = 0; i < pubkeys.length; i++){
            let pubkey:Pubkey = pubkeys[i]
            if(!pubkey.balances) { // @ts-ignore
                pubkey.balances = []
            }
            log.info(tag,"pubkey: ",pubkey)
            let hydratedPubkey = JSON.parse(JSON.stringify(pubkey));
            hydratedPubkey.balances = []
            for(let j = 0; j < pubkey.balances.length; j++){
                let entry:any = pubkey.balances[j]
                //clone

                log.info(tag,"entry: ",entry)
                let symbol = entry.asset
                //log.debug(tag,"entry: ",entry)
                //coinInfo
                let coinInfoCoinCap = GLOBAL_RATES_COINCAP[symbol]
                log.debug(tag,"coinInfoCoinCap: ",coinInfoCoinCap)

                let coinInfoCoinGecko = GLOBAL_RATES_COINGECKO[symbol]
                log.debug(tag,"coinInfoCoinGecko: ",coinInfoCoinGecko)

                let rateUsdCoinCap = 0
                if(GLOBAL_RATES_COINCAP[symbol] && GLOBAL_RATES_COINCAP[symbol].priceUsd){
                    rateUsdCoinCap = GLOBAL_RATES_COINCAP[symbol].priceUsd
                } else {
                    log.error(tag," COINCAP Missing rate data for "+symbol)
                }
                //
                let rateUsdCoinGecko = 0
                if(GLOBAL_RATES_COINGECKO[symbol] && GLOBAL_RATES_COINGECKO[symbol].current_price){
                    rateUsdCoinGecko = GLOBAL_RATES_COINGECKO[symbol].current_price
                } else {
                    log.error(tag," COINGECKO Missing rate data for "+symbol)
                }

                log.debug(symbol," rateUsdCoinCap: ",rateUsdCoinCap)
                log.debug(symbol," rateUsdCoinGecko: ",rateUsdCoinGecko)

                let relDiff = function(a:number, b:number) {
                    return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
                }

                //if either = 0, then accept other price
                //flag Danger

                //Calculate the percent.
                var percent = relDiff(Number(rateUsdCoinCap),Number(rateUsdCoinGecko))
                log.debug(symbol," percent: ",percent)
                //percent diff

                /*
                    Algo
                    if any are 0, use other
                    if both, choose lowest
                 */

                let chosenRate = 0
                if(rateUsdCoinCap === 0){
                    chosenRate = rateUsdCoinGecko
                } else if(rateUsdCoinGecko === 0){
                    chosenRate = rateUsdCoinCap
                } else if(rateUsdCoinGecko > rateUsdCoinCap){
                    chosenRate = rateUsdCoinCap
                } else {
                    chosenRate = rateUsdCoinGecko
                }
                chosenRate = Number(chosenRate)
                entry.priceUsd = String(chosenRate)
                let valueUsd = entry.balance * chosenRate
                entry.valueUsd = String(valueUsd)

                //valueUsd
                totalValueUsd = Number(totalValueUsd) + Number(valueUsd)

                //TODO if quote !== USD
                //calc conversion


                if(coinInfoCoinCap && coinInfoCoinGecko){
                    entry.marketInfo = {
                        symbol: coinInfoCoinCap.symbol || coinInfoCoinGecko.symbol,
                        id_coincap: coinInfoCoinCap.id,
                        id_coingecko: coinInfoCoinGecko.id,
                        rank_coincap: coinInfoCoinCap.rank,
                        rank_coingecko: coinInfoCoinGecko.market_cap_rank,
                        name_coincap: coinInfoCoinCap.name,
                        name_coingecko: coinInfoCoinGecko.name,
                        supply: coinInfoCoinCap.supply,
                        maxSupply: coinInfoCoinCap.maxSupply,
                        marketCapUsd: coinInfoCoinCap.marketCapUsd,
                        volumeUsd24Hr: coinInfoCoinCap.volumeUsd24Hr,
                        priceUsd: coinInfoCoinCap.priceUsd,
                        changePercent24Hr: coinInfoCoinCap.changePercent24Hr,
                        vwap24Hr: coinInfoCoinCap.vwap24Hr,
                        explorer: coinInfoCoinCap.explorer,
                        //gecko
                        image: coinInfoCoinGecko.image,
                        current_price: coinInfoCoinGecko.current_price,
                        market_cap: coinInfoCoinGecko.market_cap,
                        fully_diluted_valuation: coinInfoCoinGecko.fully_diluted_valuation,
                        total_volume: coinInfoCoinGecko.total_volume,
                        high_24h: coinInfoCoinGecko.high_24h,
                        low_24h: coinInfoCoinGecko.low_24h,
                        price_change_24h: coinInfoCoinGecko.price_change_24h,
                        price_change_percentage_24h: coinInfoCoinGecko.price_change_percentage_24h,
                        market_cap_change_24h: coinInfoCoinGecko.market_cap_change_24h,
                        market_cap_change_percentage_24h: coinInfoCoinGecko.market_cap_change_percentage_24h,
                        circulating_supply: coinInfoCoinGecko.circulating_supply,
                        total_supply: coinInfoCoinGecko.total_supply,
                        max_supply: coinInfoCoinGecko.max_supply,
                        ath: coinInfoCoinGecko.ath,
                        ath_change_percentage: coinInfoCoinGecko.ath_change_percentage,
                        ath_date: coinInfoCoinGecko.ath_date,
                        atl: coinInfoCoinGecko.atl,
                        atl_change_percentage: coinInfoCoinGecko.atl_change_percentage,
                        atl_date: coinInfoCoinGecko.atl_date,
                        roi: coinInfoCoinGecko.roi,
                        last_updated: coinInfoCoinGecko.last_updated
                    }
                } else {
                    log.error("Incomplete market data!")
                }

                hydratedPubkey.balances.push(entry)
            }
            hydratedPubkeys.push(hydratedPubkey)
        }

        // log.debug(tag,'names: ',allNames)

        //let priceData in USD
        //let allValuesUsd = get_prices_in_quote()

        //supplement with icons

        //fill any missing from coingecko

        //TODO https://www.coingecko.com/api/documentations/v3#/simple/get_simple_price

        return {pubkeys:hydratedPubkeys,total:totalValueUsd}
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

let get_assets_coingecko = async function () {
    let tag = TAG + ' | get_assets_coingecko | '
    try {
        let output:any =  {}

        let url = URL_COINGECKO + 'coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false'
        log.debug(tag,"url: ",url)
        let result = await axios({
            url: url,
            method: 'GET'
        })
        log.debug(tag,"result: ",result.data)
        //parse into keys array off ticker
        let allCoinsArray = result.data
        log.debug(tag,"allCoinsArray: ",allCoinsArray.length)

        for(let i = 0; i < allCoinsArray.length; i++){
            //
            let coinInfo = allCoinsArray[i]
            log.debug(tag,"coinInfo: ",coinInfo)

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
