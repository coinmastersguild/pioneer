"use strict";
/*
        Across Integration
                - Highlander
*/
const TAG = " | Across | ";
const { uuid } = require('uuidv4');
const log = require('@pioneer-platform/loggerdog')();
let { caipToNetworkId, shortListSymbolToCaip, ChainToNetworkId } = require("@pioneer-platform/pioneer-caip");
const axios = require('axios');
const EIP155_MAINNET_CHAINS = {
    'eip155:1': {
        chainId: 1,
        WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        name: 'Ethereum',
        logo: '/chain-logos/eip155-1.png',
        rgb: '99, 125, 234',
        rpc: 'https://eth.llamarpc.com',
        defaultGasLimit: 250000,
        namespace: 'eip155'
    },
    'eip155:8453': {
        chainId: 8453,
        WETH: '0x4200000000000000000000000000000000000006',
        name: 'Base',
        logo: '/chain-logos/base.png',
        rgb: '242, 242, 242',
        rpc: 'https://mainnet.base.org',
        defaultGasLimit: 135120,
        namespace: 'eip155'
    }
};
let networkSupport = [
    ChainToNetworkId["ETH"],
    ChainToNetworkId["BASE"],
];
module.exports = {
    init: function (settings) {
        return true;
    },
    networkSupport: function () {
        return networkSupport;
    },
    getQuote: function (quote) {
        return get_quote(quote);
    },
};
// Simplified version that just returns mock data
const get_quote = async function (quote) {
    let tag = TAG + " | get_quote | ";
    try {
        let output = {};
        if (!quote.sellAsset)
            throw new Error("missing sellAsset");
        if (!quote.buyAsset)
            throw new Error("missing buyAsset");
        if (!quote.sellAmount)
            throw new Error("missing sellAmount");
        if (!quote.senderAddress)
            throw new Error("missing senderAddress");
        if (!quote.recipientAddress)
            throw new Error("missing recipientAddress");
        if (!quote.slippage)
            throw new Error("missing slippage");
        if (!networkSupport.includes(caipToNetworkId(quote.buyAsset))) {
            throw new Error("unsupported buyAsset");
        }
        if (!networkSupport.includes(caipToNetworkId(quote.sellAsset))) {
            throw new Error("unsupported sellAsset");
        }
        // Mock output data instead of making actual API calls
        output.txs = [];
        output.meta = {
            quoteMode: "ERC20-ERC20"
        };
        output.steps = 1;
        output.complete = true;
        output.type = 'EVM';
        output.id = uuid();
        // Return a dummy transaction
        output.txs.push({
            type: "evm",
            description: 'swap tokens',
            chain: caipToNetworkId(quote.sellAsset),
            txParams: {
                to: '0x1234567890123456789012345678901234567890', // Mock address
                from: quote.senderAddress,
                data: '0x', // Mock data
                value: '0x0',
                gas: '0x1',
                gasPrice: '0x1',
                nonce: 0
            }
        });
        return output;
    }
    catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
};
