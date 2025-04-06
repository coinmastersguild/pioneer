import { ChainId } from '@uniswap/sdk-core';
import AppJsonRpcProvider from '../rpc/AppJsonRpcProvider';
/** These are the only JsonRpcProviders used directly by the interface. */
export declare const RPC_PROVIDERS: {
    [ChainId.MAINNET]: AppJsonRpcProvider;
    [ChainId.GOERLI]: AppJsonRpcProvider;
    [ChainId.SEPOLIA]: AppJsonRpcProvider;
    [ChainId.OPTIMISM]: AppJsonRpcProvider;
    [ChainId.OPTIMISM_GOERLI]: AppJsonRpcProvider;
    [ChainId.ARBITRUM_ONE]: AppJsonRpcProvider;
    [ChainId.ARBITRUM_GOERLI]: AppJsonRpcProvider;
    [ChainId.POLYGON]: AppJsonRpcProvider;
    [ChainId.POLYGON_MUMBAI]: AppJsonRpcProvider;
    [ChainId.CELO]: AppJsonRpcProvider;
    [ChainId.CELO_ALFAJORES]: AppJsonRpcProvider;
    [ChainId.BNB]: AppJsonRpcProvider;
    [ChainId.AVALANCHE]: AppJsonRpcProvider;
    [ChainId.BASE]: AppJsonRpcProvider;
    [ChainId.BLAST]: AppJsonRpcProvider;
};
