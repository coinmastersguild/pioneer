"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMinAmountByChain = exports.AssetValue = void 0;
exports.safeValue = safeValue;
const types_1 = require("@coinmasters/types");
const asset_1 = require("../helpers/asset");
const validators_1 = require("../helpers/validators");
const bigIntArithmetics_1 = require("./bigIntArithmetics");
const TAG = " | assetValue | ";
function safeValue(value, decimal) {
    let tag = TAG + " | safeValue | ";
    try {
        if (typeof value === 'bigint') {
            return value;
        }
        else if (typeof value === 'number') {
            return BigInt(Math.round(value * Math.pow(10, decimal)));
        }
        else if (typeof value === 'string') {
            return BigInt(Math.round(parseFloat(value) * Math.pow(10, decimal)));
        }
        return BigInt(0);
    }
    catch (error) {
        console.error(tag + 'Error in safeValue:', error);
        return BigInt(0);
    }
}
let staticTokensMap;
const getStaticToken = (identifier) => {
    let tag = TAG + " | getStaticToken | ";
    try {
        if (!staticTokensMap) {
            throw new Error('Static assets not loaded, call await AssetValue.loadStaticAssets() first');
        }
        const tokenInfo = staticTokensMap.get(identifier.toUpperCase());
        return tokenInfo || { decimal: types_1.BaseDecimal.THOR, identifier: '' };
    }
    catch (error) {
        console.error(tag + 'Error in getStaticToken:', error);
    }
};
const createAssetValue = (assetString_1, ...args_1) => __awaiter(void 0, [assetString_1, ...args_1], void 0, function* (assetString, value = 0) {
    let tag = TAG + " | createAssetValue | ";
    try {
        (0, validators_1.validateIdentifier)(assetString);
        //console.log(tag + 'assetString', assetString);
        //@ts-ignore
        const decimal = yield (0, asset_1.getDecimal)(getAssetInfo(assetString));
        //console.log(tag + 'decimal', decimal);
        const parsedValue = safeValue(value, decimal);
        //console.log(tag + 'parsedValue', parsedValue);
        // @ts-ignore
        return new AssetValue({ decimal, value: parsedValue, identifier: assetString });
    }
    catch (error) {
        console.error(tag + 'Error in createAssetValue:', error);
    }
});
class AssetValue extends bigIntArithmetics_1.BigIntArithmetics {
    //@ts-ignore
    constructor(params) {
        let tag = TAG + " | constructor | ";
        try {
            const identifier = 'identifier' in params ? params.identifier : `${params.chain}.${params.symbol}`;
            let value;
            if (params.value instanceof bigIntArithmetics_1.BigIntArithmetics) {
                value = params.value;
            }
            else {
                value = { decimal: params.decimal, value: safeValue(params.value, params.decimal) };
            }
            // @ts-ignore
            super(value);
            this.isGasAsset = false;
            this.isSynthetic = false;
            const assetInfo = getAssetInfo(identifier);
            this.type = (0, asset_1.getAssetType)(assetInfo);
            this.identifier = identifier;
            this.chain = assetInfo.chain;
            this.ticker = assetInfo.ticker;
            this.symbol = assetInfo.symbol;
            this.address = assetInfo.address;
            this.isSynthetic = assetInfo.isSynthetic;
            // @ts-ignore
            this.isGasAsset = assetInfo.isGasAsset;
            this.tax = params.tax;
        }
        catch (error) {
            console.error(tag + 'Error in constructor:', error);
        }
    }
    toString(short = false) {
        let tag = TAG + " | toString | ";
        try {
            const shortFormat = this.isSynthetic ? this.symbol : this.ticker;
            return short
                ? shortFormat
                : `${this.chain}.${this.symbol}`;
        }
        catch (error) {
            console.error(tag + 'Error in toString:', error);
        }
    }
    toUrl() {
        let tag = TAG + " | toUrl | ";
        try {
            return this.isSynthetic ? `${this.chain}.${this.symbol.replace('/', '.')}` : this.toString();
        }
        catch (error) {
            console.error(tag + 'Error in toUrl:', error);
        }
    }
    eq({ chain, symbol }) {
        let tag = TAG + " | eq | ";
        try {
            return this.chain === chain && this.symbol === symbol;
        }
        catch (error) {
            console.error(tag + 'Error in eq:', error);
        }
    }
    static fromString(assetString_1) {
        return __awaiter(this, arguments, void 0, function* (assetString, value = 0) {
            let tag = TAG + " | fromString | ";
            try {
                return createAssetValue(assetString, value);
            }
            catch (error) {
                console.error(tag + 'Error in fromString:', error);
            }
        });
    }
    static fromStringSync(assetString, value = 0) {
        let tag = TAG + " | fromStringSync | ";
        try {
            //@ts-ignore
            const { isSynthetic, symbol, chain, isGasAsset, ticker, address } = getAssetInfo(assetString);
            const { tax, decimal, identifier: tokenIdentifier, } = getStaticToken(assetString);
            const parsedValue = safeValue(value, decimal);
            let asset;
            if (tokenIdentifier) {
                asset = new AssetValue({
                    tax,
                    decimal,
                    identifier: tokenIdentifier,
                    // @ts-ignore
                    value: parsedValue,
                });
            }
            else if (isSynthetic) {
                asset = new AssetValue({
                    tax,
                    decimal: 8, // Synthetic assets use a fixed decimal value
                    identifier: assetString,
                    // @ts-ignore
                    value: parsedValue,
                });
            }
            else {
                asset = undefined;
            }
            return asset;
        }
        catch (error) {
            console.error(tag + 'Error in fromStringSync:', error);
        }
    }
    static fromIdentifier(assetString_1) {
        return __awaiter(this, arguments, void 0, function* (assetString, value = 0) {
            let tag = TAG + " | fromIdentifier | ";
            try {
                return createAssetValue(assetString, value);
            }
            catch (error) {
                console.error(tag + 'Error in fromIdentifier:', error);
            }
        });
    }
    static fromIdentifierSync(identifier, value = 0) {
        let tag = TAG + " | fromIdentifierSync | ";
        try {
            //@ts-ignore
            const { decimal, identifier: tokenIdentifier } = getStaticToken(identifier);
            const parsedValue = safeValue(value, decimal);
            // @ts-ignore
            return new AssetValue({ decimal, identifier: tokenIdentifier, value: parsedValue });
        }
        catch (error) {
            console.error(tag + 'Error in fromIdentifierSync:', error);
        }
    }
    static fromChainOrSignature(assetString, value = 0) {
        let tag = TAG + " | fromChainOrSignature | ";
        try {
            const { decimal, identifier } = (0, asset_1.getCommonAssetInfo)(assetString);
            if (!decimal || !identifier)
                throw Error('unknown coin! ' + assetString);
            const parsedValue = safeValue(value, decimal);
            //console.log(tag + "parsedValue: ", parsedValue);
            //console.log(tag + "decimal: ", decimal);
            //console.log(tag + "identifier: ", identifier);
            // @ts-ignore
            return new AssetValue({ value: parsedValue, decimal, identifier });
        }
        catch (error) {
            console.error(tag + 'Error in fromChainOrSignature:', error);
        }
    }
    static loadStaticAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            let tag = TAG + " | loadStaticAssets | ";
            try {
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const _a = yield Promise.resolve().then(() => __importStar(require('@coinmasters/tokens'))), { ThorchainList: _ThorchainList, NativeList } = _a, tokensPackage = __rest(_a, ["ThorchainList", "NativeList"]);
                        const tokensMap = [NativeList, ...Object.values(tokensPackage)].reduce((acc, { tokens }) => {
                            if (!tokens) {
                                console.warn(tag + "No tokens found in the current package, skipping.");
                                return acc;
                            }
                            // @ts-ignore
                            tokens.forEach((_a) => {
                                var { identifier, chain } = _a, rest = __rest(_a, ["identifier", "chain"]);
                                const decimal = 'decimals' in rest ? rest.decimals : types_1.BaseDecimal[chain];
                                acc.set(identifier, { identifier, decimal });
                            });
                            return acc;
                        }, new Map());
                        staticTokensMap = tokensMap;
                        resolve({ ok: true });
                    }
                    catch (error) {
                        console.error(tag + "Error loading static assets:", error);
                        reject({
                            ok: false,
                            error,
                            message: "Couldn't load static assets. Ensure you have installed @coinmasters/tokens package",
                        });
                    }
                }));
            }
            catch (error) {
                console.error(tag + 'Error in loadStaticAssets:', error);
            }
        });
    }
}
exports.AssetValue = AssetValue;
const getMinAmountByChain = (chain) => {
    let tag = TAG + " | getMinAmountByChain | ";
    try {
        const asset = AssetValue.fromChainOrSignature(chain);
        switch (chain) {
            case types_1.Chain.Bitcoin:
            case types_1.Chain.Litecoin:
            case types_1.Chain.Dash:
            case types_1.Chain.Zcash:
            case types_1.Chain.BitcoinCash:
                return asset.set(0.00010001);
            case types_1.Chain.Dogecoin:
                return asset.set(1.00000001);
            case types_1.Chain.Base:
            case types_1.Chain.Arbitrum:
            case types_1.Chain.Avalanche:
            case types_1.Chain.Ethereum:
                return asset.set(0.00000001);
            case types_1.Chain.THORChain:
            case types_1.Chain.Mayachain:
                return asset.set(0.0000000001);
            default:
                return asset.set(0.00000001);
        }
    }
    catch (error) {
        console.error(tag + 'Error in getMinAmountByChain:', error);
    }
};
exports.getMinAmountByChain = getMinAmountByChain;
const getAssetInfo = (identifier) => {
    var _a;
    let tag = TAG + " | getAssetInfo | ";
    try {
        const isSynthetic = identifier.slice(0, 14).includes('/');
        const [synthChain, synthSymbol] = identifier.split('.').pop().split('/');
        const adjustedIdentifier = identifier.includes('.') && !isSynthetic ? identifier : `${types_1.Chain.THORChain}.${synthSymbol}`;
        const [chain, symbol] = adjustedIdentifier.split('.');
        const [ticker, address] = (isSynthetic ? synthSymbol : symbol).split('-');
        return {
            address: address === null || address === void 0 ? void 0 : address.toLowerCase(),
            chain,
            isGasAsset: (0, asset_1.isGasAsset)({ chain, symbol }),
            isSynthetic,
            symbol: (isSynthetic ? `${synthChain}/` : '') +
                (address ? `${ticker}-${(_a = address === null || address === void 0 ? void 0 : address.toLowerCase()) !== null && _a !== void 0 ? _a : ''}` : symbol),
            ticker,
        };
    }
    catch (error) {
        console.error(tag + 'Error in getAssetInfo:', error);
    }
};
