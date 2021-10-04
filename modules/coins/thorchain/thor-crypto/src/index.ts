/*
  const thorMainnetClient: CosmosSDKClient = new CosmosSDKClient({
    server: 'http://104.248.96.152:1317',
    chainId: 'thorchain',
    prefix: 'thor',
    derive_path: "44'/931'/0'/0/0",
  })


 */


const bip39 = require(`bip39`)
// const bip32 = require(`bip32`)
const bech32 = require(`bech32`)
// const secp256k1 = require(`secp256k1`)
const sha256 = require("crypto-js/sha256")
const ripemd160 = require("crypto-js/ripemd160")
const CryptoJS = require("crypto-js")
const HDKey = require('hdkey')
const hdPathXpub = `m/44'/931'/0'`
const hdPathMaster = `m/44'/931'/0'/0/0`
let bitcoin = require("bitcoinjs-lib");

const log = require('@pioneer-platform/loggerdog')()
/**********************************
 // Module
 //**********************************/

// NOTE: this only works with a compressed public key (33 bytes)
function createAddress(publicKey:string,prefix:string) {
    // @ts-ignore
    const message = CryptoJS.enc.Hex.parse(publicKey.toString(`hex`))
    const hash = ripemd160(sha256(message)).toString()
    const address = Buffer.from(hash, `hex`)
    // @ts-ignore
    const cosmosAddress = bech32ify(address, prefix)
    return cosmosAddress
}

function bech32ify(address:string, prefix:string) {
    const words = bech32.toWords(address)
    return bech32.encode(prefix, words)
}

module.exports = {
    generateWalletFromSeed: async function (mnemonic:string, isTestnet:boolean) {
        try{
            const seed = await bip39.mnemonicToSeed(mnemonic)

            let mk = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'))
            mk = mk.derive(hdPathXpub)

            let xpub = mk.publicExtendedKey
            let xpriv = mk.privateExtendedKey

            let publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).derive(0).publicKey
            let privateKey = bitcoin.bip32.fromBase58(xpriv).derive(0).derive(0).privateKey
            log.debug("publicKey: ",publicKey)
            log.debug("privateKey: ",privateKey)

            let prefix
            if(isTestnet){
                prefix = 'tthor'
            } else {
                prefix = 'thor'
            }
            let address = createAddress(publicKey,prefix)
            log.debug("address: ",address)

            return {
                xpub,
                privateKey: privateKey.toString('hex'),
                publicKey: publicKey.toString('hex'),
                masterAddress:address
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
