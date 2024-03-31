

let network = require("../lib/index")
network.init()

let networkId = 'eip155:8453'
let address = "0x141d9959cae3853b035000490c03991eb70fc4ac"

// network.getPending(networkId, address)
//     .then(function(resp){
//         console.log(resp)
//     })

//get transaction
let txid = '0xcc9a154ac79086c40796b07d47cfdfcc251c4c6b020ec37f39589b272a929475'
network.getTransaction(networkId,txid)
    .then(function(resp){
        console.log(resp)
    })

// network.getFees(networkId)
//     .then(function(resp){
//         console.log(resp)
//     })
