"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMemoFor = void 0;
const types_1 = require("@coinmasters/types");
const getShortenedSymbol = ({ symbol, ticker, chain, }) => (chain === 'ETH' && ticker !== 'ETH' ? `${ticker}-${symbol.slice(-3)}` : symbol);
const getMemoFor = (memoType, options) => {
    switch (memoType) {
        case types_1.MemoType.LEAVE:
        case types_1.MemoType.BOND: {
            const { address } = options;
            return `${memoType}:${address}`;
        }
        case types_1.MemoType.UNBOND: {
            const { address, unbondAmount } = options;
            return `${memoType}:${address}:${unbondAmount * Math.pow(10, 8)}`;
        }
        case types_1.MemoType.THORNAME_REGISTER: {
            const { name, chain, address, owner } = options;
            return `${memoType}:${name}:${chain}:${address}${owner ? `:${owner}` : ''}`;
        }
        case types_1.MemoType.DEPOSIT: {
            const { chain, symbol, address, singleSide } = options;
            return singleSide
                ? `${memoType}:${chain}/${symbol}::t:0`
                : `${memoType}:${chain}.${symbol}:${address || ''}:t:0`;
        }
        case types_1.MemoType.WITHDRAW: {
            const { chain, ticker, symbol, basisPoints, targetAssetString, singleSide } = options;
            const target = !singleSide && targetAssetString ? `:${targetAssetString}` : '';
            const shortenedSymbol = getShortenedSymbol({ chain, symbol, ticker });
            const assetDivider = singleSide ? '/' : '.';
            return `${memoType}:${chain}${assetDivider}${shortenedSymbol}:${basisPoints}${target}`;
        }
        case types_1.MemoType.OPEN_LOAN:
        case types_1.MemoType.CLOSE_LOAN: {
            const { asset, address } = options;
            return `${memoType}:${asset}:${address}`; //:${minAmount ? `${minAmount}` : ''}:t:0`;
        }
        default:
            return '';
    }
};
exports.getMemoFor = getMemoFor;
