declare const TAG = " | bnb-network | ";
declare const moment: any;
declare const Axios: any;
declare const https: any;
declare const axios: any;
declare const log: any;
declare let URL_BNBchaind: string;
declare let URL_BNBcli: string;
declare let URL_REMOTE: string;
declare let URL_DEX: string;
declare let URL_DEX_0: string;
declare let URL_DEX_1: string;
declare let URL_DEX_2: string;
declare let URL_DEX_3: string;
declare var crypto: any;
declare const ASSET = "BNB";
declare let ROUND_ROBIN_STATE: any;
declare let REMOTE_OVERRIDE_BNB: string | undefined;
declare let get_block_height: () => Promise<any>;
declare let get_balance: (address: string, token: string) => Promise<any>;
declare let get_txs_by_address: (address: string) => Promise<any>;
declare let get_txs_by_height: (height: string, address: string) => Promise<any>;
declare let get_block: (height: string) => Promise<any>;
declare let get_block_remote: (height: string) => Promise<any>;
declare let get_account: (address: string) => Promise<any>;
declare let broadcast_transaction: (rawTx: string) => Promise<any>;
declare let get_node_info: () => Promise<any>;
declare let get_node_syncing: () => Promise<any>;
declare let get_node_version: () => Promise<any>;
declare let normalize_tx: (tx: any, type: string) => any;
declare let getTransaction: (txid: string) => Promise<any>;
