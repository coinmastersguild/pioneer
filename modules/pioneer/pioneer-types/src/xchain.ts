
import BigNumber from 'bignumber.js';

export type Address = string

export type Network = 'testnet' | 'mainnet'

// export type Balance = {
//     asset: Asset
//     amount: BaseAmount
// }

export type TxType = 'transfer' | 'unknown'

export type TxHash = string

export type TxTo = {
    to: Address // address
    amount: BaseAmount // amount
}

export type TxFrom = {
    from: Address | TxHash // address or tx id
    amount: BaseAmount // amount
}

export type Tx = {
    asset: Asset // asset
    from: TxFrom[] // list of "to" txs. BNC will have one `TxFrom` only, `BTC` might have many transactions going "in" (based on UTXO)
    to: TxTo[] // list of "to" transactions. BNC will have one `TxTo` only, `BTC` might have many transactions going "out" (based on UTXO)
    date: Date // timestamp of tx
    type: TxType // type
    hash: string // Tx hash
}

export type Txs = Tx[]

export type TxsPage = {
    total: number
    txs: Txs
}

export type TxHistoryParams = {
    address: Address // Address to get history for
    offset?: number // Optional Offset
    limit?: number // Optional Limit of transactions
    startTime?: Date // Optional start time
    asset?: string // Optional asset. Result transactions will be filtered by this asset
}

export type TxParams = {
    asset?: Asset
    amount: BaseAmount
    recipient: Address
    memo?: string // optional memo to pass
}

export type EstimateFeeParams = {
    sourceAsset: Asset,
    ethClient: any,
    ethInbound: any,
    inputAmount: number,
    memo: string
};

// In most cases, clients don't expect any paramter in `getFees`
// but in some cases, they do (e.g. in xchain-ethereum).
// To workaround this, we just define an "empty" (optional) param for now.
// If needed, any client can extend `FeeParams` to add more  (Check `xchain-ethereum` as an example)
// Let me know if we can do it better ... :)
export type FeesParams = { readonly empty?: '' }

export type FeeOptionKey = 'average' | 'fast' | 'fastest'
export type FeeOption = Record<FeeOptionKey, BaseAmount>

export type FeeType =
    | 'byte' // fee will be measured as `BaseAmount` per `byte`
    | 'base' // fee will be "flat" measured in `BaseAmount`

export type Fees = FeeOption & {
    type: FeeType
}

export type XChainClientParams = {
    network?: Network
    phrase?: string
}

export type CallDepositParams = {
    inboundAddress: any,
    asset: Asset,
    memo: string,
    ethClient: any,
    amount: number
};

export type Swap = {
    asset: Asset,
    amount: string,
    vaultAddress?:string,
    toAddress:string,
};

export interface config {
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


/**
 * Binance Chain
 */
export declare const BNBChain = "BNB";
/**
 * Bitcoin Chain
 */
export declare const BTCChain = "BTC";
/**
 * Ethereum Chain
 */
export declare const ETHChain = "ETH";
/**
 * Thorchain
 */
export declare const THORChain = "THOR";
/**
 * Cosmos Chain
 */
export declare const CosmosChain = "GAIA";
/**
 * Polkadot Chain
 */
export declare const PolkadotChain = "POLKA";
/**
 * Bitcoin Cash
 */
export declare const BCHChain = "BCH";
/**
 * Litecoin Chain
 */
export declare const LTCChain = "LTC";
/**
 * All possible chains XChainJS currently supports
 * */
export declare const chains: readonly ["BNB", "BTC", "ETH", "THOR", "GAIA", "POLKA", "BCH", "LTC"];

export declare enum Denomination {
    /**
     * values for asset amounts in base units (no decimal)
     */
    BASE = "BASE",
    /**
     * values of asset amounts (w/ decimal)
     */
    ASSET = "ASSET"
}
declare type Amount<T> = {
    type: T;
    amount: () => BigNumber;
    plus: (value: BigNumber.Value | Amount<T>, decimal?: number) => Amount<T>;
    minus: (value: BigNumber.Value | Amount<T>, decimal?: number) => Amount<T>;
    times: (value: BigNumber.Value | Amount<T>, decimal?: number) => Amount<T>;
    div: (value: BigNumber.Value | Amount<T>, decimal?: number) => Amount<T>;
    gt: (value: BigNumber.Value | Amount<T>) => boolean;
    gte: (value: BigNumber.Value | Amount<T>) => boolean;
    lt: (value: BigNumber.Value | Amount<T>) => boolean;
    lte: (value: BigNumber.Value | Amount<T>) => boolean;
    eq: (value: BigNumber.Value | Amount<T>) => boolean;
    decimal: number;
};
export declare type BaseAmount = Amount<Denomination.BASE>;
export declare type AssetAmount = Amount<Denomination.ASSET>;
export declare type Amounts = AssetAmount | BaseAmount;
export declare type Chain = typeof chains[number];
export declare type Asset = {
    chain: Chain;
    symbol: string;
    ticker: string;
};
