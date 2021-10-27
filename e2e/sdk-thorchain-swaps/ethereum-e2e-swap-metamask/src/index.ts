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
const log = require("@pioneer-platform/loggerdog")()

const Axios = require('axios')
const https = require('https')
const axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
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
    metamaskMock,
    buildTransaction,
    approveTransaction,
    broadcastTransaction,
    updateInvocation
} = require('@pioneer-platform/pioneer-app-e2e')

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

let noBroadcast = true

//force monitor
// let FORCE_MONITOR = false
// if(FORCE_MONITOR){
// let txid = "0x75dcac2dfc67086cfeae0c406b47e5c56c15607d9b22f3526ce86a92a4eaab7c"
// let invocationId = "pioneer:invocation:v0.01:ETH:4755MHZN6gqma6PkrmVtsF"
// }

let txid:string
let invocationId:string

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {
        console.time('start2paired');
        console.time('start2build');
        console.time('start2broadcast');
        console.time('start2end');

        //start app and get wallet
        let wallets = await startApp()
        // log.debug(tag,"wallets: ",wallets)
        let username = wallets.username
        assert(username)

        let appContext = getContext()
        assert(appContext)
        log.debug(tag,"appContext: ",appContext)

        //get wallets
        let appWallets = getWallets()
        log.debug(tag,"appWallets: ",appWallets)

        //filter wallets with current context
        let walletDescriptionContext = wallets.user.walletDescriptions.filter((e:any) => e.context === appContext)[0]
        log.debug(tag,"walletDescriptionContext: ",walletDescriptionContext)

        //get pubkey
        let pubkey = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === ASSET)[0]
        log.debug(tag,"pubkey: ",pubkey)
        assert(pubkey)

        //get master output
        let pubkeyOutput = walletDescriptionContext.pubkeys.filter((e:any) => e.symbol === OUTPUT_ASSET)[0]
        log.debug(tag,"pubkeyOutput: ",pubkeyOutput.master)
        assert(pubkeyOutput)
        assert(pubkeyOutput.master)

        //balance
        let balance = walletDescriptionContext.balances.filter((e:any) => e.symbol === ASSET)[0]
        log.debug(tag,"balance: ",balance)
        assert(balance)
        assert(balance.balance)

        let master = pubkey.master
        assert(master)

        // //assert balance local
        log.debug(tag,"master: ",master)
        if(balance.balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+master)
            throw Error("101: Low funds!")
        } else {
            log.debug(tag," Attempting e2e test "+ASSET+" balance: ",balance)
        }


        //generate new key
        const queryKey = uuidv4();
        assert(queryKey)

        let config = {
            queryKey,
            spec,
            wss
        }

        let app = new SDK.SDK(spec,config)
        let events = await app.startSocket()
        let eventPairReceived = false
        let eventInvokeTransferReceived = false
        events.on('message', async (event:any) => {
            log.debug(tag,"event: ",event)
            switch(event.type) {
                case 'pairing':
                    assert(event.queryKey)
                    assert(event.username)
                    assert(event.url)
                    eventPairReceived = true
                    break;
                case 'transfer':
                    //TODO assert valid transfer info
                    //received continue below
                    eventInvokeTransferReceived = true
                    break;
                default:
                    //log.error(tag,"unhandled event: ",event)
                // code block
            }
        })

        let seedChains = ['ethereum','thorchain']
        await app.init(seedChains)

        //pair sdk
        let code = await app.createPairingCode()
        code = code.code
        log.debug("code: ",code)
        assert(code)

        //
        let pairSuccess = await sendPairingCode(code)
        log.debug("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
        }


        //assert sdk user
        let usernameSdk = await app.username
        log.debug("app: ",app.username)
        log.debug("usernameSdk: ",usernameSdk)
        assert(usernameSdk)
        assert(usernameSdk,username)

        await app.updateContext()

        //verify context
        log.debug("app.context: ",app.context)
        assert(app.context)
        console.timeEnd('start2paired');

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
        log.debug(tag,"responseSwap: ",responseSwap)
        console.timeEnd('start2build');
        //signTx

        let transaction:any = {
            type:'MetaMask',
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
        log.info(tag,"responseInvoke: ",responseInvoke)
        invocationId = responseInvoke.invocationId
        transaction.invocationId = invocationId

        //Mock Metamask
        let resultMock = await metamaskMock(transaction)
        log.info(tag,"resultMock: ",resultMock)

        /*
            //TODO this is what metamask actually returns
            {
                "hash": "0xa4fd92ae21345de0b218f8951b9229d504cd55ef50780a7e5e18a81ecfa22a74",
                "type": 2,
                "accessList": null,
                "blockHash": null,
                "blockNumber": null,
                "transactionIndex": null,
                "confirmations": 0,
                "from": "0xC3aFFff54122658b89C31183CeC4F15514F34624",
                "gasPrice": {
                    "type": "BigNumber",
                    "hex": "0x1b5320a25b"
                },
                "maxPriorityFeePerGas": {
                    "type": "BigNumber",
                    "hex": "0x1b5320a25b"
                },
                "maxFeePerGas": {
                    "type": "BigNumber",
                    "hex": "0x1b5320a25b"
                },
                "gasLimit": {
                    "type": "BigNumber",
                    "hex": "0x013880"
                },
                "to": "0xC145990E84155416144C532E31f89B840Ca8c2cE",
                "value": {
                    "type": "BigNumber",
                    "hex": "0x2386f26fc10000"
                },
                "nonce": 87,
                "data": "0x1fece7b4000000000000000000000000f56cba49337a624e94042e325ad6bc864436e3700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002386f26fc10000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000403d3a4243482e4243483a626974636f696e636173683a717a78703078633676736a3861706739796d346e346a6c3435707978746b70736875767239736d6a7033",
                "r": "0x1ccaf7e8e8ee44807686e209cb78972766387a2a59050d6ef7c4467b2bb6d6d0",
                "s": "0x1a74183927cd0b07ac247156cdfa3b7df9a073b2fa44f684364ac68a04a1afac",
                "v": 1,
                "creates": null,
                "chainId": 0,
                "serialized": "fobarfixme",
                "txid": "fobarfixme",
                "network": "ETH"
            }

         */

        let rawTx = resultMock.serialized
        let txid = resultMock.txid

        //simulate metamask broadcasting first
        //push etherscan
        //https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex=0xf904808000831cfde080&apikey=YourApiKeyToken
        if(!noBroadcast){
            let resp = await axios({
                method:'GET',
                url: 'https://api.etherscan.io/api?module=proxy&action=eth_sendRawTransaction&hex='+rawTx
            })
            // console.log(resp)
            log.test(tag,"resp pushTx: ",resp.data)
        }

        let invocationView1 = await app.getInvocation(invocationId)
        log.info(tag,"invocationView1: (VIEW) ",invocationView1)
        assert(invocationView1.state)
        // assert.equal(invocationView1.state,'broadcasted')

        //updateTx
        let updateBody = {
            network:ASSET,
            invocationId,
            invocation:invocationView1,
            unsignedTx:responseSwap,
            signedTx:resultMock
        }

        //update invocation remote
        let resultUpdate = await app.updateInvocation(updateBody)
        assert(resultUpdate)
        log.info(tag,"resultUpdate: ",resultUpdate)

        //broadcast transaction
        let broadcastResult = await app.broadcastTransaction(updateBody)
        log.info(tag,"broadcastResult: ",broadcastResult)

        //verify broadcasted
        let invocationView3 = await app.getInvocation(invocationId)
        log.info(tag,"invocationView3: (VIEW) ",invocationView3)
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
