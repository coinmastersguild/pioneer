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

        // let info = await pioneer.SearchDappsByName({name:"sha"})
        // console.log("info: ",info.data)

        /*
        {
            sortBy: string;
            limit: number;
            skip: number;
            sortOrder?: string;
            filterTags?: string[];
            isWhitelisted?: boolean;
            blockchain?: string;
        }
         */

        // let info = await pioneer.SearchDapps({limit:1000,skip:0,sortBy:"score",isWhitelisted:true})
        // // console.log("info: ",info.data.dapps)
        // console.log("info: ",info.data.dapps[0].score)
        // console.log("info: ",info.data.dapps[1].score)
        // console.log("info: ",info.data.dapps[100].score)
        // console.log("info: ",info.data.total)

        //searchBlockchains
        // let search = {
        //     limit:1000,
        //     skip:0,
        //     collection:"blockchains",
        // }
        
        /*
            collection: string;
            limit: number;
            skip: number;
            sortBy?: string;
            sortOrder?: string;
            filterTags?: string[];
            isWhitelisted?: boolean;
            blockchain?: string;
         */
        
        // let search = {
        //     limit:100,
        //     skip:0,
        //     collection:"assets",
        //     searchQuery:"ether",
        //     searchFields:["symbol"],
        // }
        //
        // let info = await pioneer.SearchAtlas(search)
        // console.log("info: ",info.data)
        // console.log("info: ",info.data.results)
        // console.log("info: ",info.data.results[0].name)
        // console.log("info: ",info.data.results[1].name)
        // console.log("info: ",info.data.results[99].name)
        // console.log("total: ",info.data.total)
        
        //search by caip
        //BCH
        // let caip = "bip122:000000000000000000651ef99cb9fcbe"
        //BTC
        // let caip = "bip122:000000000019d6689c085ae165831e93/slip44:0"
        // let asset = await pioneer.AssetByCaip({caip})
        // console.log("asset: ",asset.data)
        // console.log("asset: ",asset.data[0].caip)
        
        //search assets by name
        // let info = await pioneer.SearchByName({name:"bitcoin"})
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        //search chains by name

        //search asset by name AND chainId
        let chainId = 'eip155:56'
        let assetName = 'a'
        let info = await pioneer.SearchByNameAndChainId({name:assetName,chainId})
        console.log("info: ",info.data)

        //search asset by chainId and symbol

        //search dapps by chain

        //search dapps by asset

    } catch (e) {
        console.error(e);
    }
};

runTest();
