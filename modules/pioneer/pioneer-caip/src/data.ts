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
    'arbitrum-one': 'eip155:42161/slip44:60',
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

export const shortListSymbolToCaip = {
    BTC: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    ATOM: 'cosmos:cosmoshub-4/slip44:118',
    OSMO: 'cosmos:osmosis-1/slip44:118',
    BCH: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
    LTC: 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
    DASH: 'bip122:dash-hash/slip44:5',
    DGB: 'bip122:digibytes-hash/slip44:20',
    DOGE: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
    RUNE: 'cosmos:thorchain-mainnet-v1/slip44:931',
    THOR: 'cosmos:thorchain-mainnet-v1/slip44:931',
    ETH: 'eip155:1/slip44:60',
    GNO: 'eip155:100/slip44:60',
    MATIC: 'eip155:137/slip44:60',
    OP: 'eip155:10/slip44:60',
    AVAX: 'placeholder:caip:avalanchec:native:avalanche-c-chain',
    ADA: 'placeholder:caip:cardano:native:cardano',
    BNB: 'eip155:56/slip44:60',
    EOS: 'eos:cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f/slip44:194',
    FIO: 'placeholder:caip:fio:native:fio-protocol'
}

export const shortListNameToCaip = {
    bitcoin: 'bip122:000000000019d6689c085ae165831e93/slip44:0',
    cosmos: 'cosmos:cosmoshub-4/slip44:118',
    osmosis: 'cosmos:osmosis-1/slip44:118',
    polygon: 'eip155:137/slip44:60',
    bitcoincash: 'bip122:000000000000000000651ef99cb9fcbe/slip44:145',
    litecoin: 'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2',
    dash: 'bip122:dash-hash/slip44:5',
    digiByte: 'bip122:digibytes-hash/slip44:20',
    dogecoin: 'bip122:00000000001a91e3dace36e2be3bf030/slip44:3',
    thorchain: 'cosmos:thorchain-mainnet-v1/slip44:931',
    ethereum: 'eip155:1/slip44:60',
    avalanche: 'eip155:43114/slip44:60',
    gnosis: 'eip155:100/slip44:60',
    bnbsmartchain: 'eip155:56/slip44:60',
    optimism: 'eip155:10/slip44:60',
    cardano: 'placeholder:caip:cardano:native:cardano',
    binance: 'placeholder:caip:binance:native:bnb-beacon-chain',
    eos: 'eip155:1:/erc20:0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
    fio: 'placeholder:caip:fio:native:fio-protocol'
}

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
