/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let App = require("../lib")
let Hardware = require("@pioneer-platform/pioneer-hardware")

//CLI tools
const prompt = require('prompt');
const Table = require('cli-table');
prompt.start();

let wait = require('wait-promise');
let sleep = wait.sleep;

let WALLET_PASSWORD = process.env['WALLET_PASSWORD']
if(!WALLET_PASSWORD) throw Error(".env not found!")

//force
process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
//process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"


let seed_1 = process.env['WALLET_MAINNET_DEV']
let password = process.env['WALLET_PASSWORD']
// let username = process.env['TEST_USERNAME_1']

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

//console.log("password: ",password)

let TEST_COINS = [
    'BTC',
    // 'BCH',
    // 'ETH',
    // 'ATOM'
]

let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance']

let INVOCATIONS_SIGNED = []

let run_test = async function(){
    try{
        //get config
        let config = await App.getConfig()

        //start
        let KEEPKEY = await Hardware.start()
        let lockStatus = await Hardware.isLocked()
        console.log("lockStatus: ",lockStatus)

        let keepkeyStatus = await App.hardwareState()
        console.log("keepkeyStatus: ",keepkeyStatus)

        //if no config
        if(!config){
            console.log("First time startup run (pair-keepkey)")
        } else {
            //if force keepkey
            //
            let keepkeyStatus = await App.hardwareState()

            if(keepkeyStatus.state > 3) {
                let isTestnet = true

                //Local override
                // config.password = password
                // config.username = username
                config.hardware = true

                //if already started

                //verify not inited
                let isInit = App.isInitialized()
                if(isInit) throw Error("App already initialized")

                //test
                let resultInit = await App.init(config,isTestnet)
                console.log("resultInit: ",resultInit)

                let isInit2 = App.isInitialized()
                if(!isInit2) throw Error("App should be initialized")

                //TODO should refuse to init again


                //AutonomousOn
                resultInit.events.on('unsignedTx', async (transaction) => {
                    console.log("\n ****UNsigned transaction received! transaction: ",transaction)
                    //get invocationId
                    if(!transaction.invocationId && transaction.transaction) transaction.invocationId = transaction.transaction.invocationId
                    if(!transaction.invocationId && transaction.swap) transaction.invocationId = transaction.swap.invocationId

                    //TODO CLI review
                    if(INVOCATIONS_SIGNED.indexOf(transaction.invocationId) < 0){
                        console.log("SIGNING TX ",transaction.invocationId)
                        INVOCATIONS_SIGNED.push(transaction.invocationId)
                        //approve
                        let resultApprove = await App.approveTransaction(transaction)
                        console.log("resultApprove: ",resultApprove)

                    }
                    //
                    let resultBroadcast = await App.broadcastTransaction(transaction)
                    console.log("resultBroadcast: ",resultBroadcast)
                })

                try{
                    let pairResult = await App.pair("EU18ST")
                    console.log("pairResult: ",pairResult)
                }catch(e){

                }

                //get user info
                let userInfo = await App.getUserInfo()
                console.log("userInfo: ",userInfo)

                //get wallets
                let wallets = await App.getWallets()
                console.log("wallets: ",wallets)

                let walletDescriptions = await App.getWalletDescriptions()
                console.log("walletDescriptions: ",walletDescriptions)

                let contextName = await App.context()
                console.log("contextName: ",contextName)

                let context = wallets[contextName]
                if(!context) throw Error("No Wallets on startup!")


                //
                let btcBalance = await context.getBalance("BTC")
                console.log("btcBalance: ",btcBalance)

                let btcMaster = await context.getMaster("BTC")
                console.log("btcMaster: ",btcMaster)

                //Device unlocked ready for requests
                /*
                    ETH thorchain swap
                */
                let masterETH = await context.getMaster("ETH")
                // console.log("reference: ","0x3f2329C9ADFbcCd9A84f52c906E936A42dA18CB8")
                console.log("masterETH: ",masterETH)

                let balanceETH = await context.getBalance("ETH")
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
                // let result = await context.buildSwap(swap)
                // console.log("swapResult: ",result)
                //
                // let resultBroadcast = await context.broadcastTransaction('ETH',result)
                // console.log("resultBroadcast: ",resultBroadcast)
                console.log("subscribed user: ",userInfo.username)
                console.log("system ready....")
            } else if(keepkeyStatus.state === 3){
                //prompt pin
                console.log("Device Locked!")
                Hardware.displayPin(blockchains)

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

                prompt.get(['pin'], async function (err, result) {
                    if (err) { return onErr(err); }
                    console.log('Command-line input received:');
                    console.log('  pin: ' + result.pin);
                    KEEPKEY.sendPin(result.pin)
                });

                // await sleep(2000)
                // run_test()
            } else {

                await sleep(2000)


                run_test()
            }

        }


    }catch(e){
        console.error(e)
    }
}

run_test()
