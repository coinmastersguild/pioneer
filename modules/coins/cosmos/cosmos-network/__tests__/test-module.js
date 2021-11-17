require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


//init local
// let gaiad = "ws://127.0.0.1:26657"
// let gaiaWs = "ws://127.0.0.1:26657"
// let gaiacli = "http://127.0.0.1:1317"
// let pioneer = "http://127.0.0.1:9001"

// network.init('full')
//network.init(gaiaWs,gaiad,gaiacli,pioneer)
//


//network.init('full')
//network.init('pioneer',"","","http://127.0.0.1:8000")
//network.init('pioneer')

// network.isOnline()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.txsByHeight("5204363")
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.txsByHeight("5204363")
//     .then(function(resp){
//         console.log("resp: ",JSON.stringif(resp))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.txs("cosmos1dq8u50p3fdm5gcw9fx5xch39atyzfp0ss59g9f")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.getAccount("cosmos1kyv3pn3mdk6q6yelhf4vyrza7a0lxgca077cze")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.getBalance("")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.getTransaction("6A55A7A5550C2EAD621A38B498E6D08E2A1F92518E4AA5CF560558212DA7652F\n")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//     })

//
// let tx = ''
// let tx = ''
// let tx = '{"tx":{"fee":{"amount":[{"amount":"1000","denom":"uatom"}],"gas":"100000"},"memo":"foo:bar","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"1000","denom":"uatom"}],"from_address":"cosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3","to_address":"cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj"}}],"signatures":[{"signature":"JCfVPdOQR8V/6Qd5d+NRvgQzu2FR38zwzPIfITGHjBc9TTV7hfhrUeM/jn6CA5i1qPT8/ilh5ZUXELYY04mN+g==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A8QCEd0Bv9jcopRKRwv3GdJX3JMxDdG8BZ/rpc0wGcxI"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

//let tx = '{"tx":{"msg":[{"type":"cosmos-sdk/MsgTransfer", "value":{"source_port":"transfer", "source_channel":"channel-141", "token":{"denom":"uatom", "amount":"10000"}, "sender":"cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj", "receiver":"osmo15cenya0tr7nm3tz2wn3h3zwkht2rxrq7g9ypmq", "timeout_height":{"revision_number":"1", "revision_height":"2019339"}}}], "fee":{"amount":[{"denom":"uosmo", "amount":"0"}], "gas":"1350000"}, "signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1", "value":"A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B"}, "signature":"FGGl2YoTl/fO+EFKuFgH7bi742KPfVbFKcL1/gSb1eBfbRscxz8YLRbfmTUQjObH7tOO3GUoUsnFXn6+WTNy8A=="}], "memo":"", "timeout_height":"0"}, "type":"cosmos-sdk/StdTx", "mode":"sync"}'
let tx = '{"tx":{"fee":{"amount":[{"amount":"1000","denom":"uatom"}],"gas":"100000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgTransfer","value":{"sender":"cosmos1yc6dftwdhgt96k8yty8djga88f3knhznfyh26k","receiver":"osmo1yc6dftwdhgt96k8yty8djga88f3knhznply6vy","source_port":"transfer","source_channel":"channel-141","token":{"denom":"uatom","amount":"10000"},"timeout_height":{"revision_number":"1","revision_height":"8391940"}}}],"signatures":[{"signature":"iTUel+vTU922MBDhI7qOThPcoeoyRh+3Oso2vg6DfM1y8oQQRgkp7SVogj+RfPk5jBrBZfWJ4DB3EZ7DtH4LVQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A/SmJZVOYFbYd/Gr3he9k0I+oIbr5GSrOnwqR4KvLwzJ"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
network.broadcast(tx)
    .then(function(resp){
        console.log("resp: ",resp)
        console.log("resp: ",JSON.stringify(resp))
    })
