// require("dotenv").config({path:'./../../.env'})
// require("dotenv").config({path:'../../../.env'})
// require("dotenv").config({path:'../../../../.env'})
// require("dotenv").config({path:'../../../../../.env'})

const prettyjson = require('prettyjson');
let WalletClass = require('../lib/index.js')

let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
//let urlSpec = process.env['URL_PIONEER_SPEC']

let walletName = "local_new_2"

let TEST_COINS = [
    'BTC',
    // 'BCH',
    // 'ETH',
    // 'ATOM'
]

let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance']

let FAUCET_ADDRESSES = {

}

// let username = process.env['TEST_USERNAME_2']
// let queryKey = process.env['TEST_QUERY_KEY_2']


let walletKeepkeyWatch = require('./data/keepkey.watch.wallet.json')

let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        let isTestnet = null

        //keepkey
        //let context = "635BA1FA4FE083194A88B259.watch.wallet.json"

        // //wallet old
        let context = "0xc3affff54122658b89c31183cec4f15514f34624.wallet.json"

        //pioneer
        let config = {
            isTestnet:false,
            blockchains,

            type:'pioneer',
            mnemonic: process.env['WALLET_MAINNET_DEV_NEW'] || 'alcohol woman abuse must during monitor noble actual mixed trade anger aisle',

            // type:'keepkey',
            // hardware:true,
            // wallet:walletKeepkeyWatch,


            context,
            username:'test-user-2',
            pioneerApi:true,
            spec:urlSpec,
            queryKey:'6ee250b2-2442-4760-b696-a72ccd664ac3',
            auth:process.env['SHAPESHIFT_AUTH'] || 'lol',
            authProvider:'shapeshift'
        }

        //init wallet offline
        let Wallet = new WalletClass(config.type,config);

        let info = await Wallet.init()
        console.log("INFO: ",info)

        console.log("total Value: ",info.totalValueUsd)

        // let resultForget = await Wallet.forget()
        // console.log("resultForget: ",resultForget.data)

        // let info2 = await Wallet.getInfo()
        // console.log("info2: ",info2)

        /*
            ETH
        */
        // let masterETH = await Wallet.getMaster("ETH")
        // console.log("masterETH: ",masterETH)
        //
        // let balanceETH = await Wallet.getBalance("ETH")
        // console.log("balanceETH: ",balanceETH)
        //
        // let invocationId = "pioneer:invocation:v0.01:ETH:98tzeFAHevjZC5C5pXBbxN"
        // let address = "0x33b35c665496bA8E71B22373843376740401F106"
        // let amount = "0.00123"
        // let memo = ""
        //
        // let transfer = {
        //     noBroadcast:true,
        //     invocationId,
        //     coin:"ETH",
        //     address:address,
        //     amount,
        //     memo
        // }
        //
        // let transferUnSigned = await Wallet.sendToAddress(transfer)
        // console.log("transferUnSigned: ",transferUnSigned)
        //
        // //add to queue
        // Wallet.addUnsigned(transferUnSigned)
        //
        // //approve
        // let unsignedTx = Wallet.getNextReview()
        // console.log("unsignedTx: ",unsignedTx)
        // // let transferUnSigned = await Wallet.buildTransfer(transfer)
        // // console.log("transferUnSigned: ",transferUnSigned)
        //
        // let transferSigned = await Wallet.signTransaction(unsignedTx)
        // console.log("transferSigned: ",transferSigned)
        //
        // transferSigned.noBroadcast = true
        // let resultBroadcast = await Wallet.broadcastTransaction(unsignedTx.coin,transferSigned)
        // console.log("resultBroadcast: ",resultBroadcast)

        // let txid = await Wallet.sendToAddress("RUNE",address,amount,memo)
        // console.log("txid: ",txid)

        /*
               THOR
         */
        // console.log("info: ",prettyjson.render(info.public.RUNE))

        //RUNE
        // let masterRUNE = await Wallet.getMaster("RUNE")
        // console.log("masterRUNE: ",masterRUNE)
        //
        // let balanceRUNE = await Wallet.getBalance("RUNE")
        // console.log("balanceRUNE: ",balanceRUNE)
        //
        // let address = "thor1x8mqqpsd9u00ny7gccuezcddmjf7hs9cau5650"
        // let amount = "1"
        // let memo = ""
        //
        // let transfer = {
        //     coin:"RUNE",
        //     addressTo:address,
        //     amount,
        //     memo
        // }
        //
        // let transferSigned = await Wallet.buildTransfer(transfer)
        // console.log("transferSigned: ",transferSigned)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('RUNE',transferSigned)
        // console.log("resultBroadcast: ",resultBroadcast)

        // let intent = {
        //     coin:"RUNE",
        //     amount:"all",
        //     address,
        //     // noBroadcast:true,
        // }
        //
        // let txid = await Wallet.sendToAddress(intent)
        // console.log("txid: ",txid)

        /*
            ETH thorchain swap
         */
        // let masterETH = await Wallet.getMaster("ETH")
        // console.log("masterETH: ",masterETH)
        //
        // let balanceETH = await Wallet.getBalance("ETH")
        // console.log("balanceETH: ",balanceETH)


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
        //
        // let amount = 0.0001
        // swap.amount = amount

        // let swap = {
        //     inboundAddress: {
        //         chain: 'ETH',
        //         pub_key: 'tthorpub1addwnpepqvuy8vh6yj4h28xp6gfpjsztpj6p46y2rs0763t6uw9f6lkky0ly5uvwla6',
        //         address: '0x36286e570c412531aad366154eea9867b0e71755',
        //         router: '0x9d496De78837f5a2bA64Cb40E62c19FBcB67f55a',
        //         halted: false
        //     },
        //     asset: {
        //         chain: 'ETH',
        //         symbol: 'ETH',
        //         ticker: 'ETH',
        //         iconPath: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png'
        //     },
        //     memo: '=:THOR.RUNE:tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh',
        //     amount: "0.0123"
        // }
        //
        //
        // let result = await Wallet.buildSwap(swap)
        // console.log("swapResult: ",result)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('ETH',result)
        // console.log("resultBroadcast: ",resultBroadcast)

        // let transfer = {
        //     coin:"ETH",
        //     addressTo:"0x33b35c665496bA8E71B22373843376740401F106"
        // }
        //
        // let amount = 0.0001
        // transfer.amount = amount
        //
        // // let result = await Wallet.buildTransfer(transfer)
        // // console.log("transfer: ",result)
        // //
        // // let resultBroadcast = await Wallet.broadcastTransaction('ETH',result)
        // // console.log("resultBroadcast: ",resultBroadcast)
        //
        // //normal send, to memo
        // let result = await Wallet.sendToAddress(transfer.coin,transfer.addressTo,transfer.amount)
        // //expect instant txid
        // console.log("result: ",result)
        //TODO event emitter?
        /*
               BTC
         */
        // console.log("info: ",prettyjson.render(info.public.BTC),"\n")


        // let masterBTC = await Wallet.getMaster("BTC")
        // console.log("masterBTC: ",masterBTC)
        //
        // let balanceBTC = await Wallet.getBalance("BTC")
        // console.log("balanceBTC: ",balanceBTC)


        /*
               BCH
         */

        //
        // let masterBTC = await Wallet.getMaster("BCH")
        // console.log("masterBCH: ",masterBTC)
        //
        // let balanceBTC = await Wallet.getBalance("BCH")
        // console.log("balanceBCH: ",balanceBTC)
        //
        // let amount = "0.02"
        // let memo = null //Uses OP_RETURN outputs
        // let feeLevel = 5
        //
        // //TODO offer input override
        // let transfer = {
        //     coin:"BCH",
        //     addressTo:"1Dmjt2DWjNpVWRPXRNuhwfDnSqPmfxGLLG",
        //     amount,
        //     memo,
        //     feeLevel
        // }
        //
        // let transferUnSigned = await Wallet.buildTransfer(transfer)
        // console.log("transferUnSigned: ",transferUnSigned)
        //
        // let transferSigned = await Wallet.signTransaction(transferUnSigned)
        // console.log("transferSigned: ",transferSigned)

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
