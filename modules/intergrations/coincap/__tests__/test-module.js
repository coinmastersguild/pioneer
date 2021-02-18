
let client = require('../index')

// client.getValue("ETH","0.01")
//     .then(function(resp){
//         console.log(JSON.stringify(resp))
//     })

// client.getPrice("BTC")
//     .then(function(resp){
//         console.log(JSON.stringify(resp))
//     })

// client.assets()
//     .then(function(resp){
//         console.log(resp['BNB'])
//     })

let portfolio = {
    "BTC":1,
    "LTC":5,
    "BCH":10
}
//get value in eth
client.valuePortfolio(portfolio)
    .then(function(resp){
        console.log(resp)
        console.log(Object.keys(resp))
    })
