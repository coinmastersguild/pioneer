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
        if(lockStatus){
            Hardware.displayPin()
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
        let blockchains = [
            'bitcoin',
            'ethereum',
            'thorchain'
        ]


        //get pubkeys
        let pubkeys = await Hardware.getPubkeys(blockchains)
        console.log("pubkeys: ",pubkeys)
        console.log("pubkeys: ",prettyjson.render(pubkeys))


        // Hardware.displayPin()
        //
        // Hardware.getPubkeys()
        //
        //
        // KEEPKEY.events.on('event', async function(event) {
        //     console.log("EVENT: ",event)
        // });
        //
        // //TODO claim from already claimed



    }catch(e){
        console.error(e)
    }
}

run_test()
