const errorMessages = {
  /**
   * Core
   */
  core_wallet_connection_not_found: 10001,
  core_estimated_max_spendable_chain_not_supported: 10002,
  core_extend_error: 10003,
  core_inbound_data_not_found: 10004,
  core_approve_asset_address_or_from_not_found: 10005,
  core_chain_halted: 10099,
  /**
   * Core - Wallet Connection
   */
  core_wallet_xdefi_not_installed: 10101,
  core_wallet_evmwallet_not_installed: 10102,
  core_wallet_walletconnect_not_installed: 10103,
  core_wallet_keystore_not_installed: 10104,
  core_wallet_ledger_not_installed: 10105,
  core_wallet_trezor_not_installed: 10106,
  core_wallet_keplr_not_installed: 10107,
  core_wallet_okx_not_installed: 10108,
  core_wallet_keepkey_not_installed: 10109,
  /**
   * Core - Swap
   */
  core_swap_invalid_params: 10200,
  core_swap_route_not_complete: 10201,
  core_swap_asset_not_recognized: 10202,
  core_swap_contract_not_found: 10203,
  core_swap_route_transaction_not_found: 10204,
  core_swap_contract_not_supported: 10205,
  core_swap_quote_mode_not_supported: 10207,
  /**
   * Core - Transaction
   */
  core_transaction_deposit_error: 10301,
  core_transaction_create_liquidity_rune_error: 10302,
  core_transaction_create_liquidity_asset_error: 10303,
  core_transaction_create_liquidity_invalid_params: 10304,
  core_transaction_add_liquidity_invalid_params: 10305,
  core_transaction_add_liquidity_no_rune_address: 10306,
  core_transaction_add_liquidity_rune_error: 10307,
  core_transaction_add_liquidity_asset_error: 10308,
  core_transaction_withdraw_error: 10309,
  core_transaction_deposit_to_pool_error: 10310,
  core_transaction_deposit_insufficient_funds_error: 10311,
  core_transaction_deposit_gas_error: 10312,
  core_transaction_invalid_sender_address: 10313,
  core_transaction_deposit_server_error: 10314,

  core_swap_transaction_error: 10400,
  /**
   * Wallets
   */
  wallet_ledger_connection_error: 20001,

  /**
   * Helpers
   */
  helpers_number_different_decimals: 99101,
} as const;

export type Keys = keyof typeof errorMessages;

export class SwapKitError extends Error {
  constructor(errorKey: Keys, sourceError?: any) {
    console.error(sourceError, { stack: sourceError?.stack, message: sourceError?.message });

    // @ts-ignore
    super(errorKey, { cause: { code: errorMessages[errorKey], message: errorKey } });
    Object.setPrototypeOf(this, SwapKitError.prototype);
  }
}
