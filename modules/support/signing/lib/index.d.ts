declare const bitcoin: any;
declare const bitcoinMessage: any;
declare let PRIVKEY: string | undefined;
declare let ACCOUNT: string | undefined;
declare const log: any;
declare const TAG = " | Signing module | ";
declare let testnet: boolean;
declare const sign_message: (address: string, msg: string, privKey: string | undefined) => Promise<any>;
