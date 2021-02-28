/*


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
