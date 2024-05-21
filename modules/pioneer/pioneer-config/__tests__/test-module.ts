/*
scratch

// let getAllPubkeys = async function(wallet:any){
//   try{
//     let allChains = {
//       'bip122:000000000019d6689c085ae165831e93/slip44:0':{
//         name: 'Bitcoin',
//         type: 'xpub',
//         addressNlist: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
//         addressNlistMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0],
//       },
//       'bip122:000000000000000000651ef99cb9fcbe/slip44:145':{
//         name: 'Bitcoin Cash',
//         type: 'xpub',
//         addressNlist: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
//         addressNlistMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0],
//       },
//       'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2':{
//         name: 'Litecoin',
//         type: 'xpub',
//         addressNlist: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
//         addressNlistMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0],
//       },
//       'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5':{
//         name: 'Dash',
//         type: 'xpub',
//         addressNlist: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
//         addressNlistMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0],
//       },
//       'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5':{
//         name: 'Doge',
//         type: 'xpub',
//         addressNlist: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
//         addressNlistMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0],
//       },
//       'cosmos:cosmoshub-4/slip44:118':{
//         name: 'Cosmos',
//         type: 'address',
//         addressNlistMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0],
//       },
//       'cosmos:osmosis-1/slip44:118':{
//         name: 'Osmosis',
//         type: 'address',
//         addressNlistMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0],
//       },
//       'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2/slip44:144':{
//         name: 'Ripple',
//         type: 'address',
//         addressNlistMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0],
//       },
//       'cosmos:thorchain-mainnet-v1/slip44:931':{
//         name: 'Thorchain',
//         type: 'address',
//         addressNlistMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0],
//       },
//     }
//
//     Object.keys(allChains).forEach(async (chain) => {
//         let chainData = allChains[chain]
//       /*
//       binanceGetAddress
//       utxoGetAddress
//        script_type
//        */
//         let pubKey = await wallet.ethGetAddress({
//             addressNList: chainData.addressNlist,
//             showDisplay: false,
//         })
//         console.log('pubKey: ', pubKey)
//       //if xpub get master as well
//     }
//
//     format into final object
//     let final = {
//       type: 'keepkey',
//       wallet: wallet.masterAddress+".wallet.json",
//       paths: allChains,
//       pubkeys
//     }
//     return final
//   }catch(e){
//     console.error(e)
//   }
// }


 */


import * as config from "../lib"

let run_test = async function(){
    try{
        console.log("test!")
        let configFile = config.getConfig()
        console.log(configFile)

        //
        if(!config){
            console.log("first time setup")

            //prompt language

            //prompt username
            //opt in password

            //if no password generate

            //save to file
        }else{
            console.log("first time setup")




        }

        // let walletFiles = await config.getWallets()
        // console.log(walletFiles)

        //for each
        // let wallet = config.getWallet('wallet-1-test.wallet.json')
        // console.log(wallet)

        //
        // //is keepkey watch wallet
        // let keepkeyWatch = config.getKeepkeyWatch()
        // console.log(keepkeyWatch)
        // //write keepkey wallet

        // let successBackup = await config.backupWallet()
        // console.log("successBackup: ",successBackup)

        // let successDeleteWallet = await config.deleteWallet()
        // console.log("successDelete: ",successDelete)

        // let successDeleteConfig = await config.deleteConfig()
        // console.log("successDeleteConfig: ",successDeleteConfig)

        //

        // deleteConfig()
        //TODO
        //will not overwrite wallet

        //can backup wallet to new dir

        //can innit new wallet

        //will backup wallet if innit a new wallet and wallet already exists

    }catch(e){
        console.error(e)
    }
}

run_test()
