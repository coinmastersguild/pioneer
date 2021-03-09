/*

     Pioneer SDK
        A typescript sdk for integration for native wallets

 */

import { Asset, BaseAmount } from '@bithighlander/xchain-util'

const TAG = " | Pioneer-sdk | "
const log = require("@pioneer-platform/loggerdog")()

//Pioneer follows OpenAPI spec
const Pioneer = require('openapi-client-axios').default;
import { BncClient } from '@binance-chain/javascript-sdk/lib/client'
let {
    getExplorerUrl,
    getExplorerAddressUrl,
    getExplorerTxUrl
} = require('@pioneer-platform/pioneer-coins')


/*
    import from xchain
 */

export type Address = string

export type Network = 'testnet' | 'mainnet'

export type Balance = {
    asset: Asset
    amount: BaseAmount
}

export type Balances = Balance[]

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


module.exports = class wallet {
    private spec: string;
    private pioneerApi: any;
    private info: any
    private init: () => Promise<any>;
    private queryKey: string;
    private service: string;
    private getNetwork: () => any;
    private network: any;
    private getExplorerUrl: (coin: string) => any;
    private getExplorerAddressUrl: (coin: string) => any;
    private getExplorerTxUrl: (coin: string) => any;
    private validateAddress: (coin: string, address: string) => any;
    private setPhrase: (coin: string, phrase: string) => any;
    private getBalance: (address?: Address, asset?:any) => any;
    private getTransactions: (address?: Address, asset?:any) => any;
    private getTransactionData: (address?: Address, asset?:any) => any;
    private purgeClient: (address?: Address, asset?:any) => any;
    private getFees: (params?: FeesParams) => any;
    private transfer: (tx: any) => any;
    private isTestnet: boolean;
    private getBncClient: (() => void) | undefined;
    private bncClient?: any;
    private getAddress: () => any;
    private nativeAsset: string;
    constructor(spec:string,config:any) {
        this.network = config.blockchain
        this.nativeAsset = config.nativeAsset
        this.service = config.service || 'unknown'
        if(config.network === 'mainnet'){
            this.isTestnet = false
        } else {
            this.isTestnet = true
        }
        this.queryKey = config.queryKey
        this.spec = config.spec
        this.init = async function () {
            let tag = TAG + " | init_wallet | "
            try{
                if(!this.queryKey) throw Error(" You must create an api key! ")
                this.pioneerApi = new Pioneer({
                    definition:spec,
                    axiosConfigDefaults: {
                        headers: {
                            'Authorization': this.queryKey,
                        },
                    }
                });
                this.pioneerApi = await this.pioneerApi.init()

                //get info
                // @ts-ignore
                let info = await this.pioneerApi.Info()
                //TODO error handling
                this.info = info.data

                return this.pioneerApi
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        /*
            Network specific functions
         */
        if(this.network === 'binance'){
            this.getBncClient = function () {
                let tag = TAG + " | getBncClient | "
                try {
                    let clientUrl
                    let network
                    if(this.isTestnet){
                        network = 'testnet'
                        clientUrl = "https://testnet-dex.binance.org"
                    } else {
                        network = 'mainnet'
                        clientUrl = "https://dex.binance.org"
                    }
                    this.bncClient = new BncClient(clientUrl)
                    this.bncClient.chooseNetwork(network)
                    return this.bncClient
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }

            //TODO getMultiSendFees
            //TODO getSingleAndMultiFees
            //TODO multiSend

        }

        /*
             Commonn API
         */
        this.getNetwork = function () {
            let tag = TAG + " | getNetwork | "
            try {
                if(this.isTestnet){
                    return 'testnet'
                } else {
                    return 'mainnet'
                }
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getExplorerUrl = function () {
            let tag = TAG + " | getExplorerUrl | "
            try {
                return getExplorerUrl(this.network,'native',this.isTestnet)
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getExplorerAddressUrl = function (address:string) {
            let tag = TAG + " | getExplorerAddressUrl | "
            try {
                return getExplorerAddressUrl(address,this.network,'native',this.isTestnet)
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getExplorerTxUrl = function (tx:string) {
            let tag = TAG + " | getExplorerTxUrl | "
            try {
                return getExplorerTxUrl(tx,this.network,'native',this.isTestnet)
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getAddress = function () {
            let tag = TAG + " | getAddress | "
            try {
                return this.info.masters[this.nativeAsset]
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.validateAddress = function (address:string) {
            let tag = TAG + " | validateAddress | "
            try {
                //TODO
                return true
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.setPhrase = function (phrase:string) {
            let tag = TAG + " | setPhrase | "
            try {
                return "n/a"
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getBalance = function (address?: Address, asset?: Asset) {
            let tag = TAG + " | getBalance | "
            try {
                //TODO if address
                //request to api

                return this.info.balances[this.nativeAsset]
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getTransactions = function (address?: Address, asset?: Asset) {
            let tag = TAG + " | getTransactions | "
            try {
                //TODO
                return [{"foo":"bar"}]
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getTransactionData = function (address?: Address, asset?: Asset) {
            let tag = TAG + " | getTransactionData | "
            try {
                //TODO
                return "bla"
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getFees = function (params?: FeesParams) {
            let tag = TAG + " | getFees | "
            try {
                //TODO
                return "high"
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.transfer = function (tx:any) {
            let tag = TAG + " | transfer | "
            try {
                //TODO
                return "bla"
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.purgeClient = function (address?: Address, asset?: Asset) {
            let tag = TAG + " | purgeClient | "
            try {
                //TODO
                return "bla"
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
    }
}

