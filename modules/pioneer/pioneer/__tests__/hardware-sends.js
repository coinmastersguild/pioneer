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

        /*
            ETH thorchain swap
         */
        let masterETH = await Wallet.getMaster("ETH")
        console.log("reference: ","0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8")
        console.log("masterETH: ",masterETH)

        let balanceETH = await Wallet.getBalance("ETH")
        console.log("balanceETH: ",balanceETH)


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

        let swap = {
            inboundAddress: {
                chain: 'ETH',
                pub_key: 'tthorpub1addwnpepqvuy8vh6yj4h28xp6gfpjsztpj6p46y2rs0763t6uw9f6lkky0ly5uvwla6',
                address: '0x36286e570c412531aad366154eea9867b0e71755',
                router: '0x9d496De78837f5a2bA64Cb40E62c19FBcB67f55a',
                halted: false
            },
            asset: {
                chain: 'ETH',
                symbol: 'ETH',
                ticker: 'ETH',
                iconPath: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png'
            },
            memo: '=:THOR.RUNE:tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh',
            amount: "0.0123"
        }


        let result = await Wallet.buildSwap(swap)
        console.log("swapResult: ",result)

        let resultBroadcast = await Wallet.broadcastTransaction('ETH',result)
        console.log("resultBroadcast: ",resultBroadcast)

        // let transfer = {
        //     coin:"ETH",
        //     addressTo:"0x33b35c665496bA8E71B22373843376740401F106"
        // }
        //
        // let amount = 0.0001
        // transfer.amount = amount
        //
        // let result = await Wallet.buildTransfer(transfer)
        // console.log("transfer: ",result)
        //
        // let resultBroadcast = await Wallet.broadcastTransaction('ETH',result)
        // console.log("resultBroadcast: ",resultBroadcast)


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
