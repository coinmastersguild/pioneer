"use strict";
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
/*
    Multisig Crypto gen

 */
var bip39 = require("bip39");
var bip32 = require("bip32");
var secp256k1 = require("secp256k1");
var CryptoJS = require("crypto-js");
var HDKey = require('hdkey');
var bitcoin = require("bitcoinjs-lib");
var log = require('@pioneer-platform/loggerdog')();
var b58 = require('bs58check');
var BIP84 = require('bip84');
/**********************************
 // Module
 //**********************************/
var COIN_SUPPORT_ENUM;
(function (COIN_SUPPORT_ENUM) {
    COIN_SUPPORT_ENUM[COIN_SUPPORT_ENUM["BTC"] = 0] = "BTC";
    COIN_SUPPORT_ENUM[COIN_SUPPORT_ENUM["BCH"] = 1] = "BCH";
    COIN_SUPPORT_ENUM[COIN_SUPPORT_ENUM["DASH"] = 2] = "DASH";
    COIN_SUPPORT_ENUM[COIN_SUPPORT_ENUM["DGB"] = 3] = "DGB";
    COIN_SUPPORT_ENUM[COIN_SUPPORT_ENUM["DOGE"] = 4] = "DOGE";
    COIN_SUPPORT_ENUM[COIN_SUPPORT_ENUM["LTC"] = 5] = "LTC";
    COIN_SUPPORT_ENUM[COIN_SUPPORT_ENUM["RDD"] = 6] = "RDD";
})(COIN_SUPPORT_ENUM || (COIN_SUPPORT_ENUM = {}));
var COIN_SUPPORT = [
    'BTC',
    // 'BCH',
    // 'DASH',
    // 'DGB',
    // 'DOGE',
    // 'LTC',
    // 'RDD',
];
var SLIP_44 = {
    BTC: 0,
    BCH: 145,
    LTC: 2,
    DOGE: 3,
    RDD: 4,
    DASH: 5,
    DGB: 20
};
var NETWORKS = {
    btc: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },
    bch: {
        messagePrefix: '\x18Bitcoin Cash Signed Message:\n',
        bip32: {
            public: 0x0488B21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x00,
        scriptHash: 0x05,
        wif: 0x80
    },
    test: {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'tb',
        bip32: {
            public: 0x043587cf,
            private: 0x04358394
        },
        pubKeyHash: 0x6f,
        scriptHash: 0xc4,
        wif: 0xef
    },
    ltc: {
        messagePrefix: '\x19Litecoin Signed Message:\n',
        bip32: {
            public: 0x019da462,
            private: 0x019d9cfe
        },
        pubKeyHash: 0x30,
        scriptHash: 0x32,
        wif: 0xb0
    },
    doge: {
        messagePrefix: '\x19Dogecoin Signed Message:\n',
        bip32: {
            public: 0x02FD3929,
            private: 0x02FD3955
        },
        pubKeyHash: 0x1e,
        scriptHash: 0x16,
        wif: 0x9e
    },
    dash: {
        messagePrefix: 'unused',
        bip32: {
            public: 0x0488b21e,
            private: 0x0488ade4
        },
        pubKeyHash: 0x4c,
        scriptHash: 0x10,
        wif: 0xcc
    },
    dgb: {
        messagePrefix: '\x18DigiByte Signed Message:\n',
        bip32: {
            public: 0x0488B21E,
            private: 0x0488ADE4,
        },
        pubKeyHash: 0x1e,
        scriptHash: 0x3f,
        wif: 0x80,
    },
    rdd: {
        messagePrefix: '\x18Reddcoin Signed Message:\n',
        bip32: {
            public: 0x0488B21E,
            private: 0x0488ADE4,
        },
        pubKeyHash: 0x3d,
        scriptHash: 0x05,
        wif: 0xbd,
    }
};
// All known xpub formats
var prefixes = new Map([
    ['xpub', '0488b21e'],
    ['ypub', '049d7cb2'],
    ['Ypub', '0295b43f'],
    ['zpub', '04b24746'],
    ['Zpub', '02aa7ed3'],
    ['tpub', '043587cf'],
    ['upub', '044a5262'],
    ['Upub', '024289ef'],
    ['vpub', '045f1cf6'],
    ['Vpub', '02575483'],
    ['Ltub', '02575483'],
]);
var AddressTypes;
(function (AddressTypes) {
    AddressTypes[AddressTypes["bech32"] = 0] = "bech32";
    AddressTypes[AddressTypes["legacy"] = 1] = "legacy";
})(AddressTypes || (AddressTypes = {}));
module.exports = {
    xpubConvert: function (xpub, target) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                if (!prefixes.has(target)) {
                    return [2 /*return*/, "Invalid target version"];
                }
                // trim whitespace
                xpub = xpub.trim();
                data = b58.decode(xpub);
                data = data.slice(4);
                data = Buffer.concat([Buffer.from(prefixes.get(target), 'hex'), data]);
                return [2 /*return*/, b58.encode(data)];
            });
        });
    },
    generateAddressZpub: function (zpub, index, isChange, type) {
        return __awaiter(this, void 0, void 0, function () {
            var account1, address;
            return __generator(this, function (_a) {
                account1 = new BIP84.fromZPub(zpub);
                address = account1.getAddress(index, isChange);
                return [2 /*return*/, address];
            });
        });
    },
    generatePubkey: function (xpub, index, isChange, type) {
        return __awaiter(this, void 0, void 0, function () {
            var account, publicKey;
            return __generator(this, function (_a) {
                account = 1;
                publicKey = bitcoin.bip32.fromBase58(xpub).derive(account).derive(index).publicKey;
                log.debug("publicKey: ", publicKey);
                return [2 /*return*/, publicKey.toString("hex")];
            });
        });
    },
    generateAddress: function (coin, pubkey, type) {
        return __awaiter(this, void 0, void 0, function () {
            var output, address_1, address_2, address;
            return __generator(this, function (_a) {
                switch (coin) {
                    case 'BTC':
                        //if no type default to bech32
                        if (!type)
                            type = 'bech32';
                        if (type === 'bech32') {
                            address_1 = bitcoin.payments.p2wpkh({ pubkey: Buffer.from(pubkey, 'hex') }).address;
                            output = address_1;
                        }
                        else if (type === 'legacy') {
                            address_2 = bitcoin.payments.p2pkh({ pubkey: Buffer.from(pubkey, 'hex') }).address;
                            output = address_2;
                        }
                        break;
                    default:
                        if (!NETWORKS[coin.toLowerCase()])
                            throw Error("103: unknown coin, no network found! coin: " + coin);
                        address = bitcoin.payments.p2pkh({
                            pubkey: Buffer.from(pubkey, 'hex'),
                            network: NETWORKS[coin.toLowerCase()]
                        }).address;
                        output = address;
                        break;
                }
                return [2 /*return*/, output];
            });
        });
    },
    generateMultiSigAddress: function (pubkeys, m) {
        return __awaiter(this, void 0, void 0, function () {
            var address;
            return __generator(this, function (_a) {
                address = bitcoin.payments.p2wsh({
                    redeem: bitcoin.payments.p2ms({ m: m, pubkeys: pubkeys }),
                }).address;
                return [2 /*return*/, address];
            });
        });
    },
    generateAddressPrivkey: function (mnemonic, path) {
        return __awaiter(this, void 0, void 0, function () {
            var seed, mk, privateKey, publicKey;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bip39.mnemonicToSeed(mnemonic)];
                    case 1:
                        seed = _a.sent();
                        mk = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
                        //parse path
                        // "m/44'/714'/0'/0/093"
                        mk = mk.derive(path);
                        privateKey = mk.privateKey;
                        publicKey = mk.publicKey;
                        //let address = createBNBAddress(mk.publicKey)
                        return [2 /*return*/, { privateKey: privateKey, publicKey: publicKey }];
                }
            });
        });
    },
    generateWalletFromSeed: function (mnemonic) {
        return __awaiter(this, void 0, void 0, function () {
            var output, i, coin, path, _a, masterKey, xpub, _b, privateKey, publicKey, addressMaster, address, address, coinInfo;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        output = {
                            coins: {}
                        };
                        i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(i < COIN_SUPPORT.length)) return [3 /*break*/, 4];
                        coin = COIN_SUPPORT[i];
                        path = "m/44'/" + SLIP_44[coin] + "'/0'";
                        return [4 /*yield*/, deriveMasterKey(mnemonic, path)
                            //
                        ];
                    case 2:
                        _a = _c.sent(), masterKey = _a.masterKey, xpub = _a.xpub;
                        _b = deriveKeypair(masterKey, path), privateKey = _b.privateKey, publicKey = _b.publicKey;
                        addressMaster = "";
                        if (coin === "BTC") {
                            address = bitcoin.payments.p2wpkh({ pubkey: publicKey, network: NETWORKS[coin.toLowerCase()] }).address;
                            addressMaster = address;
                        }
                        else {
                            address = bitcoin.payments.p2pkh({ pubkey: publicKey, network: NETWORKS[coin.toLowerCase()] }).address;
                            addressMaster = address;
                        }
                        log.debug(addressMaster);
                        coinInfo = {
                            coin: coin,
                            master: addressMaster,
                            privateKey: privateKey.toString('hex'),
                            publicKey: publicKey.toString("hex"),
                            xpub: xpub
                        };
                        // if(coin === "BTC"){
                        //     let root = new BIP84.fromSeed(mnemonic)
                        //     let child0 = root.deriveAccount(0)
                        //     let account0 = new BIP84.fromZPrv(child0)
                        //     let zpub = account0.getAccountPublicKey()
                        //     coinInfo.zpub = zpub
                        // }
                        log.debug({ coinInfo: coinInfo });
                        output.coins[coin] = coinInfo;
                        _c.label = 3;
                    case 3:
                        i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/, output];
                }
            });
        });
    },
    generateSeedFromHash: function (hash) {
        var randomBytesFunc = standardRandomBytesFunc;
        var randomBytes = Buffer.from(randomBytesFunc(hash), "hex");
        if (randomBytes.length !== 32)
            throw Error("Entropy has incorrect length");
        var mnemonic = bip39.entropyToMnemonic(randomBytes.toString("hex"));
        return mnemonic;
    },
    generateSeed: function () {
        var randomBytesFunc = standardRandomBytesFunc;
        var randomBytes = Buffer.from(randomBytesFunc(32), "hex");
        if (randomBytes.length !== 32)
            throw Error("Entropy has incorrect length");
        var mnemonic = bip39.entropyToMnemonic(randomBytes.toString("hex"));
        return mnemonic;
    },
};
//get Xpub
function standardRandomBytesFunc(size) {
    /* istanbul ignore if: not testable on node */
    return CryptoJS.lib.WordArray.random(size).toString();
}
function deriveMasterKey(mnemonic, path) {
    return __awaiter(this, void 0, void 0, function () {
        var seed, mk, xpub, publicKey, masterKey;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // throws if mnemonic is invalid
                    bip39.validateMnemonic(mnemonic);
                    return [4 /*yield*/, bip39.mnemonicToSeed(mnemonic)
                        // let masterKey =  new HDKey.fromMasterSeed(new Buffer(seed, 'hex'), coininfo(network).versions.bip32.versions)
                        // log.debug("masterKey: ",masterKey)
                    ];
                case 1:
                    seed = _a.sent();
                    mk = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
                    log.debug(mk.publicExtendedKey);
                    //get key
                    mk = mk.derive(path);
                    log.debug(mk.publicExtendedKey);
                    xpub = mk.publicExtendedKey;
                    log.debug("xpub: ", xpub);
                    publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).derive(0).publicKey;
                    log.debug("publicKey: ", publicKey);
                    masterKey = bip32.fromSeed(seed);
                    return [2 /*return*/, { masterKey: masterKey, xpub: xpub }];
            }
        });
    });
}
function deriveKeypair(masterKey, path) {
    var master = masterKey.derivePath(path);
    var privateKey = master.privateKey;
    var publicKey = secp256k1.publicKeyCreate(privateKey, true);
    return {
        privateKey: privateKey,
        publicKey: publicKey
    };
}
