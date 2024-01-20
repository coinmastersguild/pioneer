const assert = require('assert');
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

const { tokenToCaip, caipToThorchain, caipToRango } = require("../lib");

// Test data for multiple tokens
const tokens = [
    {
        address: "0xeA6887e4a9CdA1B77E70129E5Fba830CdB5cdDef",
        chain: "AVAX",
        identifier: "AVAX.IMX.a-0XEA6887E4A9CDA1B77E70129E5FBA830CDB5CDDEF",
        decimals: 18,
        caip: "eip155:43114/erc20:0XEA6887E4A9CDA1B77E70129E5FBA830CDB5CDDEF",
        rangoName: {
            blockchain:'AVAX_CCHAIN',
            symbol:'IMX.a',
            address:'0XEA6887E4A9CDA1B77E70129E5FBA830CDB5CDDEF'
        }
    },
    {
        chain: "BCH",
        identifier: "BCH.BCH",
        decimals: 8,
        caip: "bip122:000000000000000000651ef99cb9fcbe/slip44:145",
        rangoName: {
            blockchain:'BCH',
            symbol:'BCH',
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
    });

    // Log the summary report
    console.log(`\nTest Summary:\nPassed: ${passed}\nFailed: ${failed}`);
}

// Run the tests
runTests();
