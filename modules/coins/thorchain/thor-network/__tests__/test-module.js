/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")

// let tx = '{"tx":{"fee":{"amount":[{"amount":"1000","denom":"uatom"}],"gas":"100000"},"memo":"foobar","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"1000","denom":"uatom"}],"from_address":"tthor1jvt443rvhq5h8yrna55yjysvhtju0el7ldnwwy","to_address":""}}],"signatures":[{"signature":"E4aN7j5jX63krwSYJ0hiDKzrKJDdg0GjOlmIndm50JQRqjR/UdlgnjhwoI0owGZN8wFlf1TM8IVXEZvLeGcfTw==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A6T0NOZ8uklJ/og1yewJcp8l9q/Yutc4OwOAfEE+ZPZX"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//tx
// let tx = "295EB20D3E28D1841151D863BDA74DF342401F051B44F34B5515A3D6F2B84F6C"
// network.transaction(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// console.log("address: ",address)
// network.getAccountInfo(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// console.log("address: ",address)
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


let address = process.env['TEST_THOR_MASTER']
if(!address) throw Error("must add TEST_THOR_MASTER to .env")
console.log("address: ",address)
network.txs(address)
    .then(function(resp){
        console.log("resp: ",resp)
    })
