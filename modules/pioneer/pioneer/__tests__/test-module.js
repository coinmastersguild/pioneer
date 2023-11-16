/*
        Test Network

 */

require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})
const log = require('@pioneer-platform/loggerdog')()
let pioneer = require('../lib/index.js')


let run_test = async function(){
    try{
        log.debug("run test")
        let success = await pioneer.init()
        log.debug("onStart: ",success)
        //username

        //pubkeys
        //let pubkey = "0x33b35c665496bA8E71B22373843376740401F106"
        
        //get all caips for pubkey?
        // let pubkey = {
        //     username: 'user:41922b63',
        //     queueId: 'lol',
        //     pubkey: '0x141d9959cae3853b035000490c03991eb70fc4ac',
        //     symbol: 'ETH',
        //     asset: 'ethereum',
        //     blockchain: 'ethereum',
        //     type: 'address',
        //     path: "m/44'/60'/0'",
        //     script_type: 'ethereum',
        //     network: 'ethereum',
        //     created: 1639943279110,
        //     tags: [],
        //     master: '0x141d9959cae3853b035000490c03991eb70fc4ac',
        //     address: '0x141d9959cae3853b035000490c03991eb70fc4ac',
        //     context: '0x141d9959cae3853b035000490c03991eb70fc4ac.wallet'
        // }

        let pubkey = {
                "context":"keepkey:0x2356A15042F98f0a53784F42237bd4b2873AADCF.wallet",
                "symbol":"ARB",
                "blockchain":"arbitrum",
                "type":"address",
                "master":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
                "pubkey":"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
                "address":"0x2356A15042F98f0a53784F42237bd4b2873AADCF"
        }

        // let result = await pioneer.balances(pubkey)
        // console.log(result)
        //
        // let balances = result.balances
        // log.debug("balances",balances.length)
        // for(let i = 0; i < balances.length; i++){
        //     let balance = balances[i]
        //     //log.debug(balance)
        //     if(!balance.balance) throw Error("Missing balance! "+balance.symbol)
        //     if(!balance.context) throw Error("Missing context! "+balance.symbol)
        //     if(!balance.assetCaip) throw Error("Missing assetCaip! "+balance.symbol)
        //     if(!balance.blockchainCaip) throw Error("Missing assetCaip! "+balance.symbol)
        // }
        
        let pubkeys = [pubkey]
        
        // let pubkeys = [
        //     {
        //         path: "m/44'/0'/0'",
        //         pathMaster: "m/44'/0'/0'/0/0",
        //         source: 'keepkey',
        //         type: 'xpub',
        //         xpub: true,
        //         pubkey: 'xpub6BxKtd6aAuz23XqtWXeSqxShJZn8yqiUmaTdvsPWS3riKkNRcXEPmn1CXmKM1M43mrWfN5QwjdLRghZLrgwMLCeRZqZNuYhVNXr6Pp7aDsH',
        //         note: 'Bitcoin account 0',
        //         symbol: 'BTC',
        //         blockchain: 'bitcoin',
        //         network: 'bitcoin',
        //         script_type: 'p2pkh',
        //         master: '1JNYtQsc1pizKbn3ScbEPfQ7WcxNqeUHNB',
        //         address: '1JNYtQsc1pizKbn3ScbEPfQ7WcxNqeUHNB',
        //         context: '0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet'
        //     },
        //     {
        //         path: "m/84'/0'/0'",
        //         pathMaster: "m/84'/0'/0'/0/0",
        //         source: 'keepkey',
        //         type: 'zpub',
        //         zpub: true,
        //         pubkey: 'xpub6D6UctxqkwVv1sTLwvEfJJJnGEKC6XiKbRfwzsYgWmXGAEwPQ7T2cWzRggxVsHjYzA4m33d7VzgPZyNpW5SFmmjY1g8EFFVwy8CtN8xGhTS',
        //         note: 'Bitcoin account Native Segwit (Bech32)',
        //         symbol: 'BTC',
        //         blockchain: 'bitcoin',
        //         network: 'bitcoin',
        //         script_type: 'p2wpkh',
        //         master: 'bc1q8w2ypqgx39gucxcypqv2m90wz9rvhmmrcnpdjs',
        //         address: 'bc1q8w2ypqgx39gucxcypqv2m90wz9rvhmmrcnpdjs',
        //         context: '0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet'
        //     },
        //     {
        //         path: "m/44'/60'/0'",
        //         pathMaster: "m/44'/60'/0'/0/0",
        //         source: 'keepkey',
        //         note: ' ETH primary (default)',
        //         symbol: 'ETH',
        //         blockchain: 'ethereum',
        //         network: 'ethereum',
        //         script_type: 'ethereum',
        //         type: 'address',
        //         pubkey: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //         master: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //         address: '0x141D9959cAe3853b035000490C03991eB70Fc4aC',
        //         context: '0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet'
        //     },
        //     {
        //         path: "m/44'/931'/0'/0/0",
        //         pathMaster: "m/44'/931'/0'/0/0",
        //         source: 'keepkey',
        //         note: ' Default RUNE path ',
        //         symbol: 'RUNE',
        //         blockchain: 'thorchain',
        //         network: 'thorchain',
        //         script_type: 'thorchain',
        //         type: 'address',
        //         pubkey: 'thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx',
        //         master: 'thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx',
        //         address: 'thor1g9el7lzjwh9yun2c4jjzhy09j98vkhfxfhgnzx',
        //         context: '0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet'
        //     },
        //     {
        //         path: "m/44'/118'/0'/0/0",
        //         pathMaster: "m/44'/118'/0'/0/0",
        //         source: 'keepkey',
        //         note: ' Default ATOM path ',
        //         symbol: 'ATOM',
        //         blockchain: 'cosmos',
        //         network: 'cosmos',
        //         script_type: 'bech32',
        //         type: 'address',
        //         pubkey: 'cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc',
        //         master: 'cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc',
        //         address: 'cosmos1rs7fckgznkaxs4sq02pexwjgar43p5wn7akqnc',
        //         context: '0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet'
        //     },
        //     {
        //         path: "m/44'/714'/0'/0/0",
        //         pathMaster: "m/44'/714'/0'/0/0",
        //         source: 'keepkey',
        //         note: 'Binance default path',
        //         symbol: 'BNB',
        //         blockchain: 'binance',
        //         network: 'binance',
        //         script_type: 'binance',
        //         type: 'address',
        //         pubkey: 'bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap',
        //         master: 'bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap',
        //         address: 'bnb1ch6u3y3yc7aazgrlpx75ej2k9fh20m7gwvskap',
        //         context: '0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet'
        //     },
        //     {
        //         path: "m/44'/145'/0'",
        //         pathMaster: "m/44'/145'/0'/0/0",
        //         source: 'keepkey',
        //         type: 'xpub',
        //         xpub: true,
        //         pubkey: 'xpub6DPARGivQ6adLmcPV1Lg71tgmz8i3fwwy36hguPDFQyoTb2gvg1VkXpL9D2ero7ErGexbRfQ64PPufsS4oUCFrr4tEyobWmxkiyvB9MzEiL',
        //         note: 'Bitcoin Cash Default path',
        //         symbol: 'BCH',
        //         blockchain: 'bitcoincash',
        //         network: 'bitcoincash',
        //         script_type: 'p2pkh',
        //         master: 'bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
        //         address: 'bitcoincash:qzfzukmpry8y4mdp6xz7cy65eagtwhajzvj749257p',
        //         context: '0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet'
        //     },
        //     {
        //         path: "m/44'/2'/0'",
        //         pathMaster: "m/44'/2'/0'/0/0",
        //         source: 'keepkey',
        //         type: 'xpub',
        //         xpub: true,
        //         pubkey: 'xpub6CQaRj3ynJXpPXzx6tbRFXLqcUuVanKWkFusZ9P7cDYAAgMmdC89rq6aofxyp1fXvscxZF5HgWgZgD3VA6sYnJPKqWnCfUxCoD1YX9TpBkx',
        //         note: 'Litecoin Default path',
        //         symbol: 'LTC',
        //         blockchain: 'litecoin',
        //         network: 'litecoin',
        //         script_type: 'p2pkh',
        //         master: 'LeELKgiF1VLuMfZ5UnAnXBStD2RagrB7Eb',
        //         address: 'LeELKgiF1VLuMfZ5UnAnXBStD2RagrB7Eb',
        //         context: '0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet'
        //     },
        //     {
        //         path: "m/44'/3'/0'",
        //         pathMaster: "m/44'/3'/0'/0/0",
        //         source: 'keepkey',
        //         type: 'xpub',
        //         xpub: true,
        //         pubkey: 'xpub6C2KZdjcbhfMzxsXRRUuVgr4ywWpjxnU2jF2pmBr9MizYWHE5Fx6PWA9gVaTv8Rq9KznkYKQ5X2agVe2qyNttro9T6VofuSYKXWCJi6BTLs',
        //         note: 'Dogecoin Default path',
        //         symbol: 'DOGE',
        //         blockchain: 'dogecoin',
        //         network: 'dogecoin',
        //         script_type: 'p2pkh',
        //         master: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
        //         address: 'DHxdwdZDchQMGP5B5HVmS1gEXEoKHQTS54',
        //         context: '0x141D9959cAe3853b035000490C03991eB70Fc4aC.wallet'
        //     }
        // ]


        let username = 'billyTest'
        
        let result = await pioneer.register(username,pubkeys)
        // log.info("register: ",result)
        log.info("balances: ",result.balances.length)
        log.info("nfts: ",result.nfts.length)
        
    }catch(e){
        console.error(e)
    }
}

run_test()
