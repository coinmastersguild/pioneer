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

let run_test = async function(){
    try{

        let KEEPKEY = await Hardware.start()
        KEEPKEY.events.on('event', async function(event) {
            //console.log("EVENT: ",event)
        });

        let info = await Hardware.info()
        console.log("info: ",info)

        //get lock status
        let lockStatus = await Hardware.isLocked()
        console.log("lockStatus: ",lockStatus)


        //
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

    }catch(e){
        console.error(e)
    }
}

run_test()
