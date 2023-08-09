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


import {
  blockbooks,
  shapeshift,
  CURRENT_CONTEXT_NODE_MAP
} from './seeds'




module.exports = {
    init: function (type:string,config:any,isTestnet:boolean) {
        return init_nodes(type,config,isTestnet);
    },
    getNode: function (network:string,serviceId:string) {
        return get_node(network,serviceId);
    },
    getBlockbooks: function () {
        return blockbooks;
    }
}

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
