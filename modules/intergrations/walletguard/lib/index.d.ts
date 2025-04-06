declare const TAG = " | WalletGuard | ";
type BaseDecimal = string | number;
declare const axios: any;
declare const log: any;
declare enum TransactionType {
    Transaction = "transaction",
    Message = "message"
}
declare enum SimulationMethodType {
    EthSendTransaction = "eth_sendTransaction",
    EthSignTransaction = "eth_signTransaction"
}
declare const fetchTransaction: (transactionArgs: any, type: TransactionType) => Promise<{
    success: boolean;
    risk: {
        score: number;
        level: string;
        alerts: never[];
    };
    simulation: {
        status: string;
        gasUsed: string;
    };
}>;
declare const simulate_tx: (chainId: any, tx: any) => Promise<{
    success: boolean;
    risk: {
        score: number;
        level: string;
        alerts: never[];
    };
    simulation: {
        status: string;
        gasUsed: string;
    };
}>;
