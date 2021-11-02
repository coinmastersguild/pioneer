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

const test_service = async function () {
    let tag = TAG + " | test_service | "
    try {

        //generate new key
        // const queryKey = "sdk:4339eec1-343a-438f-823a-4f56d1f528c2";
        const queryKey = uuidv4();
        assert(queryKey)

        let config = {
            queryKey,
            //username,
            spec,
            wss
        }

        let app = new SDK.SDK(spec,config)
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

        let sdkRespMock = {"pubkeys":[{"path":"m/84'/0'/0'","pathMaster":"m/84'/0'/0'/0/0","source":"keepkey","type":"zpub","zpub":true,"pubkey":"zpub6qSSRL9wLd6LNee7qjDEuULWccP5Vbm5nuX4geBu8zMCQBWsF5Jo5UswLVxFzcbCMr2yQPG27ZhDs1cUGKVH1RmqkG1PFHkEXyHG7EV3ogY","note":"Bitcoin account Native Segwit (Bech32)","symbol":"BTC","blockchain":"bitcoin","network":"bitcoin","script_type":"p2wpkh","master":"bc1qkkr2uvry034tsj4p52za2pg42ug4pxg5qfxyfa","address":"bc1qkkr2uvry034tsj4p52za2pg42ug4pxg5qfxyfa"},{"path":"m/44'/60'/0'","pathMaster":"m/44'/60'/0'/0/0","source":"keepkey","note":" ETH primary (default)","symbol":"ETH","blockchain":"ethereum","network":"ethereum","script_type":"ethereum","type":"address","pubkey":"0x3f2329c9adfbccd9a84f52c906e936a42da18cb8","master":"0x3f2329c9adfbccd9a84f52c906e936a42da18cb8","address":"0x3f2329c9adfbccd9a84f52c906e936a42da18cb8"},{"path":"m/44'/931'/0'/0/0","pathMaster":"m/44'/931'/0'/0/0","source":"keepkey","note":" Default RUNE path ","symbol":"RUNE","blockchain":"thorchain","network":"thorchain","script_type":"thorchain","type":"address","pubkey":"thor1mu7gez4wpkddlsldfc8trn94zqwqumcgan4w7u","master":"thor1mu7gez4wpkddlsldfc8trn94zqwqumcgan4w7u","address":"thor1mu7gez4wpkddlsldfc8trn94zqwqumcgan4w7u"},{"path":"m/44'/118'/0'/0/0","pathMaster":"m/44'/118'/0'/0/0","source":"keepkey","note":" Default ATOM path ","symbol":"ATOM","blockchain":"cosmos","network":"cosmos","script_type":"bech32","type":"address","pubkey":"cosmos1tv04q8gawdfsp07qm0s2upugn4y2nh2pdcl576","master":"cosmos1tv04q8gawdfsp07qm0s2upugn4y2nh2pdcl576","address":"cosmos1tv04q8gawdfsp07qm0s2upugn4y2nh2pdcl576"},{"path":"m/44'/714'/0'/0/0","pathMaster":"m/44'/714'/0'/0/0","source":"keepkey","note":"Binance default path","symbol":"BNB","blockchain":"binance","network":"binance","script_type":"binance","type":"address","pubkey":"bnb1t47rrexsfglg2zjlz4ccvgstpr0zcc9pzy9fy3","master":"bnb1t47rrexsfglg2zjlz4ccvgstpr0zcc9pzy9fy3","address":"bnb1t47rrexsfglg2zjlz4ccvgstpr0zcc9pzy9fy3"},{"path":"m/44'/145'/0'","pathMaster":"m/44'/145'/0'/0/0","source":"keepkey","type":"xpub","xpub":true,"pubkey":"xpub6CAgnVoFsaZ3iMaW4jmUpvCvduYGEF1b2g5PQjBQ6oWWyqEpufNRMBN1b4MQaWubnGAnTBt1pEQSwAUaFxNz8B6Ct8fq5s6RYhshNMYK4uk","note":"Bitcoin Cash Default path","symbol":"BCH","blockchain":"bitcoincash","network":"bitcoincash","script_type":"p2pkh","master":"1Ci1rvsLpZqvaMLSq7LiFj6mfnV4p3833E","address":"1Ci1rvsLpZqvaMLSq7LiFj6mfnV4p3833E"},{"path":"m/44'/2'/0'","pathMaster":"m/44'/2'/0'/0/0","source":"keepkey","type":"xpub","xpub":true,"pubkey":"xpub6D6wXaReSuH2E34guCJTVF1XR8EW9NK5c1czup39syvBLddyCNqhGMre4SKNJFRstP2bWQxbyXarH8Pv7ZHWipUiyuZAgH66N8aEwBCF8B4","note":"Litecoin Default path","symbol":"LTC","blockchain":"litecoin","network":"litecoin","script_type":"p2pkh","master":"LYXTv5RdsPYKC4qGmb6x6SuKoFMxUdSjLQ","address":"LYXTv5RdsPYKC4qGmb6x6SuKoFMxUdSjLQ"},{"path":"m/44'/3'/0'","pathMaster":"m/44'/3'/0'/0/0","source":"keepkey","type":"xpub","xpub":true,"pubkey":"xpub6DB2ES6MHh21hCyudFAVi2A3epinboHb3hAcaU9eBgQGo8jy9r5b5JKNtv7dFSg2snVFuzkrkgaHESFmDU57Mf7feC2zowdibA58ANZ1F3p","note":"Dogecoin Default path","symbol":"DOGE","blockchain":"dogecoin","network":"dogecoin","script_type":"p2pkh","master":"DQTjL9vfXVbMfCGM49KWeYvvvNzRPaoiFp","address":"DQTjL9vfXVbMfCGM49KWeYvvvNzRPaoiFp"}],"wallet":{"WALLET_ID":"keepkey-pubkeys-343733331147363327003800","TYPE":"watch","CREATED":1635471894528,"VERSION":"0.1.3","BLOCKCHAINS: ":["bitcoin","ethereum","thorchain","bitcoincash","litecoin","binance","cosmos","dogecoin"],"PUBKEYS":[{"path":"m/84'/0'/0'","pathMaster":"m/84'/0'/0'/0/0","source":"keepkey","type":"zpub","zpub":true,"pubkey":"zpub6qSSRL9wLd6LNee7qjDEuULWccP5Vbm5nuX4geBu8zMCQBWsF5Jo5UswLVxFzcbCMr2yQPG27ZhDs1cUGKVH1RmqkG1PFHkEXyHG7EV3ogY","note":"Bitcoin account Native Segwit (Bech32)","symbol":"BTC","blockchain":"bitcoin","network":"bitcoin","script_type":"p2wpkh","master":"bc1qkkr2uvry034tsj4p52za2pg42ug4pxg5qfxyfa","address":"bc1qkkr2uvry034tsj4p52za2pg42ug4pxg5qfxyfa"},{"path":"m/44'/60'/0'","pathMaster":"m/44'/60'/0'/0/0","source":"keepkey","note":" ETH primary (default)","symbol":"ETH","blockchain":"ethereum","network":"ethereum","script_type":"ethereum","type":"address","pubkey":"0x3f2329c9adfbccd9a84f52c906e936a42da18cb8","master":"0x3f2329c9adfbccd9a84f52c906e936a42da18cb8","address":"0x3f2329c9adfbccd9a84f52c906e936a42da18cb8"},{"path":"m/44'/931'/0'/0/0","pathMaster":"m/44'/931'/0'/0/0","source":"keepkey","note":" Default RUNE path ","symbol":"RUNE","blockchain":"thorchain","network":"thorchain","script_type":"thorchain","type":"address","pubkey":"thor1mu7gez4wpkddlsldfc8trn94zqwqumcgan4w7u","master":"thor1mu7gez4wpkddlsldfc8trn94zqwqumcgan4w7u","address":"thor1mu7gez4wpkddlsldfc8trn94zqwqumcgan4w7u"},{"path":"m/44'/118'/0'/0/0","pathMaster":"m/44'/118'/0'/0/0","source":"keepkey","note":" Default ATOM path ","symbol":"ATOM","blockchain":"cosmos","network":"cosmos","script_type":"bech32","type":"address","pubkey":"cosmos1tv04q8gawdfsp07qm0s2upugn4y2nh2pdcl576","master":"cosmos1tv04q8gawdfsp07qm0s2upugn4y2nh2pdcl576","address":"cosmos1tv04q8gawdfsp07qm0s2upugn4y2nh2pdcl576"},{"path":"m/44'/714'/0'/0/0","pathMaster":"m/44'/714'/0'/0/0","source":"keepkey","note":"Binance default path","symbol":"BNB","blockchain":"binance","network":"binance","script_type":"binance","type":"address","pubkey":"bnb1t47rrexsfglg2zjlz4ccvgstpr0zcc9pzy9fy3","master":"bnb1t47rrexsfglg2zjlz4ccvgstpr0zcc9pzy9fy3","address":"bnb1t47rrexsfglg2zjlz4ccvgstpr0zcc9pzy9fy3"},{"path":"m/44'/145'/0'","pathMaster":"m/44'/145'/0'/0/0","source":"keepkey","type":"xpub","xpub":true,"pubkey":"xpub6CAgnVoFsaZ3iMaW4jmUpvCvduYGEF1b2g5PQjBQ6oWWyqEpufNRMBN1b4MQaWubnGAnTBt1pEQSwAUaFxNz8B6Ct8fq5s6RYhshNMYK4uk","note":"Bitcoin Cash Default path","symbol":"BCH","blockchain":"bitcoincash","network":"bitcoincash","script_type":"p2pkh","master":"1Ci1rvsLpZqvaMLSq7LiFj6mfnV4p3833E","address":"1Ci1rvsLpZqvaMLSq7LiFj6mfnV4p3833E"},{"path":"m/44'/2'/0'","pathMaster":"m/44'/2'/0'/0/0","source":"keepkey","type":"xpub","xpub":true,"pubkey":"xpub6D6wXaReSuH2E34guCJTVF1XR8EW9NK5c1czup39syvBLddyCNqhGMre4SKNJFRstP2bWQxbyXarH8Pv7ZHWipUiyuZAgH66N8aEwBCF8B4","note":"Litecoin Default path","symbol":"LTC","blockchain":"litecoin","network":"litecoin","script_type":"p2pkh","master":"LYXTv5RdsPYKC4qGmb6x6SuKoFMxUdSjLQ","address":"LYXTv5RdsPYKC4qGmb6x6SuKoFMxUdSjLQ"},{"path":"m/44'/3'/0'","pathMaster":"m/44'/3'/0'/0/0","source":"keepkey","type":"xpub","xpub":true,"pubkey":"xpub6DB2ES6MHh21hCyudFAVi2A3epinboHb3hAcaU9eBgQGo8jy9r5b5JKNtv7dFSg2snVFuzkrkgaHESFmDU57Mf7feC2zowdibA58ANZ1F3p","note":"Dogecoin Default path","symbol":"DOGE","blockchain":"dogecoin","network":"dogecoin","script_type":"p2pkh","master":"DQTjL9vfXVbMfCGM49KWeYvvvNzRPaoiFp","address":"DQTjL9vfXVbMfCGM49KWeYvvvNzRPaoiFp"}],"WALLET_PUBLIC":{"BTC":{"path":"m/84'/0'/0'","pathMaster":"m/84'/0'/0'/0/0","source":"keepkey","type":"zpub","zpub":true,"pubkey":"zpub6qSSRL9wLd6LNee7qjDEuULWccP5Vbm5nuX4geBu8zMCQBWsF5Jo5UswLVxFzcbCMr2yQPG27ZhDs1cUGKVH1RmqkG1PFHkEXyHG7EV3ogY","note":"Bitcoin account Native Segwit (Bech32)","symbol":"BTC","blockchain":"bitcoin","network":"bitcoin","script_type":"p2wpkh","master":"bc1qkkr2uvry034tsj4p52za2pg42ug4pxg5qfxyfa","address":"bc1qkkr2uvry034tsj4p52za2pg42ug4pxg5qfxyfa"},"ETH":{"path":"m/44'/60'/0'","pathMaster":"m/44'/60'/0'/0/0","source":"keepkey","note":" ETH primary (default)","symbol":"ETH","blockchain":"ethereum","network":"ethereum","script_type":"ethereum","type":"address","pubkey":"0x3f2329c9adfbccd9a84f52c906e936a42da18cb8","master":"0x3f2329c9adfbccd9a84f52c906e936a42da18cb8","address":"0x3f2329c9adfbccd9a84f52c906e936a42da18cb8"},"RUNE":{"path":"m/44'/931'/0'/0/0","pathMaster":"m/44'/931'/0'/0/0","source":"keepkey","note":" Default RUNE path ","symbol":"RUNE","blockchain":"thorchain","network":"thorchain","script_type":"thorchain","type":"address","pubkey":"thor1mu7gez4wpkddlsldfc8trn94zqwqumcgan4w7u","master":"thor1mu7gez4wpkddlsldfc8trn94zqwqumcgan4w7u","address":"thor1mu7gez4wpkddlsldfc8trn94zqwqumcgan4w7u"},"ATOM":{"path":"m/44'/118'/0'/0/0","pathMaster":"m/44'/118'/0'/0/0","source":"keepkey","note":" Default ATOM path ","symbol":"ATOM","blockchain":"cosmos","network":"cosmos","script_type":"bech32","type":"address","pubkey":"cosmos1tv04q8gawdfsp07qm0s2upugn4y2nh2pdcl576","master":"cosmos1tv04q8gawdfsp07qm0s2upugn4y2nh2pdcl576","address":"cosmos1tv04q8gawdfsp07qm0s2upugn4y2nh2pdcl576"},"BNB":{"path":"m/44'/714'/0'/0/0","pathMaster":"m/44'/714'/0'/0/0","source":"keepkey","note":"Binance default path","symbol":"BNB","blockchain":"binance","network":"binance","script_type":"binance","type":"address","pubkey":"bnb1t47rrexsfglg2zjlz4ccvgstpr0zcc9pzy9fy3","master":"bnb1t47rrexsfglg2zjlz4ccvgstpr0zcc9pzy9fy3","address":"bnb1t47rrexsfglg2zjlz4ccvgstpr0zcc9pzy9fy3"},"BCH":{"path":"m/44'/145'/0'","pathMaster":"m/44'/145'/0'/0/0","source":"keepkey","type":"xpub","xpub":true,"pubkey":"xpub6CAgnVoFsaZ3iMaW4jmUpvCvduYGEF1b2g5PQjBQ6oWWyqEpufNRMBN1b4MQaWubnGAnTBt1pEQSwAUaFxNz8B6Ct8fq5s6RYhshNMYK4uk","note":"Bitcoin Cash Default path","symbol":"BCH","blockchain":"bitcoincash","network":"bitcoincash","script_type":"p2pkh","master":"1Ci1rvsLpZqvaMLSq7LiFj6mfnV4p3833E","address":"1Ci1rvsLpZqvaMLSq7LiFj6mfnV4p3833E"},"LTC":{"path":"m/44'/2'/0'","pathMaster":"m/44'/2'/0'/0/0","source":"keepkey","type":"xpub","xpub":true,"pubkey":"xpub6D6wXaReSuH2E34guCJTVF1XR8EW9NK5c1czup39syvBLddyCNqhGMre4SKNJFRstP2bWQxbyXarH8Pv7ZHWipUiyuZAgH66N8aEwBCF8B4","note":"Litecoin Default path","symbol":"LTC","blockchain":"litecoin","network":"litecoin","script_type":"p2pkh","master":"LYXTv5RdsPYKC4qGmb6x6SuKoFMxUdSjLQ","address":"LYXTv5RdsPYKC4qGmb6x6SuKoFMxUdSjLQ"},"DOGE":{"path":"m/44'/3'/0'","pathMaster":"m/44'/3'/0'/0/0","source":"keepkey","type":"xpub","xpub":true,"pubkey":"xpub6DB2ES6MHh21hCyudFAVi2A3epinboHb3hAcaU9eBgQGo8jy9r5b5JKNtv7dFSg2snVFuzkrkgaHESFmDU57Mf7feC2zowdibA58ANZ1F3p","note":"Dogecoin Default path","symbol":"DOGE","blockchain":"dogecoin","network":"dogecoin","script_type":"p2pkh","master":"DQTjL9vfXVbMfCGM49KWeYvvvNzRPaoiFp","address":"DQTjL9vfXVbMfCGM49KWeYvvvNzRPaoiFp"}},"PATHS":[{"note":"Bitcoin account Native Segwit (Bech32)","blockchain":"bitcoin","symbol":"BTC","network":"BTC","script_type":"p2wpkh","available_scripts_types":["p2pkh","p2sh","p2wpkh","p2sh-p2wpkh"],"type":"zpub","addressNList":[2147483732,2147483648,2147483648],"addressNListMaster":[2147483732,2147483648,2147483648,0,0],"curve":"secp256k1","showDisplay":true,"pubkey":"zpub6qSSRL9wLd6LNee7qjDEuULWccP5Vbm5nuX4geBu8zMCQBWsF5Jo5UswLVxFzcbCMr2yQPG27ZhDs1cUGKVH1RmqkG1PFHkEXyHG7EV3ogY"},{"note":" ETH primary (default)","symbol":"ETH","network":"ETH","script_type":"ethereum","available_scripts_types":["ethereum"],"type":"address","addressNList":[2147483692,2147483708,2147483648],"addressNListMaster":[2147483692,2147483708,2147483648,0,0],"curve":"secp256k1","showDisplay":true,"blockchain":"ethereum","pubkey":"xpub6D54vV8eUYHMVBZCnz4SLjuiQngXURVCGKKGoJrWUDRegdMByLTJKfRs64q3UKiQCsSHJPtCQehTvERczdghS7gb8oedWSyNDtBU1zYDJtb"},{"note":" Default RUNE path ","type":"address","addressNList":[2147483692,2147484579,2147483648,0,0],"addressNListMaster":[2147483692,2147484579,2147483648,0,0],"curve":"secp256k1","script_type":"thorchain","showDisplay":true,"blockchain":"thorchain","symbol":"RUNE","network":"RUNE","pubkey":"xpub6FkHm9bKQbvo1T28h8haU9iXBojqejUsS5JEvdmaDnbyfYN6jLd9M8VrhMS8ibEHcpTefHu9yxC7rfffLeWPS4jDqT1Vq5r2k3D9ySwm4uL"},{"note":" Default ATOM path ","type":"address","script_type":"bech32","available_scripts_types":["bech32"],"addressNList":[2147483692,2147483766,2147483648,0,0],"addressNListMaster":[2147483692,2147483766,2147483648,0,0],"curve":"secp256k1","showDisplay":true,"blockchain":"cosmos","symbol":"ATOM","network":"ATOM","pubkey":"xpub6GwgnAd4WBhEHue6mbEpii3T3muSUcHetMqpqdyTQNJJyLAD1m26N2cXTzcBVuzFQV7jJKhBCyCwy2SP1tKHJMJYPQV3x4zb5pRA9pudABE"},{"note":"Binance default path","type":"address","script_type":"binance","available_scripts_types":["binance"],"addressNList":[2147483692,2147484362,2147483648,0,0],"addressNListMaster":[2147483692,2147484362,2147483648,0,0],"curve":"secp256k1","showDisplay":true,"blockchain":"binance","symbol":"BNB","network":"BNB","pubkey":"xpub6ForprT1Bew4ERZHMuhTzN8rze7m1QWdG1egKKXdtneFneLJhMx2Y4FZwpfy749Wo5BH8K1cdxbM1Bd6sS53NjCUuhpjQBHW1pmuZXiQ1Kt"},{"note":"Bitcoin Cash Default path","type":"xpub","script_type":"p2pkh","available_scripts_types":["p2pkh"],"addressNList":[2147483692,2147483793,2147483648],"addressNListMaster":[2147483692,2147483793,2147483648,0,0],"curve":"secp256k1","showDisplay":true,"blockchain":"bitcoincash","symbol":"BCH","network":"BCH","pubkey":"xpub6CAgnVoFsaZ3iMaW4jmUpvCvduYGEF1b2g5PQjBQ6oWWyqEpufNRMBN1b4MQaWubnGAnTBt1pEQSwAUaFxNz8B6Ct8fq5s6RYhshNMYK4uk"},{"note":"Litecoin Default path","type":"xpub","script_type":"p2pkh","available_scripts_types":["p2pkh"],"addressNList":[2147483692,2147483650,2147483648],"addressNListMaster":[2147483692,2147483650,2147483648,0,0],"curve":"secp256k1","showDisplay":true,"blockchain":"litecoin","symbol":"LTC","network":"LTC","pubkey":"xpub6D6wXaReSuH2E34guCJTVF1XR8EW9NK5c1czup39syvBLddyCNqhGMre4SKNJFRstP2bWQxbyXarH8Pv7ZHWipUiyuZAgH66N8aEwBCF8B4"},{"note":"Dogecoin Default path","type":"xpub","script_type":"p2pkh","available_scripts_types":["p2pkh"],"addressNList":[2147483692,2147483651,2147483648],"addressNListMaster":[2147483692,2147483651,2147483648,0,0],"curve":"secp256k1","showDisplay":true,"blockchain":"dogecoin","symbol":"DOGE","network":"DOGE","pubkey":"xpub6DB2ES6MHh21hCyudFAVi2A3epinboHb3hAcaU9eBgQGo8jy9r5b5JKNtv7dFSg2snVFuzkrkgaHESFmDU57Mf7feC2zowdibA58ANZ1F3p"}]}}

        //pair metamask
        let pairWalletOnboard:any = {
            name:'keepkey',
            format:'citadel',
            wallet:sdkRespMock.wallet,
            pubkeys:sdkRespMock.pubkeys,
        }
        log.debug(tag,"pairWalletOnboard: ",pairWalletOnboard)

        //pair wallet
        let resultRegister = await app.pairWallet(pairWalletOnboard)
        log.debug(tag,"resultRegister: ",resultRegister)

        //sdk info
        log.debug("app pubkeys: ",app.pubkeys)
        log.debug("app balances: ",app.balances)
        log.debug("app balances: ",JSON.stringify(app.balances))
        log.debug("app context: ",app.context)
        assert(app.pubkeys)
        assert(app.balances)
        // assert(app.balances.length > 0)
        assert(app.context)
        log.debug("app balances: ",app.balances)
        if(app.balances.length === 0) throw Error("Invalid balances! empty!")

        //check balances
        //verify icons
        for(let i = 0; i < app.balances.length; i++){
            let balance = app.balances[i]
            log.debug("balance: ",balance)
            if(balance.symbol === 'undefined') throw Error('invalid pubkey! undefined!')
            //
            if(!balance.image){
                log.error("INvalid image!: ",balance)
            }
            if(!balance.balance){
                log.error("Invalid balance!: ",balance)
            }
            assert(balance.image)
            assert(balance.pubkey)
            assert(balance.balance)
            assert(balance.path)
            assert(balance.symbol)

        }
        //verify pairing has metamask wallet

        //switch context


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
