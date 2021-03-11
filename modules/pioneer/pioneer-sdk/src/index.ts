/*

     Pioneer SDK
        A typescript sdk for integration for native wallets

 */

import { Asset, BaseAmount } from '@bithighlander/xchain-util'

const TAG = " | Pioneer-sdk | "
const log = require("@pioneer-platform/loggerdog")()

//Pioneer follows OpenAPI spec
const Pioneer = require('openapi-client-axios').default;

//xchain adapter
const XchainClass = require("@pioneer-platform/pioneer-xchain-client")

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


export class SDK {
    private spec: any;
    private pioneerApi: any;
    private init: () => Promise<any>;
    private config: config;
    private createPairingCode: () => Promise<any>;
    private queryKey: string;
    private service: string;
    private network: any;
    private getInfo: () => Promise<any>;
    private isTestnet: boolean;
    private getUserParams: () => Promise<{ wallet: string; clients: { ethereum: any; thorchain: any; binance: any; bitcoin: any }; keystore: {}; type: string }>;
    constructor(spec:string,config:any) {
        this.service = config.service || 'unknown'
        if(config.network === 'mainnet'){
            this.isTestnet = false
        } else {
            this.isTestnet = true
        }
        this.config = config
        this.spec = spec || config.spec
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
                return this.pioneerApi
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        this.createPairingCode = async function () {
            let tag = TAG + " | createPairingCode | "
            try {
                //
                let pairingBody:any = {
                    service:this.service
                }
                let result = await this.pioneerApi.CreatePairingCode(null, pairingBody)
                return result.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getInfo = async function () {
            let tag = TAG + " | getInfo | "
            try {
                let result = await this.pioneerApi.Info()

                return result.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getUserParams = async function () {
            let tag = TAG + " | getUserParams | "
            try {
                let result = await this.pioneerApi.Info()
                result = result.data

                if(!result.masters.RUNE) throw Error("102: RUNE required asset! ")
                let thorAddress = result.masters.RUNE

                log.info(tag,"this.spec: ",this.spec)
                if(!this.spec) throw Error("103: Pioneer Service required for sdk! ")

                let binance = new XchainClass(this.spec,{
                    network:'testnet',
                    blockchain:'binance',
                    nativeAsset:'BNB',
                    queryKey:this.queryKey
                })
                await binance.init()

                let bitcoin = new XchainClass(this.spec,{
                    network:'testnet',
                    blockchain:'bitcoin',
                    nativeAsset:'BTC',
                    queryKey:this.queryKey
                })
                await bitcoin.init()

                let thorchain = new XchainClass(this.spec,{
                    network:'testnet',
                    blockchain:'thorchain',
                    nativeAsset:'RUNE',
                    queryKey:this.queryKey
                })
                await thorchain.init()

                let ethereum = new XchainClass(this.spec,{
                    network:'testnet',
                    blockchain:'thorchain',
                    nativeAsset:'RUNE',
                    queryKey:this.queryKey
                })
                await ethereum.init()

                let output:any = {
                    type: 'pioneer',
                    wallet: thorAddress,
                    keystore:{},
                    clients: {
                        binance,
                        bitcoin,
                        thorchain,
                        ethereum
                    }
                }

                return output
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
    }
}

