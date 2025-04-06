"use strict";
/*
    Thorchain Memo Toolkit
    ----------------------
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMemo = createMemo;
exports.parseMemo = parseMemo;
var assetShortCodeMap = {
    'r': 'THOR.RUNE',
    'b': 'BTC.BTC',
    'e': 'ETH.ETH',
    'n': 'BNB.BNB',
    'g': 'GAIA.ATOM',
    'd': 'DOGE.DOGE',
    'l': 'LTC.LTC',
    'c': 'BCH.BCH',
    'a': 'AVAX.AVAX',
    's': 'BSC.BNB',
    'LUNA': 'TERRA.LUNA',
    'ATOM': 'GAIA.ATOM',
    'BNB': 'BNB.BNB',
    'BTC': 'BTC.BTC',
    'LTC': 'LTC.LTC',
    'BCH': 'BCH.BCH',
    'DOGE': 'DOGE.DOGE',
    'ETH': 'ETH.ETH',
    'AVAX': 'AVAX.AVAX',
    '67C': 'BNB.RUNE-67C',
    'B1A': 'BNB.RUNE-B1A',
    'TOR': 'THOR.TOR',
    'THORBTC': 'THOR.BTC'
};
// Utility function to interpret shortened asset names
function interpretAssetShortCode(shortCode) {
    return assetShortCodeMap[shortCode] || shortCode;
}
// Utility function to interpret other shortened parts (e.g., scientific notation)
function interpretShortenedPart(part) {
    if (part.includes('e')) {
        var _a = part.split('e').map(Number), base = _a[0], exponent = _a[1];
        return base * Math.pow(10, exponent);
    }
    return part;
}
// Function to build an Aggregate Swap transaction memo
function buildAggregateSwapMemo(tx) {
    var _a;
    var limIntervalQuantity = "".concat(tx.lim || '', "/").concat(tx.interval || '', "/").concat(tx.quantity || '');
    var parts = [
        'SWAP',
        tx.asset,
        tx.destAddr,
        limIntervalQuantity,
        tx.affiliate || '',
        ((_a = tx.fee) === null || _a === void 0 ? void 0 : _a.toString()) || '',
        tx.dexAggregatorAddr,
        tx.finalAssetAddr,
        tx.minAmountOut.toString()
    ];
    return truncateMemo(parts.join(':'));
}
// More transaction types (LoanRepaymentTx, LiquidityTx, etc.) can be defined similarly
// Utility function to check and truncate memo length
function truncateMemo(memo, limit) {
    if (limit === void 0) { limit = 250; }
    var buffer = Buffer.from(memo, 'utf-8');
    if (buffer.length > limit) {
        throw new Error("Memo exceeds the ".concat(limit, " byte limit."));
    }
    return memo;
}
// Utility function for converting numbers to scientific notation if needed
function toScientificNotation(number) {
    if (number > 1000000) { // Adjust the threshold as needed
        var exponent = Math.floor(Math.log10(number));
        var base = number / Math.pow(10, exponent);
        return "".concat(base.toFixed(1), "e").concat(exponent);
    }
    return number.toString();
}
// Function to build a Swap transaction memo
function buildSwapMemo(tx) {
    var assetShort = Object.keys(assetShortCodeMap).find(function (key) { return assetShortCodeMap[key] === tx.asset; }) || tx.asset;
    var parts = [
        '=', // Shorthand for SWAP
        assetShort,
        tx.destAddr
    ];
    // Handle lim, interval, and quantity
    if (tx.lim || tx.interval || tx.quantity) {
        var lim = tx.lim ? toScientificNotation(tx.lim) : '';
        var interval = tx.interval ? toScientificNotation(tx.interval) : '';
        var quantity = tx.quantity ? toScientificNotation(tx.quantity) : '';
        parts.push("".concat(lim, "/").concat(interval, "/").concat(quantity));
    }
    else {
        parts.push(''); // Add an empty string to represent missing lim/interval/quantity
    }
    // Append other parts, handling empty fields appropriately
    parts.push(tx.affiliate || '');
    parts.push(tx.fee ? toScientificNotation(tx.fee) : '');
    parts.push(tx.dexAggregatorAddr || '');
    parts.push(tx.finalAssetAddr || '');
    parts.push(tx.minAmountOut ? toScientificNotation(tx.minAmountOut) : '');
    // Join parts with ':' and correctly handle empty fields
    var memo = parts.join(':');
    memo = memo.replace(/:{2,}/g, '::'); // Replace multiple colons with double colons
    memo = memo.replace(/:+$/, ''); // Remove trailing colons
    return truncateMemo(memo);
}
// Function to build a Deposit transaction memo
function buildDepositMemo(tx) {
    var _a;
    var feeValue = (_a = tx.fee) !== null && _a !== void 0 ? _a : 0; // Use 0 as a default if tx.fee is undefined
    var fee = isNaN(feeValue) ? '0.05' : feeValue.toString();
    var affiliate = tx.affiliate || 'thor1affiliate'; // Default affiliate
    var parts = [
        'DEPOSIT',
        tx.asset,
        tx.destAddr,
        affiliate,
        fee
    ];
    return truncateMemo(parts.join(':'));
}
// Function to build a Withdraw transaction memo
function buildWithdrawMemo(tx) {
    var _a;
    var parts = [
        'WITHDRAW',
        tx.asset,
        tx.destAddr,
        tx.pool,
        ((_a = tx.basisPoints) === null || _a === void 0 ? void 0 : _a.toString()) || ''
    ];
    return truncateMemo(parts.join(':'));
}
// Function to build a Loan Open transaction memo
function buildLoanOpenMemo(tx) {
    var _a, _b;
    var feeValue = (_a = tx.fee) !== null && _a !== void 0 ? _a : 0; // Use 0 as a default if tx.fee is undefined
    var fee = isNaN(feeValue) ? '0.2' : feeValue.toString();
    var affiliate = tx.affiliate || 'thor1loanaff'; // Default affiliate
    var parts = [
        'LOAN+',
        tx.asset,
        tx.destAddr,
        ((_b = tx.minOut) === null || _b === void 0 ? void 0 : _b.toString()) || '',
        affiliate,
        fee
    ];
    return truncateMemo(parts.join(':'));
}
function buildLoanRepayMemo(tx) {
    var _a;
    var parts = [
        'LOAN-',
        tx.asset,
        tx.destAddr,
        ((_a = tx.minOut) === null || _a === void 0 ? void 0 : _a.toString()) || ''
    ];
    return truncateMemo(parts.join(':'));
}
function buildAddLiquidityMemo(tx) {
    var _a;
    var parts = [
        'ADD',
        tx.asset,
        tx.pairedAddr || '',
        tx.affiliate || '',
        ((_a = tx.fee) === null || _a === void 0 ? void 0 : _a.toString()) || ''
    ];
    return truncateMemo(parts.join(':'));
}
function buildWithdrawLiquidityMemo(tx) {
    var parts = [
        'WD',
        tx.asset,
        tx.basisPoints.toString(),
        tx.singleAsset || ''
    ];
    return truncateMemo(parts.join(':'));
}
// Function to build a Bond transaction memo
function buildBondMemo(tx) {
    var _a;
    var parts = [
        'BOND',
        tx.nodeAddr,
        tx.provider || '',
        ((_a = tx.fee) === null || _a === void 0 ? void 0 : _a.toString()) || ''
    ];
    return truncateMemo(parts.join(':'));
}
// Function to build an Unbond transaction memo
function buildUnbondMemo(tx) {
    var parts = [
        'UNBOND',
        tx.nodeAddr,
        tx.amount.toString(),
        tx.provider || ''
    ];
    return truncateMemo(parts.join(':'));
}
// Function to build a Migrate transaction memo
function buildMigrateMemo(tx) {
    return truncateMemo("MIGRATE:".concat(tx.blockHeight));
}
// Function to build a No-Operation (NOOP) memo
function buildNoOpMemo(tx) {
    var parts = [
        '*NOOP*',
        tx.noVault ? 'NOVAULT' : ''
    ];
    return truncateMemo(parts.filter(function (part) { return part; }).join(':'));
}
// Main function to create a memo from any transaction type
function createMemo(tx) {
    switch (tx.type) {
        case 'SWAP':
            return buildSwapMemo(tx);
        case 'DEPOSIT':
            return buildDepositMemo(tx);
        case 'WITHDRAW':
            return buildWithdrawMemo(tx);
        case 'BOND':
            return buildBondMemo(tx);
        case 'UNBOND':
            return buildUnbondMemo(tx);
        case 'MIGRATE':
            return buildMigrateMemo(tx);
        case '*NOOP*':
            return buildNoOpMemo(tx);
        case 'AGGREGATE_SWAP':
            return buildAggregateSwapMemo(tx);
        case 'LOAN+':
            return buildLoanOpenMemo(tx);
        case 'LOAN-':
            return buildLoanRepayMemo(tx);
        case 'ADD':
            return buildAddLiquidityMemo(tx);
        case 'WD':
            return buildWithdrawLiquidityMemo(tx);
        default:
            throw new Error('Unsupported transaction type.');
    }
}
// Function to parse a memo string into a transaction object
function parseMemo(memo) {
    var parts = memo.split(':').map(function (part) {
        return interpretAssetShortCode(part) || interpretShortenedPart(part);
    });
    var typeMap = {
        '=': 'SWAP',
        '+': 'DEPOSIT',
        '-': 'WITHDRAW',
        // Add other shorthand mappings as needed
    };
    var type = typeMap[parts[0]] || parts[0];
    var asset = parts[1];
    var destAddr = parts[2];
    switch (type) {
        case 'SWAP': {
            var asset_1 = parts[1];
            var destAddr_1 = parts[2];
            var _a = parts[3].split('/'), lim = _a[0], interval = _a[1], quantity = _a[2];
            return {
                type: 'SWAP', // Type of the transaction
                asset: asset_1, // Asset being swapped
                destAddr: destAddr_1, // Destination address
                lim: lim ? parseInt(lim) : null, // Limit (optional, null if not provided)
                interval: interval ? parseInt(interval) : null, // Interval (optional)
                quantity: quantity ? parseInt(quantity) : null, // Quantity (optional)
                affiliate: parts[4] || null, // Affiliate (optional)
                fee: parts[5] ? parseFloat(parts[5]) : null, // Fee (optional)
                dexAggregatorAddr: parts[6] || null, // DEX aggregator address (optional)
                finalAssetAddr: parts[7] || null, // Final asset address (optional)
                minAmountOut: parts[8] ? parseInt(parts[8]) : null, // Minimum amount out (optional)
            };
        }
        case 'DEPOSIT':
            return {
                type: type,
                asset: asset,
                destAddr: destAddr,
                affiliate: parts[3] || null,
                fee: parts[4] ? parseFloat(parts[4]) : null,
            };
        case 'WITHDRAW':
            return {
                type: type,
                asset: asset,
                destAddr: destAddr,
                pool: parts[3],
                basisPoints: parts[4] ? parseInt(parts[4]) : null,
            };
        case 'LOAN+':
            return {
                type: type,
                asset: asset,
                destAddr: destAddr,
                minOut: parts[3] ? parseInt(parts[3]) : null,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            };
        case 'LOAN-':
            return {
                type: type,
                asset: asset,
                destAddr: destAddr,
                minOut: parts[3] ? parseInt(parts[3]) : null,
            };
        case 'ADD':
            return {
                type: type,
                asset: asset,
                pairedAddr: parts[3] || null,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            };
        case 'WD':
            return {
                type: type,
                asset: asset,
                basisPoints: parseInt(parts[3]),
                singleAsset: parts[4] || null,
            };
        case 'BOND':
            return {
                type: type,
                asset: asset,
                nodeAddr: parts[3],
                provider: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            };
        case 'UNBOND':
            return {
                type: type,
                asset: asset,
                nodeAddr: parts[3],
                amount: parseInt(parts[4]),
                provider: parts[5] || null,
            };
        case 'MIGRATE':
            return {
                type: type,
                asset: asset,
                blockHeight: parseInt(parts[1]), // Ensure this parses the block height correctly
            };
        case '*NOOP*':
            return {
                type: type,
                asset: asset,
                noVault: parts[1] === 'NOVAULT',
            };
        case 'AGGREGATE_SWAP': {
            var _b = parts[3].split('/'), lim = _b[0], interval = _b[1], quantity = _b[2];
            return {
                type: 'SWAP', // Using 'SWAP' as the type for consistency
                asset: asset,
                destAddr: destAddr,
                lim: lim ? parseInt(lim) : null,
                interval: interval ? parseInt(interval) : null,
                quantity: quantity ? parseInt(quantity) : null,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
                dexAggregatorAddr: parts[6],
                finalAssetAddr: parts[7],
                minAmountOut: parts[8] ? parseInt(parts[8]) : null,
            };
        }
        case 'LOAN+': {
            var minOut = parts[3] ? parseInt(parts[3]) : null;
            return {
                type: type,
                asset: asset,
                destAddr: destAddr,
                minOut: minOut,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            };
        }
        case 'LOAN-': {
            var minOut = parts[3] ? parseInt(parts[3]) : null;
            return {
                type: type,
                asset: asset,
                destAddr: destAddr,
                minOut: minOut,
            };
        }
        case 'ADD': {
            return {
                type: type,
                asset: asset,
                pairedAddr: parts[3] || null,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            };
        }
        case 'WD': {
            return {
                type: type,
                asset: asset,
                basisPoints: parseInt(parts[3]),
                singleAsset: parts[4] || null,
            };
        }
        default:
            throw new Error("Unsupported memo type: ".concat(type));
    }
}
