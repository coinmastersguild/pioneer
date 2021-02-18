const bech32 = require(`bech32`)

const supportedCoins = [
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
];

enum PoScoins {
    'EOS',
    'ATOM'
}

const stakingCoins = ["EOS", "ATOM"];

const segwitCoins = ["Bitcoin", "Testnet", "BitcoinGold", "Litecoin"];

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

const HD_ATOM_KEYPATH="m/44'/118'/0'/0/0"
const ATOM_CHAIN="cosmoshub-3"
const ATOM_BASE=1000000
const ATOM_TX_FEE="100"
const ATOM_MAX_GAS="100000"

const HD_BNB_KEYPATH="44'/714'/0'/0/"
const BNB_ASSET_SYMBOL="BNB"
const BNB_CHAIN=""
const BNB_MAX_GAS="100000"
const BNB_TX_FEE="100"
const BNB_BASE=100000000

const HD_EOS_KEYPATH="44'/194'/0'/0/"
const EOS_ASSET_SYMBOL="EOS"
const EOS_CHAIN="aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
const EOS_MAX_GAS="100000"
const EOS_TX_FEE="100"
const EOS_BASE=1000

const ETH_BASE = 1000000000000000000
const HARDENED = 0x80000000;

//TODO THIS IS DUMB AS SHIT FIXME default cant be null?
export function getBase(coin:string) {
    switch(coin) {
        case "ETH":
            return ETH_BASE
        default:
            return 100000000
    }
}

export function bip32Like(path: string): boolean {
    if (path == "m/") return true;
    return /^m(((\/[0-9]+h)+|(\/[0-9]+H)+|(\/[0-9]+')*)((\/[0-9]+)*))$/.test(
        path
    );
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


export function bech32ify(address:any, prefix:string) {
    const words = bech32.toWords(address)
    return bech32.encode(prefix, words)
}
