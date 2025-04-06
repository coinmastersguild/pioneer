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
Object.defineProperty(exports, "__esModule", { value: true });
/*
     OSMO Network

     https://api-osmosis.imperator.co/swagger/#/

    OSMO version of cosmoSDK
    https://v1.cosmos.network/rpc/v0.41.4

        https://github.com/osmosis-labs/osmosis-frontend/tree/master/src/stores/osmosis/query

    endpoints
    '/osmosis/gamm/v1beta1/num_pools'
    `/osmosis/pool-incentives/v1beta1/distr_info`
    `/osmosis/mint/v1beta1/epoch_provisions`
    '/osmosis/pool-incentives/v1beta1/lockable_durations'
    `/cosmos/params/v1beta1/params?subspace=gamm&key=PoolCreationFee`
    `/osmosis/mint/v1beta1/params`
    `/osmosis/claim/v1beta1/params`
    `/osmosis/gamm/v1beta1/pools/${poolId}`
    `/osmosis/claim/v1beta1/total_claimable/${bech32Address}`
    `/osmosis/lockup/v1beta1/account_unlockable_coins/${bech32Address}`
    `/osmosis/lockup/v1beta1/account_locked_coins/${bech32Address}`
    `/osmosis/lockup/v1beta1/account_unlocking_coins/${bech32Address}`
    `/osmosis/claim/v1beta1/claim_record/${bech32Address}`
    `/osmosis/incentives/v1beta1/gauge_by_id/${id}`
    `/osmosis/gamm/v1beta1/pools?pagination.limit=500`
    `/osmosis/lockup/v1beta1/account_locked_longer_duration/${bech32Address}`
    '/osmosis/pool-incentives/v1beta1/incentivized_pools'


    IBC
    `/ibc/core/channel/v1beta1/channels/${params.channelId}/ports/${params.portId}`
    `/ibc/core/channel/v1beta1/channels/${channelId}/ports/${portId}/client_state`
    "/cosmos/base/tendermint/v1beta1/node_info"

    voucher denoum trace
    /ibc/applications/transfer/v1beta1/denom_traces


*/
var pjson = require("../package.json");
var TAG = " | " + pjson.name.replace("@pioneer-platform/", "") + " | ";
// @ts-ignore
var lodash_1 = require("lodash");
require("dotenv").config({ path: '../../../.env' });
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
// import { marshalTx, unmarshalTx } from '@tendermint/amino-js';
// import { Dec, DecUtils, Int, IntPretty } from "@keplr-wallet/unit";
var request = require("request-promise");
var log = require('@pioneer-platform/loggerdog')();
var URL_OSMO_RPC = process.env['URL_OSMO_RPC'];
if (!URL_OSMO_RPC)
    throw Error('missing env URL_OSMO_RPC');
var URL_OSMO_LCD = process.env['URL_OSMO_LCD'];
if (!URL_OSMO_LCD)
    throw Error('missing env URL_OSMO_LCD');
var URL_OSMO_POOLS = process.env['URL_OSMO_POOLS'] || "https://api-osmosis.imperator.co";
var BASE_OSMO = 1000000;
/**********************************
 // Module
 //**********************************/
module.exports = {
    init: function (url, settings) {
        log.info(TAG, "init", url, settings);
        URL_OSMO_RPC = url;
        return true;
    },
    isOnline: function () {
        return true;
    },
    info: function () {
        return get_node_info_verbose();
    },
    getBlockHeight: function () {
        return get_block_height();
    },
    getBalance: function (address) {
        return get_balance(address);
    },
    getBalances: function (address) {
        return get_balances(address);
    },
    getDelegations: function (address) {
        return get_delegations_by_address(address);
    },
    getRewards: function (address) {
        return get_rewards(address);
    },
    getAccount: function (address) {
        return get_account_info(address);
    },
    getIbcTrace: function (voucher) {
        return get_voucher_info(voucher);
    },
    getPools: function () {
        return get_pools();
    },
    getPool: function (pair) {
        return get_pool(pair);
    },
    getValidators: function () {
        return get_validators();
    },
    getDelegationsByValidator: function (address, validator) {
        return get_delegations(address, validator);
    },
    getAccountInfo: function (address) {
        return get_account_info(address);
    },
    txs: function (address) {
        return get_txs_by_address(address);
    },
    txsAtHeight: function (height) {
        return get_txs_at_height(height);
    },
    getBlock: function (block) {
        return get_block(block);
    },
    getEpochProvisions: function () {
        return get_epoch_provisions();
    },
    getTransaction: function (txid) {
        return get_transaction(txid);
    },
    getMintParams: function () {
        return get_mint_params();
    },
    getSupply: function (denom) {
        return get_total_supply(denom);
    },
    getPoolInfo: function () {
        return get_pool_info();
    },
    getDistrobution: function () {
        return get_distrobution_params();
    },
    getAPR: function () {
        return get_APR();
    },
    getEpochs: function () {
        return get_epochs();
    },
    transaction: function (txid) {
        return get_transaction(txid);
    },
    broadcast: function (tx) {
        return broadcast_transaction(tx);
    },
};
/**********************************
 // Lib
 //**********************************/
var get_APR = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, mintParams, distributionProportions, getEpochs, epochProvisionInfo, durationSeconds, epochProvision, poolInfo, bondedToken, mintingEpochProvision, yearMintingProvision, totalSupply, ratio, inflation, apr, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_APR | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, get_mint_params()];
                case 2:
                    mintParams = _a.sent();
                    log.debug(tag, "mintParams:", mintParams);
                    distributionProportions = mintParams.params.distribution_proportions.staking;
                    log.debug(tag, "distributionProportions:", distributionProportions);
                    return [4 /*yield*/, get_epochs()];
                case 3:
                    getEpochs = _a.sent();
                    log.debug(tag, "getEpochs:", getEpochs);
                    epochProvisionInfo = getEpochs.epochs.filter(function (e) { return e.identifier === 'day'; });
                    epochProvisionInfo = epochProvisionInfo[0];
                    log.debug(tag, "epochProvisionInfo:", epochProvisionInfo);
                    durationSeconds = epochProvisionInfo.duration.replace("s", "");
                    log.debug(tag, "durationSeconds:", durationSeconds);
                    return [4 /*yield*/, get_epoch_provisions()
                        //get bonded tokens
                    ];
                case 4:
                    epochProvision = _a.sent();
                    return [4 /*yield*/, get_pool_info()];
                case 5:
                    poolInfo = _a.sent();
                    bondedToken = poolInfo.pool.bonded_tokens;
                    log.debug(tag, "bondedToken:", bondedToken);
                    // mintingEpochProvision = epochProvision * distributionProportions
                    log.debug(tag, "epochProvision:", epochProvision);
                    log.debug(tag, "distributionProportions:", distributionProportions);
                    mintingEpochProvision = epochProvision * distributionProportions;
                    log.debug(tag, "mintingEpochProvision:", mintingEpochProvision);
                    yearMintingProvision = mintingEpochProvision * ((365 * 24 * 3600) / durationSeconds);
                    log.debug(tag, "yearMintingProvision:", yearMintingProvision);
                    totalSupply = 1000000000;
                    // //let totalSupply = await get_total_supply('uosmo')
                    // log.debug(tag,"totalSupply:",totalSupply)
                    // totalSupply = totalSupply.result.amount
                    // log.debug(tag,"totalSupply:",totalSupply)
                    if (!totalSupply)
                        throw Error("unable to calc APR: missing totalSupply");
                    if (!epochProvision)
                        throw Error("unable to calc APR: missing epochProvision");
                    ratio = bondedToken / totalSupply;
                    log.debug(tag, "ratio:", ratio);
                    inflation = yearMintingProvision / totalSupply;
                    log.debug(tag, "inflation:", inflation);
                    apr = inflation / ratio;
                    log.debug(tag, "apr:", apr);
                    apr = apr * 100;
                    return [2 /*return*/, apr];
                case 6:
                    e_1 = _a.sent();
                    throw e_1;
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_distrobution_params = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_distrobution_params | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/cosmos/distribution/v1beta1/params' })];
                case 2:
                    txInfo = _a.sent();
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_2 = _a.sent();
                    throw e_2;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_pool_info = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_pool_info | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/cosmos/staking/v1beta1/pool' })];
                case 2:
                    txInfo = _a.sent();
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_3 = _a.sent();
                    throw e_3;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_epoch_provisions = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_total_supply | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/osmosis/mint/v1beta1/epoch_provisions' })];
                case 2:
                    txInfo = _a.sent();
                    return [2 /*return*/, txInfo.data.epoch_provisions];
                case 3:
                    e_4 = _a.sent();
                    throw e_4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_total_supply = function (denom) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_total_supply | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.debug(tag, "url: ", URL_OSMO_LCD + '/bank/total/' + denom);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/bank/total/' + denom })];
                case 2:
                    txInfo = _a.sent();
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_5 = _a.sent();
                    throw e_5;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_mint_params = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_mint_params | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/osmosis/mint/v1beta1/params' })];
                case 2:
                    txInfo = _a.sent();
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_6 = _a.sent();
                    throw e_6;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_epochs = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_epochs | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + "/osmosis/epochs/v1beta1/epochs" })];
                case 2:
                    txInfo = _a.sent();
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_7 = _a.sent();
                    throw e_7;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_voucher_info = function (voucher) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, url, txInfo, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_voucher_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    url = URL_OSMO_LCD + '/ibc/apps/transfer/v1/denom_traces/' + voucher;
                    log.info(tag, "url: ", url);
                    return [4 /*yield*/, axios({ method: 'GET', url: url })];
                case 2:
                    txInfo = _a.sent();
                    log.info(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_8 = _a.sent();
                    throw e_8;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_block = function (height) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_block | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    //
                    log.debug(tag, " URL_OSMO_LCD: ", URL_OSMO_LCD);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/blocks/' + height })
                        // log.debug(tag,"txInfo: ",txInfo.data)
                        //for each tx in block decode
                        // log.debug(tag,"txInfo: ",txInfo.data.block)
                    ];
                case 2:
                    txInfo = _a.sent();
                    // log.debug(tag,"txInfo: ",txInfo.data)
                    //for each tx in block decode
                    // log.debug(tag,"txInfo: ",txInfo.data.block)
                    log.debug(tag, "txInfo: ", txInfo.data.block.data.txs);
                    // txInfo.data.block.data.txsDecoded = []
                    // for(let i = 0; i < txInfo.data.block.data.txs.length; i++){
                    //     let txEncoded = txInfo.data.block.data.txs[i]
                    //     let txDecoded = unmarshalTx(txEncoded)
                    //     log.debug(tag,"txDecoded: ", txDecoded )
                    //     txInfo.data.block.data.txsDecoded(txDecoded)
                    // }
                    log.debug(tag, "txInfo: ", txInfo.data.block.data.txs);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_9 = _a.sent();
                    //TODO dont shh error fix em
                    throw e_9;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_staking_txs = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_staking_txs | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/txs?delegator=' + address })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_10 = _a.sent();
                    throw e_10;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_rewards = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, output_1, e_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_rewards | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/distribution/delegators/' + address + '/rewards' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    output_1 = resp.data;
                    return [2 /*return*/, output_1];
                case 3:
                    e_11 = _a.sent();
                    throw e_11;
                case 4: return [2 /*return*/];
            }
        });
    });
};
//
var get_block_height = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, height, e_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_block_height | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/blocks/latest' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    height = resp.data.block.header.height;
                    return [2 /*return*/, parseInt(height)];
                case 3:
                    e_12 = _a.sent();
                    throw e_12;
                case 4: return [2 /*return*/];
            }
        });
    });
};
//get pools
var get_pool = function (pair) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, assets, poolInfo, sellAssetDenom_1, buyAssetDenom_1, foundPool, e_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_pool | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    if (pair.indexOf("_") === -1)
                        throw Error("Pair needs to use _ example (ATOM_OSMO)");
                    assets = pair.split("_");
                    if (assets[0] === 'ATOM')
                        assets[0] = "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2";
                    if (assets[1] === 'ATOM')
                        assets[1] = "ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2";
                    if (assets[0] === 'OSMO')
                        assets[0] = "uosmo";
                    if (assets[1] === 'OSMO')
                        assets[1] = "uosmo";
                    return [4 /*yield*/, get_pools()
                        // log.debug(tag,"poolInfo: ",poolInfo.data)
                    ];
                case 2:
                    poolInfo = _a.sent();
                    sellAssetDenom_1 = assets[0];
                    buyAssetDenom_1 = assets[1];
                    foundPool = (0, lodash_1.find)(poolInfo.data.pools, function (pool) {
                        var token0Denom = pool.poolAssets[0].token.denom;
                        var token1Denom = pool.poolAssets[1].token.denom;
                        return ((token0Denom === sellAssetDenom_1 && token1Denom === buyAssetDenom_1) ||
                            (token0Denom === buyAssetDenom_1 && token1Denom === sellAssetDenom_1));
                    });
                    if (!foundPool)
                        throw new Error('Couldnt find pool');
                    return [2 /*return*/, foundPool];
                case 3:
                    e_13 = _a.sent();
                    throw e_13;
                case 4: return [2 /*return*/];
            }
        });
    });
};
//get pools
var get_pools = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, poolInfo, e_14;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_pools | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/osmosis/gamm/v1beta1/pools' })];
                case 2:
                    poolInfo = _a.sent();
                    log.debug(tag, "poolInfo: ", poolInfo.data);
                    //wtf is imperator?
                    // let txInfo
                    // let poolInfo = await axios({method:'GET',url: URL_OSMO_POOLS+'/search/v1/pools'})
                    // log.debug(tag,"txInfo: ",poolInfo.data)
                    return [2 /*return*/, poolInfo.data];
                case 3:
                    e_14 = _a.sent();
                    throw e_14;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_delegations_by_address = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, resp, output_2, e_15;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_delegations_by_validator | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/staking/delegators/' + address + '/delegations' })];
                case 2:
                    resp = _a.sent();
                    log.debug(tag, "resp: ", resp.data);
                    output_2 = resp.data.result;
                    return [2 /*return*/, output_2];
                case 3:
                    e_15 = _a.sent();
                    throw e_15;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_delegations = function (address, valAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, txInfo, e_16;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_delegations | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    // let txInfo
                    log.debug(URL_OSMO_LCD + '/staking/delegators/' + address + '/delegations/' + valAddress);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/staking/delegators/' + address + '/delegations/' + valAddress })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    // let txInfo = await axios({method:'GET',url: URL_OSMO_LCD+'/txs?delegator='+address})
                    // log.debug(tag,"txInfo: ",txInfo.data)
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
        var tag, output, txInfo, validators, e_17;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_validators | ";
                    output = {};
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    txInfo = void 0;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/staking/validators' })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    if (!txInfo.data.result)
                        throw Error("103: failed to get validators! ");
                    validators = txInfo.data.result;
                    //sort by tokens
                    validators.sort(function (a, b) {
                        return parseInt(a.tokens) - parseInt(b.tokens);
                    });
                    validators.reverse();
                    return [2 /*return*/, validators];
                case 3:
                    e_17 = _a.sent();
                    throw e_17;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_transaction = function (txid) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, txInfo, e_18;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_transaction | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/cosmos/tx/v1beta1/txs/' + txid })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_18 = _a.sent();
                    //if not found
                    throw e_18;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var broadcast_transaction = function (tx) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, payload, urlRemote, result2, logSend, e_19, e_20;
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
                        "tx_bytes": tx,
                        "mode": "BROADCAST_MODE_SYNC"
                    };
                    urlRemote = URL_OSMO_LCD + '/cosmos/tx/v1beta1/txs';
                    log.debug(tag, "urlRemote: ", urlRemote);
                    return [4 /*yield*/, axios({
                            url: urlRemote,
                            method: 'POST',
                            data: payload,
                        })];
                case 3:
                    result2 = _a.sent();
                    log.debug(tag, '** Broadcast ** REMOTE: result: ', result2.data);
                    if (result2.data.tx_response.txhash) {
                        output.txid = result2.data.tx_response.txhash;
                        output.success = true;
                    }
                    //verify success
                    if (result2.data.raw_log) {
                        logSend = result2.data.raw_log;
                        log.debug(tag, "logSend: ", logSend);
                    }
                    output.height = result2.height;
                    output.gas_wanted = result2.gas_wanted;
                    output.gas_used = result2.gas_used;
                    output.raw = result2.data;
                    return [3 /*break*/, 5];
                case 4:
                    e_19 = _a.sent();
                    return [3 /*break*/, 5];
                case 5:
                    if (output.txid) {
                        output.success = true;
                    }
                    return [2 /*return*/, output];
                case 6:
                    e_20 = _a.sent();
                    console.error(tag, "throw error: ", e_20);
                    return [2 /*return*/, output];
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_account_info = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, txInfo, e_21;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_account_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    //
                    console.log("URL ", URL_OSMO_LCD + 'cosmos/auth/v1beta1/accounts/' + address);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/cosmos/auth/v1beta1/accounts/' + address })];
                case 2:
                    txInfo = _a.sent();
                    log.debug(tag, "txInfo: ", txInfo.data);
                    return [2 /*return*/, txInfo.data];
                case 3:
                    e_21 = _a.sent();
                    log.error(tag, "e: ", e_21);
                    throw e_21;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var normalize_tx = function (tx, address) {
    var tag = TAG + " | normalize_tx | ";
    try {
        var output = {};
        var sender = void 0;
        var receiver = void 0;
        var memo = void 0;
        var amount = void 0;
        var rawlog = JSON.parse(tx.raw_log);
        rawlog = rawlog;
        log.debug("rawlog: ", rawlog);
        output.txid = tx.txhash;
        output.height = tx.height;
        output.gas = {
            gas_wanted: tx.gas_wanted,
            gas_used: tx.gas_used
        };
        //txTypes
        var txTypes = [
            'send',
            'receive',
            'governence',
            'swap',
            'other'
        ];
        for (var i = 0; i < rawlog.length; i++) {
            var txEvents = rawlog[i];
            //log.debug(tag,"txEvents: ",txEvents)
            txEvents = txEvents.events;
            for (var j = 0; j < txEvents.length; j++) {
                var event_1 = txEvents[j];
                //
                //log.debug(tag,"event: ",event)
                //log.debug(tag,"attributes: ",prettyjson.render(event.attributes))
                //detect event type
                log.debug(tag, "type: ", event_1.type);
                switch (event_1.type) {
                    case 'message':
                        // ignore
                        break;
                    case 'transfer':
                        log.debug(tag, "attributes: ", event_1.attributes);
                        for (var k = 0; k < event_1.attributes.length; k++) {
                            var attribute = event_1.attributes[k];
                            if (attribute.key === 'recipient') {
                                receiver = attribute.value;
                                output.receiver = receiver;
                                if (receiver === address)
                                    output.type = txTypes[1];
                            }
                            if (attribute.key === 'sender') {
                                sender = attribute.value;
                                output.sender = sender;
                                if (sender === address)
                                    output.type = txTypes[0];
                            }
                            if (attribute.key === 'amount') {
                                amount = attribute.value;
                                amount = amount.replace('uosmo', '');
                                output.amount = amount / 100000000;
                            }
                        }
                        break;
                    default:
                    // code block
                }
            }
            // console.log("log: ",prettyjson.render(log))
        }
        return output;
    }
    catch (e) {
        log.error(tag, "e: ", e);
        throw e;
    }
};
var get_txs_at_height = function (height) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, url, resultSends, sends, e_22;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_txs_by_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = [];
                    url = URL_OSMO_LCD + '/cosmos/tx/v1beta1/txs?events=tx.height=%27' + height + '%27';
                    // let url = URL_OSMO_LCD+ '/txs?block.height='+height
                    // let url = URL_OSMO_LCD+ '/txs?tx.height='+height
                    //tx.height=
                    //?tx.height=1891147&page=1
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 2:
                    resultSends = _a.sent();
                    sends = resultSends.data;
                    //log.debug('sends: ', sends)
                    return [2 /*return*/, sends];
                case 3:
                    e_22 = _a.sent();
                    log.error(tag, "e: ", e_22);
                    throw e_22;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_txs_by_address = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, url, resultSends, sends, i, tx, e_23;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_txs_by_address | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = [];
                    url = URL_OSMO_LCD + '/cosmos/tx/v1beta1/txs?events=transfer.sender=%27' + address + '%27';
                    //let url = URL_OSMO_LCD+ '/txs?message.sender='+address
                    log.debug(tag, "url: ", url);
                    return [4 /*yield*/, axios({
                            url: url,
                            method: 'GET'
                        })];
                case 2:
                    resultSends = _a.sent();
                    sends = resultSends.data;
                    //log.debug('sends: ', sends)
                    if (sends.txs) {
                        for (i = 0; i < sends.txs.length; i++) {
                            tx = sends.txs[i];
                            //tx = normalize_tx(tx,address)
                            output.push(tx);
                        }
                    }
                    //receives
                    //url = URL_OSMO_LCD+ '/txs?transfer.recipient='+address
                    //
                    // url = URL_OSMO_LCD+ '/cosmos/tx/v1beta1/txs?events=transfer.recipient=%27'+address+'%27'
                    // //console.log("URL_OSMO_LCD: ",url)
                    // let resultRecieves = await axios({
                    //     url: url,
                    //     method: 'GET'
                    // })
                    // let receives = resultRecieves.data
                    // //log.debug('receives: ', JSON.stringify(receives.tx_responses))
                    // if(receives.tx_responses){
                    //     for(let i = 0; i < receives.txs.length; i++ ){
                    //         let tx = receives.txs[i]
                    //         //normalize
                    //         // tx = normalize_tx(tx,address)
                    //         output.push(tx)
                    //     }
                    // }
                    return [2 /*return*/, output];
                case 3:
                    e_23 = _a.sent();
                    log.error(tag, "e: ", e_23);
                    throw e_23;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_balances = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, accountInfo, i, entry, balance, voucher, voucherInfo, balance, poolInfo, totalShares, poolAssets, assetAtom, assetOsmo, totalAtom, totalOsmo, yourLpTokens, yourLpPercent, yourAtomInPool, yourOsmoInPool, balance, e_24, e_25;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_balances | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, , 13]);
                    output = [];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 10, , 11]);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/cosmos/bank/v1beta1/balances/' + address })];
                case 3:
                    accountInfo = _a.sent();
                    log.info(tag, "accountInfo: ", accountInfo.data);
                    if (!accountInfo.data) return [3 /*break*/, 9];
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < accountInfo.data.balances.length)) return [3 /*break*/, 9];
                    entry = accountInfo.data.balances[i];
                    if (entry.denom === 'uosmo') {
                        balance = {
                            type: 'balance',
                            asset: 'OSMO',
                            denom: 'uosmo',
                            balance: parseFloat(entry.amount) / 1000000
                        };
                        output.push(balance);
                    }
                    if (!(entry.denom.indexOf('ibc/') >= 0)) return [3 /*break*/, 6];
                    voucher = entry.denom.replace('ibc/', '');
                    log.info(tag, "voucher: ", voucher);
                    return [4 /*yield*/, get_voucher_info(voucher)];
                case 5:
                    voucherInfo = _a.sent();
                    log.info(tag, "voucherInfo: ", voucherInfo);
                    if (voucherInfo.denom_trace.base_denom === 'uatom') {
                        balance = {
                            type: 'ibcChannel',
                            ibc: true,
                            voucherId: entry.denom,
                            asset: 'ATOM',
                            denom: voucherInfo.denom_trace.base_denom,
                            channel: voucherInfo.denom_trace.path,
                            balance: entry.amount / 1000000
                        };
                        output.push(balance);
                    }
                    else {
                        //TODO lookup base_denum to asset
                        //handle more assets
                    }
                    _a.label = 6;
                case 6:
                    if (!(entry.denom === 'gamm/pool/1')) return [3 /*break*/, 8];
                    return [4 /*yield*/, get_pools()];
                case 7:
                    poolInfo = _a.sent();
                    poolInfo = poolInfo.pools[0];
                    log.debug(tag, "poolInfo: ", poolInfo);
                    totalShares = poolInfo.totalShares.amount / 1000000000000000000;
                    log.debug(tag, "totalShares: ", totalShares);
                    poolAssets = poolInfo.poolAssets;
                    log.debug(tag, "poolAssets: ", poolAssets);
                    assetAtom = poolAssets[0];
                    log.debug(tag, "assetAtom: ", assetAtom);
                    assetOsmo = poolAssets[1];
                    log.debug(tag, "assetOsmo: ", assetOsmo);
                    totalAtom = assetAtom.token.amount / 10000000;
                    log.debug(tag, "totalAtom: ", totalAtom);
                    totalOsmo = assetOsmo.token.amount / 1000000;
                    log.debug(tag, "totalOsmo: ", totalOsmo);
                    yourLpTokens = entry.amount / 1000000000000000000;
                    log.debug(tag, "yourLpTokens: ", yourLpTokens);
                    yourLpPercent = yourLpTokens / totalShares;
                    log.debug(tag, "yourLpPercent: ", yourLpPercent);
                    yourAtomInPool = totalAtom * yourLpPercent;
                    log.debug(tag, "yourAtomInPool: ", yourAtomInPool);
                    yourOsmoInPool = totalOsmo * yourLpPercent;
                    log.debug(tag, "yourOsmoInPool: ", yourOsmoInPool);
                    balance = {
                        type: 'lptoken',
                        lp: true,
                        amountATOM: yourAtomInPool,
                        amountOSMO: yourOsmoInPool,
                        poolPercent: yourLpPercent,
                        poolPair: "ATOM_OSMO",
                        asset: 'gamm/pool/1',
                        balance: yourLpTokens
                    };
                    output.push(balance);
                    _a.label = 8;
                case 8:
                    i++;
                    return [3 /*break*/, 4];
                case 9: return [3 /*break*/, 11];
                case 10:
                    e_24 = _a.sent();
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/, output];
                case 12:
                    e_25 = _a.sent();
                    log.error(tag, "e: ", e_25);
                    throw e_25;
                case 13: return [2 /*return*/];
            }
        });
    });
};
var get_balance = function (address) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, accountInfo, i, entry, e_26, e_27;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_balance | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    output = 0;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    console.log("URL: ", URL_OSMO_LCD + '/cosmos/bank/v1beta1/balances/' + address);
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/cosmos/bank/v1beta1/balances/' + address })];
                case 3:
                    accountInfo = _a.sent();
                    log.info(tag, "accountInfo: ", accountInfo.data);
                    //
                    if (accountInfo.data) {
                        for (i = 0; i < accountInfo.data.balances.length; i++) {
                            entry = accountInfo.data.balances[i];
                            if (entry.denom === 'uosmo') {
                                output = entry.amount;
                            }
                        }
                    }
                    output = output / BASE_OSMO;
                    return [3 /*break*/, 5];
                case 4:
                    e_26 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, output];
                case 6:
                    e_27 = _a.sent();
                    log.error(tag, "e: ", e_27);
                    throw e_27;
                case 7: return [2 /*return*/];
            }
        });
    });
};
var get_node_info_verbose = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, syncInfo, nodeInfo, e_28;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_node_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    output = {};
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/syncing' })];
                case 2:
                    syncInfo = _a.sent();
                    log.debug(tag, "syncInfo: ", syncInfo.data);
                    output.isSyncing = syncInfo.data;
                    return [4 /*yield*/, axios({ method: 'GET', url: URL_OSMO_LCD + '/node_info' })];
                case 3:
                    nodeInfo = _a.sent();
                    log.debug(tag, "nodeInfo: ", nodeInfo.data);
                    output = nodeInfo.data;
                    // let lastBlock = await axios({method:'GET',url: URL_OSMO_LCD+'/blocks/latest'})
                    // log.debug(tag,"lastBlock: ",lastBlock.data)
                    //let height
                    //output.height = lastBlock.data.block.header.height
                    return [2 /*return*/, output];
                case 4:
                    e_28 = _a.sent();
                    log.error(tag, "e: ", e_28);
                    throw e_28;
                case 5: return [2 /*return*/];
            }
        });
    });
};
