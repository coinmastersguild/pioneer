"use strict";
/*

    Pioneer API
      A High Availability blockchain api

    Goals:
      v1 compatibility with watchtower with 0 change
      Multi-asset support

    V2 goals:
      Treat Xpubs as passwords
      encrypt long term data storage
      maintain hash table to detect and cache payments



    getTransactions:

    Data: example

    { success: true,
      pagination: { page: 1, total_objects: 88, total_pages: 9 },
      data:
        [ { txid:
          '',
          status: 'confirmed',
          type: 'send',
          amount: -78602,
          date: '2019-05-10T21:01:23Z',
          confirmations: 1055,
          network: 'BTC',
          xpub:
            '' },
         }
       ]
      }
     }

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
var TAG = " | Pioneer | ";
var queue = require('@pioneer-platform/redis-queue');
var uuid = require('short-uuid');
var blocknative = require("@pioneer-platform/blocknative-client");
blocknative.init();
var blockbook = require('@pioneer-platform/blockbook');
// const foxitar = require("@pioneer-platform/foxitar-client")
var zapper = require("@pioneer-platform/zapper-client");
//@ts-ignore
var _a = require("@pioneer-platform/pioneer-caip"), shortListSymbolToCaip = _a.shortListSymbolToCaip, evmCaips = _a.evmCaips;
var networks = {
    'ETH': require('@pioneer-platform/eth-network'),
    'ATOM': require('@pioneer-platform/cosmos-network'),
    'OSMO': require('@pioneer-platform/osmosis-network'),
    'BNB': require('@pioneer-platform/binance-network'),
    // 'EOS' : require('@pioneer-platform/eos-network'),
    // 'FIO' : require('@pioneer-platform/fio-network'),
    'ANY': require('@pioneer-platform/utxo-network'),
    'RUNE': require('@pioneer-platform/thor-network'),
};
var _b = require('@pioneer-platform/cointools'), get_address_from_xpub = _b.get_address_from_xpub, getNativeAssetForBlockchain = _b.getNativeAssetForBlockchain;
//const bcrypt = require('bcryptjs');
var numbro = require("numbro");
var log = require('@pioneer-platform/loggerdog')();
var _c = require('@pioneer-platform/default-redis'), subscriber = _c.subscriber, publisher = _c.publisher, redis = _c.redis, redisQueue = _c.redisQueue;
var connection = require("@pioneer-platform/default-mongo");
var wait = require('wait-promise');
var sleep = wait.sleep;
var usersDB = connection.get('users');
var txsDB = connection.get('transactions');
var pubkeysDB = connection.get('pubkeys');
var inputsDB = connection.get('unspent');
var assetsDB = connection.get('assets');
var nodesDB = connection.get('nodes');
usersDB.createIndex({ id: 1 }, { unique: true });
txsDB.createIndex({ txid: 1 }, { unique: true });
inputsDB.createIndex({ txid: 1 }, { unique: true });
pubkeysDB.createIndex({ pubkey: 1 }, { unique: true });
pubkeysDB.createIndex({ tags: 1 });
var BALANCE_ON_REGISTER = true;
var onStart = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, servers, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | onStart | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    log.debug(tag, "starting...");
                    return [4 /*yield*/, nodesDB.find({ type: 'blockbook' })];
                case 2:
                    servers = _a.sent();
                    log.debug(tag, "servers: ", servers.length);
                    return [4 /*yield*/, blockbook.init(servers)
                        // networks.ANY.init('full')
                    ];
                case 3:
                    _a.sent();
                    // networks.ANY.init('full')
                    return [4 /*yield*/, networks.ETH.init()];
                case 4:
                    // networks.ANY.init('full')
                    _a.sent();
                    return [2 /*return*/, true];
                case 5:
                    e_1 = _a.sent();
                    log.error(e_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
};
//onStart()
module.exports = {
    init: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, onStart()];
            });
        });
    },
    refresh: function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, get_and_rescan_pubkeys(username)];
            });
        });
    },
    register: function (username, pubkeys) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, register_pubkeys(username, pubkeys)];
            });
        });
    },
    getPubkeys: function (username, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, get_and_verify_pubkeys(username, context)];
            });
        });
    },
    update: function (username, xpubs, context) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, update_pubkeys(username, xpubs, context)];
            });
        });
    },
    balances: function (pubkey) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, get_pubkey_balances(pubkey)];
            });
        });
    },
};
function getFromCache(key) {
    return __awaiter(this, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, redis.get(key)];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 2:
                    err_1 = _a.sent();
                    throw err_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setInCache(key, data, expiration) {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, redis.setex(key, expiration, data)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    throw err_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
var get_pubkey_balances = function (pubkey) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, balances_1, nfts, positions, cacheKey, cachedData, balance, _a, cacheKeyZapper, cachedDataZapper, zapperInfo, cacheKeyAllPioneers, cachedAllPioneers, allPioneers, isPioneer, updatedUsername, pioneerImage, updatedUsername2, cacheKeyBlockbookInfo, cachedBlockbookInfo, blockbookInfo, cacheKeyNetwork, cachedDataNetwork, balanceNetwork, pubkeyInfo, _loop_1, i, e_2;
        var _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    tag = TAG + " | get_pubkey_balances | ";
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 37, , 38]);
                    output = {};
                    if (!pubkey.symbol && pubkey.asset)
                        pubkey.symbol = pubkey.asset;
                    if (!pubkey.type && pubkey.address)
                        pubkey.type = "address";
                    if (!pubkey.context)
                        throw Error("100: invalid pubkey! missing context");
                    // if (!pubkey.symbol) throw Error("101: invalid pubkey! missing symbol");
                    // if (!pubkey.username) throw Error("102: invalid pubkey! missing username");
                    if (!pubkey.pubkey)
                        throw Error("103: invalid pubkey! missing pubkey");
                    if (!pubkey.type)
                        throw Error("105: invalid pubkey! missing type");
                    // if(!pubkey.queueId) throw Error("106: invalid pubkey! missing queueId");
                    if (pubkey.type !== 'address' && pubkey.type !== 'xpub' && pubkey.type !== 'zpub' && pubkey.type !== 'contract')
                        throw Error("Unknown type! " + pubkey.type);
                    balances_1 = [];
                    nfts = [];
                    positions = [];
                    log.debug(tag, " scanning pubkey: ", pubkey.pubkey);
                    if (!(pubkey.type === "xpub" || pubkey.type === "zpub")) return [3 /*break*/, 7];
                    cacheKey = "balances:blockbook:getBalanceByXpub:".concat(pubkey.symbol, ":").concat(pubkey.pubkey);
                    return [4 /*yield*/, getFromCache(cacheKey)];
                case 2:
                    cachedData = _d.sent();
                    balance = void 0;
                    if (!cachedData) return [3 /*break*/, 3];
                    balance = JSON.parse(cachedData);
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, blockbook.getBalanceByXpub(pubkey.symbol, pubkey.pubkey)];
                case 4:
                    balance = _d.sent();
                    log.debug(tag, pubkey.username + " Balance (" + pubkey.symbol + "): ", balance);
                    return [4 /*yield*/, setInCache(cacheKey, JSON.stringify(balance), 60 * 60 * 1)];
                case 5:
                    _d.sent();
                    _d.label = 6;
                case 6:
                    //
                    // Update balance
                    balances_1.push({
                        network: pubkey.symbol,
                        blockchainCaip: shortListSymbolToCaip[pubkey.symbol],
                        assetCaip: shortListSymbolToCaip[pubkey.symbol],
                        asset: pubkey.symbol,
                        symbol: pubkey.symbol,
                        pubkey: pubkey.pubkey,
                        context: pubkey.context,
                        isToken: false,
                        lastUpdated: new Date().getTime(),
                        balance: balance
                    });
                    return [3 /*break*/, 35];
                case 7:
                    if (!(pubkey.type === "address")) return [3 /*break*/, 35];
                    _a = pubkey.symbol;
                    switch (_a) {
                        case "ETH": return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 27];
                case 8:
                    cacheKeyZapper = "balances:zapperInfo:getPortfolio:".concat(pubkey.pubkey);
                    return [4 /*yield*/, getFromCache(cacheKeyZapper)];
                case 9:
                    cachedDataZapper = _d.sent();
                    zapperInfo = void 0;
                    if (!cachedDataZapper) return [3 /*break*/, 10];
                    zapperInfo = JSON.parse(cachedDataZapper);
                    return [3 /*break*/, 13];
                case 10: return [4 /*yield*/, zapper.getPortfolio(pubkey.pubkey)];
                case 11:
                    zapperInfo = _d.sent();
                    log.debug(tag, "zapperInfo: ", zapperInfo);
                    return [4 /*yield*/, setInCache(cacheKeyZapper, JSON.stringify(zapperInfo), 60 * 60 * 1)];
                case 12:
                    _d.sent();
                    _d.label = 13;
                case 13:
                    if (((_b = zapperInfo === null || zapperInfo === void 0 ? void 0 : zapperInfo.tokens) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                        zapperInfo.tokens.forEach(function (token) {
                            var balanceInfo = token.token;
                            balanceInfo.network = token.network;
                            //get caip for network
                            balanceInfo.blockchainCaip = token.blockchainCaip || 'caip:placeholder:' + token.network;
                            balanceInfo.assetCaip = token.assetCaip || 'caip:placeholder:' + token.network + ":" + token.token.symbol;
                            balanceInfo.asset = token.token.symbol;
                            balanceInfo.symbol = token.token.symbol;
                            balanceInfo.pubkey = pubkey.pubkey;
                            balanceInfo.context = pubkey.context;
                            balanceInfo.contract = token.token.address;
                            balanceInfo.source = 'zapper';
                            if (token.token.address !== '0x0000000000000000000000000000000000000000') {
                                balanceInfo.isToken = true;
                                balanceInfo.protocal = 'erc20';
                            }
                            balanceInfo.lastUpdated = new Date().getTime();
                            balanceInfo.price = token.token.price.toString();
                            balanceInfo.coingeckoId = token.token.coingeckoId;
                            balanceInfo.dailyVolume = token.token.price.toString();
                            balanceInfo.marketCap = token.token.marketCap.toString();
                            balanceInfo.balance = token.token.balance.toString();
                            balanceInfo.balanceUSD = token.token.balanceUSD.toString();
                            balanceInfo.balanceRaw = token.token.balanceRaw.toString();
                            balances_1.push(balanceInfo);
                        });
                    }
                    if (((_c = zapperInfo === null || zapperInfo === void 0 ? void 0 : zapperInfo.nfts) === null || _c === void 0 ? void 0 : _c.length) > 0) {
                        nfts = zapperInfo.nfts;
                    }
                    cacheKeyAllPioneers = 'balances:getAllPioneers:ETH';
                    return [4 /*yield*/, getFromCache(cacheKeyAllPioneers)];
                case 14:
                    cachedAllPioneers = _d.sent();
                    allPioneers = void 0;
                    if (!cachedAllPioneers) return [3 /*break*/, 15];
                    allPioneers = JSON.parse(cachedAllPioneers);
                    return [3 /*break*/, 18];
                case 15: return [4 /*yield*/, networks['ETH'].getAllPioneers()];
                case 16:
                    allPioneers = _d.sent();
                    return [4 /*yield*/, setInCache(cacheKeyAllPioneers, JSON.stringify(allPioneers), 60 * 60 * 1)];
                case 17:
                    _d.sent();
                    _d.label = 18;
                case 18:
                    log.debug(tag, "allPioneers: ", allPioneers);
                    if (!allPioneers || allPioneers.owners)
                        allPioneers = { owners: [], images: [] };
                    isPioneer = allPioneers.owners.includes(pubkey.pubkey.toLowerCase());
                    if (!isPioneer) return [3 /*break*/, 21];
                    log.debug("Pioneer detected!");
                    return [4 /*yield*/, usersDB.update({ username: pubkey.username }, { $set: { isPioneer: true } }, { multi: true })];
                case 19:
                    updatedUsername = _d.sent();
                    log.debug("Updated username PIONEER: ", updatedUsername);
                    pioneerImage = allPioneers.images.find(function (image) { return image.address.toLowerCase() === pubkey.pubkey.toLowerCase(); });
                    if (!pioneerImage) return [3 /*break*/, 21];
                    return [4 /*yield*/, usersDB.update({ username: pubkey.username }, { $set: { pioneerImage: pioneerImage.image } }, { multi: true })];
                case 20:
                    updatedUsername2 = _d.sent();
                    log.debug("updatedUsername2 PIONEER: ", updatedUsername2);
                    nfts.push({
                        name: "Pioneer",
                        description: "Pioneer",
                        source: "pioneer",
                        blockchainCaip: 'eip155:1/slip44:60',
                        assetCaip: 'eip155:1/slip44:60:' + "0x25EF864904d67e912B9eC491598A7E5A066B102F",
                        pubkey: pubkey.pubkey,
                        context: pubkey.context,
                        number: allPioneers.owners.indexOf(pubkey.pubkey.toLowerCase()),
                        image: pioneerImage.image
                    });
                    _d.label = 21;
                case 21:
                    cacheKeyBlockbookInfo = "balances:blockbook:getAddressInfo:ETH:".concat(pubkey.pubkey);
                    return [4 /*yield*/, getFromCache(cacheKeyBlockbookInfo)];
                case 22:
                    cachedBlockbookInfo = _d.sent();
                    blockbookInfo = void 0;
                    if (!cachedBlockbookInfo) return [3 /*break*/, 23];
                    blockbookInfo = JSON.parse(cachedBlockbookInfo);
                    return [3 /*break*/, 26];
                case 23: return [4 /*yield*/, blockbook.getAddressInfo('ETH', pubkey.pubkey)];
                case 24:
                    blockbookInfo = _d.sent();
                    return [4 /*yield*/, setInCache(cacheKeyBlockbookInfo, JSON.stringify(blockbookInfo), 60 * 60 * 1)];
                case 25:
                    _d.sent();
                    _d.label = 26;
                case 26:
                    log.debug(tag, 'blockbookInfo: ', blockbookInfo);
                    if (blockbookInfo === null || blockbookInfo === void 0 ? void 0 : blockbookInfo.tokens) {
                        blockbookInfo.tokens.forEach(function (tokenInfo) {
                            if (tokenInfo.symbol && tokenInfo.symbol !== 'ETH') {
                                var balanceInfo = {
                                    network: "ETH",
                                    blockchainCaip: 'eip155:1/slip44:60',
                                    assetCaip: 'eip155:1/slip44:60:' + tokenInfo.contract,
                                    type: tokenInfo.type,
                                    asset: tokenInfo.symbol,
                                    symbol: tokenInfo.symbol,
                                    name: tokenInfo.name,
                                    contract: tokenInfo.contract,
                                    pubkey: pubkey.pubkey,
                                    context: pubkey.context,
                                    image: "https://pioneers.dev/coins/ethereum.png",
                                    isToken: true,
                                    protocal: 'erc20',
                                    lastUpdated: new Date().getTime(),
                                    decimals: tokenInfo.decimals,
                                    balance: tokenInfo.balance / Math.pow(10, Number(tokenInfo.decimals)),
                                    balanceNative: tokenInfo.balance / Math.pow(10, Number(tokenInfo.decimals)),
                                    source: "blockbook"
                                };
                                if (tokenInfo.holdersCount === 1) {
                                    balanceInfo.nft = true;
                                }
                                if (balanceInfo.balance > 0) {
                                    balances_1.push(balanceInfo);
                                }
                            }
                        });
                    }
                    return [3 /*break*/, 35];
                case 27:
                    if (!(pubkey.symbol && networks[pubkey.symbol])) return [3 /*break*/, 33];
                    cacheKeyNetwork = "balances:".concat(pubkey.symbol, ":getBalance:").concat(pubkey.pubkey);
                    return [4 /*yield*/, getFromCache(cacheKeyNetwork)];
                case 28:
                    cachedDataNetwork = _d.sent();
                    balanceNetwork = void 0;
                    if (!cachedDataNetwork) return [3 /*break*/, 29];
                    balanceNetwork = JSON.parse(cachedDataNetwork);
                    return [3 /*break*/, 32];
                case 29: return [4 /*yield*/, networks[pubkey.symbol].getBalance(pubkey.pubkey)];
                case 30:
                    balanceNetwork = _d.sent();
                    log.debug(tag, "balance: ", balanceNetwork);
                    return [4 /*yield*/, setInCache(cacheKeyNetwork, JSON.stringify(balanceNetwork), 60 * 60 * 1)];
                case 31:
                    _d.sent();
                    _d.label = 32;
                case 32:
                    if (!balanceNetwork)
                        balanceNetwork = 0;
                    balances_1.push({
                        network: pubkey.symbol,
                        asset: pubkey.symbol,
                        symbol: pubkey.symbol,
                        blockchainCaip: shortListSymbolToCaip[pubkey.symbol],
                        assetCaip: shortListSymbolToCaip[pubkey.symbol],
                        isToken: false,
                        lastUpdated: new Date().getTime(), //TODO use block heights
                        balance: balanceNetwork,
                        context: pubkey.context,
                        source: "pioneer-network-" + pubkey.symbol
                    });
                    return [3 /*break*/, 34];
                case 33:
                    console.error("Unhandled Pubkey: ", pubkey);
                    _d.label = 34;
                case 34: return [3 /*break*/, 35];
                case 35: return [4 /*yield*/, pubkeysDB.findOne({ pubkey: pubkey.pubkey })];
                case 36:
                    pubkeyInfo = _d.sent();
                    if (!pubkeyInfo || !pubkeyInfo.balances) {
                        pubkeyInfo = {
                            balances: []
                        };
                    }
                    if (!pubkeyInfo.nfts)
                        pubkeyInfo.nfts = [];
                    log.debug(tag, "pubkeyInfo: ", pubkeyInfo);
                    log.debug(tag, "pubkeyInfo.balances: ", pubkeyInfo.balances.length);
                    log.debug(tag, "nfts: ", pubkeyInfo.nfts.length);
                    log.debug(tag, "balances: ", balances_1);
                    log.debug(tag, "balances: ", balances_1.length);
                    _loop_1 = function (i) {
                        var nft = nfts[i];
                        log.debug(tag, "pubkeyInfo.nfts: ", pubkeyInfo.nfts.length);
                        var existingNft = pubkeyInfo.nfts.find(function (e) { return e.name === nft.name; });
                    };
                    for (i = 0; i < nfts.length; i++) {
                        _loop_1(i);
                    }
                    output.balances = balances_1;
                    output.nfts = nfts;
                    output.success = true;
                    return [2 /*return*/, output];
                case 37:
                    e_2 = _d.sent();
                    console.error(tag, "e: ", e_2);
                    throw e_2;
                case 38: return [2 /*return*/];
            }
        });
    });
};
var get_and_rescan_pubkeys = function (username) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, pubkeysMongo, userInfo, blockchains, pubkeys, masters, i, pubkeyInfo, _loop_2, j, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_and_rescan_pubkeys | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, pubkeysDB.find({ tags: { $all: [username] } })];
                case 2:
                    pubkeysMongo = _a.sent();
                    log.debug(tag, "pubkeysMongo: ", pubkeysMongo.length);
                    return [4 /*yield*/, usersDB.findOne({ username: username })];
                case 3:
                    userInfo = _a.sent();
                    if (!userInfo)
                        throw Error("get_and_rescan_pubkeys user not found!");
                    log.debug(tag, "userInfo: ", userInfo);
                    blockchains = userInfo.blockchains;
                    if (!blockchains)
                        blockchains = [];
                    pubkeys = [];
                    masters = {};
                    for (i = 0; i < pubkeysMongo.length; i++) {
                        pubkeyInfo = pubkeysMongo[i];
                        delete pubkeyInfo._id;
                        _loop_2 = function (j) {
                            var context = userInfo.wallets[i];
                            if (pubkeyInfo.type === 'zpub') {
                                //if context found in tags
                                var match = pubkeyInfo.tags.filter(function (e) { return e === context; });
                                if (match.length > 0) {
                                    register_zpub(username, pubkeyInfo, context);
                                }
                            }
                            else if (pubkeyInfo.type === 'xpub') {
                                var match = pubkeyInfo.tags.filter(function (e) { return e === context; });
                                if (match.length > 0) {
                                    register_xpub(username, pubkeyInfo, context);
                                }
                            }
                            else if (pubkeyInfo.type === 'address') {
                                var match = pubkeyInfo.tags.filter(function (e) { return e === context; });
                                if (match.length > 0) {
                                    register_address(username, pubkeyInfo, context);
                                }
                            }
                        };
                        //for each wallet by user
                        for (j = 0; j < userInfo.wallets.length; j++) {
                            _loop_2(j);
                        }
                    }
                    return [2 /*return*/, { pubkeys: pubkeys, masters: masters }];
                case 4:
                    e_3 = _a.sent();
                    console.error(tag, "e: ", e_3);
                    throw e_3;
                case 5: return [2 /*return*/];
            }
        });
    });
};
var get_and_verify_pubkeys = function (username, context) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, pubkeysMongo, userInfo, blockchains, pubkeys, allBalances, synced, i, pubkeyInfo, balances, isSynced, i, blockchain, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_and_verify_pubkeys | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 10, , 11]);
                    //get pubkeys from mongo with context tagged
                    if (!context)
                        context = username;
                    return [4 /*yield*/, pubkeysDB.find({ tags: { $all: [context] } })];
                case 2:
                    pubkeysMongo = _a.sent();
                    log.debug(tag, "pubkeysMongo: ", pubkeysMongo.length);
                    return [4 /*yield*/, usersDB.findOne({ username: username })];
                case 3:
                    userInfo = _a.sent();
                    if (!userInfo)
                        throw Error("get_and_verify_pubkeys User not found!");
                    log.debug(tag, "userInfo: ", userInfo);
                    blockchains = userInfo.blockchains;
                    log.debug(tag, "userInfo: ", userInfo);
                    if (!blockchains)
                        blockchains = [];
                    pubkeys = [];
                    allBalances = [];
                    synced = [];
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < userInfo.pubkeys.length)) return [3 /*break*/, 9];
                    pubkeyInfo = userInfo.pubkeys[i];
                    delete pubkeyInfo._id;
                    //TODO validate pubkeys?
                    pubkeyInfo.username = username;
                    if (!(!pubkeyInfo.balances || pubkeyInfo.balances.length === 0)) return [3 /*break*/, 6];
                    log.debug(tag, "no balances, getting balances...");
                    return [4 /*yield*/, get_pubkey_balances(pubkeyInfo)];
                case 5:
                    balances = _a.sent();
                    if (balances.success)
                        synced.push(pubkeyInfo.blockchain);
                    // log.debug(tag,"balances: ",balances)
                    log.debug(tag, pubkeyInfo.symbol + " balances: ", balances);
                    log.debug(tag, context + ": " + pubkeyInfo.symbol + " balances: ", balances.balances.length);
                    if (balances && balances.balances) {
                        pubkeyInfo.balances = balances.balances;
                        allBalances = allBalances.concat(balances.balances);
                        log.debug(tag, context + ": " + pubkeyInfo.symbol + " allBalances: ", allBalances.length);
                    }
                    if (balances && balances.nfts)
                        pubkeys.nfts = balances.nfts;
                    return [3 /*break*/, 7];
                case 6:
                    log.debug(tag, "balances already exist! count: ", pubkeyInfo.balances.length);
                    _a.label = 7;
                case 7:
                    // if(!masters[pubkeyInfo.symbol] && pubkeyInfo.master)masters[pubkeyInfo.symbol] = pubkeyInfo.master
                    pubkeyInfo.context = context;
                    pubkeys.push(pubkeyInfo);
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 4];
                case 9:
                    isSynced = false;
                    for (i = 0; i < blockchains.length; i++) {
                        blockchain = blockchains[i];
                        if (synced.indexOf(blockchain) === -1) {
                            log.debug(tag, context + " blockchain not synced: ", blockchain);
                            isSynced = false;
                            break;
                        }
                    }
                    return [2 /*return*/, { pubkeys: pubkeys, balances: allBalances }];
                case 10:
                    e_4 = _a.sent();
                    console.error(tag, "e: ", e_4);
                    throw e_4;
                case 11: return [2 /*return*/];
            }
        });
    });
};
var register_zpub = function (username, pubkey, context) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, queueId, account, index, address, work, result, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | register_zpub | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    if (!context)
                        throw Error("101: context required!");
                    if (!pubkey.zpub)
                        throw Error("102: invalid pubkey! missing zpub!");
                    if (!pubkey.pubkey)
                        throw Error("103: invalid pubkey! missing pubkey!");
                    if (pubkey.pubkey == true)
                        throw Error("104:(zpub) invalid pubkey! == true wtf!");
                    if (!pubkey.symbol)
                        throw Error("105: invalid pubkey! missing pubkey!");
                    log.debug(tag, "pubkey: ", pubkey);
                    queueId = uuid.generate();
                    account = 0;
                    index = 0;
                    return [4 /*yield*/, get_address_from_xpub(pubkey.zpub, pubkey.scriptType, pubkey.symbol, account, index, false, false)];
                case 2:
                    address = _a.sent();
                    log.debug(tag, "Master(Local): ", address);
                    log.debug(tag, "Master(hdwallet): ", pubkey.master);
                    if (address !== pubkey.master) {
                        log.error(tag, "Local Master NOT VALID!!");
                        log.error(tag, "Local Master: ", address);
                        log.error(tag, "hdwallet Master: ", pubkey.master);
                        //revert to pubkey (assume hdwallet right)
                        address = pubkey.master;
                    }
                    work = {
                        type: 'zpub',
                        blockchain: pubkey.blockchain,
                        pubkey: pubkey.pubkey,
                        master: pubkey.master,
                        network: pubkey.blockchain,
                        asset: pubkey.symbol,
                        queueId: queueId,
                        username: username,
                        context: context,
                        zpub: pubkey.pubkey,
                        inserted: new Date().getTime()
                    };
                    log.debug(tag, "Creating work! ", work);
                    queue.createWork("pioneer:pubkey:ingest", work);
                    return [4 /*yield*/, get_pubkey_balances(work)];
                case 3:
                    result = _a.sent();
                    log.debug(result);
                    return [2 /*return*/, result];
                case 4:
                    e_5 = _a.sent();
                    console.error(tag, "e: ", e_5);
                    throw e_5;
                case 5: return [2 /*return*/];
            }
        });
    });
};
var register_xpub = function (username, pubkey, context) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, queueId, account, index, address, work, _a, balances, nfts, e_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tag = TAG + " | register_xpub | ";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    if (!pubkey.pubkey)
                        throw Error("102: invalid pubkey! missing pubkey!");
                    if (pubkey.pubkey == true)
                        throw Error("103:(xpub) invalid pubkey! === true wtf!");
                    if (!pubkey.symbol)
                        throw Error("104: invalid pubkey! missing symbol!");
                    queueId = uuid.generate();
                    account = 0;
                    index = 0;
                    return [4 /*yield*/, get_address_from_xpub(pubkey.pubkey, pubkey.scriptType, pubkey.symbol, account, index, false, false)];
                case 2:
                    address = _b.sent();
                    log.debug(tag, "Master(Local): ", address);
                    log.debug(tag, "Master(hdwallet): ", pubkey.master);
                    if (address !== pubkey.master) {
                        log.error(tag, "Local Master NOT VALID!!");
                        //revert to pubkey (assume hdwallet right)
                        address = pubkey.master;
                    }
                    work = {
                        context: context,
                        type: 'xpub',
                        blockchain: pubkey.blockchain,
                        pubkey: pubkey.pubkey,
                        master: pubkey.master,
                        network: pubkey.blockchain,
                        asset: pubkey.symbol,
                        queueId: queueId,
                        username: username,
                        xpub: pubkey.xpub,
                        inserted: new Date().getTime()
                    };
                    log.debug(tag, "Creating work! ", work);
                    queue.createWork("pioneer:pubkey:ingest", work);
                    return [4 /*yield*/, get_pubkey_balances(work)];
                case 3:
                    _a = _b.sent(), balances = _a.balances, nfts = _a.nfts;
                    log.info(tag, "balances: ", balances.length);
                    return [2 /*return*/, { nfts: nfts, balances: balances }];
                case 4:
                    e_6 = _b.sent();
                    console.error(tag, "e: ", e_6);
                    throw e_6;
                case 5: return [2 /*return*/];
            }
        });
    });
};
var register_address = function (username, pubkey, context) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, address, queueId, work, result, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | register_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    address = pubkey.pubkey;
                    queueId = uuid.generate();
                    work = {
                        type: 'address',
                        pubkey: address,
                        symbol: pubkey.symbol,
                        blockchain: pubkey.blockchain,
                        network: pubkey.network,
                        asset: pubkey.symbol,
                        context: context,
                        queueId: queueId,
                        username: username,
                        address: address,
                        master: address,
                        inserted: new Date().getTime()
                    };
                    log.debug("adding work: ", work);
                    queue.createWork("pioneer:pubkey:ingest", work);
                    return [4 /*yield*/, get_pubkey_balances(work)];
                case 2:
                    result = _a.sent();
                    log.debug(tag, "result: ", result);
                    return [2 /*return*/, result];
                case 3:
                    e_7 = _a.sent();
                    console.error(tag, "e: ", e_7);
                    throw e_7;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var update_pubkeys = function (username, pubkeys, context) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, saveActions, output, allPubkeys, PubkeyMap, i, pubkeyInfo, allBalances, allKnownPubkeys, knownPubkeys_1, i, unknown, i, pubkey, pubkeyInfo, nativeAsset, entryMongo, result, result, result, keyExists, pushTagMongo, resultSave, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | update_pubkeys | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 20, , 21]);
                    log.debug(tag, "input: ", { username: username, pubkeys: pubkeys, context: context });
                    saveActions = [];
                    output = {};
                    output.pubkeys = [];
                    allPubkeys = [];
                    PubkeyMap = {};
                    for (i = 0; i < pubkeys.length; i++) {
                        pubkeyInfo = pubkeys[i];
                        allPubkeys.push(pubkeyInfo.pubkey);
                        PubkeyMap[pubkeyInfo.pubkey] = pubkeyInfo;
                    }
                    //remove duplicates
                    allPubkeys = Array.from(new Set(allPubkeys));
                    allBalances = [];
                    //get pubkeys from mongo
                    log.debug(tag, "allPubkeys: ", allPubkeys);
                    return [4 /*yield*/, pubkeysDB.find({ "pubkey": { "$in": allPubkeys } })];
                case 2:
                    allKnownPubkeys = _a.sent();
                    log.debug(tag, "allKnownPubkeys: ", allKnownPubkeys.length);
                    knownPubkeys_1 = [];
                    for (i = 0; i < allKnownPubkeys.length; i++) {
                        knownPubkeys_1.push(allKnownPubkeys[i].pubkey);
                    }
                    log.debug(tag, "allKnownPubkeys: ", allKnownPubkeys.length);
                    log.debug(tag, "allPubkeys: ", allPubkeys.length);
                    if (!(allPubkeys.length > allKnownPubkeys.length)) return [3 /*break*/, 18];
                    unknown = allPubkeys.filter(function (x) { return !knownPubkeys_1.includes(x); });
                    log.debug(tag, "unknown: ", unknown);
                    log.debug(tag, "Registering pubkeys : ", unknown.length);
                    i = 0;
                    _a.label = 3;
                case 3:
                    if (!(i < unknown.length)) return [3 /*break*/, 17];
                    pubkey = unknown[i];
                    pubkeyInfo = PubkeyMap[pubkey];
                    log.debug(tag, "pubkeyInfo: ", pubkeyInfo);
                    if (!pubkeyInfo.pubkey)
                        throw Error("102: invalid pubkey! missing pubkey");
                    if (!pubkeyInfo.master)
                        throw Error("102: invalid pubkey! missing master");
                    if (!pubkeyInfo.blockchain)
                        throw Error("103: invalid pubkey! missing blockchain");
                    if (pubkey.pubkey === true)
                        throw Error("104: invalid pubkey! === true wtf!");
                    nativeAsset = getNativeAssetForBlockchain(pubkeyInfo.blockchain);
                    if (!nativeAsset)
                        throw Error("105: invalid pubkey! unsupported by coins module!");
                    //hack
                    if (!pubkeyInfo.symbol)
                        pubkeyInfo.symbol = nativeAsset;
                    //hack clean up tags
                    if (typeof (context) !== 'string') {
                        //
                        log.error("invalid context!", context);
                        throw Error("Bad walletID!");
                    }
                    entryMongo = {
                        blockchain: pubkeyInfo.blockchain,
                        symbol: nativeAsset,
                        asset: nativeAsset,
                        path: pubkeyInfo.path,
                        pathMaster: pubkeyInfo.pathMaster,
                        master: pubkeyInfo.master,
                        pubkey: pubkeyInfo.pubkey,
                        script_type: pubkeyInfo.script_type,
                        network: pubkeyInfo.network,
                        created: new Date().getTime(),
                        tags: [username, pubkeyInfo.blockchain, pubkeyInfo.network, context],
                    };
                    if (!(pubkeyInfo.type === "xpub" || pubkeyInfo.xpub)) return [3 /*break*/, 5];
                    if (pubkeyInfo.xpub) {
                        entryMongo.pubkey = pubkeyInfo.pubkey;
                    }
                    else {
                        log.errro(tag, "pubkey: ", pubkeyInfo);
                        throw Error("102: Invalid xpub pubkey!");
                    }
                    saveActions.push({ insertOne: entryMongo });
                    return [4 /*yield*/, register_xpub(username, pubkeyInfo, context)];
                case 4:
                    result = _a.sent();
                    entryMongo.balances = result.balances;
                    allBalances.push.apply(allBalances, result.balances);
                    return [3 /*break*/, 10];
                case 5:
                    if (!(pubkeyInfo.type === "zpub" || pubkeyInfo.zpub)) return [3 /*break*/, 7];
                    if (pubkeyInfo.zpub) {
                        entryMongo.pubkey = pubkeyInfo.pubkey;
                    }
                    else {
                        log.errro(tag, "pubkey: ", pubkeyInfo);
                        throw Error("102: Invalid zpub pubkey!");
                    }
                    saveActions.push({ insertOne: entryMongo });
                    return [4 /*yield*/, register_zpub(username, pubkeyInfo, context)];
                case 6:
                    result = _a.sent();
                    entryMongo.balances = result.balances;
                    allBalances.push.apply(allBalances, result.balances);
                    return [3 /*break*/, 10];
                case 7:
                    if (!(pubkeyInfo.type === "address")) return [3 /*break*/, 9];
                    entryMongo.pubkey = pubkeyInfo.pubkey;
                    return [4 /*yield*/, register_address(username, pubkeyInfo, context)];
                case 8:
                    result = _a.sent();
                    entryMongo.balances = result.balances;
                    allBalances.push.apply(allBalances, result.balances);
                    return [3 /*break*/, 10];
                case 9:
                    log.error("Unhandled type: ", pubkeyInfo.type);
                    _a.label = 10;
                case 10:
                    //verify write
                    log.debug(tag, "entryMongo: ", entryMongo);
                    return [4 /*yield*/, pubkeysDB.findOne({ pubkey: entryMongo.pubkey })];
                case 11:
                    keyExists = _a.sent();
                    if (!keyExists) return [3 /*break*/, 13];
                    log.debug(tag, "Key already registered! key: ", entryMongo);
                    return [4 /*yield*/, pubkeysDB.update({ pubkey: entryMongo.pubkey }, { $addToSet: { tags: { $each: [context, username] } } })];
                case 12:
                    pushTagMongo = _a.sent();
                    log.debug(tag, "pushTagMongo: ", pushTagMongo);
                    return [3 /*break*/, 16];
                case 13:
                    if (!(!entryMongo.pubkey || entryMongo.pubkey == true)) return [3 /*break*/, 14];
                    log.error(" **** ERROR INVALID PUBKEY ENTRY! ***** pubkeyInfo: ", pubkeyInfo);
                    log.error(" **** ERROR INVALID PUBKEY ENTRY! ***** entryMongo: ", entryMongo);
                    throw Error("105: unable to save invalid pubkey!");
                case 14: return [4 /*yield*/, pubkeysDB.insert(entryMongo)];
                case 15:
                    resultSave = _a.sent();
                    log.debug(tag, "resultSave: ", resultSave);
                    _a.label = 16;
                case 16:
                    i++;
                    return [3 /*break*/, 3];
                case 17: return [3 /*break*/, 19];
                case 18:
                    log.debug(tag, " No new pubkeys! ");
                    _a.label = 19;
                case 19:
                    log.debug(tag, "output: ", output);
                    if (allBalances.length === 0) {
                        log.error(tag, "No balances found! allBalances: ", allBalances);
                        // throw Error("No balances found!")
                    }
                    output.balances = allBalances;
                    log.debug(tag, " return object: ", output);
                    return [2 /*return*/, output];
                case 20:
                    e_8 = _a.sent();
                    console.error(tag, "e: ", e_8);
                    throw e_8;
                case 21: return [2 /*return*/];
            }
        });
    });
};
/*
    Rules:

    only go to network if no pubkey exists

    do not sync balances here (we only sync balances on context change)

 */
var register_pubkeys = function (username, pubkeys) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, saveActions, allBalances, output, i, pubkeyInfo, nativeAsset, pubkeyExists, entryMongo, xpub, result, zpub, result, result, action, pushTagMongo, saveMongoBulk, e_9, allPubkeys, i, pubkeyInfo, e_10;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tag = TAG + " | register_pubkeys | ";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 20, , 21]);
                    log.debug(tag, "input: ", { username: username, pubkeys: pubkeys });
                    saveActions = [];
                    allBalances = [];
                    output = {};
                    output.pubkeys = [];
                    output.balances = [];
                    output.nfts = [];
                    i = 0;
                    _c.label = 2;
                case 2:
                    if (!(i < pubkeys.length)) return [3 /*break*/, 14];
                    pubkeyInfo = pubkeys[i];
                    log.debug(tag, "pubkeyInfo: ", pubkeyInfo);
                    if (!pubkeyInfo.blockchain)
                        throw Error("Invalid pubkey required field: blockchain");
                    nativeAsset = getNativeAssetForBlockchain(pubkeyInfo.blockchain);
                    if (!nativeAsset)
                        throw Error("104: invalid pubkey! unsupported by coins module!");
                    if (!pubkeyInfo.pubkey)
                        throw Error("104: invalid pubkey! missing pubkey!");
                    if (!pubkeyInfo.type)
                        throw Error("104: invalid pubkey! missing type!");
                    if (!pubkeyInfo.symbol)
                        pubkeyInfo.symbol = nativeAsset;
                    //if (!pubkeyInfo.script_type) throw Error("Invalid pubkey required field: script_type coin:" + pubkeyInfo.blockchain);
                    if (!pubkeyInfo.network)
                        throw Error("Invalid pubkey required field: network coin:" + pubkeyInfo.blockchain);
                    if (!pubkeyInfo.master)
                        throw Error("Invalid pubkey required field: master coin:" + pubkeyInfo.blockchain);
                    //if (!pubkeyInfo.path) throw Error("Invalid pubkey required field: path coin:" + pubkeyInfo.blockchain);
                    if (!pubkeyInfo.context)
                        throw Error("Invalid pubkey required field: context:" + pubkeyInfo.blockchain);
                    return [4 /*yield*/, pubkeysDB.findOne({ pubkey: pubkeyInfo.pubkey })];
                case 3:
                    pubkeyExists = _c.sent();
                    log.info(tag, "pubkeyExists: ", pubkeyExists);
                    if (!!pubkeyExists) return [3 /*break*/, 11];
                    entryMongo = {
                        pubkey: pubkeyInfo.pubkey,
                        type: pubkeyInfo.type,
                        blockchain: pubkeyInfo.blockchain,
                        symbol: nativeAsset,
                        asset: pubkeyInfo.blockchain,
                        path: pubkeyInfo.path,
                        pathMaster: pubkeyInfo.pathMaster,
                        script_type: pubkeyInfo.script_type,
                        network: pubkeyInfo.blockchain,
                        created: new Date().getTime(),
                        tags: [username, pubkeyInfo.blockchain, pubkeyInfo.symbol, pubkeyInfo.network, pubkeyInfo.context],
                    };
                    if (!(pubkeyInfo.type === "xpub")) return [3 /*break*/, 5];
                    log.debug(tag, "pubkeyInfo: ", pubkeyInfo);
                    xpub = pubkeyInfo.pubkey;
                    log.debug(tag, "xpub: ", xpub);
                    entryMongo.pubkey = xpub;
                    entryMongo.xpub = xpub;
                    entryMongo.type = 'xpub';
                    entryMongo.master = pubkeyInfo.address;
                    entryMongo.address = pubkeyInfo.address;
                    return [4 /*yield*/, register_xpub(username, pubkeyInfo, pubkeyInfo.context)];
                case 4:
                    result = _c.sent();
                    entryMongo.balances = result.balances;
                    allBalances.push.apply(allBalances, result.balances);
                    return [3 /*break*/, 10];
                case 5:
                    if (!(pubkeyInfo.type === "zpub")) return [3 /*break*/, 7];
                    zpub = pubkeyInfo.pubkey;
                    entryMongo.pubkey = zpub;
                    entryMongo.zpub = zpub;
                    entryMongo.type = 'zpub';
                    entryMongo.master = pubkeyInfo.address;
                    entryMongo.address = pubkeyInfo.address;
                    return [4 /*yield*/, register_xpub(username, pubkeyInfo, pubkeyInfo.context)];
                case 6:
                    result = _c.sent();
                    entryMongo.balances = result.balances;
                    allBalances.push.apply(allBalances, result.balances);
                    return [3 /*break*/, 10];
                case 7:
                    if (!(pubkeyInfo.type === "address")) return [3 /*break*/, 9];
                    entryMongo.pubkey = pubkeyInfo.pubkey;
                    entryMongo.master = pubkeyInfo.pubkey;
                    entryMongo.type = pubkeyInfo.type;
                    entryMongo.address = pubkeyInfo.address;
                    return [4 /*yield*/, register_address(username, pubkeyInfo, pubkeyInfo.context)];
                case 8:
                    result = _c.sent();
                    entryMongo.balances = result.balances;
                    allBalances.push.apply(allBalances, result.balances);
                    return [3 /*break*/, 10];
                case 9:
                    log.error(tag, "Unhandled type: ", pubkeyInfo.type);
                    _c.label = 10;
                case 10:
                    //verify write
                    log.info(tag, "entryMongo: ", entryMongo);
                    if (!entryMongo.pubkey)
                        throw Error("103: Invalid pubkey! can not save!");
                    if (!entryMongo.balances)
                        throw Error("103: Invalid pubkey! no balances set!");
                    action = {
                        insertOne: entryMongo
                    };
                    log.info(tag, "action: ", action);
                    saveActions.push(action);
                    return [3 /*break*/, 13];
                case 11:
                    //add tag for username
                    log.info(tag, "pubkeyExists.tags: ", pubkeyExists.tags);
                    if (!(pubkeyExists.tags.indexOf(username) === -1)) return [3 /*break*/, 13];
                    return [4 /*yield*/, pubkeysDB.update({ pubkey: pubkeyInfo.pubkey }, { $addToSet: { tags: { $each: [username] } } })];
                case 12:
                    pushTagMongo = _c.sent();
                    log.info(tag, "pushTagMongo: ", pushTagMongo);
                    _c.label = 13;
                case 13:
                    i++;
                    return [3 /*break*/, 2];
                case 14:
                    //bulk write to mongo
                    log.info(tag, "saveActions: ", saveActions);
                    if (!(saveActions.length > 0)) return [3 /*break*/, 18];
                    _c.label = 15;
                case 15:
                    _c.trys.push([15, 17, , 18]);
                    return [4 /*yield*/, pubkeysDB.bulkWrite(saveActions, { ordered: false })];
                case 16:
                    saveMongoBulk = _c.sent();
                    log.info(tag, "saveMongoBulk: ", saveMongoBulk);
                    return [3 /*break*/, 18];
                case 17:
                    e_9 = _c.sent();
                    log.error("Failed to update in bulk!");
                    return [3 /*break*/, 18];
                case 18: return [4 /*yield*/, pubkeysDB.find({ tags: { $in: [username] } })];
                case 19:
                    allPubkeys = _c.sent();
                    log.info(tag, "allPubkeys: ", allPubkeys.length);
                    //get all balances for username
                    for (i = 0; i < allPubkeys.length; i++) {
                        pubkeyInfo = allPubkeys[i];
                        if (pubkeyInfo.balances)
                            (_a = output.balances).push.apply(_a, pubkeyInfo.balances);
                        if (pubkeyInfo.nfts)
                            (_b = output.nfts).push.apply(_b, pubkeyInfo.nfts);
                    }
                    return [2 /*return*/, output];
                case 20:
                    e_10 = _c.sent();
                    console.error(tag, "e: ", e_10);
                    throw e_10;
                case 21: return [2 /*return*/];
            }
        });
    });
};
