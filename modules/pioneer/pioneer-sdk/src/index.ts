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

//xchain adapter
const XchainClass = require("@pioneer-platform/pioneer-xchain-client")

export interface SendToAddress {
    blockchain:string
    asset:string
    amount:number
    address:string
    memo?:string
    noBroadcast?:boolean
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

export interface Invocation {
    coin: string;
    addressFrom?: string;
    addressTo: string;
    amount: string;
    memo: string;
    nonce?:number
}


export class SDK {
    private spec: any;
    private pioneerApi: any;
    private init: (blockchains: []) => Promise<any>;
    private config: config;
    private clients: any;
    private createPairingCode: () => Promise<any>;
    private queryKey: string;
    private service: string;
    private isTestnet: boolean;
    private getUserParams: () => Promise<{ wallet: string; clients: { ethereum: any; thorchain: any; binance: any; bitcoin: any }; keystore: {}; type: string }>;
    private sendToAddress: (blockchain: string, asset: string, amount: string, memo?: string) => Promise<any>;
    private url: string;
    private events: any;
    private wss: string | undefined;
    private username: string | undefined;
    private blockchains: any
    private startSocket: () => Promise<any>;
    private isPaired: boolean
    private context: string;
    private info: any;
    private wallets: any[];
    private totalValueUsd: number;
    private getUserInfo: () => Promise<any>;
    private getWalletInfo: () => Promise<any>;
    private setContext: (context: string) => Promise<any>;
    private getInvocations: () => Promise<any>;
    constructor(spec:string,config:any,isTestnet?:boolean) {
        this.service = config.service || 'unknown'
        this.url = config.url || 'unknown'
        if(isTestnet){
            this.isTestnet = true
        } else {
            this.isTestnet = false
        }
        this.isPaired = false
        this.config = config
        this.username = config.username
        this.spec = spec || config.spec
        this.wss = config.wss || 'wss://pioneers.dev'
        this.queryKey = config.queryKey
        this.spec = config.spec
        this.clients = {}
        this.context = ""
        this.wallets = []
        this.events = {}
        this.totalValueUsd = 0
        this.blockchains = []
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
                if(!this.username)this.username = userInfo.username
                this.wallets = userInfo.wallets
                this.totalValueUsd = parseFloat(userInfo.totalValueUsd)
                this.context = userInfo.context

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
                    pioneerWs:this.wss
                }
                if(this.username) configEvents.username = this.username
                //sub to events
                this.events = new Events.Events(configEvents.pioneerWs,config)
                this.events.init()
                return this.events.events
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
                if(this.wallets.indexOf(context) >= 0){
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
        this.getUserParams = async function () {
            let tag = TAG + " | getUserParams | "
            try {
                if(!this.context){
                    let userInfo = await this.pioneerApi.User()
                    userInfo = userInfo.data
                    log.info(tag,"userInfo: ",userInfo)
                    this.context = userInfo.context
                }
                if(!this.context) throw Error("can not start without context! ")
                if(!this.blockchains) throw Error("can not start without blockchains")
                log.info(tag,"context: ",this.context)
                log.info(tag,"blockchains: ",this.blockchains)
                let result = await this.pioneerApi.Info(this.context)
                result = result.data
                log.info(tag,"result: ",result)
                if(!result.masters.RUNE) throw Error("102: RUNE required asset! ")
                let thorAddress = result.masters.RUNE

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

                let output:any = {
                    type: 'pioneer',
                    wallet: thorAddress,
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

