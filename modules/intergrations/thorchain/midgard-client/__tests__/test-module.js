require("dotenv").config({path:'../../../.env'})
// require("dotenv").config({path:'../../../../.env'})
// require("dotenv").config({path:'../../../../../.env'})

// const colorize = require('json-colorizer');
let midgard = require("../lib")
// let beautify = require("json-beautify");
// let log = function(tag,obj){
//     try{
//         // console.log(tag, beautify(obj, null, 2, 100));
//         console.log(tag, colorize(beautify(obj, null, 2, 100)));
//     }catch(e){
//         console.error(e)
//     }
// }

let run_test = async function(){
    try{

        // let info = await midgard.getInfo()
        // console.log("info: ",info)

        // let pools = await midgard.getPools()
        // console.log("pools: ",pools)

        //get price
        // let price = await midgard.getPrice("BNB.ETH-D5B")
        // console.log("price: ",price)

        // let poolInfo = await midgard.getPool("BNB.ETH-D5B")
        // console.log("poolInfo: ",poolInfo)

        //compair to
        // let addresses = await midgard.getPoolAddress()
        // console.log("addresses: ",addresses)

        // let addresses = await midgard.getNewAddress()
        // console.log("addresses: ",addresses)

        // let poolInfo = await midgard.getPool("BNB.BULL-BE4")
        // console.log("poolInfo: ",poolInfo)

        //get transactions by address

        //get transaction by txid
        let txid = "0xba80674e3a5c323e9d2dbfac2d30a5bad3db20bc9fcf5cdb0713f4d2a8c9e239"
        txid = txid.toUpperCase()
        let txInfo = await midgard.getTransaction(txid)
        console.log("txInfo: ",JSON.stringify(txInfo))

    }catch(e){
        console.error(e)
    }
}

run_test()
