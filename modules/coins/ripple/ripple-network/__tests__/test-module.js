

let network = require("../lib/index")


let run_test = async function(){
    try{
        await network.init()
        // let balance = await network.getBalance('rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe')
        // console.log("balance: ",balance)
        //
        // let account = await network.getAccount('rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe')
        // console.log("account: ",account)


        //broadcast
        let signedTx = 'EgAAIoAAAAAkBH+UeC5JlgLSIBtAGqoPYUAAAAAAAAPoaEAAAAAAAAPocyEDEptvCM3twUHke4YHz/CzW3+hRMc6plhtkriDpE2PW4J0RzBFAiEAmmk/VWCNOj7l34PeGtNXHJIXAzOKkBGQQW+B5+fweoMCIAXYdT0bpq21E1rRf0BTXI/3yaPlg6SO7hcBjhT6RPdjgRRcOQhsRDBCJtesQ0JynAhajApDAYMUXDkIbEQwQibXrENCcpwIWowKQwE='
        //let signedTx = '120000228000000024000000032e499602d2201b000000006140000000000003e86840000000000003e873210288e51ae7a166f14d00437e921e3b2d8d637b331cadc3661cd5e596c9921e53da74473045022100c30b9d66d454a6f0110e9942f53a4a2f1f42e1b91c712f34977e1f3e3f4bfd1e02201af57afe965e51f39fcdfd2428361815bc650f5a09b6b8bc097d97eb6cb8135e81149e6e612f7fcf61394125ddb795bd1c9d7687bdef831480432e9a65fa02543c7d303322f86a53aa22d974'
        let broadcast = await network.broadcast(signedTx)
        console.log("broadcast: ",broadcast)
    }catch(e){

    }
}
run_test()