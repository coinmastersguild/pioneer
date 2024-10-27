import { BaseDecimal } from '@coinmasters/types';
import type { SwapKitNumber } from './swapKitNumber';

const TAG = " | BigIntArithmetics | ";

type NumberPrimitivesType = {
  bigint: bigint;
  number: number;
  string: string;
};
export type NumberPrimitives = bigint | number | string;
type InitialisationValueType = NumberPrimitives | BigIntArithmetics | SwapKitNumber;

type SKBigIntParams = InitialisationValueType | { decimal?: number; value: number | string };
type AllowedNumberTypes = 'bigint' | 'number' | 'string';

const DEFAULT_DECIMAL = 8;

const bigintPow = (base: bigint, exponent: number): bigint => {
  let tag = TAG + " | bigintPow | ";
  try {
    let result = BigInt(1);
    while (exponent > 0) {
      if (exponent % 2 === 1) {
        result *= base;
      }
      base *= base;
      exponent = Math.floor(exponent / 2);
    }
    return result;
  } catch (error) {
    console.error(tag + 'Error in bigintPow:', error);
    return BigInt(1);
  }
};

export const toMultiplier = (decimal: number): bigint => {
  let tag = TAG + " | toMultiplier | ";
  //console.log(tag + 'input decimal:', decimal);
  try {
    if (decimal < 0) {
      throw new Error("Decimal must be non-negative");
    }
    let result = BigInt(1);
    for (let i = 0; i < decimal; i++) {
      result *= BigInt(10);
    }
    //console.log(tag + 'result:', result);
    return result;
  } catch (error) {
    console.error(tag + 'Error in toMultiplier:', error);
    return BigInt(10);
  }
};

const decimalFromMultiplier = (multiplier: bigint): number => {
  let tag = TAG + " | decimalFromMultiplier | ";
  try {
    return Math.log10(Number(multiplier));
  } catch (error) {
    console.error(tag + 'Error in decimalFromMultiplier:', error);
    return 0;
  }
};

export function formatBigIntToSafeValue({
                                          value,
                                          bigIntDecimal,
                                          decimal,
                                        }: {
  value: bigint;
  bigIntDecimal?: bigint;
  decimal?: number;
}): string {
  const tag = TAG+" | BigIntArithmetics | ";
  try {
    //console.log(tag,'value:',value,'bigIntDecimal:',bigIntDecimal,'decimal:',decimal);
    if(!decimal) decimal = DEFAULT_DECIMAL;
    if(!bigIntDecimal) bigIntDecimal = toMultiplier(decimal);

    // Check if the value is negative and throw an error if true
    if (value < BigInt(0)) {
      throw new Error(TAG + 'Negative value is not allowed');
    }

    // Convert bigint to string and then to number
    let valueString = value.toString();
    //console.log(tag,'valueString:',valueString);
    //console.log(tag,'valueString:',valueString.length);

    //console.log(tag,'decimal:',decimal);
    // Ensure the valueString has enough length for the decimal places
    if (valueString.length <= decimal) {
      valueString = '0'.repeat(decimal - valueString.length + 1) + valueString;
    }

    // Determine the integer and decimal parts
    const integerPart = valueString.slice(0, valueString.length - decimal) || '0';
    const decimalPart = valueString.slice(valueString.length - decimal).padEnd(decimal, '0');

    // Construct the final formatted value
    const formattedValue = `${integerPart}.${decimalPart}`;

    //console.log(tag,"formattedValue:", formattedValue);
    return formattedValue;
  } catch (error) {
    console.error(TAG + 'Error in formatBigIntToSafeValue:', error);
    return '';
  }
}

export class BigIntArithmetics {
  private decimalMultiplier: any;
  //@ts-ignore
  private bigIntValue: bigint;
  private decimal?: number;

  static fromBigInt(value: bigint, decimal?: number): BigIntArithmetics {
    let tag = TAG + " | fromBigInt | ";
    try {
      //console.log(tag,"Decimal: ", decimal);

      return new BigIntArithmetics({
        decimal,
        value: formatBigIntToSafeValue({ value, bigIntDecimal: toMultiplier(decimal || DEFAULT_DECIMAL), decimal }),
      });
    } catch (error) {
      console.error(tag + 'Error in fromBigInt:', error);
      return new BigIntArithmetics(0);
    }
  }

  // static shiftDecimals({
  //                        value,
  //                        from,
  //                        to,
  //                      }: {
  //   value: InstanceType<typeof SwapKitNumber>;
  //   from: number;
  //   to: number;
  // }): BigIntArithmetics {
  //   let tag = TAG + " | shiftDecimals | ";
  //   try {
  //     return this.fromBigInt(
  //         (value.getBaseValue('bigint') * toMultiplier(to)) / toMultiplier(from),
  //         to,
  //     );
  //   } catch (error) {
  //     console.error(tag + 'Error in shiftDecimals:', error);
  //     return new BigIntArithmetics(0);
  //   }
  // }

  /*
        AssetValue
      {
        decimalMultiplier: 1000000000000000000n,
        bigIntValue: 62128120000000000n,
        decimal: 18,
        isGasAsset: true,
        isSynthetic: false,
        type: 'Native',
        chain: 'BASE',
        ticker: 'ETH',
        symbol: 'ETH',
        address: undefined,
        tax: undefined,
        caip: 'eip155:8453/slip44:60'
      }
   */

  constructor(params: SKBigIntParams) {
    let tag = TAG + " | constructor | ";
    try {
      ////console.log(tag + 'Constructor Params:', params);
      const value = getStringValue(params);
      ////console.log(tag + 'String Value:', value);
      const isComplex = typeof params === 'object' && params !== null;
      this.decimal = isComplex ? (params as { decimal?: number }).decimal : undefined;
      ////console.log(tag , 'Decimal:', this.decimal);
      ////console.log(tag , 'isComplex:', isComplex);
      if (isComplex) {
        this.decimalMultiplier = toMultiplier(this.decimal || DEFAULT_DECIMAL);
      } else {
        const maxDecimals = Math.max(getFloatDecimals(toSafeValue(value)), this.decimal || 0);
        this.decimalMultiplier = toMultiplier(maxDecimals);
      }
      ////console.log(tag + 'Decimal Multiplier:', this.decimalMultiplier);

      this.setValue(value);
      //@ts-ignore
      ////console.log(tag + 'BigInt Value:', this.bigIntValue);
    } catch (error) {
      console.error(tag + 'Error in constructor:', error);
      this.decimalMultiplier = BigInt(1);
      this.bigIntValue = BigInt(0);
    }
  }
  
  // constructor(params: SKBigIntParams) {
  //   let tag = TAG + " | constructor | ";
  //   try {
  //     //console.log(tag + 'Constructor Params:', params);
  //     const value = getStringValue(params);
  //     //console.log(tag + 'String Value:', value);
  //     const isComplex = typeof params === 'object' && params !== null;
  //     this.decimal = isComplex ? (params as { decimal?: number }).decimal : undefined;
  //     //console.log(tag , 'Decimal:', this.decimal);
  //     //console.log(tag , 'isComplex:', isComplex);
  //     if (isComplex) {
  //       this.decimalMultiplier = this.decimal;
  //     } else {
  //       const maxDecimals = Math.max(getFloatDecimals(toSafeValue(value)), this.decimal || 0);
  //       this.decimalMultiplier = toMultiplier(maxDecimals);
  //     }
  //     //console.log(tag + 'Decimal Multiplier:', this.decimalMultiplier);
  //
  //     this.setValue(value);
  //     //@ts-ignore
  //     //console.log(tag + 'BigInt Value:', this.bigIntValue);
  //   } catch (error) {
  //     console.error(tag + 'Error in constructor:', error);
  //     this.decimalMultiplier = BigInt(1);
  //     this.bigIntValue = BigInt(0);
  //   }
  // }

  set(value: SKBigIntParams): this {
    let tag = TAG + " | set | ";
    try {
      // @ts-ignore
      return new BigIntArithmetics({ decimal: this.decimal, value }) as this;
    } catch (error) {
      console.error(tag + 'Error in set:', error);
      return this;
    }
  }

  add(...args: InitialisationValueType[]): this {
    let tag = TAG + " | add | ";
    try {
      return this.arithmetics('add', ...args);
    } catch (error) {
      console.error(tag + 'Error in add:', error);
      return this;
    }
  }

  sub(...args: InitialisationValueType[]): this {
    let tag = TAG + " | sub | ";
    try {
      return this.arithmetics('sub', ...args);
    } catch (error) {
      console.error(tag + 'Error in sub:', error);
      return this;
    }
  }

  mul(...args: InitialisationValueType[]): this {
    let tag = TAG + " | mul | ";
    try {
      return this.arithmetics('mul', ...args);
    } catch (error) {
      console.error(tag + 'Error in mul:', error);
      return this;
    }
  }

  div(...args: InitialisationValueType[]): this {
    let tag = TAG + " | div | ";
    try {
      return this.arithmetics('div', ...args);
    } catch (error) {
      console.error(tag + 'Error in div:', error);
      return this;
    }
  }

  gt(value: InitialisationValueType): boolean {
    let tag = TAG + " | gt | ";
    try {
      return this.comparison('gt', value);
    } catch (error) {
      console.error(tag + 'Error in gt:', error);
      return false;
    }
  }

  gte(value: InitialisationValueType): boolean {
    let tag = TAG + " | gte | ";
    try {
      return this.comparison('gte', value);
    } catch (error) {
      console.error(tag + 'Error in gte:', error);
      return false;
    }
  }

  lt(value: InitialisationValueType): boolean {
    let tag = TAG + " | lt | ";
    try {
      return this.comparison('lt', value);
    } catch (error) {
      console.error(tag + 'Error in lt:', error);
      return false;
    }
  }

  lte(value: InitialisationValueType): boolean {
    let tag = TAG + " | lte | ";
    try {
      return this.comparison('lte', value);
    } catch (error) {
      console.error(tag + 'Error in lte:', error);
      return false;
    }
  }

  eqValue(value: InitialisationValueType): boolean {
    let tag = TAG + " | eqValue | ";
    try {
      return this.comparison('eqValue', value);
    } catch (error) {
      console.error(tag + 'Error in eqValue:', error);
      return false;
    }
  }
  //@ts-ignore
  getValue<T extends AllowedNumberTypes>(type: T): NumberPrimitivesType[T] {
    let tag = TAG + " | getValue | ";
    try {
      //console.log(tag,'getValue type:', type);
      //console.log(tag,'decimalMultiplier: ', this.decimalMultiplier);
      const value = formatBigIntToSafeValue({
        value: this.bigIntValue,
        bigIntDecimal: toMultiplier(this.decimal || DEFAULT_DECIMAL),
        decimal: this.decimal || DEFAULT_DECIMAL,
      });
      //console.log(tag,'value:', value);
      switch (type) {
        case 'number':
          return Number(value) as NumberPrimitivesType[T];
        case 'string':
          return value as NumberPrimitivesType[T];
        case 'bigint':
          return ((this.bigIntValue * bigintPow(BigInt(10), this.decimal || 8)) /
              this.decimalMultiplier) as NumberPrimitivesType[T];
      }
    } catch (error) {
      console.error(tag + 'Error in getValue:', error);
      return null as any;
    }
  }

  // @ts-ignore
  getBaseValue<T extends AllowedNumberTypes>(type: T): NumberPrimitivesType[T] {
    let tag = TAG + " | getBaseValue | ";
    try {
      const divisor = this.decimalMultiplier / toMultiplier(this.decimal || BaseDecimal.THOR);
      const baseValue = this.bigIntValue / divisor;

      switch (type) {
        case 'number':
          return Number(baseValue) as NumberPrimitivesType[T];
        case 'string':
          return baseValue.toString() as NumberPrimitivesType[T];
        case 'bigint':
          return baseValue as NumberPrimitivesType[T];
      }
    } catch (error) {
      console.error(tag + 'Error in getBaseValue:', error);
      return null as any;
    }
  }

  getBigIntValue(value: InitialisationValueType, decimal?: number): bigint {
    let tag = TAG + " | getBigIntValue | ";
    try {
      if (!decimal && typeof value === 'object' && value !== null) {
        return (value as BigIntArithmetics).bigIntValue;
      }

      const stringValue = getStringValue(value);
      const safeValue = toSafeValue(stringValue);

      if (safeValue === '0' || safeValue === 'undefined') return BigInt(0);
      return this.toBigInt(safeValue, decimal);
    } catch (error) {
      console.error(tag + 'Error in getBigIntValue:', error);
      return BigInt(0);
    }
  }

  toSignificant(significantDigits: number = 6): string {
    let tag = TAG + " | toSignificant | ";
    try {
      const [int, dec] = this.getValue('string').split('.');
      const integer = int || '';
      const decimal = dec || '';
      const valueLength = parseInt(integer) ? integer.length + decimal.length : decimal.length;

      if (valueLength <= significantDigits) {
        return this.getValue('string');
      }

      if (integer.length >= significantDigits) {
        return integer.slice(0, significantDigits).padEnd(integer.length, '0');
      }

      if (parseInt(integer)) {
        return `${integer}.${decimal.slice(0, significantDigits - integer.length)}`.padEnd(
            significantDigits - integer.length,
            '0',
        );
      }

      const trimmedDecimal = parseInt(decimal);
      const slicedDecimal = `${trimmedDecimal}`.slice(0, significantDigits);

      return `0.${slicedDecimal.padStart(
          decimal.length - `${trimmedDecimal}`.length + slicedDecimal.length,
          '0',
      )}`;
    } catch (error) {
      console.error(tag + 'Error in toSignificant:', error);
      return '';
    }
  }

  toFixed(fixedDigits: number = 6): string {
    let tag = TAG + " | toFixed | ";
    try {
      const [int, dec] = this.getValue('string').split('.');
      const integer = int || '';
      const decimal = dec || '';

      if (parseInt(integer)) {
        return `${integer}.${decimal.slice(0, fixedDigits)}`.padEnd(fixedDigits, '0');
      }

      const trimmedDecimal = parseInt(decimal);
      const slicedDecimal = `${trimmedDecimal}`.slice(0, fixedDigits);

      return `0.${slicedDecimal.padStart(
          decimal.length - `${trimmedDecimal}`.length + slicedDecimal.length,
          '0',
      )}`;
    } catch (error) {
      console.error(tag + 'Error in toFixed:', error);
      return '';
    }
  }

  toAbbreviation(digits = 2): string {
    let tag = TAG + " | toAbbreviation | ";
    try {
      const value = this.getValue('number');
      const abbreviations = ['', 'K', 'M', 'B', 'T', 'Q', 'Qi', 'S'];
      const tier = Math.floor(Math.log10(Math.abs(value)) / 3);
      const suffix = abbreviations[tier];

      if (!suffix) return this.getValue('string');

      const scale = 10 ** (tier * 3);
      const scaled = value / scale;

      return `${scaled.toFixed(digits)}${suffix}`;
    } catch (error) {
      console.error(tag + 'Error in toAbbreviation:', error);
      return '';
    }
  }

  toCurrency(
      currency = '$',
      {
        currencyPosition = 'start',
        decimal = 2,
        decimalSeparator = '.',
        thousandSeparator = ',',
      } = {},
  ): string {
    let tag = TAG + " | toCurrency | ";
    try {
      const value = this.getValue('number');
      const [int, dec = ''] = value.toFixed(6).split('.');
      const integer = int.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

      const parsedValue =
          !int && !dec
              ? '0.00'
              : int === '0'
                  ? `${parseFloat(`0.${dec}`)}`.replace('.', decimalSeparator)
                  : `${integer}${parseInt(dec) ? `${decimalSeparator}${dec.slice(0, decimal)}` : ''}`;

      return `${currencyPosition === 'start' ? currency : ''}${parsedValue}${currencyPosition === 'end' ? currency : ''
      }`;
    } catch (error) {
      console.error(tag + 'Error in toCurrency:', error);
      return '';
    }
  }

  private arithmetics(method: 'add' | 'sub' | 'mul' | 'div', ...args: InitialisationValueType[]): this {
    let tag = TAG + " | arithmetics | ";
    try {
      const precisionDecimal = this.retrievePrecisionDecimal(this, ...args);
      const decimal = Math.max(precisionDecimal, decimalFromMultiplier(this.decimalMultiplier));
      const precisionDecimalMultiplier = toMultiplier(decimal);

      const result = args.reduce(
          (acc: bigint, arg) => {
            const value = this.getBigIntValue(arg, decimal);

            switch (method) {
              case 'add':
                return acc + value;
              case 'sub':
                return acc - value;
              case 'mul':
                return (acc * value) / precisionDecimalMultiplier;
              case 'div': {
                if (value === BigInt(0)) throw new RangeError('Division by zero');
                return (acc * precisionDecimalMultiplier) / value;
              }
              default:
                return acc;
            }
          },
          (this.bigIntValue * precisionDecimalMultiplier) / this.decimalMultiplier,
      );

      const formattedValue = formatBigIntToSafeValue({
        bigIntDecimal: toMultiplier(decimal),
        decimal,
        value: result,
      });

      return new BigIntArithmetics({
        decimalMultiplier: toMultiplier(decimal),
        decimal: this.decimal,
        value: formattedValue,
      }) as this;
    } catch (error) {
      console.error(tag + 'Error in arithmetics:', error);
      return this;
    }
  }

  private comparison(method: 'gt' | 'gte' | 'lt' | 'lte' | 'eqValue', ...args: InitialisationValueType[]): boolean {
    let tag = TAG + " | comparison | ";
    try {
      const decimal = this.retrievePrecisionDecimal(this, ...args);
      const value = this.getBigIntValue(args[0], decimal);
      const compareToValue = this.getBigIntValue(this, decimal);

      switch (method) {
        case 'gt':
          return compareToValue > value;
        case 'gte':
          return compareToValue >= value;
        case 'lt':
          return compareToValue < value;
        case 'lte':
          return compareToValue <= value;
        case 'eqValue':
          return compareToValue === value;
      }
    } catch (error) {
      console.error(tag + 'Error in comparison:', error);
      return false;
    }
  }

  private setValue(value: any): void {
    let tag = TAG + " | setValue | ";
    try {
      //console.log(tag, 'value:', value);
      //console.log(tag, ' this.decimal:',  this.decimal);
      const safeValue = formatBigIntToSafeValue({value:value, decimal: this.decimal})
      //console.log(tag, 'safeValue:', safeValue);
      this.bigIntValue = this.toBigInt(safeValue);
    } catch (error) {
      console.error(tag + 'Error in setValue:', error);
    }
  }

  private retrievePrecisionDecimal(...args: InitialisationValueType[]): number {
    let tag = TAG + " | retrievePrecisionDecimal | ";
    try {
      const decimals = args
          .map((arg) => {
            const isObject = typeof arg === 'object' && arg !== null;
            const value = isObject
                ? (arg as any).decimal || decimalFromMultiplier((arg as any).decimalMultiplier)
                : getFloatDecimals(toSafeValue(arg));

            return value;
          })
          .filter(Boolean) as number[];

      return Math.max(...decimals, DEFAULT_DECIMAL);
    } catch (error) {
      console.error(tag + 'Error in retrievePrecisionDecimal:', error);
      return DEFAULT_DECIMAL;
    }
  }

  private toBigInt(value: string, decimal?: number): bigint {
    let tag = TAG + " | toBigInt | ";
    try {
      const multiplier = decimal ? toMultiplier(decimal) : this.decimalMultiplier;
      const padDecimal = decimalFromMultiplier(multiplier);
      const [integerPart = '', decimalPart = ''] = value.split('.');

      return BigInt(`${integerPart}${decimalPart.padEnd(padDecimal, '0')}`);
    } catch (error) {
      console.error(tag + 'Error in toBigInt:', error);
      return BigInt(0);
    }
  }
}

const numberFormatter = Intl.NumberFormat('fullwide', {
  useGrouping: false,
  maximumFractionDigits: 20,
});

function toSafeValue(value: InitialisationValueType): string {
  let tag = TAG + " | toSafeValue | ";
  try {
    const parsedValue =
        typeof value === 'number' ? numberFormatter.format(value) : getStringValue(value);
    const splitValue = `${parsedValue}`.replace(/,/g, '.').split('.');

    return splitValue.length > 1
        ? `${splitValue.slice(0, -1).join('')}.${splitValue.at(-1)}`
        : splitValue[0];
  } catch (error) {
    console.error(tag + 'Error in toSafeValue:', error);
    return '0';
  }
}

function getFloatDecimals(value: string): number {
  let tag = TAG + " | getFloatDecimals | ";
  try {
    let decimals = 0;
    const parts = value.split('.');
    if (parts.length > 1 && parts[1].length > 0) {
      decimals = parts[1].length;
    }
    return Math.max(decimals, DEFAULT_DECIMAL);
  } catch (error) {
    console.error(tag + 'Error in getFloatDecimals:', error);
    return DEFAULT_DECIMAL;
  }
}

function getStringValue(param: SKBigIntParams): string {
  let tag = TAG + " | getStringValue | ";
  try {
    return typeof param === 'object' && param !== null
        ? 'getValue' in param
            ? (param as SwapKitNumber).getValue('string')
            : (param as any).value
        : (param as string);
  } catch (error) {
    console.error(tag + 'Error in getStringValue:', error);
    return '';
  }
}
