
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

var txDecoder = require('ethereum-tx-decoder');

// let rawTx = "0x02f86d82a86a01846b49d200850e63912a0082520894a44c286ba83bb771cd0107b2c1df678435bd15358080c001a0179c2ffec1899376c3cbf0e489cd5ffada3248f06b621b48913dc8b546da8a04a03fa70e05d9244f8f23684004a938902652dfbbd3ece3bc7f0dacada9da5a0516"
// var decodedTx = txDecoder.decodeTx(rawTx);

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
    needsMemoByNetwork,
    addressInfoForCoin,
} = require('../lib/index.js')

//
let blockchains = [
    // "eip155:42161/slip44:60",
    // "eip155:43114/slip44:60",
    // "binance:bnb-beacon-chain/slip44:118",
    // "eip155:56/slip44:60",
    // "bip122:000000000019d6689c085ae165831e93/slip44:0",
    // "bip122:000000000000000000651ef99cb9fcbe/slip44:145",
    // "cosmos:cosmoshub-4/slip44:118",
    // "bip122:00000000001a91e3dace36e2be3bf030/slip44:3",
    // "eip155:1/slip44:118",
    // "bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2",
    // "eip155:10/slip44:60",
    // "eip155:137/slip44:60",
    // "cosmos:thorchain-mainnet-v1/slip44:931",
    'cosmos:mayachain-mainnet-v1',
    "bip122:000007d91d1254d60e2dd1ae58038307"
]
let paths = getPaths(blockchains)
console.log(paths)

//addressInfo
// let coin = 'ETH'
// let coin = 'BTC'
let coin = 'BASE'
// let coin = 'DOGE'
// let coin = 'DASH'
// let coin = 'RUNE'
// let coin = 'THOR'
// let coin = 'GAIA'
// let coin = 'ARB'
// let addressInfo = addressInfoForCoin(coin, false, 'p2wpkh')
// // // let addressInfo = addressInfoForCoin(coin, false)
// console.log("addressInfo: ",addressInfo)

// let addressNList = [
//     2147483692,
//     2147483708,
//     2147483648,
//     0,
//     0
// ]
// let addressNList = [2147483732, 2147483648, 2147483648, 0, 0]
// let addressNList = [2147483692, 2147483648, 2147483648, 0, 0]
// let path = addressNListToBIP32(addressNList)
// console.log(path)

//cosmos
// let network = 'cosmos'
// let txid = '44847A59D197E929D97F93A72723EE50929452F9F1F21B8A03BFD6D5E1C526A4'

//thorchain
// let network = 'thorchain'
// let txid = 'DA5917E7AC958E8592B15E92810A2DE6BEF75ACE409FA3EF7C11ACFFFE3D1DCF'

// let explorerUrl = getExplorerTxUrl(network,txid,false)
// console.log("explorerUrl: ",explorerUrl)

// let needsMemo = needsMemoByNetwork(network)
// console.log("needsMemo: ",needsMemo)

// console.log(PoSchains['Osmosis'])

// let addressNlist = [2147483692, 2147483708, 2147483648, 0, 0]

// let addressNlist = [
//     2147483732,
//     2147483648,
//     2147483648,
//     1,
//     18
// ]

// let addressNlist = [
//         2147483692,
//         2147483648,
//         2147483648,
//         0,
//         0
//     ]

// let addressNlist = [2147483692, 2147483648, 2147483648, 0, 0]
// // let addressNlist =    [ 2147483692, 2147483708, 2147483648, 0, 0 ]
// //

// let addressNlist = [
//     2147483732, 2147483648, 2147483648, 0, 0
// ]
// console.log(addressNListToBIP32(addressNlist))

// let bip32 = `m/44'/144'/0'/0/0`
// let bip32 = `m/44'/914'/0'/0/0`
// console.log(bip32ToAddressNList(bip32))
let xpub = "xpub6D6UctxqkwVv1sTLwvEfJJJnGEKC6XiKbRfwzsYgWmXGAEwPQ7T2cWzRggxVsHjYzA4m33d7VzgPZyNpW5SFmmjY1g8EFFVwy8CtN8xGhTS"
console.log("zpub",xpubConvert(xpub,'zpub'))
//convert
//console.log(xpubConvert("xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4",'zpub'))
//console.log(xpubConvert(process.env['XPUB_TEST_BROKE'],'ypub'))

// let amountNative = "1206615928659277"
// console.log("base: ",baseAmountToNative("BTC",amountNative))
// console.log("base: ",nativeToBaseAmount("ETH",amountNative))
//
// let paths = getPaths(['mayachain-mainnet-v1'])
//
// // // let paths = getPaths(['cosmos'])
// //
// // // let paths = getPaths(['terra'])
// // console.log("paths: ",paths)
//
// // let paths = getPaths(['osmosis'])
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


