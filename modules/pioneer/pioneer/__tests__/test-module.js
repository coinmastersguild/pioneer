require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

const prettyjson = require('prettyjson');
let WalletClass = require('../lib/index.js')

// let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
let urlSpec = process.env['URL_PIONEER_SPEC']

let walletName = "local_new_2"

let TEST_COINS = [
    'BTC',
    // 'BCH',
    // 'ETH',
    // 'ATOM'
]

let FAUCET_ADDRESSES = {

}

let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        //CLI export
        // let config =  {
        //     mnemonic: process.env['WALLET_TEST_SEED'] || 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle',
        //     username: 'test-1',
        //     pioneerApi:false,
        // }

        // let watchWalletMetaMask = {
        //     "WALLET_ID": "metamask-test",
        //     "TYPE": "watch",
        //     "CREATED": new Date().getTime(),
        //     "VERSION": "0.1.3",
        //     "WALLET_PUBLIC":{
        //         "ETH":{
        //             "coin":"ETH",
        //             "network":"ETH",
        //             "script_type":"eth",
        //             "path":"m/44'/60'/0'/0/0",
        //             "long":"Ethereum",
        //             "address":"0x33b35c665496bA8E71B22373843376740401F106",
        //             "master":"0x33b35c665496bA8E71B22373843376740401F106",
        //             "type":"address",
        //             "pubkey":"0x33b35c665496bA8E71B22373843376740401F106"
        //         }
        //     }
        // }
        //
        // let pubkeysMetamask = [
        //     {
        //         "coin":"ETH",
        //         "network":"ETH",
        //         "script_type":"eth",
        //         "path":"m/44'/60'/0'/0/0",
        //         "long":"Ethereum",
        //         "address":"0x33b35c665496bA8E71B22373843376740401F106",
        //         "master":"0x33b35c665496bA8E71B22373843376740401F106",
        //         "type":"address",
        //         "pubkey":"0x33b35c665496bA8E71B22373843376740401F106"
        //     }
        // ]
        //
        // //metamask
        // let config = {
        //     wallet: watchWalletMetaMask,
        //     pubkeys:pubkeysMetamask,
        //     username:"metamask"+walletName,
        //     pioneerApi:true,
        //     spec:urlSpec,
        //     queryKey:"metamask"+walletName, //insecure
        //     auth:process.env['SHAPESHIFT_AUTH'] || 'lol',
        //     authProvider:'shapeshift'
        // }
        //
        // //init wallet offline
        // let Wallet = new WalletClass('metamask',config);
        //
        // let info = await Wallet.init()
        // console.log("total Value: ",info.totalValueUsd)
        //
        // //await Wallet.forget()
        //
        // let info2 = await Wallet.getInfo()
        // console.log("info2: ",info2)

        //pioneer
        let config = {
            mnemonic: process.env['WALLET_TESTNET_DEV'],
            username:walletName,
            pioneerApi:true,
            spec:urlSpec,
            queryKey:walletName, //insecure
            auth:process.env['SHAPESHIFT_AUTH'] || 'lol',
            authProvider:'shapeshift'
        }

        //init wallet offline
        let Wallet = new WalletClass('pioneer',config);

        let info = await Wallet.init()
        console.log("total Value: ",info.totalValueUsd)

        //await Wallet.forget()

        let info2 = await Wallet.getInfo()
        console.log("info2: ",info2)

        /*
               THOR
         */
        console.log("info: ",prettyjson.render(info.public.RUNE))

        //ATOM
        let masterRUNE = await Wallet.getMaster("RUNE")
        console.log("masterRUNE: ",masterRUNE)

        let balanceRUNE = await Wallet.getBalance("RUNE")
        console.log("balanceRUNE: ",balanceRUNE)

        let address = "tthor1lqk43hvysuzymrgg08q45234z6jzth322y532t"
        let amount = "0.01"
        let memo = "foobar2"

        let transfer = {
            coin:"RUNE",
            addressTo:address,
            amount,
            memo
        }

        let transferSigned = await Wallet.buildTransfer(transfer)
        console.log("transferSigned: ",transferSigned)

        let txid = await Wallet.sendToAddress("RUNE",address,amount,memo)
        console.log("txid: ",txid)


        /*
               BTC
         */
        // console.log("info: ",prettyjson.render(info.public.BTC),"\n")
        //
        // //
        // let masterBTC = await Wallet.getMaster("BTC")
        // console.log("masterBTC: ",masterBTC)
        //
        // let balanceBTC = await Wallet.getBalance("BTC")
        // console.log("balanceBTC: ",balanceBTC)
        //
        // let amount = "0.0001"
        // let memo = null //Uses OP_RETURN outputs
        // let feeLevel = 5

        //TODO coin control
        //TODO offer input override
        // let transfer = {
        //     coin:"BTC",
        //     addressTo:"bc1qtpkkzr8t4v4sqpcvczmu9mesm2hqgrg82unsr3",
        //     amount,
        //     memo,
        //     feeLevel
        // }
        //
        // let transferSigned = await Wallet.buildTransfer(transfer)
        // console.log("transferSigned: ",transferSigned)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('BTC',transferSigned)
        // console.log("resultBroadcast: ",resultBroadcast)

        /*
               BCH
         */

        // console.log("info: ",prettyjson.render(info.public.BCH),"\n")
        //
        // //
        // let masterBTC = await Wallet.getMaster("BCH")
        // console.log("masterBCH: ",masterBTC)
        //
        // let balanceBTC = await Wallet.getBalance("BCH")
        // console.log("balanceBCH: ",balanceBTC)
        //
        // let amount = "0.0001"
        // let memo = null //Uses OP_RETURN outputs
        // let feeLevel = 5
        //
        // //TODO offer input override
        // let transfer = {
        //     coin:"BCH",
        //     addressTo:"1MU8xvQJESoZRYuhmpTc6TY5eL7PG7ufLA",
        //     amount,
        //     memo,
        //     feeLevel
        // }
        //
        // let transferSigned = await Wallet.buildTransfer(transfer)
        // console.log("transferSigned: ",transferSigned)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('BCH',transferSigned)
        // console.log("resultBroadcast: ",resultBroadcast)

        /*
               ATOM
         */
        //console.log("info: ",prettyjson.render(info.public.ATOM))
        // //ATOM
        // let masterATOM = await Wallet.getMaster("ATOM")
        // console.log("masterATOM: ",masterATOM)
        //
        // let balanceATOM = await Wallet.getBalance("ATOM")
        // console.log("balanceATOM: ",balanceATOM)

        // let address = "cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj"
        // let amount = "0.001"
        // let memo = "foobar"
        //
        // let transfer = {
        //     coin:"ATOM",
        //     addressTo:address,
        //     amount,
        //     memo
        // }
        //
        // let transferSigned = await Wallet.buildTransfer(transfer)
        // console.log("transferSigned: ",transferSigned)

        // let txid = await Wallet.sendToAddress("ATOM",address,amount,memo)
        // console.log("txid: ",txid)


        /*
               BNB
         */

        //
        // let masterBNB = await Wallet.getMaster("BNB")
        // console.log("masterBNB: ",masterBNB)
        //
        // //sendToAddress
        // let address = process.env['TEST_BNB_MASTER_SECOND']
        // let amount = "0.001"
        // let memo = "foo:bar"
        //
        // let transfer = {
        //     coin:"BNB",
        //     addressTo:address,
        //     amount,
        //     memo
        // }

        // let rawTx = await Wallet.buildTransfer(transfer)
        // console.log("rawTx: ",rawTx)

        // let txid = await Wallet.sendToAddress("BNB",address,amount,memo)
        // console.log("txid: ",txid)

        // let masterBtc = await wallet.getMaster("BTC")
        // console.log("masterBtc: ",masterBtc)

        //get balance

        //send to address

    }catch(e){
        console.error(e)
    }
}

run_test()
