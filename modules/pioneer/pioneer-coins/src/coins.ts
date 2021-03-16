
const TAG = " | coin tools | "
const log = require("@pioneer-platform/loggerdog")()
const cloneCrypto = require("@pioneer-platform/utxo-crypto")
const bitcoin = require("bitcoinjs-lib");
const ethUtils = require('ethereumjs-util');
const ripemd160 = require("crypto-js/ripemd160")
const CryptoJS = require("crypto-js")
const sha256 = require("crypto-js/sha256")
const bech32 = require(`bech32`)
import BigNumber from 'bignumber.js'

import { getNetwork } from "./networks";
let {
    getPaths,
} = require('./paths')


enum HDWALLETS {
    'pioneer',
    'trezor',
    'keepkey',
    'ledger'
}

/*

    Feature Flagged coin support

    "Bitcoin",
    "Testnet",
    "BitcoinCash",
    "BitcoinGold",
    "Litecoin",
    "EOS",
    "FIO",
    "Dash",
    "DigiByte",
    "Dogecoin",

    sample .env file

    #Feature flag by network
    FEATURE_BITCOIN_BLOCKCHAIN=true
    FEATURE_ETHEREUM_BLOCKCHAIN=true
    FEATURE_THORCHAIN_BLOCKCHAIN=true

    # notes this enables NATIVE chain asset only!
    # Tokens PER BLOCKCHAIN are flagged seperatly
    #FEATURE_ETHEREUM_TOKENS=true

*/

export const supportedBlockchains:any = [];
export const supportedAssets:any = [];

if(process.env['FEATURE_BITCOIN_BLOCKCHAIN']) {
    supportedBlockchains.push("Bitcoin")
    supportedAssets.push("BTC")
}

if(process.env['FEATURE_ETHEREUM_BLOCKCHAIN']) {
    supportedBlockchains.push("Ethereum")
    supportedAssets.push("ETH")
}

if(process.env['FEATURE_THORCHAIN_BLOCKCHAIN']) {
    supportedBlockchains.push("Thorchain")
    supportedAssets.push("RUNE")
}

//TODO add more flags by networks


export enum PoScoins {
    'EOS',
    'ATOM'
}

const CURRENCY_DECIMALS:any = {
    'btc': 8,
    'rune': 8,
    'dash': 8,
    'atom': 6,
    'ltc': 8,
    'doge': 8,
    'eth': 18,
    'gnt': 18,
    'usdt': 6,
    'trx': 6,
    'bnb': 8,
    'poly': 18,
    'gno': 18,
    'sngls': 0,
    'icn': 18,
    'dgd': 9,
    'mln': 18,
    'rep': 18,
    'swt': 18,
    'wings': 18,
    'trst': 6,
    'rlc': 9,
    'gup': 3,
    'ant': 18,
    'bat': 18,
    'bnt': 18,
    'snt': 18,
    'nmr': 18,
    'edg': 0,
    'eos': 18,
    'cvc': 8,
    'link': 18,
    'knc': 18,
    'mtl': 8,
    'pay': 18,
    'fun': 8,
    'dnt': 18,
    'zrx': 18,
    '1st': 18,
    'omg': 18,
    'salt': 8,
    'rcn': 18,
    'storj': 8,
    'zil': 12,
    'mana': 18,
    'tusd': 18,
    'ae': 18,
    'dai': 18,
    'mkr': 18
}

export function getPrecision(asset:string){
    if(CURRENCY_DECIMALS[asset.toLowerCase()]){
        return CURRENCY_DECIMALS[asset.toLowerCase()]
    } else {
        throw Error(" Unknown asset! "+asset)
    }
}

export function nativeToBaseAmount(asset:string,amount:string){
    if(!CURRENCY_DECIMALS[asset.toLowerCase()]) throw Error("Unknown asset!")

    let output:any = parseFloat(amount) / Math.pow(10, CURRENCY_DECIMALS[asset.toLowerCase()]);
    output = parseInt(output)
    return output
}

export const stakingCoins = ["EOS", "ATOM"];

export const segwitCoins = ["Bitcoin", "Testnet", "BitcoinGold", "Litecoin"];

export function getExplorerUrl(network:string,token:string, testnet:boolean){
    if(testnet){
        let href
        switch (network) {
            case 'bitcoin':
                href = 'https://blockstream.info/testnet'
                break
            case 'ethereum':
                href = 'https://ropsten.etherscan.io/'
                break
        }
        return href
    }else{
        let href
        switch (network) {
            case 'bitcoin':
                href = 'https://www.blockchain.com/'
                break
            case 'ethereum':
                href = 'https://etherscan.io'
                break
            case 'bitcoinCash':
                href = 'https://blockchair.com/bitcoin-cash'
                break
            case 'binance':
                href = 'https://explorer.binance.org'
                break
            case 'cosmos':
                href = 'https://www.mintscan.io'
                break
            case 'dash':
                return `https://chainz.cryptoid.info/dash`
            case 'doge':
                return `https://dogechain.info`
        }
        return href
    }
}

export function getExplorerAddressUrl(address:string,network:string,token:string, testnet:boolean){
    if(testnet){
        let href
        switch (network) {
            case 'bitcoin':
                href = 'https://blockstream.info/testnet/address/'+address
                break
            case 'ethereum':
                href = 'https://ropsten.etherscan.io/address/'+address
                break
        }
        return href
    }else{
        let href
        switch (network) {
            //TODO
            // case 'bitcoin':
            //     href = 'https://www.blockchain.com/'
            //     break
            // case 'ethereum':
            //     href = 'https://etherscan.io'
            //     break
            // case 'bitcoinCash':
            //     href = 'https://blockchair.com/bitcoin-cash'
            //     break
            // case 'binance':
            //     href = 'https://explorer.binance.org'
            //     break
            // case 'cosmos':
            //     href = 'https://www.mintscan.io'
            //     break
            // case 'dash':
            //     return `https://chainz.cryptoid.info/dash`
            // case 'doge':
            //     return `https://dogechain.info`
        }
        return href
    }
}

export function getExplorerTxUrl(tx:string,network:string,token:string, testnet:boolean){
    if(testnet){
        let href
        switch (network) {
            case 'bitcoin':
                href = 'https://blockstream.info/testnet/tx/'+tx
                break
            case 'ethereum':
                href = 'https://ropsten.etherscan.io/tx/'+tx
                break
        }
        return href
    }else{
        let href
        switch (network) {
            //TODO
            // case 'bitcoin':
            //     href = 'https://www.blockchain.com/'
            //     break
            // case 'ethereum':
            //     href = 'https://etherscan.io'
            //     break
            // case 'bitcoinCash':
            //     href = 'https://blockchair.com/bitcoin-cash'
            //     break
            // case 'binance':
            //     href = 'https://explorer.binance.org'
            //     break
            // case 'cosmos':
            //     href = 'https://www.mintscan.io'
            //     break
            // case 'dash':
            //     return `https://chainz.cryptoid.info/dash`
            // case 'doge':
            //     return `https://dogechain.info`
        }
        return href
    }
}


export const COIN_MAP = {
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

export const COIN_MAP_LONG:any = {
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

export async function normalize_pubkeys(format:string,pubkeys:any,pathsIn:any, isTestnet?:boolean) {
    let tag = TAG + " | normalize_pubkeys | "
    try {
        log.info(tag,"input: ",{format,pubkeys,pathsIn})
        if(!isTestnet) isTestnet = false
        let paths = getPaths(isTestnet)

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
                let address = await get_address_from_xpub(pubkey.xpub,pubkey.script_type,pubkey.symbol,0,0,false, isTestnet)

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

export async function get_address_from_xpub(xpub:string,scriptType:string,coin:string,account:number,index:number,isChange:boolean, isTestnet:boolean) {
    let tag = TAG + " | get_address_from_xpub | "
    try {
        let output

        //if xpub get next unused
        if(!xpub) throw Error("xpub required! coin:"+coin)


        //get pubkey at path
        let publicKey = bitcoin.bip32.fromBase58(xpub).derive(account).derive(index).publicKey

        log.info("publicKey: ********* ",publicKey)
        log.info("isTestnet: ",isTestnet)

        //TODO is clone?

        switch(coin) {
            case 'BTC':
                //TODO more types
                console.log("CHECKPOINT")
                output = await cloneCrypto.generateAddress('BTC',publicKey,'p2pkh', isTestnet)
                break;
            case 'BCH':
                //TODO more types
                output = await cloneCrypto.generateAddress('BCH',publicKey,'p2sh', isTestnet)
                break;
            case 'DOGE':
                //TODO more types
                output = await cloneCrypto.generateAddress('DOGE',publicKey,'bech32', isTestnet)
                break;
            case 'DASH':
                //TODO more types
                output = await cloneCrypto.generateAddress('DASH',publicKey,'bech32', isTestnet)
                break;
            case 'LTC':
                //TODO more types
                output = await cloneCrypto.generateAddress('LTC',publicKey,'bech32', isTestnet)
                break;
            case 'ETH':
                output = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey,true))
                break;
            case 'RUNE':
                // code block
                output = createBech32Address(publicKey,'tthor')
                break;
            case 'ATOM':
                // code block
                output = createBech32Address(publicKey,'cosmos')
                break;
            case 'BNB':
                // code block
                log.debug("pubkey: ",publicKey)
                if(!isTestnet){
                    output = createBech32Address(publicKey,'bnb')
                } else {
                    output = createBech32Address(publicKey,'tbnb')
                }

                break;
            case 'RUNE':
                // code block
                log.debug("pubkey: ",publicKey)
                if(!isTestnet){
                    output = createBech32Address(publicKey,'thor')
                } else {
                    output = createBech32Address(publicKey,'tthor')
                }

                break;
            // case 'FIO':
            //     log.debug(tag,"pubkey: ",publicKey)
            //
            //     try{
            //         //get accounts for pubkey
            //         let account = networks['FIO'].getAccountsFromPubkey(publicKey)
            //         log.debug(tag,"account: ",account)
            //     }catch(e){
            //         //no accounts
            //         //return pubkey
            //         output = {unregistered:true,pubkey:publicKey}
            //     }
            //
            //     break;
            // case 'EOS':
            //     log.debug(tag,"pubkey: ",publicKey)
            //
            //     try{
            //         //get accounts for pubkey
            //         let account = networks['EOS'].getAccountsFromPubkey(publicKey)
            //         log.debug(tag,"account: ",account)
            //     }catch(e){
            //         //no accounts
            //         //return pubkey
            //         output = {unregistered:true,pubkey:publicKey}
            //     }
            //
            //     break;
            default:
                throw Error("coin not yet implemented ! coin: "+coin)
            // code block
        }

        log.debug(tag,"output: ",output)


        return output
    } catch (e) {
        log.error(tag, "e: ", e)
    }
}
