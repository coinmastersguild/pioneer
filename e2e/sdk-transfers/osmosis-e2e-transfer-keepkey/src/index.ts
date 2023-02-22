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

const TAG  = " | e2e-test | "
const log = require("log")
let BigNumber = require('@ethersproject/bignumber')
let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let wait = require('wait-promise');
let sleep = wait.sleep;
let midgard = require("@pioneer-platform/midgard-client")
// let coincap = require("@pioneer-platform/coincap")



import {
    Transfer
} from "@pioneer-platform/pioneer-types";

let {
    supportedBlockchains,
    baseAmountToNative,
    nativeToBaseAmount,
} = require("@pioneer-platform/pioneer-coins")

const { NodeWebUSBKeepKeyAdapter } = require('@bithighlander/hdwallet-keepkey-nodewebusb')
const core = require('@shapeshiftoss/hdwallet-core');

let KKSDK = require("@keepkey/keepkey-sdk")

const {
    startApp,
    getContext,
    getWallets,
    getInvocations,
    sendPairingCode,
    buildTransaction,
    approveTransaction,
    broadcastTransaction
} = require('@pioneer-platform/pioneer-app-e2e')

let BLOCKCHAIN = 'osmosis'
let ASSET = 'OSMO'
let MIN_BALANCE = process.env['MIN_BALANCE_OSMO'] || "0.04"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.0001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let FAUCET_OSMO_ADDRESS = process.env['FAUCET_OSMO_ADDRESS'] || 'osmo1ayn76qwdd5l2d66nu64cs0f60ga7px8zmvng6k'

let blockchains = [
    'bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin','osmosis'
]


let noBroadcast = true

console.log("spec: ",spec)
console.log("wss: ",wss)


console.log("spec: ",spec)
console.log("wss: ",wss)

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

        //start app and get wallet
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
            log.debug(tag,'pubkeys: ',JSON.stringify(pubkeys))
        } else {
            log.error(" Device error: ",wallet)
            throw Error('wallet error!')
        }

        assert(pubkeys)

        //generate new key
        // const queryKey = "sdk:4339eec1-343a-438f-823a-4f56d1f528c2";
        const queryKey = "sdk:pair-keepkey:"+uuidv4();
        const username = "user:pair-keepkey:"+uuidv4();
        assert(queryKey)
        assert(username)

        let config = {
            queryKey,
            username,
            spec,
            wss
        }
        log.debug(tag,"config: ",config)
        let app = new SDK.SDK(spec,config)
        let seedChains = ['ethereum','thorchain','bitcoin','osmosis','cosmos']
        let API = await app.init(seedChains)
        assert(API)
        let events = await app.startSocket()
        //pair
        let pairWalletKeepKey:any = {
            type:'keepkey',
            name:'keepkey',
            format:'keepkey',
            isWatch:'true',
            wallet:keepkeySdk,
            serialized:walletWatch,
            pubkeys:pubkeys,
        }
        log.debug(tag,"pairWalletKeepKey: ",pairWalletKeepKey)
        let registerResult = await app.pairWallet(pairWalletKeepKey)
        log.info("registerResult: ",registerResult)
        assert(registerResult)
        log.info("app: ",app.username)
        log.notice("username: ",username)
        assert(username)
        assert(app)
        assert(app.context)
        assert.equal(username,app.username)


        assert(app.pubkeys)
        let masterAddress = app.pubkeys.filter((e:any) => e.symbol === ASSET)[0]
        assert(masterAddress)
        masterAddress = masterAddress.pubkey
        log.test(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)
        log.debug(tag,"CHECKPOINT 4 master address")

        //TODO
        // //get address from keepkey
        // let addressSdk = await app.getAddress('OSMO',true)
        // log.test(tag,"addressSdk: ",addressSdk)
        // assert(addressSdk)
        //verify match

        //estimate BCH fee? lol
        let asset = {
            chain:ASSET,
            symbol:ASSET,
            ticker:ASSET,
        }

        //test amount in native
        let amountTestNative = baseAmountToNative("OSMO",TEST_AMOUNT)

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        let transfer:any = {
            type:'transfer',
            addressFrom:masterAddress,
            context:app.context,
            recipient: FAUCET_OSMO_ADDRESS,
            asset: ASSET,
            network: ASSET,
            memo: '',
            "amount":amountTestNative,
            fee:{
                priority:5, //1-5 5 = highest
            },
            noBroadcast
        }
        log.debug(tag,"transfer: ",transfer)

        let responseTx = await app.buildTx(transfer,options,ASSET)
        assert(responseTx)
        assert(responseTx.HDwalletPayload)
        log.info(tag,"responseTx: ",responseTx)
        console.timeEnd('start2build');
        //invoke unsigned
        let transaction:any = {
            type:'pioneer',
            fee:{
                priority:3
            },
            unsignedTx:responseTx,
            context:app.context,
            network:ASSET
        }


        //get invocation
        log.info(tag,"transaction: ",transaction)
        let responseInvoke = await app.invokeUnsigned(transaction,options,ASSET)
        assert(responseInvoke)
        log.info(tag,"responseInvoke: ",responseInvoke)
        let invocationId = responseInvoke.invocationId
        assert(invocationId)

        //get invocation
        let invocationView1 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
        assert(invocationView1)
        assert(invocationView1.state)

        //todo assert state
        assert(invocationView1)
        assert(invocationView1.state)
        assert(invocationView1.invocation)
        assert(invocationView1.invocation.unsignedTx)
        assert(invocationView1.invocation.unsignedTx.HDwalletPayload)

        //sign transaction
        let signedTx = await app.signTx(invocationView1.invocation.unsignedTx)
        log.info(tag,"signedTx: ",signedTx)
        log.info(tag,"signedTx: ",signedTx.serialized)
        assert(signedTx)
        // assert(signedTx.txid)

        //updateTx
        let updateBody = {
            network:ASSET,
            invocationId,
            invocation:invocationView1,
            unsignedTx:responseTx,
            signedTx
        }

        //update invocation remote
        log.info(tag,"updateBody: ",JSON.stringify(updateBody))
        let resultUpdate = await app.updateInvocation(updateBody)
        assert(resultUpdate)
        log.info(tag,"resultUpdate: ",resultUpdate)


        //get invocation
        let invocationView2 = await app.getInvocation(invocationId)
        assert(invocationView2)
        assert(invocationView2.state)
        assert.equal(invocationView2.state,'signedTx')
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        let broadcastResult = await broadcastTransaction(updateBody)
        log.debug(tag,"broadcastResult: ",broadcastResult)

        let invocationView3 = await app.getInvocation(invocationId)
        assert(invocationView3)
        assert(invocationView3.state)
        assert.equal(invocationView3.state,'broadcasted')
        log.debug(tag,"invocationView3: (VIEW) ",invocationView3)

        //get invocation info EToC
        let isConfirmed = false
        //wait for confirmation

        if(!noBroadcast){

            log.test(tag,"Broadcasting!")

            let invocationView4 = await app.getInvocation(invocationId)
            log.debug(tag,"invocationView4: (VIEW) ",invocationView4)
            assert(invocationView4)
            assert(invocationView4.state)
            assert.equal(invocationView3.state,'broadcasted')

            /*

                Status codes

                -1: errored
                 0: unknown
                 1: built
                 2: broadcasted
                 3: confirmed
                 4: fullfilled (swap completed)

             */


            //monitor tx lifecycle
            let isConfirmed = false
            let isFullfilled = false
            let fullfillmentTxid = false
            let currentStatus
            let statusCode = 0

            while(!isConfirmed){
                //get invocationInfo
                await sleep(6000)
                let invocationInfo = await app.getInvocation(invocationId)
                log.test(tag,"invocationInfo: ",invocationInfo.state)

                if(invocationInfo && invocationInfo.isConfirmed){
                    log.test(tag,"Confirmed!")
                    statusCode = 3
                    isConfirmed = true
                    log.notice(" TXID fullfillment AND swap = ",invocationInfo.signedTx.txid)
                    console.timeEnd('timeToConfirmed')
                    console.time('confirm2fullfillment')
                } else {
                    log.test(tag,"Not Confirmed!")
                }
            }
        }

        let result = await app.stopSocket()
        log.debug(tag,"result: ",result)

        log.notice("****** TEST PASS 2******")
        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
