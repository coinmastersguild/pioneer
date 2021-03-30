/*
    Load db from local

    get index of tx's

    get index of pubkeys

    //get remote account index numbers

    //if diff

    //request diff

    //store in db

    //mark synced
 */

let nedb = require("../lib/index.js")

let run_test = async function(){
    try{
        //
        let dbs = await nedb.init()

        //count
        console.log(dbs)

        let countTxs = await dbs.txs.count()
        let countPubkeys = await dbs.pubkeys.count()
        console.log("countTxs: ",countTxs)
        console.log("countPubkeys: ",countPubkeys)

        //insert

        //delete

    }catch(e){
        console.error(e)
    }
}
run_test()
