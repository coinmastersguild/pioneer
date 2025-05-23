"use strict";
/*
   Cosmos Network tools

                             .-.
                            ( (
                             `-'



                        .   ,- To the Cosmos!
                       .'.
                       |o|
                      .'o'.
                      |.-.|
                      '   '
                       ( )
                        )
                       ( )

                   ____
              .-'""p 8o""`-.
           .-'8888P'Y.`Y[ ' `-.
         ,']88888b.J8oo_      '`.
       ,' ,88888888888["        Y`.
      /   8888888888P            Y8\
     /    Y8888888P'             ]88\
    :     `Y88'   P              `888:
    :       Y8.oP '- >            Y88:
    |          `Yb  __             `'|
    :            `'d8888bo.          :
    :             d88888888ooo.      ;
     \            Y88888888888P     /
      \            `Y88888888P     /
       `.            d88888P'    ,'
         `.          888PP'    ,'
           `-.      d8P'    ,-'   -CJ-
              `-.,,_'__,,.-'


       Goals:

        *


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
/*
    //cosmos sdk
    https://www.npmjs.com/package/@cosmostation/cosmosjs


    Networks



    Tendermint API


    https://rpc.cosmos.network/txs?recipient=cosmos1qjwdyn56ecagk8rjf7crrzwcyz6775cj89njn3


    //API

    https://cosmos.network/rpc/

 */
var TAG = " | cosmos-api | ";
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    headers: {
        'api-key': process.env['NOW_NODES_API'],
    },
});
var log = require('@pioneer-platform/loggerdog')();
var wait = require('wait-promise');
var sleep = wait.sleep;
//encoder
var txEncoder = require('@pioneer-platform/cosmos-tx-encoder');
var ASSET = "ATOM";
var nodes = require('@pioneer-platform/nodes');
var publicNode = nodes.getNode('cosmos', 'gaiad');
var ATOM_BASE = 1000000;
var URL_GAIAD = 'https://atom.nownodes.io';
// let URL_GAIAD = process.env['URL_GAIAD'] || 'https://atom.nownodes.io/cosmos'
log.debug("URL_GAIAD: ", URL_GAIAD);
var RUNTIME;
module.exports = {
    init: function (mode, config) {
        if (mode) {
            RUNTIME = mode;
            if (config.gaiad)
                URL_GAIAD = config.gaiad;
        }
        else {
            RUNTIME = 'pioneer';
        }
    },
    isOnline: function () {
        return check_online_status();
    },
    nodeInfo: function () {
        return get_node_info_verbose();
    },
    nodeInfoSyncing: function () {
        return get_node_syncing();
    },
    nodeInfoVersion: function () {
        return get_node_version();
    },
    txs: function (address) {
        return get_txs_by_address(address);
    },
    txsByHeight: function (height) {
        return get_txs_by_height(height);
    },
    getTransaction: function (txid) {
        return getTransaction(txid);
    },
    getMempool: function () {
        return get_mempool();
    },
    getDelegationsByValidator: function (address, validator) {
        return get_delegations_by_validator(address, validator);
    },
    getDelegations: function (address) {
        return get_delegations_by_address(address);
    },
    getDelegationTxs: function (address) {
        return get_delegations_txs_address(address);
    },
    getBalance: function (address) {
        return get_balance(address);
    },
    getBalances: function (address) {
        return get_balances(address);
    },
    getVoucherInfo: function (voucher) {
        return get_voucher_info(voucher);
    },
    getBlock: function (height) {
        return get_block(height);
    },
    getRewards: function (address) {
        return get_rewards(address);
    },
    getBlockHeight: function () {
        return get_block_height();
    },
    getBlockHeightRemote: function () {
        return get_block_height_remote();
    },
    encode: function (tx) {
        return encode_transaction(tx);
    },
    broadcast: function (tx) {
        return broadcast_transaction(tx);
    },
    broadcastLegacy: function (tx) {
        return broadcast_transaction_legacy(tx);
    },
    getAccount: function (address) {
        return get_account(address);
    },
    getAccountRemote: function (address) {
        return get_account_remote(address);
    },
    getLastCommit: function () {
        return get_last_commit();
    },
    getValidators: function () {
        return get_validators();
    },
    getCurrentValidators: function () {
        return get_current_validators();
    },
    getValidatorsByHeight: function (height) {
        return get_validators_at_height(height);
    },
    // txs: function(addr) {
    //   return Promise.all([
    //     req(`GET`, `/txs?sender=${addr}`)(),
    //     req(`GET`, `/txs?recipient=${addr}`)()
    //   ]).then(([senderTxs, recipientTxs]) => [].concat(senderTxs, recipientTxs))
    // },
};
var get_mempool = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, output_1, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | check_online_status | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/unconfirmed_txs' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    output_1 = resp.data;
                    return [2 /*return*/, output_1];
                case 3:
                    e_1 = _a.sent();
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var check_online_status = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, output_2, isOnlineGaiad, e_2, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | check_online_status | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    output_2 = {};
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, get_last_commit()];
                case 3:
                    isOnlineGaiad = _a.sent();
                    log.debug(tag, "isOnlineGaiad: ", isOnlineGaiad);
                    if (isOnlineGaiad)
                        output_2.gaiad = true;
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    log.error(tag, e_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, output_2];
                case 6:
                    e_3 = _a.sent();
                    throw e_3;
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_balance = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, output_3, url, accountInfo, i, entry, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_balance | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output_3 = 0;
                    url = URL_GAIAD + '/cosmos/bank/v1beta1/balances/' + address;
                    return [4 /*yield*/, axios({ method: 'GET', url: url })];
                case 2:
                    accountInfo = _a.sent();
                    log.info(tag, "accountInfo: ", accountInfo.data);
                    if (accountInfo && accountInfo.data && accountInfo.data.balances) {
                        for (i = 0; i < accountInfo.data.balances.length; i++) {
                            entry = accountInfo.data.balances[i];
                            if (entry.denom === 'uatom') {
                                output_3 = entry.amount / ATOM_BASE;
                            }
                        }
                    }
                    return [2 /*return*/, output_3];
                case 3:
                    e_4 = _a.sent();
                    throw e_4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_voucher_info = function (voucher) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, txInfo, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_voucher_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = URL_GAIAD + '/ibc/apps/transfer/v1/denom_traces/' + voucher;
                    // let url = URL_GAIAD + '/cosmos/bank/v1beta1/denoms_metadata/' + voucher;
                    // let url = URL_GAIAD + '/cosmos/bank/v1beta1/denoms_metadata/' + voucher;
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({ method: 'GET', url: url })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_5 = _a.sent();
                    throw e_5;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_balances = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, url, accountInfo, i, entry, balance, voucher, voucherInfo, balance, e_6, e_7;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tag = TAG + " | get_balances | ";
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    output = [];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 8, , 9]);
                    url = URL_GAIAD + '/cosmos/bank/v1beta1/balances/' + address;
                    return [4 /*yield*/, axios({ method: 'GET', url: url })
                        //
                    ];
                case 3:
                    accountInfo = _b.sent();
                    if (!((_a = accountInfo.data) === null || _a === void 0 ? void 0 : _a.balances)) return [3 /*break*/, 7];
                    i = 0;
                    _b.label = 4;
                case 4:
                    if (!(i < accountInfo.data.balances.length)) return [3 /*break*/, 7];
                    entry = accountInfo.data.balances[i];
                    if (entry.denom === 'uosmo') {
                        balance = {
                            type: 'balance',
                            asset: 'OSMO',
                            denom: 'uosmo',
                            balance: entry.amount
                        };
                        output.push(balance);
                    }
                    if (!(entry.denom.indexOf('ibc/') >= 0)) return [3 /*break*/, 6];
                    voucher = entry.denom.replace('ibc/', '');
                    log.info(tag, "voucher: ", voucher);
                    return [4 /*yield*/, get_voucher_info(voucher)];
                case 5:
                    voucherInfo = _b.sent();
                    log.info(tag, "voucherInfo: ", voucherInfo);
                    balance = {
                        type: 'ibcChannel',
                        ibc: true,
                        voucher: voucher,
                        denom: voucherInfo.denom_trace.base_denom,
                        channel: voucherInfo.denom_trace.path,
                        balance: entry.amount / 1000000
                    };
                    output.push(balance);
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7: return [3 /*break*/, 9];
                case 8:
                    e_6 = _b.sent();
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/, output];
                case 10:
                    e_7 = _b.sent();
                    log.error(tag, "e: ", e_7);
                    throw e_7;
                case 11: return [2 /*return*/];
            }
        });
    });
};
// let get_balances = async function(address:string){
//     let tag = TAG + " | get_balances | "
//     let output:any = {}
//     try{
//
//         let accountInfo = await get_account(address)
//         log.debug(tag,"accountInfo: ",accountInfo)
//         log.debug(tag,"accountInfo.result.value: ",accountInfo.result.value.coins[0].amount)
//         if(accountInfo && accountInfo.result && accountInfo.result.value.coins[0]){
//             log.debug(tag,"accountInfo: ", accountInfo.result.value.coins[0].amount )
//             output.available = accountInfo.result.value.coins[0].amount / ATOM_BASE
//         } else {
//             output.available = 0
//         }
//
//
//         let rewards = await get_rewards(address)
//         log.debug(tag,"rewards: ",rewards)
//
//         if(rewards && rewards.result && rewards.result.total[0]){
//             log.debug(tag,"rewards: ",rewards.result.total[0].amount)
//             output.rewards = rewards.result.total[0].amount / ATOM_BASE
//         } else {
//             output.rewards = 0
//         }
//
//         //get current blockheight
//         //let lastBlock = await get_block_height()
//
//         let delegations = await get_delegations_by_address(address)
//         log.debug(tag,"delegations: ",delegations)
//         let totalDelegated = 0
//         for(let i = 0; i < delegations.length; i++){
//             let delegation = delegations[i]
//             log.debug(tag,"delegation: ",delegation)
//             totalDelegated = totalDelegated + parseFloat(delegation.balance)
//         }
//         // @ts-ignore
//         totalDelegated = totalDelegated / ATOM_BASE
//         log.debug(tag,"totalDelegated: ",totalDelegated)
//         output.delegated = totalDelegated
//
//         //TODO totalRewardsPerBlock
//         // let totalRewardsPerBlock = 0
//         // for(let i = 0; i < rewards.result.rewards.length; i++){
//         // 	let reward = rewards.result.rewards[i]
//         // 	log.debug(tag,"reward: ",reward)
//         // 	//get rewards per block
//         //
//         // }
//         output.totalRewardsPerBlock = 0
//         //output.rewardsPerBlock = rewardsPerBlock
//         //TODO unbonding
//         output.unbonding = 0
//
//         return output
//     }catch(e){
//         throw e
//     }
// }
var get_delegations_txs_address = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, output_4, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_delegations_txs_address | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/staking/delegators/' + address + '/txs' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    output_4 = resp.data;
                    return [2 /*return*/, output_4];
                case 3:
                    e_8 = _a.sent();
                    throw e_8;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_rewards = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, output_5, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_rewards | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/distribution/delegators/' + address + '/rewards' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    output_5 = resp.data;
                    return [2 /*return*/, output_5];
                case 3:
                    e_9 = _a.sent();
                    throw e_9;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_delegations_by_address = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, output_6, e_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_delegations_by_validator | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/staking/delegators/' + address + '/delegations' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    output_6 = resp.data.result;
                    return [2 /*return*/, output_6];
                case 3:
                    e_10 = _a.sent();
                    throw e_10;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_delegations_by_validator = function (address, validator) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, output_7, e_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_delegations_by_validator | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/staking/delegators/' + address + '/delegations/' + validator })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    output_7 = resp.data.result;
                    return [2 /*return*/, output_7];
                case 3:
                    e_11 = _a.sent();
                    throw e_11;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_current_validators = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, output_8, e_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_current_validators | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/validators' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    output_8 = resp.data.result;
                    return [2 /*return*/, output_8];
                case 3:
                    e_12 = _a.sent();
                    throw e_12;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_last_commit = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, output_9, e_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_last_commit | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/commit' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    output_9 = resp.data;
                    return [2 /*return*/, output_9];
                case 3:
                    e_13 = _a.sent();
                    throw e_13;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_block_height = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, height, e_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_block_height | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/blocks/latest' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    height = resp.data.block.header.height;
                    return [2 /*return*/, parseInt(height)];
                case 3:
                    e_14 = _a.sent();
                    throw e_14;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_block_height_remote = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, lastBlockRemote, e_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_block_height_remote | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/blocks/latest' })];
                case 2:
                    lastBlockRemote = _a.sent();
                    log.debug(tag, "lastBlockRemote: ", lastBlockRemote.data.block.header.height);
                    return [2 /*return*/, lastBlockRemote.data];
                case 3:
                    e_15 = _a.sent();
                    throw e_15;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_validators_at_height = function (height) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_validators | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    txInfo = void 0;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/validatorsets/' + height })];
                case 2:
                    //
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_16 = _a.sent();
                    throw e_16;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_validators = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_validators | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    txInfo = void 0;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/staking/validators' })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_17 = _a.sent();
                    throw e_17;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_txs_by_height = function (height) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, nodeHeight, txInfo, e_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_txs_by_height | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, get_block_height()
                        //if > request error
                        // @ts-ignore
                    ];
                case 2:
                    nodeHeight = _a.sent();
                    //if > request error
                    // @ts-ignore
                    if (nodeHeight < height)
                        throw Error("102: unable to get block! ");
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/cosmos/tx/v1beta1/txs?events=tx.height=' + height })];
                case 3:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo);
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data.tx_responses];
                case 4:
                    e_18 = _a.sent();
                    console.error(e_18);
                    throw e_18;
                case 5: return [2 /*return*/];
            }
        });
    });
};
var get_block = function (height) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_19;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_block | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    //
                    log.debug(tag, " URL_GAIAD: ", URL_GAIAD);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/blocks/' + height })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_19 = _a.sent();
                    //TODO dont shh error fix em
                    throw e_19;
                case 4: return [2 /*return*/];
            }
        });
    });
};
/*
    Method: getAccount

    Output:

        {
           type:'auth/Account',
           value:{
              address:'cosmos1a7xqkxa4wyjfllme9u3yztgsz363dalzey4myg',
              coins:[
                 [
                    Object
                 ]
              ],
              public_key:{
                 type:'tendermint/PubKeySecp256k1',
                 value:'A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B'
              },
              account_number:'19785',
              sequence:'31'
           }
        }


https://docs.cosmos.network/cosmos/auth/v1beta1/accounts/{address}


 */
var get_account = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_20;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_account | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    txInfo = void 0;
                    return [4 /*yield*/, axios({
                            method: 'GET',
                            url: "".concat(URL_GAIAD, "/cosmos/auth/v1beta1/accounts/").concat(address),
                        })];
                case 2:
                    // let url = 'https://api.cosmos.shapeshift.com/api/v1/account/'+address
                    // //
                    // txInfo = await axios({method:'GET',url})
                    // log.debug(tag,"txInfo: ",txInfo.data)
                    txInfo = _a.sent();
                    // txInfo = await axios({
                    //     method: 'GET',
                    //     url: `https://atom.nownodes.io/cosmos/auth/v1beta1/accounts/${address}`,
                    //     headers: {
                    //         'api-key': process.env['NOW_NODES_API'],
                    //     },
                    // });
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_20 = _a.sent();
                    throw e_20;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_account_remote = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_account | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    txInfo = void 0;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/auth/v1beta1/accounts/' + address })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_21 = _a.sent();
                    throw e_21;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var encode_transaction = function (tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, payload, urlRemote, result2, e_22, e_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | encode_transaction | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    log.debug(tag, "CHECKPOINT 1");
                    output.success = false;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    payload = {
                        "tx_bytes": btoa(tx),
                        "mode": "BROADCAST_MODE_SYNC"
                    };
                    urlRemote = URL_GAIAD + '/txs/encode';
                    log.info(tag, "urlRemote: ", urlRemote);
                    return [4 /*yield*/, axios({
                            url: urlRemote,
                            headers: {
                                'api-key': process.env['NOW_NODES_API'],
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            data: payload,
                        })];
                case 3:
                    result2 = _a.sent();
                    log.info(tag, '** Broadcast ** REMOTE: result: ', result2.data);
                    return [3 /*break*/, 5];
                case 4:
                    e_22 = _a.sent();
                    //log.error(tag,"failed second broadcast e: ",e.response)
                    log.error(tag, e_22);
                    // log.error(tag,e.response)
                    // log.error(tag,e.response.data)
                    // log.error(tag,e.response.data.error)
                    // log.error(tag,e.response.data.error.indexOf('RPC error -32603 - Internal error: Tx already exists in cache'))
                    //throw e
                    output.success = false;
                    output.error = e_22.response.data.error;
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, output];
                case 6:
                    e_23 = _a.sent();
                    console.error(tag, "throw error: ", e_23);
                    return [2 /*return*/, output];
                case 7: return [2 /*return*/];
            }
        });
    });
};
/*

The tx must be a signed StdTx. The supported broadcast modes include "block"(return after tx commit), "sync"(return afer CheckTx) and "async"(return right away).



    Input tx example:

    {
      "tx": {
        "msg": [
          "string"
        ],
        "fee": {
          "gas": "string",
          "amount": [
            {
              "denom": "stake",
              "amount": "50"
            }
          ]
        },
        "memo": "string",
        "signature": {
          "signature": "MEUCIQD02fsDPra8MtbRsyB1w7bqTM55Wu138zQbFcWx4+CFyAIge5WNPfKIuvzBZ69MyqHsqD8S1IwiEp+iUb6VSdtlpgY=",
          "pub_key": {
            "type": "tendermint/PubKeySecp256k1",
            "value": "Avz04VhtKJh8ACCVzlI8aTosGy0ikFXKIVHQ3jKMrosH"
          },
          "account_number": "0",
          "sequence": "0"
        }
      },
      "mode": "block"
    }


    responce:

    {
      "check_tx": {
        "code": 0,
        "data": "data",
        "log": "log",
        "gas_used": 5000,
        "gas_wanted": 10000,
        "info": "info",
        "tags": [
          "",
          ""
        ]
      },
      "deliver_tx": {
        "code": 5,
        "data": "data",
        "log": "log",
        "gas_used": 5000,
        "gas_wanted": 10000,
        "info": "info",
        "tags": [
          "",
          ""
        ]
      },
      "hash": "EE5F3404034C524501629B56E0DDC38FAD651F04",
      "height": 0
    }

 */
var broadcast_transaction = function (tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, payload, urlRemote, result2, logSend, e_24, e_25;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | broadcast_transaction | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    log.debug(tag, "CHECKPOINT 1");
                    output.success = false;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    payload = {
                        // "tx_bytes": btoa(tx),
                        // "tx_bytes":broadcastTx,
                        "tx_bytes": tx,
                        "mode": "BROADCAST_MODE_SYNC"
                    };
                    urlRemote = URL_GAIAD + '/cosmos/tx/v1beta1/txs';
                    // let urlRemote = URL_GAIAD+ '/txs'
                    log.info(tag, "urlRemote: ", urlRemote);
                    return [4 /*yield*/, axios({
                            url: urlRemote,
                            headers: {
                                'api-key': process.env['NOW_NODES_API'],
                                'Content-Type': 'application/json'
                            },
                            method: 'POST',
                            data: payload,
                        })];
                case 3:
                    result2 = _a.sent();
                    log.info(tag, '** Broadcast ** REMOTE: result: ', result2.data);
                    log.info(tag, '** Broadcast ** REMOTE: result: ', JSON.stringify(result2.data));
                    if (result2.data.txhash)
                        output.txid = result2.data.txhash;
                    if (result2.data.tx_response.txhash)
                        output.txid = result2.data.tx_response.txhash;
                    //push to seed
                    // let urlRemote = URL_GAIAD+ '/broadcast_tx_sync?tx='+tx
                    // log.debug(tag,"urlRemote: ",urlRemote)
                    // let result2 = await axios({
                    //     url: urlRemote,
                    //     headers: {
                    //         'api-key': process.env['NOW_NODES_API'],
                    //         'Content-Type': 'application/json'
                    //     },
                    //     method: 'GET'
                    // })
                    // log.debug(tag,'** Broadcast ** REMOTE: result: ', result2.data)
                    // if(result2.data.txhash) output.txid = result2.data.txhash
                    // let urlRemote = URL_GAIAD+ '/broadcast_tx_sync'
                    // log.debug(tag,"urlRemote: ",urlRemote)
                    // let result2 = await axios({
                    //     url: urlRemote,
                    //     headers: {
                    //         'api-key': process.env['NOW_NODES_API'],
                    //         'Content-Type': 'application/json'
                    //     },
                    //     method: 'POST',
                    //     data: tx,
                    // })
                    // log.debug(tag,'** Broadcast ** REMOTE: result: ', result2.data)
                    // if(result2.data.txhash) output.txid = result2.data.txhash
                    //verify success
                    if (result2.data.raw_log) {
                        logSend = result2.data.raw_log;
                        log.debug(tag, "logSend: ", logSend);
                    }
                    if (result2.data.code === 4) {
                        output.success = false;
                    }
                    else {
                        output.success = true;
                    }
                    output.height = result2.height;
                    output.gas_wanted = result2.gas_wanted;
                    output.gas_used = result2.gas_used;
                    output.raw = result2.data.raw_log;
                    return [3 /*break*/, 5];
                case 4:
                    e_24 = _a.sent();
                    //log.error(tag,"failed second broadcast e: ",e.response)
                    log.error(tag, e_24);
                    log.error(tag, e_24.response);
                    log.error(tag, e_24.response.data);
                    // log.error(tag,e.response.data.error)
                    // log.error(tag,e.response.data.error.indexOf('RPC error -32603 - Internal error: Tx already exists in cache'))
                    //throw e
                    output.success = false;
                    output.error = e_24.response;
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, output];
                case 6:
                    e_25 = _a.sent();
                    console.error(tag, "throw error: ", e_25);
                    return [2 /*return*/, output];
                case 7: return [2 /*return*/];
            }
        });
    });
};
var broadcast_transaction_legacy = function (tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, urlRemote, result2, logSend, e_26, e_27;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | broadcast_transaction | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    log.debug(tag, "CHECKPOINT 1");
                    output.success = false;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    urlRemote = "https://atom.nownodes.io" + '/txs';
                    log.debug(tag, "urlRemote: ", urlRemote);
                    return [4 /*yield*/, axios({
                            url: urlRemote,
                            method: 'POST',
                            data: tx,
                        })];
                case 3:
                    result2 = _a.sent();
                    log.debug(tag, '** Broadcast ** REMOTE: result: ', result2.data);
                    if (result2.data.txhash)
                        output.txid = result2.data.txhash;
                    //verify success
                    if (result2.data.raw_log) {
                        logSend = result2.data.raw_log;
                        log.debug(tag, "logSend: ", logSend);
                    }
                    if (result2.data.code === 4) {
                        output.success = false;
                    }
                    else {
                        output.success = true;
                    }
                    output.height = result2.height;
                    output.gas_wanted = result2.gas_wanted;
                    output.gas_used = result2.gas_used;
                    output.raw = result2.data.raw_log;
                    return [3 /*break*/, 5];
                case 4:
                    e_26 = _a.sent();
                    //log.error(tag,"failed second broadcast e: ",e.response)
                    log.error(tag, e_26);
                    log.error(tag, e_26.response);
                    log.error(tag, e_26.response.data);
                    // log.error(tag,e.response.data.error)
                    // log.error(tag,e.response.data.error.indexOf('RPC error -32603 - Internal error: Tx already exists in cache'))
                    //throw e
                    output.success = false;
                    output.error = e_26.response.data.error;
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, output];
                case 6:
                    e_27 = _a.sent();
                    console.error(tag, "throw error: ", e_27);
                    return [2 /*return*/, output];
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_node_info = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, output_10, nodeInfo, e_28;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output_10 = {};
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/node_info' })];
                case 2:
                    nodeInfo = _a.sent();
                    log.debug(tag, "nodeInfo: ", nodeInfo.data);
                    return [2 /*return*/, output_10];
                case 3:
                    e_28 = _a.sent();
                    throw e_28;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_node_info_verbose = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, output_11, nodeInfo, e_29;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output_11 = {};
                    return [4 /*yield*/, axios({
                            method: 'GET',
                            headers: {
                                'api-key': process.env['NOW_NODES_API'],
                                'Content-Type': 'application/json'
                            },
                            url: URL_GAIAD + '/node_info'
                        })];
                case 2:
                    nodeInfo = _a.sent();
                    log.debug(tag, "nodeInfo: ", nodeInfo.data);
                    // output = nodeInfo.data
                    //
                    // let lastBlockRemote = await axios({method:'GET',url: URL_GAIAD+'/blocks/latest'})
                    // log.debug(tag,"lastBlockRemote: ",lastBlockRemote.data)
                    //
                    // //let height
                    // output.remoteHeight = lastBlockRemote.data.block_meta.header.height
                    //
                    // let lastBlock = await axios({method:'GET',url: URL_GAIAD+'/blocks/latest'})
                    // log.debug(tag,"lastBlock: ",lastBlock.data)
                    //
                    // //let height
                    // output.height = lastBlock.data.block_meta.header.height
                    //estimate time till synced
                    //get block height
                    // await sleep(1000)
                    // //wait 1 seconds
                    // let lastBlock2 = await axios({method:'GET',url: URL_GAIAD+'/blocks/latest'})
                    // log.debug(tag,"lastBlock2: ",lastBlock2.data)
                    //
                    // let difference = output.height - lastBlock2.data.block_meta.header.height
                    // log.debug(tag,"difference: ",difference)
                    //
                    // output.blocksPerSecond = Math.abs(difference)
                    //
                    // let remaining = parseInt(output.height) - parseInt(2036386)
                    // log.debug(tag,"remaining: ",remaining)
                    //
                    // let timeRemaining =  parseInt(output.blocksPerSecond) * Math.abs(parseInt(remaining))
                    // output.timeRemaining = timeRemaining / 60
                    //get block height
                    //let lastBlock = await axios({method:'GET',url:URL+'/node_info'})
                    return [2 /*return*/, output_11];
                case 3:
                    e_29 = _a.sent();
                    throw e_29;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_node_syncing = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_30;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/syncing' })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_30 = _a.sent();
                    throw e_30;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_node_version = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_31;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/node_version' })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_31 = _a.sent();
                    throw e_31;
                case 4: return [2 /*return*/];
            }
        });
    });
};
/*


    txid:'66b0b99ee373064cdf8ce24b86b45c087ae50f5eaa32d2ee24dd26e39a5e3455',
    status: 'confirmed',
    type: 'send',
    amount: -78602,
    date: '2019-05-10T21:01:23Z',
    confirmations: 1055,
    network: 'BTC',
    xpub:'xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4'


 */
var normalize_tx = function (tx, type) {
    var output = {};
    //
    output.txid = tx.txhash;
    output.height = tx.height;
    if (tx.height)
        output.status = "confirmed";
    output.type = "transfer";
    var event = {};
    //TODO my god this is ugly? and does it always work?
    if (type === 'send') {
        event.amount = tx.tx.value.msg[0].value.amount[0].amount * -1;
    }
    else {
        event.amount = tx.tx.value.msg[0].value.amount[0].amount;
    }
    output.date = tx.timestamp;
    output.network = ASSET;
    output.symbol = 'ATOM';
    output.coin = 'ATOM';
    output.height = tx.height;
    output.gas_used = tx.gas_used;
    output.gas_wanted = tx.gas_wanted;
    return output;
};
var get_txs_by_address = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, output_12, url, resultSends, sends, e_32;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = ' | get_txs_by_address | ';
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.debug(tag, "checkpoint: ", address);
                    output_12 = [];
                    url = URL_GAIAD + '/cosmos/tx/v1beta1/txs?events=transfer.recipient=%27' + address + '%27&events=message.module=%27ibc_client%27';
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 2:
                    resultSends = _a.sent();
                    sends = resultSends.data;
                    // log.debug('sends: ', sends)
                    console.log("resp: ", sends.tx_responses);
                    // TODO//pagnation
                    // let pagesSends = sends.page_number
                    // for(let i = 0; i < pagesSends; i++){
                    //
                    // }
                    // for(let i = 0; i < sends.txs.length; i++ ){
                    //     let tx = sends.txs[i]
                    //     //normalize
                    //     //tx = normalize_tx(tx,'send')
                    //     output.push(tx)
                    // }
                    //receives
                    // url = URL_GAIAD+ '/txs?transfer.recipient='+address
                    // let resultRecieves = await axios({
                    //     url: url,
                    //     method: 'GET'
                    // })
                    // let receives = resultRecieves.data
                    // log.debug('receives: ', receives)
                    //
                    // for(let i = 0; i < receives.txs.length; i++ ){
                    //     let tx = receives.txs[i]
                    //     //normalize
                    //     //tx = normalize_tx(tx,'receive')
                    //     output.push(tx)
                    // }
                    //staking tx's
                    // let resultStaking = await axios({method:'GET',url: URL_GAIAD+'/txs?delegator='+address})
                    // let stakings = resultStaking.data
                    // for(let i = 0; i < stakings.length; i++) {
                    // 	let stake = stakings[i]
                    // 	let stakeTx = {}
                    //
                    //
                    // 	log.debug(tag,"stakeTX: ",stake)
                    // 	log.debug(tag,"stake: ",stake.tx.value.msg[0].value.amount.amount)
                    //
                    // 	let tagInfo = {}
                    // 	for(let i = 0; i < stake.tags.length; i++){
                    // 		let tag = stake.tags[i]
                    // 		log.debug(tag,"tag: ",tag)
                    // 		tagInfo[tag.key] = tag.value
                    // 	}
                    // 	log.debug(tag,"tagInfo: ",tagInfo)
                    //
                    // 	//if unbonding else
                    // 	if(tagInfo.action === "begin_unbonding"){
                    // 		stakeTx.amount = parseInt(stake.tx.value.msg[0].value.amount.amount)
                    // 		stakeTx.txid = stake.txhash
                    // 		stakeTx.status = 'confirmed'
                    // 		stakeTx.type = 'unDelegate'
                    // 		stakeTx.stake = true
                    // 		stakeTx.unBonding = true
                    // 		stakeTx.unBondingTime = tagInfo['end-time']
                    // 		stakeTx.height = stake.height
                    // 		stakeTx.gas_used = stake.gas_used
                    // 		stakeTx.gas_wanted = stake.gas_wanted
                    //
                    // 		stakeTx.validator =  tagInfo['source-validator']
                    // 		// stakeTx.validatorLink = deligationTxInfo.tx.value.msg[0].value.Description.website
                    // 		// stakeTx.validatorDetails = deligationTxInfo.tx.value.msg[0].value.Description.details
                    // 		// stakeTx.validatorAddress = deligationTxInfo.tx.value.msg[0].value.Description.address
                    // 		// stakeTx.validatorCommision = deligationTxInfo.tx.value.msg[0].value.Description.commission_rate
                    // 		stakeTx.network = 'ATOM'
                    // 		stakeTx.symbol = 'ATOM'
                    // 		stakeTx.coin = 'ATOM'
                    // 		// stakeTx.date = deligationTxInfo.timestamp
                    // 	}else{
                    // 		stakeTx.amount = parseInt(stake.tx.value.msg[0].value.amount.amount)
                    // 		stakeTx.txid = stake.txhash
                    // 		stakeTx.status = 'confirmed'
                    // 		stakeTx.type = 'delegate'
                    // 		stakeTx.stake = true
                    // 		stakeTx.height = stake.height
                    // 		stakeTx.gas_used = stake.gas_used
                    // 		stakeTx.gas_wanted = stake.gas_wanted
                    //
                    // 		stakeTx.validator = tagInfo['destination-validator']
                    // 		// stakeTx.validatorLink = deligationTxInfo.tx.value.msg[0].value.Description.website
                    // 		// stakeTx.validatorDetails = deligationTxInfo.tx.value.msg[0].value.Description.details
                    // 		// stakeTx.validatorAddress = deligationTxInfo.tx.value.msg[0].value.Description.address
                    // 		// stakeTx.validatorCommision = deligationTxInfo.tx.value.msg[0].value.Description.commission_rate
                    // 		stakeTx.network = 'ATOM'
                    // 		stakeTx.symbol = 'ATOM'
                    // 		stakeTx.coin = 'ATOM'
                    // 		// stakeTx.date = deligationTxInfo.timestamp
                    // 	}
                    //
                    // 	log.debug(tag,"stakeTx: ",stakeTx)
                    // 	output.push(stakeTx)
                    // }
                    return [2 /*return*/, output_12];
                case 3:
                    e_32 = _a.sent();
                    console.error(tag, 'Error: ', e_32);
                    throw e_32;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var getTransaction = function (txid) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_33;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | getTransaction | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    txInfo = void 0;
                    log.debug("gaiacli get tx");
                    log.debug(tag, "URL_GAIAD: ", URL_GAIAD);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/cosmos/tx/v1beta1/txs/' + txid })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_33 = _a.sent();
                    throw e_33;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var getStakingInfo = function (address, valAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_34;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | getStakingTxs | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_GAIAD + '/txs?delegator=' + address })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_34 = _a.sent();
                    throw e_34;
                case 4: return [2 /*return*/];
            }
        });
    });
};
