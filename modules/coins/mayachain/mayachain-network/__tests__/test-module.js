/*
    mayachain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// let tx = '{"tx":{"fee":{"amount":[{"amount":"2000000","denom":"rune"}],"gas":"250000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"thor1vvehrsz8rwzaws4j94ak3a4zj7myjerx9xn9yp","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"3aYnRyakFZBMOQRM109TYFWPVbpCiDAVOHWbNTTuxS1OXo2MoI2+JNDgjRCzEIxA3wUEiM7Fj+K+HGX9m4JI4w==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AiuXsiJnUQl/00hULvyEdIXx2Q64TnY+ssyfVU+PCkcc"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"OM+kv4c5c28HTTrOTlAPBkPBc+y6cTrCcZCTYJLu0pAn3JCIiDZ2kzQlKE5y4yy5KXsYFcTxyoDGjyCwxJViiA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AiuXsiJnUQl/00hULvyEdIXx2Q64TnY+ssyfVU+PCkcc"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"1100000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3"}}],"sequence":"44","account_number":"334","signatures":[{"signature":"GjZ0eY8O7yB+IOgVlRRXP7LsUjaBTbY/oy7SAsVOJvRmEnHqWm8RXLRad7vDr1ZFCY7Y6FhxD1aySdfnRe9Ocw==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A9BnfoZvhOO8Y3RpeUFKi6bvTfObGZ0Altybt0wXABUC"},"sequence":"44"}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"50000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3"}}],"sequence":"47","account_number":"334","signatures":[{"signature":"LJD5/1pVVUHopPNpURTEyRnQ3c5dVRnXJKUJrKTuoahlIUkReh1Vt+jjmz7YhJeGcIJDHQXGH4Ki3rKXa0ciCQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A9BnfoZvhOO8Y3RpeUFKi6bvTfObGZ0Altybt0wXABUC"},"sequence":"47"}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let txid = "F1D115CD4F80E57D5F366EAAFDB5268FB3B64313EAF1DC677A5C79077E77CA16"
// let txid = "0E25B52AAA700D538931BD7D14A4A2B1F6B601BBD648FE488609BF4C5274C956"
network.getTransaction(txid)
    .then(function(resp){
        console.log("resp: ",JSON.stringify(resp))
        console.log("resp: ",resp)
    })

//thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5

// network.getLastBlock()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getBlockHeight()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


let address = "maya1ls33ayg26kmltw7jjy55p32ghjna09zp7z4etj"

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

//let signedTx

// let signedTx = 'ClQKSgoOL3R5cGVzLk1zZ1NlbmQSOAoU/CMekQrVt/W70pEpQMVIvKfXlEESFPwjHpEK1bf1u9KRKUDFSLyn15RBGgoKBUNBQ0FPEgExEgZmb29iYXISWApQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAxUZcTuLQr3DZxEtMxMs8Uzt+SisV3HURLpFm5SXEXujEgQKAggBGAcSBBDAmgwaQA2Cr+Xv3KHMFMsO8kUP1CsLrOWMHBEqaTNHLBdQFzMPNstNgv2Iw6LT7DHAqDL98JNnldMfbfk2Bq9Cbm4WJW8='
// network.broadcast(signedTx)
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

