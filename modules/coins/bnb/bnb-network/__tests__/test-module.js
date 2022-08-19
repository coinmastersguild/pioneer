/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// let address = "bnb1ez03p4sd8lf985c0tghl9deham56692z94gthw"
// network.getAccount(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


// let address = "bnb1nzx5sycdzpfa446u3nep6yn9z9x5xdnmn3hf7c"
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//get transaction
// let txid = "9F36D685639F8207DB9281C77172FFF0B78A2DEB28400C7B183BCB3ACFD60671"
// network.transaction(txid)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

let tx = "c101f0625dee0a4a2a2c87fa0a210a14c89f10d60d3fd253d30f5a2ff2b737eee9ad154212090a03424e4210a08d0612210a142023e508399b9f0ff4ff784c14bce6427e69a66812090a03424e4210a08d06126f0a26eb5ae98721024de5c45b971a7d0a417b8b8ad3d0dd1b4b56fb762b9bfefa618ec396b7babbe01240cfe0f12f9d32e616511f50d9aa89a6b0b172593d40d143591a97861f9586d6e212691a8ae6421fa3cf2126419c98461fb49c5318a44d4968d9df5ff83e9562bf18f8d3b703"
network.broadcast(tx)
    .then(function(resp){
        console.log("resp: ",resp)
    })
