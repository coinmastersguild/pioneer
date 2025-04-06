"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwapKitNumber = void 0;
const bigIntArithmetics_1 = require("./bigIntArithmetics");
const DEFAULT_DECIMAL = 8;
class SwapKitNumber extends bigIntArithmetics_1.BigIntArithmetics {
    eq(value) {
        return this.eqValue(value);
    }
    static fromBigInt(value, decimal) {
        return new SwapKitNumber({
            decimal,
            value: (0, bigIntArithmetics_1.formatBigIntToSafeValue)({ value, bigIntDecimal: (0, bigIntArithmetics_1.toMultiplier)(decimal || DEFAULT_DECIMAL), decimal }),
        });
    }
}
exports.SwapKitNumber = SwapKitNumber;
