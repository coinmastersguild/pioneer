/*
    This is a test module for the uniswap integration

 */



require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let client = require("../lib/index")

// console.log("servers: ",servers)
let run_test = async function(){
    try{
        
        
        // let result = await client.getRateEth()
        // console.log("result: ",result)

        // let result = await client.getRateEth()
        // console.log("result: ",result)

        let result = await client.getRateProUsd()
        console.log("result: ",result)
    }catch(e){
        console.error(e)
    }
}
run_test()
