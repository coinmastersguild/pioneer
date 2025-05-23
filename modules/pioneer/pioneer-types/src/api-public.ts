

interface Asset {
    chain:string,
    symbol:string,
    ticker:string,
}
export interface ThorchainMemoEncodedBody {
    asset:Asset,
    vaultAddress:string,
    toAddress:string
}
export interface BroadcastBody {
    networkId:string,
    asset?:string,
    isTestnet?:boolean,
    serialized:string
    signature?:string
    type?:string
    txid?:string
    noBroadcast?:boolean
    description?:any
    invocationId?:string
}
export interface GetFeesWithMemoBody{
    network:string
    memo:string,
}
export interface EstimateFeeBody{
    coin:string
    amount:string,
        contract:string,
        recipient:string,
        memo:string
}
export interface BodyAllowance {
    token:string
    spender:string
    sender:string
}

