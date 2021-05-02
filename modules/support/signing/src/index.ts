/*
    General Signing module
 */
const bitcoin = require('bitcoinjs-lib') // v3.x.x
const bitcoinMessage = require('bitcoinjs-message')

let PRIVKEY = process.env['AGENT_BTC_SIGNING_PRIVKEY']
let ACCOUNT = process.env['AGENT_BTC_SIGNING_PUBKEY']
const log = require('@pioneer-platform/loggerdog')()
const TAG = " | Signing module | "

let testnet = false

module.exports = {
    init: function (isTestnet:string,account:string,privKey:string) {
        ACCOUNT = account
        PRIVKEY = privKey
        return true;
    },
    sign: function (address:string,msg: string, privKey: any) {
        if(typeof(msg)==='object')msg = JSON.stringify(msg)
        return sign_message(address,msg,privKey);
    },
    verify: function (msg: any, address: any, sig: any) {
        return bitcoinMessage.verify(msg, address, sig);
    },
    validate: function (address: any, sig: any, msg: string) {
        if(!address) throw Error("101: missing address!")
        if(!sig) throw Error("102: missing sig!")
        if(!msg) throw Error("103: missing msg!")
        log.debug("address: ",address)
        log.debug("sig: ",sig)
        log.debug("msg: ",msg)
        log.debug("msg: ",typeof(msg))
        if(typeof(msg)==='object')msg = JSON.stringify(msg)
        return bitcoinMessage.verify(msg, address, sig);
    }
}

const sign_message = async function(address: string, msg: string, privKey: string | undefined) {
    let tag = TAG + " | sign_message | "
    try {
        if(typeof(msg) != 'string') msg = JSON.stringify(msg)
        log.debug(tag, "address: ", address)
        log.debug(tag, "msg: ", msg)
        log.debug(tag, "privKey: ", privKey)
        if(!address) throw Error("104: missing address!")
        if(!msg) throw Error("105: missing msg!")
        //log.debug(tag,"coin: ",coin)

        if (!privKey) privKey = PRIVKEY
        if (!privKey) throw Error("101: unable to sign! no privKey!")
        log.debug(tag, 'privKey: ', privKey)

        const networks = require('bitcoinjs-lib').networks
        let keyPair
        if(testnet){
            log.debug("testnet detected")
            keyPair = bitcoin.ECPair.fromWIF(privKey, networks.testnet)
        } else {
            log.debug("mainnet detected")
            keyPair = bitcoin.ECPair.fromWIF(privKey)
        }
        const privateKey = keyPair.d.toBuffer(32)
        if (!privateKey) throw Error("106: unable to build privkey buffer!")
        const message = msg

        const signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
        if (!signature) throw Error("107: unable to build signature!")
        return signature.toString('base64')

    } catch (e) {
        console.error(tag, "Error: ", e)
        throw e
    }
}
