import { ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { BaseAmount } from '@xchainjs/xchain-util'
import * as C from '@xchainjs/xchain-client'

export type Address = string

export enum Network {
  TEST = 'ropsten',
  MAIN = 'homestead',
}

export type ClientUrl = {
  testnet: string
  mainnet: string
}

export type ExplorerUrl = {
  testnet: string
  mainnet: string
}

export type TxOverrides = {
  nonce?: ethers.BigNumberish

  // mandatory: https://github.com/ethers-io/ethers.js/issues/469#issuecomment-475926538
  gasLimit: ethers.BigNumberish
  gasPrice?: ethers.BigNumberish
  data?: ethers.BytesLike
  value?: ethers.BigNumberish
}

export type InfuraCreds = {
  projectId: string
  projectSecret?: string
}

export type GasPrices = Record<'average' | 'fast' | 'fastest', BaseAmount>

export type FeesParams = {
  sender?: Address
  recipient?: Address
  amount?: BaseAmount
  asset?: string
  memo?: string
}

export type FeesWithGasPricesAndLimits = { fees: C.Fees; gasPrices: GasPrices; gasLimit: BigNumber }
