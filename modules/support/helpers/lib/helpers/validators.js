"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIdentifier = void 0;
const types_1 = require("@coinmasters/types");
const supportedChains = Object.values(types_1.Chain);
const validateIdentifier = (identifier = '') => {
    const uppercasedIdentifier = identifier.toUpperCase();
    const [chain] = uppercasedIdentifier.split('.');
    if (supportedChains.includes(chain))
        return true;
    const [synthChain] = uppercasedIdentifier.split('/');
    if (supportedChains.includes(synthChain))
        return true;
    throw new Error(`Invalid identifier: ${identifier}. Expected format: <Chain>.<Ticker> or <Chain>.<Ticker>-<ContractAddress>`);
};
exports.validateIdentifier = validateIdentifier;
