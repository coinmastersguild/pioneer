require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let client = require("../lib/index")



let run_test = async function(){
    try {
        // let result = await client.getOwners()
        // console.log("result: ",result)

        // let result = await client.getOwners(0,10)
        // console.log("result: ",result)

        let tokenInfo = await client.getTokenInfo(2)
        console.log("tokenInfo: ",tokenInfo)
        // console.log("tokenInfo: ",tokenInfo.properties.XP.value)
        //let result = await client.getOwners()

        //


    }   catch (e) {
        console.error(e)
    }
}
run_test()

