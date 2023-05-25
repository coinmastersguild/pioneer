
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
require("dotenv").config({path:'../../../../../../.env'})

//ETC
//BSC

let network = require("../lib/index")
network.init()
// let run_test = async function(){
//     try{
//         await network.init()
//
//         //check is address elgible
//
//         // network.getInfo()
//         //     .then(function(resp){
//         //         console.log(resp)
//         //     })
//
//         let address = "0x33b35c665496bA8E71B22373843376740401F106"
//
//         network.getBalances(address)
//             .then(function(resp){
//                 console.log(resp)
//             })
//
//     }catch(e){
//
//     }
// }
// run_test()

//0x33b35c665496bA8E71B22373843376740401F106
//0x2356A15042F98f0a53784F42237bd4b2873AADCF
let address = "0x2356A15042F98f0a53784F42237bd4b2873AADCF"

network.getBalance(address)
    .then(function(resp){
        console.log(resp)
    })

//already claimed
// let address = "0x57e5551F5c9FB975C44Be80c27eA924c91701616"
//elgable
//let address = "0xc8bD3e67E3963B149B02b028511789f0Cc6A502E"
//let address = "0x9e6316f44baeeee5d41a1070516cc5fa47baf227"

// let tx = "0x02f87482a86a808459682f00850bfda3a30082520894c3affff54122658b89c31183cec4f15514f34624872386f26fc1000080c080a0dfa0b07cfddb2422b05d51f680839c5820c267974bcb761d5399c79d3f1c8025a010a6c76bb04d6dc671e01bb26a135748e0d8b26cd30d27e317dae57ccafd5a64"
// network.decodeTx(tx)
//     .then(function(resp){
//         console.log(JSON.stringify(resp))
//     })

// network.checkAirdropClaim(address)
//     .then(function(resp){
//         console.log(resp)
//     })

//build claim tx
// network.buildAirdropClaim(address)
//     .then(function(resp){
//         console.log(resp)
//         if(resp === "0x2e7ba6ef0000000000000000000000000000000000000000000000000000000000010fc1000000000000000000000000c8bd3e67e3963b149b02b028511789f0cc6a502e00000000000000000000000000000000000000000000000821ab0d4414980000000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000116958681ef852839a25c30b22409721a05c10c823ed0504a194d2f162c9b75c24d0d1461d608c1258caf1ec5270476e3e9c6f17c678b65c1a9af3cc82e05893228d5837924e8c8aa67e1e440796662ea07e9f837a11586d9cdb53e3160ff5974ab782e5aca30d245d6be16515938b6e2a9ae0e4300b813da2c7e392f1c75459515c3c0997e77befde7d53e418f4ebb6d4a6e71fcbf8169ea46f102fcc6768aabc5c996b6777de25fcf39258cfe0a5917f3901e7db7b5d2f1d2e72e0950873c59dc6051ae67f9700d6d3d8f7cb112b853627300fc3d037c211e74968477263039987d4f1e0f8a211cc665d6f3cf96071ea2cdfc57aa6f0fa8f8f2d24d021a28ebdbaddc1d9e6cefeb1e619240513ffd7681f2d3d25163e7830cbb8de9ac25d7bcc22a6f2b744f9873611c9562d6e8763d892d4df4443cd2a6b599edf601f9bd85699745c32af7e1890968bd7a01cdda66534db6bf79dd89819410e1cf8f84e367a4b18589c92902501701a9f41e7f578dcaff2a00cd447b711db25776c7ccecc91ab9110b415d119c5f0b28b32e09f4013f86f0f030015ac0a5295c2fd66ffdb71968b0dd9dcfb736331c06536141b1b81c59835bffa579afa5d68fe074d3f824f08137fe1254397919eba73ccd54b615a545385a60094bdc53bc3954711b6ecf4e47401baec05b8685e717f4cc4e6ee581ef36d2a798dc4c2faf7d05bb67b55456b940e119f0ab96e95d52420bd5d7db0b2b8c8d344a16fb3595546eafb51adfe"){
//             console.log("WINNING!")
//         }
//     })

//get symbol from contract
// network.getSymbolFromContract('0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d')
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getStreamInfo('')
//     .then(function(resp){
//         console.log(resp)
//     })

//getPoolPositions
// network.getPoolPositions('0x33b35c665496ba8e71b22373843376740401f106')
//     .then(function(resp){
//         console.log(resp)
//     })

//
// network.getPercentPool(1000,0.1,'0x470e8de2ebaef52014a47cb5e6af86884947f08c')
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

//

let rawTx = "0xf9017a098902756c00bb59638000830186a0948f66c4ae756bebc49ec8b81966dd8bba9f1275498828558e23e82c34f0b901041fece7b4000000000000000000000000c646adcb54229c2deda096d2187a779a5ef969e9000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000028558e23e82c34f000000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000041733a4554482e4554483a3078313431443939353963416533383533623033353030303439304330333939316542373046633461433a313435343134333a73733a3000000000000000000000000000000000000000000000000000000000000000830150f7a021b00f22cddf92f0a9c53bd670429780c607da4b4123f573f7b0d9b2dd508089a05e2979b2e96150b1cde9cbb6cc9b0f78b4d869e30627409230284dd603968ae0"
network.broadcast(rawTx)
    .then(function(resp){
        console.log(resp)
    })

//basic
// network.getTransaction("0x1d25efc5bfe99e02ab99c003ecc78dcd3452c4bc2d457fc3ba2b50fba782e643")
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
// network.getGasPrice()
//     .then(function(resp){
//         console.log(resp)
//     })

//
// //getBalanceAddress
// network.getBalanceAddress(address)
//     .then(function(resp){
//         console.log(resp)
//     })

//getBalanceToken
// network.getBalanceToken(address,"0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7")
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getBalanceTokens(address)
//     .then(function(resp){
//         console.log(resp)
//     })
