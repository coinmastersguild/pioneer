"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LATEST_GOVERNOR_INDEX = exports.AVERAGE_BLOCK_TIME_IN_SECS = exports.DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS = exports.COMMON_CONTRACT_NAMES = void 0;
const sdk_core_1 = require("@uniswap/sdk-core");
exports.COMMON_CONTRACT_NAMES = {
    [sdk_core_1.ChainId.MAINNET]: {
        [sdk_core_1.UNI_ADDRESSES[sdk_core_1.ChainId.MAINNET]]: 'UNI',
        [sdk_core_1.TIMELOCK_ADDRESSES[sdk_core_1.ChainId.MAINNET]]: 'Timelock',
        [sdk_core_1.GOVERNANCE_ALPHA_V0_ADDRESSES[sdk_core_1.ChainId.MAINNET]]: 'Governance (V0)',
        [sdk_core_1.GOVERNANCE_ALPHA_V1_ADDRESSES[sdk_core_1.ChainId.MAINNET]]: 'Governance (V1)',
        [sdk_core_1.GOVERNANCE_BRAVO_ADDRESSES[sdk_core_1.ChainId.MAINNET]]: 'Governance',
        '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e': 'ENS Registry',
        '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41': 'ENS Public Resolver',
        '0xf754A7E347F81cFdc70AF9FbCCe9Df3D826360FA': 'Franchiser Factory',
    },
};
// in PoS, ethereum block time is 12s, see https://ethereum.org/en/developers/docs/blocks/#block-time
exports.DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS = 12;
// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
exports.AVERAGE_BLOCK_TIME_IN_SECS = {
    1: exports.DEFAULT_AVERAGE_BLOCK_TIME_IN_SECS,
};
exports.LATEST_GOVERNOR_INDEX = 2;
