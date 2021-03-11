require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

let network = require("../lib/index")
network.init({testnet:true})

network.getInfo()
    .then(function(resp){
        console.log(resp)
    })

let address = process.env['TEST_ETH_MASTER']
// network.sendToAddress(address,amount,asset,memo)
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })

// //getBalance
network.getBalance(address)
    .then(function(resp){
        console.log(resp)
    })

network.getNonce(address)
    .then(function(resp){
        console.log(resp)
    })

network.getGasPrice(address)
    .then(function(resp){
        console.log(resp)
    })

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
