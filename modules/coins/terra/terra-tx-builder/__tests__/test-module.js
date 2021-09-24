
let txbuild = require('../lib/index')
const prettyjson = require('prettyjson');


let to = 'terra1aqclfwspzrpw8vju0hcy0prqyy2dksxp7rev27'
let from = 'terra1jhv0vuygfazfvfu5ws6m80puw0f80kk66vn7hd'
let amount = 100000
let memo = 'testmemo'
let seed = 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle'

let sequence = 0
let accountNumber = 0
let chainId = "terra"

txbuild.signTx(to,from,amount,memo,seed)
    .then(function(resp){
        console.log(JSON.stringify(resp))
        console.log(prettyjson.render(resp))
    })
