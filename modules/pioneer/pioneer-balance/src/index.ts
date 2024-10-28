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
            console.log(tag, "evmNodes: ", evmNodes);
            console.log('this.networks: ', this.networks)
            this.networks.networks.ethereum.addNodes(evmNodes);

            return true;
        } catch (e) {
            console.error(tag, e);
            throw e;
        }
    }

    async getBalance(asset: any, pubkey: any): Promise<any> {
        const tag = TAG + " | getBalance | ";
        if (!asset.caip) throw new Error("caip required!");
        if (!pubkey.pubkey) throw new Error("pubkey required!");

        const networkId = caipToNetworkId(asset.caip);
        console.info(tag, "networkId: ", networkId);

        // Fetch nodes for the network
        const networkNodes = this.nodes.filter((node: any) => node.networkId === networkId);

        // Placeholder for network-specific balance retrieval logic
        if (networkId.indexOf('eip155') >= 0) {
            // Assuming networkNodes[0] is configured correctly for Ethereum
            const balance = await this.networks.networks.ethereum.getBalanceAddressByNetwork(networkId, pubkey.pubkey);
            console.log(tag,"balance: ", balance);
            asset.balance = balance;
        }

        return asset;
    }
}
