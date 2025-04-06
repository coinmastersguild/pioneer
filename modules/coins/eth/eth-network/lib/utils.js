"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.erc20ABI = exports.filterSelfTxs = exports.getPrefix = exports.getDefaultGasPrices = exports.getDefaultFees = exports.estimateDefaultFeesWithGasPricesAndLimits = exports.getFee = exports.getTxFromEthTransaction = exports.getTxFromTokenTransaction = exports.validateSymbol = exports.getTokenAddress = exports.validateAddress = exports.ethNetworkToXchains = exports.xchainNetworkToEths = exports.MAX_APPROVAL = exports.ETHAddress = exports.DEFAULT_GAS_PRICE = exports.BASE_TOKEN_GAS_COST = exports.SIMPLE_GAS_COST = exports.ETHPLORER_FREEKEY = exports.ETH_DECIMAL = void 0;
const xchain_util_1 = require("@xchainjs/xchain-util");
const types_1 = require("./types");
const bignumber_1 = require("@ethersproject/bignumber");
const ethers_1 = require("ethers");
const utils_1 = require("ethers/lib/utils");
exports.ETH_DECIMAL = 18;
exports.ETHPLORER_FREEKEY = 'freekey';
// from https://github.com/MetaMask/metamask-extension/blob/ee205b893fe61dc4736efc576e0663189a9d23da/ui/app/pages/send/send.constants.js#L39
// and based on recommendations of https://ethgasstation.info/blog/gas-limit/
exports.SIMPLE_GAS_COST = bignumber_1.BigNumber.from(21000);
exports.BASE_TOKEN_GAS_COST = bignumber_1.BigNumber.from(100000);
// default gas price in gwei
exports.DEFAULT_GAS_PRICE = 50;
exports.ETHAddress = '0x0000000000000000000000000000000000000000';
exports.MAX_APPROVAL = bignumber_1.BigNumber.from(2).pow(256).sub(1);
/**
 * XChainNetwork -> EthNetwork
 *
 * @param {XChainNetwork} network
 * @returns {EthNetwork}
 */
const xchainNetworkToEths = (network) => {
    switch (network) {
        // DO NOT use switch/case's default branch
        // to be sure that ALL possible cases are
        // processed in a similar way to reverted ethNetworkToXchains
        case 'mainnet':
            return types_1.Network.MAIN;
        case 'testnet':
            return types_1.Network.TEST;
        default:
            return types_1.Network.MAIN;
    }
};
exports.xchainNetworkToEths = xchainNetworkToEths;
/**
 * EthNetwork -> XChainNetwork
 *
 * @param {EthNetwork} network
 * @returns {XChainNetwork}
 */
const ethNetworkToXchains = (network) => {
    switch (network) {
        // DO NOT use switch/case's default branch
        // to be sure that ALL possible cases are
        // processed in a similar way to reverted xchainNetworkToEths
        case types_1.Network.MAIN:
            return 'mainnet';
        case types_1.Network.TEST:
            return 'testnet';
    }
};
exports.ethNetworkToXchains = ethNetworkToXchains;
/**
 * Validate the given address.
 *
 * @param {Address} address
 * @returns {boolean} `true` or `false`
 */
const validateAddress = (address) => {
    try {
        ethers_1.ethers.utils.getAddress(address);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.validateAddress = validateAddress;
/**
 * Get token address from asset.
 *
 * @param {Asset} asset
 * @returns {string|null} The token address.
 */
const getTokenAddress = (asset) => {
    try {
        // strip 0X only - 0x is still valid
        return ethers_1.ethers.utils.getAddress(asset.symbol.slice(asset.ticker.length + 1).replace(/^0X/, ''));
    }
    catch (err) {
        return null;
    }
};
exports.getTokenAddress = getTokenAddress;
/**
 * Check if the symbol is valid.
 *
 * @param {string|null|undefined} symbol
 * @returns {boolean} `true` or `false`.
 */
const validateSymbol = (symbol) => (symbol ? symbol.length >= 3 : false);
exports.validateSymbol = validateSymbol;
/**
 * Get transactions from token tx
 *
 * @param {TokenTransactionInfo} tx
 * @returns {Tx|null} The parsed transaction.
 */
const getTxFromTokenTransaction = (tx) => {
    const decimals = parseInt(tx.tokenDecimal) || exports.ETH_DECIMAL;
    const symbol = tx.tokenSymbol;
    const address = tx.contractAddress;
    if ((0, exports.validateSymbol)(symbol) && (0, exports.validateAddress)(address)) {
        const tokenAsset = (0, xchain_util_1.assetFromString)(`${xchain_util_1.ETHChain}.${symbol}-${address}`);
        if (tokenAsset) {
            return {
                asset: tokenAsset,
                from: [
                    {
                        from: tx.from,
                        amount: (0, xchain_util_1.baseAmount)(tx.value, decimals),
                    },
                ],
                to: [
                    {
                        to: tx.to,
                        amount: (0, xchain_util_1.baseAmount)(tx.value, decimals),
                    },
                ],
                date: new Date(parseInt(tx.timeStamp) * 1000),
                type: 'transfer',
                hash: tx.hash,
            };
        }
    }
    return null;
};
exports.getTxFromTokenTransaction = getTxFromTokenTransaction;
/**
 * Get transactions from ETH transaction
 *
 * @param {ETHTransactionInfo} tx
 * @returns {Tx} The parsed transaction.
 */
const getTxFromEthTransaction = (tx) => {
    return {
        asset: xchain_util_1.AssetETH,
        from: [
            {
                from: tx.from,
                amount: (0, xchain_util_1.baseAmount)(tx.value, exports.ETH_DECIMAL),
            },
        ],
        to: [
            {
                to: tx.to,
                amount: (0, xchain_util_1.baseAmount)(tx.value, exports.ETH_DECIMAL),
            },
        ],
        date: new Date(parseInt(tx.timeStamp) * 1000),
        type: 'transfer',
        hash: tx.hash,
    };
};
exports.getTxFromEthTransaction = getTxFromEthTransaction;
/**
 * Calculate fees by multiplying .
 *
 * @returns {Fees} The default gas price.
 */
const getFee = ({ gasPrice, gasLimit }) => (0, xchain_util_1.baseAmount)(gasPrice.amount().multipliedBy(gasLimit.toString()), exports.ETH_DECIMAL);
exports.getFee = getFee;
const estimateDefaultFeesWithGasPricesAndLimits = (asset) => {
    const gasPrices = {
        average: (0, xchain_util_1.baseAmount)((0, utils_1.parseUnits)(exports.DEFAULT_GAS_PRICE.toString(), 'gwei').toString(), exports.ETH_DECIMAL),
        fast: (0, xchain_util_1.baseAmount)((0, utils_1.parseUnits)((exports.DEFAULT_GAS_PRICE * 2).toString(), 'gwei').toString(), exports.ETH_DECIMAL),
        fastest: (0, xchain_util_1.baseAmount)((0, utils_1.parseUnits)((exports.DEFAULT_GAS_PRICE * 3).toString(), 'gwei').toString(), exports.ETH_DECIMAL),
    };
    const { fast: fastGP, fastest: fastestGP, average: averageGP } = gasPrices;
    let assetAddress;
    if (asset && (0, xchain_util_1.assetToString)(asset) !== (0, xchain_util_1.assetToString)(xchain_util_1.AssetETH)) {
        assetAddress = (0, exports.getTokenAddress)(asset);
    }
    let gasLimit;
    if (assetAddress && assetAddress !== exports.ETHAddress) {
        gasLimit = bignumber_1.BigNumber.from(exports.BASE_TOKEN_GAS_COST);
    }
    else {
        gasLimit = bignumber_1.BigNumber.from(exports.SIMPLE_GAS_COST);
    }
    return {
        gasPrices,
        gasLimit,
        fees: {
            type: 'byte',
            average: (0, exports.getFee)({ gasPrice: averageGP, gasLimit }),
            fast: (0, exports.getFee)({ gasPrice: fastGP, gasLimit }),
            fastest: (0, exports.getFee)({ gasPrice: fastestGP, gasLimit }),
        },
    };
};
exports.estimateDefaultFeesWithGasPricesAndLimits = estimateDefaultFeesWithGasPricesAndLimits;
/**
 * Get the default fees.
 *
 * @returns {Fees} The default gas price.
 */
const getDefaultFees = (asset) => {
    const { fees } = (0, exports.estimateDefaultFeesWithGasPricesAndLimits)(asset);
    return fees;
};
exports.getDefaultFees = getDefaultFees;
/**
 * Get the default gas price.
 *
 * @returns {Fees} The default gas prices.
 */
const getDefaultGasPrices = (asset) => {
    const { gasPrices } = (0, exports.estimateDefaultFeesWithGasPricesAndLimits)(asset);
    return gasPrices;
};
exports.getDefaultGasPrices = getDefaultGasPrices;
/**
 * Get address prefix based on the network.
 *
 * @returns {string} The address prefix based on the network.
 *
 **/
const getPrefix = () => '0x';
exports.getPrefix = getPrefix;
/**
 * Filter self txs
 *
 * @returns {T[]}
 *
 **/
const filterSelfTxs = (txs) => {
    const filterTxs = txs.filter((tx) => tx.from !== tx.to);
    let selfTxs = txs.filter((tx) => tx.from === tx.to);
    while (selfTxs.length) {
        const selfTx = selfTxs[0];
        filterTxs.push(selfTx);
        selfTxs = selfTxs.filter((tx) => tx.hash !== selfTx.hash);
    }
    return filterTxs;
};
exports.filterSelfTxs = filterSelfTxs;
exports.erc20ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
//# sourceMappingURL=utils.js.map