"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiquiditySlippage = exports.getEstimatedPoolShare = exports.getSymmetricWithdraw = exports.getSymmetricPoolShare = exports.getAsymmetricAssetWithdrawAmount = exports.getAsymmetricRuneWithdrawAmount = exports.getAsymmetricAssetShare = exports.getAsymmetricRuneShare = void 0;
const types_1 = require("@coinmasters/types");
const index_1 = require("../index");
/**
 *  Ref: https://gitlab.com/thorchain/thornode/-/issues/657
 *  share = (s * A * (2 * T^2 - 2 * T * s + s^2))/T^3
 *  s = stakeUnits for member (after factoring in withdrawBasisPoints)
 *  T = totalPoolUnits for pool
 *  A = assetDepth to be withdrawn
 *
 *  Formula:
 *  share = (s * A * (2 * T^2 - 2 * T * s + s^2))/T^3
 *  (part1 * (part2 - part3 + part4)) / part5
 */
const getAsymmetricRuneShare = ({ liquidityUnits, poolUnits, runeDepth, }) => {
    const s = toTCSwapKitNumber(liquidityUnits);
    const T = toTCSwapKitNumber(poolUnits);
    const A = toTCSwapKitNumber(runeDepth);
    const part1 = s.mul(A);
    const part2 = T.mul(T).mul(2);
    const part3 = T.mul(s).mul(2);
    const part4 = s.mul(s);
    const part5 = T.mul(T).mul(T);
    const numerator = part1.mul(part2.sub(part3).add(part4));
    return numerator.div(part5);
};
exports.getAsymmetricRuneShare = getAsymmetricRuneShare;
const getAsymmetricAssetShare = ({ liquidityUnits, poolUnits, assetDepth, }) => {
    const s = toTCSwapKitNumber(liquidityUnits);
    const T = toTCSwapKitNumber(poolUnits);
    const A = toTCSwapKitNumber(assetDepth);
    const part1 = s.mul(A);
    const part2 = T.mul(T).mul(2);
    const part3 = T.mul(s).mul(2);
    const part4 = s.mul(s);
    const numerator = part1.mul(part2.sub(part3).add(part4));
    const part5 = T.mul(T).mul(T);
    return numerator.div(part5);
};
exports.getAsymmetricAssetShare = getAsymmetricAssetShare;
const getAsymmetricRuneWithdrawAmount = ({ percent, runeDepth, liquidityUnits, poolUnits, }) => (0, exports.getAsymmetricRuneShare)({ runeDepth, liquidityUnits, poolUnits }).mul(percent);
exports.getAsymmetricRuneWithdrawAmount = getAsymmetricRuneWithdrawAmount;
const getAsymmetricAssetWithdrawAmount = ({ percent, assetDepth, liquidityUnits, poolUnits, }) => (0, exports.getAsymmetricAssetShare)({ assetDepth, liquidityUnits, poolUnits }).mul(percent);
exports.getAsymmetricAssetWithdrawAmount = getAsymmetricAssetWithdrawAmount;
const toTCSwapKitNumber = (value) => index_1.SwapKitNumber.fromBigInt(BigInt(value), types_1.BaseDecimal.THOR);
const getSymmetricPoolShare = ({ liquidityUnits, poolUnits, runeDepth, assetDepth, }) => ({
    assetAmount: toTCSwapKitNumber(assetDepth).mul(liquidityUnits).div(poolUnits),
    runeAmount: toTCSwapKitNumber(runeDepth).mul(liquidityUnits).div(poolUnits),
});
exports.getSymmetricPoolShare = getSymmetricPoolShare;
const getSymmetricWithdraw = ({ liquidityUnits, poolUnits, runeDepth, assetDepth, percent, }) => Object.fromEntries(Object.entries((0, exports.getSymmetricPoolShare)({ liquidityUnits, poolUnits, runeDepth, assetDepth })).map(([name, value]) => [name, value.mul(percent)]));
exports.getSymmetricWithdraw = getSymmetricWithdraw;
const getEstimatedPoolShare = ({ runeDepth, poolUnits, assetDepth, liquidityUnits, runeAmount, assetAmount, }) => {
    const R = new index_1.SwapKitNumber({ value: runeDepth, decimal: 8 });
    const A = new index_1.SwapKitNumber({ value: assetDepth, decimal: 8 });
    const P = new index_1.SwapKitNumber({ value: poolUnits, decimal: 8 });
    const runeAddAmount = new index_1.SwapKitNumber({ value: runeAmount, decimal: 8 });
    const assetAddAmount = new index_1.SwapKitNumber({ value: assetAmount, decimal: 8 });
    // liquidityUnits = P * (r*A + a*R + 2*r*a) / (r*A + a*R + 2*R*A)
    const rA = runeAddAmount.mul(A);
    const aR = assetAddAmount.mul(R);
    const ra = runeAddAmount.mul(assetAddAmount);
    const RA = R.mul(A);
    const numerator = P.mul(rA.add(aR.add(ra.mul(2))));
    const denominator = rA.add(aR.add(RA.mul(2)));
    const liquidityUnitsAfterAdd = numerator.div(denominator);
    const estimatedLiquidityUnits = toTCSwapKitNumber(liquidityUnits).add(liquidityUnitsAfterAdd);
    if (liquidityUnitsAfterAdd.getBaseValue('number') === 0) {
        return estimatedLiquidityUnits.div(P).getBaseValue('number');
    }
    // get pool units after add
    const newPoolUnits = P.add(estimatedLiquidityUnits);
    return estimatedLiquidityUnits.div(newPoolUnits).getBaseValue('number');
};
exports.getEstimatedPoolShare = getEstimatedPoolShare;
const getLiquiditySlippage = ({ runeAmount, assetAmount, runeDepth, assetDepth, }) => {
    if (runeAmount === '0' || assetAmount === '0' || runeDepth === '0' || assetDepth === '0')
        return 0;
    // formula: (t * R - T * r)/ (T*r + R*T)
    const R = toTCSwapKitNumber(runeDepth);
    const T = toTCSwapKitNumber(assetDepth);
    const assetAddAmount = toTCSwapKitNumber(assetAmount);
    const runeAddAmount = toTCSwapKitNumber(runeAmount);
    const numerator = assetAddAmount.mul(R).sub(T.mul(runeAddAmount));
    const denominator = T.mul(runeAddAmount).add(R.mul(T));
    // set absolute value of percent, no negative allowed
    return Math.abs(numerator.div(denominator).getBaseValue('number'));
};
exports.getLiquiditySlippage = getLiquiditySlippage;
