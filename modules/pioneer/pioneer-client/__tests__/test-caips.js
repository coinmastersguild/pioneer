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

        //ETH
        let symbol = "ETH"
        // let name = "ethereum"
        // let caip = "eip155:1/slip44:60"
        
        //avalanche
        let name = "avalanche"
        
        //BCH
        // let symbol = "BCH"
        // let name = "ethereum"
        let caip = "eip155:1/slip44:60"
        //BTC
        // let symbol = "DASH"
        //DOGE
        // let symbol = "LTC"
        //BNB

        //LTC

        //fix
        // let name = "bitcoincash"
        // let name = "optimism"
        // let name = "bnbsmartchain"

        //caip by chainId
        // const ALL_CHAINS = [
        //     { name: "ethereum", chain_id: 1, symbol: "ETH" },
        //     { name: "polygon", chain_id: 137, symbol: "MATIC" },
        //     { name: "pulsechain", chain_id: 369, symbol: "PLS" },
        //     { name: "optimism", chain_id: 10, symbol: "ETH" },
        //     { name: "gnosis", chain_id: 100, symbol: "xDAI" },
        //     { name: "binance-smart-chain", chain_id: 56, symbol: "BNB" },
        //     { name: "smart-bitcoin-cash", chain_id: 10000, symbol: "BCH" },
        //     { name: "arbitrum", chain_id: 42161, symbol: "ARB" }, //TODO push node
        //     { name: "fuse", chain_id: 122, symbol: "FUSE" },
        //     { name: "bittorrent", chain_id: 199, symbol: "BTT" },//TODO push node
        //     { name: "celo", chain_id: 42220, symbol: "CELO" },
        //     { name: "avalanche-c-chain", chain_id: 43114, symbol: "AVAX" },
        //     { name: "görli", chain_id: 5, symbol: "GOR" },
        //     { name: "eos", chain_id: 59, symbol: "EOS" },
        //     { name: "ethereum-classic", chain_id: 61, symbol: "ETC" }, //TODO push node
        //     { name: "evmos", chain_id: 9001, symbol: "EVMOS" },
        //     { name: "poa-core", chain_id: 99, symbol: "POA" }, //TODO push node
        // ];
        //
        // let chainId_map = {}
        // let name_map = {}
        // for(let i = 0; i < ALL_CHAINS.length; i++){
        //     let chainId = ALL_CHAINS[i].chain_id
        //     console.log(chainId)
        //
        //     let blockchain = await pioneer.GetBlockchainByChainId({chainId})
        //     // console.log("blockchain: ",blockchain.data)
        //     console.log("blockchain: ",blockchain.data[0].caip)
        //     console.log("blockchain: ",blockchain.data[0].name)
        //     chainId_map[chainId] = blockchain.data[0].caip
        //     name_map[blockchain.data[0].name] = blockchain.data[0].caip
        // }
        // console.log("chainId_map: ",chainId_map)
        // console.log("name_map: ",name_map)



        // let asset = await pioneer.GetAsset({symbol:"USDT"})
        // console.log("asset: ",asset.data)
        // console.log("asset: ",asset.data[0].caip)

        // let asset = await pioneer.AssetByString({name})
        // console.log("asset: ",asset.data)
        // console.log("asset: ",asset.data[0].caip)
        
        // let asset = await pioneer.AssetByCaip({caip})
        // console.log("asset: ",asset.data)
        // console.log("asset: ",asset.data[0].caip)

        // let blockchain = await pioneer.GetCaipFromBlockchain({name})
        // console.log("blockchain: ",blockchain.data)
        // console.log("blockchain: ",blockchain.data[0].caip)

        // const COIN_MAP_LONG = {
        //     BTC: "bitcoin",
        //     ATOM: "cosmos",
        //     OSMO: "osmosis",
        //     // BTCT: "testnet",
        //     BCH: "bitcoincash",
        //     LTC: "litecoin",
        //     DASH: "dash",
        //     DGB: "digiByte",
        //     DOGE: "dogecoin",
        //     RUNE: "thorchain",
        //     ETH: "ethereum",
        //     AVAX: "avalanche",
        //     ADA: "cardano",
        //     BNB: "binance",
        //     EOS: "eos",
        //     FIO: "fio",
        // };
        // let symbol_map = {}
        // let long_map = {}
        // for(let i = 0; i < Object.keys(COIN_MAP_LONG).length; i++){
        //     let name = Object.keys(COIN_MAP_LONG)[i]
        //     let long = COIN_MAP_LONG[name]
        //     console.log("name: ",name)
        //     let asset = await pioneer.GetAsset({symbol:name})
        //     console.log("asset: ",asset.data)
        //     console.log("asset: ",asset.data[0].caip)
        //     symbol_map[name] = asset.data[0].caip
        //     long_map[long] = asset.data[0].caip
        // }
        // console.log("symbol_map: ",symbol_map)
        // console.log("long_map: ",long_map)
        //
        //get a blockchain by symbol
        // let blockchain = await pioneer.GetBlockchain({symbol})
        // console.log("blockchain: ",blockchain.data)
        // console.log("blockchain: ",blockchain.data[0].caip)
        // caip = "placeholder:caip:binance:native:bnb-beacon-chain"

        console.log(caip)

        //assetByCaip
        let asset = await pioneer.AssetByCaip({caip})
        console.log("asset: ",asset.data)

        // let blockchain = await pioneer.BlockchainByCaip({caip})
        // console.log("blockchain: ",blockchain.data)
        // console.log("blockchain: ",blockchain.data[0].caip)

        // let node = await pioneer.NodesByCaip({caip})
        // console.log("node: ",node.data)
        // console.log("node: ",node.data[0].caip)

        //get a blockchain by long name
        
        //get an asset by fuzzy long name
        
        //
    } catch (e) {
        console.error(e);
    }
};

runTest();
