export const evmCaips = {
    ethereum: 'eip155:1/slip44:60',
    base: 'eip155:8453/slip44:60',
    polygon: 'eip155:137/slip44:60',
    pulsechain: 'eip155:369/slip44:60',
    optimism: 'eip155:10/slip44:60',
    'gnosis-chain-(formerly-xdai)': 'eip155:100/slip44:60',
    'gnosis': 'eip155:100/slip44:60',
    'binance-smart-chain': 'eip155:56/slip44:60',
    'smart-bitcoin-cash': 'eip155:10000/slip44:60',
    'arbitrum': 'eip155:42161/slip44:60',
    fuse: 'eip155:122/slip44:60',
    'bittorrent-chain': 'eip155:199/slip44:60',
    celo: 'eip155:42220/slip44:60',
    'avalanche': 'eip155:43114/slip44:60',
    grli: 'eip155:5/slip44:60',
    eos: 'eip155:59/slip44:60',
    'ethereum-classic': 'eip155:61/slip44:60',
    evmos: 'eip155:9001/slip44:60',
    'poa-network-core': 'eip155:99/slip44:60'
}

export enum Chain {
    Arbitrum = 'ARB',
    Avalanche = 'AVAX',
    Base = 'BASE',
    Binance = 'BNB',
    BinanceSmartChain = 'BSC',
    Bitcoin = 'BTC',
    BitcoinCash = 'BCH',
    Cosmos = 'GAIA',
    Dash = 'DASH',
    Digibyte = 'DGB',
    Dogecoin = 'DOGE',
    EOS = 'EOS',
    Ethereum = 'ETH',
    Kujira = 'KUJI',
    Litecoin = 'LTC',
    Maya = 'MAYA',
    Optimism = 'OP',
    Osmosis = 'OSMO',
    Polygon = 'MATIC',
    Ripple = 'XRP',
    THORChain = 'THOR',
    Zcash = 'ZEC',
}

export const ChainToCaip: Record<string, string> = {
    'ARB': 'eip155:42161/slip44:60',
    'AVAX': 'eip155:43114/slip44:60',
    'BSC': 'eip155:56/slip44:60',
    'BNB': 'binance:bnb-beacon-chain/slip44:118',
    'BCH': 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
    'BTC': 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    'BASE': 'eip155:8453/slip44:60',
    'GAIA': 'cosmos:cosmoshub-4/slip44:118',
    'DASH': 'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
    'DGB': 'bip122:digibytes-hash/slip44:20',
    'DOGE': 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
    'KUJI': 'cosmos:kaiyo-1/slip44:118',
    'EOS': 'eos:cf057bbfb72640471fd910bcb67639c2/slip44:194',
    'ETH': 'eip155:1/slip44:60',
    'LTC': 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
    'MAYA': 'cosmos:maya-mainnet-v1/slip44:118',
    'OP': 'eip155:10/slip44:60',
    'OSMO': 'cosmos:osmosis-1/slip44:118',
    'MATIC': 'eip155:137/slip44:60',
    'XRP': 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2/slip44:144',
    'THOR': 'cosmos:thorchain-mainnet-v1/slip44:931',
    'ZEC': 'bip122:0000000000196a45/slip44:133',
};

export const ChainToNetworkId: Record<string, string> = {
    'ARB': 'eip155:42161',
    'AVAX': 'eip155:43114',
    'BSC': 'eip155:56',
    'BNB': 'binance:bnb-beacon-chain',
    'BCH': 'bip122:000000000000000000651ef99cb9fcbe',
    'BTC': 'bip122:000000000019d6689c085ae165831e93',
    'BASE': 'eip155:8453',
    'GAIA': 'cosmos:cosmoshub-4',
    'DASH': 'bip122:000007d91d1254d60e2dd1ae58038307',
    'DGB': 'bip122:digibytes-hash',
    'DOGE': 'bip122:00000000001a91e3dace36e2be3bf030',
    'KUJI': 'cosmos:kaiyo-1',
    'EOS': 'eos:cf057bbfb72640471fd910bcb67639c2',
    'ETH': 'eip155:1',
    'LTC': 'bip122:12a765e31ffd4059bada1e25190f6e98',
    'MAYA': 'cosmos:maya-mainnet-v1',
    'OP': 'eip155:10',
    'OSMO': 'cosmos:osmosis-1',
    'MATIC': 'eip155:137',
    'XRP': 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2',
    'THOR': 'cosmos:thorchain-mainnet-v1',
    'ZEC': 'bip122:0000000000196a45',
};

export function getChainEnumValue(chainStr: string) {
    switch (chainStr) {
        case 'ARB':
            return Chain.Arbitrum;
        case 'AVAX':
            return Chain.Avalanche;
        case 'BASE':
            return Chain.Base;
        case 'BNB':
            return Chain.Binance;
        case 'BSC':
            return Chain.BinanceSmartChain;
        case 'BTC':
            return Chain.Bitcoin;
        case 'BCH':
            return Chain.BitcoinCash;
        case 'GAIA':
            return Chain.Cosmos;
        case 'DASH':
            return Chain.Dash;
        case 'DGB':
            return Chain.Digibyte;
        case 'DOGE':
            return Chain.Dogecoin;
        case 'EOS':
            return Chain.EOS;
        case 'ETH':
            return Chain.Ethereum;
        case 'KUJI':
            return Chain.Kujira;
        case 'LTC':
            return Chain.Litecoin;
        case 'MAYA':
            return Chain.Maya;
        case 'OP':
            return Chain.Optimism;
        case 'OSMO':
            return Chain.Osmosis;
        case 'MATIC':
            return Chain.Polygon;
        case 'XRP':
            return Chain.Ripple;
        case 'THOR':
            return Chain.THORChain;
        case 'ZEC':
            return Chain.Zcash;
        default:
            return undefined;
    }
}

export const shortListSymbolToCoinGeckoPlatformId = {
    ARB: 'arbitrum',
    BASE: 'base',
    ETH: 'ethereum',
    GNO: 'gnosis-chain', // GNO is native to Gnosis Chain, previously known as xDai Chain
    MATIC: 'polygon-pos',
    OP: 'optimistic-ethereum',
    AVAX: 'avalanche',
    BNB: 'binance-smart-chain'
}

export const shortListSymbolToCaip = {
    ATOM: 'cosmos:cosmoshub-4/slip44:118',
    ARB: 'eip155:42161/slip44:60',
    BTC: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    BASE: 'eip155:8453/slip44:60',
    OSMO: 'cosmos:osmosis-1/slip44:118',
    BCH: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
    LTC: 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
    GAIA: 'cosmos:cosmoshub-4/slip44:118',
    DASH: 'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
    DGB: 'bip122:digibytes-hash/slip44:20',
    DOGE: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
    RUNE: 'cosmos:thorchain-mainnet-v1/slip44:931',
    THOR: 'cosmos:thorchain-mainnet-v1/slip44:931',
    ETH: 'eip155:1/slip44:60',
    GNO: 'eip155:100/slip44:60',
    XRP: 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2/slip44:144',
    MATIC: 'eip155:137/slip44:60',
    OP: 'eip155:10/slip44:60',
    AVAX: 'eip155:43114/slip44:60',
    ADA: 'placeholder:caip:cardano:native:cardano',
    BNB: 'eip155:56/slip44:60',
    EOS: 'eos:cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f/slip44:194',
    FIO: 'placeholder:caip:fio:native:fio-protocol'
}

export const shortListNameToCaip = {
    bitcoin: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    arbitrum: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    cosmos: 'cosmos:cosmoshub-4/slip44:118',
    osmosis: 'cosmos:osmosis-1/slip44:118',
    polygon: 'eip155:137/slip44:60',
    bitcoincash: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
    litecoin: 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
    dash: 'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5',
    digiByte: 'bip122:digibytes-hash/slip44:20',
    dogecoin: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
    thorchain: 'cosmos:thorchain-mainnet-v1/slip44:931',
    ethereum: 'eip155:1/slip44:60',
    avalanche: 'eip155:43114/slip44:60',
    gnosis: 'eip155:100/slip44:60',
    bnbsmartchain: 'eip155:56/slip44:60',
    ripple: 'ripple:4109C6F2045FC7EFF4CDE8F9905D19C2/slip44:144',
    optimism: 'eip155:10/slip44:60',
    cardano: 'placeholder:caip:cardano:native:cardano',
    binance: 'placeholder:caip:binance:native:bnb-beacon-chain',
    eos: 'eip155:1:/erc20:0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
    fio: 'placeholder:caip:fio:native:fio-protocol'
}

let thorchainToCaip = function(chain:string, symbol:string, ticker:string, type:string){
    try{
        let caip
        //get networkId
        // let chainEnumValue = getChainEnumValue(chain)
        // console.log("chainEnumValue: ", chainEnumValue)
        if(chain == "AVAX" && symbol == "WETH"){
            console.log("WETH detected")
            caip = ChainToCaip[chain]
        } else if(chain == "BSC" && symbol == "BNB"){
            //if chain and symbol are the same, then we have a native token
            caip = shortListNameToCaip['bnbsmartchain']
        } else if(chain == "GAIA" && symbol == "ATOM"){
            //if chain and symbol are the same, then we have a native token
            caip = shortListNameToCaip['cosmos']
        }  else if(chain == "ARB" && symbol == "ETH"){
            //if chain and symbol are the same, then we have a native token
            caip = shortListNameToCaip['arbitrum']
        }else if(chain == "OP" && symbol == "ETH"){
            //if chain and symbol are the same, then we have a native token
            caip = shortListNameToCaip['optimism']
        }  else if(chain == "THOR" || symbol == "RUNE"){
            //if chain and symbol are the same, then we have a native token
            caip = shortListNameToCaip['thorchain']
        } else if(chain == symbol){
            //if chain and symbol are the same, then we have a native token
            caip = ChainToCaip[chain]
        } else {
            //attach symbol to chain
            let networkId = ChainToNetworkId[chain]
            console.log("networkId: ", networkId)
            //if token
            if(symbol.indexOf("-") > -1){
                let contract = symbol.split("-")[1]
                caip = `${networkId}:erc20:${contract}`
            } else {
                console.error({chain, symbol, ticker, type})
                throw Error("Unable to parse CAIP! TODO!")
            }
        }
        //build caip
        return caip
    }catch(e){
        throw e
    }
}
export { thorchainToCaip };


//Primary blockchain caips
export const primaryBlockchains = {
    "eip155:1/slip44:60":{
        name: 'ethereum',
        type: 'coin',
        caip: 'eip155:1/slip44:60',
        tags: [
            'ethereum',
            'isAsset',
            'isNative',
            'KeepKeySupport',
            'DappSupport',
            'WalletConnectSupport'
        ],
        blockchain: 'ethereum',
        symbol: 'ETH',
        decimals: 18,
        image: 'https://pioneers.dev/coins/ethereum.png',
        description: 'Open source platform to write and distribute decentralized applications.',
        website: 'https://ethereum.org/',
        explorer: 'https://etherscan.io/',
        rank: 2
    }
}

export const primaryAssets = {
    "eip155:1/slip44:60":{
        blockchain: 'ethereum',
        caip: 'eip155:1/slip44:60',
        chainId: 1,
        description: 'more info here: https://ethereum.org This is a EVM network with chainId: 1 Follows EIP:155',
        explorer: 'https://ethereum.org',
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
}
