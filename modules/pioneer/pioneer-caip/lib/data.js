"use strict";
/*
       Caip tools

         This file contains tools for working with CAIP-10 and CAIP-19 identifiers. and transactions layres

 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.caipToRango = exports.caipToThorchain = exports.tokenToCaip = exports.thorchainToCaip = exports.NetworkIdToRangoName = exports.shortListRangoNameToNetworkId = exports.shortListNameToCaip = exports.shortListSymbolToCaip = exports.shortListSymbolToCoinGeckoPlatformId = exports.NetworkIdToChain = exports.ChainToNetworkId = exports.ChainToCaip = exports.Chain = exports.evmCaips = exports.caipToNetworkId = exports.networkIdToCaip = void 0;
exports.getChainEnumValue = getChainEnumValue;
//networkIdToCaip
var networkIdToCaip = function (networkId) {
    // Check if networkId includes 'eip155' and assume /slip44:60 if true
    if (networkId.includes('eip155')) {
        return "".concat(networkId, "/slip44:60");
    }
    // Get the chain symbol from NetworkIdToChain using the networkId
    var chainSymbol = exports.NetworkIdToChain[networkId];
    if (!chainSymbol) {
        throw new Error("Unable to find chain symbol for networkId ".concat(networkId, "."));
    }
    // Now get the CAIP from ChainToCaip using the chain symbol
    var caip = exports.ChainToCaip[chainSymbol];
    if (!caip) {
        throw new Error("Unable to convert networkId ".concat(networkId, " to CAIP."));
    }
    return caip;
};
exports.networkIdToCaip = networkIdToCaip;
var caipToNetworkId = function (caip) {
    return caip.split('/')[0];
};
exports.caipToNetworkId = caipToNetworkId;
exports.evmCaips = {
    ethereum: 'eip155:1/slip44:60',
    base: 'eip155:8453/slip44:60',
    polygon: 'eip155:137/slip44:60',
    pulsechain: 'eip155:369/slip44:60',
    optimism: 'eip155:10/slip44:60',
    'gnosis-chain-(formerly-xdai)': 'eip155:100/slip44:60',
    'gnosis': 'eip155:100/slip44:60',
    'binance-smart-chain': 'eip155:56/slip44:60',
    'smart-bitcoin-cash': 'eip155:10000/slip44:60',
    arbitrum: 'eip155:42161/slip44:60',
    fuse: 'eip155:122/slip44:60',
    'bittorrent-chain': 'eip155:199/slip44:60',
    celo: 'eip155:42220/slip44:60',
    'avalanche': 'eip155:43114/slip44:60',
    grli: 'eip155:5/slip44:60',
    eos: 'eip155:59/slip44:60',
    'ethereum-classic': 'eip155:61/slip44:60',
    evmos: 'eip155:9001/slip44:60',
    'poa-network-core': 'eip155:99/slip44:60'
};
var Chain;
(function (Chain) {
    Chain["Arbitrum"] = "ARB";
    Chain["Avalanche"] = "AVAX";
    Chain["Base"] = "BASE";
    Chain["Binance"] = "BNB";
    Chain["BinanceSmartChain"] = "BSC";
    Chain["Bitcoin"] = "BTC";
    Chain["BitcoinCash"] = "BCH";
    Chain["Cosmos"] = "GAIA";
    Chain["Dash"] = "DASH";
    Chain["Digibyte"] = "DGB";
    Chain["Dogecoin"] = "DOGE";
    Chain["EOS"] = "EOS";
    Chain["Ethereum"] = "ETH";
    Chain["Kujira"] = "KUJI";
    Chain["Litecoin"] = "LTC";
    Chain["Mayachain"] = "MAYA";
    Chain["Optimism"] = "OP";
    Chain["Osmosis"] = "OSMO";
    Chain["Polygon"] = "MATIC";
    Chain["Ripple"] = "XRP";
    Chain["THORChain"] = "THOR";
    Chain["Zcash"] = "ZEC";
})(Chain || (exports.Chain = Chain = {}));
exports.ChainToCaip = {
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
    'MAYA': 'cosmos:mayachain-mainnet-v1/slip44:931',
    'OP': 'eip155:10/slip44:60',
    'OSMO': 'cosmos:osmosis-1/slip44:118',
    'MATIC': 'eip155:137/slip44:60',
    'XRP': 'ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144',
    'THOR': 'cosmos:thorchain-mainnet-v1/slip44:931',
    'ZEC': 'bip122:0000000000196a45/slip44:133',
};
exports.ChainToNetworkId = {
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
    'MAYA': 'cosmos:mayachain-mainnet-v1',
    'OP': 'eip155:10',
    'OSMO': 'cosmos:osmosis-1',
    'MATIC': 'eip155:137',
    'XRP': 'ripple:4109c6f2045fc7eff4cde8f9905d19c2',
    'THOR': 'cosmos:thorchain-mainnet-v1',
    'ZEC': 'bip122:0000000000196a45',
};
exports.NetworkIdToChain = Object.entries(exports.ChainToNetworkId)
    .reduce(function (acc, _a) {
    var key = _a[0], value = _a[1];
    acc[value] = key;
    return acc;
}, {});
function getChainEnumValue(chainStr) {
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
            return Chain.Mayachain;
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
exports.shortListSymbolToCoinGeckoPlatformId = {
    ARB: 'arbitrum',
    BASE: 'base',
    ETH: 'ethereum',
    GNO: 'gnosis-chain', // GNO is native to Gnosis Chain, previously known as xDai Chain
    MATIC: 'polygon-pos',
    OP: 'optimistic-ethereum',
    AVAX: 'avalanche',
    BNB: 'binance-smart-chain'
};
exports.shortListSymbolToCaip = {
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
    MAYA: 'cosmos:mayachain-mainnet-v1/slip44:931',
    ETH: 'eip155:1/slip44:60',
    GNO: 'eip155:100/slip44:60',
    XRP: 'ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144',
    MATIC: 'eip155:137/slip44:60',
    OP: 'eip155:10/slip44:60',
    AVAX: 'eip155:43114/slip44:60',
    ADA: 'placeholder:caip:cardano:native:cardano',
    BNB: 'eip155:56/slip44:60',
    BSC: 'eip155:56/slip44:60',
    EOS: 'eos:cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f/slip44:194',
    FIO: 'placeholder:caip:fio:native:fio-protocol'
};
exports.shortListNameToCaip = {
    bitcoin: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    arbitrum: 'eip155:42161/slip44:60',
    cosmos: 'cosmos:cosmoshub-4/slip44:118',
    osmosis: 'cosmos:osmosis-1/slip44:118',
    polygon: 'eip155:137/slip44:60',
    bitcoincash: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
    litecoin: 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
    dash: 'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
    digiByte: 'bip122:digibytes-hash/slip44:20',
    dogecoin: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
    thorchain: 'cosmos:thorchain-mainnet-v1/slip44:931',
    mayachain: 'cosmos:mayachain-mainnet-v1/slip44:931',
    ethereum: 'eip155:1/slip44:60',
    avalanche: 'eip155:43114/slip44:60',
    gnosis: 'eip155:100/slip44:60',
    bnbsmartchain: 'eip155:56/slip44:60',
    ripple: 'ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144',
    optimism: 'eip155:10/slip44:60',
    base: 'eip155:8453/slip44:60',
    kuji: 'cosmos:kaiyo-1/slip44:118',
    cardano: 'placeholder:caip:cardano:native:cardano',
    binance: 'placeholder:caip:binance:native:bnb-beacon-chain',
    eos: 'eip155:1:/erc20:0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
    fio: 'placeholder:caip:fio:native:fio-protocol'
};
exports.shortListRangoNameToNetworkId = {
    COSMOS: 'cosmos:cosmoshub-4',
    OSMOSIS: 'cosmos:osmosis-1',
    AVAX_CCHAIN: 'eip155:43114',
    ETH: 'eip155:1',
    BASE: 'eip155:8453',
    THOR: 'cosmos:thorchain-mainnet-v1',
    MAYA: 'cosmos:mayachain-mainnet-v1',
    BCH: 'bip122:000000000000000000651ef99cb9fcbe',
    LTC: 'bip122:12a765e31ffd4059bada1e25190f6e98',
    DASH: 'bip122:000007d91d1254d60e2dd1ae58038307',
    DGB: 'bip122:digibytes-hash',
    DOGE: 'bip122:00000000001a91e3dace36e2be3bf030'
};
var NetworkIdToRangoName = function (networkId) {
    // Mapping networkId back to Rango name using the existing mapping
    for (var _i = 0, _a = Object.entries(exports.shortListRangoNameToNetworkId); _i < _a.length; _i++) {
        var _b = _a[_i], rangoName = _b[0], rangoNetworkId = _b[1];
        if (rangoNetworkId === networkId) {
            return rangoName;
        }
    }
    console.error('Rango name not found for networkId:', networkId);
    return null;
};
exports.NetworkIdToRangoName = NetworkIdToRangoName;
//TODO balance to caip
var balanceToCaip = function (balance) {
    try {
        var caip = void 0;
        if (balance.type !== 'Native') {
            // For ERC20 tokens
            var networkId = exports.ChainToNetworkId[balance.chain];
            if (!networkId)
                throw new Error("Unsupported chain: ".concat(balance.chain));
            caip = "".concat(networkId, "/erc20:").concat(balance.address);
        }
        else {
            //assume native?
            // For native tokens, use the identifier as it is
            // @ts-ignore
            caip = exports.shortListSymbolToCaip[balance.chain];
        }
        if (!caip) {
            console.error("Failed to convert balance to caip: ", balance);
        }
        return caip;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
var tokenToCaip = function (token) {
    try {
        var caip = void 0;
        // console.log("token",token)
        if (token.address) {
            // For ERC20 tokens
            var networkId = exports.ChainToNetworkId[token.chain];
            if (!networkId)
                throw new Error("Unsupported chain: ".concat(token.chain));
            caip = "".concat(networkId, "/erc20:").concat(token.address);
        }
        else {
            // For native tokens, use the identifier as it is
            caip = thorchainToCaip(token.identifier);
            token.type = 'native';
        }
        token.networkId = exports.ChainToNetworkId[token.chain];
        token.caip = caip;
        token.symbol = token.identifier.split('.')[1]; // Assuming the symbol is the second part of the identifier
        // Keeping the original ticker unchanged
        // token.ticker = token.address ? token.identifier.split('.')[1].split('-')[0] : token.identifier.split('.')[1];
        return token;
    }
    catch (e) {
        console.error(e);
        return null;
    }
};
exports.tokenToCaip = tokenToCaip;
//NOTE - this function needs to support ALL assets pioneer supports! (not just thorchain assets)
var thorchainToCaip = function (identifier) {
    try {
        var caip = void 0;
        var parts = identifier.split('.');
        var chain = parts[0];
        var rest = parts.length > 1 ? parts.slice(1).join('.') : null;
        var symbolAndContract = rest ? rest.split('-') : [null, null];
        var symbol = symbolAndContract[0];
        var contract = symbolAndContract[1];
        if (contract) {
            var networkId = exports.ChainToNetworkId[chain];
            if (!networkId)
                throw new Error("Unsupported chain: ".concat(chain));
            caip = "".concat(networkId, "/erc20:").concat(contract);
            return caip;
        }
        // console.log("key:", identifier);
        switch (identifier) {
            case "OSMO.ATOM":
                caip = 'cosmos:osmosis-1/ibc:B011C1A0AD5E717F674BA59FD8E05B2F946E4FD41C9CB3311C95F7ED4B815620';
                break;
            case "MAYA.CACAO":
                caip = exports.ChainToCaip['MAYA'];
                break;
            case "AVAX.WETH":
                caip = exports.ChainToCaip['AVAX'];
                break;
            case "BSC.BNB":
                caip = exports.shortListNameToCaip['bnbsmartchain'];
                break;
            case "GAIA.ATOM":
                caip = exports.shortListNameToCaip['cosmos'];
                break;
            case "ARB.ETH":
                caip = exports.shortListNameToCaip['arbitrum'];
                break;
            case "BASE.ETH":
                caip = exports.shortListNameToCaip['base'];
                break;
            case "OP.ETH":
                caip = exports.shortListNameToCaip['optimism'];
                break;
            // case "THOR.RUNE":
            // case "KUJI.USK":
            //     // @ts-ignore
            //     caip = ChainToCaip[chain.toLowerCase()];
            //     break;
            default:
                var networkId = exports.ChainToNetworkId[chain];
                if (!networkId)
                    throw new Error("Unsupported chain: ".concat(chain));
                caip = exports.ChainToCaip[chain] || networkId; // Fallback to networkId if no direct mapping
                break;
        }
        return caip;
    }
    catch (e) {
        throw e;
    }
};
exports.thorchainToCaip = thorchainToCaip;
//NOTE THIS IS IMPOSSIBLE to do well!
// Caips do NOT include the token tickers!
var caipToThorchain = function (caip, ticker) {
    try {
        var networkId = caip.split('/')[0]; // Splitting off the network ID from the CAIP
        if (!networkId)
            throw new Error("Invalid CAIP!");
        var chain = exports.NetworkIdToChain[networkId];
        if (!chain) {
            console.error("No matching chain symbol found for network ID", networkId);
            return null;
        }
        // Special handling for 'OSMO.ATOM'
        if (networkId === 'cosmos:osmosis-1' && ticker === 'ATOM') {
            return 'OSMO.ATOM';
        }
        // Special handling for 'THOR.THOR' to return 'THOR.RUNE'
        if (chain === 'THOR' && ticker === 'THOR') {
            return 'THOR.RUNE';
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
            return "".concat(chain, ".").concat(ticker, "-").concat(contractAddress);
        }
        else {
            // Handling native tokens
            return ticker ? "".concat(chain, ".").concat(ticker) : "".concat(chain, ".").concat(chain);
        }
    }
    catch (e) {
        console.error("caip: ", caip);
        console.error("ticker: ", ticker);
        console.error("Error processing network ID to THORChain", e);
        return null;
    }
};
exports.caipToThorchain = caipToThorchain;
var caipToRango = function (caip, ticker) {
    try {
        var _a = caip.split('/'), networkId = _a[0], tokenInfo = _a[1];
        var rangoName = (0, exports.NetworkIdToRangoName)(networkId);
        // Using the ticker directly as the symbol
        var symbol = ticker;
        var address = null; // Default to null
        // For ERC20 tokens, the contract address is included in the CAIP
        if (tokenInfo && tokenInfo.startsWith('erc20:')) {
            address = tokenInfo.split(':')[1];
        }
        if (!rangoName) {
            console.error('Rango name not found for networkId:', networkId);
            return null;
        }
        return { blockchain: rangoName, symbol: symbol, address: address };
    }
    catch (e) {
        console.error("Error processing CAIP to Rango", e);
        return null;
    }
};
exports.caipToRango = caipToRango;
