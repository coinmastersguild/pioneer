/*
        Validate universial addresses

 */
const log = require('@pioneer-platform/loggerdog')()

import { getPaths, blockchains } from './paths'
import { COIN_MAP_KEEPKEY_LONG, addressNListToBIP32 } from './coins'

export enum Coin {
    BTC = "Bitcoin",
    ATOM = "Cosmos",
    ARB = "Arbitrum",
    OSMO = "Osmosis",
    TEST = "Testnet",
    BCH = "BitcoinCash",
    LTC = "Litecoin",
    DASH = "Dash",
    DGB = "DigiByte",
    DOGE = "Dogecoin",
    RUNE = "Thorchain",
    ETH = "Ethereum",
    ADA = "Cardano",
    MATIC = "Polygon",
    BNB = "Binance",
    AVAX = "Avalanche",
    EOS = "Eos",
    FIO = "Fio",
}

export interface AddressInfo {
    address_n: number[];
    path: string;
    coin: Coin; // Using enum type here
    script_type: string;
    curve: string;
    show_display: boolean;
}

export const addressInfoForCoin = (symbol: string, isTestnet?: boolean, scriptType?:string, showDisplay?:boolean, path?:any): any => {
    if(!isTestnet) isTestnet = false
    if(!showDisplay) showDisplay = false
    const paths = getPaths(blockchains);
    //thorswap hack
    if(symbol === "THOR") symbol = "RUNE"
    if(symbol === "GAIA") symbol = "ATOM"

    // log.info('paths', paths)
    symbol = symbol.toUpperCase()
    const blockchainEntries = paths.filter((entry: any) => entry.symbol === symbol.toUpperCase());
    // log.info('blockchainEntries', blockchainEntries)
    if (!blockchainEntries) {
        throw new Error(`Blockchain symbol '${symbol}' not found.`);
    }
    let entry: any;
    if(scriptType && blockchainEntries.length > 1){
        //filter path by script type
        entry = blockchainEntries.find((entry: any) => entry.script_type === scriptType);
    } else {
        entry = blockchainEntries[0]
    }
    //validate script type options
    
    const addressInfo = {
        address_n: entry.addressNListMaster,
        path:addressNListToBIP32(entry.addressNListMaster),
        // @ts-ignore
        coin: COIN_MAP_KEEPKEY_LONG[symbol.toUpperCase()],
        script_type: scriptType || entry.script_type,
        showDisplay: entry.showDisplay
    };

    // if (isTestnet && blockchainEntry.testnet) {
    //     addressInfo.addressNList[1] += 1; // Incrementing the account index for testnet
    // }

    return addressInfo;
};
