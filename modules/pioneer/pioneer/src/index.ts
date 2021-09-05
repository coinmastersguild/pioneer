/*

    Pioneer Wallet v2

    Class based wallet development

 */

const TAG = " | pioneer | "
const log = require("@pioneer-platform/loggerdog")()
const cryptoTools = require('crypto');
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
const ethCrypto = require("@pioneer-platform/eth-crypto")
const coincap = require("@pioneer-platform/coincap")
const {
    getPaths,
    nativeToBaseAmount,
    baseAmountToNative,
    UTXO_COINS,
    COIN_MAP_KEEPKEY_LONG,
    COIN_MAP_LONG,
    getNativeAssetForBlockchain,
    addressNListToBIP32,
    bip32ToAddressNList
} = require('@pioneer-platform/pioneer-coins')

//support
import { ethers } from 'ethers'
import * as support from './support'
import { numberToHex } from 'web3-utils'
import { FioActionParameters } from "fiosdk-offline";
import {
    UnsignedTransaction,
    Transaction,
    SendToAddress,
    Config,
    BroadcastBody,
    Approval,
    Invocation,
    Balance,
    Deposit,
    HDWALLETS
} from "@pioneer-platform/pioneer-types";
//Pioneer follows OpenAPI spec
let network = require("@pioneer-platform/pioneer-client")

//Highlander fork
const hdwallet = require("@bithighlander/hdwallet-core")
const pioneer = require("@bithighlander/hdwallet-native")
// SS public TODO catch up public repo
// const hdwallet = require("@shapeshiftoss/hdwallet-core")
// const pioneer = require("@shapeshiftoss/hdwallet-native")

//global
const keyring = new hdwallet.Keyring()

const HD_RUNE_KEYPATH="m/44'/931'/0'/0/0"
const RUNE_CHAIN="thorchain"
const RUNE_BASE=100000000
const HD_ATOM_KEYPATH="m/44'/118'/0'/0/0"
const ATOM_CHAIN="cosmoshub-4"
const ATOM_BASE=1000000
let GIG =  1000000000
const OSMO_CHAIN="osmosis-1"

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
    private paths: (format?: string) => any;
    private forget: () => any;
    private getBalance: (coin: string, address?:string) => any;
    private getBalanceRemote: (coin: string, address?:string) => Promise<any>;
    private getFioPubkey: () => Promise<any>;
    private getFioAccountsByPubkey: (pubkey: string) => Promise<void>;
    private getPaymentRequests: (pubkey: string) => Promise<void>;
    private fioEncryptRequestContent: (content: any) => Promise<void>;
    private fioDecryptRequestContent: (content: any) => Promise<void>;
    private getFioAccountInfo: (username: string) => Promise<void>;
    private getMaster: (coin: string) => Promise<any>;
    private getMasterOfSeed: (seed: string) => Promise<any>;
    private getAddress: (coin: string, account: number, index: number, isChange: boolean) => Promise<any>;
    private buildTx: (transaction: any) => Promise<any>;
    private bip32ToAddressNList: (path: string) => number[];
    private sendToAddress: (intent: SendToAddress) => Promise<any>;
    private buildTransfer: (transaction: Transaction) => Promise<any>;
    private broadcastTransaction: (coin: string, signedTx: BroadcastBody) => Promise<any>;
    private masters: any;
    private mode: string;
    private queryKey: string | undefined;
    private username: string;
    private type: HDWALLETS;
    private offline: boolean;
    private isTestnet: boolean | null;
    private init: (type: string, config: Config) => Promise<any>;
    private mnemonic: string | undefined;
    private auth: string | undefined;
    private spec: string;
    private pioneerApi: boolean | undefined;
    private WALLET: any;
    private pubkeys: any;
    private getInfo: (context: string) => any;
    private pioneer: any;
    private pioneerClient: any;
    private WALLET_BALANCES: any;
    private setMnemonic: () => string | undefined;
    private buildSwap: (transaction: any) => Promise<string>;
    private blockchains: any;
    private addLiquidity: (addLiquidity: any) => Promise<any>;
    private buildApproval: (swap: any) => Promise<any>;
    private sendApproval: (intent: Approval) => Promise<any>;
    private signTransaction: (transaction: UnsignedTransaction) => Promise<any>;
    private getApproveQueue: () => any;
    private getPendingQueue: () => any;
    private getNextReview: () => any;
    private addUnsigned: (unsigned: any) => any;
    private addBroadcasted: (signed: any) => any;
    private APPROVE_QUEUE: any[];
    private PENDING_QUEUE: any[];
    private context: string
    private deposit: (swap: any) => Promise<any>;
    constructor(type:HDWALLETS,config:Config,isTestnet?:boolean) {
        //if(config.isTestnet) isTestnet = true
        this.APPROVE_QUEUE = []
        this.PENDING_QUEUE = []
        this.isTestnet = false
        if(config.pioneerApi){
            this.offline = false
        }else{
            this.offline = true
        }
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
        this.bip32ToAddressNList = function (path:string) {
            return bip32ToAddressNList(path);
        }
        this.setMnemonic = function () {
            return this.mnemonic;
        }
        this.init = async function (wallet?:any) {
            let tag = TAG + " | init_wallet | "
            try{
                if(!this.blockchains && !wallet.blockchains) throw Error("102: Must Specify blockchain support! ")
                log.debug(tag,"checkpoint")
                let paths = getPaths(this.blockchains)
                switch (+HDWALLETS[this.type]) {
                    case HDWALLETS.pioneer:
                        if(!config.mnemonic) throw Error("103: mnemonic required!")
                        if(!config.username) throw Error("104: username required!")
                        if(!this.context && config.mnemonic){
                            //calculate
                            let walletEth = await ethCrypto.generateWalletFromSeed(config.mnemonic)
                            log.debug(tag,"walletEth:",walletEth)
                            log.debug(tag,"walletEth:",walletEth.masterAddress)
                            log.debug(tag,"walletEth:",walletEth.masterAddress+".wallet.json")
                            this.context = walletEth.masterAddress+".wallet.json"
                        }
                        if(!this.context) throw Error("102: unable to determine correct context!")
                        log.debug(tag,"context: ",this.context)
                        const pioneerAdapter = pioneer.NativeAdapter.useKeyring(keyring)
                        log.debug(tag,"checkpoint"," pioneer wallet detected! ")
                        if(!config.mnemonic && !wallet && !config.context) throw Error("102: mnemonic or wallet file or context required! ")
                        if(config.mnemonic && config.wallet) throw Error("103: wallet collision! invalid config! ")

                        log.debug(tag,"isTestnet: ",this.isTestnet)
                        //pair
                        this.WALLET = await pioneerAdapter.pairDevice(config.username)
                        if(!this.WALLET) throw Error("Failed to init wallet!")
                        await this.WALLET.loadDevice({ mnemonic: config.mnemonic })

                        //verify testnet
                        const isTestnet = false
                        log.debug(tag,"hdwallet isTestnet: ",isTestnet)
                        log.debug(tag,"paths: ",paths.length)
                        log.debug(tag,"blockchains: ",this.blockchains)
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
                        log.debug(tag,"Checkpoint valid paths ** ")
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
                        log.debug(tag,"Checkpoint valid pubkeys ** ")
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
                            this.PUBLIC_WALLET[pubkey.symbol] = pubkey
                            if(!this.masters) this.masters = {}
                            this.masters[pubkey.symbol] = pubkey.master
                        }
                        break;
                    case HDWALLETS.keepkey:
                        log.debug(tag," Keepkey mode! ")
                        log.debug(tag,"**** wallet: ",wallet)
                        if(!config.wallet) throw Error("102: Config is missing watch wallet!")
                        if(!config.wallet.WALLET_PUBLIC) throw Error("103: Config watch wallet missing WALLET_PUBLIC!")
                        if(!config.wallet.pubkeys) throw Error("104: Config watch wallet missing pubkeys!")
                        if(!wallet.features.deviceId) throw Error("105: invalid wallet! missing wallet.features.deviceId")
                        this.context = wallet.features.deviceId + ".wallet.json"
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

                    //get user status
                    let userInfo = await this.pioneerClient.instance.User()
                    userInfo = userInfo.data
                    log.debug(tag,"userInfo: ",userInfo)

                    if(!userInfo || !userInfo.success){
                        log.debug(tag,"registering new user! ")
                        //API
                        let register = {
                            username:this.username,
                            blockchains:this.blockchains,
                            context:this.context,
                            walletDescription:{
                                context:this.context,
                                type:this.type
                            },
                            data:{
                                pubkeys:this.pubkeys
                            },
                            queryKey:this.queryKey,
                            auth:this.auth,
                            provider:'bitcoin'
                        }
                        log.debug("registerBody: ",register)
                        log.debug("this.pioneerClient: ",this.pioneerClient)
                        if(!register.context) throw Error("102: missing context Can not register!")
                        let regsiterResponse = await this.pioneerClient.instance.Register(null,register)
                        if(regsiterResponse.code === 104){
                            //request change of queryKey
                        }
                        log.debug("registerResponse: ",regsiterResponse)

                        //if register success

                        //emitter.info = walletInfo
                    }else{
                        //user found! syncronize
                        if(!userInfo.blockchains) throw Error("104: invalid user!")
                        log.debug(tag,"userInfo: ",userInfo)
                        log.debug(tag,"userInfo: ",userInfo.blockchains)
                        log.debug(tag,"userInfo: ",userInfo.blockchains.length)

                        log.debug(tag,"blockchains: ",this.blockchains)
                        log.debug(tag,"blockchains: ",this.blockchains.length)

                        //count blockchains

                        //count pubkeys

                        //if missing register key

                        //if incomplete

                        //register missing pubkeys

                        if(userInfo.blockchains.length !== this.blockchains.length){
                            log.error(tag,"Pubkeys OUT OF SYNC!")
                            log.error(tag,"blockchains remote: ",userInfo.blockchains)
                            log.error(tag,"blockchains configured: ",this.blockchains)
                            //TODO register pubkey 1 by 1 with async on
                            //if failure give reason
                        }
                    }

                    //if success get info

                    //else return failed to init

                    let output:any = {}

                    log.debug(tag,"getting info on context: ",this.context)
                    let walletInfo = await this.getInfo(this.context)
                    log.debug(tag,"walletInfo: ",walletInfo)

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

                    return walletInfo
                } else {
                    log.info(tag,"Offline mode!")
                    //log.info(tag,"this: ",this)
                    return {
                        isTestnet:this.isTestnet,
                        context:this.context,
                        username:this.username,
                        blockchains:this.blockchains,
                        wallet:this.PUBLIC_WALLET,
                        paths:this.paths
                    }
                }
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        this.paths = function (format?:string) {
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
        this.forget = async function () {
            let resp = await this.pioneerClient.instance.Forget()
            return resp.data;
        }
        this.getInfo = async function (context) {
            let tag = TAG + " | getInfo | "
            try {
                let walletInfo:any = {}
                if(!this.offline){
                    //query api
                    walletInfo = await this.pioneerClient.instance.Info(context)
                    log.debug(tag,"walletInfo: ",walletInfo)
                    walletInfo = walletInfo.data
                    walletInfo.pioneerApi = true
                } else {
                    walletInfo.pioneerApi = false
                    walletInfo.pubkeys = this.pubkeys
                    walletInfo.wallet = this.PUBLIC_WALLET
                    walletInfo.paths = this.paths
                    walletInfo.masters = this.masters
                }
                return walletInfo
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

                //TODO
            } catch (e) {
                log.error(tag, "e: ", e)
                throw e
            }
        }
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
        this.getMaster = async function (network:string) {
            let tag = TAG + " | get_address_master | "
            try {
                if(!network) throw Error("101: must pass network!")
                if(this.PUBLIC_WALLET[network]){
                    let output = this.PUBLIC_WALLET[network].address

                    //verify
                    let address
                    let paths = this.paths()
                    let pathInfo = paths.filter((e:any) => e.network === network)
                    log.debug(tag,"pathInfo: ",pathInfo)
                    if(!pathInfo[0]) throw Error("103: unable to get path info! ")
                    let masterPath = addressNListToBIP32(pathInfo[0].addressNListMaster)

                    switch(network) {
                        case 'BCH':
                            address = await this.WALLET.btcGetAddress({
                                addressNList: bip32ToAddressNList(masterPath),
                                coin: "BitcoinCash",
                                //script types
                                //p2pkh/cashaddr
                                scriptType:'p2pkh',
                                showDisplay: false,
                            });
                            address = bchaddr.toCashAddress(address)
                            //convert
                            break;
                        case 'LTC':
                            address = await this.WALLET.btcGetAddress({
                                addressNList: bip32ToAddressNList(masterPath),
                                coin: "Litecoin",
                                //script types
                                //p2wpkh/p2pkh/cashaddr
                                scriptType:'p2pkh', //bech32
                                showDisplay: false,
                            });
                            break;
                        case 'DOGE':
                            address = await this.WALLET.btcGetAddress({
                                addressNList: bip32ToAddressNList(masterPath),
                                coin: "Dogecoin",
                                //script types
                                //p2wpkh/p2pkh/cashaddr
                                scriptType:'p2pkh', //bech32
                                showDisplay: false,
                            });
                            break;
                        case 'BTC':
                            address = await this.WALLET.btcGetAddress({
                                addressNList: bip32ToAddressNList(masterPath),
                                coin: "Bitcoin",
                                //script types
                                //p2wpkh/p2pkh/cashaddr
                                scriptType:'p2wpkh', //bech32
                                showDisplay: false,
                            });
                            break;
                        case 'ETH':
                            address = await this.WALLET.ethGetAddress({
                                addressNList: bip32ToAddressNList(masterPath),
                                showDisplay: false,
                            });
                            break;
                        case 'RUNE':
                            address = await this.WALLET.thorchainGetAddress({
                                addressNList: bip32ToAddressNList(masterPath),
                                showDisplay: false,
                            });
                            break;
                        case 'OSMO':
                            address = await this.WALLET.osmosisGetAddress({
                                addressNList: bip32ToAddressNList(masterPath),
                                showDisplay: false,
                            });
                            break;
                        case 'ATOM':
                            address = await this.WALLET.cosmosGetAddress({
                                addressNList: bip32ToAddressNList(masterPath),
                                showDisplay: false,
                            });
                            break;
                        case 'BNB':
                            address = await this.WALLET.binanceGetAddress({
                                addressNList: bip32ToAddressNList(masterPath),
                                showDisplay: false,
                            });
                            break;
                        default:
                            throw Error("coin not yet implemented ! ")
                        // code block
                    }
                    log.info(tag,"address (HDwallet): ",address)
                    log.info(tag,"address (private): ",output)
                    if(address !== output) {
                        throw Error("unable to verify address in HDwallet!")
                    }
                    return output
                }else{
                    log.error(tag,"PUBLIC_WALLET: ",this.PUBLIC_WALLET)
                    log.error(tag,"network: ",network)
                    throw Error("master Not Found!")
                }

            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.getAddress = function (coin:string,account:number, index:number, isChange:boolean) {
            let tag = TAG + " | get_address | "
            try {
                let output
                //TODO do this with coin.js?
                //from xpub?

                //if token use ETH pubkey
                //TODO
                // if(tokenData.tokens.indexOf(coin) >=0 && coin !== 'EOS'){
                //     coin = 'ETH'
                // }


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
                        case 'OSMO':
                            // code block
                            output = createBech32Address(publicKey,'osmosis')
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
                        asset:"BTC",
                        network:"BTC",
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

                return ethTx
            }catch(e){
                log.error(e)
                throw e
            }
        },
        this.deposit = async function (deposit:Deposit) {
                let tag = TAG + " | deposit | "
                try{
                    let rawTx
                    log.debug(tag,"deposit: ",deposit)

                    if(deposit.network === 'RUNE') {
                        //use msgDeposit
                        //get amount native
                        let amountNative = RUNE_BASE * parseFloat(deposit.amount)
                        amountNative = parseInt(amountNative.toString())

                        let addressFrom
                        if(deposit.addressFrom){
                            addressFrom = deposit.addressFrom
                        } else {
                            addressFrom = await this.getMaster('RUNE')
                        }

                        //get account number
                        log.debug(tag,"addressFrom: ",addressFrom)
                        let masterInfo = await this.pioneerClient.instance.GetAccountInfo({network:'RUNE',address:addressFrom})
                        masterInfo = masterInfo.data
                        log.debug(tag,"masterInfo: ",masterInfo.data)

                        let sequence = masterInfo.result.value.sequence || 0
                        let account_number = masterInfo.result.value.account_number
                        sequence = parseInt(sequence)
                        sequence = sequence.toString()

                        let txType = "thorchain/MsgDeposit"
                        let gas = "250000"
                        let fee = "2000000"
                        if(!deposit.memo) throw Error("103: invalid swap! missing memo")
                        let memo = deposit.memo

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
                                                "amount": "50994000",
                                                "asset": "THOR.RUNE"
                                            }
                                        ],
                                        "memo": memo,
                                        "signer": addressFrom
                                    }
                                }
                            ],
                            "signatures": null
                        }

                        let	chain_id = RUNE_CHAIN

                        if(!sequence) throw Error("112: Failed to get sequence")
                        if(!account_number) account_number = 0

                        //TODO double check? this broke?
                        // //verify from address
                        // let fromAddress = await this.WALLET.thorchainGetAddress({
                        //     addressNList: bip32ToAddressNList(HD_RUNE_KEYPATH),
                        //     showDisplay: false,
                        // });
                        // log.debug(tag,"fromAddressHDwallet: ",fromAddress)
                        // log.debug(tag,"fromAddress: ",addressFrom)
                        let fromAddress = addressFrom

                        log.debug("res: ",prettyjson.render({
                            addressNList: bip32ToAddressNList(HD_RUNE_KEYPATH),
                            chain_id,
                            account_number: account_number,
                            sequence:sequence,
                            tx: unsigned,
                        }))

                        if(fromAddress !== addressFrom) {
                            log.error(tag,"fromAddress context WALLET: ",fromAddress)
                            log.error(tag,"fromAddress DEPOSIT: ",addressFrom)
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
                        let unsignedTx:UnsignedTransaction = {
                            invocationId:deposit.invocationId,
                            network:deposit.network,
                            deposit,
                            HDwalletPayload:runeTx,
                            verbal:"Thorchain transaction"
                        }

                        rawTx = unsignedTx

                    } else {
                        throw Error("Chain not supported! "+deposit.inboundAddress.chain)
                    }

                    return rawTx
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
                log.debug(tag,"swap: ",swap)

                let UTXOcoins = [
                    'BTC',
                    'BCH',
                    'LTC'
                ]

                //TODO supported tokens
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
                        chainId: 1
                    }
                    log.debug("unsignedTxETH: ",ethTx)
                    rawTx = {
                        network:'ETH',
                        asset:'ETH',
                        swap,
                        HDwalletPayload:ethTx,
                        verbal:"Ethereum transaction"
                    }

                } else if(swap.inboundAddress.chain === 'RUNE') {
                    //use msgDeposit
                    //get amount native
                    let amountNative = RUNE_BASE * parseFloat(swap.amount)
                    amountNative = parseInt(amountNative.toString())

                    let addressFrom
                    if(swap.addressFrom){
                        addressFrom = swap.addressFrom
                    } else {
                        addressFrom = await this.getMaster('ETH')
                    }

                    //get account number
                    log.debug(tag,"addressFrom: ",addressFrom)
                    let masterInfo = await this.pioneerClient.instance.GetAccountInfo({network:'RUNE',address:addressFrom})
                    masterInfo = masterInfo.data
                    log.debug(tag,"masterInfo: ",masterInfo.data)

                    let sequence = masterInfo.result.value.sequence || 0
                    let account_number = masterInfo.result.value.account_number
                    sequence = parseInt(sequence)
                    sequence = sequence.toString()

                    let txType = "thorchain/MsgSend"
                    let gas = "250000"
                    let fee = "2000000"
                    if(!swap.memo) throw Error("103: invalid swap! missing memo")
                    let memo = swap.memo

                    if(!swap.inboundAddress.address) throw Error("104: invalid inboundAddress on swap")
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
                                    "to_address": swap.inboundAddress.address
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
                        network:'ETH',
                        asset:'ETH',
                        swap,
                        HDwalletPayload:runeTx,
                        verbal:"Thorchain transaction"
                    }

                    rawTx = unsignedTx

                }else if(UTXOcoins.indexOf(swap.inboundAddress.chain) >= 0){
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
        /*
                CatchAll for custom Tx's
         */
        this.buildTx = async function (transaction:any) {
            let tag = TAG + " | buildTx | "
            try{
                let rawTx = {}

                //if ibc
                //TODO flag of ibc?
                if(transaction.type === 'ibcdeposit'){

                    //TODO dont assume cosmos dumbass
                    let amountNative = ATOM_BASE * parseFloat(transaction.amount)
                    amountNative = parseInt(amountNative.toString())
                    log.debug(tag,"amountNative: ",amountNative)

                    //get account number
                    let addressFrom
                    if(transaction.addressFrom){
                        addressFrom = transaction.addressFrom
                    } else {
                        addressFrom = await this.getMaster('ATOM')
                    }
                    let masterInfo = await this.pioneerClient.instance.GetAccountInfo({network:'ATOM',address:addressFrom})
                    masterInfo = masterInfo.data
                    log.debug(tag,"masterInfo: ",masterInfo.data)

                    let sequence = masterInfo.result.value.sequence
                    let account_number = masterInfo.result.value.account_number
                    sequence = parseInt(sequence)
                    sequence = sequence.toString()
                    let	chain_id = ATOM_CHAIN

                    let msg:any
                    switch(transaction.type) {
                        case "ibcdeposit":
                            if(!transaction.source_port) throw Error("Missing source_port !")
                            if(!transaction.source_channel) throw Error("Missing source_channel!")
                            if(!transaction.token) throw Error("Missing token!")
                            if(!transaction.timeout_height) throw Error("Missing timeout_height!")

                            msg = {
                                "type":"cosmos-sdk/MsgTransfer",
                                "value":{
                                    "sender":transaction.sender,
                                    "receiver":transaction.receiver,
                                    "source_port":transaction.source_port,
                                    "source_channel":transaction.source_channel,
                                    "token":transaction.token,
                                    "timeout_height":transaction.timeout_height,
                                }
                            }

                            break;
                        default:
                            throw Error("unsupported IBC tx type: "+transaction.type)
                        //code block
                    }
                    let txType = "cosmos-sdk/MsgSend"
                    let gas = "100000"
                    let fee = "1000"
                    let memo = transaction.memo || ""

                    if(!msg) throw Error('failed to make tx msg')

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
                            msg
                        ],
                        "signatures": null
                    }

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
                        chain_id:ATOM_CHAIN,
                        account_number: account_number,
                        sequence:sequence,
                        tx: unsigned,
                    }

                    let unsignedTx = {
                        network:network,
                        asset:network,
                        transaction,
                        HDwalletPayload:atomTx,
                        verbal:"ibc transaction"
                    }

                    rawTx = unsignedTx

                }else if(transaction.network === 'FIO'){

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


                } else if(transaction.network === 'osmosis' || transaction.network === 'OSMO'){
                    log.debug(tag,"transaction: ",transaction)

                    //types
                    let tx:any
                    let signTx:any
                    let res:any

                    //common
                    //get amount native

                    let amountNative = ATOM_BASE * parseFloat(transaction.amount)
                    amountNative = parseInt(amountNative.toString())
                    log.debug(tag,"amountNative: ",amountNative)

                    //get account number
                    let addressFrom
                    if(transaction.addressFrom){
                        addressFrom = transaction.addressFrom
                    } else {
                        addressFrom = await this.getMaster('OSMO')
                    }
                    let masterInfo = await this.pioneerClient.instance.GetAccountInfo({network:'OSMO',address:addressFrom})
                    masterInfo = masterInfo.data
                    log.debug(tag,"masterInfo: ",masterInfo.data)

                    let sequence = masterInfo.result.value.sequence
                    let account_number = masterInfo.result.value.account_number
                    sequence = parseInt(sequence)
                    sequence = sequence.toString()
                    let	chain_id = OSMO_CHAIN

                    let msg:any
                    switch(transaction.type) {
                        case "delegate":
                            if(!transaction.validator) throw Error("Missing validator address!")

                            msg = {
                                "type":"cosmos-sdk/MsgDelegate",
                                "value":{
                                    "delegator_address":addressFrom,
                                    "validator_address":transaction.validator,
                                    "amount":
                                        {
                                            "denom":"uosmo",
                                            "amount":amountNative.toString()
                                        }

                                }
                            }

                            break;
                        case "redelegate":
                            if(!transaction.validatorOld) throw Error("102: Missing validatorOld!")
                            if(!transaction.validator) throw Error("103: Missing validator!")

                            msg = {
                                "type":"cosmos-sdk/MsgBeginRedelegate",
                                "value":{
                                    "delegator_address":addressFrom,
                                    "validator_src_address":transaction.validatorOld,
                                    "validator_dst_address":transaction.validator,
                                    "amount":
                                        {
                                            "denom":"uosmo",
                                            "amount":amountNative.toString()
                                        }
                                }
                            }

                            break;
                        case "osmosislpadd":
                            if(!transaction.poolId) throw Error("102: Missing poolId!")
                            if(!transaction.shareOutAmount) throw Error("103: Missing shareOutAmount!")
                            if(!transaction.tokenInMaxs) throw Error("104: Missing tokenInMaxs!")

                            msg = {
                                "type":"osmosis/gamm/join-pool",
                                "value":{
                                    "sender":addressFrom,
                                    "poolId":transaction.poolId,
                                    "shareOutAmount":transaction.shareOutAmount,
                                    "tokenInMaxs":transaction.tokenInMaxs
                                }
                            }

                            break;
                        case "osmosisswap":
                            if(!transaction.routes) throw Error("102: Missing routes!")
                            if(!transaction.tokenIn) throw Error("103: Missing tokenIn!")
                            if(!transaction.tokenOutMinAmount) throw Error("104: Missing tokenOutMinAmount!")

                            msg = {
                                "type":"osmosis/gamm/swap-exact-amount-in",
                                "value":{
                                    "sender":addressFrom,
                                    "routes":transaction.routes,
                                    "tokenIn":transaction.tokenIn,
                                    "tokenOutMinAmount":transaction.tokenOutMinAmount.toString()
                                }
                            }

                            break;
                       case "ibcWithdrawal":
                            //TODO
                            throw Error("TODO")
                            break;
                        case "ibcWithdrawal":
                            //TODO
                            throw Error("TODO")
                            break;
                        default:
                            throw Error("unsupported osmosis tx type: "+transaction.type)
                            //code block
                    }
                    let txType = "cosmos-sdk/MsgSend"

                    //Osmosis is cheap, > 0 = max everything
                    let gas = "290000"
                    let fee = "2800"

                    if(transaction.priority === 0){
                        gas = "0"
                        fee = "0"
                    }

                    let memo = transaction.memo || ""

                    if(!msg) throw Error('failed to make tx msg')

                    let unsigned = {
                        "fee": {
                            "amount": [
                                {
                                    "amount": fee,
                                    "denom": "uosmo"
                                }
                            ],
                            "gas": gas
                        },
                        "memo": memo,
                        "msg": [
                            msg
                        ],
                        "signatures": null
                    }

                    if(!sequence) throw Error("112: Failed to get sequence")
                    if(!account_number) throw Error("113: Failed to get account_number")

                    //verify from address
                    let fromAddress = await this.WALLET.osmosisGetAddress({
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
                        chain_id:'osmosis-1',
                        account_number: account_number,
                        sequence:sequence,
                        tx: unsigned,
                    }

                    let unsignedTx = {
                        network:network,
                        asset:network,
                        transaction,
                        HDwalletPayload:atomTx,
                        verbal:"osmosis transaction"
                    }

                    rawTx = unsignedTx

                } else {
                    log.error(tag,"network not supported! ",transaction.network)
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
                intent.asset = intent.asset.toUpperCase()
                log.debug(tag,"params: ",intent)
                if(!intent.amount) throw Error("Amount required!")
                if(!intent.address) throw Error("address required!")
                //TODO verify input params

                let addressFrom = await this.getMaster(intent.asset)
                log.debug(tag,"addressFrom: ",addressFrom)

                if(intent.amount === 'all'){
                    //get balance
                    let balance = await this.getBalance(intent.asset)
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
                    network:intent.network,
                    asset:intent.asset,
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
        this.signTransaction = async function (unsignedTx:UnsignedTransaction) {
            let tag = TAG + " | signTransaction | "
            try {
                log.debug(tag,"unsignedTx: ",unsignedTx)
                let signedTx:any = {}
                if(!unsignedTx.network && unsignedTx.transaction) unsignedTx.network = unsignedTx.transaction.network
                let network = unsignedTx.network
                if(!network) throw Error("102: invalid unsinged tx! missing network!")
                //TODO is token?

                if(UTXO_COINS.indexOf(network) >= 0){

                    log.debug(tag,"HDwalletPayload: ",unsignedTx.HDwalletPayload)
                    if(UTXO_COINS.indexOf(unsignedTx.HDwalletPayload.network) >= 0){
                        //opps convert
                        unsignedTx.HDwalletPayload.network = COIN_MAP_KEEPKEY_LONG[unsignedTx.HDwalletPayload.network]
                    }
                    const res = await this.WALLET.btcSignTx(unsignedTx.HDwalletPayload);
                    log.debug(tag,"res: ",res)

                    //
                    signedTx = {
                        txid:res.txid,
                        network,
                        serialized:res.serializedTx
                    }
                }else if(network === 'ETH'){

                    //TODO fix tokens
                    log.debug("unsignedTxETH: ",unsignedTx)
                    signedTx = await this.WALLET.ethSignTx(unsignedTx.HDwalletPayload)
                    //debug https://flightwallet.github.io/decode-eth-tx/

                    //verify from address correct
                    const decoded = ethers.utils.parseTransaction(signedTx.serialized)
                    signedTx.decoded = decoded

                    log.debug(tag,"decoded: ",decoded)
                    log.debug(tag,"decoded.from: ",decoded.from)
                    log.debug(tag,"addressFrom: ",unsignedTx?.transaction?.addressFrom)
                    // let addressFromUnsignedTx
                    // if(unsignedTx?.swap){
                    //     //TODO fixme (add from address to swap payload)
                    //     addressFromUnsignedTx =
                    // }
                    // if(unsignedTx?.transaction?.addressFrom !== decoded.from){
                    //     throw Error("Invalid transaction! from address mismatch!")
                    // }

                    //TODO verify more
                    //verify amounts sane

                    //txid
                    //const txHash = await web3.utils.sha3(signed.rawTransaction);
                    if(!signedTx.serialized) throw Error("Failed to sign!")

                    let txid = keccak256(signedTx.serialized).toString('hex')
                    txid = "0x"+txid
                    log.debug(tag,"txid: ",txid)

                    signedTx.txid = txid
                    signedTx.params = unsignedTx.transaction //input
                } else if(network === 'RUNE'){

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


                    signedTx = {
                        txid:hash,
                        network,
                        serialized:JSON.stringify(broadcastString)
                    }
                }else if(network === 'ATOM'){
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
                    const buffer = Buffer.from(JSON.stringify(broadcastString), 'base64');
                    let txid = cryptoTools.createHash('sha256').update(buffer).digest('hex').toUpperCase()

                    signedTx = {
                        txid,
                        network,
                        serialized:JSON.stringify(broadcastString)
                    }
                }else if(network === 'OSMO'){
                    let res = await this.WALLET.osmosisSignTx(unsignedTx.HDwalletPayload);

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
                    const buffer = Buffer.from(JSON.stringify(broadcastString), 'base64');
                    let txid = cryptoTools.createHash('sha256').update(buffer).digest('hex').toUpperCase()

                    signedTx = {
                        txid,
                        network,
                        serialized:JSON.stringify(broadcastString)
                    }
                } else if(network === 'BNB'){
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
                    throw Error("network not supported! "+network)
                }

                //carry over unsigned params to signed
                if(unsignedTx.transaction && unsignedTx.transaction.noBroadcast) signedTx.noBroadcast = true
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
                log.debug(tag,"transaction: ",transaction)
                let network = transaction.network.toUpperCase()
                let asset = transaction.asset.toUpperCase()
                let address = transaction.address
                if(!address) address = transaction.addressTo
                let amount = transaction.amount
                let fee = transaction.fee

                //get paths
                let paths = this.paths()
                log.debug(tag,"paths: ",paths)
                if(!paths) throw Error("101: unable to get paths!")
                if(!network) throw Error("102: Invalid transaction missing address!")
                if(!address) throw Error("103: Invalid transaction missing address!")
                if(!amount) throw Error("104: Invalid transaction missing amount!")
                if(!fee) throw Error("105: Invalid transaction missing fee!")
                let memo = transaction.memo
                let addressFrom
                if(transaction.addressFrom){
                    addressFrom = transaction.addressFrom
                } else {
                    addressFrom = await this.getMaster(network)
                }
                if(!addressFrom) throw Error("102: unable to get master address! ")
                log.debug(tag,"addressFrom: ",addressFrom)
                transaction.addressFrom = addressFrom
                let rawTx

                if(UTXO_COINS.indexOf(network) >= 0){
                    log.debug(tag,"Build UTXO tx! ",network)

                    //list unspent
                    log.debug(tag,"network: ",network)
                    log.debug(tag,"xpub: ",this.PUBLIC_WALLET[network].xpub)
                    log.debug(tag,"zpub: ",this.PUBLIC_WALLET[network].zpub)
                    log.debug(tag,"pubkey: ",this.PUBLIC_WALLET[network].pubkey)

                    let input = {network,xpub:this.PUBLIC_WALLET[network].pubkey}
                    log.debug(tag,"input: ",input)

                    let unspentInputs = await this.pioneerClient.instance.ListUnspent({network:'BTC',xpub:input})
                    unspentInputs = unspentInputs.data
                    log.debug(tag,"unspentInputs: ",unspentInputs)

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
                    let feeRateInfo = await this.pioneerClient.instance.GetFeeInfo({coin:network})
                    feeRateInfo = feeRateInfo.data
                    log.debug(tag,"feeRateInfo: ",feeRateInfo)
                    let feeRate
                    //TODO dynamic all the things
                    if(network === 'BTC'){
                        feeRate = feeRateInfo
                    }else if(network === 'BCH'){
                        feeRate = 2
                    } else if(network === 'LTC'){
                        feeRate = 4
                    } else {
                        throw Error("Fee's not configured for network:"+network)
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
                    log.debug(tag,"totalInBase: ",nativeToBaseAmount(network,totalInSatoshi))
                    let valueIn = await coincap.getValue(network,nativeToBaseAmount(network,totalInSatoshi))
                    log.debug(tag,"totalInValue: ",valueIn)

                    //amount out
                    log.debug(tag,"amountOutSat: ",amountSat)
                    log.debug(tag,"amountOutBase: ",amount)
                    let valueOut = await coincap.getValue(network,nativeToBaseAmount(network,amountSat))
                    log.debug(tag,"valueOut: ",valueOut)

                    if(valueOut < 1){
                        if(network === 'BCH'){
                            log.debug(tag," God bless you sir's :BCH:")
                        } else {
                            log.debug("ALERT DUST! sending less that 1usd. (hope you know what you are doing)")
                        }
                        //Expensive networks
                        if(["BTC","ETH","RUNE"].indexOf(network) >= 0){
                            throw Error("You dont want to do this! sending < 1usd on expensive network")
                        }
                    }

                    if(nativeToBaseAmount(network,totalInSatoshi) < amount){
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
                            scriptType:"p2sh-p2wpkh",
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
                    //let changeAddress = await this.getMaster(network)
                    let changeAddress = 'bc1qxzsgclsnyerfn2why242em5zd5pjy9yx6qy20n'

                    //if bch convert format
                    if(network === 'BCH'){
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
                    if(network === 'BCH'){
                        longName = 'BitcoinCash'
                    }else if(network === 'LTC'){
                        longName = 'Litecoin'
                        if(isTestnet){
                            longName = 'Testnet'
                        }
                    }else if(network === 'BTC'){
                        longName = 'Bitcoin'
                        if(isTestnet){
                            longName = 'Testnet'
                        }
                    }else {
                        throw Error("UTXO coin: "+network+" Not supported yet! ")
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
                        network,
                        asset:network,
                        transaction,
                        HDwalletPayload:hdwalletTxDescription,
                        verbal:"UTXO transaction"
                    }

                    rawTx = unsignedTx

                }else if(network === 'ETH'){

                    //TODO fix tokens
                    log.debug(tag,"checkpoint")
                    let balanceEth = await this.getBalance('ETH')
                    log.debug(tag,"balanceEth: ",balanceEth)

                    let nonceRemote = await this.pioneerClient.instance.GetNonce(addressFrom)
                    nonceRemote = nonceRemote.data
                    let nonce = transaction.nonce || nonceRemote
                    log.debug(tag,"nonce: ",nonce)

                    let gas_limit = 80000
                    let gas_price

                    //overrides
                    log.debug(tag,"transaction.fee: ",transaction.fee)
                    if(transaction.fee){
                        if(transaction.fee.priority){
                            log.debug(tag,"Selecting fee based on priority")
                            //get gas recomendations
                            gas_price = await this.pioneerClient.instance.GetGasPrice()
                            gas_price = gas_price.data

                            log.debug(tag,"gas_price: ",gas_price)
                            if(transaction.fee.priority === 2){
                                log.debug(tag,"setting priority 2 ")
                                gas_price = gas_price * 0.5
                                gas_price = parseInt(String(gas_price))
                                log.debug(tag,"gas_price: ",gas_price)
                            }
                        } else {
                            log.debug(tag,"Selecting fee based on hard coded value")
                            //TODO other units?
                            if(transaction.fee.value && transaction.fee.units === 'gwei'){
                                log.debug(tag,"setting fee value: ",transaction.fee.value)
                                gas_price = transaction.fee.value * GIG
                            }
                            if(transaction.fee.gasLimit){
                                gas_limit = transaction.fee.gasLimit
                            }
                        }
                    }
                    if(!gas_price) {
                        log.debug(tag,"Getting Fee Level from remote!")
                        gas_price = await this.pioneerClient.instance.GetGasPrice()
                        gas_price = gas_price.data
                    }

                    log.debug(tag,"gas_price: ",gas_price)
                    gas_price = parseInt(String(gas_price))

                    let txParams
                    if(asset === "ETH"){
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
                    } else {
                        throw Error("103: tokens incomplete!")
                        //TODO tokens
                    }
                    if(!txParams) throw Error("tokens not supported")

                    //send FROM master
                    let ethPathInfo = paths.filter((e:any) => e.network === 'ETH')
                    log.debug(tag,"ethPathInfo: ",ethPathInfo)
                    if(!ethPathInfo[0]) throw Error("103: unable to get eth path info! ")
                    let masterPathEth = addressNListToBIP32(ethPathInfo[0].addressNListMaster)
                    log.debug(tag,"masterPathEth: ",masterPathEth)
                    log.debug(tag,"masterPathEth: ","m/44'/60'/0'/0/0")
                    log.debug(tag,"txParams: ",txParams)

                    //verify from address
                    let fromAddressHDwallet = await this.WALLET.ethGetAddress({
                        addressNList: bip32ToAddressNList(masterPathEth),
                        showDisplay: false,
                    });
                    log.debug(tag,"fromAddressHDwallet: ",fromAddressHDwallet)
                    log.debug(tag,"fromAddress: ",addressFrom)

                    if(addressFrom !== fromAddressHDwallet){
                        throw Error("666: Address mismatch! refusing to sign!")
                    }

                    let chainId = 1
                    if(this.isTestnet){
                        chainId = 3 //ropsten
                    }

                    let ethTx = {
                        addressNList: bip32ToAddressNList(masterPathEth),
                        nonce: numberToHex(txParams.nonce),
                        gasPrice: numberToHex(txParams.gasPrice),
                        gasLimit: numberToHex(txParams.gasLimit),
                        value: numberToHex(txParams.value || 0),
                        to: txParams.to,
                        data:txParams.data,
                        chainId
                    }
                    log.debug("TX: ",JSON.stringify(ethTx))

                    let unsignedTx = {
                        network:network,
                        asset:network,
                        transaction,
                        HDwalletPayload:ethTx,
                        verbal:"Ethereum transaction"
                    }

                    rawTx = unsignedTx

                } else if(network === 'RUNE'){
                    //get amount native
                    let amountNative = RUNE_BASE * parseFloat(amount)
                    amountNative = parseInt(amountNative.toString())

                    //get account number
                    log.debug(tag,"addressFrom: ",addressFrom)
                    let masterInfo = await this.pioneerClient.instance.GetAccountInfo({network:'RUNE',address:addressFrom})
                    masterInfo = masterInfo.data
                    log.debug(tag,"masterInfo: ",masterInfo.data)

                    let sequence = masterInfo.result.value.sequence || 0
                    let account_number = masterInfo.result.value.account_number
                    sequence = parseInt(sequence)
                    sequence = sequence.toString()

                    let txType = "thorchain/MsgSend"
                    let gas = "650000"
                    let fee = "0"
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

                    let runeTx = {
                            addressNList: bip32ToAddressNList(HD_RUNE_KEYPATH),
                            chain_id,
                            account_number: account_number,
                            sequence:sequence,
                            tx: unsigned,
                    }

                    //
                    let unsignedTx = {
                        network:network,
                        asset:network,
                        transaction,
                        HDwalletPayload:runeTx,
                        verbal:"Thorchain transaction"
                    }

                    rawTx = unsignedTx

                }else if(network === 'ATOM'){
                    //get amount native
                    let amountNative = ATOM_BASE * parseFloat(amount)
                    amountNative = parseInt(amountNative.toString())

                    //get account number
                    log.debug(tag,"addressFrom: ",addressFrom)
                    let masterInfo = await this.pioneerClient.instance.GetAccountInfo({network:'ATOM',address:addressFrom})
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
                                    "from_address": addressFrom,
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
                        network:network,
                        asset:network,
                        transaction,
                        HDwalletPayload:atomTx,
                        verbal:"Thorchain transaction"
                    }

                    rawTx = unsignedTx

                }else if(network === 'OSMO'){
                    //get amount native
                    let amountNative = ATOM_BASE * parseFloat(amount)
                    amountNative = parseInt(amountNative.toString())

                    //get account number
                    log.debug(tag,"addressFrom: ",addressFrom)
                    let masterInfo = await this.pioneerClient.instance.GetAccountInfo({network:'OSMO',address:addressFrom})
                    masterInfo = masterInfo.data
                    log.debug(tag,"masterInfo: ",masterInfo.data)

                    let sequence = masterInfo.result.value.sequence
                    let account_number = masterInfo.result.value.account_number
                    sequence = parseInt(sequence)
                    sequence = sequence.toString()

                    let txType = "cosmos-sdk/MsgSend"
                    let gas = "80000"
                    let fee = "2800"
                    let memo = transaction.memo || ""

                    //sign tx
                    let unsigned = {
                        "fee": {
                            "amount": [
                                {
                                    "amount": fee,
                                    "denom": "uosmo"
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
                                            "denom": "uosmo"
                                        }
                                    ],
                                    "from_address": addressFrom,
                                    "to_address": address
                                }
                            }
                        ],
                        "signatures": null
                    }

                    let	chain_id = OSMO_CHAIN

                    if(!sequence) throw Error("112: Failed to get sequence")
                    if(!account_number) throw Error("113: Failed to get account_number")

                    //verify from address
                    let fromAddress = await this.WALLET.osmosisGetAddress({
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
                        chain_id:'osmosis-1',
                        account_number: account_number,
                        sequence:sequence,
                        tx: unsigned,
                    }

                    let unsignedTx = {
                        network:network,
                        asset:network,
                        transaction,
                        HDwalletPayload:atomTx,
                        verbal:"osmosis transaction"
                    }

                    rawTx = unsignedTx

                }else if(network === "BNB"){
                    //TODO move to tx builder module
                    //get account info
                    log.debug("addressFrom: ",addressFrom)
                    let accountInfo = await this.pioneerClient.instance.GetAccountInfo({network,address:addressFrom})
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
                        network:network,
                        asset:network,
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
                }else if(network === "EOS"){
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
                }else if(network === "FIO"){
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
                    throw Error("109: network not yet implemented! network: "+network)
                }



                return rawTx
            } catch (e) {
                log.error(tag, "e: ", e)
                throw e
            }
        }
        this.broadcastTransaction = async function (network:string, signedTx:BroadcastBody) {
            let tag = TAG + " | broadcastTransaction | "
            if(this.isTestnet && network === 'BTC'){
                signedTx.network = "TEST"
            }else{
                signedTx.network = network
            }
            log.debug(tag,"signedTx: ",signedTx)
            let resultBroadcast = await this.pioneerClient.instance.Broadcast(null,signedTx)
            log.debug(tag,"resultBroadcast: ",resultBroadcast.data)
            return resultBroadcast.data;
        }
    }
}

