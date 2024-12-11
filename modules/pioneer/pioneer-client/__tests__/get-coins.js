/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})
const Pioneer = require("../lib").default;

const semver = require('semver')
// let signer = require("eth_mnemonic_signer")

//force
// process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
// process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
// process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:4000/spec/swagger.json"

process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"
// process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"

// let spec = process.env['URL_PIONEER_SPEC']

//const mnemonic = 'all all all all all all all all all all all all'
let mnemonic = process.env['WALLET_MAINNET_DEV']

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

// let queryKey = 'key:d9c55eff-a8d0-48e1-bb0f-db131e5576a0'
// let username  = 'user:1911ccde-89df-4fc4-8a71-56097b9d418b'

// let username = process.env['TEST_USERNAME_1']
// let queryKey = process.env['TEST_QUERY_KEY_1']

// let context = 'keepkey-pubkeys-343733331147363327003800'


let run_test = async function(){
    try{
        // let spec = "https://pioneers.dev/spec/swagger.json"
        let spec = "http://127.0.0.1:9001/spec/swagger.json"
        //get config
        let config = {
            queryKey:'key:cfd27e74asda',
            username:"user:cfd27e74asd",
            spec
        }
        console.log("config: ",config)

        //get config
        console.log("spec: ",spec)
        // Initialize the Pioneer instance
        let pioneer = new Pioneer(spec, config);
        pioneer = await pioneer.init();

        
        let CAIPS_TEST = [
            'bip122:000000000019d6689c085ae165831e93/slip44:0',
            'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
            'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
            'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
            'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
            'cosmos:mayachain-mainnet-v1/slip44:931',
            'cosmos:osmosis-1/slip44:118',
            'cosmos:cosmoshub-4/slip44:118',
            'cosmos:thorchain-mainnet-v1/slip44:931',
            'eip155:1/slip44:60',
            'eip155:8453/slip44:60',
            'eip155:137/slip44:60',
            'eip155:10/slip44:60',
            'ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144',
            'cosmos:mayachain-mainnet-v1/denom:MAYA.CACAO',
            'cosmos:mayachain-mainnet-v1/slip44:931'
        ]
        //coingecko:cosmos:mayachain-mainnet-v1/slip44:931
        
        //get marketInfo
        // let marketInfo = await pioneer.GetMarketInfo(CAIPS_TEST)
        // console.log(marketInfo.data)


        let ASSETS_TEST = [
            // {
            //     "caip": "bip122:000000000019d6689c085ae165831e93/slip44:0",
            //     "pubkey": "bc1qu3ghkz8788ysk7gqcvke5l0mr7skhgvpuk6dk4"
            // },
            // {
            //     "caip": "bip122:000000000000000000651ef99cb9fcbe/slip44:145",
            //     "pubkey": "qpd00ucur9gl7rzwe7lqmu9yljr9ajv92q09a0jdrl"
            // },
            // {
            //     "caip": "bip122:000007d91d1254d60e2dd1ae58038307/slip44:5",
            //     "pubkey": "XetjxEsGXKLV4mHiWPLscuNFABu9K5eVDd"
            // },
            // {
            //     "caip": "bip122:00000000001a91e3dace36e2be3bf030/slip44:3",
            //     "pubkey": "DNchRDXhaW2uPusLVQWZZbQ5QQnzYmarWJ"
            // },
            // {
            //     "caip": "bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2",
            //     "pubkey": "LMcHLHjcAhMtM6SPQ7Da9acBQWcviaX2Fu"
            // },
            // {
            //     "caip": "cosmos:mayachain-mainnet-v1/slip44:931",
            //     "pubkey": "maya14jutklw4xaawvx0p90m45nur64mmhjz3mwmvvs"
            // },
            // {
            //     "caip": "cosmos:osmosis-1/slip44:118",
            //     "pubkey": "osmo1hp7gnr07wprd75f4j4aze9a94aejfcqdccqdht"
            // },
            // {
            //     "caip": "cosmos:cosmoshub-4/slip44:118",
            //     "pubkey": "cosmos1hp7gnr07wprd75f4j4aze9a94aejfcqdsrnape"
            // },
            // {
            //     "caip": "cosmos:thorchain-mainnet-v1/slip44:931",
            //     "pubkey": "thor10t3zmsks33mgf7ajkmzj2elt553ufrxgav90ms"
            // },
            // {
            //     "caip": "eip155:1/slip44:60",
            //     "pubkey": "0x658DE0443259a1027caA976ef9a42E6982037A03"
            // },
            // {
            //     "caip": "eip155:8453/slip44:60",
            //     "pubkey": "0x658DE0443259a1027caA976ef9a42E6982037A03"
            // },
            // {
            //     "caip": "eip155:137/slip44:60",
            //     "pubkey": "0x658DE0443259a1027caA976ef9a42E6982037A03"
            // },
            // {
            //     "caip": "eip155:10/slip44:60",
            //     "pubkey": "0x658DE0443259a1027caA976ef9a42E6982037A03"
            // },
            // {
            //     "caip": "ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144",
            //     "pubkey": "rGdMfVVZwUbqAxs5zucKHUpFgFTcPPj5Cn"
            // }

            // {
            //     caip: 'eip155:1/slip44:60',
            //     pubkey: '0x141D9959cAe3853b035000490C03991eB70Fc4aC'
            // },
            // {
            //     caip: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
            //     pubkey: 'xpub6C2KZdjcbhfMzxsXRRUuVgr4ywWpjxnU2jF2pmBr9MizYWHE5Fx6PWA9gVaTv8Rq9KznkYKQ5X2agVe2qyNttro9T6VofuSYKXWCJi6BTLs'
            // },
            // {
            //     caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
            //     pubkey: 'xpub6BxKtd6aAuz23XqtWXeSqxShJZn8yqiUmaTdvsPWS3riKkNRcXEPmn1CXmKM1M43mrWfN5QwjdLRghZLrgwMLCeRZqZNuYhVNXr6Pp7aDsH'
            // },
            // {
            //     caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
            //     pubkey: 'zpub6rm1EEJg4JasiTqacdouiUVncAc5ymhKReiPZfLTGnH2GSZquRn9reJhj6sfs73PoSJNXzpERKPVLYbwwUGHNF6jkMX5R58vWaLB9FVyJuX'
            // },
            // {
            //     caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
            //     pubkey: 'zpub6rm1EEJg4JaskzruP7rmFkcABNR183DMmQqBgn26AQTj7ZBoK8apQ1iV41dSsgWsPCaDuCBKkECh47k4Ye7o11eoEf6pcAF98x61YvGudCS'
            // },
            // {
            //     caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
            //     pubkey: 'xpub6BxKtd6aAuz2ApvP5F2YczuuqM1rTL6obPmr37fNyYJDyP9MFMTdr4p834s4MMYiM8rapDH8pnJDCBd2k9qWJLcAHf3vsc6FT1x3WMvPvfa'
            // },
            // {
            //     caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
            //     pubkey: 'xpub6D6UctxqkwVv1sTLwvEfJJJnGEKC6XiKbRfwzsYgWmXGAEwPQ7T2cWzRggxVsHjYzA4m33d7VzgPZyNpW5SFmmjY1g8EFFVwy8CtN8xGhTS'
            // },
            // {
            //     caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
            //     pubkey: 'xpub6BxKtd6aAuz29Jkjqsow4x67N9bWaVMEkt7hZDE392soWcYY3AzTF6mxwaMZKtfDJaMChKznXND823bXGvMoRBxe8AwVfoNJpXTs6eT77sj'
            // },
            // {
            //     caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
            //     pubkey: 'xpub6BxKtd6aAuz26ag4No8Z41wu4xpa9tgbPuEVhQ9RYCtrcGmRTYSUjPvG6JYeXFjFY1N7pfJ5tW94TG4aLF3u8Af3BkXxaXecUiXfNScdfJ8'
            // },
            // {
            //     caip: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
            //     pubkey: 'ypub6WamSeXgTYgy7W25fVorMLDHFx5SPkuYaE7ToWCiyCUK2jdWpufQ8VqkDg83YjBtJFHDoekhf9ESdPDbL9aCPXC5NnmzXUiq3J6oycFShfS'
            // },
            // {
            //     caip: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
            //     pubkey: 'xpub6DPARGivQ6adLmcPV1Lg71tgmz8i3fwwy36hguPDFQyoTb2gvg1VkXpL9D2ero7ErGexbRfQ64PPufsS4oUCFrr4tEyobWmxkiyvB9MzEiL'
            // },
            // {
            //     caip: 'cosmos:cosmoshub-4/slip44:118',
            //     pubkey: 'cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc'
            // },
            // {
            //     caip: 'cosmos:osmosis-1/slip44:118',
            //     pubkey: 'osmo1rs7fckgznkaxs4sq02pexwjgar43p5wnkx9s92'
            // },
            // {
            //     caip: 'ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144',
            //     pubkey: 'rLRYvj3RXU16THYgwhWR3ZN639XAE68RLB'
            // },
            // {
            //     caip: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
            //     pubkey: 'xpub6C2KZdjcbhfMzxsXRRUuVgr4ywWpjxnU2jF2pmBr9MizYWHE5Fx6PWA9gVaTv8Rq9KznkYKQ5X2agVe2qyNttro9T6VofuSYKXWCJi6BTLs'
            // },
            // {
            //     caip: 'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
            //     pubkey: 'xpub6C32ZcmFoazJmhH5fojYAwHEggwzqo78UfbUXJjUHzxAp3k3373Yn6K56fVKkoTFehxgED6nxqeUvKX5vr8iQ3QMLcuv2pFHjJkFJ9yZMRe'
            // },
            {
                caip: 'cosmos:mayachain-mainnet-v1/slip44:931',
                pubkey: 'maya1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfqkl5k'
            },
            // {
            //     caip: 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
            //     pubkey: 'zpub6rQAwkqDw32JoeWfaE4Evmx1ZKWWyEscT1H7RNc5eJnndNEemaiRsvGHztrVVdowubaNEGNZ3x4LFpWyZUtkP6GmfVFX4hwHPXYFfeB68Pj'
            // },
            // {
            //     caip: 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
            //     pubkey: 'xpub6CQaRj3ynJXpPXzx6tbRFXLqcUuVanKWkFusZ9P7cDYAAgMmdC89rq6aofxyp1fXvscxZF5HgWgZgD3VA6sYnJPKqWnCfUxCoD1YX9TpBkx'
            // },
            // {
            //     caip: 'cosmos:thorchain-mainnet-v1/slip44:931',
            //     pubkey: 'thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx'
            // }

        ]
        // console.log(pioneer)
        let marketInfo = await pioneer.GetPortfolioBalances(ASSETS_TEST)
        console.log(marketInfo.data)


        // //let networkId = 'bip122:00000000001a91e3dace36e2be3bf030' //DOGE
        // // let networkId = 'bip122:000000000000000000651ef99cb9fcbe' //BCH
        // let networkId = 'bip122:000007d91d1254d60e2dd1ae58038307' //DASH
        // // let networkId = 'bip122:12a765e31ffd4059bada1e25190f6e98' //LTC
        // // let networkId = 'bip122:000000000019d6689c085ae165831e93' //BTC
        // let fees = await pioneer.GetFeeRate({networkId})
        //
        // console.log("fees: ",fees.data)
        
        //get tx history
        // let networkId = "eip155:1"
        // let address = "0x8f8e8b3c4de76a31971fe2e4d1b4f3f5f6f3f3f3"
        // let txs = await pioneer.GetTransactionsByNetwork({networkId,address, fromBlock:'latest', toBlock:'latest'})
        // console.log("txs: ",txs.data)
        // console.log('pioneer: ',await pioneer.getPaths())

        // pioneer = await pioneer.Health()


        // pioneer = await pioneer.Health()
        
        
        //ListAssetsPageniate
        // let Top = await pioneer.ListAssetsPageniate({ limit: 1, skip: 0 })
        // console.log("Top: ",Top.data)
        // console.log("Top: ",Top.data.length)

        // let networks = await pioneer.AtlasNetwork({ start: 1, stop: 10, limit: 5 })
        // console.log("networks: ",networks.data)
        // console.log("networks: ",networks.data.length)

        // console.log(signer)
        // let globals = await pioneer.Globals()
        // console.log("globals: ",globals.data)

        // console.log(signer)
        // let info = await pioneer.Info()
        // console.log("info: ",info.data)

        // let info = await pioneer.SearchBlockchainByChainId("43114")
        // let info = await pioneer.SearchBlockchainByChainId("43114")
        // // let info = await pioneer.SearchBlockchainByChainId({chainId:"43114"})
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])
        
        //get node searchNodesByNetworkId
        // let info = await pioneer.SearchNodesByNetworkId({chainId:"43114"})
        // // let info = await pioneer.SearchBlockchainByChainId({chainId:"43114"})
        // console.log("info: ",info.data)
        
        // let info = await pioneer.SearchByNameNative("avalanche x-chain")
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByName("bitcoin")
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByTag("isNative")
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByTagNative("isNative")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByTag("KeepKeySupport")
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])
        //0x4e15361fd6b4bb609fa63c81a2be19d873717870
        //0xc770eefad204b5180df6a14ee197d99d808ee52d
        // let info = await pioneer.SearchByContract("0x02d980a0d7af3fb7cf7df8cb35d9edbcf355f665")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByBlockchainName("binance")
        // console.log("info: ",info.data)

        // let info = await pioneer.SearchByBlockchainName("43114")
        // console.log("info: ",info.data)
        // let info = await pioneer.SearchByBlockchainName("ethereum")
        // console.log("info: ",info.data)        
        // let info = await pioneer.SearchByBlockchainName("avalanche-c-chain")
        // console.log("info: ",info.data)
        //SearchByNetworkName
        // let info = await pioneer.SearchByNetworkName("avalanche-c-chain")
        // console.log("info: ",info.data)
        // let info = await pioneer.SearchByNetworkName("avalan")
        // console.log("info: ",info.data)

        //atlasNetwork
        // let info = await pioneer.AtlasNetwork({start:1,stop:10,limit:5})
        // console.log("info: ",info.data.length)

        // let info = await pioneer.SearchByNetworkName("gnosis")
        // console.log("info: ",info.data)
        
        // let info = await pioneer.SearchByBlockchainName("avalanche-c-chain")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByBlockchainName("bit")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByNetworkName("polygon")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])


        // let info = await pioneer.SearchByName({name:"Bitcoin"})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])


        // let info = await pioneer.SearchByNetworkName("ethereum")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        //SearchByNetworkId
        // let info = await pioneer.SearchByNetworkId(43114)
        // console.log("info: ",info.data)
        // let info = await pioneer.SearchByNetworkId(43114)
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchByName("Bitcoin")
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchAssetsPageniate({limit:100,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchBlockchainsPageniate({limit:100,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchBlockchainsPageniate({limit:100,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.ListAppsPending({limit:100,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.ListAppsByName({name:"KeepKey Desktop SDK"})
        // console.log("info: ",info.data)


        //get asset info
        // let asset = "Bitcoin"
        // let version = "v7.7.0"
        // let expectedVersion = "v7.5.2"
        // function isOlderVersion(currentVersion, latestVersion) {
        //     let parsedCurrentVersion = currentVersion.split('.');
        //     let parsedLatestVersion = latestVersion.split('.');
        //
        //     for (let i = 0; i < parsedCurrentVersion.length; i++) {
        //         if (parseInt(parsedCurrentVersion[i]) < parseInt(parsedLatestVersion[i])) {
        //             return true;
        //         }
        //     }
        //     return false;
        // }
        //
        // let result = isOlderVersion(version, expectedVersion); // true
        // console.log(result)

        // let asset = {
        //     "assetId": "keepkey_ETH",
        //     "chainId": "keepkey_ETH",
        //     "color": "",
        //     "explorer": "",
        //     "explorerAddressLink": "",
        //     "explorerTxLink": "",
        //     "icon": "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
        //     "name": "Ethereum",
        //     "asset": "Ethereum",
        //     "precision": 1,
        //     "symbol": "ETH",
        //     "rank": 2,
        //     "marketCap": 192877571723,
        //     "geckoId": "ethereum",
        //     "link": "https://www.coingecko.com/en/coins/ethereum",
        //     "version": "2.0.2",
        //     "limit": 1000,
        //     "skip": 0
        // }

        // let asset = {
        //     "assetId": "keepkey_BNB",
        //     "chainId": "keepkey_BNB",
        //     "color": "",
        //     "explorer": "https://snowtrace.io/address/0x442F7f22b1EE2c842bEAFf52880d4573E9201158",
        //     "icon": "https://pioneers.dev/coins/binance-coin-(portal).png",
        //     "name": "binance coin (portal)",
        //     "precision": 18,
        //     "symbol": "BNB",
        //     "rank": "",
        //     "marketCap": "",
        //     "geckoId": "binance coin (portal)",
        //     "link": "https://snowtrace.io/address/0x442F7f22b1EE2c842bEAFf52880d4573E9201158"
        // }
        // let asset = {
        //     "assetId": "keepkey_BNB",
        //     "chainId": "keepkey_BNB",
        //     "color": "",
        //     "explorer": "https://etherscan.io/token/0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
        //     "icon": "https://pioneers.dev/coins/bnb.png",
        //     "name": "bnb",
        //     "precision": 18,
        //     "symbol": "BNB",
        //     "rank": "",
        //     "marketCap": "",
        //     "geckoId": "bnb",
        //     "link": "https://etherscan.io/token/0xB8c77482e45F1F44dE1745F52C74426C631bDD52"
        // }
        // let dapps = await pioneer.ListAppsByVersionAndAsset({
        //         "asset": asset.name,
        //         "version": "2.0.2",
        //         "limit": 1000,
        //         "skip": 0
        //     })
        // // console.log("dapps: ",dapps)
        // console.log("dapps: ",dapps.data)
        // console.log("score: ",dapps.data[0].score)
        
        // let asset = {
        //     "assetId": "keepkey_USDC",
        //     "chainId": "keepkey_USDC",
        //     "color": "",
        //     "explorer": "",
        //     "explorerAddressLink": "",
        //     "explorerTxLink": "",
        //     "icon": "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389",
        //     "name": "USD Coin",
        //     "precision": 1,
        //     "symbol": "USDC",
        //     "rank": 4,
        //     "marketCap": 43087355519,
        //     "geckoId": "usd-coin",
        //     "link": "https://www.coingecko.com/en/coins/usd-coin",
        //     "asset": "USD Coin",
        //     "version": "2.0.2",
        //     "limit": 1000,
        //     "skip": 0
        // }
        // let dapps = await pioneer.ListAppsByVersionAndAsset(asset)
        // // console.log("dapps: ",dapps)
        // console.log("dapps: ",dapps.data)
        // // console.log("score: ",dapps.data[0].score)

        // let dapps = await pioneer.ListAppsByVersionAndAsset({
        //     "asset": "Dash",
        //     "version": "2.0.2",
        //     "limit": 1000,
        //     "skip": 0
        // })
        // console.log("dapps: ",dapps)
        // console.log("dapps: ",dapps.data)
        // console.log("score: ",dapps.data[0].score)

        // let info = await pioneer.ListApps({limit:1000,skip:0})
        // console.log("info: ",info.data.length)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])
        //
        // let name = "ripple"
        // let assetsByName = await pioneer.SearchAssetsByName(name)
        // console.log("info: ",assetsByName.data)

        //list apps by blockchain
        // let blockchain = "dash"

        // let info = await pioneer.SearchBlockchainsPaginate({limit:1000,skip:0})
        // console.log("info: ",info.data.length)

        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.ListApps({blockchain,limit:1000,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let minVersion = '2.0.0'
        // let info = await pioneer.ListAppsByVersion({minVersion,limit:1000,skip:0})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // let info = await pioneer.SearchDappsPageniate({limit:1000,skip:0})
        // console.log("info: ",info.data[0].score)
        // console.log("info: ",info.data[1].score)
        // console.log("info: ",info.data[2].score)
        // console.log("info: ",info.data[186].score)
        // const sortArrayByScore = (arr) => {
        //     return arr.sort((a, b) => {
        //         if (a.score === undefined) a.score = 0;
        //         if (b.score === undefined) b.score = 0;
        //         return b.score - a.score;
        //     });
        // }
        // info.data = sortArrayByScore(info.data)
        // // info.data = info.data.sort(function(a, b) {
        // //     return parseFloat(a.score) - parseFloat(b.score);
        // // });
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0].score)
        // console.log("info: ",info.data[1].score)
        // console.log("info: ",info.data[2].score)
        // console.log("info: ",info.data[186].score)

        // let info = await pioneer.SearchAssetsPageniateByChainId({chainId:"1",limit:1000,skip:0})
        // console.log("info: ",info.data)

        // searchByNameAndChainId

        // let info = await pioneer.SearchByNetworkName('bin')
        // console.log("onStart: info: ",info.data[0])

        // let info = await pioneer.SearchByBlockchainName('ethereum')
        // console.log("onStart: info: ",info.data[0])

        // let info = await pioneer.SearchByBlockchainName('dash')
        // console.log("onStart: info: ",info.data[0])

        // let info = await pioneer.SearchAssetsList({limit:10000,skip:0})
        // console.log("info: ",info.data.length)

        // let info = await pioneer.SearchAssetsListByChainId({chainId:56,limit:10000,skip:0})
        // console.log("info: ",info.data)

        // let name = "fox"
        // let info = await pioneer.SearchByNameAndChainId({chainId:1,name})
        // console.log("info: ",info.data)
        // console.log("info: ",info.data[0])
        // console.log("info: ",info.data[1])

        // console.log("info: ",info.data[0].score)
        // console.log("info: ",info.data[1].score)
        // console.log("info: ",info.data[2].score)
        // console.log("info: ",info.data[186].score)
        // const sortArrayByScore = (arr) => {
        //     return arr.sort((a, b) => {
        //         if (a.score === undefined) a.score = 0;
        //         if (b.score === undefined) b.score = 0;
        //         return b.score - a.score;
        //     });
        // }
        // info.data = sortArrayByScore(info.data)
        // // info.data = info.data.sort(function(a, b) {
        // //     return parseFloat(a.score) - parseFloat(b.score);
        // // });
        // console.log("info: ",info.data[0].score)
        // console.log("info: ",info.data[1].score)
        // console.log("info: ",info.data[2].score)
        // console.log("info: ",info.data[186].score)

    }catch(e){
        console.error(e)
    }
}

run_test()
