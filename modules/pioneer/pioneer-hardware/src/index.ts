/*
      Keepkey Hardware Module
 */

const TAG = " | hardware-app | ";

const request = require('request')
import {
    Keyring,
    Events
} from "@shapeshiftoss/hdwallet-core";
const { NodeWebUSBKeepKeyAdapter } = require('@shapeshiftoss/hdwallet-keepkey-nodewebusb')
// const { WebUSBKeepKeyAdapter } = require('@shapeshiftoss/hdwallet-keepkey-webusb')
// import { TCPKeepKeyAdapter } from "@shapeshiftoss/hdwallet-keepkey-tcp";
// import { create as createHIDKeepKey } from "@bithighlander/hdwallet-keepkey";

const log = require("@pioneer-platform/loggerdog")()
const EventEmitter = require('events');
const emitter = new EventEmitter();
let wait = require('wait-promise');
let sleep = wait.sleep;

const usbDetect = require('@bithighlander/usb-detection');

let {
    getPaths,
    normalize_pubkeys
} = require('@pioneer-platform/pioneer-coins')


// import * as util from "./hardware"

//keepkey
const keyring = new Keyring
//let webUsbAdapter: { clearDevices: () => void; pairDevice: () => any; }, hidAdapter


//
const FIRMWARE_BASE_URL = "https://static.shapeshift.com/firmware/"
//globals
let KEEPKEY_WALLET:any = {}
let autoButton = true;
let IS_CONNECTED = false

//TODO for the love of god dont do this
//coins? from device? anything
let KEEPKEY_SUPPORT = [
    'BTC',
    'BCH',
    'DOGE',
    'RUNE',
    'ETH'
]

/*
    Keepkey States
    0 unknown

    1 No devices connected
    2 Already claimed
    3 locked
    4 unlocked
 */

let KEEPKEY_STATE = {
    state:0,
    msg:"unknown"
}

module.exports = {
    start: function () {
        return start_hardware();
    },
    state:function () {
        return KEEPKEY_STATE;
    },
    info: function () {
        return hardware_info();
    },
    getPubkeys: function (blockchains?:[string],isTestnet?:boolean) {
        return get_pubkeys(blockchains,isTestnet);
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
    enterPin: function (pin:string) {
        return enter_keepkey_pin(pin);
    },
    wipe: function () {
        return KEEPKEY_WALLET.wipe();
    },
    load: function (mnemonic:string) {
        //TODO validate mnemonic
        return KEEPKEY_WALLET.loadDevice({mnemonic});
    },
};

let hardware_info = async function () {
    let tag = " | hardware_info | ";
    try {
        let output:any = {}

        if(KEEPKEY_STATE.state > 2){
            output = KEEPKEY_STATE
        } else {
            let assetsSupported = []

            log.debug(tag,"KEEPKEY_WALLET: ",KEEPKEY_WALLET)

            //asset support
            if(KEEPKEY_WALLET._supportsETH) assetsSupported.push('ETH')
            if(KEEPKEY_WALLET._supportsBTC) assetsSupported.push('BTC')
            if(KEEPKEY_WALLET._supportsCosmos) assetsSupported.push('ATOM')
            if(KEEPKEY_WALLET._supportsRipple) assetsSupported.push('XRP')
            if(KEEPKEY_WALLET._supportsBinance) assetsSupported.push('BNB')
            if(KEEPKEY_WALLET._supportsEos) assetsSupported.push('EOS')
            if(KEEPKEY_WALLET._supportsFio) assetsSupported.push('FIO')
            output.assets = assetsSupported

            //device
            //TODO convert to json
            //output.keepkey = KEEPKEY_WALLET.transport.usbDevice

            //features
            output.features = KEEPKEY_WALLET.features
        }


        return output
    } catch (e) {
        log.error(e)
        throw e
    }
};

let get_lock_status = async function () {
    let tag = " | get_lock_status | ";
    try {
        let output:any = {}

        if(KEEPKEY_STATE.state > 2){
            output = await KEEPKEY_WALLET.isLocked();
        } else {
            true
        }


        return output
    } catch (e) {
        log.error(e)
        throw e
    }
};


let display_pin = async function () {
    let tag = " | display_pin | ";
    try {
        let output:any = {}

        log.debug("KEEPKEY_WALLET: ",KEEPKEY_WALLET)

        //TODO HACK, better way to display then request pubkey?
        await get_pubkeys()
        // let paths = getPaths()
        // paths = [paths[0]]
        // const result = await KEEPKEY_WALLET.getPublicKeys(paths)

        output = await KEEPKEY_WALLET.ping("hello");

        return output
    } catch (e) {
        log.error(e)
        throw e
    }
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

let enter_keepkey_pin = async function (pin:string) {
    let tag = " | enter_keepkey_pin | ";
    try {
        let output:any = {}

        KEEPKEY_WALLET.sendPin(pin);

        return output
    } catch (e) {
        log.error(e)
        throw e
    }
};



let get_pubkeys = async function (blockchains?:[string],isTestnet?:boolean) {
    let tag = " | get_pubkeys | ";
    try {
        //TODO if blockchains === true? then just testnet?
        let output:any = {}

        let paths = getPaths(isTestnet, blockchains)
        let pathsKeepkey:any = []
        for(let i = 0; i < paths.length; i++){
            let path = paths[i]
            let pathForKeepkey:any = {}
            //send coin as bitcoin
            pathForKeepkey.symbol = path.symbol
            pathForKeepkey.addressNList = path.addressNList
            //why
            pathForKeepkey.coin = 'Bitcoin'
            pathForKeepkey.script_type = 'p2pkh'
            //showDisplay
            pathForKeepkey.showDisplay = false
            if(KEEPKEY_SUPPORT.indexOf(path.symbol) >= 0){
                pathsKeepkey.push(pathForKeepkey)
            }
            // if(KEEPKEY_SUPPORT.indexOf(path.symbol) >= 0){
            //     pathsKeepkey.push(pathForKeepkey)
            // }
        }

        log.info("***** paths: ",pathsKeepkey)
        //NOTE: keepkey returns an ordered array.
        //To build verbose pubkey info we must rebuild based on order
        const result = await KEEPKEY_WALLET.getPublicKeys(pathsKeepkey);
        log.info("rawResult: ",result)
        log.info("rawResult: ",JSON.stringify(result))


        //rebuild
        log.info(tag,"isTestnet: ",isTestnet)
        let pubkeys = await normalize_pubkeys('keepkey',result,paths,isTestnet)
        output.pubkeys = pubkeys
        log.debug(tag,"pubkeys: ",pubkeys)

        //add feature info to pubkey
        let keyedWallet:any = {}
        for(let i = 0; i < pubkeys.length; i++){
            let pubkey = pubkeys[i]
            keyedWallet[pubkey.coin] = pubkey
        }

        let features = await KEEPKEY_WALLET.features;
        log.info(tag,"vender: ",features)
        log.info(tag,"vender: ",features.deviceId)

        let walletId = "keepkey-pubkeys-"+features.deviceId
        let watchWallet = {
            "WALLET_ID": walletId,
            "TYPE": "watch",
            "CREATED": new Date().getTime(),
            "VERSION": "0.1.3",
            "WALLET_PUBLIC":keyedWallet,
            "PATHS":paths
        }
        log.debug(tag,"writePathPub: ",watchWallet)
        output.wallet = watchWallet

        return output
    } catch (e) {
        log.error(e)
        throw e
    }
};

let get_keepkey_info = async function () {
    let tag = " | get_keepkey_info | ";
    try {
        log.debug(tag,"checkpoint")
        let output:any = {}
        let vender = await KEEPKEY_WALLET.getVendor();
        output.vender = vender
        log.debug(tag,"vender: ",vender)

        return output
    } catch (e) {
        log.error(e)
        throw e
    }
};

let start_hardware = async function () {
    let tag = " | start_hardware | ";
    try {
        //detect connection event
        usbDetect.startMonitoring();
        // usb dis/connect listeners

        let walletFound = false

        let startReponse = await getDevice(keyring);

        if(startReponse.error){
            switch(startReponse.errorCode) {
                case 1:
                    KEEPKEY_STATE = {
                        state:1,
                        msg:"no devices detected!"
                    }
                    break;
                case 2:
                    KEEPKEY_STATE = {
                        state:2,
                        msg:"unable to claim!"
                    }
                    break;
                default:
                    console.error(tag,startReponse)
                    throw Error("Unknown Error!")
            }
        } else if(startReponse){
            KEEPKEY_WALLET =  await createWallet()
            log.debug(tag,"KEEPKEY_WALLET: ",KEEPKEY_WALLET)

            //get lock status
            let lockStatus = await KEEPKEY_WALLET.isLocked()
            if(lockStatus){
                KEEPKEY_STATE = {
                    state:3,
                    msg:"device locked!"
                }
            } else {
                KEEPKEY_STATE = {
                    state:4,
                    msg:"unlocked"
                }
            }
        }

        //else wait for connect
        if(walletFound){
            KEEPKEY_WALLET =  await createWallet()
            log.debug(tag,"KEEPKEY_WALLET: ",KEEPKEY_WALLET)
        }

        usbDetect.on('add:11044:1', async function(device:any) {
            emitter.emit('event',{event:"connect",msg:"add Keepkey!",code:'add:11044:1'})
            // TODO BUG no devices found!?
            // KEEPKEY_WALLET = await createWallet()
        });

        usbDetect.on('remove:11044:1', function(device:any) {
            emitter.emit('event',{event:"disconnect",msg:"removeing Keepkey!",code:'remove:11044:1'})
            keyring.removeAll()
        });

        usbDetect.on('add:11044:2', async function(device:any) {
            log.debug("Connecting to Keepkey!")
            emitter.emit('event',{event:"connect",msg:"Connecting to Keepkey!",code:'add:11044:2'})
            await sleep(2000)
            KEEPKEY_WALLET =  await createWallet()
            log.debug(tag,"KEEPKEY_WALLET: ",KEEPKEY_WALLET)

            //get lock status
            let lockStatus = await KEEPKEY_WALLET.isLocked()
            if(lockStatus){
                KEEPKEY_STATE = {
                    state:3,
                    msg:"device locked!"
                }
            } else {
                KEEPKEY_STATE = {
                    state:4,
                    msg:"unlocked"
                }
            }
        });

        usbDetect.on('remove:11044:2', async function(device:any) {
            log.debug("Keepkey Disconnected!")
            emitter.emit('event',{event:"disconnect",msg:"Keepkey Disconnected!"})

            //disconnect
            // const wallet:any = Object.values(keyring.wallets)[0]
            // if (!!wallet) { // @ts-ignore
            //     wallet.transport.disconnect()
            // }
            await keyring.removeAll()
            //webUsbAdapter.clearDevices()
        });
        //

        //get current state

        //currently connected

        //is usb available?

        //
        KEEPKEY_WALLET.events = emitter
        return KEEPKEY_WALLET;
    } catch (e) {
        console.error(tag, "Error: ", e);
        throw e;
    }
};


const getLatestFirmwareData = async () => {
    return new Promise((resolve, reject) => {
        request(`${FIRMWARE_BASE_URL}releases.json`, (err:any, response:any, body:any) => {
            if(err) return reject(err)
            resolve(JSON.parse(body).latest)
        })
    })
}



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

// let getDevice = async function(keyring: Keyring) {
//     let tag = TAG + " | getDevice | "
//     try {
//         const keepkeyAdapter = WebUSBKeepKeyAdapter.useKeyring(keyring);
//         let wallet = await keepkeyAdapter.pairDevice(undefined, true);
//         if (wallet) {
//             log.debug(tag,"Device found!")
//             log.debug(tag,"wallet: ",wallet)
//         }
//         return wallet;
//     } catch (e) {
//         log.error(tag,"e: ",e)
//         throw Error(e)
//     }
// }

let getDevice = async function(keyring: Keyring) {
    let tag = TAG + " | getDevice | "
    try {
        const keepkeyAdapter = NodeWebUSBKeepKeyAdapter.useKeyring(keyring);
        let wallet = await keepkeyAdapter.pairDevice(undefined, true);
        if (wallet) {
            log.debug(tag,"Device found!")
            log.info(tag,"wallet: ",wallet)
        }
        return wallet;
    } catch (e) {
        log.error(tag,"*** e: ",e.toString())
        e = e.toString()
        if(e.indexOf("no devices found")){
            return {
                error:true,
                errorCode: 1,
                errorMessage:"No devices"
            }
        } else if(e.indexOf("claim")){
            return {
                error:true,
                errorCode: 1,
                errorMessage:"Unable to claim!"
            }
        } else {
            return {
                error:true,
                errorMessage:e
            }
        }

    }
}

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

let createWallet = async function (attempts:any = 0) {
    let tag = " | createWallet | ";
    try {

        const keyring = new Keyring();


        let wallet
        //wait for connect
        let isConnected = false
        while(!isConnected){
            try{
                wallet = await getDevice(keyring);
                isConnected = true
            }catch(e){
                log.debug("No devices connected!")
            }
            await sleep(300)
        }

        if (wallet) {

            wallet.transport.on(Events.BUTTON_REQUEST, async () => {
                // if (autoButton && supportsDebugLink(wallet)) {
                //     await wallet.pressYes();
                // }
                emitter.emit('event',{event:"buttonRequest",msg:"Accept event on KeepKey to continue!"})
            });

            wallet.transport.onAny((event: string[], ...values: any[]) => {
                console.info(event, ...values)
                emitter.emit('event',{event:"hardwareEvent",msg:"hardware event occurred!",values})
            });

            return wallet;
        } else {
            //no wallet connected yet!
            return null
        }
    } catch (error) {
        log.error(tag,"failed to createWallet!")
        throw Error(error)
    }
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
let uploadToDevice = async function (binary:any) {
    let tag = " | createHidWallet | ";
    try {
        const wallet = Object.values(keyring.wallets)[0]
        if (!wallet) return null
        // @ts-ignore
        await wallet.firmwareErase()
        // @ts-ignore
        const uploadResult = await wallet.firmwareUpload(binary)
        return uploadResult
    } catch (error) {
        log.error('error uploading to device: ', error)
        return false
    }
};
