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
    valuePortfolio:function(portfolio:any,quote:string){
        return get_value_portfolio(portfolio,quote)
    },
    getNetworks:function(portfolio:any,quote:string){
        return get_value_portfolio(portfolio,quote)
    },
}

let get_value_portfolio = async function (portfolio:any,quote:string) {
    let tag = TAG + ' | get_value_portfolio | '
    try {
        //GLOBAL_RATES
        if(!GLOBAL_RATES_COINCAP) GLOBAL_RATES_COINCAP = await get_assets_coincap()
        if(!GLOBAL_RATES_COINGECKO) GLOBAL_RATES_COINGECKO = await get_assets_coingecko()

        let coins:any = Object.keys(portfolio)

        let valuesUsd:any = {}
        let totalValueUsd = 0

        let allNames = []
        for(let i = 0; i < coins.length; i++){
            let coin:any = coins[i]
            //log.debug(tag,"coin: ",coin)
            //coinInfo
            // let coinInfoCoinCap = GLOBAL_RATES_COINCAP[coin]
            // log.info(tag,"coinInfoCoinCap: ",coinInfoCoinCap)
            // if(coinInfoCoinCap && coinInfoCoinCap.id)allNames.push(coinInfoCoinCap.id)

            let rateUsdCoinCap = 0
            if(GLOBAL_RATES_COINCAP[coin] && GLOBAL_RATES_COINCAP[coin].priceUsd){
                rateUsdCoinCap = GLOBAL_RATES_COINCAP[coin].priceUsd
            } else {
                log.error(tag," COINCAP Missing rate data for "+coin)
            }

            //
            let rateUsdCoinGecko = 0
            if(GLOBAL_RATES_COINGECKO[coin] && GLOBAL_RATES_COINGECKO[coin].current_price){
                rateUsdCoinGecko = GLOBAL_RATES_COINGECKO[coin].current_price
            } else {
                log.error(tag," COINGECKO Missing rate data for "+coin)
            }

            log.info(coin," rateUsdCoinCap: ",rateUsdCoinCap)
            log.info(coin," rateUsdCoinGecko: ",rateUsdCoinGecko)

            let relDiff = function(a:number, b:number) {
                return  100 * Math.abs( ( a - b ) / ( (a+b)/2 ) );
            }

            //if either = 0, then accept other price
            //flag Danger

            //Calculate the percent.
            var percent = relDiff(Number(rateUsdCoinCap),Number(rateUsdCoinGecko))
            log.info(coin," percent: ",percent)
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
            valuesUsd[coin] = chosenRate
            totalValueUsd += valuesUsd[coin] + chosenRate

            //TODO if quote !== USD
            //calc conversion
        }

        // log.info(tag,'names: ',allNames)

        //let priceData in USD
        //let allValuesUsd = get_prices_in_quote()

        //supplement with icons

        //fill any missing from coingecko

        //TODO https://www.coingecko.com/api/documentations/v3#/simple/get_simple_price

        return {values:valuesUsd,total:totalValueUsd}
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
        log.info(tag,"allCoinsArray: ",allCoinsArray.length)

        for(let i = 0; i < allCoinsArray.length; i++){
            //
            let coinInfo = allCoinsArray[i]
            log.debug(tag,"coinInfo: ",coinInfo)

            output[coinInfo.symbol] = coinInfo
        }
        log.debug('result: ', output)

        return output
    } catch (e) {
        console.error(tag, 'Error: ', e)
        throw e
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
        console.error(tag, 'Error: ', e)
        throw e
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
