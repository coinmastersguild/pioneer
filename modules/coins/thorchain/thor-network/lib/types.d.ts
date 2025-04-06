export type Chain = string;
export declare enum MemoType {
    SWAP = "SWAP",
    DEPOSIT = "DEPOSIT",
    WITHDRAW = "WITHDRAW",
    BOND = "BOND",
    UNBOND = "UNBOND",
    LEAVE = "LEAVE",
    OUTBOUND = "OUTBOUND",
    REFUND = "REFUND",
    ADD = "ADD",
    MIGRATE = "MIGRATE",
    THORNAME = "THORNAME"
}
export type BaseDecimal = string | number;
export type Asset = {
    chain: Chain;
    symbol: string;
    ticker: string;
    synth?: boolean;
};
