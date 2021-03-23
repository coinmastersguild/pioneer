import * as Cardano from "cardano-wallet";

const bip39 = require(`bip39`)
const CryptoJS = require("crypto-js")


/**********************************
 // Module
 //**********************************/

module.exports = {
    generateWalletFromSeed: async function (mnemonic:string) {



        // to connect the wallet to mainnet
        let settings = Cardano.BlockchainSettings.mainnet();

        // recover the entropy
        let entropy = Cardano.Entropy.from_english_mnemonics(mnemonic);
        // recover the wallet
        let wallet = Cardano.Bip44RootPrivateKey.recover(entropy, "");

        // console.log("wallet: ",wallet)
        // console.log("wallet: ",wallet.free())

        // create a wallet account
        let account = wallet.bip44_account(Cardano.AccountIndex.new(0 | 0x80000000));
        let account_public = account.public();
        console.log("account: ",account.key().to_hex())

        // create an address
        let chain_pub = account_public.bip44_chain(false);
        let key_pub = chain_pub.address_key(Cardano.AddressKeyIndex.new(0));
        let address = key_pub.bootstrap_era_address(settings);

        console.log("Address m/bip44/ada/'0/0/0", address.to_base58());

        return {
            // xpub,
            privateKey: account.key().to_hex(),
            publicKey: account_public.key().to_hex(),
            masterAddress:address.to_base58()
        }
    },
    generateSeed: function () {
        let randomBytesFunc = standardRandomBytesFunc
        const randomBytes = Buffer.from(randomBytesFunc(32), `hex`)
        if (randomBytes.length !== 32) throw Error(`Entropy has incorrect length`)
        const mnemonic = bip39.entropyToMnemonic(randomBytes.toString(`hex`))
        return mnemonic
    },
}


/**********************************
 // Lib
 //**********************************/

function standardRandomBytesFunc(size:any) {
    /* istanbul ignore if: not testable on node */

    return CryptoJS.lib.WordArray.random(size).toString()
}
