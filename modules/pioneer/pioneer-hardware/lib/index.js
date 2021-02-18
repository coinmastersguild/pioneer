"use strict";
/*
      Keepkey Hardware Module
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var TAG = " | hardware-app | ";
var request = require('request');
var hdwallet_core_1 = require("@shapeshiftoss/hdwallet-core");
var NodeWebUSBKeepKeyAdapter = require('@shapeshiftoss/hdwallet-keepkey-nodewebusb').NodeWebUSBKeepKeyAdapter;
// import { TCPKeepKeyAdapter } from "@shapeshiftoss/hdwallet-keepkey-tcp";
// import { create as createHIDKeepKey } from "@bithighlander/hdwallet-keepkey";
var log = require("@pioneer-platform/loggerdog")();
var EventEmitter = require('events');
var emitter = new EventEmitter();
var wait = require('wait-promise');
var sleep = wait.sleep;
var usbDetect = require('@bithighlander/usb-detection');
var getPaths = require('@pioneer-platform/pioneer-coins').getPaths;
// import * as util from "./hardware"
//keepkey
var keyring = new hdwallet_core_1.Keyring;
//let webUsbAdapter: { clearDevices: () => void; pairDevice: () => any; }, hidAdapter
//
var FIRMWARE_BASE_URL = "https://static.shapeshift.com/firmware/";
//globals
var KEEPKEY_WALLET = {};
var autoButton = true;
var IS_CONNECTED = false;
module.exports = {
    start: function () {
        return start_hardware();
    },
    info: function () {
        return hardware_info();
    },
    getPubkeys: function () {
        return get_pubkeys();
    },
    isLocked: function () {
        return get_lock_status();
    },
    unlock: function () {
        return get_pubkeys();
    },
    displayPin: function () {
        return display_pin();
    },
    enterPin: function (pin) {
        return enter_keepkey_pin(pin);
    },
    wipe: function () {
        return KEEPKEY_WALLET.wipe();
    },
    load: function (mnemonic) {
        //TODO validate mnemonic
        return KEEPKEY_WALLET.loadDevice({ mnemonic: mnemonic });
    },
};
var hardware_info = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, assetsSupported;
        return __generator(this, function (_a) {
            tag = " | hardware_info | ";
            try {
                output = {};
                assetsSupported = [];
                log.debug(tag, "KEEPKEY_WALLET: ", KEEPKEY_WALLET);
                //asset support
                if (KEEPKEY_WALLET._supportsETH)
                    assetsSupported.push('ETH');
                if (KEEPKEY_WALLET._supportsBTC)
                    assetsSupported.push('BTC');
                if (KEEPKEY_WALLET._supportsCosmos)
                    assetsSupported.push('ATOM');
                if (KEEPKEY_WALLET._supportsRipple)
                    assetsSupported.push('XRP');
                if (KEEPKEY_WALLET._supportsBinance)
                    assetsSupported.push('BNB');
                if (KEEPKEY_WALLET._supportsEos)
                    assetsSupported.push('EOS');
                if (KEEPKEY_WALLET._supportsFio)
                    assetsSupported.push('FIO');
                output.assets = assetsSupported;
                //device
                //TODO convert to json
                //output.keepkey = KEEPKEY_WALLET.transport.usbDevice
                //features
                output.features = KEEPKEY_WALLET.features;
                return [2 /*return*/, output];
            }
            catch (e) {
                log.error(e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
var get_lock_status = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | get_lock_status | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = {};
                    return [4 /*yield*/, KEEPKEY_WALLET.isLocked()];
                case 2:
                    output = _a.sent();
                    return [2 /*return*/, output];
                case 3:
                    e_1 = _a.sent();
                    log.error(e_1);
                    throw e_1;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var display_pin = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, paths, result, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | display_pin | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    output = {};
                    log.debug("KEEPKEY_WALLET: ", KEEPKEY_WALLET);
                    paths = getPaths();
                    paths = [paths[0]];
                    return [4 /*yield*/, KEEPKEY_WALLET.getPublicKeys(paths)];
                case 2:
                    result = _a.sent();
                    return [4 /*yield*/, KEEPKEY_WALLET.ping("hello")];
                case 3:
                    output = _a.sent();
                    return [2 /*return*/, output];
                case 4:
                    e_2 = _a.sent();
                    log.error(e_2);
                    throw e_2;
                case 5: return [2 /*return*/];
            }
        });
    });
};
// async function getEmulator(keyring: Keyring) {
//     try {
//         const tcpAdapter = TCPKeepKeyAdapter.useKeyring(keyring);
//         let wallet = await tcpAdapter.pairDevice("http://localhost:5000");
//         if (wallet) console.log("Using KeepKey Emulator for tests");
//         return wallet;
//     } catch (e) {}
//     return undefined;
// }
var enter_keepkey_pin = function (pin) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output;
        return __generator(this, function (_a) {
            tag = " | enter_keepkey_pin | ";
            try {
                output = {};
                KEEPKEY_WALLET.sendPin(pin);
                return [2 /*return*/, output];
            }
            catch (e) {
                log.error(e);
                throw e;
            }
            return [2 /*return*/];
        });
    });
};
var get_pubkeys = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, paths, pathsKeepkey, i, path, pathForKeepkey, result, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | get_pubkeys | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    output = {};
                    paths = getPaths();
                    pathsKeepkey = [];
                    for (i = 0; i < paths.length; i++) {
                        path = paths[i];
                        pathForKeepkey = {};
                        //send coin as bitcoin
                        pathForKeepkey.symbol = path.symbol;
                        pathForKeepkey.addressNList = path.addressNList;
                        //why
                        pathForKeepkey.coin = 'Bitcoin';
                        pathForKeepkey.script_type = 'p2pkh';
                        pathsKeepkey.push(pathForKeepkey);
                    }
                    return [4 /*yield*/, KEEPKEY_WALLET.getPublicKeys(paths)];
                case 2:
                    result = _a.sent();
                    log.debug("rawResult: ", result);
                    log.debug("rawResult: ", JSON.stringify(result));
                    //rebuild
                    // let pubkeys = await normalize_pubkeys('keepkey',result,paths)
                    // output.pubkeys = pubkeys
                    // log.debug(tag,"pubkeys: ",pubkeys)
                    //
                    // //add feature info to pubkey
                    // let keyedWallet:any = {}
                    // for(let i = 0; i < pubkeys.length; i++){
                    //     let pubkey = pubkeys[i]
                    //     keyedWallet[pubkey.coin] = pubkey
                    // }
                    // let walletId = "keepkey-file-1"
                    // let watchWallet = {
                    //     "WALLET_ID": walletId,
                    //     "TYPE": "watch",
                    //     "CREATED": new Date().getTime(),
                    //     "VERSION": "0.1.3",
                    //     "WALLET_PUBLIC":keyedWallet,
                    //     "PATHS":paths
                    // }
                    // log.debug(tag,"writePathPub: ",watchWallet)
                    // output.wallet = watchWallet
                    return [2 /*return*/, output];
                case 3:
                    e_3 = _a.sent();
                    log.error(e_3);
                    throw e_3;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var get_keepkey_info = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, output, vender, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | get_keepkey_info | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    log.debug(tag, "checkpoint");
                    output = {};
                    return [4 /*yield*/, KEEPKEY_WALLET.getVendor()];
                case 2:
                    vender = _a.sent();
                    output.vender = vender;
                    log.debug(tag, "vender: ", vender);
                    return [2 /*return*/, output];
                case 3:
                    e_4 = _a.sent();
                    log.error(e_4);
                    throw e_4;
                case 4: return [2 /*return*/];
            }
        });
    });
};
var start_hardware = function () {
    return __awaiter(this, void 0, void 0, function () {
        var tag, walletFound, e_5, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | start_hardware | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 8, , 9]);
                    //detect connection event
                    usbDetect.startMonitoring();
                    walletFound = false;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, getDevice(keyring)];
                case 3:
                    _a.sent();
                    walletFound = true;
                    return [3 /*break*/, 5];
                case 4:
                    e_5 = _a.sent();
                    log.debug("CHECKPOINT ! *********");
                    log.error(tag, "e: ", e_5.toString());
                    if (e_5.toString().indexOf("claimInterface: ") >= 0) {
                        log.error(tag, " Unable to claim interface!");
                        return [2 /*return*/, {
                                error: "device already being used! failed to claim!"
                            }];
                    }
                    else {
                        log.debug("No devices connected!");
                    }
                    return [3 /*break*/, 5];
                case 5:
                    if (!walletFound) return [3 /*break*/, 7];
                    return [4 /*yield*/, createWallet()];
                case 6:
                    KEEPKEY_WALLET = _a.sent();
                    log.debug(tag, "KEEPKEY_WALLET: ", KEEPKEY_WALLET);
                    _a.label = 7;
                case 7:
                    usbDetect.on('add:11044:1', function (device) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                emitter.emit('event', { event: "connect", msg: "add Keepkey!", code: 'add:11044:1' });
                                return [2 /*return*/];
                            });
                        });
                    });
                    usbDetect.on('remove:11044:1', function (device) {
                        emitter.emit('event', { event: "disconnect", msg: "removeing Keepkey!", code: 'remove:11044:1' });
                        keyring.removeAll();
                    });
                    usbDetect.on('add:11044:2', function (device) {
                        return __awaiter(this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        log.debug("Connecting to Keepkey!");
                                        emitter.emit('event', { event: "connect", msg: "Connecting to Keepkey!", code: 'add:11044:2' });
                                        return [4 /*yield*/, sleep(2000)];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, createWallet()];
                                    case 2:
                                        KEEPKEY_WALLET = _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    usbDetect.on('remove:11044:2', function (device) {
                        return __awaiter(this, void 0, void 0, function () {
                            var wallet;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        log.debug("Keepkey Disconnected!");
                                        emitter.emit('event', { event: "disconnect", msg: "Keepkey Disconnected!" });
                                        wallet = Object.values(keyring.wallets)[0];
                                        if (!!wallet) { // @ts-ignore
                                            wallet.transport.disconnect();
                                        }
                                        return [4 /*yield*/, keyring.removeAll()
                                            //webUsbAdapter.clearDevices()
                                        ];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    //
                    //get current state
                    //currently connected
                    //is usb available?
                    //
                    KEEPKEY_WALLET.events = emitter;
                    return [2 /*return*/, KEEPKEY_WALLET];
                case 8:
                    e_6 = _a.sent();
                    console.error(tag, "Error: ", e_6);
                    throw e_6;
                case 9: return [2 /*return*/];
            }
        });
    });
};
var getLatestFirmwareData = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                request(FIRMWARE_BASE_URL + "releases.json", function (err, response, body) {
                    if (err)
                        return reject(err);
                    resolve(JSON.parse(body).latest);
                });
            })];
    });
}); };
// @ts-ignore
// let createWebUsbWallet = async function (attempts:any = 0) {
//     let tag = " | createWebUsbWallet | ";
//     try {
//
//         webUsbAdapter = await NodeWebUSBKeepKeyAdapter.useKeyring(keyring)
//         KEEPKEY_WALLET = await webUsbAdapter.pairDevice()
//
//         log.debug("wallet: ",KEEPKEY_WALLET)
//
//     } catch (error) {
//         if (attempts < 10) {
//             await sleep(500)
//             return await createWebUsbWallet(attempts + 1)
//         }
//         console.log('error creating WebUSB wallet: ', error)
//         return null
//     }
// };
var getDevice = function (keyring) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, keepkeyAdapter, wallet, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = TAG + " | getDevice | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    keepkeyAdapter = NodeWebUSBKeepKeyAdapter.useKeyring(keyring);
                    return [4 /*yield*/, keepkeyAdapter.pairDevice(undefined, true)];
                case 2:
                    wallet = _a.sent();
                    if (wallet) {
                        log.debug(tag, "Device found!");
                        log.debug(tag, "wallet: ", wallet);
                    }
                    return [2 /*return*/, wallet];
                case 3:
                    e_7 = _a.sent();
                    log.error(tag, "e: ", e_7);
                    throw Error(e_7);
                case 4: return [2 /*return*/];
            }
        });
    });
};
// async function createWallet(): Promise<HDWallet> {
//     const keyring = new Keyring();
//
//     let wallet = (await getDevice(keyring));
//
//     if (!wallet) throw new Error("No KeepKey found");
//
//     wallet.transport.on(Events.BUTTON_REQUEST, async () => {
//         // if (autoButton && supportsDebugLink(wallet)) {
//         //     await wallet.pressYes();
//         // }
//         emitter.emit('event',{event:"buttonRequest",msg:"Accept event on KeepKey to continue!"})
//     });
//
//     wallet.transport.onAny((event: string[], ...values: any[]) => {
//         console.info(event, ...values)
//         emitter.emit('event',{event:"hardwareEvent",msg:"hardware event occurred!",values})
//     });
//
//     return wallet;
// }
var createWallet = function (attempts) {
    if (attempts === void 0) { attempts = 0; }
    return __awaiter(this, void 0, void 0, function () {
        var tag, keyring_1, wallet, isConnected, e_8, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | createWallet | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 9, , 10]);
                    keyring_1 = new hdwallet_core_1.Keyring();
                    wallet = void 0;
                    isConnected = false;
                    _a.label = 2;
                case 2:
                    if (!!isConnected) return [3 /*break*/, 8];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, getDevice(keyring_1)];
                case 4:
                    wallet = _a.sent();
                    isConnected = true;
                    return [3 /*break*/, 6];
                case 5:
                    e_8 = _a.sent();
                    log.debug("No devices connected!");
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, sleep(300)];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 2];
                case 8:
                    if (wallet) {
                        wallet.transport.on(hdwallet_core_1.Events.BUTTON_REQUEST, function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                // if (autoButton && supportsDebugLink(wallet)) {
                                //     await wallet.pressYes();
                                // }
                                emitter.emit('event', { event: "buttonRequest", msg: "Accept event on KeepKey to continue!" });
                                return [2 /*return*/];
                            });
                        }); });
                        wallet.transport.onAny(function (event) {
                            var values = [];
                            for (var _i = 1; _i < arguments.length; _i++) {
                                values[_i - 1] = arguments[_i];
                            }
                            console.info.apply(console, __spreadArrays([event], values));
                            emitter.emit('event', { event: "hardwareEvent", msg: "hardware event occurred!", values: values });
                        });
                        return [2 /*return*/, wallet];
                    }
                    else {
                        //no wallet connected yet!
                        return [2 /*return*/, null];
                    }
                    return [3 /*break*/, 10];
                case 9:
                    error_1 = _a.sent();
                    log.error(tag, "failed to createWallet!");
                    throw Error(error_1);
                case 10: return [2 /*return*/];
            }
        });
    });
};
// @ts-ignore
// let createHidWallet = async function (attempts:any = 0) {
//     let tag = " | createHidWallet | ";
//     try {
//
//
//     } catch (error) {
//         if (attempts < 10) {
//             await sleep(500)
//             return await createHidWallet(attempts + 1)
//         }
//         console.log('error creating HID wallet: ', error)
//         return null
//     }
// };
// @ts-ignore
var uploadToDevice = function (binary) {
    return __awaiter(this, void 0, void 0, function () {
        var tag, wallet, uploadResult, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tag = " | createHidWallet | ";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    wallet = Object.values(keyring.wallets)[0];
                    if (!wallet)
                        return [2 /*return*/, null
                            // @ts-ignore
                        ];
                    // @ts-ignore
                    return [4 /*yield*/, wallet.firmwareErase()
                        // @ts-ignore
                    ];
                case 2:
                    // @ts-ignore
                    _a.sent();
                    return [4 /*yield*/, wallet.firmwareUpload(binary)];
                case 3:
                    uploadResult = _a.sent();
                    return [2 /*return*/, uploadResult];
                case 4:
                    error_2 = _a.sent();
                    log.error('error uploading to device: ', error_2);
                    return [2 /*return*/, false];
                case 5: return [2 /*return*/];
            }
        });
    });
};
