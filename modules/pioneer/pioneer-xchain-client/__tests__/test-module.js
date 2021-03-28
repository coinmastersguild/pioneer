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

        //enums blockchains supported
        let blockchains = [
            'bitcoin',
            'ethereum',
            'thorchain',
            'binance'
        ]

        //bitcoin
        // let config = {
        //     network:'testnet',
        //     blockchain:blockchains[0],
        //     nativeAsset:'BTC',
        //     queryKey,
        //     username,
        //     spec:urlSpec
        // }
        let isTestnet = true
        // //Binance
        // let config = {
        //     network:'testnet',
        //     blockchain:blockchains[3],
        //     nativeAsset:'BNB',
        //     queryKey,
        //     username,
        //     spec:urlSpec
        // }

        //ethereum
        let config = {
            network:'testnet',
            blockchain:blockchains[1],
            nativeAsset:'ETH',
            queryKey,
            username,
            spec:urlSpec
        }

        //init
        let app = new SDK(urlSpec,config,isTestnet)
        await app.init()

        //console.log(app)

        // let network = app.getNetwork()
        // console.log("network: ",network)
        //
        // let explorerUrl = app.getExplorerUrl()
        // console.log("explorerUrl: ",explorerUrl)
        //
        // let explorerAddressUrl = app.getExplorerAddressUrl()
        // console.log("explorerAddressUrl: ",explorerAddressUrl)
        //
        // let explorerTxUrl = app.getExplorerTxUrl()
        // console.log("explorerTxUrl: ",explorerTxUrl)
        //
        // //
        // const address = await app.getAddress();
        // //const bncBalances = await app.getBalance(address);

        // const fees = await app.getFeeRates();
        // console.log("fees: ",fees)

        // const fees = await app.getFeesWithMemo("adsfasdfasdfdsf");
        // console.log("fees: ",fees)

        // const bncClient = await app.getBncClient()
        // const balances = await app.getBalance(address)
        //
        // console.log("address: ",address)
        // console.log("balances: ",balances)
        // console.log("balances: ",balances[0].amount.amount())
        // console.log("balances: ",balances[0].amount.amount().toString())

        //ETH specific
        // let inputExample = {"asset":{"chain":"ETH","symbol":"ETH","ticker":"ETH","iconPath":"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png"},"amount":{"type":"BASE","decimal":8},"recipient":"0x8b09ee8b5e96c6412e36ba02e98497efe48a29be"}
        // let fees = await app.estimateFeesWithGasPricesAndLimits(inputExample)
        // console.log("fees: ",fees)
        // console.log("fees: ",fees.fees.fastest)
        // console.log("fees: ",fees.fees.fastest.amount())
        // console.log("fees: ",fees.fees.fastest.amount().toNumber())

        //get wallet
        const wallet = await app.getWallet();
        console.log("wallet: ",wallet)

        //make sure provider set

        //ETH
        // let asset = {
        //     chain:"ETH",
        //     symbol:"ETH",
        //     ticker:"ETH",
        // }
        //
        // let swap = {
        //     asset,
        //     vaultAddress:"0xa13beb789f721253077faefd9bf604e1929e0e74",
        //     toAddress:"0x3e485e2c7df712ec170c087ecf5c15016a03f93f"
        // }

        // let amount = 0.0001
        // swap.amount = amount

        let swap = {
            "inboundAddress":{
                "chain":"ETH",
                    "pub_key":"tthorpub1addwnpepqwjl47d8qqyptghwpa6scayg5cxt88nssgt8kygcn823qjgv6gavuqga32f",
                    "address":"0x2345bf0273a6ae4d02a4b4389baef5409139c36a",
                    "router":"0x9d496De78837f5a2bA64Cb40E62c19FBcB67f55a",
                    "gas_rate":"1"
            },
            "asset":{
                "chain":"ETH",
                    "symbol":"ETH",
                    "ticker":"ETH",
                    "iconPath":"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png"
            },
            "memo":"=:THOR.RUNE:tthor1mu7gez4wpkddlsldfc8trn94zqwqumcgeyy78e",
            "amount":{
                "type":"BASE",
                "decimal":18,
                amount: function(){
                    return "0.0101"
                }
            }
        }


        let txid = await app.buildSwap(swap)
        console.log("txid",txid)

        //build a tx
        // let txInput = {
        //     "asset":
        //         {
        //             "chain":"ETH",
        //             "symbol":"ETH",
        //             "ticker":"ETH"
        //         },
        //     "amount":
        //         {
        //             "type":"BASE",
        //             "decimal":18,
        //             amount: function(){
        //                 return "0.0123"
        //             }
        //         },
        //     "recipient":"0x33b35c665496bA8E71B22373843376740401F106"
        // }

        //BTC
        //build a tx
        // let txInput = {
        //     "asset":
        //         {
        //             "chain":"BTC",
        //             "symbol":"BTC",
        //             "ticker":"BTC"
        //         },
        //     "amount":
        //         {
        //             "type":"BASE",
        //             "decimal":18,
        //             amount: function(){
        //                 return "0.0123"
        //             }
        //         },
        //     "recipient":"0x33b35c665496bA8E71B22373843376740401F106"
        // }

        // let txInput = {
        //     "asset":
        //         {
        //             "chain":"BTC",
        //             "symbol":"BTC",
        //             "ticker":"BTC"
        //         },
        //     "amount":
        //         {
        //             "type":"BASE",
        //             "decimal":18,
        //             amount: function(){
        //                 return "0.0123"
        //             }
        //         },
        //     "recipient":"",
        //     "memo":"=:ETH.ETH:0x3e485e2C7df712Ec170C087ecf5C15016A03F93F"
        // }
        //
        // let txid = await app.transfer(txInput)
        // console.log("txid",txid)

        //monitor tx till confirmed

        //

    }catch(e){
        console.error(e)
    }
}

run_test()
