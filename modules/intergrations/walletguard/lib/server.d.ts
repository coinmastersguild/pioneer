import { SimulationResponse, TransactionArgs, TransactionType, SoftLockedAssetsResponse } from './Transaction';
export declare const fetchTransaction: (args: TransactionArgs, type: TransactionType) => Promise<SimulationResponse>;
export declare const fetchLockedAssets: (address: string) => Promise<SoftLockedAssetsResponse | null>;
export declare function getTransactionEndpoint(chainId: string): string;
export declare function getSignatureEndpoint(chainId: string): string;
