require("dotenv").config({path:'../../../.env'})
let crypto = require("../lib/index")

let test_seed = process.env['WALLET_TEST_SEED']

crypto.generateWalletFromSeed(test_seed)
    .then(function(resp){
        console.log("resp: ",resp)
    })
