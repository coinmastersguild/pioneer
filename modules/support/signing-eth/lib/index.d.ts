declare const log: any;
declare const TAG = " | Signing module | ";
declare let signer: any;
declare let testnet: boolean;
declare let SEED: string | undefined;
declare let ACCOUNT: string | undefined;
declare const sign_message: (address: string, msg: string, SEED: string | undefined) => Promise<any>;
