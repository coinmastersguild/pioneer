/*

    iota Crypto

 */


const bip39 = require(`bip39`)
// const bip32 = require(`bip32`)
const bech32 = require(`bech32`)
// const secp256k1 = require(`secp256k1`)
const sha256 = require("crypto-js/sha256")
const ripemd160 = require("crypto-js/ripemd160")
const CryptoJS = require("crypto-js")
const HDKey = require('hdkey')
const hdPath = `m/44'/118'/0'/0/0` //TODO get from coins
let bitcoin = require("bitcoinjs-lib");
import { Bip32Path, Bip39 } from "@iota/crypto.js";

import { Converter } from "@iota/util.js";
import {
    Bech32Helper,
    Ed25519Address,
    Ed25519Seed,
    ED25519_ADDRESS_TYPE,
    generateBip44Address,
    IOTA_BIP44_BASE_PATH,
    SingleNodeClient
} from "@iota/iota.js";

var IOTA = require('iota.lib.js');


var iota = new IOTA({});

const API_ENDPOINT = "https://chrysalis-nodes.iota.org/";

//bech32 prefix

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
            const client = new SingleNodeClient(API_ENDPOINT);
            const info = await client.info();            // Generate the seed from the Mnemonic
            const baseSeed = Ed25519Seed.fromMnemonic(mnemonic);
            const addressGeneratorAccountState = {
                accountIndex: 0,
                addressIndex: 0,
                isInternal: false
            };
            let i = 0
            const path = generateBip44Address(addressGeneratorAccountState, i === 0);
            const addressSeed = baseSeed.generateSeedFromPath(new Bip32Path(path));
            const addressKeyPair = addressSeed.keyPair();
            const indexEd25519Address = new Ed25519Address(addressKeyPair.publicKey);
            const indexPublicKeyAddress = indexEd25519Address.toAddress();
            return {
                // xpub:xpubAccount,
                privateKey: Converter.bytesToHex(addressKeyPair.privateKey),
                publicKey: Converter.bytesToHex(addressKeyPair.publicKey),
                masterAddress:Bech32Helper.toBech32(ED25519_ADDRESS_TYPE, indexPublicKeyAddress, info.bech32HRP)
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
