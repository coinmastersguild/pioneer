"use strict";
/*

    Ethereum Crypto


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
var bip39 = require("bip39");
var bip32 = require("bip32");
var bech32 = require("bech32");
var secp256k1 = require("secp256k1");
var sha256 = require("crypto-js/sha256");
var ripemd160 = require("crypto-js/ripemd160");
var CryptoJS = require("crypto-js");
var HDKey = require('hdkey');
//const coininfo = require('coininfo')
var hdPathEth = "m/44'/60'/0'/0/0"; // ETH
var bitcoin = require("bitcoinjs-lib");
var ethUtils = require('ethereumjs-util');
var log = require('@pioneer-platform/loggerdog')();
/**********************************
 // Module
 //**********************************/
module.exports = {
    generateAddress: function (xpub, index, isChange) {
        return __awaiter(this, void 0, void 0, function () {
            var account, publicKey, address;
            return __generator(this, function (_a) {
                account = 0;
                if (isChange)
                    account = 0;
                publicKey = bitcoin.bip32.fromBase58(xpub).derive(account).publicKey;
                //let publicKey = bitcoin.bip32.fromBase58(xpub).publicKey
                log.debug("publicKey: ", publicKey);
                address = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey, true));
                return [2 /*return*/, address];
            });
        });
    },
    generateWalletFromSeed: function (mnemonic) {
        return __awaiter(this, void 0, void 0, function () {
            var seed, mk, xpub, xpriv, publicKey, privateKey, address, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, bip39.mnemonicToSeed(mnemonic)
                            // let masterKey =  new HDKey.fromMasterSeed(new Buffer(seed, 'hex'), coininfo(network).versions.bip32.versions)
                            // log.debug("masterKey: ",masterKey)
                        ];
                    case 1:
                        seed = _a.sent();
                        mk = new HDKey.fromMasterSeed(Buffer.from(seed, 'hex'));
                        log.debug(mk.publicExtendedKey);
                        //get Eth key
                        mk = mk.derive("m/44'/60'/0'");
                        log.debug(mk.publicExtendedKey);
                        xpub = mk.publicExtendedKey;
                        xpriv = mk.privateExtendedKey;
                        log.debug("xpub: ", xpub);
                        publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).derive(0).publicKey;
                        privateKey = bitcoin.bip32.fromBase58(xpriv).derive(0).derive(0).privateKey;
                        // let publicKey = bitcoin.bip32.fromBase58(xpub).derive(0).derive(0).publicKey
                        // let privateKey = bitcoin.bip32.fromBase58(xpriv).derive(0).derive(0).privateKey
                        log.debug("publicKey: ", publicKey);
                        log.debug("privateKey: ", ethUtils.bufferToHex(privateKey));
                        address = ethUtils.bufferToHex(ethUtils.pubToAddress(publicKey, true));
                        log.debug("address: ", address);
                        return [2 /*return*/, {
                                xpub: xpub,
                                xpriv: xpriv,
                                privateKey: ethUtils.bufferToHex(privateKey),
                                publicKey: ethUtils.bufferToHex(publicKey),
                                masterAddress: address
                            }];
                    case 2:
                        e_1 = _a.sent();
                        throw e_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    },
    generateSeed: function () {
        var randomBytesFunc = standardRandomBytesFunc;
        var randomBytes = Buffer.from(randomBytesFunc(16), "hex");
        if (randomBytes.length !== 16)
            throw Error("Entropy has incorrect length");
        var mnemonic = bip39.entropyToMnemonic(randomBytes.toString("hex"));
        return mnemonic;
    },
};
/**********************************
 // Lib
 //**********************************/
function standardRandomBytesFunc(size) {
    /* istanbul ignore if: not testable on node */
    return CryptoJS.lib.WordArray.random(size).toString();
}
