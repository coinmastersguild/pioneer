require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})

const prettyjson = require('prettyjson');
let WalletClass = require('../lib/index.js')

//hardware
let Hardware = require("@pioneer-platform/pioneer-hardware")
//CLI tools
const prompt = require('prompt');
const Table = require('cli-table');

const ethers = require('ethers')

prompt.start();

//let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
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

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

//keepkey wallet file (from pairing)
let walletKeepkeyWatch = require('./data/keepkey.watch.wallet.json')

let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin','osmosis']

let context = "343733331147363327003800.watch.wallet.json"

let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        //start
        let KEEPKEY = await Hardware.start()

        let info = await Hardware.info()
        console.log("info: ",info)

        let state = await Hardware.state()
        console.log("state: ",state)



        if(state.state > 2){
            //get lock status
            let lockStatus = await Hardware.isLocked()
            console.log("lockStatus: ",lockStatus)
            if(lockStatus){
                Hardware.displayPin(blockchains)
                prompt.get(['pin'], async function (err, result) {
                    if (err) { return onErr(err); }
                    console.log('Command-line input received:');
                    console.log('  pin: ' + result.pin);
                    KEEPKEY.sendPin(result.pin)
                });
            }

            let table = new Table({
                colWidths: [5, 5, 5]
            });
            //show helper key
            table.push(["1", "2", "3"]);
            table.push(["4", "5", "6"]);
            table.push(["7", "8", "9"]);

            table = table.sort(function (a, b) {
                return b[2] - a[2];
            });
            console.log("\n \n PIN ENTRY \n \n " + table.toString() + "\n \n");
            //end keepkey
            //pioneer
            let config = {
                context,
                // type:'pioneer',
                // mnemonic: process.env['WALLET_TEST_SEED'],

                type:'keepkey',
                hardware:true,
                wallet:walletKeepkeyWatch,

                pubkeys:walletKeepkeyWatch.pubkeys,
                username,
                blockchains,
                pioneerApi:true,
                spec:urlSpec,
                queryKey,
                auth:process.env['SHAPESHIFT_AUTH'] || 'lol',
                authProvider:'shapeshift'
            }

            //init wallet
            let Wallet = new WalletClass(config.type,config);

            //is paired?
            //if not paired throw

            //get lock status

            //if locked unlocked

            let walletInfo = await Wallet.init(KEEPKEY)
            console.log("walletInfo: ",walletInfo)
            console.log("total Value: ",walletInfo.totalValueUsd)

            /*
                BCH transfer
             */
            // let transfer = {
            //     coin:"BCH",
            //     addressTo:"bitcoincash:qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj",
            //     amount:"0.0002",
            //     memo:"=:LTC.LTC:LKrRH5UyM5T8WreSfRjfv4jnJ1AxsmmKxB:24838655",
            //     feeLevel:5
            // }
            //
            // let transferBuilt = await Wallet.buildTransfer(transfer)
            // console.log("transferBuilt: ",JSON.stringify(transferBuilt))

            // let transferBuilt = {
            //     "coin":"BCH",
            //     "transaction":{
            //         "coin":"BCH",
            //         "addressTo":"bitcoincash:qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj",
            //         "amount":"0.00021",
            //         "memo":"=:LTC.LTC:LKrRH5UyM5T8WreSfRjfv4jnJ1AxsmmKxB:24838655",
            //         "feeLevel":5
            //     },
            //     "HDwalletPayload":{
            //         "opReturnData":"=:LTC.LTC:LKrRH5UyM5T8WreSfRjfv4jnJ1AxsmmKxB:24838655",
            //         "coin":"BitcoinCash",
            //         "inputs":[
            //             {
            //                 "addressNList":[
            //                     2147483692,
            //                     2147483793,
            //                     2147483648,
            //                     1,
            //                     4
            //                 ],
            //                 "scriptType":"p2pkh",
            //                 "amount":"320778283",
            //                 "vout":1,
            //                 "txid":"d8dc86e50bcb2628d53a909099651c01c739d112974cd7092b313c56c520d1c2",
            //                 "segwit":false,
            //                 "hex":"0100000002a4fe4e5f5117bb8359007d164c2f4cf429dcc71b22d88476422f93f5b194847e000000006a473044022076b723e4ebea6e3f3825fff3832118620bf0499e5ed82c61bf6d04bd176e41fa02207c591b65562641afe418cb1eb0f6140778dea6b02a43f4be8154908a19195035412103e5b6c4e2b2239cc571aa671c1d23462543711a67d61e658a753f4e3fd35bd9fbffffffffcd83926b6e327a9c0fccd688bfb7f3e85f6dc41738a11f652213f516f27e6774000000006b48304502210080a3fe6be137657050bf94bb028709f08d3106da748f028d21523a2c3914cf52022036352b3730b58888d3e636c7d595120158643c6d027e6c1395bc4109c6e9c1604121023261f4cef888bf214c4ec7328b60e7c31ad3cace74d84a82c9f5a9374bccad65ffffffff0254250300000000001976a91437dc3a1dae7a4792dfbe996e8b392a86a38561b388ac2bb01e13000000001976a9145d33bfd8b7dafc137137c9fde2fa5d0b270571fb88ac00000000",
            //                 "tx":{
            //                     "txid":"d8dc86e50bcb2628d53a909099651c01c739d112974cd7092b313c56c520d1c2",
            //                     "hash":"d8dc86e50bcb2628d53a909099651c01c739d112974cd7092b313c56c520d1c2",
            //                     "version":1,
            //                     "vin":[
            //                         {
            //                             "txid":"7e8494b1f5932f427684d8221bc7dc29f44c2f4c167d005983bb17515f4efea4",
            //                             "addr":"bitcoincash:qqmacwsa4eay0yklh6vkazee92r28ptpkvm682xr2m",
            //                             "scriptSig":{
            //                                 "hex":"0014459a4d8600bfdaa52708eaae5be1dcf959069efc"
            //                             },
            //                             "valueSat":206112,
            //                             "value":0.00206112
            //                         },
            //                         {
            //                             "txid":"74677ef216f51322651fa13817c46d5fe8f3b7bf88d6cc0f9c7a326e6b9283cd",
            //                             "addr":"bitcoincash:qr7uyrqt6auk9g3sm2sdfev6ccuv2a2rnupn5eh8c2",
            //                             "scriptSig":{
            //                                 "hex":"0014459a4d8600bfdaa52708eaae5be1dcf959069efc"
            //                             },
            //                             "valueSat":320780249,
            //                             "value":3.20780249
            //                         }
            //                     ],
            //                     "vout":[
            //                         {
            //                             "value":"206164",
            //                             "scriptPubKey":{
            //                                 "hex":"76a91437dc3a1dae7a4792dfbe996e8b392a86a38561b388ac"
            //                             }
            //                         },
            //                         {
            //                             "value":"320778283",
            //                             "scriptPubKey":{
            //                                 "hex":"76a9145d33bfd8b7dafc137137c9fde2fa5d0b270571fb88ac"
            //                             }
            //                         }
            //                     ],
            //                     "hex":"0100000002a4fe4e5f5117bb8359007d164c2f4cf429dcc71b22d88476422f93f5b194847e000000006a473044022076b723e4ebea6e3f3825fff3832118620bf0499e5ed82c61bf6d04bd176e41fa02207c591b65562641afe418cb1eb0f6140778dea6b02a43f4be8154908a19195035412103e5b6c4e2b2239cc571aa671c1d23462543711a67d61e658a753f4e3fd35bd9fbffffffffcd83926b6e327a9c0fccd688bfb7f3e85f6dc41738a11f652213f516f27e6774000000006b48304502210080a3fe6be137657050bf94bb028709f08d3106da748f028d21523a2c3914cf52022036352b3730b58888d3e636c7d595120158643c6d027e6c1395bc4109c6e9c1604121023261f4cef888bf214c4ec7328b60e7c31ad3cace74d84a82c9f5a9374bccad65ffffffff0254250300000000001976a91437dc3a1dae7a4792dfbe996e8b392a86a38561b388ac2bb01e13000000001976a9145d33bfd8b7dafc137137c9fde2fa5d0b270571fb88ac00000000"
            //                 }
            //             }
            //         ],
            //         "outputs":[
            //             {
            //                 "address":"bitcoincash:qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj",
            //                 "addressType":"spend",
            //                 "scriptType":"p2wpkh",
            //                 "amount":"200001",
            //                 "isChange":false
            //             },
            //             {
            //                 "address":"bitcoincash:qzz5qnu694u452ss5kx6lqv78rdk9pw7lyv6u3s557",
            //                 "addressType":"spend",
            //                 "scriptType":"p2pkh",
            //                 "amount":"320757831",
            //                 "isChange":true
            //             }
            //         ],
            //         "version":1,
            //         "locktime":0
            //     },
            //     "verbal":"UTXO transaction"
            // }

            /*

             */

            // let transferSigned = await Wallet.signTransaction(transferBuilt)
            // console.log("transferSigned: ",transferSigned)


            // let resultBroadcast = await Wallet.broadcastTransaction('BTC',transferSigned)
            // console.log("resultBroadcast: ",resultBroadcast)

            /*
                ETH thorchain swap
             */
            // let masterETH = await Wallet.getMaster("ETH")
            // console.log("reference: ","0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8")
            // console.log("masterETH: ",masterETH)
            //
            // let balanceETH = await Wallet.getBalance("ETH")
            // console.log("balanceETH: ",balanceETH)

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

            let transfer = {
                network:"ETH",
                asset:"ETH",
                address:"0x33b35c665496bA8E71B22373843376740401F106",
                addresFrom:"0x2356a15042f98f0a53784f42237bd4b2873aadcf"
            }

            let amount = 0.001
            transfer.amount = amount


            // let unsignedTx = await Wallet.buildTransfer(transfer)
            // console.log("unsignedTx: ",unsignedTx)

            //txGood
            // let unsignedTx = {
            //     network:"ETH",
            //     HDwalletPayload: {
            //         addressNList: [ 2147483692, 2147483708, 2147483648, 0, 0 ],
            //         nonce: '0xb7',
            //         gasPrice: '0x37e11d600',
            //         gasLimit: '0x13880',
            //         value: '0x38d7ea4c68000',
            //         to: '0x33b35c665496bA8E71B22373843376740401F106',
            //         data: undefined,
            //         chainId: 1
            //     }
            // }

            //txGood 0 nonce
            let unsignedTx = {
                network:"ETH",
                HDwalletPayload: {
                    addressNList: [ 2147483692, 2147483708, 2147483648, 0, 0 ],
                    nonce: '0x00',
                    gasPrice: '0x499311580',
                    gasLimit: '0x13880',
                    value: '0x38d7ea4c68000',
                    to: '0x33b35c665496bA8E71B22373843376740401F106',
                    data: undefined,
                    chainId: 1
                }
            }

            // let unsignedTx = {
            //     network:"ETH",
            //     HDwalletPayload: {
            //         "addressNList":[2147483692,2147483708,2147483648,0,0],
            //         "nonce":"0x0",
            //         "gasPrice":"0x306dc4200",
            //         "gasLimit":"0x5208",
            //         "to":"0x33b35c665496ba8e71b22373843376740401f106",
            //         "value":"0x38d7ea4c68000",
            //         "data":"",
            //         "chainId":1
            //     }
            // }

            //BROKE! BAD! EWW
            // let unsignedTx = {
            //     network:"ETH",
            //     HDwalletPayload: {
            //         "addressNList":[2147483692,2147483708,2147483648,0,0],
            //         "nonce":"0x0",
            //         "gasPrice":"0x306dc4200",
            //         "gasLimit":"0x5208",
            //         "to":"0x33b35c665496ba8e71b22373843376740401f106",
            //         "value":"0x38d7ea4c68000",
            //         "data":"",
            //         "chainId":1
            //     }
            // }

            let signedTx = await Wallet.signTransaction(unsignedTx)
            console.log("signedTx: ",signedTx)

            console.log("RECEIVED: FROM:",signedTx.decoded.from)
            console.log("expected: FROM:","0x141D9959cAe3853b035000490C03991eB70Fc4aC")
            console.log("wrong tx: FROM:",'0x70ce552f77aec9e8b84e1f8e0e9ad3a0946d4dd7')
            // let resultBroadcast = await Wallet.broadcastTransaction('ETH',signedTx)
            // console.log("resultBroadcast: ",resultBroadcast)
        }



        /*
       BTC
         */
        // console.log("info: ",prettyjson.render(info.public.BTC),"\n")
        //
        //
        // let masterBTC = await Wallet.getMaster("BTC")
        // console.log("masterBTC: ",masterBTC)
        //
        // let balanceBTC = await Wallet.getBalance("BTC")
        // console.log("balanceBTC: ",balanceBTC)
        //
        // let amount = "0.00001"
        // let memo = "=:ETH.ETH:0x3e485e2C7df712Ec170C087ecf5C15016A03F93F" //Uses OP_RETURN outputs
        // let feeLevel = 5
        // //
        // // //TODO coin control
        // // //TODO offer input override
        // // // let transfer = {
        // // //     coin:"BTC",
        // // //     addressTo:"bc1qtpkkzr8t4v4sqpcvczmu9mesm2hqgrg82unsr3",
        // // //     amount,
        // // //     memo,
        // // //     feeLevel
        // // // }
        // let transfer = {
        //     coin:"BTC",
        //     addressTo:"mkqRFzxmkCGX9jxgpqqFHcxRUmLJcLDBer",
        //     amount,
        //     memo,
        //     feeLevel
        // }
        //
        // let transferSigned = await Wallet.buildTransfer(transfer)
        // console.log("transferSigned: ",transferSigned)
        // //
        // // let transferSigned = {
        // //
        // // }
        // //
        // // let resultBroadcast = await Wallet.broadcastTransaction('BTC',transferSigned)
        // // console.log("resultBroadcast: ",resultBroadcast)


    }catch(e){
        console.error(e)
    }
}

run_test()
