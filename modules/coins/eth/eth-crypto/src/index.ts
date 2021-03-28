/*

    Ethereum Crypto


 */


const bip39 = require(`bip39`)
const bip32 = require(`bip32`)
const bech32 = require(`bech32`)
const secp256k1 = require(`secp256k1`)
const sha256 = require("crypto-js/sha256")
const ripemd160 = require("crypto-js/ripemd160")
const CryptoJS = require("crypto-js")
const HDKey = require('hdkey')
//const coininfo = require('coininfo')
const hdPathEth = `m/44'/60'/0'/0/0` // ETH
let bitcoin = require("bitcoinjs-lib");
const ethUtils = require('ethereumjs-util');
const log = require('@pioneer-platform/loggerdog')()
/**********************************
 // Module
 //**********************************/


module.exports = {
    generateAddress: async function (xpub:string,index:string,isChange:string) {
        let account = 0
        if(isChange) account = 0
        //let publicKey = bitcoin.bip32.fromBase58(xpub).derive(account).derive(index).publicKey
        let publicKey = bitcoin.bip32.fromBase58(xpub).derive(account).publicKey
        //let publicKey = bitcoin.bip32.fromBase58(xpub).publicKey
        log.debug("publicKey: ",publicKey)
        let address = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey,true))
        return address
    },
    generateWalletFromSeed: async function (mnemonic:string) {
        try{
            const seed = await bip39.mnemonicToSeed(mnemonic)
            // let masterKey =  new HDKey.fromMasterSeed(new Buffer(seed, 'hex'), coininfo(network).versions.bip32.versions)
            // log.debug("masterKey: ",masterKey)
            let mk = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'))
            log.debug(mk.publicExtendedKey)

            //get Eth key
            mk = mk.derive("m/44'/60'/0'")
            log.debug(mk.publicExtendedKey)

            //get correct address with xpub
            let xpub = mk.publicExtendedKey
            let xpriv = mk.privateExtendedKey
            log.debug("xpub: ",xpub)

            let publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).derive(0).publicKey
            let privateKey = bitcoin.bip32.fromBase58(xpriv).derive(0).derive(0).privateKey

            // let publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).derive(0).publicKey
            // let privateKey = bitcoin.bip32.fromBase58(xpriv).derive(0).derive(0).privateKey
            log.debug("publicKey: ",publicKey)
            log.debug("privateKey: ",ethUtils.bufferToHex(privateKey))

            //
            let address = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey,true));
            log.debug("address: ",address)

            return {
                xpub,
                xpriv,
                privateKey: ethUtils.bufferToHex(privateKey),
                publicKey: ethUtils.bufferToHex(publicKey),
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
