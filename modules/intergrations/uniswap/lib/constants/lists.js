"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LIST_OF_LISTS = exports.DEFAULT_INACTIVE_LIST_URLS = exports.DEFAULT_ACTIVE_LIST_URLS = exports.UNSUPPORTED_LIST_URLS = exports.BASE_LIST = exports.AVALANCHE_LIST = exports.PLASMA_BNB_LIST = exports.CELO_LIST = exports.ARBITRUM_LIST = exports.OPTIMISM_LIST = exports.UNI_EXTENDED_LIST = exports.UNI_LIST = void 0;
exports.UNI_LIST = 'https://cloudflare-ipfs.com/ipns/tokens.uniswap.org';
exports.UNI_EXTENDED_LIST = 'https://cloudflare-ipfs.com/ipns/extendedtokens.uniswap.org';
const UNI_UNSUPPORTED_LIST = 'https://cloudflare-ipfs.com/ipns/unsupportedtokens.uniswap.org';
const AAVE_LIST = 'tokenlist.aave.eth';
const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json';
// TODO(WEB-2282): Re-enable CMC list once we have a better solution for handling large lists.
// const CMC_ALL_LIST = 'https://s3.coinmarketcap.com/generated/dex/tokens/eth-tokens-all.json'
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json';
const COINGECKO_BNB_LIST = 'https://tokens.coingecko.com/binance-smart-chain/all.json';
const COINGECKO_ARBITRUM_LIST = 'https://tokens.coingecko.com/arbitrum-one/all.json';
const COINGECKO_OPTIMISM_LIST = 'https://tokens.coingecko.com/optimistic-ethereum/all.json';
const COINGECKO_CELO_LIST = 'https://tokens.coingecko.com/celo/all.json';
const COINGECKO_POLYGON_LIST = 'https://tokens.coingecko.com/polygon-pos/all.json';
const COINGECKO_AVAX_LIST = 'https://tokens.coingecko.com/avalanche/all.json';
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json';
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json';
const KLEROS_LIST = 't2crtokens.eth';
const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json';
const WRAPPED_LIST = 'wrapped.tokensoft.eth';
exports.OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json';
exports.ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json';
exports.CELO_LIST = 'https://celo-org.github.io/celo-token-list/celo.tokenlist.json';
exports.PLASMA_BNB_LIST = 'https://raw.githubusercontent.com/plasmadlt/plasma-finance-token-list/master/bnb.json';
exports.AVALANCHE_LIST = 'https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/token_list.json';
exports.BASE_LIST = 'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json';
exports.UNSUPPORTED_LIST_URLS = [BA_LIST, UNI_UNSUPPORTED_LIST];
// default lists to be 'active' aka searched across
exports.DEFAULT_ACTIVE_LIST_URLS = [exports.UNI_LIST];
exports.DEFAULT_INACTIVE_LIST_URLS = [
    exports.UNI_EXTENDED_LIST,
    COMPOUND_LIST,
    AAVE_LIST,
    //  CMC_ALL_LIST,
    COINGECKO_LIST,
    COINGECKO_BNB_LIST,
    COINGECKO_ARBITRUM_LIST,
    COINGECKO_OPTIMISM_LIST,
    COINGECKO_CELO_LIST,
    COINGECKO_POLYGON_LIST,
    COINGECKO_AVAX_LIST,
    KLEROS_LIST,
    GEMINI_LIST,
    WRAPPED_LIST,
    SET_LIST,
    exports.ARBITRUM_LIST,
    exports.OPTIMISM_LIST,
    exports.CELO_LIST,
    exports.PLASMA_BNB_LIST,
    exports.AVALANCHE_LIST,
    exports.BASE_LIST,
    ...exports.UNSUPPORTED_LIST_URLS,
];
exports.DEFAULT_LIST_OF_LISTS = [...exports.DEFAULT_ACTIVE_LIST_URLS, ...exports.DEFAULT_INACTIVE_LIST_URLS];
