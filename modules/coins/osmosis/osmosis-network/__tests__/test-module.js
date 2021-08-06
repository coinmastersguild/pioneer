/*
    osmosis network
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// // let address = 'kava1l4ylj687wmm7d0mk2l29pf9y4k3f09v5zzl0tx'
// let address = 'kava1l4ylj687wmm7d0mk2l29pf9y4k3f09v5zzl0tx'
// // network.getAccount(address)
// //     .then(function(resp){
// //         console.log("resp: ",resp)
// //     })
//
//
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

let txid = "49A5B22089B1EC7D3F84E19EAC3F701574CE3618DC37E1C7BC5B4CDECEE784E3"
network.transaction(txid)
    .then(function(resp){
        console.log("resp: ",JSON.stringify(resp))
    })

//let tx = '{"tx":{"msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"100000","denom":"ukava"}],"from_address":"kava1l4ylj687wmm7d0mk2l29pf9y4k3f09v5zzl0tx","to_address":"kava1lqk43hvysuzymrgg08q45234z6jzth325pg8sk"}}],"fee":{"amount":[{"amount":"5000","denom":"ukava"}],"gas":"200000"},"signatures":[{"account_number":"223649","sequence":"1","signature":"aRn52QarLWtCtvX0zG7rM1pbxMXXh4VmCNe+NnPYG4tuu9WVqutUBlYXZ4en5uJUk4aCAxJDyYt7hqPBJu/6Og==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A0S2EStWWzqvmbjt3nKJ3ExuNkOWcB6DYweE0pYLAcqQ"}}],"memo":""},"mode":"sync"}'

// let tx_raw = {"msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"10","denom":"ukava"}],"from_address":"kava1l4ylj687wmm7d0mk2l29pf9y4k3f09v5zzl0tx","to_address":"kava1lqk43hvysuzymrgg08q45234z6jzth325pg8sk"}}],"fee":{"amount":[{"amount":"5000","denom":"ukava"}],"gas":"200000"},"signatures":[{"signature":"S4Ew11BLIfbhL1RxV+jCW6nITVYZQ+OQbBLKZcGMoQVvhFzIJHC4BUDajsyoi8oAT+aryuQENOixd0HKtK2g+w==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A0S2EStWWzqvmbjt3nKJ3ExuNkOWcB6DYweE0pYLAcqQ"}}],"memo":"testmemo"}
// let tx = {
//     "tx":tx_raw,
//     "type":"cosmos-sdk/StdTx",
//     "mode":"sync"
// }
//
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })
