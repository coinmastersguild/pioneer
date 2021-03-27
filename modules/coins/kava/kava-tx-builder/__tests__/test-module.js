
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

let txbuild = require('../lib/index')
const prettyjson = require('prettyjson');


let to = 'kava1lqk43hvysuzymrgg08q45234z6jzth325pg8sk'
let from = ''
let amount = 1000
let memo = 'testmemo'
//let seed = process.env['WALLET_MAINNET_DEV_OLD']
let seed = 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle'

console.log("seed: ",seed)

txbuild.signTx(to,from,amount,memo,seed)
    .then(function(resp){
        console.log(JSON.stringify(resp))
        //console.log(prettyjson.render(resp))

    })
