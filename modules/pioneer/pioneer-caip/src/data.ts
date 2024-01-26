/*
       Caip tools

         This file contains tools for working with CAIP-10 and CAIP-19 identifiers. and transactions layres

 */

export const caipToNetworkId = function (caip: string) {
    return caip.split('/')[0]
}

export const evmCaips = {
    ethereum: 'eip155:1/slip44:60',
    base: 'eip155:8453/slip44:60',
    polygon: 'eip155:137/slip44:60',
    pulsechain: 'eip155:369/slip44:60',
    optimism: 'eip155:10/slip44:60',
    'gnosis-chain-(formerly-xdai)': 'eip155:100/slip44:60',
    'gnosis': 'eip155:100/slip44:60',
    'binance-smart-chain': 'eip155:56/slip44:60',
    'smart-bitcoin-cash': 'eip155:10000/slip44:60',
    'arbitrum': 'eip155:42161/slip44:60',
    fuse: 'eip155:122/slip44:60',
    'bittorrent-chain': 'eip155:199/slip44:60',
    celo: 'eip155:42220/slip44:60',
    'avalanche': 'eip155:43114/slip44:60',
    grli: 'eip155:5/slip44:60',
    eos: 'eip155:59/slip44:60',
    'ethereum-classic': 'eip155:61/slip44:60',
    evmos: 'eip155:9001/slip44:60',
    'poa-network-core': 'eip155:99/slip44:60'
}

export enum Chain {
    Arbitrum = 'ARB',
    Avalanche = 'AVAX',
    Base = 'BASE',
    Binance = 'BNB',
    BinanceSmartChain = 'BSC',
    Bitcoin = 'BTC',
    BitcoinCash = 'BCH',
    Cosmos = 'GAIA',
    Dash = 'DASH',
    Digibyte = 'DGB',
    Dogecoin = 'DOGE',
    EOS = 'EOS',
    Ethereum = 'ETH',
    Kujira = 'KUJI',
    Litecoin = 'LTC',
    Maya = 'MAYA',
    Optimism = 'OP',
    Osmosis = 'OSMO',
    Polygon = 'MATIC',
    Ripple = 'XRP',
    THORChain = 'THOR',
    Zcash = 'ZEC',
}

export const ChainToCaip: Record<string, string> = {
    'ARB': 'eip155:42161/slip44:60',
    'AVAX': 'eip155:43114/slip44:60',
    'BSC': 'eip155:56/slip44:60',
    'BNB': 'binance:bnb-beacon-chain/slip44:118',
    'BCH': 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
    'BTC': 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    'BASE': 'eip155:8453/slip44:60',
    'GAIA': 'cosmos:cosmoshub-4/slip44:118',
    'DASH': 'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
    'DGB': 'bip122:digibytes-hash/slip44:20',
    'DOGE': 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
    'KUJI': 'cosmos:kaiyo-1/slip44:118',
    'EOS': 'eos:cf057bbfb72640471fd910bcb67639c2/slip44:194',
    'ETH': 'eip155:1/slip44:60',
    'LTC': 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
    'MAYA': 'cosmos:maya-mainnet-v1/slip44:118',
    'OP': 'eip155:10/slip44:60',
    'OSMO': 'cosmos:osmosis-1/slip44:118',
    'MATIC': 'eip155:137/slip44:60',
    'XRP': 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2/slip44:144',
    'THOR': 'cosmos:thorchain-mainnet-v1/slip44:931',
    'ZEC': 'bip122:0000000000196a45/slip44:133',
};

export const ChainToNetworkId: Record<string, string> = {
    'ARB': 'eip155:42161',
    'AVAX': 'eip155:43114',
    'BSC': 'eip155:56',
    'BNB': 'binance:bnb-beacon-chain',
    'BCH': 'bip122:000000000000000000651ef99cb9fcbe',
    'BTC': 'bip122:000000000019d6689c085ae165831e93',
    'BASE': 'eip155:8453',
    'GAIA': 'cosmos:cosmoshub-4',
    'DASH': 'bip122:000007d91d1254d60e2dd1ae58038307',
    'DGB': 'bip122:digibytes-hash',
    'DOGE': 'bip122:00000000001a91e3dace36e2be3bf030',
    'KUJI': 'cosmos:kaiyo-1',
    'EOS': 'eos:cf057bbfb72640471fd910bcb67639c2',
    'ETH': 'eip155:1',
    'LTC': 'bip122:12a765e31ffd4059bada1e25190f6e98',
    'MAYA': 'cosmos:maya-mainnet-v1',
    'OP': 'eip155:10',
    'OSMO': 'cosmos:osmosis-1',
    'MATIC': 'eip155:137',
    'XRP': 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2',
    'THOR': 'cosmos:thorchain-mainnet-v1',
    'ZEC': 'bip122:0000000000196a45',
};

export const NetworkIdToChain: Record<string, string> = Object.entries(ChainToNetworkId)
    .reduce((acc, [key, value]) => {
        acc[value] = key;
        return acc;
    }, {} as Record<string, string>);

export function getChainEnumValue(chainStr: string) {
    switch (chainStr) {
        case 'ARB':
            return Chain.Arbitrum;
        case 'AVAX':
            return Chain.Avalanche;
        case 'BASE':
            return Chain.Base;
        case 'BNB':
            return Chain.Binance;
        case 'BSC':
            return Chain.BinanceSmartChain;
        case 'BTC':
            return Chain.Bitcoin;
        case 'BCH':
            return Chain.BitcoinCash;
        case 'GAIA':
            return Chain.Cosmos;
        case 'DASH':
            return Chain.Dash;
        case 'DGB':
            return Chain.Digibyte;
        case 'DOGE':
            return Chain.Dogecoin;
        case 'EOS':
            return Chain.EOS;
        case 'ETH':
            return Chain.Ethereum;
        case 'KUJI':
            return Chain.Kujira;
        case 'LTC':
            return Chain.Litecoin;
        case 'MAYA':
            return Chain.Maya;
        case 'OP':
            return Chain.Optimism;
        case 'OSMO':
            return Chain.Osmosis;
        case 'MATIC':
            return Chain.Polygon;
        case 'XRP':
            return Chain.Ripple;
        case 'THOR':
            return Chain.THORChain;
        case 'ZEC':
            return Chain.Zcash;
        default:
            return undefined;
    }
}

export const shortListSymbolToCoinGeckoPlatformId = {
    ARB: 'arbitrum',
    BASE: 'base',
    ETH: 'ethereum',
    GNO: 'gnosis-chain', // GNO is native to Gnosis Chain, previously known as xDai Chain
    MATIC: 'polygon-pos',
    OP: 'optimistic-ethereum',
    AVAX: 'avalanche',
    BNB: 'binance-smart-chain'
}

export const shortListSymbolToCaip = {
    ATOM: 'cosmos:cosmoshub-4/slip44:118',
    ARB: 'eip155:42161/slip44:60',
    BTC: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    BASE: 'eip155:8453/slip44:60',
    OSMO: 'cosmos:osmosis-1/slip44:118',
    BCH: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
    LTC: 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
    GAIA: 'cosmos:cosmoshub-4/slip44:118',
    DASH: 'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
    DGB: 'bip122:digibytes-hash/slip44:20',
    DOGE: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
    RUNE: 'cosmos:thorchain-mainnet-v1/slip44:931',
    THOR: 'cosmos:thorchain-mainnet-v1/slip44:931',
    ETH: 'eip155:1/slip44:60',
    GNO: 'eip155:100/slip44:60',
    XRP: 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2/slip44:144',
    MATIC: 'eip155:137/slip44:60',
    OP: 'eip155:10/slip44:60',
    AVAX: 'eip155:43114/slip44:60',
    ADA: 'placeholder:caip:cardano:native:cardano',
    BNB: 'eip155:56/slip44:60',
    EOS: 'eos:cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f/slip44:194',
    FIO: 'placeholder:caip:fio:native:fio-protocol'
}

export const shortListNameToCaip = {
    bitcoin: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    arbitrum: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    cosmos: 'cosmos:cosmoshub-4/slip44:118',
    osmosis: 'cosmos:osmosis-1/slip44:118',
    polygon: 'eip155:137/slip44:60',
    bitcoincash: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
    litecoin: 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
    dash: 'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
    digiByte: 'bip122:digibytes-hash/slip44:20',
    dogecoin: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
    thorchain: 'cosmos:thorchain-mainnet-v1/slip44:931',
    ethereum: 'eip155:1/slip44:60',
    avalanche: 'eip155:43114/slip44:60',
    gnosis: 'eip155:100/slip44:60',
    bnbsmartchain: 'eip155:56/slip44:60',
    ripple: 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2/slip44:144',
    optimism: 'eip155:10/slip44:60',
    kuji: 'cosmos:kaiyo-1/slip44:118',
    cardano: 'placeholder:caip:cardano:native:cardano',
    binance: 'placeholder:caip:binance:native:bnb-beacon-chain',
    eos: 'eip155:1:/erc20:0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
    fio: 'placeholder:caip:fio:native:fio-protocol'
}

export const shortListRangoNameToNetworkId = {
    COSMOS: 'cosmos:cosmoshub-4',
    OSMOSIS: 'cosmos:osmosis-1',
    AVAX_CCHAIN: 'eip155:43114',
    ETH: 'eip155:1',
    THOR: 'cosmos:thorchain-mainnet-v1',
    BCH: 'bip122:000000000000000000651ef99cb9fcbe',
    LTC: 'bip122:12a765e31ffd4059bada1e25190f6e98',
    DASH: 'bip122:000007d91d1254d60e2dd1ae58038307',
    DGB: 'bip122:digibytes-hash',
    DOGE: 'bip122:00000000001a91e3dace36e2be3bf030'
};

export const NetworkIdToRangoName = function (networkId:string) {
    try {
        // Inverting the mapping to find the Rango name based on networkId
        for (const [rangoName, rangoNetworkId] of Object.entries(shortListRangoNameToNetworkId)) {
            if (rangoNetworkId === networkId) {
                return rangoName;
            }
        }

        console.error('Rango name not found for networkId:', networkId);
        return null;
    } catch (e) {
        console.error("Error processing networkId to Rango Name", e);
        return null;
    }
};

let tokenToCaip = function (token: any) {
    try {
        let caip;
        console.log("token",token)
        if (token.address) {
            // For ERC20 tokens
            let networkId = ChainToNetworkId[token.chain];
            if (!networkId) throw new Error(`Unsupported chain: ${token.chain}`);
            caip = `${networkId}/erc20:${token.address}`;
            token.type = 'token';
        } else {
            // For native tokens, use the identifier as it is
            caip = thorchainToCaip(token.identifier);
            token.type = 'native';
        }

        token.networkId = ChainToNetworkId[token.chain];
        token.caip = caip;
        token.symbol = token.identifier.split('.')[1]; // Assuming the symbol is the second part of the identifier

        // Keeping the original ticker unchanged
        // token.ticker = token.address ? token.identifier.split('.')[1].split('-')[0] : token.identifier.split('.')[1];

        return token;
    } catch (e) {
        console.error(e);
        return null;
    }
};


let thorchainToCaip = function(identifier: string): string {
    try {
        let caip: string;
        let parts = identifier.split('.');

        let chain = parts[0];
        let rest = parts.length > 1 ? parts.slice(1).join('.') : null;
        let symbolAndContract = rest ? rest.split('-') : [null, null];
        let symbol = symbolAndContract[0];
        let contract = symbolAndContract[1];

        if (contract) {
            let networkId = ChainToNetworkId[chain];
            if (!networkId) throw new Error(`Unsupported chain: ${chain}`);
            caip = `${networkId}/erc20:${contract}`;
            return caip;
        }

        console.log("key:", identifier);
        switch (identifier) {
            case "OSMO.ATOM":
                caip = 'cosmos:osmosis-1/ibc:B011C1A0AD5E717F674BA59FD8E05B2F946E4FD41C9CB3311C95F7ED4B815620';
                break;
            case "AVAX.WETH":
                caip = ChainToCaip['AVAX'];
                break;
            case "BSC.BNB":
                caip = shortListNameToCaip['bnbsmartchain'];
                break;
            case "GAIA.ATOM":
                caip = shortListNameToCaip['cosmos'];
                break;
            case "ARB.ETH":
                caip = shortListNameToCaip['arbitrum'];
                break;
            case "OP.ETH":
                caip = shortListNameToCaip['optimism'];
                break;
            case "THOR.RUNE":
            case "KUJI.USK":
                // @ts-ignore
                caip = shortListNameToCaip[chain.toLowerCase()];
                break;
            default:
                let networkId = ChainToNetworkId[chain];
                if (!networkId) throw new Error(`Unsupported chain: ${chain}`);
                caip = ChainToCaip[chain] || networkId; // Fallback to networkId if no direct mapping
                break;
        }

        return caip;
    } catch (e) {
        throw e;
    }
};
//NOTE THIS IS IMPOSSIBLE to do well!
// Caips do NOT include the token tickers!
let caipToThorchain = function (caip:string, ticker:string) {
    try {
        var networkId = caip.split('/')[0]; // Splitting off the network ID from the CAIP
        console.log("networkId: ", networkId);
        if (!networkId) throw Error("Invalid CAIP!");

        var chain = exports.NetworkIdToChain[networkId];
        if (!chain) {
            console.error("No matching chain symbol found for network ID", networkId);
            return null;
        }

        // Special handling for 'OSMO.ATOM'
        if (networkId === 'cosmos:osmosis-1' && ticker === 'ATOM') {
            return 'OSMO.ATOM';
        }

        // Handling contract tokens
        if (caip.includes('erc20')) {
            if (!ticker) {
                console.error("Ticker is undefined for ERC20 token");
                return null;
            }
            var parts = caip.split('/');
            var contractPart = parts[1];
            var contractAddress = contractPart.split(':')[1];
            if (!contractAddress) {
                console.error("Contract address is undefined for ERC20 token");
                return null;
            }
            // Use the ticker as is without converting to uppercase
            return `${chain}.${ticker}-${contractAddress}`;
        } else {
            // Handling native tokens
            return chain + "." + chain;
        }
    } catch (e) {
        console.error("Error processing network ID to THORChain", e);
        return null;
    }
};

let caipToRango = function (caip:string, ticker:string) {
    try {
        const [networkId, tokenInfo] = caip.split('/');
        let rangoName = NetworkIdToRangoName(networkId);

        let symbol = ticker;
        let address = null; // Default to null

        // For ERC20 tokens, the contract address is included in the CAIP
        if (tokenInfo && tokenInfo.startsWith('erc20:')) {
            address = tokenInfo.split(':')[1];
        }

        if (!rangoName) {
            console.error('Rango name not found for networkId:', networkId);
            return null;
        }

        return { blockchain: rangoName, symbol, address };
    } catch (e) {
        console.error("Error processing CAIP to Rango", e);
        return null;
    }
};

export { thorchainToCaip, tokenToCaip, caipToThorchain, caipToRango };

