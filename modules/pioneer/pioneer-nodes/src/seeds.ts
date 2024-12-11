/*
    Pioneer Node Defaults:

    Add your node here!

*/

//
/*
                 "rpc":"https://rpc-cosmoshub.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-cosmoshub.keplr.app",

            "rpc":"https://rpc-kava.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-kava.keplr.app",


            "rpc":"https://rpc-secret.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-secret.keplr.app",

            "rpc":"https://rpc-akash.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-akash.keplr.app",

            "rpc":"https://rpc-iov.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-iov.keplr.app",

            "rpc":"https://rpc-sifchain.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-sifchain.keplr.app",

            "rpc":"https://rpc-certik.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-certik.keplr.app",

            "rpc":"https://rpc-iris.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-iris.keplr.app",

            "rpc":"https://rpc-cyber.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-cyber.keplr.app",

            "rpc":"https://rpc-straightedge.keplr.app",
      "rpcConfig":void 0,
      "rest":"https://lcd-straightedge.keplr.app",
 */

export let TIER_ONE_SEED = {
    "COSMOS":{
        "GAIAD":"https://lcd-cosmoshub.keplr.app"
        //"GAIAD":"https://45.79.249.253"
        // "GAIAD":"https://3.87.179.235:26656"
    }
}

//TODO dynamic context setting based on health
export let CURRENT_CONTEXT_NODE_MAP = TIER_ONE_SEED


export const blockbooks = [
    //NOWNODES
    {
        symbol:"BTC",
        blockchain:"bitcoin",
        caip:"bip122:000000000019d6689c085ae165831e93/slip44:0",
        networkId:"bip122:000000000019d6689c085ae165831e93",
        type:"blockbook",
        service:"https://btcbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6",
        websocket:"wss://btc.nownodes.io/wss"
    },
    {
        symbol:"DASH",
        blockchain:"dash",
        caip:"bip122:000007d91d1254d60e2dd1ae58038307/slip44:5",
        networkId:"bip122:000007d91d1254d60e2dd1ae58038307",
        type:"blockbook",
        service:"https://dashbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6",
        websocket:"wss://dash.nownodes.io/wss"
    },
    {
        symbol:"DGB",
        blockchain:"digibytes",
        caip:"bip122:4da631f2ac1bed857bd968c67c913978/slip44:20",
        type:"blockbook",
        service:"https://dgbbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6",
        websocket:"wss://dgb.nownodes.io/wss"
    },
    {
        symbol:"DOGE",
        blockchain:"dogecoin",
        caip:"bip122:00000000001a91e3dace36e2be3bf030/slip44:3",
        type:"blockbook",
        service:"https://dogebook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6",
        websocket:"wss://doge.nownodes.io/wss"
    },
    {
        symbol:"LTC",
        blockchain:"litecoin",
        caip:"bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2",
        type:"blockbook",
        service:"https://ltcbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6",
        websocket:"wss://ltc.nownodes.io/wss"
    },
    {
        symbol:"BCH",
        blockchain:"bitcoincash",
        caip:"bip122:000000000000000000651ef99cb9fcbe/slip44:145",
        type:"blockbook",
        service:"https://bchbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6",
        websocket:"wss://bch.nownodes.io/wss"
    },
    {
        symbol:"BSV",
        blockchain:"bitcoin sv",
        caip:"bip122:0000000000000000018b0da51421703b/slip44:1",
        type:"blockbook",
        service:"https://bsvbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6"
    },
    {
        symbol:"GRS",
        blockchain:"Groestlcoin",
        caip:"bip122:00000ac5927c594d49cc0bdb81759d0d/slip44:17",
        type:"blockbook",
        service:"https://grsbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6"
    },
    {
        symbol:"DCR",
        blockchain:"decred",
        caip:"bip122:00000ac5927c594d49cc0bdb81759d0d/slip44:42",
        type:"blockbook",
        service:"https://dcr-blockbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6"
    },
    {
        symbol:"DCR",
        blockchain:"decred",
        caip:"bip122:00000ac5927c594d49cc0bdb81759d0d/slip44:42",
        type:"blockbook",
        service:"https://dcr-blockbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6"
    },
    {
        symbol:"BTG",
        blockchain:"bitcoin gold",
        caip:"bip122:00069578d7a76f82b2c7117c1334c7ef/slip44:1",
        type:"blockbook",
        service:"https://btg.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6"
    },
    {
        symbol:"KMD",
        blockchain:"Komodo",
        caip:"bip122:027e3758c3a65b12aa1046462b486d0a/slip44:1",
        type:"blockbook",
        service:"https://kmdbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6"
    },
    {
        symbol:"ZEC",
        blockchain:"zcash",
        caip:"bip122:00040fe8ec8471911baa1db1266ea15d/slip44:133",
        type:"blockbook",
        service:"https://zecbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6"
    },
    {
        symbol:"ARB",
        blockchain:"Arbitrum",
        caip:"eip155:42161/slip44:60",
        type:"blockbook",
        service:"arb-blockbook.nownodes.io/cf522543-87e2-4dd6-b645-2fbfd0bc61f6"
    },
    //SHAPESHIFT
    // {
    //     symbol:"BASE",
    //     blockchain:"Base",
    //     caip:"eip155:8453/slip44:60",
    //     type:"blockbook",
    //     service:"https://indexer.base.shapeshift.com",
    //     websocket:"wss://indexer.base.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"MATIC",
    //     blockchain:"polygon",
    //     caip:"eip155:137/slip44:60",
    //     type:"blockbook",
    //     service:"https://indexer.polygon.shapeshift.com",
    //     websocket:"wss://indexer.polygon.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"ETH",
    //     blockchain:"optimism",
    //     caip:"eip155:10/slip44:60",
    //     type:"blockbook",
    //     service:"https://indexer.optimism.shapeshift.com",
    //     websocket:"wss://indexer.optimism.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"LTC",
    //     blockchain:"litecoin",
    //     caip:"bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2",
    //     type:"blockbook",
    //     service:"https://indexer.litecoin.shapeshift.com",
    //     websocket:"wss://indexer.litecoin.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"xDAI",
    //     blockchain:"gnosis",
    //     caip:"eip155:100/slip44:60",
    //     type:"blockbook",
    //     service:"https://indexer.gnosis.shapeshift.com",
    //     websocket:"wss://indexer.gnosis.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"ETH",
    //     blockchain:"ethereum",
    //     caip:"eip155:1/slip44:60",
    //     type:"blockbook",
    //     service:"https://indexer.ethereum.shapeshift.com",
    //     websocket:"wss://indexer.ethereum.shapeshift.com/websocket"
    // },
    //NUKED
    // {
    //     symbol:"DOGE",
    //     blockchain:"dogecoin",
    //     caip:"bip122:00000000001a91e3dace36e2be3bf030/slip44:3",
    //     type:"blockbook",
    //     service:"https://indexer.dogecoin.shapeshift.com",
    //     websocket:"wss://indexer.dogecoin.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"BNB",
    //     blockchain:"bnbsmartchain",
    //     caip:"eip155:56/slip44:60",
    //     type:"blockbook",
    //     service:"https://indexer.bnbsmartchain.shapeshift.com",
    //     websocket:"wss://indexer.bnbsmartchain.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"BCH",
    //     blockchain:"bitcoincash",
    //     caip:"bip122:000000000000000000651ef99cb9fcbe/slip44:145",
    //     type:"blockbook",
    //     service:"https://indexer.bitcoincash.shapeshift.com",
    //     websocket:"wss://indexer.bitcoincash.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"BTC",
    //     blockchain:"bitcoin",
    //     caip:"bip122:000000000019d6689c085ae165831e93/slip44:0",
    //     type:"blockbook",
    //     service:"https://indexer.bitcoin.shapeshift.com",
    //     websocket:"wss://indexer.bitcoin.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"AVAX",
    //     blockchain:"avalanche",
    //     caip:"eip155:43114/slip44:60",
    //     type:"blockbook",
    //     service:"https://indexer.avalanche.shapeshift.com",
    //     websocket:"wss://indexer.avalanche.shapeshift.com/websocket"
    // },
    // {
    //     symbol:"AVAX",
    //     blockchain:"avalanche",
    //     caip:"eip155:43114/slip44:60",
    //     type:"blockbook",
    //     service:"https://indexer.avalanche.shapeshift.com",
    //     websocket:"wss://indexer.avalanche.shapeshift.com/websocket"
    // }
]


export const shapeshift = [
    {
        key: "REACT_APP_UNCHAINED_ETHEREUM_HTTP_URL",
        value: "https://api.ethereum.shapeshift.com",
        swagger: "https://api.ethereum.shapeshift.com/swagger.json",
        network: "ethereum",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_ETHEREUM_WS_URL",
        value: "wss://api.ethereum.shapeshift.com",
        network: "ethereum",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_AVALANCHE_HTTP_URL",
        value: "https://api.avalanche.shapeshift.com",
        swagger: "https://api.avalanche.shapeshift.com/swagger.json",
        network: "avalanche",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_AVALANCHE_WS_URL",
        value: "wss://api.avalanche.shapeshift.com",
        network: "avalanche",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_OPTIMISM_HTTP_URL",
        value: "https://api.optimism.shapeshift.com",
        swagger: "https://api.optimism.shapeshift.com/swagger.json",
        network: "optimism",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_OPTIMISM_WS_URL",
        value: "wss://api.optimism.shapeshift.com",
        network: "optimism",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_BNBSMARTCHAIN_HTTP_URL",
        value: "https://api.bnbsmartchain.shapeshift.com",
        swagger: "https://api.bnbsmartchain.shapeshift.com/swagger.json",
        network: "bnbsmartchain",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_BNBSMARTCHAIN_WS_URL",
        value: "wss://api.bnbsmartchain.shapeshift.com",
        network: "bnbsmartchain",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_POLYGON_HTTP_URL",
        value: "https://dev-api.polygon.shapeshift.com",
        swagger: "https://dev-api.polygon.shapeshift.com/swagger.json",
        network: "polygon",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_POLYGON_WS_URL",
        value: "wss://dev-api.polygon.shapeshift.com",
        network: "polygon",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_GNOSIS_HTTP_URL",
        value: "https://api.gnosis.shapeshift.com",
        swagger: "https://api.gnosis.shapeshift.com/swagger.json",
        network: "gnosis",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_GNOSIS_WS_URL",
        value: "wss://api.gnosis.shapeshift.com",
        network: "gnosis",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_BITCOIN_HTTP_URL",
        value: "https://api.bitcoin.shapeshift.com",
        swagger: "https://api.bitcoin.shapeshift.com/swagger.json",
        network: "bitcoin",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_BITCOIN_WS_URL",
        value: "wss://api.bitcoin.shapeshift.com",
        network: "bitcoin",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_DOGECOIN_WS_URL",
        value: "wss://api.dogecoin.shapeshift.com",
        network: "dogecoin",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_DOGECOIN_HTTP_URL",
        value: "https://api.dogecoin.shapeshift.com",
        swagger: "https://api.dogecoin.shapeshift.com/swagger.json",
        network: "dogecoin",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_LITECOIN_WS_URL",
        value: "wss://api.litecoin.shapeshift.com",
        network: "litecoin",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_LITECOIN_HTTP_URL",
        value: "https://api.litecoin.shapeshift.com",
        swagger: "https://api.litecoin.shapeshift.com/swagger.json",
        network: "litecoin",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_BITCOINCASH_HTTP_URL",
        value: "https://api.bitcoincash.shapeshift.com",
        swagger: "https://api.bitcoincash.shapeshift.com/swagger.json",
        network: "bitcoincash",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_BITCOINCASH_WS_URL",
        value: "wss://api.bitcoincash.shapeshift.com",
        network: "bitcoincash",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_COSMOS_HTTP_URL",
        value: "https://api.cosmos.shapeshift.com",
        swagger: "https://api.cosmos.shapeshift.com/swagger",
        network: "cosmos",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_COSMOS_WS_URL",
        value: "wss://api.cosmos.shapeshift.com",
        network: "cosmos",
        protocol: "websocket",
        type: "unchained"
    },
    // fu shapeshift
    // {
    //     key: "REACT_APP_UNCHAINED_OSMOSIS_HTTP_URL",
    //     value: "https://api.osmosis.shapeshift.com",
    //     swagger: "https://api.osmosis.shapeshift.com/swagger",
    //     network: "osmosis",
    //     protocol: "http",
    //     type: "unchained"
    // },
    // {
    //     key: "REACT_APP_UNCHAINED_OSMOSIS_WS_URL",
    //     value: "wss://api.osmosis.shapeshift.com",
    //     network: "osmosis",
    //     protocol: "websocket",
    //     type: "unchained"
    // },
    {
        key: "REACT_APP_UNCHAINED_THORCHAIN_HTTP_URL",
        value: "https://api.thorchain.shapeshift.com",
        swagger: "https://api.thorchain.shapeshift.com/swagger",
        network: "thorchain",
        protocol: "http",
        type: "unchained"
    },
    {
        key: "REACT_APP_UNCHAINED_THORCHAIN_WS_URL",
        value: "wss://api.thorchain.shapeshift.com",
        network: "thorchain",
        protocol: "websocket",
        type: "unchained"
    },
    {
        key: "REACT_APP_ETHEREUM_NODE_URL",
        value: "https://daemon.ethereum.shapeshift.com",
        network: "ethereum",
        nodeType: "eth-node",
        type: "daemon"
    },
    // {
    //     key: "REACT_APP_ETHEREUM_INFURA_URL",
    //     value: "https://mainnet.infura.io/v3/6e2f28ff4f5340fdb0db5da3baec0af2",
    //     network: "ethereum",
    //     nodeType: "infura",
    //     type: "unchained"
    // },
    {
        key: "REACT_APP_AVALANCHE_NODE_URL",
        value: "https://daemon.avalanche.shapeshift.com/ext/bc/C/rpc",
        network: "avalanche",
        nodeType: "avalanche-node",
        type: "daemon"
    },
    {
        key: "REACT_APP_OPTIMISM_NODE_URL",
        value: "https://daemon.optimism.shapeshift.com",
        network: "optimism",
        nodeType: "optimism-node",
        type: "daemon"
    },
    {
        key: "REACT_APP_BNBSMARTCHAIN_NODE_URL",
        value: "https://daemon.bnbsmartchain.shapeshift.com",
        network: "bnbsmartchain",
        nodeType: "bnbsmartchain-node",
        type: "daemon"
    },
    {
        key: "REACT_APP_POLYGON_NODE_URL",
        value: "https://dev-daemon.polygon.shapeshift.com",
        network: "polygon",
        nodeType: "polygon-node",
        type: "daemon"
    },
    {
        key: "REACT_APP_GNOSIS_NODE_URL",
        value: "https://daemon.gnosis.shapeshift.com",
        network: "gnosis",
        nodeType: "gnosis-node",
        type: "daemon"
    },
    {
        key: "REACT_APP_COSMOS_NODE_URL",
        value: "https://daemon.cosmos.shapeshift.com",
        network: "cosmos",
        nodeType: "cosmos-node",
        type: "daemon"
    },
    {
        key: "REACT_APP_OSMOSIS_NODE_URL",
        value: "https://daemon.osmosis.shapeshift.com",
        network: "osmosis",
        nodeType: "osmosis-node",
        type: "daemon"
    },
    {
        key: "REACT_APP_THORCHAIN_NODE_URL",
        value: "https://daemon.thorchain.shapeshift.com",
        network: "thorchain",
        nodeType: "thorchain-node",
        type: "daemon"
    },
    // {
    //     key: "REACT_APP_MIDGARD_URL",
    //     value: "https://indexer.thorchain.shapeshift.com/v2",
    //     network: "thorchain",
    //     service: "midgard",
    //     type: "unchained"
    // },
    //
];
