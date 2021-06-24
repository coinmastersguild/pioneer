/*
    Pioneer Types

 */

// export interface Asset {
//     chain:string,
//     symbol:string,
//     ticker:string,
// }
//
// export interface Balance {
//     total:number
//     pending:number
//     confirmed:number
// }

export enum HDWALLETS {
    'pioneer',
    'trezor',
    'keepkey',
    'ledger',
    'metamask'
}

export interface EventsConfig {
    wss: string;
    username?:string
    queryKey?:string
}

export interface AppConfig {
    wss: string;
    password?:string | undefined
    spec: string;
    username:string
    queryKey:string
    hardware?:string
    locale?:string
    localeSelected?:boolean
    isCli?:boolean
    temp?:string
    blockchains:any
    created?:string
}

export interface PioneerConfig {
    isTestnet?:boolean
    mnemonic?:string
    pioneerApi:boolean
    paths?:any
    context:string
    wss: string;
    spec: string;
    username:string
    queryKey:string
    hardware?:boolean
    wallet?:string
    pubkeys?:string
    vendor?:string
    locale?:string
    localeSelected?:boolean
    isCli?:boolean
    temp?:string
    blockchains:any
    created?:string
    walletDescription?:any
}


//User
export interface User {
    type: string;
    wallet: string;
    keystore: any;
    clients: any
    context: string;
    valueUsdContext: string
    assetContext: string
    assetBalanceNativeContext: string
    assetBalanceUsdValueContext: string

}

export interface Wallet {
    mnemonic: string;
    password: string;
    masterAddress: string;
    temp?:string
}

export interface CitadelWallet {
    isTestnet?: boolean;
    temp?:string
    masterAddress: string;
    TYPE: string;
    seed_encrypted:string
    hash:string
    filename:string
}

export interface Transfer {
    network: string;
    asset: string;
    symbol?: string;
    feeRate: any
    recipient: string
    amount:any
    memo:string
    noBroadcast:boolean
}

export interface Transaction {
    coin?: string;
    network: string;
    asset: string;
    symbol?: string;
    addressFrom?: string;
    addressTo: string;
    address?: string;
    amount: string;
    memo?: string | undefined;
    nonce?:number
    feeLevel?:string,
    noBroadcast?:boolean
}

//TransactionUnsigned
export interface UnsignedTransaction {
    coin?: string;
    network: string;
    invocationId?:string,
    deposit?:any,
    transaction:Transaction,
    HDwalletPayload:any, // this has specific types per blockchain?
    verbal:any
}

export interface CoinInfo {
    coin: string;
    note?: string;
    script_type:string;
    available_scripts_types?:[string]
    long?: string;
    path:string
    master: string;
    network:string;
    pubkey: string;
    curve?: string,
    xpub?: string;
    zpub?: string;
    type?:string
}

export interface Approval {
    contract:string,
    tokenAddress:string,
    amount:number,
    invocationId?:string,
    nonce?:string,
    coin?:string,
    noBroadcast?:boolean
}

export interface SendToAddress {
    invocationId?:string
    blockchain:string
    addressTo?:string
    coin?:string
    asset:string
    network:string
    amount:string
    address:string
    memo?:string
    noBroadcast?:boolean
}

export interface Config {
    walletId?:string
    context:string
    blockchains:any
    wss?:string,
    spec:string,
    env:string,
    mode:string,
    username:string,
    addresses?:[]
    wallet?:any,
    pubkeys?:any,
    auth?:string,
    paths?:any,
    privWallet?:any,
    mnemonic?:string,
    queryKey?:string
    offline?:boolean
    pioneerApi?:boolean
}


