/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let App = require("../lib")

let WALLET_PASSWORD = process.env['WALLET_PASSWORD']
if(!WALLET_PASSWORD) throw Error(".env not found!")

//force
//process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"


let seed_1 = process.env['WALLET_MAINNET_DEV']
let password = process.env['WALLET_PASSWORD']
// let username = process.env['TEST_USERNAME_1']

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

//console.log("password: ",password)

let TEST_COINS = [
    // 'BTC',
    // 'BCH',
    'LTC',
    // 'ETH',
    // 'ATOM'
    // 'RUNE'
    // 'BNB'
]

let run_test = async function(){
    try{
        //get config
        let config = await App.getConfig()

        console.log("config: ",config)

        //if no config
        if(!config){
            console.log("use Pair test")
        } else {

            config.password = password
            config.username = username

            let resultInit = await App.init(config)
            //console.log("resultInit: ",resultInit)

            //pair
            let pairResult = await App.pair("0IQ5XS")
            console.log("pairResult: ",pairResult)

            //get wallets
            let wallets = await App.getWallets()
            //console.log("wallets: ",wallets)

            let context = wallets[0]
            if(!context) throw Error("No Wallets on startup!")

            /*
                FIO
             */
            // let fioPublicInfo = await context.getFioAccountInfo("highlander@scatter")
            // console.log("fioPublicInfo: ",fioPublicInfo)

            /*
                BTC
             */
            if(TEST_COINS.indexOf('BTC') >= 0){
                let btcBalance = await context.getBalance("BTC")
                console.log("btcBalance: ",btcBalance)

                //get address
                let btcMaster = await context.getMaster("BTC")
                console.log("btcMaster: ",btcMaster)

                //TODO request from faucet


                let intent = {
                    coin:"BTC",
                    address:"bc1qs7ek0m3ah0xhn9a2txxrgvcw50clnvuhymx87h",
                    amount:"0.00001",
                    noBroadcast:true,
                    invocationId:"workyplzbro"
                }
                let txid = await context.sendToAddress(intent)
                console.log("txid: ",txid)
                //TODO coin control
            }



            /*
               BCH
            */
            if(TEST_COINS.indexOf('BCH') >= 0){
                let bchBalance = await context.getBalance("BCH")
                console.log("bchBalance: ",bchBalance)

                //get address
                let bchMaster = await context.getMaster("BCH")
                console.log("bchMaster: ",bchMaster)

                //TODO request from faucet
                let intent = {
                    coin:"BCH",
                    address:"1Dmjt2DWjNpVWRPXRNuhwfDnSqPmfxGLLG",
                    amount:"0.00001",
                    noBroadcast:true,
                    invocationId:"workyplzbro"
                }
                let txid = await context.sendToAddress(intent)
                console.log("txid: ",txid)
                //TODO coin control
            }

            /*
               LTC
            */
            if(TEST_COINS.indexOf('LTC') >= 0){
                let ltcBalance = await context.getBalance("LTC")
                console.log("ltcBalance: ",ltcBalance)

                //get address
                let ltcMaster = await context.getMaster("LTC")
                console.log("ltcMaster: ",ltcMaster)

                //TODO request from faucet
                let intent = {
                    coin:"LTC",
                    address:"LKrRH5UyM5T8WreSfRjfv4jnJ1AxsmmKxB",
                    amount:"0.0001",
                    noBroadcast:true,
                    invocationId:"workyplzbro"
                }
                let txid = await context.sendToAddress(intent)
                console.log("txid: ",txid)
                //TODO coin control
            }

            /*
                ETH
             */
            if(TEST_COINS.indexOf('ETH') >= 0){
                let ethBalance = await context.getBalance("ETH")
                console.log("ethBalance: ",ethBalance)

                let ethMaster = await context.getMaster("ETH")
                console.log("ethMaster: ",ethMaster)

                //send tx
                let intent = {
                    coin:"ETH",
                    address:"0xc3affff54122658b89c31183cec4f15514f34624",
                    amount:"0.001",
                    memo:null,
                    noBroadcast:true,
                    invocationId:"workyplzbro"
                }
                // let txid = await context.sendToAddress(intent)
                // console.log("txid: ",txid)
            }

            /*
                ATOM
             */
            if(TEST_COINS.indexOf('ATOM') >= 0){
                let atomBalance = await context.getBalance("ATOM")
                console.log("atomBalance: ",atomBalance)

                let atomMaster = await context.getMaster("ATOM")
                console.log("atomMaster: ",atomMaster)

                //send tx
                // let intent = {
                //     coin:"ATOM",
                //     address:"cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj",
                //     amount:"0.001"
                // }
                // let txid = await context.sendToAddress(intent)
                // console.log("txid: ",txid)
            }

            /*
                RUNE
             */
            if(TEST_COINS.indexOf('RUNE') >= 0){
                let runeBalance = await context.getBalance("RUNE")
                console.log("runeBalance: ",runeBalance)

                let runeMaster = await context.getMaster("RUNE")
                console.log("runeMaster: ",runeMaster)

                //send tx
                let intent = {
                    coin:"RUNE",
                    address:"",
                    amount:"0.001",
                    noBroadcast:true,
                    invocationId:"workyplzbro"
                }
                let txid = await context.sendToAddress(intent)
                console.log("txid: ",txid)
            }


            /*
                BNB
             */
            if(TEST_COINS.indexOf('BNB') >= 0){
                let runeBalance = await context.getBalance("BNB")
                console.log("runeBalance: ",runeBalance)

                let runeMaster = await context.getMaster("BNB")
                console.log("runeMaster: ",runeMaster)

                //send tx
                let intent = {
                    coin:"BNB",
                    address:"bnb1yq372zpenw0sla8l0pxpf08xgflxnfngndv433",
                    amount:"0.0001",
                    // noBroadcast:true,
                    invocationId:"workyplzbro"
                }
                let txid = await context.sendToAddress(intent)
                console.log("txid: ",txid)
            }

        }


    }catch(e){
        console.error(e)
    }
}

run_test()
