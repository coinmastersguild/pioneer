/*

    Pioneer API
      A High Availability blockchain api

    Goals:
      v1 compatibility with watchtower with 0 change
      Multi-asset support

    V2 goals:
      Treat Xpubs as passwords
      encrypt long term data storage
      maintain hash table to detect and cache payments



    getTransactions:

    Data: example

    { success: true,
      pagination: { page: 1, total_objects: 88, total_pages: 9 },
      data:
        [ { txid:
          '',
          status: 'confirmed',
          type: 'send',
          amount: -78602,
          date: '2019-05-10T21:01:23Z',
          confirmations: 1055,
          network: 'BTC',
          xpub:
            '' },
         }
       ]
      }
     }

*/


const TAG = " | Pioneer | "
const queue = require('@pioneer-platform/redis-queue');
const uuid = require('short-uuid');


//const bcrypt = require('bcryptjs');
var numbro = require("numbro");

const log = require('@pioneer-platform/loggerdog')()
const {subscriber, publisher, redis, redisQueue} = require('@pioneer-platform/default-redis')
let connection  = require("@pioneer-platform/default-mongo")


let wait = require('wait-promise');
let sleep = wait.sleep;


let usersDB = connection.get('users')
let txsDB = connection.get('transactions')
//let txsRawDB = connection.get('transactions-raw')
let inputsDB = connection.get('unspent')

usersDB.createIndex({id: 1}, {unique: true})
txsDB.createIndex({txid: 1}, {unique: true})
//txsRawDB.createIndex({txhash: 1}, {unique: true})
inputsDB.createIndex({txid: 1}, {unique: true})


const BALANCE_ON_REGISTER = false

module.exports = {
    register: async function (account:string, xpubs:any) {
        return register_xpubs(account, xpubs);
    },
}

let register_xpubs = async function (account:string, pubkeys:any) {
    let tag = TAG + " | register_xpubs | "
    try {
        log.info(tag,"input: ",{account,pubkeys})

        //generate addresses
        let output:any = {}
        output.work = []

        for (let i = 0; i < pubkeys.length; i++) {
            let pubkeyInfo = pubkeys[i]
            log.info(tag,"pubkeyInfo: ",pubkeyInfo)

            if(!pubkeyInfo.symbol) pubkeyInfo.symbol = pubkeyInfo.coin

            //if eth use master
            if(pubkeyInfo.coin === 'ETH'){
                let address = pubkeyInfo.master
                let coin = pubkeyInfo.symbol
                redis.sadd(address+":accounts", account)
                redis.hset(address, "lastUpdate", new Date().getTime())
                redis.hset(address, "address", address)
                redis.hset(address, "account", account)
                redis.hset(address, "coin", pubkeyInfo.symbol)
                redis.hset(address, "network", coin)

                let work = {
                    coin,
                    queueId:uuid.generate(),
                    account,
                    address,
                    inserted: new Date().getTime()
                }
                log.info("adding work: ",work)
                output.work.push(work.queueId)
                log.info("queue: ",coin.toUpperCase()+":address:queue:ingest")
                let resultQue = await queue.createWork(coin.toUpperCase()+":address:queue:ingest",work)
                log.info(tag,"resultQue: ",resultQue)
            }

            if(pubkeyInfo.type === "xpub"){
                let xpub = pubkeyInfo.xpub

                //
                if(!pubkeyInfo.symbol) pubkeyInfo.symbol = pubkeyInfo.coin

                //save info
                redis.sadd(xpub+":accounts", account)
                redis.hset(xpub, "xpub", xpub)
                redis.hset(xpub, "account", account)
                redis.hset(xpub, "coin", pubkeyInfo.coin)
                redis.hset(xpub, "network", pubkeyInfo.symbol)
                redis.hset(xpub, "type", pubkeyInfo.script_type)

                //add to queue
                let work = {
                    queueId:uuid.generate(),
                    account,
                    xpub,
                    inserted: new Date().getTime()
                }
                queue.createWork(pubkeyInfo.symbol.toUpperCase()+":xpub:queue:ingest",work)

                //if zpub add zpub
                if(pubkeyInfo.zpub){
                    let work = {
                        queueId:uuid.generate(),
                        account,
                        zpub:pubkeyInfo.zpub,
                        inserted: new Date().getTime()
                    }
                    queue.createWork(pubkeyInfo.symbol.toUpperCase()+":zpub:queue:ingest",work)
                    output.work.push(work.queueId)
                }

                //Mutex on xpub register
                output.work.push(work.queueId)
            } else if(pubkeyInfo.type === "address"){
                let address = pubkeyInfo.pubkey
                let coin = pubkeyInfo.symbol
                redis.sadd(address+":accounts", account)
                redis.hset(address, "address", address)
                redis.hset(address, "account", account)
                redis.hset(address, "coin", pubkeyInfo.symbol)
                redis.hset(address, "network", coin)

                //add to work
                let work = {
                    coin,
                    queueId:uuid.generate(),
                    account,
                    address,
                    inserted: new Date().getTime()
                }
                log.info("adding work: ",work)
                output.work.push(work.queueId)
                queue.createWork(coin.toUpperCase()+":address:queue:ingest",work)
            } else {
                log.error("Unhandled type: ",pubkeyInfo.type)
            }
        }

        if(BALANCE_ON_REGISTER){
            output.results = []
            //verifies balances returned are final
            log.info(tag," BALANCE VERIFY ON")
            //let isDone
            let isDone = false
            while(!isDone){
                //block on
                //TODO await.all faster?
                for(let i = 0; i < output.work.length; i++ ){

                    //TODO does this block the entire server??? wat???
                    let resultSync = await redisQueue.blpop(output.work[i],60)
                    log.info(tag,"resultSync: ",resultSync)
                    resultSync = JSON.parse(resultSync[1])
                    resultSync.id = output.work[i]
                    //save value into redis

                    //save into output
                    output.results.push(resultSync)
                }
                isDone = true
            }
        }


        log.info(tag," return object: ",output)
        return output
    } catch (e) {
        console.error(tag, "e: ", e)
        throw e
    }
}
