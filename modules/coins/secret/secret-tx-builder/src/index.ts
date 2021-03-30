/*
    TX builder
        Normalizing tx building

 */

const TAG = " | terra-tx-builder | "

const {
    EnigmaUtils, SigningCosmWasmClient, Secp256k1Pen, pubkeyToAddress, encodeSecp256k1Pubkey
} = require("secretjs-offline");

const log = require('@pioneer-platform/loggerdog')()

module.exports = {
    signTx:function (to:string,from:string,amount:number,memo:string,seed:string) {
        return sign_transaction(to,from,amount,memo,seed)
    }
}

/**********************************
 // Lib
 //**********************************/

let sign_transaction = async function(to:string,from:string,amount:number,memo:string,seed:string){
    let tag = TAG + " | sign_transaction | "
    try{
        const httpUrl = '';
        const signingPen = await Secp256k1Pen.fromMnemonic(seed);
        const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
        const accAddress = pubkeyToAddress(pubkey, 'secret');

        const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();
        const fees = {
            send: {
                amount: [{ amount: amount, denom: "uscrt" }],
                gas: "80000",
            },
        }
        const client = new SigningCosmWasmClient(
            httpUrl,
            accAddress,
            (signBytes:any) => signingPen.sign(signBytes),
            txEncryptionSeed, fees
        );
        const rcpt = to; // Set recipient to sender for testing

        const sent = await client.sendTokensOffline(rcpt, [{amount: amount, denom: "uscrt"}],'secret-2', 16173, 5, memo)
        // console.log('sent', sent)
        // console.log('sent', JSON.stringify(sent))

        return sent
    }catch(e){
        throw Error(e)
    }
}
