/*
    osmosis network
 */

require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//get validators
// network.getValidators()
//     .then(function(resp){
//         //console.log("resp: ",resp)
//         console.log("resp: ",resp[0])
//         //console.log("resp: ",resp.result.length)
//     })

let address = 'osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6'
// let address = 'osmo1g33z2rn60acm3e897gmnjfpttfs4hfxzwu8pf6'
// network.getAccount(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

network.getAccountInfo(address)
    .then(function(resp){
        console.log("resp: ",resp)
    })

// let address = 'osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6'
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


//osmosis swap
// let txid='0DB06A565AC96B59D724CCBAA10B86DEFC7B5A4CEEC3CC9A89A3A055E19EE108'
//4FDEDD5507D89478739EBB6D09B8DD8A3F6BF06D1F628C7E238A1634CECBAC46
// network.transaction("0D6E9AEE0911F31257E92F4D65AE7840570E86F76552467AAF1B16A4B6B040D9")
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.txs("osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"80000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"100000","denom":"uosmo"}],"from_address":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6","to_address":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn"}}],"signatures":[{"signature":"4u/eYBnhQigP07lNm9KjLNsReGp0IoiG+HkCQMyEKAIpBgfemnEUg90LMVVRX7e1+fqCrLWPspMbz67romkyBQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//     })
