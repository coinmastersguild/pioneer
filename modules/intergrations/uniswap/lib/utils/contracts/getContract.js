"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContract = getContract;
const constants_1 = require("@ethersproject/constants");
const contracts_1 = require("@ethersproject/contracts");
const address_1 = require("@ethersproject/address");
function isAddress(value) {
    if (!value) {
        return false;
    }
    try {
        // Alphabetical letters must be made lowercase for getAddress to work.
        // See documentation here: https://docs.ethers.io/v5/api/utils/address/
        return (0, address_1.getAddress)(value.toLowerCase());
    }
    catch {
        return false;
    }
}
function getContract(address, ABI, provider, account) {
    if (!isAddress(address) || address === constants_1.AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`);
    }
    return new contracts_1.Contract(address, ABI, getProviderOrSigner(provider, account));
}
function getProviderOrSigner(provider, account) {
    return account ? provider.getSigner(account).connectUnchecked() : provider;
}
