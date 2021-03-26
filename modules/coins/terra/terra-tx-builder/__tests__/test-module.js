
let txbuild = require('../lib/index')
const prettyjson = require('prettyjson');


let to = 'terra1lqk43hvysuzymrgg08q45234z6jzth32wsx6y3'
let from = 'terra1jhv0vuygfazfvfu5ws6m80puw0f80kk66vn7hd'
let amount = 100000
let memo = 'testmemo'
let seed = 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle'

txbuild.signTx(to,from,amount,memo,seed)
    .then(function(resp){
        console.log(JSON.stringify(resp))
        console.log(prettyjson.render(resp))

    })
