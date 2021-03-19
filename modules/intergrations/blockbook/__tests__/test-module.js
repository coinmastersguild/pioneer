

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let network = require("../lib/index")

//console.log("keepkeyPubkeys: ",process.env["TEST_BCH_XPUB"])

network.init()
    .then(function(resp){
        //hex
        //btc
        // network.broadcast("BTC","0100000001b160b71735295f4b3c29956202af20de2ceb308fc051589d1b407058cad11275000000006a4730440220663552016bbaef903f934081850d27852e44adb79355f05d9e89916fdcff9a8e02203fd60160ba494555395e3ee5d996e4bdab76776f3177c6485b534e26eaa1b1740121031b93b955dc7dbd579d45ad3a5b7edf9cf25410e0960bae32eeb8a818c7f5711affffffff021027000000000000160014586d610cebab2b00070cc0b7c2ef30daae040d074e1a0f0000000000160014586d610cebab2b00070cc0b7c2ef30daae040d0700000000")
        //     .then(function(resp){
        //         console.log("txid: ",resp)
        //     })



        //let txid
        // let txid = ""
        // network.getTransaction("BTC",txid)
        //     .then(function(resp){
        //         console.log(resp)
        //     })

        // console.log(process.env["TEST_BTC_TPUB"])
        // network.getBalanceByXpub("TEST",process.env["TEST_BTC_TPUB"])
        //     .then(function(resp){
        //         console.log(resp)
        //     })

        // network.utxosByXpub("TEST",process.env["TEST_BTC_TPUB"])
        //     .then(function(resp){
        //         console.log(resp)
        //     })

        network.getBalanceByXpub("TEST",process.env["TEST_BTC_TPUB"])
            .then(function(resp){
                console.log(resp)
            })
    })


// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })



// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })
