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

// let address = 'kava1l4ylj687wmm7d0mk2l29pf9y4k3f09v5zzl0tx'
let address = 'kava1lqk43hvysuzymrgg08q45234z6jzth325pg8sk'
network.getBalance(address)
    .then(function(resp){
        console.log("resp: ",resp)
    })
