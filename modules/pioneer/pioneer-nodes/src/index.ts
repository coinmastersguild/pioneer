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

//TODO move to seeds

let TIER_ONE_SEED = {
    "COSMOS":{
        "GAIAD":"https://45.79.249.253"
    }
}

//TODO dynamic context setting based on health
let CURRENT_CONTEXT_NODE_MAP = TIER_ONE_SEED


module.exports = {
    init: function (type:string,config:any,isTestnet:boolean) {
        return init_nodes(type,config,isTestnet);
    },
    getNode: function (network:string,serviceId:string) {
        return get_node(network,serviceId);
    },
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
