import path from "path";

const TAG = " | Config | ";
const fs = require("fs-extra");
const homedir = require("os").homedir();
const mkdirp = require("mkdirp");

// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

export const pioneerConfig = path.join(homedir, ".pioneer", "pioneer.json");
export const configPath = path.join(homedir, ".pioneer", "pioneer.json");

export const keepkeyWatchPath = path.join(
    homedir,
    ".pioneer",
    "wallet_data/keepkey.watch.json"
);
//wallets
export const seedDir = path.join(homedir, ".pioneer", "wallets");
//wallet_data Watch dir
export const walletDataDir = path.join(homedir, ".pioneer", "wallet_data");
export const pioneerPath = path.join(homedir, ".pioneer");
export const modelDir = path.join(homedir, ".pioneer", "models");
export const backtestDir = path.join(homedir, ".pioneer", "backtest");
export const appDir = path.join(homedir, '.pioneer', 'apps')
export const backupDir = path.join(homedir, '.pioneer', 'backups')
export const logDir = path.join(pioneerPath, "log");
export const watchOnlyDir = path.join(pioneerPath, "watch");

export async function innitConfig(languageSelected: string) {
    let tag = TAG + " | importConfig | ";
    try {
        let output: any = {};
        // //console.log(tag, "CHECKPOINT innitConfig");
        // //console.log(tag, "pioneerPath: ", pioneerPath);
        // //console.log(tag, "seedDir: ", seedDir);

        let isCreated = await mkdirp(pioneerPath);
        // //console.log("isCreated: ", isCreated);

        let isCreated2 = await mkdirp(logDir);
        // //console.log("isCreated: ", isCreated2);

        let isCreated3 = await mkdirp(seedDir);

        let isCreated4 = await mkdirp(walletDataDir);
        // //console.log("isCreated: ", isCreated3);

        // //console.log(tag, " innit config checkpiont 2");
        //generate query key
        const queryKey = uuidv4();
        let config: any = {};
        config.locale = "english";
        config.localeSelected = true;
        config.queryKey = queryKey
        //config.version = finder.next().value.version;
        config.isCli = true;

        fs.writeFileSync(pioneerConfig, JSON.stringify(config));
    } catch (e) {
        console.error(tag, "e: ", e);
        return {};
    }
}


// innit Apps
export async function initApps () {
    const tag = TAG + ' | initApps | '
    try {
        mkdirp.sync(appDir)

        console.log('appDir: ', appDir)

        //list folders
        let apps = await fs.readdir(appDir)

        return apps
    } catch (e) {
        console.error(tag, 'e: ', e)
        return {}
    }
}

// getApps
export async function getApps () {
    const tag = TAG + ' | getApps | '
    try {

        //list folders
        let apps = await fs.readdir(appDir)

        return apps
    } catch (e) {
        console.error(tag, 'e: ', e)
        return {}
    }
}

//innit Wallet
export async function initWallet(wallet: any) {
    let tag = TAG + " | initWallet | ";
    try {
        if(!wallet.filename) throw Error("102: filename required for new wallet!")

        //make the wallet dir
        let isCreated = await mkdirp(seedDir);
        let isCreated2 = await mkdirp(walletDataDir);

        //if software
        let walletWrite: any = {};
        if(wallet.TYPE === 'citadel'){
            if(!wallet.masterAddress) throw Error("102: masterAddress required for citadel wallets!")
            if(!wallet.filename) wallet.filename = wallet.masterAddress+".wallet.json"
            //if passwordless
            if(wallet.temp) walletWrite.password = wallet.temp
            walletWrite.hash = wallet.hash;
            walletWrite.version = 1;
            walletWrite.type = "seedwords";
            walletWrite.vault = wallet.seed_encrypted;
        } else if (wallet.TYPE === 'keepkey'){
            if(!wallet.deviceId) throw Error("102: deviceId required for keepkey wallets!")
            if(!wallet.filename) wallet.filename = wallet.deviceId+".wallet.json"
            walletWrite = wallet
            walletWrite.username = wallet.deviceId;
            walletWrite.deviceId = wallet.deviceId;
        }else{
            throw Error("wallet format not supported!"+wallet.TYPE)
        }
        walletWrite.created = new Date().getTime();

        //let filename
        let filename = wallet.filename
        let result = await fs.writeFile(seedDir+"/"+filename, JSON.stringify(walletWrite));

        return result;
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e
    }
}

export async function deleteConfig() {
    try {

        //del
        let result = fs.unlink(configPath)

        return result
    } catch (e) {
        return {};
    }
}


export async function deleteWallet(walletName:string) {
    try {
        //backupWallet()

        //read backup dir
        let backups = await fs.readdir(backupDir)
        //get current wallet name
        let currentWallet = getWallet( seedDir + "/" +walletName)

        //TODO verify backup exists
        let isBackedUp = false
        for(let i = 0; i < backups.length; i++){
            let backupName = backups[i]
            let walletContent = getWallet(backupDir + "/"+ backupName)
            //if id === currentWallet.id
            //TODO stronger verify?
            //if(walletContent.walletContent)

        }
        //else throw!

        //del
        let result = fs.unlink( seedDir + "/" +walletName)

        return result
    } catch (e) {
        return {};
    }
}


export async function backupWallet(walletName:string, path?:string) {
    try {
        //verify backup dir exists
        let isCreated = await mkdirp(backupDir);
        if(!path) path = seedDir + "/" +walletName
        let walletBuff = fs.readFileSync(path);
        let walletString = walletBuff.toString()
        let wallet = JSON.parse(walletString)
        let backupName = new Date().getTime()

        //Write current context wallet to backup
        //TODO not windows friendly? slash \/
        let filePath = backupDir + "/" +backupName + ".wallet.json"

        let result = fs.writeFileSync(filePath, JSON.stringify(wallet));
        return result
    } catch (e) {
        return {};
    }
}

//check
export function checkConfigs(walletName:string) {
    let output: any = {};
    output.isConfigured = false;
    output.isWallet = false;
    output.isRegistered = false;

    let fileFound = fs.existsSync(pioneerConfig) ? true : false;
    if (fileFound) {
        output.config = JSON.parse(fs.readFileSync(configPath));
        if (output.config.version) output.isConfigured = true;
        if (output.config.username) output.isRegistered = true;
    }

    if (output.config && output.config.version) output.isConfigured = true;

    //wallet found?
    let walletFound = fs.existsSync( seedDir + "/" +walletName) ? true : false;
    if (walletFound) {
        output.isWallet = true;
    }

    return output;
}

export function getKeepkeyWatch(path?:string) {
    try {
        if(!path) path = keepkeyWatchPath
        let walletBuff = fs.readFileSync(path);
        let walletString = walletBuff.toString()
        let wallet = JSON.parse(walletString)

        return wallet
    } catch (e) {
        return {};
    }
}

export async function getWallets() {
    try {
        //all files with .wallet. in wallet_data

        //list folders
        let wallets = await fs.readdir(seedDir)

        //TODO filter names for .wallet.

        return wallets
    } catch (e) {
        return {};
    }
}

export async function getWalletsPublic() {
    try {
        //all files with .wallet. in wallet_data

        //list folders
        let walletsPublic = await fs.readdir(walletDataDir)


        return walletsPublic
    } catch (e) {
        return {};
    }
}

export function getWallet(walletName?:string) {
    try {
        if(!walletName) throw Error("walletName required")
        let walletBuff = fs.readFileSync(seedDir+"/"+walletName);
        let walletString = walletBuff.toString()
        let wallet = JSON.parse(walletString)
        if(Object.keys(wallet).length === 0) wallet = null
        return wallet
    } catch (e) {
        return null;
    }
}

export function getWalletPublic(walletName?:string) {
    try {
        if(!walletName) throw Error("walletName required")
        let walletBuff = fs.readFileSync(walletDataDir+"/"+walletName);
        let walletString = walletBuff.toString()
        let wallet = JSON.parse(walletString)
        if(Object.keys(wallet).length === 0) wallet = null
        return wallet
    } catch (e) {
        return null;
    }
}


export function getConfig() {
    try {
        let output = JSON.parse(fs.readFileSync(configPath));
        if(Object.keys(output).length === 0) output = null
        return output;
    } catch (e) {
        return null;
    }
}

export function setConfig(options: any) {
    return fs.writeFileSync(configPath, JSON.stringify(options));
}

export function updateConfig(options: any) {
    let options_ = getConfig();
    for (var key in options) {
        options_[key] = options[key];
    }
    setConfig(options_);
}

//export const logLevel = getConfig()['debug']?'debug':'info'
export const logLevel = "debug";
