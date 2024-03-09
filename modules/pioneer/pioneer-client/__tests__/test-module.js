// Import the Pioneer class from the module
const Pioneer = require("../lib").default;

// Configure the spec URL and query key
// process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
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

        //get pools
        // const pools = await pioneer.Pools();
        // console.log("pools: ", pools.data);

        // // let info = await pioneer.SearchAssetsList({limit:10000,skip:0})
        // // console.log("info: ",info.data.length)
        // let address = "0xC8FFf0D944406A40475a0A8264328AAC8D64927B"
        // const user = await pioneer.GetPortfolio({address});
        // // // const user = await pioneer.GetNfts({address});
        // console.log("user: ", user);
        
        // const user = await pioneer.User();
        // console.log("user: ", user.data);

        // let query = "How much ETH I got?"
        // let result = await pioneer.Query({query});
        // console.log("result: ",result.data)

        // let name = "shapeshift"
        // let result = await pioneer.ListAppVotesByName({name});
        // console.log("result: ",result.data)

        // let result = await pioneer.ListDevelopers({limit:100,skip:0});
        // console.log("result: ",result.data)

        // let result = await pioneer.SyncPubkeys({network:"ethereum"});
        // console.log("result: ",result.data)

        // let result = await pioneer.SearchNodesByType({type:"blockbook"});
        // result = result.data
        // console.log("result: ",result)

        // let result = await pioneer.SearchNodesByType({type:"unchained"});
        // result = result.data
        // console.log("result: ",result)
        // let caip = "eip155:137/slip44:60"
        // let caip = "eip155:1/slip44:60"
        // //
        // // let result1 = await pioneer.GetFeeInfoByCaip({caip});
        // // console.log("result1: ",result1)
        // //
        // let address = "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        // let result = await pioneer.GetAddressInfoByCaip({caip,address});
        // console.log("result: ",result.data)
        
        //tx
        // let tx = {
        //     invocationId:"0x0",
        //     caip:"eip155:1/slip44:60",
        //     serialized:"0x02f8980181b68459682f00850969cba224830f424094360e2f3d92d23de8e5d8a461c2544aaf01eba549871550f7dca70000a4659dd2b40000000000000000000000000000000000000000000000000000000000000015c001a05232728aaf905697c36a300a9605019e7ae762cf750a18fcb83004e0f9d9baeea02814423f5243d8b07e109757c41c031e01c3d4576ee4096cb5d2157ef78f1917"
        // }
        // let data = await pioneer.Broadcast(tx)
        // console.log("data: ",data.data)

        //GetFeeInfo
        // let result = await pioneer.GetFeeInfo({coin:"BTC"});
        // console.log("result: ",result)
        //
        // let result2 = await pioneer.GetFeeInfo({coin:"DASH"});
        // console.log("result2: ",result2)

        //submit review
        // let review = {
        //     app:'shapeshift',
        //     rating: 5,
        //     text: "This is a test review",
        //     testedBlockchains: ["ethereum"],
        // }

        // let body = {
        //     signer:"foobar",
        //     payload:"bvlablabla",
        //     signature:"sigsigsigsigsigsigsigsigsigsigsigsigsigsigsigsigsigsigsigsigsig",
        //     review
        // }
        
        // let body = {
        //     "signer": "0x33b35c665496ba8e71b22373843376740401f106",
        //     "payload": "{\"type\": \"revoke\", \"app\": \"shapeshift\"}",
        //     "signature": "0x2728da70e46d3e3ef73e9304e6447f20ae1ec0e3d4b63b9764f7db72df9cf8e112c93517f514e0c909cb9e8823637615130b41390f8b6802110e9bdf083a131e1c"
        // }
        //
        // let result = await pioneer.SubmitReview(body);
        // console.log("result: ",result.data)

        //delete review

        //get reviews
        // let app = "shapeshift"
        // let result = await pioneer.ListReviewsByApp({app,limit:100,skip:0});
        // console.log("result: ",result.data)
        
        // let assets = await pioneer.GetAssets({sortBy:'name',limit:100,skip:100,sortOrder:'asc',filterTags:['']});
        // console.log("assets: ",assets.data.total)
        // console.log("assets: ",assets.data.assets.length)

        /*
                    let cache = false
            let ALL_CHAINS = [
                { name: 'ethereum', chain_id: 1, symbol: 'ETH' },
                { name: 'polygon', chain_id: 137, symbol: 'MATIC' },
                { name: 'pulsechain', chain_id: 369, symbol: 'PLS' },
                { name: 'optimism', chain_id: 10, symbol: 'ETH' },
                { name: 'gnosis', chain_id: 100, symbol: 'xDAI' },
                { name: 'binance-smart-chain', chain_id: 56, symbol: 'BNB' },
                { name: 'smart-bitcoin-cash', chain_id: 10000, symbol: 'BCH' },
                { name: 'arbitrum', chain_id: 42161, symbol: 'ARB' },
                { name: 'fuse', chain_id: 122, symbol: 'FUSE' },
                { name: 'bittorrent', chain_id: 199, symbol: 'BTT' },
                { name: 'pulsechain', chain_id: 369, symbol: 'PLS' },
                { name: 'celo', chain_id: 42220, symbol: 'CELO' },
                { name: 'avalanche-c-chain', chain_id: 43114, symbol: 'AVAX' },
                { name: 'görli', chain_id: 5, symbol: 'GOR' },
                { name: 'ethereum-classic', chain_id: 61, symbol: 'ETC' },
                { name: 'evmos', chain_id: 9001, symbol: 'EVMOS' },
                { name: 'poa-core', chain_id: 99, symbol: 'POA' },
            ]

         */

        /*
            Get blockchains to limit

            filter by EIP155

            order by rank of fee assets

           for each blockchain get 3 nodes

         */
        
        //get a tested node for eth chainId
        // let chainId = 100
        // let result = await pioneer.GetEvmNode({chainId});
        // console.log("result: ",result.data)

        // let xpub = "xpub6C32ZcmFoazJmhH5fojYAwHEggwzqo78UfbUXJjUHzxAp3k3373Yn6K56fVKkoTFehxgED6nxqeUvKX5vr8iQ3QMLcuv2pFHjJkFJ9yZMRe"
        // let newAddyIndex = await pioneer.GetChangeAddress({network:'DASH',xpub})
        // console.log("newAddyIndex: ",newAddyIndex)

        //search asset
        // let asset = "Ethereum Mainnet"
        // let result = await pioneer.SearchAssetsByName({asset});
        // console.log("result: ",result.data)

        // let symbol = "ETH"
        // let result = await pioneer.SearchAssetsBySymbol({symbol});
        // console.log("result: ",result.data)

        // let register = {
        //     "username":"user:66fefdd6-7ea9-48cf-8e69-fc74afb9c45412",
        //     "blockchains":[
        //         "bitcoin",
        //         "ethereum",
        //         "thorchain",
        //         "bitcoincash",
        //         "litecoin",
        //         "binance",
        //         "cosmos",
        //         "dogecoin"
        //     ],
        //     "publicAddress":"0x33b35c665496ba8e71b22373843376740401f106",
        //     "context":"0x33b35c665496ba8e71b22373843376740401f106.wallet.json",
        //     "walletDescription":{
        //         "context":"0x33b35c665496ba8e71b22373843376740401f106.wallet.json",
        //         "type":"metamask"
        //     },
        //     "data":{
        //         "pubkeys":[
        //             {
        //                 "pubkey":"0x33b35c665496ba8e71b22373843376740401f106",
        //                 "blockchain":"ethereum",
        //                 "symbol":"ETH",
        //                 "asset":"ethereum",
        //                 "path":"m/44'/60'/0'",
        //                 "pathMaster":"m/44'/60'/0'/0/0",
        //                 "script_type":"ethereum",
        //                 "network":"ethereum",
        //                 "master":"0x33b35c665496ba8e71b22373843376740401f106",
        //                 "type":"address",
        //                 "address":"0x33b35c665496ba8e71b22373843376740401f106"
        //             }
        //         ]
        //     },
        //     "queryKey":"sdk:pair-keepkey:0.8979919923574422"
        // }
        // let result = await pioneer.Register(register);
        // console.log("result: ",result.data)

        //swapkit v2 register
        // let register = {
        //     "username":"user:2f706dde",
        //     "publicAddress":"none",
        //     "blockchains":['fuck','off'],
        //     "context":"none",
        //     "walletDescription":{
        //         "context":"none",
        //         "type":"none"
        //     },
        //     "data":{
        //         "pubkeys":
        //             [
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"ARB",
        //                     "blockchain":"arbitrum",
        //                     "type":"address",
        //                     "master":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "pubkey":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "address":"0x2356A15042F98f0a53784F42237bd4b2873AADCF"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"AVAX",
        //                     "blockchain":"avalanche",
        //                     "type":"address",
        //                     "caip":"placeholder:caip:avalanchec:native:avalanche-c-chain",
        //                     "master":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "pubkey":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "address":"0x2356A15042F98f0a53784F42237bd4b2873AADCF"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"BNB",
        //                     "blockchain":"binance",
        //                     "type":"address",
        //                     "caip":"eip155:56/slip44:60",
        //                     "master":"bnb1ez03p4sd8lf985c0tghl9deham56692z94gthw",
        //                     "pubkey":"bnb1ez03p4sd8lf985c0tghl9deham56692z94gthw",
        //                     "address":"bnb1ez03p4sd8lf985c0tghl9deham56692z94gthw"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"BSC",
        //                     "blockchain":"unknown",
        //                     "type":"address",
        //                     "master":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "pubkey":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "address":"0x2356A15042F98f0a53784F42237bd4b2873AADCF"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"BTC",
        //                     "blockchain":"bitcoin",
        //                     "type":"address",
        //                     "caip":"bip122:000000000019d6689c085ae165831e93/slip44:0",
        //                     "master":"bc1qsppjaxn9lgp9g0raxqej97r22w4z9kt5fh8jj2",
        //                     "pubkey":"bc1qsppjaxn9lgp9g0raxqej97r22w4z9kt5fh8jj2",
        //                     "address":"bc1qsppjaxn9lgp9g0raxqej97r22w4z9kt5fh8jj2"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"BCH",
        //                     "blockchain":"bitcoincash",
        //                     "type":"address",
        //                     "caip":"bip122:000000000000000000651ef99cb9fcbe/slip44:145",
        //                     "master":"bitcoincash:qzlkgzpc2wx7f9pvvnkecc97mw0xqnhupgn44sx4wu",
        //                     "pubkey":"bitcoincash:qzlkgzpc2wx7f9pvvnkecc97mw0xqnhupgn44sx4wu",
        //                     "address":"bitcoincash:qzlkgzpc2wx7f9pvvnkecc97mw0xqnhupgn44sx4wu"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"GAIA",
        //                     "blockchain":"unknown",
        //                     "type":"address",
        //                     "master":"cosmos1yc6dftwdhgt96k8yty8djga88f3knhznfyh26k",
        //                     "pubkey":"cosmos1yc6dftwdhgt96k8yty8djga88f3knhznfyh26k",
        //                     "address":"cosmos1yc6dftwdhgt96k8yty8djga88f3knhznfyh26k"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"DOGE",
        //                     "blockchain":"dogecoin",
        //                     "type":"address",
        //                     "caip":"bip122:00000000001a91e3dace36e2be3bf030/slip44:3",
        //                     "master":"D8fBewYDtBFxgwrhx4NWADDcn7gXmN2pUz",
        //                     "pubkey":"D8fBewYDtBFxgwrhx4NWADDcn7gXmN2pUz",
        //                     "address":"D8fBewYDtBFxgwrhx4NWADDcn7gXmN2pUz"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"ETH",
        //                     "blockchain":"ethereum",
        //                     "type":"address",
        //                     "caip":"eip155:1/slip44:60",
        //                     "master":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "pubkey":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "address":"0x2356A15042F98f0a53784F42237bd4b2873AADCF"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"LTC",
        //                     "blockchain":"litecoin",
        //                     "type":"address",
        //                     "caip":"bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2",
        //                     "master":"ltc1q3ec4unagxqrft52fj2k8lh2uqkktlypgm6dx6x",
        //                     "pubkey":"ltc1q3ec4unagxqrft52fj2k8lh2uqkktlypgm6dx6x",
        //                     "address":"ltc1q3ec4unagxqrft52fj2k8lh2uqkktlypgm6dx6x"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"MAYA",
        //                     "blockchain":"unknown",
        //                     "type":"address",
        //                     "master":"",
        //                     "pubkey":"",
        //                     "address":""
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"OP",
        //                     "blockchain":"optimism",
        //                     "type":"address",
        //                     "caip":"eip155:10/slip44:60",
        //                     "master":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "pubkey":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "address":"0x2356A15042F98f0a53784F42237bd4b2873AADCF"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"MATIC",
        //                     "blockchain":"polygon",
        //                     "type":"address",
        //                     "caip":"eip155:137/slip44:60",
        //                     "master":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "pubkey":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //                     "address":"0x2356A15042F98f0a53784F42237bd4b2873AADCF"
        //                 },
        //                 {
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
        //                     "symbol":"THOR",
        //                     "blockchain":"thorchain",
        //                     "type":"address",
        //                     "caip":"cosmos:thorchain-mainnet-v1/slip44:931",
        //                     "master":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3",
        //                     "pubkey":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3",
        //                     "address":"thor1pffne8g05rjuexvtmxxppc0xhhdg7hyuj9krc3"
        //                 }
        //             ]
        //         ,
        //         "balances":
        //             [
        //                 {
        //                     "symbol":"AVAX",
        //                     "chain":"AVAX",
        //                     "ticker":"AVAX",
        //                     "type":"Native",
        //                     "balance":"0.00018375",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"AvaxClassic",
        //                     "chain":"AVAX",
        //                     "ticker":"AvaxClassic",
        //                     "type":"AVAX",
        //                     "balance":"74.04175",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"$ Free Claim and Play-0xd23345e0e6340616b1cf7200762d0289547ccf87",
        //                     "chain":"AVAX",
        //                     "ticker":"$ Free Claim and Play",
        //                     "type":"AVAX",
        //                     "balance":"500",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"AVAX-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        //                     "chain":"AVAX",
        //                     "ticker":"AVAX",
        //                     "type":"AVAX",
        //                     "balance":"0.00018375",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"BNB",
        //                     "chain":"BNB",
        //                     "ticker":"BNB",
        //                     "type":"Native",
        //                     "balance":"0.03075992",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"BABYDOGE-0x43f102bbd52259f2cfd0ef82e8807e3610ae3e40",
        //                     "chain":"BSC",
        //                     "ticker":"BABYDOGE",
        //                     "type":"BEP20",
        //                     "balance":"391197565.47720093",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"ETH",
        //                     "chain":"ETH",
        //                     "ticker":"ETH",
        //                     "type":"Native",
        //                     "balance":"0.00537313",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"UNIV2Claim",
        //                     "chain":"ETH",
        //                     "ticker":"UNIV2Claim",
        //                     "type":"ERC20",
        //                     "balance":"400.4",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"DAI-0x6b175474e89094c44da98b954eedeac495271d0f",
        //                     "chain":"ETH",
        //                     "ticker":"DAI",
        //                     "type":"ERC20",
        //                     "balance":"2.89999991",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"$ Visit NFTGiftX",
        //                     "chain":"ETH",
        //                     "ticker":"$ Visit NFTGiftX",
        //                     "type":"ERC20",
        //                     "balance":"4000.4",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"NOUNBR-0x36b2aa1795d8cdef4b784fe34045fadc45d61e8c",
        //                     "chain":"ETH",
        //                     "ticker":"NOUNBR",
        //                     "type":"ERC20",
        //                     "balance":"1.1",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"FAU-0xfab46e002bbf0b4509813474841e0716e6730136",
        //                     "chain":"ETH",
        //                     "ticker":"FAU",
        //                     "type":"ERC20",
        //                     "balance":"1000",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"LUSD-0x5f98805a4e8be255a32880fdec7f6728c6568ba0",
        //                     "chain":"ETH",
        //                     "ticker":"LUSD",
        //                     "type":"ERC20",
        //                     "balance":"2",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"OP",
        //                     "chain":"OP",
        //                     "ticker":"OP",
        //                     "type":"Native",
        //                     "balance":"0.00000089",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"ETH-0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        //                     "chain":"OP",
        //                     "ticker":"ETH",
        //                     "type":"OPTIMISM",
        //                     "balance":"0.00000089",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"ETH-0xdeaddeaddeaddeaddeaddeaddeaddeaddead0000",
        //                     "chain":"OP",
        //                     "ticker":"ETH",
        //                     "type":"OPTIMISM",
        //                     "balance":"0.00000089",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"MATIC",
        //                     "chain":"MATIC",
        //                     "ticker":"MATIC",
        //                     "type":"Native",
        //                     "balance":"2.83077868",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"MATIC-0x0000000000000000000000000000000000001010",
        //                     "chain":"MATIC",
        //                     "ticker":"MATIC",
        //                     "type":"POLYGON",
        //                     "balance":"2.83077868",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"DAI-0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
        //                     "chain":"MATIC",
        //                     "ticker":"DAI",
        //                     "type":"POLYGON",
        //                     "balance":"0.97610475",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"MaticX-0xfa68fb4628dff1028cfec22b4162fccd0d45efb6",
        //                     "chain":"MATIC",
        //                     "ticker":"MaticX",
        //                     "type":"POLYGON",
        //                     "balance":"0.93538774",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"AAVE-0xd6df932a45c0f255f85145f286ea0b292b21c90b",
        //                     "chain":"MATIC",
        //                     "ticker":"AAVE",
        //                     "type":"POLYGON",
        //                     "balance":"0.00011825",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"uni-router",
        //                     "chain":"MATIC",
        //                     "ticker":"uni",
        //                     "type":"POLYGON",
        //                     "balance":"10",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"BalancerV2",
        //                     "chain":"MATIC",
        //                     "ticker":"BalancerV2",
        //                     "type":"POLYGON",
        //                     "balance":"325",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 },
        //                 {
        //                     "symbol":"RUNE",
        //                     "chain":"THOR",
        //                     "ticker":"RUNE",
        //                     "type":"Native",
        //                     "balance":"1.9004648",
        //                     "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet"
        //                 }
        //
        //         ]
        //     },
        //     "queryKey":"key:33826151-e44b-4ea1-b226-5851a88f0e5e",
        //     "auth":"lol",
        //     "provider":"lol"
        // }
        // let result = await pioneer.Register(register);
        // console.log("result: ",result.data)

        // let result = await pioneer.Register(register);
        // console.log("result: ",result.data)

        //register keepkey

        // let register = {
        //     "username": "user:9cb50cce",
        //     "blockchains": [
        //         "bitcoin",
        //         "ethereum",
        //         "thorchain",
        //         "bitcoincash",
        //         "litecoin",
        //         "binance",
        //         "cosmos",
        //         "dogecoin"
        //     ],
        //     "context": "0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet",
        //     "publicAddress": "0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //     "walletDescription": {
        //         "context": "0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet",
        //         "type": "keepkey"
        //     },
        //     "data": {
        //         "pubkeys": [
        //             {
        //                 "path": "m/44'/0'/0'",
        //                 "pathMaster": "m/44'/0'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "xpub",
        //                 "xpub": true,
        //                 "pubkey": "xpub6BxKtd6aAuz23XqtWXeSqxShJZn8yqiUmaTdvsPWS3riKkNRcXEPmn1CXmKM1M43mrWfN5QwjdLRghZLrgwMLCeRZqZNuYhVNXr6Pp7aDsH",
        //                 "note": "Bitcoin account 0",
        //                 "symbol": "BTC",
        //                 "blockchain": "bitcoin",
        //                 "network": "bitcoin",
        //                 "script_type": "p2pkh",
        //                 "master": "1JNYtQsc1pizKbn3ScbEPfQ7WcxNqeUHNB",
        //                 "address": "1JNYtQsc1pizKbn3ScbEPfQ7WcxNqeUHNB"
        //             },
        //             {
        //                 "path": "m/84'/0'/0'",
        //                 "pathMaster": "m/84'/0'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "zpub",
        //                 "zpub": true,
        //                 "pubkey": "xpub6D6UctxqkwVv1sTLwvEfJJJnGEKC6XiKbRfwzsYgWmXGAEwPQ7T2cWzRggxVsHjYzA4m33d7VzgPZyNpW5SFmmjY1g8EFFVwy8CtN8xGhTS",
        //                 "note": "Bitcoin account Native Segwit (Bech32)",
        //                 "symbol": "BTC",
        //                 "blockchain": "bitcoin",
        //                 "network": "bitcoin",
        //                 "script_type": "p2wpkh",
        //                 "master": "bc1q8w2ypqgx39gucxcypqv2m90wz9rvhmmrcnpdjs",
        //                 "address": "bc1q8w2ypqgx39gucxcypqv2m90wz9rvhmmrcnpdjs"
        //             },
        //             {
        //                 "path": "m/44'/60'/0'",
        //                 "pathMaster": "m/44'/60'/0'/0/0",
        //                 "source": "keepkey",
        //                 "note": " ETH primary (default)",
        //                 "symbol": "ETH",
        //                 "blockchain": "ethereum",
        //                 "network": "ethereum",
        //                 "script_type": "ethereum",
        //                 "type": "address",
        //                 "pubkey": "0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //                 "master": "0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //                 "address": "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             },
        //             {
        //                 "path": "m/44'/931'/0'/0/0",
        //                 "pathMaster": "m/44'/931'/0'/0/0",
        //                 "source": "keepkey",
        //                 "note": " Default RUNE path ",
        //                 "symbol": "RUNE",
        //                 "blockchain": "thorchain",
        //                 "network": "thorchain",
        //                 "script_type": "thorchain",
        //                 "type": "address",
        //                 "pubkey": "thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx",
        //                 "master": "thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx",
        //                 "address": "thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx"
        //             },
        //             {
        //                 "path": "m/44'/118'/0'/0/0",
        //                 "pathMaster": "m/44'/118'/0'/0/0",
        //                 "source": "keepkey",
        //                 "note": " Default ATOM path ",
        //                 "symbol": "ATOM",
        //                 "blockchain": "cosmos",
        //                 "network": "cosmos",
        //                 "script_type": "bech32",
        //                 "type": "address",
        //                 "pubkey": "cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc",
        //                 "master": "cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc",
        //                 "address": "cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc"
        //             },
        //             {
        //                 "path": "m/44'/714'/0'/0/0",
        //                 "pathMaster": "m/44'/714'/0'/0/0",
        //                 "source": "keepkey",
        //                 "note": "Binance default path",
        //                 "symbol": "BNB",
        //                 "blockchain": "binance",
        //                 "network": "binance",
        //                 "script_type": "binance",
        //                 "type": "address",
        //                 "pubkey": "bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap",
        //                 "master": "bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap",
        //                 "address": "bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap"
        //             },
        //             {
        //                 "path": "m/44'/145'/0'",
        //                 "pathMaster": "m/44'/145'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "xpub",
        //                 "xpub": true,
        //                 "pubkey": "xpub6DPARGivQ6adLmcPV1Lg71tgmz8i3fwwy36hguPDFQyoTb2gvg1VkXpL9D2ero7ErGexbRfQ64PPufsS4oUCFrr4tEyobWmxkiyvB9MzEiL",
        //                 "note": "Bitcoin Cash Default path",
        //                 "symbol": "BCH",
        //                 "blockchain": "bitcoincash",
        //                 "network": "bitcoincash",
        //                 "script_type": "p2pkh",
        //                 "master": "bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p",
        //                 "address": "bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p"
        //             },
        //             {
        //                 "path": "m/44'/2'/0'",
        //                 "pathMaster": "m/44'/2'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "xpub",
        //                 "xpub": true,
        //                 "pubkey": "xpub6CQaRj3ynJXpPXzx6tbRFXLqcUuVanKWkFusZ9P7cDYAAgMmdC89rq6aofxyp1fXvscxZF5HgWgZgD3VA6sYnJPKqWnCfUxCoD1YX9TpBkx",
        //                 "note": "Litecoin Default path",
        //                 "symbol": "LTC",
        //                 "blockchain": "litecoin",
        //                 "network": "litecoin",
        //                 "script_type": "p2pkh",
        //                 "master": "LeELKgiF1VLuMfZ5UnAnXBStD2RagrB7Eb",
        //                 "address": "LeELKgiF1VLuMfZ5UnAnXBStD2RagrB7Eb"
        //             },
        //             {
        //                 "path": "m/44'/3'/0'",
        //                 "pathMaster": "m/44'/3'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "xpub",
        //                 "xpub": true,
        //                 "pubkey": "xpub6C2KZdjcbhfMzxsXRRUuVgr4ywWpjxnU2jF2pmBr9MizYWHE5Fx6PWA9gVaTv8Rq9KznkYKQ5X2agVe2qyNttro9T6VofuSYKXWCJi6BTLs",
        //                 "note": "Dogecoin Default path",
        //                 "symbol": "DOGE",
        //                 "blockchain": "dogecoin",
        //                 "network": "dogecoin",
        //                 "script_type": "p2pkh",
        //                 "master": "DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54",
        //                 "address": "DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54"
        //             }
        //         ]
        //     },
        //     "queryKey": "key:39c95ff7-8b86-49bd-bd42-b30697a8d72c",
        //     "auth": "lol",
        //     "provider": "lol"
        // }

        // let register2 = {
        //     "username": "user:ebefe06c",
        //     "blockchains": [
        //         "bitcoin",
        //         "ethereum",
        //         "thorchain",
        //         "bitcoincash",
        //         "litecoin",
        //         "binance",
        //         "cosmos",
        //         "dogecoin"
        //     ],
        //     "context": "0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet",
        //     "publicAddress": "0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //     "walletDescription": {
        //         "context": "0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet",
        //         "type": "keepkey"
        //     },
        //     "data": {
        //         "pubkeys": [
        //             {
        //                 "path": "m/44'/0'/0'",
        //                 "pathMaster": "m/44'/0'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "xpub",
        //                 "xpub": true,
        //                 "pubkey": "xpub6BxKtd6aAuz23XqtWXeSqxShJZn8yqiUmaTdvsPWS3riKkNRcXEPmn1CXmKM1M43mrWfN5QwjdLRghZLrgwMLCeRZqZNuYhVNXr6Pp7aDsH",
        //                 "note": "Bitcoin account 0",
        //                 "symbol": "BTC",
        //                 "blockchain": "bitcoin",
        //                 "network": "bitcoin",
        //                 "script_type": "p2pkh",
        //                 "master": "1JNYtQsc1pizKbn3ScbEPfQ7WcxNqeUHNB",
        //                 "address": "1JNYtQsc1pizKbn3ScbEPfQ7WcxNqeUHNB"
        //             },
        //             {
        //                 "path": "m/84'/0'/0'",
        //                 "pathMaster": "m/84'/0'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "zpub",
        //                 "zpub": true,
        //                 "pubkey": "xpub6D6UctxqkwVv1sTLwvEfJJJnGEKC6XiKbRfwzsYgWmXGAEwPQ7T2cWzRggxVsHjYzA4m33d7VzgPZyNpW5SFmmjY1g8EFFVwy8CtN8xGhTS",
        //                 "note": "Bitcoin account Native Segwit (Bech32)",
        //                 "symbol": "BTC",
        //                 "blockchain": "bitcoin",
        //                 "network": "bitcoin",
        //                 "script_type": "p2wpkh",
        //                 "master": "bc1q8w2ypqgx39gucxcypqv2m90wz9rvhmmrcnpdjs",
        //                 "address": "bc1q8w2ypqgx39gucxcypqv2m90wz9rvhmmrcnpdjs"
        //             },
        //             {
        //                 "path": "m/44'/60'/0'",
        //                 "pathMaster": "m/44'/60'/0'/0/0",
        //                 "source": "keepkey",
        //                 "note": " ETH primary (default)",
        //                 "symbol": "ETH",
        //                 "blockchain": "ethereum",
        //                 "network": "ethereum",
        //                 "script_type": "ethereum",
        //                 "type": "address",
        //                 "pubkey": "0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //                 "master": "0x141D9959cAe3853b035000490C03991eB70Fc4aC",
        //                 "address": "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        //             },
        //             {
        //                 "path": "m/44'/931'/0'/0/0",
        //                 "pathMaster": "m/44'/931'/0'/0/0",
        //                 "source": "keepkey",
        //                 "note": " Default RUNE path ",
        //                 "symbol": "RUNE",
        //                 "blockchain": "thorchain",
        //                 "network": "thorchain",
        //                 "script_type": "thorchain",
        //                 "type": "address",
        //                 "pubkey": "thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx",
        //                 "master": "thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx",
        //                 "address": "thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx"
        //             },
        //             {
        //                 "path": "m/44'/118'/0'/0/0",
        //                 "pathMaster": "m/44'/118'/0'/0/0",
        //                 "source": "keepkey",
        //                 "note": " Default ATOM path ",
        //                 "symbol": "ATOM",
        //                 "blockchain": "cosmos",
        //                 "network": "cosmos",
        //                 "script_type": "bech32",
        //                 "type": "address",
        //                 "pubkey": "cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc",
        //                 "master": "cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc",
        //                 "address": "cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc"
        //             },
        //             {
        //                 "path": "m/44'/714'/0'/0/0",
        //                 "pathMaster": "m/44'/714'/0'/0/0",
        //                 "source": "keepkey",
        //                 "note": "Binance default path",
        //                 "symbol": "BNB",
        //                 "blockchain": "binance",
        //                 "network": "binance",
        //                 "script_type": "binance",
        //                 "type": "address",
        //                 "pubkey": "bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap",
        //                 "master": "bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap",
        //                 "address": "bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap"
        //             },
        //             {
        //                 "path": "m/44'/145'/0'",
        //                 "pathMaster": "m/44'/145'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "xpub",
        //                 "xpub": true,
        //                 "pubkey": "xpub6DPARGivQ6adLmcPV1Lg71tgmz8i3fwwy36hguPDFQyoTb2gvg1VkXpL9D2ero7ErGexbRfQ64PPufsS4oUCFrr4tEyobWmxkiyvB9MzEiL",
        //                 "note": "Bitcoin Cash Default path",
        //                 "symbol": "BCH",
        //                 "blockchain": "bitcoincash",
        //                 "network": "bitcoincash",
        //                 "script_type": "p2pkh",
        //                 "master": "bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p",
        //                 "address": "bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p"
        //             },
        //             {
        //                 "path": "m/44'/2'/0'",
        //                 "pathMaster": "m/44'/2'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "xpub",
        //                 "xpub": true,
        //                 "pubkey": "xpub6CQaRj3ynJXpPXzx6tbRFXLqcUuVanKWkFusZ9P7cDYAAgMmdC89rq6aofxyp1fXvscxZF5HgWgZgD3VA6sYnJPKqWnCfUxCoD1YX9TpBkx",
        //                 "note": "Litecoin Default path",
        //                 "symbol": "LTC",
        //                 "blockchain": "litecoin",
        //                 "network": "litecoin",
        //                 "script_type": "p2pkh",
        //                 "master": "LeELKgiF1VLuMfZ5UnAnXBStD2RagrB7Eb",
        //                 "address": "LeELKgiF1VLuMfZ5UnAnXBStD2RagrB7Eb"
        //             },
        //             {
        //                 "path": "m/44'/3'/0'",
        //                 "pathMaster": "m/44'/3'/0'/0/0",
        //                 "source": "keepkey",
        //                 "type": "xpub",
        //                 "xpub": true,
        //                 "pubkey": "xpub6C2KZdjcbhfMzxsXRRUuVgr4ywWpjxnU2jF2pmBr9MizYWHE5Fx6PWA9gVaTv8Rq9KznkYKQ5X2agVe2qyNttro9T6VofuSYKXWCJi6BTLs",
        //                 "note": "Dogecoin Default path",
        //                 "symbol": "DOGE",
        //                 "blockchain": "dogecoin",
        //                 "network": "dogecoin",
        //                 "script_type": "p2pkh",
        //                 "master": "DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54",
        //                 "address": "DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54"
        //             }
        //         ]
        //     },
        //     "queryKey": "key:337e39de-3f45-40ac-ace0-d60684d2b92f",
        //     "auth": "lol",
        //     "provider": "lol"
        // }
        
        // let register3 = {"username":"user:66fefdd6-7ea9-48cf-8e69-fc74afb9c45412","blockchains":["bitcoin","ethereum","thorchain","bitcoincash","litecoin","binance","cosmos","dogecoin"],"context":"0x33b35c665496ba8e71b22373843376740401f106.wallet","publicAddress":"0x33b35c665496ba8e71b22373843376740401f106","walletDescription":{"context":"0x33b35c665496ba8e71b22373843376740401f106.wallet","type":"metamask"},"data":{"pubkeys":[{"pubkey":"0x33b35c665496ba8e71b22373843376740401f106","blockchain":"ethereum","symbol":"ETH","asset":"ethereum","path":"m/44'/60'/0'","pathMaster":"m/44'/60'/0'/0/0","script_type":"ethereum","network":"ethereum","master":"0x33b35c665496ba8e71b22373843376740401f106","type":"address","address":"0x33b35c665496ba8e71b22373843376740401f106"},{"pubkey":"0x33b35c665496ba8e71b22373843376740401f106","blockchain":"ethereum","symbol":"ETH","asset":"ethereum","path":"m/44'/60'/0'","pathMaster":"m/44'/60'/0'/0/0","script_type":"ethereum","network":"ethereum","master":"0x33b35c665496ba8e71b22373843376740401f106","type":"address","address":"0x33b35c665496ba8e71b22373843376740401f106"},{"pubkey":"0xbda1b484152f32e215aa5457366ec537d0e35e4b","blockchain":"ethereum","symbol":"ETH","asset":"ethereum","path":"m/44'/60'/0'","pathMaster":"m/44'/60'/0'/0/0","script_type":"ethereum","network":"ethereum","master":"0xbda1b484152f32e215aa5457366ec537d0e35e4b","type":"address","address":"0xbda1b484152f32e215aa5457366ec537d0e35e4b"},{"pubkey":"0x651982e85d5e43db682cd6153488083e1b810798","blockchain":"ethereum","symbol":"ETH","asset":"ethereum","path":"m/44'/60'/0'","pathMaster":"m/44'/60'/0'/0/0","script_type":"ethereum","network":"ethereum","master":"0x651982e85d5e43db682cd6153488083e1b810798","type":"address","address":"0x651982e85d5e43db682cd6153488083e1b810798"},{"pubkey":"0xfeb8bf56e554fc47639e5ed9e1dae21dff69d6a9","blockchain":"ethereum","symbol":"ETH","asset":"ethereum","path":"m/44'/60'/0'","pathMaster":"m/44'/60'/0'/0/0","script_type":"ethereum","network":"ethereum","master":"0xfeb8bf56e554fc47639e5ed9e1dae21dff69d6a9","type":"address","address":"0xfeb8bf56e554fc47639e5ed9e1dae21dff69d6a9"}]},"queryKey":"sdk:pair-keepkey:0.8247915055974351"}
        //
        // let result = await pioneer.Register(register3);
        // console.log("result: ",result.data)
        
        //public developer info
        // let address = '0x141d9959cae3853b035000490c03991eb70fc4ac'
        // let result = await pioneer.GetDevInfo({address});
        // console.log("result: ",result.data)


        // // Access the Pioneer methods and execute the API calls
        // console.log("pioneer: ", pioneer);
        // const globals = await pioneer.Globals();
        // console.log("globals: ", globals);
        //
        // const result = await pioneer.Invocations();
        // console.log("result: ", result);
        //
        // const redemptionBody = {
        //     publicAddress: "addy",
        //     signature: "sig",
        //     message: "msg"
        // };
        //
        // const redemption = await pioneer.Redemption(redemptionBody);
        // console.log("redemption: ", redemption.data);
        //
        // const user = await pioneer.User();
        // console.log("user: ", user.data);
        
        //get pioneers
        // const developers = await pioneer.ListDevelopers({limit:1000,skip:0});
        // console.log("developers: ", developers.data);

    } catch (e) {
        console.error(e);
    }
};

runTest();
