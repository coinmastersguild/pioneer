/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let scamdb = require("../lib")

let testAddy = "0x015fcA1D09287823e634AE51237ee1eeFF03D9d5"

scamdb.checkAddress(testAddy)
    .then(function(resp){
        console.log(JSON.stringify(resp))
    })