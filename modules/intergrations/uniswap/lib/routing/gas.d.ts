import { Currency } from '@uniswap/sdk-core';
import { SupportedInterfaceChain } from '../constants/chains';
import { ApproveInfo, WrapInfo } from './types';
export declare function getApproveInfo(account: string | undefined, currency: Currency, amount: string, usdCostPerGas?: number): Promise<ApproveInfo>;
export declare function getWrapInfo(needsWrap: boolean, account: string | undefined, chainId: SupportedInterfaceChain, amount: string, usdCostPerGas?: number): Promise<WrapInfo>;
