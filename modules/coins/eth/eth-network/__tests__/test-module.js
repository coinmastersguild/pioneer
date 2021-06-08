
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
require("dotenv").config({path:'../../../../../../.env'})

//ETC
//BSC

let network = require("../lib/index")
network.init()

// let rawTx = "0xf86d8085037e11d60082520894da1e5d4cc9873963f788562354b55a772253b92f880e1ec17c32851a0080819da0a734dae768422188270a8f7eca9c9b1beaba2cf42f45f2a28c5f010b0eeaf427a052b4d53b1176a2e49e6a17c66058d686e986a4d6b4f2659bc55b8bd7e0834ed9"
// network.broadcast(rawTx)
//     .then(function(resp){
//         console.log(resp)
//     })


// let addresses = [
//     "0x662ac3362623d72de57668dbf34ed7df913032c5",
//     "0x93F6382804d21f48EB289feB5091F07e5e71454E"
//     ]
// network.getBalances(addresses)
//     .then(function(resp){
//         console.log(resp)
//     })

// let rawTx = "0xf8aa808508f6c7610083015f9094dac17f958d2ee523a2206206994597c13d831ec780b844a9059cbb0000000000000000000000003aef01db231c3c9ff844f7e611c63b8c36bc6a02000000000000000000000000000000000000000000000000000000003b9aca0025a0b68242ca43996b4518a948c56a41f1c27fc6b4112cacf1e89e491068b40af34ea06bac55ab44cf039da95f4d09e7fa525125bcea32eee19994d59637c7878f9251"
// network.broadcast(rawTx)
//     .then(function(resp){
//         console.log(resp)
//     })

//basic
// network.getTransaction("0x06d3de5c93e87f1541d97773efa93b3afaa99b464c4aa6ef606df9234f1afaf7")
//     .then(function(resp){
//         console.log(resp)
//     })

//thorchain is approved
// let routerAddy = "0x42A5Ed456650a09Dc10EBc6361A7480fDd61f27B"
// let masterAddy = "0x3e485e2c7df712ec170c087ecf5c15016a03f93f"
// let tokenAddress = "DAC17F958D2EE523A2206206994597C13D831EC7"

// console.log({routerAddy,masterAddy})
//
// network.getAllowance(tokenAddress,routerAddy,masterAddy)
//     .then(function(resp){
//         console.log(resp)
//     })


//DEX


//get LP position by address
// network.getPoolPositions("0x33b35c665496ba8e71b22373843376740401f106")
//     .then(function(resp){
//         console.log(resp)
//     })

//get all tokens by address
// network.getAllTokensEth("0x33b35c665496ba8e71b22373843376740401f106")
//     .then(function(resp){
//         console.log(resp)
//     })

//Asgard exchange calls

//estimateFee

// let params = ["0xa13beb789f721253077faefd9bf604e1929e0e74", "0x0000000000000000000000000000000000000000", "95902294448256260", "=:BTC.BTC:0x3e485e2c7df712ec170c087ecf5c15016a03f93f"]
//
// //estimateFee
// let asset = {
//         chain:"ETH",
//         symbol:"ETH",
//         ticker:"ETH",
//     }
//
// network.estimateFee(asset,params)
//     .then(function(resp){
//         console.log(resp)
//     })

// let asset = {
//         chain:"ETH",
//         symbol:"ETH",
//         ticker:"ETH",
//     }
//
// let swap = {
//     asset,
//     vaultAddress:"0xa13beb789f721253077faefd9bf604e1929e0e74",
//     toAddress:"0x3e485e2c7df712ec170c087ecf5c15016a03f93f"
// }

// let swap = {
//     inboundAddress: {
//         chain: 'ETH',
//         pub_key: 'tthorpub1addwnpepqvuy8vh6yj4h28xp6gfpjsztpj6p46y2rs0763t6uw9f6lkky0ly5uvwla6',
//         address: '0x36286e570c412531aad366154eea9867b0e71755',
//         router: '0x9d496De78837f5a2bA64Cb40E62c19FBcB67f55a',
//         halted: false
//     },
//     asset: {
//         chain: 'ETH',
//         symbol: 'ETH',
//         ticker: 'ETH',
//         iconPath: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png'
//     },
//     memo: '=:THOR.RUNE:tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh',
//     //amount: 100000
//     amount: "0.0123"
// }
//
// network.getMemoEncoded(swap)
//     .then(function(resp){
//         console.log("data: ",resp)
//     })

//TODO getFees needs a tx template
// let entry = {
//     asset: {
//         chain:"ETH",
//         symbol:"ETH",
//         ticker:"ETH",
//     },
//     amount: BaseAmount;
//     recipient: Address;
//     memo?: string;
// }

// let entry = {"asset":{"chain":"ETH","symbol":"ETH","ticker":"ETH","iconPath":"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png"},"amount":{"type":"BASE","decimal":8,amount:function(){return .98}},"recipient":"0x8b09ee8b5e96c6412e36ba02e98497efe48a29be"}
// let entry = {"asset":{"chain":"ETH","symbol":"ETH","ticker":"ETH","iconPath":"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png"},"amount":{"type":"BASE","decimal":8},"recipient":"0x8b09ee8b5e96c6412e36ba02e98497efe48a29be"}
//

// let entry = {
//     asset: { chain: 'ETH', symbol: 'ETH', ticker: 'ETH' },
//     amount: 0.0641287519747189,
//     recipient: '0x8b09ee8b5e96c6412e36BA02E98497eFe48A29BE'
// }
//
// network.getFees(entry)
//     .then(function(resp){
//         console.log(resp)
//     })


// network.sendToAddress(address,amount,asset,memo)
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })

// //getBalance
// let address = "0x662ac3362623d72de57668dbf34ed7df913032c5"
// network.getBalance(address)
//     .then(function(resp){
//         console.log(resp)
//     })
//
// network.getNonce(address)
//     .then(function(resp){
//         console.log(resp)
//     })
//
network.getGasPrice()
    .then(function(resp){
        console.log(resp)
    })

//
// //getBalanceAddress
// network.getBalanceAddress(address)
//     .then(function(resp){
//         console.log(resp)
//     })

//getBalanceToken
// network.getBalanceToken(address,"FOX")
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getBalanceTokens(address)
//     .then(function(resp){
//         console.log(resp)
//     })
