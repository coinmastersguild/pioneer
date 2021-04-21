/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")

//good
//let txRaw = '{"tx":{"memo":"","fee":{"amount":[{"amount":"3000","denom":"rune"}],"gas":"250000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"100000","denom":"rune"}],"from_address":"thor1x00pfwyx8xld45sdlmyn29vjf7ev0mv3rcn9al","to_address":"thor1zfjv26zx08s6skjwq20clxs076hptp45aktjm0"}}],"signatures":[{"signature":"YYn9uvDWIT/m+l99PBgXJi2lNUzHk2XYS+PWAoOocQp6xBjMNRgstpIFhdPCUgL1k8pwVAhSJbcryhdc4yen1w==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A3wToBgumQPqBLPo244NZauDHxlxZ9143neDcP82QUeg"}}]},"mode":"async","type":"cosmos-sdk/StdTx"}'
//let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"3000","denom":"rune"}],"gas":"250000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"100000","denom":"rune"}],"from_address":"thor1x00pfwyx8xld45sdlmyn29vjf7ev0mv3rcn9al","to_address":"thor1zfjv26zx08s6skjwq20clxs076hptp45aktjm0"}}],"signatures":[{"signature":"55Rc16tT39vjSbGCwpu8QdVB6IquJD548CKuhoKDDcVEcMeXx2zfPeNj/vSFGs1VVoGAzukR6it+QHEiKSSzMg==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A3wToBgumQPqBLPo244NZauDHxlxZ9143neDcP82QUeg"}}]},"mode":"async","type":"cosmos-sdk/StdTx"}'
//let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"3000","denom":"rune"}],"gas":"250000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"100000","denom":"rune"}],"from_address":"thor1x00pfwyx8xld45sdlmyn29vjf7ev0mv3rcn9al","to_address":"thor1zfjv26zx08s6skjwq20clxs076hptp45aktjm0"}}],"signatures":[{"signature":"B8W5HXM+lgNfboJ2jwPA1WPNG7tWs5w/8kE5bL2nqfgl9rsiNhbOxbykjyU3TPeY0EG+55R/ixHFr3q67B3G8Q==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A3wToBgumQPqBLPo244NZauDHxlxZ9143neDcP82QUeg"}}]},"mode":"async","type":"cosmos-sdk/StdTx"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"3000","denom":"rune"}],"gas":"200000"},"memo":"foobar","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"1000000","denom":"rune"}],"from_address":"tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh","to_address":"tthor1jhv0vuygfazfvfu5ws6m80puw0f80kk67cp4eh"}}],"signatures":[{"signature":"k8Pp9bo4J1IgaogVCKXhkJC/n5hp4wFcV+OlmUpO121lLVTa9lhSh8KCyMEWzK7qiVyWFGHXteSbocVfvolDiQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AvZssaf4cD1EFUt34ppe5Ne9DlKj/2zVYSsPTtlrcFmj"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"3000","denom":"rune"}],"gas":"200000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"100","denom":"rune"}],"from_address":"thor1ls33ayg26kmltw7jjy55p32ghjna09zp74t4az","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"EHwZQ8wDiiPkwB4V+1R3h0jO0+OisdjtMZR02pb5SpFnte2MIkoqz/T6tsltcXFvhsvNxH8ilm6XBk8EPo6Hsg==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AxUZcTuLQr3DZxEtMxMs8Uzt+SisV3HURLpFm5SXEXuj"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// network.broadcast(txRaw)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

let tx = "1F5D4C4ED11D607A4C4E5EF29E85D4C5A3A9B78213C03E87F762E9DD529A9700"
// tx
// let tx = "7734844A08E7A545E9A9311A1D473B2472AFBB2685F6291076B013C8950349F9"
network.transaction(tx)
    .then(function(resp){
        console.log("resp: ",JSON.stringify(resp))
    })

//thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5

// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })
//

let address = "thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"
// // // let address = "thor1ls33ayg26kmltw7jjy55p32ghjna09zp74t4az"
// // // let address = "thor1jhv0vuygfazfvfu5ws6m80puw0f80kk660s9qj"
// // // let address = "tthor1x00pfwyx8xld45sdlmyn29vjf7ev0mv380z4y6"
network.getBalance(address)
    .then(function(resp){
        console.log("resp: ",resp)
    })

// let address = process.env['TEST_THOR_MASTER']
// if(!address) throw Error("must add TEST_THOR_MASTER to .env")
// console.log("address: ",address)
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

