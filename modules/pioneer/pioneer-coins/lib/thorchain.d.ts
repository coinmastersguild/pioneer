interface BaseTx {
    type: string;
    asset: string;
    destAddr: string;
}
export declare function createMemo(tx: BaseTx): string;
export declare function parseMemo(memo: string): BaseTx;
export {};
