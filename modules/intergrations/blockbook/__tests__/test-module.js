

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let network = require("../lib/index")

// console.log("servers: ",servers)
let run_test = async function(){
    try{
        //
        await network.init()
        
        console.log(await network.getBlockbooks())
        
        // network.txidsByAddress('DOGE',"DBzgF78jXBxGzL4JnGiSRgxW3iTCjgAotp")
        //     .then(function(resp){
        //         console.log(resp)
        //         console.log(JSON.stringify(resp))
        //     })
        
        //
        // let utxos = await network.utxosByXpub('DASH',"xpub6C32ZcmFoazJmhH5fojYAwHEggwzqo78UfbUXJjUHzxAp3k3373Yn6K56fVKkoTFehxgED6nxqeUvKX5vr8iQ3QMLcuv2pFHjJkFJ9yZMRe")
        // console.log(utxos)
        
        //xpub6C2KZdjcbhfMzxsXRRUuVgr4ywWpjxnU2jF2pmBr9MizYWHE5Fx6PWA9gVaTv8Rq9KznkYKQ5X2agVe2qyNttro9T6VofuSYKXWCJi6BTLs
        // let utxos = await network.utxosByXpub('DOGE',"xpub6C2KZdjcbhfMzxsXRRUuVgr4ywWpjxnU2jF2pmBr9MizYWHE5Fx6PWA9gVaTv8Rq9KznkYKQ5X2agVe2qyNttro9T6VofuSYKXWCJi6BTLs")
        // console.log(utxos)
        
        // let ALL_SOCKETS = network.getBlockbookSockets()
        // // console.log('ALL_SOCKETS: ',ALL_SOCKETS)
        // console.log('ALL_SOCKETS: ',ALL_SOCKETS['BASE'])
        // let address1 = "0x141D9959cAe3853b035000490C03991eB70Fc4aC"
        // // let address2 = "0xc3affff54122658b89c31183cec4f15514f34624"
        // let ETH_SOCKET = ALL_SOCKETS["BASE"]
        // let resultConnect = await ETH_SOCKET.connect()
        // console.log('resultConnect: ',resultConnect)
        //
        // let result2 = await ETH_SOCKET.subscribeAddresses([address1], ({ address, tx }) => console.log('new tx for address', address, tx))
        // console.log('result2: ',result2)
        
        //ETH_SOCKET.subscribeAddresses([address2], ({ address, tx }) => console.log('new tx for address', address, tx))
        //sub to address

        // let utxos = await network.utxosByXpub('LTC',"xpub6CQaRj3ynJXpPXzx6tbRFXLqcUuVanKWkFusZ9P7cDYAAgMmdC89rq6aofxyp1fXvscxZF5HgWgZgD3VA6sYnJPKqWnCfUxCoD1YX9TpBkx")
        // console.log(utxos)

        //
        // let utxos = await network.utxosByXpub('DGB',"xpub6CqeSKMnFCNL3iD4FMBXxec7dqwrqvgpHYX7fDKgWQLATp6HS1nNsWvMXKWNbPJ8s6ybHEGWJ6E8V2trZVrYtnZUMT1toFUppxXTpwKh1hG")
        // console.log(utxos)

        // let utxos = await network.utxosByXpub('BTC',"ypub6WamSeXgTYgy7W25fVorMLDHFx5SPkuYaE7ToWCiyCUK2jdWpufQ8VqkDg83YjBtJFHDoekhf9ESdPDbL9aCPXC5NnmzXUiq3J6oycFShfS")
        // console.log(utxos)

        // let utxos = await network.utxosByXpub('DOGE',"xpub6C2KZdjcbhfMzxsXRRUuVgr4ywWpjxnU2jF2pmBr9MizYWHE5Fx6PWA9gVaTv8Rq9KznkYKQ5X2agVe2qyNttro9T6VofuSYKXWCJi6BTLs")
        // console.log(utxos)

        //e75d35b3cea88892f7c2e0014a32b39d005623aaf7146433326cafd10cdaa925
        // network.getTransaction('DGB',"e75d35b3cea88892f7c2e0014a32b39d005623aaf7146433326cafd10cdaa925")
        //     .then(function(resp){
        //         console.log(resp)
        //         console.log(JSON.stringify(resp))
        //     })


        network.broadcast("BTC","0100000003f052dc9907d5c0ec07c2692c9c8cd9bae85ae0aff843059bcc176f41ff607fa4000000006a47304402200b004392d3d0a745360407205988d21d950bc366694edda156ab032fb26733f90220130e23fa3c74412c6ab69140e697684bc487bbe8da2e2e7859cee890f22c45aa0121031bdf27522ef952002e09decd17c66b271d719a272929a23773b1c43f5a377cb9fffffffff052dc9907d5c0ec07c2692c9c8cd9bae85ae0aff843059bcc176f41ff607fa4010000006b483045022100bdf1524c63adb0cb70060242be03b07d4647e1c4f49cc4118c0f5b6791799e69022048076dd969d3b240892bdee06650b0224f09e37df58e8a836da6c2498b521b9c01210329e088bf8f85dc3b2fe43505b41b991e716f8dc34dd4375e4974e1bbe721840ffffffffff052dc9907d5c0ec07c2692c9c8cd9bae85ae0aff843059bcc176f41ff607fa4020000006b483045022100e407102ceb5ca07b42b634de3257b015bfbe1646d0ce968e5c0a0e37258458d9022011487015a677ac0edea7da162d20ed2c0dd27e8b059b9ab950f366c18f17cd18012103fde631e44f8e64761119c8bd8f2d2fb74d50a1a0f73c28316a1512883537a5e5ffffffff018b1d010000000000160014e4517b08fe39c90b7900c32d9a7dfb1fa16ba18100000000")
            .then(function(resp){
                console.log("txid: ",resp)
            })

    }catch(e){
        console.error(e)
    }
}
run_test()

// network.init(servers)
// network.init()
//console.log("keepkeyPubkeys: ",process.env["TEST_BCH_XPUB"])

//txidsByAddress
// network.txidsByAddress('DOGE',"DBzgF78jXBxGzL4JnGiSRgxW3iTCjgAotp")
//     .then(function(resp){
//         console.log(resp)
//         console.log(JSON.stringify(resp))
//     })
//
// network.broadcast("BTC","01000000000103f052dc9907d5c0ec07c2692c9c8cd9bae85ae0aff843059bcc176f41ff607fa40000000000fffffffff052dc9907d5c0ec07c2692c9c8cd9bae85ae0aff843059bcc176f41ff607fa40100000000fffffffff052dc9907d5c0ec07c2692c9c8cd9bae85ae0aff843059bcc176f41ff607fa40200000000ffffffff018b1d010000000000160014e4517b08fe39c90b7900c32d9a7dfb1fa16ba181024730440220702b145a35b86cf6b4cdc62e2e87a72666fe8816c0673305f2677a519ff6e8f402201e602159d5767ed1668ea2dcf4683f535c6c91c414de1ccf87ec7f7843f211f00121031bdf27522ef952002e09decd17c66b271d719a272929a23773b1c43f5a377cb902483045022100e2da2d83e6b01c90607d825b7c6c5db982e119be51fdbb3d32010a2f11476629022048bf94136cf8b9d91c5a12f6727b00f09fddaa2415bfa91f1ef7f8f6f16b502b01210329e088bf8f85dc3b2fe43505b41b991e716f8dc34dd4375e4974e1bbe721840f02483045022100d978b23a57ab2a300cc87cc77048c58c19439e672633bfc0851bfd7724bdf74b02205a280b783af33d4f63fed0e599d776b5435ce2b41051a0c1fcc01f1e5f91cc35012103fde631e44f8e64761119c8bd8f2d2fb74d50a1a0f73c28316a1512883537a5e500000000")
//     .then(function(resp){
//         console.log("txid: ",resp)
//     })

// network.broadcast("ETH","0xf86e8202ab85028fa6ae008301388094c3affff54122658b89c31183cec4f15514f34624870aa87bee5380008025a04cbf2dc700925319439ae86413eb50a82a7250eff94a2e6e82b223ff8873ca16a04f2745e71c811889ca6a1fdb36ff33486c0f7b7796638d757a3af1adb3ce1afa")
//     .then(function(resp){
//         console.log("txid: ",resp)
//     })

// network.getAddressInfo('ETH',"0x33b35c665496bA8E71B22373843376740401F106")
//     .then(function(resp){
//         console.log(resp)
//         console.log(JSON.stringify(resp))
//     })

// let address = ""
// network.getAddressInfo('BTC',"1BToRvt4zvTCrAb4WXLErvbaKNCh9Vpo8w")
//     .then(function(resp){
//         console.log(resp)
//         console.log(JSON.stringify(resp))
//     })

// network.getPubkeyInfo('BTC',"")
//     .then(function(resp){
//         console.log(resp)
//         console.log(JSON.stringify(resp))
//     })

// network.getTransaction('BCH',"")
//     .then(function(resp){
//         console.log(resp)
//         console.log(JSON.stringify(resp))
//     })

//xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K
// network.utxosByXpub("BCH","xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K")
//     .then(function(resp){
//         console.log(resp)
//     })

//xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K

//xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K
// network.utxosByXpub("BCH","xpub6BtH1WStaVrzUC3mfoxy1F7MkJ9Tx5fjmMAn2RKaHSeYRNFYiQZWHchbWY7edcXwj4Un9cF1qMuA8tkEpkkcDc5WKgenPD5ZfXvpErPNx2K")
//     .then(function(resp){
//         console.log(resp)
//     })


// network.utxosByXpub("BTC","xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4")
//     .then(function(resp){
//         console.log(resp)
//     })

// network.utxosByXpub("DASH","xpub6C8H3AP8ssoEyzZY42b7G7H6SC341757ASVbpsfDLf3U1Qdc6RP6rnutQ9W9Gk8NWdGR29BFQKP65dzvsf69QtiWe3YPGn4qBQwQCL3HuUV")
//     .then(function(resp){
//         console.log(resp)
//     })

//xpub6Cr6W159pVE2uD81Wk9wSTKbV4mCmP4tVUoSEJYXpLG9gQEoX3drsmt2B8dgcdSfpXWL9bGjqoxECNumrt2w9ZKPCa4Gb4uHQ66N6QD5gTv
//xpub6BmWYygsuCXawCvwEMXao2mC8BCuVFHhrh77mefp4GqjNmPVQqgARFTuyB3wjnDXGaTgHUBmG4KkEMg42pCEUi1JhCeiYHsA8WacJmueSyS
// network.utxosByXpub("DOGE","xpub6BmWYygsuCXawCvwEMXao2mC8BCuVFHhrh77mefp4GqjNmPVQqgARFTuyB3wjnDXGaTgHUBmG4KkEMg42pCEUi1JhCeiYHsA8WacJmueSyS")
//     .then(function(resp){
//         console.log(resp)
//     })

// network.utxosByXpub("BCH","xpub6DQeaEQDZFKcrEucnZuzDsP4YPm9fdzNGEzRfwbeFNt5yWEvc2Eb2YMZMjmghJMnrMWT7iTevP2E1dTLUQfNrwk5mAycxXUfEqmJGpN1xFw")
//     .then(function(resp){
//         console.log(resp)
//     })

//0x02f87482a86a028459682f00850bfda3a30082520894c3affff54122658b89c31183cec4f15514f3462487038d7ea4c6800080c080a0f4676ba535a3b30a860770addd9d528aceec7c3660c3b6230392d9df547d78a1a07352470b4ab95b2365d355e2992e133319fcde45a61ed31f3b501b8f9a0e824b
// network.broadcast("AVAX","0x02f87482a86a028459682f00850bfda3a30082520894c3affff54122658b89c31183cec4f15514f3462487038d7ea4c6800080c080a0f4676ba535a3b30a860770addd9d528aceec7c3660c3b6230392d9df547d78a1a07352470b4ab95b2365d355e2992e133319fcde45a61ed31f3b501b8f9a0e824b")
//     .then(function(resp){
//         console.log("txid: ",resp)
//     })


//0100000001ff484916ddaeeef120e41d25f3ac706e6b0d10f21b55ed666313ac83b90d4c0b010000006b483045022100fd6aa378be066331d89fd45d987622b2835a85b6ce44497a57ce3a0c316b556b0220490e1162047307496cda8c34ade80cc2c7a854858c2c54dfcf6ada7ac46aaf8701210303a4b3e9810496902cc2333564a4768f3c74160e9178424068debe7b4e04ceacffffffff02b0c41200000000001976a914885e5acbe3d0198e5b3736095cc6bbd0b2c2349588acacc0cc07000000001976a914e2e74abdea3612eeb9def06e9c54bbb62b74daf688ac00000000
// network.broadcast("DASH","0100000001ff484916ddaeeef120e41d25f3ac706e6b0d10f21b55ed666313ac83b90d4c0b010000006b483045022100fd6aa378be066331d89fd45d987622b2835a85b6ce44497a57ce3a0c316b556b0220490e1162047307496cda8c34ade80cc2c7a854858c2c54dfcf6ada7ac46aaf8701210303a4b3e9810496902cc2333564a4768f3c74160e9178424068debe7b4e04ceacffffffff02b0c41200000000001976a914885e5acbe3d0198e5b3736095cc6bbd0b2c2349588acacc0cc07000000001976a914e2e74abdea3612eeb9def06e9c54bbb62b74daf688ac00000000")
//     .then(function(resp){
//         console.log("txid: ",resp)
//     })

// network.broadcast("BTC","010000000001010b7d1970f03be0fb1a7c5f8d4d6883fb92c074ce5d4ea844acc4d09bc66af1f90000000000ffffffff02bfd401000000000016001404b2d1dfb0f0851f15677952aad0d985dbe4f8917ce6010000000000160014d5912b6b45047455eb1d50d8743a17741b8d56b902483045022100d045b60037b15ec90cc230ff3b90b4f03c555ed20942ae5b55195f1e162260af022051feaf0ee49b8e2e6f8362a654caf1cf3c12c1dcc51dc0a7987c1c75914b938e012103910e3986b59c24876c3d89e14e184abaf6abc97ebf9e2d4f9f6bf6df83a613d100000000")
//     .then(function(resp){
//         console.log("txid: ",resp)
//     })


// network.init()
//     .then(function(resp){
//         //hex
//         //btc
//         // network.broadcast("BTC","0100000001b160b71735295f4b3c29956202af20de2ceb308fc051589d1b407058cad11275000000006a4730440220663552016bbaef903f934081850d27852e44adb79355f05d9e89916fdcff9a8e02203fd60160ba494555395e3ee5d996e4bdab76776f3177c6485b534e26eaa1b1740121031b93b955dc7dbd579d45ad3a5b7edf9cf25410e0960bae32eeb8a818c7f5711affffffff021027000000000000160014586d610cebab2b00070cc0b7c2ef30daae040d074e1a0f0000000000160014586d610cebab2b00070cc0b7c2ef30daae040d0700000000")
//         //     .then(function(resp){
//         //         console.log("txid: ",resp)
//         //     })
//
//         network.getAllTokensEth("0x33b35c665496ba8e71b22373843376740401f106")
//             .then(function(resp){
//                 console.log(resp)
//                 console.log(JSON.stringify(resp))
//             })
//
//         //let txid
//         // let txid = "537692a2ab9547e7c2652cf11e3a51023f6877a7817eb8a94269a1c8ffffcced"
//         // network.getTransaction("TEST",txid)
//         //     .then(function(resp){
//         //         console.log(resp)
//         //         console.log(JSON.stringify(resp))
//         //     })
//
//         // console.log(process.env["TEST_BTC_TPUB"])
//         // network.getBalanceByXpub("TEST",process.env["TEST_BTC_TPUB"])
//         //     .then(function(resp){
//         //         console.log(resp)
//         //     })
//
//         // network.utxosByXpub("TEST",process.env["TEST_BTC_TPUB"])
//         //     .then(function(resp){
//         //         console.log(resp)
//         //     })
//
//         // network.getBalanceByXpub("TEST",process.env["TEST_BTC_TPUB"])
//         //     .then(function(resp){
//         //         console.log(resp)
//         //     })
//     })

// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })

// network.getInfo()
//     .then(function(resp){
//         console.log(resp)
//     })
