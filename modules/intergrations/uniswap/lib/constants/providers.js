"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPC_PROVIDERS = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const AppJsonRpcProvider_1 = __importDefault(require("../rpc/AppJsonRpcProvider"));
const ConfiguredJsonRpcProvider_1 = __importDefault(require("../rpc/ConfiguredJsonRpcProvider"));
const chains_1 = require("./chains");
const networks_1 = require("./networks");
function getAppProvider(chainId) {
    return new AppJsonRpcProvider_1.default(networks_1.APP_RPC_URLS[chainId].map((url) => new ConfiguredJsonRpcProvider_1.default(url, { chainId, name: chains_1.CHAIN_IDS_TO_NAMES[chainId] })));
}
/** These are the only JsonRpcProviders used directly by the interface. */
exports.RPC_PROVIDERS = {
    [sdk_core_1.ChainId.MAINNET]: getAppProvider(sdk_core_1.ChainId.MAINNET),
    [sdk_core_1.ChainId.GOERLI]: getAppProvider(sdk_core_1.ChainId.GOERLI),
    [sdk_core_1.ChainId.SEPOLIA]: getAppProvider(sdk_core_1.ChainId.SEPOLIA),
    [sdk_core_1.ChainId.OPTIMISM]: getAppProvider(sdk_core_1.ChainId.OPTIMISM),
    [sdk_core_1.ChainId.OPTIMISM_GOERLI]: getAppProvider(sdk_core_1.ChainId.OPTIMISM_GOERLI),
    [sdk_core_1.ChainId.ARBITRUM_ONE]: getAppProvider(sdk_core_1.ChainId.ARBITRUM_ONE),
    [sdk_core_1.ChainId.ARBITRUM_GOERLI]: getAppProvider(sdk_core_1.ChainId.ARBITRUM_GOERLI),
    [sdk_core_1.ChainId.POLYGON]: getAppProvider(sdk_core_1.ChainId.POLYGON),
    [sdk_core_1.ChainId.POLYGON_MUMBAI]: getAppProvider(sdk_core_1.ChainId.POLYGON_MUMBAI),
    [sdk_core_1.ChainId.CELO]: getAppProvider(sdk_core_1.ChainId.CELO),
    [sdk_core_1.ChainId.CELO_ALFAJORES]: getAppProvider(sdk_core_1.ChainId.CELO_ALFAJORES),
    [sdk_core_1.ChainId.BNB]: getAppProvider(sdk_core_1.ChainId.BNB),
    [sdk_core_1.ChainId.AVALANCHE]: getAppProvider(sdk_core_1.ChainId.AVALANCHE),
    [sdk_core_1.ChainId.BASE]: getAppProvider(sdk_core_1.ChainId.BASE),
    [sdk_core_1.ChainId.BLAST]: getAppProvider(sdk_core_1.ChainId.BLAST),
};
