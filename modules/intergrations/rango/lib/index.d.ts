declare const TAG = " | rango | ";
type BestRouteResponse = any;
type EvmTransaction = any;
type MetaResponse = any;
type TransactionStatus = any;
type TransactionStatusResponse = any;
type WalletRequiredAssets = any;
declare let getRangoBlockchainName: any;
declare const log: any;
declare let shortListSymbolToCaip: any, caipToNetworkId: any;
declare const mockRangoClient: {
    getAllMetadata: () => Promise<{}>;
    getBestRoute: () => Promise<{
        requestId: string;
        result: {
            outputAmount: string;
        };
    }>;
    createTransaction: () => Promise<{
        transaction: {
            to: string;
            from: string;
        };
    }>;
    checkStatus: () => Promise<{
        status: string;
    }>;
};
declare let rango: {
    getAllMetadata: () => Promise<{}>;
    getBestRoute: () => Promise<{
        requestId: string;
        result: {
            outputAmount: string;
        };
    }>;
    createTransaction: () => Promise<{
        transaction: {
            to: string;
            from: string;
        };
    }>;
    checkStatus: () => Promise<{
        status: string;
    }>;
};
declare let networkSupport: any[];
declare let assetSupport: any[];
declare const get_transaction_status: (requestId: string, step: number, txid: string) => Promise<{
    status: string;
    txId: string;
    requestId: string;
    step: number;
} | undefined>;
declare const create_transaction: (id: any, step: number, validateBalance?: boolean, validateFee?: boolean) => Promise<{
    transaction: {
        to: string;
        from: string;
        data: string;
        value: string;
        gasLimit: string;
        gasPrice: string;
        maxPriorityFeePerGas: string;
        maxFeePerGas: string;
        nonce: number;
    };
} | undefined>;
declare const get_quote: (quote: any) => Promise<any>;
