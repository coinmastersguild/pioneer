"use strict";
// Mock types for @coinmasters/types
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoType = void 0;
var MemoType;
(function (MemoType) {
    MemoType["SWAP"] = "SWAP";
    MemoType["DEPOSIT"] = "DEPOSIT";
    MemoType["WITHDRAW"] = "WITHDRAW";
    MemoType["BOND"] = "BOND";
    MemoType["UNBOND"] = "UNBOND";
    MemoType["LEAVE"] = "LEAVE";
    MemoType["OUTBOUND"] = "OUTBOUND";
    MemoType["REFUND"] = "REFUND";
    MemoType["ADD"] = "ADD";
    MemoType["MIGRATE"] = "MIGRATE";
    MemoType["THORNAME"] = "THORNAME";
})(MemoType || (exports.MemoType = MemoType = {}));
