require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

const prettyjson = require('prettyjson');
let SDK = require('../lib/index.js')

// let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
let urlSpec = process.env['URL_PIONEER_SPEC']

let spec = process.env['URL_PIONEER_SPEC']
let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        let config = {
            queryKey,
            username,
            spec,
            service:'asgardx',
            url:'swaps.pro'
        }

        //console.log(SDK)
        let app = new SDK.SDK(spec,config,true)
        //console.log(app)
        let seedChains = ['Bitcoin','Ethereum','Thorchain']
        await app.init(seedChains)

        //init
        // let app = new SDK(urlSpec,config)
        // await app.init()
        //
        //console.log("app: ",app)

        // let code = await app.createPairingCode()
        // console.log("code: ",code)

        //is paired?
        let info = await app.getInfo()
        console.log("info: ",info)

        if(!info || info.error){
            console.log("Not paired! ")
            //create pairing code
            let code = await app.createPairingCode()
            console.log("code: ",code)
        } else {
            //get user
            let user = await app.getUserParams()
            console.log("user: ",user)

            //binance
            // const address = await user.binance.client.getAddress();
            // const bncBalances = await user.binance.bncClient.getBalance(address);
            //
            // console.log("user: ",address)
            // console.log("bncBalances: ",bncBalances)
            //BTC

            //ETH

            //intergration test asgard-exchange
            let blockchains = Object.keys(user.clients)
            console.log("blockchains: ",blockchains)

            for(let i = 0; i < blockchains.length; i++){
                let blockchain = blockchains[i]
                let client = user.clients[blockchain]

                let balance = await client.getBalance()
                console.log(blockchain+ " balance: ",balance)
            }

            //send eth

            let txid = await app.sendToAddress('ethereum','ETH',0.001,'0x33b35c665496bA8E71B22373843376740401F106')
            console.log("txid: ",txid)
        }



    }catch(e){
        console.error(e)
    }
}

run_test()
