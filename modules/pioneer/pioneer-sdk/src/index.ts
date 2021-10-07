/*

     Pioneer SDK
        A typescript sdk for integration for apps

 */

const TAG = " | Pioneer-sdk | "
const log = require("@pioneer-platform/loggerdog")()

//Pioneer follows OpenAPI spec
const Pioneer = require('openapi-client-axios').default;
const Events = require("@pioneer-platform/pioneer-events")

let {
    supportedBlockchains,
    supportedAssets,
} = require('@pioneer-platform/pioneer-coins')

import {
    Chart,
    SendToAddress,
    Config,
    User,
    SDKConfig,
    OnboardWallet
} from "@pioneer-platform/pioneer-types";

//xchain adapter
const XchainClass = require("@pioneer-platform/pioneer-xchain-client")


export class SDK {
    private spec: any;
    private pioneerApi: any;
    private init: (blockchains: []) => Promise<any>;
    private config: SDKConfig;
    private clients: any;
    private createPairingCode: () => Promise<any>;
    private queryKey: string;
    private service: string;
    private isTestnet: boolean;
    private getUserParams: () => Promise<User>;
    private sendToAddress: (blockchain: string, asset: string, amount: string, memo?: string) => Promise<any>;
    private url: string;
    private events: any;
    private wss: string | undefined;
    private username: string | undefined;
    private blockchains: any
    private startSocket: () => Promise<any>;
    private isPaired: boolean
    private context: string;
    private pubkeys:any[]
    private masters:any
    private balances:any[]
    private ibcChannels:any[]
    private paymentStreams:any[]
    private nfts:any[]
    private contexts: any;
    private info: any;
    private wallets: any[];
    private totalValueUsd: number;
    private getUserInfo: () => Promise<any>;
    private getWalletInfo: () => Promise<any>;
    private setContext: (context: string) => Promise<any>;
    private getInvocations: () => Promise<any>;
    private invocationContext: string;
    private assetContext: string;
    private assetBalanceUsdValueContext: string;
    private assetBalanceNativeContext: string;
    private getInvocation: (invocationId: string) => Promise<any>;
    private stopSocket: () => any;
    private contextWalletInfo: any;
    private valueUsdContext: any;
    private chart: (chart: Chart) => Promise<any>;
    private setAssetContext: (asset: string) => Promise<any>;
    private registerWallet: (wallet: any) => Promise<any>;
    constructor(spec:string,config:SDKConfig) {
        this.service = config.service || 'unknown'
        this.url = config.url || 'unknown'
        this.isTestnet = false
        this.isPaired = false
        this.config = config
        this.username = config.username
        this.spec = spec || config.spec
        this.wss = config.wss || 'wss://pioneers.dev'
        this.queryKey = config.queryKey
        this.spec = config.spec
        this.clients = {}
        this.contexts = []
        this.pubkeys = []
        this.balances = []
        this.context = ""
        this.invocationContext = ""
        this.assetContext = ""
        this.assetBalanceNativeContext = ""
        this.assetBalanceUsdValueContext = ""
        this.wallets = []
        this.events = {}
        this.totalValueUsd = 0
        this.blockchains = []
        this.ibcChannels = []
        this.paymentStreams = []
        this.nfts = []
        this.init = async function (blockchains?:any) {
            let tag = TAG + " | init_wallet | "
            try{

                log.debug(tag,"blockchains: ",blockchains)
                if(!blockchains) blockchains = []
                if(!this.queryKey) throw Error(" You must create an api key! ")
                this.pioneerApi = new Pioneer({
                    definition:spec,
                    axiosConfigDefaults: {
                        headers: {
                            'Authorization': this.queryKey,
                        },
                    }
                });

                //init blockchains
                for(let i = 0; i < blockchains.length; i++){
                    let blockchain = blockchains[i]
                    this.blockchains.push(blockchain.toLowerCase())
                }
                if(this.blockchains.length === 0) throw Error("Failed to init! must have blockchains!")
                this.pioneerApi = await this.pioneerApi.init()

                //get global info
                let userInfo = await this.pioneerApi.User()
                userInfo = userInfo.data
                log.info(tag,"userInfo: ",userInfo)
                //for each wallet
                if(userInfo.walletDescriptions){
                    for(let i = 0; userInfo.walletDescriptions.length; i++){
                        let walletInfo = userInfo.walletDescriptions[i]
                        if(walletInfo && walletInfo.pubkeys){
                            for(let j =0; j < walletInfo.pubkeys.length; j++){
                                let pubkey = walletInfo.pubkeys[j]
                                pubkey.context = walletInfo.context
                                this.pubkeys.push(pubkey)
                                for(let k = 0; k < pubkey.balances.length; k++){
                                    let balance:any = pubkey.balances[k]
                                    //add wallet context
                                    balance.context = walletInfo.context
                                    balance.pubkey = pubkey.pubkey
                                    this.balances.push(balance)
                                }
                            }
                        }
                    }
                }

                if(!this.username)this.username = userInfo.username
                this.wallets = userInfo.wallets

                // this.pubkeys = userInfo.pubkeys
                this.ibcChannels = userInfo.ibcChannels
                this.nfts = userInfo.nfts
                this.paymentStreams = userInfo.paymentStreams
                this.totalValueUsd = parseFloat(userInfo.totalValueUsd)
                this.context = userInfo.context
                this.invocationContext = userInfo.invocationContext
                this.assetContext = userInfo.assetContext
                this.assetBalanceNativeContext = userInfo.assetBalanceNativeContext
                this.assetBalanceUsdValueContext = userInfo.assetBalanceUsdValueContext

                return this.pioneerApi
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        this.startSocket = function () {
            let tag = TAG + " | startSocket | "
            try {
                let configEvents:any = {
                    queryKey:this.queryKey,
                    wss:this.wss
                }
                if(this.username) configEvents.username = this.username
                //sub to events
                this.events = new Events.Events(config)
                this.events.init()

                this.events.events.on('subscribedToUsername', (event:any) => {
                    log.ingo(tag,'paired to '+this.username);
                    this.isPaired = true
                    this.username = event.username
                    this.events.emit('subscribedToUsername',event)
                    Events.setUsername(this.username)
                });

                this.events.events.on('context', (event:any) => {
                    log.debug(tag,'context set to '+event.context);
                    this.context = event.context
                    this.getUserParams()
                });

                return this.events.events
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.stopSocket = function () {
            let tag = TAG + " | stopSocket | "
            try {
                this.events.disconnect()
                return this.events.events
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        /*
              Supported wallets:

                  Onboard.js

              TODO kepler

         */
        this.registerWallet = async function (wallet:OnboardWallet) {
            let tag = TAG + " | registerWallet | "
            try {
                if(wallet.network !== 1){
                    throw Error('Network not supported!')
                }
                //if no username
                if(!this.username){
                    this.username = 'onboard:user:'+wallet.name+":"+wallet.address
                }

                //register wallet
                let register = {
                    username:this.username,
                    blockchains:['ethereum'],
                    context:wallet.name+":"+wallet.address,
                    walletDescription:{
                        context:wallet.name+":"+wallet.address,
                        type:wallet.name
                    },
                    data:{
                        pubkeys:[
                            {
                                "blockchain": "ethereum",
                                "symbol": "ETH",
                                "asset": "ETH",
                                "path": "m/44'/60'/0'", //TODO capture from onBoard.js on user input paths. ie keepkey
                                "script_type": "ethereum",
                                "network": "ethereum",
                                "type": "address",
                                "created": new Date().getTime(),
                                "tags": [
                                    wallet.name,
                                    "onboard",
                                    "sdk",
                                    wallet.name+":"+wallet.address
                                ],
                                "pubkey": wallet.address,
                                "master": wallet.address,
                                "address": wallet.address
                            }
                        ]
                    },
                    queryKey:this.queryKey,
                    auth:'lol',
                    provider:'lol'
                }
                let result = await this.pioneerApi.Register(null, register)
                await this.getUserParams()
                return result.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.createPairingCode = async function () {
            let tag = TAG + " | createPairingCode | "
            try {
                //
                let pairingBody:any = {
                    service:this.service,
                    url:this.url
                }
                //sub to pairings
                this.events.subscribeToKey()

                let result = await this.pioneerApi.CreatePairingCode(null, pairingBody)
                return result.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getUserInfo = async function () {
            let tag = TAG + " | getUserInfo | "
            try {
                let result = await this.pioneerApi.User()
                return result.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.setContext = async function (context:string) {
            let tag = TAG + " | setContext | "
            try {
                if(this.wallets && this.wallets.indexOf(context) >= 0){
                    this.context = context
                    let result = await this.pioneerApi.SetContext(null,{context:this.context})
                    return result.data
                }else{
                    return {success:false,error:"unknown context! context: "+context,options:this.wallets}
                }
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.setAssetContext = async function (asset:string) {
            let tag = TAG + " | setAssetContext | "
            try {
                if(asset && this.assetContext && this.assetContext !== asset){
                    this.assetContext = asset
                    let result = await this.pioneerApi.SetAssetContext(null,{asset:this.assetContext})
                    return result.data
                }else{
                    return {success:false,error:"already assetContext="+asset}
                }
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getInvocation = async function (invocationId:string) {
            let tag = TAG + " | getInvocations | "
            try {
                if(!invocationId) invocationId = this.invocationContext
                let result = await this.pioneerApi.Invocation(invocationId)
                return result.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getInvocations = async function () {
            let tag = TAG + " | getInvocations | "
            try {
                let result = await this.pioneerApi.Invocations()
                return result.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getWalletInfo = async function () {
            let tag = TAG + " | getWalletInfo | "
            try {
                let result = await this.pioneerApi.Info(this.context)
                return result.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.chart = async function (chart:Chart) {
            let tag = TAG + " | chart | "
            try {
                //
                let result = await this.pioneerApi.Chart(null,chart)
                return result.data

                return true
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        // this.replaceInvocation = async function (invocationId:string,fee:any) {
        //     let tag = TAG + " | replaceInvocation | "
        //     try {
        //         //
        //
        //         return true
        //     } catch (e) {
        //         log.error(tag, "e: ", e)
        //     }
        // }
        // @ts-ignore
        this.sendToAddress = async function (intent:SendToAddress) {
            let tag = TAG + " | sendToAddress | "
            try {

                //build a tx
                let txInput:any = {
                    "asset":
                        {
                            "chain":intent.blockchain,
                            "symbol":intent.asset,
                            "ticker":intent.asset
                        },
                    "amount":
                        {
                            "type":"BASE",
                            "decimal":18,
                            amount: function(){
                                return intent.amount
                            }
                        },
                    "recipient":intent.address,
                }
                if(intent.memo) txInput.memo = intent.memo

                //ETH
                if(this.isTestnet && intent.blockchain === 'ETH'){
                    txInput.chainId = 3 //ropsten
                }

                if(intent.noBroadcast){
                    txInput.noBroadcast = true
                }

                let txid = await this.clients[intent.blockchain].transfer(txInput)
                log.debug("txid",txid)

                return txid
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        //X-chain
        // @ts-ignore
        this.getUserParams = async function () {
            let tag = TAG + " | getUserParams | "
            try {
                if(!this.context){
                    log.debug(tag,"No local context!")
                    let userInfo = await this.pioneerApi.User()
                    userInfo = userInfo.data
                    log.debug(tag,"userInfo: ",userInfo)
                    this.wallets = userInfo.wallets
                    this.context = userInfo.context
                    this.assetContext = userInfo.assetContext
                    log.debug(tag,"this.context: ",this.context)
                    log.debug(tag,"userInfo.walletDescriptions: ",userInfo.walletDescriptions)
                    this.contextWalletInfo = userInfo.walletDescriptions.filter((e:any) => e.context === this.context)[0]
                    log.debug(tag,"this.contextWalletInfo: ",this.contextWalletInfo)
                    log.debug(tag,"assetContext: ",this.assetContext)
                    this.valueUsdContext = this.contextWalletInfo.valueUsdContext
                    //get pubkeys for asset
                    let balance = this.contextWalletInfo.pubkeys.filter((e:any) => e.symbol === this.assetContext)[0]
                    this.assetBalanceNativeContext = balance.balance || '0'
                    this.assetBalanceUsdValueContext = balance.valueUsd || '0'
                    log.debug(tag,"this.assetBalanceNativeContext: ",this.assetBalanceNativeContext)
                    log.debug(tag,"this.assetBalanceUsdValueContext: ",this.assetBalanceUsdValueContext)
                    // this.balances = []
                    // this.pubkeys = []
                    //for each wallet
                    if(userInfo.walletDescriptions){
                        log.info("Parse Wallet Descriptions")
                        for(let i = 0; i < userInfo.walletDescriptions.length; i++){
                            let walletInfo = userInfo.walletDescriptions[i]
                            log.info(tag,"walletInfo: ",walletInfo)
                            for(let j =0; j < walletInfo.pubkeys.length; j++){
                                let pubkey = walletInfo.pubkeys[j]
                                pubkey.context = walletInfo.context
                                this.pubkeys.push(pubkey)
                                for(let k = 0; k < pubkey.balances.length; k++){
                                    let balance:any = pubkey.balances[k]
                                    //add wallet context
                                    balance.context = walletInfo.context
                                    balance.pubkey = pubkey.pubkey
                                    //force to webspec
                                    balance.address = pubkey.pubkey
                                    balance.name = pubkey.pubkey
                                    balance.chainId = 1
                                    balance.decimals = 18
                                    if(balance.marketData && balance.marketData.image) balance.logoURI = balance.marketData.image
                                    this.balances.push(balance)
                                }
                            }
                        }
                    }
                }
                if(!this.context) throw Error("can not start without context! ")
                if(!this.blockchains) throw Error("can not start without blockchains")
                log.debug(tag,"context: ",this.context)
                log.debug(tag,"blockchains: ",this.blockchains)
                let result = await this.pioneerApi.Info(this.context)
                result = result.data
                log.info(tag,"result: ",result)
                if(result.wallets){
                    this.contexts = result.wallets
                    log.debug(tag,"result: ",result)
                }

                this.wallets = result.wallets
                if(result.balances) this.balances = result.balances
                if(result.pubkeys) this.pubkeys = result.pubkeys

                log.debug(tag,"this.spec: ",this.spec)
                log.debug(tag,"supportedBlockchains: ",supportedBlockchains)
                if(!this.spec) throw Error("103: Pioneer Service required for sdk! ")

                if(this.blockchains.indexOf('binance') >= 0){
                    let binance = new XchainClass(this.spec,{
                        network:'mainnet',
                        blockchain:'binance',
                        nativeAsset:'BNB',
                        queryKey:this.queryKey
                    })
                    await binance.init(this.context)
                    this.clients['binance'] = binance
                }

                if(this.blockchains.indexOf('bitcoin') >= 0){
                    let bitcoin = new XchainClass(this.spec,{
                        network:'mainnet',
                        blockchain:'bitcoin',
                        nativeAsset:'BTC',
                        queryKey:this.queryKey
                    })
                    await bitcoin.init(this.context)
                    this.clients['bitcoin'] = bitcoin
                }

                if(this.blockchains.indexOf('thorchain') >= 0){
                    let thorchain = new XchainClass(this.spec,{
                        network:'mainnet',
                        blockchain:'thorchain',
                        nativeAsset:'RUNE',
                        queryKey:this.queryKey
                    })
                    await thorchain.init(this.context)
                    this.clients['thorchain'] = thorchain
                }

                if(this.blockchains.indexOf('cosmos') >= 0){
                    let cosmos = new XchainClass(this.spec,{
                        network:'mainnet',
                        blockchain:'cosmos',
                        nativeAsset:'ATOM',
                        queryKey:this.queryKey
                    })
                    await cosmos.init(this.context)
                    this.clients['cosmos'] = cosmos
                }

                if(this.blockchains.indexOf('osmosis') >= 0){
                    let osmosis = new XchainClass(this.spec,{
                        network:'mainnet',
                        blockchain:'osmosis',
                        nativeAsset:'OSMO',
                        queryKey:this.queryKey
                    })
                    await osmosis.init(this.context)
                    this.clients['osmosis'] = osmosis
                }

                if(this.blockchains.indexOf('ethereum') >= 0){
                    let ethereum = new XchainClass(this.spec,{
                        network:'mainnet',
                        blockchain:'ethereum',
                        nativeAsset:'ETH',
                        queryKey:this.queryKey
                    })
                    await ethereum.init(this.context)
                    this.clients['ethereum'] = ethereum
                }

                if(this.blockchains.indexOf('bitcoincash') >= 0){
                    let bitcoin = new XchainClass(this.spec,{
                        network:'mainnet',
                        blockchain:'bitcoinCash',
                        nativeAsset:'BCH',
                        queryKey:this.queryKey
                    })
                    await bitcoin.init(this.context)
                    this.clients['bitcoinCash'] = bitcoin
                }

                if(this.blockchains.indexOf('litecoin') >= 0){
                    let bitcoin = new XchainClass(this.spec,{
                        network:'mainnet',
                        blockchain:'litecoin',
                        nativeAsset:'LTC',
                        queryKey:this.queryKey
                    })
                    await bitcoin.init(this.context)
                    this.clients['litecoin'] = bitcoin
                }

                let output:User = {
                    type: 'pioneer',
                    context:this.context,
                    availableContexts:this.contexts,
                    assetContext: this.assetContext,
                    valueUsdContext: this.valueUsdContext,
                    assetBalanceNativeContext: this.assetBalanceNativeContext,
                    assetBalanceUsdValueContext: this.assetBalanceUsdValueContext,
                    wallet: this.username || 'sdkuser',
                    keystore:{},
                    clients:this.clients
                }

                return output
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
    }
}

