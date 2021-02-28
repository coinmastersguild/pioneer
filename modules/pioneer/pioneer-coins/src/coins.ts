
const TAG = " | coin tools | "
const log = require("@pioneer-platform/loggerdog")()
const bitcoin = require("bitcoinjs-lib");
const ethUtils = require('ethereumjs-util');
const ripemd160 = require("crypto-js/ripemd160")
const CryptoJS = require("crypto-js")
const sha256 = require("crypto-js/sha256")
const bech32 = require(`bech32`)

import { getNetwork } from "./networks";
let {
    getPaths,
} = require('./paths')
let paths = getPaths()

enum HDWALLETS {
    'pioneer',
    'trezor',
    'keepkey',
    'ledger'
}

// const supportedCoins = [
//     "Bitcoin",
//     "Testnet",
//     "BitcoinCash",
//     "BitcoinGold",
//     "Litecoin",
//     "EOS",
//     "FIO",
//     "Dash",
//     "DigiByte",
//     "Dogecoin",
// ];
//
// enum PoScoins {
//     'EOS',
//     'ATOM'
// }
//
// const stakingCoins = ["EOS", "ATOM"];
//
// const segwitCoins = ["Bitcoin", "Testnet", "BitcoinGold", "Litecoin"];
//

const COIN_MAP = {
    Bitcoin: "BTC",
    Cosmos: "ATOM",
    Testnet: "BTCT",
    BitcoinCash: "BCH",
    Litecoin: "LTC",
    Dash: "DASH",
    DigiByte: "DGB",
    Dogecoin: "DOGE",
    Ethereum: "ETH",
    Cardano: "ADA",
    Binance: "BNB",
    Eos: "EOS",
    EOS: "EOS",
    Fio: "FIO",
    FIO: "FIO",
};

const COIN_MAP_LONG:any = {
    BTC: "Bitcoin",
    ATOM: "Cosmos",
    BTCT: "testnet",
    BCH: "BitcoinCash",
    LTC: "Litecoin",
    DASH: "Dash",
    DGB: "DigiByte",
    DOGE: "Dogecoin",
    ETH: "Ethereum",
    ADA: "Cardano",
    BNB: "Binance",
    EOS: "Eos",
    FIO: "Fio",
};

function bech32ify(address:any, prefix:string) {
    const words = bech32.toWords(address)
    return bech32.encode(prefix, words)
}

// NOTE: this only works with a compressed public key (33 bytes)
function createBech32Address(publicKey:any,prefix:string) {
    const message = CryptoJS.enc.Hex.parse(publicKey.toString(`hex`))
    const hash = ripemd160(sha256(message)).toString()
    const address = Buffer.from(hash, `hex`)
    const cosmosAddress = bech32ify(address, prefix)
    return cosmosAddress
}

export async function normalize_pubkeys(format:string,pubkeys:any,pathsIn:any) {
    let tag = TAG + " | normalize_pubkeys | "
    try {
        log.info(tag,"input: ",{format,pubkeys,pathsIn})

        //paths by symbol
        let pathsBySymbol:any = {}
        for(let i = 0; i < paths.length; i++){
            let path = paths[i]
            pathsBySymbol[path.symbol] = path
        }
        log.debug(tag,"pathsBySymbol: ",pathsBySymbol)

        let output:any = []
        if(format === 'keepkey'){
            for(let i = 0; i < pubkeys.length; i++){
                let pubkeyRaw = paths[i]
                let pubkey:any = {}

                //get "real" pubkey
                pubkey = pathsBySymbol[pubkeyRaw.symbol]
                log.debug(tag,"pubkey: ",pubkey)
                pubkey.source = format
                pubkey.pubkey = pubkeys[i].xpub
                pubkey.xpub = pubkeys[i].xpub
                let normalized:any = {}
                //get "real" coin
                normalized.note = pubkey.note
                normalized.coin = pubkey.symbol
                normalized.long = pubkey.symbol
                normalized.network = pubkey.symbol
                //normalized.path = addressNListToBIP32(pubkey.addressNList)
                normalized.type = "xpub"
                normalized.script_type = pubkey.script_type //TODO select script type?

                //get address
                let address = await get_address_from_xpub(pubkey.xpub,pubkey.script_type,pubkey.symbol,0,0,false)

                normalized.pubkey = pubkey.xpub
                normalized.xpub = pubkey.xpub
                normalized.master = address //TODO
                normalized.address = address //TODO

                output.push(normalized)
            }

        } else {
            throw Error(" unknown format! ")
        }

        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}

export function get_address_from_xpub(xpub:string,scriptType:string,coin:string,account:number,index:number,isChange:boolean) {
    let tag = TAG + " | get_address | "
    try {
        let output

        //if xpub get next unused
        if(!xpub) throw Error("xpub required! coin:"+coin)


        //get pubkey at path
        let publicKey = bitcoin.bip32.fromBase58(xpub).derive(account).derive(index).publicKey
        log.debug("publicKey: ********* ",publicKey)

        //TODO is clone?

        switch(coin) {
            case 'ETH':
                output = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey,true))
                break;
            case 'ATOM':
                // code block
                output = createBech32Address(publicKey,'cosmos')
                break;
            case 'RUNE':
                // code block
                output = createBech32Address(publicKey,'tthor')
                break;
            case 'BNB':
                // code block
                output = createBech32Address(publicKey,'bnb')
                break;
            case 'EOS':
                output = publicKey.toString('hex')
                break;
            case 'FIO':
                output = publicKey.toString('hex')
                break;
            default:
                let network
                if(coin !== 'BTC'){
                    let longName = COIN_MAP_LONG[coin]
                    network = getNetwork(longName)
                } else {
                    network = {}
                }

                output = bitcoin.payments.p2pkh({ pubkey:publicKey, network }).address;
                //TODO handle more script types!
                // switch (scriptType) {
                //     case "p2sh":
                //         output = bitcoin.payments.p2sh({ pubkey:publicKey, network }).address;
                //     case "p2pkh":
                //         output = bitcoin.payments.p2pkh({ pubkey:publicKey, network }).address;
                //     case "p2wpkh":
                //         output = bitcoin.payments.p2wpkh({ pubkey:publicKey, network }).address;
                //     case "p2sh-p2wpkh":
                //         output = bitcoin.payments.p2sh({
                //             redeem: bitcoin.payments.p2wpkh({ pubkey:publicKey, network }),
                //             network,
                //         }).address;
                //     default:
                //         throw new Error(`no implementation for script type: ${scriptType} coin:${coin}`);
                // }
                break;
            // throw Error("coin not yet implemented ! "+coin)
            // code block
        }

        log.debug(tag,"output: ",output)


        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}
