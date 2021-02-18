/*
       Global Token info

 */



//get all token symbols
let fs = require('fs')
let coins = require('@pioneer-platform/pioneer-eth-token-raw')
let tokenListABI = Object.keys(coins)
const log = require("@pioneer-platform/loggerdog")()



let ABI_GLOBAL:any = {}
let tokenList:any = []
let contracts:any = []
let tokenMap:any = {}
for (let i = 0; i < tokenListABI.length; i++) {
    let token = tokenListABI[i]
    tokenList.push(token)

    ABI_GLOBAL[token] = coins[token]
    tokenMap[ABI_GLOBAL[token].metaData.contractAddress.toLowerCase()] = token
    contracts.push(ABI_GLOBAL[token].metaData.contractAddress.toLowerCase())
}

// log.debug("tokenList: ",tokenList)
// log.debug("tokenList: ",ABI_GLOBAL)
// log.debug("contracts: ",contracts)
// log.debug("tokenMap: ",tokenMap)

module.exports = {
    ABI:ABI_GLOBAL,
    tokens:tokenList,
    contracts,
    tokenMap
}

