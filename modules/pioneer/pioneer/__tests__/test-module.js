/*
        Test Network

 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
const log = require('@pioneer-platform/loggerdog')()
let pioneer = require('../lib/index.js')


let run_test = async function(){
    try{
        log.debug("run test")
        let success = await pioneer.init()
        log.debug("onStart: ",success)
        //username

        //pubkeys
        //let pubkey = "0x33b35c665496bA8E71B22373843376740401F106"
        
        //get all caips for pubkey?
        let pubkey = {
            username: 'user:41922b63',
            queueId: 'lol',
            pubkey: '0x141d9959cae3853b035000490c03991eb70fc4ac',
            symbol: 'ETH',
            asset: 'ethereum',
            path: "m/44'/60'/0'",
            script_type: 'ethereum',
            network: 'ethereum',
            created: 1639943279110,
            tags: [],
            master: '0x141d9959cae3853b035000490c03991eb70fc4ac',
            address: '0x141d9959cae3853b035000490c03991eb70fc4ac',
            context: '0x141d9959cae3853b035000490c03991eb70fc4ac.wallet'
        }
        
        let result = await pioneer.balances(pubkey)
        console.log(result)

        let balances = result.balances
        log.debug("balances",balances.length)
        for(let i = 0; i < balances.length; i++){
            let balance = balances[i]
            //log.debug(balance)
            if(!balance.balance) throw Error("Missing balance! "+balance.symbol)
            if(!balance.context) throw Error("Missing context! "+balance.symbol)
            if(!balance.assetCaip) throw Error("Missing assetCaip! "+balance.symbol)
            if(!balance.blockchainCaip) throw Error("Missing assetCaip! "+balance.symbol)
        }

    }catch(e){
        console.error(e)
    }
}

run_test()
