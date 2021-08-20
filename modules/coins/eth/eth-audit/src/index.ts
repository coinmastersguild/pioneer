

/*
    Digest transaction data into credit/debits

    Maintain atlas of known contracts and events

 */

let TAG = " | audit | "
const log = require('@pioneer-platform/loggerdog')()
const util = require('ethereumjs-util')
const BASE = 1000000000000000000
let Web3 = require('web3');

module.exports = {
    auditTransaction: function (txInfo:any,source:any) {
        return audit_transaction(txInfo,source);
    },
    auditReceipt: function (contract:string,receipt:any) {
        return audit_receipt(contract,receipt);
    },
    auditTrace: function (trace:any) {
        return audit_trace_receipt(trace);
    },
    auditTokenTransfer: function (tokenTxInfo:any) {
        return audit_token_transfer(tokenTxInfo);
    },
}

/*
    Sablier Contract audit

    TODO gneratic import from atlas
 */

const audit_sablier_create = function(contract:string,receipt:any){
    let tag = TAG + " | audit_sablier_create | ";
    try {




        return true;
    } catch (e) {
        throw tag + e
    }
}


const audit_receipt = function(contract:string,receipt:any){
    let tag = TAG + " | audit_receipt | ";
    try {

        log.debug(tag,"contract: ",contract)
        log.debug(tag,"receipt.logs: ",receipt.logs)

        log.debug(tag,"receipt last : ",receipt.logs[6])

        if(contract === 'sablier (proxy)' && receipt.logs.length === 7){
            log.info(tag,"receipt.logs: ",receipt.logs.length)
            // let streamStart = receipt.logs[5].address

            log.debug(tag,"receipt.receipt: ",receipt)

            //token
            let streamAsset = receipt.logs[0].address
            log.debug(tag,"streamAsset: ",streamAsset)

            let streamAmount = receipt.logs[0].data
            log.debug(tag,"streamAmount: ",streamAmount)

            streamAmount = util.unpadHexString(streamAmount)
            log.debug(tag,"streamAmount: ",streamAmount)

            streamAmount = parseInt(streamAmount,16)
            log.debug(tag,"streamAmount: ",streamAmount)

            //get address
            let recipient = receipt.logs[5]?.topics[3]
            log.debug(tag,"recipient: ",recipient)

            recipient = util.unpadHexString(recipient)
            log.debug(tag,"recipient: ",recipient)

            //repad
            recipient = "0x"+recipient


            let saleryId = receipt.logs[6]?.topics[1]
            log.debug(tag,"saleryId: ",saleryId)

            saleryId = util.unpadHexString(saleryId)
            log.debug(tag,"saleryId: ",saleryId)

            saleryId = parseInt(saleryId,16)
            log.debug(tag,"saleryId: ",saleryId)

            let txid = receipt.logs[0].transactionHash
            let logId = receipt.logs[0].id
            let blockNumber = receipt.logs[0].blockNumber

            let txFinal:any = {}
            //indexs for search
            txFinal.asset = "saleryId:"+saleryId
            txFinal.Type = 'streamCreate'
            txFinal.logId = logId
            txFinal.ecr20 = false
            txFinal.ecr721 = false
            txFinal.txid = txid
            if(!txFinal.txid) throw Error("Invalid tx! missing txid! ")
            txFinal.addresses = []
            txFinal.events = []

            txFinal.type = "transfer"
            txFinal.height = blockNumber

            txFinal.addresses.push(recipient)
            txFinal.tags = [
                recipient,
                'streamCreate',
                'stream',
                'credit',
                logId
            ]

            //event, create asset class stream
            let eventCredit = {
                type:"credit",
                address:recipient,
                amount:1,
                asset:'stream',
                stream:{
                    saleryId,
                    streamAsset,
                    streamAmount,
                    // streamStart,
                    // streamStop
                },
                txid:txid
            }

            //TODO debit erc20 from sender

            txFinal.events.push(eventCredit)
            // txFinal.events.push(eventDebit)
            //txFinal.events.push(eventFee)


            return txFinal;
        } else {
            //unknown
            return {
                type:'unknown',
                contract,
            }
        }

    } catch (e) {
        throw e
    }
}


/*
    Token transfer


 { block: '10008638',
  token: 'SAI',
  transaction:
   { contractAddress: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
     confirmed: true,
     blockHash:
      '0xa72ddb5c241a62511d9435ab65ae8c85d0d269f1afd8c9ebf8571546d8accec3',
     blockNumber: 10008638,
     from: '0xc45d23f7f6fdb991cfdad1acd15381874f9e0120',
     to: '0x8134d518e0cef5388136c0de43d7e12278701ac5',
     amount: 0.4179204961215084,
     txid:
      '0x1b17a2df6d3f13a44b9ee21835eba764022abcc127e65dd291f3ac9c996c8fc5',
     index: 75 } }

 */

const audit_token_transfer = function(tokenTxInfo:any){
    let tag = TAG + " | audit_transaction | ";
    try {

        let txFinal:any = {}
        //indexs for search
        txFinal.asset = tokenTxInfo.token
        txFinal.txid = tokenTxInfo.transaction.txid
        if(!txFinal.txid) throw Error("Invalid tx! missing txid! ")
        txFinal.addresses = []
        txFinal.events = []
        txFinal.type = "transfer"
        txFinal.height = parseInt(tokenTxInfo.block)

        //if no logs, then not token transfer
        if(tokenTxInfo.receipt.logs.length === 0){
            //Not an erc20 transfer
        }else{

            txFinal.addresses.push(tokenTxInfo.transaction.to)
            txFinal.addresses.push(tokenTxInfo.transaction.from)


            //2 events, send receive
            let eventCredit = {
                type:"credit",
                address:tokenTxInfo.transaction.to,
                amount:tokenTxInfo.transaction.amount,
                asset:tokenTxInfo.token,
                txid:tokenTxInfo.transaction.txid
            }
            let eventDebit = {
                type:"debit",
                address:tokenTxInfo.transaction.from,
                amount:tokenTxInfo.transaction.amount * -1,
                asset:tokenTxInfo.token,
                txid:tokenTxInfo.transaction.txid
            }
            // let eventFee = {
            //     type:"debit",
            //     asset:"ETH", //Fees paid in ETH
            //     fee:true,
            //     address:tokenTxInfo.transaction.from,
            //     //amount:tx.gas_wanted / 1000, // NOTE mintscan shows fees as wanted. default fee currently 2x gas used
            //     txid
            // }

            txFinal.events.push(eventCredit)
            txFinal.events.push(eventDebit)
            //txFinal.events.push(eventFee)

        }

        return txFinal;
    } catch (e) {
        throw tag + e
    }
}



/*

 */

const audit_transaction = function(txInfo:any,source:any){
    let tag = TAG + " | audit_transaction | ";
    try {
        let tx:any = {};


        let txFinal:any = {}

        if(!source || source !== 'etherscan'){
            //if token
            if(txInfo.token){
                //tx.value = txInfo.receipt.value
                tx.from =  txInfo.receipt.from

                //decode erc20 transfer info
                //TODO for each log?

                //transfer
                let topic = txInfo.receipt.logs[0].topics[0]
                if(topic !== "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") throw Error(' Not erc20 token! ')
                tx.value = txInfo.receipt.logs[0].data
                tx.to = txInfo.receipt.logs[0].topics[2]
                log.debug(tag,"tx.to: ",tx.to)

                //if ERC20


                //Remove padding?
                tx.to = tx.to.replace("0000000000000000000000000",0)


            }
        } else {
            if(txInfo.tokenSymbol){
                txInfo.asset = txInfo.tokenSymbol
            }
            if(!txInfo.asset) txInfo.asset = 'ETH'

            //indexs for search
            txFinal.asset = txInfo.asset
            txFinal.txid = txInfo.hash
            if(!txFinal.txid) throw Error("Invalid tx! missing txid! ")
            txFinal.addresses = []
            txFinal.events = []
            txFinal.type = "transfer"
            txFinal.time = txInfo.timeStamp
            txFinal.height = parseInt(txInfo.blockNumber)

            txFinal.addresses.push(txInfo.to)
            txFinal.addresses.push(txInfo.from)

            let amount
            if(txInfo.asset === 'ETH'){
                amount = txInfo.value / BASE
            } else {
                amount = txInfo.value / Math.pow(10,parseInt(txInfo.tokenDecimal))
            }


            //2 events, send receive
            let eventCredit = {
                type:"credit",
                address:txInfo.to,
                amount:amount,
                asset:txInfo.asset,
            }
            let eventDebit = {
                type:"debit",
                address:txInfo.from,
                amount:amount * -1,
                asset:txInfo.asset,
            }

            //TODO get eth amount from gasUsed and gasPrice
            // let eventFee = {
            //     type:"debit",
            //     asset:"ETH", //Fees paid in ETH
            //     fee:true,
            //     address:tokenTxInfo.transaction.from,
            //     //amount:tx.gas_wanted / 1000, // NOTE mintscan shows fees as wanted. default fee currently 2x gas used
            //     txid
            // }

            txFinal.events.push(eventCredit)
            txFinal.events.push(eventDebit)


        }




        return txFinal;
    } catch (e) {
        throw tag + e
    }
}

/*

 { block: '10027762',
  hash:
   '0xa6d85beba4bbb3c0d1e6e8250371807bba48826271052f64e4b61ca84d570ff0',
  trace:
   { action:
      { callType: 'call',
        from: '0x33b35c665496ba8e71b22373843376740401f106',
        gas: '0x0',
        input: '0x',
        to: '0x079f8bb0102759fb2f6247382be7e40f77899e6b',
        value: '0x2386f26fc10000' },
     blockHash:
      '0xa6d85beba4bbb3c0d1e6e8250371807bba48826271052f64e4b61ca84d570ff0',
     blockNumber: 10027762,
     result: { gasUsed: '0x0', output: '0x' },
     subtraces: 0,
     traceAddress: [],
     transactionHash:
      '0x8ce7593d82220399f4632c2496bbad784aa80699b30c99b179898b6fe93443c7',
     transactionPosition: 9,
     type: 'call' } }


 */

const audit_trace_receipt = async function(trace:any){
    let tag = TAG + " | audit_trace_receipt | ";
    try {

        // let tx = {};
        // let sub_item = trace.action
        // tx.address = sub_item.to;
        // tx.amount = parseInt(sub_item.value, 16) / BASE;
        // tx.confirmations = 1;
        // tx.txid = trace.transactionHash;
        // tx.source = sub_item.from;
        // tx.fee = 0.001;
        // tx.isOur = true;
        // tx.category = "receive";
        // tx.time = parseInt(new Date().getTime());
        // tx.receiveTime = parseInt(new Date().getTime());

        let txFinal:any = {}
        //indexs for search
        txFinal.asset = "ETH"
        txFinal.addresses = []
        txFinal.events = []
        txFinal.type = "transfer"
        txFinal.height = parseInt(trace.block)
        txFinal.txid = trace.trace.transactionHash
        if(!txFinal.txid) throw Error("102: invalid tx trace! need txid")
        txFinal.addresses.push(trace.trace.action.to)
        txFinal.addresses.push(trace.trace.action.from)

        let amount = parseInt(trace.trace.action.value, 16) / BASE
        //2 events, send receive
        let eventCredit = {
            type:"credit",
            address:trace.trace.action.to,
            amount:amount,
            txid:trace.trace.transactionHash
        }
        let eventDebit = {
            type:"debit",
            address:trace.trace.action.from,
            amount:amount * -1,
            txid:trace.trace.transactionHash
        }

        // let eventFee = {
        //     type:"debit",
        //     asset:"ETH", //Fees paid in ETH
        //     fee:true,
        //     address:tokenTxInfo.transaction.from,
        //     //amount:tx.gas_wanted / 1000, // NOTE mintscan shows fees as wanted. default fee currently 2x gas used
        //     txid
        // }

        txFinal.events.push(eventCredit)
        txFinal.events.push(eventDebit)
        //txFinal.events.push(eventFee)


        return txFinal;

    } catch (e) {
        throw tag + e
    }
}
