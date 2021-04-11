
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

// import * as config ""
let {
    supportedBlockchains,
    supportedAssets,
    getPaths,
    get_address_from_xpub,
    normalize_pubkeys
} = require('../lib/index.js')

let paths = getPaths(true,['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance'])
console.log("paths: ",paths)

console.log("supportedAssets: ",supportedAssets)
//console.log("supportedBlockchains: ",supportedBlockchains)

//console.log(getPaths())

//get
// let result = [{"xpub":"xpub6D1weXBcFAo8HPiRxhc6tBvwu7o35mYfn2BemJhhB93syYFJ1FCE7Rn2dbLNh1EPqKG3BAuB66gLyqgW8ouxyo1hnU1p9xQpFSNQgXDuQL4"},{"xpub":"xpub6GBpXvAiKQnvjHgC5qSoM3mJs4BGaRHeq8AYUf3bTyEyNx1fwhrDaX17wSwTzyjrbz2N85RLeJZqVsEJtGhsXZNJT7yMZ4mEs5T41jhg8U7"},{"xpub":"xpub6FkHm9bKQbvo1T28h8haU9iXBojqejUsS5JEvdmaDnbyfYN6jLd9M8VrhMS8ibEHcpTefHu9yxC7rfffLeWPS4jDqT1Vq5r2k3D9ySwm4uL"},{"xpub":"xpub6FkHm9bKQbvo1T28h8haU9iXBojqejUsS5JEvdmaDnbyfYN6jLd9M8VrhMS8ibEHcpTefHu9yxC7rfffLeWPS4jDqT1Vq5r2k3D9ySwm4uL"}]
//
// let run_test = async function(){
//     try{
//         let pubkeys = await normalize_pubkeys('keepkey',result,paths,true)
//
//         console.log("pubkeys: ",pubkeys)
//     }catch(e){
//         console.error(e)
//     }
// }
// run_test()


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


