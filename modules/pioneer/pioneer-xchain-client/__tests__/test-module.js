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
        let config = {
            network:'testnet',
            blockchain:blockchains[0],
            nativeAsset:'BTC',
            queryKey,
            username,
            spec:urlSpec
        }
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
        // let config = {
        //     network:'testnet',
        //     blockchain:blockchains[1],
        //     nativeAsset:'ETH',
        //     queryKey,
        //     username,
        //     spec:urlSpec
        // }
        //
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

        const fees = await app.getFeeRates();
        console.log("fees: ",fees)

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

        //ETH
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

        let txInput = {
            "asset":
                {
                    "chain":"BTC",
                    "symbol":"BTC",
                    "ticker":"BTC"
                },
            "amount":
                {
                    "type":"BASE",
                    "decimal":18,
                    amount: function(){
                        return "0.0123"
                    }
                },
            "recipient":"0x33b35c665496bA8E71B22373843376740401F106",
            "memo":"=:ETH.ETH:0x3e485e2C7df712Ec170C087ecf5C15016A03F93F"
        }

        // let txid = await app.transfer(txInput)
        // console.log("txid",txid)

        //monitor tx till confirmed

        //

    }catch(e){
        console.error(e)
    }
}

run_test()
