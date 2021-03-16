/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")

//good
//let tx = '{"tx":{"fee":{"amount":[{"amount":"3000","denom":"rune"}],"gas":"200000"},"memo":"foobar","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"1000000","denom":"rune"}],"from_address":"tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh","to_address":"tthor1jhv0vuygfazfvfu5ws6m80puw0f80kk67cp4eh"}}],"signatures":[{"signature":"k8Pp9bo4J1IgaogVCKXhkJC/n5hp4wFcV+OlmUpO121lLVTa9lhSh8KCyMEWzK7qiVyWFGHXteSbocVfvolDiQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AvZssaf4cD1EFUt34ppe5Ne9DlKj/2zVYSsPTtlrcFmj"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//tx
//let tx = "4CF2C0FCA2C04301C7085F78833CD1B5A6CA7B371D47BCEE08C5DAD53C2C9196"
// network.transaction(tx)
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//     })

// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })


let address = "tthor1s8jgmfta3008lemq3x2673lhdv3qqrhw4kpvwj"
network.getBalance(address)
    .then(function(resp){
        console.log("resp: ",resp)
    })

// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// console.log("address: ",address)
network.getAccount(address)
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
