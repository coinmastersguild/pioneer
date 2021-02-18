require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let Wallet = require('../lib/index.js')

let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"


let run_test_paths = async function(){
    try{
        console.log("Running test")

        //CLI export
        let config =  {
            mnemonic: process.env['WALLET_TEST_SEED'] || 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle',
            username: 'test-1',
            pioneerApi:false,
        }

        //init wallet offline
        let wallet = new Wallet('pioneer',config);

        //get paths
        let paths = wallet.paths('keepkey')
        //console.log("paths: ",paths)
        //console.log("paths: ",paths.length)


        if(paths.length < 11){
            throw Error("Mismatch path length!")
        }

    }catch(e){
        console.error(e)
    }
}

//run tests
//any failures exit code 1+

//test offline functions
run_test_paths()

//

process.exit(0)
