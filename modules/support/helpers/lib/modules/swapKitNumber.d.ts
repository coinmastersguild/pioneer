import { BigIntArithmetics } from './bigIntArithmetics';
export type SwapKitValueType = BigIntArithmetics | string | number;
export declare class SwapKitNumber extends BigIntArithmetics {
    eq(value: SwapKitValueType): boolean;
    static fromBigInt(value: bigint, decimal?: number): SwapKitNumber;
}
