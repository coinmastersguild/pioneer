declare const bip39: any;
declare const bip32: any;
declare const secp256k1: any;
declare const CryptoJS: any;
declare const HDKey: any;
declare let bitcoin: any;
declare const log: any;
declare var b58: any;
declare const BIP84: any;
/**********************************
 // Module
 //**********************************/
declare enum COIN_SUPPORT_ENUM {
    BTC = 0,
    BCH = 1,
    DASH = 2,
    DGB = 3,
    DOGE = 4,
    LTC = 5,
    RDD = 6
}
declare const COIN_SUPPORT: string[];
declare const SLIP_44: any;
declare const NETWORKS: any;
interface CoinInfo {
    privateKey: string;
    coin: string;
    master: string;
    publicKey: string;
    xpub: string;
    zpub?: string;
}
interface Wallet {
    coins: {
        [index: string]: CoinInfo;
    };
}
declare const prefixes: any;
declare enum AddressTypes {
    "bech32" = 0,
    "legacy" = 1
}
declare function standardRandomBytesFunc(size: any): any;
declare function deriveMasterKey(mnemonic: string, path: string): Promise<{
    masterKey: any;
    xpub: any;
}>;
declare function deriveKeypair(masterKey: any, path: string): {
    privateKey: any;
    publicKey: any;
};
