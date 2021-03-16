require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")
network.init('full')


// let xpub = ""
// network.utxosByXpub("TESTNET",xpub)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })


// let tx = "0100000001e7f4ad279f730c8b094ba1309dd9dd2ce1164951c655232166c265c52a0a6416000000006b4830450221008e469628cd9cdb83a4d27c2b25d8f00abeec02d883961d59bc7167b7f01067e8022071091e27dba91e2778e891333bb99f6433cfed61dead386cc293daeca7949aad012103024e1287e56db83bb39158c6ac3e330937bf214d5641058d496f8ba359be0e30ffffffff0210270000000000001976a914e08465106ab704cbbcceffa9e98436bae4a292a888ac4ee50200000000001976a914e08465106ab704cbbcceffa9e98436bae4a292a888ac00000000"
//
// network.broadcast("TEST",tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
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

// let xpub = ""
// network.utxosByXpub("DOGE",xpub)
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
