/*

    Pioneer Wallet v2

    Class based wallet development

 */



const TAG = " | Pioneer | "
const log = require("@pioneer-platform/loggerdog")()
//TODO remove this dep
const cryptoTools = require('crypto');
const tokenData = require("@pioneer-platform/pioneer-eth-token-data")
const crypto = require("@pioneer-platform/utxo-crypto")
const ripemd160 = require("crypto-js/ripemd160")
const CryptoJS = require("crypto-js")
const sha256 = require("crypto-js/sha256")
const bech32 = require(`bech32`)
const bitcoin = require("bitcoinjs-lib");
const ethUtils = require('ethereumjs-util');
const prettyjson = require('prettyjson');
const coinSelect = require('coinselect')
const keccak256 = require('keccak256')
const bchaddr = require('bchaddrjs');
//coin crypto modules
const ethCrypto = require("@pioneer-platform/eth-crypto")
const coincap = require("@pioneer-platform/coincap")
//All paths
//TODO make paths adjustable!
let {
    getPaths,
    nativeToBaseAmount,
    baseAmountToNative,
    UTXO_COINS,
    getNativeAssetForBlockchain
} = require('@pioneer-platform/pioneer-coins')


//support
import * as support from './support'
import { numberToHex } from 'web3-utils'
import { FioActionParameters } from "fiosdk-offline";

//Pioneer follows OpenAPI spec
let network = require("@pioneer-platform/pioneer-client")

//pioneer
import {
    bip32ToAddressNList,
} from "@bithighlander/hdwallet-core";

//Highlander fork
const hdwallet = require("@bithighlander/hdwallet-core")
const pioneer = require("@bithighlander/hdwallet-native")
// SS public TODO catch up public repo
// const hdwallet = require("@shapeshiftoss/hdwallet-core")
// const pioneer = require("@shapeshiftoss/hdwallet-native")

//global
const keyring = new hdwallet.Keyring()

// let WALLET_BALANCES:any = {}
// let WALLET_MODE:any
let WALLET_COINS:any = []

//eth token info
WALLET_COINS.push('ETH')
//TODO support coinlist (coingecko)
for(let i = 0; i < tokenData.tokens.length; i++){
    let token = tokenData.tokens[i]
    WALLET_COINS.push(token)
}

// COINS
WALLET_COINS.push('RUNE')
WALLET_COINS.push('BNB')
WALLET_COINS.push('ATOM')
WALLET_COINS.push('EOS')
WALLET_COINS.push('FIO')

//TODO BNB tokens

//TODO type paths
//TODO MOVEME coins module
const HD_RUNE_KEYPATH="m/44'/931'/0'/0/0"
const RUNE_CHAIN="thorchain"
const RUNE_BASE=100000000
const RUNE_TX_FEE="100"
const RUNE_MAX_GAS="100000"

const HD_ATOM_KEYPATH="m/44'/118'/0'/0/0"
const ATOM_CHAIN="cosmoshub-4"
const ATOM_BASE=1000000
const ATOM_TX_FEE="100"
const ATOM_MAX_GAS="100000"

const HD_BNB_KEYPATH="44'/714'/0'/0/"
const BNB_ASSET_SYMBOL="BNB"
const BNB_CHAIN=""
const BNB_MAX_GAS="100000"
const BNB_TX_FEE="100"
const BNB_BASE=100000000

const HD_EOS_KEYPATH="44'/194'/0'/0/"
const EOS_ASSET_SYMBOL="EOS"
const EOS_CHAIN="aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906"
const EOS_MAX_GAS="100000"
const EOS_TX_FEE="100"
const EOS_BASE=1000

export interface SendToAddress {
    coin:string,
    amount:string,
    address:string,
    addressTo?:string,
    memo?:string,
    invocationId?:string,
    noBroadcast?:boolean
}

export interface config {
    blockchains: string[];
    isTestnet?: boolean;
    context: string
    spec:string,
    env:string,
    mode:string,
    hdwallet:HDWALLETS,
    authProvider?:AuthProviders,
    username:string,
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

export interface Balance {
    total:number
    pending:number
    confirmed:number
}


export enum AuthProviders {
    shapeshift = 'shapeshift',
    bitcoin = 'bitcoin'
}

export enum HDWALLETS {
    'pioneer',
    'trezor',
    'keepkey',
    'ledger',
    'metamask'
}

export interface Transaction {
    coin: string;
    addressFrom: string;
    addressTo: string;
    address?: string;
    amount: string;
    memo?: string | undefined;
    nonce?:number
    feeLevel?:string,
    noBroadcast?:boolean
}

//TransactionUnsigned
export interface TransactionUnsigned {
    coin: string;
    invocationId?:string,
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

//TODO move this to sdk types export
export interface BroadcastBody {
    coin?:string
    isTestnet?:boolean,
    serialized:string
    signature?:string
    type?:string
    txid?:string
    broadcastBody?:any
    dscription?:any
    invocationId?:string
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

//note: must match api!
// interface BroadcastBody {
//     coin?:string
//     serialized:string
//     type?:string
//     broadcastBody?:any,
//     txid?:string
//     dscription?:any
//     invocationId?:string
// }

function bech32ify(address:any, prefix:string) {
    const words = bech32.toWords(address)
    return bech32.encode(prefix, words)
}

function createBech32Address(publicKey:any,prefix:string) {
    const message = CryptoJS.enc.Hex.parse(publicKey.toString(`hex`))
    const hash = ripemd160(sha256(message)).toString()
    const address = Buffer.from(hash, `hex`)
    const cosmosAddress = bech32ify(address, prefix)
    return cosmosAddress
}

module.exports = class wallet {
    private PUBLIC_WALLET:any = {};
    private PRIVATE_WALLET:any = {};
    private paths: (format: string) => any;
    // private normalizePubkeys: (format: string, pubkeys: any, paths: any) => Promise<any>;
    // // private events: Promise<any>;
    private forget: () => any;
    // private coins: () => any;
    // private getBalanceAudit: (coin: string) => Promise<any>;
    private getBalance: (coin: string, address?:string) => any;
    // private getInfo: (verbosity: string) => Promise<any>;
    private getBalanceRemote: (coin: string, address?:string) => Promise<any>;
    // private getEosPubkey: () => Promise<any>;
    // private getEosAccountsByPubkey: (pubkey: string) => Promise<any>;
    // private validateEosUsername: (username: string) => Promise<any>;
    // private registerEosUsername: (pubkey: string, username: string) => Promise<any>;
    private getFioPubkey: () => Promise<any>;
    private getFioAccountsByPubkey: (pubkey: string) => Promise<void>;
    private getPaymentRequests: (pubkey: string) => Promise<void>;
    private fioEncryptRequestContent: (content: any) => Promise<void>;
    private fioDecryptRequestContent: (content: any) => Promise<void>;
    private getFioAccountInfo: (username: string) => Promise<void>;
    // private validateFioUsername: (username: string) => Promise<void>;
    // private registerFioUsername: (pubkey: string, username: string) => Promise<void>;
    // private getStakes: (coin: string) => Promise<any>;
    // private getBalances: (coin: string) => Promise<any>;
    private getMaster: (coin: string) => Promise<any>;
    private getMasterOfSeed: (seed: string) => Promise<any>;
    private getAddress: (coin: string, account: number, index: number, isChange: boolean) => Promise<any>;
    // private getAddressByPath: (coin: string, path: string) => Promise<any>;
    // private getNewAddress: (coin: string) => Promise<any>;
    // private listSinceLastblock: (coin: string, block: string) => Promise<any>;
    // private getTransaction: (coin: string, txid: string) => Promise<any>;
    // private getTransactions: (coin: string, txid: string) => Promise<any>;
    private buildTx: (transaction: any) => Promise<any>;
    private bip32ToAddressNList: (path: string) => number[];
    // private encrypt: (msg: FioActionParameters.FioRequestContent, payerPubkey: string) => Promise<any>;
    private sendToAddress: (intent: SendToAddress) => Promise<any>;
    private buildTransfer: (transaction: Transaction) => Promise<any>;
    private broadcastTransaction: (coin: string, signedTx: BroadcastBody) => Promise<any>;
    private mode: string;
    private queryKey: string | undefined;
    private username: string;
    private type: HDWALLETS;
    private offline: boolean;
    private isTestnet: boolean | null;
    private init: (type: string, config: config) => Promise<any>;
    private mnemonic: string | undefined;
    private auth: string | undefined;
    private authProvider: AuthProviders | undefined;
    private spec: string;
    private pioneerApi: boolean | undefined;
    private WALLET: any;
    private pubkeys: any;
    private getInfo: (walletId: string) => any;
    private pioneer: any;
    private pioneerClient: any;
    private WALLET_BALANCES: any;
    private setMnemonic: () => string | undefined;
    private buildSwap: (transaction: any) => Promise<string>;
    private blockchains: any;
    private addLiquidity: (addLiquidity: any) => Promise<any>;
    private buildApproval: (swap: any) => Promise<any>;
    private sendApproval: (intent: Approval) => Promise<any>;
    private context: string; //Wallet File name
    private signTransaction: (transaction: TransactionUnsigned) => Promise<any>;
    private getApproveQueue: () => any;
    private getPendingQueue: () => any;
    private getNextReview: () => any;
    private addUnsigned: (unsigned: any) => any;
    private addBroadcasted: (signed: any) => any;
    private APPROVE_QUEUE: any[];
    private PENDING_QUEUE: any[];
    constructor(type:HDWALLETS,config:config,isTestnet?:boolean) {
        //if(config.isTestnet) isTestnet = true
        this.APPROVE_QUEUE = []
        this.PENDING_QUEUE = []
        this.isTestnet = false
        this.offline = false //TODO supportme
        this.mode = config.mode
        this.context = config.context
        this.queryKey = config.queryKey
        this.username = config.username
        this.pioneerApi = config.pioneerApi
        this.blockchains = config.blockchains
        this.WALLET_BALANCES = {}
        this.type = type
        this.spec = config.spec
        this.mnemonic = config.mnemonic
        this.auth = config.auth
        this.authProvider = config.authProvider
        this.bip32ToAddressNList = function (path:string) {
            return bip32ToAddressNList(path);
        }
        this.setMnemonic = function () {
            return this.mnemonic;
        }
        this.init = async function (wallet?:any) {
            let tag = TAG + " | init_wallet | "
            try{
                if(!this.blockchains && !wallet.blockchains) throw Error("Must Specify blockchain support! ")
                log.debug(tag,"checkpoint")
                let paths = getPaths(this.blockchains)
                switch (+HDWALLETS[this.type]) {
                    case HDWALLETS.pioneer:
                        const pioneerAdapter = pioneer.NativeAdapter.useKeyring(keyring)
                        log.debug(tag,"checkpoint"," pioneer wallet detected! ")
                        if(!config.mnemonic && !wallet && !config.context) throw Error("102: mnemonic or wallet file or context required! ")
                        if(config.mnemonic && config.wallet) throw Error("103: wallet collision! invalid config! ")

                        log.debug(tag,"isTestnet: ",this.isTestnet)
                        //pair
                        this.WALLET = await pioneerAdapter.pairDevice(config.username)
                        await this.WALLET.loadDevice({ mnemonic: config.mnemonic, isTestnet:this.isTestnet })

                        //verify testnet
                        const isTestnet = false
                        log.debug(tag,"hdwallet isTestnet: ",isTestnet)
                        log.info(tag,"paths: ",paths.length)
                        log.info(tag,"blockchains: ",this.blockchains)
                        //verify paths for each enabled blockchain
                        for(let i = 0; i < this.blockchains.length; i++){
                            let blockchain = this.blockchains[i]
                            log.debug(tag,"blockchain: ",blockchain)
                            //find blockchain in path
                            let isFound = paths.find((path: { blockchain: string; }) => {
                                return path.blockchain === blockchain
                            })
                            if(!isFound){
                                throw Error("Failed to find path for blockchain: "+blockchain)
                            }
                        }
                        log.info(tag,"Checkpoint valid paths ** ")
                        this.pubkeys = await this.WALLET.getPublicKeys(paths)
                        log.debug("pubkeys ",JSON.stringify(this.pubkeys))

                        //verify pubkey for each blockchain
                        for(let i = 0; i < this.blockchains.length; i++){
                            let blockchain = this.blockchains[i]
                            //find blockchain in path
                            let isFound = this.pubkeys.find((pubkey: { blockchain: any; }) => {
                                return pubkey.blockchain == blockchain
                            })
                            if(!isFound){
                                throw Error("Failed to find path for blockchain: "+blockchain)
                            }
                        }
                        log.info(tag,"Checkpoint valid pubkeys ** ")
                        //TODO verify hdwallet init successfull

                        log.debug("pubkeys ",this.pubkeys)
                        log.debug("pubkeys.length ",this.pubkeys.length)
                        log.debug("paths.length ",paths.length)
                        log.debug("blockchainsEnabled: ",this.blockchains.length)
                        let blockchainsEnabled = this.blockchains.length

                        for(let i = 0; i < this.pubkeys.length; i++){
                            let pubkey = this.pubkeys[i]
                            log.debug(tag,"pubkey: ",pubkey)
                            if(!pubkey) throw Error("empty pubkey!")
                            if(!pubkey.symbol){
                                let nativeAsset = getNativeAssetForBlockchain(pubkey.blockchain)
                                if(!nativeAsset) throw Error("102: blockchain not supported by coins module!  "+pubkey.blockchain)
                                pubkey.symbol = nativeAsset
                            }
                            // if(isTestnet && pubkey.xpub && !pubkey.tpub){
                            //     pubkey.tpub = await crypto.xpubConvert(pubkey.xpub,'tpub')
                            // }
                            this.PUBLIC_WALLET[pubkey.symbol] = pubkey
                        }
                        break;
                    case HDWALLETS.keepkey:
                        log.debug(tag," Keepkey mode! ")
                        if(!config.wallet) throw Error("Config is missing watch wallet!")
                        if(!config.wallet.WALLET_PUBLIC) throw Error("Config watch wallet missing WALLET_PUBLIC!")
                        if(!config.wallet.pubkeys) throw Error("Config watch wallet missing pubkeys!")

                        //load wallet from keepkey
                        this.WALLET = wallet
                        log.debug(tag,"IN paths: ",paths)
                        //TODO why this no worky
                        // this.pubkeys = await this.WALLET.getPublicKeys(paths)
                        this.pubkeys = config.wallet.pubkeys

                        log.debug("pubkeys ",JSON.stringify(this.pubkeys))
                        log.debug("pubkeys.length ",this.pubkeys.length)
                        log.debug("paths.length ",paths.length)
                        //if paths !== pubkeys throw? missing symbol?

                        for(let i = 0; i < this.pubkeys.length; i++){
                            let pubkey = this.pubkeys[i]
                            log.debug(tag,"pubkey: ",pubkey)
                            if(!pubkey) throw Error("empty pubkey!")
                            if(!pubkey.symbol){
                                log.debug("pubkey: ",pubkey)
                                throw Error("Invalid pubkey!")
                            }
                            if(this.isTestnet && pubkey.xpub && !pubkey.tpub){
                                pubkey.tpub = await crypto.xpubConvert(pubkey.xpub,'tpub')
                            }
                            this.PUBLIC_WALLET[pubkey.symbol] = pubkey
                        }
                        log.debug("this.PUBLIC_WALLET",this.PUBLIC_WALLET)

                        break;
                    case HDWALLETS.metamask:
                        log.debug(tag," metamask mode! ")
                        if(!config.wallet) throw Error("Config is missing watch wallet!")
                        if(!config.wallet.WALLET_PUBLIC) throw Error("Config watch wallet missing WALLET_PUBLIC!")
                        this.PUBLIC_WALLET = config.wallet.WALLET_PUBLIC
                        if(!config.pubkeys) throw Error("Config watch wallet missing pubkeys!")
                        this.pubkeys = config.pubkeys
                        break;
                    default:
                        throw Error("108: WALLET not yet supported! "+type+" valid: "+HDWALLETS)
                        break;
                }
                if(!this.pubkeys) throw Error("103: failed to init wallet! missing pubkeys!")
                if(this.pioneerApi){
                    if(!this.spec) throw Error("102:  Api spec required! ")
                    if(!this.queryKey) throw Error("102:  queryKey required! ")
                    this.pioneer = new network(config.spec,{
                        queryKey:config.queryKey
                    })
                    this.pioneerClient = await this.pioneer.init(config.spec,{
                        queryKey:config.queryKey
                    });
                    log.debug("baseUrl: ",await this.pioneerClient.getBaseURL())
                    //API
                    let register = {
                        isTestnet:false,
                        username:this.username,
                        blockchains:this.blockchains,
                        walletName:this.context,
                        data:{
                            pubkeys:this.pubkeys
                        },
                        queryKey:this.queryKey,
                        auth:this.auth,
                        provider:'bitcoin'
                    }
                    log.debug("registerBody: ",register)
                    log.debug("this.pioneerClient: ",this.pioneerClient)
                    let regsiterResponse = await this.pioneerClient.instance.Register(null,register)
                    log.debug("regsiterResponse: ",regsiterResponse)

                    log.info(tag,"getting info on context: ",this.context)
                    let walletInfo = await this.getInfo(this.context)
                    log.info(tag,"walletInfo: ",walletInfo)

                    //validate info
                    log.debug("walletInfo: ",walletInfo)

                    if(walletInfo && walletInfo.balances){
                        let coins = Object.keys(walletInfo.balances)
                        for(let i = 0; i < coins.length; i++){
                            let coin = coins[i]
                            let balance = walletInfo.balances[coin]
                            this.WALLET_BALANCES[coin] = balance
                        }
                    }

                    if(walletInfo && walletInfo.balances) this.WALLET_BALANCES = walletInfo.balances
                    //emitter.info = walletInfo

                    return walletInfo
                } else {
                    log.debug(tag,"Offline mode!")
                }
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        this.paths = function (format:string) {
            let tag = TAG + " | get_paths | "
            try {
                let output:any = []
                if(format === 'keepkey'){
                    let paths = getPaths(this.blockchains)
                    for(let i = 0; i < paths.length; i++){
                        let path = paths[i]
                        let pathForKeepkey:any = {}
                        //send coin as bitcoin
                        pathForKeepkey.symbol = path.symbol
                        pathForKeepkey.addressNList = path.addressNList
                        //why
                        pathForKeepkey.coin = 'Bitcoin'
                        pathForKeepkey.script_type = 'p2pkh'

                        output.push(pathForKeepkey)
                    }
                } else {
                    let paths = getPaths(this.blockchains)
                    output = paths
                }
                return output
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        // this.normalizePubkeys = function (format:string,pubkeys:any,paths:any) {
        //     return normalize_pubkeys(format,pubkeys,paths)
        // }
        this.forget = function () {
            return this.pioneerClient.instance.Forget();
        }
        // this.coins = function () {
        //     return WALLET_COINS;
        // }
        this.getInfo = async function (walletId) {
            let tag = TAG + " | getInfo | "
            try {
                let walletInfo:any = {}
                if(!this.offline){
                    //query api
                    walletInfo = await this.pioneerClient.instance.Info(walletId)
                    log.debug(tag,"walletInfo: ",walletInfo)
                }
                return walletInfo.data
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getBalance = function (coin:string) {
            return this.WALLET_BALANCES[coin] || 0;
        }
        this.getMasterOfSeed = async function (mnemonic:string,coin?:string) {
            //master is ETH
            let wallet = await ethCrypto.generateWalletFromSeed(mnemonic)
            return wallet.masterAddress;
        }
        this.getBalanceRemote = async function (coin:string,address?:string) {
            let tag = TAG + " | getBalance | "
            try {
                log.debug("coin detected: ",coin)
                let output
                let pubkey
                if(coin === "ETH"){
                    log.debug("ETH detected ")
                    pubkey = await this.PUBLIC_WALLET[coin].master
                }else if(tokenData.tokens.indexOf(coin) >=0 && coin !== 'EOS'){
                    log.debug("token detected ")
                    pubkey = await this.getMaster('ETH')
                } else if(UTXO_COINS.indexOf(coin) >= 0){
                    //get xpub/zpub
                    pubkey = this.PUBLIC_WALLET[coin].pubkey
                }else{
                    pubkey = await this.PUBLIC_WALLET[coin].master
                }
                log.debug(tag,"pubkey: ",pubkey)
                output = await this.pioneerClient.instance.GetPubkeyBalance({coin,pubkey})
                output = output.data
                return output
            } catch (e) {
                log.error(tag, "e: ", e)
                throw e
            }
        }
        // /*
        //     Verify Balance locally
        //     Dont trust remote
        // */
        // this.getBalanceAudit = function (coin:string) {
        //     return get_balance_audit(coin);
        // }
        // /*
        //     EOS commands
        //  */
        // this.getEosPubkey = function () {
        //     return get_eos_pubkey();
        // }
        // this.getEosAccountsByPubkey = function (pubkey:string) {
        //     return get_eos_account_by_pubkey(pubkey);
        // }
        // this.validateEosUsername = function (username:string) {
        //     return validate_EOS_username(username);
        // }
        // this.registerEosUsername = function (pubkey:string,username:string) {
        //     return register_eos_username(pubkey,username);
        // }
        /*
            Queue
                Unsigned tx's (ready to be reviewed approves)
                Pending (broadcasted/unconfirmed, but available for replacement)
         */
        this.getApproveQueue = function () {
            return this.APPROVE_QUEUE;
        }
        this.getPendingQueue = function () {
            return this.PENDING_QUEUE;
        }
        this.getNextReview = function () {
            return this.APPROVE_QUEUE.shift();
        }
        this.addUnsigned = function (unsigned:any) {
            return this.APPROVE_QUEUE.push(unsigned);
        }
        this.addBroadcasted = function (signed:any) {
            return this.PENDING_QUEUE.push(signed);
        }
        /*
        FIO commands
         */
        this.getFioPubkey = function () {
            return this.PUBLIC_WALLET['FIO'].pubkey;
        }
        this.getFioAccountInfo = async function (username:string) {
            let result = await this.pioneerClient.instance.GetFioAccountInfo(username);
            return result.data
        }
        this.getFioAccountsByPubkey = async function (pubkey:string) {
            let accounts = await this.pioneerClient.instance.AccountsFromFioPubkey(pubkey)
            return accounts.data
        }
        //getPaymentRequests
        this.getPaymentRequests = async function () {
            let accounts = await this.pioneerClient.instance.GetPaymentRequests(this.PUBLIC_WALLET['FIO'].pubkey)
            return accounts.data
        }
        this.fioEncryptRequestContent = async function (content:any) {
            let result = await this.WALLET.fioEncryptRequestContent(content)
            return result
        }
        //fioDecryptRequestContent
        this.fioDecryptRequestContent = async function (content:any) {
            let result = await this.WALLET.fioDecryptRequestContent(content)
            return result
        }
        // this.validateFioUsername = async function (username:string) {
        //     let result = await this.pioneerClient.instance.ValidateFioUsername(username)
        //     return result
        // }
        // this.registerFioUsername = function (pubkey:string,username:string) {
        //     return register_fio_username(pubkey,username);
        // }
        // /*
        //     Staking assets
        //  */
        // this.getStakes = function (coin:string) {
        //     return get_staking_positions(coin);
        // }
        // this.getBalances = function () {
        //     return get_balances();
        // }
        this.getMaster = async function (coin:string) {
            let tag = TAG + " | get_address_master | "
            try {
                if(!coin) throw Error("101: must pass coin!")
                if(this.PUBLIC_WALLET[coin]){
                    let output = this.PUBLIC_WALLET[coin].address
                    return output
                }else{
                    return "Not found!"
                }

            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getAddress = function (coin:string,account:number, index:number, isChange:boolean) {
            let tag = TAG + " | get_address | "
            try {
                let output

                //if token use ETH pubkey
                if(tokenData.tokens.indexOf(coin) >=0 && coin !== 'EOS'){
                    coin = 'ETH'
                }


                //if xpub get next unused
                if(!this.PUBLIC_WALLET[coin]) {
                    log.error(tag,"PUBLIC_WALLET: ",this.PUBLIC_WALLET)
                    throw Error("102: coin not in this.PUBLIC_WALLET! coin:"+coin)
                }
                if(this.PUBLIC_WALLET[coin].type === 'xpub'){

                    //get pubkey at path
                    let publicKey = bitcoin.bip32.fromBase58(this.PUBLIC_WALLET[coin].pubkey).derive(account).derive(index).publicKey
                    log.debug("publicKey: ********* ",publicKey)


                    switch(coin) {
                        case 'ETH':
                            output = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey,true))
                            break;
                        case 'RUNE':
                            // code block
                            if(this.isTestnet){
                                output = createBech32Address(publicKey,'tthor')
                            } else {
                                output = createBech32Address(publicKey,'thor')
                            }

                            break;
                        case 'ATOM':
                            // code block
                            output = createBech32Address(publicKey,'cosmos')
                            break;
                        case 'BNB':
                            // code block
                            output = createBech32Address(publicKey,'bnb')
                            break;
                        case 'EOS':
                            // log.debug(tag,"pubkey: ",publicKey)
                            //
                            // let account = this.pioneerClient.instance.Balance(null,publicKey)
                            // log.debug(tag,"account: ",account)
                            // //get accounts for pubkey
                            // output = 'fixmebro'
                            // break;
                        case 'FIO':
                            log.debug(tag,"pubkey: ",publicKey)

                            let accountFio = this.pioneerClient.instance.GetFioAccount(publicKey)
                            log.debug(tag,"accountFio: ",accountFio)
                            //get accounts for pubkey
                            output = accountFio
                            break;
                        default:
                            throw Error("coin not yet implemented ! ")
                        // code block
                    }

                    log.debug(tag,"output: ",output)

                } else {
                    output = this.PUBLIC_WALLET[coin].master || this.PUBLIC_WALLET[coin].pubkey
                }

                return output
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        // this.getAddressByPath = function (coin:string,path:string) {
        //     return get_address_by_path(coin,path);
        // }
        // this.getNewAddress = function (coin:string) {
        //     return get_new_address(coin);
        // }
        // this.listSinceLastblock = function (coin:string,block:string) {
        //     return list_since_block(coin,block);
        // }
        // this.getTransaction = function (coin:string,txid:string) {
        //     return get_transaction(coin,txid);
        // }
        // this.getTransactions = function (coin:string,params:any) {
        //     return get_transactions(coin,params)
        // }
        // /*
        //     Txs
        //
        //     3 type:
        //         Transfers
        //              optional memo's
        //         Swaps
        //              Dex trades
        //              Thorchain contract (ETH/TOKEN) trades
        //
        //         non-transfers
        //             Register address
        //             Register Username
        //             staking
        //
        //  */

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
            amount: "0.1"
        }
        */
        // @ts-ignore
        // @ts-ignore
        // @ts-ignore
        this.addLiquidity = async function (addLiquidity:any) {
            let tag = TAG + " | addLiquidity | "
            try{
                let rawTx

                let UTXOcoins = [
                    'BTC',
                    'BCH',
                    'LTC'
                ]

                //supported tokens
                //USDT SUSHI

                if(addLiquidity.inboundAddress.chain === 'ETH'){
                    //get tx inputs
                    let addressFrom
                    if(addLiquidity.addressFrom){
                        addressFrom = addLiquidity.addressFrom
                    } else {
                        addressFrom = await this.getMaster('ETH')
                    }
                    if(!addressFrom) throw Error("102: unable to get master address! ")

                    let data = await this.pioneerClient.instance.GetThorchainMemoEncoded(null,addLiquidity)
                    data = data.data
                    log.debug(tag,"txData: ",data)

                    let nonceRemote = await this.pioneerClient.instance.GetNonce(addressFrom)
                    nonceRemote = nonceRemote.data
                    let nonce = addLiquidity.nonce || nonceRemote
                    let gas_limit = 80000 //TODO dynamic gas limit?
                    let gas_price = await this.pioneerClient.instance.GetGasPrice()
                    gas_price = gas_price.data
                    log.debug(tag,"gas_price: ",gas_price)
                    gas_price = parseInt(gas_price)
                    gas_price = gas_price + 1000000000

                    //sign
                    //send FROM master
                    let masterPathEth  = "m/44'/60'/0'/0/0" //TODO moveme to support

                    //if eth
                    let amountNative = parseFloat(addLiquidity.amount) * support.getBase('ETH')
                    amountNative = Number(parseInt(String(amountNative)))
                    log.debug("amountNative: ",amountNative)
                    log.debug("nonce: ",nonce)

                    //TODO if token

                    let ethTx = {
                        // addressNList: support.bip32ToAddressNList(masterPathEth),
                        "addressNList":[
                            2147483692,
                            2147483708,
                            2147483648,
                            0,
                            0
                        ],
                        nonce: numberToHex(nonce),
                        gasPrice: numberToHex(gas_price),
                        gasLimit: numberToHex(gas_limit),
                        value: numberToHex(amountNative),
                        to: addLiquidity.inboundAddress.router,
                        data,
                        // chainId: 1,//TODO testnet
                    }

                    log.debug("unsignedTxETH: ",ethTx)
                    //send to hdwallet
                    rawTx = await this.WALLET.ethSignTx(ethTx)
                    rawTx.params = ethTx

                    const txid = keccak256(rawTx.serialized).toString('hex')
                    log.debug(tag,"txid: ",txid)
                    rawTx.txid = txid

                } else if(UTXOcoins.indexOf(addLiquidity.inboundAddress.chain) >= 0){
                    if(!addLiquidity.memo) throw Error("Memo required for swaps!")
                    //UTXO coins
                    let coin = addLiquidity.inboundAddress.chain
                    let addressFrom = await this.getMaster(coin) //TODO this silly in utxo
                    //build transfer with memo
                    let transfer:Transaction = {
                        coin:"BTC",
                        addressTo:addLiquidity.inboundAddress.address,
                        addressFrom,
                        amount:addLiquidity.amount,
                        feeLevel:addLiquidity.feeLevel,
                        memo:addLiquidity.memo
                    }

                    rawTx = await this.buildTransfer(transfer)
                    console.log("rawTx: ",rawTx)

                } else {
                    throw Error("Chain not supported! "+addLiquidity.inboundAddress.chain)
                }

                return rawTx
            }catch(e){
                log.error(e)
                throw e
            }
        },
        this.buildApproval = async function (approval:any) {
            let tag = TAG + " | buildApproval | "
            try{
                let rawTx

                let addressFrom = await this.getMaster('ETH')

                let nonceRemote = await this.pioneerClient.instance.GetNonce(addressFrom)
                nonceRemote = nonceRemote.data
                let nonce = approval.nonce || nonceRemote
                let gas_limit = 80000 //TODO dynamic gas limit?
                let gas_price = await this.pioneerClient.instance.GetGasPrice()
                gas_price = gas_price.data
                log.debug(tag,"gas_price: ",gas_price)
                gas_price = parseInt(gas_price)
                gas_price = gas_price + 1000000000

                log.debug(tag,"approval.tokenAddress: ",approval.tokenAddress)
                log.debug(tag,"approval.amount: ",approval.amount)

                let data =
                    "0x" +
                    "095ea7b3" + // ERC-20 contract approve function identifier
                    (approval.contract).replace("0x", "").padStart(64, "0") +
                    (approval.amount).toString(16).padStart(64, "0");

                log.debug(tag,"data: ",data)

                let ethTx = {
                    // addressNList: support.bip32ToAddressNList(masterPathEth),
                    "addressNList":[
                        2147483692,
                        2147483708,
                        2147483648,
                        0,
                        0
                    ],
                    nonce: numberToHex(nonce),
                    gasPrice: numberToHex(gas_price),
                    gasLimit: numberToHex(gas_limit),
                    value: numberToHex(0),
                    to: approval.tokenAddress,
                    data,
                    // chainId: 1,//TODO testnet
                }

                log.debug("unsignedTxETH: ",ethTx)
                //send to hdwallet
                // rawTx = await this.WALLET.ethSignTx(ethTx)
                // rawTx.params = ethTx
                //
                // const txid = keccak256(rawTx.serialized).toString('hex')
                // log.debug(tag,"txid: ",txid)
                // rawTx.txid = txid
                return ethTx
            }catch(e){
                log.error(e)
                throw e
            }
        },
        //@ts-ignore
        this.buildSwap = async function (swap:any) {
            let tag = TAG + " | buildSwap | "
            try{
                let rawTx

                let UTXOcoins = [
                    'BTC',
                    'BCH',
                    'LTC'
                ]

                //supported tokens
                //USDT SUSHI

                if(swap.inboundAddress.chain === 'ETH'){
                    //get tx inputs
                    let addressFrom
                    if(swap.addressFrom){
                        addressFrom = swap.addressFrom
                    } else {
                        addressFrom = await this.getMaster('ETH')
                    }
                    if(!addressFrom) throw Error("102: unable to get master address! ")

                    let data = await this.pioneerClient.instance.GetThorchainMemoEncoded(null,swap)
                    data = data.data
                    log.debug(tag,"txData: ",data)

                    let nonceRemote = await this.pioneerClient.instance.GetNonce(addressFrom)
                    nonceRemote = nonceRemote.data
                    let nonce = swap.nonce || nonceRemote
                    let gas_limit = 80000 //TODO dynamic gas limit?
                    let gas_price = await this.pioneerClient.instance.GetGasPrice()
                    gas_price = gas_price.data
                    log.debug(tag,"gas_price: ",gas_price)
                    gas_price = parseInt(gas_price)
                    gas_price = gas_price + 1000000000

                    //sign
                    //send FROM master
                    let masterPathEth  = "m/44'/60'/0'/0/0" //TODO moveme to support

                    //if eth
                    let amountNative = parseFloat(swap.amount) * support.getBase('ETH')
                    amountNative = Number(parseInt(String(amountNative)))
                    log.debug("amountNative: ",amountNative)
                    log.debug("nonce: ",nonce)

                    //TODO if token

                    let ethTx = {
                        // addressNList: support.bip32ToAddressNList(masterPathEth),
                        "addressNList":[
                            2147483692,
                            2147483708,
                            2147483648,
                            0,
                            0
                        ],
                        nonce: numberToHex(nonce),
                        gasPrice: numberToHex(gas_price),
                        gasLimit: numberToHex(gas_limit),
                        value: numberToHex(amountNative),
                        to: swap.inboundAddress.router,
                        data,
                        // chainId: 1,//TODO testnet
                    }

                    log.debug("unsignedTxETH: ",ethTx)
                    rawTx = ethTx
                    //send to hdwallet
                    // rawTx = await this.WALLET.ethSignTx(ethTx)
                    // rawTx.params = ethTx
                    //
                    // const txid = keccak256(rawTx.serialized).toString('hex')
                    // log.debug(tag,"txid: ",txid)
                    // rawTx.txid = txid

                } else if(UTXOcoins.indexOf(swap.inboundAddress.chain) >= 0){
                    throw Error("NOT SUPPORTED! Use transfer with memo!")

                } else {
                    throw Error("Chain not supported! "+swap.inboundAddress.chain)
                }

                return rawTx
            }catch(e){
                log.error(e)
                throw e
            }
        },
        this.buildTx = async function (transaction:any) {
            let tag = TAG + " | buildTx | "
            try{
                let rawTx = {}

                //
                if(transaction.coin === 'FIO'){

                    //types
                    let tx:any
                    let signTx:any
                    let res:any
                    switch(transaction.type) {
                        case "fioSignAddPubAddressTx":
                            tx = transaction.tx
                            signTx = {
                                addressNList: bip32ToAddressNList("m/44'/235'/0'/0/0"),
                                actions: [
                                    {
                                        account: FioActionParameters.FioAddPubAddressActionAccount,
                                        name: FioActionParameters.FioAddPubAddressActionName,
                                        data:tx,
                                    },
                                ],
                            }
                            log.debug(tag,"signTx: ",JSON.stringify(signTx))
                            res = await this.WALLET.fioSignTx(signTx);
                            res.coin = "FIO"
                            res.type = transaction.type
                            rawTx = res
                            // code block
                            break;
                        case "fioSignRegisterDomainTx":
                            // code block
                            break;
                        case "fioSignRegisterFioAddressTx":
                            // code block
                            break;
                        case "fioSignNewFundsRequestTx":
                            tx = transaction.tx
                            signTx = {
                                addressNList: bip32ToAddressNList("m/44'/235'/0'/0/0"),
                                actions: [
                                    {
                                        account: FioActionParameters.FioNewFundsRequestActionAccount,
                                        name: FioActionParameters.FioNewFundsRequestActionName,
                                        data:tx,
                                    },
                                ],
                            }
                            log.debug(tag,"signTx: ",JSON.stringify(signTx))
                            res = await this.WALLET.fioSignTx(signTx);
                            res.coin = "FIO"
                            res.type = transaction.type
                            rawTx = res
                            break;
                        default:
                        //code block
                    }


                } else {
                    log.error(tag,"coin not supported! ",transaction.coin)
                }


                return rawTx
            }catch(e){
                log.error(e)
                throw e
            }
        }
        // this.encrypt = function (msg:FioActionParameters.FioRequestContent,payerPubkey:string) {
        //     return encrypt_message(msg,payerPubkey);
        // }
        this.sendApproval = async function (intent:Approval) {
            let tag = TAG+" | sendApproval | "
            try{
                let invocationId
                if(!intent.invocationId) {
                    invocationId = "notset"
                } else {
                    invocationId = intent.invocationId
                }
                if(intent.coin && intent.coin !== 'ETH') throw Error("approvals are ETH only!")
                intent.coin = "ETH"

                if(!intent.contract) throw Error("102: contract required!")
                if(!intent.tokenAddress) throw Error("103: tokenAddress required!")
                if(!intent.amount) throw Error("104: amount required!")
                //TODO max approval
                //if(!intent.amount) intent.amount = '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'

                let approval = {
                    contract:intent.contract,
                    tokenAddress:intent.tokenAddress,
                    amount:intent.amount
                }

                let signedTx = await this.buildApproval(approval)
                log.debug(tag,"signedTx: ",signedTx)

                if(invocationId) signedTx.invocationId = invocationId
                log.debug(tag,"invocationId: ",invocationId)

                signedTx.broadcasted = false
                let broadcast_hook = async () =>{
                    try{
                        log.debug(tag,"signedTx: ",signedTx)
                        //TODO flag for async broadcast
                        let broadcastResult = await this.broadcastTransaction('ETH',signedTx)
                        log.debug(tag,"broadcastResult: ",broadcastResult)

                        //push to invoke api
                    }catch(e){
                        log.error(tag,"Failed to broadcast transaction!")
                    }
                }
                //broadcast hook
                if(!intent.noBroadcast){
                    signedTx.broadcasted = true
                } else {
                    signedTx.noBroadcast = true
                }
                //if noBroadcast we MUST still release the inovation
                //notice we pass noBroadcast to the broadcast post request
                //also Notice NO asyc here! tx lifecycle hooks bro!
                broadcast_hook()

                signedTx.invocationId = invocationId
                //
                if(!signedTx.txid) throw Error("103: Pre-broadcast txid hash not implemented!")
                return signedTx
            }catch(e){
                log.error(tag,e)
                throw Error(e)
            }
        }
        this.sendToAddress = async function (intent:SendToAddress) {
            let tag = TAG+" | sendToAddress | "
            try{
                let invocationId
                if(!intent.invocationId) {
                    invocationId = "notset"
                } else {
                    invocationId = intent.invocationId
                }
                if(!intent.address && intent.addressTo) intent.address = intent.addressTo
                intent.coin = intent.coin.toUpperCase()
                log.debug(tag,"params: ",intent)
                if(!intent.amount) throw Error("Amount required!")
                if(!intent.address) throw Error("address required!")
                //TODO verify input params

                let addressFrom = await this.getMaster(intent.coin)
                log.debug(tag,"addressFrom: ",addressFrom)

                if(intent.amount === 'all'){
                    //get balance
                    let balance = await this.getBalance(intent.coin)
                    log.debug(tag,"balance: ",balance)

                    //subtract fees
                    intent.amount = String(parseFloat(balance) - 0.08)
                    log.debug(tag,"ALL amount: ",intent.amount)

                    if(parseFloat(intent.amount) < 0) {
                        throw Error("Balance lower then expected fee!")
                    }

                    //set amount
                }

                let transaction:Transaction = {
                    coin:intent.coin,
                    addressTo:intent.address,
                    addressFrom,
                    amount:intent.amount,
                }
                if(intent.memo) transaction.memo = intent.memo
                if(intent.noBroadcast) transaction.noBroadcast = intent.noBroadcast

                //build transfer
                let unSignedTx = await this.buildTransfer(transaction)
                log.debug(tag,"unSignedTx: ",unSignedTx)

                if(invocationId) unSignedTx.invocationId = invocationId
                log.debug(tag,"transaction: ",transaction)

                unSignedTx.broadcasted = false
                if(!intent.noBroadcast){
                    unSignedTx.broadcasted = true
                } else {
                    unSignedTx.noBroadcast = true
                }

                unSignedTx.invocationId = invocationId
                return unSignedTx
            }catch(e){
                log.error(tag,e)
                throw Error(e)
            }
        }
        this.signTransaction = async function (unsignedTx:TransactionUnsigned) {
            let tag = TAG + " | signTransaction | "
            try {
                let signedTx:any = {}
                let coin = unsignedTx.coin


                let UTXOcoins = [
                    'BTC',
                    'BCH',
                    'LTC'
                ]

                if(UTXOcoins.indexOf(coin) >= 0){
                    const res = await this.WALLET.btcSignTx(unsignedTx.HDwalletPayload);
                    log.debug(tag,"res: ",res)

                    //
                    signedTx = {
                        txid:res.txid,
                        coin,
                        serialized:res.serializedTx
                    }
                }else if(coin === 'ETH' || tokenData.tokens.indexOf(coin) >=0 && coin !== 'EOS'){
                    log.debug("unsignedTxETH: ",unsignedTx.HDwalletPayload)
                    signedTx = await this.WALLET.ethSignTx(unsignedTx.HDwalletPayload)
                    //debug https://flightwallet.github.io/decode-eth-tx/

                    //txid
                    //const txHash = await web3.utils.sha3(signed.rawTransaction);
                    if(!signedTx.serialized) throw Error("Failed to sign!")

                    const txid = keccak256(signedTx.serialized).toString('hex')
                    log.debug(tag,"txid: ",txid)

                    signedTx.txid = txid
                    signedTx.params = unsignedTx.transaction //input
                } else if(coin === 'RUNE'){
                    let res = await this.WALLET.thorchainSignTx(unsignedTx.HDwalletPayload);

                    log.debug("res: ",prettyjson.render(res))
                    log.debug("res*****: ",res)

                    let txFinal:any
                    txFinal = res
                    txFinal.signatures = res.signatures

                    log.debug("FINAL: ****** ",txFinal)

                    let broadcastString = {
                        tx:txFinal,
                        type:"cosmos-sdk/StdTx",
                        mode:"sync"
                    }

                    // @ts-ignore
                    const buffer = Buffer.from(JSON.stringify(txFinal), 'base64');
                    let hash = sha256(buffer).toString().toUpperCase()
                    // let hash = crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase()


                    signedTx = {
                        txid:hash,
                        coin,
                        serialized:JSON.stringify(broadcastString)
                    }
                }else if(coin === 'ATOM'){
                    let res = await this.WALLET.cosmosSignTx(unsignedTx.HDwalletPayload);

                    log.debug("res: ",prettyjson.render(res))
                    log.debug("res*****: ",res)

                    let txFinal:any
                    txFinal = res
                    txFinal.signatures = res.signatures

                    log.debug("FINAL: ****** ",txFinal)

                    let broadcastString = {
                        tx:txFinal,
                        type:"cosmos-sdk/StdTx",
                        mode:"sync"
                    }
                    signedTx = {
                        txid:"",
                        coin,
                        serialized:JSON.stringify(broadcastString)
                    }
                } else if(coin === 'BNB'){
                    const signedTxResponse = await this.WALLET.binanceSignTx(unsignedTx.HDwalletPayload)
                    log.debug(tag,"**** signedTxResponse: ",signedTxResponse)
                    log.debug(tag,"**** signedTxResponse: ",JSON.stringify(signedTxResponse))

                    // this is undefined at first tx
                    // let pubkeyHex = pubkey.toString('hex')
                    // log.debug(tag,"pubkeyHex: ",pubkeyHex)

                    let pubkeySigHex = signedTxResponse.signatures.pub_key.toString('hex')
                    log.debug(tag,"pubkeySigHex: ",pubkeySigHex)

                    const buffer = Buffer.from(signedTxResponse.serialized, 'base64');
                    let hash = cryptoTools.createHash('sha256').update(buffer).digest('hex').toUpperCase()

                    signedTx = {
                        txid:hash,
                        serialized:signedTxResponse.serialized
                    }
                }else{
                    //TODO EOS
                    //FIO
                    throw Error("Coin not supported! "+coin)
                }

                //
                if(unsignedTx.transaction.noBroadcast) signedTx.noBroadcast = true
                if(unsignedTx.invocationId) signedTx.invocationId = unsignedTx.invocationId

                return signedTx
            } catch (e) {
                log.error(tag, "e: ", e)
                throw e
            }
        }
        this.buildTransfer = async function (transaction:Transaction) {
            let tag = TAG + " | build_transfer | "
            try {
                log.info(tag,"transaction: ",transaction)
                isTestnet = false
                let coin = transaction.coin.toUpperCase()
                let address = transaction.address
                if(!address) address = transaction.addressTo
                let amount = transaction.amount
                if(!coin) throw Error("102: Invalid transaction missing coin!")
                if(!address) throw Error("103: Invalid transaction missing address!")
                if(!amount) throw Error("104: Invalid transaction missing amount!")

                let memo = transaction.memo
                let addressFrom
                if(transaction.addressFrom){
                    addressFrom = transaction.addressFrom
                } else {
                    addressFrom = await this.getMaster(coin)
                }
                if(!addressFrom) throw Error("102: unable to get master address! ")
                log.debug(tag,"addressFrom: ",addressFrom)

                let rawTx

                if(UTXO_COINS.indexOf(coin) >= 0){
                    log.debug(tag,"Build UTXO tx! ",coin)

                    //list unspent
                    log.debug(tag,"coin: ",coin)
                    log.debug(tag,"xpub: ",this.PUBLIC_WALLET[coin].xpub)

                    // let unspentInputs = await this.pioneerClient.instance.GetUtxos({coin})

                    let input
                    log.debug(tag,"isTestnet: ",isTestnet)
                    if(this.isTestnet && false){ //Seriously fuck testnet flagging!
                        // input = {coin:"TEST",xpub:this.PUBLIC_WALLET[coin].pubkey}
                    }else{
                        input = {coin,xpub:this.PUBLIC_WALLET[coin].pubkey}
                    }
                    log.info(tag,"input: ",input)
                    let unspentInputs = await this.pioneerClient.instance.ListUnspent(input)
                    unspentInputs = unspentInputs.data
                    log.info(tag,"unspentInputs: ",unspentInputs)

                    let utxos = []
                    for(let i = 0; i < unspentInputs.length; i++){
                        let input = unspentInputs[i]
                        let utxo = {
                            txId:input.txid,
                            vout:input.vout,
                            value:parseInt(input.value),
                            nonWitnessUtxo: Buffer.from(input.hex, 'hex'),
                            hex: input.hex,
                            tx: input.tx,
                            path:input.path
                            //TODO if segwit
                            // witnessUtxo: {
                            //     script: Buffer.from(input.hex, 'hex'),
                            //     value: 10000 // 0.0001 BTC and is the exact same as the value above
                            // }
                        }
                        utxos.push(utxo)
                    }

                    //if no utxo's
                    if (utxos.length === 0){
                        throw Error("101 YOUR BROKE! no UTXO's found! ")
                    }


                    //TODO get fee level in sat/byte
                    // let feeRate = 1
                    let feeRateInfo = await this.pioneerClient.instance.GetFeeInfo({coin})
                    feeRateInfo = feeRateInfo.data
                    log.debug(tag,"feeRateInfo: ",feeRateInfo)
                    let feeRate
                    //TODO dynamic all the things
                    if(coin === 'BTC'){
                        feeRate = feeRateInfo
                    }else if(coin === 'BCH'){
                        feeRate = 2
                    } else if(coin === 'LTC'){
                        feeRate = 4
                    } else {
                        throw Error("Fee's not configured for coin:"+coin)
                    }

                    log.debug(tag,"feeRate: ",feeRate)
                    if(!feeRate) throw Error("Can not build TX without fee Rate!")
                    //buildTx

                    //TODO input selection

                    //use coinselect to select inputs
                    let amountSat = parseFloat(amount) * 100000000
                    amountSat = parseInt(amountSat.toString())
                    log.debug(tag,"amount satoshi: ",amountSat)
                    let targets = [
                        {
                            address,
                            value: amountSat
                        }
                    ]
                    // if(memo){
                    //     targets.push({ address: memo, value: 0 })
                    // }

                    //Value of all inputs
                    let totalInSatoshi = 0
                    for(let i = 0; i < utxos.length; i++){
                        let amountInSat = utxos[i].value
                        totalInSatoshi = totalInSatoshi + amountInSat
                    }
                    log.debug(tag,"totalInSatoshi: ",totalInSatoshi)
                    log.debug(tag,"totalInBase: ",nativeToBaseAmount(coin,totalInSatoshi))
                    let valueIn = await coincap.getValue(coin,nativeToBaseAmount(coin,totalInSatoshi))
                    log.debug(tag,"totalInValue: ",valueIn)

                    //amount out
                    log.debug(tag,"amountOutSat: ",amountSat)
                    log.debug(tag,"amountOutBase: ",amount)
                    let valueOut = await coincap.getValue(coin,nativeToBaseAmount(coin,amountSat))
                    log.debug(tag,"valueOut: ",valueOut)

                    if(valueOut < 1){
                        if(coin === 'BCH'){
                            log.info(tag," God bless you sir's :BCH:")
                        } else {
                            log.info("ALERT DUST! sending less that 1usd. (hope you know what you are doing)")
                        }
                        //Expensive coins
                        if(["BTC","ETH","RUNE"].indexOf(coin) >= 0){
                            throw Error("You dont want to do this!")
                        }
                    }

                    if(nativeToBaseAmount(coin,totalInSatoshi) < amount){
                        throw Error("Sum of input less than output! YOUR BROKE! ")
                    }

                    log.debug(tag,"inputs coinselect algo: ",{ utxos, targets, feeRate })
                    let selectedResults = coinSelect(utxos, targets, feeRate)
                    log.debug(tag,"result coinselect algo: ",selectedResults)

                    //value of all outputs

                    //amount fee in USD

                    //if
                    if(!selectedResults.inputs){
                        throw Error("Fee exceeded total available inputs!")
                    }

                    //TODO get long name for coin

                    let inputs = []
                    let outputs = []
                    for(let i = 0; i < selectedResults.inputs.length; i++){
                        //get input info
                        let inputInfo = selectedResults.inputs[i]
                        log.debug(tag,"inputInfo: ",inputInfo)
                        let input = {
                            addressNList:support.bip32ToAddressNList(inputInfo.path),
                            scriptType:"p2pkh",
                            amount:String(inputInfo.value),
                            vout:inputInfo.vout,
                            txid:inputInfo.txId,
                            segwit:false,
                            hex:inputInfo.hex,
                            tx:inputInfo.tx
                        }
                        inputs.push(input)
                    }

                    //TODO get new change address
                    //hack send all change to master (address reuse bad, stop dis)
                    let changeAddress = await this.getMaster(coin)

                    //if bch convert format
                    if(coin === 'BCH'){
                        //if cashaddr convert to legacy
                        let type = bchaddr.detectAddressFormat(changeAddress)
                        log.debug(tag,"type: ",type)
                        if(type === 'cashaddr'){
                            changeAddress = bchaddr.toLegacyAddress(changeAddress)
                        }
                    }

                    for(let i = 0; i < selectedResults.outputs.length; i++){
                        let outputInfo = selectedResults.outputs[i]
                        if(outputInfo.address){
                            //not change
                            let output = {
                                address,
                                addressType:"spend",
                                scriptType:"p2wpkh",//TODO more types
                                amount:String(outputInfo.value),
                                isChange: false,
                            }
                            outputs.push(output)
                        } else {
                            //change
                            let output = {
                                address:changeAddress,
                                addressType:"spend",
                                scriptType:"p2pkh",//TODO more types
                                amount:String(outputInfo.value),
                                isChange: true,
                            }
                            outputs.push(output)
                        }
                    }
                    let longName
                    if(coin === 'BCH'){
                        longName = 'BitcoinCash'
                    }else if(coin === 'LTC'){
                        longName = 'Litecoin'
                        if(isTestnet){
                            longName = 'Testnet'
                        }
                    }else if(coin === 'BTC'){
                        longName = 'Bitcoin'
                        if(isTestnet){
                            longName = 'Testnet'
                        }
                    }else {
                        throw Error("UTXO coin: "+coin+" Not supported yet! ")
                    }


                    //hdwallet input
                    //TODO type this

                    let hdwalletTxDescription = {
                        opReturnData:memo,
                        coin: longName,
                        inputs,
                        outputs,
                        version: 1,
                        locktime: 0,
                    }


                    let unsignedTx = {
                        coin,
                        transaction,
                        HDwalletPayload:hdwalletTxDescription,
                        verbal:"UTXO transaction"
                    }

                    rawTx = unsignedTx

                    // const res = await this.WALLET.btcSignTx(hdwalletTxDescription);
                    // log.debug(tag,"res: ",res)
                    //
                    // //
                    // rawTx = {
                    //     txid:res.txid,
                    //     coin,
                    //     serialized:res.serializedTx
                    // }

                }else if(coin === 'ETH' || tokenData.tokens.indexOf(coin) >=0 && coin !== 'EOS'){
                    log.debug(tag,"checkpoint")
                    let balanceEth = await this.getBalance('ETH')
                    log.debug(tag,"balanceEth: ",balanceEth)

                    let nonceRemote = await this.pioneerClient.instance.GetNonce(addressFrom)
                    nonceRemote = nonceRemote.data
                    let nonce = transaction.nonce || nonceRemote
                    let gas_limit = 80000 //TODO dynamic gas limit?
                    let gas_price = await this.pioneerClient.instance.GetGasPrice()
                    gas_price = gas_price.data
                    log.debug(tag,"gas_price: ",gas_price)
                    gas_price = parseInt(gas_price)
                    gas_price = gas_price + 1000000000

                    let txParams
                    if(coin === "ETH"){
                        let amountNative = parseFloat(amount) * support.getBase('ETH')
                        amountNative = Number(parseInt(String(amountNative)))
                        txParams = {
                            nonce: nonce,
                            to: address,
                            gasPrice: gas_price,
                            gasLimit : gas_limit,
                            value: amountNative,
                            data:memo
                        }
                        log.debug(tag,"txParams: ",txParams)
                    }else{
                        let knownCoins = tokenData.tokens
                        log.debug(tag,"knownCoins: ",knownCoins)
                        if(knownCoins.indexOf(coin) === -1) throw Error("107: unknown token! "+coin)

                        let balanceToken = await this.getBalance(coin)

                        //verify token balance
                        if(amount > balanceToken) throw Error("103: Insufficient balance! ")

                        let abiInfo = tokenData.ABI[coin]
                        let metaData = abiInfo.metaData

                        let amountNative = parseFloat(amount) * metaData.BASE
                        amountNative = Number(parseInt(String(amountNative)))

                        log.debug({coin:coin,address, amountNative})
                        let transfer_data = await this.pioneerClient.instance.GetTransferData({coin,address,amount:amountNative})
                        transfer_data = transfer_data.data
                        log.debug(tag,"transfer_data: ",transfer_data)

                        txParams = {
                            nonce: nonce,
                            to: metaData.contractAddress,
                            gasPrice: gas_price,
                            data: transfer_data,
                            gasLimit : gas_limit

                        }
                        log.debug(tag,"txParams: ",txParams)
                    }

                    //send FROM master
                    let masterPathEth  = "m/44'/60'/0'/0/0" //TODO moveme to support

                    log.debug(tag,"txParams: ",txParams)

                    let chainId = 1
                    if(this.isTestnet){
                        chainId = 3 //ropsten
                    }

                    let ethTx = {
                        addressNList: support.bip32ToAddressNList(masterPathEth),
                        nonce: numberToHex(txParams.nonce),
                        gasPrice: numberToHex(txParams.gasPrice),
                        gasLimit: numberToHex(txParams.gasLimit),
                        value: numberToHex(txParams.value || 0),
                        to: txParams.to,
                        data:txParams.data,
                        chainId
                    }

                    let unsignedTx = {
                        coin,
                        transaction,
                        HDwalletPayload:ethTx,
                        verbal:"Ethereum transaction"
                    }

                    rawTx = unsignedTx

                    // log.debug("unsignedTxETH: ",ethTx)
                    // rawTx = await this.WALLET.ethSignTx(ethTx)
                    // //debug https://flightwallet.github.io/decode-eth-tx/
                    //
                    // //txid
                    // //const txHash = await web3.utils.sha3(signed.rawTransaction);
                    // if(!rawTx.serialized) throw Error("Failed to sign!")
                    //
                    // const txid = keccak256(rawTx.serialized).toString('hex')
                    // log.debug(tag,"txid: ",txid)
                    //
                    // rawTx.txid = txid
                    // rawTx.params = txParams
                } else if(coin === 'RUNE'){
                    //get amount native
                    let amountNative = RUNE_BASE * parseFloat(amount)
                    amountNative = parseInt(amountNative.toString())

                    //get account number
                    log.debug(tag,"addressFrom: ",addressFrom)
                    let masterInfo = await this.pioneerClient.instance.GetAccountInfo({coin:'RUNE',address:addressFrom})
                    masterInfo = masterInfo.data
                    log.debug(tag,"masterInfo: ",masterInfo.data)

                    let sequence = masterInfo.result.value.sequence || 0
                    let account_number = masterInfo.result.value.account_number
                    sequence = parseInt(sequence)
                    sequence = sequence.toString()

                    let txType = "thorchain/MsgSend"
                    let gas = "250000"
                    let fee = "2000000"
                    let memo = transaction.memo || ""

                    //sign tx
                    let unsigned = {
                        "fee": {
                            "amount": [
                                {
                                    "amount": fee,
                                    "denom": "rune"
                                }
                            ],
                            "gas": gas
                        },
                        "memo": memo,
                        "msg": [
                            {
                                "type": txType,
                                "value": {
                                    "amount": [
                                        {
                                            "amount": amountNative.toString(),
                                            "denom": "rune"
                                        }
                                    ],
                                    "from_address": addressFrom,
                                    "to_address": address
                                }
                            }
                        ],
                        "signatures": null
                    }

                    let	chain_id = RUNE_CHAIN

                    if(!sequence) throw Error("112: Failed to get sequence")
                    if(!account_number) account_number = 0

                    //verify from address
                    let fromAddress = await this.WALLET.thorchainGetAddress({
                        addressNList: bip32ToAddressNList(HD_RUNE_KEYPATH),
                        showDisplay: false,
                    });
                    log.debug(tag,"fromAddressHDwallet: ",fromAddress)
                    log.debug(tag,"fromAddress: ",addressFrom)

                    log.debug("res: ",prettyjson.render({
                        addressNList: bip32ToAddressNList(HD_RUNE_KEYPATH),
                        chain_id,
                        account_number: account_number,
                        sequence:sequence,
                        tx: unsigned,
                    }))

                    if(fromAddress !== addressFrom) {
                        log.error(tag,"fromAddress: ",fromAddress)
                        log.error(tag,"addressFrom: ",addressFrom)
                        throw Error("Can not sign, address mismatch")
                    }

                    log.debug(tag,"******* signTx: ",JSON.stringify({
                        addressNList: bip32ToAddressNList(HD_RUNE_KEYPATH),
                        chain_id,
                        account_number: account_number,
                        sequence:sequence,
                        tx: unsigned,
                    }))

                    let runeTx = {
                            addressNList: bip32ToAddressNList(HD_RUNE_KEYPATH),
                            chain_id,
                            account_number: account_number,
                            sequence:sequence,
                            tx: unsigned,
                    }

                    //
                    let unsignedTx = {
                        coin,
                        transaction,
                        HDwalletPayload:runeTx,
                        verbal:"Thorchain transaction"
                    }

                    rawTx = unsignedTx

                    // let res = await this.WALLET.thorchainSignTx({
                    //     addressNList: bip32ToAddressNList(HD_RUNE_KEYPATH),
                    //     chain_id,
                    //     account_number: account_number,
                    //     sequence:sequence,
                    //     tx: unsigned,
                    // });
                    //
                    // log.debug("res: ",prettyjson.render(res))
                    // log.debug("res*****: ",res)
                    //
                    // let txFinal:any
                    // txFinal = res
                    // txFinal.signatures = res.signatures
                    //
                    // log.debug("FINAL: ****** ",txFinal)
                    //
                    // let broadcastString = {
                    //     tx:txFinal,
                    //     type:"cosmos-sdk/StdTx",
                    //     mode:"sync"
                    // }
                    //
                    // // @ts-ignore
                    // const buffer = Buffer.from(JSON.stringify(txFinal), 'base64');
                    // let hash = sha256(buffer).toString().toUpperCase()
                    // // let hash = crypto.createHash('sha256').update(buffer).digest('hex').toUpperCase()
                    //
                    //
                    // rawTx = {
                    //     txid:hash,
                    //     coin,
                    //     serialized:JSON.stringify(broadcastString)
                    // }
                }else if(coin === 'ATOM'){
                    //get amount native
                    let amountNative = ATOM_BASE * parseFloat(amount)
                    amountNative = parseInt(amountNative.toString())

                    //get account number
                    log.debug(tag,"addressFrom: ",addressFrom)
                    let masterInfo = await this.pioneerClient.instance.GetAccountInfo({coin:'ATOM',address:addressFrom})
                    masterInfo = masterInfo.data
                    log.debug(tag,"masterInfo: ",masterInfo.data)

                    let sequence = masterInfo.result.value.sequence
                    let account_number = masterInfo.result.value.account_number
                    sequence = parseInt(sequence)
                    sequence = sequence.toString()

                    let txType = "cosmos-sdk/MsgSend"
                    let gas = "100000"
                    let fee = "1000"
                    let memo = transaction.memo || ""

                    //sign tx
                    let unsigned = {
                        "fee": {
                            "amount": [
                                {
                                    "amount": fee,
                                    "denom": "uatom"
                                }
                            ],
                            "gas": gas
                        },
                        "memo": memo,
                        "msg": [
                            {
                                "type": txType,
                                "value": {
                                    "amount": [
                                        {
                                            "amount": amountNative.toString(),
                                            "denom": "uatom"
                                        }
                                    ],
                                    "from_address": "thor1jhv0vuygfazfvfu5ws6m80puw0f80kk660s9qj",
                                    "to_address": address
                                }
                            }
                        ],
                        "signatures": null
                    }

                    let	chain_id = ATOM_CHAIN

                    if(!sequence) throw Error("112: Failed to get sequence")
                    if(!account_number) throw Error("113: Failed to get account_number")

                    //verify from address
                    let fromAddress = await this.WALLET.cosmosGetAddress({
                        addressNList: bip32ToAddressNList(HD_ATOM_KEYPATH),
                        showDisplay: false,
                    });
                    log.debug(tag,"fromAddressHDwallet: ",fromAddress)
                    log.debug(tag,"fromAddress: ",addressFrom)

                    log.debug("res: ",prettyjson.render({
                        addressNList: bip32ToAddressNList(HD_ATOM_KEYPATH),
                        chain_id,
                        account_number: account_number,
                        sequence:sequence,
                        tx: unsigned,
                    }))

                    //if(fromAddress !== addressFrom) throw Error("Can not sign, address mismatch")
                    let atomTx = {
                        addressNList: bip32ToAddressNList(HD_ATOM_KEYPATH),
                        chain_id,
                        account_number: account_number,
                        sequence:sequence,
                        tx: unsigned,
                    }

                    let unsignedTx = {
                        coin,
                        transaction,
                        HDwalletPayload:atomTx,
                        verbal:"Thorchain transaction"
                    }

                    rawTx = unsignedTx

                    // let res = await this.WALLET.cosmosSignTx({
                    //     addressNList: bip32ToAddressNList(HD_ATOM_KEYPATH),
                    //     chain_id,
                    //     account_number: account_number,
                    //     sequence:sequence,
                    //     tx: unsigned,
                    // });
                    //
                    // log.debug("res: ",prettyjson.render(res))
                    // log.debug("res*****: ",res)
                    //
                    // let txFinal:any
                    // txFinal = res
                    // txFinal.signatures = res.signatures
                    //
                    // log.debug("FINAL: ****** ",txFinal)
                    //
                    // let broadcastString = {
                    //     tx:txFinal,
                    //     type:"cosmos-sdk/StdTx",
                    //     mode:"sync"
                    // }
                    // rawTx = {
                    //     txid:"",
                    //     coin,
                    //     serialized:JSON.stringify(broadcastString)
                    // }
                }else if(coin === "BNB"){
                    //TODO move to tx builder module
                    //get account info
                    log.debug("addressFrom: ",addressFrom)
                    let accountInfo = await this.pioneerClient.instance.GetAccountInfo({coin,address:addressFrom})
                    accountInfo = accountInfo.data
                    log.debug("accountInfo: ",prettyjson.render(accountInfo))
                    let sequence
                    let account_number
                    let pubkey
                    if(!accountInfo.result){
                        //assume new account
                        sequence = "0"
                        account_number = "0"
                        pubkey = null
                    } else {
                        sequence = transaction.nonce || accountInfo.result.sequence
                        account_number = accountInfo.result.account_number
                        pubkey = accountInfo.result.public_key
                    }

                    if(!address) throw Error("Missing TO address! ")
                    //simple transfer
                    //build tx
                    //TODO type from this from hdwallet
                    let bnbTx = {
                        "account_number": account_number,
                        "chain_id": "Binance-Chain-Nile",
                        "data": null,
                        "memo": transaction.memo,
                        "msgs": [
                            {
                                "inputs": [
                                    {
                                        "address": addressFrom,
                                        "coins": [
                                            {
                                                "amount": amount,
                                                "denom": "BNB"
                                            }
                                        ]
                                    }
                                ],
                                "outputs": [
                                    {
                                        "address": address,
                                        "coins": [
                                            {
                                                "amount": amount,
                                                "denom": "BNB"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        "sequence": sequence,
                        "source": "1"
                    }

                    log.debug(tag,"bnbTx: ",prettyjson.render(bnbTx))
                    // log.debug(tag,"bnbTx: ",JSON.stringify(bnbTx))
                    //bip32ToAddressNList(`m/44'/714'/0'/0/0`)

                    let binanceTx = {
                        addressNList: bip32ToAddressNList(`m/44'/714'/0'/0/0`),
                        chain_id: "Binance-Chain-Nile",
                        account_number: account_number,
                        sequence: sequence,
                        tx: bnbTx,
                     }

                    let unsignedTx = {
                        coin,
                        transaction,
                        HDwalletPayload:binanceTx,
                        verbal:"Thorchain transaction"
                    }

                    rawTx = unsignedTx

                    //TODO verify addressFrom path
                    // const signedTxResponse = await this.WALLET.binanceSignTx({
                    //     addressNList: bip32ToAddressNList(`m/44'/714'/0'/0/0`),
                    //     chain_id: "Binance-Chain-Nile",
                    //     account_number: account_number,
                    //     sequence: sequence,
                    //     tx: bnbTx,
                    // })
                    // log.debug(tag,"**** signedTxResponse: ",signedTxResponse)
                    // log.debug(tag,"**** signedTxResponse: ",JSON.stringify(signedTxResponse))
                    //
                    // // this is undefined at first tx
                    // // let pubkeyHex = pubkey.toString('hex')
                    // // log.debug(tag,"pubkeyHex: ",pubkeyHex)
                    //
                    // let pubkeySigHex = signedTxResponse.signatures.pub_key.toString('hex')
                    // log.debug(tag,"pubkeySigHex: ",pubkeySigHex)
                    //
                    // const buffer = Buffer.from(signedTxResponse.serialized, 'base64');
                    // let hash = cryptoTools.createHash('sha256').update(buffer).digest('hex').toUpperCase()
                    //
                    // rawTx = {
                    //     txid:hash,
                    //     serialized:signedTxResponse.serialized
                    // }
                }else if(coin === "EOS"){
                    throw Error ("666: EOS not supported yet!")
                    // amount = getEosAmount(amount)
                    // //EOS transfer
                    // let unsigned_main = {
                    //     expiration: "2020-04-30T22:00:00.000",
                    //     ref_block_num: 54661,
                    //     ref_block_prefix: 2118672142,
                    //     max_net_usage_words: 0,
                    //     max_cpu_usage_ms: 0,
                    //     delay_sec: 0,
                    //     context_free_actions: [],
                    //     actions: [
                    //         {
                    //             account: "eosio.token",
                    //             name: "transfer",
                    //             authorization: [
                    //                 {
                    //                     actor: addressFrom,
                    //                     permission: "active",
                    //                 },
                    //             ],
                    //             data: {
                    //                 from: addressFrom,
                    //                 to: address,
                    //                 quantity: amount+" EOS",
                    //                 memo: memo,
                    //             },
                    //         },
                    //     ],
                    // };
                    //
                    // log.debug(tag,"unsigned_main: ",JSON.stringify(unsigned_main))
                    //
                    // let chainid_main =
                    //     "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906";
                    // let res = await this.WALLET.eosSignTx({
                    //     addressNList:[ 0x80000000 + 44, 0x80000000 + 194, 0x80000000 + 0 , 0, 0 ],
                    //     chain_id: chainid_main,
                    //     tx: unsigned_main,
                    // });
                    //
                    // log.debug(tag,"**** res: ",res)
                    //
                    // // let broadcastForm = {
                    // //     serializedTransaction:Uint8Array.from(Buffer.from(res.serialized, 'hex')),
                    // //     signatures: [res.eosFormSig]
                    // // }
                    //
                    // let broadcastForm = {
                    //     serializedTransaction:res.serialized,
                    //     signatures: res.eosFormSig
                    // }
                    //
                    // // output.serializedTransaction =  Uint8Array.from(Buffer.from(res.serialized, 'hex'));
                    // // output.signatures = [res.eosFormSig]
                    // // log.debug(tag,"res: ",res)
                    // rawTx = {
                    //     txid:"",
                    //     serialized:res.serialized,
                    //     broadcastBody:broadcastForm
                    // }
                    // log.debug(tag,"rawTx: ",rawTx)
                }else if(coin === "FIO"){
                    throw Error ("666: FIO not supported yet!")
                    // //if name
                    // if(address.indexOf("@") >= 0){
                    //     address = await network.getFioPubkeyFromUsername(address)
                    // }
                    //
                    // //
                    // log.debug(tag,"address: ",address)
                    //
                    // let amountNative = parseFloat(amount) * 100000000
                    // amountNative = parseInt(String(amountNative))
                    // //
                    // log.debug(tag,"fiotx: ",transaction)
                    // const data: FioActionParameters.FioTransferTokensPubKeyActionData = {
                    //     payee_public_key: address,
                    //     amount: String(amountNative),
                    //     max_fee: 2000000000,
                    //     tpid: "",
                    // };
                    //
                    // const res = await WALLET.fioSignTx({
                    //     addressNList: bip32ToAddressNList("m/44'/235'/0'/0/0"),
                    //     actions: [
                    //         {
                    //             account: FioActionParameters.FioTransferTokensPubKeyActionAccount,
                    //             name: FioActionParameters.FioTransferTokensPubKeyActionName,
                    //             data,
                    //         },
                    //     ],
                    // });
                    // log.debug(tag,"res: ",res)
                    //
                    // rawTx = res
                }else  {
                    throw Error("109: coin not yet implemented! coin: "+coin)
                }



                return rawTx
            } catch (e) {
                log.error(tag, "e: ", e)
                throw e
            }
        }
        this.broadcastTransaction = async function (coin:string, signedTx:BroadcastBody) {
            let tag = TAG + " | broadcastTransaction | "
            if(this.isTestnet && coin === 'BTC'){
                signedTx.coin = "TEST"
            }else{
                signedTx.coin = coin
            }
            log.debug(tag,"signedTx: ",signedTx)
            let resultBroadcast = await this.pioneerClient.instance.Broadcast(null,signedTx)
            log.debug(tag,"resultBroadcast: ",resultBroadcast.data)
            return resultBroadcast.data;
        }
    }
}

