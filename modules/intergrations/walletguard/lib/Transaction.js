"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressType = exports.SimulationAssetTypes = exports.SimulationChangeType = exports.SimulationWarningType = exports.ErrorType = exports.Severity = exports.WarningType = exports.RecommendedActionType = exports.Currency = exports.ExtraInfoType = exports.SimulationMethodType = exports.TokenType = exports.ResponseType = exports.TransactionType = void 0;
var TransactionType;
(function (TransactionType) {
    TransactionType["Transaction"] = "Transaction";
    TransactionType["Signature"] = "Signature";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
var ResponseType;
(function (ResponseType) {
    ResponseType["Success"] = "success";
    ResponseType["Revert"] = "revert";
    ResponseType["Error"] = "error";
})(ResponseType || (exports.ResponseType = ResponseType = {}));
var TokenType;
(function (TokenType) {
    TokenType["ERC721"] = "ERC721";
    TokenType["ERC1155"] = "ERC1155";
    TokenType["ERC20"] = "ERC20";
})(TokenType || (exports.TokenType = TokenType = {}));
var SimulationMethodType;
(function (SimulationMethodType) {
    SimulationMethodType["EthSignTypedDataV3"] = "eth_signTypedData_v3";
    SimulationMethodType["EthSignTypedDataV4"] = "eth_signTypedData_v4";
    SimulationMethodType["EthSendTransaction"] = "eth_sendTransaction";
    SimulationMethodType["EthSign"] = "eth_sign";
    SimulationMethodType["PersonalSign"] = "personal_sign";
})(SimulationMethodType || (exports.SimulationMethodType = SimulationMethodType = {}));
;
;
;
;
var ExtraInfoType;
(function (ExtraInfoType) {
    ExtraInfoType["UnresolvableSignature"] = "UNRESOLVABLE_SIGNATURE";
})(ExtraInfoType || (exports.ExtraInfoType = ExtraInfoType = {}));
var Currency;
(function (Currency) {
    // add support for more currencies here in the future
    Currency["USD"] = "USD";
})(Currency || (exports.Currency = Currency = {}));
var RecommendedActionType;
(function (RecommendedActionType) {
    RecommendedActionType["None"] = "NONE";
    RecommendedActionType["Warn"] = "WARN";
    RecommendedActionType["Block"] = "BLOCK";
})(RecommendedActionType || (exports.RecommendedActionType = RecommendedActionType = {}));
var WarningType;
(function (WarningType) {
    WarningType["Bypass"] = "BYPASS";
    WarningType["Similarity"] = "SIMILARITY";
    WarningType["RecentlyCreated"] = "RECENTLY_CREATED";
    WarningType["Malware"] = "MALWARE";
    WarningType["Homoglyph"] = "HOMOGLYPH";
    WarningType["Blocklisted"] = "BLOCKLISTED";
    WarningType["MLInference"] = "ML_INFERENCE";
    WarningType["Drainer"] = "DRAINER";
    WarningType["BlurListing"] = "BLUR_LISTING";
    WarningType["OpenseaListing"] = "OPENSEA_LISTING";
    WarningType["EthSign"] = "ETH_SIGN";
    WarningType["LooksrareListing"] = "LOOKSRARE_LISTING";
    WarningType["DrainerRequest"] = "DRAINER_REQUEST";
})(WarningType || (exports.WarningType = WarningType = {}));
var Severity;
(function (Severity) {
    Severity["Low"] = "LOW";
    Severity["High"] = "HIGH";
    Severity["Critical"] = "CRITICAL";
})(Severity || (exports.Severity = Severity = {}));
var ErrorType;
(function (ErrorType) {
    ErrorType["Unauthorized"] = "UNAUTHORIZED";
    ErrorType["InsufficientFunds"] = "INSUFFICIENT_FUNDS";
    ErrorType["MaxFeePerGasLessThanBlockBaseFee"] = "MAX_FEE_PER_GAS_LESS_THAN_BLOCK_BASE_FEE";
    ErrorType["UnsupportedSignature"] = "UNSUPPORTED_SIGNATURE";
    ErrorType["Revert"] = "REVERT";
    ErrorType["TooManyRequests"] = "TOO_MANY_REQUESTS";
    ErrorType["GeneralError"] = "ERROR";
    ErrorType["UnknownError"] = "UNKNOWN_ERROR";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
var SimulationWarningType;
(function (SimulationWarningType) {
    SimulationWarningType["None"] = "NONE";
    SimulationWarningType["Info"] = "INFO";
    SimulationWarningType["Warn"] = "WARN";
})(SimulationWarningType || (exports.SimulationWarningType = SimulationWarningType = {}));
var SimulationChangeType;
(function (SimulationChangeType) {
    // v0 (+ everything from v1 except bid, listing, and revoke)
    SimulationChangeType["OpenSeaListing"] = "OPENSEA_LISTING";
    SimulationChangeType["OpenSeaReceive"] = "OPENSEA_RECEIVE";
    SimulationChangeType["LooksRareAskReceive"] = "LOOKSRARE_ASK_RECEIVE";
    SimulationChangeType["LooksRareAskListing"] = "LOOKSRARE_ASK_LISTING";
    SimulationChangeType["LooksRareBidReceive"] = "LOOKSRARE_BID_RECEIVE";
    SimulationChangeType["LooksRareBidOffer"] = "LOOKSRARE_BID_OFFER";
    SimulationChangeType["ReceiveApproval"] = "RECEIVE_APPROVAL";
    SimulationChangeType["ReceiveApprovalForAll"] = "RECEIVE_APPROVAL_FOR_ALL";
    SimulationChangeType["ListingReceive"] = "LISTING_RECEIVE";
    SimulationChangeType["ListingTransfer"] = "LISTING_TRANSFER";
    SimulationChangeType["PermitTransfer"] = "PERMIT_TRANSFER";
    SimulationChangeType["PermitReceive"] = "PERMIT_RECEIVE";
    // v1
    SimulationChangeType["ApprovalForAll"] = "APPROVAL_FOR_ALL";
    SimulationChangeType["Approve"] = "APPROVE";
    SimulationChangeType["RevokeApprovalForAll"] = "REVOKE_APPROVAL_FOR_ALL";
    SimulationChangeType["Revoke"] = "REVOKE_APPROVE";
    SimulationChangeType["Transfer"] = "TRANSFER";
    SimulationChangeType["Receive"] = "RECEIVE";
    SimulationChangeType["Bidding"] = "BIDDING";
    SimulationChangeType["Listing"] = "LISTING";
})(SimulationChangeType || (exports.SimulationChangeType = SimulationChangeType = {}));
var SimulationAssetTypes;
(function (SimulationAssetTypes) {
    SimulationAssetTypes["ERC20"] = "ERC20";
    SimulationAssetTypes["ERC721"] = "ERC721";
    SimulationAssetTypes["ERC1155"] = "ERC1155";
    SimulationAssetTypes["Native"] = "NATIVE";
})(SimulationAssetTypes || (exports.SimulationAssetTypes = SimulationAssetTypes = {}));
var AddressType;
(function (AddressType) {
    AddressType["EOA"] = "EOA";
    AddressType["Contract"] = "CONTRACT";
})(AddressType || (exports.AddressType = AddressType = {}));
