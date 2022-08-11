require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")
network.init('full')

// let memo = "thisisjustatestbro"
// network.getFeesWithRates("BCH",memo)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// let txid = "83fab6e9084fd3b99bc69221db5c923fa7a8ff1046845940105f88fc551e4d18"
// network.getTransaction("BTC",txid)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// let xpub = "ypub6Wev4wL7q61rBeyLc7GpHF3z3nsSz2LXCga32o5ChbEQSaiSGvg7dQqRWv6Md2FzhefZhHP7NpTz4sYUeCsqxs6brzqoeRb81t7YQpVsy5H"
// // network.getBalanceByXpub("BTC",xpub)
// //     .then(function(resp){
// //         console.log("resp: ",resp)
// //         //console.log("resp: ",JSON.stringify(resp))
// //     })
//
//
// network.utxosByXpub("BTC",xpub)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })


// let tx = "01000000000101df9689cb2485e3d5c883a6687a8164cf9699780743e95226783e5a63d7d30ae20000000000ffffffff03bfd4010000000000160014db7029560dff692d9a05b55134307f5de33ab4c51e54060000000000160014329035c39cb274eb9cdaa662a7ab0eaaae15612b00000000000000003e6a3c3d3a4554482e4554483a3078333362333563363635343936624138453731423232333733383433333736373430343031463130363a313039313033390247304402204f68b5537d146b51a3b02bb50972de662d197174f87f8e1ee80b4b3a2ef01eb40220712dd488133eaffe7ade2cf3a3a78912b4c7674454bf24e6fb4db401bd9f6287012103fa044f4e622a9dc7a877155efad20816c6994f95bd1dc21c339a820395a32e0100000000"
// network.broadcast("BTC",tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

//get transaction
// let txid = "593c4c34aba1d90635e95018d4a9a0e4542ec35adacbb307e0f04901736ec1b9"
// network.getTransaction("BTC",txid)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//     })

// network.getBlockHeight("BCH")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })


// network.getInfo("BCH")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// let xpub = process.env["TEST_BCH_XPUB"]
// console.log(xpub)
//
// network.getFee("BTC")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// let xpub = "xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4"
// network.utxosByXpub("BTC",xpub)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })


// let xpub = process.env["TEST_BTC_XPUB"]
// console.log(xpub)
//
// network.utxosByXpub("BTC",xpub)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })
