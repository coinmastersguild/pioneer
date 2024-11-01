require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let pioneerApi = require("../lib")

/*

 */

let dapps = [
    {
        "category": "dapp",
        blockchain:"ripple",
        "name": "Ripple Basic Wallet",
        "homepage": "https://keepkey-sdk.vercel.app/",
        "app": "https://keepkey-sdk.vercel.app/",
        "image": "https://i.imgur.com/KiIOwjp.png",
        "preview":"https://i.imgur.com/KiIOwjp.png",
    },
]

// let dapps_ethereum = [
//     {
//         "category": "dapp",
//         "id": "d2ae9c3c2782806fd6db704bf40ef0238af9470d7964ae566114a033f4a9a110",
//         "homepage": "https://etherscan.io/",
//         "app": "https://etherscan.io/",
//         "name": "Etherscan",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/de60f6e0-effe-4b8c-1f3e-e12278839300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     {
//         "category": "dapp",
//         "id": "be49f0a78d6ea1beed3804c3a6b62ea71f568d58d9df8097f3d61c7c9baf273d",
//         "homepage": "https://uniswap.exchange/",
//         "app": "https://app.uniswap.org/",
//         "name": "Uniswap",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/32a77b79-ffe8-42c3-61a7-3e02e019ca00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     {
//         "category": "dapp",
//         "id": "f759efd17edb158c361ffd793a741b3518fe85b9c15d36b9483fba033118aaf2",
//         "homepage": "https://opensea.io/",
//         "name": "OpenSea",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/c441b686-1a37-4976-c56c-f18d62167f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     // {
//     //     "category": "dapp",
//     //     "id": "a85fb60f37b9971969e00caa241ed2b6ccd8fce369f59d3a965202595a4a9462",
//     //     "homepage": "https://gnosis-safe.io/",
//     //     "name": "Gnosis Safe Multisig",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/0b7e0f05-0a5b-4f3c-315d-59c1c4c22c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     {
//         "category": "dapp",
//         "id": "d82213ea5c476a43d9ab48d2011e3a5329a07826bd8191b24815e5bfe8c207be",
//         "homepage": "https://compound.finance/",
//         "name": "Compound",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/cc221221-b436-45f2-f69a-e6217795aa00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     {
//         "category": "dapp",
//         "id": "02563239502b03cef22f5e71059ce97bd48cf7ab0f856964d7e17c0e3631db9f",
//         "homepage": "https://zapper.fi/",
//         "name": "Zapper",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/4c97d203-d07a-4b2a-04e3-5f9ea7afca00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     {
//         "category": "dapp",
//         "id": "e6c38d65364335d550f629c44a1a86eb6befffa363e7de1cdba26462838226fd",
//         "homepage": "https://app.aave.com/",
//         "name": "Aave",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/a51c1090-6ffd-4439-e472-64abc01c9a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     {
//         "category": "dapp",
//         "id": "8308656f4548bb81b3508afe355cfbb7f0cb6253d1cc7f998080601f838ecee3",
//         "homepage": "https://unstoppabledomains.com/manager",
//         "name": "Unstoppable Domains",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/76485115-d114-4833-4038-9da190432900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     {
//         "category": "dapp",
//         "id": "a90d95ac84983ea0d5370b2584a3db4a1aee1975e0b86801e0ddd8159c80d5ff",
//         "homepage": "https://app.rarible.com/#/connect",
//         "name": "Rarible",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/d366a65c-4b98-4850-438b-925087f96800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     {
//         "category": "dapp",
//         "id": "f98ce170f08376732dfddde7823a5f97d9039bcec4e5df02f3978858eb84d305",
//         "homepage": "https://1inch.exchange/",
//         "name": "1inch Exchange",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/9c99c3d8-c678-4a4f-4415-a4613bb34100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     {
//         "category": "dapp",
//         "id": "7bc4da398540ed770b1d7608a62f253985f9850a2c28abb5c74f94cca37fadbd",
//         "homepage": "https://yearn.finance/",
//         "name": "yearn",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/361e726a-7413-4448-58ac-4779664ddf00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     },
//     // {
//     //     "category": "dapp",
//     //     "id": "8e96e3b538965f3bcac2836b6579df3a9de55ce69c49e5ac1a6889c8f0b8df7b",
//     //     "homepage": "https://adex.network/",
//     //     "name": "Adex Network",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/24c09ae8-4797-420a-a29b-776e44850300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "bf528087bc3d8ae759444e8246cd56d5a0ddea701274163294e533f20353832b",
//     //     "homepage": "https://oasis.app",
//     //     "name": "Oasis App",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/55f53ede-1298-424b-da8c-54677bfff500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "e15a799a9a997f09035d48444afae83b0f7dd74fe5eefc5ec47ad679df29ceaa",
//     //     "homepage": "https://mantradao.com/",
//     //     "name": "MANTRA DAO",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3b7fcd83-703b-4801-5b73-52af0dc44e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "185850e869e40f4e6c59b5b3f60b7e63a72e88b09e2a43a40b1fd0f237e49e9a",
//     //     "homepage": "https://atomicwallet.io/",
//     //     "name": "Atomic",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/adb1ed3f-722c-48a0-441f-c75038a9a300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "6d9f418c42768bc939bd83acd7f7db0507dcc3cd0dac209a65ed5ca34b360079",
//     //     "homepage": "https://matcha.xyz",
//     //     "name": "Matcha",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ef3ffa09-858c-4f21-4a90-90cf58389100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "1f69170bf7a9bdcf89403ec012659b7124e158f925cdd4a2be49274c24cf5e5d",
//     //     "homepage": "https://coolwallet.io/",
//     //     "name": "CoolWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e97c4a6d-cd91-4331-ac98-196141df5300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "beea4e71c2ffbb48b59b21e33fb0049ef6522585aa9c8a33a97d3e1c81f16693",
//     //     "homepage": "https://alicedapp.com/",
//     //     "name": "Alice",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/bd1ce165-9b3a-4925-73c1-b329ca13e900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "138f51c8d00ac7b9ac9d8dc75344d096a7dfe370a568aa167eabc0a21830ed98",
//     //     "homepage": "https://alphawallet.com/",
//     //     "name": "AlphaWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/5b1cddfb-056e-4e78-029a-54de5d70c500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "70cad09a92cb1c278dd876b3c46173dfd2ed394ecef1bd803ee001d7632e93a1",
//     //     "homepage": "https://instadapp.io/",
//     //     "name": "InstaDapp",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8a230219-3048-4194-2ce2-0e62c9aaba00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "468b4ab3582757233017ec10735863489104515ab160c053074905a1eecb7e63",
//     //     "homepage": "https://dcentwallet.com",
//     //     "name": "D'CENT Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1efb49ec-2bab-4fa1-f2f2-4392c64ed000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "44ff1e444b11207673bb2e832138afa0062e4618659189b9207990a7767dccdf",
//     //     "homepage": "https://matic.network/",
//     //     "name": "Matic Network",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4f85c13e-39ce-4353-fca7-cbdcffe14f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "501ce637a32ca401d7fe8f10664f29b2cbff6f4a83e23df30affe2a8c3c36bec",
//     //     "homepage": "https://nash.io/",
//     //     "name": "Nash",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/12f981b1-bb0a-4115-009f-317255979600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "8240fb8a7b117aed27f04aa8870c714eeb910f7c1b16c9b868e793c1836335b8",
//     //     "homepage": "https://nash.io/",
//     //     "name": "Nash",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/12f981b1-bb0a-4115-009f-317255979600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "21ab23fb856af690a4cd42ec6505a1398b571da2a772717ad3f0e047f34cced7",
//     //     "homepage": "https://bamboorelay.com/",
//     //     "name": "Bamboo Relay",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1ddc4d21-2830-4846-a2fa-f424911aaf00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "a395dbfc92b5519cbd1cc6937a4e79830187daaeb2c6fcdf9b9cce4255f2dcd5",
//     //     "homepage": "https://cybavo.com/",
//     //     "name": "CYBAVO Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3117d3ce-b973-4cfd-8fb5-f5d72ed3c200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c889f5add667a8c69d147d613c7f18a4bd97c2e47c946cabfdd13ec1d596e4a0",
//     //     "homepage": "https://tokenary.io/",
//     //     "name": "Tokenary",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/5e481041-dc3c-4a81-373a-76bbde91b800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "7b83869f03dc3848866e0299bc630aaf3213bea95cd6cecfbe149389cf457a09",
//     //     "homepage": "https://spatium.net/",
//     //     "name": "Spatium",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e85caf96-8e6c-4ac5-5bb3-c13ac7edc700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "ddcd44ec977ae9e456f1ea930a46e67fa7537c0c89498deb17b1d29c4274ff31",
//     //     "homepage": "https://sablier.finance/",
//     //     "name": "Sablier",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/0f0fc040-f985-46d4-a026-7859b9e25e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150",
//     //     "homepage": "https://safepal.io/",
//     //     "name": "SafePal",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7c4f63f5-3cf6-4043-3c71-139e6f245000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "013e3e71441eaf78044b05f30544cac56ea91a5e5a8a39b62bd0b80808de00da",
//     //     "homepage": "https://dex.ag/",
//     //     "name": "DEX.AG",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/531249ab-22e9-4cb0-9a22-090187434600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "0cc13b1d63976ca5dd90dcbfb234e95f69d4edde6a24cbcd09683a5fd944040e",
//     //     "homepage": "https://ens.domains/",
//     //     "name": "ENS Domains",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/cef7b7fa-7ae4-4840-2540-927475ac5700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "176b83d9268d77438e32aa44770fb37b40d6448740b6a05a97b175323356bd1b",
//     //     "homepage": "https://wallet.io/",
//     //     "name": "wallet.io",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/82cdf116-4355-4e07-88e4-63dc2e253500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "802a2041afdaf4c7e41a2903e98df333c8835897532699ad370f829390c6900f",
//     //     "homepage": "https://infinitywallet.io/",
//     //     "name": "Infinity Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/9f259366-0bcd-4817-0af9-f78773e41900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "2871556630e7ed3588218a4279561f71735b7567c3e48b2f80b2a7705c51e0c3",
//     //     "homepage": "https://idle.finance/",
//     //     "name": "Idle Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e964c8dd-dcc0-4e85-6835-6225d4a90f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "ce64cd600d0ae877f47ba0148501bcd23ee1c08a2adeaaf69310679ec3fe7132",
//     //     "homepage": "https://iearn.finance/",
//     //     "name": "iearn.finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/fd156146-87ab-4d38-ed5b-ff82459ac900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "98f22f6c710f0142d04591df1a1938d94b81450bba0f986757432b6719f6e641",
//     //     "homepage": "https://rcn.market/",
//     //     "name": "RCN Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a81d62a5-3a6b-4ff4-a003-dfe46ea9f900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "244a0d93a45df0d0501a9cb9cdfb4e91aa750cfd4fc88f6e97a54d8455a76f5c",
//     //     "homepage": "https://easypocket.app/",
//     //     "name": "EasyPocket",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a9fcf1d1-3b2c-4226-0fb9-a6c8f2647300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "881946407ff22a32ec0e42b2cd31ea5dab52242dc3648d777b511a0440d59efb",
//     //     "homepage": "https://mtpelerin.com/bridge-wallet",
//     //     "name": "Bridge Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/989d504f-93db-4ca6-c00a-9d1faf177d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "3b0e861b3a57e98325b82ab687fe0a712c81366d521ceec49eebc35591f1b5d1",
//     //     "homepage": "https://sparkpoint.io/",
//     //     "name": "SparkPoint",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/34c4f901-70de-4507-e7a0-bc7887843000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "6f9d21b4f537a5b82406ee97b1ed06311bf60500ac6e6fb822dd2de73dda0593",
//     //     "homepage": "https://kickback.events/",
//     //     "name": "Kickback",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/411ef676-c4a4-4ec4-74ee-ef44100b2000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "ca86f48760bf5f84dcd6b1daca0fd55e2aa073ecf46453ba8a1db0b2e8e85ac1",
//     //     "homepage": "https://viawallet.com/",
//     //     "name": "ViaWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ffc3ba49-2e6b-4baa-304d-ebb253f74700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "38ee551a01e3c5af9d8a9715768861e4d642e2381a62245083f96672b5646c6b",
//     //     "homepage": "https://peakdefi.com/",
//     //     "name": "PEAKDEFI Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/744a3fbe-4261-4148-133e-49c5b58cb400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "41b51f689a37ffb63d6663fc8ea0c86e0bc6a030f835bb3e5d5e53dc03b83b35",
//     //     "homepage": "https://mintbase.io/",
//     //     "name": "Mintbase",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/bd1cf0ce-12d0-42ac-8599-69ae440ece00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "7e90b95230bc462869bbb59f952273d89841e1c76bcc5319898e08c9f34bd4cd",
//     //     "homepage": "https://unstoppable.money/",
//     //     "name": "Unstoppable Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/5c38b22c-adb9-4899-3252-6e3d71458500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "7da158932208181d61b9e421e2a2088fb70d4adf64adc676e185fcea5396e4d0",
//     //     "homepage": "https://daostack.io/",
//     //     "name": "DAOstack",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/726cd470-c827-4b6c-d1e5-c3c72e771800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "025247d02e1972362982f04c96c78e7c02c4b68a9ac2107c26fe2ebb85c317c0",
//     //     "homepage": "https://halodefi.org/",
//     //     "name": "HaloDeFi Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/af664892-49ef-4045-642e-347a4e98ee00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "d12b6e114af8c47a6eec19a576f1022032a5ee4f8cafee612049f4796c803c7e",
//     //     "homepage": "https://dokwallet.com/",
//     //     "name": "Dok Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/6886f45d-1451-41ec-ebc7-b18bebfc3c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "fffd1ef5d2105b1b89252c0cf4596a400444d7d4d592268e5699d301eff08ae2",
//     //     "homepage": "https://myetherwallet.com/",
//     //     "name": "MyEtherWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/08dc867e-1b5a-4212-99e5-db027201ae00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "3d56ed42374504f1bb2ba368094269eaea461c075ab796d504f354baac213dc5",
//     //     "homepage": "https://authentrend.com/at-wallet/",
//     //     "name": "AT.Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a5b7369b-d92c-41a4-0263-ca28f4597600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "14e870c10e5e83f9590db63ae5d369e56cb8d88ed6aa27fa021b1ec37ca561cd",
//     //     "homepage": "https://affogato.co/",
//     //     "name": "Affogato",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/74b60040-e5b5-452e-07c1-721950acc800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "e4a14f67fb4fbfe240ec43efdca3c50e15ab7302446def657e47e86ec999e655",
//     //     "homepage": "https://stablepay.io/",
//     //     "name": "StablePay",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/63e2e0fa-79cd-4dde-1825-319ff5abd500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "1e04cf5cddcd84edb1370b12eae1fcecedf125b77209fff80e7ef2a6d3c74719",
//     //     "homepage": "https://midasprotocol.io/",
//     //     "name": "Midas Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4b7268e6-47fb-46bc-6f3c-424f44695f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "15d1d97de89526a3c259a235304a7c510c40cda3331f0f8433da860ecc528bef",
//     //     "homepage": "https://ellipal.com/",
//     //     "name": "Ellipal",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/0a805e10-bfc0-4d02-d9c1-8cec88f0dc00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "c1b96e441428dac9475c162de858d5c4e78c09a9948d0a2626cc37376fa99407",
//     //     "homepage": "https://defisaver.com/",
//     //     "name": "DeFi Saver",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/83bd6352-7191-4f6e-457d-c279e101e900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "5429480c60b48a6c93557ee57b56ec66bba892f4e90c84e54ba233a864de4124",
//     //     "homepage": "https://thorchain.org/",
//     //     "name": "ThorChain",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b6f27cc5-2e88-448c-5691-9e57ec782c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "19ad8334f0f034f4176a95722b5746b539b47b37ce17a5abde4755956d05d44c",
//     //     "homepage": "https://aktionariat.com/",
//     //     "name": "Aktionariat",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/6d18e8ea-b536-4038-c5bf-94a499d5a400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "95501c1a07c8eb575cb28c753ab9044259546ebcefcd3645461086e49b671f5c",
//     //     "homepage": "https://talken.io",
//     //     "name": "Talken Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1afb5a3a-2da3-40ce-baf9-b416e7510600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "b0234ad23e4ab635e63a86f1b6adbda87edcad6ac426321e865daf991dc12ce8",
//     //     "homepage": "https://heliowallet.com/",
//     //     "name": "HelioWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/0677f4c2-1197-46d8-f71e-692b964d1900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "d612ddb7326d7d64428d035971b82247322a4ffcf126027560502eff4c02bd1c",
//     //     "homepage": "https://flarewallet.io",
//     //     "name": "Flare Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/dfd3a3d8-d386-4c47-ff26-5c24845d2e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "0e680e620e7a8d15a8048aa6d9a825e07291a1da23a82ced661aa96ed2e81998",
//     //     "homepage": "https://escaroo.com/",
//     //     "name": "Escaroo",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4b28db68-d364-4a87-e2cf-562511fed400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "2ed796df33fdbde6a3ea6a47d3636b8341fe285038d844c7a78267b465b27028",
//     //     "homepage": "https://kyberswap.com/",
//     //     "name": "KyberSwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3abd1720-260e-495a-2e31-3d0b349e0d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "54d4f6b75cf9288dbade3a17363ba67c45043fc384f58c2c8c4f1b67da139d60",
//     //     "homepage": "https://kyberswap.com/",
//     //     "name": "KyberSwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3abd1720-260e-495a-2e31-3d0b349e0d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "5f46863e8fdeb98a98dea1ca9ecaef896c8f4382ba6778deeaf65a399bb7e679",
//     //     "homepage": "https://tokenmarket.net/",
//     //     "name": "TokenMarket",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f229dc28-f73c-49f3-9dab-01d0fff12900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "6193353e17504afc4bb982ee743ab970cd5cf842a35ecc9b7de61c150cf291e0",
//     //     "homepage": "https://atoken.com",
//     //     "name": "AToken Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d93fb51d-f2b1-4b4e-f741-7485461bd500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "4e6af4201658b52daad51a279bb363a08b3927e74c0f27abeca3b0110bddf0a9",
//     //     "homepage": "https://www.tongue.fi",
//     //     "name": "Tongue Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/20bc4fdb-b9e6-429a-8cba-c233b3273000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "d4835d7f70d198d1c9e03bebdd3c27bb68b4bb621de3797c08eb35d8ef2833da",
//     //     "homepage": "https://mesa.eth.link/",
//     //     "name": "Mesa",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ff1cfba4-063c-440c-eb2a-39e193266500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "b13fcc7e3500a4580c9a5341ed64c49c17d7f864497881048eb160c089be5346",
//     //     "homepage": "https://rsk.co/",
//     //     "name": "RWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a883229c-26cb-4c19-9b34-1f0ed4012a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "13c6a06b733edf51784f669f508826b2ab0dc80122a8b5d25d84b17d94bbdf70",
//     //     "homepage": "https://plasmapay.com/",
//     //     "name": "PlasmaPay",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/466c8fd0-fcec-4621-b94f-e91ce1439f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "0aafbedfb8eb56dae59ecc37c9a5388509cf9c082635e3f752581cc7128a17c0",
//     //     "homepage": "https://o3.network",
//     //     "name": "O3Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e1c7c6af-c731-463e-55f0-5e686e9f6200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "b971da97af8b126d704c9c19e324d3b44ea885c067da3631eb22fb5e8b9180e1",
//     //     "homepage": "https://chainsfr.com",
//     //     "name": "Chainsfr",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f630585c-9851-43e2-f5f4-3274e4d8b100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "761d3d98fd77bdb06e6c90092ee7071c6001e93401d05dcf2b007c1a6c9c222c",
//     //     "homepage": "https://me.hashkey.com/",
//     //     "name": "HashKey Me",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/72734fac-9500-4c2c-81ba-678f7fc32700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "32f5f734ca5e57cd5e448aa4fc0a720b802d67182a0b6494f46867241fae3b9e",
//     //     "homepage": "http://aka3.net",
//     //     "name": "AKA3 Email Alias",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b4483574-f280-43cf-44b9-fea896017f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "0a00cbe128dddd6e096ebb78533a2c16ed409152a377c1f61a6a5ea643a2d950",
//     //     "homepage": "https://jadewallet.io/",
//     //     "name": "Jade Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8a6f6b6f-9e25-43d2-6cb8-42013579bd00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c04ae532094873c054a6c9339746c39c9ba5839c4d5bb2a1d9db51f9e5e77266",
//     //     "homepage": "https://guarda.com/",
//     //     "name": "Guarda Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/0142b5f2-2006-465f-fe0e-2021225d8c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "ffa139f74d1c8ebbb748cf0166f92d886e8c81b521c2193aa940e00626f4e215",
//     //     "homepage": "https://defiantapp.tech/",
//     //     "name": "Defiant",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/026462e7-09a3-47f6-6b46-49df18133b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "b6b9e0449871fbe29174da88d909c4eb127cdcaf545ac470daaed9b0d93d515c",
//     //     "homepage": "https://sushi.com/",
//     //     "name": "SushiSwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/22071a0c-f7c7-42f6-d2f6-957a4aefc900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "1ce6dae0fea7114846382391d946784d95d9032460a857bb23b55bd9807259d1",
//     //     "homepage": "https://trusteeglobal.com/",
//     //     "name": "Trustee Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2432f3c2-83f1-486b-6081-d03acc33e000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "d8663d3a49e8c0ace8ece983fc6fbdb47bdfcc3b1dacbafb99940c9e7ddc9429",
//     //     "homepage": "https://unagii.com/",
//     //     "name": "Unagii",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/35c40958-536c-46a0-1579-2c5bffab1c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "0afb52d86941c9f09946295848506fe4bc5e35f0fef606ce2ade789f76a6fbea",
//     //     "homepage": "https://cream.finance/",
//     //     "name": "Cream Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/0a806f2a-4df7-45ed-a620-5518aa3efc00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "d01c7758d741b363e637a817a09bcf579feae4db9f5bb16f599fdd1f66e2f974",
//     //     "homepage": "https://valoraapp.com",
//     //     "name": "Valora",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a03bfa44-ce98-4883-9b2a-75e2b68f5700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "6e8bece35cfcfeed1aa4922e939c118ab26f51af5c7ab842a6a77a00694d4b9f",
//     //     "homepage": "https://shells.exchange/",
//     //     "name": "Shell Exchange",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/5b6c5fa0-094a-4b4c-3aa2-bdeeece19600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "36d854b702817e228d5c853c528d7bdb46f4bb041d255f67b82eb47111e5676b",
//     //     "homepage": "https://celowallet.app/",
//     //     "name": "Celo Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/482c9981-61c0-4782-84ec-c80fd997da00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "6c5f0f23fb7158576a5f314585ad520a43d3afae1a6cad59dcff626709525c2b",
//     //     "homepage": "https://swapx.org/",
//     //     "name": "SwapX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/6e00f72f-3594-43f5-7c33-f65231db1500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "717911f4db0c5eda0e02e76ed179b7940ba1eefffdfb3c9e6540696226860da0",
//     //     "homepage": "https://elastos.org",
//     //     "name": "Elastos Essentials",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/04a6bfed-d80e-4f7b-0516-261f86aa4000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "8858da9365f7ab948c4f137ff93a5c8cbc311fe5321fcd31dccea6efdba538aa",
//     //     "homepage": "https://starname.me/",
//     //     "name": "Starname",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/27d2976e-e2bc-431d-307c-29444f7fa900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c20b97dd1679625f4eb0bccd727c80746cb13bd97208b0c8e62c89cfd1d4b9cc",
//     //     "homepage": "https://fuse.cash/",
//     //     "name": "fuse.cash",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/71828267-72d6-4680-e144-265e6dc1e400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "82f6a24e8c52f80c2ed28e718202cb12fdb22df34419c327e6846c1544e107f3",
//     //     "homepage": "https://space.storage/",
//     //     "name": "Space",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7bfa15f2-4220-4fff-5dcc-5155f6878200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "43055637bd8d3da2afa83b1650348c8ccafa67e0c201afe2c0f2a06a9aecae18",
//     //     "homepage": "https://mask.io/",
//     //     "name": "Maskbook",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c0257309-6bbb-46aa-a8de-3850ba6fe700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "fbc8d86ad914ebd733fec4812b4b7af5ca709fdd9e75a930115e5baa02c4ef4c",
//     //     "homepage": "https://rabby.io/",
//     //     "name": "Rabby",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7e82c795-574b-4e0f-1be7-d0677babed00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "2d7b5ef9ea6e5b856440ad38ac3e9ffc6e311f353aae4a90daadf4654e31ffb7",
//     //     "homepage": "https://snapshot.page/",
//     //     "name": "Snapshot",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b96552e9-6c7d-467c-bb37-486224d77e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "9d6c614d1995741d5313f1f3dbf1f66dcba694de782087d13b8721822502692f",
//     //     "homepage": "https://stasis.net/",
//     //     "name": "Stasis",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7ae753bc-a754-450c-2d90-2c5521734400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "a6ffb821a3c32d36fc9d29e29c2ff79a0cd1db0bca453714777846ddf3fdff76",
//     //     "homepage": "https://justliquidity.org/",
//     //     "name": "JulWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/cabd50de-22fa-487b-ce68-2c63de8bb800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "2f010ad2b0777998e950b5d72969e3b6a7090f0dde59b509ce9a41a5d1b2f9f4",
//     //     "homepage": "https://functionx.io/",
//     //     "name": "f(x) Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4d5c5c70-5abb-43ba-fc5e-577b6e403300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "cacf4ce4b9b170741b0dbdb8c008c61e88faae3eae5bd58db549925859940410",
//     //     "homepage": "https://ankr.com/",
//     //     "name": "Ankr",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4b1415b2-0d50-4147-f40b-e189baa62900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "96bf9b7141215037f4a9f567ce536b1eb2836fb71cc67c07ba73f3c3eadc53d6",
//     //     "homepage": "https://getbull.app/",
//     //     "name": "Bull App",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b3c42bfd-5078-4616-a2ad-e4e322bbf600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "fc65284c7e407387d732fbfe5d57ed378a89db28c3559ada079f9097d43d2575",
//     //     "homepage": "https://anybit.io",
//     //     "name": "Anybit",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/6aac5fb1-d400-4e81-4709-bef8b2c00900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "492caa74c01551142885e2e5ecbe760f82e4c0206e8d3fe4d8c14477032b0412",
//     //     "homepage": "https://tokamak.network/",
//     //     "name": "Tokamak Network",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/78677d83-39ea-40b0-5fc1-71b55c822d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "dea4ab675289353a508956c4f821bc4e9141d9f99a5d244ae7af92b4d575db6d",
//     //     "homepage": "https://minerva.digital/",
//     //     "name": "Minerva Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7d5f3710-7c2c-49fc-7893-bacd3f384000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "57361b007a69218b00842b78d7cb4f98afd3572cb52ef950c4fd05c0a47c21e1",
//     //     "homepage": "https://actus-protocol.io/",
//     //     "name": "Actus Protocol",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ebe33e1c-1fad-4a04-fae7-bde8c0395400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "3cdf74643ac60e3f1d5807cb3dfa9d843793a4d1f3a233066fd35b61e72d42b9",
//     //     "homepage": "https://criptoarchi.com/",
//     //     "name": "ArchiPage",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b62c4f22-e781-4ca9-5c01-ef7cd9d23400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "1fe0c2ed2ddd10d7caf2db5d873a8fde1817dff12a29dff0e9c59e99ee8cd8a4",
//     //     "homepage": "https://astrotools.io/",
//     //     "name": "AstroTools.io",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2500eaa0-1ab0-45d9-1bd9-d55dcf389700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "45ad03d00056530b6a275ec4babe7b04f15cdcd4a5b14c8d6b9a26adcc84928a",
//     //     "homepage": "https://rubic.exchange/",
//     //     "name": "Rubic Exchange",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/9469e6eb-de46-4754-a96a-c0fe48893b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "76745388a50e6fea982c4dee2a3ad61a8aa417668be870754689caa8a7506c93",
//     //     "homepage": "https://tangem.com",
//     //     "name": "Tangem",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8a5b6e94-e378-458d-bf2e-017cc7958e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "3c930df62f0ac573c8d993debb4de3e32fc0159ca85543dcadf3eb7e06a57e54",
//     //     "homepage": "https://harvest.finance/",
//     //     "name": "Harvest Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d4290957-85d1-48a7-ca52-2c7a2bc5e800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "67d728ec0a4d650a7a5b28390df634b86f775efc5075123aab537fc7fc53f045",
//     //     "homepage": "https://chainge.finance",
//     //     "name": "Chainge Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/addaaf64-cf13-46ef-a022-d97189156f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "9d93c497dc5c835abd1ddd3c5d388eaf54b995b49573340d9580b366259b7972",
//     //     "homepage": "https://iotex.io/",
//     //     "name": "ioPay",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/aa40d575-f7f4-4aa6-12c4-c8f055ad0800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "9c2a672e60f354708a3e622d7cf3fd11a25d7f8265f811ede376f599cc077102",
//     //     "homepage": "https://mushrooms.finance/",
//     //     "name": "Mushroom Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c85b4577-b36c-45da-b80f-f68df5714100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "d516cd697587ceacdeb96c302488b43daf4a08732c6cdc6533989fb0598715dd",
//     //     "homepage": "https://bitfrost.finance/",
//     //     "name": "Bitfrost Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b9564ec5-c5c9-448a-554a-629a7fc0fa00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "addb6cfece8fe6d2e7039baf5b2ba3249da48957b08bcc877a2e32eaffa6e7aa",
//     //     "homepage": "https://wallet3.io/",
//     //     "name": "Wallet 3",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d740b48c-2b55-4a27-b5f5-d2188200ca00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "416a17a68726c10896a46e9ecbb25eaa0e342611b2387d4787902bf1984b68e9",
//     //     "homepage": "https://abtwallet.io/",
//     //     "name": "DID Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/673b7f3b-a555-4327-f9b7-fefa535bc500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "0ace4cf765779f94e3f546dee7bf2852dee333c57999ca04ae80403df4a14cd7",
//     //     "homepage": "https://datamine.network/",
//     //     "name": "Datamine Network",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e4eb7c77-c414-4a54-8360-fd79d73ed900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "f5dfce6586648970f967d75640ae074553deb3a93dda5ce109de894d61027b59",
//     //     "homepage": "https://streamr.network/",
//     //     "name": "Streamr",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3fba8813-5516-4bda-5489-f0630d32e200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c1abb33fa718be77d96c56a3f9720400e9c5de2f79ef50ad6a2c19b1c28659f3",
//     //     "homepage": "https://deploystarship.com",
//     //     "name": "StarBase",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2bd78dfd-37d9-4334-8afb-17544b85f200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "29449bf9d53ae02dd64a6719915c65882d7d634cca2d2de19586c772e6cbe759",
//     //     "homepage": "https://shinobi-wallet.net/",
//     //     "name": "Shinobi Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f5cf868c-5347-4d5e-e80f-c6ece8fcb600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "0fbcea2de72eee88bb00512395fb1e99388ffbb1746cdf01dffc6797d4f06bfd",
//     //     "homepage": "https://dappradar.com/",
//     //     "name": "DappRadar",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b1067596-9867-48bc-6ec5-319574b72500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "3175fb08702c0c5945b837a47d333fa4f323763557623200b1f52cd57de6fa7b",
//     //     "homepage": "https://superrare.co/",
//     //     "name": "SuperRare",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2c2dffd0-0648-42a1-208c-0bff37210900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "34ecba237dabd32d823ecc328e125d503434609185c7bfb4ce8106618fdcfc10",
//     //     "homepage": "https://arbitrum.io/",
//     //     "name": "Arbitrum",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/58ad55a3-ae46-471d-800a-ad932791cd00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "403308a7b7d5da26558cb3658d963d9a87648940a38cc04143f223815d631aa5",
//     //     "homepage": "https://open.seaio.cc/",
//     //     "name": "GD Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/5363dc86-3de9-4197-c6ed-e8167b673a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "541b38c73c267bfacf2383cc6c4fb0b23fcd93c092b265bdf4e2c6f521c385da",
//     //     "homepage": "https://paraswap.io/",
//     //     "name": "ParaSwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/881020b3-f73d-4487-e692-71312d815900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "2235b648bdf382bc1a6960f1db8eda5c71f65a1996e6cb549d24783ca58a2903",
//     //     "homepage": "https://binana.vip/",
//     //     "name": "Binana",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/65a60845-8fe3-4146-2688-586e4dc68a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "a0718f5fb1493e4aaac72cff62d162cb85db40ed68fd8700298f36f1d5c4b73d",
//     //     "homepage": "https://airgap.it",
//     //     "name": "AirGap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/cc530d2d-4d01-4f9f-cf38-14deb71fd600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "7c207664419cd871fc76a8e6d4496800877bcd9592eb42b4b987608344663f8f",
//     //     "homepage": "https://honeyswap.org/",
//     //     "name": "HoneySwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f926f4d6-7938-4e66-2540-26dcc8d07300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "76428179ce9213ab6f8f49923310efcf5eea089764196c7a2018bea8afcd6603",
//     //     "homepage": "https://paytube.io/",
//     //     "name": "PayTube",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/58230f60-6c7b-400c-ab96-cb1fd0391700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "b127136d3fae5d392cc34eba50d6788a248345a797e696ad5f6ee88aabe1eaa6",
//     //     "homepage": "https://proofofhumanity.id/",
//     //     "name": "Proof of Humanity",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3a7dc781-1d01-41c5-fe92-09347187b300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "42049d5de7c9e88664bb4e13db614decb08a4ba4f0e6eefd5617f25d3cb2983b",
//     //     "homepage": "https://blockbank.ai",
//     //     "name": "BlockBank",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/5b2cc39f-bc4f-4ac1-b6d7-08bcc9066a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "d864d048f82084fac88d386c32b3261513ed7b5d1d4b52f96f91022059e984f9",
//     //     "homepage": "https://orangewallet.app/",
//     //     "name": "Orange",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7fcbf9f0-0c0b-439d-3fdb-31b32c28df00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "5a329cffe7aa4afa662139c3e119e51683bba096b0b877c5f55ba56b250632ab",
//     //     "homepage": "https://swapzone.io/",
//     //     "name": "Swapzone",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c5f92422-1292-4797-f9a2-3869add6f300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "28ec413631bf709cc6aeb3d4e3fdd7be541d38ba852ac491840e2501eaa7cb4b",
//     //     "homepage": "https://neftipedia.com/",
//     //     "name": "NEFTiPEDiA",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3f503c40-d5f0-4430-b996-3126a9968c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "2969649937a2a6c587e1391446d60e2e06b9c5196162a6aa70a0002292aa8d22",
//     //     "homepage": "https://avacus.cc/",
//     //     "name": "Avacus",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e90bf788-03e3-48eb-e892-adfae0a61500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "25a0ea266e011f80bc9952b1cc6f1328d3bbe69d9aa0283e6b70d9d1367a9ed7",
//     //     "homepage": "https://axion.network",
//     //     "name": "Axion",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b67df533-da94-40c2-1019-29e2250daa00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "58cb8992bd89d9b90bf1e6208a9f6d3f4b2959fe81b4566bc5c4621f99db2499",
//     //     "homepage": "https://krystal.app/",
//     //     "name": "Krystal",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/91449cb2-57b0-4bb6-481b-47d489f7a800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "4b65e51c3df048d08f63b308c2a3d52a7472c3e1688f0ea8c65be9f4cf5d4631",
//     //     "homepage": "https://krystal.app/",
//     //     "name": "Krystal",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/91449cb2-57b0-4bb6-481b-47d489f7a800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "9405762be07f986472fd249c0aa49dc5de325afe880d1c39df0d5cb5a9458706",
//     //     "homepage": "https://daolaunch.net",
//     //     "name": "DAOLaunch",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f3676f11-4c64-4523-8022-59afb9b42800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "a46b30fc7a7c662e75825225f2eae09b07412199d09771d821a5a0853e906906",
//     //     "homepage": "https://mooncatworld.com",
//     //     "name": "MoonCat World",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a3b7af45-9f3b-4ba9-a3d6-2063497dfb00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "2c81da3add65899baeac53758a07e652eea46dbb5195b8074772c62a77bbf568",
//     //     "homepage": "https://ambire.com",
//     //     "name": "Ambire Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c39b3a16-1a38-4588-f089-cb7aeb584700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "4408aab9112b401fabc0605be6fec8ade8519680fa40ed8b6e13f7a32d31cdba",
//     //     "homepage": "https://mulandefi.finance/",
//     //     "name": "Mulan Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/138f473b-7a04-419b-2558-15c905e0a300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "7b5ccbe00139bb41c0a087716420b68354db3daf4b6a58bcffd64baf38e5bd87",
//     //     "homepage": "https://flexa.network/",
//     //     "name": "Flexa",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/474bb6f7-7085-4aa2-cb33-9ce18b172a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "a7fd043435006b030302ed050bf85a793e575930f3faa7a6130f1be369bfe206",
//     //     "homepage": "https://pancakeswap.finance/",
//     //     "name": "PancakeSwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/955a868e-2793-4891-4eec-f11ffb763900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "fc14632c9fee01c327d2b5d5bd960efbd5ca301fc7b9e4a891741d2703e3ca72",
//     //     "homepage": "https://criptoarchi.com/",
//     //     "name": "Cripto Archi Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b62c4f22-e781-4ca9-5c01-ef7cd9d23400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "e428e92b4f14f7bf5929881f8d4bf92f5dc29a41553a5c4016db32d52b0ae150",
//     //     "homepage": "https://moonkat.net/",
//     //     "name": "Moonkat",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8afe1982-f439-4980-ae05-540c86fab100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "0e595419de85c18fb413dd06196d0119513e1c4907ca4dc8240af35002cac8bf",
//     //     "homepage": "https://himegamiprotocol.org/",
//     //     "name": "Himegami Protocol",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/619fc581-fd32-47c9-c2ef-27d4cb5db100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "5726877b12fe2b16b4491624a920d481d4e31ddd39663c456ee195342e2f694c",
//     //     "homepage": "https://punk.finance",
//     //     "name": "Punk Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e45f7cf6-ee55-440a-ac48-f42120e1ae00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "d73c705f5aef95a1914afce5310faf4660f0354e8a5a7e3cc420ae4a0daa89eb",
//     //     "homepage": "https://ghostmarket.io",
//     //     "name": "GhostMarket",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4d220956-78ae-4f83-774c-ee324e7ada00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "9fadd1908c3a55a10ec42c66c192bcfb34e055d8b1f523233dccdeeebb3e73c2",
//     //     "homepage": "https://alkemi.network",
//     //     "name": "Alkemi",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/12412cbb-804a-427c-0f8c-a82537860c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "dd3cf12012061040d30a7ccda1527fc8996062899c89a521ee4060a998e49cdb",
//     //     "homepage": "https://vesper.finance/",
//     //     "name": "Vesper Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/064ee430-935e-4cf8-6412-fac5d1128d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "79021a292ca1cec3d4e8d879a3c88942119478fbf7db3ea2459160d0dbb82356",
//     //     "homepage": "https://nftbank.ai/",
//     //     "name": " NFTBank.ai",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/bc7318a8-dad5-46ff-32a0-d361903e3400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "7c9754f94b305167ccc5770f9b9878d2a9f0150fc98dbdb6fa900553abf15f7c",
//     //     "homepage": "https://fuse.io",
//     //     "name": "Fuse Staking",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3fa13878-94fa-400c-a548-8cef21473300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "e2612e4e0e482b16836c475a94586bbdf8952edf57f13d2965bd824816260cc1",
//     //     "homepage": "https://tyrell-yutani.app",
//     //     "name": "Tyrell-Yutani HUB",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/db5f32a2-599a-4ff6-2e47-bfdf30e72b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "8fcea8ada5b01e501ef11014c6658e6e39a6e0dcca4a12a131170c4d5c631425",
//     //     "homepage": "https://changenow.io",
//     //     "name": "ChangeNow",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/583c6130-5d95-49c0-cf9e-82ffeffab300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "b3e7f913050524a55819c22056b5d60a58e0773c14a91d0d1309e436ba762bcf",
//     //     "homepage": "https://ravenprotocol.com/",
//     //     "name": "Raven Protocol",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2fe54f3b-ea63-4388-01b3-5918a5a0ea00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "8f8506b7f191a8ab95a8295fc8ca147aa152b1358bee4283d6ad2468d97e0ca4",
//     //     "homepage": "https://celoterminal.com",
//     //     "name": "CeloTerminal",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d61bd822-600b-4c7b-1fe2-e4ac8bd11700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "c56663507f4a19ce710f784f84c3e45ec73fda6dd3abb36ef381400cb3604abf",
//     //     "homepage": "https://uselesscrypto.com",
//     //     "name": "U-Swap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b6cf88f1-5560-445d-6943-7afa22b8c500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "0c6ccafe44a3fe7b2c48eb627d01af7477946c5880461b20459c28c1faaf395e",
//     //     "homepage": "https://decentraland.org",
//     //     "name": "Decentraland",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8229be51-a8e5-4f8b-c5b1-29d86dc1d100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "f1a34d93e2545075fca526562cd59b6b21b8c344f76787594b5ec120a4babce8",
//     //     "homepage": "https://spiritswap.finance/",
//     //     "name": "SpiritSwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ae4bb652-56e3-4939-ca65-09297ae44a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "56f7370aafccaed767ac969e79fc0359063daead3a34dfe3991638cc105c5e6a",
//     //     "homepage": "https://spookyswap.finance/",
//     //     "name": "SpookySwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e9d3a88d-c232-4ba9-810b-adfddfebb700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "19c7ae6c2f2dad48a51c08b268544379afa37018b758311fa2a1fcc3ccb1a8fd",
//     //     "homepage": "https://mstable.org/",
//     //     "name": "mStable",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/9d520ca8-16c6-4934-16c4-7c619f8fdd00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "616a69d8d4a38e0235c32a50ff80f45cf99bf1f5788fb523ffa90f5b660bd975",
//     //     "homepage": "https://balancer.fi",
//     //     "name": "Balancer",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4d7870f3-49cb-4ef8-c596-b56e4ecac300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "71e9729d1bbd8ae7f2142a9b0aeb64f142141adc4be6659176e6fe7cf36ddd6c",
//     //     "homepage": "https://wallet.dentacoin.com/",
//     //     "name": "Dentacoin Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/34910dc0-9f3b-4407-115d-673707602900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "b823fb0d7228ef8e3c0bc9607df9ed79dae2ab3a2811d33f22ade4f573c18232",
//     //     "homepage": "https://slavi.io/",
//     //     "name": "Slavi Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/282ce060-0beb-4236-b7b0-1b34cc6c8f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "e1882224c4c09a84575c533867d434267c46384f5a365b889605d28b061747c4",
//     //     "homepage": "https://www.bee.com/en",
//     //     "name": "BeeWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ae53ba0b-4d01-42f6-53d8-cc568409b700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "91628e2ae2228af2145bfac21093ad7be682810ec16af540a9e017ad6b933a81",
//     //     "homepage": "https://neftipedia.com/",
//     //     "name": "NeftiWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1f812dec-be3d-446c-52f7-a79eb0dd5400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c6f3d04a4e1a51e7d2045f347a5ebdab30fc600950a740fca21f0c92e230ee05",
//     //     "homepage": "https://arianee.org",
//     //     "name": "Arianee Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ace938a9-c906-4b9e-f683-b85f1ab72800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "dbe6b1a46c685f8db39264361d5b2762a30243dfd798aff7ca4badaad510baff",
//     //     "homepage": "https://app.nftxcards.com/",
//     //     "name": "NFTxCards Marketplace",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3358ad9d-92e1-47a0-4a18-139c54d72000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "9034d54985807aaf3d7780f50f155f954daa468fb58d7b14b216fc79d68bbd14",
//     //     "homepage": "https://wallet.qubic.app",
//     //     "name": "Qubic Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2e9ef302-daae-4807-555f-d4986b0b6700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "540148afe64558bb238cab6c43bd963055ed9248c094eaebff94d7bbb59f9aba",
//     //     "homepage": "https://ttmbank.com/key-wallet/",
//     //     "name": "TTM Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/82014e92-838b-4e75-e77e-76cdc5539d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "5b06aef286ef1be1c9c9fb7a923949156aaf797ff3f91523f29e9cebb14d8458",
//     //     "homepage": "https://deltatheta.tech",
//     //     "name": "Delta.theta",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/259af5fa-66e6-4bb5-f6f4-5a3711ba8e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "a0e4da8b263efda0a304ad250f2bdb877342d6df61717805687c5c6ca5909c64",
//     //     "homepage": "https://www.hyperpay.io/",
//     //     "name": "HyperPay",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e2b56019-59be-4cdc-e944-12e6cc235c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "f039a4bdf6d5a54065b6cc4b134e32d23bed5d391ad97f25aab5627de26a0784",
//     //     "homepage": "https://neonwallet.com/",
//     //     "name": "Neon Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/322bd6f0-09b5-4595-cb15-0dfab8054800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c482dfe368d4f004479977fd88e80dc9e81107f3245d706811581a6dfe69c534",
//     //     "homepage": "https://walletnow.app/",
//     //     "name": "NOW Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b6ee4efc-f53e-475b-927b-a7ded6211700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "7902b32d857b8e1a58a6aab7129b56b40320bdb1c4854d5f2bd0b361f7e76d10",
//     //     "homepage": "https://lz.finance/home",
//     //     "name": "LZ Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e3272444-3876-49d3-2f84-004b818d3800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "0e4915107da5b3408b38e248f7a710f4529d54cd30e9d12ff0eb886d45c18e92",
//     //     "homepage": "https://www.getarculus.com",
//     //     "name": "Arculus Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f78dab27-7165-4a3d-fdb1-fcff06c0a700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "5dc61e9d57489bccc11306365361614dac3de1d8eab2a9a7877a95970f68712f",
//     //     "homepage": "https://www.paybolt.com",
//     //     "name": "PayBolt",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/cc8f4e0c-56a8-465a-6cb6-3e9d60846500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "6c235aecc7ab2571b6efa06d52faba12ad1b6d4a27963996b292e864344e1833",
//     //     "homepage": "https://perp.com/",
//     //     "name": "Perpetual Protocol",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/9acec2d8-d1e1-4488-77ed-da8a1d972800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "21b071705a9b9de1646e6a3a0e894d807d0fa4a208e88fc003ee056021f208e1",
//     //     "homepage": "https://www.apollox.com/en",
//     //     "name": "ApolloX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/80ab63a2-1b32-4140-3577-9fbc8ea82e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "7ea003772a1fe143cd331c520d1a08a2cc65fe6514811192b86c7878b86bc824",
//     //     "homepage": "https://awardpool.com",
//     //     "name": "Award Pool",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4d0695c4-c6a4-4d94-390d-8bb7d3f94300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "f2dcbeb246b4e4d37d748a7b2be54bbd93bdbe3e351d0badc1cbd3ea262d8466",
//     //     "homepage": "https://bitgert.com",
//     //     "name": "BRISE Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/09a4e1d9-e4de-44fa-f248-5495ba9ab300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "75f698d4436b5cdeac8f2773af14cf76ea3bc580be7eb984ad6ed65703cdd35d",
//     //     "homepage": "https://blackbullswap.finance",
//     //     "name": "Blackbullswap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/cc1c0668-e076-47e1-8713-e27448c0e600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "4f5de5333fed2ccf47c690579aba3b9128aea78175339ff51ef61704bde7502a",
//     //     "homepage": "https://okse.io",
//     //     "name": "Okse Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8a1b36d5-7f40-403a-7000-5d30f9181200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "681c1c202efd7a1578651f052bb7810fc83ac6601ab195702a1dd7d347f63e17",
//     //     "homepage": "https://app.rango.exchange/swap/BSC.BNB/AVAX_CCHAIN.AVAX/",
//     //     "name": "Rango Exchange",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/18a09060-e7d3-4d27-1c70-c2547c472d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "76a3d548a08cf402f5c7d021f24fd2881d767084b387a5325df88bc3d4b6f21b",
//     //     "homepage": "https://lobstr.co/",
//     //     "name": "LOBSTR Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/0dafcaab-0852-47f7-85dd-436b86491d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
//     //     "homepage": "https://www.okx.com/web3",
//     //     "name": "OKX Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/45f2f08e-fc0c-4d62-3e63-404e72170500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "51334e444ea1ba3d23c96063b8600c94af89233bd3f8f3685123c46e0348766c",
//     //     "homepage": "https://snowball.money/",
//     //     "name": "Snowball",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/313faea4-af8c-41f4-0ed8-98be5d048e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "af724b42aa301b17617729f8b95dafd9fe1c72e9831b52177f279d6bd80f64b0",
//     //     "homepage": "https://daohaus.club/",
//     //     "name": "DAOhaus",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d79bb29d-b7ad-4d0b-4dac-6b7ba4e63c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "19418ecfd44963883e4d6abca1adeb2036f3b5ffb9bee0ec61f267a9641f878b",
//     //     "homepage": "https://kryptogo.com/wallet",
//     //     "name": "KryptoGO Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3ccbd966-97e8-45a0-1ceb-6141a8978e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "30edc47c24de2727a86d50ba88c3516db28c0494a7c5f0b127e4329e855c6840",
//     //     "homepage": "https://autonomy.io",
//     //     "name": "Autonomy: Digital Art Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/672e9061-e0c9-45ec-5d9c-9fd10e83e800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "ad47668fc1e4327881f1f8b91f563d7a2c1d6e9596cd6b7d97b5791fe76964e9",
//     //     "homepage": "https://mask.io/",
//     //     "name": "Mask Network",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/51fa27fd-8a21-4de0-c084-528e4a37ad00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "4b309f7a91ea5cc41b8e80349699c3ba90a1533d3113c7e088af5ab8601cbb02",
//     //     "homepage": "https://maimun.club/",
//     //     "name": "Maimun Ape Social Club",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/578a3426-83d9-4a6a-7efc-dc4d2ea1fe00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "1249debdc68d1800039c0dbeab2e58ee391a0bc9f12553c5e1d6ff63276967ff",
//     //     "homepage": "https://srk.finance",
//     //     "name": "SparkSwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/6937b24b-acc9-4196-116a-280b31edd800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "2216bf32f1a873d948886617068ccc7354ef51af7735756aa815737e8552e5f6",
//     //     "homepage": "https://pandora.digital/",
//     //     "name": "Embraced - Pandora",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f848ab21-d263-47bf-e842-505a662cc000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "4c0203e76f3163c472073fa9be9843aabdd01a99cd1d0a5a87db5caa71f68898",
//     //     "homepage": "https://punkwallet.io",
//     //     "name": "🧑‍🎤 PunkWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/93f81bf3-a7f1-4620-013e-5959432e3500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "2a527d1ee63ab8837381714b85f75d57217699c2b758a8d79bf6658f02db0578",
//     //     "homepage": "https://watt.me",
//     //     "name": "WATT ME",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/38c619c4-5365-4de5-09b2-cdde8caf3600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "8e512cf90917c19246d2e46a693c8b8949b96de941fb951d7f63538584afe22e",
//     //     "homepage": "https://deepspace.game",
//     //     "name": "DEEPSPACE - Outpost",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/54d6935e-f65f-4637-d763-88b3c5c4d700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "bae2ab14ef450f307f24a395a3c2766a2ef8a9c0e61856985d23f6445e8db03f",
//     //     "homepage": "https://cryptnox.com",
//     //     "name": "Cryptnox Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2947b7c8-8966-4485-a98d-25fe43c16700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "a47bfeddbf76b24c5adbd2ce16b5b4418c42b806a1c8c4afdaa01f045bd5ce52",
//     //     "homepage": "https://coldstack.io/",
//     //     "name": "ColdStack",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7cf55b42-3dd3-43f1-0a2d-efd2ba529a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "107bb20463699c4e614d3a2fb7b961e66f48774cb8f6d6c1aee789853280972c",
//     //     "homepage": "https://www.bitcoin.com/",
//     //     "name": "Bitcoin.com Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/0d7938e1-9b3b-4d8b-177b-98188c4cf400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "b480598cc4d562de84a9d7a8cd80954b69332d5bdaa7acc10d15156df551590f",
//     //     "homepage": "https://firstwallet.pro/",
//     //     "name": "FirstWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/864565a8-66ab-4b50-fda6-1c29128f6b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "a92d512c649e87a5acba5885ac03f62662cff1f647c20a63833eb45a71a6f877",
//     //     "homepage": "https://www.search3.com",
//     //     "name": "HUMBL WALLET",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8ff078c4-1edb-452b-b6d9-44e64baa8b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "55d433d8ba2487c2b951cf2d0078bc1ecea578e4f84aecd1c5435bd3f4bae632",
//     //     "homepage": "https://anationtoken.com",
//     //     "name": "A-NATION ",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/57f20a3f-db39-4450-3ed7-3d5f9e233000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "885123c0cb521fd121f0b200b0bdcf0d8d54d2f93699443ef11ecadf4a24baff",
//     //     "homepage": "Https://nftrade.com/",
//     //     "name": "Nftrade.com",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e937b947-4a70-4f8d-3795-80bb7a054100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "102df0272b2e764ef05954a8822a87c1cdaa4c56b06905527a469bf503d27bd7",
//     //     "homepage": "https://bridge.platon.network/bridge",
//     //     "name": "PlatON Bridge",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/871ce1bf-4815-4f55-f1a6-a227401ab800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "97a9e82e4b12362eab26130dc28eebe8b76c7ac0d5434ef690dfb8b04b419873",
//     //     "homepage": "https://candidewallet.com",
//     //     "name": "Candide",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/08948c71-d1a8-4f62-261a-f5d46d7af800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "2100ca23b42b63129323bfae9060e0462e15850f7b343f2eb8be53d610fed40b",
//     //     "homepage": "https://sparkswap.finance",
//     //     "name": "SparkSwap Apps",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ec22b9bf-a23d-4000-0c27-b82e2648d500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "fe2535202d208d96607955fe18e98d4564838200c3498c8cd1736b46291355f2",
//     //     "homepage": "https://safematrix.io/",
//     //     "name": "Safematrix",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/48ea5de9-869a-4994-2402-97afba060900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "63076bf87200069fa799f5c75c578ff963e0a6c23489b65cc8721d3cbc7ad5e2",
//     //     "homepage": "https://a4.finance",
//     //     "name": "A4 Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7a788c03-daf7-4d93-fa3a-f94e2b719900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "53dd23581ff2ac3473a517c2995ad41cb214e105ebc99a122bda032051bb54c6",
//     //     "homepage": "https://www.earthwallet.io/",
//     //     "name": "Earth Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d3f724c4-f99b-476f-10f8-12aa4af13800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "34c19e0afafeb86ffa75df1c04445b8840450217e79d30abc6def9aa537fb7d6",
//     //     "homepage": "https://wallet3.io",
//     //     "name": "Wallet 3",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/34ab7558-9e64-4436-f4e6-9069f2533d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "efda9a34ef0b5de23496abda5eeeb2dcf8cd1497530ac91f58304cba867ae28f",
//     //     "homepage": "https://multisig.boba.network/",
//     //     "name": "Boba Multisig",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/5acb31bf-151e-4ae6-02bd-f109ca47b600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "75ca1aafd91026f435803f9a11e8e4278388e189aa30dc93e532244ade262c57",
//     //     "homepage": "https://www.talkapp.org/",
//     //     "name": "Talk+",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d24cdd56-6f55-42da-631b-c25974c36f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "feb6ff1fb426db18110f5a80c7adbde846d0a7e96b2bc53af4b73aaf32552bea",
//     //     "homepage": "https://www.cosmostation.io/",
//     //     "name": "Cosmostation",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ea26c3c8-adb6-4dc4-ee02-35d6eee02800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "aabde7254ae8cfa25681ba60e6bfcce0c517e392d5e21981f15a3ffdd727413d",
//     //     "homepage": "https://dipoleswap.exchange/",
//     //     "name": "DipoleSwap",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c6e89c12-a3b4-4d39-5fa2-009f1dd03c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "80980fc1dce538ee9a795b0eaf93b06866e0b35608cff5aa72dc9879b03c1a5a",
//     //     "homepage": "https://usecryptnation.io",
//     //     "name": "SoCap Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/99c0152b-1001-4f24-3293-a9125374f900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "add46dfc2dc09c855fc8c14d950353528e184a8f4346886129c990074450ae9c",
//     //     "homepage": "https://www.ennowallet.com",
//     //     "name": "Enno Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ae4f5167-0b61-43bd-7d76-1f8579271000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "1f4a05ea52aae148a4b65d07cd4d3fdd06fcb7c81ff07e2465728fed7ed6260f",
//     //     "homepage": "http://keywallet.co.kr/",
//     //     "name": "Keywallet Touch",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ceefb75b-2632-40c6-7471-ea23d3d49800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "45f048db8ca4d2bbf622e8474402f684ec0d2eb68baa4ec9e8001dd617d6285c",
//     //     "homepage": "https://www.graflr.com",
//     //     "name": "Graflr",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/defebabe-7c57-4227-36d2-8da000812000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "ca1d3f91b9233ff1f3a64fbaf2bd4a718e9ea0489ec71938d9da030a9f98ef8f",
//     //     "homepage": "https://paraswap.io",
//     //     "name": "ParaSwap Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/73dc6b30-b644-46e6-020c-5926851df600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "612be720948b5a07bfde600ba907c6b91591ac87390a97c77fa960dacb07f03f",
//     //     "homepage": "https://dopamineapp.com/",
//     //     "name": "DopamineApp",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7ed8ec36-fb7c-4b43-494b-36e907101f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c87c562ce7f3a3ff9f4eed5f5a0edbcbd812db5aed4d14c7e6c044d8b6795d84",
//     //     "homepage": "http://opera.com",
//     //     "name": "Opera Crypto Browser",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/877fa1a4-304d-4d45-ca8e-f76d1a556f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "11c5487e4d8dd8bf32d4c92222363df8296a27307b2531be1e25770365392ecb",
//     //     "homepage": "https://cardstack.com/earn-together",
//     //     "name": "Card Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/325428cf-c212-4d83-a434-7f48902d2c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "d99d67379a0af80a39ef8fa79ad477debfe5abb71bd7cf92d12f30d6ffa69506",
//     //     "homepage": "https://wallet.gamestop.com/wallets",
//     //     "name": "GameStop Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c12536e0-dff1-4a1a-6c8f-c7247d6aa200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c8c8f44329b9b826ded9a2ac330745f584a61aed6b1d0ed2a093b64bca7fc3bb",
//     //     "homepage": "https://abra.com",
//     //     "name": "Abra Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2219db01-e0c9-471c-5def-fd3b4e7a7a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "f2dca938b70ea7965ffbc3ef49f3e21701d1fc4f1c543d4b05801c126416466b",
//     //     "homepage": "https://filwallet.co/",
//     //     "name": "FILWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f400f6c2-ca6c-487b-654d-e119af247500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "23db748bbf7ba1e737921bee04f54d53356e95533e0ed66c39113324873294e7",
//     //     "homepage": "https://realt.co",
//     //     "name": "RealT Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/bf1f251b-08a5-4b27-ae4a-201a5f698900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "7e94e75c90964a69ea375b92214f50c4223dfbfa4913a3733b615444b322f687",
//     //     "homepage": "https://coinstats.app/",
//     //     "name": "CoinStats",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f989ab84-650b-4ad5-c342-77f3334f1b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "259d9b14c78abdf2b6876bd1e9da0787932000cb7088996a938696a62180c7b2",
//     //     "homepage": "https://www.apollox.com/en",
//     //     "name": "ApolloX DEX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/792d4120-3bed-4e4d-af7d-759575697a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "64af550970654673b979d3d8d725eb01863d9c187254c1a3d2e9a115f1d7e77e",
//     //     "homepage": "https://civfund.org",
//     //     "name": "CivTrade",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1f03356e-b2e3-44b5-308e-0f0920395900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "576c90ceaea34f29ff0104837cf2b2e23d201be43be1433feeb18d375430e1fd",
//     //     "homepage": "https://pltwallet.io/",
//     //     "name": "PLTwallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a5d9dd15-8cef-42de-8bed-09e01a8b0200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "452a6bc6decd68605bd274c499e9f85566a845e70922917f0737b60e8d58cde8",
//     //     "homepage": "https://www.mintagemedia.com/",
//     //     "name": "Mintage NFT",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/9a7b92c3-8856-4fa7-4d06-f4f76ccaf200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "431e9b5190eac102ff4bf623672e1d87c437d4c9a5bc9de2e97e12bd23c8689a",
//     //     "homepage": "https://www.leisurepay.io/",
//     //     "name": "LeisurePay",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/29298e7f-7beb-4cde-416c-b8ac27b37300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "ce0ea4417b28e4b219283a99dc34cd27afe01e88d4a0cfa41b90c73088949ace",
//     //     "homepage": "https://thorwallet.org",
//     //     "name": "THORWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/19a02756-462c-4e8a-2d32-af0f9bcf3d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "24fa79ebaafca330af474d828d3d1d4b20b4d7f93f7d2fd4986ddafee5e51b14",
//     //     "homepage": "https://xcapit.com/",
//     //     "name": "Xcapit",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/17f59b75-21b0-4b3f-b024-fe4b9b8d2300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "08739356e3fc0efd9498696b7831e8b42b0ad7390af663cd3ba3c30866195b34",
//     //     "homepage": "https://blockcerts.com",
//     //     "name": "BCERTin wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e321346d-5ce7-4e75-371e-e4f0bf923900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "4d0cf1b635a59175b4ad6d6522b0b748ee920b1f8c32030fa704c00926efdf3e",
//     //     "homepage": "https://paper.xyz",
//     //     "name": "Paper Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/37d7a10f-d94d-4a56-c30e-267e8afbd500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "0c5bba82e70a2b62405871af809020a077d110d765c0798eb660ad5d3131b328",
//     //     "homepage": "https://edge.app/",
//     //     "name": "Edge Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f601bc29-4298-422f-dbf7-34dac2884f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "7dd97f0b25806117ae5d3000117e7e2e3a362548cebd92ce38357d6a09a39dc6",
//     //     "homepage": "https://metaspace.fi/",
//     //     "name": "Metaspace",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/df78de49-15bf-4c59-ad25-ca2bcbf03a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "792fbacfe787d67595dd4eb38ac308e14b3bbc810393db56f477a92e5ac8764b",
//     //     "homepage": "https://www.assurepro.io/",
//     //     "name": "Assure",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/64db7104-c8b7-44ea-e102-11ce87124200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "ecc8e7f2450de364eb8ff80e6e29666bca76232fc3ca872501397b67ebf0b7dd",
//     //     "homepage": "https://bring.finance/",
//     //     "name": "BRING.FINANCE",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ef291f3b-8791-48fd-a827-b5b690346100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "ed657064daf740734d4a4ae31406cb294a17dc2dbd422ce90a86ed9816f0ded4",
//     //     "homepage": "https://nitrogen.org/",
//     //     "name": "Nitrogen Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/af185895-cda5-4eaf-e31b-28b6fe4b0800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "159b0423ce9075d5662f588f805931d989627affab3e63e4dd7ebc62b9c6738c",
//     //     "homepage": "https://oxalus.io/wallet",
//     //     "name": "Oxalus Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a6e22fcb-6b69-45d2-b52d-a4a347a21e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "33e181cb6c0f3e313e20b17129f06f4dd9939a01e3a371cdef389d4dcc29258e",
//     //     "homepage": "https://leadwallet.io",
//     //     "name": "Lead Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d0407e64-9afa-4c1a-3290-3b925ad8b200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "e3787ea98d014ca77e2c3794db97c02ef8bcb39347705f5e79502a55434a1ecf",
//     //     "homepage": "https://trustkeys.network/",
//     //     "name": "TK Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c4066f68-2247-49bf-ac8a-a677bfa81800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "6d1d5b892e02d4c992ae67f18f522398481360c64269f5cdf5e4b80435b20e3d",
//     //     "homepage": "https://3swallet.com/",
//     //     "name": "3S Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f3b6a89d-ec8f-49dc-e07f-6bf723e1e500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "5265dcf66be0553328dbc727414ab329e22f9a480e593bd2e927b279e4ab244d",
//     //     "homepage": "https://mrhb.network/",
//     //     "name": "SahalWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d29d6426-b6f2-481b-12d8-7b20ec82af00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "e655422696ea63706adf66f50c802a419ad2e441ea5052b0698e892d7b22c1bc",
//     //     "homepage": "https://latoken.com/",
//     //     "name": "LATOKEN Multichain DeFi Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ff858a37-cbcb-413d-c1ed-917a444bea00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "1f711d32b1df0f84741fafa2ad1d81599b01297cc7d22d153272cb3ef4232f19",
//     //     "homepage": "https://sequence.xyz/",
//     //     "name": "Sequence Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b2d5c39c-a485-4efa-5736-a782204e4a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "7c9c698f57537732ddb6a0f38f82720d27a776cb761c44330d641f941c435678",
//     //     "homepage": "https://chromasignet.com",
//     //     "name": "Chroma Signet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f5de7f14-5d71-413b-5f4b-3c15fc87f200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "fbea6f68df4e6ce163c144df86da89f24cb244f19b53903e26aea9ab7de6393c",
//     //     "homepage": "https://klever.finance/wallet/",
//     //     "name": "Klever Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8f5bbad8-6a14-4b2c-5343-cc1fca6e4d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "4d892f3895e92d4dcc048429a920c22cb565c91de529559c47d7fe8a3189e0c8",
//     //     "homepage": "https://mp.teller.org",
//     //     "name": "TellerV2 Marketplace",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/528b5ca1-2044-4ea1-0b7e-97ec526cd800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "c587c2601ccfc456cb7d4d9bb34f12f0fd11ad49faeeb4602860e239b5397843",
//     //     "homepage": "https://www.vision-crypto.com/",
//     //     "name": "Vision: Crypto Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/64ccf07c-1fba-4473-49e8-dc446e5a5000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c29c9237e92bc18e141e52aba3aa6d04b1afbe9952a0ab2f96dbd8653645c1df",
//     //     "homepage": "https://www.antiersolutions.com/",
//     //     "name": "Ancrypto Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d4382329-e288-4d7a-0ac8-3eb0facfb900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "1a8fed4bd55911a282854d7f1cdbca90319ad6dc1a9452dbf5eb3d39279e5c9f",
//     //     "homepage": "https://domani.finance",
//     //     "name": "DOMANI",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7f5fd743-f952-4f87-e09f-ee07b08ff800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "1c178b393f66b08f6e0decf743ee11c53a36eeb17faaa9e8c20f9ed2d05a96f3",
//     //     "homepage": "https://fundamenta.network",
//     //     "name": "Fundamenta Mobile",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/79797f9e-a6c7-4284-1a1c-88332f11ea00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "584538f059b079deecc80dface062cf40c33afd45dca02c7edca134a8225556d",
//     //     "homepage": "https://www.balletcrypto.com/",
//     //     "name": "Ballet Crypto",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/542094e6-70d6-4b0d-4c8f-b61cc2c38500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "a1aa007996a851ecf6b2752ab68bf98aa28f3a533f157420e960b447b4ff0448",
//     //     "homepage": "https://theparallel.io/",
//     //     "name": "The Parallel",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/de73fe0b-0244-4373-dea4-bef78ca82e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "9b9be9e11e15dfc7e6914449c78c345a60a3a5a8ec5855df5517eb76c56b6018",
//     //     "homepage": "http://celo.dance/",
//     //     "name": "CeloDance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/47c8ab7b-a66c-4949-f0fe-b0c2c169ee00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "7468ebbf5e14bd146c4fa12a08fb1a0d8d9af3b66409a5b682b64cffc4f21919",
//     //     "homepage": "https://hideoutpay.com/",
//     //     "name": "Hideout Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ea515e87-73a6-416d-a61e-bc29f32c5000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "88018c059feb045089b22a9fe8acd4604b85f8db44693f1ddf08cfdba17dbe9a",
//     //     "homepage": "https://dracula-metaverse.com/#game-play",
//     //     "name": "Dracula Metaverse",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7259499f-3a9c-4905-d881-19944500d000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "af9a6dfff9e63977bbde28fb23518834f08b696fe8bff6dd6827acad1814c6be",
//     //     "homepage": "https://status.im/",
//     //     "name": "Status",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e131fa98-8c4f-4680-f5b6-6fb77189c900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "a18aeec9fab0c08ca41e7bdaae06cac5700bb628ec75c6381bacd9b2df574895",
//     //     "homepage": "https://monarchwallet.com",
//     //     "name": "Monarch Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c664d955-8a1e-4460-3917-4cfcf198f000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "c7af7d5e8738821a53cddc31f34f162b003886c47d8e72c702ec20a3e50d765b",
//     //     "homepage": "https://ela.city",
//     //     "name": "Elacity",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/fb0a18e9-b41d-481f-c819-8321309f9a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "62429fe64910c4e3355b2e3a4dcaa1c62e0605413672aff89f1046638530e66e",
//     //     "homepage": "https://slope.finance",
//     //     "name": "Slope Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2c52f74b-3633-473c-1df8-a7ebd40c5500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "82b4b2e7ee8ee6db857329c81452c2471061eb8ba5e29b0bad5c0d7bb9d9c64f",
//     //     "homepage": "https://elk.finance",
//     //     "name": "Elk Finance",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ef5558e9-8dc0-4e63-ed97-977d6c8b5400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c40b9bcef32fa6ce4e0df98be1420628bbc4957646f742380fe618fcb4ab74f1",
//     //     "homepage": "https://ricewallet.io/",
//     //     "name": "RiceWallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/df94578e-19be-4f00-258f-2470343e7b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "b265ce38b94d602957a0946673c59a99a15d69adda4317544fec7298ea2d1387",
//     //     "homepage": "https://safemoon.net/",
//     //     "name": "SafeMoon",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ecc31a8e-0ee9-49db-cc59-0876b7c35600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "a3e4e54d0266116e3b51cdb89630dacb1b45c5a40d3ae7c98ca329489bf2e15a",
//     //     "homepage": "https://lab.localtrade.cc",
//     //     "name": "LocalTrade Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/fcc60983-74ae-484a-4242-87cb6f05f100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "93eaabf522a1e270be952fec536869e4a895ee1570b0129fbfd506c5bfac209e",
//     //     "homepage": "https://abcavocado.me/index.php",
//     //     "name": "ABCavocado",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b373e216-dca9-46cc-b20f-50dcc3017a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "23d57b0a48df6cec411e609ddedaa290dae4a844ea90909ddd33aca794574603",
//     //     "homepage": "https://www.wallid.io/",
//     //     "name": "MyWalliD",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e6cff623-9671-4a39-acc7-1c2292d7e100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "9806e241053d8c99b0ce9f62606f97d405de5c3c0b2593921f5aac99ecbaea58",
//     //     "homepage": "https://blockchain.com",
//     //     "name": "Blockchain.com",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/fc282669-2dbe-44d5-33fc-9168fcf08600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "c39d8ee468e50474fdf3a0bd6b981be404d4671e2702a3d633aae95bcbaa032a",
//     //     "homepage": "https://xfun.io",
//     //     "name": "XFUN Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a665f8f3-09ef-4d17-2bd0-26dca4518400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "d60cd57ae5bd4fda3c0f0db6e510aa334d2d92e0ed32470f9024677f33c339d1",
//     //     "homepage": "https://www.avedex.com",
//     //     "name": "ADP",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/592db4b7-aa95-4d5a-24d3-259291186a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "e2c884737858154c28ff2c543f96331f8987f58734a9c9eaff6d2daef8cd2917",
//     //     "homepage": "https://dohrnii.io/",
//     //     "name": "Dohrnii Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1bb51ed9-68ed-4012-3082-72dcb7754300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "b63b8e2a16539c4524ff27a1e166a4006538ddff647954e7bbfd6fa93c9d8198",
//     //     "homepage": "https://www.stellarx.com/",
//     //     "name": "StellarX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/15adb33b-369c-43fe-d1f2-3eecfd284b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "a3dad9f302b2e36feb712645646de6ad4bab221d250f7f6c770c6429e596ac43",
//     //     "homepage": "https://argent.xyz/",
//     //     "name": "Argent Wallet",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/dd0a57f8-436a-43db-18bd-1ef983ca8b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "025ec6010962022ad58dc9467f888877d2fe16e0b4ec0ccd0c7388735f1e5641",
//     //     "homepage": "https://3box.io/",
//     //     "name": "3Box",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/91ec7c93-deb5-4006-72ac-08014cf5fe00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "fb6cd1a045de3209931525fe421631d3bda00fd8f5d72226833b99f3966d4f0d",
//     //     "homepage": "https://dex.blue/",
//     //     "name": "dex.blue",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c225f91f-7afd-4362-5ff4-892a88b13a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "8fb830a15679a8537d84c3852e026a4bdb39d0ee3b387411a91e8f6abafdc1ad",
//     //     "homepage": "https://ownbit.io/",
//     //     "name": "Ownbit",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/83b291fa-1a08-4871-3ddb-8faa8be6f200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "325f1b46b2d2e04c911089f8da507da38bb13ee3c95aa85fa4e327bd0c88ab12",
//     //     "homepage": "https://bulksender.app/",
//     //     "name": "BulkSender",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/640e955a-e7c0-4c2e-3cd1-e6f612fab300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "f6399af14c9bbe64672c4a5f5fd9fca42107b76f3bce1b33325d5ffd702c7f66",
//     //     "homepage": "https://betoken.fund/",
//     //     "name": "Betoken",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/12258632-b58f-484a-f60e-8934ec40b500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "ede2b38da1dddfffd32bbb84c3549b2c1585a14adb88a62b8c10f095253f2f54",
//     //     "homepage": "https://furucombo.app/",
//     //     "name": "Furucombo",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e81574ec-3f46-43c5-9654-db3503009b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "bbe3172e59ba21541c5739f09031cd28ac3aed0ccd23280acfe19706fbf04820",
//     //     "homepage": "https://invoice.build/",
//     //     "name": "Invoice.build",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b2c59488-303b-461d-adcc-236ea19caf00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "ee97613ab75c89c3ddc6337952ff8b581ebf2466fc68e9bb601dca655dcef849",
//     //     "homepage": "https://bitpiehk.com/",
//     //     "name": "Bitpie",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f9b7c668-ed26-47f7-d8c9-7eadc7114800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "356fc3d6e801a76197a8b6f9bcac8ebe4f9e8ab8337012d4e453233983ff197a",
//     //     "homepage": "https://bitpie.com/",
//     //     "name": "Bitpie",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f9b7c668-ed26-47f7-d8c9-7eadc7114800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "0105fbfd71efd3b19dde8060d6c9d959f555c078515a47b1a29cc9b67e6a4531",
//     //     "homepage": "https://coinhub.org/",
//     //     "name": "Coinhub",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/cd7d6974-739b-46d7-bd10-604222e16e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "aeaad5749e22fd5c7fdb29251af22a04b3d23b6770769e5e8d81a77a4b666287",
//     //     "homepage": "https://bprotocol.org",
//     //     "name": "B.Protocol",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7a78edef-05d8-491d-bc82-61e494895900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "c38c37b8bdf6117fe09e1db3a13240bb1029c4a9ad88ea97cd1f3e30f48e0ab7",
//     //     "homepage": "https://bitpif.com/",
//     //     "name": "BITPIF",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4a13aa8e-4332-4f5e-db91-a9d4eb688700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "746fa59e214ba46cfa688e9540a6b3450b514e89f39bd9c5a00b5a7fdaba8351",
//     //     "homepage": "http://goldbit.io/gbapp.php",
//     //     "name": "GoldBit",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/11974ef1-21ab-4806-a2b1-362c31499900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "29ac7e56b3b4654f52463cbf0f7b5fc7f299dd24ba9583c0c9f3a51832a9f073",
//     //     "homepage": "https://app.orbitlaunch.io/",
//     //     "name": "OrbitEcosystem",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/74d6e6c2-a62e-499f-18e0-37f43d696c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "fd144d6a46656068f37fb1d59d3caf413651ea5f4a24025c9fd72a6bbe22d834",
//     //     "homepage": "https://bycoin.im",
//     //     "name": "Bycoin",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/980b0c5f-353d-4643-1ee8-d9264ec30000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "41f20106359ff63cf732adf1f7dc1a157176c9b02fd266b50da6dcc1e9b86071",
//     //     "homepage": "https://bitizen.org/",
//     //     "name": "Bitizen",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/75dd1471-77e9-4811-ce57-ec8fc980ec00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "bb88a220ed4dcd3d717ec19b6ac00a672edf92e97ef7c243d35e25ff56a07301",
//     //     "homepage": "https://bumoon.io",
//     //     "name": "Boo!",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/310e86aa-6ed2-4d36-2af3-c72eb1771e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "59789a1ccc40eb4c3dbe77c0e8f975517eb4cbd33ec97bf441b8d7712ad64f7b",
//     //     "homepage": "https://bitriel.com/",
//     //     "name": "Bitriel",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7ce959cc-75cc-4c34-fdfd-a23dccb0ec00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662",
//     //     "homepage": "https://bitkeep.org",
//     //     "name": "BitKeep",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3f7075d0-4ab7-4db5-404d-3e4c05e6fe00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "3161f4087a6400d1b96907c148bfb0afbb4fd2171363908bbed285a954b648f3",
//     //     "homepage": "https://octusbridge.io",
//     //     "name": "Octus Bridge",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b716f5f3-302d-4188-b679-3ca2873c5400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "0de75ef9552f91acb2a8b8204d15c5e5c4ad03afd1afa19404d184ee38954939",
//     //     "homepage": "https://www.orderinbox.com",
//     //     "name": "Orderinbox",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/26e09d42-8b60-453c-dc90-2277726e9e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "601b269aa064083a4f115bd906bd4b4ca3c92f379468b5debc93e6d680bbea7d",
//     //     "homepage": "https://tokentool.bitbond.com/",
//     //     "name": "Token Tool by Bitbond",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/bf8b4771-c440-4fae-74df-cde8baf52f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "3b9f67c2c0887f71e4f9ba1bd2bf5b4eb6cda94419abd3f0c5c12931a60928b0",
//     //     "homepage": "https://bitski.com",
//     //     "name": "Bitski",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/94d94cb5-a94f-47cf-70e6-fe8d3f1c3700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489",
//     //     "homepage": "https://www.fireblocks.com/",
//     //     "name": "Fireblocks",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7e1514ba-932d-415d-1bdb-bccb6c2cbc00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "3a9973b9ee638a3aac3e1d001cabe425bf307602a61faee67942fda314736610",
//     //     "homepage": "https://uniblow.org/",
//     //     "name": "Uniblow",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3aa86daa-b885-4686-c443-83355e1b3b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "809e8a66fdef79fe2d5100bf4f40d74ea0a9490544cce49de3bc5b668abfa490",
//     //     "homepage": "https://bridge.bring.finance/",
//     //     "name": "Bring.Bridge",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c006472d-dbb4-4488-8151-951e634fcb00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "20459438007b75f4f4acb98bf29aa3b800550309646d375da5fd4aac6c2a2c66",
//     //     "homepage": "https://tokenpocket.pro/",
//     //     "name": "TokenPocket",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f3119826-4ef5-4d31-4789-d4ae5c18e400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "c591664a9fc2dfee98992ce072d0354154b667ec2f0c9d937ceb84fa9ab843b4",
//     //     "homepage": "https://curve.fi",
//     //     "name": "Curve",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c0477f53-bf41-4577-4ae1-002a2d078800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "2d0bda43d0c0703335ebc242e176182b5a50304b99984e01e86bebdd91238c7e",
//     //     "homepage": "https://mycrypto.com/",
//     //     "name": "MyCrypto",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d08bb4f6-55bd-4d3b-399d-b71aca7f2d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "b021913ba555948a1c81eb3d89b372be46f8354e926679de648e4fa2938bed3e",
//     //     "homepage": "https://coin98.com/",
//     //     "name": "Coin98",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/dee547be-936a-4c92-9e3f-7a2350a62e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "29f4a70ad5993f3f73ae8119f0e78ecbae51deec2a021a770225c644935c0f09",
//     //     "homepage": "https://zel.network",
//     //     "name": "ZelCore",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/97d45a92-a1f0-46da-95a6-ad5db99f3500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "15d7610042217f691385d20e640869dc7273e991b04e8f476417cdc5ec856955",
//     //     "homepage": "https://www.coinomi.com/",
//     //     "name": "Coinomi",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3b446d16-a908-40c8-5835-9a6efe90dd00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "7f88a77105e3960625af762a84863c0d2f80c74fe6d8a1f46b136edcefc1b3c3",
//     //     "homepage": "https://hegic.co/",
//     //     "name": "Hegic",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/74bd587d-9f88-4f86-fe44-34658c6e0c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "00af657f1f1a370adeadd306d772849698cd99e89ba53fe8e508a12511f9c22b",
//     //     "homepage": "https://clovers.network/",
//     //     "name": "Clovers",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/fcb1c20b-09f2-46d7-460c-8fab72f78d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "78640a74036794a5b7f8ea501887c168232723696db4231f54abd3fe524037b4",
//     //     "homepage": "https://www.xinfin.io/",
//     //     "name": "XinFin XDC Network",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/bee71890-cdbe-4a9a-0d51-6cc75078f600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "bb92c98ab35248d1dac4f1abe46e13b49724ce42a7dbcc8ead183dba1b50e12a",
//     //     "homepage": "https://mcdex.io",
//     //     "name": "MCDEX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/eaa6833f-fcaf-49dc-2fa5-3fa27fde5b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "ef45e5cb8c86e3904c26f0105ae52ad5d79659c58e0922b18c0d61a6854afcc4",
//     //     "homepage": "https://pitchinvestorslive.com/",
//     //     "name": "Pitch",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a1e27fc7-905f-403b-85c5-ff131eea1d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "be6607b0a4093c0443bfe9c19ab30c99c91d2638866c99a6a16a71d3c1df78f8",
//     //     "homepage": "https://coinus.io/",
//     //     "name": "CoinUs",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1f92f9f9-08b9-4eca-4d75-425ce3d50100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "ca151c4caeec5f9cc02ef03e498cb38c02ee5e498a8db13e853315077a5b45dc",
//     //     "homepage": "https://cmorq.com/",
//     //     "name": "cmorq",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4e9f4558-32a2-46c9-be37-4926a6e95100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "09728a04025a39f04c76c3ab3751f1d245fab60bc519489a0c0107f0861e950a",
//     //     "homepage": "https://zksync.io/",
//     //     "name": "zkSync",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4dfce4b4-f300-4cc4-f7a2-b51d0e2d7800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "66a152c24564b90c790dda221dc6064d8a916b8ee45f4fb3d6732da01d0bebaa",
//     //     "homepage": "https://indexcoop.com/",
//     //     "name": "Index Coop",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7e90c48c-d457-4d37-3270-26af2317e000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "3c8532a03fc2fc60876b145e9482c002edffd5403268710b9f5412a822a4be87",
//     //     "homepage": "https://octo.fi/",
//     //     "name": "OctoFi",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/46cebca3-c7dd-4995-7587-a0b4d6c53d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "b397a6d7fc2eb4895579d0fa043d66bbb0396e40237876d6d9f294f41cf755ac",
//     //     "homepage": "https://gopocket.finance/",
//     //     "name": "Go Pocket",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2494a686-3e07-4e9b-15ef-3605dca32a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "a3ad8e05bc84499afaf3612a0ac95ef5e9b65c587da1b5ed71a00b9ff0e5f4af",
//     //     "homepage": "https://orchid.com/",
//     //     "name": "Orchid Protocol",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/57c3a046-9706-4fc5-0300-e735aab83900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "6464873279d46030c0b6b005b33da6be5ed57a752be3ef1f857dc10eaf8028aa",
//     //     "homepage": "https://secuxtech.com/",
//     //     "name": "SecuX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/6013a9a1-4a67-45bb-fc24-27c11eb13900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "417d83b614dd10de664107873ca2c2a65c62f2e699113dc005790f6a84c42cae",
//     //     "homepage": "https://twinci.io",
//     //     "name": "Twinci",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/be8b1aed-404d-40c3-cfe3-521af679a100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "d67b8e1ee1bd30f68af1203f07a5081aed629a859e6e1fbb3e6a424dc9e1592d",
//     //     "homepage": "https://nftyconnect.com/",
//     //     "name": "NFTY Connect",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3ed8e73f-2bf8-4740-9240-b9503722a100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "5cfacbd76097ea40949e6fc17721009d93f6d3b6f243a207c167bd0f058c341f",
//     //     "homepage": "https://cryptomultisender.com/",
//     //     "name": "Crypto Multisender",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b66e17ca-0d82-4f67-8fd5-bcf0afa5c100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "5859076ade608fbc4e9d3fe2f95e8527de80f8451ecbb1dced54ca84deae0dd6",
//     //     "homepage": "https://coingrig.com",
//     //     "name": "Coingrig",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/18e38e41-a387-4402-ca31-6d2d5eb91100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "36a9516e9b17c1153233fc7faffee259697a2138aed633ab256b947971b044a8",
//     //     "homepage": "https://optimistic.loogies.io/",
//     //     "name": "OptimisticLoogies",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7db28d2b-67f1-4d44-4dfc-2449ca934a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "f323633c1f67055a45aac84e321af6ffe46322da677ffdd32f9bc1e33bafe29c",
//     //     "homepage": "https://core.app",
//     //     "name": "Core",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/35f9c46e-cc57-4aa7-315d-e6ccb2a1d600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "3f6d608030d9bf5ea6128121bb0f8d5230ba21ea3fcd66fbf93e7fd1ba72d0e6",
//     //     "homepage": "https://unlock-protocol.com/",
//     //     "name": "Unlock Protocol",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/33559b57-ef50-4845-1368-2f7aca93cd00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "36d8d9c0c7fe2957149ce8e878f3a01a8611521983362d9b651fb6e508325583",
//     //     "homepage": "https://coincircle.com",
//     //     "name": "CoinCircle",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/eae63a23-c7ba-4f7e-24b3-e6fc69215d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "895fee383e9ebb38411d04c8b64fddf354dcc601f958290286475f31ca9e2bd1",
//     //     "homepage": "https://quixotic.io",
//     //     "name": "Quixotic",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b26df0fb-8e79-4f70-4d33-3e4a3b633600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "d27af9e0cce4fe1e05c00a1a0e27f160da9f02ae6fc662ff4022219b3c57fce2",
//     //     "homepage": "https://connect3.world",
//     //     "name": "Connect3",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1cb4c660-34c9-4bcb-27ae-6582f6895d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "19177a98252e07ddfc9af2083ba8e07ef627cb6103467ffebb3f8f4205fd7927",
//     //     "homepage": "https://www.ledger.com/ledger-live",
//     //     "name": "Ledger Live",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a7f416de-aa03-4c5e-3280-ab49269aef00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "09c4e2ebc81a6a76c05d0c62f797151732fa9c0b84ef92654cd438849271e44b",
//     //     "homepage": "https://dydx.exchange/",
//     //     "name": "dYdX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b111b4a0-de7c-4ef9-09ab-21dc361a7300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "efba9ae0a9e0fdd9e3e055ddf3c8e75f294babb8aea3499456eff27f771fda61",
//     //     "homepage": "https://eidoo.io/",
//     //     "name": "Eidoo",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ef5b8bcf-00d5-457d-e161-9911e4788700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "b79d14dff50d405ebc7484f5316f999d8e0d9d130c3a4412aaf7e5c587b0d954",
//     //     "homepage": "https://defiprime.com/",
//     //     "name": "DeFi Prime",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/27edd56a-9359-4139-9b26-dc27e8a12700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "ed6a16b330335e7b39a27f43ccc603043a02d03e66d3d185a8924fec42bb2d03",
//     //     "homepage": "https://ddex.io/",
//     //     "name": "DDEX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2c680d84-fe35-4c6b-d786-baecc5967e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "6ec1ffc9627c3b9f87676da3f7b5796828a6c016d3253e51e771e6f951cb5702",
//     //     "homepage": "https://gridplus.io/",
//     //     "name": "GridPlus",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/3c928cbd-39dc-4090-c372-d4dcb3c89500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "4a7c46897481ccee8c101b99a920b90727cf42bf0f99c8f4f50e6a6ebc802c4e",
//     //     "homepage": "https://linkdrop.io/",
//     //     "name": "Linkdrop",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a17ea783-c566-4e89-b0b5-4dc92bbefe00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "253aedf09361b7d0d90b33107079635554ad56807d9f0a6edd95891a45eca990",
//     //     "homepage": "https://dodoex.io/",
//     //     "name": "DODO",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ae8c6089-edcd-4b4e-5e59-cf89e3355800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "88fe080dcec093d8e358ab011f5384878ead9cb68ac0ac7dc690744811366597",
//     //     "homepage": "https://lido.fi/",
//     //     "name": "Lido",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/18c8f71f-e641-4b18-4dba-da540633aa00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "fd147609a856c6793f2c01f80d1e60b6948490adf1dfcf18015e396510d6636c",
//     //     "homepage": "https://definer.org/",
//     //     "name": "DeFiner",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c187e653-ef4a-4e91-fd8e-d8c4c85d4900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "c9688b7e5331a9cdeebb973201263f470fdcbca9151e02752523c7ff89ddecf3",
//     //     "homepage": "https://www.trinity-feeds.app/",
//     //     "name": "Trinity Feeds",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e4d09294-3688-43e6-a255-5a4903d4a800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "a6c7662de52db7c8088f1e32dcf04c122675c834c839c2eb40e495aed207d4e2",
//     //     "homepage": "https://dogsofelon.io/",
//     //     "name": "Dogs of Elon",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ba4a44ee-53c1-4520-c04a-6470f6d70200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "e9ff15be73584489ca4a66f64d32c4537711797e30b6660dbcb71ea72a42b1f4",
//     //     "homepage": "https://exodus.com/",
//     //     "name": "Exodus",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4c16cad4-cac9-4643-6726-c696efaf5200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "f54181d7af8b5f4dc6fe080328ac25435228f2f798b2e40e1ac0d2da70cc4b38",
//     //     "homepage": "https://nft.multisender.app",
//     //     "name": "NFT Multisender",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/e6f55847-524a-4594-abc3-89a166a01300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "48e53d96460308a1734614b5d4fdf7ea169e6f998e01eb7b4e18014f57904d67",
//     //     "homepage": "https://helixid.io/",
//     //     "name": "helix id",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/4083ef71-8389-4682-ded6-0099236d2e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "dc5415b6ea8114db518ae91195b027d690a11a1d2bfdd1a904e93c5cb746380e",
//     //     "homepage": "https://simplehold.io/",
//     //     "name": "SimpleHold",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a9f1ba96-b658-4d13-f71f-226b6389f000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "9d373b43ad4d2cf190fb1a774ec964a1addf406d6fd24af94ab7596e58c291b2",
//     //     "homepage": "https://token.im/",
//     //     "name": "imToken",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1991f85d-43d4-4165-3502-cd6ef8312b00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "61f6e716826ae8455ad16abc5ec31e4fd5d6d2675f0ce2dee3336335431f720e",
//     //     "homepage": "https://mykey.org",
//     //     "name": "MYKEY",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/df0306ae-f33c-454f-8679-39aed351c800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "132a564227f18d8c549bf4bebc617b5416be80fca9d321507685d96c8d84bcc5",
//     //     "homepage": "https://tokensets.com/",
//     //     "name": "TokenSets",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7738f457-b51f-4c9f-15f0-2cd44f1cd200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "780f1069d765bf8d5c8d3c17728e0f0fac17708d07dfe840b7c0e61d3ab7ec61",
//     //     "homepage": "https://totle.com/",
//     //     "name": "Totle",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a83b4702-1726-4571-b704-ea819977a500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "394ee2a85b0ed89e766fbb27c0aeb44d423dee7ec7189ba39c1ab9b5fe55f870",
//     //     "homepage": "https://synthetix.exchange/",
//     //     "name": "Synthetix",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f47ccabe-f02d-4663-cb5c-a42003ad2000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "6d296cc03b11b2b59c1e009f1854576be7ae1687951cf7f6283f993ac7b8b2e4",
//     //     "homepage": "https://pooltogether.com/",
//     //     "name": "PoolTogether",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8c023c32-0d35-499d-1954-fd681fd74500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "a66189f2de21e3674c3762ab93c1c14a666a5361d4d79df1f2d9409151cd5def",
//     //     "homepage": "https://melon.avantgarde.finance/",
//     //     "name": "Melon",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2d782812-661a-49c6-e0fc-9c313bf40300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "b37cbde29b86efa434b1eebda15f7598e4338f5307c6d766311558cebd548b33",
//     //     "homepage": "https://2key.network/",
//     //     "name": "2Key",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8e1cbc78-06cf-488b-1a2e-4f0ecc48b900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "e05615ed22df39c8d9b99ea38b45d4accb103fcef9cfa5d5edd38f5839b5182e",
//     //     "homepage": "https://quiverx.io",
//     //     "name": "QuiverX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/67acf8ad-da61-4b7f-609b-57224fb8b100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "1bc1d561a2a38a2ff0c4dfb21c2236f7335084f822cd5de016bd4725fed389df",
//     //     "homepage": "https://yitoken.im",
//     //     "name": "yiToken",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b5cc13d4-2a58-4142-08dd-5596ab253800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "7657bb2b332c4ad3ef648a7f67ce6f1def58027be3c36efa098a4ab031e6031d",
//     //     "homepage": "https://fleek.co/",
//     //     "name": "Fleek",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/78d44b5f-db6e-4f7f-1850-2fdd83c87d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "dc5eae101caa47ce5580eb792799660bf2b8621cfadb7a4cbf69f8b647e71c51",
//     //     "homepage": "https://livepeer.org",
//     //     "name": "Livepeer Explorer",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/de530191-2ce2-423d-a6d7-3f2415ef9a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "dd8ee41915d967e547c80266e883d77ee808427405f4e8026a85ac1308104221",
//     //     "homepage": "https://linen.app/",
//     //     "name": "Linen",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/91458f54-aabe-44cf-4788-159ccc733600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "8fcad00e3d10c0361c6b778796ca421c0ced7dbaa91d98a707a3af3c0024b0ca",
//     //     "homepage": "https://eyesfi.com/",
//     //     "name": "eyesfi",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/cb8417ed-082c-46fe-7640-91203d992100?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "47bb07617af518642f3413a201ec5859faa63acb1dd175ca95085d35d38afb83",
//     //     "homepage": "https://keyring.app/",
//     //     "name": "KEYRING PRO",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/dda0f0fb-34e8-4a57-dcea-b008e7d1ff00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "9a5e4fe7d72eb97d1947350a4fbd95425d801c193932494d8431fa3789ec6ce1",
//     //     "homepage": "https://www.loopop.io/",
//     //     "name": "Loopop! - IN LOVE & LOVE-IN",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/64f02531-1c5a-4bff-4e0d-d1b4cdf4fe00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "4ff5b6816dd118b8c362939cfb7332f667ff071a1828aa96c760871e1b5634fd",
//     //     "homepage": "https://zengo.com/",
//     //     "name": "ZenGo",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d1794d97-ea1f-4966-be42-9f614bb5d800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "fb3833872e33f8d02e5d00a0bda341eadf9e61c4e66cc635f46370c2fe5959f5",
//     //     "homepage": "https://tengri.io",
//     //     "name": "Tengri.io",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/9f9f3be8-02ce-45fa-3230-dd19cc375600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "22046f35fd2ec3937582426f7e803617101a73bbcbe9374375529cebbfc59c47",
//     //     "homepage": "https://www.uvtoken.com",
//     //     "name": "Uvtoken",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/52b9a9fc-caff-469e-033b-6d6f14e41800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "hybrid",
//     //     "id": "ecc4036f814562b41a5268adc86270fba1365471402006302e70169465b7ac18",
//     //     "homepage": "https://zerion.io/",
//     //     "name": "Zerion",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/f216b371-96cf-409a-9d88-296392b85800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "f94a60403cdffa9a521dd12f9ec1004a887755c62ecf7bb4e9b8ee6806c26b58",
//     //     "homepage": "https://www.uvtoken.com",
//     //     "name": "UvToken",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a0057241-cd91-4a53-7175-016b76bfd900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "85db431492aa2e8672e93f4ea7acf10c88b97b867b0d373107af63dc4880f041",
//     //     "homepage": "https://www.frontier.xyz/",
//     //     "name": "Frontier",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/a78c4d48-32c1-4a9d-52f2-ec7ee08ce200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "a446ceaee1e7db60502b145003c6d019fd0061fed07eec77446df5dde48dfd62",
//     //     "homepage": "https://Zoo.one",
//     //     "name": "ZooKeeper",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/379fa8e7-b74b-462e-8dce-12d1366a0400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "00e39f835988d1bb783b2a0748e18bc6278dec03492d00b0e102a466cd8b3d77",
//     //     "homepage": "https://zelus.io",
//     //     "name": "Zelus",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/aeba2105-6c84-4642-f441-b3f5817ac400?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "089b3f0e1f3133098b8ef0d6d794e46383b02ba73adf824287979506b8c12533",
//     //     "homepage": "https://tengi.xyz",
//     //     "name": "Tengi",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/cb79449d-6c02-47b3-9567-105bd6915200?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "0563e0724f434298dda37acaa704857ab293b48f1b39b765569a0072de43c0cf",
//     //     "homepage": "https://get-verso.com",
//     //     "name": "Verso",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/1d079e5b-24d2-4ac0-44bc-8f5954d81900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "5bc813278a24518f002ab5a29833d67e747ca6a688e34ae09371a41449204408",
//     //     "homepage": "https://evoverses.com",
//     //     "name": "EvoVerses",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/6b01ae35-a747-4146-fd6a-564fc2e05800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "fe9b597a44552ff0ef0ef68a7a6befa953ddc17ea1536c1e971ad2c85ac1e054",
//     //     "homepage": "https://we-nft.io",
//     //     "name": "We-NFT.io",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/bc7b4007-05d3-4bb8-d073-edc62a26c600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "5249689fb88651c082bc690c8f7665b038f244d3eba88e56588e62621ddf9a3c",
//     //     "homepage": "https://game.elemon.io",
//     //     "name": "Elemon",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/857717bb-ee58-4862-4e1d-01c8a6437c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "2c68a247b6ebd732bf72dcd070330bd261a5e30df80fdabcac84c75eef29addd",
//     //     "homepage": "https://www.forestknight.io/",
//     //     "name": "Forest Knight",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/9299d79c-9050-489c-6e4d-58ca21900900?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "d0387325e894a1c4244820260ad7c78bb20d79eeec2fd59ffe3529223f3f84c6",
//     //     "homepage": "https://infinitowallet.io/",
//     //     "name": "Infinito",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b07624f3-fb36-45a4-200c-6cb2a930ef00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "a1fb7359e8d89469a4004b809c8470216a7c049c4b27ad6f3cabc3ac9d79adf9",
//     //     "homepage": "https://yfx.com/",
//     //     "name": "YFX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/627671c9-1f7b-4d44-04bb-eed019e6e700?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "658cc78a82d277db4cf6a801adcb1b68aeccd1357d40c177c443625da95fd8f4",
//     //     "homepage": "https://loopring.io",
//     //     "name": "Loopring",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2972bbf8-0891-414a-f63c-8d3bcf661d00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "30ce179f170230734d83ba26a6b381a7a3298fe014559fae51cc0a14daf8c92d",
//     //     "homepage": "https://knownorigin.io/",
//     //     "name": "KnownOrigin",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2de06fe9-82a4-4769-b2a3-7b097651cc00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "c2e7871837f2b6f99de43371629606f3b0ddf2d25ac49d92be419e682088919d",
//     //     "homepage": "https://88mph.app/",
//     //     "name": "88mph",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/377ac8d4-de69-41a5-f625-2a3cc3afa000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "16cbec7a52204dbb75455f8ead438f7a8e9727956153626988000f313cfcef45",
//     //     "homepage": "https://yooshi.io/",
//     //     "name": "Yooshi",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/8eeb0596-8b4c-4f57-731f-cd8251c65500?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "afbd95522f4041c71dd4f1a065f971fd32372865b416f95a0b1db759ae33f2a7",
//     //     "homepage": "https://omni.app",
//     //     "name": "Omni",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/2cd67b4c-282b-4809-e7c0-a88cd5116f00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "d29a5c54fbd768185c643706ac8101a9bbe1c44225674379a57193503cf5ec69",
//     //     "homepage": "https://mooni.tech/",
//     //     "name": "Mooni",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/70729627-6895-4c26-c149-18888f713800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "b642ab6de0fe5c7d1e4a2b2821c9c807a81d0f6fd42ee3a75e513ea16e91151c",
//     //     "homepage": "https://vision-crypto.com/",
//     //     "name": "Vision",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/c279537a-920d-422c-6a65-8b3bd524c300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "3ed8d78a90e1ecefae998f6f3d7fe968d0ac6c2ee7a092fe29bae3e9621f9a8f",
//     //     "homepage": "https://zlot.finance/",
//     //     "name": "zLOT",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b756297f-a25f-45c0-2d44-e9dafe0b8c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "6b9ac5790debc6264e9581215724b782a23543cba6df5da693c334a90e83855e",
//     //     "homepage": "https://plotx.io",
//     //     "name": "PlotX",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ed970a0b-001a-49e6-ccec-569dfa112300?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "dceb063851b1833cbb209e3717a0a0b06bf3fb500fe9db8cd3a553e4b1d02137",
//     //     "homepage": "https://onto.app/",
//     //     "name": "ONTO",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/d22b2a4b-5562-49ba-506b-6d5986914600?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "6a2a781c47a940d740f7f0e9872c9683088baa559e69a8da81fcad9ad650b990",
//     //     "homepage": "https://pwn.xyz/",
//     //     "name": "PWN",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/ced226a0-5dc8-4704-defd-112f45756800?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "74f8092562bd79675e276d8b2062a83601a4106d30202f2d509195e30e19673d",
//     //     "homepage": "https://www.spot-wallet.com/",
//     //     "name": "Spot",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/7d90b813-c44e-41c2-a105-d20b26c71000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "wallet",
//     //     "id": "3f1bc4a8fd72b3665459ec5c99ee51b424f6beeebe46b45f4a70cf08a84cbc50",
//     //     "homepage": "https://toruswallet.io/",
//     //     "name": "Torus",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/47d03b65-6be7-4004-5dba-7dadef6e6000?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // },
//     // {
//     //     "category": "dapp",
//     //     "id": "a1ca5756d9a7b959a727aea7f3ae3d6223facb363403e9913e984f5868fede2b",
//     //     "homepage": "https://yup.io/",
//     //     "name": "Yup",
//     //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/fa1ad282-9050-4bd6-9aba-53711c4e2a00?projectId=2f05ae7f1116030fde2d36508f472bfb"
//     // }
// ]

//         "category": "dapp",
//         "id": "d2ae9c3c2782806fd6db704bf40ef0238af9470d7964ae566114a033f4a9a110",
//         "homepage": "https://etherscan.io/",
//         "app": "https://etherscan.io/",
//         "name": "Etherscan",
//         "image": "https://explorer-api.walletconnect.com/v3/logo/md/de60f6e0-effe-4b8c-1f3e-e12278839300?projectId=2f05ae7f1116030fde2d36508f472bfb"


let dapps_ethereum = [
    // {
    //     "category": "dapp",
    //     "id": "2d7b5ef9ea6e5b856440ad38ac3e9ffc6e311f353aae4a90daadf4654e31ffb7",
    //     "homepage": "https://snapshot.org/",
    //     "app": "https://snapshot.org/",
    //     "name": "Snapshot",
    //     "image": "https://explorer-api.walletconnect.com/v3/logo/md/b96552e9-6c7d-467c-bb37-486224d77e00?projectId=2f05ae7f1116030fde2d36508f472bfb"
    // },
    {
        "category": "dapp",
        "id": "a85fb60f37b9971969e00caa241ed2b6ccd8fce369f59d3a965202595a4a9462",
        "homepage": "https://gnosis-safe.io/",
        "app": "https://app.safe.global/",
        "name": "Gnosis Safe Multisig",
        "image": "https://explorer-api.walletconnect.com/v3/logo/md/0b7e0f05-0a5b-4f3c-315d-59c1c4c22c00?projectId=2f05ae7f1116030fde2d36508f472bfb"
    },
]
let spec = process.env['URL_PIONEER_SPEC']

let run_load = async function(){
    try{
        let queryKey = "key:cfd27e74asda"
        let config = {
            queryKey,
            username:"user:cfd27e74",
            spec
        }

        console.log("config: ",config)

        //get config
        let pioneer = new pioneerApi(spec,config)
        pioneer = await pioneer.init()

        //for dapps
        // for(let i = 0; i < dapps.length; i++ ){
        //     let dapp = dapps[i]
        //     dapp.authorization = config.queryKey
        //     dapp.trust = 0
        //     dapp.transparency = 0
        //     dapp.innovation = 0
        //     dapp.popularity = 0
        //     dapp.uploader = ['']
        //     dapp.developers = ['0x2356a15042f98f0a53784f42237bd4b2873aadcf']
        //     dapp.blockchains = [dapp.blockchain]
        //     dapp.protocol  = ['keepkey-sdk']
        //     dapp.version = "sdk-1"
        //     dapp.description = "app name is "+dapp.name
        //     dapp.tags = [dapp.blockchain]
        //     console.log(dapp)
        //
        //     // let txInfo = await pioneer.instance.ListApps()
        //     // console.log("apps: ",txInfo.data)
        //
        //     try{
        //         let txInfo = await pioneer.CreateApp("",dapp)
        //         console.log("apps: ",txInfo.data)
        //     }catch(e){
        //         console.error(e)
        //     }
        //
        //
        // }

        for(let i = 0; i < dapps_ethereum.length; i++ ){
            let dapp = dapps_ethereum[i]
            dapp.authorization = config.queryKey
            dapp.whitelist = true
            dapp.trust = 0
            dapp.transparency = 0
            dapp.innovation = 0
            dapp.popularity = 0
            dapp.uploader = ['']
            dapp.developers = ['0x2356a15042f98f0a53784f42237bd4b2873aadcf']
            dapp.blockchains = ['ethereum']
            dapp.protocol  = ['wallet-connect-v1']
            dapp.version = "wc-1"
            dapp.description = "app name is "+dapp.name
            dapp.tags = ['ethereum']
            console.log(dapp)

            // let txInfo = await pioneer.instance.ListApps()
            // console.log("apps: ",txInfo.data)

            try{
                // if
                if(dapp.category === 'dapp'){
                    let txInfo = await pioneer.CreateApp("",dapp)
                    console.log("apps: ",txInfo.data)
                }

            }catch(e){
                console.error(e)
            }


        }
    }catch(e){
        console.error(e)
    }
}
run_load()