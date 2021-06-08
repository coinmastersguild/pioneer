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
        let txid = "0x75dcac2dfc67086cfeae0c406b47e5c56c15607d9b22f3526ce86a92a4eaab7c"
        // let txid = '2873A1AF23427931F40BFC0B09D0587B00E7A58E3669B84782F0F24988776D06'
        // //let txid = 'A2BCC716691C2DD4C748456F9BF4C4E862F6A3E7E3D3E820658067B0FA2568DE'
        // let txid = "e932b905e2d19f2a5cce24041cab9d6930faa789a25da391b05b5e51058f3bdb"
        // txid = txid.toUpperCase()
        let txInfo = await midgard.getTransaction(txid)
        console.log("txInfo: ",JSON.stringify(txInfo))

    }catch(e){
        console.error(e)
    }
}

run_test()
