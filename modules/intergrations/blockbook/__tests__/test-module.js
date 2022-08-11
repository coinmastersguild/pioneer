

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let network = require("../lib/index")

let servers = {
    'BTC':process.env['BTC_BLOCKBOOK_URL'],
    'ETH':process.env['ETH_BLOCKBOOK_URL']
}

console.log("servers: ",servers)
network.init(servers)
// network.init(servers)
// network.init()
//console.log("keepkeyPubkeys: ",process.env["TEST_BCH_XPUB"])


// network.broadcast("ETH","0xf86e8202ab85028fa6ae008301388094c3affff54122658b89c31183cec4f15514f34624870aa87bee5380008025a04cbf2dc700925319439ae86413eb50a82a7250eff94a2e6e82b223ff8873ca16a04f2745e71c811889ca6a1fdb36ff33486c0f7b7796638d757a3af1adb3ce1afa")
//     .then(function(resp){
//         console.log("txid: ",resp)
//     })

// let address = ""
// network.getAddressInfo('BTC',"1BToRvt4zvTCrAb4WXLErvbaKNCh9Vpo8w")
//     .then(function(resp){
//         console.log(resp)
//         console.log(JSON.stringify(resp))
//     })

// network.getPubkeyInfo('BTC',"")
//     .then(function(resp){
//         console.log(resp)
//         console.log(JSON.stringify(resp))
//     })

// network.getTransaction('BCH',"")
//     .then(function(resp){
//         console.log(resp)
//         console.log(JSON.stringify(resp))
//     })

//xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K
// network.utxosByXpub("BCH","xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K")
//     .then(function(resp){
//         console.log(resp)
//     })

//xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K

//xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K
// network.utxosByXpub("BCH","xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K")
//     .then(function(resp){
//         console.log(resp)
//     })


// network.utxosByXpub("BTC","xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4")
//     .then(function(resp){
//         console.log(resp)
//     })

//xpub6Cr6W159pVE2uD81Wk9wSTKbV4mCmP4tVUoSEJYXpLG9gQEoX3drsmt2B8dgcdSfpXWL9bGjqoxECNumrt2w9ZKPCa4Gb4uHQ66N6QD5gTv
network.utxosByXpub("DOGE","xpub6Cr6W159pVE2uD81Wk9wSTKbV4mCmP4tVUoSEJYXpLG9gQEoX3drsmt2B8dgcdSfpXWL9bGjqoxECNumrt2w9ZKPCa4Gb4uHQ66N6QD5gTv")
    .then(function(resp){
        console.log(resp)
    })

// network.utxosByXpub("BCH","xpub6DQeaEQDZFKcrEucnZuzDsP4YPm9fdzNGEzRfwbeFNt5yWEvc2Eb2YMZMjmghJMnrMWT7iTevP2E1dTLUQfNrwk5mAycxXUfEqmJGpN1xFw")
//     .then(function(resp){
//         console.log(resp)
//     })

// network.broadcast("BTC","010000000001010b7d1970f03be0fb1a7c5f8d4d6883fb92c074ce5d4ea844acc4d09bc66af1f90000000000ffffffff02bfd401000000000016001404b2d1dfb0f0851f15677952aad0d985dbe4f8917ce6010000000000160014d5912b6b45047455eb1d50d8743a17741b8d56b902483045022100d045b60037b15ec90cc230ff3b90b4f03c555ed20942ae5b55195f1e162260af022051feaf0ee49b8e2e6f8362a654caf1cf3c12c1dcc51dc0a7987c1c75914b938e012103910e3986b59c24876c3d89e14e184abaf6abc97ebf9e2d4f9f6bf6df83a613d100000000")
//     .then(function(resp){
//         console.log("txid: ",resp)
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
