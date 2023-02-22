/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let pioneerApi = require("../lib")
const semver = require('semver')
// let signer = require("eth_mnemonic_signer")

//force
// process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

// process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:4000/spec/swagger.json"

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
        console.log("spec: ",spec)
        let pioneer = new pioneerApi(spec,config)
        pioneer = await pioneer.init()
        // pioneer = await pioneer.Health()

        // console.log(signer)
        // let globals = await pioneer.Globals()
        // console.log("globals: ",globals.data)

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
        //0x4e15361fd6b4bb609fa63c81a2be19d873717870
        //0xc770eefad204b5180df6a14ee197d99d808ee52d
        // let info = await pioneer.SearchByContract("0x02d980a0d7af3fb7cf7df8cb35d9edbcf355f665")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByBlockchainName("binance")
        // console.log("info: ",info.data)


        let info = await pioneer.SearchByBlockchainName("binance-smart-chain")
        console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByBlockchainName("bit")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByNetworkName("polygon")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])


        // let info = await pioneer.SearchByNetworkName("ethereum")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        //SearchByNetworkId
        // let info = await pioneer.SearchByNetworkId(1)
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

        // let info = await pioneer.ListAppsByName({name:"KeepKey Desktop SDK"})
        // console.log("info: ",info.data)


        //get asset info
        // let asset = "Bitcoin"
        // let version = "v7.7.0"
        // let expectedVersion = "v7.5.2"
        // function isOlderVersion(currentVersion, latestVersion) {
        //     let parsedCurrentVersion = currentVersion.split('.');
        //     let parsedLatestVersion = latestVersion.split('.');
        //
        //     for (let i = 0; i < parsedCurrentVersion.length; i++) {
        //         if (parseInt(parsedCurrentVersion[i]) < parseInt(parsedLatestVersion[i])) {
        //             return true;
        //         }
        //     }
        //     return false;
        // }
        //
        // let result = isOlderVersion(version, expectedVersion); // true
        // console.log(result)

        // let asset = {
        //     "assetId": "keepkey_ETH",
        //     "chainId": "keepkey_ETH",
        //     "color": "",
        //     "explorer": "",
        //     "explorerAddressLink": "",
        //     "explorerTxLink": "",
        //     "icon": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
        //     "name": "Ethereum",
        //     "asset": "Ethereum",
        //     "precision": 1,
        //     "symbol": "ETH",
        //     "rank": 2,
        //     "marketCap": 192877571723,
        //     "geckoId": "ethereum",
        //     "link": "https://www.coingecko.com/en/coins/ethereum",
        //     "version": "2.0.2",
        //     "limit": 1000,
        //     "skip": 0
        // }

        // let asset = {
        //     "assetId": "keepkey_USDC",
        //     "chainId": "keepkey_USDC",
        //     "color": "",
        //     "explorer": "",
        //     "explorerAddressLink": "",
        //     "explorerTxLink": "",
        //     "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
        //     "name": "USD Coin",
        //     "precision": 1,
        //     "symbol": "USDC",
        //     "rank": 4,
        //     "marketCap": 43087355519,
        //     "geckoId": "usd-coin",
        //     "link": "https://www.coingecko.com/en/coins/usd-coin",
        //     "asset": "USD Coin",
        //     "version": "2.0.2",
        //     "limit": 1000,
        //     "skip": 0
        // }
        // let dapps = await pioneer.ListAppsByVersionAndAsset(asset)
        // // console.log("dapps: ",dapps)
        // console.log("dapps: ",dapps.data)
        // // console.log("score: ",dapps.data[0].score)

        // let dapps = await pioneer.ListAppsByVersionAndAsset({
        //     "asset": "Dash",
        //     "version": "2.0.2",
        //     "limit": 1000,
        //     "skip": 0
        // })
        // console.log("dapps: ",dapps)
        // console.log("dapps: ",dapps.data)
        // console.log("score: ",dapps.data[0].score)

        // let info = await pioneer.ListApps({limit:1000,skip:0})
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])
        //
        // let name = "ripple"
        // let assetsByName = await pioneer.SearchAssetsByName(name)
        // console.log("info: ",assetsByName.data)

        //list apps by blockchain
        // let blockchain = "dash"

        // let info = await pioneer.SearchBlockchainsPaginate({limit:1000,skip:0})
        // console.log("info: ",info.data.length)

        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.ListApps({blockchain,limit:1000,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let minVersion = '2.0.0'
        // let info = await pioneer.ListAppsByVersion({minVersion,limit:1000,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchDappsPageniate({limit:1000,skip:0})
        // console.log("info: ",info.data[0].score)
        // console.log("info: ",info.data[1].score)
        // console.log("info: ",info.data[2].score)
        // console.log("info: ",info.data[186].score)
        // const sortArrayByScore = (arr) => {
        //     return arr.sort((a, b) => {
        //         if (a.score === undefined) a.score = 0;
        //         if (b.score === undefined) b.score = 0;
        //         return b.score - a.score;
        //     });
        // }
        // info.data = sortArrayByScore(info.data)
        // // info.data = info.data.sort(function(a, b) {
        // //     return parseFloat(a.score) - parseFloat(b.score);
        // // });
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0].score)
        // console.log("info: ",info.data[1].score)
        // console.log("info: ",info.data[2].score)
        // console.log("info: ",info.data[186].score)

        // let info = await pioneer.SearchAssetsPageniateByChainId({chainId:"1",limit:1000,skip:0})
        // console.log("info: ",info.data)

        // searchByNameAndChainId

        // let info = await pioneer.SearchByNetworkName('bin')
        // console.log("onStart: info: ",info.data[0])

        // let info = await pioneer.SearchByBlockchainName('ethereum')
        // console.log("onStart: info: ",info.data[0])

        // let info = await pioneer.SearchByBlockchainName('dash')
        // console.log("onStart: info: ",info.data[0])

        // let info = await pioneer.SearchAssetsList({limit:10000,skip:0})
        // console.log("info: ",info.data.length)

        // let info = await pioneer.SearchAssetsListByChainId({chainId:56,limit:10000,skip:0})
        // console.log("info: ",info.data)

        // let name = "fox"
        // let info = await pioneer.SearchByNameAndChainId({chainId:1,name})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // console.log("info: ",info.data[0].score)
        // console.log("info: ",info.data[1].score)
        // console.log("info: ",info.data[2].score)
        // console.log("info: ",info.data[186].score)
        // const sortArrayByScore = (arr) => {
        //     return arr.sort((a, b) => {
        //         if (a.score === undefined) a.score = 0;
        //         if (b.score === undefined) b.score = 0;
        //         return b.score - a.score;
        //     });
        // }
        // info.data = sortArrayByScore(info.data)
        // // info.data = info.data.sort(function(a, b) {
        // //     return parseFloat(a.score) - parseFloat(b.score);
        // // });
        // console.log("info: ",info.data[0].score)
        // console.log("info: ",info.data[1].score)
        // console.log("info: ",info.data[2].score)
        // console.log("info: ",info.data[186].score)

    }catch(e){
        console.error(e)
    }
}

run_test()
