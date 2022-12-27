/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let pioneerApi = require("../lib")

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

let asset = {
    name: 'XRT Token',
    symbol: 'XRT',
    type: 'ERC20',
    decimals: 18,
    description: '-',
    website: 'https://www.xrtfoundation.org/',
    explorer: 'https://etherscan.io/token/0x37D404A072056EDA0Cd10Cb714D35552329F8500',
    status: 'abandoned',
    id: '0x37D404A072056EDA0Cd10Cb714D35552329F8500',
    blockchain: 'ethereum'
}


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
        let globals = await pioneer.Globals()
        console.log("globals: ",globals.data)

        let apps = await pioneer.AtlasNetwork({start:1,stop:10,limit:5})
        console.log("apps: ",apps.data)

        // let apps = await pioneer.SearchByName('doge')
        // console.log("apps: ",apps.data[0])

        // let appsAdd = await pioneer.AddNetworks()
        // console.log("apps: ",appsAdd.data)

        // let appsRate = await pioneer.RateNetworks()
        // console.log("appsRate: ",appsRate.data)

        // let dir = await fs.readdir('./networks')
        // // console.log(dir)
        // // for(let i = 0; i < dir.length; i++){
        // for(let i = 0; i < dir.length; i++){
        //     let entry = dir[i]
        //     console.log("entry: ",entry)
        //
        //     let entryData = await fs.readJSON('./networks/'+entry+'')
        //
        //
        //     entryData.type = "EVM"
        //     for(let j = 0; j < entryData.rpc.length; j++){
        //         let service = entryData.rpc[j]
        //         entryData.service = service
        //         entryData.image = "https://pioneers.dev/coins/"+entryData.name+".png"
        //         entryData.tags = ["KeepKeySupport","WalletConnectSupport","DappSupport",entryData.name,entryData.shortName,entryData.chain]
        //         console.log("entryData: ",entryData)
        //         // let appsAdd = await pioneer.ChartNetwork({},entryData)
        //         // console.log("apps: ",appsAdd.data)
        //     }
        // }

        // asset.tags = [asset.blockchain]
        // let appsAdd = await pioneer.ChartAsset({},asset)
        // console.log("apps: ",appsAdd.data)

        //get asset


    }catch(e){
        console.error(e)
    }
}

run_test()
