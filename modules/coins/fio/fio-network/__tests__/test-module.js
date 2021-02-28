require("dotenv").config({path:'../../../.env'})

const colorize = require('json-colorizer');
let fio = require("../lib")
let beautify = require("json-beautify");
let log = function(tag,obj){
    try{
        // console.log(tag, beautify(obj, null, 2, 100));
        console.log(tag, colorize(beautify(obj, null, 2, 100)));
    }catch(e){
        console.error(e)
    }
}

let run_test = async function(){
    try{
        //await fio.init(urlSpec)

        // let info = await fio.nodeInfo()
        // log("info: ",info)

        //name
        // let fioAccountInfo = await fio.getAccountInfo('bithighlander@shapeshift')
        // log("fioAccountInfo: ",fioAccountInfo)

        // let isAvailable = await fio.isAvailable('highlander@scatter')
        // log("isAvailable: ",isAvailable)

        // let fioAccountInfo = await fio.getAccountInfo('highlander@scatter')
        // log("fioAccountInfo: ",fioAccountInfo)

        // let fioAccountInfo = await fio.getAccountInfo('disco@shapeshift')
        // log("fioAccountInfo: ",fioAccountInfo)

        // let pendingReq = await fio.getPendingRequests('FIO6gEwHrLHaAPQK61mCRitvRX7dYKH7m4Jpyi65JBhcFb6pPSRhL')
        // console.log("pendingReq: ",pendingReq)

        let fioAccountInfo = await fio.getAccountInfo('highlander@shapeshift')
        log("fioAccountInfo: ",fioAccountInfo)

        // let fioAccountInfo = await fio.getAccount('disco@shapeshift')
        // log("fioAccountInfo: ",fioAccountInfo)

        // highlander@scatter FIO7Jpu6RnKt6URTaQfXfdzZBFtoXdbXuQMiVPVyrM913ES6wzFvo
        // xhighlanderx@scatter FIO8Q4i96KggP2X8MPjU5ey7eNgGK6Fnx3trr98YtCHQhffQsF3U2

        //register domain
        // let accountInfo = await fio.getAccounts('FIO83qrpcESZd2xqvas8ACsaXvMT15ywu7zNwZxTdAxTQWwcvLVCW')
        // log("accountInfo: ",accountInfo)

        //TODO GO register name
        // let accountInfo = await fio.getAccounts('FIO6Lxx7BTA8zbgPuqn4QidNNdTCHisXU7RpxJxLwxAka7NV7SoBW')
        // log("accountInfo: ",accountInfo)

        // let accountInfo = await fio.getAccounts('FIO6Lxx7BTA8zbgPuqn4QidNNdTCHisXU7RpxJxLwxAka7NV7SoBW')
        // log("accountInfo: ",accountInfo)

        // let accountInfo = await fio.getAccounts('FIO7utjwtj3rTteGAKZZPSNJpRaLr1H6cvoMAUsmboXou7RQAb5ot')
        // log("accountInfo: ",accountInfo)

        // let actorInfo = await fio.getActor('FIO7utjwtj3rTteGAKZZPSNJpRaLr1H6cvoMAUsmboXou7RQAb5ot')
        // log("actorInfo: ",actorInfo)

        // let accountInfo = await fio.getAccount("ia5kjnvglruq")
        // log("accountInfo: ",accountInfo)

        //TODO GO register Addresses

        //register bitcoin
        //sign bitcoin msg
        //build FIO tx to assign address to name

        // //FIO8Q4i96KggP2X8MPjU5ey7eNgGK6Fnx3trr98YtCHQhffQsF3U2
        // let getBalance = await fio.getBalance('FIO7Jpu6RnKt6URTaQfXfdzZBFtoXdbXuQMiVPVyrM913ES6wzFvo')
        // log("getBalance: ",getBalance)
        //
        // let getBalance = await fio.getBalance('FIO7Jpu6RnKt6URTaQfXfdzZBFtoXdbXuQMiVPVyrM913ES6wzFvo')
        // log("getBalance: ",getBalance)
        //
        // // let accountFioAddress = await fio.getAccountAddress('highlander@scatter','FIO')
        // // log("accountFioAddress: ",accountFioAddress)
        //
        // let accountFioAddress = await fio.getAccountAddress('highlander@scatter','FIO')
        // log("accountFioAddress: ",accountFioAddress)

        // let accountEthAddress = await fio.getAccountAddress('highlander@scatter','ETH')
        // log("accountEthAddress: ",accountEthAddress)
        //
        // //get tx history
        // // let txHistory = await fio.txs('iyz3zveyg23i')
        // // log("txHistory: ",txHistory)
        //
        // let txHistory = await fio.txs('zkfounmxdmls')
        // log("txHistory: ",txHistory)
        // log("txHistory: ",txHistory.actions[6])
        // log("txHistory: ",JSON.stringify(txHistory.actions[6]))

        // let obtData = await fio.getObtData('FIO6Lxx7BTA8zbgPuqn4QidNNdTCHisXU7RpxJxLwxAka7NV7SoBW')
        // log("obtData: ",obtData)

        // let txHistory = await fio.txs('iyz3zveyg23i')
        // log("txHistory: ",txHistory.actions.length)
        //neaccount
        //log("type: ",txHistory.actions[1].action_trace)
        //
        // //register address
        // // log("type: ",txHistory.actions[3])
        //
        // //log("txHistory: ",txHistory)
        // // log("txHistory: ",txHistory.actions)
        // // log("txHistory: ",txHistory.actions)
        // // log("txHistory: ",txHistory.actions[0])
        // log("type: ",txHistory.actions[0].action_trace.act.name)
        // log("type: ",txHistory.actions[1].action_trace.act.name)
        // log("type: ",txHistory.actions[2].action_trace.act.name)
        // log("type: ",txHistory.actions[3].action_trace.act.name)
        // log("type: ",txHistory.actions[4].action_trace.act.name)
        // log("type: ",txHistory.actions[5].action_trace.act.name)
        // log("type: ",txHistory.actions[6].action_trace.act.name)


        //transfer
        //log("txHistory: ",txHistory.actions[1])
        // log("type: ",txHistory.actions[0].action_trace.act.name)
        // log("txHistory: ",txHistory.actions[2])
        // log("txHistory: ",txHistory.actions[3])
        // log("txHistory: ",txHistory.actions[3].action_trace)
        // log("txHistory: ",txHistory.actions[3].action_trace.act)

        // let blockInfo = await fio.getBlock(29990325)
        // log("blockInfo: ",blockInfo)
        // log("blockInfo: ",JSON.stringify(blockInfo.transactions[0]))

        //broadcast
        // let broadcast = {
        //     signatures:
        //         [ 'SIG_K1_KeMX6zHzfYZqNJbUSDQ4kzdB5t7T99DfynTpHgPCqCixvHNbiGFerfWELRScVLkXMm9K5YPhBJHgasg6yMga8rUvP8CPCA' ],
        //     compression: "none",
        //     packed_context_free_data: '',
        //     packed_trx:
        //         '06d46a5f795dc8da54b900000000010000980ad20ca85be0e1d195ba85e7cd010075b5241f66788e00000000a8ed32324f3546494f355645364467793946556d64316d466f745877463838486b514e314b797343574c507170566e444d6a52764752693159724d00ca9a3b0000000000c2eb0b000000000075b5241f66788e0000' }

        // let broadcast = {
        //     signatures:
        //         [ 'SIG_K1_Kktfg9xxWPx2AGpUcNFML1GUszbWe4m6F8VJGG9BcRRHH7KBDFsLzd6swLDwtBLyWXirDgUPDM5WJK41BuZjUSDeaFfTRQ' ],
        //     compression: "none",
        //     packed_context_free_data: '',
        //     packed_trx:
        //         '9b7c8a5f3791dc4f92d40000000001003056372503a85b0000c6eaa664523201e086605eed3fbe7700000000a8ed32325610646973636f40736861706573686966740103455448034554482a3078333362333563363635343936626138653731623232333733383433333736373430343031663130360040b743ba000000e086605eed3fbe770000'
        // }
        //
        // let result = await fio.broadcastAddPubAddressTx(broadcast)
        // log("result: ",JSON.stringify(result, null, 2))

        // let result = await fio.broadcastRegisterAddress(broadcast)
        // log("result: ",JSON.stringify(result, null, 2))

        // let result = await fio.broadcastSubmitPaymentRequest(broadcast)
        // log("result: ",JSON.stringify(result, null, 2))

        // let result = await fio.broadcast(broadcast)
        // log("result: ",JSON.stringify(result, null, 2))

    }catch(e){
        console.error(e)
    }
}

run_test()
