declare const TAG = " | midgard network | ";
declare const log: any;
declare let SEED_TESTNET: string;
declare const MIDGARD_API: string;
declare const URL_THORNODE: string;
declare const Axios: any;
declare const https: any;
declare const axios: any;
declare const get_transactions_by_address: (address: string) => Promise<any>;
declare const get_transactions_by_affiliate: (address: string) => Promise<any>;
declare const get_outbound_queue: () => Promise<any>;
declare const get_actions: () => Promise<any>;
declare const get_actions_by_address: (address: string) => Promise<any>;
declare const get_transaction: (txid: string) => Promise<any>;
declare const get_new_addresses: () => Promise<any>;
declare const get_price: (asset: string) => Promise<any>;
declare const get_pool_addresses: () => Promise<any>;
declare const get_info: () => Promise<any>;
declare const get_pools: () => Promise<any>;
declare const get_pool: (poolId: string) => Promise<any>;