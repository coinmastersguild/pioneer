"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApproveInfo = getApproveInfo;
exports.getWrapInfo = getWrapInfo;
const permit2_sdk_1 = require("@uniswap/permit2-sdk");
const sdk_core_1 = require("@uniswap/sdk-core");
const providers_1 = require("../constants/providers");
const tokens_1 = require("../constants/tokens");
const erc20_json_1 = __importDefault(require("../uniswap/src/abis/erc20.json"));
const weth_json_1 = __importDefault(require("../uniswap/src/abis/weth.json"));
const getContract_1 = require("../utils/contracts/getContract");
// TODO(UniswapX): add fallback gas limits per chain? l2s have higher costs
const WRAP_FALLBACK_GAS_LIMIT = 45000;
const APPROVE_FALLBACK_GAS_LIMIT = 65000;
async function getApproveInfo(account, currency, amount, usdCostPerGas) {
    // native currencies do not need token approvals
    if (currency.isNative)
        return { needsApprove: false };
    // If any of these arguments aren't provided, then we cannot generate approval cost info
    if (!account || !usdCostPerGas)
        return { needsApprove: false };
    // routing-api under estimates gas for Arbitrum swaps so it inflates cost per gas by a lot
    // so disable showing approves for Arbitrum until routing-api gives more accurate gas estimates
    if (currency.chainId === sdk_core_1.ChainId.ARBITRUM_ONE || currency.chainId === sdk_core_1.ChainId.ARBITRUM_GOERLI) {
        return { needsApprove: false };
    }
    const provider = providers_1.RPC_PROVIDERS[currency.chainId];
    const tokenContract = (0, getContract_1.getContract)(currency.address, erc20_json_1.default, provider);
    let approveGasUseEstimate;
    try {
        const allowance = await tokenContract.callStatic.allowance(account, permit2_sdk_1.PERMIT2_ADDRESS);
        if (!allowance.lt(amount))
            return { needsApprove: false };
    }
    catch (_) {
        // If contract lookup fails (eg if Infura goes down), then don't show gas info for approving the token
        return { needsApprove: false };
    }
    try {
        const approveTx = await tokenContract.populateTransaction.approve(permit2_sdk_1.PERMIT2_ADDRESS, permit2_sdk_1.MaxUint256);
        approveGasUseEstimate = (await provider.estimateGas({ from: account, ...approveTx })).toNumber();
    }
    catch (_) {
        // estimateGas will error if the account doesn't have sufficient token balance, but we should show an estimated cost anyway
        approveGasUseEstimate = APPROVE_FALLBACK_GAS_LIMIT;
    }
    return { needsApprove: true, approveGasEstimateUSD: approveGasUseEstimate * usdCostPerGas };
}
async function getWrapInfo(needsWrap, account, chainId, amount, usdCostPerGas) {
    if (!needsWrap)
        return { needsWrap: false };
    const provider = providers_1.RPC_PROVIDERS[chainId];
    const wethAddress = tokens_1.WRAPPED_NATIVE_CURRENCY[chainId]?.address;
    // If any of these arguments aren't provided, then we cannot generate wrap cost info
    if (!wethAddress || !usdCostPerGas)
        return { needsWrap: false };
    let wrapGasUseEstimate;
    try {
        const wethContract = (0, getContract_1.getContract)(wethAddress, weth_json_1.default, provider, account);
        const wethTx = await wethContract.populateTransaction.deposit({ value: amount });
        // estimateGas will error if the account doesn't have sufficient ETH balance, but we should show an estimated cost anyway
        wrapGasUseEstimate = (await provider.estimateGas({ from: account, ...wethTx })).toNumber();
    }
    catch (_) {
        wrapGasUseEstimate = WRAP_FALLBACK_GAS_LIMIT;
    }
    return { needsWrap: true, wrapGasEstimateUSD: wrapGasUseEstimate * usdCostPerGas };
}
