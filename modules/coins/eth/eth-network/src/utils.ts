import { Fees, Network as XChainNetwork, Tx } from '@xchainjs/xchain-client'
import {
  Asset,
  AssetETH,
  assetFromString,
  baseAmount,
  ETHChain,
  BaseAmount,
  assetToString,
} from '@xchainjs/xchain-util'
import {
  Network as EthNetwork,
  Address,
  ETHTransactionInfo,
  TokenTransactionInfo,
  FeesWithGasPricesAndLimits,
  GasPrices,
} from './types'
import { BigNumber } from '@ethersproject/bignumber'
import { ethers } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'

export const ETH_DECIMAL = 18
export const ETHPLORER_FREEKEY = 'freekey'

// from https://github.com/MetaMask/metamask-extension/blob/ee205b893fe61dc4736efc576e0663189a9d23da/ui/app/pages/send/send.constants.js#L39
// and based on recommendations of https://ethgasstation.info/blog/gas-limit/
export const SIMPLE_GAS_COST = BigNumber.from(21000)
export const BASE_TOKEN_GAS_COST = BigNumber.from(100000)

// default gas price in gwei
export const DEFAULT_GAS_PRICE = 50

export const ETHAddress = '0x0000000000000000000000000000000000000000'
export const MAX_APPROVAL = BigNumber.from(2).pow(256).sub(1)

/**
 * XChainNetwork -> EthNetwork
 *
 * @param {XChainNetwork} network
 * @returns {EthNetwork}
 */
export const xchainNetworkToEths = (network: XChainNetwork): EthNetwork => {
  switch (network) {
    // DO NOT use switch/case's default branch
    // to be sure that ALL possible cases are
    // processed in a similar way to reverted ethNetworkToXchains
    case 'mainnet':
      return EthNetwork.MAIN
    case 'testnet':
      return EthNetwork.TEST
    default:
      return EthNetwork.MAIN
  }
}

/**
 * EthNetwork -> XChainNetwork
 *
 * @param {EthNetwork} network
 * @returns {XChainNetwork}
 */
export const ethNetworkToXchains = (network: EthNetwork): XChainNetwork => {
  switch (network) {
    // DO NOT use switch/case's default branch
    // to be sure that ALL possible cases are
    // processed in a similar way to reverted xchainNetworkToEths
    case EthNetwork.MAIN:
      return 'mainnet'
    case EthNetwork.TEST:
      return 'testnet'
  }
}

/**
 * Validate the given address.
 *
 * @param {Address} address
 * @returns {boolean} `true` or `false`
 */
export const validateAddress = (address: Address): boolean => {
  try {
    ethers.utils.getAddress(address)
    return true
  } catch (error) {
    return false
  }
}

/**
 * Get token address from asset.
 *
 * @param {Asset} asset
 * @returns {string|null} The token address.
 */
export const getTokenAddress = (asset: Asset): string | null => {
  try {
    // strip 0X only - 0x is still valid
    return ethers.utils.getAddress(asset.symbol.slice(asset.ticker.length + 1).replace(/^0X/, ''))
  } catch (err) {
    return null
  }
}

/**
 * Check if the symbol is valid.
 *
 * @param {string|null|undefined} symbol
 * @returns {boolean} `true` or `false`.
 */
export const validateSymbol = (symbol?: string | null): boolean => (symbol ? symbol.length >= 3 : false)

/**
 * Get transactions from token tx
 *
 * @param {TokenTransactionInfo} tx
 * @returns {Tx|null} The parsed transaction.
 */
export const getTxFromTokenTransaction = (tx: TokenTransactionInfo): Tx | null => {
  const decimals = parseInt(tx.tokenDecimal) || ETH_DECIMAL
  const symbol = tx.tokenSymbol
  const address = tx.contractAddress
  if (validateSymbol(symbol) && validateAddress(address)) {
    const tokenAsset = assetFromString(`${ETHChain}.${symbol}-${address}`)
    if (tokenAsset) {
      return {
        asset: tokenAsset,
        from: [
          {
            from: tx.from,
            amount: baseAmount(tx.value, decimals),
          },
        ],
        to: [
          {
            to: tx.to,
            amount: baseAmount(tx.value, decimals),
          },
        ],
        date: new Date(parseInt(tx.timeStamp) * 1000),
        type: 'transfer',
        hash: tx.hash,
      }
    }
  }

  return null
}

/**
 * Get transactions from ETH transaction
 *
 * @param {ETHTransactionInfo} tx
 * @returns {Tx} The parsed transaction.
 */
export const getTxFromEthTransaction = (tx: ETHTransactionInfo): Tx => {
  return {
    asset: AssetETH,
    from: [
      {
        from: tx.from,
        amount: baseAmount(tx.value, ETH_DECIMAL),
      },
    ],
    to: [
      {
        to: tx.to,
        amount: baseAmount(tx.value, ETH_DECIMAL),
      },
    ],
    date: new Date(parseInt(tx.timeStamp) * 1000),
    type: 'transfer',
    hash: tx.hash,
  }
}


/**
 * Calculate fees by multiplying .
 *
 * @returns {Fees} The default gas price.
 */
export const getFee: ({gasPrice, gasLimit}: { gasPrice: BaseAmount; gasLimit: BigNumber }) => BaseAmount = ({ gasPrice, gasLimit }: { gasPrice: BaseAmount; gasLimit: BigNumber }) =>
  baseAmount(gasPrice.amount().multipliedBy(gasLimit.toString()), ETH_DECIMAL)

export const estimateDefaultFeesWithGasPricesAndLimits = (asset?: Asset): FeesWithGasPricesAndLimits => {
  const gasPrices = {
    average: baseAmount(parseUnits(DEFAULT_GAS_PRICE.toString(), 'gwei').toString(), ETH_DECIMAL),
    fast: baseAmount(parseUnits((DEFAULT_GAS_PRICE * 2).toString(), 'gwei').toString(), ETH_DECIMAL),
    fastest: baseAmount(parseUnits((DEFAULT_GAS_PRICE * 3).toString(), 'gwei').toString(), ETH_DECIMAL),
  }
  const { fast: fastGP, fastest: fastestGP, average: averageGP } = gasPrices

  let assetAddress
  if (asset && assetToString(asset) !== assetToString(AssetETH)) {
    assetAddress = getTokenAddress(asset)
  }

  let gasLimit
  if (assetAddress && assetAddress !== ETHAddress) {
    gasLimit = BigNumber.from(BASE_TOKEN_GAS_COST)
  } else {
    gasLimit = BigNumber.from(SIMPLE_GAS_COST)
  }

  return {
    gasPrices,
    gasLimit,
    fees: {
      type: 'byte',
      average: getFee({ gasPrice: averageGP, gasLimit }),
      fast: getFee({ gasPrice: fastGP, gasLimit }),
      fastest: getFee({ gasPrice: fastestGP, gasLimit }),
    },
  }
}

/**
 * Get the default fees.
 *
 * @returns {Fees} The default gas price.
 */
export const getDefaultFees = (asset?: Asset): Fees => {
  const { fees } = estimateDefaultFeesWithGasPricesAndLimits(asset)
  return fees
}

/**
 * Get the default gas price.
 *
 * @returns {Fees} The default gas prices.
 */
export const getDefaultGasPrices = (asset?: Asset): GasPrices => {
  const { gasPrices } = estimateDefaultFeesWithGasPricesAndLimits(asset)
  return gasPrices
}

/**
 * Get address prefix based on the network.
 *
 * @returns {string} The address prefix based on the network.
 *
 **/
export const getPrefix = () => '0x'

/**
 * Filter self txs
 *
 * @returns {T[]}
 *
 **/
export const filterSelfTxs = <T extends { from: string; to: string; hash: string }>(txs: T[]): T[] => {
  const filterTxs = txs.filter((tx) => tx.from !== tx.to)
  let selfTxs = txs.filter((tx) => tx.from === tx.to)
  while (selfTxs.length) {
    const selfTx = selfTxs[0]
    filterTxs.push(selfTx)
    selfTxs = selfTxs.filter((tx) => tx.hash !== selfTx.hash)
  }

  return filterTxs
}

export const erc20ABI = [
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
]
