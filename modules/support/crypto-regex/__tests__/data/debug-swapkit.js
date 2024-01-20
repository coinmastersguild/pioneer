
Address:
================

Doge: (thorswap) : DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54
Litecoin(thorswap) : ltc1qqe845efrljxq2hu8hx09danuhas3lal6u38qle
BNB ()  : bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap

Sending *******
===============
Works!
BSC

Trezor
ltc1qelygq7dsvsqywpl5tk087lk32l9jaeyuc30e5m


BROKE!
ARB (need moniez)
AVAX (insuffent funds)
BNB (seq to string)


//Logs

amount 0.02

{
    "addressNList": [
    2147483692,
    2147483708,
    2147483648,
    0,
    0
],
    "from": "0x141D9959cAe3853b035000490C03991eB70Fc4aC",
    "chainId": 43114,
    "to": "0xC3aFFff54122658b89C31183CeC4F15514F34624",
    "value": "0x00",
    "gasLimit": "0x5a3c",
    "nonce": "0x0b",
    "data": "0x",
    "maxFeePerGas": "0x11fc757480",
    "maxPriorityFeePerGas": "0x861c4680"
}

0x02f86d82a86a0b8459682f00850bfda3a300828ca094c3affff54122658b89c31183cec4f15514f346248080c001a0d643dfb4a15c7b101a8a0e483d07b45c0a280a1165bb7212e4f0f07c07395817a058124806b145c521786fc80bd6a3a9564a151453d4e53db5870092cd15fb0da2


Uncaught (in promise) Error: Error sending transaction: {"reason":"insufficient funds for intrinsic transaction cost","code":"INSUFFICIENT_FUNDS","error":{"reason":"processing response error","code":"SERVER_ERROR","body":"{\"jsonrpc\":\"2.0\",\"id\":59,\"error\":{\"code\":-32000,\"message\":\"insufficient funds for gas * price + value: address 0xC45c569087994899a5AE455eca0e1Bf54183c678 have (0) want (1854000000000000)\"}}","error":{"code":-32000},"requestBody":"{\"method\":\"eth_sendRawTransaction\",\"params\":[\"0x02f86d82a86a0b8459682f00850bfda3a300828ca094c3affff54122658b89c31183cec4f15514f346248080c001a0d643dfb4a15c7b101a8a0e483d07b45c0a280a1165bb7212e4f0f07c07395817a058124806b145c521786fc80bd6a3a9564a151453d4e53db5870092cd15fb0da2\"],\"id\":59,\"jsonrpc\":\"2.0\"}","requestMethod":"POST","url":"https://node-router.thorswap.net/avalanche-c"},"method":"sendTransaction","transaction":{"type":2,"chainId":43114,"nonce":11,"maxPriorityFeePerGas":{"type":"BigNumber","hex":"0x59682f00"},"maxFeePerGas":{"type":"BigNumber","hex":"0x0bfda3a300"},"gasPrice":null,"gasLimit":{"type":"BigNumber","hex":"0x8ca0"},"to":"0xC3aFFff54122658b89C31183CeC4F15514F34624","value":{"type":"BigNumber","hex":"0x00"},"data":"0x","accessList":[],"hash":"0xb03b4d0b84c25d988f66f12665021502acf927da2ab7ec12550ef72c3b1495db","v":1,"r":"0xd643dfb4a15c7b101a8a0e483d07b45c0a280a1165bb7212e4f0f07c07395817","s":"0x58124806b145c521786fc80bd6a3a9564a151453d4e53db5870092cd15fb0da2","from":"0xC45c569087994899a5AE455eca0e1Bf54183c678","confirmations":0},"transactionHash":"0xb03b4d0b84c25d988f66f12665021502acf927da2ab7ec12550ef72c3b1495db"}
at sendTransaction (BaseEVMToolbox.ts:457:11)
at async index.tsx:32:20


Avax


BNB

baseTx:{
    "addressNList": [
        2147483692,
        2147483708,
        2147483648,
        0,
        0
    ],
        "from": "0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        "chainId": 56,
        "to": "0xC3aFFff54122658b89C31183CeC4F15514F34624",
        "value": "0x00",
        "gasLimit": "0x5a3c",
        "nonce": "0x04",
        "data": "0x",
        "gasPrice": "0x010c388d00"
}

hex: 0xf8650485010c388d00828ca094c3affff54122658b89c31183cec4f15514f3462480808194a09ead22ac8eccd5a23824fa46dfc5018507b97509ec394b6eb257dbf27f92924fa05c7a11fcce2cdf048c6725f1a17df1e18953078ebdd747d3bb80508a0cbbee2a

Success!


BCH

0.039856

params: {
    "from": "bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p",
        "recipient": "qzxp0xc6vsj8apg9ym4n4jl45pyxtkpshuvr9smjp3",
        "memo": "",
        "amount": {
        "type": "BASE",
            "decimal": 8
    },
    "asset": {
        "chain": "BCH",
            "symbol": "BCH",
            "ticker": "BCH",
            "synth": false
    }
}

PRE: input:

{
    "hash": "58716b8bc6dfb85fb6c40cd97558e80625034607ae48b4bf7dff8f8393f61cf3",
    "index": 1,
    "txHex": "01000000019d7d2e86356aa9295ecf37eaaaba7ba10347c759d30cc9acde39d41ce97a601a010000006b483045022100b81d6e7ca7d6b01eacbc2b49db341d98b3e904a635a54089e086eb3d34f2eb3a022058a08188a4cd7094e2e0e0b6040b94d49dcb59c60b6aacc3b53afaf7ff327e2b4121032d5a06210f5becb49cfe530735cb0dc04869fd8c3c74150335cb666af120fc89ffffffff02a0860100000000001976a9148c179b1a64247e850526eb3acbf5a04865d830bf88ac22698f00000000001976a914922e5b61190e4aeda1d185ec1354cf50b75fb21388ac00000000",
    "value": 9398562,
    "witnessUtxo": {
    "value": 9398562,
        "script": {
        "type": "Buffer",
            "data": [
            118,
            169,
            20,
            146,
            46,
            91,
            97,
            25,
            14,
            74,
            237,
            161,
            209,
            133,
            236,
            19,
            84,
            207,
            80,
            183,
            95,
            178,
            19,
            136,
            172
        ]
    }
}
}

{
    "coin": "BitcoinCash",
    "inputs": [
    {
        "scriptType": "p2sh",
        "amount": "9398562",
        "vout": 1,
        "txid": "58716b8bc6dfb85fb6c40cd97558e80625034607ae48b4bf7dff8f8393f61cf3",
        "hex": "01000000019d7d2e86356aa9295ecf37eaaaba7ba10347c759d30cc9acde39d41ce97a601a010000006b483045022100b81d6e7ca7d6b01eacbc2b49db341d98b3e904a635a54089e086eb3d34f2eb3a022058a08188a4cd7094e2e0e0b6040b94d49dcb59c60b6aacc3b53afaf7ff327e2b4121032d5a06210f5becb49cfe530735cb0dc04869fd8c3c74150335cb666af120fc89ffffffff02a0860100000000001976a9148c179b1a64247e850526eb3acbf5a04865d830bf88ac22698f00000000001976a914922e5b61190e4aeda1d185ec1354cf50b75fb21388ac00000000",
        "scriptSig": {
            "asm": "18 760149200611900000850135405000013880",
            "hex": "760149200611900000850135405000013880"
        }
    }
],
    "outputs": [
    {
        "scriptType": "p2pkh",
        "addressType": "spend",
        "amount": "0",
        "address": "bitcoincash:qzxp0xc6vsj8apg9ym4n4jl45pyxtkpshuvr9smjp3"
    },
    {
        "scriptType": "p2pkh",
        "addressType": "spend",
        "amount": "9397884",
        "address": "bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p"
    }
],
    "version": 1,
    "locktime": 0
}


ETH

amount 0.0026
baseTx
{
    "addressNList": [
    2147483692,
    2147483708,
    2147483648,
    0,
    0
],
    "from": "0x141D9959cAe3853b035000490C03991eB70Fc4aC",
    "chainId": 1,
    "to": "0xC3aFFff54122658b89C31183CeC4F15514F34624",
    "value": "0x00",
    "gasLimit": "0x5a3c",
    "nonce": "0xac",
    "data": "0x",
    "maxFeePerGas": "0x0d0cf287bd",
    "maxPriorityFeePerGas": "0x861c4680"
}

Amount = 0
https://etherscan.io/tx/0x0776f6c486de7714ce3547748fa41ff355c087c1456369c73c4cba40211ef5fa


OP/Matic

giving BSC info


