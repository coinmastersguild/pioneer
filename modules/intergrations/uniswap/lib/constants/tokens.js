"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NMR = exports.LDO = exports.OP = exports.ARB = exports.UNI = exports.DAI_AVALANCHE = exports.WETH_AVALANCHE = exports.USDT_AVALANCHE = exports.USDC_AVALANCHE = exports.USDB_BLAST = exports.DAI_BSC = exports.BUSD_BSC = exports.BTC_BSC = exports.ETH_BSC = exports.USDT_BSC = exports.USDC_BSC = exports.CEUR_CELO_ALFAJORES = exports.CUSD_CELO_ALFAJORES = exports.WBTC_CELO = exports.PORTAL_ETH_CELO = exports.CEUR_CELO = exports.CUSD_CELO = exports.WETH_POLYGON = exports.WETH_POLYGON_MUMBAI = exports.WBTC_OPTIMISM = exports.WBTC_ARBITRUM_ONE = exports.WBTC = exports.USDT_OPTIMISM = exports.USDT_ARBITRUM_ONE = exports.USDT = exports.WBTC_POLYGON = exports.USDT_POLYGON = exports.DAI_POLYGON = exports.MATIC_POLYGON = exports.MATIC_MAINNET = exports.DAI_OPTIMISM = exports.DAI_ARBITRUM_ONE = exports.DAI = exports.USDC_BASE = exports.USDC_CELO = exports.USDC_POLYGON_MUMBAI = exports.USDC_POLYGON = exports.USDC_ARBITRUM_GOERLI = exports.USDC_ARBITRUM = exports.USDC_OPTIMISM_GOERLI = exports.USDC_OPTIMISM = exports.USDC_SEPOLIA = exports.USDC_GOERLI = exports.USDC_MAINNET = exports.NATIVE_CHAIN_ID = void 0;
exports.UNKNOWN_TOKEN_NAME = exports.UNKNOWN_TOKEN_SYMBOL = exports.TOKEN_SHORTHANDS = exports.WRAPPED_NATIVE_CURRENCY = exports.MNW = void 0;
exports.isCelo = isCelo;
exports.isPolygon = isPolygon;
exports.isBsc = isBsc;
exports.isAvalanche = isAvalanche;
exports.nativeOnChain = nativeOnChain;
exports.isStablecoin = isStablecoin;
const sdk_core_1 = require("@uniswap/sdk-core");
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
// eslint-disable-next-line no-restricted-syntax
exports.NATIVE_CHAIN_ID = 'NATIVE';
exports.USDC_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C');
exports.USDC_GOERLI = new sdk_core_1.Token(sdk_core_1.ChainId.GOERLI, '0x07865c6e87b9f70255377e024ace6630c1eaa37f', 6, 'USDC', 'USD//C');
exports.USDC_SEPOLIA = new sdk_core_1.Token(sdk_core_1.ChainId.SEPOLIA, '0x6f14C02Fc1F78322cFd7d707aB90f18baD3B54f5', 6, 'USDC', 'USD//C');
exports.USDC_OPTIMISM = new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM, '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', 6, 'USDC', 'USD//C');
exports.USDC_OPTIMISM_GOERLI = new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM_GOERLI, '0xe05606174bac4A6364B31bd0eCA4bf4dD368f8C6', 6, 'USDC', 'USD//C');
exports.USDC_ARBITRUM = new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_ONE, '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', 6, 'USDC', 'USD//C');
exports.USDC_ARBITRUM_GOERLI = new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_GOERLI, '0x8FB1E3fC51F3b789dED7557E680551d93Ea9d892', 6, 'USDC', 'USD//C');
exports.USDC_POLYGON = new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON, '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359', 6, 'USDC', 'USD Coin');
exports.USDC_POLYGON_MUMBAI = new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON_MUMBAI, '0x0fa8781a83e46826621b3bc094ea2a0212e71b23', 6, 'USDC', 'USD Coin');
exports.USDC_CELO = new sdk_core_1.Token(sdk_core_1.ChainId.CELO, '0xceba9300f2b948710d2653dd7b07f33a8b32118c', 6, 'USDC', 'USD Coin');
exports.USDC_BASE = new sdk_core_1.Token(sdk_core_1.ChainId.BASE, '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', 6, 'USDC', 'USD Coin');
exports.DAI = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin');
exports.DAI_ARBITRUM_ONE = new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_ONE, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', 18, 'DAI', 'Dai stable coin');
exports.DAI_OPTIMISM = new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM, '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', 18, 'DAI', 'Dai stable coin');
exports.MATIC_MAINNET = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', 18, 'MATIC', 'Polygon Matic');
exports.MATIC_POLYGON = new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON, '0x0000000000000000000000000000000000001010', 18, 'MATIC', 'Matic');
exports.DAI_POLYGON = new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin');
exports.USDT_POLYGON = new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON, '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', 6, 'USDT', 'Tether USD');
exports.WBTC_POLYGON = new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON, '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6', 8, 'WBTC', 'Wrapped BTC');
exports.USDT = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD');
exports.USDT_ARBITRUM_ONE = new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_ONE, '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', 6, 'USDT', 'Tether USD');
exports.USDT_OPTIMISM = new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM, '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', 6, 'USDT', 'Tether USD');
exports.WBTC = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC');
exports.WBTC_ARBITRUM_ONE = new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_ONE, '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', 8, 'WBTC', 'Wrapped BTC');
exports.WBTC_OPTIMISM = new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM, '0x68f180fcCe6836688e9084f035309E29Bf0A2095', 8, 'WBTC', 'Wrapped BTC');
exports.WETH_POLYGON_MUMBAI = new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON_MUMBAI, '0xa6fa4fb5f76172d178d61b04b0ecd319c5d1c0aa', 18, 'WETH', 'Wrapped Ether');
exports.WETH_POLYGON = new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON, '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619', 18, 'WETH', 'Wrapped Ether');
const CELO_CELO = new sdk_core_1.Token(sdk_core_1.ChainId.CELO, '0x471EcE3750Da237f93B8E339c536989b8978a438', 18, 'CELO', 'Celo');
exports.CUSD_CELO = new sdk_core_1.Token(sdk_core_1.ChainId.CELO, '0x765DE816845861e75A25fCA122bb6898B8B1282a', 18, 'cUSD', 'Celo Dollar');
exports.CEUR_CELO = new sdk_core_1.Token(sdk_core_1.ChainId.CELO, '0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73', 18, 'cEUR', 'Celo Euro Stablecoin');
exports.PORTAL_ETH_CELO = new sdk_core_1.Token(sdk_core_1.ChainId.CELO, '0x66803FB87aBd4aaC3cbB3fAd7C3aa01f6F3FB207', 18, 'ETH', 'Portal Ether');
exports.WBTC_CELO = new sdk_core_1.Token(sdk_core_1.ChainId.CELO, '0xd71Ffd0940c920786eC4DbB5A12306669b5b81EF', 18, 'WBTC', 'Wrapped BTC');
const CELO_CELO_ALFAJORES = new sdk_core_1.Token(sdk_core_1.ChainId.CELO_ALFAJORES, '0xF194afDf50B03e69Bd7D057c1Aa9e10c9954E4C9', 18, 'CELO', 'Celo');
exports.CUSD_CELO_ALFAJORES = new sdk_core_1.Token(sdk_core_1.ChainId.CELO_ALFAJORES, '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1', 18, 'CUSD', 'Celo Dollar');
exports.CEUR_CELO_ALFAJORES = new sdk_core_1.Token(sdk_core_1.ChainId.CELO_ALFAJORES, '0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F', 18, 'CEUR', 'Celo Euro Stablecoin');
exports.USDC_BSC = new sdk_core_1.Token(sdk_core_1.ChainId.BNB, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USDC');
exports.USDT_BSC = new sdk_core_1.Token(sdk_core_1.ChainId.BNB, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'USDT');
exports.ETH_BSC = new sdk_core_1.Token(sdk_core_1.ChainId.BNB, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'ETH', 'Ethereum');
exports.BTC_BSC = new sdk_core_1.Token(sdk_core_1.ChainId.BNB, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'BTCB');
exports.BUSD_BSC = new sdk_core_1.Token(sdk_core_1.ChainId.BNB, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'BUSD');
exports.DAI_BSC = new sdk_core_1.Token(sdk_core_1.ChainId.BNB, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'DAI');
exports.USDB_BLAST = new sdk_core_1.Token(sdk_core_1.ChainId.BLAST, '0x4300000000000000000000000000000000000003', 18, 'USDB', 'USDB');
exports.USDC_AVALANCHE = new sdk_core_1.Token(sdk_core_1.ChainId.AVALANCHE, '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', 6, 'USDC', 'USDC Token');
exports.USDT_AVALANCHE = new sdk_core_1.Token(sdk_core_1.ChainId.AVALANCHE, '0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', 6, 'USDT', 'Tether USD');
exports.WETH_AVALANCHE = new sdk_core_1.Token(sdk_core_1.ChainId.AVALANCHE, '0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB', 18, 'WETH', 'Wrapped Ether');
exports.DAI_AVALANCHE = new sdk_core_1.Token(sdk_core_1.ChainId.AVALANCHE, '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70', 18, 'DAI.e', 'Dai.e Token');
exports.UNI = {
    [sdk_core_1.ChainId.MAINNET]: new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, sdk_core_1.UNI_ADDRESSES[sdk_core_1.ChainId.MAINNET], 18, 'UNI', 'Uniswap'),
    [sdk_core_1.ChainId.GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.GOERLI, sdk_core_1.UNI_ADDRESSES[sdk_core_1.ChainId.GOERLI], 18, 'UNI', 'Uniswap'),
    [sdk_core_1.ChainId.SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.SEPOLIA, sdk_core_1.UNI_ADDRESSES[sdk_core_1.ChainId.SEPOLIA], 18, 'UNI', 'Uniswap'),
};
exports.ARB = new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_ONE, '0x912CE59144191C1204E64559FE8253a0e49E6548', 18, 'ARB', 'Arbitrum');
exports.OP = new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM, '0x4200000000000000000000000000000000000042', 18, 'OP', 'Optimism');
exports.LDO = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32', 18, 'LDO', 'Lido DAO Token');
exports.NMR = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0x1776e1F26f98b1A5dF9cD347953a26dd3Cb46671', 18, 'NMR', 'Numeraire');
exports.MNW = new sdk_core_1.Token(sdk_core_1.ChainId.MAINNET, '0xd3E4Ba569045546D09CF021ECC5dFe42b1d7f6E4', 18, 'MNW', 'Morpheus.Network');
exports.WRAPPED_NATIVE_CURRENCY = {
    ...sdk_core_1.WETH9,
    [sdk_core_1.ChainId.OPTIMISM]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.OPTIMISM_GOERLI, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.BASE]: new sdk_core_1.Token(sdk_core_1.ChainId.BASE, '0x4200000000000000000000000000000000000006', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_ONE]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_ONE, '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: new sdk_core_1.Token(sdk_core_1.ChainId.ARBITRUM_GOERLI, '0xe39Ab88f8A4777030A534146A9Ca3B52bd5D43A3', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.SEPOLIA]: new sdk_core_1.Token(sdk_core_1.ChainId.SEPOLIA, '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14', 18, 'WETH', 'Wrapped Ether'),
    [sdk_core_1.ChainId.POLYGON]: new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON, '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270', 18, 'WMATIC', 'Wrapped MATIC'),
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: new sdk_core_1.Token(sdk_core_1.ChainId.POLYGON_MUMBAI, '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889', 18, 'WMATIC', 'Wrapped MATIC'),
    [sdk_core_1.ChainId.CELO]: new sdk_core_1.Token(sdk_core_1.ChainId.CELO, '0x471ece3750da237f93b8e339c536989b8978a438', 18, 'CELO', 'Celo native asset'),
    [sdk_core_1.ChainId.CELO_ALFAJORES]: new sdk_core_1.Token(sdk_core_1.ChainId.CELO_ALFAJORES, '0xf194afdf50b03e69bd7d057c1aa9e10c9954e4c9', 18, 'CELO', 'Celo native asset'),
    [sdk_core_1.ChainId.BNB]: new sdk_core_1.Token(sdk_core_1.ChainId.BNB, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'Wrapped BNB'),
    [sdk_core_1.ChainId.AVALANCHE]: new sdk_core_1.Token(sdk_core_1.ChainId.AVALANCHE, '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7', 18, 'WAVAX', 'Wrapped AVAX'),
    [sdk_core_1.ChainId.BLAST]: new sdk_core_1.Token(sdk_core_1.ChainId.BLAST, '0x4300000000000000000000000000000000000004', 18, 'WETH', 'Wrapped Ether'),
};
function isCelo(chainId) {
    return chainId === sdk_core_1.ChainId.CELO_ALFAJORES || chainId === sdk_core_1.ChainId.CELO;
}
function getCeloNativeCurrency(chainId) {
    switch (chainId) {
        case sdk_core_1.ChainId.CELO_ALFAJORES:
            return CELO_CELO_ALFAJORES;
        case sdk_core_1.ChainId.CELO:
            return CELO_CELO;
        default:
            throw new Error('Not celo');
    }
}
function isPolygon(chainId) {
    return chainId === sdk_core_1.ChainId.POLYGON_MUMBAI || chainId === sdk_core_1.ChainId.POLYGON;
}
class PolygonNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isPolygon(this.chainId))
            throw new Error('Not Polygon');
        const wrapped = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        (0, tiny_invariant_1.default)(wrapped instanceof sdk_core_1.Token);
        return wrapped;
    }
    constructor(chainId) {
        if (!isPolygon(chainId))
            throw new Error('Not Polygon');
        super(chainId, 18, 'MATIC', 'Matic');
    }
}
function isBsc(chainId) {
    return chainId === sdk_core_1.ChainId.BNB;
}
class BscNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isBsc(this.chainId))
            throw new Error('Not bnb');
        const wrapped = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        (0, tiny_invariant_1.default)(wrapped instanceof sdk_core_1.Token);
        return wrapped;
    }
    constructor(chainId) {
        if (!isBsc(chainId))
            throw new Error('Not bnb');
        super(chainId, 18, 'BNB', 'BNB');
    }
}
function isAvalanche(chainId) {
    return chainId === sdk_core_1.ChainId.AVALANCHE;
}
class AvaxNativeCurrency extends sdk_core_1.NativeCurrency {
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
    get wrapped() {
        if (!isAvalanche(this.chainId))
            throw new Error('Not avalanche');
        const wrapped = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        (0, tiny_invariant_1.default)(wrapped instanceof sdk_core_1.Token);
        return wrapped;
    }
    constructor(chainId) {
        if (!isAvalanche(chainId))
            throw new Error('Not avalanche');
        super(chainId, 18, 'AVAX', 'AVAX');
    }
}
class ExtendedEther extends sdk_core_1.NativeCurrency {
    get wrapped() {
        const wrapped = exports.WRAPPED_NATIVE_CURRENCY[this.chainId];
        if (wrapped)
            return wrapped;
        throw new Error(`Unsupported chain ID: ${this.chainId}`);
    }
    constructor(chainId) {
        super(chainId, 18, 'ETH', 'Ethereum');
    }
    static onChain(chainId) {
        return this._cachedExtendedEther[chainId] ?? (this._cachedExtendedEther[chainId] = new ExtendedEther(chainId));
    }
    equals(other) {
        return other.isNative && other.chainId === this.chainId;
    }
}
ExtendedEther._cachedExtendedEther = {};
const cachedNativeCurrency = {};
function nativeOnChain(chainId) {
    if (cachedNativeCurrency[chainId])
        return cachedNativeCurrency[chainId];
    let nativeCurrency;
    if (isPolygon(chainId)) {
        nativeCurrency = new PolygonNativeCurrency(chainId);
    }
    else if (isCelo(chainId)) {
        nativeCurrency = getCeloNativeCurrency(chainId);
    }
    else if (isBsc(chainId)) {
        nativeCurrency = new BscNativeCurrency(chainId);
    }
    else if (isAvalanche(chainId)) {
        nativeCurrency = new AvaxNativeCurrency(chainId);
    }
    else {
        nativeCurrency = ExtendedEther.onChain(chainId);
    }
    return (cachedNativeCurrency[chainId] = nativeCurrency);
}
exports.TOKEN_SHORTHANDS = {
    USDC: {
        [sdk_core_1.ChainId.MAINNET]: exports.USDC_MAINNET.address,
        [sdk_core_1.ChainId.ARBITRUM_ONE]: exports.USDC_ARBITRUM.address,
        [sdk_core_1.ChainId.ARBITRUM_GOERLI]: exports.USDC_ARBITRUM_GOERLI.address,
        [sdk_core_1.ChainId.OPTIMISM]: exports.USDC_OPTIMISM.address,
        [sdk_core_1.ChainId.OPTIMISM_GOERLI]: exports.USDC_OPTIMISM_GOERLI.address,
        [sdk_core_1.ChainId.POLYGON]: exports.USDC_POLYGON.address,
        [sdk_core_1.ChainId.POLYGON_MUMBAI]: exports.USDC_POLYGON_MUMBAI.address,
        [sdk_core_1.ChainId.BNB]: exports.USDC_BSC.address,
        [sdk_core_1.ChainId.BASE]: exports.USDC_BASE.address,
        [sdk_core_1.ChainId.CELO]: exports.USDC_CELO.address,
        [sdk_core_1.ChainId.CELO_ALFAJORES]: exports.USDC_CELO.address,
        [sdk_core_1.ChainId.GOERLI]: exports.USDC_GOERLI.address,
        [sdk_core_1.ChainId.SEPOLIA]: exports.USDC_SEPOLIA.address,
        [sdk_core_1.ChainId.AVALANCHE]: exports.USDC_AVALANCHE.address,
    },
};
const STABLECOINS = {
    [sdk_core_1.ChainId.MAINNET]: [exports.USDC_MAINNET, exports.DAI, exports.USDT],
    [sdk_core_1.ChainId.ARBITRUM_ONE]: [exports.USDC_ARBITRUM, exports.DAI_ARBITRUM_ONE],
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: [exports.USDC_ARBITRUM_GOERLI],
    [sdk_core_1.ChainId.OPTIMISM]: [exports.USDC_OPTIMISM, exports.DAI_OPTIMISM],
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: [exports.USDC_OPTIMISM_GOERLI],
    [sdk_core_1.ChainId.POLYGON]: [exports.USDC_POLYGON, exports.DAI_POLYGON],
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: [exports.USDC_POLYGON_MUMBAI],
    [sdk_core_1.ChainId.BNB]: [exports.USDC_BSC],
    [sdk_core_1.ChainId.BASE]: [exports.USDC_BASE],
    [sdk_core_1.ChainId.CELO]: [exports.USDC_CELO],
    [sdk_core_1.ChainId.CELO_ALFAJORES]: [exports.USDC_CELO],
    [sdk_core_1.ChainId.GOERLI]: [exports.USDC_GOERLI],
    [sdk_core_1.ChainId.SEPOLIA]: [exports.USDC_SEPOLIA],
    [sdk_core_1.ChainId.AVALANCHE]: [exports.USDC_AVALANCHE],
    [sdk_core_1.ChainId.GNOSIS]: [],
    [sdk_core_1.ChainId.MOONBEAM]: [],
    [sdk_core_1.ChainId.BASE_GOERLI]: [],
    [sdk_core_1.ChainId.OPTIMISM_SEPOLIA]: [exports.USDC_SEPOLIA],
    [sdk_core_1.ChainId.ARBITRUM_SEPOLIA]: [],
    [sdk_core_1.ChainId.ZORA_SEPOLIA]: [],
    [sdk_core_1.ChainId.ZORA]: [],
    [sdk_core_1.ChainId.ROOTSTOCK]: [],
    [sdk_core_1.ChainId.BLAST]: [exports.USDB_BLAST],
};
function isStablecoin(currency) {
    if (!currency)
        return false;
    return STABLECOINS[currency.chainId].some((stablecoin) => stablecoin.equals(currency));
}
exports.UNKNOWN_TOKEN_SYMBOL = 'UNKNOWN';
exports.UNKNOWN_TOKEN_NAME = 'Unknown Token';
