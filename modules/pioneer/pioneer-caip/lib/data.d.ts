export declare const networkIdToCaip: (networkId: string) => string;
export declare const caipToNetworkId: (caip: string) => string;
export declare const evmCaips: {
    ethereum: string;
    base: string;
    polygon: string;
    pulsechain: string;
    optimism: string;
    'gnosis-chain-(formerly-xdai)': string;
    gnosis: string;
    'binance-smart-chain': string;
    'smart-bitcoin-cash': string;
    arbitrum: string;
    fuse: string;
    'bittorrent-chain': string;
    celo: string;
    avalanche: string;
    grli: string;
    eos: string;
    'ethereum-classic': string;
    evmos: string;
    'poa-network-core': string;
};
export declare enum Chain {
    Arbitrum = "ARB",
    Avalanche = "AVAX",
    Base = "BASE",
    Binance = "BNB",
    BinanceSmartChain = "BSC",
    Bitcoin = "BTC",
    BitcoinCash = "BCH",
    Cosmos = "GAIA",
    Dash = "DASH",
    Digibyte = "DGB",
    Dogecoin = "DOGE",
    EOS = "EOS",
    Ethereum = "ETH",
    Kujira = "KUJI",
    Litecoin = "LTC",
    Mayachain = "MAYA",
    Optimism = "OP",
    Osmosis = "OSMO",
    Polygon = "MATIC",
    Ripple = "XRP",
    THORChain = "THOR",
    Zcash = "ZEC"
}
export declare const ChainToCaip: Record<string, string>;
export declare const ChainToNetworkId: Record<string, string>;
export declare const NetworkIdToChain: Record<string, string>;
export declare function getChainEnumValue(chainStr: string): Chain | undefined;
export declare const shortListSymbolToCoinGeckoPlatformId: {
    ARB: string;
    BASE: string;
    ETH: string;
    GNO: string;
    MATIC: string;
    OP: string;
    AVAX: string;
    BNB: string;
};
export declare const shortListSymbolToCaip: {
    ATOM: string;
    ARB: string;
    BTC: string;
    BASE: string;
    OSMO: string;
    BCH: string;
    LTC: string;
    GAIA: string;
    DASH: string;
    DGB: string;
    DOGE: string;
    RUNE: string;
    THOR: string;
    MAYA: string;
    ETH: string;
    GNO: string;
    XRP: string;
    MATIC: string;
    OP: string;
    AVAX: string;
    ADA: string;
    BNB: string;
    BSC: string;
    EOS: string;
    FIO: string;
};
export declare const shortListNameToCaip: {
    bitcoin: string;
    arbitrum: string;
    cosmos: string;
    osmosis: string;
    polygon: string;
    bitcoincash: string;
    litecoin: string;
    dash: string;
    digiByte: string;
    dogecoin: string;
    thorchain: string;
    mayachain: string;
    ethereum: string;
    avalanche: string;
    gnosis: string;
    bnbsmartchain: string;
    ripple: string;
    optimism: string;
    base: string;
    kuji: string;
    cardano: string;
    binance: string;
    eos: string;
    fio: string;
};
export declare const shortListRangoNameToNetworkId: {
    COSMOS: string;
    OSMOSIS: string;
    AVAX_CCHAIN: string;
    ETH: string;
    BASE: string;
    THOR: string;
    MAYA: string;
    BCH: string;
    LTC: string;
    DASH: string;
    DGB: string;
    DOGE: string;
};
export declare const NetworkIdToRangoName: (networkId: string) => string | null;
declare let tokenToCaip: (token: any) => any;
declare let thorchainToCaip: (identifier: string) => string;
declare let caipToThorchain: (caip: string, ticker: string) => string | null;
declare let caipToRango: (caip: string, ticker: string) => {
    blockchain: string;
    symbol: string;
    address: string | null;
} | null;
export { thorchainToCaip, tokenToCaip, caipToThorchain, caipToRango };
