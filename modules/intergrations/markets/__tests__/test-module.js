/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let markets = require("../lib")


let run_test = async function(){
    try{

        let price = await markets.getPrice('thorchain')
        console.log("price: ",price)
        




        // //get config
        // let marketInfoCoinCap = await markets.getAssetsCoinCap()
        // // marketInfoCoinCap = JSON.stringify(marketInfoCoinCap)
        // console.log("marketInfoCoinCap: ",marketInfoCoinCap)
        //
        // let marketInfoCoinGecko = await markets.getAssetsCoingecko(1000,0)
        // // marketInfoCoinGecko = JSON.stringify(marketInfoCoinGecko)
        // console.log("marketInfoCoinGecko: ",Object.keys(marketInfoCoinGecko).length)
        //
        // //build Portfolio
        // // let pubkeys = [{"blockchain":"bitcoin","symbol":"BTC","asset":"BTC","path":"m/84'/0'/0'","pathMaster":"m/84'/0'/0'/0/0","master":"bc1qx2grtsuukf6wh8x65e3202cw42hp2cftccmapu","pubkey":"zpub6rLj8yHs3mXRYSGNBSbajrkwghwLtpZLJf16q8bETA2mhZsMQdcPhXE4QQJAkQMAv8wpVeZYWqm3V45zzyAYS7exCugndVv8F8PmGfBTC5i","script_type":"p2wpkh","network":"bitcoin","created":1656487707652,"tags":["sdk:test-user-1234","bitcoin","bitcoin","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"BTC","asset":"BTC","isToken":false,"lastUpdated":1656487707891,"balance":0.01133734}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"},{"blockchain":"bitcoin","symbol":"BTC","asset":"BTC","path":"m/44'/0'/0'","pathMaster":"m/44'/0'/0'/0/0","master":"1LUEqRQv9NJZsfwEM2qqGrW4TVw5QeJd5r","pubkey":"xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4","script_type":"p2pkh","network":"bitcoin","created":1656487707767,"tags":["sdk:test-user-1234","bitcoin","bitcoin","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"BTC","asset":"BTC","isToken":false,"lastUpdated":1656487707975,"balance":0}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"},{"blockchain":"ethereum","symbol":"ETH","asset":"ETH","path":"m/44'/60'/0'","pathMaster":"m/44'/60'/0'/0/0","master":"0x33b35c665496bA8E71B22373843376740401F106","pubkey":"0x33b35c665496bA8E71B22373843376740401F106","script_type":"ethereum","network":"ethereum","created":1656487707783,"tags":["sdk:test-user-1234","ethereum","ethereum","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"ETH","type":"ERC20","asset":"OMG","symbol":"OMG","name":"OMGToken","contract":"0xd26114cd6EE289AccF82350c8d8487fedB8A0C07","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":0.010302983031201932,"balanceNative":0.010302983031201932,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"SALT","symbol":"SALT","name":"Salt","contract":"0x4156D3342D5c385a87D264F90653733592000581","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":8,"balance":1,"balanceNative":1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"XNN","symbol":"XNN","name":"XENON","contract":"0xab95E915c123fdEd5BDfB6325e35ef5515F1EA69","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":64.20275015233722,"balanceNative":64.20275015233722,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"FPV","symbol":"FPV","name":"Feisty Phish Votes","contract":"0x3d5F5CB31987365fDa0be822327F0552C7699495","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":8,"balance":16440000,"balanceNative":16440000,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"REP","symbol":"REP","name":"Reputation","contract":"0xE94327D07Fc17907b4DB788E5aDf2ed424adDff6","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":0.1,"balanceNative":0.1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"GNT","symbol":"GNT","name":"Golem Network Token","contract":"0xa74476443119A942dE498590Fe1f2454d7D4aC0d","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":138.66066,"balanceNative":138.66066,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"LPT","symbol":"LPT","name":"Livepeer Token","contract":"0x58b6A8A3302369DAEc383334672404Ee733aB239","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":0.0891142630513177,"balanceNative":0.0891142630513177,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"WINGS","symbol":"WINGS","name":"WINGS","contract":"0x667088b212ce3d06a1b553a7221E1fD19000d9aF","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":1,"balanceNative":1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"GUP","symbol":"GUP","name":"Guppy","contract":"0xf7B098298f7C69Fc14610bf71d5e02c60792894C","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":3,"balance":1,"balanceNative":1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"RLC","symbol":"RLC","name":"iEx.ec Network Token","contract":"0x607F4C5BB672230e8672085532f7e901544a7375","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":9,"balance":2.919883895,"balanceNative":2.919883895,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"BNT","symbol":"BNT","name":"Bancor Network Token","contract":"0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":0.5,"balanceNative":0.5,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"SNT","symbol":"SNT","name":"Status Network Token","contract":"0x744d70FDBE2Ba4CF95131626614a1763DF805B9E","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":0.5,"balanceNative":0.5,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"NMR","symbol":"NMR","name":"Numeraire","contract":"0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":1,"balanceNative":1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"MTL","symbol":"MTL","name":"Metal","contract":"0xF433089366899D83a9f26A773D59ec7eCF30355e","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":8,"balance":2,"balanceNative":2,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"FUN","symbol":"FUN","name":"FunFair","contract":"0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":8,"balance":1,"balanceNative":1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"PAY","symbol":"PAY","name":"TenX Pay Token","contract":"0xB97048628DB6B661D4C2aA833e95Dbe1A905B280","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":2,"balanceNative":2,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"1ST","symbol":"1ST","name":"FirstBlood Token","contract":"0xAf30D2a7E90d7DC361c8C4585e9BB7D2F6f15bc7","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":1.01,"balanceNative":1.01,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"AE","symbol":"AE","name":"Aeternity","contract":"0x5CA9a71B1d01849C0a95490Cc00559717fCF0D1d","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":2,"balanceNative":2,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"POLY","symbol":"POLY","name":"Polymath","contract":"0x9992eC3cF6A55b00978cdDF2b27BC6882d88D1eC","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":18,"balance":2.01,"balanceNative":2.01,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"ZIL","symbol":"ZIL","name":"Zilliqa","contract":"0x05f4a42e251f2d52b8ed15E9FEdAacFcEF1FAD27","isToken":true,"protocal":"erc20","lastUpdated":1656487708556,"decimals":12,"balance":3,"balanceNative":3,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"STORJ","symbol":"STORJ","name":"StorjToken","contract":"0xB64ef51C888972c908CFacf59B47C1AfBC0Ab8aC","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":8,"balance":1.91,"balanceNative":1.91,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"AZ","symbol":"AZ","name":"Azbit","contract":"0x77FE30b2cf39245267C0a5084B66a560f1cF9E1f","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":8888,"balanceNative":8888,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"AOA","symbol":"AOA","name":"Aurora","contract":"0x9ab165D795019b6d8B3e971DdA91071421305e5a","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":7,"balanceNative":7,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"MANA","symbol":"MANA","name":"Decentraland MANA","contract":"0x0F5D2fB29fb7d3CFeE444a200298f468908cC942","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":1.02,"balanceNative":1.02,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"ETHS","symbol":"ETHS","name":"Ethercash（以太现金）","contract":"0xA2dcA1505b07e39F96Ce41E875b447F46D50C6fc","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":1,"balanceNative":1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"BFB","symbol":"BFB","name":"Bi Fu Bao","contract":"0x6cF6bbCf0e0e6d9d3801858ec1d9C9D93D396948","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":0.1,"balanceNative":0.1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"FOMO","symbol":"FOMO","name":"Fomopoints","contract":"0x3F72bBA888Da894E73523DaA9735596725c15518","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":8,"balance":41999998999,"balanceNative":41999998999,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"cDAI","symbol":"cDAI","name":"Compound Dai","contract":"0xF5DCe57282A584D2746FaF1593d3121Fcac444dC","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":8,"balance":0.18162496,"balanceNative":0.18162496,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"FOX","symbol":"FOX","name":"FOX","contract":"0xc770EEfAd204B5180dF6a14Ee197D99d808ee52d","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":554.5815692117202,"balanceNative":554.5815692117202,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"HERC","symbol":"HERC","name":"Hercules","contract":"0x2e91E3e54C5788e9FdD6A181497FDcEa1De1bcc1","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":200,"balanceNative":200,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"DAI","symbol":"DAI","name":"Dai Stablecoin","contract":"0x6B175474E89094C44Da98b954EedeAC495271d0F","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":4.5358838904818635,"balanceNative":4.5358838904818635,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"KICK","symbol":"KICK","name":"KickToken","contract":"0xC12D1c73eE7DC3615BA4e37E4ABFdbDDFA38907E","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":8,"balance":888888,"balanceNative":888888,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"STT","symbol":"STT","name":"Scatter.cx","contract":"0xaC9Bb427953aC7FDDC562ADcA86CF42D988047Fd","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":1,"balanceNative":1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"USDC","symbol":"USDC","name":"USD Coin","contract":"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":6,"balance":5.056513,"balanceNative":5.056513,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"USDT","symbol":"USDT","name":"Tether USD","contract":"0xdAC17F958D2ee523a2206206994597C13D831ec7","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":6,"balance":13.143539,"balanceNative":13.143539,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"DIGI","symbol":"DIGI","name":"Digiverse","contract":"0xE03B4386b75E121e04D580D6b8376CEeE0615ca8","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":15412.727063305201,"balanceNative":15412.727063305201,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"USDP","symbol":"USDP","name":"Pax Dollar","contract":"0x8E870D67F660D95d5be530380D0eC0bd388289E1","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":18,"balance":0.13500300717118946,"balanceNative":0.13500300717118946,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"XPR","symbol":"XPR","name":"Proton","contract":"0xD7EFB00d12C2c13131FD319336Fdf952525dA2af","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":4,"balance":1,"balanceNative":1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"MNE","symbol":"MNE","name":"Minereum","contract":"0xc92e74b131D7b1D46E60e07F3FaE5d8877Dd03F0","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":8,"balance":32000,"balanceNative":32000,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"HEX","symbol":"HEX","name":"HEX","contract":"0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":8,"balance":100,"balanceNative":100,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"MNE","symbol":"MNE","name":"Minereum","contract":"0x426CA1eA2406c07d75Db9585F22781c096e3d0E0","isToken":true,"protocal":"erc20","lastUpdated":1656487708557,"decimals":8,"balance":32000,"balanceNative":32000,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"CVC","symbol":"CVC","name":"Civic","contract":"0x41e5560054824eA6B0732E656E3Ad64E20e94E45","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":8,"balance":0.5,"balanceNative":0.5,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"DNT","symbol":"DNT","name":"district0x Network Token","contract":"0x0AbdAce70D3790235af448C88547603b945604ea","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":1,"balanceNative":1,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"cDAI","symbol":"cDAI","name":"Compound Dai","contract":"0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":8,"balance":48.58979796,"balanceNative":48.58979796,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"KNC","symbol":"KNC","name":"Kyber Network Crystal","contract":"0xdd974D5C2e2928deA5F71b9825b8b646686BD200","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":0.01,"balanceNative":0.01,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"LINK","symbol":"LINK","name":"ChainLink Token","contract":"0x514910771AF9Ca656af840dff83E8264EcF986CA","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":0.01,"balanceNative":0.01,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"PAXG","symbol":"PAXG","name":"Paxos Gold","contract":"0x45804880De22913dAFE09f4980848ECE6EcbAf78","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":0.009998,"balanceNative":0.009998,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"RCN","symbol":"RCN","name":"Ripio Credit Network Token","contract":"0xF970b8E36e23F7fC3FD752EeA86f8Be8D83375A6","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":0.01,"balanceNative":0.01,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"CRD","symbol":"CRD","name":"CreditDefi","contract":"0x86E288793B6B9eb05f38758D166c44bF3d643Bcf","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":89,"balanceNative":89,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"UNI-V2","symbol":"UNI-V2","name":"Uniswap V2","contract":"0x18Ccd590735D73CBfAFFC497384995b5478013D1","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":0.005400258968941553,"balanceNative":0.005400258968941553,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"TKNT","symbol":"TKNT","name":"TKNT","contract":"0xbcE7BD79558dda90B261506768f265c5543A9f90","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":5,"balanceNative":5,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"FOL","symbol":"FOL","name":"Folder Coin","contract":"0xA8580F3363684d76055bdC6660CaeFe8709744e1","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":0.5,"balanceNative":0.5,"source":"ethplorer"},{"network":"ETH","type":"ERC20","asset":"SUSHI","symbol":"SUSHI","name":"SushiToken","contract":"0x6B3595068778DD592e39A122f4f5a5cF09C90fE2","isToken":true,"protocal":"erc20","lastUpdated":1656487708558,"decimals":18,"balance":6.333660107156622,"balanceNative":6.333660107156622,"source":"ethplorer"},{"network":"ETH","asset":"ETH","symbol":"ETH","isToken":false,"lastUpdated":1656487708623,"balance":0.050857084923180834,"source":"network"}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"},{"blockchain":"thorchain","symbol":"RUNE","asset":"RUNE","path":"m/44'/931'/0'/0/0","pathMaster":"m/44'/931'/0'/0/0","master":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","pubkey":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","script_type":"thorchain","network":"thorchain","created":1656487707791,"tags":["sdk:test-user-1234","thorchain","thorchain","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"RUNE","asset":"RUNE","symbol":"RUNE","isToken":false,"lastUpdated":1656487708563,"balance":0,"source":"network"}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"},{"blockchain":"cosmos","symbol":"ATOM","asset":"ATOM","path":"m/44'/118'/0'/0/0","pathMaster":"m/44'/118'/0'/0/0","master":"cosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3","pubkey":"cosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3","script_type":"bech32","network":"cosmos","created":1656487707801,"tags":["sdk:test-user-1234","cosmos","cosmos","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"ATOM","asset":"ATOM","symbol":"ATOM","isToken":false,"lastUpdated":1656487708758,"balance":0.490067,"source":"network"}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"},{"blockchain":"osmosis","symbol":"OSMO","asset":"OSMO","path":"m/44'/118'/0'/0/0","pathMaster":"m/44'/118'/0'/0/0","master":"NOT:SUPPORTED","pubkey":"NOT:SUPPORTED","script_type":"bech32","network":"osmosis","created":1656487707805,"tags":["sdk:test-user-1234","osmosis","osmosis","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"OSMO","asset":"OSMO","symbol":"OSMO","isToken":false,"lastUpdated":1656487708902,"balance":0,"source":"network"}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"},{"blockchain":"binance","symbol":"BNB","asset":"BNB","path":"m/44'/714'/0'/0/0","pathMaster":"m/44'/714'/0'/0/0","master":"bnb1gx3nyps3etlux8gpfzyqqalhrnak2z0al7qqrs","pubkey":"bnb1gx3nyps3etlux8gpfzyqqalhrnak2z0al7qqrs","script_type":"binance","network":"binance","created":1656487707808,"tags":["sdk:test-user-1234","binance","binance","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"BNB","asset":"BNB","symbol":"BNB","isToken":false,"lastUpdated":1656487708986,"balance":0,"source":"network"}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"},{"blockchain":"bitcoincash","symbol":"BCH","asset":"BCH","path":"m/44'/145'/0'","pathMaster":"m/44'/145'/0'/0/0","master":"bitcoincash:qrsggegsd2msfjaueml6n6vyx6awfg5j4qmj0u89hj","pubkey":"xpub6DQeaEQDZFKcrEucnZuzDsP4YPm9fdzNGEzRfwbeFNt5yWEvc2Eb2YMZMjmghJMnrMWT7iTevP2E1dTLUQfNrwk5mAycxXUfEqmJGpN1xFw","script_type":"p2pkh","network":"bitcoincash","created":1656487707809,"tags":["sdk:test-user-1234","bitcoincash","bitcoincash","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"BCH","asset":"BCH","isToken":false,"lastUpdated":1656487709408,"balance":null}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"},{"blockchain":"litecoin","symbol":"LTC","asset":"LTC","path":"m/44'/2'/0'","pathMaster":"m/44'/2'/0'/0/0","master":"LLe4PciAJgMMJSAtQQ5nkC13t6SSMmERJ3","pubkey":"xpub6Bo97ho6KgoQGRSqcDuB11uprYaj7NRvnDHmF4SXy8cSaUhEFpDW7Cm7dcGVMFp6GBsK2PsS5DkicZLjRhufwL9wVvddzMshmx13d7P1nr2","script_type":"p2pkh","network":"litecoin","created":1656487707812,"tags":["sdk:test-user-1234","litecoin","litecoin","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"LTC","asset":"LTC","isToken":false,"lastUpdated":1656487709364,"balance":null}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"},{"blockchain":"dogecoin","symbol":"DOGE","asset":"DOGE","path":"m/44'/3'/0'","pathMaster":"m/44'/3'/0'/0/0","master":"DRe5QWQkUcE7m9tsZNgo5Dp7TD7aDqMrBo","pubkey":"xpub6DGTSqsRMrKRCJzTgqS25xuKkZkMEJBh7h6Dx6YdmvWSCr13onXShqARNobQk32YkCtaZ8UpcEBMfqsNBxWTVpYYrssvKBBCaq8pR16Y83B","script_type":"p2pkh","network":"dogecoin","created":1656487707818,"tags":["sdk:test-user-1234","dogecoin","dogecoin","0x33b35c665496bA8E71B22373843376740401F106.wallet","user:d3cf3b9c"],"balances":[{"network":"DOGE","asset":"DOGE","isToken":false,"lastUpdated":1656487709869,"balance":null}],"context":"0x33b35c665496bA8E71B22373843376740401F106.wallet"}]
        //
        // let pubkeys =  [
        //     {
        //         symbol: 'AVAX',
        //         chain: 'AVAX',
        //         ticker: 'AVAX',
        //         type: 'Native',
        //         balance: '0.00018375',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'AVAX-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        //         chain: 'AVAX',
        //         ticker: 'AVAX',
        //         type: 'AVAX',
        //         balance: '0.00018375',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'AvaxClassic',
        //         chain: 'AVAX',
        //         ticker: 'AvaxClassic',
        //         type: 'AVAX',
        //         balance: '74.04175',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: '$ Free Claim and Play-0xd23345e0e6340616b1cf7200762d0289547ccf87',
        //         chain: 'AVAX',
        //         ticker: '$ Free Claim and Play',
        //         type: 'AVAX',
        //         balance: '500',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'BNB',
        //         chain: 'BNB',
        //         ticker: 'BNB',
        //         type: 'Native',
        //         balance: '0.03075992',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'BABYDOGE-0x43f102bbd52259f2cfd0ef82e8807e3610ae3e40',
        //         chain: 'BSC',
        //         ticker: 'BABYDOGE',
        //         type: 'BEP20',
        //         balance: '391197565.47720093',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'ETH',
        //         chain: 'ETH',
        //         ticker: 'ETH',
        //         type: 'Native',
        //         balance: '0.00537313',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'UNIV2Claim',
        //         chain: 'ETH',
        //         ticker: 'UNIV2Claim',
        //         type: 'ERC20',
        //         balance: '400.4',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'DAI-0x6b175474e89094c44da98b954eedeac495271d0f',
        //         chain: 'ETH',
        //         ticker: 'DAI',
        //         type: 'ERC20',
        //         balance: '2.89999991',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: '$ Visit NFTGiftX',
        //         chain: 'ETH',
        //         ticker: '$ Visit NFTGiftX',
        //         type: 'ERC20',
        //         balance: '4000.4',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'NOUNBR-0x36b2aa1795d8cdef4b784fe34045fadc45d61e8c',
        //         chain: 'ETH',
        //         ticker: 'NOUNBR',
        //         type: 'ERC20',
        //         balance: '1.1',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'FAU-0xfab46e002bbf0b4509813474841e0716e6730136',
        //         chain: 'ETH',
        //         ticker: 'FAU',
        //         type: 'ERC20',
        //         balance: '1000',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'LUSD-0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
        //         chain: 'ETH',
        //         ticker: 'LUSD',
        //         type: 'ERC20',
        //         balance: '2',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'OP',
        //         chain: 'OP',
        //         ticker: 'OP',
        //         type: 'Native',
        //         balance: '0.00000089',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        //         chain: 'OP',
        //         ticker: 'ETH',
        //         type: 'OPTIMISM',
        //         balance: '0.00000089',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'ETH-0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000',
        //         chain: 'OP',
        //         ticker: 'ETH',
        //         type: 'OPTIMISM',
        //         balance: '0.00000089',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'MATIC',
        //         chain: 'MATIC',
        //         ticker: 'MATIC',
        //         type: 'Native',
        //         balance: '2.83077868',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'MATIC-0x0000000000000000000000000000000000001010',
        //         chain: 'MATIC',
        //         ticker: 'MATIC',
        //         type: 'POLYGON',
        //         balance: '2.83077868',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'DAI-0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        //         chain: 'MATIC',
        //         ticker: 'DAI',
        //         type: 'POLYGON',
        //         balance: '0.97610475',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'MaticX-0xfa68fb4628dff1028cfec22b4162fccd0d45efb6',
        //         chain: 'MATIC',
        //         ticker: 'MaticX',
        //         type: 'POLYGON',
        //         balance: '0.93538774',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'AAVE-0xd6df932a45c0f255f85145f286ea0b292b21c90b',
        //         chain: 'MATIC',
        //         ticker: 'AAVE',
        //         type: 'POLYGON',
        //         balance: '0.00011825',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'uni-router',
        //         chain: 'MATIC',
        //         ticker: 'uni',
        //         type: 'POLYGON',
        //         balance: '10',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'BalancerV2',
        //         chain: 'MATIC',
        //         ticker: 'BalancerV2',
        //         type: 'POLYGON',
        //         balance: '325',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'RUNE',
        //         chain: 'THOR',
        //         ticker: 'RUNE',
        //         type: 'Native',
        //         balance: '1.9004648',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'AVAX',
        //         chain: 'AVAX',
        //         ticker: 'AVAX',
        //         type: 'Native',
        //         balance: '0.00018375',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'AVAX-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        //         chain: 'AVAX',
        //         ticker: 'AVAX',
        //         type: 'AVAX',
        //         balance: '0.00018375',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'AvaxClassic',
        //         chain: 'AVAX',
        //         ticker: 'AvaxClassic',
        //         type: 'AVAX',
        //         balance: '74.04175',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: '$ Free Claim and Play-0xd23345e0e6340616b1cf7200762d0289547ccf87',
        //         chain: 'AVAX',
        //         ticker: '$ Free Claim and Play',
        //         type: 'AVAX',
        //         balance: '500',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'BNB',
        //         chain: 'BNB',
        //         ticker: 'BNB',
        //         type: 'Native',
        //         balance: '0.03075992',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'BABYDOGE-0x43f102bbd52259f2cfd0ef82e8807e3610ae3e40',
        //         chain: 'BSC',
        //         ticker: 'BABYDOGE',
        //         type: 'BEP20',
        //         balance: '391197565.47720093',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'ETH',
        //         chain: 'ETH',
        //         ticker: 'ETH',
        //         type: 'Native',
        //         balance: '0.00537313',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'UNIV2Claim',
        //         chain: 'ETH',
        //         ticker: 'UNIV2Claim',
        //         type: 'ERC20',
        //         balance: '400.4',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'DAI-0x6b175474e89094c44da98b954eedeac495271d0f',
        //         chain: 'ETH',
        //         ticker: 'DAI',
        //         type: 'ERC20',
        //         balance: '2.89999991',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: '$ Visit NFTGiftX',
        //         chain: 'ETH',
        //         ticker: '$ Visit NFTGiftX',
        //         type: 'ERC20',
        //         balance: '4000.4',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'NOUNBR-0x36b2aa1795d8cdef4b784fe34045fadc45d61e8c',
        //         chain: 'ETH',
        //         ticker: 'NOUNBR',
        //         type: 'ERC20',
        //         balance: '1.1',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'FAU-0xfab46e002bbf0b4509813474841e0716e6730136',
        //         chain: 'ETH',
        //         ticker: 'FAU',
        //         type: 'ERC20',
        //         balance: '1000',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'LUSD-0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
        //         chain: 'ETH',
        //         ticker: 'LUSD',
        //         type: 'ERC20',
        //         balance: '2',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'OP',
        //         chain: 'OP',
        //         ticker: 'OP',
        //         type: 'Native',
        //         balance: '0.00000089',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        //         chain: 'OP',
        //         ticker: 'ETH',
        //         type: 'OPTIMISM',
        //         balance: '0.00000089',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'ETH-0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000',
        //         chain: 'OP',
        //         ticker: 'ETH',
        //         type: 'OPTIMISM',
        //         balance: '0.00000089',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'MATIC',
        //         chain: 'MATIC',
        //         ticker: 'MATIC',
        //         type: 'Native',
        //         balance: '2.83077868',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'MATIC-0x0000000000000000000000000000000000001010',
        //         chain: 'MATIC',
        //         ticker: 'MATIC',
        //         type: 'POLYGON',
        //         balance: '2.83077868',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'DAI-0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
        //         chain: 'MATIC',
        //         ticker: 'DAI',
        //         type: 'POLYGON',
        //         balance: '0.97610475',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'MaticX-0xfa68fb4628dff1028cfec22b4162fccd0d45efb6',
        //         chain: 'MATIC',
        //         ticker: 'MaticX',
        //         type: 'POLYGON',
        //         balance: '0.93538774',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'AAVE-0xd6df932a45c0f255f85145f286ea0b292b21c90b',
        //         chain: 'MATIC',
        //         ticker: 'AAVE',
        //         type: 'POLYGON',
        //         balance: '0.00011825',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'uni-router',
        //         chain: 'MATIC',
        //         ticker: 'uni',
        //         type: 'POLYGON',
        //         balance: '10',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'BalancerV2',
        //         chain: 'MATIC',
        //         ticker: 'BalancerV2',
        //         type: 'POLYGON',
        //         balance: '325',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     },
        //     {
        //         symbol: 'RUNE',
        //         chain: 'THOR',
        //         ticker: 'RUNE',
        //         type: 'Native',
        //         balance: '1.9004648',
        //         context: 'keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet'
        //     }
        // ]
        //
        // let marketCacheCoinGecko = await redis.get('markets:CoinGecko')
        // let marketCacheCoincap = await redis.get('markets:Coincap')
        //
        // if(!marketCacheCoinGecko){
        //     let marketInfoCoinGecko = await markets.getAssetsCoingecko()
        //     if(marketInfoCoinGecko){
        //         //market info found for
        //         marketInfoCoinGecko.updated = new Date().getTime()
        //         redis.setex('markets:CoinGecko',900,JSON.stringify(marketInfoCoinGecko))
        //         marketCacheCoinGecko = marketInfoCoinGecko
        //     }
        // }
        //
        // if(!marketCacheCoincap){
        //     let marketInfoCoincap = await markets.getAssetsCoinCap()
        //     if(marketInfoCoincap){
        //         //market info found for
        //         marketInfoCoincap.updated = new Date().getTime()
        //         redis.setex('markets:Coincap',900,JSON.stringify(marketInfoCoincap))
        //         marketCacheCoincap = marketInfoCoincap
        //     }
        // }
        // if(typeof(marketCacheCoincap) === 'string') marketCacheCoincap = JSON.parse(marketCacheCoincap)
        // if(typeof(marketCacheCoinGecko) === 'string') marketCacheCoinGecko = JSON.parse(marketCacheCoinGecko)
        // let marketResults = await markets.buildBalances(marketCacheCoincap, marketCacheCoinGecko, body.data.balances)
        //
        //
        //
        //
        // //let balances = await markets.buildBalances(marketInfoCoinCap, marketInfoCoinGecko, pubkeys)
        // // console.log("balances: ",balances)
        // console.log("balances: ",balances)


    }catch(e){
        console.error(e)
    }
}

run_test()
