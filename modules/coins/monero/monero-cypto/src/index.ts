/*

    monero Crypto

    generate wallet offline

    https://github.com/monero-ecosystem/monero-javascript/blob/master/docs/developer_guide/view_only_offline.md

    //
    https://github.com/mymonero/mymonero-core-js/blob/develop/tests/monero_utils.spec.js#L45

    https://xmr.llcoins.net/
    https://github.com/luigi1111/xmr.llcoins.net

 */

const bip39 = require(`bip39`)
// const bip32 = require(`bip32`)
const bech32 = require(`bech32`)
// const secp256k1 = require(`secp256k1`)
const sha256 = require("crypto-js/sha256")
const ripemd160 = require("crypto-js/ripemd160")
const CryptoJS = require("crypto-js")
const HDKey = require('hdkey')
const hdPath = `m/44'/459'/0'/0/0` //TODO get from coins
//const hdPath = `m/44'/118'/0'/0/0` //TODO get from coins
let bitcoin = require("bitcoinjs-lib");
const walletUtils = require('mymonero-core-js/monero_utils/monero_wallet_utils')
const MoneroCore = require(`mymonero-core-js`);

const log = require('@pioneer-platform/loggerdog')()
/**********************************
 // Module
 //**********************************/

module.exports = {
    generateWalletFromSeed: async function (mnemonic:string) {
        try{
            const seed = await bip39.mnemonicToSeed(mnemonic)

            console.log(MoneroCore)


            // const wallet = walletUtils.NewlyCreatedWallet('english', 0)
            //
            //
            //
            // console.log('## Wallet address:', wallet.keys.public_addr)
            // console.log('## Mnemonic seed:', wallet.mnemonicString)

            return {
                // xpub:xpubAccount,
                // privateKey: privateKey.toString('hex'),
                // publicKey: publicKey.toString('hex'),
                // masterAddress:address
            }

        }catch(e){
            throw e
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
