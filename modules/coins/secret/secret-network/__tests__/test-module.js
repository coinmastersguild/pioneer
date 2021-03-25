/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//get transaction
let txid = "9F36D685639F8207DB9281C77172FFF0B78A2DEB28400C7B183BCB3ACFD60671"
network.transaction(txid)
    .then(function(resp){
        console.log("resp: ",resp)
    })
