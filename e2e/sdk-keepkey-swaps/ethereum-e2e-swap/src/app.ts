/*
   *** E2E TEST ***
        App Module


    Init from env vars
    * verify empty env at start
    * verify creation

 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let assert = require('assert')

//test app
const App = require("@pioneer-platform/pioneer-app")
const log = require("@pioneer-platform/loggerdog")()
const Hardware = require("@pioneer-platform/pioneer-hardware")
let wait = require('wait-promise');
let sleep = wait.sleep;
//cli for pin
const prompt = require('prompt');
const Table = require('cli-table');
prompt.start();

//general dev envs
let seed = process.env['WALLET_MAINNET_DEV_OLD']
let password = process.env['WALLET_PASSWORD']
let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

let blockchains = ['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance']


export async function startApp() {
    let tag = " | app_assert_env_start | "
    try {
        //assert env correct
        assert(seed)
        assert(password)
        assert(username)
        assert(queryKey)

        //get config
        let config = await App.getConfig()
        assert(config === null)

        //For keepkey
        let KEEPKEY = await Hardware.start()
        KEEPKEY.events.on('event', async function(event:any) {
            //console.log("EVENT: ",event)
        });

        let info = await Hardware.info()
        console.log("info: ",info)

        let state = await Hardware.state()
        console.log("state: ",state)

        //
        if(state.state > 2){
            //get lock status
            let lockStatus = await Hardware.isLocked()
            console.log("lockStatus: ",lockStatus)

            if(lockStatus){
                //show pin and helper
                let table = new Table({
                    colWidths: [5, 5, 5]
                });

                table.push(["1", "2", "3"]);
                table.push(["4", "5", "6"]);
                table.push(["7", "8", "9"]);

                table = table.sort(function (a: number[], b: number[]) {
                    return b[2] - a[2];
                });
                console.log("\n \n PIN ENTRY \n \n " + table.toString() + "\n \n");
                //
                Hardware.displayPin()
                prompt.get(['pin'], async function (err: any, result: { pin: string }) {
                    if (err) { throw Error(err) }
                    console.log('Command-line input received:');
                    console.log('  pin: ' + result.pin);
                    KEEPKEY.sendPin(result.pin)
                });
            }

            await App.initConfig("english");
            App.updateConfig({isTestnet:true});
            App.updateConfig({username});
            App.updateConfig({temp:password});
            App.updateConfig({blockchains})
            App.updateConfig({created: new Date().getTime()});

            //get config
            config = await App.getConfig()

            //TODO back to 1?
            config.blockchains = blockchains

            //verify startup
            //let isTestnet = null
            log.info(tag,"config: ",config)
            let resultInit = await App.init(config)
            assert(resultInit)

            config.password = password
            config.username = username

            //get wallets
            let wallets = await App.getWallets()

            //assert only 1
            let context = wallets[await App.context()]

            return context
        } else {
            await sleep("3000")
            await startApp()
        }
    } catch (e) {
        log.error(e)
        throw e
    }
}

export async function sendPairingCode(code:string) {
    let tag = " | sendPairingCode | "
    try {
        let pairResult = await App.pair(code)
        //console.log("pairResult: ",pairResult.data)

        return true
    } catch (e) {
        log.error(e)
        throw e
    }
}
