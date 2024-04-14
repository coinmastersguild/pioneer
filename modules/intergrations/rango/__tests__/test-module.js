

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

        // let body = {
        //     "from":{
        //         "blockchain":"BASE",
        //         "symbol":"ETH",
        //         "address":null
        //     },
        //     "to":{
        //         "blockchain":"BASE",
        //         "symbol":"PRO",
        //         "address":"0xef743df8eda497bcf1977393c401a636518dd630"
        //     },
        //     "amount":"0.01",
        //     "connectedWallets":[
        //         {
        //             "blockchain":"ETH",
        //             "addresses":[
        //                 "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             ]
        //         },
        //         {
        //             "blockchain":"BASE",
        //             "addresses":[
        //                 "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             ]
        //         }
        //     ],
        //     "selectedWallets":{
        //         "ETH":"0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //         "BASE":"0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //     },
        //     "checkPrerequisites":false,
        //     "affiliateRef":null
        // }

        // let body = {"from":{"blockchain":"BCH","symbol":"BCH","address":null},"to":{"blockchain":"DOGE","symbol":"DOGE","address":null},"amount":"1","connectedWallets":[{"blockchain":"BCH","addresses":["bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p"]},{"blockchain":"DOGE","addresses":["DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54"]}],"selectedWallets":{"DOGE":"DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54","BCH":"bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p"},"checkPrerequisites":false,"affiliateRef":null}
        //

        // let body = {
        //     "from":{
        //         "blockchain":"ETH",
        //         "symbol":"ETH",
        //         "address":null
        //     },
        //     "to":{
        //         "blockchain":"BCH",
        //         "symbol":"BCH",
        //         "address":null
        //     },
        //     "amount":"0.02",
        //     "connectedWallets":[
        //         {
        //             "blockchain":"ETH",
        //             "addresses":[
        //                 "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             ]
        //         },
        //         {
        //             "blockchain":"BASE",
        //             "addresses":[
        //                 "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             ]
        //         }
        //     ],
        //     "selectedWallets":{
        //         "ETH":"0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //         "BCH":"qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p"
        //     },
        //     "checkPrerequisites":false,
        //     "affiliateRef":null
        // }

        //let body = {"from":{"blockchain":"BCH","symbol":"BCH","address":null},"to":{"blockchain":"ETH","symbol":"ETH","address":null},"amount":"0.115","connectedWallets":[{"blockchain":"BCH","addresses":["bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p"]},{"blockchain":"ETH","addresses":["0x141D9959cAe3853b035000490C03991eB70Fc4aC"]}],"selectedWallets":{"ETH":"0x141D9959cAe3853b035000490C03991eB70Fc4aC","BCH":"bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p"},"checkPrerequisites":false,"affiliateRef":null}

        // let body = {
        //     "from":{
        //         "blockchain":"ETH",
        //         "symbol":"ETH",
        //         "address":null
        //     },
        //     "to":{
        //         "blockchain":"BASE",
        //         "symbol":"ETH",
        //         "address":null
        //     },
        //     "amount":"0.100",
        //     "connectedWallets":[
        //         {
        //             "blockchain":"ETH",
        //             "addresses":[
        //                 "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             ]
        //         },
        //         {
        //             "blockchain":"BASE",
        //             "addresses":[
        //                 "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             ]
        //         }
        //     ],
        //     "selectedWallets":{
        //         "BASE":"0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //         "ETH":"0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //     },
        //     "checkPrerequisites":false,
        //     "affiliateRef":null
        // }

        // let body = {
        //     "from":{
        //         "blockchain":"BASE",
        //         "symbol":"ETH",
        //         "address":null
        //     },
        //     "to":{
        //         "blockchain":"BASE",
        //         "symbol":"PRO",
        //         "address":"0xef743df8eda497bcf1977393c401a636518dd630"
        //     },
        //     "amount":"0.100",
        //     "connectedWallets":[
        //         {
        //             "blockchain":"ETH",
        //             "addresses":[
        //                 "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             ]
        //         },
        //         {
        //             "blockchain":"BASE",
        //             "addresses":[
        //                 "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             ]
        //         }
        //     ],
        //     "selectedWallets":{
        //         "BASE":"0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //         "ETH":"0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //     },
        //     "checkPrerequisites":false,
        //     "affiliateRef":null
        // }
        //
        //
        // let output = await rango.getQuote(body)
        // console.log("output: ",output)
        // console.log("output: ",JSON.stringify(output))
        // console.log("id: ",id)
        
        // let id = '9ac24a87-3a6f-4d3d-89d7-1dbf57c974d5'
        // let output = await rango.createTransaction(id)
        // console.log("output: ",output)
        
        // console.log("result: ",JSON.stringify(result))
        // console.log("result: ",result.result)
        // console.log("result: ",result.result.swaps)

        //lookup
        /*
              requestId: string
              step: number
              txId: string
         */
        let payload = {
            requestId: "5a27dcb0-887a-42eb-a110-14108d60e82f",
            step: 1,
            txId: "0xdf53e8ef1cd631078107e8be8ee715adb7ebba3bd296fda6d585d339733ccd58"
        }
        let status = await rango.getTransactionStatus(payload.requestId, payload.step, payload.txId)
        console.log("status: ", status)
    }catch(e){
        console.error(e)
    }
}
run_test()
