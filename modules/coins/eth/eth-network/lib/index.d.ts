declare const TAG = " | eth-network | ";
declare let Web3: any;
declare const Axios: any;
declare const https: any;
declare const axios: any;
declare const tokenData: any;
declare const log: any;
declare let ETHPLORER_API_KEY: string;
declare let web3: any;
declare let BASE: number;
declare const get_balance_tokens: (address: string) => Promise<{
    balances: any;
    valueUsds: any;
    coinInfo: any;
} | undefined>;
declare const get_balance_token: (address: string, token: string) => Promise<number | undefined>;
declare const get_balance: (address: string) => Promise<any>;
declare const get_transaction: (txid: string) => Promise<any>;
declare let check_online_status: () => Promise<any>;
