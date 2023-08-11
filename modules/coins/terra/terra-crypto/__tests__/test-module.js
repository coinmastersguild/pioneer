/*
    Thorchain
 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let crypto = require("../lib/index")


// let seed = crypto.generateSeed()
// console.log("seed: ",seed)

let test_seed = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

// let test_seed = process.env['OSMOS_WALLET_1']
// console.log("test_seed: ",test_seed)


//terra1cy3q0zc4u3pzl4chtq3wj02v6u38qfa2huvldh

crypto.generateWalletFromSeed(test_seed)
    .then(function(resp){
        console.log("resp: ",resp)
        //terra station
        //assert
    })

