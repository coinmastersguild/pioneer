require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

const prettyjson = require('prettyjson');
let SDK = require('../lib/index.js')
let BigNumber = require('@ethersproject/bignumber')

let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
//let urlSpec = process.env['URL_PIONEER_SPEC']

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
            'binance',
            'bitcoincash',
            'litecoin'
        ]

        //bitcoin
        // let config = {
        //     network:'mainnet',
        //     blockchain:'bitcoin',
        //     nativeAsset:'BTC',
        //     queryKey,
        //     username,
        //     spec:urlSpec
        // }

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
        //     network:'mainnet',
        //     blockchain:blockchains[1],
        //     nativeAsset:'ETH',
        //     queryKey,
        //     username,
        //     spec:urlSpec
        // }

        let signingPubkey = process.env['DAPP_SIGNING_PUBKEY']
        let signingPrivkey = process.env['DAPP_SIGNING_PRIVKEY']

        let config = {
            // signingPubkey,
            // signingPrivkey,
            network:'mainnet',
            blockchain:'ethereum',
            nativeAsset:'ETH',
            queryKey:'key:f6a5d874-6c35-4fe9-9cd7-921048b37f84',
            username,
            spec:urlSpec
        }

        // let config = {
        //     network:'mainnet',
        //     blockchain:'bitcoincash',
        //     nativeAsset:'BCH',
        //     queryKey,
        //     username,
        //     spec:urlSpec
        // }

        //init
        let app = new SDK(urlSpec,config)
        await app.init()

        let balanceSdk = await app.getBalance()
        console.log(" balanceSdk: ",balanceSdk)
        console.log(" balanceSdk: ",balanceSdk[0].amount.amount().toString())

        let info = await app.info
        console.log(" info: ",info)

        //get transaction


        // let swap = {
        //     "inboundAddress":{
        //         "chain":"ETH",
        //             "pub_key":"tthorpub1addwnpepqwjl47d8qqyptghwpa6scayg5cxt88nssgt8kygcn823qjgv6gavuqga32f",
        //             "address":"0x2345bf0273a6ae4d02a4b4389baef5409139c36a",
        //             "router":"0x9d496De78837f5a2bA64Cb40E62c19FBcB67f55a",
        //             "gas_rate":"1"
        //     },
        //     "asset":{
        //         "chain":"ETH",
        //             "symbol":"ETH",
        //             "ticker":"ETH",
        //             "iconPath":"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png"
        //     },
        //     "memo":"=:THOR.RUNE:tthor1mu7gez4wpkddlsldfc8trn94zqwqumcgeyy78e",
        //     "amount":{
        //         "type":"BASE",
        //         "decimal":18,
        //         amount: function(){
        //             return "0.0101"
        //         }
        //     }
        // }
        //
        //
        // let txid = await app.buildSwap(swap)
        // console.log("txid",txid)


        // //0x42A5Ed456650a09Dc10EBc6361A7480fDd61f27B
        // let routerAddy = "0x42A5Ed456650a09Dc10EBc6361A7480fDd61f27B"
        // let tokenAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"
        //
        // let amount = {
        //     amount:function(){
        //         return BigNumber.BigNumber.from(10000000)
        //     }
        // }
        //
        // let isApproved = await app.isApproved(routerAddy,tokenAddress,amount)
        // console.log("isApproved: ",isApproved)
        //
        // if(!isApproved){
        //     let txidApprove = await app.approve(routerAddy,tokenAddress,amount,true)
        //     console.log("txidApprove: ",txidApprove)
        // } else {
        //     log.debug(tag,"Already Approved!")
        // }


        //console.log(app)

        //BTC
        // let txid = "83fab6e9084fd3b99bc69221db5c923fa7a8ff1046845940105f88fc551e4d18"
        // let txInfo = await app.getTransactionData(txid)
        // console.log("txInfo: ",txInfo)


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
        // const wallet = await app.getWallet();
        // console.log("wallet: ",wallet)

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
        //             "chain":"ETH",
        //             "symbol":"ETH",
        //             "ticker":"ETH"
        //         },
        //     "amount":
        //         {
        //             "type":"BASE",
        //             "decimal":18,
        //             amount: function(){
        //                 return "0.000123"
        //             }
        //         },
        //     "recipient":"0xc3affff54122658b89c31183cec4f15514f34624",
        //     "noBroadcast":true
        // }
        //
        // let txid = await app.transfer(txInput)
        // console.log("txid",txid)

        //monitor tx till confirmed

        //ETH swap object
        // let swap = {
        //     type: 'swap',
        //     username: 'test-user-2',
        //     invocation: {
        //         inboundAddress: {
        //             chain: 'ETH',
        //             pub_key: 'thorpub1addwnpepqf477x09wsp8rakssrh84dm00j77glhw0v5rmd76dy4tn7n430jf5f2u0lw',
        //             address: '0x40c47fb75dcd6d978f03f4d738d289056a226b47',
        //             router: '0x42A5Ed456650a09Dc10EBc6361A7480fDd61f27B',
        //             gas_rate: '90'
        //         },
        //         asset: {
        //             chain: 'ETH',
        //             symbol: 'ETH',
        //             ticker: 'ETH',
        //             iconPath: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png'
        //         },
        //         memo: '=:BTC.BTC:bc1qx2grtsuukf6wh8x65e3202cw42hp2cftccmapu',
        //         amount: 0.01
        //     },
        //     invocationId: 'pioneer:invocation:v0.01:undefined:2HeGmqrkohCDRKUPqaDW8o',
        //     auth: '',
        //     noBroadcast:true
        // }

        // //BCH transfer* object to BTC
        // let transfer = {
        //     "amount": {
        //         "type": "BASE",
        //         "decimal": 8
        //     },
        //     "recipient": "qr3z3r5j263mh2t3x5y6skmcfc3r3z9pvsuy7k9tad",
        //     "memo": "=:BTC.BTC:bc1qx2grtsuukf6wh8x65e3202cw42hp2cftccmapu",
        //     "feeRate": 1
        // }

        //BCH transfer* object to RUNE
        // let transfer = {
        //     "amount": {
        //         "type": "BASE",
        //         "decimal": 8,
        //         amount: function(){
        //             return "0.0101"
        //         }
        //     },
        //     "recipient": "qr3z3r5j263mh2t3x5y6skmcfc3r3z9pvsuy7k9tad",
        //     "memo": "=:THOR.RUNE:thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5",
        //     "feeRate": 1
        // }
        //
        // let txid = await app.transfer(transfer)
        // console.log('TXID: ',txid)

    }catch(e){
        console.error(e)
    }
}

run_test()
