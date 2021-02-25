
require('dotenv').config()
require('dotenv').config({path:"../../../../.env"});
require('dotenv').config({path:"../../../.env"});
let queue = require("@pioneer-platform/redis-queue")

let ASSET = "ETH"


// let work = {
//     coin: 'ETH',
//     queueId: 'j9ZbcfjFy6kqShnupHXLWi',
//     account: 'tesasdasdtaddress',
//     address: process.env['TEST_ETH_MASTER'],
//     inserted: 1594510142838
// }

let work = {
    coin: 'BTC',
    queueId: 'j9ZbcfjasdFy6kqShnupHXLWi',
    account: 'tesasdasdtaddress',
    xpub: process.env['TEST_BCH_XPUB'],
    inserted: 1594510142838
}

console.log("inserted:",work)


queue.createWork("pioneer:pubkey:queue:ingest",work)
    .then(function(resp){
        console.log("resp:",resp)
    })

