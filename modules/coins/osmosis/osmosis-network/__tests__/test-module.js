/*
    osmosis network


    //price
    https://api-osmosis.imperator.co/tokens/v2/price/osmo

    //get Pool APR's
    //apr/v2/all
    https://api-osmosis.imperator.co/apr/v2/all

 */

require("dotenv").config({path:'../../../../.env'})
require("dotenv").config({path:'../../../../../.env'})
let network = require("../lib/index")


// network.info()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getPool("ATOM_OSMO")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

//get validators
// network.getValidators()
//     .then(function(resp){
//         //console.log("resp: ",resp)
//         console.log("resp: ",resp[0])
//         //console.log("resp: ",resp.result.length)
//     })

// network.getEpochProvisions()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getMintParams()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getEpochs()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getGammPoolInfo()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getDistrobution()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getAPR()
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getSupply('uosmo')
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// let address = 'osmo15cenya0tr7nm3tz2wn3h3zwkht2rxrq7g9ypmq'
// let address = 'osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6'
// let address = 'osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn'
//let address = 'osmo15cenya0tr7nm3tz2wn3h3zwkht2rxrq7g9ypmq'
//let address = 'osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6'
// let address = 'osmo1g33z2rn60acm3e897gmnjfpttfs4hfxzwu8pf6'
// network.getAccount(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getStakingTxs(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getRewards(address)
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//     })

// network.getDelegations(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getValidators()
//     .then(function(resp){
//         console.log("resp: ",resp[0])
//     })

// network.txs(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getAccountInfo(address)
//     .then(function(resp){
//         console.log("resp: ",JSON.stringify(resp))
//     })



// let address = 'osmo1qjwdyn56ecagk8rjf7crrzwcyz6775cj07qz9r'
// network.getBalance(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })
//
// network.getBalances(address)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

let poolId = 'gamm/pool/1'

// let voucher = '27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2'
// network.getIbcTrace(voucher)
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })



// network.getDelegations(address,"osmovaloper1cyw4vw20el8e7ez8080md0r8psg25n0cq98a9n")
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getBlockHeight()
//     .then(function(resp){
//         console.log("resp: ",resp)
//         // console.log("resp: ",JSON.stringify(resp.pools[0]))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

//get pools
// network.getPool('0')
//     .then(function(resp){
//         console.log("resp: ",resp)
//     })

// network.getPools()
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp.pools))
//         // console.log("resp: ",JSON.stringify(resp.pools[0]))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

//https://lcd-osmosis.keplr.app/txs?tx.height=1891147&page=1

// network.getTransaction("208F7FDAD23C405261EAAB3BC6B8508B387375A8384812AF974046E600309B9B")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",JSON.stringify(resp))
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.txs("osmo1fx4jwv3aalxqwmrpymn34l582lnehr3eg40jnt")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.getRewards("osmo1nmkd2hxdw0qyxyfmvffplpq6fxtdy7fea746e9")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         console.log("resp: ",resp.result)
//         console.log("resp: ",resp.result.rewards[0])
//         console.log("resp: ",JSON.stringify(resp))
//     })

// network.getBlock("1891147")
//     .then(function(resp){
//         // console.log("resp: ",resp.block.data)
//            //console.log("resp: ",JSON.stringify(resp))
// })


// network.txsAtHeight("1890635")
//     .then(function(resp){
//         console.log("resp: ",resp)
//         //console.log("resp: ",JSON.stringify(resp))
//     })

// network.getBlock("1891147")
//     .then(function(resp){
//         // console.log("resp: ",resp.block.data)
//            //console.log("resp: ",JSON.stringify(resp))
// })


//good
//let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"80000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"100000","denom":"uosmo"}],"from_address":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6","to_address":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn"}}],"signatures":[{"signature":"4u/eYBnhQigP07lNm9KjLNsReGp0IoiG+HkCQMyEKAIpBgfemnEUg90LMVVRX7e1+fqCrLWPspMbz67romkyBQ==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

//bad
// let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"80000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgDelegate","value":{"delegator_address":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn","validator_address":"osmovaloper1cyw4vw20el8e7ez8080md0r8psg25n0cq98a9n","amount":[{"denom":"uosmo","amount":"100"}]}}],"signatures":[{"signature":"f6UHPOfP2EIpAoBDQA7N4IPufwHcYuwdMOeD2evs6Kcr5hp+6MbCqXmLsGQnEKWjeyyxwar0bp1U/ZL0q9Zk5A==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AvDuqURiCj8S0tQDxSmNL4fUzfAJez6Vy2e3DLQNpmcl"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
// tx = JSON.parse(tx)
// tx = tx.tx
// tx = JSON.stringify(tx)

//good
//let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"190000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgBeginRedelegate","value":{"delegator_address":"osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn","validator_dst_address":"osmovaloper1n3mhyp9fvcmuu8l0q8qvjy07x0rql8q4d3kvts","amount":{"denom":"uosmo","amount":"100"}}}],"signatures":[{"signature":"3d25z15KIUI7FVw0TSipv9ojAurJ3hS1o1fPBIo9wyEp8SF0ta4e30WiggfUaFPNfzxLppNE5uFQ4wva6JWDEA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AvDuqURiCj8S0tQDxSmNL4fUzfAJez6Vy2e3DLQNpmcl"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"80000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"40000","denom":"uosmo"}],"from_address":"osmo10jqlqxqd0extg75s3gxzzrcdp4wvrs6zf49yu4","to_address":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6"}}],"signatures":[{"signature":"tKYxB2rD4GXVvKeE9jtcY5c+UBPK4HKHepdkbGwrMUlFlMw3lpd79TSfFJGeKBpWuq4/cHhe8HX6oz3gfhqrwg==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AmrURAPLuqG8lK8M9F8Scq5JA4oOU5aB3qEXDsFJwU4h"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'
//let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"uosmo"}],"gas":"100000"},"msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"100000","denom":"uosmo"}],"from_address":"osmo1nmkd2hxdw0qyxyfmvffplpq6fxtdy7fea746e9","to_address":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6"}}],"signatures":[{"signature":"wZyol+ayUUO/SiF09kV2jcZrAKe/Wb6zHR/DS0UVUoF3Q4XJv4bZIyAGK6taXOoSINODEurE7S3b2/AwlaukEg==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AygtTy/nNZMzqH9BH+fxxVTtjejSow09LxpUcBcmhzkU"}}]},"mode":"sync","type":"cosmos-sdk/StdTx"}'
// let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"uosmo"}],"gas":"100000"},"msg":[{"type":"cosmos-sdk/MsgDelegate","value":{"delegator_address":"osmo1nmkd2hxdw0qyxyfmvffplpq6fxtdy7fea746e9","validator_address":"osmovaloper1cyw4vw20el8e7ez8080md0r8psg25n0cq98a9n","amount":{"amount":"10000","denom":"uosmo"}}}],"signatures":[{"signature":"745U+vpid8sH0iBtsD90EWQRj+9T7o6YaptAVmd6VFM32QSGUUy9RSOimoZw5YpN7JrZHb1qPYD83FUxlE4brA==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AygtTy/nNZMzqH9BH+fxxVTtjejSow09LxpUcBcmhzkU"}}]},"mode":"sync","type":"cosmos-sdk/StdTx"}'
//let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"290000"},"memo":"","msg":[{"type":"osmosis/gamm/swap-exact-amount-in","value":{"sender":"osmo17htlvce5ys8hqhxlkatyuhv8qwtx72ayggsgqz","routes":[{"poolId":"1","tokenOutDenom":"uosmo"}],"tokenIn":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"1000"},"tokenOutMinAmount":"126"}}],"signatures":[{"signature":"t7JfwKKXjPG2kP6AeUBwysfEUrSW0AetbQQOigaUfdNd8I9cdjQPyUOEBYOBISYsIvZxiO7vzAyXLyujUjnJww==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A4vUMe3eq5MCIlK1D+t97AzPUe1nqsnzsmMl50AyuUAm"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'


//let tx = '{"tx":{"memo":"","fee":{"amount":[{"amount":"100","denom":"uosmo"}],"gas":"200000"},"msg":[{"type":"cosmos-sdk/MsgWithdrawDelegatorReward","value":{"delegator_address":"osmo1nmkd2hxdw0qyxyfmvffplpq6fxtdy7fea746e9","validator_address":"osmovaloper1cyw4vw20el8e7ez8080md0r8psg25n0cq98a9n","amount":{"amount":"10","denom":"uosmo"}}}],"signatures":[{"signature":"LMhC6auKBRlSde8kUx+FjaqmOOgyS/L0eaLsSZBxr1J1VdCbHrskQbT147s7tAMzFXxSwK705CCMNbYVVmIrDw==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"AygtTy/nNZMzqH9BH+fxxVTtjejSow09LxpUcBcmhzkU"}}]},"mode":"sync","type":"cosmos-sdk/StdTx"}'

// let tx = '{"tx":{"type":"cosmos-sdk/StdTx", "value":{"msg":[{"type":"cosmos-sdk/MsgTransfer", "value":{"source_port":"transfer", "source_channel":"channel-0", "token":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2", "amount":"18557"}, "sender":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6", "receiver":"cosmos1a7xqkxa4wyjfllme9u3yztgsz363dalzey4myg", "timeout_height":{"revision_number":"4", "revision_height":"8373701"}}}], "fee":{"amount":[{"denom":"uosmo", "amount":"0"}], "gas":"1350000"},"signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1", "value":"A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B"}, "signature":"8j1r6/8ZpzX3yca7clqqPoQQBCExsYRMiWqgRGMuvfx9MhuFQk+RHVWBgPNYdsvsfDC8fbg+8a+fZ636XKJT+A=="}], "memo":"", "timeout_height":"0"}},"mode":"sync","type":"cosmos-sdk/StdTx"}'

//let tx = '{"type":"cosmos-sdk/StdTx", "value":{"msg":[{"type":"cosmos-sdk/MsgTransfer", "value":{"source_port":"transfer", "source_channel":"channel-0", "token":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2", "amount":"18557"}, "sender":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6", "receiver":"cosmos1a7xqkxa4wyjfllme9u3yztgsz363dalzey4myg", "timeout_height":{"revision_number":"4", "revision_height":"8373701"}}}], "fee":{"amount":[{"denom":"uosmo", "amount":"0"}], "gas":"1350000"},"signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1", "value":"A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B"}, "signature":"8j1r6/8ZpzX3yca7clqqPoQQBCExsYRMiWqgRGMuvfx9MhuFQk+RHVWBgPNYdsvsfDC8fbg+8a+fZ636XKJT+A=="}], "memo":"", "timeout_height":"0"}}'

// let tx = '{"tx":{"type":"cosmos-sdk/StdTx", "value":{"msg":[{"type":"cosmos-sdk/MsgTransfer", "value":{"source_port":"transfer", "source_channel":"channel-0", "token":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2", "amount":"18557"}, "sender":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6", "receiver":"cosmos1a7xqkxa4wyjfllme9u3yztgsz363dalzey4myg", "timeout_height":{"revision_number":"4", "revision_height":"8373701"}}}], "fee":{"amount":[{"denom":"uosmo", "amount":"0"}], "gas":"1350000"},"signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1", "value":"A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B"}, "signature":"8j1r6/8ZpzX3yca7clqqPoQQBCExsYRMiWqgRGMuvfx9MhuFQk+RHVWBgPNYdsvsfDC8fbg+8a+fZ636XKJT+A=="}], "memo":"", "timeout_height":"0"}},"mode":"sync","type":"cosmos-sdk/StdTx"}'


//let tx = '{"tx":{"msg":[{"type":"cosmos-sdk/MsgTransfer", "value":{"source_port":"transfer", "source_channel":"channel-0", "token":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2", "amount":"18557"}, "sender":"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6", "receiver":"cosmos1a7xqkxa4wyjfllme9u3yztgsz363dalzey4myg", "timeout_height":{"revision_number":"4", "revision_height":"8373701"}}}], "fee":{"amount":[{"denom":"uosmo", "amount":"0"}], "gas":"1350000"}, "signatures":[{"pub_key":{"type":"tendermint/PubKeySecp256k1", "value":"A6enCcw1NHqwuGmQTse6ve3iP6oIfJBeM9oJt/1g1l9B"}, "signature":"8j1r6/8ZpzX3yca7clqqPoQQBCExsYRMiWqgRGMuvfx9MhuFQk+RHVWBgPNYdsvsfDC8fbg+8a+fZ636XKJT+A=="}], "memo":"", "timeout_height":"0"}, "mode":"sync", "type":"cosmos-sdk/StdTx"}'
// let tx = '{"tx":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"290000"},"memo":"","msg":[{"type":"osmosis/gamm/swap-exact-amount-in","value":{"sender":"osmo1yc6dftwdhgt96k8yty8djga88f3knhznply6vy","routes":[{"poolId":"1","tokenOutDenom":"uosmo"}],"tokenIn":{"denom":"ibc/27394FB092D2ECCD56123C74F36E4C1F926001CEADA9CA97EA622B25F41E5EB2","amount":"1000"},"tokenOutMinAmount":"126"}}],"signatures":[{"signature":"mAY8uSVrtXO6xBwIhn03gxHb16HGqyLosrsR6J7GcVlpu1domDd3a4osp60uEMSQjQt2Yn98yq4zlBg+W64q/A==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A/SmJZVOYFbYd/Gr3he9k0I+oIbr5GSrOnwqR4KvLwzJ"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}'

// let tx = '{"tx_bytes":{"fee":{"amount":[{"amount":"2800","denom":"uosmo"}],"gas":"80000"},"memo":"","msg":[{"type":"cosmos-sdk/MsgSend","value":{"amount":[{"amount":"100000000","denom":"uosmo"}],"from_address":"osmo15cenya0tr7nm3tz2wn3h3zwkht2rxrq7g9ypmq","to_address":"osmo1ayn76qwdd5l2d66nu64cs0f60ga7px8zmvng6k"}}],"signatures":[{"signature":"WoJ/YiUx6DQKSyXsJxNvLsE8cx/wN9dQI4bxRjT8l1svnQ3fwgWYLknrznGVvFIQcCl5pKD+R3CfZmXzyP7V8A==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A77jrzDlOnPzirxaL82sQm17BOtyqOvTsBmS4tIG4krY"}}]}","type":"cosmos-sdk/StdTx","mode":"BROADCAST_MODE_SYNC"}'

// let tx = 'CowBCokBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmkKK29zbW8xZng0and2M2FhbHhxd21ycHltbjM0bDU4MmxuZWhyM2VnNDBqbnQSK29zbW8xZng0and2M2FhbHhxd21ycHltbjM0bDU4MmxuZWhyM2VnNDBqbnQaDQoFdW9zbW8SBDk5MDASZQpQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohAls8n0w91JK719dmWG4hbz/ppoA9pAmzVs0HRx28HEOSEgQKAggBGHISEQoLCgV1b3NtbxICMTAQkKEPGkCpZDEs4lU0nLx34ziq+TtQuF/iUy+uGK9bVdccvLmowF7o49tb93iSBkqiZMY/PTNLHg1ndp0NnSl0yFZoLP2P'
// // let tx = 'CosBCogBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmgKK29zbW8xcWp3ZHluNTZlY2FnazhyamY3Y3JyendjeXo2Nzc1Y2owN3F6OXISK29zbW8xYTd4cWt4YTR3eWpmbGxtZTl1M3l6dGdzejM2M2RhbHozbHh0ajYaDAoFdW9zbW8SAzEwMBJnClAKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiEDxAIR3QG/2NyilEpHC/cZ0lfckzEN0bwFn+ulzTAZzEgSBAoCCAEYBhITCg0KBXVvc21vEgQyODAwEIDxBBpAkhhxOO2/8HHuF0/Ffy3anBxZd+H1f/SCr7judFFFW/d+yzB0kA2aJOc8FvyxLCKDjAAGIS/mwSp/4RgLNeGpVg=='
// let tx = 'CsIBCr8BCiovb3Ntb3Npcy5nYW1tLnYxYmV0YTEuTXNnU3dhcEV4YWN0QW1vdW50SW4SkAEKK29zbW8xcWp3ZHluNTZlY2FnazhyamY3Y3JyendjeXo2Nzc1Y2owN3F6OXISSAgBEkRpYmMvMjczOTRGQjA5MkQyRUNDRDU2MTIzQzc0RjM2RTRDMUY5MjYwMDFDRUFEQTlDQTk3RUE2MjJCMjVGNDFFNUVCMhoUCgV1b3NtbxILMTAwMDAwMDAwMDAiATESZgpQCkYKHy9jb3Ntb3MuY3J5cHRvLnNlY3AyNTZrMS5QdWJLZXkSIwohA8QCEd0Bv9jcopRKRwv3GdJX3JMxDdG8BZ'

//let tx = 'Cr4BCrsBCiovb3Ntb3Npcy5nYW1tLnYxYmV0YTEuTXNnU3dhcEV4YWN0QW1vdW50SW4SjAEKK29zbW8xaGQ3ZDltaDA2dW1xMmx4em1ubTN4dGU1eHA0cXRmdXI1ODl4cHcSSAgBEkRpYmMvMjczOTRGQjA5MkQyRUNDRDU2MTIzQzc0RjM2RTRDMUY5MjYwMDFDRUFEQTlDQTk3RUE2MjJCMjVGNDFFNUVCMhoQCgV1b3NtbxIHMjAwMDAwMCIBMRJZClEKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiED13f5y1BWmvlBsjHbXZWjTmLHEzyGgGlVYGHydAW1YvESBAoCCAEYiAESBBDgpxIaQH6pkb5Dfk+is0m0cXT8h91t/lzr5N6Frpgw83eQMxieZSJGi9A3NbuTSQyNTcF4kxQIXJDwq839X4knaeiVtVU='
let tx = 'Co0BCooBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEmoKK29zbW8xemprOWRraHp6MndheG10dnRsM2hubmwwdDNhYzBrNXV0eWh4Z3oSK29zbW8xemprOWRraHp6MndheG10dnRsM2hubmwwdDNhYzBrNXV0eWh4Z3oaDgoFdW9zbW8SBTEwMDAwEmcKUApGCh8vY29zbW9zLmNyeXB0by5zZWNwMjU2azEuUHViS2V5EiMKIQJXUh95YUvA24cuby95qg7t813ucN3jU/LoP6q7ljlCuxIECgIIfxhCEhMKDQoFdW9zbW8SBDIyOTEQ8csFGkBm22+OEW5Si/+i38zAEZhuF0fZKRe9P/MgZBSU+whoR0/LBdRjDiuz8NO2C80eiwThlGdxsbh5nomanNRmJZwB'
network.broadcast(tx)
    .then(function(resp){
        console.log("resp: ",resp)
        console.log("resp: ",JSON.stringify(resp))
    })
