

// import * as config ""
let {
    getPaths,
    get_address_from_xpub
} = require('../lib/index.js')

console.log(getPaths())

let xpub = "xpub6D1weXBcFAo8CqBbpP4TbH5sxQH8ZkqC5pDEvJ95rNNBZC9zrKmZP2fXMuve7ZRBe18pWQQsGg68jkq24mZchHwYENd8cCiSb71u3KD4AFH"
let scriptType = "p2pkh"
let coin = "BTC"
let account = 0
let index = 0


let address = get_address_from_xpub(xpub,scriptType,coin,account,index)
console.log("address: ",address)

