

let network = require("../lib/index")


let run_test = async function(){
    try{
        await network.init()
        // let balance = await network.getBalance('rGB2Nv8RaqMJTmbawGquoY9yHkHViyjSvD')
        // console.log("balance: ",balance)

        let account = await network.getAccount('rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe')
        console.log("account: ",account)

        //broadcast
        // let signedTx = 'EgAAIoAAAAAkBH+UVS5JlgLSIBtALTJxYUAAAAAAD0JAaEAAAAAAAAPocyECiOUa56Fm8U0AQ36SHjstjWN7Mxytw2Yc1eWWyZIeU9p0RjBEAiBO5jqXM/+fZ2qgmMJgG05nbYt3dqEkTes48S8N1iygyQIgePGS+wpYvYUhlMr/2SKp4sJ/1GrCivFAGAraoejtAPqBFJ5uYS9/z2E5QSXdt5W9HJ12h73vgxRtDPe+yI3A45Tx/XLppuuJX+zuaQ=='
        let signedTx = 'EgAAIoAAAAAkBQZiuy4AAAAAIBtBITvIYUAAAAAAD0JAaEAAAAAAAAPocyED2ZlJm8mK8DHioEQnbevI7lK3DLuvQfqGb3rnVNucCH10RjBEAiAcsW0ax94QkMG6wg+Ls74p9ur8Hi7W+O4ElzfGU369qQIgKUU9cXKxkhNRuhAgS0LlQOuOrRSFiQ1/j+gghIC4Y82BFNUPBhKbiNPW46x1fg5KIxr4qMNqgxSraaZkF9ES4W9AEuvKc4SU7WHL6w=='
        let broadcast = await network.broadcast(signedTx)
        console.log("broadcast: ",broadcast)
    }catch(e){

    }
}
run_test()
