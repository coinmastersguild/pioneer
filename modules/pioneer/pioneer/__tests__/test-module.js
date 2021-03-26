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

let run_test = async function(){
    try{
        console.log("*** Running test module ***")

        //start
        let KEEPKEY = await Hardware.start()
        let lockStatus = await Hardware.isLocked()
        console.log("lockStatus: ",lockStatus)

        if(lockStatus){
            //show helper key
            table.push(["1", "2", "3"]);
            table.push(["4", "5", "6"]);
            table.push(["7", "8", "9"]);

            table = table.sort(function (a, b) {
                return b[2] - a[2];
            });
            console.log("\n \n PIN ENTRY \n \n " + table.toString() + "\n \n");
            //end keepkey

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


        //pioneer
        let config = {
            isTestnet:true, //Woo! testnet!

            // type:'pioneer',
            // mnemonic: process.env['WALLET_TEST_SEED'],

            type:'keepkey',
            hardware:true,
            wallet:walletKeepkeyWatch,

            pubkeys:walletKeepkeyWatch.pubkeys,
            username,
            pioneerApi:true,
            spec:urlSpec,
            queryKey,
            auth:process.env['SHAPESHIFT_AUTH'] || 'lol',
            authProvider:'shapeshift'
        }

        //init wallet
        let Wallet = new WalletClass(config.type,config,true);

        //is paired?
            //if not paired throw

        //get lock status

        //if locked unlocked

        let info = await Wallet.init(KEEPKEY)
        console.log("info: ",info)

        // console.log("total Value: ",info.totalValueUsd)

        //send bitcoin



    }catch(e){
        console.error(e)
    }
}

run_test()
