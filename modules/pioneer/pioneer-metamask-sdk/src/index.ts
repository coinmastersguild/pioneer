/*

     Pioneer SDK
        A typescript sdk for integration for native wallets

 */



const TAG = " | Pioneer-sdk | "
const log = require("@pioneer-platform/loggerdog")()

//All paths
//TODO make paths adjustable!
let {
    getPaths
} = require('@pioneer-platform/pioneer-coins')
let paths = getPaths()

let App = require("@pioneer-platform/pioneer")

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
    private pioneerApi: boolean | undefined;
    private getInfo: (verbosity: string) => any;
    private init: () => Promise<boolean>;
    private config: config;
    private app: any;
    constructor(type:any,config:config,isTestnet?:boolean) {
        this.config = config
        // todo remove init
        // this.App = new App('metamask',config)
        this.pioneerApi = config.pioneerApi
        this.spec = config.spec
        this.init = async function () {
            let tag = TAG + " | init_sdk | "
            try {
                log.debug(tag, "checkpoint")

                // @ts-ignore
                let account = this.config?.addresses[0]

                let watchWalletMetaMask = {
                    "WALLET_ID": "metamask-test",
                    "TYPE": "watch",
                    "CREATED": new Date().getTime(),
                    "VERSION": "0.1.3",
                    "WALLET_PUBLIC":{
                        "ETH":{
                            "coin":"ETH",
                            "network":"ETH",
                            "script_type":"eth",
                            "path":"m/44'/60'/0'/0/0",
                            "long":"Ethereum",
                            "address":account,
                            "master":account,
                            "type":"address",
                            "pubkey":account
                        }
                    }
                }

                let pubkeysMetamask = [
                    {
                        "coin":"ETH",
                        "network":"ETH",
                        "script_type":"eth",
                        "path":"m/44'/60'/0'/0/0",
                        "long":"Ethereum",
                        "address":account,
                        "master":account,
                        "type":"address",
                        "pubkey":account
                    }
                ]

                let urlSpec = "http://127.0.0.1:9001/spec/swagger.json"
                let walletName = account

                //metamask
                let config = {
                    wallet: watchWalletMetaMask,
                    pubkeys:pubkeysMetamask,
                    username:"metamask"+walletName,
                    pioneerApi:true,
                    spec:urlSpec,
                    queryKey:"metamask"+walletName, //insecure
                    auth:'lol',
                    authProvider:'asdasd'
                }

                //get config from local storage

                //if no config setup with metamask

                this.app = new App('metamask',config);

                let info = await this.app.init()

                return info
            } catch (e) {
                log.error(tag, e)
                throw e
            }
        }
        this.getInfo = async function () {
            let tag = TAG + " | getInfo | "
            try {
                let walletInfo: any = {}

                return walletInfo
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
    }
}

