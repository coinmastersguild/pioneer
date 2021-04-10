/*
    Pioneer Events

    Sub to username

    sub to rooms

    Go online

    Sub to Wallet

 */
const TAG = " | ws-client | ";
const log = require("@pioneer-platform/loggerdog")()
const EventEmitter = require('events');
const emitter = new EventEmitter();
const io = require('socket.io-client');

let wait = require('wait-promise');
let sleep = wait.sleep;

//globals
let URL_PIONEER_WS = process.env['URL_PIONEER_WS']
let SOCKET:any
module.exports = {
    init: function (config: any) {
        return init_client(config);
    },
    disconnect: function () {
        return disconnect();
    },
}

let disconnect = async function () {
    let tag = TAG+" | init_wallet | ";
    try {
        SOCKET.disconnect()
    } catch (e) {
        if(e.response && e.response.data){
            log.error(tag, "Error: ", e.response.data);
        }else{
            log.error(tag, "Error: ", e);
        }
        throw e;
    }
};

let init_client = async function (config:any) {
    let tag = TAG+" | init_wallet | ";
    try {
        if(config.pioneerWs){
            URL_PIONEER_WS = config.pioneerWs
        }
        if(!URL_PIONEER_WS) throw Error(" Failed to find ws server! ")
        if(!config.username) throw Error(" invalid config! missing username ")
        if(!config.queryKey) throw Error(" invalid config! missing queryKey ")

        //let successConnect
        let successConnect = false

        //sub to websocket as user
        SOCKET = io.connect(URL_PIONEER_WS, {reconnect: true, rejectUnauthorized: false});

        //connect
        SOCKET.on('connect', function () {
            log.debug(tag,'Connected!');
            SOCKET.emit('join',{username:config.username,queryKey:config.queryKey})
        });

        //sub to messages
        SOCKET.on('message', function (message:any) {
            log.info('message: ',message);
            emitter.emit('message',message)
            //if payment request
            if(message.type === "payment_request"){
                //if receiver is known

                //if receiver is unknown
                    //if global accept on

                //if autonomous
                //perform
                emitter.emit('message',message)

                //else add to approve queue
            } else {
                //emit everything
            }

            //TODO blocks

            //TODO payments

            //balances


        });

        SOCKET.on('connect', function (message:any) {
            log.info(tag,"connect:",message)
            successConnect = true
        });

        SOCKET.on('errorMessage', function (message:any) {
            log.error(tag,"error: ",message)
            if(message.code && message.code === 6) throw Error(" Failed to connect!")
        });


        SOCKET.on('invocation', function (message:any) {
            log.info('invocation: ',message);
            emitter.emit('message',message)
        });

        //wait 30 seconds for a valid connection
        //let timeout = setTimeout(process.exit(2),30 * 1000)

        while(!successConnect){
            await sleep(300)
        }


        return emitter
    } catch (e) {
        if(e.response && e.response.data){
            log.error(tag, "Error: ", e.response.data);
        }else{
            log.error(tag, "Error: ", e);
        }
        throw e;
    }
};
