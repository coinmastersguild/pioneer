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
    'bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin'
]

let run_test = async function(){
    try{
        console.log("wuddup")

        let result = await Hardware.loadFirmware('firmware.keepkey.bin')
        console.log("result: ",result)

        //get all usb devices
        // let allDevices = await Hardware.allDevices()
        // console.log("allDevices: ",allDevices.length)
        //
        // //get all keepkeys
        // let allKeepkeys = await Hardware.listKeepKeys()
        // console.log("allKeepkeys: ",allKeepkeys)
        //
        // let KEEPKEY = await Hardware.start()
        // KEEPKEY.events.on('event', async function(event) {
        //     //console.log("EVENT: ",event)
        // });

        // let resultUpload = await Hardware.uploadToDevice('firmware.keepkey.bin')
        // console.log("resultUpload: ",resultUpload)

        // let resultWipe = await KEEPKEY.firmwareErase()
        // console.log("resultWipe: ",resultWipe)

        // let uploadResult = await KEEPKEY.firmwareUpload('firmware.keepkey.bin')
        // console.log("uploadResult: ",uploadResult)

    }catch(e){
        console.error(e)
    }
}

run_test()
