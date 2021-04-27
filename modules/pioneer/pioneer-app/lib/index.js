"use strict";
/*
      🧭U+1F9ED

      Pioneer APP

 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TAG = " | app | ";
const pioneer_config_1 = require("@pioneer-platform/pioneer-config");
const uuid_1 = require("uuid");
const CryptoJS = require("crypto-js");
const bip39 = require(`bip39`);
const fs = require("fs-extra");
const bcrypt = require("bcryptjs");
const mkdirp = require("mkdirp");
const log = require("@pioneer-platform/loggerdog")();
const prettyjson = require('prettyjson');
const queue = require('queue');
const pendingQueue = queue({ pending: [] });
const approvedQueue = queue({ approved: [] });
//dbs
let nedb = require("@pioneer-platform/nedb");
//@pioneer-platform/pioneer-events
let Events = require("@pioneer-platform/pioneer-events");
let { getPaths, get_address_from_xpub, getNativeAssetForBlockchain } = require('@pioneer-platform/pioneer-coins');
// @ts-ignore
const webcrypto_1 = require("@peculiar/webcrypto");
const native = __importStar(require("@bithighlander/hdwallet-native"));
let Pioneer = require('@pioneer-platform/pioneer');
let Network = require("@pioneer-platform/pioneer-client");
//hardware
let Hardware = require("@pioneer-platform/pioneer-hardware");
let wait = require('wait-promise');
let sleep = wait.sleep;
const ONLINE = [];
let AUTH_TOKEN;
let IS_LOGGED_IN = false;
let DATABASES = {};
let WALLET_CONTEXT = "";
let ACCOUNT = '';
let WALLET_PUBLIC = {};
let WALLET_PRIVATE = {};
let WALLET_PUBKEYS = [];
let WALLET_PASSWORD = "";
let APPROVE_QUEUE = [];
let ALL_PENDING = [];
//
let SOCKET_CLIENT;
//
let TOTAL_VALUE_USD_LOADED = 0;
let WALLETS_LOADED = {};
let IS_SEALED = false;
let MASTER_MAP = {};
let WALLET_VALUE_MAP = {};
let CONTEXT_WALLET_SELECTED;
//urlSpec
let URL_PIONEER_SPEC = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json';
let URL_PIONEER_SOCKET = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev';
let urlSpec = URL_PIONEER_SPEC;
let KEEPKEY;
let network;
//chingle
// let opts:any = {}
// var player = require('play-sound')(opts = {})
let AUTONOMOUS = false;
module.exports = {
    init: function (config, isTestnet) {
        return init_wallet(config, isTestnet);
    },
    initConfig: function (language) {
        return pioneer_config_1.innitConfig(language);
    },
    context: function () {
        return __awaiter(this, void 0, void 0, function* () {
            if (!WALLET_CONTEXT) {
                //get from remote
                let output = yield network.instance.User();
                if (output.data.context) {
                    log.info("Found remote context! context: ", output.data.context);
                    WALLET_CONTEXT = output.data.context;
                }
                else {
                    //failed to get remote!
                    log.info("failed to get remote context!", output.data);
                    let walletNames = yield Object.keys(WALLETS_LOADED);
                    if (walletNames.length > 0) {
                        WALLET_CONTEXT = walletNames[0];
                        let resultUpdateContextRemote = yield network.instance.SetContext(null, { context: WALLET_CONTEXT });
                        log.info("resultUpdateContextRemote: ", resultUpdateContextRemote);
                    }
                }
            }
            return WALLET_CONTEXT;
        });
    },
    getAutonomousStatus: function () {
        return AUTONOMOUS;
    },
    autonomousOn: function () {
        AUTONOMOUS = true;
        return AUTONOMOUS;
    },
    autonomousOff: function () {
        AUTONOMOUS = false;
        return AUTONOMOUS;
    },
    hardwareStart: function () {
        return Hardware.start();
    },
    hardwareState: function () {
        return Hardware.state();
    },
    hardwareLocked: function () {
        return Hardware.isLocked();
    },
    hardwareInfo: function () {
        return Hardware.info();
    },
    hardwareWipe: function () {
        return Hardware.wipe();
    },
    hardwareLoad: function (mnemonic) {
        return Hardware.load(mnemonic);
    },
    hardwareShowPin: function () {
        return Hardware.displayPin();
    },
    hardwareEnterPin: function (pin) {
        return Hardware.enterPin(pin);
    },
    // getPending: function () {
    //     return pendingQueue;
    // },
    // getAproved: function () {
    //     return approvedQueue;
    // },
    //await network.instance.Invocations()
    getInvocations: function (context) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = yield network.instance.Invocations();
            return output.data;
        });
    },
    approveTransaction: function (context, invocationId) {
        return approve_transaction(context, invocationId);
    },
    getConfig: function () {
        return pioneer_config_1.getConfig();
    },
    updateConfig: function (language) {
        return pioneer_config_1.updateConfig(language);
    },
    createWallet: function (type, wallet) {
        return create_wallet(type, wallet);
    },
    backupWallet: function () {
        return backup_wallet();
    },
    getWallet: function () {
        return pioneer_config_1.getWallet();
    },
    getWallets: function () {
        return WALLETS_LOADED;
    },
    getWalletNames: function () {
        return pioneer_config_1.getWallets();
    },
    setContext: function (context) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("context: ", context);
            if (context && WALLETS_LOADED[context]) {
                //does it match current
                if (context !== WALLET_CONTEXT) {
                    WALLET_CONTEXT = context;
                }
                network.instance.SetContext(null, { context });
            }
            else {
                log.error("WALLETS_LOADED: ", WALLETS_LOADED);
                throw Error("invalid wallet context! context: " + context);
            }
        });
    },
    unlockWallet: function (wallet, password) {
        return unlock_wallet(wallet, password);
    },
    migrateWallet: function () {
        return true;
    },
    importKey: function () {
        return true;
    },
    setPassword: function (pw) {
        WALLET_PASSWORD = pw;
        return true;
    },
    setAuth: function (auth) {
        AUTH_TOKEN = auth;
        return true;
    },
    pairKeepkey: function (wallet, blockchains) {
        return pair_keepkey(wallet, blockchains);
    },
    // getAccountInfo: function (asset:string,account:string) {
    //     return network.getAccountInfo(asset,account);
    // },
    // getBlockCount: function (coin:string) {
    //     return network.getAccountInfo(coin);
    // },
    // login: function () {
    //     return login_shapeshift();
    // },
    // loginStatus: function () {
    //     return IS_LOGGED_IN;
    // },
    getAuth: function () {
        return AUTH_TOKEN;
    },
    getAccount: function () {
        return ACCOUNT;
    },
    pair: function (code) {
        return pair_sdk_user(code);
    },
    // forget: function () {
    //     return Pioneer.forget();
    // },
    /**
     *    User Ecosystem
     *
     *
     */
    getUserInfo: function () {
        return __awaiter(this, void 0, void 0, function* () {
            let output = yield network.instance.User();
            return output.data;
        });
    },
    getUsersOnline: function () {
        return __awaiter(this, void 0, void 0, function* () {
            let output = yield network.instance.Online();
            return output.data;
        });
    },
    pingUser: function () {
        return [];
    },
    sendRequest: function (sender, receiver, amount, asset) {
        //TODO use invoke
        let payment_request = {
            sender,
            receiver,
            amount,
            asset
        };
        //emit
        return SOCKET_CLIENT.emit('message', payment_request);
    },
    /**
     *    App Ecosystem
     *
     *
     */
    listAppsRemote: function () {
        return list_apps_remote();
    },
    listAppsLocal: function () {
        return pioneer_config_1.getApps();
    },
    downloadApp: function (name) {
        return download_app(name);
    },
    installApp: function (name) {
        return install_app(name);
    },
    /**
     *    Keepkey
     *
     *
     */
    // unlockKeepkey: async function () {
    //     return unlock_keepkey();
    // },
    // showPinHelper: async function () {
    //     return show_pin_helper();
    // },
    // enterPin: async function (pin:string) {
    //     return enter_keepkey_pin(pin);
    // },
    // getKeepkeyInfo: async function () {
    //     return get_keepkey_info();
    // },
    // getLatestFirmware: async function () {
    //     return getLatestFirmwareData();
    // },
    /**
     *    Wallet
     *
     *
     */
    // getWalletPriv: async function () {
    //     return WALLET_PRIVATE;
    // },
    // getWalletPub: async function () {
    //     return WALLET_PUBLIC;
    // },
    // getWalletPubkeys: async function () {
    //     return WALLET_PUBKEYS;
    // },
    // getInfo: async function (verbosity:any) {
    //     return get_wallet_summary(verbosity);
    // },
    //TODO
    // getNewAddress: async function (coin:string) {
    //     return pioneer.getNewAddress(coin);
    // },
    /**
     *    EOS
     *
     *
     */
    // getEosPubkey: async function (coin:string) {
    //     return pioneer.getNewAddress(coin);
    // },
    // getEosAccountsByPubkey: async function (coin:string) {
    //     return pioneer.getNewAddress(coin);
    // },
    // validateEosUsername: async function (coin:string) {
    //     return pioneer.getNewAddress(coin);
    // },
    // registerEosUsername: async function (coin:string) {
    //     return pioneer.getNewAddress(coin);
    // },
    /*
        FIO commands
    */
    // getFioAccountInfo: function (username:string) {
    //     return WALLETS_LOADED[WALLET_CONTEXT].getFioAccountInfo(username);
    // },
    // getFioPubkey: function () {
    //     return WALLETS_LOADED[WALLET_CONTEXT].getFioPubkey();
    // },
    // getFioAccountsByPubkey: function (pubkey:string) {
    //     return WALLETS_LOADED[WALLET_CONTEXT].getFioAccountsByPubkey(pubkey);
    // },
    // validateFioUsername: function (username:string) {
    //     return WALLETS_LOADED[WALLET_CONTEXT].validateFioUsername(username);
    // },
    registerFioUsername: function () {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const open = require("open");
                let pubkey = yield Pioneer.getFioPubkey();
                open("https://reg.fioprotocol.io/ref/shapeshift?publicKey=" + pubkey);
                return true;
            }
            catch (e) {
                log.error(e);
            }
        });
    },
    //TODO send payment request
    // sendFioRequest: function (walletId:string,format:string) {
    //     return send_fio_request(walletId, format);
    // },
    //view all wallets
    //view current wallet
    //switch wallets
    //create new (move old)
    //list installed plugins
    //list available plugins
    //install plugin
    //export wallet
    exportWallet: function (walletId, format) {
        return export_wallet(walletId, format);
    },
    // playChingle: function () {
    //   player.play('../assets/chaching.mp3', function(err:any){
    //     if (err) throw err
    //   })
    //   return true;
    // },
    // getBalance: function (coin:string) {
    //     return get_balance(coin);
    // },
    // getBalances: function () {
    //     return get_balances();
    // },
    // getAddress: function (coin:string) {
    //     return get_address(coin);
    // },
    // getMaster: function (coin:string) {
    //     return Pioneer.getMaster(coin);
    // },
    //TODO
    // listSinceLastblock: function (coin:string,block:string) {
    //     return pioneer.listSinceLastblock(coin,block);
    // },
    // sendToAddress: async function (coin:string,address:string,amount:string,memo?:string) {
    //     return send_to_address(coin,address,amount,memo);
    // },
    broadcastTransaction: function (coin, rawTx) {
        return __awaiter(this, void 0, void 0, function* () {
            return broadcast_transaction(coin, rawTx);
        });
    },
    //TODO
    // getStakes: function (coin:string) {
    //     return pioneer.getStakes(coin);
    // },
    getCoins: function () {
        return ONLINE;
    },
    //TODO
    // viewSeed: function () {
    //     return WALLET_SEED;
    // },
    sendToAddress: function (intent) {
        return send_to_address(intent);
    },
};
/*

    approve_transaction

    Notes:
        Source:
        Dapp:
        amountUSD known:
        expected Fee in USD:

 */
let approve_transaction = function (context, invocationId) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | unlock_wallet | ";
        try {
            let transactionViewFinal = {};
            transactionViewFinal.success = false;
            let allUnapproved = [];
            //get all pending from all contexts
            let wallets = Object.keys(WALLETS_LOADED);
            for (let i = 0; i < wallets.length; i++) {
                let wallet = wallets[i];
                //
                let unApproved = WALLETS_LOADED[wallet].getApproveQueue();
                for (let j = 0; j < unApproved.length; j++) {
                    let unsignedTransaction = unApproved[j];
                    allUnapproved.push(unsignedTransaction);
                }
            }
            log.debug(tag, "*** allUnapproved: ", allUnapproved);
            log.debug(tag, "*** WALLET_CONTEXT: ", WALLET_CONTEXT);
            log.debug(tag, "*** context: ", context);
            //get unApproved from remote
            let remoteUnapproved = yield network.instance.Invocations();
            remoteUnapproved = remoteUnapproved.data;
            log.debug(tag, "*** remoteUnapproved: ", remoteUnapproved);
            for (let i = 0; i < remoteUnapproved.length; i++) {
                let remoteInovaction = remoteUnapproved[i];
                allUnapproved.push(remoteInovaction);
            }
            //if context dont match
            if (WALLET_CONTEXT !== context) {
                log.debug(tag, "Signing transaction for wallet out of context!");
                transactionViewFinal.outOfContext = true;
            }
            //add warning to view
            log.debug(tag, "allUnapproved: ", allUnapproved);
            for (let i = 0; i < allUnapproved.length; i++) {
                let unsignedTransaction = allUnapproved[i];
                log.debug(tag, "unsignedTransaction: ", unsignedTransaction.invocationId);
                log.debug(tag, "invocationId: ", invocationId);
                if (unsignedTransaction.invocationId === invocationId) {
                    transactionViewFinal.unsignedTransaction = unsignedTransaction;
                    let unSignedTx;
                    if (!unsignedTransaction.unSignedTx) {
                        log.debug("ERROR: THIS SHOULD NOT HIT! FAILED TO UPDATE INVOCATION FIXME");
                        //log.error(tag,"e: ",unsignedTransaction)
                        //build anyway
                        unSignedTx = yield WALLETS_LOADED[WALLET_CONTEXT].sendToAddress(unsignedTransaction.invocation.invocation);
                        unSignedTx.invocationId = unsignedTransaction.invocationId;
                    }
                    else {
                        unSignedTx = unsignedTransaction.unSignedTx;
                    }
                    log.debug(tag, "Signing transaction: ", unSignedTx);
                    //approve transaction
                    let signedTx = yield WALLETS_LOADED[WALLET_CONTEXT].signTransaction(unSignedTx);
                    if (signedTx.txid)
                        transactionViewFinal.success = true;
                    transactionViewFinal.txid = signedTx.txid;
                    transactionViewFinal.signedTx = signedTx;
                    //validate
                    log.debug(tag, "FINAL signedTx: ", signedTx);
                    //broadcast
                    let broadcast = yield WALLETS_LOADED[WALLET_CONTEXT].broadcastTransaction(unSignedTx.coin, signedTx);
                    transactionViewFinal.broadcast = broadcast;
                    //add to pending
                    let walletPending = yield WALLETS_LOADED[WALLET_CONTEXT].addBroadcasted({ unsignedTransaction, signedTx, broadcast });
                    for (let j = 0; j < walletPending.length; j++) {
                        ALL_PENDING.push(walletPending[j]);
                    }
                    transactionViewFinal.pending = ALL_PENDING;
                }
            }
            return transactionViewFinal;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let pair_sdk_user = function (code) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | unlock_wallet | ";
        try {
            //send code
            log.debug(tag, "network: ", network);
            log.debug(tag, "network: ", network.instance);
            let result = yield network.instance.Pair(null, { code });
            return result.data;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let unlock_wallet = function (wallet, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | unlock_wallet | ";
        try {
            //verify config hash match's wallet
            //verify password match's hash
            //if new pw auto migrate
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let pair_keepkey = function (keepkeyWallet, blockchains) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | pair_keepkey | ";
        try {
            log.debug(tag, "config: ", keepkeyWallet);
            let deviceId = keepkeyWallet.features.deviceId;
            //get config
            let config = pioneer_config_1.getConfig();
            log.debug(tag, "config: ", config);
            if (!config || Object.keys(config).length === 0) {
                yield pioneer_config_1.innitConfig("english");
                config = pioneer_config_1.getConfig();
            }
            //enable hardware
            let paired = config.paired;
            if (!paired)
                paired = [];
            if (paired.indexOf(deviceId) === -1) {
                paired.push(deviceId);
                pioneer_config_1.updateConfig({ paired });
            }
            //verify pubkeys
            log.info(tag, "pubkeys: ", keepkeyWallet.pubkeys);
            for (let i = 0; i < blockchains.length; i++) {
                let blockchain = blockchains[i];
                let symbol = getNativeAssetForBlockchain(blockchain);
                log.info(tag, "symbol: ", symbol);
                //find in pubkeys
                let isFound = keepkeyWallet.pubkeys.find((path) => {
                    return path.blockchain === blockchain;
                });
                if (!isFound) {
                    throw Error("Failed to find path for blockchain: " + blockchain);
                }
                //verify master
            }
            //use as ID
            keepkeyWallet.deviceId = deviceId;
            //createWallet
            yield create_wallet('hardware', keepkeyWallet);
            return true;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let get_wallet_summary = function (verbosity) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | get_wallet_summary | ";
        try {
            let info = {
                totalUsd: TOTAL_VALUE_USD_LOADED,
                wallets: [],
            };
            // let info = await pioneer.getInfo()
            //
            // //console.log("info: ",info)
            // if(info.totalValueUsd){
            //     console.log("info: ",info.totalValueUsd)
            // } else {
            //     console.error("Failed to get info!")
            // }
            //
            // // instantiate
            // var table = new Table({
            //     head: ['ASSET', 'amount','value']
            //     , colWidths: [10, 20, 20]
            // });
            //
            // let coins = Object.keys(info.balances)
            // //if > 1$
            // for(let i = 0; i < coins.length; i++){
            //     let coin = coins[i]
            //     log.debug(tag,"coin: ",coin)
            //     log.debug(tag,"info.balances[coin]: ",info.balances[coin])
            //     log.debug(tag,"info.valueUsds[coin]: ",info.valueUsds[coin])
            //
            //     if(parseFloat(info.valueUsds[coin]) > 1){
            //         table.push([coin,info.balances[coin],info.valueUsds[coin]])
            //     }
            // }
            //
            // table = table.sort(function(a:any, b:any) {
            //     return b[2] - a[2];
            // });
            //
            // log.debug("\n \n \n Your Wallet info! \n "+chalk.yellowBright("( ₿ )")+ "\n \n Total Value (USD): " +chalk.blue(info.totalValueUsd)+" \n \n table: \n",table.toString().trim()+"\n \n \n \n \n")
            return info;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let list_apps_remote = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | list_apps | ";
        try {
            let appList = yield network.apps();
            return appList;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let install_app = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | install_app | ";
        try {
            return true;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let download_app = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | download_app | ";
        try {
            return true;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let export_wallet = function (walletId, format) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | export_wallet | ";
        try {
            let output;
            if (format === 'citadel' || format === 'keepkey') {
                //if(!outDir) outDir = pioneerPath
                let outDir = pioneer_config_1.pioneerPath;
                let isCreated = yield mkdirp(outDir);
                log.debug("create path: ", isCreated);
                //verify path
                //load seed
                //build wallet
                log.debug(tag, "WALLET_PUBLIC: ", WALLET_PUBLIC);
                log.debug(tag, "WALLET_PRIVATE: ", WALLET_PRIVATE);
                if (Object.keys(WALLET_PUBLIC).length === 0)
                    throw Error("102: Failed to find WALLET_PUBLIC");
                if (Object.keys(WALLET_PUBLIC).length === 0)
                    throw Error("103: Failed to find WALLET_PRIVATE");
                let walletInfo = {
                    WALLET_ID: walletId,
                    TYPE: 'full',
                    CREATED: new Date().getTime(),
                    VERSION: "0.1.3",
                    WALLET_PUBLIC,
                    WALLET_PRIVATE,
                    WALLET_PUBKEYS
                };
                let walletInfoPub = {
                    WALLET_ID: walletId,
                    TYPE: 'watch',
                    CREATED: new Date().getTime(),
                    VERSION: "0.1.3",
                    WALLET_PUBLIC,
                    WALLET_PUBKEYS
                };
                //write to foxpath, name wallet walletId
                let writePathPub = outDir + "/" + walletId + ".watch.wallet.json";
                log.debug(tag, "writePathPub: ", writePathPub);
                let writeSuccessPub = fs.writeFileSync(writePathPub, JSON.stringify(walletInfoPub));
                //for each coin
                let coins = Object.keys(walletInfo.WALLET_PUBLIC);
                let configFileEnv = "";
                configFileEnv = configFileEnv + "WALLET_ID=" + walletInfo.WALLET_ID + "\n";
                configFileEnv = configFileEnv + "TYPE=" + walletInfo.TYPE + "\n";
                configFileEnv = configFileEnv + "VERSION=" + walletInfo.VERSION + "\n";
                //write .env //TODO depricated
                for (let i = 0; i < coins.length; i++) {
                    let coin = coins[i];
                    log.debug(tag, "coin: ", coin);
                    let keypairInfo = WALLET_PUBLIC[coin];
                    log.debug(tag, "keypairInfo: ", keypairInfo);
                    //if(coin === 'EOS'){}
                    //if eth
                    configFileEnv = configFileEnv + "WALLET_" + coin + "_MASTER=" + keypairInfo.master + "\n";
                    //if type xpub
                    if (keypairInfo.type === 'xpub') {
                        configFileEnv = configFileEnv + "WALLET_" + coin + "_XPUB=" + keypairInfo.xpub + "\n";
                    }
                }
                log.debug(tag, "configFileEnv: ", configFileEnv);
                //write to foxpath, name wallet walletId
                let writePathEnv = outDir + "/" + walletId + ".env";
                log.debug(tag, "writePath: ", writePathEnv);
                let writeSuccessEnv = fs.writeFileSync(writePathEnv, configFileEnv);
                log.debug(tag, "writeSuccessEnv: ", writeSuccessEnv);
                //backupWallet(outDir,hash,seed_encrypted,walletId)
            }
            else {
                //
                throw Error("format not supported " + format);
            }
            return output;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let get_balances = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | get_address | ";
        try {
            //use apps
            let output = yield Pioneer.getInfo();
            return output.balances;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let get_balance = function (coin) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | get_address | ";
        try {
            coin = coin.toUpperCase();
            //use apps
            let output = yield Pioneer.getBalance(coin);
            return output;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let broadcast_transaction = function (coin, rawTx) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | broadcast_transaction | ";
        try {
            coin = coin.toUpperCase();
            let result;
            //tier 1 apps
            //if token, set network to ETH
            log.debug("Broadcasting tx coin: ", coin, " rawTx: ", rawTx);
            result = yield network.instance.Broadcast(null, { coin, rawTx });
            log.debug(tag, "result: ", result);
            return result.data;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let send_approval = function (intent) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | send_to_address | ";
        try {
            log.debug(tag, "params: ", intent);
            let signedTx = yield WALLETS_LOADED[WALLET_CONTEXT].sendApproval(intent);
            log.debug(tag, "txid: ", signedTx.txid);
            //
            return signedTx;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let send_to_address = function (intent) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | send_to_address | ";
        try {
            if (!intent.address)
                throw Error("102: invalid intent missing address!");
            if (!intent.coin)
                throw Error("102: invalid intent missing coin!");
            if (!intent.amount)
                throw Error("102: invalid intent missing amount!");
            log.debug(tag, "params: ", intent);
            intent.addressTo = intent.address;
            log.debug(tag, "Building TX on context: ", WALLET_CONTEXT);
            if (!intent.context)
                intent.context = intent.context;
            //TODO check remote context match's local
            //build tx add to approve queue
            let unsignedTx = yield WALLETS_LOADED[WALLET_CONTEXT].sendToAddress(intent);
            log.debug(tag, "unsignedTx: ", unsignedTx);
            log.debug(tag, "WALLET_CONTEXT: ", WALLET_CONTEXT);
            //push unsigned to invocation
            let updateInno = {
                invocationId: intent.invocationId,
                invocation: intent,
                unsignedTx
            };
            //log.debug(tag,"Network.instance: ",network.instance)
            let resultUpdateInvocation = yield network.instance.UpdateInvocation(null, updateInno);
            log.debug(tag, "resultUpdateInvocation: ", resultUpdateInvocation.data);
            //add to queue
            let resultAdd = yield WALLETS_LOADED[WALLET_CONTEXT].addUnsigned(unsignedTx);
            log.debug(tag, "resultAdd: ", resultAdd);
            //verify added
            let resultNewQueue = yield WALLETS_LOADED[WALLET_CONTEXT].getApproveQueue();
            log.debug(tag, "resultNewQueue: ", resultNewQueue);
            return unsignedTx;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let build_swap = function (swap, invocationId) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | send_to_address | ";
        try {
            let signedTx = yield WALLETS_LOADED[WALLET_CONTEXT].buildSwap(swap);
            log.debug(tag, "txid: ", signedTx.txid);
            if (invocationId)
                signedTx.invocationId = invocationId;
            //broadcast hook
            let broadcast_hook = () => __awaiter(this, void 0, void 0, function* () {
                try {
                    log.debug(tag, "checkpoint: broadcast_hook: ", signedTx);
                    //TODO flag for async broadcast
                    if (!swap.asset.chain) {
                        log.error("Invalid Swap! swap: ", swap);
                        throw Error("104: fucking type swaps gdamnit");
                    }
                    let broadcastResult = yield WALLETS_LOADED[WALLET_CONTEXT].broadcastTransaction(swap.asset.chain, signedTx);
                    broadcastResult = broadcastResult.data;
                    log.debug(tag, "broadcastResult: ", broadcastResult);
                    //TODO push event to event emitter -> UI
                }
                catch (e) {
                    log.error(tag, "Failed to broadcast transaction!");
                }
            });
            //Notice NO asyc!
            broadcast_hook();
            return signedTx;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let get_address = function (coin) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | get_address | ";
        try {
            coin = coin.toUpperCase();
            //use apps
            let output = yield Pioneer.getMaster(coin);
            return output;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
//Build Seed
function standardRandomBytesFunc(size) {
    /* istanbul ignore if: not testable on node */
    return CryptoJS.lib.WordArray.random(size).toString();
}
let backup_wallet = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | backup_wallet | ";
        try {
            //TODO validate seed
            //does wallet already exist?
            const wallet = yield pioneer_config_1.getWallet();
            if (!wallet)
                throw Error("Wallet not found!");
            //save wallet in new dir
            let time = new Date().getTime();
            let filename = "backup:" + time;
            let passwordHash = wallet.password;
            let encryptedSeed = wallet.vault;
            //
            //TODO fixme
            //let success = await backupWallet("backup",passwordHash ,encryptedSeed, filename)
            // let success = sa
            //return success;
        }
        catch (e) {
            if (e.response && e.response.data) {
                log.error(tag, "Error: ", e.response.data);
            }
            else {
                log.error(tag, "Error: ", e);
            }
            throw e;
        }
    });
};
let create_wallet = function (type, wallet, isTestnet) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | create_wallet | ";
        try {
            if (!isTestnet)
                isTestnet = false;
            let output = false;
            //if software
            switch (type) {
                case "software":
                    //TODO validate seed
                    if (!wallet.mnemonic)
                        throw Error("101: mnemonic required!");
                    if (!wallet.password)
                        throw Error("102: password required!");
                    if (!wallet.masterAddress)
                        throw Error("103: masterAddress required!");
                    if (!wallet.username)
                        wallet.username = "defaultUser:" + uuid_1.v4();
                    //filename
                    let filename = wallet.masterAddress + ".wallet.json";
                    log.debug(tag, "filename: ", filename);
                    //does wallet exist
                    let alreadyExists = pioneer_config_1.getWallet(filename);
                    log.debug(tag, "alreadyExists: ", alreadyExists);
                    //pw hash
                    const hash = bcrypt.hashSync(wallet.password, 10);
                    //if doesnt exist write file
                    if (!alreadyExists) {
                        // @ts-ignore
                        globalThis.crypto = new webcrypto_1.Crypto();
                        // @ts-ignore
                        const engine = new native.crypto.engines.WebCryptoEngine();
                        // @ts-ignore
                        const walletCrypto = new native.crypto.EncryptedWallet(engine);
                        const result = yield walletCrypto.init(wallet.username, wallet.password);
                        yield walletCrypto.createWallet(wallet.mnemonic);
                        let seed_encrypted = result.encryptedWallet;
                        //
                        log.debug(tag, "seed_encrypted: ", seed_encrypted);
                        log.debug(tag, "hash: ", hash);
                        let walletNew = {
                            isTestnet,
                            masterAddress: wallet.masterAddress,
                            TYPE: "citadel",
                            seed_encrypted,
                            hash,
                            username: wallet.username,
                            filename
                        };
                        if (wallet.temp)
                            walletNew.temp = wallet.temp;
                        yield pioneer_config_1.initWallet(walletNew);
                        //TODO verify exists?
                        output = true;
                    }
                    else {
                        throw Error("already exists");
                        //TODO verify?
                        //createWallet
                    }
                    break;
                case "hardware":
                    log.debug(tag, "wallet hardware: ", wallet);
                    if (!wallet.deviceId)
                        throw Error("102: deviceId require for keepkey wallets!");
                    if (!wallet.wallet.WALLET_PUBLIC)
                        throw Error("103: WALLET_PUBLIC require for keepkey wallets!");
                    log.debug("hardware watch create!");
                    let walletFileNew = {
                        isTestnet,
                        features: wallet.features,
                        WALLET_ID: "keepkey:" + wallet.deviceId,
                        TYPE: 'keepkey',
                        CREATED: new Date().getTime(),
                        VERSION: "0.1.3",
                        WALLET_PUBLIC: wallet.wallet.WALLET_PUBLIC,
                        WALLET_PUBKEYS: wallet.pubkeys
                    };
                    walletFileNew.pubkeys = wallet.pubkeys;
                    walletFileNew.KEEPKEY = true;
                    walletFileNew.DEVICE_ID = wallet.deviceId;
                    walletFileNew.LABEL = wallet.label;
                    walletFileNew.deviceId = wallet.deviceId;
                    walletFileNew.filename = wallet.deviceId + ".watch.wallet.json";
                    yield pioneer_config_1.initWallet(walletFileNew);
                    //TODO verify exists?
                    output = true;
                    break;
                default:
                    throw Error("unhandled wallet type! " + type);
                    break;
            }
            return output;
        }
        catch (e) {
            if (e.response && e.response.data) {
                log.error(tag, "Error: ", e.response.data);
            }
            else {
                log.error(tag, "Error: ", e);
            }
            throw e;
        }
    });
};
let init_wallet = function (config, isTestnet) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = TAG + " | init_wallet | ";
        try {
            DATABASES = yield nedb.init();
            let output = {};
            //get wallets
            let walletFiles = yield pioneer_config_1.getWallets();
            log.info(tag, "walletFiles: ", walletFiles);
            //TODO if testnet flag only show testnet wallets!
            output.walletFiles = walletFiles;
            output.wallets = [];
            //get wallets remote
            //if diff mark missing wallets
            //if context not loaded change context
            //if no password
            if (!config.password)
                config.password = config.temp;
            if (!config.password)
                throw Error("101: password required!");
            if (!config.username)
                throw Error("102: username required!");
            if (!config.queryKey)
                throw Error("103: queryKey required!");
            if (config.urlSpec || config.spec) {
                URL_PIONEER_SPEC = config.urlSpec || config.spec;
            }
            if (!URL_PIONEER_SPEC)
                URL_PIONEER_SPEC = "https://pioneers.dev/spec/swagger.json";
            if (config.pioneerSocket || config.wss) {
                URL_PIONEER_SOCKET = config.pioneerSocket || config.wss;
            }
            if (!URL_PIONEER_SOCKET)
                URL_PIONEER_SOCKET = "wss://pioneers.dev";
            network = new Network(URL_PIONEER_SPEC, {
                queryKey: config.queryKey
            });
            network = yield network.init();
            if (!walletFiles) {
                throw Error(" No wallets found! ");
            }
            if (config.hardware) {
                log.debug(tag, "Hardware enabled!");
                //start
                KEEPKEY = yield Hardware.start();
                KEEPKEY.events.on('event', function (event) {
                    return __awaiter(this, void 0, void 0, function* () {
                        //events.emit('keepkey',{event})
                    });
                });
            }
            if (!config.blockchains) {
                //no more missing coins bs
                throw Error("Must specify blockchain configuration!");
            }
            //verify wallet_data
            // for(let i = 0; i < wallets.length; i++){
            //     let walletName = wallets[i]
            //     log.debug(tag,"walletName: ",walletName)
            //     let fileNameWatch = walletName.replace(".wallet.json",".watch.wallet.json")
            //     let watchWallet = getWalletPublic(fileNameWatch)
            //     if(!watchWallet){
            //         //create watch wallet
            //     } else {
            //         log.debug(tag," Watch Only wallet found!")
            //         //load
            //     }
            // }
            //Load wallets if setup
            for (let i = 0; i < walletFiles.length; i++) {
                let walletName = walletFiles[i];
                log.debug(tag, "walletName: ", walletName);
                let walletFile = pioneer_config_1.getWallet(walletName);
                log.debug(tag, "walletFile: ", walletFile);
                if (!walletFile.TYPE)
                    walletFile.TYPE = walletFile.type;
                if (walletFile.TYPE === 'keepkey') {
                    if (!output.devices)
                        output.devices = [];
                    log.debug(tag, "Loading keepkey wallet! ");
                    if (!walletFile.pubkeys)
                        throw Error("102: invalid keepkey wallet!");
                    //if(!walletFile.wallet) throw Error("103: invalid keepkey wallet!")
                    //if wallet paths custom load
                    log.debug(tag, "walletName: ", walletName);
                    let fileNameWatch = walletName.replace(".wallet.json", ".watch.wallet.json");
                    let watchWallet = pioneer_config_1.getWalletPublic(fileNameWatch);
                    let walletPaths;
                    if (watchWallet) {
                        walletPaths = watchWallet.paths;
                    }
                    else {
                        log.debug(tag, "walletFile: ", walletFile);
                    }
                    //get device info from walletFile
                    if (!walletFile.features)
                        throw Error("Invalid wallet file missing device features!");
                    output.devices.push(walletFile.features);
                    //load
                    let configPioneer = {
                        hardware: true,
                        vendor: "keepkey",
                        blockchains: config.blockchains,
                        pubkeys: walletFile.pubkeys,
                        wallet: walletFile,
                        context: walletName,
                        username: config.username,
                        pioneerApi: true,
                        spec: URL_PIONEER_SPEC,
                        queryKey: config.queryKey,
                        auth: process.env['SHAPESHIFT_AUTH'] || 'lol',
                        authProvider: 'bitcoin'
                    };
                    log.debug(tag, "KEEPKEY init config: ", configPioneer);
                    let wallet = new Pioneer('keepkey', configPioneer, isTestnet);
                    //init
                    let walletInfo = yield wallet.init(KEEPKEY);
                    log.debug(tag, "walletInfo: ", walletInfo);
                    WALLETS_LOADED[walletName] = wallet;
                    //info
                    let info = yield wallet.getInfo(walletName);
                    info.name = walletFile.username;
                    info.type = 'keepkey';
                    output.wallets.push(info);
                    log.debug(tag, "info: ", info);
                    //validate at least 1 pubkey per enabled blockchain
                    let pubkeyNetworks = new Set();
                    for (let i = 0; i < info.pubkeys.length; i++) {
                        let pubkey = info.pubkeys[i];
                        pubkeyNetworks.add(pubkey.coin);
                    }
                    log.debug(tag, "pubkeyNetworks: ", pubkeyNetworks);
                    //TODO iterate over blockchains config and verify
                    //else register individual pubkeys until complete
                    //write pubkeys
                    // let writePathPub = pioneerPath+"/"+info.name+".watch.wallet.json"
                    // log.debug(tag,"writePathPub: ",writePathPub)
                    // let writeSuccessPub = fs.writeFileSync(writePathPub, JSON.stringify(info.public));
                    // log.debug(tag,"writeSuccessPub: ",writeSuccessPub)
                    //global total valueUSD
                    TOTAL_VALUE_USD_LOADED = TOTAL_VALUE_USD_LOADED + info.totalValueUsd;
                    WALLET_VALUE_MAP[walletName] = info.totalValueUsd;
                }
                else if (walletFile.TYPE === 'seedwords') {
                    //decrypt
                    // @ts-ignore
                    globalThis.crypto = new webcrypto_1.Crypto();
                    // @ts-ignore
                    const engine = new native.crypto.engines.WebCryptoEngine();
                    // @ts-ignore
                    const walletCrypto = new native.crypto.EncryptedWallet(engine);
                    //if wallet has pw, use it
                    if (walletFile.password)
                        config.password = walletFile.password;
                    const resultOut = yield walletCrypto.init(walletFile.username, config.password, walletFile.vault);
                    if (!walletFile.vault)
                        throw Error("Wallet vault not found! ");
                    let mnemonic = yield resultOut.decrypt();
                    //Load public wallet file
                    //Loads wallet state and custom pathing
                    log.debug(tag, "walletName: ", walletName);
                    let fileNameWatch = walletName.replace(".wallet.json", ".watch.wallet.json");
                    let watchWallet = pioneer_config_1.getWalletPublic(fileNameWatch);
                    let walletPaths;
                    if (watchWallet) {
                        walletPaths = watchWallet.paths;
                    }
                    //TODO validate seed
                    if (!mnemonic)
                        throw Error("unable to start wallet! invalid seed!");
                    // log.debug(tag,"mnemonic: ",mnemonic)
                    //load wallet to global
                    let configPioneer = {
                        isTestnet,
                        mnemonic,
                        context: walletName,
                        blockchains: config.blockchains,
                        username: config.username,
                        pioneerApi: true,
                        auth: process.env['SHAPESHIFT_AUTH'] || 'lol',
                        authProvider: 'shapeshift',
                        spec: URL_PIONEER_SPEC,
                        queryKey: config.queryKey
                    };
                    if (walletPaths)
                        configPioneer.paths = walletPaths;
                    log.debug(tag, "configPioneer: ", configPioneer);
                    log.debug(tag, "isTestnet: ", isTestnet);
                    let wallet = new Pioneer('pioneer', configPioneer, isTestnet);
                    WALLETS_LOADED[walletName] = wallet;
                    //init
                    let walletClient = yield wallet.init();
                    //info
                    let info = yield wallet.getInfo(walletName);
                    log.info(tag, "INFO: ", info);
                    if (!info.pubkeys)
                        throw Error(" invalid wallet info returned! missing pubkeys!");
                    if (!info.masters)
                        throw Error(" invalid wallet info returned! missing masters!");
                    info.name = walletFile.username;
                    info.type = 'software';
                    output.wallets.push(info);
                    log.debug(tag, "info: ", info);
                    let pubkeyNetworks = new Set();
                    for (let i = 0; i < info.pubkeys.length; i++) {
                        let pubkey = info.pubkeys[i];
                        pubkeyNetworks.add(pubkey.coin);
                    }
                    log.debug(tag, "pubkeyNetworks: ", pubkeyNetworks);
                    let walletInfoPub = {
                        WALLET_ID: walletFile.username,
                        TYPE: 'watch',
                        CREATED: new Date().getTime(),
                        VERSION: "0.1.4",
                        WALLET_PUBLIC: info.public,
                        WALLET_PUBKEYS: info.pubkeys
                    };
                    let writePathPub = pioneer_config_1.walletDataDir + "/" + fileNameWatch;
                    log.debug(tag, "writePathPub: ", writePathPub);
                    let writeSuccessPub = fs.writeFileSync(writePathPub, JSON.stringify(walletInfoPub));
                    log.debug(tag, "writeSuccessPub: ", writeSuccessPub);
                    //
                    log.debug(tag, "info: ", info);
                    //global total valueUSD
                    TOTAL_VALUE_USD_LOADED = TOTAL_VALUE_USD_LOADED + info.totalValueUsd;
                    WALLET_VALUE_MAP[walletName] = info.totalValueUsd;
                }
                else {
                    throw Error("unhandled wallet type! " + walletFile.TYPE);
                }
            }
            output.TOTAL_VALUE_USD_LOADED = TOTAL_VALUE_USD_LOADED;
            output.WALLET_VALUE_MAP = WALLET_VALUE_MAP;
            log.debug(tag, "TOTAL_VALUE_USD_LOADED: ", TOTAL_VALUE_USD_LOADED);
            //get remote user info
            let userInfo = yield network.instance.User();
            userInfo = userInfo.data;
            if (!userInfo.context)
                throw Error("Invalid user info! missing context!");
            if (walletFiles.indexOf(userInfo.context) >= 0) {
                log.debug(tag, "userInfo: ", userInfo);
                log.debug(tag, "context: ", userInfo.context);
                WALLET_CONTEXT = userInfo.context;
                output.context = WALLET_CONTEXT;
            }
            else {
                log.info(tag, "remote context NOT in loaded wallet");
                //set remote context to position0
                log.info(tag, "walletNames: ", walletFiles);
                let newContext = walletFiles[0];
                if (newContext) {
                    log.info(tag, "newContext: ", newContext);
                    let resultUpdateContext = yield network.instance.SetContext(null, { context: newContext });
                    resultUpdateContext = resultUpdateContext.data;
                    log.info(tag, "resultUpdateContext: ", resultUpdateContext);
                    WALLET_CONTEXT = newContext;
                    output.context = WALLET_CONTEXT;
                }
                else {
                    throw Error("Could not figure out context!");
                }
            }
            //after registered start socket
            //sub all to events
            if (!config.username)
                throw Error("102: config.username not set!");
            if (!config.queryKey)
                throw Error("103: config.queryKey not set!");
            let configEvents = {
                username: config.username,
                queryKey: config.queryKey,
                wss: URL_PIONEER_SOCKET
            };
            //sub ALL events
            let clientEvents = new Events.Events(configEvents.wss, configEvents);
            yield clientEvents.init();
            yield clientEvents.subscribeToKey();
            yield clientEvents.pair();
            //on blocks update lastBlockHeight
            //on payments update balances
            //on on invocations add to queue
            clientEvents.events.on('message', (request) => __awaiter(this, void 0, void 0, function* () {
                log.debug(tag, "**** message: ", request);
                //TODO filter invocations by subscribers
                //TODO autonomousOn/Off
                //TODO verify auth to paired keys
                //TODO filter by preferences
                //if swaps allowed (no transfers)
                //verify swap to wallet
                //if transfer / whitelist rules
                //if swap
                //if transfer
                //if liquidity event
                //add/withdrawal
                let signedTx;
                switch (request.type) {
                    case 'swap':
                        //Note this is ETH only
                        //TODO validate inputs
                        signedTx = yield build_swap(request.invocation, request.invocationId);
                        log.debug(tag, "txid: ", signedTx.txid);
                        clientEvents.events.emit('broadcast', signedTx);
                        break;
                    case 'approve':
                        //Note this is ETH only
                        if (!request.invocationId)
                            throw Error("102: invalid invocation! missing id!");
                        request.invocation.invocationId = request.invocationId;
                        signedTx = yield send_approval(request.invocation);
                        log.debug(tag, "txid: ", signedTx.txid);
                        clientEvents.events.emit('broadcast', signedTx);
                        break;
                    case 'transfer':
                        if (!request.invocationId)
                            throw Error("102: invalid invocation! missing id!");
                        request.invocation.invocationId = request.invocationId;
                        let unSignedTx = yield send_to_address(request.invocation);
                        log.debug(tag, "unSignedTx: ", unSignedTx);
                        clientEvents.events.emit('approval', unSignedTx);
                        break;
                    case 'context':
                        //switch context
                        if (WALLETS_LOADED[request.context]) {
                            log.debug(tag, "wallet context is now: ", request.context);
                            if (request.context !== WALLET_CONTEXT) {
                                WALLET_CONTEXT = request.context;
                                clientEvents.events.emit('context', request);
                            }
                            else {
                                log.error("context already: ", request.context);
                            }
                        }
                        else {
                            log.error(tag, "Failed to switch! invalid context: ", request.context);
                        }
                        break;
                    default:
                        log.error("Unknown event: " + request.type);
                    //push error
                    // code block
                }
                //push signed tx to socket
                clientEvents.events.emit('broadcast', signedTx);
                //push txid to invocationId
                //update status on server
                //add to history
            }));
            output.context = WALLET_CONTEXT;
            if (!output.context)
                throw Error("");
            output.events = clientEvents.events;
            return output;
        }
        catch (e) {
            if (e.response && e.response.data) {
                log.error(tag, "Error: ", e.response.data);
            }
            else {
                log.error(tag, "Error: ", e);
            }
            throw e;
        }
    });
};
