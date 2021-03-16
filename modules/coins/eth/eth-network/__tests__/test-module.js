
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

let network = require("../lib/index")
network.init({testnet:true})

//TODO getFees needs a tx template
// let entry = {
//     asset: {
//         chain:"ETH",
//         symbol:"ETH",
//         ticker:"ETH",
//     },
//     amount: BaseAmount;
//     recipient: Address;
//     memo?: string;
// }

// let entry = {"asset":{"chain":"ETH","symbol":"ETH","ticker":"ETH","iconPath":"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png"},"amount":{"type":"BASE","decimal":8,amount:function(){return .98}},"recipient":"0x8b09ee8b5e96c6412e36ba02e98497efe48a29be"}
let entry = {"asset":{"chain":"ETH","symbol":"ETH","ticker":"ETH","iconPath":"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png"},"amount":{"type":"BASE","decimal":8},"recipient":"0x8b09ee8b5e96c6412e36ba02e98497efe48a29be"}

network.getFees(entry)
    .then(function(resp){
        console.log(resp)
    })


// network.sendToAddress(address,amount,asset,memo)
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })

// //getBalance
// network.getBalance(address)
//     .then(function(resp){
//         console.log(resp)
//     })
//
// network.getNonce(address)
//     .then(function(resp){
//         console.log(resp)
//     })
//
// network.getGasPrice(address)
//     .then(function(resp){
//         console.log(resp)
//     })

//
// //getBalanceAddress
// network.getBalanceAddress(address)
//     .then(function(resp){
//         console.log(resp)
//     })

//getBalanceToken
// network.getBalanceToken(address,"FOX")
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getBalanceTokens(address)
//     .then(function(resp){
//         console.log(resp)
//     })
