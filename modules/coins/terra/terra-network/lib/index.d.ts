declare const TAG = " | thorchain-api | ";
declare const prettyjson: any;
declare const Axios: any;
declare const https: any;
declare const axios: any;
declare const log: any;
declare const networks: ({
    key: string;
    fcd: string;
    mantle: string;
    selectable?: undefined;
} | {
    key: string;
    fcd: string;
    selectable: boolean;
    mantle?: undefined;
} | {
    key?: undefined;
    fcd?: undefined;
    mantle?: undefined;
    selectable?: undefined;
})[];
declare let URL_TERRA_FCD: string | undefined;
declare let URL_TERRA_MANTLE: string | undefined;
declare const DEFAULT_NETWORK = "columbus-4";
declare const DEFAULT_FCD = "https://fcd.terra.dev";
declare const DEFAULT_MANTLE = "https://mantle.terra.dev";
declare const BASE_DENOM = "uluna";
declare let BASE_TERRA: number;
/**********************************
 // Lib
 //**********************************/
declare let get_transaction: (txid: string) => Promise<any>;
declare let broadcast_transaction: (tx: string, mode?: string) => Promise<any>;
declare let get_account_info: (address: string) => Promise<any>;
declare let normalize_tx: (tx: any, address?: string) => any;
declare let get_txs_by_address: (address: string) => Promise<any>;
declare let get_balance: (address: string) => Promise<number>;
declare let get_node_info_verbose: () => Promise<any>;
