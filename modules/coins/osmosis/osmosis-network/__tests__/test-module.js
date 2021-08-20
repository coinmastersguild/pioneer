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

let address = 'osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn'
//let address = 'osmo15cenya0tr7nm3tz2wn3h3zwkht2rxrq7g9ypmq'
//let address = 'osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6'
// let address = 'osmo1g33z2rn60acm3e897gmnjfpttfs4hfxzwu8pf6'
// network.getAccount(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getAccountInfo(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = 'osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6'
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getDelegations(address,"osmovaloper1cyw4vw20el8e7ez8080md0r8psg25n0cq98a9n")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getBlockHeight()
//     .then(function(resp){
//         console.log("resp: ",resp)
//         // console.log("resp: ",JSON.stringify(resp.pools[0]))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

//get pools
// network.getPools()
//     .then(function(resp){
//         // console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp.pools[0]))
//         // console.log("resp: ",JSON.stringify(resp.pools[0]))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

network.transaction("7253107953F220C95924E91995988DB9E0CC6F94DF9D0808C8B2F241E71B0269")
    .then(function(resp){
        console.log("resp: ",JSON.stringify(resp))
        //console.log("resp: ",JSON.stringify(resp))
    })

// network.txs("osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

//good
// let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"80000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"100000","denom":"uosmo"}],"from_address":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6","to_address":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn"}}],"signatures":[{"signature":"4u/eYBnhQigP07lNm9KjLNsReGp0IoiG+HkCQMyEKAIpBgfemnEUg90LMVVRX7e1+fqCrLWPspMbz67romkyBQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

//bad
// let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"80000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgDelegate","value":{"delegator_address":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn","validator_address":"osmovaloper1cyw4vw20el8e7ez8080md0r8psg25n0cq98a9n","amount":[{"denom":"uosmo","amount":"100"}]}}],"signatures":[{"signature":"f6UHPOfP2EIpAoBDQA7N4IPufwHcYuwdMOeD2evs6Kcr5hp+6MbCqXmLsGQnEKWjeyyxwar0bp1U/ZL0q9Zk5A==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AvDuqURiCj8S0tQDxSmNL4fUzfAJez6Vy2e3DLQNpmcl"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// tx = JSON.parse(tx)
// tx = tx.tx
// tx = JSON.stringify(tx)

//good
// let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"190000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgBeginRedelegate","value":{"delegator_address":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn","validator_dst_address":"osmovaloper1n3mhyp9fvcmuu8l0q8qvjy07x0rql8q4d3kvts","amount":{"denom":"uosmo","amount":"100"}}}],"signatures":[{"signature":"3d25z15KIUI7FVw0TSipv9ojAurJ3hS1o1fPBIo9wyEp8SF0ta4e30WiggfUaFPNfzxLppNE5uFQ4wva6JWDEA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AvDuqURiCj8S0tQDxSmNL4fUzfAJez6Vy2e3DLQNpmcl"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//     })
