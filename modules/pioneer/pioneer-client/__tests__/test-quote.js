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
                "chain":"DOGE",
                "identifier":"DOGE.DOGE",
                "decimals":8,
                "type":"native",
                "networkId":"bip122:00000000001a91e3dace36e2be3bf030",
                "caip":"bip122:00000000001a91e3dace36e2be3bf030/slip44:3",
                "symbol":"DOGE",
                "sourceList":"thorchain",
                "assetId":"bip122:00000000001a91e3dace36e2be3bf030/slip44:3",
                "chainId":"bip122:00000000001a91e3dace36e2be3bf030",
                "name":"Dogecoin",
                "networkName":"Dogecoin",
                "precision":8,
                "color":"#FFC107",
                "icon":"https://assets.coincap.io/assets/icons/256/doge.png",
                "explorer":"https://live.blockcypher.com",
                "explorerAddressLink":"https://live.blockcypher.com/doge/address/",
                "explorerTxLink":"https://live.blockcypher.com/doge/tx/",
                "integrations":[
                    "changelly",
                    "thorswap",
                    "rango"
                ],
                "memoless":true,
                "ticker":"DOGE",
                "balance":"",
                "valueUsd":0,
                "pubkey":null,
                "address":null,
                "priceUsd":0.13308,
                "context":"external"
            },
            "sellAmount":"300.00000",
            "buyAsset":{
                "chain":"BCH",
                "identifier":"BCH.BCH",
                "decimals":8,
                "type":"native",
                "networkId":"bip122:000000000000000000651ef99cb9fcbe",
                "caip":"bip122:000000000000000000651ef99cb9fcbe/slip44:145",
                "symbol":"BCH",
                "sourceList":"thorchain",
                "assetId":"bip122:000000000000000000651ef99cb9fcbe/slip44:145",
                "chainId":"bip122:000000000000000000651ef99cb9fcbe",
                "name":"Bitcoin Cash",
                "networkName":"Bitcoin Cash",
                "precision":8,
                "color":"#8BC34A",
                "icon":"https://assets.coincap.io/assets/icons/256/bch.png",
                "explorer":"https://blockchair.com",
                "explorerAddressLink":"https://blockchair.com/bitcoin-cash/address/",
                "explorerTxLink":"https://blockchair.com/bitcoin-cash/transaction/",
                "integrations":[
                    "changelly",
                    "thorswap",
                    "rango"
                ],
                "memoless":true,
                "ticker":"BCH",
                "balance":"",
                "valueUsd":0,
                "pubkey":"qpd00ucur9gl7rzwe7lqmu9yljr9ajv92q09a0jdrl",
                "address":"qpd00ucur9gl7rzwe7lqmu9yljr9ajv92q09a0jdrl",
                "context":"external",
                "priceUsd":432.18,
                "label":"exodus"
            },
            "recipientAddress":"qpd00ucur9gl7rzwe7lqmu9yljr9ajv92q09a0jdrl",
            "slippage":"3",
            "trader":"0x141D9959cAe3853b035000490C03991eB70Fc4aC",
            "memoless":true
        }
        let result = await pioneer.Quote(quote);
        console.log("result: ",result)

        //get pool
    } catch (e) {
        console.error(e);
    }
};

runTest();
