declare const TAG = " | thorchain-api | ";
declare const Axios: any;
declare const https: any;
declare const axios: any;
declare const log: any;
declare let URL_KAVA_LCD: string;
declare let BASE_KAVA: number;
/**********************************
 // Lib
 //**********************************/
declare let get_transaction: (txid: string) => Promise<any>;
declare let broadcast_transaction: (tx: string) => Promise<any>;
declare let get_account_info: (address: string) => Promise<any>;
declare let normalize_tx: (tx: any, address?: string) => any;
declare let get_txs_by_address: (address: string) => Promise<any>;
declare let get_balance: (address: string) => Promise<number>;
declare let get_node_info_verbose: () => Promise<any>;
