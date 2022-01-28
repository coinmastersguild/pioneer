/*
    TX builder
        Normalizing tx building

 */

const TAG = " | kava-tx-builder | "

import { DirectSecp256k1HdWallet, Registry } from "@cosmjs/proto-signing";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { MsgSend as IMsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx";
import { Field, Type } from "protobufjs";
// import { TxBody } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Keplr } from "@keplr-wallet/types";

import { Tx, TxRaw, TxBody, AuthInfo } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys"
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx"

import Long from "long";
import protobuf from "protobufjs/minimal";

protobuf.util.Long = Long;
protobuf.configure();

import {cosmos} from "tendermint-tx-codec";

import {
    OfflineSigner,
    AccountData,
    makeCosmoshubPath,
    Secp256k1HdWallet,
    AminoSignResponse,
    StdSignDoc,
} from "@cosmjs/launchpad";

// import {
//     BaseAccount,
//     cosmos,
//     google,
//     TendermintTxTracer,
// } from "@keplr-wallet/cosmos";

import SignDoc = cosmos.tx.v1beta1.SignDoc;

// A message type auto-generated from .proto files using ts-proto. @cosmjs/stargate ships some
// common types but don't rely on those being available. You need to set up your own code generator
// for the types you care about. How this is done should be documented, but is not yet:
// https://github.com/cosmos/cosmjs/issues/640


const log = require('@pioneer-platform/loggerdog')()

module.exports = {
    signTx:function (to:string,from:string,amount:number,memo:string,seed:string) {
        return sign_transaction(to,from,amount,memo,seed)
    }
}

/**********************************
 // Lib
 //**********************************/

// let getHdWallet = async function(chainId:string, mnemonic:string): Promise<any>{
//     try{
//         let wallet = await Secp256k1HdWallet.fromMnemonic(
//             mnemonic,
//             makeCosmoshubPath(0)
//         );
//
//         return wallet
//     }catch(e){
//         throw Error(e)
//     }
// }
//
// let sign_amino = async function(signerAddress: string, signDoc: StdSignDoc, chainId:string): Promise<any>{
//     try{
//         //sign_amino
//         if (chainId !== signDoc.chain_id) {
//             throw new Error("Unmatched chain id with the offline signer");
//         }
//
//         //
//         const hdWallet = await getHdWallet(chainId);
//
//     }catch(e){
//         throw Error(e)
//     }
// }


let sign_transaction = async function(to:string,from:string,amount:number,memo:string,seed:string){
    let tag = TAG + " | sign_transaction | "
    // @ts-ignore
    try{
        const chainId = "cosmoshub-4";


        //base64
        // let finalBroadcast = Buffer.from(tx as any).toString("base64")
        // console.log("finalBroadcast: ",finalBroadcast)

        // // @ts-ignore
        // const msgSend = MsgSend.fromPartial({
        //     fromAddress: "cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6",
        //     toAddress: "cosmos1qypqxpq9qcrsszg2pvxq6rs0zqg3yyc5lzv7xu",
        //     amount: [coin],
        // }) as unknown as IMsgSend;
        // console.log("msgSend: ",msgSend)
        //
        // // @ts-ignore
        // const msgSendBytes = MsgSend.encode(msgSend).finish();
        // console.log("msgSendBytes: ",msgSendBytes)

        // console.log(TxBody)
        // let result = TxBody.fromJSON(tx)
        // console.log("result: ",result)

        //encode to buffer
        // const registry = new Registry();
        // let result = registry.encode({
        //     typeUrl:'/cosmos.bank.v1beta1.MsgSend',
        //     value:tx
        // })
        // console.log("result: ",result)
        // console.log("result: ",typeof(result))
        // console.log("result: ",JSON.stringify(result))
        // console.log(result.toString())

        // console.log(registry['/cosmos.bank.v1beta1.MsgSend'].encode(tx))

        //
        // const wallet = await DirectSecp256k1HdWallet.fromMnemonic(seed);
        // const [firstAccount] = await wallet.getAccounts();
        // log.info(tag,"firstAccount: ",firstAccount)
        //
        // const rpcEndpoint = "https://rpc-cosmoshub.keplr.app";
        // const client = await SigningStargateClient.connectWithSigner(rpcEndpoint, wallet);
        //
        // const recipient = to;
        // const amount = {
        //     denom: "uatom",
        //     amount: "1234567",
        // };
        //
        // const result = await client.sendTokens(firstAccount.address, recipient, [amount], "auto");
        // log.info(tag,"result: ",result)

        // Please install and use rest server separately. (https://hub.cosmos.network/master/resources/service-providers.html#setting-up-the-rest-server)
        // const kava = cosmosjs.network("https://lcd-kava.keplr.app", chainId);
        // const kava = cosmosjs.network("https://lcd-kava.keplr.app", chainId);
        // const cosmo = cosmosjs.network("https://lcd-cosmoshub.keplr.app", chainId);
        // // kava.setBech32MainPrefix("kava");
        // // kava.setPath("m/44'/459'/0'/0/0"); 		// new: m/44'/459'/0'/0/0, legacy: m/44'/118'/0'/0/0
        // // const address = kava.getAddress(seed);
        //
        // //log.debug(tag,"address: ",address)
        //
        // const ecpairPriv = cosmo.getECPairPriv(seed);
        //
        // log.info(tag,"ecpairPriv: ",ecpairPriv)
        //
        // let accountInfo = await cosmo.getAccounts(from)
        // log.info(tag,"accountInfo: ",accountInfo)

        // let stdSignMsg = cosmo.newStdMsg({
        //     msgs: [
        //         {
        //             type: "cosmos-sdk/MsgSend",
        //             value: {
        //                 amount: [
        //                     {
        //                         amount: String(100000), 	// 6 decimal places (1000000 ukava = 1 KAVA)
        //                         denom: "uatom"
        //                     }
        //                 ],
        //                 from_address: from,
        //                 to_address: to
        //             }
        //         }
        //     ],
        //     chain_id: chainId,
        //     fee: { amount: [ { amount: String(5000), denom: "ukava" } ], gas: String(200000) },
        //     memo: "",
        //     account_number: String(accountInfo.result.value.account_number),		// If the address is a vesting account, use account_number of base_vesting_account
        //     sequence: String(accountInfo.result.value.sequence)					// If the address is a vesting account, use sequence of base_vesting_account
        // });
        //
        // //log.debug(tag,"stdSignMsg: ",stdSignMsg)
        //
        // const signedTx = cosmo.sign(stdSignMsg, ecpairPriv);
        // log.debug(tag,"signedTx: ",signedTx)
        // log.debug(tag,"signedTx: ",JSON.stringify(signedTx))
        //
        // return signedTx
        // @ts-ignore
    }catch(e:any){
        throw Error(e)
    }
}
