/*
    https://docs.blocknative.com/webhook-api

 */



const TAG = " | blocknative | "
const Axios = require('axios')
const https = require('https')
let API_KEY = process.env['ZAPPER_API_KEY']
if(!API_KEY) throw Error("api key required! set env ZAPPER_API_KEY")
const axios = Axios.create();
const Authorization = `Basic ${Buffer.from(`${API_KEY}:`, "binary").toString(
    "base64"
)}`;

let URL_SERVICE = "https://api.zapper.xyz"



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
        let tokens = tokensResponse.data;
        let totalBalanceUsdTokens = 0;
        tokens = tokens[address.toLowerCase()]
        output.tokens = tokens
        console.log("tokens: ",tokens)
        if(tokens){
            tokens.forEach((token: any) => {
                console.log("token: ",token)
                console.log("token.balanceUSD: ",token.token.balanceUSD)
                totalBalanceUsdTokens += token.token.balanceUSD;
            });
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
                console.log("tokens: ",tokens)
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
        // console.log("nfts: ",output.nfts);

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
        // console.log("totalBalanceUsdTokens: ",totalBalanceUsdTokens);
        // console.log("totalBalanceUSDApp: ",totalBalanceUSDApp);
        // Sum up the total balance in USD for apps, tokens, and NFTs
        const totalNetWorth =
            totalBalanceUSDApp + totalBalanceUsdTokens + parseFloat(nftUsdNetWorth[address.toLowerCase()]);
        // console.log("totalNetWorth: ",totalNetWorth);
        output.totalNetWorth = totalNetWorth
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        // console.error(tag, "e: ", e?.response)
        // console.error(tag, "e: ", e?.response?.status)
        // console.error(tag, "e: ", JSON.stringify(e.data))
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
        console.log("tokensResponse: ",tokensResponse.data)
        let tokens = tokensResponse.data;
        let totalBalanceUsdTokens = 0;
        tokens = tokens[address.toLowerCase()]
        // console.log("tokens: ",tokens)
        tokens.forEach((token: any) => {
            console.log("token: ",token)
            console.log("token.balanceUSD: ",token.token.balanceUSD)
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
        console.log("nftUsdNetWorth: ",nftUsdNetWorth);
        console.log("totalBalanceUsdTokens: ",totalBalanceUsdTokens);
        console.log("totalBalanceUSDApp: ",totalBalanceUSDApp);
        // Sum up the total balance in USD for apps, tokens, and NFTs
        const totalNetWorth =
            totalBalanceUSDApp + totalBalanceUsdTokens + parseFloat(nftUsdNetWorth[address.toLowerCase()]);
        console.log("totalNetWorth: ",totalNetWorth);
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

        console.log(Authorization)
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
