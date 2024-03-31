/*
    Thorchain Memo Toolkit
    ----------------------
*/

const assetShortCodeMap:any = {
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
function interpretAssetShortCode(shortCode:string) {
    return assetShortCodeMap[shortCode] || shortCode;
}

// Define the base transaction interface
interface BaseTx {
    type: string;
    asset: string;
    destAddr: string;
}

// Specific transaction interfaces
interface SwapTx extends BaseTx {
    lim?: number;
    interval?: number;
    quantity?: number;
    affiliate?: string;
    fee?: number;
    dexAggregatorAddr?: string;
    finalAssetAddr?: string;
    minAmountOut?: number;
}

interface DepositTx extends BaseTx {
    affiliate?: string;
    fee?: number;
}

interface WithdrawTx extends BaseTx {
    pool: string;
    basisPoints?: number;
}

interface LoanTx extends BaseTx {
    minOut?: number;
    affiliate?: string;
    fee?: number;
}

interface LoanOpenTx extends BaseTx {
    minOut?: number;
    affiliate?: string;
    fee?: number;
}

interface LoanRepayTx extends BaseTx {
    minOut?: number;
}

interface AddLiquidityTx extends BaseTx {
    pairedAddr?: string;
    affiliate?: string;
    fee?: number;
}

interface WithdrawLiquidityTx extends BaseTx {
    basisPoints: number;
    singleAsset?: string;
}

interface BondTx extends BaseTx {
    nodeAddr: string;
    provider?: string;
    fee?: number;
}

interface UnbondTx extends BaseTx {
    nodeAddr: string;
    amount: number;
    provider?: string;
}

interface MigrateTx extends BaseTx {
    blockHeight: number;
}

interface NoOpTx extends BaseTx {
    noVault?: boolean;
}

// Additional interface for Aggregate Swap Transactions
interface AggregateSwapTx extends SwapTx {
    dexAggregatorAddr: string;
    finalAssetAddr: string;
    minAmountOut: number;
}

// Utility function to interpret other shortened parts (e.g., scientific notation)
function interpretShortenedPart(part:any) {
    if (part.includes('e')) {
        const [base, exponent] = part.split('e').map(Number);
        return base * Math.pow(10, exponent);
    }
    return part;
}

// Function to build an Aggregate Swap transaction memo
function buildAggregateSwapMemo(tx: AggregateSwapTx): string {
    const limIntervalQuantity = `${tx.lim || ''}/${tx.interval || ''}/${tx.quantity || ''}`;
    const parts = [
        'SWAP',
        tx.asset,
        tx.destAddr,
        limIntervalQuantity,
        tx.affiliate || '',
        tx.fee?.toString() || '',
        tx.dexAggregatorAddr,
        tx.finalAssetAddr,
        tx.minAmountOut.toString()
    ];
    return truncateMemo(parts.join(':'));
}

// More transaction types (LoanRepaymentTx, LiquidityTx, etc.) can be defined similarly

// Utility function to check and truncate memo length
function truncateMemo(memo: string, limit: number = 250): string {
    const buffer = Buffer.from(memo, 'utf-8');
    if (buffer.length > limit) {
        throw new Error(`Memo exceeds the ${limit} byte limit.`);
    }
    return memo;
}

// Utility function for converting numbers to scientific notation if needed
function toScientificNotation(number:any) {
    if (number > 1000000) { // Adjust the threshold as needed
        const exponent = Math.floor(Math.log10(number));
        const base = number / Math.pow(10, exponent);
        return `${base.toFixed(1)}e${exponent}`;
    }
    return number.toString();
}

// Function to build a Swap transaction memo
function buildSwapMemo(tx: SwapTx): string {
    const assetShort = Object.keys(assetShortCodeMap).find(key => assetShortCodeMap[key] === tx.asset) || tx.asset;

    let parts = [
        '=', // Shorthand for SWAP
        assetShort,
        tx.destAddr
    ];

    // Handle lim, interval, and quantity
    if (tx.lim || tx.interval || tx.quantity) {
        const lim = tx.lim ? toScientificNotation(tx.lim) : '';
        const interval = tx.interval ? toScientificNotation(tx.interval) : '';
        const quantity = tx.quantity ? toScientificNotation(tx.quantity) : '';
        parts.push(`${lim}/${interval}/${quantity}`);
    } else {
        parts.push(''); // Add an empty string to represent missing lim/interval/quantity
    }

    // Append other parts, handling empty fields appropriately
    parts.push(tx.affiliate || '');
    parts.push(tx.fee ? toScientificNotation(tx.fee) : '');
    parts.push(tx.dexAggregatorAddr || '');
    parts.push(tx.finalAssetAddr || '');
    parts.push(tx.minAmountOut ? toScientificNotation(tx.minAmountOut) : '');

    // Join parts with ':' and correctly handle empty fields
    let memo = parts.join(':');
    memo = memo.replace(/:{2,}/g, '::'); // Replace multiple colons with double colons
    memo = memo.replace(/:+$/, ''); // Remove trailing colons

    return truncateMemo(memo);
}

// Function to build a Deposit transaction memo
function buildDepositMemo(tx: DepositTx): string {
    const feeValue = tx.fee ?? 0; // Use 0 as a default if tx.fee is undefined
    const fee = isNaN(feeValue) ? '0.05' : feeValue.toString();
    const affiliate = tx.affiliate || 'thor1affiliate'; // Default affiliate
    const parts = [
        'DEPOSIT',
        tx.asset,
        tx.destAddr,
        affiliate,
        fee
    ];
    return truncateMemo(parts.join(':'));
}

// Function to build a Withdraw transaction memo
function buildWithdrawMemo(tx: WithdrawTx): string {
    const parts = [
        'WITHDRAW',
        tx.asset,
        tx.destAddr,
        tx.pool,
        tx.basisPoints?.toString() || ''
    ];
    return truncateMemo(parts.join(':'));
}

// Function to build a Loan Open transaction memo
function buildLoanOpenMemo(tx: LoanOpenTx): string {
    const feeValue = tx.fee ?? 0; // Use 0 as a default if tx.fee is undefined
    const fee = isNaN(feeValue) ? '0.2' : feeValue.toString();
    const affiliate = tx.affiliate || 'thor1loanaff'; // Default affiliate
    const parts = [
        'LOAN+',
        tx.asset,
        tx.destAddr,
        tx.minOut?.toString() || '',
        affiliate,
        fee
    ];
    return truncateMemo(parts.join(':'));
}

function buildLoanRepayMemo(tx: LoanRepayTx): string {
    const parts = [
        'LOAN-',
        tx.asset,
        tx.destAddr,
        tx.minOut?.toString() || ''
    ];
    return truncateMemo(parts.join(':'));
}

function buildAddLiquidityMemo(tx: AddLiquidityTx): string {
    const parts = [
        'ADD',
        tx.asset,
        tx.pairedAddr || '',
        tx.affiliate || '',
        tx.fee?.toString() || ''
    ];
    return truncateMemo(parts.join(':'));
}

function buildWithdrawLiquidityMemo(tx: WithdrawLiquidityTx): string {
    const parts = [
        'WD',
        tx.asset,
        tx.basisPoints.toString(),
        tx.singleAsset || ''
    ];
    return truncateMemo(parts.join(':'));
}

// Function to build a Bond transaction memo
function buildBondMemo(tx: BondTx): string {
    const parts = [
        'BOND',
        tx.nodeAddr,
        tx.provider || '',
        tx.fee?.toString() || ''
    ];
    return truncateMemo(parts.join(':'));
}

// Function to build an Unbond transaction memo
function buildUnbondMemo(tx: UnbondTx): string {
    const parts = [
        'UNBOND',
        tx.nodeAddr,
        tx.amount.toString(),
        tx.provider || ''
    ];
    return truncateMemo(parts.join(':'));
}

// Function to build a Migrate transaction memo
function buildMigrateMemo(tx: MigrateTx): string {
    return truncateMemo(`MIGRATE:${tx.blockHeight}`);
}

// Function to build a No-Operation (NOOP) memo
function buildNoOpMemo(tx: NoOpTx): string {
    const parts = [
        '*NOOP*',
        tx.noVault ? 'NOVAULT' : ''
    ];
    return truncateMemo(parts.filter(part => part).join(':'));
}

// Main function to create a memo from any transaction type
export function createMemo(tx: BaseTx): string {
    switch (tx.type) {
        case 'SWAP':
            return buildSwapMemo(tx as SwapTx);
        case 'DEPOSIT':
            return buildDepositMemo(tx as DepositTx);
        case 'WITHDRAW':
            return buildWithdrawMemo(tx as WithdrawTx);
        case 'BOND':
            return buildBondMemo(tx as BondTx);
        case 'UNBOND':
            return buildUnbondMemo(tx as UnbondTx);
        case 'MIGRATE':
            return buildMigrateMemo(tx as MigrateTx);
        case '*NOOP*':
            return buildNoOpMemo(tx as NoOpTx);
        case 'AGGREGATE_SWAP':
            return buildAggregateSwapMemo(tx as AggregateSwapTx);
        case 'LOAN+':
            return buildLoanOpenMemo(tx as LoanOpenTx);
        case 'LOAN-':
            return buildLoanRepayMemo(tx as LoanRepayTx);
        case 'ADD':
            return buildAddLiquidityMemo(tx as AddLiquidityTx);
        case 'WD':
            return buildWithdrawLiquidityMemo(tx as WithdrawLiquidityTx);
        default:
            throw new Error('Unsupported transaction type.');
    }
}

// Function to parse a memo string into a transaction object
export function parseMemo(memo: string): BaseTx {
    const parts = memo.split(':').map(part => {
        return interpretAssetShortCode(part) || interpretShortenedPart(part);
    });

    const typeMap:any = {
        '=': 'SWAP',
        '+': 'DEPOSIT',
        '-': 'WITHDRAW',
        // Add other shorthand mappings as needed
    };

    const type = typeMap[parts[0]] || parts[0];
    const asset = parts[1];
    const destAddr = parts[2];

    switch (type) {
        case 'SWAP': {
            const asset = parts[1];
            const destAddr = parts[2];
            const [lim, interval, quantity] = parts[3].split('/');
            return {
                type: 'SWAP', // Type of the transaction
                asset,        // Asset being swapped
                destAddr,     // Destination address
                lim: lim ? parseInt(lim) : null, // Limit (optional, null if not provided)
                interval: interval ? parseInt(interval) : null, // Interval (optional)
                quantity: quantity ? parseInt(quantity) : null, // Quantity (optional)
                affiliate: parts[4] || null, // Affiliate (optional)
                fee: parts[5] ? parseFloat(parts[5]) : null, // Fee (optional)
                dexAggregatorAddr: parts[6] || null, // DEX aggregator address (optional)
                finalAssetAddr: parts[7] || null, // Final asset address (optional)
                minAmountOut: parts[8] ? parseInt(parts[8]) : null, // Minimum amount out (optional)
            } as SwapTx;
        }
        case 'DEPOSIT':
            return {
                type,
                asset,
                destAddr,
                affiliate: parts[3] || null,
                fee: parts[4] ? parseFloat(parts[4]) : null,
            } as DepositTx;
        case 'WITHDRAW':
            return {
                type,
                asset,
                destAddr,
                pool: parts[3],
                basisPoints: parts[4] ? parseInt(parts[4]) : null,
            } as WithdrawTx;
        case 'LOAN+':
            return {
                type,
                asset,
                destAddr,
                minOut: parts[3] ? parseInt(parts[3]) : null,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            } as LoanOpenTx;
        case 'LOAN-':
            return {
                type,
                asset,
                destAddr,
                minOut: parts[3] ? parseInt(parts[3]) : null,
            } as LoanRepayTx;
        case 'ADD':
            return {
                type,
                asset,
                pairedAddr: parts[3] || null,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            } as AddLiquidityTx;
        case 'WD':
            return {
                type,
                asset,
                basisPoints: parseInt(parts[3]),
                singleAsset: parts[4] || null,
            } as WithdrawLiquidityTx;
        case 'BOND':
            return {
                type,
                asset,
                nodeAddr: parts[3],
                provider: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            } as BondTx;
        case 'UNBOND':
            return {
                type,
                asset,
                nodeAddr: parts[3],
                amount: parseInt(parts[4]),
                provider: parts[5] || null,
            } as UnbondTx;
        case 'MIGRATE':
            return {
                type,
                asset,
                blockHeight: parseInt(parts[1]), // Ensure this parses the block height correctly
            } as MigrateTx;
        case '*NOOP*':
            return {
                type,
                asset,
                noVault: parts[1] === 'NOVAULT',
            } as NoOpTx;
        case 'AGGREGATE_SWAP': {
            const [lim, interval, quantity] = parts[3].split('/');
            return {
                type: 'SWAP', // Using 'SWAP' as the type for consistency
                asset,
                destAddr,
                lim: lim ? parseInt(lim) : null,
                interval: interval ? parseInt(interval) : null,
                quantity: quantity ? parseInt(quantity) : null,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
                dexAggregatorAddr: parts[6],
                finalAssetAddr: parts[7],
                minAmountOut: parts[8] ? parseInt(parts[8]) : null,
            } as AggregateSwapTx;
        }
        case 'LOAN+': {
            const minOut = parts[3] ? parseInt(parts[3]) : null;
            return {
                type,
                asset,
                destAddr,
                minOut,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            } as LoanOpenTx;
        }
        case 'LOAN-': {
            const minOut = parts[3] ? parseInt(parts[3]) : null;
            return {
                type,
                asset,
                destAddr,
                minOut,
            } as LoanRepayTx;
        }
        case 'ADD': {
            return {
                type,
                asset,
                pairedAddr: parts[3] || null,
                affiliate: parts[4] || null,
                fee: parts[5] ? parseFloat(parts[5]) : null,
            } as AddLiquidityTx;
        }
        case 'WD': {
            return {
                type,
                asset,
                basisPoints: parseInt(parts[3]),
                singleAsset: parts[4] || null,
            } as WithdrawLiquidityTx;
        }
        default:
            throw new Error(`Unsupported memo type: ${type}`);
    }
}
