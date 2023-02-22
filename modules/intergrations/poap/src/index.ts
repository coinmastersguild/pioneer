/*
    https://docs.blocknative.com/webhook-api

 */



const TAG = " | blocknative | "
const Axios = require('axios')
const https = require('https')
let API_KEY = process.env['ZAPPER_API_KEY']
if(!API_KEY) throw Error("api key required! set env ZAPPER_API_KEY")
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        headers: {
            "Authorization": "Bearer "+process.env['ZAPPER_API_KEY'],
        }
    })
});

let URL_SERVICE = "https://api.poap.tech/"



module.exports = {
    // getTokens: function (address:string) {
    //     return get_tokens(address);
    // },
    getNFTs: function (address:string) {
        return get_nfts(address);
    },
}

const get_nfts = async function (address:string) {
    let tag = TAG + " | get_tokens | "
    try {
        let url = URL_SERVICE + "actions/scan/" + address

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


