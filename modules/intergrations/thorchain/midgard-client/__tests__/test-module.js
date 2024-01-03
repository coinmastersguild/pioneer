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

        let pools = await midgard.getPools()
        console.log("pools: ",pools)
        
        // let queue = await midgard.getOutboundQueue()
        // console.log("queue: ",queue)
        
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
        // let actions = await midgard.getActions()
        // console.log("actions: ",actions)

        //get transaction by txid
        //0xc5c03ae2fb65dadb78da90bd3930b897908d0606c6b979c77799475eebd413c4
        // let address = "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        // let address = "thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx"
        //let txid = "95E617AA12E5523A909BADCF56783801ED65254589F0542CC9F2391B749C9D06"
        // let txid = "9FBE472CD6226300C038260E7A525260C8FB4582E7165D824E2ADA6EAF96CA0E"
        //let txid = ""
        // txid = txid.toUpperCase()
        // txid = txid.replace("0X","")
        // let txInfo = await midgard.getActionsByAddress(address)
        // console.log("txInfo: ",txInfo)
        // console.log("txInfo: ",txInfo.actions)
        // for(let i = 0; i < txInfo.actions.length; i++){
        //     let action = txInfo.actions[i]
        //     const nanoseconds = BigInt(action.date); // Assuming action.date is a string of nanoseconds
        //     const milliseconds = Number(nanoseconds / BigInt(1e6)); // Convert nanoseconds to milliseconds
        //     const date = new Date(milliseconds); // Create a new date object with the milliseconds
        //     console.log("date and time: ", date.toLocaleString()); // Logs the date and time string
        //     // console.log("in: " ,action.in)
        //     // console.log("out: ",action.out)
        //     console.log("out: ",action.out[0].txID)
        //     // console.log("data: ",action.metadata)
        //     console.log("in: " ,action.in[0].txID)
        // }
        // console.log("txInfo: ",JSON.stringify(txInfo))

        // txid = txid.toUpperCase()
        // txid = txid.replace("0X","")
        // let txInfo = await midgard.getTransaction(txid)
        // console.log("txInfo: ",JSON.stringify(txInfo))

        // let txInfo = await midgard.getTransactionsByAddress('0x141D9959cAe3853b035000490C03991eB70Fc4aC')
        // console.log("txInfo: ",JSON.stringify(txInfo))
        
        // let txInfo = await midgard.getTransactionsByAffiliate('kk')
        // console.log("txInfo: ",JSON.stringify(txInfo))
        
    }catch(e){
        console.error(e)
    }
}

run_test()
