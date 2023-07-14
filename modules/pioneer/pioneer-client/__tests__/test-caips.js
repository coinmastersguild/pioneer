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
        
        //Get an asset by symbol
        // let symbol = "BTC"

        let symbol = "ETH"
        let name = "ethereum"
        let caip = "eip155:1/slip44:60"
        
        //fix
        let name = "bitcoincash"
        let name = "optimism"
        let name = "bnbsmartchain"
        
        // let asset = await pioneer.GetAsset({symbol})
        // console.log("asset: ",asset.data)
        // console.log("asset: ",asset.data[0].caip)

        let asset = await pioneer.AssetByString({name})
        console.log("asset: ",asset.data)
        console.log("asset: ",asset.data[0].caip)
        
        // let asset = await pioneer.AssetByCaip({caip})
        // console.log("asset: ",asset.data)
        // console.log("asset: ",asset.data[0].caip)

        //get a blockchain by symbol
        // let blockchain = await pioneer.GetBlockchain({symbol})
        // console.log("blockchain: ",blockchain.data)
        // console.log("blockchain: ",blockchain.data[0].caip)

        // let blockchain = await pioneer.BlockchainByCaip({caip})
        // console.log("blockchain: ",blockchain.data)
        // console.log("blockchain: ",blockchain.data[0].caip)

        let node = await pioneer.NodesByCaip({caip})
        console.log("node: ",node.data)
        // console.log("node: ",node.data[0].caip)

        //get a blockchain by long name
        
        //get an asset by fuzzy long name
        
        //
    } catch (e) {
        console.error(e);
    }
};

runTest();
