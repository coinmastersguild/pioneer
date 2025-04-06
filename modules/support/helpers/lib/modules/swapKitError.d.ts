declare const errorMessages: {
    /**
     * Core
     */
    readonly core_wallet_connection_not_found: 10001;
    readonly core_estimated_max_spendable_chain_not_supported: 10002;
    readonly core_extend_error: 10003;
    readonly core_inbound_data_not_found: 10004;
    readonly core_approve_asset_address_or_from_not_found: 10005;
    readonly core_chain_halted: 10099;
    /**
     * Core - Wallet Connection
     */
    readonly core_wallet_xdefi_not_installed: 10101;
    readonly core_wallet_evmwallet_not_installed: 10102;
    readonly core_wallet_walletconnect_not_installed: 10103;
    readonly core_wallet_keystore_not_installed: 10104;
    readonly core_wallet_ledger_not_installed: 10105;
    readonly core_wallet_trezor_not_installed: 10106;
    readonly core_wallet_keplr_not_installed: 10107;
    readonly core_wallet_okx_not_installed: 10108;
    readonly core_wallet_keepkey_not_installed: 10109;
    /**
     * Core - Swap
     */
    readonly core_swap_invalid_params: 10200;
    readonly core_swap_route_not_complete: 10201;
    readonly core_swap_asset_not_recognized: 10202;
    readonly core_swap_contract_not_found: 10203;
    readonly core_swap_route_transaction_not_found: 10204;
    readonly core_swap_contract_not_supported: 10205;
    readonly core_swap_quote_mode_not_supported: 10207;
    /**
     * Core - Transaction
     */
    readonly core_transaction_deposit_error: 10301;
    readonly core_transaction_create_liquidity_rune_error: 10302;
    readonly core_transaction_create_liquidity_asset_error: 10303;
    readonly core_transaction_create_liquidity_invalid_params: 10304;
    readonly core_transaction_add_liquidity_invalid_params: 10305;
    readonly core_transaction_add_liquidity_no_rune_address: 10306;
    readonly core_transaction_add_liquidity_rune_error: 10307;
    readonly core_transaction_add_liquidity_asset_error: 10308;
    readonly core_transaction_withdraw_error: 10309;
    readonly core_transaction_deposit_to_pool_error: 10310;
    readonly core_transaction_deposit_insufficient_funds_error: 10311;
    readonly core_transaction_deposit_gas_error: 10312;
    readonly core_transaction_invalid_sender_address: 10313;
    readonly core_transaction_deposit_server_error: 10314;
    readonly core_swap_transaction_error: 10400;
    /**
     * Wallets
     */
    readonly wallet_ledger_connection_error: 20001;
    /**
     * Helpers
     */
    readonly helpers_number_different_decimals: 99101;
};
export type Keys = keyof typeof errorMessages;
export declare class SwapKitError extends Error {
    constructor(errorKey: Keys, sourceError?: any);
}
export {};
