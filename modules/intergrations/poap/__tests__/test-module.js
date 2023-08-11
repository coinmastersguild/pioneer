require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let client = require("../lib/index")



let run_test = async function(){
    try {
        let address = "0x2356A15042F98f0a53784F42237bd4b2873AADCF"
        let nfts = await client.getNFTs(address)
        console.log("nfts: ",nfts)
    }   catch (e) {
        console.error(e)
    }
}
run_test()

