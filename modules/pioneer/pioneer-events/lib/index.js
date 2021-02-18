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
/*
    Pioneer Events

    Sub to username

    sub to rooms

    Go online

    Sub to Wallet

 */
var TAG = " | ws-client | ";
var log = require("@pioneer-platform/loggerdog")();
var EventEmitter = require('events');
var emitter = new EventEmitter();
var io = require('socket.io-client');
//globals
var URL_PIONEER_WS = process.env['URL_PIONEER_WS'];
var SOCKET;
module.exports = {
    init: function (config) {
        return init_client(config);
    },
    disconnect: function () {
        return disconnect();
    },
};
var disconnect = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | init_wallet | ";
            try {
                SOCKET.disconnect();
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
            return [2 /*return*/];
        });
    });
};
var init_client = function (config) {
    return __awaiter(this, void 0, void 0, function () {
        var tag;
        return __generator(this, function (_a) {
            tag = TAG + " | init_wallet | ";
            try {
                if (config.pioneerWs) {
                    URL_PIONEER_WS = config.pioneerWs;
                }
                if (!URL_PIONEER_WS)
                    throw Error(" Failed to find ws server! ");
                if (!config.username)
                    throw Error(" invalid config! missing username ");
                if (!config.queryKey)
                    throw Error(" invalid config! missing queryKey ");
                //sub to websocket as user
                SOCKET = io.connect(URL_PIONEER_WS, { reconnect: true, rejectUnauthorized: false });
                //connect
                SOCKET.on('connect', function () {
                    log.debug(tag, 'Connected!');
                    SOCKET.emit('join', { username: config.username, queryKey: config.queryKey });
                });
                //sub to messages
                SOCKET.on('message', function (message) {
                    log.debug('message: ', message);
                    emitter.emit('message', message);
                    //if payment request
                    if (message.type === "payment_request") {
                        //if receiver is known
                        //if receiver is unknown
                        //if global accept on
                        //if autonomous
                        //perform
                        emitter.emit('message', message);
                        //else add to approve queue
                    }
                    //TODO blocks
                    //TODO payments
                    //balances
                });
                return [2 /*return*/, emitter];
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
            return [2 /*return*/];
        });
    });
};
