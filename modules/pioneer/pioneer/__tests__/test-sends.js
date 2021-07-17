require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

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

let FAUCET_ADDRESSES = {

}

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        let isTestnet = null

        //pioneer
        let config = {
            // mnemonic: process.env['WALLET_CITADEL_LEGACY'],
            mnemonic: process.env['WALLET_MAIN'],
            // mnemonic: process.env['WALLET_MAINNET_DEV_NEW'],
            username,
            blockchains: ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin'],
            pioneerApi:true,
            spec:urlSpec,
            queryKey,
            auth:process.env['SHAPESHIFT_AUTH'] || 'lol',
            authProvider:'shapeshift'
        }
        console.log(config)
        //init wallet offline
        let Wallet = new WalletClass('pioneer',config,isTestnet);
        let info = await Wallet.init()
        console.log("total Value: ",info)

        /*
            ETH build transfer
         */

        let transaction = {
            coin: 'ETH',
            asset: 'ETH',
            network: 'ETH',
            amount: '0.00101',
            addressTo: '0x33b35c665496bA8E71B22373843376740401F106',
        }

        let unSignedTx = await Wallet.buildTransfer(transaction)
        console.log("unSignedTx: ",unSignedTx)

        let signedTx = await Wallet.signTransaction(unSignedTx)
        console.log("signedTx: ",signedTx)

        // let resultBroadcast = await Wallet.broadcastTransaction('BTC',result)
        // console.log("resultBroadcast: ",resultBroadcast)

        /*
            ETH approve Token
        */

        // let contract = "0x42A5Ed456650a09Dc10EBc6361A7480fDd61f27B"
        // let tokenAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7"
        // let amount = 1000000000
        //
        // // let approvalSigned = await Wallet.buildApproval({contract,tokenAddress,amount})
        // // console.log("approvalSigned: ",approvalSigned)
        //
        // // let resultBroadcast = await Wallet.broadcastTransaction('ETH',approvalSigned)
        // // console.log("resultBroadcast: ",resultBroadcast)
        //
        // let txid = await Wallet.sendApproval({contract,tokenAddress,amount,noBroadcast:true,invocationId:"foobarapprove"})
        // console.log("txid: ",txid)


        /*
               THOR
         */

        //RUNE
        // let masterRUNE = await Wallet.getMaster("RUNE")
        // console.log("masterRUNE: ",masterRUNE)
        //
        // let balanceRUNE = await Wallet.getBalance("RUNE")
        // console.log("balanceRUNE: ",balanceRUNE)
        //
        // let address = "thor1msnlcmu755zxlnha0s9e7yadq2tdx33tk7d9rr"
        // let amount = "100"
        // let memo = ""
        //
        // let deposit = {
        //     type: 'deposit',
        //     username: 'test-user-2',
        //     network: 'RUNE',
        //     asset: 'RUNE',
        //     coin: 'RUNE',
        //     amount: '50994000',
        //     memo: '=:BCH.BCH:qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj',
        //     invocationId: 'pioneer:invocation:v0.01:RUNE:6fvPkFk7SkQTgBrBwQUQEH'
        // }
        //
        // let transferUnSigned = await Wallet.deposit(deposit)
        // console.log("transferUnSigned: ",transferUnSigned)
        //
        // let signedTx = await Wallet.signTransaction(transferUnSigned)
        // console.log("signedTx: ",signedTx)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('RUNE',signedTx)
        // console.log("resultBroadcast: ",resultBroadcast)

        // let address = "thor1msnlcmu755zxlnha0s9e7yadq2tdx33tk7d9rr"
        // let amount = "100"
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

        // let txid = await Wallet.sendToAddress("RUNE",address,amount,memo)
        // console.log("txid: ",txid)

        /*
            ETH thorchain AddLiquidity
         */

        /*
            ETH thorchain swap
         */
        // let masterETH = await Wallet.getMaster("ETH")
        // console.log("masterETH: ",masterETH)
        //
        // let balanceETH = await Wallet.getBalance("ETH")
        // console.log("balanceETH: ",balanceETH)

        //mainnet
        // let swap = {
        //     inboundAddress: {
        //         chain: 'ETH',
        //         pub_key: 'thorpub1addwnpepqvwmxdvt87perl6mvncjre4vhthmuxkdm7zaww0jf40ey780pr5xwjs03c0',
        //         address: '0x60ecab48eae7be3a148fe3a73a10a1cef9d3445f',
        //         router: '0x42A5Ed456650a09Dc10EBc6361A7480fDd61f27B',
        //         halted: false
        //     },
        //     asset: {
        //         chain: 'ETH',
        //         symbol: 'ETH',
        //         ticker: 'ETH',
        //         iconPath: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png'
        //     },
        //     memo: '=:THOR.RUNE:thor1vvehrsz8rwzaws4j94ak3a4zj7myjerx9xn9yp',
        //     amount: "0.00912"
        // }
        //
        // let result = await Wallet.buildSwap(swap)
        // console.log("swapResult: ",result)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('ETH',result)
        // console.log("resultBroadcast: ",resultBroadcast)

        /*
            LTC thorchain swap

        */

        // let transaction = {
        //     username: 'test-user-2',
        //     coin: 'LTC',
        //     amount: '0.1101',
        //     addressTo: 'ltc1qksxqxurvejkndenuv0alqawpr3e4vtqkhk07qv',
        //     memo: '=:THOR.RUNE:thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5',
        //     invocationId: 'pioneer:invocation:v0.01:LTC:ja9hoRRogz6VDuPkjHneKs'
        // }
        //
        // let result = await Wallet.buildTransfer(transaction)
        // console.log("result: ",result)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('LTC',result)
        // console.log("resultBroadcast: ",resultBroadcast)

        /*
            BCH thorchain swap

        */
        // let swap = {
        //     inboundAddress: {
        //         chain: 'BTC',
        //         pub_key: 'thorpub1addwnpepqvwmxdvt87perl6mvncjre4vhthmuxkdm7zaww0jf40ey780pr5xwjs03c0',
        //         address: 'bc1qyjxzpvjmmzylcq573vlpt068n8mf7xdjngpmpu'
        //     },
        //     asset: {
        //         chain: 'BTC',
        //         symbol: 'BTC',
        //         ticker: 'BTC',
        //         iconPath: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png'
        //     },
        //     memo: '=:THOR.RUNE:thor1vvehrsz8rwzaws4j94ak3a4zj7myjerx9xn9yp',
        //     amount: "0.00033",
        //     feeLevel:5
        // }


        // let transaction = {
        //     username: 'test-user-2',
        //     coin: 'BCH',
        //     amount: '0.0101',
        //     addressTo: 'qr3z3r5j263mh2t3x5y6skmcfc3r3z9pvsuy7k9tad',
        //     memo: '=:THOR.RUNE:thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5',
        //     invocationId: 'pioneer:invocation:v0.01:BCH:ja9hoRRogz6VDuPkjHneKs'
        // }
        //
        // let result = await Wallet.buildTransfer(transaction)
        // console.log("result: ",result)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('BTC',result)
        // console.log("resultBroadcast: ",resultBroadcast)

        /*
            BTC thorchain swap

        */
        // let swap = {
        //     inboundAddress: {
        //         chain: 'BTC',
        //         pub_key: 'thorpub1addwnpepqvwmxdvt87perl6mvncjre4vhthmuxkdm7zaww0jf40ey780pr5xwjs03c0',
        //         address: 'bc1qyjxzpvjmmzylcq573vlpt068n8mf7xdjngpmpu'
        //     },
        //     asset: {
        //         chain: 'BTC',
        //         symbol: 'BTC',
        //         ticker: 'BTC',
        //         iconPath: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png'
        //     },
        //     memo: '=:THOR.RUNE:thor1vvehrsz8rwzaws4j94ak3a4zj7myjerx9xn9yp',
        //     amount: "0.00033",
        //     feeLevel:5
        // }
        //
        // let result = await Wallet.buildSwap(swap)
        // console.log("swapResult: ",result)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('BTC',result)
        // console.log("resultBroadcast: ",resultBroadcast)

        /*
               BTC
         */
        // console.log("info: ",prettyjson.render(info.public.BTC),"\n")
        //
        // let masterBTC = await Wallet.getMaster("BTC")
        // console.log("masterBTC: ",masterBTC)
        //
        // let balanceBTC = await Wallet.getBalance("BTC")
        // console.log("balanceBTC: ",balanceBTC)
        //
        // let amount = "0.00001"
        // let feeLevel = 5
        //
        // let transfer = {
        //     coin:"BTC",
        //     addressTo:"bc1qtpkkzr8t4v4sqpcvczmu9mesm2hqgrg82unsr3",
        //     amount,
        //     feeLevel
        // }
        //
        // let transferSigned = await Wallet.buildTransfer(transfer)
        // console.log("transferSigned: ",transferSigned)

        // let resultBroadcast = await Wallet.broadcastTransaction('BTC',transferSigned)
        // console.log("resultBroadcast: ",resultBroadcast)

        /*
               LTC
         */

        // console.log("info: ",prettyjson.render(info.public.LTC),"\n")
        //
        // //
        // let masterLTC = await Wallet.getMaster("LTC")
        // console.log("masterLTC: ",masterLTC)
        //
        // let balanceLTC = await Wallet.getBalance("LTC")
        // console.log("balanceLTC: ",balanceLTC)

        // let amount = "0.001"
        // let memo = null //Uses OP_RETURN outputs
        // let feeLevel = 5

        //TODO offer input override
        // let transfer = {
        //     coin:"LTC",
        //     addressTo:"LKrRH5UyM5T8WreSfRjfv4jnJ1AxsmmKxB",
        //     amount,
        //     // memo,
        //     feeLevel
        // }
        //
        // let transferSigned = await Wallet.buildTransfer(transfer)
        // console.log("transferSigned: ",transferSigned)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('LTC',transferSigned)
        // console.log("resultBroadcast: ",resultBroadcast)

        // let intent = {
        //     coin:"LTC",
        //     address:"LKrRH5UyM5T8WreSfRjfv4jnJ1AxsmmKxB",
        //     amount:"0.0001",
        //     //noBroadcast:true,
        //     invocationId:"workyplzbro"
        // }
        // let txid = await Wallet.sendToAddress(intent)
        // console.log("txid: ",txid)

        /*
               BCH
         */

        // console.log("info: ",prettyjson.render(info.public.BCH),"\n")
        //
        // //
        // let masterBCH = await Wallet.getMaster("BCH")
        // console.log("masterBCH: ",masterBCH)
        //
        // let balanceBCH = await Wallet.getBalance("BCH")
        // console.log("balanceBCH: ",balanceBCH)
        //
        // let amount = "0.0101"
        // let memo = null //Uses OP_RETURN outputs
        // let feeLevel = 5
        //
        // //TODO offer input override
        // let transfer = {
        //     coin:"BCH",
        //     addressTo:"1Dmjt2DWjNpVWRPXRNuhwfDnSqPmfxGLLG",
        //     amount,
        //     // memo,
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
        //     addressTo:"bnb1yq372zpenw0sla8l0pxpf08xgflxnfngndv433",
        //     amount,
        //     memo
        // }
        //
        // let rawTx = await Wallet.buildTransfer(transfer)
        // console.log("rawTx: ",rawTx)

        // let resultBroadcast = await Wallet.broadcastTransaction('BNB',rawTx)
        // console.log("resultBroadcast: ",resultBroadcast)

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
