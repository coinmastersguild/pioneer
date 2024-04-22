
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let changelly = require("../lib/index")

// console.log("servers: ",servers)
let run_test = async function(){
    try{
        //
        await changelly.init()

        // let result = await changelly.getCurrenciesAsync()
        // console.log("result: ",JSON.stringify(result))

        // let changellyBody = {
        //     from: "BCH",
        //     to: "DOGE",
        //     address: "DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54",
        //     amount: "0.2"
        // }
        //
        // from = changellyBody.from
        // to = changellyBody.to
        // address = changellyBody.address
        // amount = changellyBody.amount
        //
        // let result = await changelly.getQuote(from, to, address, amount)
        // console.log("result: ",JSON.stringify(result))

        // let changellyBody = {
        //     from: 'ETH',
        //     to: 'BASE',
        //     address: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //     amount: '0.1'
        // }

        // let changellyBody = {
        //     from: 'ETH',
        //     to: 'XRP',
        //     address: 'rLRYvj3RXU16THYgwhWR3ZN639XAE68RLB',
        //     amount: '0.0200'
        // }

        // from = changellyBody.from
        // to = changellyBody.to
        // address = changellyBody.address
        // amount = changellyBody.amount
        //
        // let result = await changelly.getQuote(from, to, address, amount)
        // console.log("result: ",JSON.stringify(result))

        let id = 'm3sdxe9k9s0mkegx'
        // let id = '3byam0qy7xjojb2j'
        // //"f7e4c6e8c6c1"

        let info = await changelly.getTransactionAsync(id)
        console.log("info: ",info)

        // let info = await changelly.getTransactionsAsync(100,0)
        // console.log("info: ",info)
        
        // //lookup tx
        // // // let id = 'm3sdxe9k9s0mkegx'
        // let id = '9xuz5tlu7wor9kaq'
        // //"f7e4c6e8c6c1"
        // let info = await changelly.getStatusAsync(id)
        //
        // /*
        //     waiting
        //     confirming
        //     exchanging
        //     sending
        //
        //  */
        //
        // console.log("info: ",info)
    }catch(e){
        console.error(e)
    }
}
run_test()
