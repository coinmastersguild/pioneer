const assert = require('assert');
const { createMemo, parseMemo } = require('../lib/index.js');

// Sample memos for testing
const memos = [
    //real tests
    '=:DASH.DASH:Xursn5XQzLEa2J91uEWeAVsKpLsBTf393x::ELD:75'
    //AI generated tests
    // // Test memo for Swap Transaction
    // 'SWAP:BTC.BTC:bnb1xyz:100000000/10/1:thor1aff:0.1:0xAggregatorAddr:0xFinalAsset:1000',
    //
    // // Test memo for Deposit Transaction
    // 'DEPOSIT:ETH.ETH:eth1address::thor1affiliate:0.05',
    //
    // // Test memo for Withdraw Transaction
    // 'WITHDRAW:ETH.ETH:eth1withdraw:ETH.ETH:1000',
    //
    // // Test memo for Loan Open Transaction
    // 'LOAN+:ETH.ETH:eth1loan:500::thor1loanaff:0.2',
    //
    // // Test memo for Loan Repay Transaction
    // 'LOAN-:ETH.ETH:eth1repay:300',
    //
    // // Test memo for Add Liquidity Transaction
    // 'ADD:BTC.BTC:btc1addliquidity:thor1pair:thor1addliquidityaff:0.15',
    //
    // // Test memo for Withdraw Liquidity Transaction
    // 'WD:BTC.BTC:500:BTC.BTC',
    //
    // // Test memo for Bond Transaction
    // 'BOND:thor1nodeaddr::thor1provider:0.3',
    //
    // // Test memo for Unbond Transaction
    // 'UNBOND:thor1nodeaddr:100000000:thor1provider',
    //
    // // Test memo for Migrate Transaction
    // 'MIGRATE:123456',
    //
    // // Test memo for No-Operation (NOOP)
    // '*NOOP*:NOVAULT',

];
function runTests() {
    let passed = 0;
    let failed = 0;

    memos.forEach((memo, index) => {
        console.log(`Testing Memo ${index + 1}`);

        // Test memo parsing
        const parsedTx = parseMemo(memo);
        console.log(`Parsed Transaction:`, parsedTx);

        // Recreate the memo from the parsed transaction
        const recreatedMemo = createMemo(parsedTx);
        console.log(`Recreated Memo: ${recreatedMemo}`);

        // Validate that the recreated memo matches the original memo
        try {
            assert.strictEqual(recreatedMemo, memo);
            console.log(`Test ${index + 1} Passed: Recreated memo matches original.`);
            passed++;
        } catch (error) {
            console.error(`Test ${index + 1} Failed:`, error);
            failed++;
        }
    });

    // Log the summary report
    console.log(`\nTest Summary:\nPassed: ${passed}\nFailed: ${failed}`);
}

// Run the tests
runTests();
