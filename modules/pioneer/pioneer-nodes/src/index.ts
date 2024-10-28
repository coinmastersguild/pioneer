/*
    Pioneer nodes

        Get fresh node list from pioneer server

        test node

        Replenish node list

     GOALS:
        Pioneer has a large healty pool of a whole ecosystem of nodes



 */



const TAG = " | Pioneer Nodes | "
const log = require('@pioneer-platform/loggerdog')()
let {shortListNameToCaip,shortListSymbolToCaip,evmCaips} = require("@pioneer-platform/pioneer-caip")
import {
  blockbooks,
  shapeshift,
  CURRENT_CONTEXT_NODE_MAP
} from './seeds'

import {web3Seeds} from './web3'

let NODES = web3Seeds

module.exports = {
    init: function (type:string,config:any,isTestnet:boolean) {
        return init_nodes(type,config,isTestnet);
    },
    getNodes: function(){
        return NODES
    },
    getNode: function (network:string,serviceId:string) {
        return get_node(network,serviceId);
    },
    getBlockbooks: function () {
        return blockbooks;
    },
    getUnchaineds: function () {
        return get_unchaineds();
    }
}

const get_unchaineds = function () {
    let tag = TAG + " | get_unchaineds | ";
    try {
        // unchaineds filter
        let unchaineds = shapeshift.filter(node => node.type === "unchained");
        //console.log(tag, "unchaineds: ", unchaineds);

        //all networks
        let allNetworks:any = []
        let swaggersByNetwork:any = {}
        let servicesByNetwork:any = {}
        let wssByNetwork:any = {}
        for(let i = 0; i < unchaineds.length; i++){
            let unchaind = unchaineds[i];
            log.debug(tag,"unchaind: ",unchaind.network)

            if (!allNetworks.includes(unchaind.network)) allNetworks.push(unchaind.network);
            if(unchaind.swagger) swaggersByNetwork[unchaind.network] = unchaind.swagger;
            if(unchaind.value && unchaind.protocol == 'http') servicesByNetwork[unchaind.network] = unchaind.value;
            if(unchaind.protocol == 'websocket') wssByNetwork[unchaind.network] = unchaind.value;
        }
        let output = []
        for(let i = 0; i < allNetworks.length; i++){
            let network = allNetworks[i];
            let caip = shortListNameToCaip[network];
            log.debug(tag,"caip: ",caip)

            //build unchaineds
            let unchainedEntry = {
                caip,
                swagger:swaggersByNetwork[network],
                service:servicesByNetwork[network],
                wss:wssByNetwork[network],
                type:'unchained',
                blockchain:network,
            }
            output.push(unchainedEntry)
        }

        return output;
    } catch (e) {
        console.error(tag, "e: ", e);
        throw e;
    }
};









const get_node = function (network:string,serviceId:string) {
    let tag = TAG + " | get_node | "
    try {
        // @ts-ignore
        return CURRENT_CONTEXT_NODE_MAP[network.toUpperCase()][serviceId.toUpperCase()]
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}



const init_nodes = async function (type:string,config:any,isTestnet:boolean) {
    let tag = TAG + " | init_wallet | "
    try {
        log.debug("Checkpoint1  ",config)

        return true
    } catch (e) {
        log.error(tag, "e: ", e)
        throw e
    }
}
