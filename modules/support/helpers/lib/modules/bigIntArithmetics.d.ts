import type { SwapKitNumber } from './swapKitNumber';
type NumberPrimitivesType = {
    bigint: bigint;
    number: number;
    string: string;
};
export type NumberPrimitives = bigint | number | string;
type InitialisationValueType = NumberPrimitives | BigIntArithmetics | SwapKitNumber;
type SKBigIntParams = InitialisationValueType | {
    decimal?: number;
    value: number | string;
};
type AllowedNumberTypes = 'bigint' | 'number' | 'string';
export declare const toMultiplier: (decimal: number) => bigint;
export declare function formatBigIntToSafeValue({ value, bigIntDecimal, decimal, }: {
    value: bigint;
    bigIntDecimal?: bigint;
    decimal?: number;
}): string;
export declare class BigIntArithmetics {
    private decimalMultiplier;
    private bigIntValue;
    private decimal?;
    static fromBigInt(value: bigint, decimal?: number): BigIntArithmetics;
    constructor(params: SKBigIntParams);
    set(value: SKBigIntParams): this;
    add(...args: InitialisationValueType[]): this;
    sub(...args: InitialisationValueType[]): this;
    mul(...args: InitialisationValueType[]): this;
    div(...args: InitialisationValueType[]): this;
    gt(value: InitialisationValueType): boolean;
    gte(value: InitialisationValueType): boolean;
    lt(value: InitialisationValueType): boolean;
    lte(value: InitialisationValueType): boolean;
    eqValue(value: InitialisationValueType): boolean;
    getValue<T extends AllowedNumberTypes>(type: T): NumberPrimitivesType[T];
    getBaseValue<T extends AllowedNumberTypes>(type: T): NumberPrimitivesType[T];
    getBigIntValue(value: InitialisationValueType, decimal?: number): bigint;
    toSignificant(significantDigits?: number): string;
    toFixed(fixedDigits?: number): string;
    toAbbreviation(digits?: number): string;
    toCurrency(currency?: string, { currencyPosition, decimal, decimalSeparator, thousandSeparator, }?: {
        currencyPosition?: string | undefined;
        decimal?: number | undefined;
        decimalSeparator?: string | undefined;
        thousandSeparator?: string | undefined;
    }): string;
    private arithmetics;
    private comparison;
    private setValue;
    private retrievePrecisionDecimal;
    private toBigInt;
}
export {};
