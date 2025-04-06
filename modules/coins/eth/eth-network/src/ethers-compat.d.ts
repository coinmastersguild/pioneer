// Compatibility layer for ethers v5 to v6 migration
import { ethers } from 'ethers';

declare module 'ethers' {
  // Add missing types from ethers v5
  export type BigNumber = bigint;
  
  export namespace utils {
    function getAddress(address: string): string;
    function parseUnits(value: string, unitName?: string | number): bigint;
  }
  
  export namespace providers {
    const InfuraProvider: typeof ethers.InfuraProvider;
  }
}

// v5 compatibility for @ethersproject modules
declare module '@ethersproject/abstract-provider' {
  export type Provider = ethers.AbstractProvider;
  export type TransactionResponse = ethers.TransactionResponse;
}

declare module '@ethersproject/providers' {
  export class EtherscanProvider extends ethers.JsonRpcProvider {
    constructor(network: string, apiKey?: string);
  }
  export function getDefaultProvider(network: string): ethers.Provider;
}

declare module '@ethersproject/abi' {
  export class Interface {
    constructor(abi: any[]);
    encodeFunctionData(functionFragment: string, values: any[]): string;
    decodeFunctionResult(functionFragment: string, data: string): any[];
  }
}

declare module 'ethers/lib/utils' {
  export function parseUnits(value: string, unitName?: string | number): bigint;
  export function toUtf8Bytes(text: string): Uint8Array;
} 