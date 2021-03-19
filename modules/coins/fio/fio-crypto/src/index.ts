/*
  const thorMainnetClient: CosmosSDKClient = new CosmosSDKClient({
    server: 'http://104.248.96.152:1317',
    chainId: 'thorchain',
    prefix: 'thor',
    derive_path: "44'/931'/0'/0/0",
  })


 */



const fio = require('@fioprotocol/fiosdk');
const CryptoJS = require("crypto-js");
const bip39 = require(`bip39`);
const log = require('@pioneer-platform/loggerdog')()
/**********************************
 // Module
 //**********************************/

function standardRandomBytesFunc(size:any) {
    /* istanbul ignore if: not testable on node */
    return CryptoJS.lib.WordArray.random(size).toString()
}

module.exports = {
    generateWalletFromSeed: async function (mnemonic:string) {
        try{
            const privateKeyRes = await fio.FIOSDK.createPrivateKeyMnemonic(mnemonic)
            const publicKeyRes = fio.FIOSDK.derivedPublicKey(privateKeyRes.fioKey)

            return {
                publicKey: publicKeyRes.publicKey,
                privateKey: privateKeyRes.fioKey
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

