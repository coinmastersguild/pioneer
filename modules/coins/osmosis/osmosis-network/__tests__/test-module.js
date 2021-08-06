/*
    osmosis network
 */

require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


// let address = 'osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6'
// network.getAccount(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = 'osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6'
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//4FDEDD5507D89478739EBB6D09B8DD8A3F6BF06D1F628C7E238A1634CECBAC46
network.transaction("4FDEDD5507D89478739EBB6D09B8DD8A3F6BF06D1F628C7E238A1634CECBAC46")
    .then(function(resp){
        console.log("resp: ",JSON.stringify(resp))
        //console.log("resp: ",JSON.stringify(resp))
    })

// network.txs("osmo15cenya0tr7nm3tz2wn3h3zwkht2rxrq7g9ypmq")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })
