/*

yarn add @pioneer-platform/utxo-network @pioneer-platform/eth-network @pioneer-platform/ripple-network @pioneer-platform/cosmos-network @pioneer-platform/binance-network @pioneer-platform/thor-network @pioneer-platform/osmosis-network

 */

const TAG = " | pioneer network | ";

const utxo = require('@pioneer-platform/utxo-network')
const ethereum = require('@pioneer-platform/eth-network')
// let eos = require('@pioneer-platform/eos-network')
const ripple = require('@pioneer-platform/ripple-network')
const cosmos = require('@pioneer-platform/cosmos-network')
const binance = require('@pioneer-platform/binance-network')
const thorchain = require('@pioneer-platform/thor-network')
const osmosis = require('@pioneer-platform/osmosis-network')
const midgard = require("@pioneer-platform/midgard-client")
const mayachain = require('@pioneer-platform/maya-network')

export class Network {
    private blockchains: [];
    private networks: any
    init: () => Promise<boolean>;
    constructor(config:any) {
        this.blockchains = config.wss
        this.networks = {
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
        }
        this.init = async function () {
            let tag = TAG + " | init_network | "
            try {
                //TODO custom node config
                
                //TODO audit all nodes
                
                await utxo.init()
                await ethereum.init()
                // await eos.init()
                await ripple.init()
                await cosmos.init()
                await binance.init()
                await thorchain.init()
                await mayachain.init()
                await osmosis.init()
                // await midgard.init() //TODO add init

                return true
            } catch (e) {
                console.error(e)
                throw e
            }
        }
    }
}
