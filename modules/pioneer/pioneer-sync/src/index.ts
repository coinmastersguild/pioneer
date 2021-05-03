/*
    Load db from local

    get index of tx's

    get index of pubkeys

    //get remote account index numbers

    //if diff

    //request diff

    //store in db

    //mark synced




    //
    wallets
    devices
    summation


 */

const TAG = " | Pioneer sync state | "

let nedb = require("pioneer-platform/nedb")
const log = require("@pioneer-platform/loggerdog")()

//app
module.exports = {
    init: function (type:string,config:any,isTestnet:boolean) {
        return init_wallet(type,config,isTestnet);
    },
}

const init_wallet = async function(type:string,config:any,isTestnet:boolean){
    try{

        //get pubkeys from App

        //compare with db

        //compare with remote

        //if diff sync pubkeys



    }catch(e){
        console.error(e)
    }
}
