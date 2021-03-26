/*

    Terra Crypto


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
    generateWalletFromSeed: async function (mnemonic:string) {
        try{
            const seed = await bip39.mnemonicToSeed(mnemonic)
            //console.log("seed: ",seed)

            let mk = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'))
            //log.debug(mk.publicExtendedKey)

            //get correct address with xpub
            let xpub = mk.publicExtendedKey
            let xpriv = mk.privateExtendedKey
            //log.debug("xpub: ",xpub)

            let publicKey = bitcoin.bip32.fromBase58(xpub).publicKey
            let privateKey = bitcoin.bip32.fromBase58(xpriv).privateKey
            log.debug("publicKey: ",publicKey)

            //
            let mkAccount = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'))
            //get master key
            //console.log("hdPathAtom: ",hdPathAtom)
            mkAccount = mkAccount.derive(hdPath)
            log.debug(mkAccount.publicExtendedKey)

            //get correct address with xpub
            let xpubAccount = mkAccount.publicExtendedKey

            //
            let address = createAddress(publicKey,'kava')
            log.debug("address: ",address)

            return {
                xpub:xpubAccount,
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
