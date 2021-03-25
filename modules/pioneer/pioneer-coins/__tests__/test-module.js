
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

// import * as config ""
let {
    supportedBlockchains,
    supportedAssets,
    getPaths,
    get_address_from_xpub
} = require('../lib/index.js')

let paths = getPaths(true)
console.log("",paths)

console.log("",supportedBlockchains)

//console.log(getPaths())

//get


// let xpub = "xpub6D1weXBcFAo8CqBbpP4TbH5sxQH8ZkqC5pDEvJ95rNNBZC9zrKmZP2fXMuve7ZRBe18pWQQsGg68jkq24mZchHwYENd8cCiSb71u3KD4AFH"
// let scriptType = "p2pkh"
// let coin = "BTC"
// let account = 0
// let index = 0
// let isTestnet = true
//
// get_address_from_xpub(xpub,scriptType,coin,account,index,false,isTestnet)
//     .then(function(address){
//         console.log("address: ",address)
//     })


