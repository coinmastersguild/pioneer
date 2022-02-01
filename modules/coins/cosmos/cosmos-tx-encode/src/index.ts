/*
    cosmos-tx-encoder

 */

const TAG = " | cosmos-tx-encoder | "

import { Registry } from "@cosmjs/proto-signing";
import { Tx, TxRaw, TxBody, AuthInfo } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { PubKey } from "cosmjs-types/cosmos/crypto/secp256k1/keys"
import { MsgSend } from "cosmjs-types/cosmos/bank/v1beta1/tx"

var prettyjson = require('prettyjson');

module.exports = {
    encodeTx:function (tx:any) {
        return encode_transaction(tx)
    }
}

/**********************************
 // Lib
 //**********************************/


let encode_transaction = async function(tx:any){
    let tag = TAG + " | encode_transaction | "
    try{

        const registry = new Registry();

        // @ts-ignore
        let txBody = registry.encode({
            typeUrl:"/cosmos.tx.v1beta1.TxBody",
            // @ts-ignore
            value:{
                // @ts-ignore
                messages: tx.msg.map(({type, value}) => {
                    switch (type) {
                        case "cosmos-sdk/MsgSend":
                            return {
                                typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                                value: {
                                    fromAddress: value.from_address,
                                    toAddress: value.to_address,
                                    amount: value.amount,
                                }
                            }
                        default: throw new Error("wat")
                    }
                }),
                memo:tx.memo
            }
        })
        console.log("txBody: ",txBody)
        // @ts-ignore
        let decodedTxBody = registry.decodeTxBody(txBody)
        console.log("decodedTxBody: ",decodedTxBody)

        // @ts-ignore
        let broadCastTx = Tx.fromJSON({
            body: {
                // @ts-ignore
                messages: tx.msg.map(({type, value}) => {
                    switch (type) {
                        case "cosmos-sdk/MsgSend":
                            return {
                                typeUrl: "/cosmos.bank.v1beta1.MsgSend",
                                // @ts-ignore
                                value: Buffer.from(MsgSend.encode(MsgSend.fromJSON({
                                    fromAddress: value.from_address,
                                    toAddress: value.to_address,
                                    amount: value.amount,
                                })).finish()).toString("base64")
                            }
                        default: throw new Error("wat")
                    }
                }),
                memo: tx.memo
            },
            authInfo: {
                // @ts-ignore
                signerInfos: tx.signatures.map(({sequence, pub_key}) => {
                    switch (pub_key.type) {
                        case "tendermint/PubKeySecp256k1":
                            console.log("sequence: ",sequence)
                            return {
                                publicKey: {
                                    typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                                    value: Buffer.from(PubKey.encode(PubKey.fromJSON({
                                        key: pub_key.value
                                    })).finish()).toString("base64")
                                },
                                modeInfo: {
                                    single: {
                                        mode: "SIGN_MODE_LEGACY_AMINO_JSON"
                                    }
                                },
                                sequence:"17",
                            }
                        default: throw new Error("wat")
                    }
                }),
                fee: {
                    amount: tx.fee.amount,
                    gasLimit: tx.fee.gas,
                }
            },
            // @ts-ignore
            signatures: tx.signatures.map(({signature}) => signature)
        })
        // console.log("broadCastTx: ",broadCastTx)
        // console.log("broadCastTx: ",JSON.stringify(broadCastTx))

        let encodedTx = Tx.encode(broadCastTx).finish()
        // console.log("encodedTx: ",encodedTx)
        let decodedTx = Tx.decode(encodedTx)
        console.log("decodedTx: ",Tx.toJSON(decodedTx))
        // console.log("decodedTx: ",JSON.stringify(Tx.toJSON(decodedTx)))

        console.log("decodedTx: (pretty) ",prettyjson.render(Tx.toJSON(decodedTx), {
            dashColor: 'magenta',
            stringColor: 'white',
            multilineStringColor: 'cyan'
        }));


        console.log("decodedTx: (JSON) ",JSON.parse(JSON.stringify(Tx.toJSON(decodedTx))))
        console.log("decodedTx: (String) ",JSON.stringify(Tx.toJSON(decodedTx)))
        //TxRaw
        // @ts-ignore
        let realBroadcast = Buffer.from(TxRaw.encode(TxRaw.fromJSON({
            // @ts-ignore
            bodyBytes: Buffer.from(TxBody.encode(broadCastTx.body).finish()).toString("base64"),
            // @ts-ignore
            authInfoBytes: Buffer.from(AuthInfo.encode(broadCastTx.authInfo).finish()).toString("base64"),
            // @ts-ignore
            signatures: broadCastTx.signatures.map(x => {
                console.log("x: ",x)
                return Buffer.from(x).toString("base64")
            })
        })).finish()).toString("base64")

        console.log("realBroadcast: ",realBroadcast)

        return realBroadcast
        // @ts-ignore
    }catch(e:any){
        throw Error(e)
    }
}
