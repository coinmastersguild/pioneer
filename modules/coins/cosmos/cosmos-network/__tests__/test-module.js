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

network.getTransaction("5A94A8DC72D2A49330999BD704BD08D3228689DC27EF0297DAB96DF72048F7DC")
    .then(function(resp){
        console.log("resp: ",resp)
        console.log("resp: ",JSON.stringify(resp))
    })

//
// let tx = ''
// let tx = ''
// let tx = {"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"atom"}],"gas":"400000"},"signature": {"signature":"SpJvBlZLoVAujLKdOK6kxTnhMNMR91hYmrgY7m+XaQsrJoY2NfL623bepB2P7CI63EIoMnPdUs6Rit6Po3wBqA==","account_number": "88204", "sequence": "6", "pub_key":{"type":"tendermint/PubKeySecp256k1","value":"Als8n0w91JK719dmWG4hbz/ppoA9pAmzVs0HRx28HEOS"}},"msg":[{"type":"cosmos-sdk/MsgTransfer","value":{"source_port":"transfer","source_channel":"channel-0","token":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"1867.7941470811770446589"},"sender":"osmo1fx4jwv3aalxqwmrpymn34l582lnehr3eg40jnt","receiver":"cosmos1fx4jwv3aalxqwmrpymn34l582lnehr3eqwuz9e","timeout_height":{"revision_number":"4","revision_height":"8362088"}}}]},"mode":"sync"}
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//     })
