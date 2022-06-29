/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// let tx = '{"tx":{"fee":{"amount":[{"amount":"2000000","denom":"rune"}],"gas":"250000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"thor1vvehrsz8rwzaws4j94ak3a4zj7myjerx9xn9yp","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"3aYnRyakFZBMOQRM109TYFWPVbpCiDAVOHWbNTTuxS1OXo2MoI2+JNDgjRCzEIxA3wUEiM7Fj+K+HGX9m4JI4w==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AiuXsiJnUQl/00hULvyEdIXx2Q64TnY+ssyfVU+PCkcc"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"OM+kv4c5c28HTTrOTlAPBkPBc+y6cTrCcZCTYJLu0pAn3JCIiDZ2kzQlKE5y4yy5KXsYFcTxyoDGjyCwxJViiA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AiuXsiJnUQl/00hULvyEdIXx2Q64TnY+ssyfVU+PCkcc"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"50000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3"}}],"sequence":"40","account_number":"334","signatures":[{"signature":"zcGv5HEGS9AmQzoVqj450ViKtr/JX/fNJEQOxTtmnuBT591FNrfP0u0952Vi4LBaUp+8y4VtM2bcKfZoc3U5/g==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A9BnfoZvhOO8Y3RpeUFKi6bvTfObGZ0Altybt0wXABUC"},"sequence":"40"}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
network.broadcast(tx)
    .then(function(resp){
        console.log("resp: ",resp)
    })

// let txid = "0E25B52AAA700D538931BD7D14A4A2B1F6B601BBD648FE488609BF4C5274C956"
// network.getTransaction(txid)
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//         console.log("resp: ",resp)
//     })

//thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5

// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })
//

let address = "thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// console.log("address: ",address)
// network.getAccount(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// let address  = "tthor1ls33ayg26kmltw7jjy55p32ghjna09zp6z69y8"
// console.log("address: ",address)
// network.getAccountInfo(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = process.env['TEST_THOR_MASTER']
// // let address = "tthor1jhv0vuygfazfvfu5ws6m80puw0f80kk67cp4eh" //test seed
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// console.log("address: ",address)
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// console.log("address: ",address)
// network.txs(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

