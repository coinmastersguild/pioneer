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

// Define an async function to run the test
const runTest = async () => {
    try {
        // Initialize the Pioneer instance
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();

        // const user = await pioneer.User();
        // console.log("user: ", user.data);

        //get node for chainId
        // let chainId = 1
        // let result = await pioneer.GetEvmNode({chainId});
        // console.log("result: ",result.data)

        //pioneer.SearchNodesByType({type:"unchained"})
        let result = await pioneer.SearchNodesByType({type:"unchained"})
        console.log("result: ",result.data)

        //
        // let tx = {
        //     "addressNList": [
        //         2147483692,
        //         2147483708,
        //         2147483648,
        //         0,
        //         0
        //     ],
        //     "from": "0xC3aFFff54122658b89C31183CeC4F15514F34624",
        //     "chainId": 1,
        //     "data": "0x3593564c000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000649c688300000000000000000000000000000000000000000000000000000000000000020b080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000002386f26fc1000000000000000000000000000000000000000000000000002fa3933ffc89d5739200000000000000000000000000000000000000000000000000000000000000a000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000c770eefad204b5180df6a14ee197d99d808ee52d",
        //     "gasLimit": "0x7a120",
        //     "to": "0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad",
        //     "value": "0x2386f26fc10000",
        //     "nonce": "0x75",
        //     "maxPriorityFeePerGas": "0xcc9b43",
        //     "maxFeePerGas": "0x0"
        // }
        //
        // let result = await pioneer.SmartInsight(tx);
        // console.log("result: ",result.data)
        
        
    } catch (e) {
        console.error(e);
    }
};

runTest();
