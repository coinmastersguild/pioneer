/*
    osmosis
 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let crypto = require("../lib/index")
let assert = require('assert')

let TEST_SEED = process.env['WALLET_MAIN'] || "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

let TEST_SEED_MASTER_OSMOSIS = process.env['TEST_SEED_MASTER_OSMOSIS'] || 'osmo15cenya0tr7nm3tz2wn3h3zwkht2rxrq7g9ypmq'


//osmo19442j2ug37kwyxuhc6qqyfw80xtahtengwnl49
console.log("TEST_SEED: ",TEST_SEED)
crypto.generateWalletFromSeed(TEST_SEED)
    .then(function(resp){
        console.log("resp: ",resp)
        //TODO not matching kepler
        assert(resp.masterAddress)
    })
