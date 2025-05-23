import { GasOracleResponse, TransactionHistoryParam, TokenBalanceParam } from './types';
import { BigNumberish } from 'ethers';
import { Txs } from '@xchainjs/xchain-client/lib';
/**
 * SafeGasPrice, ProposeGasPrice And FastGasPrice returned in string-Gwei
 *
 * @see https://etherscan.io/apis#gastracker
 *
 * @param {string} baseUrl The etherscan node url.
 * @param {string} apiKey The etherscan API key. (optional)
 * @returns {GasOracleResponse} LastBlock, SafeGasPrice, ProposeGasPrice, FastGasPrice
 */
export declare const getGasOracle: (baseUrl: string, apiKey?: string) => Promise<GasOracleResponse>;
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
export declare const getTokenBalance: ({ baseUrl, address, assetAddress, apiKey, }: TokenBalanceParam & {
    baseUrl: string;
    apiKey?: string;
}) => Promise<BigNumberish>;
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
export declare const getETHTransactionHistory: ({ baseUrl, address, page, offset, startblock, endblock, apiKey, }: TransactionHistoryParam & {
    baseUrl: string;
    apiKey?: string;
}) => Promise<Txs>;
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
export declare const getTokenTransactionHistory: ({ baseUrl, address, assetAddress, page, offset, startblock, endblock, apiKey, }: TransactionHistoryParam & {
    baseUrl: string;
    apiKey?: string;
}) => Promise<Txs>;
