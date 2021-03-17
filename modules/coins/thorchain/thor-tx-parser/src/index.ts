/*
  const thorMainnetClient: CosmosSDKClient = new CosmosSDKClient({
    server: 'http://104.248.96.152:1317',
    chainId: 'thorchain',
    prefix: 'thor',
    derive_path: "44'/931'/0'/0/0",
  })


    get nodes
    curl https://testnet-seed.thorchain.info

    //testnet
    https://main.d3mbd42yfy75lz.amplifyapp.com/#/nodes

*/
const TAG = " | thorchain-tx-parser | "
require("dotenv").config({path:'../../../.env'})



/**********************************
 // Module
 //**********************************/

module.exports = {
    init:function (url:string,settings:any) {
        return true
    },
    isOnline:function () {
        return true;
    },
    info:function () {
        return get_node_info_verbose();
    },
}


/**********************************
 // Lib
 //**********************************/


let get_node_info_verbose = async function(){
    let tag = TAG + " | get_node_info | "
    try{
        let output:any = {}




        return output
    }catch(e){
        // log.error(tag,"e: ",e)
        throw e
    }
}
