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

let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin']

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
            type:'keepkey',
            hardware:true,
            wallet:walletKeepkeyWatch,
            pubkeys:walletKeepkeyWatch.pubkeys,
            username,
            blockchains,
            pioneerApi:false,
        }

        //init wallet
        let Wallet = new WalletClass(config.type,config);

        //is paired?
        //if not paired throw

        //get lock status

        //if locked unlocked

        let walletInfo = await Wallet.init(KEEPKEY)
        console.log("walletInfo: ",walletInfo)
        // console.log("total Value: ",walletInfo.totalValueUsd)

        //RUNE
        let masterRUNE = await Wallet.getMaster("RUNE")
        console.log("masterRUNE: ",masterRUNE)

        let balanceRUNE = await Wallet.getBalance("RUNE")
        console.log("balanceRUNE: ",balanceRUNE)

        /*
            BTC
         */

        let masterBTC = await Wallet.getMaster("BTC")
        console.log("masterBTC: ",masterBTC)

        let balanceBTC = await Wallet.getBalance("BTC")
        console.log("balanceBTC: ",balanceBTC)



        let masterBCH = await Wallet.getMaster("BCH")
        console.log("masterBCH: ",masterBCH)

        let balanceBCH = await Wallet.getBalance("BCH")
        console.log("balanceBCH: ",balanceBCH)

    }catch(e){
        console.error(e)
    }
}

run_test()
