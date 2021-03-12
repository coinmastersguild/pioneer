/*
    Thorchain
 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")

//good
//let tx = '{"tx":{"fee":{"amount":[{"amount":"3000","denom":"rune"}],"gas":"200000"},"memo":"foobar","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"1000000","denom":"rune"}],"from_address":"tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh","to_address":"tthor1jhv0vuygfazfvfu5ws6m80puw0f80kk67cp4eh"}}],"signatures":[{"signature":"k8Pp9bo4J1IgaogVCKXhkJC/n5hp4wFcV+OlmUpO121lLVTa9lhSh8KCyMEWzK7qiVyWFGHXteSbocVfvolDiQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AvZssaf4cD1EFUt34ppe5Ne9DlKj/2zVYSsPTtlrcFmj"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

// let tx = '{"tx":{"account_number":16354, "chain_id":"thorchain", "fee":{"amount":[{"amount":"3000", "denom":"rune"} ], "gas":"200000"}, "memo":"foobar", "msg":[{"type":"thorchain/MsgSend", "value":{"amount":[{"amount":"1000000", "denom":"rune"} ], "from_address":"tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh", "to_address":"tthor1jhv0vuygfazfvfu5ws6m80puw0f80kk67cp4eh"} } ], "sequence":5, "signatures": [{"pub_key": {"type": "tendermint/PubKeySecp256k1", "value": "AxUZcTuLQr3DZxEtMxMs8Uzt+SisV3HURLpFm5SXEXuj"}, "signature": "3tyJahBdws8V0Ti2dY83g97EHLioQRPgK7JoBh5EuSMFGn61kvWC4kuBS9FxH8y9dpytHkAfpKrF0KJpdiKs2A=="}] }, "type":"auth/StdTx", "mode":"sync"}'

//let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"rune"}],"gas":"200000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"15171860","denom":"rune"}],"from_address":"tthor17t8al76t9g3hvak440kegn9xcdvxgal4gl7ejy","to_address":"tthor1jvt443rvhq5h8yrna55yjysvhtju0el7ldnwwy"}}],"signatures":[{"signature":"iCToHbsLfiirhkl0oiTcHBF2kaJFAnaA3GECWRSwZL4vueNrKnqaD+bxWU3E/IkOjSLntkFQleK5wkRScaLvcw==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A51wJggDJzMe1+SrasIFv/a6UI8KzE2HZoeS9zv1EVMM"},"account_number":"0","sequence":"0"}]},"mode":"sync"}'

//let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"rune"}],"gas":"200000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"15137108","denom":"rune"}],"from_address":"tthor17t8al76t9g3hvak440kegn9xcdvxgal4gl7ejy","to_address":"tthor1ls33ayg26kmltw7jjy55p32ghjna09zp6z69y8"}}],"signatures":[{"signature":"6Wr2M+agtOGZs1scjBDA0rsWI6DuzlNtNxI0FDBaT3Fk4ZJ7Z0XNIqifKb47yAgeBn3O2JWDLu4HWUVMgpIlwA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A51wJggDJzMe1+SrasIFv/a6UI8KzE2HZoeS9zv1EVMM"},"account_number":92,"sequence":"0"}]},"mode":"sync"}'

//let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"rune"}],"gas":"200000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"15061026","denom":"rune"}],"from_address":"tthor17t8al76t9g3hvak440kegn9xcdvxgal4gl7ejy","to_address":"tthor1ls33ayg26kmltw7jjy55p32ghjna09zp6z69y8"}}],"signatures":[{"signature":"1VxCn6xQsPAGl60111ndCoDa6iyGmb1P5pTMPwTr8u4OsNpUJsDcuci9CDL0GZeO1zAd6i/bo6NtL7rjrJlabg==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A51wJggDJzMe1+SrasIFv/a6UI8KzE2HZoeS9zv1EVMM"},"account_number":92,"sequence":4}]},"mode":"sync"}'

// let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"rune"}],"gas":"200000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"15085412","denom":"rune"}],"from_address":"tthor17t8al76t9g3hvak440kegn9xcdvxgal4gl7ejy","to_address":"tthor1ls33ayg26kmltw7jjy55p32ghjna09zp6z69y8"}}],"signatures":[{"signature":"io8XFrOBUOZSmE2zkOdAOAAV792qF8qKktExsqiJiIhYgtOpMqcxRD0MizC29y7ipSjmuEqlfz7Ydlg56ODZ+A==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A51wJggDJzMe1+SrasIFv/a6UI8KzE2HZoeS9zv1EVMM"},"account_number":92,"sequence":5}]},"mode":"sync"}'

// let tx = '{"tx":{"fee": {"amount": [{"amount": "3000", "denom": "rune"} ], "gas": "200000"}, "memo": "foobar2", "msg": [{"type": "thorchain/MsgSend", "value": {"amount": [{"amount": "10000", "denom": "rune"} ], "from_address": "tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh", "to_address": "tthor1x00pfwyx8xld45sdlmyn29vjf7ev0mv380z4y6"} } ], "signatures": [{"pub_key": {"type": "tendermint/PubKeySecp256k1", "value": "AvZssaf4cD1EFUt34ppe5Ne9DlKj/2zVYSsPTtlrcFmj"}, "signature": "VlRctQNCk891lytqGq2/6ei1DC/VQMPMp7mwMxjDOhtF93Yi1xAdMEtseMLd1hMmJcwNbuFFaxOOa9YNYvjaTA=="} ] }, "type":"auth/StdTx", "mode":"sync"}'

// let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"rune"}],"gas":"200000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"14945549","denom":"rune"}],"from_address":"tthor17t8al76t9g3hvak440kegn9xcdvxgal4gl7ejy","to_address":"tthor1x00pfwyx8xld45sdlmyn29vjf7ev0mv380z4y6"}}],"signatures":[{"signature":"RpnaKXBoJjxUjJgYTcZJpUedTImYc3ZcxTY7+BEDMQwwUr5uHJIK+AKCUgvzjwfiRPRc3+b9n35LqqQRylhVKA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A51wJggDJzMe1+SrasIFv/a6UI8KzE2HZoeS9zv1EVMM"},"account_number":92,"sequence":5}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

// let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"rune"}],"gas":"200000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"15000816","denom":"rune"}],"from_address":"tthor17t8al76t9g3hvak440kegn9xcdvxgal4gl7ejy","to_address":"tthor1x00pfwyx8xld45sdlmyn29vjf7ev0mv380z4y6"}}],"signatures":[{"signature":"H0yfMcPL3MeJncGtzeH/Yz0UVGuDoR6bYUQzw+JGXdVPxyLItWuMqnlMgWMyVI/z3QXbjzqvF5x5d2dOL9YJJA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A51wJggDJzMe1+SrasIFv/a6UI8KzE2HZoeS9zv1EVMM"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

// let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"rune"}],"gas":"200000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"15066530","denom":"rune"}],"from_address":"tthor1s8jgmfta3008lemq3x2673lhdv3qqrhw4kpvwj","to_address":"tthor1x00pfwyx8xld45sdlmyn29vjf7ev0mv380z4y6"}}],"signatures":[{"signature":"YGOaa+a68VSsoX2Yz8Algw/cdFt+lGLgvgMj2owAj1ItDrZjmJTUmUeWF4U9klCUqrJQWGauz/bWmdiggMpXrA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AgyWsW5V7fbqI+Cw7vx7Y1Zuz6WzCJiOgDY8eUPdfbZB"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

//let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"3000","denom":"rune"}],"gas":"200000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"tthor1s8jgmfta3008lemq3x2673lhdv3qqrhw4kpvwj","to_address":"tthor1x00pfwyx8xld45sdlmyn29vjf7ev0mv380z4y6"}}],"signatures":[{"signature":"WxZZEr6jsWNh0fIiLU1bphWdTvTpzCXHUNcKXDCQyGhDtXJ3rjAJfrDlmFg5qBMSdnr8yYeGYRBXfxLki93m7Q==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AgyWsW5V7fbqI+Cw7vx7Y1Zuz6WzCJiOgDY8eUPdfbZB"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

//let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"3000","denom":"rune"}],"gas":"200000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"10000","denom":"rune"}],"from_address":"tthor1s8jgmfta3008lemq3x2673lhdv3qqrhw4kpvwj","to_address":"tthor1x00pfwyx8xld45sdlmyn29vjf7ev0mv380z4y6"}}],"signatures":[{"signature":"H7KaH4j+1addndIvSlIRL3RVZqteLXFVqNfJcFVy2SgtTzBpb51gEHzYrYqdD+kpuuOe1QE1tcymLEtwzq6/1Q==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AgyWsW5V7fbqI+Cw7vx7Y1Zuz6WzCJiOgDY8eUPdfbZB"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

let tx = '{"tx":{"memo":"Runemoon","fee":{"amount":[{"amount":"100","denom":"rune"}],"gas":"100000"},"msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"15530000","denom":"rune"}],"from_address":"tthor1x00pfwyx8xld45sdlmyn29vjf7ev0mv380z4y6","to_address":"tthor17t8al76t9g3hvak440kegn9xcdvxgal4gl7ejy"}}],"signatures":[{"signature":"t1hj+LOWZFyyPhZpykUOB0tKJ+zfGoVbjYnPRvHVRPxWDu4h3BNo8HMceNMSwD42CaTsYbSCK///YD3IrOLcDg==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A3wToBgumQPqBLPo244NZauDHxlxZ9143neDcP82QUeg"}}]},"mode":"sync","type":"cosmos-sdk/StdTx"}'


network.broadcast(tx)
    .then(function(resp){
        console.log("resp: ",resp)
    })

//tx
//let tx = "73B3FA864CFD344E236FE89A1F25AE307A0F089354ACACD3922FDEA7108A23C3"
//let tx = "80FA1B9C76B8A9FDA53FE1364ED0E46C8F77F5A2E31D5108C09AAC6BBCD7626E"
//let tx = "48E078925FAE95A23E29EFC27637860A7F42723CFEABAFC4D7E9DA12EADEB36E"
// let tx = "07E86A852028DA8E60A9EB5434F772E58DCD7CC606E6D7B0D93F9399BFD01EF2"
// let tx = "529977AC79459BD2C723514DAAE1F5229EAD48EBCDDA16E48DF0901AFEDEE268"
//let tx = "4CF2C0FCA2C04301C7085F78833CD1B5A6CA7B371D47BCEE08C5DAD53C2C9196"
// network.transaction(tx)
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//     })

// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })
//

let address = "tthor1s8jgmfta3008lemq3x2673lhdv3qqrhw4kpvwj"
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
