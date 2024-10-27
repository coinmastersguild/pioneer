// Import the Pioneer class from the module
const Pioneer = require("../lib").default;

// Configure the spec URL and query key
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
//process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
let spec = process.env['URL_PIONEER_SPEC']
const config = {
    queryKey:'key:261f0935-c025-475c-b630-b3d010a9e0de',
    //queryKey: 'key:39c95ff7-8b86-49bd-bd42-b30697a8d72c',
};

// Define an async function to run the test
const runTest = async () => {
    try {
        // Initialize the Pioneer instance
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();


        let invocationId = 'unk4imcb04oannfr'
        let input = {
            _id: '6498ecddb5372c67f558bd66',
            blockchain: 'ethereum',
            caip: 'eip155:1/slip44:60',
            chainId: 1,
            description: 'more info here: https://ethereum.org This is a EVM network with chainId: 1 Follows EIP:155',
            explorer: 'https://ethereum.org',
            facts: [
                {
                    signer: '0x2356a15042f98f0a53784f42237bd4b2873aadcf',
                    payload: '{"blockchain":"ethereum","symbol":"ETH","chainId":1}',
                    signature: '0xf3fa773a26d0ab763f15e3764adf0d0c103b5698be1e29bd7fa65bb5612aa7f202541ea6692bd507e7c9dae4dba6b369483819eb8588230b3c9f1287a3751f131b'
                }
            ],
            faucets: [],
            feeAssetCaip: 'eip155:1/slip44:60',
            feeAssetName: 'ethereum',
            feeAssetRank: 2,
            feeAssetSymbol: 'ETH',
            image: 'https://pioneers.dev/coins/ethereum-mainnet.png',
            isCharted: false,
            name: 'ethereum',
            network: 'ETH',
            service: null,
            symbol: 'ETH',
            tags: [
                'KeepKeySupport',
                'DappSupport',
                'WalletConnectSupport',
                'EVM',
                'EIP:155',
                'ethereum',
                'Ether',
                'ETH',
                1,
                null
            ],
            type: 'EVM'
        }
        let objective = "given object determining completeness and correctness, and return a score, and a list of missing fields, and actions a human should take to verify data"
        let schema = {
            type: "options node/asset/blockchain",
            completeness: " 1 - 10 options",
            correctness: " 1 - 10 options",
            missing: "array of missing fields",
            analysis: " verbal summary of the data",
            topics: "array of topics related to the data",
            actions: "set of actionalables for a human to take to verify data",
        }
        let functions = []
        let inference = await pioneer.Inference({input,objective,schema,functions})
        console.log('inference: ',inference)
        console.log('inference: ',JSON.stringify(inference))

        //search asset by chainId and symbol

        //search dapps by chain

        //search dapps by asset

    } catch (e) {
        console.error(e);
    }
};

runTest();
