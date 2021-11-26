/*
    E2E testing
        k8  "job" pattern

    load test seed

    verify empty

    build sign broadcast swap

    watch till confirmed

    report to leeroy server results



    SDK Arch pattern ***

        Start and configure app

        verify socket connection


    Use sdk to

        * check balances
        * check tx history
        * verify payment

 */

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let BigNumber = require('@ethersproject/bignumber')
let pjson = require("../package.json");
let TAG = " | " + pjson.name.replace("@pioneer-platform/", "") + " | ";
const log = require("@pioneer-platform/loggerdog")()

let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let wait = require('wait-promise');
let sleep = wait.sleep;
let midgard = require("@pioneer-platform/midgard-client")
let coincap = require("@pioneer-platform/coincap")

const { NodeWebUSBKeepKeyAdapter } = require('@bithighlander/hdwallet-keepkey-nodewebusb')
const core = require('@bithighlander/hdwallet-core');

let {
    baseAmountToNative,
    nativeToBaseAmount,
} = require("@pioneer-platform/pioneer-coins")

const {
    startApp,
    sendPairingCode,
    getContext,
    getWallets,
    cancelTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'ethereum'
let ASSET = 'ETH'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.004"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj'
let KKSDK = require("@keepkey/keepkey-sdk")

let blockchains = [
    'bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin'
]

//connect to keepkey
let getDevice = async function(keyring:any) {
    let tag = TAG + " | getDevice | "
    try {
        const keepkeyAdapter = NodeWebUSBKeepKeyAdapter.useKeyring(keyring);
        let wallet = await keepkeyAdapter.pairDevice(undefined, true);
        if (wallet) {
            log.debug(tag,"Device found!")
            log.debug(tag,"wallet: ",wallet)
        }
        return wallet;
    } catch (e) {
        //log.error(tag,"*** e: ",e.toString())
        log.error("failed to get device: ",e)
        //@ts-ignore
        if(e.message.indexOf("no devices found") >= 0){
            return {
                error:true,
                errorCode: 1,
                errorMessage:"No devices"
            }
            //@ts-ignore
        } else if(e.message.indexOf("claimInterface")>= 0){
            return {
                error:true,
                errorCode: -1,
                errorMessage:"Unable to claim!"
            }
        } else {
            return {
                error:true,
                errorMessage:e
            }
        }
    }
}


const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {
        console.time('start2paired');
        console.time('start2build');
        console.time('start2broadcast');
        console.time('start2end');

        log.debug(tag,"CHECKPOINT 1")
        //connect to keepkey
        const keyring = new core.Keyring();
        log.debug(tag,"CHECKPOINT 2")

        let wallet = await getDevice(keyring);
        log.debug(tag,"wallet: ",wallet)
        log.debug(tag,"CHECKPOINT 3")

        let keepkeySdk
        let pubkeys
        let walletWatch
        if(!wallet.error){
            log.debug(tag,"KKSDK: ",KKSDK)
            keepkeySdk = new KKSDK(wallet,blockchains)
            let pubkeysResp = await keepkeySdk.getPubkeys()
            walletWatch = pubkeysResp.wallet
            pubkeys = pubkeysResp.pubkeys
            //console.log('pubkeys: ',JSON.stringify(pubkeys))
        } else {
            log.error(" Device error: ",wallet)
        }

        //generate new key
        // const queryKey = "sdk:4339eec1-343a-438f-823a-4f56d1f528c2";
        const queryKey = uuidv4();
        const username = 'test:pair-multi'+uuidv4();
        assert(queryKey)
        assert(username)

        let config = {
            queryKey,
            username,
            spec,
            wss
        }

        let app = new SDK.SDK(spec,config)

        log.debug("app: ",app.username)
        log.notice("username: ",username)
        assert(username)
        assert(app.username)
        assert(username,app.username)

        let events = await app.startSocket()
        let eventPairReceived = false
        events.on('message', async (message:any) => {
            log.debug(tag,"message: ",message)
            assert(message.queryKey)
            assert(message.username)
            assert(message.url)
            eventPairReceived = true
        })

        let seedChains = [
            'bitcoin',
            'ethereum',
            'thorchain',
            'bitcoincash',
            'binance',
            'litecoin',
            'cosmos',
            'osmosis'
        ]
        await app.init(seedChains)

        //pair metamask
        let pairWalletKeepKey:any = {
            type:'keepkey',
            format:'keepkey',
            isWatch:'true',
            wallet:keepkeySdk,
            serialized:walletWatch,
            pubkeys:pubkeys,
        }
        log.debug(tag,"pairWalletKeepKey: ",pairWalletKeepKey)

        // log.debug("pairWalletKeepKey: ",pairWalletKeepKey)
        let registerResult1 = await app.pairWallet(pairWalletKeepKey)
        log.debug("registerResult1: ",registerResult1)

        //pair onboard
        //pair metamask
        let pairWalletOnboard:any = {
            name:'MetaMask',
            format:'onboard',
            network:1,
            initialized:true,
            address:"0xfEb8bf56e554fc47639e5Ed9E1dAe21DfF69d6A9"
        }
        log.debug(tag,"pairWalletOnboard: ",pairWalletOnboard)

        //pair wallet
        let resultRegister2 = await app.pairWallet(pairWalletOnboard)
        log.debug("resultRegister2: ",resultRegister2)


        log.debug("app: ",app.username)
        log.notice("username: ",username)
        assert(username)
        assert(app.username)
        assert(username,app.username)

        //sdk info
        log.debug("app pubkeys: ",app.pubkeys)
        log.debug("app balances: ",app.balances)
        // log.debug("app balances: ",JSON.stringify(app.balances))
        log.debug("app context: ",app.context)
        assert(app.pubkeys)
        assert(app.balances)
        // assert(app.balances.length > 0)
        assert(app.context)
        log.debug("app balances: ",app.balances)
        if(app.balances.length === 0) throw Error("Invalid balances! empty!")

        log.notice("app balances: length",app.balances)
        //TODO has at least 1 balance for every enabled blockchain
        if(app.balances.length === 0) throw Error("Empty balances!")

        //TODO count networks verify 1 per network
        //assert.equal(app.balances.length,8)

        //verify icons
        for(let i = 0; i < app.balances.length; i++){
            let balance = app.balances[i]

            log.debug("balance: ",balance)
            if(balance.symbol === 'undefined') throw Error('invalid pubkey! undefined!')
            //
            if(!balance.image){
                log.error("Invalid image!: ",balance)
            }
            // if(!balance.balance){
            //     log.error("Invalid balance!: ",balance)
            // }
            assert(balance.image)
            assert(balance.pubkey)
            //assert(balance.balance)
            assert(balance.path)
            assert(balance.symbol)
            assert(balance.protocols)

            if(balance.symbol === 'BTC'){
                if(balance.protocols.indexOf('thorchain') === -1) throw Error('Missing proto flag thorchain!')
            }
        }

        //verify pairing has metamask wallet
        let pubkeysMetamaskContext = app.balances.filter((e:any) => e.pubkey === '0xfEb8bf56e554fc47639e5Ed9E1dAe21DfF69d6A9')[0]
        assert(pubkeysMetamaskContext)
        //switch context


        log.notice("****** TEST PASS ******")
        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
