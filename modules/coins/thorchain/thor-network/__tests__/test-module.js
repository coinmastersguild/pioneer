/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// let tx = '{"tx":{"fee":{"amount":[{"amount":"2000000","denom":"rune"}],"gas":"250000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"thor1vvehrsz8rwzaws4j94ak3a4zj7myjerx9xn9yp","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"3aYnRyakFZBMOQRM109TYFWPVbpCiDAVOHWbNTTuxS1OXo2MoI2+JNDgjRCzEIxA3wUEiM7Fj+K+HGX9m4JI4w==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AiuXsiJnUQl/00hULvyEdIXx2Q64TnY+ssyfVU+PCkcc"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"OM+kv4c5c28HTTrOTlAPBkPBc+y6cTrCcZCTYJLu0pAn3JCIiDZ2kzQlKE5y4yy5KXsYFcTxyoDGjyCwxJViiA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AiuXsiJnUQl/00hULvyEdIXx2Q64TnY+ssyfVU+PCkcc"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"1100000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3"}}],"sequence":"44","account_number":"334","signatures":[{"signature":"GjZ0eY8O7yB+IOgVlRRXP7LsUjaBTbY/oy7SAsVOJvRmEnHqWm8RXLRad7vDr1ZFCY7Y6FhxD1aySdfnRe9Ocw==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A9BnfoZvhOO8Y3RpeUFKi6bvTfObGZ0Altybt0wXABUC"},"sequence":"44"}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"50000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3"}}],"sequence":"47","account_number":"334","signatures":[{"signature":"LJD5/1pVVUHopPNpURTEyRnQ3c5dVRnXJKUJrKTuoahlIUkReh1Vt+jjmz7YhJeGcIJDHQXGH4Ki3rKXa0ciCQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A9BnfoZvhOO8Y3RpeUFKi6bvTfObGZ0Altybt0wXABUC"},"sequence":"47"}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// let tx = 'CsMBCoYBChEvdHlwZXMuTXNnRGVwb3NpdBJxCh8KEgoEVEhPUhIEUlVORRoEUlVORRIJMzAwMDAwMDAwEjg9Ok1BWUEuQ0FDQU86bWF5YTFnOWVsN2x6andoOXl1bjJjNGpqemh5MDlqOTh2a2hmeGZxa2w1axoUQXP/fFJ1yk5NWKykK5HlkU7LXSYSOD06TUFZQS5DQUNBTzptYXlhMWc5ZWw3bHpqd2g5eXVuMmM0amp6aHkwOWo5OHZraGZ4ZnFrbDVrEmUKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQPi6qEmwsWHubRdgm73ZuaHlvS/mmiw5Uh5vo8KlAwZLxIECgIIfxgUEhEKCQoEcnVuZRIBMBCAyrXuARpA/Gnx8I19lMhtyU+8C8rKH1hljXU3ohf9D6PCpfQSsi9KuEpE4b5bI10NsiUPvWF+ens6b58I9HKQy12Br7gqsQ=='
let tx = 'CoQBCoEBChEvdHlwZXMuTXNnRGVwb3NpdBJsCh0KEgoEVEhPUhIEUlVORRoEUlVORRIHMTAwMDAwMBI1PTpCQ0gvQkNIOnRob3IxZzllbDdsemp3aDl5dW4yYzRqanpoeTA5ajk4dmtoZnhmaGduengaFPwjHpEK1bf1u9KRKUDFSLyn15RBEmMKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQMVGXE7i0K9w2cRLTMTLPFM7fkorFdx1ES6RZuUlxF7oxIECgIIARgPEg8KCQoEcnVuZRIBMBCwrhUaQE+e08cBT48Mw3cDMO9yCGLAeqdrKVH2MgeOSH1NAL/QViXdPYwIBYd+YcgaddvU1EEGNKcEZOFT92w6mftOakw='
network.broadcast(tx)
    .then(function(resp){
        console.log("resp: ",resp)
    })

// let txid = "000900230D0BF1891C64C1087E74D0FF1A236E0F73F21C1E0A84DD9143F4F242"
// let txid = "000900230D0BF1891C64C1087E74D0FF1A236E0F73F21C1E0A84DD9143F4F242"
// network.getTransaction(txid)
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//         console.log("resp: ",resp)
//     })

//thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5

// network.getLastBlock()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getBlockHeight()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


// let address = "thor1ls33ayg26kmltw7jjy55p32ghjna09zp74t4az"
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })
//
// // let address = process.env['TEST_THOR_MASTER']
// // if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// // console.log("address: ",address)
// network.getAccount(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// let address  = "tthor1ls33ayg26kmltw7jjy55p32ghjna09zp6z69y8"
// console.log("address: ",address)
// network.getAccountInfo(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = process.env['TEST_THOR_MASTER']
// // let address = "tthor1jhv0vuygfazfvfu5ws6m80puw0f80kk67cp4eh" //test seed
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// console.log("address: ",address)
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// console.log("address: ",address)
// network.txs(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

