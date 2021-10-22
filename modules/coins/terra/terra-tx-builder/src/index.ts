//TODO typescript BS, jest/mocha errors
//https://stackoverflow.com/questions/55680391/typescript-error-ts2403-subsequent-variable-declarations-must-have-the-same-typ
/*
    TX builder
        Normalizing tx building

 */

const TAG = " | terra-tx-builder | "

import { LCDClient, MsgSend, MnemonicKey } from '@terra-money/terra.js';
const log = require('@pioneer-platform/loggerdog')()

import {
    StdFee,
    StdSignMsg
} from '@terra-money/terra.js';

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
        // const terra = new LCDClient({
        //     URL: 'https://fcd.terra.dev',
        //     // URL: '',
        //     chainID: 'terra',
        // });

        // const wallet = terra.wallet(mk);

        // create a simple message that moves coin balances
        const send = new MsgSend(
            from,
            to,
            { uluna: amount }
        );

        let sequence = 0
        let accountNumber = 0
        let chainId = "terra"
        let gas = "80000"

        let fee = new StdFee(1000000, { uluna: 1000000000 })

        let tx = new StdSignMsg(
            chainId,
            accountNumber,
            sequence,
            fee,
            [send],
            memo
        );
        log.debug(tag,"tx: ",tx)

        let signed = await mk.signTx(tx);


        return signed.toJSON()
    }catch(e){
        throw Error(e)
    }
}
