
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

// import * as config ""
let {
    supportedBlockchains,
    supportedAssets,
    baseAmountToNative,
    nativeToBaseAmount,
    getPaths,
    get_address_from_xpub,
    normalize_pubkeys,
    getNativeAssetForBlockchain
} = require('../lib/index.js')



let amountNative = 12000
// console.log("base: ",baseAmountToNative("BTC",amountNative))
// console.log("base: ",nativeToBaseAmount("BTC",amountNative))

let paths = getPaths(['bitcoin','ethereum','thorchain','bitcoincash','litecoin','binance'])
console.log("paths: ",paths)
//
// console.log("supportedAssets: ",supportedAssets)
//console.log("supportedBlockchains: ",supportedBlockchains)

//console.log(getPaths())

//get
let result = [
    {
        xpub: 'xpub6D1weXBcFAo8CqBbpP4TbH5sxQH8ZkqC5pDEvJ95rNNBZC9zrKmZP2fXMuve7ZRBe18pWQQsGg68jkq24mZchHwYENd8cCiSb71u3KD4AFH'
    },
    {
        xpub: 'xpub6D54vV8eUYHMVBZCnz4SLjuiQngXURVCGKKGoJrWUDRegdMByLTJKfRs64q3UKiQCsSHJPtCQehTvERczdghS7gb8oedWSyNDtBU1zYDJtb'
    },
    {
        xpub: 'xpub6FkHm9bKQbvo1T28h8haU9iXBojqejUsS5JEvdmaDnbyfYN6jLd9M8VrhMS8ibEHcpTefHu9yxC7rfffLeWPS4jDqT1Vq5r2k3D9ySwm4uL'
    },
    {
        xpub: 'xpub6FkHm9bKQbvo1T28h8haU9iXBojqejUsS5JEvdmaDnbyfYN6jLd9M8VrhMS8ibEHcpTefHu9yxC7rfffLeWPS4jDqT1Vq5r2k3D9ySwm4uL'
    },
    {
        xpub: 'xpub6CAgnVoFsaZ3iMaW4jmUpvCvduYGEF1b2g5PQjBQ6oWWyqEpufNRMBN1b4MQaWubnGAnTBt1pEQSwAUaFxNz8B6Ct8fq5s6RYhshNMYK4uk'
    }
]

let run_test = async function(){
    try{
        let pubkeys = await normalize_pubkeys('keepkey',result,paths)

        console.log("pubkeys: ",pubkeys)
    }catch(e){
        console.error(e)
    }
}
run_test()


// let xpub = "xpub6D1weXBcFAo8CqBbpP4TbH5sxQH8ZkqC5pDEvJ95rNNBZC9zrKmZP2fXMuve7ZRBe18pWQQsGg68jkq24mZchHwYENd8cCiSb71u3KD4AFH"
// let scriptType = "p2pkh"
// let coin = "BTC"
// let account = 0
// let index = 0
// let isTestnet = true
//
// get_address_from_xpub(xpub,scriptType,coin,account,index,false,isTestnet)
//     .then(function(address){
//         console.log("address: ",address)
//     })


