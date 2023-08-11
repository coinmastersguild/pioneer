/*
        Test Network

 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let nodes = require('../lib/index.js')


let run_test = async function(){
    try{
        //
        let nodeUrl = nodes.getUnchaineds()
        console.log(nodeUrl)


    }catch(e){
        console.error(e)
    }
}

run_test()
