/*
    General Signing module

    FOR ETH
 */



const log = require('@pioneer-platform/loggerdog')()
const TAG = " | Signing module | "
let signer = require("eth_mnemonic_signer")

let testnet = false
let SEED = process.env['AGENT_ETH_SIGNING_SEED']
let ACCOUNT = process.env['AGENT_BTC_SIGNING_PUBKEY']

module.exports = {
    init: function (isTestnet:string,account:string,seed:string) {
        ACCOUNT = account
        SEED = seed
        return true;
    },
    sign: function (address:string,msg: string, privKey: any) {
        if(typeof(msg)==='object')msg = JSON.stringify(msg)
        return sign_message(address,msg,privKey);
    },
    verify: function (msg: any, address: any, sig: any) {

        return true
    }
}

const sign_message = async function(address: string, msg: string, SEED: string | undefined) {
    let tag = TAG + " | sign_message | "
    try {

        let signature = await signer.signMessage(msg,SEED)
        return signature
    } catch (e) {
        console.error(tag, "Error: ", e)
        throw e
    }
}
