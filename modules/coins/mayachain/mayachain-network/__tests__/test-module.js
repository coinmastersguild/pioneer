/*
    mayachain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// network.getPools()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


// let tx = '{"tx":{"fee":{"amount":[{"amount":"2000000","denom":"rune"}],"gas":"250000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"thor1vvehrsz8rwzaws4j94ak3a4zj7myjerx9xn9yp","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"3aYnRyakFZBMOQRM109TYFWPVbpCiDAVOHWbNTTuxS1OXo2MoI2+JNDgjRCzEIxA3wUEiM7Fj+K+HGX9m4JI4w==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AiuXsiJnUQl/00hULvyEdIXx2Q64TnY+ssyfVU+PCkcc"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"OM+kv4c5c28HTTrOTlAPBkPBc+y6cTrCcZCTYJLu0pAn3JCIiDZ2kzQlKE5y4yy5KXsYFcTxyoDGjyCwxJViiA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AiuXsiJnUQl/00hULvyEdIXx2Q64TnY+ssyfVU+PCkcc"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"1100000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3"}}],"sequence":"44","account_number":"334","signatures":[{"signature":"GjZ0eY8O7yB+IOgVlRRXP7LsUjaBTbY/oy7SAsVOJvRmEnHqWm8RXLRad7vDr1ZFCY7Y6FhxD1aySdfnRe9Ocw==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A9BnfoZvhOO8Y3RpeUFKi6bvTfObGZ0Altybt0wXABUC"},"sequence":"44"}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// let tx = '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"50000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3"}}],"sequence":"47","account_number":"334","signatures":[{"signature":"LJD5/1pVVUHopPNpURTEyRnQ3c5dVRnXJKUJrKTuoahlIUkReh1Vt+jjmz7YhJeGcIJDHQXGH4Ki3rKXa0ciCQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A9BnfoZvhOO8Y3RpeUFKi6bvTfObGZ0Altybt0wXABUC"},"sequence":"47"}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let txid = '436B3A7653824973B3B289F81113F57ACF0E23BDD29FDB533402F8C08E1BF359'
// // let txid = "A77E61DE200C32FC9BD75245A4728DFF84A4242199A9F83623C2E67B4B49466A"
// // // // let txid = "92B8BF227A4AB56A720CE61E42D6DD0F54EB97F73A21A39867D91C30F408F9D7"
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


// let address = 'maya1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfqkl5k'
// let address = "maya1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfqkl5k"
// network.getBalances(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// //
// // // let address = process.env['TEST_THOR_MASTER']
// // // if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// // console.log("address: ",address)
// network.getAccount(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//let signedTx

// let signedTx = 'ClQKSgoOL3R5cGVzLk1zZ1NlbmQSOAoU/CMekQrVt/W70pEpQMVIvKfXlEESFPwjHpEK1bf1u9KRKUDFSLyn15RBGgoKBWNhY2FvEgExEgZmb29iYXISZApQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAxUZcTuLQr3DZxEtMxMs8Uzt+SisV3HURLpFm5SXEXujEgQKAgh/GAwSEAoKCgVjYWNhbxIBMBDAmgwaQN6jkIlcP2jGV4FLLj3DH9hbmuqIO38qQGOtgWAqxVzWLWxj2G+UX1CEKPWfSVEW+KYQ5bqHdqVhm5HdG+q08K8='
//
//let signedTxKeepKey = 'ClQKSgoOL3R5cGVzLk1zZ1NlbmQSOAoU/CMekQrVt/W70pEpQMVIvKfXlEESFPwjHpEK1bf1u9KRKUDFSLyn15RBGgoKBWNhY2FvEgExEgZmb29iYXISZApQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAxUZcTuLQr3DZxEtMxMs8Uzt+SisV3HURLpFm5SXEXujEgQKAgh/GA0SEAoKCgVjYWNhbxIBMRDAmgwaQEhVNJ8wbs3VeTaQ9VT3LXLtXqXtMXghD4zs9DZP0NMIalBlTfZtY3785fl0dznCjGK/8qNl3vKLQ6S3UcyE9lQ='
// let signedTxNative = 'ClQKSgoOL3R5cGVzLk1zZ1NlbmQSOAoU/CMekQrVt/W70pEpQMVIvKfXlEESFPwjHpEK1bf1u9KRKUDFSLyn15RBGgoKBWNhY2FvEgExEgZmb29iYXISZApQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAxUZcTuLQr3DZxEtMxMs8Uzt+SisV3HURLpFm5SXEXujEgQKAggBGA0SEAoKCgVjYWNhbxIBMRDAmgwaQJZv9v0Rc9M1LYGsl3egwJfpUN0i8Wr6ySwtumtaS33vAysw+ixFXOhrberMkKAyskeBl4qHn7cGlr53zPEWfQ0='
// let signedTx = 'ClQKSgoOL3R5cGVzLk1zZ1NlbmQSOAoU/CMekQrVt/W70pEpQMVIvKfXlEESFPwjHpEK1bf1u9KRKUDFSLyn15RBGgoKBWNhY2FvEgExEgZmb29iYXISZApQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAxUZcTuLQr3DZxEtMxMs8Uzt+SisV3HURLpFm5SXEXujEgQKAgh/GA8SEAoKCgVjYWNhbxIBMRDAmgwaQON9jODyyT4iota+t7fsgRvc5/4phSNYhiftonUKntAGcdqBeqlON6Vdfl6GSugsSU4Ugbl+/MlFjcsVeacidKA='
let signedTx = 'ClMKTgoOL3R5cGVzLk1zZ1NlbmQSPAoUQXP/fFJ1yk5NWKykK5HlkU7LXSYSFKy4u33VN3rmGeEr91pPg9V3u8hRGg4KBWNhY2FvEgUxMDAwMBIBIBJmClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiED4uqhJsLFh7m0XYJu92bmh5b0v5posOVIeb6PCpQMGS8SBAoCCH8YMxISCgoKBWNhY2FvEgEwEIDKte4BGkBv9zLDcMr/c/KhLjrcJRlunZieY+jSfM9VzXd4/+ra9wzsX6D/C3d+RhAfop98LXN7VGftemTwkHbLJvAKgTx4'

network.broadcast(signedTx)
    .then(function(resp){
        console.log("resp: ",resp)
    })

// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// let address  = "tthor1ls33ayg26kmltw7jjy55p32ghjna09zp6z69y8"
// console.log("address: ",address)
// network.getAccountInfo(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = 'maya1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfqkl5k'
// console.log("address: ",address)
// network.getBalances(address)
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

