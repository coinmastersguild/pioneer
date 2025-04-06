declare const TAG = " | thorchain-api | ";
declare const prettyjson: any;
declare const Axios: any;
declare const https: any;
declare const axios: any;
declare const axiosRetry: any;
declare const log: any;
declare let URL_THORNODE: string;
declare let URL_MIDGARD: string;
declare let BASE_THOR: number;
/**********************************
 // Lib
 //**********************************/
declare const get_pool: (poolId: string) => Promise<any>;
declare const get_pools: () => Promise<any>;
declare const get_pool_addresses: () => Promise<any>;
declare let get_last_block: () => Promise<any>;
declare let get_block_height: () => Promise<any>;
declare let get_transaction: (txid: string) => Promise<any>;
declare let broadcast_transaction: (tx: string) => Promise<any>;
declare let get_account_info: (address: string) => Promise<any>;
declare let normalize_tx: (tx: any, address?: string) => any;
declare let get_txs_by_address: (address: string) => Promise<any>;
declare let get_balance: (address: string) => Promise<number>;
declare let get_balances: (address: string) => Promise<{
    denom: any;
    amountBase: any;
    amount: number;
    decimals: number;
}[]>;
declare let get_node_info_verbose: () => Promise<any>;
