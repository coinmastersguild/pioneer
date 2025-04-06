"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chainInfo_1 = require("../constants/chainInfo");
const ConfiguredJsonRpcProvider_1 = __importDefault(require("./ConfiguredJsonRpcProvider"));
/**
 * A controller which marks itself disabled on an error, and re-enables itself using exponential backoff.
 * After each retry, it will wait twice as long to retry again. After a success, it will reset the backoff.
 */
class Controller {
    constructor(minimumBackoffTime) {
        this.minimumBackoffTime = minimumBackoffTime;
        this.isEnabled = true;
        this.exponentialBackoffFactor = 1;
    }
    reset() {
        this.isEnabled = true;
        // @ts-ignore
        clearTimeout(this.timeout);
        this.timeout = undefined;
    }
    onSuccess() {
        this.reset();
        this.exponentialBackoffFactor = 1;
    }
    /**
     * Called onError.
     * Idempotent - calling this multiple times will *not* reset the exponential backoff timer.
     */
    onError() {
        this.isEnabled = false;
        if (!this.timeout) {
            this.timeout = setTimeout(() => {
                this.reset();
                this.exponentialBackoffFactor *= 2;
            }, this.minimumBackoffTime * this.exponentialBackoffFactor);
        }
    }
    get enabled() {
        return this.isEnabled;
    }
}
/**
 * An application-specific JSON-RPC provider.
 *
 * This super-provider will instantiate providers for all supported JSON-RPC URLs, so that it may use them as fallbacks.
 * It will use the first (primary) JSON-RPC URL unless there is issue, at which point it will fallback to the next, &c.,
 * retrying the former using exponential backoff. This prevents secondary URLs from permanently overtaking primary URLs.
 */
class AppJsonRpcProvider extends ConfiguredJsonRpcProvider_1.default {
    constructor(providers, { minimumBackoffTime = chainInfo_1.AVERAGE_L1_BLOCK_TIME } = {}) {
        if (providers.length === 0)
            throw new Error('Missing providers for AppJsonRpcProvider');
        super(undefined, providers[0].network);
        // AppJsonRpcProvider configures its own pollingInterval, so the encapsulated providers do not need to poll.
        // providers.forEach((provider) => (provider.pollingInterval = Infinity))
        this.providers = providers.map((provider) => ({ provider, controller: new Controller(minimumBackoffTime) }));
    }
    async perform(method, params) {
        const sortedProviders = AppJsonRpcProvider.sortProviders(this.providers);
        for (const { provider, controller } of sortedProviders) {
            try {
                const result = await provider.perform(method, params);
                controller.onSuccess();
                return result;
            }
            catch (error) {
                console.warn('rpc action failed', error);
                controller.onError();
            }
        }
        throw new Error(`All providers failed to perform the operation: ${method}`);
    }
    static sortProviders(providers) {
        // Try enabled providers before resorting to disabled providers.
        // Note that we do not filtered out disabled providers.
        return [...providers].sort(({ controller: { enabled: a } }, { controller: { enabled: b } }) => {
            if (a && !b) {
                return -1;
            }
            else if (!a && b) {
                return 1;
            }
            else {
                return 0; // sort is stable
            }
        });
    }
}
exports.default = AppJsonRpcProvider;
