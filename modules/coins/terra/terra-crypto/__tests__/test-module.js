/*
    Thorchain
 */

require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let crypto = require("../lib/index")


// let seed = crypto.generateSeed()
// console.log("seed: ",seed)

let test_seed = "alcohol woman abuse must during monitor noble actual mixed trade anger aisle"

// let test_seed = process.env['OSMOS_WALLET_1']
// console.log("test_seed: ",test_seed)

crypto.generateWalletFromSeed(test_seed)
    .then(function(resp){
        console.log("resp: ",resp)
        let address = "terra1ls33ayg26kmltw7jjy55p32ghjna09zp7kgw2a"
        if(resp.masterAddress === 'terra1ls33ayg26kmltw7jjy55p32ghjna09zp7kgw2a'){
            console.log('winning')
        }
        //assert
    })

