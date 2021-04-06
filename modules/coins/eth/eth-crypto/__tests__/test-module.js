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
// let test_seed = process.env['WALLET_TEST_SEED']
console.log("test_seed: ",test_seed)

// let xpub = process.env['REFERENCE_ETH_XPUB_KEEPKEY']
// console.log("xpub: ",xpub)
//
// crypto.generateAddress(xpub,0,false)
//     .then(function(resp){
//         console.log("resp:     ",resp)
//         console.log("expected: ","0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8")
//         //assert
//     })


crypto.generateWalletFromSeed(test_seed)
    .then(function(resp){
        console.log("resp: ",resp)

        //assert
    })

