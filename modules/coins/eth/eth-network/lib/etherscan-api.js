"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTokenTransactionHistory = exports.getETHTransactionHistory = exports.getTokenBalance = exports.getGasOracle = void 0;
const axios_1 = __importDefault(require("axios"));
const utils_1 = require("./utils");
const lib_1 = require("@xchainjs/xchain-util/lib");
const getApiKeyQueryParameter = (apiKey) => (!!apiKey ? `&apiKey=${apiKey}` : '');
/**
 * SafeGasPrice, ProposeGasPrice And FastGasPrice returned in string-Gwei
 *
 * @see https://etherscan.io/apis#gastracker
 *
 * @param {string} baseUrl The etherscan node url.
 * @param {string} apiKey The etherscan API key. (optional)
 * @returns {GasOracleResponse} LastBlock, SafeGasPrice, ProposeGasPrice, FastGasPrice
 */
const getGasOracle = (baseUrl, apiKey) => {
    const url = baseUrl + '/api?module=gastracker&action=gasoracle';
    return axios_1.default.get(url + getApiKeyQueryParameter(apiKey)).then((response) => response.data.result);
};
exports.getGasOracle = getGasOracle;
/**
 * Get token balance
 *
 * @see https://etherscan.io/apis#tokens
 *
 * @param {string} baseUrl The etherscan node url.
 * @param {string} address The address.
 * @param {string} assetAddress The token contract address.
 * @param {string} apiKey The etherscan API key. (optional)
 * @returns {BigNumberish} The token balance
 */
const getTokenBalance = ({ baseUrl, address, assetAddress, apiKey, }) => {
    const url = baseUrl + `/api?module=account&action=tokenbalance&contractaddress=${assetAddress}&address=${address}`;
    return axios_1.default.get(url + getApiKeyQueryParameter(apiKey)).then((response) => response.data.result);
};
exports.getTokenBalance = getTokenBalance;
/**
 * Get ETH transaction history
 *
 * @see https://etherscan.io/apis#accounts
 *
 * @param {string} baseUrl The etherscan node url.
 * @param {string} address The address.
 * @param {TransactionHistoryParam} params The search options.
 * @param {string} apiKey The etherscan API key. (optional)
 * @returns {Array<ETHTransactionInfo>} The ETH transaction history
 */
const getETHTransactionHistory = async ({ baseUrl, address, page, offset, startblock, endblock, apiKey, }) => {
    let url = baseUrl + `/api?module=account&action=txlist&sort=desc` + getApiKeyQueryParameter(apiKey);
    if (address)
        url += `&address=${address}`;
    if (offset)
        url += `&offset=${offset}`;
    if (page)
        url += `&page=${page}`;
    if (startblock)
        url += `&startblock=${startblock}`;
    if (endblock)
        url += `&endblock=${endblock}`;
    const ethTransactions = await axios_1.default.get(url).then((response) => response.data.result);
    return (0, utils_1.filterSelfTxs)(ethTransactions)
        .filter((tx) => !(0, lib_1.bn)(tx.value).isZero())
        .map(utils_1.getTxFromEthTransaction);
};
exports.getETHTransactionHistory = getETHTransactionHistory;
/**
 * Get token transaction history
 *
 * @see https://etherscan.io/apis#accounts
 *
 * @param {string} baseUrl The etherscan node url.
 * @param {string} address The address.
 * @param {TransactionHistoryParam} params The search options.
 * @param {string} apiKey The etherscan API key. (optional)
 * @returns {Array<Txs>} The token transaction history
 */
const getTokenTransactionHistory = async ({ baseUrl, address, assetAddress, page, offset, startblock, endblock, apiKey, }) => {
    let url = baseUrl + `/api?module=account&action=tokentx&sort=desc` + getApiKeyQueryParameter(apiKey);
    if (address)
        url += `&address=${address}`;
    if (assetAddress)
        url += `&contractaddress=${assetAddress}`;
    if (offset)
        url += `&offset=${offset}`;
    if (page)
        url += `&page=${page}`;
    if (startblock)
        url += `&startblock=${startblock}`;
    if (endblock)
        url += `&endblock=${endblock}`;
    const tokenTransactions = await axios_1.default.get(url).then((response) => response.data.result);
    return (0, utils_1.filterSelfTxs)(tokenTransactions)
        .filter((tx) => !(0, lib_1.bn)(tx.value).isZero())
        .reduce((acc, cur) => {
        const tx = (0, utils_1.getTxFromTokenTransaction)(cur);
        return tx ? [...acc, tx] : acc;
    }, []);
};
exports.getTokenTransactionHistory = getTokenTransactionHistory;
//# sourceMappingURL=etherscan-api.js.map