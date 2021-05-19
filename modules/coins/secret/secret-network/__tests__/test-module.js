/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")

// let address = "secret1vhtdhfmttwxlvu4ewueqt73tt8y9zv385fagty"
// network.getAccount(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })
//
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//     })

// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//get transaction
let txid = "D888D5BC3889158C2CDC8F8C21566FEB9725247C9062D74BF7374DDEB5468119"
network.transaction(txid)
    .then(function(resp){
        console.log("resp: ",JSON.stringify(resp))
    })

let tx_raw =  {"fee":{"gas":"80000"},"memo":"foobar","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"10000","denom":"uscrt"}],"from_address":"secret1vhtdhfmttwxlvu4ewueqt73tt8y9zv385fagty","to_address":"secret1vhtdhfmttwxlvu4ewueqt73tt8y9zv385fagty"}}],"signatures":[{"signature":"e/8utL6TOi7d7ErTh9ZTj20zAIsUsW+u0TDDaq4cKJpgiFCw1aCHBD2TCxsU6kKX/a2cHPwsOHQunS39g1r1vQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AkT7cYmv8iBC27R1zXv68DklEPEEKN3lvA2sHiNsW3+v"}}]}

let tx = {
    "tx":tx_raw,
    "type":"cosmos-sdk/StdTx",
    "mode":"sync"
}
console.log(JSON.stringify(tx))
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })
