/*
    Thorchain
 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let crypto = require("../lib/index")


// let seed = crypto.generateSeed()
// console.log("seed: ",seed)

// let test_seed = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

//let test_seed = process.env['WALLET_MOBILE_DEV']
// let test_seed = process.env['WALLET_TESTNET_DEV']
let test_seed = process.env['WALLET_MAINNET_DEV_OLD']
console.log("test_seed: ",test_seed)

crypto.generateWalletFromSeed(test_seed)
    .then(function(resp){
        console.log("resp: ",resp)

        //assert
    })

