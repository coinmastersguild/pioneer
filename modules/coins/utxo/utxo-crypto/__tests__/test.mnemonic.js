/*
    osmosis
 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let crypto = require("../lib/index")
let assert = require('assert')

let TEST_SEED = process.env['WALLET_MAIN'] || "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

let TEST_SEED_MASTER_BTC_BECH32 = process.env['TEST_SEED_MASTER_BTC'] || 'bc1q7l333k7tzpxlg5txh8jar7l8j92v37f2nvk2aw'

let hash = "0x29f7212ecc1c76cea81174af267b67506f754ea8c73f144afa900a0d85b24b21319621aeb062903e856352f38305710190869c3ce5a1425d65ef4fa558d0fc251b"

//generateSeedFromHash
crypto.generateSeedFromHash(hash)
    .then(function(resp){
        console.log("resp: ",resp)
    })

// console.log("TEST_SEED: ",TEST_SEED)
// crypto.generateWalletFromSeed(TEST_SEED)
//     .then(function(resp){
//         console.log("resp: ",resp)
//
//         //bech32
//         assert(resp.coins.BTC.master,TEST_SEED_MASTER_BTC_BECH32)
//
//         //legacy
//         assert(resp.coins.BTC.master,TEST_SEED_MASTER_BTC_BECH32)
//
//     })
