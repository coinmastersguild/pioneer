/*
    osmosis
 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let crypto = require("../lib/index")
let assert = require('assert')

let TEST_SEED = process.env['TEST_SEED'] || "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

let TEST_SEED_MASTER_OSMOSIS = process.env['TEST_SEED_MASTER_COSMOS'] || 'cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj'

console.log("TEST_SEED: ",TEST_SEED)
crypto.generateWalletFromSeed(TEST_SEED)
    .then(function(resp){
        console.log("resp: ",resp)

        //TODO not matching kepler
        assert(resp.masterAddress)
    })
