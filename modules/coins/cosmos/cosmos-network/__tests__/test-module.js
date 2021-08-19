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

network.getTransaction("18932B6AE0563B70A8A2B42DEE5F74629C4DB5AC0D83AFBAD8DDECD356FA9940")
    .then(function(resp){
        console.log("resp: ",resp)
        console.log("resp: ",JSON.stringify(resp))
    })

//
// let tx = ''
// let tx = ''
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//     })
