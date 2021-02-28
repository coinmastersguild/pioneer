require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")
network.init('full')

// let tx = "0100000001693346eabd2c5d0b5d965cd04ac8dd4c230a2fe5a7a6066b18efe7c1d98a8a4e010000006a4730440220665efb296ef56b7d1112b2ce3d518fb6fb199c96ab760dd7a38518d73d49eeef02203a5ecbff1dc8e2911365e6b485b237b8eaa73e69aeac171695cf9db50c204870412102f225aedffc64fe35f9c86684cf33316b190fd58c9d4e2dac4f679008a5469655ffffffff02e74a0900000000001976a914ef6b6ea4d7c4b6c6852ca940001e3f7a61b4985d88acc2780200000000001976a914cb9e729833a00f7fa2ef35fae6d2ce9b20561ba588ac00000000"
// network.broadcast("BCH",tx)
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

let xpub = ""
network.utxosByXpub("DOGE",xpub)
    .then(function(resp){
        console.log("resp: ",resp)
        //console.log("resp: ",JSON.stringify(resp))
    })


// let xpub = process.env["TEST_BTC_XPUB"]
// console.log(xpub)
//
// network.utxosByXpub("BTC",xpub)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })
