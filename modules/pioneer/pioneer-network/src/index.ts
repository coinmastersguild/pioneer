/*

yarn add @pioneer-platform/utxo-network @pioneer-platform/eth-network @pioneer-platform/ripple-network @pioneer-platform/cosmos-network @pioneer-platform/binance-network @pioneer-platform/thor-network @pioneer-platform/osmosis-network

 */

const TAG = " | pioneer network | ";

let utxo = require('@pioneer-platform/utxo-network')
let ethereum = require('@pioneer-platform/eth-network')
// let eos = require('@pioneer-platform/eos-network')
let ripple = require('@pioneer-platform/ripple-network')
let cosmos = require('@pioneer-platform/cosmos-network')
let binance = require('@pioneer-platform/binance-network')
let thor = require('@pioneer-platform/thor-network')
let osmosis = require('@pioneer-platform/osmosis-network')

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
            thor,
            osmosis
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
                await thor.init()
                await osmosis.init()

                return true
            } catch (e) {
                console.error(e)
                throw e
            }
        }
    }
}
