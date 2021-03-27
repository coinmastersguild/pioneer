
let txbuild = require('../lib/index')
const prettyjson = require('prettyjson');


let to = 'secret1vhtdhfmttwxlvu4ewueqt73tt8y9zv385fagty'
let from = 'secret1vhtdhfmttwxlvu4ewueqt73tt8y9zv385fagty'
let amount = '100000'
let memo = 'testmemo'
let seed = 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle'

txbuild.signTx(to,from,amount,memo,seed)
    .then(function(resp){
        console.log(JSON.stringify(resp))
        console.log(prettyjson.render(resp))

    })
