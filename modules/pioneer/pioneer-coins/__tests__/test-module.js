
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

// import * as config ""
let {
    xpubConvert,
    supportedBlockchains,
    supportedAssets,
    baseAmountToNative,
    nativeToBaseAmount,
    getPaths,
    classifyPubkey,
    get_address_from_xpub,
    bip32ToAddressNList,
    addressNListToBIP32,
    normalize_pubkeys,
    PoSchains,
    getNativeAssetForBlockchain,
    getExplorerTxUrl,
    needsMemoByNetwork
} = require('../lib/index.js')

//cosmos
// let network = 'cosmos'
// let txid = '44847A59D197E929D97F93A72723EE50929452F9F1F21B8A03BFD6D5E1C526A4'

//thorchain
let network = 'thorchain'
let txid = 'DA5917E7AC958E8592B15E92810A2DE6BEF75ACE409FA3EF7C11ACFFFE3D1DCF'

// let explorerUrl = getExplorerTxUrl(network,txid,false)
// console.log("explorerUrl: ",explorerUrl)

let needsMemo = needsMemoByNetwork(network)
console.log("needsMemo: ",needsMemo)

// console.log(PoSchains['Osmosis'])


let addressNlist = [
    2147483732,
    2147483648,
    2147483648,
    1,
    18
]

// let addressNlist = [
//         2147483692,
//         2147483648,
//         2147483648,
//         0,
//         0
//     ]

// console.log(addressNListToBIP32(addressNlist))

//convert
//console.log(xpubConvert("xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4",'zpub'))
//console.log(xpubConvert(process.env['XPUB_TEST_BROKE'],'ypub'))

// let amountNative = "1206615928659277"
// console.log("base: ",baseAmountToNative("BTC",amountNative))
// console.log("base: ",nativeToBaseAmount("ETH",amountNative))
//
// let paths = getPaths(['osmosis'])
// let paths = getPaths(['cosmos'])

// let paths = getPaths(['terra'])
// console.log("paths: ",paths)

// let paths = getPaths(['osmosis'])
// console.log("paths: ",paths)

// let address = "1Fmmv93JHmMDF7FwZraQtMSyDjGe7SiXAL"
// // let address = "SVyBFjLF4za7kmVDYvVNCiqRJAArJDe7pY"
// console.log(classifyPubkey(address))


// // console.log("supportedAssets: ",supportedAssets)
// //console.log("supportedBlockchains: ",supportedBlockchains)
//
// //console.log(getPaths())
//
// //get
// let result = [
//     {
//         xpub: 'xpub6CbHtkFXTk5sJtSGShj48f3pWpqe1XXdnrFQusS4JC5WHSjong83E2Mm37zrZkMVMJcx7K5ACodZUQGqepGy6Fbu5DNRN3m3HWcHnT44dRD'
//     },
//     {
//         xpub: 'xpub6Bf8Sx3kwr64FNcVPdX3hXnSqUpTgMRKdy8DmXqH6ucF8tJXq3bQfQC2HtxSxqgnePuGQ3LYFHt5imw9V2Wnc5ypPYxTeAYKa2Y3WuWcByj'
//     },
//     {
//         xpub: 'xpub6G5eZd31CkbSBC9ZTD8zrSiBjyHiPM23rejNV37iBHnuGzYWiv94f9LgZyVHm7ysVeHPWmZWSWScHiVSCyBc6ebcogCivss8Tys8LPtmvGv'
//     },
//     {
//         xpub: 'xpub6FjMZmNXj8meezdSUWudQ3WSUfRNwfN9Eodu9h8ijz7p1FKhg1UxxPdbAYAS1Se3ybG5pfEGAUukRkV1mubLH3819jQqhjM14qnymNCAhDi'
//     },
//     {
//         xpub: 'xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K'
//     },
//     {
//         xpub: 'xpub6CqACLchVFzXdgKnuWrEun6oC65wmmC1XJy22xb9NSXFPDmb3gcECi17SVptNujJ1uqN8iY8JpWkhpzXxGSMokYjf3UEYjq5GGqrVqbgjfr'
//     },
//     {
//         xpub: 'xpub6CqACLchVFzXdgKnuWrEun6oC65wmmC1XJy22xb9NSXFPDmb3gcECi17SVptNujJ1uqN8iY8JpWkhpzXxGSMokYjf3UEYjq5GGqrVqbgjfr'
//     },
//     {
//         xpub: 'xpub6CqACLchVFzXdgKnuWrEun6oC65wmmC1XJy22xb9NSXFPDmb3gcECi17SVptNujJ1uqN8iY8JpWkhpzXxGSMokYjf3UEYjq5GGqrVqbgjfr'
//     },
//     {
//         xpub: 'xpub6CqACLchVFzXdgKnuWrEun6oC65wmmC1XJy22xb9NSXFPDmb3gcECi17SVptNujJ1uqN8iY8JpWkhpzXxGSMokYjf3UEYjq5GGqrVqbgjfr'
//     }
// ]

// let result = [
//     {
//         xpub: 'xpub6GwgnAd4WBhEHue6mbEpii3T3muSUcHetMqpqdyTQNJJyLAD1m26N2cXTzcBVuzFQV7jJKhBCyCwy2SP1tKHJMJYPQV3x4zb5pRA9pudABE'
//     }
// ]
//
// let run_test = async function(){
//     try{
//         console.log("expected pubkey: 03bee3af30e53a73f38abc5a2fcdac426d7b04eb72a8ebd3b01992e2d206e24ad8")
//         let pubkeys = await normalize_pubkeys('keepkey',result,paths)
//
//         console.log("pubkeys: ",pubkeys)
//     }catch(e){
//         console.error(e)
//     }
// }
// run_test()
//
//
// let xpub = "xpub6D1weXBcFAo8CqBbpP4TbH5sxQH8ZkqC5pDEvJ95rNNBZC9zrKmZP2fXMuve7ZRBe18pWQQsGg68jkq24mZchHwYENd8cCiSb71u3KD4AFH"
// let scriptType = "legacy"
// let coin = "BTC"
// let account = 0
// let index = 0
// let isTestnet = false
//
// get_address_from_xpub(xpub,scriptType,coin,account,index,false,isTestnet)
//     .then(function(address){
//         console.log("address: ",address)
//     })


