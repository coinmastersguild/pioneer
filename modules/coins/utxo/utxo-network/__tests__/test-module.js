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


// let tx = "0100000001e9af69b3025c3bec173313a896be1d705cc3be312618c60d704e7f10ac2f9f1f010000006b483045022100d250cd8ee490400475052c5500ad670611191219335e89be8dab0fb052e0f43a0220127e1d830296063af7c14091d8acafbbb57e20703066c6ad5e01aef423568b3701210204a578639e5170104800fc90f770aa87abce475fd9646d252e2f824599f77259ffffffff04e803000000000000160014a065cde039a2f2eb96604b129253e8c49db626950000000000000000160014a065cde039a2f2eb96604b129253e8c49db62695b37d9901000000001976a914c01c70d30eb8be36083996800c7513cce1f8f3ec88ac0000000000000000366a343d3a4554482e4554483a30783365343835653243376466373132456331373043303837656366354331353031364130334639334600000000"
//
// network.broadcast("TEST",tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

//get transaction
let txid = "593c4c34aba1d90635e95018d4a9a0e4542ec35adacbb307e0f04901736ec1b9"
network.getTransaction("BTC",txid)
    .then(function(resp){
        console.log("resp: ",resp)
        console.log("resp: ",JSON.stringify(resp))
    })

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
