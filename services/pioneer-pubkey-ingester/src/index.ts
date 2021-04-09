/*
      update tx's by address worker

      Start

 */
require('dotenv').config()
require('dotenv').config({path:"../../../.env"})
require('dotenv').config({path:"../../../../.env"})
let packageInfo = require("../package.json")
const TAG = " | "+packageInfo.name+" | "
const log = require('@pioneer-platform/loggerdog')()
const {subscriber,publisher,redis,redisQueue} = require('@pioneer-platform/default-redis')

let queue = require("@pioneer-platform/redis-queue")
let connection  = require("@pioneer-platform/default-mongo")
let wait = require('wait-promise');
let sleep = wait.sleep;

const networks:any = {
    'ETH' : require('@pioneer-platform/eth-network'),
    'ATOM': require('@pioneer-platform/cosmos-network'),
    'BNB' : require('@pioneer-platform/bnb-network'),
    // 'EOS' : require('@pioneer-platform/eos-network'),
    'FIO' : require('@pioneer-platform/fio-network'),
    'ANY' : require('@pioneer-platform/utxo-network'),
}
networks.ANY.init('full')

let usersDB = connection.get('users')
let txsDB = connection.get('transactions')
let utxosDB = connection.get('utxo')

usersDB.createIndex({id: 1}, {unique: true})
txsDB.createIndex({txid: 1}, {unique: true})
utxosDB.createIndex({txid: 1}, {unique: true})

let UTXO_COINS = [
    'BTC',
    'BCH'
]

let do_work = async function(){
    let tag = TAG+" | do_work | "
    try{

        //TODO normalize queue names
        let allWork = await queue.count("pioneer:pubkey:queue:ingest")
        log.debug(tag,"allWork: ",allWork)

        let work = await queue.getWork("pioneer:pubkey:queue:ingest", 1)
        if(work){
            log.info("work: ",work)

            //
            let utxos = []

            //if xpub
            if(work.xpub){
                //get unspent
                let inputs = await networks.ANY.utxosByXpub(work.coin,work.xpub)

                for(let i = 0; i < inputs.length; i++){
                    let input = inputs[i]
                    log.info(tag,"input: ",input)

                    //get hex info
                    let rawInfo = await networks.ANY.getTransaction(work.coin,input.txid)
                    log.info(tag,"rawInfo: ",rawInfo)

                    input.hex = rawInfo.hex
                    input.coin = work.coin
                    input.accounts = [work.account]
                    input.addresses = [] //TODO get from raw?
                    utxos.push({insertOne:input})
                }

                //save to db
                if(utxos.length > 0){
                    let resultSaveDB = await utxosDB.bulkWrite(utxos)
                    console.log("resultSaveDB: ",resultSaveDB)
                }
            } else {
                //
                log.info(tag,"address ingestion")

                //if eth get info

            }

            //is already in mongo?
            //TODO effecient query if partial synced?

            //get tx history
            //let txHistory = await network

            //get current balances

            //update mongo

        }
    } catch(e) {
        log.error(tag,"e: ",e)
        //TODO dead letter queue?
        //TODO fix errors dont shh them (need cointainers)
        //log.debug(tag,"Error checking for blocks: ", e)
        //toss back into work queue? (at end)
        await sleep(10000)
    }
    //dont stop working even if error
    do_work()
}

//start working on install
log.info(TAG," worker started! ","")
do_work()
