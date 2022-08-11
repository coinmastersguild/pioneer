/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


let address = "bnb1ez03p4sd8lf985c0tghl9deham56692z94gthw"
network.getAccount(address)
    .then(function(resp){
        console.log("resp: ",resp)
    })


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

// let tx = "c101f0625dee0a482a2c87fa0a200a1441a3320611caffc31d0148880077f71cfb6509fd12080a03424e4210904e12200a142023e508399b9f0ff4ff784c14bce6427e69a66812080a03424e4210904e12710a26eb5ae987210290916077c387b262a940380d250fd8151c42abf9d8072397797844fab14924c11240370d580aa0ce77496e0fa213e12027d9f635b7b4046369d58e5f2d5ae05d555110d751f1ffe70089ff126d9a9cec85f16f5fb092cb7314be07d5f74b7e3b9adf18eda111208d01"
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })
