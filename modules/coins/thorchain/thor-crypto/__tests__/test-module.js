/*
    Thorchain
 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let crypto = require("../lib/index")


// let seed = crypto.generateSeed()
// console.log("seed: ",seed)

let test_seed = process.env['WALLET_MAINNET_DEV_NEW']
console.log("test_seed: ",test_seed)

let isTestnet = null

crypto.generateWalletFromSeed(test_seed,isTestnet)
    .then(function(resp){
        console.log("resp: ",resp)
    })

