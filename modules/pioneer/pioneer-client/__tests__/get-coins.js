/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let pioneerApi = require("../lib")

// let signer = require("eth_mnemonic_signer")

//force
process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
//process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let spec = process.env['URL_PIONEER_SPEC']

//const mnemonic = 'all all all all all all all all all all all all'
let mnemonic = process.env['WALLET_MAINNET_DEV']

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

// let queryKey = 'key:d9c55eff-a8d0-48e1-bb0f-db131e5576a0'
// let username  = 'user:1911ccde-89df-4fc4-8a71-56097b9d418b'

// let username = process.env['TEST_USERNAME_1']
// let queryKey = process.env['TEST_QUERY_KEY_1']

// let context = 'keepkey-pubkeys-343733331147363327003800'


let run_test = async function(){
    try{
        //get config
        let config = {
            queryKey:'key:cfd27e74asda',
            username:"user:cfd27e74asd",
            spec
        }
        console.log("config: ",config)

        //get config
        let pioneer = new pioneerApi(spec,config)
        pioneer = await pioneer.init()

        // console.log(signer)
        // let globals = await pioneer.Globals()
        // console.log("globals: ",globals.data)
        //
        // console.log(signer)
        // let info = await pioneer.Info()
        // console.log("info: ",info.data)

        // let info = await pioneer.SearchByNameNative("avalanche x-chain")
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByName("bitcoin")
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByTag("isNative")
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByTagNative("isNative")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByTag("KeepKeySupport")
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByContract("0xc770eefad204b5180df6a14ee197d99d808ee52d")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByBlockchainName("bit")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByNetworkName("bin")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByName("Bitcoin")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchAssetsPageniate({limit:100,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchBlockchainsPageniate({limit:100,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchBlockchainsPageniate({limit:100,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.ListAppsPending({limit:100,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        let info = await pioneer.SearchDappsPageniate({limit:1000,skip:0})
        // console.log("info: ",info.data)
        console.log("info: ",info.data[0].score)
        console.log("info: ",info.data[1].score)
        console.log("info: ",info.data[2].score)
        console.log("info: ",info.data[186].score)
        const sortArrayByScore = (arr) => {
            return arr.sort((a, b) => {
                if (a.score === undefined) a.score = 0;
                if (b.score === undefined) b.score = 0;
                return b.score - a.score;
            });
        }
        info.data = sortArrayByScore(info.data)
        // info.data = info.data.sort(function(a, b) {
        //     return parseFloat(a.score) - parseFloat(b.score);
        // });
        console.log("info: ",info.data[0].score)
        console.log("info: ",info.data[1].score)
        console.log("info: ",info.data[2].score)
        console.log("info: ",info.data[186].score)
    }catch(e){
        console.error(e)
    }
}

run_test()
