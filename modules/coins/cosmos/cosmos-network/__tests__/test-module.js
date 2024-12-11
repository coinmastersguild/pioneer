require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})


let network = require("../lib/index")

//

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

// network.nodeInfo()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//nodeInfo
// network.isOnline()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.isOnline()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//getValidators
// network.getValidators()
//     .then(function(resp){
//         console.log("resp: ",resp.result[1])
//     })

// network.txsByHeight("5204363")
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.txsByHeight(8516982)
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.txs("cosmos1fx4jwv3aalxqwmrpymn34l582lnehr3eqwuz9e")
//     .then(function(resp){
//         // console.log("resp: ",resp)
//         // console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.getAccount("cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

let address = "cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc"

// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.getBalances(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// let voucher = 'B011C1A0AD5E717F674BA59FD8E05B2F946E4FD41C9CB3311C95F7ED4B815620'
// network.getVoucherInfo(voucher)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

network.getTransaction("9983F020670AF00CD24D6465A0E95767FC7688B4A3D9DD6483B07E3AB14C0D44")
    .then(function(resp){
        console.log("resp: ",resp)
        console.log("resp: ",JSON.stringify(resp))
    })


// let tx = '{"tx":{"fee":{"amount":[{"amount":"1000","denom":"uatom"}],"gas":"100000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgTransfer","value":{"sender":"cosmos1yc6dftwdhgt96k8yty8djga88f3knhznfyh26k","receiver":"osmo1yc6dftwdhgt96k8yty8djga88f3knhznply6vy","source_port":"transfer","source_channel":"channel-141","token":{"denom":"uatom","amount":"10000"},"timeout_height":{"revision_number":"1","revision_height":"8391940"}}}],"signatures":[{"signature":"iTUel+vTU922MBDhI7qOThPcoeoyRh+3Oso2vg6DfM1y8oQQRgkp7SVogj+RfPk5jBrBZfWJ4DB3EZ7DtH4LVQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A/SmJZVOYFbYd/Gr3he9k0I+oIbr5GSrOnwqR4KvLwzJ"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// network.encode(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//     })

//
// let tx = ''
// let tx = ''
// let tx = '{"tx":{"fee":{"amount":[{"amount":"1000","denom":"uatom"}],"gas":"100000"},"memo":"foo:bar","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"1000","denom":"uatom"}],"from_address":"cosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3","to_address":"cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj"}}],"signatures":[{"signature":"JCfVPdOQR8V/6Qd5d+NRvgQzu2FR38zwzPIfITGHjBc9TTV7hfhrUeM/jn6CA5i1qPT8/ilh5ZUXELYY04mN+g==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A8QCEd0Bv9jcopRKRwv3GdJX3JMxDdG8BZ/rpc0wGcxI"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//
// //let tx = '{"tx":{"msg":[{"type":"cosmos-sdk/MsgTransfer", "value":{"source_port":"transfer", "source_channel":"channel-141", "token":{"denom":"uatom", "amount":"10000"}, "sender":"cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj", "receiver":"osmo15cenya0tr7nm3tz2wn3h3zwkht2rxrq7g9ypmq", "timeout_height":{"revision_number":"1", "revision_height":"2019339"}}}], "fee":{"amount":[{"denom":"uosmo", "amount":"0"}], "gas":"1350000"}, "signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1", "value":"A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B"}, "signature":"FGGl2YoTl/fO+EFKuFgH7bi742KPfVbFKcL1/gSb1eBfbRscxz8YLRbfmTUQjObH7tOO3GUoUsnFXn6+WTNy8A=="}], "memo":"", "timeout_height":"0"}, "type":"cosmos-sdk/StdTx", "mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"1000","denom":"uatom"}],"gas":"100000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgTransfer","value":{"sender":"cosmos1yc6dftwdhgt96k8yty8djga88f3knhznfyh26k","receiver":"osmo1yc6dftwdhgt96k8yty8djga88f3knhznply6vy","source_port":"transfer","source_channel":"channel-141","token":{"denom":"uatom","amount":"10000"},"timeout_height":{"revision_number":"1","revision_height":"8391940"}}}],"signatures":[{"signature":"iTUel+vTU922MBDhI7qOThPcoeoyRh+3Oso2vg6DfM1y8oQQRgkp7SVogj+RfPk5jBrBZfWJ4DB3EZ7DtH4LVQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A/SmJZVOYFbYd/Gr3he9k0I+oIbr5GSrOnwqR4KvLwzJ"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

//let tx = '{"account_number":"16354","chain_id":"cosmoshub-4","fee":{"amount":[{"amount":"100","denom":"uatom"}],"gas":"100000"},"memo":"Sent from the citadel! ","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"1000","denom":"uatom"}],"from_address":"cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj","to_address":"cosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3"}}],"sequence":"16","signatures":[{"signature":"ObKvan95mOm0d16zd2w2ev02m5/ds1bQ3M5d9hMLP8t40VfpE/QXAvPoCx0prePAO98AeOoiePq7gOf4vbKIcA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A77jrzDlOnPzirxaL82sQm17BOtyqOvTsBmS4tIG4krY"}}]}'

//let tx_final = 'CqkBCo0BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm0KLWNvc21vczE1Y2VueWEwdHI3bm0zdHoyd24zaDN6d2todDJyeHJxN3E3aDNkahItY29zbW9zMXFqd2R5bjU2ZWNhZ2s4cmpmN2Nycnp3Y3l6Njc3NWNqODluam4zGg0KBXVhdG9tEgQxMDAwEhdTZW50IGZyb20gdGhlIGNpdGFkZWwhIBJmClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEDvuOvMOU6c/OKvFovzaxCbXsE63Ko69OwGZLi0gbiStgSBAoCCH8YBRISCgwKBXVhdG9tEgMxMDAQoI0GGkBcswrg4Sl4kfNAtR7qUg80wXY2JJBqXPowylGdeEIhb3GCM4Y1YUDKxLlVvzNH17+dIYh0q1T0SFTS7a+upgAE'

//bad seq
//let tx = 'CqkBCo0BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm0KLWNvc21vczE1Y2VueWEwdHI3bm0zdHoyd24zaDN6d2todDJyeHJxN3E3aDNkahItY29zbW9zMXFqd2R5bjU2ZWNhZ2s4cmpmN2Nycnp3Y3l6Njc3NWNqODluam4zGg0KBXVhdG9tEgQxMDAwEhdTZW50IGZyb20gdGhlIGNpdGFkZWwhIBJkCk4KRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEDvuOvMOU6c/OKvFovzaxCbXsE63Ko69OwGZLi0gbiStgSBAoCCH8SEgoMCgV1YXRvbRIDMTAwEKCNBhpAObKvan95mOm0d16zd2w2ev02m5/ds1bQ3M5d9hMLP8t40VfpE/QXAvPoCx0prePAO98AeOoiePq7gOf4vbKIcA=='

//no account number
//let tx = 'CqkBCo0BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm0KLWNvc21vczE1Y2VueWEwdHI3bm0zdHoyd24zaDN6d2todDJyeHJxN3E3aDNkahItY29zbW9zMXFqd2R5bjU2ZWNhZ2s4cmpmN2Nycnp3Y3l6Njc3NWNqODluam4zGg0KBXVhdG9tEgQxMDAwEhdTZW50IGZyb20gdGhlIGNpdGFkZWwhIBJmClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEDvuOvMOU6c/OKvFovzaxCbXsE63Ko69OwGZLi0gbiStgSBAoCCH8YEBISCgwKBXVhdG9tEgMxMDAQoI0GGkA5sq9qf3mY6bR3XrN3bDZ6/Tabn92zVtDczl32Ews/y3jRV+kT9BcC8+gLHSmt48A73wB46iJ4+ruA5/i9sohw'


// let tx = '{"tx":{"fee":{"amount":[{"amount":"1000","denom":"uatom"}],"gas":"100000"},"memo":"foo:bar","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"1000","denom":"uatom"}],"from_address":"acosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3","to_address":"cosmos15cenya0tr7nm3tz2wn3h3zwkht2rxrq7q7h3dj"}}],"signatures":[{"signature":"JCfVPdOQR8V/6Qd5d+NRvgQzu2FR38zwzPIfITGHjBc9TTV7hfhrUeM/jn6CA5i1qPT8/ilh5ZUXELYY04mN+g==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A8QCEd0Bv9jcopRKRwv3GdJX3JMxDdG8BZ/rpc0wGcxI"}}]},"type":"cosmos-sdk/StdTx","mode":"async"}'


//let tx = 'CpABCo0BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm0KLWNvc21vczF5YzZkZnR3ZGhndDk2azh5dHk4ZGpnYTg4ZjNrbmh6bmZ5aDI2axItY29zbW9zMTdodGx2Y2U1eXM4aHFoeGxrYXR5dWh2OHF3dHg3MmF5cW5yY2tzGg0KBXVhdG9tEgQxMDAwEmcKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQP0piWVTmBW2Hfxq94XvZNCPqCG6+Rkqzp8KkeCry8MyRIECgIIARgNEhMKDQoFdWF0b20SBDEwMDAQoI0GGkDW2fYGutl2sTw6JUMlC/LDBfB716TYKsq4K8yssQlVkSgWhaQ02Mvzm9qBXHo4gNFnQIAsj7DiWyKnPdfPeYS9'
//let tx = 'CpEBCo4BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm4KLWNvc21vczFyczdmY2tnem5rYXhzNHNxMDJwZXh3amdhcjQzcDV3bjdha3FuYxItY29zbW9zMTdodGx2Y2U1eXM4aHFoeGxrYXR5dWh2OHF3dHg3MmF5cW5yY2tzGg4KBXVhdG9tEgUxMDAwMBJjClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECKBTqQdDCZkV4bNWuNYUjOlRv7M9W2kNzhSPoiInO04ASBAoCCH8YEBIPCg0KBXVhdG9tEgQxMDAwGkAGodkOJXQn8O/oTjo3yD6iYa1G+iAJpZckKdiORXD3sFgxrbaOqdodgqsWRh175K7jazNqLuPNNFWZMI9pvO/O'
// let tx = 'CpABCo0BChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEm0KLWNvc21vczFyczdmY2tnem5rYXhzNHNxMDJwZXh3amdhcjQzcDV3bjdha3FuYxItY29zbW9zMWhwN2ducjA3d3ByZDc1ZjRqNGF6ZTlhOTRhZWpmY3Fkc3JuYXBlGg0KBXVhdG9tEgQxMDAwEmcKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQIoFOpB0MJmRXhs1a41hSM6VG/sz1baQ3OFI+iIic7TgBIECgIIfxgcEhMKDQoFdWF0b20SBDQ1MDAQwJoMGkAnfeLKhg4RNLWTCWsL+um3K/sfzXUgVcMoamYrvUHWAFNouHDNa2RQg5zi1sZGUVXECIG287ySVC0OjGQicJfj'
// network.broadcast(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//     })

// network.broadcastLegacy(tx)
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//     })
