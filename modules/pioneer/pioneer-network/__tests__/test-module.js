/*
        Test Network

 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let network = require('../lib/index.js')


let run_test = async function(){
    try{
        //read file
        // let walletPublic = require("./data/keepkey.watch.wallet.json")
        let walletPublic = require("./data/testnet.watch.wallet.json")
        // let walletPublic = require("./data/metamask.watch.wallet.json")

        await network.init('full',{
            pubkeys:walletPublic.WALLET_PUBLIC
        },true)

        // await network.init('full',{})

        //get status

        //get coins

        //get blockheights

        // let address = await network.getMaster('ETH')
        // console.log("address: ",address)

        //get wallet info
        let walletInfo = await network.getInfo()
        console.log("walletInfo: ",walletInfo)

        // console.log("walletInfo: ",walletInfo.masters.ATOM)
        // console.log("expect: ","cosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3")

        // console.log("masters: ",walletInfo.masters)
        // console.log("balances: ",walletInfo.balances)

        // let walletInfo = await network.getInfo()
        // console.log("walletInfo: ",walletInfo)

        // let walletInfo = await network.getInfo()
        // console.log("walletInfo: ",walletInfo)

        // let walletInfo = await network.getInfo()
        // console.log("walletInfo: ",walletInfo)

        // let eosPubkey = await network.getEosPubkey()
        // console.log("eosPubkey: ",eosPubkey)

        // let fioPubkey = await network.getFioPubkey()
        // console.log("fioPubkey: ",fioPubkey)

        // let eosAccounts = await network.getEosAccountsByPubkey(eosPubkey)
        // console.log("eosAccounts: ",eosAccounts)

        // let fioAccounts = await network.getFioAccountsByPubkey(fioPubkey)
        // console.log("fioAccounts: ",fioAccounts)

        // let validNewUsername = "xtesterbrosx"
        //
        // let validateUsername = await network.validateEosUsername(validNewUsername)
        // console.log("validateUsername: ",validateUsername)

        // let validNewUsername = "highlanderxx"
        // let validateUsername = await network.validateFioUsername(validNewUsername)
        // console.log("validateFioUsername: ",validateUsername)

        // let walletInfo = await network.getBlockHeight('BNB')
        // console.log("walletInfo: ",walletInfo)

        // let walletInfo = await network.getBlockHeight('ETH')
        // console.log("walletInfo: ",walletInfo)

        //
        // let balanceEth = await network.getBalance('ETH')
        // console.log("balanceEth: ",balanceEth)

        // let balanceFox = await network.getBalance('FOX')
        // console.log("balanceFox: ",balanceFox)

        //get transactions

        //get new address

        // let dogeAddy = await network.getNewAddress('DOGE')
        // console.log("dogeAddy: ",dogeAddy)

        //fio pubkey
        // let fioPubkey = await network.getPubkey('highlander@scatter')
        // log("fioPubkey: ",fioPubkey)

    }catch(e){
        console.error(e)
    }
}

run_test()
