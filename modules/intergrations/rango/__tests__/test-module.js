

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let rango = require("../lib/index")

// console.log("servers: ",servers)
let run_test = async function(){
    try{
        //
        await rango.init({})

        // let body = {
        //     "from": {
        //         "blockchain": "BTC",
        //         "symbol": "BTC",
        //         "address": null
        //     },
        //     "to": {
        //         "blockchain": "LTC",
        //         "symbol": "LTC",
        //         "address": null
        //     },
        //     "amount": "0.0012",
        //     "connectedWallets": [
        //         {
        //             "blockchain": "BTC",
        //             "addresses": [
        //                 "1LF9M5BCZq1gZeGjvghJkwDhPhSWv9C1PM"
        //             ]
        //         },
        //         {
        //             "blockchain": "LTC",
        //             "addresses": [
        //                 "ltc1qpmu3c2c9693q66qc7genedxfz9h77gnhfww920"
        //             ]
        //         },
        //         {
        //             "blockchain": "THOR",
        //             "addresses": [
        //                 "thor1atev7k3xzsqsenrwjht3k3r70t9mtz0p58qn6d"
        //             ]
        //         },
        //         {
        //             "blockchain": "BCH",
        //             "addresses": [
        //                 "qqh080jjpqn4qtew4lt2rk5ul6zwd9lx7y9w2htqqw"
        //             ]
        //         },
        //         {
        //             "blockchain": "BNB",
        //             "addresses": [
        //                 "bnb1qyljuasqcmmjznyuqd64mwjlamn22g5shr3twk"
        //             ]
        //         },
        //         {
        //             "blockchain": "ETH",
        //             "addresses": [
        //                 "0x5b7FFe740E19F442Eb333d68d999cb509a42d6D0"
        //             ]
        //         },
        //         {
        //             "blockchain": "POLYGON",
        //             "addresses": [
        //                 "0x5b7FFe740E19F442Eb333d68d999cb509a42d6D0"
        //             ]
        //         },
        //         {
        //             "blockchain": "BSC",
        //             "addresses": [
        //                 "0x5b7FFe740E19F442Eb333d68d999cb509a42d6D0"
        //             ]
        //         }
        //     ],
        //     "selectedWallets": {
        //         "BTC":"1LF9M5BCZq1gZeGjvghJkwDhPhSWv9C1PM",
        //         "LTC":"ltc1qpmu3c2c9693q66qc7genedxfz9h77gnhfww920",
        //     },
        //     "checkPrerequisites": false,
        //     "affiliateRef": null
        // }

        // let chains = await rango.getChains()
        // console.log(JSON.stringify(chains))

        // let body = {
        //     "from":{
        //         "blockchain":"BCH",
        //         "symbol":"BCH",
        //         "address":null
        //     },
        //     "to":{
        //         "blockchain":"DOGE",
        //         "symbol":"DOGE",
        //         "address":null
        //     },
        //     "amount":"1.04",
        //     "connectedWallets":[
        //         {
        //             "blockchain":"BCH",
        //             "addresses":[
        //                 "qz7qpvecayaa24r94ppfn9saakyhg879mukfhtge7a"
        //             ]
        //         },
        //         {
        //             "blockchain":"DOGE",
        //             "addresses":[
        //                 "DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54"
        //             ]
        //         }
        //     ],
        //     "selectedWallets":{
        //         "DOGE":"DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54",
        //         "BCH":"qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p"
        //     },
        //     "checkPrerequisites":false,
        //     "affiliateRef":null
        // }
        //
        // let output = await rango.getQuote(body)
        // console.log("output: ",output)
        // console.log("id: ",id)
        
        // let output = await rango.createTransaction(id)
        // console.log("output: ",output)
        
        // console.log("result: ",JSON.stringify(result))
        // console.log("result: ",result.result)
        // console.log("result: ",result.result.swaps)
    }catch(e){
        console.error(e)
    }
}
run_test()
