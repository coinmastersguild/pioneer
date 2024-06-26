/*
    https://docs.blocknative.com/webhook-api

 */



const TAG = " | blocknative | "
const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

let URL_HARPIE = "https://api.harpie.io"
let HARPIE_API_KEY = process.env['BLOCKNATIVE_API_KEY'] || "KEEPKEYTEST"
if(!HARPIE_API_KEY) throw Error("api key required! set env HARPIE_API_KEY")
module.exports = {
    validateTransaction: function (from:string,to:string,data:string) {
        return submit_tx(from,to,data);
    },
}

const submit_tx = async function (from:string,to:string,data:string) {
    let tag = TAG + " | submit_address | "
    try {

        let payload = {
            apiKey:HARPIE_API_KEY,
            from,
            to,
            data,
        }

        // const transaction = payload.transaction;

        // const transactionData: TransactionData = {
        //     network: payload.network,
        //     data: transaction.data,
        //     from: transaction.from,
        //     to: transaction.to,
        //     value: transaction.value || '0',
        //     gas: transaction.gas,
        //     fakeTransaction: transaction.fakeTransaction || null,
        //     fakeTransactionType: transaction.fakeTransactionType || null,
        // };
        //
        // response = await axios(getSimulatedEipTransaction(transactionData));

        // let result = await fetch("https://api.harpie.io/validateTransaction", {
        //     method: "POST",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         apiKey: HARPIE_API_KEY,
        //         to: "0xEea6cEDf9c8a4bD197Ced6F11B254138B388a5f5",
        //         from: "0x84F3Cfa1Ecbf333A3e91C0DAF7415ea0F1bcB701",
        //         data: "0xa9059cbb00000000000000000000000055456cbd1f11298b80a53c896f4b1dc9bc16c731000000000000000000000000000000000000000000000000000de0b6b3a7640000"
        //     })
        // })

        let body = {
            url: URL_HARPIE+"/validateTransaction",
            method: 'POST',
            data:payload,
        }

        console.log(tag,"body: ",body)
        let resp = await axios.post(body.url,body.data)
        console.log(tag,"resp: ",resp)

        return resp.data
    } catch (e) {
        console.error(tag, "e: ", e)
    }
}
