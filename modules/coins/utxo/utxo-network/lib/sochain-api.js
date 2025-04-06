"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSuggestedTxFee = exports.getUnspentTxs = exports.getBalance = exports.getTx = exports.getAddress = void 0;
const axios_1 = __importDefault(require("axios"));
const xchain_util_1 = require("@xchainjs/xchain-util");
const utils_1 = require("./utils");
const DEFAULT_SUGGESTED_TRANSACTION_FEE = 127;
const toSochainNetwork = (net) => {
    return net === 'testnet' ? 'BTCTEST' : 'BTC';
};
/**
 * Get address information.
 *
 * @see https://sochain.com/api#get-display-data-address
 *
 * @param {string} sochainUrl The sochain node url.
 * @param {string} network
 * @param {string} address
 * @returns {BtcAddressDTO}
 */
const getAddress = async ({ sochainUrl, network, address }) => {
    try {
        const url = `${sochainUrl}/address/${toSochainNetwork(network)}/${address}`;
        const response = await axios_1.default.get(url);
        const addressResponse = response.data;
        return addressResponse.data;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.getAddress = getAddress;
/**
 * Get transaction by hash.
 *
 * @see https://sochain.com/api#get-tx
 *
 * @param {string} sochainUrl The sochain node url.
 * @param {string} network network id
 * @param {string} hash The transaction hash.
 * @returns {Transactions}
 */
const getTx = async ({ sochainUrl, network, hash }) => {
    try {
        const url = `${sochainUrl}/get_tx/${toSochainNetwork(network)}/${hash}`;
        const response = await axios_1.default.get(url);
        const tx = response.data;
        return tx.data;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.getTx = getTx;
/**
 * Get address balance.
 *
 * @see https://sochain.com/api#get-balance
 *
 * @param {string} sochainUrl The sochain node url.
 * @param {string} network
 * @param {string} address
 * @returns {number}
 */
const getBalance = async ({ sochainUrl, network, address }) => {
    try {
        const url = `${sochainUrl}/get_address_balance/${toSochainNetwork(network)}/${address}`;
        const response = await axios_1.default.get(url);
        const balanceResponse = response.data;
        const confirmed = (0, xchain_util_1.assetAmount)(balanceResponse.data.confirmed_balance, utils_1.BTC_DECIMAL);
        const unconfirmed = (0, xchain_util_1.assetAmount)(balanceResponse.data.unconfirmed_balance, utils_1.BTC_DECIMAL);
        const netAmt = confirmed.amount().plus(unconfirmed.amount());
        const result = (0, xchain_util_1.assetToBase)((0, xchain_util_1.assetAmount)(netAmt, utils_1.BTC_DECIMAL));
        return result;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.getBalance = getBalance;
/**
 * Get unspent txs
 *
 * @see https://sochain.com/api#get-unspent-tx
 *
 * @param {string} sochainUrl The sochain node url.
 * @param {string} network
 * @param {string} address
 * @returns {BtcAddressUTXOs}
 */
const getUnspentTxs = async ({ sochainUrl, network, address }) => {
    try {
        const resp = await axios_1.default.get(`${sochainUrl}/get_tx_unspent/${toSochainNetwork(network)}/${address}`);
        const response = resp.data;
        return response.data.txs;
    }
    catch (error) {
        return Promise.reject(error);
    }
};
exports.getUnspentTxs = getUnspentTxs;
/**
 * Get Bitcoin suggested transaction fee.
 *
 * @returns {number} The Bitcoin suggested transaction fee per bytes in sat.
 */
const getSuggestedTxFee = async (coin) => {
    //Note: sochain does not provide fee rate related data
    //So use Bitgo API for fee estimation
    //Refer: https://app.bitgo.com/docs/#operation/v2.tx.getfeeestimate
    try {
        const response = await axios_1.default.get('https://app.bitgo.com/api/v2/' + coin + '/tx/fee');
        return response.data.feePerKb / 1000; // feePerKb to feePerByte
    }
    catch (error) {
        return DEFAULT_SUGGESTED_TRANSACTION_FEE;
    }
};
exports.getSuggestedTxFee = getSuggestedTxFee;
