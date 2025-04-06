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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var TAG = " | unchained-client | ";
var pioneerApi = require("@pioneer-platform/pioneer-client").default;
var log = require('@pioneer-platform/loggerdog')();
var fakeUa = require('fake-useragent');
var nodes = require("@pioneer-platform/nodes");
var Axios = require('axios');
var https = require('https');
var axios = Axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});
var axiosRetry = require('axios-retry');
var ALL_UNCHAINED_APIS = {};
axiosRetry(axios, {
    retries: 3, // number of retries
    retryDelay: function (retryCount) {
        log.debug(TAG, "retry attempt: ".concat(retryCount));
        return retryCount * 2000; // time interval between retries
    },
    retryCondition: function (error) {
        //console.error(error)
        // if retry condition is not specified, by default idempotent requests are retried
        return error.response.status === 503;
    },
});
module.exports = {
    init: function (servers) {
        return init_network(servers);
    },
    unchained: function () {
        return ALL_UNCHAINED_APIS();
    },
    getFees: function (caip) {
        return get_fees(caip);
    },
};
var init_network = function (servers) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, allUnchaineds, SEED_NODES, combinedSet, i, unchainedInfo, config, Unchained, _a, _b, e_1, e_2;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    tag = TAG + " | init_network | ";
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 11, , 12]);
                    allUnchaineds = [];
                    if (servers && Array.isArray(servers)) {
                        allUnchaineds = servers;
                    }
                    else if (servers) {
                        // Handle the case when 'servers' is not an array
                        log.error(tag, "'servers' is not an array!", servers);
                    }
                    return [4 /*yield*/, nodes.getUnchaineds()];
                case 2:
                    SEED_NODES = _c.sent();
                    log.debug(tag, "SEED_NODES: ", SEED_NODES);
                    log.debug(tag, "SEED_NODES: ", SEED_NODES.length);
                    combinedSet = new Set(__spreadArray(__spreadArray([], allUnchaineds, true), SEED_NODES, true));
                    // Convert the Set back to an array
                    allUnchaineds = Array.from(combinedSet);
                    log.debug(tag, "allUnchaineds: ", allUnchaineds);
                    log.debug(tag, "allUnchaineds: ", allUnchaineds.length);
                    i = 0;
                    _c.label = 3;
                case 3:
                    if (!(i < allUnchaineds.length)) return [3 /*break*/, 10];
                    unchainedInfo = allUnchaineds[i];
                    if (!(unchainedInfo.service && unchainedInfo.caip && unchainedInfo.swagger)) return [3 /*break*/, 8];
                    config = { queryKey: "foobaz", spec: unchainedInfo.swagger };
                    Unchained = new pioneerApi(unchainedInfo.swagger, config);
                    _c.label = 4;
                case 4:
                    _c.trys.push([4, 6, , 7]);
                    //if already set, check pings, choose lowest ping
                    _a = ALL_UNCHAINED_APIS;
                    _b = unchainedInfo.caip;
                    return [4 /*yield*/, Unchained.init()];
                case 5:
                    //if already set, check pings, choose lowest ping
                    _a[_b] = _c.sent();
                    return [3 /*break*/, 7];
                case 6:
                    e_1 = _c.sent();
                    //@TODO mark offline on api
                    log.debug(tag, " service if offline: ", unchainedInfo.service);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 9];
                case 8:
                    log.debug(tag, "invalid unchained service: ", unchainedInfo.service);
                    _c.label = 9;
                case 9:
                    i++;
                    return [3 /*break*/, 3];
                case 10: return [2 /*return*/, ALL_UNCHAINED_APIS];
                case 11:
                    e_2 = _c.sent();
                    console.error(tag, e_2);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/];
            }
        });
    });
};
var get_fees = function (caip) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | get_fees | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    output = void 0;
                    if (!ALL_UNCHAINED_APIS[caip].GetNetworkFees) return [3 /*break*/, 3];
                    return [4 /*yield*/, ALL_UNCHAINED_APIS[caip].GetNetworkFees()];
                case 2:
                    output = _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    if (!ALL_UNCHAINED_APIS[caip].GetGasFees) return [3 /*break*/, 5];
                    return [4 /*yield*/, ALL_UNCHAINED_APIS[caip].GetGasFees()];
                case 4:
                    output = _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/, output];
                case 6:
                    e_3 = _a.sent();
                    console.error(tag, e_3);
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
};
