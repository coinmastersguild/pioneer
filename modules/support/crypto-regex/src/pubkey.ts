
/*
    classifyPubkey
 */
const bitcoinRegex     = require('bitcoin-regex');
const ethereumRegex    = require('ethereum-regex');
const litecoinRegex    = require('litecoin-regex');
const dogecoinRegex    = require('dogecoin-regex');
const bitcoincashRegex = require('bitcoincash-regex');
const dashRegex        = require('dash-regex');
const moneroRegex      = require('monero-regex');
const rippleRegex      = require('ripple-regex');
const neoRegex         = require('neo-regex');
const WAValidator = require('wallet-address-validator');
// @ts-ignore
const cashaddr = require('cashaddrjs');




/**
 * Validates a cryptocurrency address based on the provided symbol.
 *
 * @param {string} address - The cryptocurrency address to validate.
 * @param {string} symbol - The symbol of the cryptocurrency (e.g., 'BTC', 'ETH').
 * @param {string} [networkType='prod'] - The network type ('prod' for production, 'testnet' for test network, 'both' for either).
 * @returns {boolean} - Returns true if the address is a valid wallet address for the specified crypto currency, otherwise false.
 */
export function validateCryptoAddress(address:any, symbol:any, networkType = 'prod') {
    let isValid = false;

    // Handle special validations for RUNE, CACAO, and BCH
    switch (symbol.toUpperCase()) {
        case 'RUNE':
            // Assume 't' is the valid starting character for RUNE addresses
            isValid = address.startsWith('t');
            break;
        case 'CACAO':
            // Assume 'm' is the valid starting character for CACAO addresses
            isValid = address.startsWith('m');
            break;
        case 'BCH':
            isValid = bitcoincashRegex({exact: true}).test(address)
            break;
        default:
            // Use wallet-address-validator for other cryptocurrencies
            isValid = WAValidator.validate(address, symbol, networkType);
            break;
    }
    return isValid;
}

export function classifyPubkey(address:string) {
    if (bitcoinRegex({exact: true}).test(address)) return 'BTC';
    else if (ethereumRegex({exact: true}).test(address)) return 'ETH';
    else if (litecoinRegex({exact: true}).test(address)) return 'LTC';
    else if (dogecoinRegex({exact: true}).test(address)) return 'DOGE';
    else if (dashRegex({exact: true}).test(address)) return 'DASH';
    else if (moneroRegex({exact: true}).test(address)) return 'XMR';
    else if (rippleRegex({exact: true}).test(address)) return 'XRP';
    else if (bitcoincashRegex.format('cashaddr', {exact: true}).test(address)) return 'BCH';
    else if (neoRegex({exact: true}).test(address)) return 'NEO'

    //Hacky, hard coded
    switch(address[0]) {
        //Dash multi-sig p2sh
        case "S":
            return 'DASH'
            break;
        //Doge multi-sig p2sh
        case "A":
            return 'DOGE'
            break;
        //Doge multi-sig p2sh
        case "9":
            return 'DOGE'
            break;
    }

    return 'Cryptocurrency could not be detected'
}
