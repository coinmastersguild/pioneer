/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")

let address = "bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap"
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

// let tx = "c101f0625dee0a4a2a2c87fa0a210a14c89f10d60d3fd253d30f5a2ff2b737eee9ad154212090a03424e4210a08d0612210a142023e508399b9f0ff4ff784c14bce6427e69a66812090a03424e4210a08d06126f0a26eb5ae98721024de5c45b971a7d0a417b8b8ad3d0dd1b4b56fb762b9bfefa618ec396b7babbe01240cfe0f12f9d32e616511f50d9aa89a6b0b172593d40d143591a97861f9586d6e212691a8ae6421fa3cf2126419c98461fb49c5318a44d4968d9df5ff83e9562bf18f8d3b703"
let tx = "c201f0625dee0a4a2a2c87fa0a210a14c5f5c89224c7bbd1207f09bd4cc9562a6ea7efc812090a03424e4210c0843d12210a142023e508399b9f0ff4ff784c14bce6427e69a66812090a03424e4210c0843d12700a26eb5ae9872103cc829a5a856ed65178b4487001883441450b24cbca99d9818972b3c47861ef6112400d9dd9b7c3627242d137b006895c0102eecc20e22ffc65c10d3f2cfefd16400a3d38c8829cd0184931d0d74f73a4aaac9dd155956366a5791a9119713fd6217e18c9e01c2001"
network.broadcast(tx)
    .then(function(resp){
        console.log("resp: ",resp)
    })
