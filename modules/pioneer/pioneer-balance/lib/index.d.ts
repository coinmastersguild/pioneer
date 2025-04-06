export declare const UTXO_SUPPORT: string[];
export declare const TENDERMINT_SUPPORT: string[];
export declare const CAIP_TO_COIN_MAP: {
    [key: string]: string;
};
export declare const OTHER_SUPPORT: string[];
export declare const SUPPORTED_CAIPS: {
    UTXO: string[];
    TENDERMINT: string[];
    EIP155: string[];
    OTHER: string[];
};
export declare class Balance {
    private blockchains;
    private nodes;
    private charts;
    private networks;
    constructor(config: any);
    init(): Promise<boolean>;
    getNodes(networkId: string): Promise<any>;
    classifyCaip(caip: string): Promise<string>;
    getBalance(asset: any, pubkey: any): Promise<any>;
}
