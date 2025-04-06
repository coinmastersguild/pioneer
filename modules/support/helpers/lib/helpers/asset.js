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
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterAssets = exports.assetFromString = exports.getAssetType = exports.getCommonAssetInfo = exports.isGasAsset = exports.gasFeeMultiplier = exports.getDecimal = void 0;
const types_1 = require("@coinmasters/types");
const index_1 = require("../index");
const getDecimalMethodHex = '0x313ce567';
const getContractDecimals = (_a) => __awaiter(void 0, [_a], void 0, function* ({ chain, to }) {
    try {
        const { result } = yield index_1.RequestClient.post(types_1.ChainToRPC[chain], {
            headers: {
                accept: '*/*',
                'content-type': 'application/json',
                'cache-control': 'no-cache',
            },
            body: JSON.stringify({
                id: 44,
                jsonrpc: '2.0',
                method: 'eth_call',
                params: [{ to: to.toLowerCase(), data: getDecimalMethodHex }, 'latest'],
            }),
        });
        return parseInt(BigInt(result).toString());
    }
    catch (error) {
        console.error(error);
        // @ts-ignore
        return types_1.BaseDecimal[chain];
    }
});
const getETHAssetDecimal = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    if (symbol === types_1.Chain.Ethereum)
        return types_1.BaseDecimal.ETH;
    const [, address] = symbol.split('-');
    return (address === null || address === void 0 ? void 0 : address.startsWith('0x'))
        ? getContractDecimals({ chain: types_1.Chain.Ethereum, to: address })
        : types_1.BaseDecimal.ETH;
});
const getAVAXAssetDecimal = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    const [, address] = symbol.split('-');
    return (address === null || address === void 0 ? void 0 : address.startsWith('0x'))
        ? getContractDecimals({ chain: types_1.Chain.Avalanche, to: address.toLowerCase() })
        : types_1.BaseDecimal.AVAX;
});
const getBSCAssetDecimal = (symbol) => __awaiter(void 0, void 0, void 0, function* () {
    if (symbol === types_1.Chain.BinanceSmartChain)
        return types_1.BaseDecimal.BSC;
    return types_1.BaseDecimal.BSC;
});
const getDecimal = (_a) => __awaiter(void 0, [_a], void 0, function* ({ chain, symbol }) {
    switch (chain) {
        case types_1.Chain.Ethereum:
            return getETHAssetDecimal(symbol);
        case types_1.Chain.Avalanche:
            return getAVAXAssetDecimal(symbol);
        case types_1.Chain.BinanceSmartChain:
            return getBSCAssetDecimal(symbol);
        default:
            // @ts-ignore
            return types_1.BaseDecimal[chain];
    }
});
exports.getDecimal = getDecimal;
exports.gasFeeMultiplier = {
    [types_1.FeeOption.Average]: 1.2,
    [types_1.FeeOption.Fast]: 1.5,
    [types_1.FeeOption.Fastest]: 2,
};
const isGasAsset = ({ chain, symbol }) => {
    switch (chain) {
        case types_1.Chain.Bitcoin:
        case types_1.Chain.BitcoinCash:
        case types_1.Chain.Dash:
        case types_1.Chain.Digibyte:
        case types_1.Chain.Zcash:
        case types_1.Chain.Ripple:
        case types_1.Chain.Litecoin:
        case types_1.Chain.Dogecoin:
        case types_1.Chain.Ethereum:
        case types_1.Chain.Avalanche:
            return symbol === chain;
        case types_1.Chain.Arbitrum:
        case types_1.Chain.Optimism:
        case types_1.Chain.Base:
            return 'ETH' === symbol;
        // @ts-ignore
        case types_1.Chain.Mayachain:
            return symbol === 'CACAO';
        case types_1.Chain.Kujira:
            return symbol === 'KUJI';
        case types_1.Chain.Cosmos:
            return symbol === 'ATOM';
        case types_1.Chain.Polygon:
            return symbol === 'MATIC';
        case types_1.Chain.BinanceSmartChain:
            return symbol === 'BNB';
        case types_1.Chain.THORChain:
            return symbol === 'RUNE';
    }
};
exports.isGasAsset = isGasAsset;
const getCommonAssetInfo = (assetString) => {
    switch (assetString) {
        case 'ETH.THOR':
            return { identifier: 'ETH.THOR-0xa5f2211b9b8170f694421f2046281775e8468044', decimal: 18 };
        case 'ETH.vTHOR':
            return { identifier: 'ETH.vTHOR-0x815c23eca83261b6ec689b60cc4a58b54bc24d8d', decimal: 18 };
        case types_1.Chain.Cosmos:
            return { identifier: 'GAIA.ATOM', decimal: types_1.BaseDecimal[assetString] };
        case types_1.Chain.THORChain:
            return { identifier: 'THOR.RUNE', decimal: types_1.BaseDecimal[assetString] };
        case types_1.Chain.BinanceSmartChain:
            return { identifier: 'BSC.BNB', decimal: types_1.BaseDecimal[assetString] };
        // @ts-ignore
        case types_1.Chain.Mayachain:
            return { identifier: 'MAYA.CACAO', decimal: types_1.BaseDecimal.MAYA };
        case 'MAYA.MAYA':
            return { identifier: 'MAYA.MAYA', decimal: 4 };
        case types_1.Chain.Arbitrum:
            return { identifier: 'ARB.ETH', decimal: 18 };
        case types_1.Chain.Base:
            return { identifier: 'BASE.ETH', decimal: 18 };
        case types_1.Chain.Optimism:
            return { identifier: 'OP.ETH', decimal: 18 };
        case types_1.Chain.Avalanche:
            return { identifier: 'AVAX.ETH', decimal: 18 };
        case types_1.Chain.Ripple:
        case types_1.Chain.Kujira:
        case types_1.Chain.BitcoinCash:
        case types_1.Chain.Zcash:
        case types_1.Chain.Dash:
        case types_1.Chain.Litecoin:
        case types_1.Chain.Dogecoin:
        case types_1.Chain.Polygon:
        case types_1.Chain.Bitcoin:
        case types_1.Chain.Ethereum:
            return { identifier: `${assetString}.${assetString}`, decimal: types_1.BaseDecimal[assetString] };
    }
};
exports.getCommonAssetInfo = getCommonAssetInfo;
const getAssetType = ({ chain, symbol }) => {
    if (symbol.includes('/'))
        return 'Synth';
    switch (chain) {
        case types_1.Chain.Bitcoin:
        case types_1.Chain.BitcoinCash:
        case types_1.Chain.Dogecoin:
        case types_1.Chain.Dash:
        case types_1.Chain.Zcash:
        case types_1.Chain.Litecoin:
        // @ts-ignore
        case types_1.Chain.Mayachain:
        case types_1.Chain.THORChain:
            return 'Native';
        case types_1.Chain.Osmosis:
            return 'Native';
        case types_1.Chain.Cosmos:
            return symbol === 'ATOM' ? 'Native' : types_1.Chain.Cosmos;
        case types_1.Chain.Kujira:
            return symbol === types_1.Chain.Kujira ? 'Native' : types_1.Chain.Kujira;
        case types_1.Chain.BinanceSmartChain:
        case types_1.Chain.Ethereum:
            return symbol === types_1.Chain.Ethereum ? 'Native' : 'ERC20';
        case types_1.Chain.Avalanche:
            return symbol === types_1.Chain.Avalanche ? 'Native' : types_1.Chain.Avalanche;
        case types_1.Chain.Polygon:
            return symbol === types_1.Chain.Polygon ? 'Native' : 'POLYGON';
        case types_1.Chain.Base:
            return symbol === types_1.Chain.Ethereum ? 'Native' : 'ERC20';
        case types_1.Chain.Arbitrum:
            return [types_1.Chain.Ethereum, types_1.Chain.Arbitrum].includes(symbol) ? 'Native' : 'ARBITRUM';
        case types_1.Chain.Optimism:
            return [types_1.Chain.Ethereum, types_1.Chain.Optimism].includes(symbol) ? 'Native' : 'OPTIMISM';
    }
};
exports.getAssetType = getAssetType;
const assetFromString = (assetString) => {
    var _a;
    const [chain, ...symbolArray] = assetString.split('.');
    const synth = assetString.includes('/');
    const symbol = symbolArray.join('.');
    const ticker = (_a = symbol === null || symbol === void 0 ? void 0 : symbol.split('-')) === null || _a === void 0 ? void 0 : _a[0];
    return { chain, symbol, ticker, synth };
};
exports.assetFromString = assetFromString;
const potentialScamRegex = new RegExp(/(.)\1{6}|\.ORG|\.NET|\.FINANCE|\.COM|WWW|HTTP|\\\\|\/\/|[\s$%:[\]]/, 'gmi');
const evmAssetHasAddress = (assetString) => {
    const [chain, symbol] = assetString.split('.');
    if (!types_1.EVMChainList.includes(chain))
        return true;
    const [, address] = symbol.split('-');
    return (0, exports.isGasAsset)({ chain: chain, symbol }) || !!address;
};
const filterAssets = (tokens) => tokens.filter((token) => {
    const assetString = `${token.chain}.${token.symbol}`;
    return (!potentialScamRegex.test(assetString) &&
        evmAssetHasAddress(assetString) &&
        token.value !== '0');
});
exports.filterAssets = filterAssets;
