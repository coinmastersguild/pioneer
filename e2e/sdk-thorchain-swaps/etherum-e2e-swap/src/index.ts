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
    buildTransaction,
    approveTransaction,
    broadcastTransaction
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

let noBroadcast = false

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
                    log.error(tag,"unhandled event: ",event)
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
        console.timeEnd('start2pair');

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
            "amount":{
                // "type":"BASE",
                // "decimal":18,
                amount: function(){
                    return BigNumber.BigNumber.from(baseAmountToNative("eth",TEST_AMOUNT))
                }
            },
        }
        if(noBroadcast) swap.noBroadcast = true
        log.debug(tag,"swap: ",swap)

        //build swap
        let responseSwap = await app.buildSwap(swap,options,ASSET)
        log.debug(tag,"responseSwap: ",responseSwap)
        console.timeEnd('start2build');
        //signTx

        //if create new
        invocationId = responseSwap.invocationId

        //do not continue invocation
        assert(invocationId)

        let transaction = {
            invocationId,
            context:app.context
        }

        //get invocation
        log.debug(tag,"transaction: ",transaction)
        log.notice(tag,"invocationId: ",invocationId)


        //build
        let unsignedTx = await buildTransaction(transaction)
        log.debug(tag,"unsignedTx: ",unsignedTx)
        assert(unsignedTx)

        //get invocation
        let invocationView1 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView1: (VIEW) ",invocationView1)
        assert(invocationView1)
        assert(invocationView1.state)
        assert.equal(invocationView1.state,'builtTx')

        //sign transaction
        let signedTx = await approveTransaction(transaction)
        log.debug(tag,"signedTx: ",signedTx)
        assert(signedTx)
        assert(signedTx.txid)

        // //get invocation
        let invocationView2 = await app.getInvocation(invocationId)
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)
        assert(invocationView2.state)
        assert.equal(invocationView2.state,'signedTx')
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        let broadcastResult = await broadcastTransaction(transaction)
        log.debug(tag,"broadcastResult: ",broadcastResult)

        //verify broadcasted
        let invocationView3 = await app.getInvocation(invocationId)
        log.info(tag,"invocationView3: (VIEW) ",invocationView3)
        assert(invocationView3.state)
        assert.equal(invocationView3.state,'broadcasted')

        //get invocation info EToC
        console.timeEnd('start2broadcast');
        let isConfirmed = false
        //wait for confirmation
        console.time('timeToConfirmed')
        if(!noBroadcast){
            log.test(tag,"Broadcasting!")
            //TODO fixme force state to broadcast
            // assert(invocationView3.state)
            // assert.equal(invocationView3.state,'broadcasted')

            // let invocationView3 = await app.getInvocation(invocationId)
            // log.debug(tag,"invocationView3: (VIEW) ",invocationView3)
            // assert(invocationView3)
            // assert(invocationView3.state)
            // assert.equal(invocationView3.state,'broadcasted')

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

            let isFullfilled = false
            let fullfillmentTxid = false
            let currentStatus
            let statusCode = 0

            while(!isConfirmed && !isFullfilled){
                //get invocationInfo
                await sleep(6000)
                let invocationInfo = await app.getInvocation(invocationId)
                log.test(tag,"invocationInfo: ",invocationInfo.status)


                if(invocationInfo && invocationInfo.isConfirmed){
                    log.test(tag,"Confirmed!")
                    statusCode = 3
                    isConfirmed = true
                    console.timeEnd('timeToConfirmed')
                    console.time('confirm2fullfillment')
                } else if(invocationInfo && invocationInfo.isConfirmed && invocationInfo.isFullfilled) {
                    log.test(tag,"is fullfilled!")
                    fullfillmentTxid = invocationInfo.fullfillmentTxid
                    isFullfilled = true
                    console.timeEnd('confirm2fullfillment')
                    //get tx gas price
                }
            }

            // let txid
            //wait till confirmed in block
            // while(!isConfirmed){
            //     //get invocationInfo
            //     let invocationInfo = await app.getInvocation(invocationId)
            //     log.debug(tag,"invocationInfo: ",invocationInfo)
            //
            //     txid = invocationInfo.signedTx.txid
            //     assert(txid)
            //     if(!currentStatus) currentStatus = 'transaction built!'
            //     if(statusCode <= 0) statusCode = 1
            //
            //     //lookup txid
            //     let response = await app.getTransactionData(txid,ASSET)
            //     log.debug(tag,"response: ",response)
            //
            //     if(response && response.txInfo && response.txInfo.blockNumber){
            //         log.debug(tag,"Confirmed!")
            //         statusCode = 3
            //         isConfirmed = true
            //     } else {
            //         log.debug(tag,"Not confirmed!")
            //         //get gas price recomended
            //
            //         //get tx gas price
            //         await sleep(6000)
            //     }
            // }
            //
            // //verify fullfilled manually
            //
            // //wait till swap is fullfilled
            // while(!isFullfilled){
            //     //get midgard info
            //     let txInfoMidgard = await midgard.getTransaction(txid)
            //     log.debug(tag,"txInfoMidgard: ",txInfoMidgard.actions)
            //     log.debug(tag,"txInfoMidgard: ",txInfoMidgard.actions[0])
            //     log.debug(tag,"txInfoMidgard: ",JSON.stringify(txInfoMidgard))
            //
            //     //TODO handle multiple actions?
            //     if(txInfoMidgard && txInfoMidgard.actions && txInfoMidgard.actions[0]){
            //         let depositInfo = txInfoMidgard.actions[0].in
            //         log.debug(tag,"deposit: ",depositInfo)
            //
            //         let fullfillmentInfo = txInfoMidgard.actions[0]
            //         log.debug(tag,"fullfillmentInfo: ",JSON.stringify(fullfillmentInfo))
            //
            //         if(fullfillmentInfo.status === 'success'){
            //             log.debug(tag,"fullfillmentInfo: ",fullfillmentInfo)
            //             log.debug(tag,"fullfillmentInfo: ",fullfillmentInfo.out[0].txID)
            //
            //             statusCode = 4
            //             isFullfilled = true
            //             fullfillmentTxid = fullfillmentInfo.out[0].txID
            //
            //             //TODO get transaction info output
            //
            //             //verify address
            //             //verify amount
            //             //verify confirmed
            //             //check outgoing fee?
            //
            //         } else {
            //             await sleep(6000)
            //         }
            //     } else {
            //         await sleep(6000)
            //     }
            //
            //
            // }
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
