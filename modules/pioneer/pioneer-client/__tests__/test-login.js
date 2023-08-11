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
//process.env['URL_PIONEER_SPEC'] = "https://pioneers.dev/spec/swagger.json"
//process.env['URL_PIONEER_SPEC'] = "http://127.0.0.1:9001/spec/swagger.json"

let spec = process.env['URL_PIONEER_SPEC']

const mnemonic = 'all all all all all all all all all all all all'
//let mnemonic = process.env['WALLET_MAINNET_DEV']

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
            queryKey:'key:cfd27e74asda',
            username:"user:cfd27e74asd",
            spec
        }
        console.log("config: ",config)

        //get config
        let pioneer = new pioneerApi(spec,config)
        pioneer = await pioneer.init()
        console.log("pioneer: ",pioneer)

        // //is address logged in?
        let user = await pioneer.User()
        console.log("user: ",user.data)

        //get new auth header
        // console.log(mnemonic)
        let address = await signer.getAddress(mnemonic)
        console.log("address: ",address)
        //


        let nonce
        if(!user.data.username){
            //signup
            //register address
            // let register = {
            //     username:config.username,
            //     blockchains:['ethereum'],
            //     publicAddress:address,
            //     context: address+".wallet.json",
            //     walletDescription:{
            //         context:address+".wallet.json",
            //         type:'mnemonic'
            //     },
            //     data:{
            //         pubkeys:[
            //             {
            //                 type:"address",
            //                 xpub: false,
            //                 blockchain:"ethereum",
            //                 script_type:"ethereum",
            //                 network:"ETH",
            //                 symbol:"ETH",
            //                 path:"",
            //                 pathMaster:"",
            //                 note:"auth user",
            //                 pubkey:address,
            //                 master:address,
            //                 address
            //             }
            //         ]
            //     },
            //     queryKey:this.queryKey,
            //     auth:'lol',
            //     provider:'lol'
            // }
            // console.log("register: ",register)
            // console.log("register: ",JSON.stringify(register))

            //let register = {"username":"user:cfd27e74asd","blockchains":["ethereum"],"publicAddress":"0x73d0385f4d8e00c5e6504c6030f47bf6212736a8","context":"0x73d0385f4d8e00c5e6504c6030f47bf6212736a8.wallet.json","walletDescription":{"context":"0x73d0385f4d8e00c5e6504c6030f47bf6212736a8.wallet.json","type":"mnemonic"},"data":{"pubkeys":[{"type":"address","xpub":false,"blockchain":"ethereum","script_type":"ethereum","network":"ETH","symbol":"ETH","path":"","pathMaster":"","note":"auth user","pubkey":"0x73d0385f4d8e00c5e6504c6030f47bf6212736a8","master":"0x73d0385f4d8e00c5e6504c6030f47bf6212736a8","address":"0x73d0385f4d8e00c5e6504c6030f47bf6212736a8"}]},"auth":"lol","provider":"lol"}

            let register = {
                username: "user:cfd27e74asd",
                blockchains: ["ethereum"],
                publicAddress: "0x73d0385f4d8e00c5e6504c6030f47bf6212736a8",
                context: "0x73d0385f4d8e00c5e6504c6030f47bf6212736a8.wallet.json",
                walletDescription: {
                    context: "0x73d0385f4d8e00c5e6504c6030f47bf6212736a8.wallet.json",
                    type: "mnemonic"
                },
                data: {
                    pubkeys: [
                        {
                            type: "address",
                            xpub: false,
                            blockchain: "ethereum",
                            script_type: "ethereum",
                            network: "ETH",
                            symbol: "ETH",
                            path: "",
                            pathMaster: "",
                            note: "auth user",
                            pubkey: "0x73d0385f4d8e00c5e6504c6030f47bf6212736a8",
                            master: "0x73d0385f4d8e00c5e6504c6030f47bf6212736a8",
                            address: "0x73d0385f4d8e00c5e6504c6030f47bf6212736a8"
                        }
                    ]
                },
                auth: "lol",
                provider: "lol"
            };

            let result = await pioneer.Register(null, register);
            console.log("result register: ", result.data);

            // let result = await pioneer.Register(null, register)
            // console.log("result register: ",result.data)
            // nonce = parseInt(result.data.userInfo.nonce)
        } else {
            nonce = user.data
        }


        //signup
        //get message to sign
        // let message = `I am signing my one-time nonce: ${nonce}`
        //
        // //sign
        // let signature = await signer.signMessage(message,mnemonic)
        // console.log("signature: ",signature)
        //
        // //login
        // let loginResp = await pioneer.Login({},{publicAddress:address,signature,message})
        // console.log("loginResp: ",loginResp.data)

        // //set key as auth header
        // await pioneerApi.updateAuth(loginResp)
        // pioneer = await pioneer.init()

        //validate loggedIn
        // let userInfo = await pioneer.GetUserInfo()
        // console.log("userInfo: ",userInfo.data)

        //isDeveloper?
        // let devInfo = await pioneer.GetDevInfo()
        // console.log("devInfo: ",devInfo.data)
        // //apply to developer
        //
        // if(!devInfo.data){
        //     console.log("creating developer!")
        //     //create dev
        //     let dev = {
        //         email:"highlander@keepkey.com",
        //         github:"BitHighlander"
        //     }
        //     let devcreateResp = await pioneer.CreateDeveloper(null,dev)
        //     console.log("devcreateResp: ",devcreateResp.data)
        // }
        //
        // //isDeveloper?
        // let devInfo2 = await pioneer.GetDevInfo()
        // console.log("devInfo2: ",devInfo2.data)




        //add token to auth header

        //see public info
        //see public info + private

        // let status = await pioneer.Status()
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
        // let txInfo = await pioneer.Invocation(invocation)
        // console.log("invocation: ",txInfo.data)

        //Submit new dev
        // let dev = {
        //     username: 'highlander',
        //     address:"0x2356A15042F98f0a53784F42237bd4b2873AADCF",
        //     signature:"asfasdd"
        // }
        //
        //
        // let txInfo = await pioneer.CreateDeveloper(dev)
        // console.log("apps: ",txInfo.data)

        //list developers

        // let txInfo = await pioneer.ListDevelopers()
        // console.log("apps: ",txInfo.data)

        //remove developer







    }catch(e){
        console.error(e)
    }
}

run_test()
