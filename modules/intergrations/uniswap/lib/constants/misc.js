"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ONE_HUNDRED_PERCENT = exports.ZERO_PERCENT = exports.BLOCKED_PRICE_IMPACT_NON_EXPERT = exports.PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN = exports.ALLOWED_PRICE_IMPACT_HIGH = exports.ALLOWED_PRICE_IMPACT_MEDIUM = exports.ALLOWED_PRICE_IMPACT_LOW = exports.ONE_BIPS = exports.BIPS_BASE = exports.BIG_INT_ZERO = exports.L2_TXN_DISMISS_MS = exports.DEFAULT_TXN_DISMISS_MS = exports.L2_DEADLINE_FROM_NOW = exports.DEFAULT_DEADLINE_FROM_NOW = exports.ZERO_ADDRESS = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
const jsbi_1 = __importDefault(require("jsbi"));
exports.ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
// TODO(WEB-1984): Convert the deadline to minutes and remove unecessary conversions from
// seconds to minutes in the codebase.
// 10 minutes, denominated in seconds
exports.DEFAULT_DEADLINE_FROM_NOW = 60 * 10;
exports.L2_DEADLINE_FROM_NOW = 60 * 5;
// transaction popup dismissal amounts
exports.DEFAULT_TXN_DISMISS_MS = 10000;
exports.L2_TXN_DISMISS_MS = 5000;
exports.BIG_INT_ZERO = jsbi_1.default.BigInt(0);
exports.BIPS_BASE = 10000;
// one basis JSBI.BigInt
exports.ONE_BIPS = new sdk_core_1.Percent(jsbi_1.default.BigInt(1), exports.BIPS_BASE);
// used for warning states
exports.ALLOWED_PRICE_IMPACT_LOW = new sdk_core_1.Percent(1, 100); // 1%
exports.ALLOWED_PRICE_IMPACT_MEDIUM = new sdk_core_1.Percent(3, 100); // 3%
exports.ALLOWED_PRICE_IMPACT_HIGH = new sdk_core_1.Percent(5, 100); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
exports.PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN = new sdk_core_1.Percent(10, 100); // 10%
// for non expert mode disable swaps above this
exports.BLOCKED_PRICE_IMPACT_NON_EXPERT = new sdk_core_1.Percent(15, 100); // 15%
exports.ZERO_PERCENT = new sdk_core_1.Percent(0);
exports.ONE_HUNDRED_PERCENT = new sdk_core_1.Percent(1);
