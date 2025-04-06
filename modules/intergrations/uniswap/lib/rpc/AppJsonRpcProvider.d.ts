import { JsonRpcProvider } from '@ethersproject/providers';
import ConfiguredJsonRpcProvider from './ConfiguredJsonRpcProvider';
/**
 * A controller which marks itself disabled on an error, and re-enables itself using exponential backoff.
 * After each retry, it will wait twice as long to retry again. After a success, it will reset the backoff.
 */
declare class Controller {
    private minimumBackoffTime;
    private isEnabled;
    private timeout;
    private exponentialBackoffFactor;
    constructor(minimumBackoffTime: number);
    private reset;
    onSuccess(): void;
    /**
     * Called onError.
     * Idempotent - calling this multiple times will *not* reset the exponential backoff timer.
     */
    onError(): void;
    get enabled(): boolean;
}
interface ControlledProvider {
    provider: JsonRpcProvider;
    controller: Controller;
}
interface AppJsonRpcProviderOptions {
    minimumBackoffTime?: number;
}
/**
 * An application-specific JSON-RPC provider.
 *
 * This super-provider will instantiate providers for all supported JSON-RPC URLs, so that it may use them as fallbacks.
 * It will use the first (primary) JSON-RPC URL unless there is issue, at which point it will fallback to the next, &c.,
 * retrying the former using exponential backoff. This prevents secondary URLs from permanently overtaking primary URLs.
 */
export default class AppJsonRpcProvider extends ConfiguredJsonRpcProvider {
    providers: ReadonlyArray<ControlledProvider>;
    constructor(providers: JsonRpcProvider[], { minimumBackoffTime }?: AppJsonRpcProviderOptions);
    perform(method: string, params: {
        [name: string]: any;
    }): Promise<any>;
    static sortProviders(providers: ReadonlyArray<ControlledProvider>): Array<ControlledProvider>;
}
export {};
