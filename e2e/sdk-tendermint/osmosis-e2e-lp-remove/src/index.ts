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
const log = require("@pioneer-platform/loggerdog")()
let BigNumber = require('@ethersproject/bignumber')
let assert = require('assert')
import {v4 as uuidv4} from 'uuid';
let SDK = require('@pioneer-platform/pioneer-sdk')
let wait = require('wait-promise');
let sleep = wait.sleep;
let midgard = require("@pioneer-platform/midgard-client")
// let coincap = require("@pioneer-platform/coincap")

import {
    Transfer,
    Delegate,
    JoinPool
} from "@pioneer-platform/pioneer-types";

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

let BLOCKCHAIN = 'osmosis'
let ASSET = 'OSMO'
let MIN_BALANCE = process.env['MIN_BALANCE_OSMO'] || "0.04"
let TEST_AMOUNT = process.env['TEST_AMOUNT'] || "0.001"
let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let NO_BROADCAST = process.env['E2E_BROADCAST'] || true
let FAUCET_OSMO_ADDRESS = process.env['FAUCET_OSMO_ADDRESS'] || 'osmo1ayn76qwdd5l2d66nu64cs0f60ga7px8zmvng6k'

let noBroadcast = false

console.log("spec: ",spec)
console.log("wss: ",wss)

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

        //start app and get wallet
        let wallets = await startApp()
        log.debug(tag,"wallets: ",wallets)
        let username = wallets.username
        assert(username)

        let appContext = getContext()
        assert(appContext)
        log.debug(tag,"appContext: ",appContext)

        //get wallets
        let appWallets = getWallets()
        let contextAlpha = appWallets[0]
        log.debug(tag,"wallets.wallets[contextAlpha].WALLET_BALANCES: ",wallets.wallets[contextAlpha].WALLET_BALANCES)

        let balance = wallets.wallets[contextAlpha].WALLET_BALANCES[ASSET]
        log.debug(tag,"balance: ",balance)
        assert(balance)

        let masterAlpha = wallets.wallets[contextAlpha].getMaster(ASSET)
        //assert balance local
        //log.debug(tag,"wallet: ",wallet)
        if(balance < MIN_BALANCE){
            log.error(tag," Test wallet low! amount: "+balance+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+masterAlpha)
            throw Error("101: Low funds!")
        } else {
            log.debug(tag," Attempting e2e test "+ASSET+" balance: ",balance)
        }
        log.debug(tag,"CHECKPOINT 1 balance")

        //generate new key
        const queryKey = uuidv4();
        assert(queryKey)

        let config = {
            queryKey,
            spec,
            wss
        }
        log.debug(tag,"config: ",config)
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

        let seedChains = ['ethereum','thorchain','bitcoin','osmosis']
        await app.init(seedChains)

        //pair sdk
        let code = await app.createPairingCode()
        code = code.code
        log.debug("code: ",code)
        assert(code)


        let pairSuccess = await sendPairingCode(code)
        log.debug("pairSuccess: ",pairSuccess)
        assert(pairSuccess)

        //dont release till pair event
        while(!eventPairReceived){
            await sleep(300)
            //TODO timeout & fail?
        }
        log.debug(tag,"CHECKPOINT 2 pairing")

        //assert sdk user
        //get user
        let user = await app.getUserParams()
        log.debug("user: ",user)

        log.debug("user: ",user.context)
        assert(user.context)
        //assert user clients
        if(!user.clients[BLOCKCHAIN]){
            log.error(tag,"Blockchain missing from sdk client! BLOCKCHAIN: ",BLOCKCHAIN)
        }
        assert(user.clients[BLOCKCHAIN])

        //intergration test asgard-exchange
        let blockchains = Object.keys(user.clients)
        log.debug("blockchains: ",blockchains)

        let client = user.clients[BLOCKCHAIN]
        log.debug(tag,"CHECKPOINT 3 sdk client")

        //get master
        let masterAddress = await client.getAddress()
        log.debug(tag,"masterAddress: ",masterAddress)
        assert(masterAddress)
        log.debug(tag,"CHECKPOINT 4 master address")

        /*
            3 ways to express balance
                Sdk (x-chain compatible object type)
                native (satoshi/wei)
                base (normal 0.001 ETH)
         */

        let balanceSdk = await client.getBalance()
        log.debug(" balanceSdk: ",balanceSdk)
        assert(balanceSdk[0])
        assert(balanceSdk[0].amount)
        assert(balanceSdk[0].amount.amount())
        assert(balanceSdk[0].amount.amount().toString())

        let balanceNative = balanceSdk[0].amount.amount().toString()
        log.debug(tag,"balanceNative: ",balanceNative)
        assert(balanceNative)

        let balanceBase = await nativeToBaseAmount(ASSET,balanceSdk[0].amount.amount().toString())
        log.debug(tag,"balanceBase: ",balanceBase)
        assert(balanceBase)

        //value USD
        //TODO not in coincap yet!
        // let valueBalanceUsd = await coincap.getValue(ASSET,balanceBase)
        // log.debug(tag,"valueBalanceUsd: ",valueBalanceUsd)
        // assert(valueBalanceUsd)

        if(balanceBase < TEST_AMOUNT){
            throw Error(" YOUR ARE BROKE! send more test funds into test seed! address: ")
        }

        //swap tokens
        let POOL_TOKEN_OSMO = "OSMO"
        let POOL_TOKEN_TRADE = "ATOM"

        //get pool
        let poolInfo = await user.clients[BLOCKCHAIN].getPool(POOL_TOKEN_TRADE)
        //log.debug(tag,"poolInfo: ",poolInfo)
        assert(poolInfo)

        //TODO dont filter here
        log.debug(tag,"poolInfo: ",poolInfo.pools[0])

        //get route
        //let poolId = poolInfo.pools[0].id
        //IBC atoms
        let tokenOutDenom = poolInfo.pools[0].poolAssets[0].token.denom
        //log.debug(tag,"poolId: ",poolId)
        log.debug(tag,"tokenOutDenom: ",tokenOutDenom)

        //TODO get rates

        //TODO calculate amounts

        //select first

        //get ibc channels
        let poolId = '1'

        let shareOutAmount = "700930022109918661"
        let options:any = {
            verbose: true,
            txidOnResp: false, // txidOnResp is the output format
        }

        let inAsset = {
            'denom':'uosmo',
            'amount':'66134'
        }

        let outAsset = {
            'denom':'ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2',
            'amount':'10248'
        }

        /*
             Example

         "msg":[
            {
               "type":"osmosis/gamm/join-pool",
               "value":{
                  "sender":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn",
                  "poolId":"1",
                  "shareOutAmount":"9702198039983527548",
                  "tokenInMaxs":[
                     {
                        "denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2",
                        "amount":"135876"
                     },
                     {
                        "denom":"uosmo",
                        "amount":"953288"
                     }
                  ]
               }
            }
         ],

         */

        let delegate:JoinPool = {
            context:user.context,
            asset: ASSET,
            network: ASSET,
            memo: '',
            poolId,
            shareOutAmount,
            tokenInMaxs:[
                outAsset,
                inAsset
            ],
            fee:{
                priority:5, //1-5 5 = highest
            },
            noBroadcast
        }
        log.debug(tag,"delegate: ",delegate)

        let responseTransfer = await user.clients[BLOCKCHAIN].joinPool(delegate,options)
        assert(responseTransfer)
        log.debug(tag,"responseTransfer: ",responseTransfer)
        let invocationId = responseTransfer
        //do not continue without invocationId
        assert(invocationId)

        //wait until app get's invocation event
        //TODO
        // let invocationReceived = false
        // while(!invocationReceived){
        //     await sleep(1000)
        //     let invocations = await getInvocations()
        //     log.debug(tag,"invocations: ",invocations)
        //     let invocationEventValue = invocations.filter((invocation: { invocationId: any; }) => invocation.invocationId === invocationId)[0]
        //     log.debug(tag,"invocationEventValue: ",invocationEventValue)
        //     if(invocationEventValue){
        //         assert(invocationEventValue.invocationId)
        //         invocationReceived = true
        //     }
        // }

        let transaction = {
            invocationId,
            context:user.context
        }

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

        //todo assert state

        //sign transaction
        let signedTx = await approveTransaction(transaction)
        log.debug(tag,"signedTx: ",signedTx)
        assert(signedTx)
        // assert(signedTx.txid)

        //get invocation
        let invocationView2 = await app.getInvocation(invocationId)
        assert(invocationView2)
        assert(invocationView2.state)
        assert.equal(invocationView2.state,'signedTx')
        log.debug(tag,"invocationView2: (VIEW) ",invocationView2)

        //broadcast transaction
        let broadcastResult = await broadcastTransaction(transaction)
        log.debug(tag,"broadcastResult: ",broadcastResult)

        let invocationView3 = await app.getInvocation(invocationId)
        assert(invocationView3)
        assert(invocationView3.state)
        assert.equal(invocationView3.state,'broadcasted')
        log.debug(tag,"invocationView3: (VIEW) ",invocationView3)

        //get invocation info EToC
        let isConfirmed = false
        //wait for confirmation

        if(!noBroadcast && false){
            //TODO unnerf
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
            let currentStatus
            let statusCode = 0
            let txid

            //wait till confirmed in block
            while(!isConfirmed){
                //get invocationInfo
                let invocationInfo = await app.getInvocation(invocationId)
                log.debug(tag,"invocationInfo: ",invocationInfo)

                txid = invocationInfo.signedTx.txid
                assert(txid)
                if(!currentStatus) currentStatus = 'transaction built!'
                if(statusCode <= 0) statusCode = 1

                //lookup txid
                let txInfo = await client.getTransactionData(txid)
                log.debug(tag,"txInfo: ",txInfo)

                if(txInfo && txInfo.blockNumber){
                    log.debug(tag,"Confirmed!")
                    statusCode = 3
                } else {
                    log.debug(tag,"Not confirmed!")
                    //get gas price recomended

                    //get tx gas price
                }

                await sleep(6000)
            }


            let isFullfilled = false
            //wait till swap is fullfilled
            while(!isFullfilled){
                //get midgard info
                let txInfoMidgard = midgard.getTransaction(txid)
                log.debug(tag,"txInfoMidgard: ",txInfoMidgard)

                //
                if(txInfoMidgard && txInfoMidgard.actions && txInfoMidgard.actions[0]){
                    let depositInfo = txInfoMidgard.actions[0].in
                    log.debug(tag,"deposit: ",depositInfo)

                    let fullfillmentInfo = txInfoMidgard.actions[0].out
                    log.debug(tag,"fullfillmentInfo: ",fullfillmentInfo)

                    if(fullfillmentInfo.status === 'success'){
                        statusCode = 4
                        isFullfilled = true
                    }
                }

                await sleep(6000)
            }
        }

        let result = await app.stopSocket()
        log.debug(tag,"result: ",result)

        log.debug("****** TEST PASS 2******")
        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
