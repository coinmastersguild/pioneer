"use strict";
/*

    Pioneer Wallet v2

    Class based wallet development

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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HDWALLETS = exports.AuthProviders = void 0;
var TAG = " | Pioneer | ";
var log = require("@pioneer-platform/loggerdog")();
//TODO remove this dep
var tokenData = require("@pioneer-platform/pioneer-eth-token-data");
var ripemd160 = require("crypto-js/ripemd160");
var CryptoJS = require("crypto-js");
var sha256 = require("crypto-js/sha256");
var bech32 = require("bech32");
var bitcoin = require("bitcoinjs-lib");
var ethUtils = require('ethereumjs-util');
var prettyjson = require('prettyjson');
var coinSelect = require('coinselect');
//All paths
//TODO make paths adjustable!
var getPaths = require('@pioneer-platform/pioneer-coins').getPaths;
//support
var support = __importStar(require("./support"));
var web3_utils_1 = require("web3-utils");
var fiosdk_offline_1 = require("fiosdk-offline");
//Pioneer follows OpenAPI spec
var network = require("@pioneer-platform/pioneer-client");
//pioneer
var hdwallet_core_1 = require("@bithighlander/hdwallet-core");
//Highlander fork
var hdwallet = require("@bithighlander/hdwallet-core");
var pioneer = require("@bithighlander/hdwallet-native");
// SS public TODO catch up public repo
// const hdwallet = require("@shapeshiftoss/hdwallet-core")
// const pioneer = require("@shapeshiftoss/hdwallet-native")
//global
var keyring = new hdwallet.Keyring();
var IS_OFFLINE = false;
// let WALLET_BALANCES:any = {}
// let WALLET_MODE:any
var WALLET_COINS = [];
//eth token info
WALLET_COINS.push('ETH');
//TODO support coinlist (coingecko)
for (var i = 0; i < tokenData.tokens.length; i++) {
    var token = tokenData.tokens[i];
    WALLET_COINS.push(token);
}
// COINS
WALLET_COINS.push('RUNE');
WALLET_COINS.push('BNB');
WALLET_COINS.push('ATOM');
WALLET_COINS.push('EOS');
WALLET_COINS.push('FIO');
//TODO BNB tokens
//TODO type paths
//TODO MOVEME coins module
var HD_RUNE_KEYPATH = "m/44'/931'/0'/0/0";
var RUNE_CHAIN = "thorchain";
var RUNE_BASE = 1000000;
var RUNE_TX_FEE = "100";
var RUNE_MAX_GAS = "100000";
var HD_ATOM_KEYPATH = "m/44'/118'/0'/0/0";
var ATOM_CHAIN = "cosmoshub-4";
var ATOM_BASE = 1000000;
var ATOM_TX_FEE = "100";
var ATOM_MAX_GAS = "100000";
var HD_BNB_KEYPATH = "44'/714'/0'/0/";
var BNB_ASSET_SYMBOL = "BNB";
var BNB_CHAIN = "";
var BNB_MAX_GAS = "100000";
var BNB_TX_FEE = "100";
var BNB_BASE = 100000000;
var HD_EOS_KEYPATH = "44'/194'/0'/0/";
var EOS_ASSET_SYMBOL = "EOS";
var EOS_CHAIN = "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906";
var EOS_MAX_GAS = "100000";
var EOS_TX_FEE = "100";
var EOS_BASE = 1000;
var AuthProviders;
(function (AuthProviders) {
    AuthProviders["shapeshift"] = "shapeshift";
    AuthProviders["bitcoin"] = "bitcoin";
})(AuthProviders = exports.AuthProviders || (exports.AuthProviders = {}));
var HDWALLETS;
(function (HDWALLETS) {
    HDWALLETS[HDWALLETS["pioneer"] = 0] = "pioneer";
    HDWALLETS[HDWALLETS["trezor"] = 1] = "trezor";
    HDWALLETS[HDWALLETS["keepkey"] = 2] = "keepkey";
    HDWALLETS[HDWALLETS["ledger"] = 3] = "ledger";
    HDWALLETS[HDWALLETS["metamask"] = 4] = "metamask";
})(HDWALLETS = exports.HDWALLETS || (exports.HDWALLETS = {}));
function bech32ify(address, prefix) {
    var words = bech32.toWords(address);
    return bech32.encode(prefix, words);
}
function createBech32Address(publicKey, prefix) {
    var message = CryptoJS.enc.Hex.parse(publicKey.toString("hex"));
    var hash = ripemd160(sha256(message)).toString();
    var address = Buffer.from(hash, "hex");
    var cosmosAddress = bech32ify(address, prefix);
    return cosmosAddress;
}
module.exports = /** @class */ (function () {
    function wallet(type, config, isTestnet) {
        this.PUBLIC_WALLET = {};
        this.PRIVATE_WALLET = {};
        this.isTestnet = isTestnet || false;
        this.mode = config.mode;
        this.queryKey = config.queryKey;
        this.username = config.username;
        this.pioneerApi = config.pioneerApi;
        this.type = type;
        this.spec = config.spec;
        this.mnemonic = config.mnemonic;
        this.auth = config.auth;
        this.authProvider = config.authProvider;
        this.bip32ToAddressNList = function (path) {
            return hdwallet_core_1.bip32ToAddressNList(path);
        };
        this.setMnemonic = function () {
            return this.mnemonic;
        };
        this.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tag, pioneerAdapter, _a, _b, paths, isTestnet_1, _c, i, pubkey, _d, _e, _f, _g, register, regsiterResponse, walletInfo, e_1;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            tag = TAG + " | init_wallet | ";
                            _h.label = 1;
                        case 1:
                            _h.trys.push([1, 19, , 20]);
                            log.debug(tag, "checkpoint");
                            pioneerAdapter = pioneer.NativeAdapter.useKeyring(keyring);
                            _a = +HDWALLETS[this.type];
                            switch (_a) {
                                case HDWALLETS.pioneer: return [3 /*break*/, 2];
                                case HDWALLETS.keepkey: return [3 /*break*/, 6];
                                case HDWALLETS.metamask: return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 8];
                        case 2:
                            log.debug(tag, "checkpoint", " pioneer wallet detected! ");
                            if (!config.mnemonic && !config.wallet)
                                throw Error("102: mnemonic or wallet file required! ");
                            if (config.mnemonic && config.wallet)
                                throw Error("103: wallet collision! invalid config! ");
                            //TODO load wallet
                            log.info(tag, "isTestnet: ", this.isTestnet);
                            //pair
                            _b = this;
                            return [4 /*yield*/, pioneerAdapter.pairDevice(config.username)];
                        case 3:
                            //pair
                            _b.WALLET = _h.sent();
                            return [4 /*yield*/, this.WALLET.loadDevice({ mnemonic: config.mnemonic, isTestnet: this.isTestnet })];
                        case 4:
                            _h.sent();
                            paths = getPaths(this.isTestnet);
                            isTestnet_1 = this.WALLET.isTestnet();
                            log.info(tag, "hdwallet isTestnet: ", isTestnet_1);
                            log.debug(tag, "paths: ", paths);
                            _c = this;
                            return [4 /*yield*/, this.WALLET.getPublicKeys(paths)
                                //TODO verify hdwallet init successfull
                            ];
                        case 5:
                            _c.pubkeys = _h.sent();
                            //TODO verify hdwallet init successfull
                            log.debug("pubkeys ", this.pubkeys);
                            log.debug("pubkeys.length ", this.pubkeys.length);
                            log.debug("paths.length ", paths.length);
                            for (i = 0; i < this.pubkeys.length; i++) {
                                pubkey = this.pubkeys[i];
                                log.debug(tag, "pubkey: ", pubkey);
                                if (!pubkey)
                                    throw Error("empty pubkey!");
                                if (!pubkey.coin) {
                                    log.debug("pubkey: ", pubkey);
                                    throw Error("Invalid pubkey!");
                                }
                                this.PUBLIC_WALLET[pubkey.coin] = pubkey;
                            }
                            return [3 /*break*/, 9];
                        case 6:
                            log.debug(tag, " Keepkey mode! ");
                            if (!config.wallet)
                                throw Error("Config is missing watch wallet!");
                            if (!config.wallet.WALLET_PUBLIC)
                                throw Error("Config watch wallet missing WALLET_PUBLIC!");
                            this.PUBLIC_WALLET = config.wallet.WALLET_PUBLIC;
                            if (!config.pubkeys)
                                throw Error("Config watch wallet missing pubkeys!");
                            this.pubkeys = config.pubkeys;
                            return [3 /*break*/, 9];
                        case 7:
                            log.debug(tag, " metamask mode! ");
                            if (!config.wallet)
                                throw Error("Config is missing watch wallet!");
                            if (!config.wallet.WALLET_PUBLIC)
                                throw Error("Config watch wallet missing WALLET_PUBLIC!");
                            this.PUBLIC_WALLET = config.wallet.WALLET_PUBLIC;
                            if (!config.pubkeys)
                                throw Error("Config watch wallet missing pubkeys!");
                            this.pubkeys = config.pubkeys;
                            return [3 /*break*/, 9];
                        case 8: throw Error("108: WALLET not yet supported! " + type + " valid: " + HDWALLETS);
                        case 9:
                            if (!this.pubkeys)
                                throw Error("103: failed to init wallet! missing pubkeys!");
                            if (!this.pioneerApi) return [3 /*break*/, 17];
                            if (!this.spec)
                                throw Error("102:  Api spec required! ");
                            if (!this.queryKey)
                                throw Error("102:  queryKey required! ");
                            this.pioneer = new network(config.spec, {
                                queryKey: config.queryKey
                            });
                            _d = this;
                            return [4 /*yield*/, this.pioneer.init(config.spec, {
                                    queryKey: config.queryKey
                                })];
                        case 10:
                            _d.pioneerClient = _h.sent();
                            _f = (_e = log).debug;
                            _g = ["baseUrl: "];
                            return [4 /*yield*/, this.pioneerClient.getBaseURL()];
                        case 11:
                            _f.apply(_e, _g.concat([_h.sent()]));
                            register = {
                                isTestnet: this.isTestnet,
                                username: this.username,
                                data: {
                                    pubkeys: this.pubkeys
                                },
                                queryKey: this.queryKey,
                                auth: this.auth,
                                provider: 'shapeshift'
                            };
                            log.debug("registerBody: ", register);
                            log.debug("this.pioneerClient: ", this.pioneerClient);
                            return [4 /*yield*/, this.pioneerClient.instance.Register(null, register)];
                        case 12:
                            regsiterResponse = _h.sent();
                            log.debug("regsiterResponse: ", regsiterResponse);
                            return [4 /*yield*/, this.getInfo('')];
                        case 13:
                            walletInfo = _h.sent();
                            log.debug("walletInfo: ", walletInfo);
                            this.WALLET_BALANCES = walletInfo.balances;
                            if (!(walletInfo.masters['ETH'] === this.PUBLIC_WALLET['ETH'].master)) return [3 /*break*/, 14];
                            //
                            log.debug(tag, "Remote and local masters match!");
                            return [3 /*break*/, 16];
                        case 14:
                            log.error(tag, "remote: ", walletInfo.masters['ETH']);
                            log.error(tag, "local: ", this.PUBLIC_WALLET['ETH'].master);
                            return [4 /*yield*/, this.pioneerClient.instance.Forget()];
                        case 15:
                            _h.sent();
                            throw Error("Clearing pioneer! migration!");
                        case 16: return [2 /*return*/, walletInfo];
                        case 17:
                            log.debug(tag, "Offline mode!");
                            _h.label = 18;
                        case 18: return [3 /*break*/, 20];
                        case 19:
                            e_1 = _h.sent();
                            log.error(tag, e_1);
                            throw e_1;
                        case 20: return [2 /*return*/];
                    }
                });
            });
        };
        this.paths = function (format) {
            var tag = TAG + " | get_paths | ";
            try {
                var output = [];
                if (format === 'keepkey') {
                    var paths = getPaths(this.isTestnet);
                    for (var i = 0; i < paths.length; i++) {
                        var path = paths[i];
                        var pathForKeepkey = {};
                        //send coin as bitcoin
                        pathForKeepkey.symbol = path.symbol;
                        pathForKeepkey.addressNList = path.addressNList;
                        //why
                        pathForKeepkey.coin = 'Bitcoin';
                        pathForKeepkey.script_type = 'p2pkh';
                        output.push(pathForKeepkey);
                    }
                }
                else {
                    var paths = getPaths(this.isTestnet);
                    output = paths;
                }
                return output;
            }
            catch (e) {
                log.error(tag, "e: ", e);
            }
        };
        // this.normalizePubkeys = function (format:string,pubkeys:any,paths:any) {
        //     return normalize_pubkeys(format,pubkeys,paths)
        // }
        this.forget = function () {
            return this.pioneerClient.instance.Forget();
        };
        // this.coins = function () {
        //     return WALLET_COINS;
        // }
        this.getInfo = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tag, walletInfo, e_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tag = TAG + " | getInfo | ";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            walletInfo = {};
                            if (!!IS_OFFLINE) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.pioneerClient.instance.Info()];
                        case 2:
                            //query api
                            walletInfo = _a.sent();
                            log.debug(tag, "walletInfo: ", walletInfo);
                            _a.label = 3;
                        case 3:
                            walletInfo.data.public = this.PUBLIC_WALLET;
                            walletInfo.data.private = this.PRIVATE_WALLET;
                            return [2 /*return*/, walletInfo.data];
                        case 4:
                            e_2 = _a.sent();
                            log.error(tag, "e: ", e_2);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        this.getBalance = function (coin) {
            return this.WALLET_BALANCES[coin] || 0;
        };
        this.getBalanceRemote = function (coin, address) {
            return __awaiter(this, void 0, void 0, function () {
                var tag, output, master, e_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tag = TAG + " | getBalanceRemote | ";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 9, , 10]);
                            //TODO support address
                            if (address)
                                throw Error("102: getBalanceAddress not implented yet");
                            log.debug("coin detected: ", coin);
                            output = void 0;
                            master = void 0;
                            if (!(coin === "ETH")) return [3 /*break*/, 3];
                            log.debug("ETH detected ");
                            return [4 /*yield*/, this.getMaster('ETH')];
                        case 2:
                            master = _a.sent();
                            return [3 /*break*/, 7];
                        case 3:
                            if (!(tokenData.tokens.indexOf(coin) >= 0 && coin !== 'EOS')) return [3 /*break*/, 5];
                            log.debug("token detected ");
                            return [4 /*yield*/, this.getMaster('ETH')];
                        case 4:
                            master = _a.sent();
                            return [3 /*break*/, 7];
                        case 5: return [4 /*yield*/, this.getMaster(coin)];
                        case 6:
                            master = _a.sent();
                            _a.label = 7;
                        case 7:
                            log.debug(tag, "this.pioneer: ", this.pioneerClient);
                            if (!address)
                                address = master;
                            return [4 /*yield*/, this.pioneerClient.instance.GetAddressBalance({ coin: coin, address: address })];
                        case 8:
                            output = _a.sent();
                            output = output.data;
                            return [2 /*return*/, output];
                        case 9:
                            e_3 = _a.sent();
                            log.error(tag, "e: ", e_3);
                            throw e_3;
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
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
        FIO commands
         */
        this.getFioPubkey = function () {
            return this.PUBLIC_WALLET['FIO'].pubkey;
        };
        this.getFioAccountInfo = function (username) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.pioneerClient.instance.GetFioAccountInfo(username)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result.data];
                    }
                });
            });
        };
        this.getFioAccountsByPubkey = function (pubkey) {
            return __awaiter(this, void 0, void 0, function () {
                var accounts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.pioneerClient.instance.AccountsFromFioPubkey(pubkey)];
                        case 1:
                            accounts = _a.sent();
                            return [2 /*return*/, accounts.data];
                    }
                });
            });
        };
        //getPaymentRequests
        this.getPaymentRequests = function () {
            return __awaiter(this, void 0, void 0, function () {
                var accounts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.pioneerClient.instance.GetPaymentRequests(this.PUBLIC_WALLET['FIO'].pubkey)];
                        case 1:
                            accounts = _a.sent();
                            return [2 /*return*/, accounts.data];
                    }
                });
            });
        };
        this.fioEncryptRequestContent = function (content) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.WALLET.fioEncryptRequestContent(content)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        //fioDecryptRequestContent
        this.fioDecryptRequestContent = function (content) {
            return __awaiter(this, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.WALLET.fioDecryptRequestContent(content)];
                        case 1:
                            result = _a.sent();
                            return [2 /*return*/, result];
                    }
                });
            });
        };
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
        this.getMaster = function (coin) {
            return __awaiter(this, void 0, void 0, function () {
                var tag, output;
                return __generator(this, function (_a) {
                    tag = TAG + " | get_address_master | ";
                    try {
                        if (!coin)
                            throw Error("101: must pass coin!");
                        if (this.PUBLIC_WALLET[coin]) {
                            output = this.PUBLIC_WALLET[coin].address;
                            return [2 /*return*/, output];
                        }
                        else {
                            return [2 /*return*/, "Not found!"];
                        }
                    }
                    catch (e) {
                        log.error(tag, "e: ", e);
                    }
                    return [2 /*return*/];
                });
            });
        };
        this.getAddress = function (coin, account, index, isChange) {
            var tag = TAG + " | get_address | ";
            try {
                var output 
                //if token use ETH pubkey
                = void 0;
                //if token use ETH pubkey
                if (tokenData.tokens.indexOf(coin) >= 0 && coin !== 'EOS') {
                    coin = 'ETH';
                }
                //if xpub get next unused
                if (!this.PUBLIC_WALLET[coin]) {
                    log.error(tag, "PUBLIC_WALLET: ", this.PUBLIC_WALLET);
                    throw Error("102: coin not in this.PUBLIC_WALLET! coin:" + coin);
                }
                if (this.PUBLIC_WALLET[coin].type === 'xpub') {
                    //get pubkey at path
                    var publicKey = bitcoin.bip32.fromBase58(this.PUBLIC_WALLET[coin].pubkey).derive(account).derive(index).publicKey;
                    log.debug("publicKey: ********* ", publicKey);
                    switch (coin) {
                        case 'ETH':
                            output = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey, true));
                            break;
                        case 'RUNE':
                            // code block
                            if (this.isTestnet) {
                                output = createBech32Address(publicKey, 'tthor');
                            }
                            else {
                                output = createBech32Address(publicKey, 'thor');
                            }
                            break;
                        case 'ATOM':
                            // code block
                            output = createBech32Address(publicKey, 'cosmos');
                            break;
                        case 'BNB':
                            // code block
                            output = createBech32Address(publicKey, 'bnb');
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
                            log.debug(tag, "pubkey: ", publicKey);
                            var accountFio = this.pioneerClient.instance.GetFioAccount(publicKey);
                            log.debug(tag, "accountFio: ", accountFio);
                            //get accounts for pubkey
                            output = accountFio;
                            break;
                        default:
                            throw Error("coin not yet implemented ! ");
                        // code block
                    }
                    log.debug(tag, "output: ", output);
                }
                else {
                    output = this.PUBLIC_WALLET[coin].master || this.PUBLIC_WALLET[coin].pubkey;
                }
                return output;
            }
            catch (e) {
                log.error(tag, "e: ", e);
            }
        };
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
        //     2 type:
        //         Transfers
        //
        //         non-transfers
        //             Register address
        //             Register Username
        //             staking
        //
        //  */
        this.buildTx = function (transaction) {
            return __awaiter(this, void 0, void 0, function () {
                var tag, rawTx, tx, signTx, res, _a, e_4;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            tag = TAG + " | buildTx | ";
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 11, , 12]);
                            rawTx = {};
                            if (!(transaction.coin === 'FIO')) return [3 /*break*/, 9];
                            tx = void 0;
                            signTx = void 0;
                            res = void 0;
                            _a = transaction.type;
                            switch (_a) {
                                case "fioSignAddPubAddressTx": return [3 /*break*/, 2];
                                case "fioSignRegisterDomainTx": return [3 /*break*/, 4];
                                case "fioSignRegisterFioAddressTx": return [3 /*break*/, 5];
                                case "fioSignNewFundsRequestTx": return [3 /*break*/, 6];
                            }
                            return [3 /*break*/, 8];
                        case 2:
                            tx = transaction.tx;
                            signTx = {
                                addressNList: hdwallet_core_1.bip32ToAddressNList("m/44'/235'/0'/0/0"),
                                actions: [
                                    {
                                        account: fiosdk_offline_1.FioActionParameters.FioAddPubAddressActionAccount,
                                        name: fiosdk_offline_1.FioActionParameters.FioAddPubAddressActionName,
                                        data: tx,
                                    },
                                ],
                            };
                            log.debug(tag, "signTx: ", JSON.stringify(signTx));
                            return [4 /*yield*/, this.WALLET.fioSignTx(signTx)];
                        case 3:
                            res = _b.sent();
                            res.coin = "FIO";
                            res.type = transaction.type;
                            rawTx = res;
                            // code block
                            return [3 /*break*/, 8];
                        case 4: 
                        // code block
                        return [3 /*break*/, 8];
                        case 5: 
                        // code block
                        return [3 /*break*/, 8];
                        case 6:
                            tx = transaction.tx;
                            signTx = {
                                addressNList: hdwallet_core_1.bip32ToAddressNList("m/44'/235'/0'/0/0"),
                                actions: [
                                    {
                                        account: fiosdk_offline_1.FioActionParameters.FioNewFundsRequestActionAccount,
                                        name: fiosdk_offline_1.FioActionParameters.FioNewFundsRequestActionName,
                                        data: tx,
                                    },
                                ],
                            };
                            log.debug(tag, "signTx: ", JSON.stringify(signTx));
                            return [4 /*yield*/, this.WALLET.fioSignTx(signTx)];
                        case 7:
                            res = _b.sent();
                            res.coin = "FIO";
                            res.type = transaction.type;
                            rawTx = res;
                            return [3 /*break*/, 8];
                        case 8: return [3 /*break*/, 10];
                        case 9:
                            log.error(tag, "coin not supported! ", transaction.coin);
                            _b.label = 10;
                        case 10: return [2 /*return*/, rawTx];
                        case 11:
                            e_4 = _b.sent();
                            log.error(e_4);
                            throw e_4;
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        // this.encrypt = function (msg:FioActionParameters.FioRequestContent,payerPubkey:string) {
        //     return encrypt_message(msg,payerPubkey);
        // }
        this.sendToAddress = function (coin, address, amount, param1) {
            return __awaiter(this, void 0, void 0, function () {
                var tag, output, addressFrom, transaction, signedTx, broadcastResult, e_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tag = TAG + " | sendToAddress | ";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            output = {};
                            log.debug(tag, "params: ", { coin: coin, address: address, amount: amount, param1: param1 });
                            return [4 /*yield*/, this.getMaster(coin)];
                        case 2:
                            addressFrom = _a.sent();
                            log.debug(tag, "addressFrom: ", addressFrom);
                            transaction = {
                                coin: coin,
                                addressTo: address,
                                addressFrom: addressFrom,
                                amount: amount,
                                memo: param1
                            };
                            log.debug(tag, "transaction: ", transaction);
                            return [4 /*yield*/, this.buildTransfer(transaction)];
                        case 3:
                            signedTx = _a.sent();
                            log.info(tag, "signedTx: ", signedTx);
                            return [4 /*yield*/, this.broadcastTransaction(coin, signedTx)];
                        case 4:
                            broadcastResult = _a.sent();
                            log.info(tag, "broadcastResult: ", broadcastResult);
                            return [2 /*return*/, broadcastResult];
                        case 5:
                            e_5 = _a.sent();
                            log.error(tag, e_5);
                            throw Error(e_5);
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        this.buildTransfer = function (transaction) {
            return __awaiter(this, void 0, void 0, function () {
                var tag, coin, address, amount, memo, addressFrom, rawTx, UTXOcoins, unspentInputs, utxos, i, input, utxo, feeRate, amountSat, targets, selectedResults, inputs, outputs, i, inputInfo, input, changeAddress, i, outputInfo, output, output, res, balanceEth, nonceRemote, nonce, gas_limit, gas_price, txParams, amountNative, knownCoins, balanceToken, abiInfo, metaData, amountNative, transfer_data, masterPathEth, ethTx, amountNative, masterInfo, sequence, account_number, txType, gas, fee, memo_1, unsigned, chain_id, fromAddress, res, txFinal, broadcastString, amountNative, masterInfo, sequence, account_number, txType, gas, fee, memo_2, unsigned, chain_id, fromAddress, res, txFinal, broadcastString, accountInfo, sequence, account_number, pubkey, bnbTx, signedTxResponse, pubkeySigHex, e_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tag = TAG + " | build_transfer | ";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 30, , 31]);
                            coin = transaction.coin.toUpperCase();
                            address = transaction.addressTo;
                            amount = transaction.amount;
                            memo = transaction.memo;
                            addressFrom = void 0;
                            if (!transaction.addressFrom) return [3 /*break*/, 2];
                            addressFrom = transaction.addressFrom;
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, this.getMaster(coin)];
                        case 3:
                            addressFrom = _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!addressFrom)
                                throw Error("102: unable to get master address! ");
                            log.debug(tag, "addressFrom: ", addressFrom);
                            rawTx = void 0;
                            UTXOcoins = [
                                'BTC',
                                'BCH',
                                'LTC'
                            ];
                            if (!(UTXOcoins.indexOf(coin) >= 0)) return [3 /*break*/, 8];
                            log.info(tag, "Build UTXO tx! ", coin);
                            //list unspent
                            log.info(tag, "coin: ", coin);
                            log.info(tag, "xpub: ", this.PUBLIC_WALLET[coin].xpub);
                            return [4 /*yield*/, this.pioneerClient.instance.ListUnspent({ coin: coin, xpub: this.PUBLIC_WALLET[coin].xpub })];
                        case 5:
                            unspentInputs = _a.sent();
                            unspentInputs = unspentInputs.data;
                            log.info(tag, "unspentInputs: ", unspentInputs);
                            utxos = [];
                            for (i = 0; i < unspentInputs.length; i++) {
                                input = unspentInputs[i];
                                utxo = {
                                    txId: input.txid,
                                    vout: input.vout,
                                    value: parseInt(input.value),
                                    nonWitnessUtxo: Buffer.from(input.hex, 'hex'),
                                    hex: input.hex,
                                    path: input.path
                                    //TODO if segwit
                                    // witnessUtxo: {
                                    //     script: Buffer.from('... scriptPubkey hex...', 'hex'),
                                    //     value: 10000 // 0.0001 BTC and is the exact same as the value above
                                    // }
                                };
                                utxos.push(utxo);
                            }
                            feeRate = 1;
                            amountSat = parseFloat(amount) * 100000000;
                            amountSat = parseInt(amountSat.toString());
                            log.info(tag, "amount satoshi: ", amountSat);
                            targets = [
                                {
                                    address: address,
                                    value: amountSat
                                }
                            ];
                            //
                            log.info(tag, "inputs coinselect algo: ", { utxos: utxos, targets: targets, feeRate: feeRate });
                            selectedResults = coinSelect(utxos, targets, feeRate);
                            log.info(tag, "result coinselect algo: ", selectedResults);
                            inputs = [];
                            outputs = [];
                            for (i = 0; i < selectedResults.inputs.length; i++) {
                                inputInfo = selectedResults.inputs[i];
                                input = {
                                    addressNList: support.bip32ToAddressNList(inputInfo.path),
                                    scriptType: "p2pkh",
                                    amount: String(inputInfo.value),
                                    vout: inputInfo.vout,
                                    txid: inputInfo.txId,
                                    segwit: false,
                                    hex: inputInfo.hex
                                };
                                inputs.push(input);
                            }
                            return [4 /*yield*/, this.getMaster(coin)];
                        case 6:
                            changeAddress = _a.sent();
                            for (i = 0; i < selectedResults.outputs.length; i++) {
                                outputInfo = selectedResults.outputs[i];
                                if (outputInfo.address) {
                                    output = {
                                        address: "1MU8xvQJESoZRYuhmpTc6TY5eL7PG7ufLA",
                                        addressType: "spend",
                                        scriptType: "p2wpkh",
                                        amount: String(outputInfo.value),
                                        isChange: false,
                                    };
                                    outputs.push(output);
                                }
                                else {
                                    output = {
                                        address: "1MU8xvQJESoZRYuhmpTc6TY5eL7PG7ufLA",
                                        addressType: "spend",
                                        scriptType: "p2pkh",
                                        amount: String(outputInfo.value),
                                        isChange: true,
                                    };
                                    outputs.push(output);
                                }
                            }
                            //sign
                            log.info(tag, "inputs HDwallet utxo: ", prettyjson.render({
                                coin: "Bitcoin",
                                inputs: inputs,
                                outputs: outputs,
                                version: 1,
                                locktime: 0,
                            }));
                            return [4 /*yield*/, this.WALLET.btcSignTx({
                                    coin: "Bitcoin",
                                    inputs: inputs,
                                    outputs: outputs,
                                    version: 1,
                                    locktime: 0,
                                })];
                        case 7:
                            res = _a.sent();
                            log.info(tag, "res: ", res);
                            //
                            rawTx = {
                                txid: "",
                                coin: coin,
                                serialized: res.serializedTx
                            };
                            return [3 /*break*/, 29];
                        case 8:
                            if (!(coin === 'ETH' || tokenData.tokens.indexOf(coin) >= 0 && coin !== 'EOS')) return [3 /*break*/, 17];
                            log.debug(tag, "checkpoint");
                            return [4 /*yield*/, this.getBalanceRemote('ETH')];
                        case 9:
                            balanceEth = _a.sent();
                            log.debug(tag, "getBalanceRemote: ", balanceEth);
                            return [4 /*yield*/, this.pioneerClient.instance.GetNonce(addressFrom)];
                        case 10:
                            nonceRemote = _a.sent();
                            nonceRemote = nonceRemote.data;
                            nonce = transaction.nonce || nonceRemote;
                            gas_limit = 80000 //TODO dynamic gas limit?
                            ;
                            return [4 /*yield*/, this.pioneerClient.instance.GetGasPrice()];
                        case 11:
                            gas_price = _a.sent();
                            gas_price = gas_price.data;
                            log.debug(tag, "gas_price: ", gas_price);
                            gas_price = parseInt(gas_price);
                            gas_price = gas_price + 1000000000;
                            txParams = void 0;
                            if (!(coin === "ETH")) return [3 /*break*/, 12];
                            amountNative = parseFloat(amount) * support.getBase('ETH');
                            amountNative = Number(parseInt(String(amountNative)));
                            txParams = {
                                nonce: nonce,
                                to: address,
                                gasPrice: gas_price,
                                gasLimit: gas_limit,
                                value: amountNative,
                                data: memo
                            };
                            log.debug(tag, "txParams: ", txParams);
                            return [3 /*break*/, 15];
                        case 12:
                            knownCoins = tokenData.tokens;
                            log.debug(tag, "knownCoins: ", knownCoins);
                            if (knownCoins.indexOf(coin) === -1)
                                throw Error("107: unknown token! " + coin);
                            return [4 /*yield*/, this.getBalanceRemote(coin)
                                //verify token balance
                            ];
                        case 13:
                            balanceToken = _a.sent();
                            //verify token balance
                            if (amount > balanceToken)
                                throw Error("103: Insufficient balance! ");
                            abiInfo = tokenData.ABI[coin];
                            metaData = abiInfo.metaData;
                            amountNative = parseFloat(amount) * metaData.BASE;
                            amountNative = Number(parseInt(String(amountNative)));
                            log.debug({ coin: coin, address: address, amountNative: amountNative });
                            return [4 /*yield*/, this.pioneerClient.instance.GetTransferData({ coin: coin, address: address, amount: amountNative })];
                        case 14:
                            transfer_data = _a.sent();
                            transfer_data = transfer_data.data;
                            log.debug(tag, "transfer_data: ", transfer_data);
                            txParams = {
                                nonce: nonce,
                                to: metaData.contractAddress,
                                gasPrice: gas_price,
                                data: transfer_data,
                                gasLimit: gas_limit
                            };
                            log.debug(tag, "txParams: ", txParams);
                            _a.label = 15;
                        case 15:
                            masterPathEth = "m/44'/60'/0'/0/0" //TODO moveme to support
                            ;
                            log.debug(tag, "txParams: ", txParams);
                            ethTx = {
                                addressNList: support.bip32ToAddressNList(masterPathEth),
                                nonce: web3_utils_1.numberToHex(txParams.nonce),
                                gasPrice: web3_utils_1.numberToHex(txParams.gasPrice),
                                gasLimit: web3_utils_1.numberToHex(txParams.gasLimit),
                                value: txParams.value,
                                to: txParams.to,
                                data: txParams.data,
                                chainId: 1,
                            };
                            log.debug("unsignedTxETH: ", ethTx);
                            return [4 /*yield*/, this.WALLET.ethSignTx(ethTx)];
                        case 16:
                            rawTx = _a.sent();
                            rawTx.params = txParams;
                            return [3 /*break*/, 29];
                        case 17:
                            if (!(coin === 'RUNE')) return [3 /*break*/, 21];
                            amountNative = RUNE_BASE * parseFloat(amount);
                            amountNative = parseInt(amountNative.toString());
                            //get account number
                            log.info(tag, "addressFrom: ", addressFrom);
                            return [4 /*yield*/, this.pioneerClient.instance.GetAccountInfo({ coin: 'RUNE', address: addressFrom })];
                        case 18:
                            masterInfo = _a.sent();
                            masterInfo = masterInfo.data;
                            log.info(tag, "masterInfo: ", masterInfo.data);
                            sequence = masterInfo.result.value.sequence || 0;
                            account_number = masterInfo.result.value.account_number;
                            sequence = parseInt(sequence);
                            sequence = sequence.toString();
                            txType = "thorchain/MsgSend";
                            gas = "200000";
                            fee = "3000";
                            memo_1 = transaction.memo || "";
                            unsigned = {
                                "fee": {
                                    "amount": [
                                        {
                                            "amount": fee,
                                            "denom": "rune"
                                        }
                                    ],
                                    "gas": gas
                                },
                                "memo": memo_1,
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
                            };
                            chain_id = RUNE_CHAIN;
                            if (!sequence)
                                throw Error("112: Failed to get sequence");
                            if (!account_number)
                                account_number = 0;
                            return [4 /*yield*/, this.WALLET.thorchainGetAddress({
                                    addressNList: hdwallet_core_1.bip32ToAddressNList(HD_RUNE_KEYPATH),
                                    showDisplay: false,
                                })];
                        case 19:
                            fromAddress = _a.sent();
                            log.info(tag, "fromAddressHDwallet: ", fromAddress);
                            log.info(tag, "fromAddress: ", addressFrom);
                            log.info("res: ", prettyjson.render({
                                addressNList: hdwallet_core_1.bip32ToAddressNList(HD_RUNE_KEYPATH),
                                chain_id: chain_id,
                                account_number: account_number,
                                sequence: sequence,
                                tx: unsigned,
                            }));
                            if (fromAddress !== addressFrom)
                                throw Error("Can not sign, address mismatch");
                            return [4 /*yield*/, this.WALLET.thorchainSignTx({
                                    addressNList: hdwallet_core_1.bip32ToAddressNList(HD_RUNE_KEYPATH),
                                    chain_id: chain_id,
                                    account_number: account_number,
                                    sequence: sequence,
                                    tx: unsigned,
                                })];
                        case 20:
                            res = _a.sent();
                            log.info("res: ", prettyjson.render(res));
                            log.debug("res*****: ", res);
                            txFinal = void 0;
                            txFinal = res;
                            txFinal.signatures = res.signatures;
                            log.debug("FINAL: ****** ", txFinal);
                            broadcastString = {
                                tx: txFinal,
                                type: "cosmos-sdk/StdTx",
                                mode: "sync"
                            };
                            rawTx = {
                                txid: "",
                                coin: coin,
                                serialized: JSON.stringify(broadcastString)
                            };
                            return [3 /*break*/, 29];
                        case 21:
                            if (!(coin === 'ATOM')) return [3 /*break*/, 25];
                            amountNative = ATOM_BASE * parseFloat(amount);
                            amountNative = parseInt(amountNative.toString());
                            //get account number
                            log.info(tag, "addressFrom: ", addressFrom);
                            return [4 /*yield*/, this.pioneerClient.instance.GetAccountInfo({ coin: 'ATOM', address: addressFrom })];
                        case 22:
                            masterInfo = _a.sent();
                            masterInfo = masterInfo.data;
                            log.info(tag, "masterInfo: ", masterInfo.data);
                            sequence = masterInfo.result.value.sequence;
                            account_number = masterInfo.result.value.account_number;
                            sequence = parseInt(sequence);
                            sequence = sequence.toString();
                            txType = "cosmos-sdk/MsgSend";
                            gas = "100000";
                            fee = "1000";
                            memo_2 = transaction.memo || "";
                            unsigned = {
                                "fee": {
                                    "amount": [
                                        {
                                            "amount": fee,
                                            "denom": "uatom"
                                        }
                                    ],
                                    "gas": gas
                                },
                                "memo": memo_2,
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
                            };
                            chain_id = ATOM_CHAIN;
                            if (!sequence)
                                throw Error("112: Failed to get sequence");
                            if (!account_number)
                                throw Error("113: Failed to get account_number");
                            return [4 /*yield*/, this.WALLET.cosmosGetAddress({
                                    addressNList: hdwallet_core_1.bip32ToAddressNList(HD_ATOM_KEYPATH),
                                    showDisplay: false,
                                })];
                        case 23:
                            fromAddress = _a.sent();
                            log.info(tag, "fromAddressHDwallet: ", fromAddress);
                            log.info(tag, "fromAddress: ", addressFrom);
                            log.info("res: ", prettyjson.render({
                                addressNList: hdwallet_core_1.bip32ToAddressNList(HD_ATOM_KEYPATH),
                                chain_id: chain_id,
                                account_number: account_number,
                                sequence: sequence,
                                tx: unsigned,
                            }));
                            if (fromAddress !== addressFrom)
                                throw Error("Can not sign, address mismatch");
                            return [4 /*yield*/, this.WALLET.cosmosSignTx({
                                    addressNList: hdwallet_core_1.bip32ToAddressNList(HD_ATOM_KEYPATH),
                                    chain_id: chain_id,
                                    account_number: account_number,
                                    sequence: sequence,
                                    tx: unsigned,
                                })];
                        case 24:
                            res = _a.sent();
                            log.info("res: ", prettyjson.render(res));
                            log.debug("res*****: ", res);
                            txFinal = void 0;
                            txFinal = res;
                            txFinal.signatures = res.signatures;
                            log.debug("FINAL: ****** ", txFinal);
                            broadcastString = {
                                tx: txFinal,
                                type: "cosmos-sdk/StdTx",
                                mode: "sync"
                            };
                            rawTx = {
                                txid: "",
                                coin: coin,
                                serialized: JSON.stringify(broadcastString)
                            };
                            return [3 /*break*/, 29];
                        case 25:
                            if (!(coin === "BNB")) return [3 /*break*/, 28];
                            //TODO move to tx builder module
                            //get account info
                            log.debug("addressFrom: ", addressFrom);
                            return [4 /*yield*/, this.pioneerClient.instance.GetAccountInfo({ coin: coin, address: addressFrom })];
                        case 26:
                            accountInfo = _a.sent();
                            accountInfo = accountInfo.data;
                            log.debug("accountInfo: ", prettyjson.render(accountInfo));
                            sequence = void 0;
                            account_number = void 0;
                            pubkey = void 0;
                            if (!accountInfo.result) {
                                //assume new account
                                sequence = "0";
                                account_number = "0";
                                pubkey = null;
                            }
                            else {
                                sequence = transaction.nonce || accountInfo.result.sequence;
                                account_number = accountInfo.result.account_number;
                                pubkey = accountInfo.result.public_key;
                            }
                            if (!address)
                                throw Error("Missing TO address! ");
                            bnbTx = {
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
                            };
                            log.debug(tag, "bnbTx: ", prettyjson.render(bnbTx));
                            return [4 /*yield*/, this.WALLET.binanceSignTx({
                                    addressNList: hdwallet_core_1.bip32ToAddressNList("m/44'/714'/0'/0/0"),
                                    chain_id: "Binance-Chain-Nile",
                                    account_number: account_number,
                                    sequence: sequence,
                                    tx: bnbTx,
                                })];
                        case 27:
                            signedTxResponse = _a.sent();
                            log.debug(tag, "**** signedTxResponse: ", signedTxResponse);
                            log.debug(tag, "**** signedTxResponse: ", JSON.stringify(signedTxResponse));
                            pubkeySigHex = signedTxResponse.signatures.pub_key.toString('hex');
                            log.debug(tag, "pubkeySigHex: ", pubkeySigHex);
                            rawTx = {
                                txid: signedTxResponse.txid,
                                serialized: signedTxResponse.serialized
                            };
                            return [3 /*break*/, 29];
                        case 28:
                            if (coin === "EOS") {
                                throw Error("666: EOS not supported yet!");
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
                            }
                            else if (coin === "FIO") {
                                throw Error("666: FIO not supported yet!");
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
                            }
                            else {
                                throw Error("109: coin not yet implemented! coin: " + coin);
                            }
                            _a.label = 29;
                        case 29: return [2 /*return*/, rawTx];
                        case 30:
                            e_6 = _a.sent();
                            log.error(tag, "e: ", e_6);
                            throw e_6;
                        case 31: return [2 /*return*/];
                    }
                });
            });
        };
        this.broadcastTransaction = function (coin, signedTx) {
            signedTx.coin = coin;
            return this.pioneerClient.instance.Broadcast(null, signedTx).data;
        };
    }
    return wallet;
}());
