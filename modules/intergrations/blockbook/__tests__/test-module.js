

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let network = require("../lib/index")
network.init()
//console.log("keepkeyPubkeys: ",process.env["TEST_BCH_XPUB"])


network.getTransaction('BCH',"8325a7aa74bedf03ba78926cca4e4ae94af666ac0272ca37e97408c46fad82ee")
    .then(function(resp){
        console.log(resp)
        console.log(JSON.stringify(resp))
    })

// network.utxosByXpub("BCH","xpub6DQeaEQDZFKcrEucnZuzDsP4YPm9fdzNGEzRfwbeFNt5yWEvc2Eb2YMZMjmghJMnrMWT7iTevP2E1dTLUQfNrwk5mAycxXUfEqmJGpN1xFw")
//     .then(function(resp){
//         console.log(resp)
//     })

// network.broadcast("BTC","0100000001b160b71735295f4b3c29956202af20de2ceb308fc051589d1b407058cad11275000000006a4730440220663552016bbaef903f934081850d27852e44adb79355f05d9e89916fdcff9a8e02203fd60160ba494555395e3ee5d996e4bdab76776f3177c6485b534e26eaa1b1740121031b93b955dc7dbd579d45ad3a5b7edf9cf25410e0960bae32eeb8a818c7f5711affffffff021027000000000000160014586d610cebab2b00070cc0b7c2ef30daae040d074e1a0f0000000000160014586d610cebab2b00070cc0b7c2ef30daae040d0700000000")
//     .then(function(resp){
//         console.log("txid: ",resp)
//     })

// network.utxosByXpub("BTC","zpub6rLj8yHs3mXRYSGNBSbajrkwghwLtpZLJf16q8bETA2mhZsMQdcPhXE4QQJAkQMAv8wpVeZYWqm3V45zzyAYS7exCugndVv8F8PmGfBTC5i")
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getEthInfo("0x33b35c665496ba8e71b22373843376740401f106")
//     .then(function(resp){
//         console.log(resp)
//         console.log(JSON.stringify(resp))
//     })

// network.init()
//     .then(function(resp){
//         //hex
//         //btc
//         // network.broadcast("BTC","0100000001b160b71735295f4b3c29956202af20de2ceb308fc051589d1b407058cad11275000000006a4730440220663552016bbaef903f934081850d27852e44adb79355f05d9e89916fdcff9a8e02203fd60160ba494555395e3ee5d996e4bdab76776f3177c6485b534e26eaa1b1740121031b93b955dc7dbd579d45ad3a5b7edf9cf25410e0960bae32eeb8a818c7f5711affffffff021027000000000000160014586d610cebab2b00070cc0b7c2ef30daae040d074e1a0f0000000000160014586d610cebab2b00070cc0b7c2ef30daae040d0700000000")
//         //     .then(function(resp){
//         //         console.log("txid: ",resp)
//         //     })
//
//         network.getAllTokensEth("0x33b35c665496ba8e71b22373843376740401f106")
//             .then(function(resp){
//                 console.log(resp)
//                 console.log(JSON.stringify(resp))
//             })
//
//         //let txid
//         // let txid = "537692a2ab9547e7c2652cf11e3a51023f6877a7817eb8a94269a1c8ffffcced"
//         // network.getTransaction("TEST",txid)
//         //     .then(function(resp){
//         //         console.log(resp)
//         //         console.log(JSON.stringify(resp))
//         //     })
//
//         // console.log(process.env["TEST_BTC_TPUB"])
//         // network.getBalanceByXpub("TEST",process.env["TEST_BTC_TPUB"])
//         //     .then(function(resp){
//         //         console.log(resp)
//         //     })
//
//         // network.utxosByXpub("TEST",process.env["TEST_BTC_TPUB"])
//         //     .then(function(resp){
//         //         console.log(resp)
//         //     })
//
//         // network.getBalanceByXpub("TEST",process.env["TEST_BTC_TPUB"])
//         //     .then(function(resp){
//         //         console.log(resp)
//         //     })
//     })


// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })



// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })
