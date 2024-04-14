const assert = require('assert');
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

const { thorchainToCaip, tokenToCaip, caipToThorchain, caipToRango } = require("../lib");

// Test data for multiple tokens
const tokens = [
    // {
    //     chain: "BASE",
    //     identifier: "BASE.PRO-0XEF743DF8EDA497BCF1977393C401A636518DD630",
    //     ticker: "PRO",
    //     decimals: 18,
    //     caip: "ceip155:8453/erc20:0XEF743DF8EDA497BCF1977393C401A636518DD630",
    //     rangoName: {
    //         blockchain:'BASE',
    //         symbol:'PRO',
    //         address:'0XEF743DF8EDA497BCF1977393C401A636518DD630'
    //     }
    // },
    // {
    //     chain: "AVAX",
    //     identifier: "MAYA.CACAO",
    //     ticker: "CACAO",
    //     decimals: 10,
    //     caip: "cosmos:maya-mainnet-v1/slip44:931",
    //     rangoName: {
    //         blockchain:'MAYA',
    //         symbol:'CACAO',
    //         address:null
    //     }
    // },
    // {
    //     chain: "THOR",
    //     identifier: "THOR.RUNE",
    //     ticker: "RUNE",
    //     decimals: 10,
    //     caip: "cosmos:thorchain-mainnet-v1",
    //     rangoName: {
    //         blockchain:'THOR',
    //         symbol:'RUNE',
    //         address:null
    //     }
    // },
    // {
    //     address: "0xeA6887e4a9CdA1B77E70129E5Fba830CdB5cdDef",
    //     chain: "AVAX",
    //     identifier: "AVAX.IMX.a-0xeA6887e4a9CdA1B77E70129E5Fba830CdB5cdDef",
    //     ticker: "IMX.a",
    //     decimals: 18,
    //     caip: "eip155:43114/erc20:0xeA6887e4a9CdA1B77E70129E5Fba830CdB5cdDef",
    //     rangoName: {
    //         blockchain:'AVAX_CCHAIN',
    //         symbol:'IMX.a',
    //         address:'0xeA6887e4a9CdA1B77E70129E5Fba830CdB5cdDef'
    //     }
    // },
    // {
    //     chain: "BCH",
    //     identifier: "BCH.BCH",
    //     decimals: 8,
    //     ticker: "BCH",
    //     caip: "bip122:000000000000000000651ef99cb9fcbe/slip44:145",
    //     rangoName: {
    //         blockchain:'BCH',
    //         symbol:'BCH',
    //         address:null
    //     }
    // },
    // {
    //     chain: "OSMO",
    //     identifier: "OSMO.ATOM",
    //     ticker: "ATOM",
    //     decimals: 8,
    //     caip: "cosmos:osmosis-1/ibc:B011C1A0AD5E717F674BA59FD8E05B2F946E4FD41C9CB3311C95F7ED4B815620",
    //     rangoName: {
    //         blockchain:'OSMOSIS',
    //         symbol:'ATOM',
    //         address:null
    //     }
    // },
    // {
    //     chain: "ETH",
    //     identifier: "ETH.WBTC-0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    //     address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    //     ticker: "WBTC",
    //     decimals: 8,
    //     caip: "eip155:1/erc20:0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
    //     rangoName: {
    //         blockchain:'ETH',
    //         symbol:'WBTC',
    //         address:'0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
    //     }
    // },
    {
        chain: "BASE",
        identifier: "BASE.ETH",
        ticker: "ETH",
        decimals: 18,
        caip: "eip155:8453/slip44:60",
        rangoName: {
            blockchain:'BASE',
            symbol:'ETH',
            address:null
        }
    },
    // Add more token objects here
];

// Function to run the tests and log results
function runTests() {
    let passed = 0;
    let failed = 0;

    tokens.forEach((token, index) => {
        const expandedInfo = tokenToCaip(token);
        console.log(`Token ${index + 1} expandedInfo: `, expandedInfo);

        const thorchainIdent = caipToThorchain(expandedInfo.caip, expandedInfo.ticker);
        console.log(`Token ${index + 1} thorchainIdent: `, thorchainIdent);

        const caipFromThorchain = thorchainToCaip(token.identifier);
        console.log(`Token ${index + 1} caipFromThorchain: `, caipFromThorchain);

        rangoName = caipToRango(expandedInfo.caip, expandedInfo.ticker, expandedInfo.address);
        console.log(`Token ${index + 1} rangoName: `, rangoName);

        try {
            assert.deepStrictEqual(rangoName, token.rangoName);
            console.log(`Test ${index + 1} passed: RangoName is correct.`);
            passed++;
        } catch (error) {
            console.error(`Test ${index + 1} caipToRango failed: Expected `, token.rangoName, `, got `, rangoName);
            failed++;
        }

        try {
            assert.strictEqual(thorchainIdent, token.identifier);
            console.log(`Test ${index + 1} passed: THORChain identifier is correct.`);
            passed++;
        } catch (error) {
            console.error("caipToRango Error: ", error);
            console.error(`Test ${index + 1} failed: Expected '${token.identifier}', got '${thorchainIdent}'`);
            failed++;
        }

        try {
            assert.strictEqual(caipFromThorchain, token.caip);
            console.log(`Test ${index + 1} passed: CAIP from thorchainToCaip is correct.`);
            passed++;
        } catch (error) {
            console.error("thorchainToCaip Error: ", error);
            console.error(`Test ${index + 1} failed: Expected '${token.caip}', got '${caipFromThorchain}'`);
            failed++;
        }
    });

    // Log the summary report
    console.log(`\nTest Summary:\nPassed: ${passed}\nFailed: ${failed}`);
}

// Run the tests
runTests();
