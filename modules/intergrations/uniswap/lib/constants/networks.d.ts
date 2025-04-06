import { ChainId } from '@uniswap/sdk-core';
import { SupportedInterfaceChain } from './chains';
/**
 * Public JSON-RPC endpoints.
 * These are used if the integrator does not provide an endpoint, or if the endpoint does not work.
 *
 * MetaMask allows switching to any URL, but displays a warning if it is not on the "Safe" list:
 * https://github.com/MetaMask/metamask-mobile/blob/bdb7f37c90e4fc923881a07fca38d4e77c73a579/app/core/RPCMethods/wallet_addEthereumChain.js#L228-L235
 * https://chainid.network/chains.json
 *
 * These "Safe" URLs are listed first, followed by other fallback URLs, which are taken from chainlist.org.
 */
export declare const PUBLIC_RPC_URLS: Record<SupportedInterfaceChain, string[]>;
/**
 * Application-specific JSON-RPC endpoints.
 * These are URLs which may only be used by the interface, due to origin policies, &c.
 */
export declare const APP_RPC_URLS: Record<SupportedInterfaceChain, string[]>;
export declare const INFURA_PREFIX_TO_CHAIN_ID: {
    [prefix: string]: ChainId;
};
