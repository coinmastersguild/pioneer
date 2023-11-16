/*
    https://docs.blocknative.com/webhook-api

 */



const TAG = " | zapper | "
const log = require('@pioneer-platform/loggerdog')()
//@ts-ignore
import {evmCaips} from '@pioneer-platform/pioneer-caip'
const Axios = require('axios')
const https = require('https')
let API_KEY = process.env['ZAPPER_API_KEY']
if(!API_KEY) throw Error("api key required! set env ZAPPER_API_KEY")
const axios = Axios.create();
const Authorization = `Basic ${Buffer.from(`${API_KEY}:`, "binary").toString(
    "base64"
)}`;
console.log(Authorization)
let URL_SERVICE = "https://api.zapper.xyz"



const axiosRetry = require('axios-retry');

axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: (retryCount: number) => {
        log.debug(TAG,`retry attempt: ${retryCount}`);
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: (error: { response: { status: number; }; }) => {
        log.error(TAG,error)
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});


module.exports = {
    getTokens: function (address:string) {
        return get_tokens(address);
    },
    getNFTs: function (address:string) {
        return get_nfts(address);
    },
    getPortfolio: function (address:string) {
        return get_portfolio(address);
    },
    getTotalNetworth: function (address:string) {
        return get_total_networth(address);
    },
}

const get_portfolio = async function (address:string) {
    let tag = TAG + " | get_portfolio | "
    try {
        let output:any = {

        }
        // Call the '/apps' endpoint to get the balance in USD for app-related investments
        const appsResponse = await Axios.get(
            `https://api.zapper.xyz/v2/balances/apps?addresses%5B%5D=${address}`,
            {
                headers: {
                    accept: "*/*",
                    Authorization,
                },
            }
        );
        log.info(tag,"appsResponse: ",appsResponse.data)
        const apps = appsResponse.data;
        let totalBalanceUSDApp = 0;
        apps.forEach((app: { balanceUSD: number }) => {
            totalBalanceUSDApp += app.balanceUSD;
        });
        // Call the '/tokens' endpoint to get the balance in USD for tokens
        const tokensResponse = await Axios.get(
            `https://api.zapper.xyz/v2/balances/tokens?addresses%5B%5D=${address}`,
            {
                headers: {
                    accept: "*/*",
                    Authorization,
                },
            }
        );
        // console.log("tokensResponse: ",tokensResponse.data)
        let totalBalanceUsdTokens:any
        if(tokensResponse.data && tokensResponse.data[address.toLowerCase()]){
            let tokens = tokensResponse.data
            totalBalanceUsdTokens = 0;
            tokens = tokens[address.toLowerCase()]
            output.tokens = tokens
            log.info(tag,"tokens: ",tokens.length)
            if(tokens){
                tokens.forEach((token: any) => {
                    log.debug(tag,"token: ",token)
                    let network = token.network
                    log.debug(tag,"network: ",token)
                    let caip = evmCaips[network]
                    token.blockchainCaip = caip;
                    token.assetCaip = caip + ":" +token.token.address
                    log.debug(tag,"token.balanceUSD: ",token.token.balanceUSD)
                    totalBalanceUsdTokens += token.token.balanceUSD;
                });
            }            
        } else {
            output.tokens = []
            totalBalanceUsdTokens = 0
        }


        // Call the '/net-worth' endpoint to get the net worth in USD for NFTs
        let limit = 100
        let allTokens: any[] = [];
        let cursor = null;
        while (true) {
            try {
                // Send GET request to the API endpoint
                let url = `https://api.zapper.xyz/v2/nft/user/tokens?userAddress=${address}&limit=${limit}`;
                if (cursor) {
                    url += `&cursor=${cursor}`;
                }
                const response = await Axios.get(url, {
                    headers: {
                        accept: "*/*",
                        Authorization,
                    },
                });
                const tokens = response.data;
                //console.log("tokens: ",tokens)
                allTokens = allTokens.concat(tokens.items);
                cursor = response.data.cursor;
                if (!cursor) {
                    break;
                }
            } catch (error) {
                console.error(error);
            }
        }
        output.nfts = allTokens
        //console.log("nfts: ",output.nfts);

        // Call the '/net-worth' endpoint to get the net worth in USD for NFTs
        const nftResponse = await Axios.get(
            `https://api.zapper.xyz/v2/nft/balances/net-worth?addresses%5B%5D=${address}`,
            {
                headers: {
                    accept: "*/*",
                    Authorization,
                },
            }
        );
        const nftUsdNetWorth = nftResponse.data;
        output.nftUsdNetWorth = nftUsdNetWorth
        output.totalBalanceUsdTokens = totalBalanceUsdTokens
        output.totalBalanceUSDApp = totalBalanceUSDApp
        //console.log("totalBalanceUsdTokens: ",totalBalanceUsdTokens);
        //console.log("totalBalanceUSDApp: ",totalBalanceUSDApp);
        //Sum up the total balance in USD for apps, tokens, and NFTs
        const totalNetWorth =
            totalBalanceUSDApp + totalBalanceUsdTokens + parseFloat(nftUsdNetWorth[address.toLowerCase()]);
        //console.log("totalNetWorth: ",totalNetWorth);
        output.totalNetWorth = totalNetWorth
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        //console.error(tag, "e: ", e?.response)
        //console.error(tag, "e: ", e?.response?.status)
        //console.error(tag, "e: ", JSON.stringify(e.data))
    }
}

const get_total_networth = async function (address:string) {
    let tag = TAG + " | get_tokens | "
    try {
        // Call the '/apps' endpoint to get the balance in USD for app-related investments
        const appsResponse = await Axios.get(
            `https://api.zapper.xyz/v2/balances/apps?addresses%5B%5D=${address}`,
            {
                headers: {
                    accept: "*/*",
                    Authorization,
                },
            }
        );
        const apps = appsResponse.data;
        let totalBalanceUSDApp = 0;
        apps.forEach((app: { balanceUSD: number }) => {
            totalBalanceUSDApp += app.balanceUSD;
        });
        // Call the '/tokens' endpoint to get the balance in USD for tokens
        const tokensResponse = await Axios.get(
            `https://api.zapper.xyz/v2/balances/tokens?addresses%5B%5D=${address}`,
            {
                headers: {
                    accept: "*/*",
                    Authorization,
                },
            }
        );
        log.debug("tokensResponse: ",tokensResponse.data)
        let tokens = tokensResponse.data;
        let totalBalanceUsdTokens = 0;
        tokens = tokens[address.toLowerCase()]
        // log.debug("tokens: ",tokens)
        tokens.forEach((token: any) => {
            log.debug("token: ",token)
            let network = token.network
            log.debug("network: ",token)
            let caip = evmCaips[network]
            token.caip = caip;

            log.debug("token.balanceUSD: ",token.token.balanceUSD)
            totalBalanceUsdTokens += token.token.balanceUSD;
        });
        // Call the '/net-worth' endpoint to get the net worth in USD for NFTs
        const nftResponse = await Axios.get(
            `https://api.zapper.xyz/v2/nft/balances/net-worth?addresses%5B%5D=${address}`,
            {
                headers: {
                    accept: "*/*",
                    Authorization,
                },
            }
        );
        const nftUsdNetWorth = nftResponse.data;
        log.debug("nftUsdNetWorth: ",nftUsdNetWorth);
        log.debug("totalBalanceUsdTokens: ",totalBalanceUsdTokens);
        log.debug("totalBalanceUSDApp: ",totalBalanceUSDApp);
        // Sum up the total balance in USD for apps, tokens, and NFTs
        const totalNetWorth =
            totalBalanceUSDApp + totalBalanceUsdTokens + parseFloat(nftUsdNetWorth[address.toLowerCase()]);
        log.debug("totalNetWorth: ",totalNetWorth);
        return totalNetWorth
    } catch (e) {
        console.error(tag, "e: ", e)
        // console.error(tag, "e: ", e?.response)
        // console.error(tag, "e: ", e?.response?.status)
        // console.error(tag, "e: ", JSON.stringify(e.data))
    }
}

const get_tokens = async function (address:string) {
    let tag = TAG + " | get_tokens | "
    try {
        const apiKey = API_KEY;

        log.debug(Authorization)
        // const appsResponse = await Axios.get(
        //     `https://api.zapper.xyz/v2/balances/apps?addresses%5B%5D=${address}`);

        const appsResponse = await Axios.get(
            `https://api.zapper.xyz/v2/balances/apps?addresses%5B%5D=${address}`,
            {
                headers: {
                    accept: "*/*",
                    Authorization,
                },
            }
        );


        // @ts-ignore
        // const appsResponse = await Axios.get(
        //     `https://api.zapper.xyz/v2/balances/apps?addresses%5B%5D=${address}`,
        //     {
        //         headers: {
        //             accept: "*/*",
        //             Authorization,
        //         },
        //     }
        // );

        // let url = URL_SERVICE + "/v2/balances/apps?addresses=" + address+",api_key="+API_KEY
        // const headers = {
        //     headers: {
        //         "Authorization": "Bearer "+process.env['ZAPPER_API_KEY'],
        //     }
        // }
        // let result = await axios({
        //     url,
        //     method: 'GET'
        // },headers)
        return appsResponse.data
    } catch (e) {
        console.error(tag, "e: ", e)
        // console.error(tag, "e: ", e?.response)
        // console.error(tag, "e: ", e?.response?.status)
        // console.error(tag, "e: ", JSON.stringify(e.data))
    }
}

const get_nfts = async function (address:string) {
    let tag = TAG + " | get_tokens | "
    try {
        let url = URL_SERVICE + "v2/nft/user/tokens?userAddress=" + address

        let result = await axios({
            url,
            method: 'GET'
        })
        return result.data
    } catch (e) {
        console.error(tag, "e: ", e)
        // console.error(tag, "e: ", e?.response)
        // console.error(tag, "e: ", e?.response?.status)
        // console.error(tag, "e: ", JSON.stringify(e.data))
    }
}
