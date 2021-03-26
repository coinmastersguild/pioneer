/*
    TX builder
        Normalizing tx building

 */

const TAG = " | terra-tx-builder | "

import { LCDClient, MsgSend, MnemonicKey } from '@terra-money/terra.js';
const log = require('@pioneer-platform/loggerdog')()

import * as terraCore from '@terra-money/core'

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

        // create a key out of a mnemonic
        const mk = new MnemonicKey({
            mnemonic:seed,
        });

        // connect to soju testnet
        const terra = new LCDClient({
            URL: 'https://fcd.terra.dev',
            chainID: 'terra',
        });

        const wallet = terra.wallet(mk);

        // create a simple message that moves coin balances
        const send = new MsgSend(
            from,
            to,
            { uluna: amount }
        );

        let tx = await wallet.createAndSignTx({
                msgs: [send],
                memo: memo,
            })

        // let resultBroadcast = await terra.tx.broadcast(tx)
        // log.info(tag,"resultBroadcast: ",resultBroadcast)
        //convert to string
        //convert back to tx

        //return tx.toJSON()
        return tx.toData().value
    }catch(e){
        throw Error(e)
    }
}
