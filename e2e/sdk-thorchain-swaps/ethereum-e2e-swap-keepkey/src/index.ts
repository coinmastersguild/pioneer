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
const TAG  = " | e2e-test | "
const log = require("log")

let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let KKSDK = require("@keepkey/keepkey-sdk")
let wait = require('wait-promise');
let sleep = wait.sleep;
let midgard = require("@pioneer-platform/midgard-client")
let coincap = require("@pioneer-platform/coincap")


let {
    supportedBlockchains,
    baseAmountToNative,
    nativeToBaseAmount,
} = require("@pioneer-platform/pioneer-coins")

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

const { NodeWebUSBKeepKeyAdapter } = require('@shapeshiftoss/hdwallet-keepkey-nodewebusb')
const core = require('@shapeshiftoss/hdwallet-core');

let BLOCKCHAIN = 'ethereum'
let ASSET = 'ETH'
let MIN_BALANCE = process.env['MIN_BALANCE_ETH'] || "0.0002"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.003"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let FAUCET_RUNE_ADDRESS = process.env['FAUCET_RUNE_ADDRESS'] || 'thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5'
let FAUCET_BCH_ADDRESS = process.env['FAUCET_BCH_ADDRESS'] || 'qzxp0xc6vsj8apg9ym4n4jl45pyxtkpshuvr9smjp3'


let TRADE_PAIR  = "ETH_BCH"
let INPUT_ASSET = ASSET
let OUTPUT_ASSET = "BCH"

let noBroadcast = false

let blockchains = [
    'bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance','cosmos','dogecoin'
]


//force monitor
// let FORCE_MONITOR = false
// if(FORCE_MONITOR){
// let txid = "0x75dcac2dfc67086cfeae0c406b47e5c56c15607d9b22f3526ce86a92a4eaab7c"
// let invocationId = "pioneer:invocation:v0.01:ETH:4755MHZN6gqma6PkrmVtsF"
// }

let txid:string
let invocationId:string

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

        //connect to keepkey
        const keyring = new core.Keyring();

        let wallet = await getDevice(keyring);

        let username:any
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

        //TODO verify 1 balance for each blockchain

        //TODO init localDB with keys


        // generate new key
        const queryKey = uuidv4();
        assert(queryKey)

        let config = {
            queryKey,
            spec,
            wss
        }

        let app = new SDK.SDK(spec,config)

        //load pubkeys
        // await app.loadPubkeys(pubkeys)

        let events = await app.startSocket()
        let eventPairReceived = false
        let eventInvokeTransferReceived = false
        events.on('message', async (event:any) => {
            log.test(tag,"event: ",event)
            switch(event.type) {
                case 'pairing':
                    assert(event.queryKey)
                    assert(event.username,username)
                    assert(event.url)
                    eventPairReceived = true
                    break;
                case 'transfer':
                    //TODO assert valid transfer info
                    //received continue below
                    eventInvokeTransferReceived = true
                    break;
                default:
                    log.error(tag,"unhandled event: ",event)
                // code block
            }
        })

        let seedChains = ['ethereum','thorchain']
        await app.init(seedChains)

        //register
        //pair
        let pairWalletKeepKey:any = {
            type:'keepkey',
            format:'citadel',
            isWatch:'true',
            wallet:keepkeySdk,
            serialized:walletWatch,
            pubkeys:pubkeys,
        }
        log.debug("pairWalletKeepKey: ",pairWalletKeepKey)
        let registerResult = await app.pairWallet(pairWalletKeepKey)
        log.debug("registerResult: ",registerResult)
        username = app.username
        log.debug("app: ",app.username)
        log.debug("username: ",username)
        assert(username)

        assert(app.context)

        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
        }
        console.timeEnd('start2paired');

        //verify isPaired
        //log.debug(tag,"app: ",app)
        assert(app.isPaired)

        await app.updateContext()

        log.debug("app.username: ",app.username)
        log.debug("app.balances: ",app.balances)
        assert(app.balances)
        for(let i = 0; i < app.balances.length; i++){
            let balance = app.balances[i]
            log.debug("balance: ",balance)
            if(balance.symbol === 'undefined') throw Error('invalid pubkey! undefined!')

            //image
            if(!balance.image){
                log.error("INvalid image!: ",balance)
            }
            // if(!balance.balance){
            //     log.error("Invalid balance!: ",balance)
            // }
            assert(balance.image)
            assert(balance.pubkey)
            // assert(balance.balance)
            assert(balance.path)
            assert(balance.symbol)

        }

        //verify user is online
        let onlineUsers = await app.pioneerApi.Globals()
        onlineUsers = onlineUsers.data
        log.debug(tag,"onlineUsers: ",onlineUsers)

        //verify balances still exist

        //max cost - balance

        //you have x max amount spendable

        //you are attempting to spend x

        //this is x percent of total available

        //get pool address
        let poolInfo = await midgard.getPoolAddress()

        //filter by chain
        let ethVault = poolInfo.filter((e:any) => e.chain === 'ETH')
        log.debug(tag,"ethVault: ",ethVault)

        if(ethVault[0].halted) {
            log.debug(tag,"ethVault: ",ethVault)
            throw Error("Unable to swap! network halted!")
        }

        assert(ethVault[0])
        ethVault = ethVault[0]
        assert(ethVault.address)
        assert(ethVault.router)
        const vaultAddressEth = ethVault.address
        const gasRate = ethVault.gas_rate
        assert(vaultAddressEth)
        assert(gasRate)

        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        //select balance FROM keepkey ETH
        let pubkey = app.balances.filter((balance:any) => balance.symbol === ASSET)[0]
        log.debug(tag,"pubkey: ",pubkey)
        //select TO pubkey as keepkey BCH

        log.debug(tag,"amountNative: ",baseAmountToNative("eth",TEST_AMOUNT))
        assert(pubkey.pubkey)
        assert(pubkey.address)
        let swap:any = {
            context:app.context,
            inboundAddress: ethVault,
            addressFrom:pubkey.pubkey,
            coin: "ETH",
            asset: "ETH",
            memo: '=:'+OUTPUT_ASSET+'.'+OUTPUT_ASSET+':'+FAUCET_BCH_ADDRESS,
            amount:TEST_AMOUNT,
        }
        if(noBroadcast) swap.noBroadcast = true
        log.debug(tag,"swap: ",swap)

        //build swap
        let responseSwap = await app.buildSwapTx(swap,options,ASSET)
        assert(responseSwap)
        assert(responseSwap.HDwalletPayload)
        log.debug(tag,"responseSwap: ",responseSwap)
        console.timeEnd('start2build');

        let transaction:any = {
            type:'keepkey-sdk',
            fee:{
                priority:3
            },
            unsignedTx:responseSwap,
            context:app.context,
            network:ASSET
        }

        //get invocation
        log.debug(tag,"transaction: ",transaction)
        log.test(tag,"invocationId: ",invocationId)

        let responseInvoke = await app.invokeUnsigned(transaction,options,ASSET)
        assert(responseInvoke)
        if(!responseInvoke.success){
            assert(responseInvoke.invocationId)
            log.error()
        }
        log.debug(tag,"responseInvoke: ",responseInvoke)

        invocationId = responseInvoke.invocationId
        transaction.invocationId = invocationId

        //get invocation
        let invocationView1 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
        assert(invocationView1)
        assert(invocationView1.state)
        assert(invocationView1.invocation)
        assert(invocationView1.invocation.unsignedTx)
        assert(invocationView1.invocation.unsignedTx.HDwalletPayload)
        //assert.equal(invocationView1.state,'builtTx')

        //TODO validate payload

        //sign transaction
        log.notice("************* SIGN ON KEEPKEY! LOOK DOWN BRO ***************")
        let signedTx = await app.signTx(invocationView1.invocation.unsignedTx)
        assert(signedTx.txid)

        //updateTx
        let updateBody = {
            network:ASSET,
            invocationId,
            invocation:invocationView1,
            unsignedTx:responseSwap,
            signedTx
        }

        //update invocation remote
        let resultUpdate = await app.updateInvocation(updateBody)
        assert(resultUpdate)
        log.debug(tag,"resultUpdate: ",resultUpdate)

        // //get invocation
        let invocationView2 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)
        assert(invocationView2.state)
        assert.equal(invocationView2.state,'signedTx')
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        let broadcastResult = await app.broadcastTransaction(updateBody)
        log.debug(tag,"broadcastResult: ",broadcastResult)

        //verify broadcasted
        let invocationView3 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView3: (VIEW) ",invocationView3)
        assert(invocationView3.state)
        assert.equal(invocationView3.state,'broadcasted')

        //get invocation info EToC
        console.timeEnd('start2broadcast');

        //wait for confirmation
        console.time('timeToConfirmed')
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

                if(invocationInfo.state === 'builtTx'){
                    //rebroadcast
                    let broadcastResult = await broadcastTransaction(transaction)
                    log.debug(tag,"broadcastResult: ",broadcastResult)
                }


                if(invocationInfo && invocationInfo.isConfirmed){
                    log.test(tag,"Confirmed!")
                    statusCode = 3
                    isConfirmed = true
                    console.timeEnd('timeToConfirmed')
                    console.time('confirm2fullfillment')
                } else {
                    log.test(tag,"Not Confirmed!")
                }

            }

            while(!isFullfilled){
                //get invocationInfo
                await sleep(6000)
                let invocationInfo = await app.getInvocation(invocationId)
                log.test(tag,"invocationInfo: ",invocationInfo.state)

                if(invocationInfo && invocationInfo.isConfirmed && invocationInfo.isFullfilled) {
                    log.test(tag,"is fullfilled!")
                    fullfillmentTxid = invocationInfo.fullfillmentTxid
                    isFullfilled = true
                    console.timeEnd('confirm2fullfillment')
                    //get tx gas price
                } else {
                    log.test(tag,"unfullfilled!")
                }
            }
            log.notice("****** TEST Report: "+fullfillmentTxid+" ******")
        }
        let result = await app.stopSocket()
        log.debug(tag,"result: ",result)


        log.notice("****** TEST PASS ******")
        console.timeEnd('start2end')
        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
