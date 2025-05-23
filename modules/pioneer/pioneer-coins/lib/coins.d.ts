export declare const getRangoBlockchainName: (blockchain: string) => string | undefined;
export declare const getSwapProtocals: (asset: string, network: string) => string[] | undefined;
export declare const parseThorchainAssetString: (input: string) => {
    asset: string;
    symbol: string;
    network: string;
    contract: string | undefined;
} | undefined;
export declare enum HDWALLETS {
    'pioneer' = 0,
    'trezor' = 1,
    'keepkey' = 2,
    'ledger' = 3
}
export declare const THORCHAIN_NETWORKS: {
    symbol: string;
    image: string;
}[];
export declare const UTXO_COINS: string[];
export declare const COIN_MAP: {
    arbitrum: string;
    bitcoin: string;
    cosmos: string;
    osmosis: string;
    testnet: string;
    bitcoincash: string;
    litecoin: string;
    dash: string;
    digibyte: string;
    dogecoin: string;
    ethereum: string;
    avalanche: string;
    polygon: string;
    cardano: string;
    binance: string;
    thorchain: string;
    eos: string;
    ripple: string;
    fio: string;
};
export declare const COIN_MAP_LONG: {
    BTC: string;
    ATOM: string;
    GAIA: string;
    ARB: string;
    OSMO: string;
    BASE: string;
    OP: string;
    TEST: string;
    BCH: string;
    BSC: string;
    LTC: string;
    DASH: string;
    DGB: string;
    DOGE: string;
    RUNE: string;
    THOR: string;
    MAYA: string;
    CACAO: string;
    ETH: string;
    AVAX: string;
    ADA: string;
    MATIC: string;
    BNB: string;
    EOS: string;
    XRP: string;
    FIO: string;
};
export declare const COIN_MAP_LONG_XCHAIN: {
    BTC: string;
    ATOM: string;
    OSMO: string;
    TEST: string;
    BCH: string;
    LTC: string;
    DASH: string;
    DGB: string;
    DOGE: string;
    RUNE: string;
    ETH: string;
    ADA: string;
    MATIC: string;
    BNB: string;
    EOS: string;
    FIO: string;
};
export declare const COIN_MAP_KEEPKEY_LONG: {
    BTC: string;
    GAIA: string;
    ATOM: string;
    ARB: string;
    OSMO: string;
    TEST: string;
    BCH: string;
    LTC: string;
    DASH: string;
    DGB: string;
    DOGE: string;
    RUNE: string;
    THOR: string;
    ETH: string;
    ADA: string;
    MATIC: string;
    BSC: string;
    BNB: string;
    AVAX: string;
    EOS: string;
    FIO: string;
    ZEC: string;
};
export declare const SLIP_44_BY_LONG: any;
export declare const GET_NETWORK_NAME: (network: string) => string;
export declare function bip32Like(path: string): boolean;
export declare function bip32ToAddressNList(path: string): number[];
export declare function addressNListToBIP32(address: number[]): string;
export declare function getNativeAssetForBlockchain(blockchain: string): any;
export declare const supportedBlockchains: any;
export declare const supportedAssets: any;
export declare const COIN_ICONS_BY_SYMBOL: {
    BTC: string;
    ETH: string;
    LTC: string;
    BNB: string;
    BCH: string;
    OSMO: string;
    ATOM: string;
    FIO: string;
    EOS: string;
    RUNE: string;
    ADA: string;
    LUNA: string;
    KAVA: string;
    SCRT: string;
};
export declare enum PoSchains {
    'eos' = 0,
    'cosmos' = 1,
    'osmosis' = 2,
    'binance' = 3,
    'fio' = 4,
    'terra' = 5,
    'kava' = 6,
    'secret' = 7
}
export declare const CURRENCY_DECIMALS: any;
export declare function getPrecision(asset: string): any;
export declare function nativeToBaseAmount(asset: string, amount: number): any;
export declare function baseAmountToNative(asset: string, amount: number): any;
export declare const stakingCoins: string[];
export declare const segwitCoins: string[];
export declare function getExplorerUrl(network: string, token: string, testnet: boolean): string | undefined;
export declare function getExplorerAddressUrl(address: string, network: string, token: string, testnet: boolean): string | undefined;
export declare function needsMemoByNetwork(network: string): boolean;
export declare function getExplorerTxUrl(network: string, txid: string, testnet: boolean): string | undefined;
export declare function xpubConvert(xpub: string, target: string): any;
