"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrefix = exports.getDefaultFees = exports.getDefaultFeesWithRates = exports.calcFee = exports.getDerivePath = exports.buildTx = exports.scanUTXOs = exports.validateAddress = exports.getBalance = exports.btcNetwork = exports.isTestnet = exports.arrayAverage = exports.getFee = exports.compileMemo = exports.BTC_DECIMAL = void 0;
const Bitcoin = __importStar(require("bitcoinjs-lib")); // https://github.com/bitcoinjs/bitcoinjs-lib
const sochain = __importStar(require("./sochain-api"));
const xchain_util_1 = require("@xchainjs/xchain-util");
const const_1 = require("./const");
const TX_EMPTY_SIZE = 4 + 1 + 1 + 4; //10
const TX_INPUT_BASE = 32 + 4 + 1 + 4; // 41
const TX_INPUT_PUBKEYHASH = 107;
const TX_OUTPUT_BASE = 8 + 1; //9
const TX_OUTPUT_PUBKEYHASH = 25;
const DUST_THRESHOLD = 1000;
exports.BTC_DECIMAL = 8;
const inputBytes = (input) => {
    return TX_INPUT_BASE + (input.witnessUtxo.script ? input.witnessUtxo.script.length : TX_INPUT_PUBKEYHASH);
};
/**
 * Compile memo.
 *
 * @param {string} memo The memo to be compiled.
 * @returns {Buffer} The compiled memo.
 */
const compileMemo = (memo) => {
    const data = Buffer.from(memo, 'utf8'); // converts MEMO to buffer
    return Bitcoin.script.compile([Bitcoin.opcodes.OP_RETURN, data]); // Compile OP_RETURN script
};
exports.compileMemo = compileMemo;
/**
 * Get the transaction fee.
 *
 * @param {UTXOs} inputs The UTXOs.
 * @param {FeeRate} feeRate The fee rate.
 * @param {Buffer} data The compiled memo (Optional).
 * @returns {number} The fee amount.
 */
const getFee = (inputs, feeRate, data = null) => {
    let sum = TX_EMPTY_SIZE +
        inputs.reduce((a, x) => a + inputBytes(x), 0) +
        inputs.length + // +1 byte for each input signature
        TX_OUTPUT_BASE +
        TX_OUTPUT_PUBKEYHASH +
        TX_OUTPUT_BASE +
        TX_OUTPUT_PUBKEYHASH;
    if (data) {
        sum += TX_OUTPUT_BASE + data.length;
    }
    const fee = sum * feeRate;
    return fee > const_1.MIN_TX_FEE ? fee : const_1.MIN_TX_FEE;
};
exports.getFee = getFee;
/**
 * Get the average value of an array.
 *
 * @param {Array<number>} array
 * @returns {number} The average value.
 */
const arrayAverage = (array) => {
    let sum = 0;
    array.forEach((value) => (sum += value));
    return sum / array.length;
};
exports.arrayAverage = arrayAverage;
/**
 * Check if give network is a testnet.
 *
 * @param {Network} network
 * @returns {boolean} `true` or `false`
 */
const isTestnet = (network) => {
    return network === 'testnet';
};
exports.isTestnet = isTestnet;
/**
 * Get Bitcoin network to be used with bitcoinjs.
 *
 * @param {Network} network
 * @returns {Bitcoin.Network} The BTC network.
 */
const btcNetwork = (network) => {
    return (0, exports.isTestnet)(network) ? Bitcoin.networks.testnet : Bitcoin.networks.bitcoin;
};
exports.btcNetwork = btcNetwork;
/**
 * Get the balances of an address.
 *
 * @param {string} sochainUrl sochain Node URL.
 * @param {Network} network
 * @param {Address} address
 * @returns {Array<Balance>} The balances of the given address.
 */
const getBalance = async (params) => {
    try {
        const balance = await sochain.getBalance(params);
        return [
            {
                asset: xchain_util_1.AssetBTC,
                amount: balance,
            },
        ];
    }
    catch (error) {
        return Promise.reject(new Error('Invalid address'));
    }
};
exports.getBalance = getBalance;
/**
 * Get the balance changes amount.
 *
 * @param {number} valueOut
 * @param {Address} address
 * @param {string} sochainUrl sochain Node URL.
 * @returns {number} The change amount.
 */
const getChange = async ({ valueOut, sochainUrl, network, address }) => {
    try {
        const balances = await (0, exports.getBalance)({ sochainUrl, network, address });
        const [btcBalance] = balances.filter((balance) => (0, xchain_util_1.assetToString)(balance.asset) === (0, xchain_util_1.assetToString)(xchain_util_1.AssetBTC));
        let change = 0;
        if (btcBalance && btcBalance.amount.amount().minus(valueOut).isGreaterThan(DUST_THRESHOLD)) {
            change = btcBalance.amount.amount().minus(valueOut).toNumber();
        }
        return change;
    }
    catch (e) {
        return Promise.reject(e);
    }
};
/**
 * Validate the BTC address.
 *
 * @param {Address} address
 * @param {Network} network
 * @returns {boolean} `true` or `false`.
 */
const validateAddress = (address, network) => {
    try {
        Bitcoin.address.toOutputScript(address, (0, exports.btcNetwork)(network));
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.validateAddress = validateAddress;
/**
 * Scan UTXOs from sochain.
 *
 * @param {string} sochainUrl sochain Node URL.
 * @param {Network} network
 * @param {Address} address
 * @returns {Array<UTXO>} The UTXOs of the given address.
 */
const scanUTXOs = async (params) => {
    const utxos = await sochain.getUnspentTxs(params);
    return utxos.map((utxo) => ({
        hash: utxo.txid,
        index: utxo.output_no,
        witnessUtxo: {
            value: (0, xchain_util_1.assetToBase)((0, xchain_util_1.assetAmount)(utxo.value, exports.BTC_DECIMAL)).amount().toNumber(),
            script: Buffer.from(utxo.script_hex, 'hex'),
        },
    }));
};
exports.scanUTXOs = scanUTXOs;
/**
 * Build transcation.
 *
 * @param {BuildParams} params The transaction build options.
 * @returns {Transaction}
 */
const buildTx = async ({ amount, recipient, memo, feeRate, sender, network, sochainUrl, }) => {
    try {
        const utxos = await (0, exports.scanUTXOs)({ sochainUrl, network, address: sender });
        if (utxos.length === 0) {
            return Promise.reject(Error('No utxos to send'));
        }
        const balance = await (0, exports.getBalance)({ sochainUrl, network, address: sender });
        const [btcBalance] = balance.filter((balance) => balance.asset.symbol === xchain_util_1.AssetBTC.symbol);
        if (!btcBalance) {
            return Promise.reject(new Error('No btcBalance found'));
        }
        if (!(0, exports.validateAddress)(recipient, network)) {
            return Promise.reject(new Error('Invalid address'));
        }
        const feeRateWhole = Number(feeRate.toFixed(0));
        const compiledMemo = memo ? (0, exports.compileMemo)(memo) : null;
        const fee = (0, exports.getFee)(utxos, feeRateWhole, compiledMemo);
        if (amount.amount().plus(fee).isGreaterThan(btcBalance.amount.amount())) {
            return Promise.reject(Error('Balance insufficient for transaction'));
        }
        const psbt = new Bitcoin.Psbt({ network: (0, exports.btcNetwork)(network) }); // Network-specific
        //Inputs
        utxos.forEach((utxo) => psbt.addInput({
            hash: utxo.hash,
            index: utxo.index,
            witnessUtxo: utxo.witnessUtxo,
        }));
        // Outputs
        psbt.addOutput({ address: recipient, value: amount.amount().toNumber() }); // Add output {address, value}
        const change = await getChange({ valueOut: amount.amount().toNumber() + fee, sochainUrl, network, address: sender });
        if (change > 0) {
            psbt.addOutput({ address: sender, value: change }); // Add change
        }
        if (compiledMemo) {
            // if memo exists
            psbt.addOutput({ script: compiledMemo, value: 0 }); // Add OP_RETURN {script, value}
        }
        return { psbt, utxos };
    }
    catch (e) {
        return Promise.reject(e);
    }
};
exports.buildTx = buildTx;
/**
 * Broadcast the transaction.
 *
 * @param {BroadcastTxParams} params The transaction broadcast options.
 * @returns {TxHash} The transaction hash.
 */
// export const broadcastTx = async ({ network, txHex, blockstreamUrl }: BroadcastTxParams): Promise<TxHash> => {
//   return await blockStream.broadcastTx({ network, txHex, blockstreamUrl })
// }
/**
 * Get DerivePath.
 *
 * @param {number} index (optional)
 * @returns {DerivePath} The bitcoin derivation path by the index. (both mainnet and testnet)
 */
const getDerivePath = (index = 0) => ({
    mainnet: `84'/0'/0'/0/${index}`,
    testnet: `84'/1'/0'/0/${index}`,
});
exports.getDerivePath = getDerivePath;
/**
 * Calculate fees based on fee rate and memo.
 *
 * @param {FeeRate} feeRate
 * @param {string} memo
 * @returns {BaseAmount} The calculated fees based on fee rate and the memo.
 */
const calcFee = (feeRate, memo) => {
    const compiledMemo = memo ? (0, exports.compileMemo)(memo) : null;
    const fee = (0, exports.getFee)([], feeRate, compiledMemo);
    return (0, xchain_util_1.baseAmount)(fee);
};
exports.calcFee = calcFee;
/**
 * Get the default fees with rates.
 *
 * @returns {FeesWithRates} The default fees and rates.
 */
const getDefaultFeesWithRates = () => {
    const rates = {
        fastest: 50,
        fast: 20,
        average: 10,
    };
    const fees = {
        type: 'byte',
        fast: (0, exports.calcFee)(rates.fast),
        average: (0, exports.calcFee)(rates.average),
        fastest: (0, exports.calcFee)(rates.fastest),
    };
    return {
        fees,
        rates,
    };
};
exports.getDefaultFeesWithRates = getDefaultFeesWithRates;
/**
 * Get the default fees.
 *
 * @returns {Fees} The default fees.
 */
const getDefaultFees = () => {
    const { fees } = (0, exports.getDefaultFeesWithRates)();
    return fees;
};
exports.getDefaultFees = getDefaultFees;
/**
 * Get address prefix based on the network.
 *
 * @param {Network} network
 * @returns {string} The address prefix based on the network.
 *
 **/
const getPrefix = (network) => (network === 'testnet' ? 'tb1' : 'bc1');
exports.getPrefix = getPrefix;
