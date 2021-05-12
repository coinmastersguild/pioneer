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
let WALLETS_VERBOSE = [];
let TOTAL_VALUE_USD_LOADED = 0;
let WALLETS_LOADED = {};
let IS_SEALED = false;
let MASTER_MAP = {};
let WALLET_VALUE_MAP = {};
let CONTEXT_WALLET_SELECTED;
//urlSpec
// let URL_PIONEER_SPEC = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
// let URL_PIONEER_SOCKET = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let URL_PIONEER_SPEC = process.env['URL_PIONEER_SPEC'] || 'http://127.0.0.1:9001/spec/swagger.json';
let URL_PIONEER_SOCKET = process.env['URL_PIONEER_SOCKET'] || 'ws://127.0.0.1:9001';
let urlSpec = URL_PIONEER_SPEC;
let KEEPKEY;
let network;
//chingle
// let opts:any = {}
// var player = require('play-sound')(opts = {})
let AUTONOMOUS = false;
let IS_INIT = false;
module.exports = {
    isInitialized: function () {
        return IS_INIT;
    },
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
                    let walletIds = yield Object.keys(WALLETS_LOADED);
                    if (walletIds.length > 0) {
                        WALLET_CONTEXT = walletIds[0];
                        let resultUpdateContextRemote = yield network.instance.SetContext(null, { context: WALLET_CONTEXT });
                        log.debug("resultUpdateContextRemote: ", resultUpdateContextRemote);
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
    buildTransaction: function (transaction) {
        return build_transaction(transaction);
    },
    approveTransaction: function (transaction) {
        return approve_transaction(transaction);
    },
    broadcastTransaction: function (transaction) {
        return broadcast_transaction(transaction);
    },
    updateInvocation: function (updateBody) {
        return __awaiter(this, void 0, void 0, function* () {
            return update_invocation(updateBody);
        });
    },
    getInvocation: function (invocationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return get_invocation(invocationId);
        });
    },
    getInvocations: function (context) {
        return __awaiter(this, void 0, void 0, function* () {
            let output = yield network.instance.Invocations();
            return output.data;
        });
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
    getWalletDescriptions: function () {
        return WALLETS_VERBOSE;
    },
    setContext: function (context) {
        return __awaiter(this, void 0, void 0, function* () {
            return set_context(context);
        });
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
    getAuth: function () {
        return AUTH_TOKEN;
    },
    getAccount: function () {
        return ACCOUNT;
    },
    pair: function (code) {
        return pair_sdk_user(code);
    },
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
    listAppsRemote: function () {
        return list_apps_remote();
    },
    listAppsLocal: function () {
        return pioneer_config_1.getApps();
    },
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
    exportWallet: function (walletId, format) {
        return export_wallet(walletId, format);
    },
    getCoins: function () {
        return ONLINE;
    },
    sendToAddress: function (intent) {
        return send_to_address(intent);
    },
};
let get_invocation = function (invocationId) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | get_invocation | ";
        try {
            let output = yield network.instance.Invocation(invocationId);
            return output.data;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let build_transaction = function (transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | build_transaction | ";
        try {
            log.info(tag, "transaction: ", transaction);
            if (!transaction.invocationId)
                throw Error("invocationId required!");
            //get invocation
            //TODO validate type and fields
            let invocation = yield get_invocation(transaction.invocationId);
            log.info(tag, "invocation: ", invocation);
            if (!invocation.type)
                invocation.type = invocation.invocation.type;
            let context;
            if (!transaction.context) {
                context = WALLET_CONTEXT;
            }
            else {
                context = transaction.context;
            }
            if (!context || !WALLETS_LOADED[context]) {
                log.error("context: ", context);
                log.error("Available: ", WALLETS_LOADED);
                throw Error("103: could not find context in WALLETS_LOADED! " + context);
            }
            let walletContext = WALLETS_LOADED[context];
            if (!walletContext.walletId) {
                walletContext.walletId = walletContext.context;
            }
            if (!walletContext.walletId)
                throw Error("Invalid wallet! missing walletId!");
            log.info(tag, "walletContext: ", walletContext.walletId);
            let unsignedTx;
            switch (invocation.type) {
                case 'transfer':
                    console.log(" **** BUILD TRANSACTION ****  invocation: ", invocation.invocation);
                    //TODO validate transfer object
                    unsignedTx = yield walletContext.buildTransfer(invocation.invocation);
                    log.info(" **** RESULT TRANSACTION ****  unsignedTx: ", unsignedTx);
                    break;
                case 'approve':
                    console.log(" **** BUILD Approval ****  invocation: ", invocation.invocation);
                    unsignedTx = yield walletContext.buildApproval(invocation.invocation);
                    console.log(" **** RESULT TRANSACTION ****  approvalUnSigned: ", unsignedTx);
                    break;
                case 'swap':
                    console.log(" **** BUILD SWAP ****  invocation: ", invocation.invocation);
                    unsignedTx = yield walletContext.buildSwap(invocation.invocation);
                    console.log(" **** RESULT TRANSACTION ****  swapUnSigned: ", unsignedTx);
                    break;
                default:
                    console.error("Unhandled type: ", invocation.type);
                    console.error("Unhandled: ", invocation);
                    throw Error("Unhandled type: " + invocation.type);
            }
            //update invocation
            let invocationId = invocation.invocationId;
            let updateBody = {
                invocationId,
                invocation,
                unsignedTx
            };
            //update invocation remote
            let resultUpdate = yield update_invocation(updateBody);
            log.info(tag, "resultUpdate: ", resultUpdate);
            return unsignedTx;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let broadcast_transaction = function (transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | broadcast_transaction | ";
        try {
            //get invocation
            let invocation = yield get_invocation(transaction.invocationId);
            log.info(tag, "invocation: ", invocation);
            //signedTx
            if (!invocation.signedTx)
                throw Error("102: Unable to broadcast transaction! signedTx not found!");
            //context
            let context;
            if (!transaction.context) {
                context = WALLET_CONTEXT;
            }
            else {
                context = transaction.context;
            }
            if (!context || Object.keys(WALLETS_LOADED).indexOf(context) < 0) {
                log.error("context: ", context);
                log.error("Available: ", Object.keys(WALLETS_LOADED));
                throw Error("103: could not find context in WALLETS_LOADED! " + context);
            }
            let walletContext = WALLETS_LOADED[context];
            if (!walletContext.walletId) {
                walletContext.walletId = walletContext.context;
            }
            if (!walletContext.walletId)
                throw Error("Invalid wallet! missing walletId!");
            log.info(tag, "walletContext: ", walletContext.walletId);
            //TODO fix tech debt
            //normalize
            if (!invocation.invocation.invocationId)
                invocation.invocation.invocationId = invocation.invocationId;
            //override noBroadcast
            if (invocation.signedTx && invocation.signedTx.noBroadcast)
                invocation.signedTx.noBroadcast = false;
            let broadcastResult = yield walletContext.broadcastTransaction(invocation.invocation.coin, invocation.signedTx);
            let updateBody = {
                invocationId: invocation.invocation.invocationId,
                invocation: invocation.invocation,
                unsignedTx: invocation.unsignedTx,
                signedTx: invocation.signedTx,
                broadcastResult
            };
            log.info(tag, "updateBody: ", updateBody);
            //update invocation remote
            let resultUpdate = yield update_invocation(updateBody);
            log.info(tag, "resultUpdate: ", resultUpdate);
            return broadcastResult;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let update_invocation = function (updateBody) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | set_context | ";
        try {
            let output = yield network.instance.UpdateInvocation(null, updateBody);
            return output.data;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let set_context = function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | set_context | ";
        try {
            log.debug("context: ", context);
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
            return true;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
/*

    approve_transaction

    Notes:
        Source:
        Dapp:
        amountUSD known:
        expected Fee in USD:

 */
let approve_transaction = function (transaction) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | approve_transaction | ";
        try {
            log.info(tag, "transaction: ", transaction);
            //get invocation
            if (!transaction.invocationId && transaction.transaction)
                transaction.invocationId = transaction.transaction.invocationId;
            if (!transaction.invocationId && transaction.swap)
                transaction.invocationId = transaction.swap.invocationId;
            if (!transaction.invocationId)
                throw Error("102: transaction.invocationId required!");
            let invocation = yield get_invocation(transaction.invocationId);
            log.info(tag, "invocation: ", invocation);
            if (!invocation.unsignedTx)
                throw Error("invalid invocation! missing unsignedTx");
            if (!invocation.unsignedTx.HDwalletPayload)
                throw Error("invalid invocation! invalid unsignedTx missing HDwalletPayload");
            let context;
            if (!transaction.context) {
                context = WALLET_CONTEXT;
            }
            else {
                context = transaction.context;
            }
            if (!context || Object.keys(WALLETS_LOADED).indexOf(context) < 0) {
                log.error("context: ", context);
                log.error("Available: ", Object.keys(WALLETS_LOADED));
                throw Error("103: could not find context in WALLETS_LOADED! " + context);
            }
            let walletContext = WALLETS_LOADED[context];
            if (!walletContext.walletId) {
                walletContext.walletId = walletContext.context;
            }
            if (!walletContext.walletId)
                throw Error("Invalid wallet! missing walletId!");
            log.info(tag, "walletContext: ", walletContext.walletId);
            //TODO kill the coin! field
            invocation.unsignedTx.HDwalletPayload.coin = invocation.invocation.coin;
            //get
            //if(invocation.unsignedTx.HDwalletPayload.coin === 'BitcoinCash') invocation.unsignedTx.HDwalletPayload.coin = 'BCH'
            //unsinged TX
            log.info(tag, "invocation.unsignedTx: ", JSON.stringify(invocation.unsignedTx));
            let signedTx = yield walletContext.signTransaction(invocation.unsignedTx);
            log.info(tag, "invocation.signedTx: ", JSON.stringify(signedTx));
            //update invocation
            let invocationId = invocation.invocationId;
            let updateBody = {
                invocationId,
                invocation,
                unsignedTx: invocation.unsignedTx,
                signedTx
            };
            //update invocation remote
            let resultUpdate = yield update_invocation(updateBody);
            log.info(tag, "resultUpdate: ", resultUpdate);
            return signedTx;
        }
        catch (e) {
            console.error(tag, "Error: ", e);
            throw e;
        }
    });
};
let pair_sdk_user = function (code) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | pair_sdk_user | ";
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
            log.debug(tag, "pubkeys: ", keepkeyWallet.pubkeys);
            for (let i = 0; i < blockchains.length; i++) {
                let blockchain = blockchains[i];
                let symbol = getNativeAssetForBlockchain(blockchain);
                log.debug(tag, "symbol: ", symbol);
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
let app_to_queue = function (invocation) {
    return __awaiter(this, void 0, void 0, function* () {
        let tag = " | app_to_queue | ";
        try {
            if (!invocation.invocationId)
                throw Error("102: invalid intent missing invocationId!");
            if (!invocation.type)
                throw Error("102: invalid intent missing type!");
            //if(!invocation.address) throw Error("102: invalid intent missing address!")
            //if(!invocation.coin) throw Error("102: invalid intent missing coin!")
            if (!invocation.amount)
                throw Error("102: invalid intent missing amount!");
            log.debug(tag, "invocation: ", invocation);
            invocation.addressTo = invocation.address;
            log.debug(tag, "Building TX on context: ", WALLET_CONTEXT);
            if (!invocation.context)
                invocation.context = invocation.context;
            //TODO check remote context match's local
            //add to queue
            let resultAdd = yield WALLETS_LOADED[WALLET_CONTEXT].addUnsigned(invocation);
            log.debug(tag, "resultAdd: ", resultAdd);
            //verify added
            let resultNewQueue = yield WALLETS_LOADED[WALLET_CONTEXT].getApproveQueue();
            log.debug(tag, "resultNewQueue: ", resultNewQueue);
            let output = {
                invocationId: invocation.invocationId,
                invocation,
                queue: resultNewQueue,
            };
            return output;
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
            if (IS_INIT)
                throw Error("App already initialized!");
            network = new Network(URL_PIONEER_SPEC, {
                queryKey: config.queryKey
            });
            network = yield network.init();
            // DATABASES = await nedb.init()
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
            //if(!URL_PIONEER_SPEC) URL_PIONEER_SPEC = "https://pioneers.dev/spec/swagger.json"
            if (!URL_PIONEER_SPEC)
                URL_PIONEER_SPEC = "http://127.0.0.1:9001/spec/swagger.json";
            if (config.pioneerSocket || config.wss) {
                URL_PIONEER_SOCKET = config.pioneerSocket || config.wss;
            }
            // if(!URL_PIONEER_SOCKET) URL_PIONEER_SOCKET = "wss://pioneers.dev"
            if (!URL_PIONEER_SOCKET)
                URL_PIONEER_SOCKET = "ws://127.0.0.1:9001";
            let output = {};
            //get wallets
            let walletFiles = yield pioneer_config_1.getWallets();
            log.debug(tag, "walletFiles: ", walletFiles);
            let walletDescriptions = [];
            //TODO if testnet flag only show testnet wallets!
            //TODO get public wallets from wallet_data dir
            //if missing generate
            //get remote has more wallets
            let userInfoRemote = yield network.instance.User();
            userInfoRemote = userInfoRemote.data;
            log.debug(tag, "userInfoRemote: ", userInfoRemote);
            if (userInfoRemote.wallets) {
                for (let i = 0; i < userInfoRemote.wallets; i++) {
                    let walletRemote = userInfoRemote[i];
                    //if found in local
                    let match = walletFiles.filter((e) => e === walletRemote);
                    if (match[0]) {
                        log.info(tag, "Found remote wallet locally! wallet: ", walletRemote);
                        let walletDescription = {
                            name: walletRemote,
                            remote: true,
                            local: true,
                            status: 'online'
                        };
                        walletDescriptions.push(walletDescription);
                    }
                    else {
                        log.info(tag, "Remote wallet NOT found localy: ", walletRemote);
                        //push it anyway
                        walletFiles.push(walletRemote);
                        //mark it offline
                        output.offline(walletRemote);
                        //remote wallet not found locally
                        //else mark offline
                    }
                }
            }
            else {
                log.info(tag, 'new user detected!');
            }
            log.info(tag, "Checkpoint0: status remote wallets: output: ", output);
            //note, if local has more wallets then remote, its ok, we register them below!
            //if missing, mark "offline" add
            output.offline = [];
            output.walletFiles = walletFiles;
            output.wallets = [];
            //get wallets remote
            //if diff mark missing wallets
            //if context not loaded change context
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
            //Load wallets if setup
            for (let i = 0; i < walletFiles.length; i++) {
                let walletId = walletFiles[i];
                //if !offline aka, online!
                log.info(tag, "output.offline: ", output.offline);
                if (output.offline.indexOf(walletId) < 0) {
                    log.info(tag, "wallet is online! ", walletId);
                    log.debug(tag, "walletId: ", walletId);
                    let walletFile = pioneer_config_1.getWallet(walletId);
                    log.info(tag, "walletFile: ", walletFile);
                    if (!walletFile.TYPE)
                        walletFile.TYPE = walletFile.type;
                    if (walletFile.TYPE === 'keepkey') {
                        if (!KEEPKEY) {
                            //start
                            KEEPKEY = yield Hardware.start();
                            KEEPKEY.events.on('event', function (event) {
                                return __awaiter(this, void 0, void 0, function* () {
                                    //events.emit('keepkey',{event})
                                });
                            });
                        }
                        if (!output.devices)
                            output.devices = [];
                        log.debug(tag, "Loading keepkey wallet! ");
                        if (!walletFile.pubkeys)
                            throw Error("102: invalid keepkey wallet!");
                        //if(!walletFile.wallet) throw Error("103: invalid keepkey wallet!")
                        //if wallet paths custom load
                        log.debug(tag, "walletId: ", walletId);
                        let fileNameWatch = walletId.replace(".wallet.json", ".watch.wallet.json");
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
                            walletId,
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
                        if (!KEEPKEY)
                            throw Error("Can not start hardware wallet without global KEEPKEY");
                        let walletInfo = yield wallet.init(KEEPKEY);
                        log.debug(tag, "walletInfo: ", walletInfo);
                        WALLETS_LOADED[walletId] = wallet;
                        //info
                        let info = yield wallet.getInfo(walletId);
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
                        //TODO write pubkeys
                        // let writePathPub = pioneerPath+"/"+info.name+".watch.wallet.json"
                        // log.debug(tag,"writePathPub: ",writePathPub)
                        // let writeSuccessPub = fs.writeFileSync(writePathPub, JSON.stringify(info.public));
                        // log.debug(tag,"writeSuccessPub: ",writeSuccessPub)
                        //add wallet info
                        let walletInfoVerbose = {
                            walletId,
                            type: walletFile.TYPE,
                            totalValueUsd: info.totalValueUsd
                        };
                        WALLETS_VERBOSE.push(walletInfoVerbose);
                        //global total valueUSD
                        TOTAL_VALUE_USD_LOADED = TOTAL_VALUE_USD_LOADED + info.totalValueUsd;
                        WALLET_VALUE_MAP[walletId] = info.totalValueUsd;
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
                        log.debug(tag, "walletId: ", walletId);
                        let fileNameWatch = walletId.replace(".wallet.json", ".watch.wallet.json");
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
                            walletId,
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
                        WALLETS_LOADED[walletId] = wallet;
                        //init
                        let walletClient = yield wallet.init();
                        //info
                        let info = yield wallet.getInfo(walletId);
                        log.debug(tag, "INFO: ", info);
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
                        //add wallet info
                        let walletInfoVerbose = {
                            walletId,
                            type: walletFile.TYPE,
                            totalValueUsd: info.totalValueUsd
                        };
                        WALLETS_VERBOSE.push(walletInfoVerbose);
                        //
                        log.debug(tag, "info: ", info);
                        //global total valueUSD
                        TOTAL_VALUE_USD_LOADED = TOTAL_VALUE_USD_LOADED + info.totalValueUsd;
                        WALLET_VALUE_MAP[walletId] = info.totalValueUsd;
                    }
                    else {
                        throw Error("unhandled wallet type! " + walletFile.TYPE);
                    }
                }
                else {
                    log.info(tag, "wallet is offline!");
                }
            }
            output.TOTAL_VALUE_USD_LOADED = TOTAL_VALUE_USD_LOADED;
            output.WALLET_VALUE_MAP = WALLET_VALUE_MAP;
            log.debug(tag, "TOTAL_VALUE_USD_LOADED: ", TOTAL_VALUE_USD_LOADED);
            //get remote user info
            let userInfo = yield network.instance.User();
            userInfo = userInfo.data;
            if (!userInfo.context) {
                if (walletFiles.length === 0) {
                    throw Error("You must first create/pair a wallet to use app!");
                }
                else {
                    //no context found remote
                    //setting a context from 0
                    log.info(tag, "offline: ", output.offline);
                    for (let i = 0; i < walletFiles.length; i++) {
                        let walletFile = walletFiles[i];
                        if (output.offline.indexOf(walletFile) >= 0) {
                            log.info(tag, "wallet is offline: ", walletFile);
                        }
                        else {
                            log.info(tag, "Setting New Context newContext: ", walletFile);
                            let resultUpdateContext = yield network.instance.SetContext(null, { context: walletFile });
                            resultUpdateContext = resultUpdateContext.data;
                            log.debug(tag, "resultUpdateContext: ", resultUpdateContext);
                            WALLET_CONTEXT = walletFile;
                            output.context = WALLET_CONTEXT;
                        }
                    }
                }
            }
            if (walletFiles.indexOf(userInfo.context) >= 0) {
                log.debug(tag, "userInfo: ", userInfo);
                log.debug(tag, "context: ", userInfo.context);
                WALLET_CONTEXT = userInfo.context;
                output.context = WALLET_CONTEXT;
            }
            else {
                log.info(tag, "remote context NOT in loaded wallet");
                //set remote context to position0 local
                log.info(tag, "walletIds: ", walletFiles);
                log.info(tag, "Position 0 context: ", walletFiles[0]);
                //
                set_context(walletFiles[0]);
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
                log.info(tag, "**** message: ", request);
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
                let unsignedTx;
                let context;
                let invokeQueue;
                let invocationId;
                let resultUpdate;
                let updateBody;
                switch (request.type) {
                    case 'swap':
                        if (!request.invocation)
                            throw Error("103: invalid invocation! missing invocation!");
                        if (!request.invocationId)
                            throw Error("102: invalid invocation! missing id!");
                        request.invocation.invocationId = request.invocationId;
                        invokeQueue = yield app_to_queue(request.invocation);
                        log.debug(tag, "invokeQueue: ", invokeQueue);
                        clientEvents.events.emit('invokeQueue', invokeQueue);
                        if (request.invocation.context)
                            context = request.invocation.context;
                        if (!context)
                            context = WALLET_CONTEXT;
                        if (!WALLETS_LOADED[context]) {
                            log.error(tag, "WALLETS_LOADED: ", WALLETS_LOADED);
                            log.error(tag, "context: ", context);
                            throw Error("Unable to build transaction! context not found!");
                        }
                        log.info(tag, "Building transaction with context: ", context);
                        log.info(tag, "invocation: ", request.invocation);
                        unsignedTx = yield WALLETS_LOADED[context].buildSwap(request.invocation);
                        log.info(tag, "txid: ", unsignedTx.txid);
                        log.info(tag, "unsignedTx: ", unsignedTx);
                        //update invocation
                        invocationId = request.invocation.invocationId;
                        updateBody = {
                            invocationId,
                            invocation: request.invocation,
                            unsignedTx
                        };
                        //update invocation remote
                        resultUpdate = yield update_invocation(updateBody);
                        log.info(tag, "resultUpdate: ", resultUpdate);
                        clientEvents.events.emit('unsignedTx', unsignedTx);
                        break;
                    case 'approve':
                        if (!request.invocation)
                            throw Error("103: invalid invocation! missing invocation!");
                        if (!request.invocationId)
                            throw Error("102: invalid invocation! missing id!");
                        request.invocation.invocationId = request.invocationId;
                        invokeQueue = yield app_to_queue(request.invocation);
                        log.debug(tag, "invokeQueue: ", invokeQueue);
                        clientEvents.events.emit('invokeQueue', invokeQueue);
                        if (request.invocation.context)
                            context = request.invocation.context;
                        if (!context)
                            context = WALLET_CONTEXT;
                        if (!WALLETS_LOADED[context]) {
                            log.error(tag, "WALLETS_LOADED: ", WALLETS_LOADED);
                            log.error(tag, "context: ", context);
                            throw Error("Unable to build transaction! context not found!");
                        }
                        log.info(tag, "Building transaction with context: ", context);
                        log.info(tag, "invocation: ", request.invocation);
                        unsignedTx = yield WALLETS_LOADED[context].buildApproval(request.invocation);
                        log.info(tag, "txid: ", unsignedTx.txid);
                        log.info(tag, "unsignedTx: ", unsignedTx);
                        //update invocation
                        invocationId = request.invocation.invocationId;
                        updateBody = {
                            invocationId,
                            invocation: request.invocation,
                            unsignedTx
                        };
                        //update invocation remote
                        resultUpdate = yield update_invocation(updateBody);
                        log.info(tag, "resultUpdate: ", resultUpdate);
                        clientEvents.events.emit('unsignedTx', unsignedTx);
                        break;
                    case 'transfer':
                        if (!request.invocation)
                            throw Error("103: invalid invocation! missing invocation!");
                        if (!request.invocationId)
                            throw Error("102: invalid invocation! missing id!");
                        request.invocation.invocationId = request.invocationId;
                        invokeQueue = yield app_to_queue(request.invocation);
                        log.debug(tag, "invokeQueue: ", invokeQueue);
                        clientEvents.events.emit('invokeQueue', invokeQueue);
                        if (request.invocation.context)
                            context = request.invocation.context;
                        if (!context)
                            context = WALLET_CONTEXT;
                        if (!WALLETS_LOADED[context]) {
                            log.error(tag, "WALLETS_LOADED: ", WALLETS_LOADED);
                            log.error(tag, "context: ", context);
                            throw Error("Unable to build transaction! context not found!");
                        }
                        log.info(tag, "Building transaction with context: ", context);
                        log.info(tag, "invocation: ", request.invocation);
                        unsignedTx = yield WALLETS_LOADED[context].buildTransfer(request.invocation);
                        log.info(tag, "unsignedTx: ", unsignedTx);
                        //update invocation
                        invocationId = request.invocation.invocationId;
                        updateBody = {
                            invocationId,
                            invocation: request.invocation,
                            unsignedTx
                        };
                        //update invocation remote
                        resultUpdate = yield update_invocation(updateBody);
                        log.info(tag, "resultUpdate: ", resultUpdate);
                        clientEvents.events.emit('unsignedTx', unsignedTx);
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
                //push txid to invocationId
                //update status on server
                //add to history
            }));
            output.context = WALLET_CONTEXT;
            if (!output.context)
                throw Error("");
            output.walletsDescriptions = WALLETS_VERBOSE;
            //global init
            IS_INIT = true;
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
