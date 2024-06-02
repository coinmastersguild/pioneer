import { BigIntArithmetics, formatBigIntToSafeValue, toMultiplier } from './bigIntArithmetics';

export type SwapKitValueType = BigIntArithmetics | string | number;
const DEFAULT_DECIMAL = 8;
export class SwapKitNumber extends BigIntArithmetics {
  eq(value: SwapKitValueType) {
    return this.eqValue(value);
  }

  static fromBigInt(value: bigint, decimal?: number) {
    return new SwapKitNumber({
      decimal,
      value: formatBigIntToSafeValue({ value, bigIntDecimal: toMultiplier(decimal || DEFAULT_DECIMAL), decimal }),
    });
  }
}
