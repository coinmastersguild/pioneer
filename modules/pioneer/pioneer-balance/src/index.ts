/*

    Pioneer Balance Chart Module

    Query the balance on any network

    pioneer-network map

    utxo,
    ethereum,
    // eos,
    ripple,
    cosmos,
    binance,
    thorchain,
    osmosis,
    midgard,
    mayachain

 */

const TAG = " | pioneer balance | ";

let { caipToNetworkId } = require('@pioneer-platform/pioneer-caip');
let Network = require("@pioneer-platform/pioneer-network");


export const UTXO_SUPPORT = [
    'bip122:000000000019d6689c085ae165831e93/slip44:0', // BTC
    'bip122:000000000000000000651ef99cb9fcbe/slip44:145', // BCH
    'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5', // DASH
    'bip122:00000000001a91e3dace36e2be3bf030/slip44:3', // DOGE
    'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2', // LTC
];

export const TENDERMINT_SUPPORT = [
    'cosmos:mayachain-mainnet-v1/slip44:931',
    'cosmos:osmosis-1/slip44:118',
    'cosmos:cosmoshub-4/slip44:118',
    'cosmos:kaiyo-1/slip44:118',
    'cosmos:thorchain-mainnet-v1/slip44:931', // supportedCaips.ts
];

// Mapping of CAIP identifiers to KeepKey coin names for UTXO chains
export const CAIP_TO_COIN_MAP: { [key: string]: string } = {
    'bip122:000000000019d6689c085ae165831e93/slip44:0': 'Bitcoin',
    'bip122:000000000000000000651ef99cb9fcbe/slip44:145': 'BitcoinCash',
    'bip122:000007d91d1254d60e2dd1ae58038307/slip44:5': 'Dash',
    'bip122:00000000001a91e3dace36e2be3bf030/slip44:3': 'Dogecoin',
    'bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2': 'Litecoin',
};

export const OTHER_SUPPORT = ['ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144'];

export const SUPPORTED_CAIPS = {
    UTXO: UTXO_SUPPORT,
    TENDERMINT: TENDERMINT_SUPPORT,
    EIP155: ['eip155:*'],
    OTHER: OTHER_SUPPORT,
};



export class Balance {
    private blockchains: any[];
    private nodes: any[];
    private charts: any[];
    private networks: any;
    constructor(config: any) {
        this.blockchains = config.wss || [];
        this.nodes = config.nodes || [];
        this.charts = [];
        
        this.init = this.init.bind(this);
        this.getBalance = this.getBalance.bind(this);
    }

    async init(): Promise<boolean> {
        const tag = TAG + " | init_network | ";
        try {
            this.networks = new Network.Network({});
            await this.networks.init();

            //iterate over networks and load nodes
            //filter all nodes with networkId with eip155
            let evmNodes = this.nodes.filter((node: any) => node.networkId.indexOf('eip155') >= 0);
            console.log(tag, "evmNodes: ", evmNodes.length);
            console.log('this.networks: ', this.networks)
            for(let i = 0; i < evmNodes.length; i++){
                let node = evmNodes[i];
                console.log(tag, "node: ", node);
                await this.networks.networks.ethereum.addNode(node);
            }
            // await this.networks.networks.ethereum.addNodes(evmNodes);
            
            let nodesInEth = await this.networks.networks.ethereum.getNodes();
            console.log(tag, "nodesInEth: ", nodesInEth.length);
            
            
            return true;
        } catch (e) {
            console.error(tag, e);
            throw e;
        }
    }

    async getNodes(networkId:string): Promise<any> {
        const tag = TAG + " | getNodes | ";
        try {
            console.log(tag, "networkId: ", networkId);
            console.log(tag,'total nodes: ',this.nodes.length)
            let nodes = this.nodes.filter((node: any) => node.networkId === networkId);
            console.log(tag,'nodes: ',nodes.length)
            
            let nodesEth = await this.networks.networks.ethereum.getNodes();
            
            return nodes;
        } catch (e) {
            console.error(tag, e);
            throw e;
        }
    }

    async classifyCaip(caip: string): Promise<string> {
        if (SUPPORTED_CAIPS.UTXO.includes(caip)) return 'UTXO';
        if (SUPPORTED_CAIPS.TENDERMINT.includes(caip)) return 'TENDERMINT';
        if (caip.startsWith('eip155')) return 'EIP155';
        if (SUPPORTED_CAIPS.OTHER.includes(caip)) return 'OTHER';
        throw new Error(`Unsupported CAIP: ${caip}`);
    }
    
    async getBalance(asset: any, pubkey: any): Promise<any> {
        const tag = TAG + " | getBalance | ";
        if (!asset.caip) throw new Error("caip required!");
        if (!pubkey.pubkey) throw new Error("pubkey required!");

        const networkId = caipToNetworkId(asset.caip);
        console.info(tag, "networkId: ", networkId);

        // Fetch nodes for the network

        // Placeholder for network-specific balance retrieval logic
        const type = await this.classifyCaip(asset.caip);
        switch (type) {
            case 'UTXO': {
                const networkIdToSymbol = {
                    'bip122:000000000019d6689c085ae165831e93': 'BTC', // Bitcoin
                    'bip122:000000000000000000651ef99cb9fcbe': 'BCH', // Bitcoin Cash
                    'bip122:000007d91d1254d60e2dd1ae58038307': 'DASH', // Dash
                    'bip122:00000000001a91e3dace36e2be3bf030': 'DOGE', // Dogecoin
                    'bip122:12a765e31ffd4059bada1e25190f6e98': 'LTC'  // Litecoin
                };
                // @ts-ignore
                let coin = networkIdToSymbol[networkId];
                console.log(tag, 'coin: ', coin);
                const balance = await this.networks.networks.utxo.getBalanceByXpub(coin, pubkey.pubkey);
                console.log(tag, "balance: ", balance);
                asset.balance = (parseFloat(balance) / 1e8).toFixed(8);
                break;
            }
            case 'TENDERMINT': {
                console.log(tag, 'Tendermint transaction');
                if(asset.caip === 'cosmos:mayachain-mainnet-v1/slip44:931'){
                    let result = await this.networks.networks.mayachain.getBalance(pubkey.pubkey);
                    asset.balance = result;
                    console.log(tag,'asset.balance: ',asset.balance)
                }
                if(asset.caip === 'cosmos:osmosis-1/slip44:118'){
                    let result = await this.networks.networks.osmosis.getBalance(pubkey.pubkey);
                    console.log(tag,'result: ',result)
                    asset.balance = result;
                }
                if(asset.caip === 'cosmos:cosmoshub-4/slip44:118'){
                    let result = await this.networks.networks.cosmos.getBalance(pubkey.pubkey);
                    console.log(tag,'result: ',result)
                    asset.balance = result;
                }
                if(asset.caip === 'cosmos:thorchain-mainnet-v1/slip44:931'){
                    let result = await this.networks.networks.thorchain.getBalance(pubkey.pubkey);
                    console.log(tag,'result: ',result)
                    asset.balance = result;
                }
                //TODO tokens/ibc and non-gas assets
                break;
            }
            case 'EIP155': {
                const balance = await this.networks.networks.ethereum.getBalanceAddressByNetwork(networkId, pubkey.pubkey);
                console.log(tag,"balance: ", balance);
                asset.balance = balance;
                break;
            }
            case 'OTHER': {
                if(asset.caip === 'ripple:4109c6f2045fc7eff4cde8f9905d19c2/slip44:144'){
                    asset.balance = await this.networks.networks.ripple.getBalance(pubkey.pubkey);
                }
                console.log(tag, 'Other transaction');
                break;
            }
            default: {
                throw new Error(`Unsupported CAIP: ${asset.caip}`);
            }
        }
        
        

        return asset;
    }
}
