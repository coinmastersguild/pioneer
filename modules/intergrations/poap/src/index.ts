/*
    https://docs.blocknative.com/webhook-api



Retrieve auth0 token:

curl --location --request POST \

        --url 'https://poapauth.auth0.com/oauth/token' \

        --header "Content-Type: application/json" \

        -d '{"audience": "", "grant_type": "client_credentials", "client_id": "", "client_secret": ""}'



Use auth0 token:

curl --location --request GET --url 'https://api.poap.tech/actions/claim-qr?qr_hash=1kozmm' --header "Authorization: Bearer $authtoken"

 */



const TAG = " | blocknative | "
const Axios = require('axios')
const https = require('https')

let POAP_API_KEY= process.env['POAP_API_KEY']
if(!POAP_API_KEY) throw Error("api key required! set env POAP_API_KEY")

let POAP_SECRET = process.env['POAP_SECRET']
if(!POAP_SECRET) throw Error("api key required! set env POAP_SECRET")

let POAP_CLIENT_ID = process.env['POAP_CLIENT_ID']
if(!POAP_CLIENT_ID) throw Error("api key required! set env POAP_CLIENT_ID")
const axios = Axios.create();
// const axios = Axios.create({
//     httpsAgent: new https.Agent({
//         rejectUnauthorized: false,
//         headers: {
//             "Authorization": "Bearer "+process.env['ZAPPER_API_KEY'],
//         }
//     })
// });

let URL_SERVICE = "https://api.poap.tech/"



module.exports = {
    getAuthToken: function () {
        return get_auth_token();
    },
    // getTokens: function (address:string) {
    //     return get_tokens(address);
    // },
    getNFTs: function (address:string) {
        return get_nfts(address);
    },
}

const get_auth_token = async function () {
    let tag = TAG + " | get_tokens | "
    try {
        let url = "https://poapauth.auth0.com/oauth/token"

        let body = {
            "audience": "KeepKey",
            "grant_type": "client_credentials",
            "client_id": POAP_CLIENT_ID,
            "client_secret": POAP_SECRET}

        let headers = {
            "Content-Type": "application/json"
        }
        console.log(url, body, headers)
        const result = await axios.post(url, body, headers);

        return result.data
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
        let url = URL_SERVICE + "actions/scan/" + address

        let result = await axios({
            method: 'GET',
            url: 'https://api.poap.tech/actions/scan/'+address,
            headers: {
                'X-API-Key': POAP_API_KEY
            }
        })
        return result.data
    } catch (e) {
        console.error(tag, "e: ", e)
        // console.error(tag, "e: ", e?.response)
        // console.error(tag, "e: ", e?.response?.status)
        // console.error(tag, "e: ", JSON.stringify(e.data))
    }
}

// const get_tokens = async function (address:string) {
//     let tag = TAG + " | get_tokens | "
//     try {
//         let url = URL_SERVICE + "/v2/balances/apps?addresses=" + address
//         const headers = {
//             headers: {
//                 "Authorization": "Bearer "+process.env['ZAPPER_API_KEY'],
//             }
//         }
//         let result = await axios({
//             url,
//             method: 'GET'
//         },headers)
//         return result.data
//     } catch (e) {
//         console.error(tag, "e: ", e)
//         // console.error(tag, "e: ", e?.response)
//         // console.error(tag, "e: ", e?.response?.status)
//         // console.error(tag, "e: ", JSON.stringify(e.data))
//     }
// }


