const log = require('@pioneer-platform/loggerdog')()
export const blockchains = [
    // 'eip155:42161',
    // 'eip155:43114',
    // 'eip155:56',
    'cosmos:maya-mainnet-v1',
    'binance:bnb-beacon-chain',
    'bip122:000000000000000000651ef99cb9fcbe',
    'bip122:000000000019d6689c085ae165831e93',
    // 'eip155:8453',
    'cosmos:cosmoshub-4',
    'bip122:dash-hash',
    'bip122:digibytes-hash',
    'bip122:00000000001a91e3dace36e2be3bf030',
    'cosmos:kaiyo-1',
    'eos:cf057bbfb72640471fd910bcb67639c2',
    'eip155:1',
    'bip122:12a765e31ffd4059bada1e25190f6e98',
    'cosmos:maya-mainnet-v1',
    // 'eip155:10',
    'cosmos:osmosis-1',
    // 'eip155:137',
    'ripple:unknown',
    'cosmos:thorchain-mainnet-v1',
    'bip122:0000000000196a45'
]

/*
    Create paths from user input

    blockchainchain

    script type

    account number


    //custom paths

    if evm

 */


export function createPath(entry:any){
    try{

    }catch(e){

    }
}


export function getPaths(blockchains?:any,isTestnet?:boolean) {
    let output = []
    if(!blockchains) blockchains = []
    if(blockchains.indexOf('bip122:000000000019d6689c085ae165831e93') >= 0){
        if(isTestnet){
            output.push({
                note:"Bitcoin testnet account 0",
                blockchain: 'bitcoin',
                testnet:true,
                symbol: 'BTC',
                symbolSwapKit: 'BTC',
                network: 'bip122:000000000019d6689c085ae165831e93',
                script_type:"p2wpkh", //bech32
                available_scripts_types:['p2pkh','p2sh','p2wpkh','p2sh-p2wpkh'],
                type:"zpub",
                addressNList: [0x80000000 + 84, 0x80000000 + 1, 0x80000000 + 0],
                addressNListMaster: [0x80000000 + 84, 0x80000000 + 1, 0x80000000 + 0, 0, 0],
                curve: 'secp256k1',
                showDisplay: false // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            })
        }else{
            //legacy  bip44
            output.push({
                note:"Bitcoin account 0",
                blockchain: 'bitcoin',
                symbol: 'BTC',
                symbolSwapKit: 'BTC',
                network: 'bip122:000000000019d6689c085ae165831e93',
                script_type:"p2pkh",
                available_scripts_types:['p2pkh','p2sh','p2wpkh','p2sh-p2wpkh'],
                type:"xpub",
                addressNList: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0],
                addressNListMaster: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
                curve: 'secp256k1',
                showDisplay: false // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            })
            //TODO non-native segwit wraped p2sh

            //bech32 bip84
            output.push({
                note:"Bitcoin account Native Segwit (Bech32)",
                blockchain: 'bitcoin',
                symbol: 'BTC',
                symbolSwapKit: 'BTC',
                network: 'bip122:000000000019d6689c085ae165831e93',
                script_type:"p2wpkh", //bech32
                available_scripts_types:['p2pkh','p2sh','p2wpkh','p2sh-p2wpkh'],
                type:"zpub",
                addressNList: [0x80000000 + 84, 0x80000000 + 0, 0x80000000 + 0],
                addressNListMaster: [0x80000000 + 84, 0x80000000 + 0, 0x80000000 + 0, 0, 0],
                curve: 'secp256k1',
                showDisplay: false // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            })
        }
    }

    if(blockchains.indexOf('eip155:1') >= 0){
        let entry:any = {
            note:" ETH primary (default)",
            symbol: 'ETH',
            symbolSwapKit: 'ETH',
            network: 'eip155:1',
            script_type:"ethereum",
            available_scripts_types:['ethereum'],
            type:"address",
            addressNList: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'ethereum'
        }
        if(isTestnet) entry.testnet = true
        output.push(entry)
    }

    // if(blockchains.indexOf('eip155:43114') >= 0){
    //     let entry:any = {
    //         note:" AVAX primary (default)",
    //         symbol: 'AVAX',
    //         symbolSwapKit: 'AVAX',
    //         network: 'eip155:43114',
    //         script_type:"avalanche",
    //         available_scripts_types:['avalanche'],
    //         type:"address",
    //         addressNList: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0],
    //         addressNListMaster: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0, 0, 0],
    //         curve: 'secp256k1',
    //         showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
    //         blockchain: 'avalanche'
    //     }
    //     if(isTestnet) entry.testnet = true
    //     output.push(entry)
    // }

    if(blockchains.indexOf('cosmos:mayachain-mainnet-v1') >= 0){
        let entry:any = {
            note:" Default COCAO path ",
            type:"address",
            addressNList: [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            script_type:"mayachain",
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'mayachain',
            symbol: 'CACAO',
            symbolSwapKit: 'CACAO',
            network: 'cosmos:mayachain-mainnet-v1',
        }
        if(isTestnet) {
            entry.testnet = true
        }
        output.push(entry)
    }

    if(blockchains.indexOf('cosmos:thorchain-mainnet-v1') >= 0){
        let entry:any = {
            note:" Default RUNE path ",
            type:"address",
            addressNList: [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            script_type:"thorchain",
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'thorchain',
            symbol: 'RUNE',
            symbolSwapKit: 'RUNE',
            network: 'cosmos:thorchain-mainnet-v1',
        }
        if(isTestnet) {
            entry.testnet = true
        }
        output.push(entry)
    }

    if(blockchains.indexOf('cosmos:secret-mainnet-v1') >= 0){
        let entry:any = {
            note:" Default Secret path ",
            type:"address",
            addressNList: [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            script_type:"secret",
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'secret',
            symbol: 'SCRT',
            symbolSwapKit: 'SCRT',
            network: 'cosmos:secret-mainnet-v1',
        }
        if(isTestnet) {
            entry.testnet = true
        }
        output.push(entry)
    }

    if(blockchains.indexOf('cosmos:cosmoshub-4') >= 0){
        let entry:any = {
            note:" Default ATOM path ",
            type:"address",
            script_type:"cosmos",
            available_scripts_types:['cosmos'],
            addressNList: [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0, 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'cosmos',
            symbol: 'ATOM',
            symbolSwapKit: 'GAIA',
            network: 'cosmos:cosmoshub-4',
        }
        if(isTestnet) {
            entry.testnet = true
        }
        output.push(entry)
    }

    if(blockchains.indexOf('cosmos:osmosis-1') >= 0){
        let entry:any = {
            note:" Default OSMO path ",
            type:"address",
            script_type:"bech32",
            available_scripts_types:['bech32'],
            addressNList: [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0, 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'osmosis',
            symbol: 'OSMO',
            symbolSwapKit: 'OSMO',
            network: 'cosmos:osmosis-1',
        }
        if(isTestnet) {
            entry.testnet = true
        }
        output.push(entry)
    }

    if(blockchains.indexOf('binance:bnb-beacon-chain') >= 0){
        let entry:any = {
            note:"Binance default path",
            type:"address",
            script_type:"binance",
            available_scripts_types:['binance'],
            addressNList: [0x80000000 + 44, 0x80000000 + 714, 0x80000000 + 0, 0 , 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 714, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'binance',
            symbol: 'BNB',
            symbolSwapKit: 'BNB',
            network: 'binance:bnb-beacon-chain',
        }
        if(isTestnet) {
            entry.testnet = true
        }
        output.push(entry)
    }

    if(blockchains.indexOf('bip122:000000000000000000651ef99cb9fcbe') >= 0){
        let entry:any = {
            note:"Bitcoin Cash Default path",
            type:"xpub",
            script_type:"p2pkh",
            available_scripts_types:['p2pkh'],
            addressNList: [0x80000000 + 44, 0x80000000 + 145, 0x80000000 + 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 145, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'bitcoincash',
            symbol: 'BCH',
            symbolSwapKit: 'BCH',
            network: 'bip122:000000000000000000651ef99cb9fcbe',
        }
        if(isTestnet) {
            entry.testnet = true
        }
        output.push(entry)
    }

    if(blockchains.indexOf('bip122:12a765e31ffd4059bada1e25190f6e98') >= 0){
        let entry:any = {
            note:"Litecoin Default path",
            type:"xpub",
            script_type:"p2pkh",
            available_scripts_types:['p2pkh'],
            addressNList: [0x80000000 + 44, 0x80000000 + 2, 0x80000000 + 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 2, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'litecoin',
            symbol: 'LTC',
            symbolSwapKit: 'LTC',
            network: 'bip122:12a765e31ffd4059bada1e25190f6e98',
        }
        if(isTestnet) {
            entry.testnet = true
        }
        output.push(entry)

        //bech32 bip84
        output.push({
            note:"Litecoin account Native Segwit (Bech32)",
            blockchain: 'litecoin',
            symbol: 'LTC',
            symbolSwapKit: 'LTC',
            network: 'bip122:12a765e31ffd4059bada1e25190f6e98',
            script_type:"p2wpkh", //bech32
            available_scripts_types:['p2pkh','p2sh','p2wpkh','p2sh-p2wpkh'],
            type:"zpub",
            addressNList: [0x80000000 + 84, 0x80000000 + 2, 0x80000000 + 0],
            addressNListMaster: [0x80000000 + 84, 0x80000000 + 2, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false // Not supported by TrezorConnect or Ledger, but KeepKey should do it
        })
        output.push(entry)
    }

    if(blockchains.indexOf('bip122:00000000001a91e3dace36e2be3bf030') >= 0){
        let entry:any = {
            note:"Dogecoin Default path",
            type:"xpub",
            script_type:"p2pkh",
            available_scripts_types:['p2pkh'],
            addressNList: [0x80000000 + 44, 0x80000000 + 3, 0x80000000 + 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 3, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
            blockchain: 'dogecoin',
            symbol: 'DOGE',
            symbolSwapKit: 'DOGE',
            network: 'bip122:00000000001a91e3dace36e2be3bf030',
        }
        if(isTestnet) {
            entry.testnet = true
        }
        output.push(entry)
    }
    
    if(blockchains.indexOf('bip122:000007d91d1254d60e2dd1ae58038307') >= 0){
        let entry:any = {
            note:"Default dash path",
            type:"xpub",
            coin: 'Dash',
            symbol: 'DASH',
            symbolSwapKit: 'DASH',
            network: 'bip122:000007d91d1254d60e2dd1ae58038307',
            blockchain: 'dash',
            script_type:"p2pkh",
            available_scripts_types:['p2pkh'],
            addressNList: [0x80000000 + 44, 0x80000000 + 5, 0x80000000 + 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 5, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
        }
        output.push(entry)
    }

    if(blockchains.indexOf('ripple:4109C6F2045FC7EFF4CDE8F9905D19C2') >= 0){
        let entry:any = {
            note:"Default ripple path",
            type:"address",
            coin: 'Ripple',
            symbol: 'XRP',
            symbolSwapKit: 'XRP',
            network: 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2',
            blockchain: 'ripple',
            script_type:"p2pkh",
            available_scripts_types:['p2pkh'],
            addressNList: [0x80000000 + 44, 0x80000000 + 144, 0x80000000 + 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 144, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
        }
        output.push(entry)
    }

    if(blockchains.indexOf('bip122:0000000000196a45') >= 0){
        let entry:any = {
            note:"Default zcash path",
            type:"address",
            coin: 'Zcash',
            symbol: 'ZEC',
            symbolSwapKit: 'ZEC',
            network: 'bip122:0000000000196a45',
            blockchain: 'zcash',
            script_type:"p2pkh",
            available_scripts_types:['p2pkh'],
            addressNList: [0x80000000 + 44, 0x80000000 + 133, 0x80000000 + 0],
            addressNListMaster: [0x80000000 + 44, 0x80000000 + 133, 0x80000000 + 0, 0, 0],
            curve: 'secp256k1',
            showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
        }
        output.push(entry)
    }

    return output
}


// {
//     note:"",
//     type:"address",
//     script_type:"binance",
//     available_scripts_types:['binance'],
//     addressNList: [0x80000000 + 44, 0x80000000 + 714, 0x80000000 + 0, 0 , 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
//     coin: 'Binance',
//     symbol: 'BNB',
//     network: 'BNB',
// },
// {
//     note:" Default ATOM path ",
//     type:"address",
//     script_type:"cosmos",
//     available_scripts_types:['cosmos'],
//     addressNList: [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0, 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
//     coin: 'Cosmos',
//     symbol: 'ATOM',
//     network: 'ATOM',
// },

//TODO More paths
// [
//
// // {
// //     note:"Bitcoin account 1",
// //     coin: 'Bitcoin',
// //     symbol: 'BTC',
// //     network: 'BTC',
// //     script_type:"p2pkh",
// //     available_scripts_types:['p2pkh'],
// //     type:"xpub",
// //     addressNList: [0x80000000 + 44, 0x80000000 + 0, 0x80000000 + 1],
// //     curve: 'secp256k1',
// //     showDisplay: false // Not supported by TrezorConnect or Ledger, but KeepKey should do it
// // },
// // {
// //     note:"bitcoin segwit bip49",
// //     coin: 'Bitcoin',
// //     symbol: 'BTC',
// //     network: 'BTC',
// //     script_type:"p2pkh",
// //     available_scripts_types:['p2pkh'],
// //     type:"xpub",
// //     addressNList: [0x80000000 + 49, 0x80000000 + 0, 0x80000000 + 0],
// //     curve: 'secp256k1',
// //     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
// //     scriptType: 'p2sh'
// // },
// {
//     note:"Standard bitcoin cash default path",
//     type:"xpub",
//     script_type:"p2pkh",
//     available_scripts_types:['p2pkh'],
//     addressNList: [0x80000000 + 44, 0x80000000 + 145, 0x80000000 + 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
//     coin: 'BitcoinCash',
//     symbol: 'BCH',
//     network: 'BCH',
// },
// {
//     note:"Default litecoin path",
//     coin: 'Litecoin',
//     symbol: 'LTC',
//     network: 'LTC',
//     script_type:"p2pkh",
//     available_scripts_types:['p2pkh'],
//     type:"xpub",
//     addressNList: [0x80000000 + 44, 0x80000000 + 2, 0x80000000 + 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
// },
// {
//     note:"Default dogecoin path",
//     coin: 'Dogecoin',
//     symbol: 'DOGE',
//     network: 'DOGE',
//     script_type:"p2pkh",
//     available_scripts_types:['p2pkh'],
//     type:"xpub",
//     addressNList: [0x80000000 + 44, 0x80000000 + 3, 0x80000000 + 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
// },
// {
//     note:"Default dash path",
//     coin: 'Dash',
//     symbol: 'DASH',
//     network: 'DASH',
//     script_type:"p2pkh",
//     available_scripts_types:['p2pkh'],
//     type:"xpub",
//     addressNList: [0x80000000 + 44, 0x80000000 + 5, 0x80000000 + 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
// },
// {
//     note:" ETH primary (default)",
//     symbol: 'ETH',
//     network: 'ETH',
//     script_type:"eth",
//     available_scripts_types:['eth'],
//     type:"address",
//     addressNList: [0x80000000 + 44, 0x80000000 + 60, 0x80000000 + 0,0,0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
//     coin: 'Ethereum'
// },
// // {
// //     note:" ETH primary (ledger)",
// //     symbol: 'ETH',
// //     network: 'ETH',
// //     script_type:"eth",
// //     available_scripts_types:['eth'],
// //     type:"address",
// //     addressNList: [0x80000000 + 44, 0x80000000 + 60, 0],
// //     curve: 'secp256k1',
// //     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
// //     coin: 'Ethereum'
// // },
// {
//     note:"Fio primary",
//     type:"address",
//     script_type:"fio",
//     available_scripts_types:['fio'],
//     addressNList: [0x80000000 + 44, 0x80000000 + 235, 0x80000000 + 0, 0, 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
//     coin: 'Fio',
//     symbol: 'FIO',
//     network: 'FIO',
// },
// {
//     note:" Default eos path ",
//     type:"address",
//     script_type:"eos",
//     available_scripts_types:['eos'],
//     addressNList: [0x80000000 + 44, 0x80000000 + 194, 0x80000000 + 0, 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
//     coin: 'Eos',
//     symbol: 'EOS',
//     network: 'EOS',
// },
// {
//     note:"",
//     type:"address",
//     script_type:"binance",
//     available_scripts_types:['binance'],
//     addressNList: [0x80000000 + 44, 0x80000000 + 714, 0x80000000 + 0, 0 , 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
//     coin: 'Binance',
//     symbol: 'BNB',
//     network: 'BNB',
// },
// {
//     note:" Default ATOM path ",
//     type:"address",
//     script_type:"cosmos",
//     available_scripts_types:['cosmos'],
//     addressNList: [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0, 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
//     coin: 'Cosmos',
//     symbol: 'ATOM',
//     network: 'ATOM',
// },
// {
//     note:" Default RUNE path ",
//     type:"address",
//     script_type:"tthor",
//     available_scripts_types:['tthor'],
//     addressNList: [0x80000000 + 44, 0x80000000 + 931, 0x80000000 + 0, 0, 0],
//     curve: 'secp256k1',
//     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
//     coin: 'Thorchain',
//     symbol: 'RUNE',
//     network: 'RUNE',
// },
// // {
// //     note:"",
// //     type:"address",
// //     addressNList: [0x80000000 + 44, 0x80000000 + 118, 0x80000000 + 0, 0x80000000 + 0],
// //     curve: 'secp256k1',
// //     showDisplay: false, // Not supported by TrezorConnect or Ledger, but KeepKey should do it
// //     coin: 'Cardano',
// //     symbol: 'ADA'
// // }
//
// ]
