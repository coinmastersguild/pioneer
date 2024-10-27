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

        // const developers = await pioneer.GetTransactionsByAffiliate({address:"kk"});
        // console.log("developers: ", developers.data);

        let quote = {
            "affiliate":"0x658DE0443259a1027caA976ef9a42E6982037A03",
            "sellAsset":{
                "chain":"THOR",
                "identifier":"THOR.RUNE",
                "decimals":8,
                "type":"native",
                "networkId":"cosmos:thorchain-mainnet-v1",
                "caip":"cosmos:thorchain-mainnet-v1/slip44:931",
                "symbol":"RUNE",
                "sourceList":"native-l1",
                "assetId":"cosmos:thorchain-mainnet-v1/slip44:931",
                "chainId":"cosmos:thorchain-mainnet-v1",
                "name":"THORChain",
                "networkName":"THORChain",
                "precision":8,
                "color":"#33FF99",
                "icon":"https://assets.coincap.io/assets/icons/rune@2x.png",
                "explorer":"https://viewblock.io/thorchain",
                "explorerAddressLink":"https://viewblock.io/thorchain/address/",
                "explorerTxLink":"https://viewblock.io/thorchain/tx/",
                "integrations":[
                    "mayachain",
                    "thorswap"
                ],
                "memoless":false
            },
            "sellAmount":"48.187080",
            "buyAsset":{
                "chain":"ETH",
                "identifier":"ETH.ETH",
                "decimals":18,
                "type":"native",
                "networkId":"eip155:1",
                "caip":"eip155:1/slip44:60",
                "symbol":"ETH",
                "sourceList":"native-l1",
                "assetId":"eip155:1/slip44:60",
                "chainId":"eip155:1",
                "name":"Ethereum",
                "networkName":"Ethereum",
                "precision":18,
                "color":"#5C6BC0",
                "icon":"https://assets.coincap.io/assets/icons/256/eth.png",
                "explorer":"https://etherscan.io",
                "explorerAddressLink":"https://etherscan.io/address/",
                "explorerTxLink":"https://etherscan.io/tx/",
                "relatedAssetKey":"eip155:1/slip44:60",
                "integrations":[
                    "mayachain",
                    "changelly",
                    "thorswap",
                    "rango",
                    "uniswap",
                    "chainflip"
                ],
                "memoless":false
            },
            "recipientAddress":"0x141D9959cAe3853b035000490C03991eB70Fc4aC",
            "senderAddress":"thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx",
            "slippage":"3",
            "trader":"0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        }
        let result = await pioneer.Quote(quote);
        console.log("result: ",result)

        //get pool
    } catch (e) {
        console.error(e);
    }
};

runTest();
