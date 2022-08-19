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


let tx = "01000000000102e42a6159297d5f7bb4c176f1042fc975e4c6d056539e91f572f0a66e2bd7e6e70000000000ffffffff2a91dc28b19d23576273ad365b52c60f5a93b5b3cd0b484669fc7f2fb42d3c610000000000ffffffff02400d0300000000001600145f8ea5276f7c11673440f27d20fca81d982077cd00000000000000003e6a3c3d3a4554482e4554483a3078323335364131353034324639386630613533373834463432323337626434623238373341414443463a3230303739383502483045022100ac1a839862540502b56cdf007c89080c74730873b5e3b32e779ed99351f66e62022058c3e07b40df2ce58dd9bdb467ac5e369671d5f8c56e371d623cd32d7242d0d1012102b2972a603d783647374d2fafdd359230e26fe72cdd2316f36212ab6a4b453afc02483045022100c2a909e1cb0a6bb6213a5324e583feae57d00dc2f25b8752e20b6195d2c90a5f02202db41e4de150f8289a8a0513ffae0f6800af9ac4eae8434d1861ed44b7455316012102b2972a603d783647374d2fafdd359230e26fe72cdd2316f36212ab6a4b453afc00000000"
network.broadcast("BTC",tx)
    .then(function(resp){
        console.log("resp: ",resp)
        //console.log("resp: ",JSON.stringify(resp))
    })

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
