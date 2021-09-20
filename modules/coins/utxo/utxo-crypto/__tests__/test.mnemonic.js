/*
    osmosis
 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let crypto = require("../lib/index")
let assert = require('assert')

let TEST_SEED = process.env['TEST_SEED'] || "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

let TEST_SEED_MASTER_BTC_BECH32 = process.env['TEST_SEED_MASTER_BTC'] || 'bc1q7l333k7tzpxlg5txh8jar7l8j92v37f2nvk2aw'

console.log("TEST_SEED: ",TEST_SEED)
crypto.generateWalletFromSeed(TEST_SEED)
    .then(function(resp){
        console.log("resp: ",resp)

        //bech32
        assert(resp.coins.BTC.master,TEST_SEED_MASTER_BTC_BECH32)

        //legacy
        assert(resp.coins.BTC.master,TEST_SEED_MASTER_BTC_BECH32)

    })
