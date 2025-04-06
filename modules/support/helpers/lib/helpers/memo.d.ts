import type { Chain } from '@coinmasters/types';
import { MemoType } from '@coinmasters/types';
export type ThornameRegisterParam = {
    name: string;
    chain: string;
    address: string;
    owner?: string;
    preferredAsset?: string;
    expiryBlock?: string;
};
type WithAddress<T = {}> = T & {
    address: string;
};
type WithChain<T = {}> = T & {
    chain: Chain;
};
export type MemoOptions<T extends MemoType> = {
    [MemoType.BOND]: WithAddress;
    [MemoType.LEAVE]: WithAddress;
    [MemoType.CLOSE_LOAN]: WithAddress<{
        asset: string;
        minAmount?: string;
    }>;
    [MemoType.OPEN_LOAN]: WithAddress<{
        asset: string;
        minAmount?: string;
    }>;
    [MemoType.UNBOND]: WithAddress<{
        unbondAmount: number;
    }>;
    [MemoType.DEPOSIT]: WithChain<{
        symbol: string;
        address?: string;
        singleSide?: boolean;
    }>;
    [MemoType.WITHDRAW]: WithChain<{
        ticker: string;
        symbol: string;
        basisPoints: number;
        targetAssetString?: string;
        singleSide?: boolean;
    }>;
    [MemoType.THORNAME_REGISTER]: Omit<ThornameRegisterParam, 'preferredAsset' | 'expiryBlock'>;
}[T];
export declare const getMemoFor: <T extends MemoType>(memoType: T, options: MemoOptions<T>) => string;
export {};
