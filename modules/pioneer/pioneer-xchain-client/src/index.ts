/*

     Pioneer SDK
        A typescript sdk for integration for native wallets

 */
import BigNumber from 'bignumber.js'
import { ethers, BigNumberish } from 'ethers'
const TAG = " | Pioneer-xchain-client | "
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
    getExplorerTxUrl,
    baseAmountToNative,
    nativeToBaseAmount,
} = require('@pioneer-platform/pioneer-coins')

let Invoke = require("@pioneer-platform/pioneer-invoke")

import {
    Transfer,
    Invocation,
    Address,
    FeesParams,
    EstimateFeeParams,
    CallDepositParams,
} from "@pioneer-platform/pioneer-types";

import {
    Balances
} from '@xchainjs/xchain-client'


import {
    Asset,
    BaseAmount,
    assetAmount,
    assetToBase,
} from '@xchainjs/xchain-util'

/*
    import from xchain
 */

type Amount<T> = {
    type: T
    amount: () => BigNumber
    decimal: number
}



module.exports = class wallet {
    private spec: string;
    private username: string;
    private pioneerApi: any;
    private info: any
    private init: (context: string) => Promise<any>;
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
    private getTransactionData!: (txid: string, type?:string) => Promise<any>;
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
    private buildSwap: (swap: any, options: any) => Promise<any>;
    private invoke: any;
    private isApproved: ((routerAddress: string, address: string, amount: number) => Promise<any>) | undefined;
    private call: (<T>(address: Address, abi: any, func: string, params: Array<any>) => Promise<T>) | undefined;
    private estimateApproveFee: ((contractAddress: string, asset: any) => Promise<BigNumber>) | undefined;
    private approve: ((spender: string, sender: string, amount: BaseAmount) => Promise<any>) | undefined;
    private context: string;
    private wallets: any;
    private totalValueUsd: number | undefined;
    private invocationContext: any;
    private assetContext: any;
    private assetBalanceNativeContext: any;
    private assetBalanceUsdValueContext: any;
    private updateContext: () => Promise<void>;
    private signingPubkey: string;
    private signingPrivkey: string;
    private deposit: (deposit: any, options: any) => Promise<any>;
    private replace: ((invocationId: string, fee: any) => Promise<any>) | undefined;
    constructor(spec:string,config:any) {
        this.username = ''
        this.context = ''
        this.network = config.blockchain
        this.signingPubkey = config.signingPubkey
        this.signingPrivkey = config.signingPrivkey
        this.nativeAsset = config.nativeAsset
        this.service = config.service || 'unknown'
        if(config.network === 'mainnet'){
            this.isTestnet = false
        } else {
            this.isTestnet = true
        }
        this.queryKey = config.queryKey
        this.spec = config.spec
        this.init = async function (context:string) {
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
                let userInfo = await this.pioneerApi.User()
                userInfo = userInfo.data
                log.debug(tag,"userInfo: ",userInfo)

                this.username = userInfo.username
                this.context = userInfo.context
                this.wallets = userInfo.wallets
                this.totalValueUsd = parseFloat(userInfo.totalValueUsd)
                this.context = userInfo.context
                this.invocationContext = userInfo.invocationContext
                this.assetContext = userInfo.assetContext
                this.assetBalanceNativeContext = userInfo.assetBalanceNativeContext
                this.assetBalanceUsdValueContext = userInfo.assetBalanceUsdValueContext

                //get info
                let walletInfo = await this.pioneerApi.Info(this.context)
                this.info = walletInfo.data

                //invoke
                if(!this.signingPrivkey){
                    //generate keypair

                }
                let config = {
                    signingPubkey:this.signingPubkey,
                    signingPrivkey:this.signingPrivkey,
                    queryKey:this.queryKey,
                    username:this.username,
                    spec
                }
                //get config
                this.invoke = new Invoke(spec,config)
                await  this.invoke.init()

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

        if(this.network === 'bitcoinCash'){
            // @ts-ignore
            this.getFeeRates = async function () {
                let tag = TAG + " | getFeeRates | "
                try {

                    let response = await this.pioneerApi.GetFeesWithMemo(null,{coin:'BCH',memo:''})
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
                        coin:'BCH',
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

        if(this.network === 'litecoin'){
            // @ts-ignore
            this.getFeeRates = async function () {
                let tag = TAG + " | getFeeRates | "
                try {

                    let response = await this.pioneerApi.GetFeesWithMemo(null,{coin:'LTC',memo:''})
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
                        coin:'LTC',
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
                    log.debug(tag,"params: ",params)
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

            this.approve = async function (spender: string, sender: string, amount: BaseAmount, noBroadcast?: boolean) {
                let tag = TAG + " | getWallet | "
                try {
                    //
                    let invocation:any = {
                        type:'approve',
                        username:this.username,
                        coin:this.nativeAsset,
                        contract:spender,
                        tokenAddress:sender,
                        amount:amount.amount().toNumber()
                    }
                    if(noBroadcast) invocation.noBroadcast = true
                    log.debug(tag,"invocation: ",invocation)
                    let result = await this.invoke.invoke(invocation)
                    console.log("result: ",result)


                    return result.txid
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }

            this.replace = async function (invocationId:string,fee:any) {
                let tag = TAG + " | replace | "
                try {
                    //
                    let invocation:Invocation = {
                        type:'replace',
                        asset:'ETH',
                        network:'ETH',
                        fee
                    }
                    let result = await this.invoke.invoke(invocation)
                    log.info("result: ",result)


                    return result.invocationId
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }

            //estimateApproveFee
            // @ts-ignore
            this.estimateApproveFee = async function (contractAddress:string, asset: any) {
                let tag = TAG + " | getWallet | "
                try {
                    //TODO figuremeout
                    // const wallet = ethClient.getWallet();
                    // const assetAddress = asset.symbol.slice(asset.ticker.length + 1);
                    // const strip0x = (assetAddress.toUpperCase().indexOf('0X') === 0) ? assetAddress.substr(2) : assetAddress;
                    // const checkSummedAddress = ethers.utils.getAddress(strip0x);
                    // const contract = new ethers.Contract(checkSummedAddress, erc20ABI, wallet);
                    // const estimateGas = await contract.estimateGas.approve(contractAddress, checkSummedAddress);
                    // const prices = await ethClient.estimateGasPrices();
                    // const minimumWeiCost = prices.average.amount().multipliedBy(estimateGas.toNumber());

                    //TODO actually estimate fee
                    let response = 100000000
                    return new BigNumber(response,18)
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }

            this.estimateFee = async function ({sourceAsset, ethClient, ethInbound, inputAmount, memo}: EstimateFeeParams) {
                let tag = TAG + " | getWallet | "
                try {

                    let params = {
                        coin:"ETH",
                        network:"ETH",
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
                    let provider = getDefaultProvider()
                    await wallet.connect(provider)

                    return wallet
                } catch (e) {
                    log.error(tag, "e: ", e)
                }
            }
            this.isApproved = async function (routerAddress:string,tokenAddress:string,amount:any) {
                let tag = TAG + " | isApproved | "
                try {
                    amount = amount.amount().toNumber()
                    if(amount === 0) throw Error("Failed to get a valid amount!")
                    //
                    let address = this.getAddress()
                    let body = {
                        token:tokenAddress,
                        spender:routerAddress,
                        sender:address
                    }

                    let allowance = await this.pioneerApi.GetAllowance(null,body)
                    allowance = allowance.data

                    log.debug(tag,"allowance: ",allowance)
                    log.debug(tag,"amount: ",amount)
                    if(allowance > amount){
                        return true
                    } else {
                        return false
                    }
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
        this.updateContext = async function () {
            let tag = TAG + " | updateContext | "
            try {
                //get info
                let userInfo = await this.pioneerApi.User()
                log.debug(tag,"userInfo: ",userInfo)

                this.username = userInfo.username
                this.context = userInfo.context
                this.wallets = userInfo.wallets
                this.totalValueUsd = parseFloat(userInfo.totalValueUsd)
                this.invocationContext = userInfo.invocationContext
                this.assetContext = userInfo.assetContext
                this.assetBalanceNativeContext = userInfo.assetBalanceNativeContext
                this.assetBalanceUsdValueContext = userInfo.assetBalanceUsdValueContext

                //get info
                const walletInfo = await this.pioneerApi.Info(this.context)
                this.info = walletInfo.data

                return userInfo
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
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
                const balances:any = []
                //TODO if address
                //request to api
                //if no params
                //assume native on master
                if(!address && !asset){
                    let returnAssetAmount = ():number =>{
                        return this.info.balances[this.nativeAsset]
                    }

                    let assetDescription: Asset = {
                        // @ts-ignore
                        chain:this.nativeAsset,
                        symbol:this.nativeAsset,
                        ticker:this.nativeAsset
                    }

                    log.debug(tag,"returnAssetAmount",returnAssetAmount())

                    balances.push({
                        asset: assetDescription,
                        // @ts-ignore
                        amount: assetToBase(assetAmount(returnAssetAmount(), getPrecision(this.nativeAsset))),
                    })

                } else {

                }

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
        this.getTransactionData = async function (txid:string,type?:string) {
            let tag = TAG + " | getTransactionData | "
            try {
                if(!txid) throw Error("Txid is required!")
                log.debug("asset: ",this.nativeAsset)
                //TODO tech debt, send network instead of asset
                let output = await this.pioneerApi.GetTransaction({network:this.nativeAsset,txid,type:'thorchain'})
                return output.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getFees = async function (params?: FeesParams) {
            let tag = TAG + " | getFees | "
            try {
                let output = await this.pioneerApi.EstimateFeesWithGasPricesAndLimits(params)
                return output
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        /*
        let deposit = {
        }
        */
        this.deposit = async function (deposit:any,options:any) {
            let tag = TAG + " | deposit | "
            try {
                log.debug(tag,"deposit: ",deposit)
                log.debug(tag,"options: ",options)

                //verbose
                let verbose
                let txidOnResp
                if(options){
                    verbose = options.verbose
                    txidOnResp = options.txidOnResp
                }

                //NOTE THIS IS ONLY Thorchain!
                let coin = this.nativeAsset
                if(this.network !== 'thorchain') throw Error("102: not supported!")

                //if native
                let amount = deposit.amount.toString()
                //amount = nativeToBaseAmount(this.nativeAsset,amount)
                log.debug(tag,"amount (final): ",amount)
                if(!amount) throw Error("Failed to get amount!")
                // if(typeof(amount) !== 'string')
                //TODO min transfer size 10$??
                //TODO validate addresses
                //TODO validate midgard addresses not expired

                let memo = deposit.memo || ''

                let invocation:any = {
                    type:'deposit',
                    username:this.username,
                    inboundAddress:deposit.inboundAddress,
                    network:coin,
                    asset:coin,
                    coin,
                    amount,
                    memo
                }
                if(deposit.noBroadcast) invocation.noBroadcast = true

                log.debug(tag,"invocation: ",invocation)
                let result = await this.invoke.invoke('deposit',invocation)
                console.log("result: ",result.data)

                if(!verbose && !txidOnResp){
                    return result.data.invocationId
                } else if(!verbose && txidOnResp){
                    return result.data.txid
                }else if(verbose){
                    return result.data
                } else {
                    throw Error("102: Unhandled configs!")
                }

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
        this.buildSwap = async function (swap:any,options:any) {
            let tag = TAG + " | buildSwap | "
            try {
                log.debug(tag,"swap: ",swap)
                log.debug(tag,"options: ",options)

                //verbose
                let verbose
                let txidOnResp
                if(options){
                    verbose = options.verbose
                    txidOnResp = options.txidOnResp
                }

                //NOTE THIS IS ONLY ETH!
                //ETH always the weird one
                let coin = this.nativeAsset
                if(this.network !== 'ethereum') throw Error("102: not supported!")

                log.debug(tag,"swap: ",swap)
                log.debug(tag,"swap.amount: ",swap.amount)
                log.debug(tag,"tx.amount.amount(): ",swap.amount.amount())
                // log.debug(tag,"tx.amount.amount().toFixed(): ",swap.amount.amount().toNumber())
                let amount = swap.amount.amount()
                amount = nativeToBaseAmount(this.nativeAsset,amount)
                amount = amount.toString()

                //if native
                // let amount = swap.amount.toString()
                //amount = nativeToBaseAmount(this.nativeAsset,amount)
                log.debug(tag,"amount (final): ",amount)
                if(!amount) throw Error("Failed to get amount!")
                // if(typeof(amount) !== 'string')
                //TODO min transfer size 10$??
                //TODO validate addresses
                //TODO validate midgard addresses not expired

                let memo = swap.memo || ''

                let invocation:any = {
                    type:'swap',
                    username:this.username,
                    inboundAddress:swap.inboundAddress,
                    network:coin,
                    asset:coin,
                    coin,
                    amount,
                    memo
                }
                if(swap.noBroadcast) invocation.noBroadcast = true

                log.debug(tag,"invocation: ",invocation)
                let result = await this.invoke.invoke('swap',invocation)
                console.log("result: ",result.data)

                if(!verbose && !txidOnResp){
                    return result.data.invocationId
                } else if(!verbose && txidOnResp){
                    return result.data.txid
                }else if(verbose){
                    return result.data
                } else {
                    throw Error("102: Unhandled configs!")
                }

            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.transfer = async function (tx:Transfer) {
            let tag = TAG + " | transfer | "
            try {
                let coin = this.nativeAsset
                log.debug(tag,"tx: ",tx)
                log.debug(tag,"tx.amount: ",tx.amount)
                log.debug(tag,"tx.amount.amount(): ",tx.amount.amount())
                log.debug(tag,"tx.amount.amount().toFixed(): ",tx.amount.amount().toNumber())
                let amount = tx.amount.amount().toNumber()
                amount = nativeToBaseAmount(this.nativeAsset,amount)
                amount = amount.toString()

                log.debug(tag,"amount (final): ",amount)
                if(!amount) throw Error("Failed to get amount!")

                //TODO min transfer size 10$
                //TODO validate addresses
                //TODO validate midgard addresses not expired

                //context
                log.info(tag,"currentContext: ",this.context)
                log.info(tag,"txContext: ",tx.context)
                if(tx.context){
                    if(this.context !== tx.context){
                        //TODO validate context is valid
                        this.context = tx.context
                    }
                } else {
                    log.info(tag,"using default context:",this.context)
                    tx.context = this.context
                }
                if(!tx.context) throw Error("102: context is required on invocations!")

                let to = tx.recipient
                let memo = tx.memo || ''
                if(!to) throw Error("invalid TX missing recipient")
                let invocation:Invocation = {
                    type:'transfer',
                    context:tx.context,
                    username:this.username,
                    coin,
                    network:coin,
                    asset:coin,
                    amount,
                    address:to,
                    memo
                }
                if(tx.noBroadcast) invocation.noBroadcast = true

                log.info(tag,"invocation: ",invocation)
                let result = await this.invoke.invoke(invocation)
                if(!result) throw Error("Failed to create invocation!")
                log.info("result: ",result)

                return result.invocationId
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

