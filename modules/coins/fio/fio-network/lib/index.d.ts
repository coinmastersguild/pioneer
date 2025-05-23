declare const FIOSDK: any;
declare const fetchJson: (uri: string, opts?: {}) => Promise<Response>;
declare const TAG = " | fio-network | ";
declare const log: any;
declare const Axios: any;
declare const https: any;
declare const axios: any;
declare const FIO_BASE = 1000000000;
declare const baseUrl = "https://fioprotocol.io:443/v1";
declare const testnetUrl = "http://testnet.fioprotocol.io/v1";
declare const fioNode: string;
declare const historyNode: string;
declare const fioTestnetDomain = "fiotestnet";
declare const fioTokenCode = "FIO";
declare const fioChainCode = "FIO";
declare const defaultFee: number;
interface FioTx {
    "signatures": [
        "string"
    ];
    "compression": "string";
    "packed_context_free_data": "string";
    "packed_trx": "string";
}
declare let get_pending_requests: (pubkey: string) => Promise<any>;
declare let get_account_info_from_account: (account: string) => Promise<any>;
declare let get_pubkey_from_account: (account: string) => Promise<any>;
declare let broadcast_new_funds_request_tx: (tx: any) => Promise<any>;
declare let broadcast_payment_request: (tx: any) => Promise<any>;
declare let broadcast_register_address: (tx: any) => Promise<any>;
declare let broadcast_add_pub_address_tx: (tx: any) => Promise<any>;
declare let broadcast_tx_bundle: (tx: any) => Promise<any>;
declare let broadcast_tx: (tx: any) => Promise<any>;
declare let get_block: (height: string) => Promise<any>;
declare let get_latest_block_height: () => Promise<any>;
declare let get_txs: (account: string) => Promise<any>;
declare let get_obt_data: (fio_public_key: string) => Promise<any>;
declare let get_balance: (pubkey: string) => Promise<any>;
declare let is_available: (username: string) => Promise<any>;
declare let get_actor: (pubkey: string) => Promise<any>;
declare let get_account_from_actor: (actor: string) => Promise<any>;
declare let get_account_address: (username: string, asset: string) => Promise<any>;
declare let get_accounts_from_pubkey: (pubkey: string) => Promise<any>;
declare let get_node_info_verbose: () => Promise<any>;
