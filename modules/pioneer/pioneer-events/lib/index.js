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
exports.Events = void 0;
var TAG = " | ws-client | ";
var events_1 = require("events");
var io = require('socket.io-client');
var wait = require('wait-promise');
var sleep = wait.sleep;
var Events = /** @class */ (function () {
    function Events(config) {
        this.wss = config.wss;
        this.isConnected = false;
        this.isTestnet = false;
        this.username = config.username;
        this.queryKey = config.queryKey;
        this.isPaired = false;
        this.events = new events_1.EventEmitter();
        this.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tag, e_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            tag = TAG + " | init_events | ";
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            this.socket = io.connect(this.wss, {
                                reconnect: true,
                                rejectUnauthorized: false,
                                transports: ['websocket'],
                            });
                            //sub
                            this.socket.on('connect', function () {
                                _this.isConnected = true;
                                //rejoin
                                if (_this.username) {
                                    _this.pair();
                                }
                                else {
                                    _this.subscribeToKey();
                                }
                            });
                            this.socket.on('subscribedToUsername', function (event) {
                                _this.isPaired = true;
                                _this.username = event.username;
                            });
                            this.socket.on('message', function (message) {
                                //TODO only emit expected messages?
                                //if(message.type === "payment_request"){}
                                _this.events.emit('message', message);
                            });
                            this.socket.on('blocks', function (message) {
                                //TODO only emit expected messages?
                                //if(message.type === "payment_request"){}
                                _this.events.emit('message', message);
                            });
                            //sub to errors
                            this.socket.on('errorMessage', function (message) {
                                if (message.code && message.code === 6)
                                    throw Error(" Failed to connect!");
                            });
                            this.socket.on('invocation', function (message) {
                                _this.events.emit('message', message);
                            });
                            _a.label = 2;
                        case 2:
                            if (!!this.isConnected) return [3 /*break*/, 4];
                            return [4 /*yield*/, sleep(300)];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 2];
                        case 4: return [2 /*return*/, true];
                        case 5:
                            e_1 = _a.sent();
                            console.error(e_1);
                            throw e_1;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        this.setUsername = function (username) {
            return __awaiter(this, void 0, void 0, function () {
                var tag;
                return __generator(this, function (_a) {
                    tag = TAG + " | startSocket | ";
                    try {
                        this.username = username;
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return [2 /*return*/];
                });
            });
        };
        this.subscribeToInvocation = function (invocationId) {
            return __awaiter(this, void 0, void 0, function () {
                var tag;
                return __generator(this, function (_a) {
                    tag = TAG + " | subscribeToInvocation | ";
                    try {
                        //attempt join
                        this.socket.emit('join', {
                            invocationId: invocationId
                        });
                        return [2 /*return*/, true];
                    }
                    catch (e) {
                        console.error(e);
                        throw e;
                    }
                    return [2 /*return*/];
                });
            });
        };
        this.subscribeToKey = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tag;
                return __generator(this, function (_a) {
                    tag = TAG + " | subscribeToKey | ";
                    try {
                        //attempt join
                        this.socket.emit('join', {
                            queryKey: config.queryKey
                        });
                        return [2 /*return*/, true];
                    }
                    catch (e) {
                        console.error(e);
                        throw e;
                    }
                    return [2 /*return*/];
                });
            });
        };
        this.send = function (channel, event) {
            return __awaiter(this, void 0, void 0, function () {
                var tag;
                return __generator(this, function (_a) {
                    tag = TAG + " | send | ";
                    try {
                        //attempt join
                        this.socket.emit(channel, event);
                        return [2 /*return*/, true];
                    }
                    catch (e) {
                        console.error(e);
                        throw e;
                    }
                    return [2 /*return*/];
                });
            });
        };
        this.pair = function (username) {
            return __awaiter(this, void 0, void 0, function () {
                var tag;
                return __generator(this, function (_a) {
                    tag = TAG + " | startSocket | ";
                    try {
                        if (username)
                            this.username = username;
                        if (!this.username)
                            throw Error("103: can not pair without username!");
                        //attempt join
                        this.socket.emit('join', {
                            username: this.username,
                            queryKey: config.queryKey
                        });
                        //TODO validate paired?
                        return [2 /*return*/, true];
                    }
                    catch (e) {
                        console.error(e);
                        throw e;
                    }
                    return [2 /*return*/];
                });
            });
        };
        this.disconnect = function () {
            return __awaiter(this, void 0, void 0, function () {
                var tag;
                return __generator(this, function (_a) {
                    tag = TAG + " | disconnect | ";
                    try {
                        return [2 /*return*/, this.socket.disconnect()];
                    }
                    catch (e) {
                        console.error(e);
                    }
                    return [2 /*return*/];
                });
            });
        };
    }
    return Events;
}());
exports.Events = Events;
