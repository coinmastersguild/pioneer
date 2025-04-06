"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.derivationPathToString = exports.validateTHORName = exports.getTHORNameCost = void 0;
// 10 rune for register, 1 rune per year
// MINIMUM_REGISTRATION_FEE = 11
const getTHORNameCost = (year) => {
    if (year < 0)
        throw new Error('Invalid number of year');
    return 10 + year;
};
exports.getTHORNameCost = getTHORNameCost;
const validateTHORName = (name) => {
    if (name.length > 30)
        return false;
    const regex = /^[a-zA-Z0-9+_-]+$/g;
    return !!name.match(regex);
};
exports.validateTHORName = validateTHORName;
const derivationPathToString = ([network, chainId, account, change, index]) => {
    const shortPath = typeof index !== 'number';
    return `${network}'/${chainId}'/${account}'/${change}${shortPath ? '' : `/${index}`}`;
};
exports.derivationPathToString = derivationPathToString;
