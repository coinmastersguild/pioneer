//start hardware

//events.on

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let Hardware = require("../lib")
const prompt = require('prompt');
const Table = require('cli-table');
let wait = require('wait-promise');
let sleep = wait.sleep;
const prettyjson = require('prettyjson');
//create wallet


prompt.start();

let blockchains = [
    'bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance'
]

let run_test = async function(){
    try{
        //get all usb devices
        let allDevices = await Hardware.allDevices()
        console.log("allDevices: ",allDevices.length)

        //get all keepkeys
        let allKeepkeys = await Hardware.listKeepKeys()
        console.log("allKeepkeys: ",allKeepkeys)

        let KEEPKEY = await Hardware.start()
        KEEPKEY.events.on('event', async function(event) {
            //console.log("EVENT: ",event)
        });

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

            table.push(["1", "2", "3"]);
            table.push(["4", "5", "6"]);
            table.push(["7", "8", "9"]);

            table = table.sort(function (a, b) {
                return b[2] - a[2];
            });
            console.log("\n \n PIN ENTRY \n \n " + table.toString() + "\n \n");


            //blockchains


            //get pubkeys
            // let pubkeys = await Hardware.getPubkeys(blockchains)
            // console.log("pubkeys: ",pubkeys)
            // console.log("pubkeys: ",prettyjson.render(pubkeys))

            //sign tx
            let ethTx = {
                "nonce":"0x0",
                "gasPrice":"0x5FB9ACA00",
                "gasLimit":"0x186A0",
                "value":"0x00",
                "to":"0x41e5560054824ea6b0732e656e3ad64e20e94e45",
                "chainId":3,
                "data":"0x1fece7b400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000031535741503a4254432e4254433a6d6b7152467a786d6b434758396a78677071714648637852556d4c4a634c444265723a31000000000000000000000000000000",
                "addressNList":[
                    2147483692,
                    2147483708,
                    2147483648,
                    0,
                    0
                ]
            }


            let rawTx = await KEEPKEY.ethSignTx(ethTx)
            console.log("rawTx: ",rawTx)
        } else if(state.state < 0){
            console.log("Failed to claim!")
            console.log("Please unplug the device!")
            console.log("Please exif all tabs and client that may connect to keepkey!")
            console.log("Please reconnect the device!")
        }else{
            console.log(state)
            console.log("Please connect a device!")
        }


        // //get lock status
        // let lockStatus = await Hardware.isLocked()
        // console.log("lockStatus: ",lockStatus)
        //
        //
        // //
        // let ethTx = {
        //     "nonce":"0x0",
        //     "gasPrice":"0x5FB9ACA00",
        //     "gasLimit":"0x186A0",
        //     "value":"0x00",
        //     "to":"0x41e5560054824ea6b0732            let bchTx = {
        //                 "coin":"BitcoinCash",
        //                 "inputs":[
        //                     {
        //                         "addressNList":[
        //                             2147483692,
        //                             2147483793,
        //                             2147483648,
        //                             1,
        //                             4
        //                         ],
        //                         "scriptType":"p2pkh",
        //                         "amount":"320778283",
        //                         "vout":1,
        //                         "txid":"d8dc86e50bcb2628d53a909099651c01c739d112974cd7092b313c56c520d1c2",
        //                         "segwit":false,
        //                         "hex":"0100000002a4fe4e5f5117bb8359007d164c2f4cf429dcc71b22d88476422f93f5b194847e000000006a473044022076b723e4ebea6e3f3825fff3832118620bf0499e5ed82c61bf6d04bd176e41fa02207c591b65562641afe418cb1eb0f6140778dea6b02a43f4be8154908a19195035412103e5b6c4e2b2239cc571aa671c1d23462543711a67d61e658a753f4e3fd35bd9fbffffffffcd83926b6e327a9c0fccd688bfb7f3e85f6dc41738a11f652213f516f27e6774000000006b48304502210080a3fe6be137657050bf94bb028709f08d3106da748f028d21523a2c3914cf52022036352b3730b58888d3e636c7d595120158643c6d027e6c1395bc4109c6e9c1604121023261f4cef888bf214c4ec7328b60e7c31ad3cace74d84a82c9f5a9374bccad65ffffffff0254250300000000001976a91437dc3a1dae7a4792dfbe996e8b392a86a38561b388ac2bb01e13000000001976a9145d33bfd8b7dafc137137c9fde2fa5d0b270571fb88ac00000000",
        //                         "tx":{
        //                             "txid":"d8dc86e50bcb2628d53a909099651c01c739d112974cd7092b313c56c520d1c2",
        //                             "hash":"d8dc86e50bcb2628d53a909099651c01c739d112974cd7092b313c56c520d1c2",
        //                             "version":1,
        //                             "vin":[
        //                                 {
        //                                     "txid":"7e8494b1f5932f427684d8221bc7dc29f44c2f4c167d005983bb17515f4efea4",
        //                                     "addr":"bitcoincash:qqmacwsa4eay0yklh6vkazee92r28ptpkvm682xr2m",
        //                                     "scriptSig":{
        //                                         "hex":"0014459a4d8600bfdaa52708eaae5be1dcf959069efc"
        //                                     },
        //                                     "valueSat":206112,
        //                                     "value":0.00206112
        //                                 },
        //                                 {
        //                                     "txid":"74677ef216f51322651fa13817c46d5fe8f3b7bf88d6cc0f9c7a326e6b9283cd",
        //                                     "addr":"bitcoincash:qr7uyrqt6auk9g3sm2sdfev6ccuv2a2rnupn5eh8c2",
        //                                     "scriptSig":{
        //                                         "hex":"0014459a4d8600bfdaa52708eaae5be1dcf959069efc"
        //                                     },
        //                                     "valueSat":320780249,
        //                                     "value":3.20780249
        //                                 }
        //                             ],
        //                             "vout":[
        //                                 {
        //                                     "value":"206164",
        //                                     "scriptPubKey":{
        //                                         "hex":"76a91437dc3a1dae7a4792dfbe996e8b392a86a38561b388ac"
        //                                     }
        //                                 },
        //                                 {
        //                                     "value":"320778283",
        //                                     "scriptPubKey":{
        //                                         "hex":"76a9145d33bfd8b7dafc137137c9fde2fa5d0b270571fb88ac"
        //                                     }
        //                                 }
        //                             ],
        //                             "hex":"0100000002a4fe4e5f5117bb8359007d164c2f4cf429dcc71b22d88476422f93f5b194847e000000006a473044022076b723e4ebea6e3f3825fff3832118620bf0499e5ed82c61bf6d04bd176e41fa02207c591b65562641afe418cb1eb0f6140778dea6b02a43f4be8154908a19195035412103e5b6c4e2b2239cc571aa671c1d23462543711a67d61e658a753f4e3fd35bd9fbffffffffcd83926b6e327a9c0fccd688bfb7f3e85f6dc41738a11f652213f516f27e6774000000006b48304502210080a3fe6be137657050bf94bb028709f08d3106da748f028d21523a2c3914cf52022036352b3730b58888d3e636c7d595120158643c6d027e6c1395bc4109c6e9c1604121023261f4cef888bf214c4ec7328b60e7c31ad3cace74d84a82c9f5a9374bccad65ffffffff0254250300000000001976a91437dc3a1dae7a4792dfbe996e8b392a86a38561b388ac2bb01e13000000001976a9145d33bfd8b7dafc137137c9fde2fa5d0b270571fb88ac00000000"
        //                         }
        //                     }
        //                 ],
        //                 "outputs":[
        //                     {
        //                         "address":"1MU8xvQJESoZRYuhmpTc6TY5eL7PG7ufLA",
        //                         "addressType":"spend",
        //                         "scriptType":"p2wpkh",
        //                         "amount":"200001",
        //                         "isChange":false
        //                     },
        //                     {
        //                         "address":"1D9Zuv9YPDuvuAztBs5AThNYaj9mZpW6K8",
        //                         "addressType":"spend",
        //                         "scriptType":"p2pkh",
        //                         "amount":"320757831",
        //                         "isChange":true
        //                     }
        //                 ],
        //                 "version":1,
        //                 "locktime":0
        //             }
        //
        //             let rawTx = await KEEPKEY.btcSignTx(bchTx)e656e3ad64e20e94e45",
        //     "chainId":3,
        //     "data":"0x1fece7b400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000031535741503a4254432e4254433a6d6b7152467a786d6b434758396a78677071714648637852556d4c4a634c444265723a31000000000000000000000000000000",
        //     "addressNList":[
        //         2147483692,
        //         2147483708,
        //         2147483648,
        //         0,
        //         0
        //     ]
        // }
        //
        //
        // let rawTx = await KEEPKEY.ethSignTx(ethTx)
        // console.log("rawTx: ",rawTx)

    }catch(e){
        console.error(e)
    }
}

run_test()
