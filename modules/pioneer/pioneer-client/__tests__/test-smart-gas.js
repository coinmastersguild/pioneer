// Import the Pioneer class from the module
const Pioneer = require("../lib").default;

// Configure the spec URL and query key
// process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
let spec = process.env['URL_PIONEER_SPEC']
const config = {
    queryKey:'key:39c95ff7-8b86-49bd-bd42-b30697a8d72c',
    //queryKey: 'key:39c95ff7-8b86-49bd-bd42-b30697a8d72c',
};


let example = {
    "_id": {
        "$oid": "649f3bb36e364200136d2db2"
    },
    "invokeId": "invoke:5AYQE2Cik8s6ypJwhb3zmY",
    "success": true,
    "analysis": {
        "summary": "This function doesn't appear to be calling any token or ETH transfers. We recommend allowing this transaction",
        "isDangerousOperation": false,
        "recommendedAction": "ALLOW",
        "addressDetails": {
            "name": "No Flags Detected",
            "isMaliciousAddress": false,
            "isAssociatedWithProtocol": false,
            "tags": {
                "THEFT": false,
                "CYBERCRIME": false,
                "NO_DATA": true,
                "SANCTIONED": false,
                "MIXER": false,
                "BOT": false,
                "WASH_TRADER": false
            }
        }
    },
    "isEIP1559": false,
    "original": {
        "addressNList": [
            2147483692,
            2147483708,
            2147483648,
            0,
            0
        ],
        "from": "0x38829598219482Aaa6eB05736FCf462acF9B3db0",
        "chainId": 1,
        "nonce": "0x6",
        "value": "0x2df85d331a7b40000",
        "data": "0x3598d8ab000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000017bcf558d90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000869584cd000000000000000000000000c770eefad204b5180df6a14ee197d99d808ee52d00000000000000000000000000000000000000000000009babe1d2d8649f3ba1",
        "gasLimit": "0x20ab1",
        "to": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
        "gasPrice": "0x866d1e646"
    },
    "isError": false,
    "recommended": {
        "addressNList": [
            2147483692,
            2147483708,
            2147483648,
            0,
            0
        ],
        "from": "0x38829598219482Aaa6eB05736FCf462acF9B3db0",
        "chainId": 1,
        "data": "0x3598d8ab000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000017bcf558d90000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002bc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20001f4a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000000000000000000000869584cd000000000000000000000000c770eefad204b5180df6a14ee197d99d808ee52d00000000000000000000000000000000000000000000009babe1d2d8649f3ba1",
        "to": "0xdef1c0ded9bec7f1a1670819833240f027b25eff",
        "value": "0x2df85d331a7b40000",
        "gasLimit": "0x0xcf08",
        "gas": "0x08ffd8d1a9"
    }
}

// Define an async function to run the test
const runTest = async () => {
    try {
        // Initialize the Pioneer instance
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();

        tx = example.original
        let result = await pioneer.SmartInsight(tx);
        console.log("result: ",result.data)


    } catch (e) {
        console.error(e);
    }
};

runTest();
