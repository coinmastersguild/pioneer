"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const providers_1 = require("@ethersproject/providers");
const chainInfo_1 = require("../constants/chainInfo");
class ConfiguredJsonRpcProvider extends providers_1.StaticJsonRpcProvider {
    constructor(url, 
    // Including networkish allows ethers to skip the initial detectNetwork call.
    networkish, pollingInterval = chainInfo_1.AVERAGE_L1_BLOCK_TIME) {
        super(url, networkish);
        // NB: Third-party providers (eg MetaMask) will have their own polling intervals,
        // which should be left as-is to allow operations (eg transaction confirmation) to resolve faster.
        // Network providers need to update less frequently to be considered responsive.
        this.pollingInterval = pollingInterval;
    }
}
exports.default = ConfiguredJsonRpcProvider;
