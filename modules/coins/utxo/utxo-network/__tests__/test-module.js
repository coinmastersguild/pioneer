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
        

        // let xpub = 'zpub6rm1EEJg4JasiTqacdouiUVncAc5ymhKReiPZfLTGnH2GSZquRn9reJhj6sfs73PoSJNXzpERKPVLYbwwUGHNF6jkMX5R58vWaLB9FVyJuX'
        // let balance = await network.getBalanceByXpub("BTC",xpub)
        // console.log("balance: ",balance)
        
        // network.utxosByXpub("DOGE","xpub6C2KZdjcbhfMzxsXRRUuVgr4ywWpjxnU2jF2pmBr9MizYWHE5Fx6PWA9gVaTv8Rq9KznkYKQ5X2agVe2qyNttro9T6VofuSYKXWCJi6BTLs")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        //zpub6rm1EEJg4JasiTqacdouiUVncAc5ymhKReiPZfLTGnH2GSZquRn9reJhj6sfs73PoSJNXzpERKPVLYbwwUGHNF6jkMX5R58vWaLB9FVyJuX
        // network.utxosByXpub("BTC","zpub6rm1EEJg4JasiTqacdouiUVncAc5ymhKReiPZfLTGnH2GSZquRn9reJhj6sfs73PoSJNXzpERKPVLYbwwUGHNF6jkMX5R58vWaLB9FVyJuX")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        // network.getPubkeyInfo("BTC","zpub6rm1EEJg4JasiTqacdouiUVncAc5ymhKReiPZfLTGnH2GSZquRn9reJhj6sfs73PoSJNXzpERKPVLYbwwUGHNF6jkMX5R58vWaLB9FVyJuX")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        //getPubkeyInfo
        // network.getPubkeyInfo("DASH","xpub6C32ZcmFoazJmhH5fojYAwHEggwzqo78UfbUXJjUHzxAp3k3373Yn6K56fVKkoTFehxgED6nxqeUvKX5vr8iQ3QMLcuv2pFHjJkFJ9yZMRe")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        // network.getBalanceByXpub("DASH","xpub6C32ZcmFoazJmhH5fojYAwHEggwzqo78UfbUXJjUHzxAp3k3373Yn6K56fVKkoTFehxgED6nxqeUvKX5vr8iQ3QMLcuv2pFHjJkFJ9yZMRe")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        // network.getFee("DASH")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })
        
        // network.getFee("BCH")
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        //let xpub = "zpub6rBjG3tuwP5M2QCpeYgwSq67vujfsBFeUygGrjNQqZ2MgNUrNS39j4Z4mqVLbPi4W5Fr1CLGKrH7DbWeaB3GpkRwJe7g5seMWn4dvZDVWxD"
        // let xpub = "xpub6DPARGivQ6adLmcPV1Lg71tgmz8i3fwwy36hguPDFQyoTb2gvg1VkXpL9D2ero7ErGexbRfQ64PPufsS4oUCFrr4tEyobWmxkiyvB9MzEiL"
        // let xpub = "xpub6DPARGivQ6adLmcPV1Lg71tgmz8i3fwwy36hguPDFQyoTb2gvg1VkXpL9D2ero7ErGexbRfQ64PPufsS4oUCFrr4tEyobWmxkiyvB9MzEiL"
        // network.utxosByXpub("BTC",xpub)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        // let tx = "0100000001dda9f8b3d17320e49c493c079b7f40f1ed094d77ec0cf6001e55d393d5bcae6e010000006b483045022100af6d1500111e9939e4462ca94b33e77bba3086db5571d4616b4c60279cc9dec4022047ee9756dee2ec3ea34cc2c67526e03429701ca7ce605ba09cc55cb0981aed744121032d5a06210f5becb49cfe530735cb0dc04869fd8c3c74150335cb666af120fc89ffffffff0210270000000000001976a9148c179b1a64247e850526eb3acbf5a04865d830bf88ac18a09200000000001976a914922e5b61190e4aeda1d185ec1354cf50b75fb21388ac00000000"

        // let tx = "01000000000103f052dc9907d5c0ec07c2692c9c8cd9bae85ae0aff843059bcc176f41ff607fa40000000000fffffffff052dc9907d5c0ec07c2692c9c8cd9bae85ae0aff843059bcc176f41ff607fa40100000000fffffffff052dc9907d5c0ec07c2692c9c8cd9bae85ae0aff843059bcc176f41ff607fa40200000000ffffffff018b1d010000000000160014e4517b08fe39c90b7900c32d9a7dfb1fa16ba181024730440220702b145a35b86cf6b4cdc62e2e87a72666fe8816c0673305f2677a519ff6e8f402201e602159d5767ed1668ea2dcf4683f535c6c91c414de1ccf87ec7f7843f211f00121031bdf27522ef952002e09decd17c66b271d719a272929a23773b1c43f5a377cb902483045022100e2da2d83e6b01c90607d825b7c6c5db982e119be51fdbb3d32010a2f11476629022048bf94136cf8b9d91c5a12f6727b00f09fddaa2415bfa91f1ef7f8f6f16b502b01210329e088bf8f85dc3b2fe43505b41b991e716f8dc34dd4375e4974e1bbe721840f02483045022100d978b23a57ab2a300cc87cc77048c58c19439e672633bfc0851bfd7724bdf74b02205a280b783af33d4f63fed0e599d776b5435ce2b41051a0c1fcc01f1e5f91cc35012103fde631e44f8e64761119c8bd8f2d2fb74d50a1a0f73c28316a1512883537a5e500000000"
        // network.broadcast("BTC",tx)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

        // let tx = "010000000410aaef0faf25ed89d014e80ddd6aff2ae786c9c018aca19680462b5edca0e1ef000000006b483045022100c21c252bf896ca41bc3200bb10ec5ce1f25f6295820cad1c2dfa8ac40d0c0c490220384878813e467f6bb799d1f75b7461f6ef63e4e90e404765d8afae68d45717010121026e2fbec64003c6f2e6c968b231c1a1c7b858618d6ccc914334fca088156d97c2ffffffffe551cbc1cb8d1a17a7a8099f8c56719f2f3165cefb44b9ff8d560412e6b213dc000000006b483045022100d54cfd2f18282ea567a56c2ea5614b2f9cff6d121f192744c74c6f0b3f5165eb022069c9a5f1b54de3c483ce3e88a27aa4047d677b27c1145f142235cdcf363078560121026e2fbec64003c6f2e6c968b231c1a1c7b858618d6ccc914334fca088156d97c2ffffffffe419fbf1b5b9cde6fa8498a21e32b7cbf816160ae7f846e938b61a5ad448aae8000000006a47304402203714219f83548b7d3abb492b142e4a76e7b46aa36f3ba0786e7826b494f539350220700aa25a9dc3d7dc328036026551eafb1cb5ef2ae71b86702f1e4d6c754f1596012103c27ec108de30e58ca7d171c01d37219fe92ffc2b9423b8af2e188c937c3594a0ffffffff99d43279dffc8c373b3fa013eac0433ed824958cd16bce856e8eeaecaefa07fa010000006a473044022035109fc26796b8b820443d951ba793a8c223a3a4ebe42c9919f90fe1d0d9600a02200ae5ca011bab8c533bc3d23ce991e4d99af0c4cb1b09de4f56bfdf6bcc958fa201210314a641885742c88a48ee5a68a2592a26467abdb513e649c0347c3226fdd1638cffffffff01b2854800000000001976a9141a2952613ded60db06e849d3b942248c9c871b4688ac00000000"
        // network.broadcast("LTC",tx)
        //     .then(function(resp){
        //         console.log("resp: ",resp)
        //         //console.log("resp: ",JSON.stringify(resp))
        //     })

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

        // let xpub = "xpub6CqeSKMnFCNL3iD4FMBXxec7dqwrqvgpHYX7fDKgWQLATp6HS1nNsWvMXKWNbPJ8s6ybHEGWJ6E8V2trZVrYtnZUMT1toFUppxXTpwKh1hG"
        // network.getBalanceByXpub("DGB",xpub)
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
