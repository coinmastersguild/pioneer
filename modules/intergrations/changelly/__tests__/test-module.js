
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

        let changellyBody = {
            from: "BCH",
            to: "DOGE",
            address: "DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54",
            amount: "0.2"
        }

        from = changellyBody.from
        to = changellyBody.to
        address = changellyBody.address
        amount = changellyBody.amount

        let result = await changelly.getQuote(from, to, address, amount)
        console.log("result: ",JSON.stringify(result))


    }catch(e){
        console.error(e)
    }
}
run_test()
