"use strict";
/*


 */
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
var TAG = " | Pioneer network | ";
// const tokenData = require("@pioneer-platform/pioneer-eth-token-data")
var bitcoin = require("bitcoinjs-lib");
var ethUtils = require('ethereumjs-util');
var ripemd160 = require("crypto-js/ripemd160");
var CryptoJS = require("crypto-js");
var sha256 = require("crypto-js/sha256");
var bech32 = require("bech32");
// const EventEmitter = require('events');
// const emitter = new EventEmitter();
// const io = require('socket.io-client');
//crypto
var cloneCrypto = require("@pioneer-platform/utxo-crypto");
var coincap = require('@pioneer-platform/pioneer-coincap');
//networks
var tokenData = require("@pioneer-platform/pioneer-eth-token-data");
var log = require("@pioneer-platform/loggerdog")();
var networks = {
    'ETH': require('@pioneer-platform/eth-network'),
    'ATOM': require('@pioneer-platform/cosmos-network'),
    'BNB': require('@pioneer-platform/bnb-network'),
    'RUNE': require('@pioneer-platform/thor-network'),
    // 'EOS' : require('@pioneer-platform/eos-network'),
    // 'FIO' : require('@pioneer-platform/fio-network'),
    'ANY': require('@pioneer-platform/utxo-network'),
};
networks['ETH'].init();
var blockbook = require('@pioneer-platform/blockbook');
var BigNumber = require('bignumber.js');
var IS_TESTNET = false;
var PUBLIC_WALLET = {};
var prefurredScripts = {
    BTC: "p2pkh",
    LTC: "p2pkh",
    ETH: "eth",
    EOS: "eos",
    BNB: "binance",
    ATOM: "cosmos"
};
var WT_COINS = ['BTC', 'LTC', 'DASH', 'DOGE', 'BCH', 'ETH', 'EOS', 'BNB', 'ATOM'];
var WT_PUBKEYS_FORMATTED;
var BLOCKBOOK_COINS = ['BTC'];
//prescisions
var CURRENCY_DECIMALS = {
    'btc': 8,
    'dash': 8,
    'atom': 6,
    'ltc': 8,
    'doge': 8,
    'eth': 18,
    'gnt': 18,
    'usdt': 6,
    'trx': 6,
    'bnb': 8,
    'poly': 18,
    'gno': 18,
    'sngls': 0,
    'icn': 18,
    'dgd': 9,
    'mln': 18,
    'rep': 18,
    'swt': 18,
    'wings': 18,
    'trst': 6,
    'rlc': 9,
    'gup': 3,
    'ant': 18,
    'bat': 18,
    'bnt': 18,
    'snt': 18,
    'nmr': 18,
    'edg': 0,
    'eos': 18,
    'cvc': 8,
    'link': 18,
    'knc': 18,
    'mtl': 8,
    'pay': 18,
    'fun': 8,
    'dnt': 18,
    'zrx': 18,
    '1st': 18,
    'omg': 18,
    'salt': 8,
    'rcn': 18,
    'storj': 8,
    'zil': 12,
    'mana': 18,
    'tusd': 18,
    'ae': 18,
    'dai': 18,
    'mkr': 18
};
module.exports = {
    init: function (type, config, isTestnet) {
        return init_wallet(type, config, isTestnet);
    },
    getInfo: function () {
        return get_wallet_info();
    },
    getBlockHeight: function (coin) {
        return get_block_height(coin);
    },
    getBalance: function (address) {
        return get_balance(address);
    },
    getMaster: function (coin) {
        return get_address_master(coin);
    },
    getEosPubkey: function () {
        return get_eos_pubkey();
    },
    getFioPubkey: function () {
        return get_fio_pubkey();
    },
    getFioActor: function (pubkey) {
        return get_fio_actor_from_pubkey(pubkey);
    },
    // getEosAccountsByPubkey: function (pubkey:string) {
    //     return get_eos_accounts_by_pubkey(pubkey);
    // },
    getFioAccountsByPubkey: function (pubkey) {
        return get_fio_accounts_by_pubkey(pubkey);
    },
    validateEosUsername: function (username) {
        return validate_EOS_username(username);
    },
    validateFioUsername: function (username) {
        return validate_FIO_username(username);
    },
    getAddress: function (coin, account, index, isChange) {
        return get_address(coin, account, index, isChange);
    },
    getNewAddress: function (coin) {
        return get_new_address(coin);
    },
    multiBalanceHistory: function (coin) {
        return balance_history(coin);
    },
    createUnsignedTransaction: function (unsignedUtxoRequest) {
        return create_unsigned_transaction(unsignedUtxoRequest);
    },
    broadcast: function (coin, tx) {
        return broadcast_transaction(coin, tx);
    },
};
var get_fio_actor_from_pubkey = function (publicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, account;
        return __generator(this, function (_a) {
            tag = TAG + " | get_fio_actor_from_pubkey | ";
            try {
                account = networks['FIO'].getActor(publicKey);
                log.debug(tag, "account: ", account);
                return [2 /*return*/, account];
            }
            catch (e) {
                log.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
var get_fio_accounts_by_pubkey = function (publicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, accounts;
        return __generator(this, function (_a) {
            tag = TAG + " | get_eos_pubkey | ";
            try {
                accounts = [];
                try {
                    accounts = networks['FIO'].getAccounts(publicKey);
                    log.debug(tag, "accounts: ", accounts);
                }
                catch (e) {
                    //no accounts found (wtf 404?)
                }
                return [2 /*return*/, accounts];
            }
            catch (e) {
                log.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
// const get_eos_accounts_by_pubkey = async function (publicKey:string) {
//     let tag = TAG + " | get_eos_pubkey | "
//     try {
//
//         let account = networks['EOS'].getAccountsFromPubkey(publicKey)
//         log.debug(tag,"account: ",account)
//
//
//         return account
//     } catch (e) {
//         log.error(tag, "e: ", e)
//     }
// }
var get_fio_pubkey = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output;
        return __generator(this, function (_a) {
            tag = TAG + " | get_eos_pubkey | ";
            try {
                log.debug(tag, "checkpoint");
                output = PUBLIC_WALLET['FIO'].pubkey;
                log.debug(tag, "output: ", output);
                return [2 /*return*/, output];
            }
            catch (e) {
                log.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
var get_eos_pubkey = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output;
        return __generator(this, function (_a) {
            tag = TAG + " | get_eos_pubkey | ";
            try {
                log.debug(tag, "checkpoint");
                output = PUBLIC_WALLET['EOS'].pubkey;
                log.debug(tag, "output: ", output);
                return [2 /*return*/, output];
            }
            catch (e) {
                log.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
var validate_FIO_username = function (username) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | validate_FIO_username | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, networks['FIO'].getAccount(username)
                        // log.debug(tag,"isAvailable: ",isAvailable)
                    ];
                case 2:
                    output = _a.sent();
                    // log.debug(tag,"isAvailable: ",isAvailable)
                    return [2 /*return*/, output];
                case 3:
                    e_1 = _a.sent();
                    log.error(tag, "e: ", e_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var validate_EOS_username = function (username) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | validate_EOS_username | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, networks['EOS'].getAccount(username)
                        // log.debug(tag,"isAvailable: ",isAvailable)
                    ];
                case 2:
                    output = _a.sent();
                    // log.debug(tag,"isAvailable: ",isAvailable)
                    return [2 /*return*/, output];
                case 3:
                    e_2 = _a.sent();
                    log.error(tag, "e: ", e_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var balance_history = function (coin) {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | balance_history | ";
            try {
                return [2 /*return*/, "TODO"];
            }
            catch (e) {
                log.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
var create_unsigned_transaction = function (unsignedUtxoRequest) {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | create_unsigned_transaction | ";
            try {
                return [2 /*return*/, "TODO"];
            }
            catch (e) {
                log.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
var get_new_address = function (coin) {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | get_new_address | ";
            try {
                return [2 /*return*/, "TODO"];
            }
            catch (e) {
                log.error(tag, "e: ", e);
            }
            return [2 /*return*/];
        });
    });
};
var get_block_height = function (coin) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, result, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | broadcast_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, networks[coin].getBlockHeight()];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 3:
                    e_3 = _a.sent();
                    log.error(tag, "e: ", e_3);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var broadcast_transaction = function (coin, tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, result, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | broadcast_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, networks[coin].broadcast(tx.serialized)];
                case 2:
                    result = _a.sent();
                    return [2 /*return*/, result];
                case 3:
                    e_4 = _a.sent();
                    log.error(tag, "e: ", e_4);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
function bech32ify(address, prefix) {
    var words = bech32.toWords(address);
    return bech32.encode(prefix, words);
}
// NOTE: this only works with a compressed public key (33 bytes)
function createBech32Address(publicKey, prefix) {
    var message = CryptoJS.enc.Hex.parse(publicKey.toString("hex"));
    var hash = ripemd160(sha256(message)).toString();
    var address = Buffer.from(hash, "hex");
    var cosmosAddress = bech32ify(address, prefix);
    return cosmosAddress;
}
/*
    Watch only wallet compatible!
 */
var get_address = function (coin, account, index, isChange) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, publicKey, _a, e_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tag = TAG + " | get_address | ";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 20, , 21]);
                    log.info(tag, "get_address: ", { coin: coin, account: account, index: index, isChange: isChange });
                    output = void 0;
                    //if xpub get next unused
                    if (!PUBLIC_WALLET[coin]) {
                        log.error(tag, "Error: ", coin);
                        throw Error("unknown coin!: " + coin);
                    }
                    if (!(PUBLIC_WALLET[coin].type === 'xpub')) return [3 /*break*/, 18];
                    publicKey = bitcoin.bip32.fromBase58(PUBLIC_WALLET[coin].pubkey).derive(account).derive(index).publicKey;
                    log.debug("publicKey: ********* ", publicKey);
                    //if token
                    if (tokenData.tokens.indexOf(coin) >= 0) {
                        coin = 'ETH';
                    }
                    _a = coin;
                    switch (_a) {
                        case 'BTC': return [3 /*break*/, 2];
                        case 'BCH': return [3 /*break*/, 4];
                        case 'DOGE': return [3 /*break*/, 6];
                        case 'DASH': return [3 /*break*/, 8];
                        case 'LTC': return [3 /*break*/, 10];
                        case 'ETH': return [3 /*break*/, 12];
                        case 'RUNE': return [3 /*break*/, 13];
                        case 'ATOM': return [3 /*break*/, 14];
                        case 'BNB': return [3 /*break*/, 15];
                    }
                    return [3 /*break*/, 16];
                case 2: return [4 /*yield*/, cloneCrypto.generateAddress('BTC', publicKey, 'bech32')];
                case 3:
                    //TODO more types
                    output = _b.sent();
                    return [3 /*break*/, 17];
                case 4: return [4 /*yield*/, cloneCrypto.generateAddress('BCH', publicKey, 'p2sh')];
                case 5:
                    //TODO more types
                    output = _b.sent();
                    return [3 /*break*/, 17];
                case 6: return [4 /*yield*/, cloneCrypto.generateAddress('DOGE', publicKey, 'bech32')];
                case 7:
                    //TODO more types
                    output = _b.sent();
                    return [3 /*break*/, 17];
                case 8: return [4 /*yield*/, cloneCrypto.generateAddress('DASH', publicKey, 'bech32')];
                case 9:
                    //TODO more types
                    output = _b.sent();
                    return [3 /*break*/, 17];
                case 10: return [4 /*yield*/, cloneCrypto.generateAddress('LTC', publicKey, 'bech32')];
                case 11:
                    //TODO more types
                    output = _b.sent();
                    return [3 /*break*/, 17];
                case 12:
                    output = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey, true));
                    return [3 /*break*/, 17];
                case 13:
                    // code block
                    output = createBech32Address(publicKey, 'tthor');
                    return [3 /*break*/, 17];
                case 14:
                    // code block
                    output = createBech32Address(publicKey, 'cosmos');
                    return [3 /*break*/, 17];
                case 15:
                    // code block
                    log.debug("pubkey: ", publicKey);
                    output = createBech32Address(publicKey, 'bnb');
                    return [3 /*break*/, 17];
                case 16: throw Error("coin not yet implemented ! coin: " + coin);
                case 17:
                    log.debug(tag, "output: ", output);
                    return [3 /*break*/, 19];
                case 18:
                    if (PUBLIC_WALLET[coin].master) {
                        output = PUBLIC_WALLET[coin].master;
                    }
                    else if (PUBLIC_WALLET[coin].address) {
                        output = PUBLIC_WALLET[coin].address;
                    }
                    else {
                        throw Error("invalid pubkey info");
                    }
                    _b.label = 19;
                case 19: return [2 /*return*/, output];
                case 20:
                    e_5 = _b.sent();
                    log.error(tag, "e: ", e_5);
                    return [3 /*break*/, 21];
                case 21: return [2 /*return*/];
            }
        });
    });
};
/*
    Get address given index and account

    Watch only wallet compatible!
 */
var get_address_master = function (coin) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_address_master | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    output = void 0;
                    if (!(coin === "EOS")) return [3 /*break*/, 2];
                    // log.debug(tag,"pubkey: ",PUBLIC_WALLET[coin].pubkey)
                    //
                    // let account = await networks['EOS'].getAccountsFromPubkey(PUBLIC_WALLET[coin].pubkey)
                    // log.debug(tag,"account: ",account)
                    //
                    // if(!account.account_names[0]){
                    //     output = "No Accounts Found!"
                    // }else{
                    //     output = account.account_names[0]
                    // }
                    output = "TODO-EOS";
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, get_address(coin, 0, 0, false)];
                case 3:
                    output = _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, output];
                case 5:
                    e_6 = _a.sent();
                    log.error(tag, "e: ", e_6);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
};
var get_balance = function (coin) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, master, master, master, master, master, master, master, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_balance | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 24, , 25]);
                    log.debug("coin detected: ", coin);
                    output = void 0;
                    if (!(coin === "ETH")) return [3 /*break*/, 4];
                    log.debug("ETH detected ");
                    return [4 /*yield*/, get_address_master('ETH')];
                case 2:
                    master = _a.sent();
                    return [4 /*yield*/, networks['ETH'].getBalanceAddress(master)];
                case 3:
                    output = _a.sent();
                    return [3 /*break*/, 23];
                case 4:
                    if (!(tokenData.tokens.indexOf(coin) >= 0 && coin !== 'EOS')) return [3 /*break*/, 7];
                    log.debug("token detected ");
                    return [4 /*yield*/, get_address_master('ETH')];
                case 5:
                    master = _a.sent();
                    return [4 /*yield*/, networks['ETH'].getBalanceToken(master, coin)];
                case 6:
                    output = _a.sent();
                    return [3 /*break*/, 23];
                case 7:
                    if (!(coin === 'ATOM')) return [3 /*break*/, 10];
                    return [4 /*yield*/, get_address_master('ATOM')];
                case 8:
                    master = _a.sent();
                    return [4 /*yield*/, networks[coin].getBalance(master)];
                case 9:
                    output = _a.sent();
                    return [3 /*break*/, 23];
                case 10:
                    if (!(coin === 'RUNE')) return [3 /*break*/, 13];
                    return [4 /*yield*/, get_address_master('RUNE')];
                case 11:
                    master = _a.sent();
                    return [4 /*yield*/, networks[coin].getBalance(master)];
                case 12:
                    output = _a.sent();
                    return [3 /*break*/, 23];
                case 13:
                    if (!(coin === 'BNB')) return [3 /*break*/, 16];
                    return [4 /*yield*/, get_address_master('BNB')];
                case 14:
                    master = _a.sent();
                    return [4 /*yield*/, networks[coin].getBalance(master)];
                case 15:
                    output = _a.sent();
                    output = output.free;
                    return [3 /*break*/, 23];
                case 16:
                    if (!(coin === 'EOS')) return [3 /*break*/, 19];
                    return [4 /*yield*/, get_address_master('EOS')];
                case 17:
                    master = _a.sent();
                    log.debug("master: ", master);
                    return [4 /*yield*/, networks[coin].getBalance(master)];
                case 18:
                    output = _a.sent();
                    if (output.success === false) {
                        output = 0;
                    }
                    return [3 /*break*/, 23];
                case 19:
                    if (!(coin === 'FIO')) return [3 /*break*/, 22];
                    return [4 /*yield*/, get_address_master('FIO')];
                case 20:
                    master = _a.sent();
                    log.debug("master: ", master);
                    return [4 /*yield*/, networks[coin].getBalance(master)];
                case 21:
                    output = _a.sent();
                    if (output.success === false) {
                        output = 0;
                    }
                    return [3 /*break*/, 23];
                case 22:
                    log.error("Coin not yet implemented!");
                    _a.label = 23;
                case 23: return [2 /*return*/, output];
                case 24:
                    e_7 = _a.sent();
                    log.error(tag, "e: ", e_7);
                    return [3 /*break*/, 25];
                case 25: return [2 /*return*/];
            }
        });
    });
};
function divideBy10ToTheNthAndRoundDown(n, num) {
    return num.dividedBy(new BigNumber(10).exponentiatedBy(n)).decimalPlaces(8, BigNumber.ROUND_DOWN);
}
var get_wallet_info = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, syncStatus, txCount, masters, balances, valueUsds, coinInfo, stakes, startTime, coins, i, coin, balance, i, coin, pubkeyInfo, _a, _b, balanceRUNE, e_8, balanceATOM, e_9, balanceBNB, e_10, totalUsd, endTime, duration, e_11;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tag = TAG + " | get_wallet_info | ";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 24, , 25]);
                    output = {};
                    syncStatus = {};
                    txCount = {};
                    masters = {};
                    balances = {};
                    valueUsds = {};
                    coinInfo = {};
                    stakes = {};
                    startTime = new Date().getTime();
                    //pubkeys
                    output.isTestnet = IS_TESTNET;
                    output.public = PUBLIC_WALLET;
                    coins = Object.keys(PUBLIC_WALLET);
                    log.debug(tag, "coins: ", coins);
                    i = 0;
                    _c.label = 2;
                case 2:
                    if (!(i < BLOCKBOOK_COINS.length)) return [3 /*break*/, 5];
                    coin = BLOCKBOOK_COINS[i];
                    return [4 /*yield*/, blockbook.getBalanceByXpub(coin, PUBLIC_WALLET[coin].xpub)
                        //get balance by xpub
                    ];
                case 3:
                    balance = _c.sent();
                    //get balance by xpub
                    balances[coin] = balance;
                    _c.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5:
                    i = 0;
                    _c.label = 6;
                case 6:
                    if (!(i < coins.length)) return [3 /*break*/, 9];
                    coin = coins[i];
                    log.debug("coin: ", coin);
                    pubkeyInfo = PUBLIC_WALLET[coin];
                    log.debug(tag, "pubkeyInfo: ", pubkeyInfo);
                    _a = masters;
                    _b = coin;
                    return [4 /*yield*/, get_address_master(coin)];
                case 7:
                    _a[_b] = _c.sent();
                    _c.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 6];
                case 9:
                    _c.trys.push([9, 12, , 13]);
                    if (!PUBLIC_WALLET['RUNE']) return [3 /*break*/, 11];
                    return [4 /*yield*/, get_balance('RUNE')];
                case 10:
                    balanceRUNE = _c.sent();
                    if (balanceRUNE) {
                        balances['RUNE'] = balanceRUNE;
                    }
                    else {
                        balances['RUNE'] = 0;
                    }
                    masters['RUNE'] = PUBLIC_WALLET['RUNE'].master;
                    valueUsds['RUNE'] = "";
                    coinInfo['RUNE'] = "";
                    _c.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    e_8 = _c.sent();
                    console.error("Failed to get ATOM balances! for account: ", PUBLIC_WALLET['ATOM']);
                    return [3 /*break*/, 13];
                case 13:
                    _c.trys.push([13, 16, , 17]);
                    if (!PUBLIC_WALLET['ATOM']) return [3 /*break*/, 15];
                    return [4 /*yield*/, get_balance('ATOM')];
                case 14:
                    balanceATOM = _c.sent();
                    if (balanceATOM) {
                        balances['ATOM'] = balanceATOM;
                    }
                    else {
                        balances['ATOM'] = 0;
                    }
                    masters['ATOM'] = PUBLIC_WALLET['ATOM'].master;
                    valueUsds['ATOM'] = "";
                    coinInfo['ATOM'] = "";
                    _c.label = 15;
                case 15: return [3 /*break*/, 17];
                case 16:
                    e_9 = _c.sent();
                    console.error("Failed to get ATOM balances! for account: ", PUBLIC_WALLET['ATOM']);
                    return [3 /*break*/, 17];
                case 17:
                    /*
                           EOS asset info
            
                     */
                    try {
                        // if(PUBLIC_WALLET['EOS']){
                        //get registered accounts
                        // let master = await get_address_master('EOS')
                        // masters['EOS'] = master
                        masters['EOS'] = "n/a";
                        valueUsds['EOS'] = "";
                        coinInfo['EOS'] = "";
                        balances['EOS'] = 0;
                        //     const balanceEOS = await get_balance('EOS')
                        //     log.debug(tag,"balanceEOS: ",balanceEOS)
                        //
                        //     if(balanceEOS){
                        //         balances['EOS'] = parseFloat(balanceEOS)
                        //     } else {
                        //         balances['EOS'] = 0
                        //     }
                        //
                        //     let stakeInfo:any = {}
                        //     stakeInfo.pubkey = PUBLIC_WALLET['EOS'].pubkey
                        //     //get eos accounts by username
                        //     log.debug(tag,"pubkey: ",PUBLIC_WALLET['EOS'].pubkey)
                        //     let accountsFromPubkey = await networks['EOS'].getAccountsFromPubkey(PUBLIC_WALLET['EOS'].pubkey)
                        //     log.debug(tag,"accountsFromPubkey: ",accountsFromPubkey)
                        //     if(accountsFromPubkey.account_names.length > 0){
                        //         stakeInfo.usernames = accountsFromPubkey.account_names
                        //         //get staking positions
                        //         for(let i = 0; i < accountsFromPubkey.account_names.length; i++){
                        //             let username = accountsFromPubkey[i]
                        //             stakeInfo.accounts = await networks['EOS'].getAccount(username)
                        //         }
                        //     }
                        //     log.debug(tag,"stakeInfo: ",stakeInfo)
                        //     stakes['EOS'] = stakeInfo
                        // }
                    }
                    catch (e) {
                        console.error("Failed to get EOS info! for account: ", PUBLIC_WALLET['EOS']);
                    }
                    _c.label = 18;
                case 18:
                    _c.trys.push([18, 21, , 22]);
                    if (!PUBLIC_WALLET['BNB']) return [3 /*break*/, 20];
                    return [4 /*yield*/, get_balance('BNB')];
                case 19:
                    balanceBNB = _c.sent();
                    if (balanceBNB) {
                        masters['BNB'] = PUBLIC_WALLET['BNB'].pubkey;
                        balances['BNB'] = balanceBNB;
                        valueUsds['BNB'] = "";
                        coinInfo['BNB'] = "";
                    }
                    _c.label = 20;
                case 20: return [3 /*break*/, 22];
                case 21:
                    e_10 = _c.sent();
                    console.error("Failed to get BNB balances! for account: ", PUBLIC_WALLET['BNB']);
                    return [3 /*break*/, 22];
                case 22: return [4 /*yield*/, coincap.valuePortfolio(balances)];
                case 23:
                    /*
                        ETH asset info
            
                      */
                    // try{
                    //     if(PUBLIC_WALLET['ETH']){
                    //         const balanceETH = await get_balance('ETH')
                    //
                    //         if(balanceETH){
                    //             masters['ETH'] = PUBLIC_WALLET['ETH'].pubkey
                    //             balances['ETH'] = balanceETH
                    //             valueUsds['ETH'] = ""
                    //             coinInfo['ETH'] = ""
                    //         }
                    //
                    //         //balances
                    //         log.debug(tag,"PUBLIC_WALLET: ",PUBLIC_WALLET['ETH'])
                    //         log.debug(tag,"eth master: ",PUBLIC_WALLET['ETH'].master)
                    //         let ethInfo = await networks['ETH'].getBalanceTokens(PUBLIC_WALLET['ETH'].master)
                    //         log.debug(tag,"ethInfo: ",ethInfo)
                    //
                    //         //for each token use eth master
                    //         for(let i = 0; i < tokenData.tokens.length; i++){
                    //             let token:string = tokenData.tokens[i]
                    //             //only there if a balance
                    //             if(ethInfo.balances[token]){
                    //                 balances[token] = await get_balance(token)
                    //             } else {
                    //                 balances[token] = 0
                    //             }
                    //             masters[token] = await get_address_master('ETH')
                    //             valueUsds[token] = ethInfo.valueUsds[token]
                    //             coinInfo[token] = ethInfo.coinInfo[token]
                    //         }
                    //     }
                    // }catch(e){
                    //     console.error("Failed to get ETH TOKEN balances! for account: ",PUBLIC_WALLET['ETH'], e)
                    // }
                    valueUsds = _c.sent();
                    log.debug(tag, "valueUsds: ", valueUsds);
                    totalUsd = valueUsds.total;
                    valueUsds = valueUsds.values;
                    endTime = new Date().getTime();
                    duration = endTime - startTime;
                    log.debug(tag, "duration: ", duration);
                    output.totalValueUsd = totalUsd;
                    output.duration = duration;
                    output.masters = masters;
                    output.txCount = txCount;
                    output.balances = balances;
                    output.valueUsds = valueUsds;
                    output.coinInfo = coinInfo;
                    output.syncStatus = syncStatus;
                    output.stakes = stakes;
                    return [2 /*return*/, output];
                case 24:
                    e_11 = _c.sent();
                    log.error(tag, "e: ", e_11);
                    return [3 /*break*/, 25];
                case 25: return [2 /*return*/];
            }
        });
    });
};
var init_wallet = function (type, config, isTestnet) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, formatted, coins, i, coin, pubKeyInfo, e_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | init_wallet | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.debug("Checkpoint1  ", config);
                    if (isTestnet)
                        IS_TESTNET = true;
                    return [4 /*yield*/, blockbook.init()
                        //pubkeys
                    ];
                case 2:
                    _a.sent();
                    //pubkeys
                    PUBLIC_WALLET = config.pubkeys;
                    formatted = [];
                    coins = Object.keys(PUBLIC_WALLET);
                    //
                    for (i = 0; i < coins.length; i++) {
                        coin = coins[i];
                        pubKeyInfo = PUBLIC_WALLET[coin];
                        pubKeyInfo.symbol = pubKeyInfo.coin;
                        if (!pubKeyInfo.script_type)
                            throw Error("102: missing script_type");
                        //pubKeyInfo.script_type = prefurredScripts[coin]
                        log.debug("pubKeyInfo: ", pubKeyInfo);
                        if (coin === 'BNB' || coin === 'ATOM') {
                            pubKeyInfo.xpub = pubKeyInfo.master;
                            console.log("pubKeyInfo: ", pubKeyInfo.xpub);
                        }
                        formatted.push(pubKeyInfo);
                    }
                    return [2 /*return*/, true];
                case 3:
                    e_12 = _a.sent();
                    log.error(tag, "e: ", e_12);
                    throw e_12;
                case 4: return [2 /*return*/];
            }
        });
    });
};
