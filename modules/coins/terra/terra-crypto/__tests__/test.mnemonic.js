/*
    osmosis
 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let crypto = require("../lib/index")
let assert = require('assert')

let TEST_SEED = process.env['TEST_SEED'] || "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

let TEST_SEED_MASTER_OSMOSIS = process.env['TEST_SEED_MASTER_COSMOS'] || 'terra1ls33ayg26kmltw7jjy55p32ghjna09zp7kgw2a'

console.log("TEST_SEED: ",TEST_SEED)
crypto.generateWalletFromSeed(TEST_SEED)
    .then(function(resp){
        console.log("resp: ",resp)

        //TODO not matching kepler
        assert(resp.masterAddress)
    })
