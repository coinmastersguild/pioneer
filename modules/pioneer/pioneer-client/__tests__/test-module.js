/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})
let pioneerApi = require("../lib")

let signer = require("eth_mnemonic_signer")

//force
// process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let spec = process.env['URL_PIONEER_SPEC']

//const mnemonic = 'all all all all all all all all all all all all'
let mnemonic = process.env['WALLET_MAINNET_DEV']

let username = process.env['TEST_USERNAME_2']
let queryKey = process.env['TEST_QUERY_KEY_2']

// let queryKey = 'key:d9c55eff-a8d0-48e1-bb0f-db131e5576a0'
// let username  = 'user:1911ccde-89df-4fc4-8a71-56097b9d418b'

// let username = process.env['TEST_USERNAME_1']
// let queryKey = process.env['TEST_QUERY_KEY_1']

// let context = 'keepkey-pubkeys-343733331147363327003800'


let run_test = async function(){
    try{
        //get config

        let config = {
            queryKey:'key:public',
            // username:"user:cfd27e74",
            spec
        }

        // let config = {
        //     queryKey:'sdk:pair-keepkey:test-1234',
        //     username,
        //     spec
        // }
        // let config = {
        //     queryKey:"79d94b78-eb50-445d-b97f-e524dca80b58",
        //     username:'test-user-2',
        //     spec
        // }
        console.log("config: ",config)

        //get config
        let pioneer = new pioneerApi(spec,config)
        pioneer = await pioneer.init()

        // console.log(signer)
        // // let globals = await pioneer.instance.Globals()
        // // console.log("globals: ",globals.data)
        //
        // let info = await pioneer.instance.Info()
        // console.log("info: ",info.data)
        //
        // //get address
        // let address = await signer.getAddress(mnemonic)
        // console.log("address: ",address)
        //
        // //is address logged in?
        // let user = await pioneer.instance.GetUser({publicAddress:address})
        // console.log("user: ",user.data)
        //
        // let nonce = user.data.nonce

        // //signup
        // //get message to sign
        // let message = `I am signing my one-time nonce: ${nonce}`
        //
        // //sign
        // let signature = await signer.signMessage(message,mnemonic)
        // console.log("signature: ",signature)

        //login
        // let loginResp = await pioneer.instance.Login("",{publicAddress:address,signature,message})
        // let entry = {publicAddress:address,signature,message}
        // console.log("entry: ",entry)
        // let loginResp = await pioneer.instance.Login({},entry)
        // console.log("loginResp: ",loginResp.data)

        //signup
        //get message to sign
        // let message = `nonce: ${nonce} MOTD: Welcome to the Dapp store!`
        //
        // //sign
        // let signature = await signer.signMessage(message,mnemonic)
        // console.log("signature: ",signature)
        //
        // //update MOTD
        // let updateResp = await pioneer.instance.UpdateMOTD({},{publicAddress:address,signature,message})
        // console.log("updateResp: ",updateResp)


        //add token to auth header

        //see public info
        //see public info + private

        // let status = await pioneer.instance.Status()
        // console.log("status: ",status.data)

        // console.log("tokens: ",status.data.rango.tokens[0])
        // console.log("blockchains: ",status.data.rango.blockchains)
        // console.log("blockchains: ",status.data.rango.blockchains[0])
        // console.log("swappers: ",status.data.rango.swappers)
        // console.log("swappers: ",status.data.rango.swappers[0])

        // console.log("status: ",status.data.exchanges.thorchain)
        // console.log("status: ",status.data.exchanges.thorchain.assets)
        // console.log("status: ",status.data.exchanges.osmosis.assets)


        // let invocation = '7dbdd41c-ce39-4e28-9493-08e3c56e5c5b'
        // let txInfo = await pioneer.instance.Invocation(invocation)
        // console.log("invocation: ",txInfo.data)

        //Submit new dev
        // let dev = {
        //     username: 'highlander',
        //     address:"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //     signature:"asfasdd"
        // }
        //
        //
        // let txInfo = await pioneer.instance.CreateDeveloper(dev)
        // console.log("apps: ",txInfo.data)

        //list developers

        // let txInfo = await pioneer.instance.ListDevelopers()
        // console.log("apps: ",txInfo.data)

        //remove developer



        //get dapps
        let txInfo = await pioneer.instance.ListApps()
        console.log("apps: ",txInfo.data)

        //submit dapp
        // let dapp = {
        //     category: 'dapp',
        //     id: 'a1ca5756d9a7b959a727aea7f3ae3d6223facb363403e9913e984f5868fede2b',
        //     homepage: 'https://yup.io/',
        //     name: 'Yup',
        //     image: 'https://explorer-api.walletconnect.com/v3/logo/md/fa1ad282-9050-4bd6-9aba-53711c4e2a00?projectId=2f05ae7f1116030fde2d36508f472bfb',
        //     whitelist: false,
        //     blockchains: [ 'ethereum' ],
        //     protocol: [ 'wallet-connect-v1' ],
        //     version: 'wc-1',
        //     description: 'app name is Yup'
        // }
        //
        //
        // let txInfo = await pioneer.instance.CreateApp("",dapp)
        // console.log("apps: ",txInfo.data)

        //search dapps


        //delist dapp



        //get new address
        //
        // let newAddy = await pioneer.instance.GetNewAddress({network:'BTC',xpub:""})
        // console.log("newAddy: ",newAddy.data)
        //
        // let newAddyChange = await pioneer.instance.GetChangeAddress({network:'BTC',xpub:""})
        // console.log("newAddyChange: ",newAddyChange.data)

        //get change address

        // let xpub = ""
        // console.log("pioneer.instance: ",pioneer.instance)

        // let data = await pioneer.instance.ListUnspent({network:'LTC',xpub:"xpub6CaVVRYQmMfrGNjbREjgJG83zuS9AmSE4w3F3oTT1n3vjxc8KiUGz37ieXHGEtWEtfnYwUg6iHksGu5577kfVdQMCR6ZU4nAr6NkCMc6pcf"})
        // data = data.data
        // console.log("txData: ",data)
        // console.log("txData: ",JSON.stringify(data))

        // let data = await pioneer.instance.ListUnspent({network:'BTC',xpub:"xpub6CKkkDxRtCu6RWh9VCs3p9N8SzgFspo9qDcXbUkSXfHstFGgAd3XwsYbgQK82m7wnEp1byQGFenCHNk5ndJ8nx9dch7miL44FZV1pVQe6K4"})
        // data = data.data
        // console.log("txData: ",data)
        // console.log("txData: ",JSON.stringify(data))

        //bnb1ez03p4sd8lf985c0tghl9deham56692z94gthw BNB
        // let data = await pioneer.instance.GetAccountInfo({network:'BNB',address:"bnb1ez03p4sd8lf985c0tghl9deham56692z94gthw"})
        // data = data.data
        // console.log("txData: ",data)

        // let data = await pioneer.instance.GetAccountInfo({network:'OSMO',address:"osmo1a7xqkxa4wyjfllme9u3yztgsz363dalz3lxtj6"})
        // data = data.data
        // console.log("txData: ",data)

        // let data = await pioneer.instance.GetPubkeyBalance({asset:'ETH',pubkey:"0x33b35c665496bA8E71B22373843376740401F106"})
        // data = data.data
        // console.log("txData: ",data)

        // let data = await pioneer.instance.GetPubkeyBalance({asset:'XRP',pubkey:"rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"})
        // data = data.data
        // console.log("txData: ",data)

        // let data = await pioneer.instance.GetAccountInfo({network:'XRP',address:"rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe"})
        // data = data.data
        // console.log("txData: ",data)

        //get online

        //get txid {coin,txid}
        // let coin = "BTC"
        // let txid = "83fab6e9084fd3b99bc69221db5c923fa7a8ff1046845940105f88fc551e4d18"
        // let txInfo = await pioneer.instance.GetTransaction({coin,txid})
        // console.log("txInfo: ",txInfo)

        // let refresh = await pioneer.instance.Refresh()
        // refresh = refresh.data
        // console.log("refresh: ",refresh)

        //if username not online abort
        // let onlineUsers = await pioneer.instance.Online()
        // onlineUsers = onlineUsers.data
        // console.log("onlineUsers: ",onlineUsers)

        // let blockheight = await pioneer.instance.BlockHeight({network:"OSMO"})
        // blockheight = blockheight.data
        // console.log("blockheight: ",blockheight)

        // let validators = await pioneer.instance.GetValidators('osmosis')
        // validators = validators.data
        // console.log("validators: ",validators)

        // let validators = await pioneer.instance.GetDelegations({network:'osmosis',address:'osmo1k0kzs2ygjsext3hx7mf00dfrfh8hl3e85s23kn',validator:'osmovaloper1cyw4vw20el8e7ez8080md0r8psg25n0cq98a9n'})
        // validators = validators.data
        // console.log("validators: ",validators)

        // let isOnline = false
        // if(onlineUsers.indexOf(username) >= 0) isOnline = true
        // if(!isOnline) throw Error("User not connected!")

        // let user = await pioneer.instance.User()
        // console.log("user: ",user.data)
        // console.log("user: ",user.data.walletDescriptions[0].balances)
        //
        // let info = await pioneer.instance.Info(user.data.context)
        // console.log("info: ",info.data)

        // let data = await pioneer.instance.Pool("ATOM_OSMO")
        // data = data.data
        // console.log("txData: ",data)

        // let data = await pioneer.instance.QuoteSwap({pair:"OSMO_ATOM",amountIn:"0.001"})
        // data = data.data
        // console.log("txData: ",data)

        // let data = await pioneer.instance.GetThorchainMemoEncoded(null, {})
        // data = data.data
        // console.log("txData: ",data)

        // let code = "GNF1RC"
        // let data = await pioneer.instance.Pair(null, {code})
        // data = data.data
        // console.log("txData: ",data)
        // let address = "0x2356a15042f98f0a53784f42237bd4b2873aadcf"
        // let data = await pioneer.instance.GetNonce(address)
        // data = data.data
        // console.log("txData: ",data)

        // let data = await pioneer.instance.GetGasPrice()
        // data = data.data
        // console.log("txData: ",data)

        //broadcast
        // let broadcast = {
        //     "network":"XRP",
        //     "serialized":"120000228000000024000000032e499602d2201b000000006140000000000003e86840000000000003e873210288e51ae7a166f14d00437e921e3b2d8d637b331cadc3661cd5e596c9921e53da74473045022100c30b9d66d454a6f0110e9942f53a4a2f1f42e1b91c712f34977e1f3e3f4bfd1e02201af57afe965e51f39fcdfd2428361815bc650f5a09b6b8bc097d97eb6cb8135e81149e6e612f7fcf61394125ddb795bd1c9d7687bdef831480432e9a65fa02543c7d303322f86a53aa22d974",
        //     "txid":"",
        //     "invocationId":"pioneer:invocation:v0.01:BNB:ukN1PtxgHozmanDsTrbdNB",
        //     "noBroadcast":false
        // }
        // let data = await pioneer.instance.Broadcast(null, broadcast)
        // data = data.data
        // console.log("data: ",data)

        // let broadcast = {
        //     "network":"BNB",
        //     "serialized":"c101f0625dee0a4a2a2c87fa0a210a14c89f10d60d3fd253d30f5a2ff2b737eee9ad154212090a03424e4210a08d0612210a142023e508399b9f0ff4ff784c14bce6427e69a66812090a03424e4210a08d06126f0a26eb5ae98721024de5c45b971a7d0a417b8b8ad3d0dd1b4b56fb762b9bfefa618ec396b7babbe01240cfe0f12f9d32e616511f50d9aa89a6b0b172593d40d143591a97861f9586d6e212691a8ae6421fa3cf2126419c98461fb49c5318a44d4968d9df5ff83e9562bf18f8d3b703","txid":"EBA89DEDB4C58463C5A733CDEC6A65618EB06CE1A4092559B78EC4BE21445ABD",
        //     "invocationId":"pioneer:invocation:v0.01:BNB:ukN1PtxgHozmanDsTrbdNB",
        //     "noBroadcast":false
        // }
        // let data = await pioneer.instance.Broadcast(null, broadcast)
        // data = data.data
        // console.log("data: ",data)

        // let broadcast = {
        //     serialized: '{"tx":{"fee":{"amount":[{"amount":"0","denom":"rune"}],"gas":"650000"},"memo":"","msg":[{"type":"thorchain/MsgSend","value":{"amount":[{"amount":"50000","denom":"rune"}],"from_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5","to_address":"thor1wy58774wagy4hkljz9mchhqtgk949zdwwe80d5"}}],"signatures":[{"signature":"L/eTznyUAWZqMtH+wp4jYlmSZZkeL5/+EXUYha8BpcVqg14qjg4m0YcTrDkJ6kHBciC8jmU3GPhsEHyKBtbXAg==","pub_key":{"type":"tendermint/PubKeySecp256k1","value":"A9BnfoZvhOO8Y3RpeUFKi6bvTfObGZ0Altybt0wXABUC"}}]},"type":"cosmos-sdk/StdTx","mode":"sync"}',
        //     txid: '',
        //     network: 'RUNE',
        //     invocationId: 'pioneer:invocation:v0.01:BTC:qUhYpSsKcohUXdC5598Rvt'
        // }
        // let data = await pioneer.instance.Broadcast(null, broadcast)
        // data = data.data
        // console.log("data: ",data)

        // let broadcast = {
        //     serialized: '0100000000010282b9a2adf7044c10b85ee9b420e92577110c2720674f64e555eb7e2214d724f90100000000ffffffffcd6b2ddaf07f62082bb0d0415c1576a53d9ba5827c12d375ee38968a046c8ace0000000000ffffffff01a086010000000000160014329035c39cb274eb9cdaa662a7ab0eaaae15612b02473044022066fa2b247a3fb5ddde75e70bc43ecc658faf4d40b5f46b469af07c88c43760cc022004ecafd4bd03cf04fef28461c1d44ef3f19661084dc18dfeeec48cce814836da012102a9b8564f53dde9db22c2775e56c24096f6f52019166b98e4116bbabdc7d20b1202473044022033fe9cdfcb038165ef118795ab0aaf881ef4a055a79af56d0548c26b172b3e64022037194e94eb7d414ba1e58816c327ca77c3b083e826203dfacafc332ebbbc5088012103fa044f4e622a9dc7a877155efad20816c6994f95bd1dc21c339a820395a32e0100000000',
        //     txid: '',
        //     network: 'BTC',
        //     invocationId: 'pioneer:invocation:v0.01:BTC:qUhYpSsKcohUXdC5598Rvt'
        // }
        // let data = await pioneer.instance.Broadcast(null, broadcast)
        // data = data.data
        // console.log("data: ",data)

        // let broadcast = {
        //     serialized: '0xf901538202e08505735cc7c883013880943624525075b88b24ecc29ce226b0cec1ffcb697687b1a2bc2ec50000b8e41fece7b4000000000000000000000000bbe73e0a74019059cf509bc0bcad4040ca9e7379000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000b1a2bc2ec500000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000003b3d3a4254432e4254433a6263317178326772747375756b663677683878363565333230326377343268703263667463636d6170753a32383436353200000000001ba0d696d403614ae60229a275dd00bcf24cf63aa8ceefc03198b1797e279afd861fa020e25f8fabce696587917aab0f610f3f35b0eb72b4bcced306360a885474728f',
        //     txid: '',
        //     network: 'ETH',
        //     invocationId: '95a8db44-bcc2-4a21-b970-7b3f7e172cd9'
        // }
        // let data = await pioneer.instance.Broadcast(null, broadcast)
        // data = data.data
        // console.log("data: ",data)

        // let broadcast = {
        //     serialized: '0xf901511085028fa6ae008301388094a13beb789f721253077faefd9bf604e1929e0e7487038d7ea4c68000b8e41fece7b4000000000000000000000000a13beb789f721253077faefd9bf604e1929e0e74000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000003d535741503a756e646566696e65642e4554483a3078336534383565326337646637313265633137306330383765636635633135303136613033663933660000001ca021214c47d7977f78b2beed0f4c7dfcdf0fcd9bf4232dc2cb2e85372b78908d80a05c86dd58a3d5fc3105c61283b1fff866da9889f33a4a58e6d782b6c4e733d2fd',
        //     coin: 'ETH',
        //     isTestnet:true
        // }
        // let data = await pioneer.instance.Broadcast(null, broadcast)
        // data = data.data
        // console.log("data: ",data)

    }catch(e){
        console.error(e)
    }
}

run_test()
