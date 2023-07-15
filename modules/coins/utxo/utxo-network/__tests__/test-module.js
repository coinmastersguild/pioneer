require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


let servers = [
    {
        type:"unchained",
        swagger:"https://api.litecoin.shapeshift.com/swagger.json",
        service:"https://api.litecoin.shapeshift.com",
        caip:"bip122:12a765e31ffd4059bada1e25190f6e98/slip44:2",
        blockchain:"litecoin",
    },
    {
        type:"unchained",
        swagger:"https://api.bitcoincash.shapeshift.com/swagger.json",
        service:"https://api.bitcoincash.shapeshift.com",
        caip:"bip122:000000000000000000651ef99cb9fcbe/slip44:145",
        blockchain:"bitcoincash",
    }
]

let run_test = async function(){
    try{
        await network.init(servers)

        // network.getFee("BCH")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })


        // let xpub = "xpub6DPARGivQ6adLmcPV1Lg71tgmz8i3fwwy36hguPDFQyoTb2gvg1VkXpL9D2ero7ErGexbRfQ64PPufsS4oUCFrr4tEyobWmxkiyvB9MzEiL"
        // network.utxosByXpub("BCH",xpub)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        let tx = "0100000001dda9f8b3d17320e49c493c079b7f40f1ed094d77ec0cf6001e55d393d5bcae6e010000006b483045022100af6d1500111e9939e4462ca94b33e77bba3086db5571d4616b4c60279cc9dec4022047ee9756dee2ec3ea34cc2c67526e03429701ca7ce605ba09cc55cb0981aed744121032d5a06210f5becb49cfe530735cb0dc04869fd8c3c74150335cb666af120fc89ffffffff0210270000000000001976a9148c179b1a64247e850526eb3acbf5a04865d830bf88ac18a09200000000001976a914922e5b61190e4aeda1d185ec1354cf50b75fb21388ac00000000"
        // let tx = "0100000001ff484916ddaeeef120e41d25f3ac706e6b0d10f21b55ed666313ac83b90d4c0b010000006b483045022100fd6aa378be066331d89fd45d987622b2835a85b6ce44497a57ce3a0c316b556b0220490e1162047307496cda8c34ade80cc2c7a854858c2c54dfcf6ada7ac46aaf8701210303a4b3e9810496902cc2333564a4768f3c74160e9178424068debe7b4e04ceacffffffff02b0c41200000000001976a914885e5acbe3d0198e5b3736095cc6bbd0b2c2349588acacc0cc07000000001976a914e2e74abdea3612eeb9def06e9c54bbb62b74daf688ac00000000"
        network.broadcast("BCH",tx)
            .then(function(resp){
                console.log("resp: ",resp)
                //console.log("resp: ",JSON.stringify(resp))
            })

        // let memo = "thisisjustatestbro"
        // network.getFeesWithRates("BCH",memo)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        // let txid = "83fab6e9084fd3b99bc69221db5c923fa7a8ff1046845940105f88fc551e4d18"
        // network.getTransaction("BTC",txid)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        // let xpub = "ypub6Wev4wL7q61rBeyLc7GpHF3z3nsSz2LXCga32o5ChbEQSaiSGvg7dQqRWv6Md2FzhefZhHP7NpTz4sYUeCsqxs6brzqoeRb81t7YQpVsy5H"
        // // network.getBalanceByXpub("BTC",xpub)
        // //     .then(function(resp){
        // //         console.log("resp: ",resp)
        // //         //console.log("resp: ",JSON.stringify(resp))
        // //     })
        //
        //

        // let xpub = "xpub6C8H3AP8ssoEyzZY42b7G7H6SC341757ASVbpsfDLf3U1Qdc6RP6rnutQ9W9Gk8NWdGR29BFQKP65dzvsf69QtiWe3YPGn4qBQwQCL3HuUV"
        // network.utxosByXpub("DASH",xpub)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })


        // let tx = "01000000000101f9fe24f44e15dcdde0613733e5d45f4070265f46972c378705e646adb816eec70100000000ffffffff03400d0300000000001600140f204604e2225da84ff7e989e3d58c609503d631797a08000000000016001480432e9a65fa02543c7d303322f86a53aa22d97400000000000000003e6a3c3d3a4554482e4554483a3078323335364131353034324639386630613533373834463432323337626434623238373341414443463a323031333835380247304402204dfe5dbdc7d029f2febdf6e0d69b972e72b6aa91a461b8005f2e56b1562ab75c0220718c7d13c44f34298cc6a8d1837a59239a47db12f25d15fac8f744ddd43245e9012102b2972a603d783647374d2fafdd359230e26fe72cdd2316f36212ab6a4b453afc00000000"
        // network.broadcast("BTC",tx)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        //get transaction
        // let txid = "593c4c34aba1d90635e95018d4a9a0e4542ec35adacbb307e0f04901736ec1b9"
        // network.getTransaction("BTC",txid)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         console.log("resp: ",JSON.stringify(resp))
        //     })

        // network.getBlockHeight("BCH")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        //
        // network.getFee("BCH")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        // network.getInfo("BCH")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        // let xpub = process.env["TEST_BCH_XPUB"]
        // console.log(xpub)
        //
        // network.getFee("BTC")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })



        // let xpub = "xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4"
        // network.utxosByXpub("BTC",xpub)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })


        // let xpub = process.env["TEST_BTC_XPUB"]
        // console.log(xpub)
        //
        // network.utxosByXpub("BTC",xpub)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

    }catch(e){
        console.error(e)
    }
}
run_test()
