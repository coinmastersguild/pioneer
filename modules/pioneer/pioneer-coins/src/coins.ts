
const TAG = " | coin tools | "
const log = require('@pioneer-platform/loggerdog')()
// const bitcoin = require("bitcoinjs-lib");
// const ethUtils = require('ethereumjs-util');
// const ripemd160 = require("crypto-js/ripemd160")
// const CryptoJS = require("crypto-js")
// const sha256 = require("crypto-js/sha256")
// const bech32 = require(`bech32`)
//import BigNumber from 'bignumber.js'
const b58 = require('bs58check');

/*
    Rango Blockchain naming conventions
    bitcoin -> BTC
    ethereum -> ETH
    cosmos -> COSMOS
    osmosis -> OSMOSIS

 */

export const getRangoBlockchainName = function(blockchain:string){
    try{
        let rangoName
        switch (blockchain) {
            case "bitcoin":
                rangoName = "BTC";
                break;
            case "bitcoincash":
                rangoName = "BCH";
                break;
            case "avalanche":
                rangoName = "AVAX_CCHAIN";
                break;
            case "ethereum":
                rangoName = "ETH";
                break;
            case "cosmos":
                rangoName = "COSMOS";
                break;
            case "thorchain":
                rangoName = "THOR";
                break;
            case "osmosis":
                rangoName = "OSMOSIS";
                break;
            default:
                throw Error("Unknown rango name for blockchain"+blockchain)
        }
        return rangoName
    }catch(e){
        log.error(e)
    }
}

/*
    Swap protocals

 */

export const getSwapProtocals = function(asset:string, network:string){
    try{
        let output = []
        if(network === 'ETH'){
            output.push('0x')
        }
        let thorchainAssets = [ 'BCH', 'BNB', 'BTC', 'ETH', 'LTC' ]
        if(thorchainAssets.indexOf(asset) >= 0){
            output.push('thorchain')
        }
        let osmoAssets = [ 'OSMO', 'ATOM' ]
        if(osmoAssets.indexOf(asset) >= 0){
            output.push('osmosis')
        }
        return output
    }catch(e){
        log.error(e)
    }
}


/*
    TODO SS caip decoder

 */


/*
    Thorchain string parser

 */

export const parseThorchainAssetString = function(input:string){
    try{
        let parts = input.split(".")
        let network = parts[0]
        let asset
        let symbol
        let contract
        if(parts[1].indexOf("-") >= 0){
            //is Token
            let parts2 = parts[1].split("-")
            contract = parts2[1]
            asset = parts2[0]
            symbol = parts2[0]
        }else{
            //is Native asset
            asset = parts[0]
            symbol = parts[0]
        }
        return {
            asset,
            symbol,
            network,
            contract
        }
    }catch(e){
        log.error(e)
    }
}

export enum HDWALLETS {
    'pioneer',
    'trezor',
    'keepkey',
    'ledger'
}

export const THORCHAIN_NETWORKS = [
    {
        "symbol": "ARB",
        "image": "https://pioneers.dev/coins/arbitrum.png"
    },
    {
        "symbol": "AVAX",
        "image": "https://pioneers.dev/coins/avalanche.png"
    },
    {
        "symbol": "BNB",
        "image": "https://pioneers.dev/coins/binance.png"
    },
    {
        "symbol": "BSC",
        "image": "https://pioneers.dev/coins/binance.png"
    },
    {
        "symbol": "BTC",
        "image": "https://pioneers.dev/coins/bitcoin.png"
    },
    {
        "symbol": "BCH",
        "image": "https://pioneers.dev/coins/bitcoincash.png"
    },
    {
        "symbol": "GAIA",
        "image": "https://pioneers.dev/coins/cosmos.png"
    },
    {
        "symbol": "DOGE",
        "image": "https://pioneers.dev/coins/dogecoin.png"
    },
    {
        "symbol": "ETH",
        "image": "https://pioneers.dev/coins/ethereum.png"
    },
    {
        "symbol": "LTC",
        "image": "https://pioneers.dev/coins/litecoin.png"
    },
    {
        "symbol": "OP",
        "image": "https://pioneers.dev/coins/optimism.png"
    },
    {
        "symbol": "MATIC",
        "image": "https://pioneers.dev/coins/polygon.png"
    },
    {
        "symbol": "THOR",
        "image": "https://pioneers.dev/coins/undefined.png"
    }
]

/*


*/

export const UTXO_COINS = [
    'BTC',
    'BCH',
    'DASH',
    'DGB',
    'DOGE',
    'LTC',
    'TEST'
]

/*
    Name maps
 */
export const COIN_MAP = {
    arbitrum: "ARB",
    bitcoin: "BTC",
    cosmos: "ATOM",
    osmosis: "OSMO",
    testnet: "TEST",
    bitcoincash: "BCH",
    litecoin: "LTC",
    dash: "DASH",
    digibyte: "DGB",
    dogecoin: "DOGE",
    ethereum: "ETH",
    avalanche: "AVAX",
    polygon: "MATIC",
    cardano: "ADA",
    binance: "BNB",
    thorchain: "RUNE",
    eos: "EOS",
    ripple: "XRP",
    fio: "FIO",
};

export const COIN_MAP_LONG = {
    BTC: "bitcoin",
    ATOM: "cosmos",
    GAIA: "cosmos",
    ARB: "arbitrum",
    OSMO: "osmosis",
    BASE: "base",
    OP: "optimism",
    TEST: "testnet",
    BCH: "bitcoincash",
    BSC: "binance",
    LTC: "litecoin",
    DASH: "dash",
    DGB: "digibyte",
    DOGE: "dogecoin",
    RUNE: "thorchain",
    THOR: "thorchain",
    MAYA: "mayachain",
    CACAO: "mayachain",
    ETH: "ethereum",
    AVAX: "avalanche",
    ADA: "cardano",
    MATIC: "polygon",
    BNB: "binance",
    EOS: "eos",
    XRP: "ripple",
    FIO: "fio",
};

export const COIN_MAP_LONG_XCHAIN = {
    BTC: "bitcoin",
    ATOM: "cosmos",
    OSMO: "osmosis",
    TEST: "testnet",
    BCH: "bitcoincash",
    LTC: "litecoin",
    DASH: "dash",
    DGB: "digibyte",
    DOGE: "dogecoin",
    RUNE: "thorchain",
    ETH: "ethereum",
    ADA: "cardano",
    MATIC: "polygon",
    BNB: "binance",
    EOS: "eos",
    FIO: "fio",
};



export const COIN_MAP_KEEPKEY_LONG = {
    BTC: "Bitcoin",
    GAIA: "Cosmos",
    ATOM: "Cosmos",
    ARB: "Arbitrum",
    OSMO: "Osmosis",
    TEST: "Testnet",
    BCH: "BitcoinCash",
    LTC: "Litecoin",
    DASH: "Dash",
    DGB: "DigiByte",
    DOGE: "Dogecoin",
    RUNE: "Thorchain",
    THOR: "Thorchain",
    ETH: "Ethereum",
    ADA: "Cardano",
    MATIC: "Polygon",
    BSC: "Binance",
    BNB: "Binance",
    AVAX: "Avalanche",
    EOS: "Eos",
    FIO: "Fio",
    ZEC: 'Zcash',
};

export const SLIP_44_BY_LONG:any = {
    bitcoin: 0,
    testnet: 1,
    bitcoincash: 145,
    bitcoingold: 156,
    litecoin: 2,
    dash: 5,
    digibyte: 20,
    dogecoin: 3,
    bitcoinsv: 236,
    ethereum: 60,
    avalanche: 60,
    cosmos: 118,
    osmosis: 118,
    binance: 714,
    ripple: 144,
    eos: 194,
    fio: 235,
    thorchain: 931,
    cardano: 1815,
    secret: 529,
    terra: 931,
    kava: 459,
};

export const GET_NETWORK_NAME = function(network:string){
    let networkName
    switch (network) {
        case "1":
            networkName = "Main";
            break;
        case "2":
            networkName = "Morden";
            break;
        case "3":
            networkName = "Ropsten";
            break;
        case "4":
            networkName = "Rinkeby";
            break;
        case "42":
            networkName = "Kovan";
            break;
        default:
            networkName = "Unknown";
    }
    return networkName
}

const HARDENED = 0x80000000;
export function bip32Like(path: string): boolean {
    if (path == "m/") return true;
    return /^m(((\/[0-9]+h)+|(\/[0-9]+H)+|(\/[0-9]+')*)((\/[0-9]+)*))$/.test(path);
}

export function bip32ToAddressNList(path: string): number[] {
    if (!bip32Like(path)) {
        throw new Error(`Not a bip32 path: '${path}'`);
    }
    if (/^m\//i.test(path)) {
        path = path.slice(2);
    }
    const segments = path.split("/");
    if (segments.length === 1 && segments[0] === "") return [];
    const ret = new Array(segments.length);
    for (let i = 0; i < segments.length; i++) {
        const tmp = /(\d+)([hH\']?)/.exec(segments[i]);
        if (tmp === null) {
            throw new Error("Invalid input");
        }
        ret[i] = parseInt(tmp[1], 10);
        if (ret[i] >= HARDENED) {
            throw new Error("Invalid child index");
        }
        if (tmp[2] === "h" || tmp[2] === "H" || tmp[2] === "'") {
            ret[i] += HARDENED;
        } else if (tmp[2].length !== 0) {
            throw new Error("Invalid modifier");
        }
    }
    return ret;
}

export function addressNListToBIP32(address: number[]): string {
    return `m/${address.map((num) => (num >= HARDENED ? `${num - HARDENED}'` : num)).join("/")}`;
}

export function getNativeAssetForBlockchain(blockchain:string){
    // @ts-ignore
    if(COIN_MAP[blockchain.toLowerCase()]){
        // @ts-ignore
        return COIN_MAP[blockchain.toLowerCase()]
    } else {
        throw Error(" Unknown blockchain! "+blockchain)
    }
}


export const supportedBlockchains:any = [];
export const supportedAssets:any = [];

supportedBlockchains.push(
    "Bitcoin",
    "Ethereum",
    "Thorchain",
    "Secret",
    "Kava",
    "Terra",
    "BinanceSmartChain",
    "Cardano",
    "Eos",
    "Fio",
    "Cosmos",
    "Osmosis",
    "Binance",
    "BitcoinCash",
    "Litecoin",
    "Avalanche"
);

supportedAssets.push(
    "BTC",
    "ETH",
    "RUNE",
    "SCRT",
    "KAVA",
    "LUNA",
    "BNB",
    "ADA",
    "EOS",
    "FIO",
    "ATOM",
    "OSMO",
    "BNB",
    "BCH",
    "LTC",
    "AVAX"
);

// (only 1 native assets for each enabled blockchain)
export const COIN_ICONS_BY_SYMBOL = {
    BTC:"https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579",
    ETH:"https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    LTC:"https://assets.coingecko.com/coins/images/16724/thumb/ltc.png",
    BNB:"https://assets.coingecko.com/coins/images/825/thumb/binance-coin-logo.png?1547034615",
    BCH:"https://assets.coingecko.com/coins/images/780/thumb/bitcoin-cash-circle.png?1594689492",
    OSMO:"https://assets.coingecko.com/coins/images/16724/thumb/osmo.png",
    ATOM:"https://assets.coingecko.com/coins/images/16724/thumb/atom.png",
    FIO:"https://assets.coingecko.com/coins/images/16724/thumb/fio.png",
    EOS:"https://assets.coingecko.com/coins/images/16724/thumb/eos.png",
    RUNE:"https://assets.coingecko.com/coins/images/6595/thumb/RUNE.png",
    ADA:"https://assets.coingecko.com/coins/images/16724/thumb/ada.png",
    LUNA:"https://assets.coingecko.com/coins/images/8284/thumb/luna1557227471663.png?1567147072",
    KAVA:"https://assets.coingecko.com/coins/images/16724/thumb/kava.png",
    SCRT:"https://assets.coingecko.com/coins/images/16724/thumb/scrt.png",
}

//TODO add more flags by networks
const NETWORKS:any = {
    btc: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },
    bch: {
        messagePrefix: '\x18Bitcoin Cash Signed Message:\n',
        bip32: {
            public: 0x0488B21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },
    test: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef
    },
    ltc: {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bip32: {
            public: 0x019da462,
            private: 0x019d9cfe
        },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0
    },
    doge: {
        messagePrefix: '\x19Dogecoin Signed Message:\n',
        bip32: {
            public: 0x02FD3929,
            private: 0x02FD3955
        },
        pubKeyHash: 0x1e,
        scriptHash: 0x16,
        wif: 0x9e
    },
    dash: {
        messagePrefix: 'unused',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x4c,
        scriptHash: 0x10,
        wif: 0xcc
    },
    dgb: {
        messagePrefix: '\x18DigiByte Signed Message:\n',
        bip32: {
            public: 0x0488B21E,
            private: 0x0488ADE4,
        },
        pubKeyHash: 0x1e,
        scriptHash: 0x3f,
        wif: 0x80,
    },
    rdd: {
        messagePrefix: '\x18Reddcoin Signed Message:\n',
        bip32: {
            public: 0x0488B21E,
            private: 0x0488ADE4,
        },
        pubKeyHash: 0x3d,
        scriptHash: 0x05,
        wif: 0xbd,
    },
    testnet: {
        base: {
            messagePrefix: "\x18Bitcoin Signed Message:\n",
            bech32: "tb",
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            wif: 0xef,
        },
        p2sh: {
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
        },
        p2pkh: {
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
        },
        "p2sh-p2wpkh": {
            bip32: {
                public: 0x044a5262,
                private: 0x044a4e28,
            },
        },
        p2wpkh: {
            bip32: {
                public: 0x045f1cf6,
                private: 0x045f18bc,
            },
        },
    },
}

export enum PoSchains {
    'eos',
    'cosmos',
    'osmosis',
    'binance',
    'fio',
    'terra',
    'kava',
    'secret'
}

export const CURRENCY_DECIMALS:any = {
    'btc': 8,
    'rune': 8,
    'dash': 8,
    'atom': 6,
    'osmo': 6,
    'ltc': 8,
    'bch': 8,
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

export function nativeToBaseAmount(asset:string,amount:number){
    if(!CURRENCY_DECIMALS[asset.toLowerCase()]) throw Error("Unknown asset!")
    let output:any = amount / Math.pow(10, CURRENCY_DECIMALS[asset.toLowerCase()]);
    return output
}

export function baseAmountToNative(asset:string,amount:number){
    if(!CURRENCY_DECIMALS[asset.toLowerCase()]) throw Error("Unknown asset!")
    let output:any = amount * Math.pow(10, CURRENCY_DECIMALS[asset.toLowerCase()]);
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
                href = 'https://blockstream.info'
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
            case 'thorchain':
                href = 'https://thorchain.net'
                break
            case 'cosmos':
                href = 'https://www.mintscan.io'
                break
            case 'osmosis':
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

export function needsMemoByNetwork(network:string){
        let needsMemo = false
        switch (network) {
            case 'thorchain':
                needsMemo = true
                break
            case 'osmosis':
                needsMemo = true
                break
            case 'cosmos':
                needsMemo = true
                break
        }
        return needsMemo
}

export function getExplorerTxUrl(network:string,txid:string, testnet:boolean){
    if(testnet){
        let href
        switch (network) {
            case 'bitcoin':
                href = 'https://blockstream.info/testnet/tx/'+txid
                break
            case 'ethereum':
                href = 'https://ropsten.etherscan.io/tx/'+txid
                break
        }
        return href
    }else{
        let href
        switch (network) {
            case 'bitcoin':
                href = 'https://blockstream.info/tx/'+txid
                break
            case 'ethereum':
                href = 'https://etherscan.io/tx/'+txid
                break
            case 'bitcoinCash':
                href = 'https://blockchair.com/bitcoin-cash/tx/'+txid
                break
            case 'binance':
                href = 'https://explorer.binance.org/tx/'+txid
                break
            case 'thorchain':
                href = 'https://thorchain.net/tx/'+txid
                break
            case 'osmosis':
                href = 'https://www.mintscan.io/osmosis/txs/'+txid
                break
            case 'cosmos':
                href = 'https://www.mintscan.io/cosmos/txs/'+txid
                break
            case 'dash':
                return `https://chainz.cryptoid.info/dash`+txid
            case 'doge':
                return `https://dogechain.info/tx/`+txid
        }
        return href
    }
}


// All known xpub formats
const prefixes:any = new Map(
    [
        ['xpub', '0488b21e'],
        ['ypub', '049d7cb2'],
        ['Ypub', '0295b43f'],
        ['zpub', '04b24746'],
        ['Zpub', '02aa7ed3'],
        ['tpub', '043587cf'],
        ['upub', '044a5262'],
        ['Upub', '024289ef'],
        ['vpub', '045f1cf6'],
        ['Vpub', '02575483'],
        ['Ltub', '02575483'],
    ]
);

enum AddressTypes {
    "bech32",
    "legacy"
}

export function xpubConvert(xpub:string,target:string){
    if (!prefixes.has(target)) {
        return "Invalid target version";
    }

    // trim whitespace
    xpub = xpub.trim();

    var data = b58.decode(xpub);
    data = data.slice(4);
    data = Buffer.concat([Buffer.from(prefixes.get(target),'hex'), data]);
    return b58.encode(data);
}
