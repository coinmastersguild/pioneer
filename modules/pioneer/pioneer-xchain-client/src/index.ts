/*

     Pioneer SDK
        A typescript sdk for integration for native wallets

 */
import BigNumber from 'bignumber.js'
import { ethers, BigNumberish } from 'ethers'
const TAG = " | Pioneer-sdk | "
const log = require("@pioneer-platform/loggerdog")()

//Pioneer follows OpenAPI spec
const Pioneer = require('openapi-client-axios').default;
import { BncClient } from '@binance-chain/javascript-sdk/lib/client'
import { EtherscanProvider, getDefaultProvider } from '@ethersproject/providers'
import { Provider, TransactionResponse } from '@ethersproject/abstract-provider'
let {
    getPrecision,
    getExplorerUrl,
    getExplorerAddressUrl,
    getExplorerTxUrl
} = require('@pioneer-platform/pioneer-coins')

import {
    Balances
} from '@bithighlander/xchain-client'


import {
    Asset,
    AssetETH,
    baseAmount,
    baseToAsset,
    BaseAmount,
    assetFromString,
    assetAmount,
    assetToBase,
    assetToString,
    ETHChain,
} from '@bithighlander/xchain-util'

/*
    import from xchain
 */

type Amount<T> = {
    type: T
    amount: () => BigNumber
    decimal: number
}

export type Address = string

export type Network = 'testnet' | 'mainnet'

export type Balance = {
    asset: Asset
    amount: BaseAmount
}

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

const TCRopstenAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"address","name":"asset","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"memo","type":"string"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldVault","type":"address"},{"indexed":true,"internalType":"address","name":"newVault","type":"address"},{"indexed":false,"internalType":"address","name":"asset","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"memo","type":"string"}],"name":"TransferAllowance","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"vault","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"address","name":"asset","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"string","name":"memo","type":"string"}],"name":"TransferOut","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldVault","type":"address"},{"indexed":true,"internalType":"address","name":"newVault","type":"address"},{"components":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"indexed":false,"internalType":"struct Router.Coin[]","name":"coins","type":"tuple[]"},{"indexed":false,"internalType":"string","name":"memo","type":"string"}],"name":"VaultTransfer","type":"event"},{"inputs":[],"name":"RUNE","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"recipients","type":"address[]"},{"components":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct Router.Coin[]","name":"coins","type":"tuple[]"},{"internalType":"string[]","name":"memos","type":"string[]"}],"name":"batchTransferOut","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address payable","name":"vault","type":"address"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"memo","type":"string"}],"name":"deposit","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"router","type":"address"},{"internalType":"address payable","name":"asgard","type":"address"},{"components":[{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"internalType":"struct Router.Coin[]","name":"coins","type":"tuple[]"},{"internalType":"string","name":"memo","type":"string"}],"name":"returnVaultAssets","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"router","type":"address"},{"internalType":"address","name":"newVault","type":"address"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"memo","type":"string"}],"name":"transferAllowance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address payable","name":"to","type":"address"},{"internalType":"address","name":"asset","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"string","name":"memo","type":"string"}],"name":"transferOut","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"vaultAllowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];


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


module.exports = class wallet {
    private spec: string;
    private username: string;
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
    private getTransactions!: (address?: Address, asset?: any) => any;
    private getTransactionData!: (address?: Address, asset?: any) => any;
    private purgeClient!: (address?: Address, asset?: any) => any;
    private getFees!: (params?: FeesParams) => any;
    private transfer!: (tx: any) => any;
    private isTestnet: boolean;
    private getBncClient: (() => void) | undefined;
    private bncClient?: any;
    private getAddress: () => any;
    private nativeAsset: string;
    //ETH specific
    private estimateFeesWithGasPricesAndLimits?: (params: any) => Promise<any>;
    private getWallet: (() => any) | undefined;
    private getProvider: (() => any) | undefined;
    private getFeesWithMemo: (() => { fees: { average: { amount: () => BigNumber; }; fast: { amount: () => BigNumber; }; fastest: { amount: () => BigNumber; }; type: string; }; rates: any; }) | undefined;
    private getFeeRates: (() => { fees: { average: { amount: () => BigNumber; }; fast: { amount: () => BigNumber; }; fastest: { amount: () => BigNumber; }; type: string; }; rates: any; }) | undefined;
    private estimateFee: (({sourceAsset, ethClient, ethInbound, inputAmount, memo}: EstimateFeeParams) => Promise<any>) | undefined;
    private callDeposit: (({inboundAddress, asset, memo, ethClient, amount}: CallDepositParams) => Promise<any>) | undefined;
    private buildSwap: (swap: Swap) => Promise<any>;
    constructor(spec:string,config:any) {
        this.username = ''
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
                this.username = this.info.username

                return this.pioneerApi
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        /*
            Network specific functions

            Binance:
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
            Network specific functions

            Bitcoin:
         */
        if(this.network === 'bitcoin'){
            //TODO
            // this.derivePath = function () {
            //     let tag = TAG + " | getBncClient | "
            //     try {
            //         //TODO
            //     } catch (e) {
            //         log.error(tag, "e: ", e)
            //     }
            // }

            //TODO
            // this.getFeesWithRates = function () {
            //     let tag = TAG + " | getFeesWithRates | "
            //     try {
            //         //TODO
            //     } catch (e) {
            //         log.error(tag, "e: ", e)
            //     }
            // }

            // @ts-ignore
            this.getFeeRates = async function () {
                let tag = TAG + " | getFeeRates | "
                try {

                    let response = await this.pioneerApi.GetFeesWithMemo(null,{coin:'BTC',memo:''})
                    response = response.data
                    console.log("response: ",response)

                    return response.rates
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }

            // @ts-ignore
            this.getFeesWithMemo = async function (memo?:string) {
                let tag = TAG + " | getFeesWithMemo | "
                try {
                    let params = {
                        coin:'BTC',
                        memo:"asdasdasdasdasda"
                    }
                    console.log("this.pioneerApi: ",this.pioneerApi)
                    let response = await this.pioneerApi.GetFeesWithMemo(null,params)
                    response = response.data
                    console.log("response: ",response)

                    let output = {
                        fees:{
                            type: 'byte',
                            average:{
                                amount:function(){
                                    return new BigNumber(response.fees.average)
                                }
                            },
                            fast:{
                                amount:function(){
                                    return new BigNumber(response.fees.fast)
                                }
                            },
                            fastest:{
                                amount:function(){
                                    return new BigNumber(response.fees.fastest)
                                }
                            }
                        }
                    }

                    return output.fees
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }

        }


        /*
            Network specific functions

            Ethereum:
         */
        if(this.network === 'ethereum'){

            this.estimateFeesWithGasPricesAndLimits = async function (params:any) {
                let tag = TAG + " | estimateFeesWithGasPricesAndLimits | "
                try {
                    let response = await this.pioneerApi.EstimateFeesWithGasPricesAndLimits(null,params)
                    response = response.data
                    let output = {
                        gasPrices:response.gasPrices,
                        fees:{
                            type: 'byte',
                            average:{
                                amount:function(){
                                    return new BigNumber(response.fees.average)
                                }
                            },
                            fast:{
                                amount:function(){
                                    return new BigNumber(response.fees.fast)
                                }
                            },
                            fastest:{
                                amount:function(){
                                    return new BigNumber(response.fees.fastest)
                                }
                            }
                        }
                    }

                    return output
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }

            // this.callDeposit = async function ({inboundAddress, asset, memo, ethClient, amount}: CallDepositParams) {
            //     let tag = TAG + " | getWallet | "
            //     try {
            //         let hash;
            //         const wallet = ethClient.getWallet();
            //         //TODO mainnet
            //         const abi = TCRopstenAbi;
            //
            //         if (asset.ticker === 'ETH') {
            //
            //             const ethAddress = await ethClient.getAddress();
            //             const contract = new ethers.Contract(inboundAddress.router, abi, wallet);
            //
            //             console.log('Checkpoint eth-utils: ethAddress:', ethAddress);
            //             console.log('Checkpoint eth-utils: contract:', contract);
            //
            //             const contractRes = await contract.deposit(
            //                 inboundAddress.address, // not sure if this is correct...
            //                 '0x0000000000000000000000000000000000000000',
            //                 ethers.utils.parseEther(String(amount)),
            //                 // memo,
            //                 memo,
            //                 {from: ethAddress, value: ethers.utils.parseEther(String(amount))}
            //             );
            //
            //             // tslint:disable-next-line:no-string-literal
            //             hash = contractRes['hash'] ? contractRes['hash'] : '';
            //
            //         } else {
            //             //TODO tokens
            //             // const assetAddress = asset.symbol.slice(asset.ticker.length + 1);
            //             // const strip0x = assetAddress.substr(2);
            //             // const checkSummedAddress = ethers.utils.getAddress(strip0x);
            //             // const tokenContract = new ethers.Contract(checkSummedAddress, erc20ABI, wallet);
            //             // const decimal = await tokenContract.decimals();
            //             // const params = [
            //             //     inboundAddress.address, // vault
            //             //     checkSummedAddress, // asset
            //             //     assetToBase(assetAmount(amount, decimal.toNumber())).amount().toFixed(), // amount
            //             //     memo
            //             // ];
            //             //
            //             // const contractRes = await ethClient.call(inboundAddress.router, abi, 'deposit', params);
            //             //
            //             // // tslint:disable-next-line:no-string-literal
            //             // hash = contractRes['hash'] ? contractRes['hash'] : '';
            //
            //         }
            //
            //         return hash;
            //     } catch (e) {
            //         log.error(tag, "e: ", e)
            //     }
            // }

            this.estimateFee = async function ({sourceAsset, ethClient, ethInbound, inputAmount, memo}: EstimateFeeParams) {
                let tag = TAG + " | getWallet | "
                try {

                    let params = {
                        coin:"ETH",
                        amount:assetToBase(assetAmount(inputAmount, 18)).amount().toFixed(),
                        contract:"0x9d496De78837f5a2bA64Cb40E62c19FBcB67f55a",
                        recipient:ethInbound.address,
                        memo
                    }
                    let response = await this.pioneerApi.EstimateFeesWithGasPricesAndLimits(null,params)
                    response = response.data

                    return new BigNumber(response,18)
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }

            this.getWallet = async function () {
                let tag = TAG + " | getWallet | "
                try {
                    //TODO With hardware we dont have seed.
                    //Inject with test seed for now and see what anarchy happens
                    //In theory we only use this for a few contract special things

                    let wallet:ethers.Wallet = ethers.Wallet.fromMnemonic("alcohol woman abuse must during monitor noble actual mixed trade anger aisle")
                    let provider = getDefaultProvider('testnet')
                    await wallet.connect(provider)

                    return wallet
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }

            this.getProvider = function () {
                let tag = TAG + " | getProvider | "
                try {
                    return getDefaultProvider(this.network)
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }
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
        // @ts-ignore
        this.getBalance = async function (address?: Address, asset?: Asset): Promise<Balances> {
            let tag = TAG + " | getBalance | "
            try {
                //TODO if address
                //request to api

                let returnAssetAmount = ():number =>{
                    return this.info.balances[this.nativeAsset]
                }

                let assetDescription: Asset = {
                    // @ts-ignore
                    chain:this.nativeAsset,
                    symbol:this.nativeAsset,
                    ticker:this.nativeAsset
                }

                log.info(tag,"returnAssetAmount",returnAssetAmount())

                // @ts-ignore
                const balances: Balances = [
                    {
                        asset: assetDescription,
                        // @ts-ignore
                        amount: assetToBase(assetAmount(returnAssetAmount(), getPrecision(this.nativeAsset))),
                    },
                ]

                return balances
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
        this.getFees = async function (params?: FeesParams) {
            let tag = TAG + " | getFees | "
            try {
                let output = await this.pioneerApi.getFees(params)
                return output
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        /*
        let swap = {
            inboundAddress: {
                chain: 'ETH',
                pub_key: 'tthorpub1addwnpepqvuy8vh6yj4h28xp6gfpjsztpj6p46y2rs0763t6uw9f6lkky0ly5uvwla6',
                address: '0x36286e570c412531aad366154eea9867b0e71755',
                router: '0x9d496De78837f5a2bA64Cb40E62c19FBcB67f55a',
                halted: false
            },
            asset: {
                chain: 'ETH',
                symbol: 'ETH',
                ticker: 'ETH',
                iconPath: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/assets/ETH-1C9/logo.png'
            },
            memo: '=:THOR.RUNE:tthor1veu9u5h4mtdq34fjgu982s8pympp6w87ag58nh',
                amount: { type: 'BASE', decimal: 18 }
        }
         */
        this.buildSwap = async function (swap:any) {
            let tag = TAG + " | buildSwap | "
            try {
                //stringify amount
                swap.amount = swap.amount.amount()

                let request:any = {
                    type:"swap",
                    username:this.username,
                    //TODO source
                    //TODO auth
                    //TODO sig
                    invocation:swap
                }
                //invocation
                log.info(tag,"request: ",request)
                let result = await this.pioneerApi.Invocation('',request)

                //

                return result.data.txid
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.transfer = async function (tx:any) {
            let tag = TAG + " | transfer | "
            try {
                let coin = tx.asset.symbol
                let amount = tx.amount.amount()
                let to = tx.recipient
                let memo = tx.memo || ''

                let invocation = {
                    username:this.username,
                    coin,
                    amount,
                    to,
                    memo
                }

                let request:any = {
                    type:"payment",
                    username:this.username,
                    //TODO source
                    //TODO auth
                    //TODO sig
                    invocation
                }
                //invocation
                let result = await this.pioneerApi.Invocation('',request)

                //

                return result.data.txid
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

