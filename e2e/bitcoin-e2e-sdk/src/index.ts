/*
    E2E testing
        k8  "job" pattern

    load test seed

    verify empty

    request deposit from faucet

    watch till confirmed

    send back to faucet

    report



    SDK Arch pattern ***


        Start and configure app

        verify socket connection


    Use sdk to

        * check balances
        * check tx history
        * request faucet addresses
        * send x into faucet
        * request withdrawalf rom faucet
        * verify payment

 */

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require("dotenv").config({path:'../../../.env'})
const TAG  = " | e2e-test | "
const log = require("@pioneer-platform/loggerdog")()
let assert = require('assert')

const {
    startApp
} = require('./app')

let ASSET = 'BTC'
let MIN_BALANCE = process.env['MIN_BALANCE_BTC'] || 0.0002

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

        //start app and get wallet
        let wallet = await startApp()

        //assert balance local
        //log.info(tag,"wallet: ",wallet)
        log.info(tag,"wallet: ",wallet.WALLET_BALANCES)
        if(wallet.WALLET_BALANCES[ASSET] < MIN_BALANCE){
            log.info(tag," Test wallet low! amount: "+wallet.WALLET_BALANCES[ASSET]+" target: "+MIN_BALANCE+" Send moneies to "+ASSET+": "+await wallet.getMaster(ASSET))
            throw Error("101: Low funds!")
        }



        //process
        process.exit(0)
    } catch (e) {
        log.error(e)
        //process
        process.exit(666)
    }
}
test_service()
