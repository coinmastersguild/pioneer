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

        //sub to websocket as user
        SOCKET = io.connect(URL_PIONEER_WS, {reconnect: true, rejectUnauthorized: false});
        //connect
        SOCKET.on('connect', function () {
            log.debug(tag,'Connected!');
            SOCKET.emit('join',{username:config.username,queryKey:config.queryKey})
        });

        //sub to messages
        SOCKET.on('message', function (message:any) {
            log.debug('message: ',message);
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
            }

            //TODO blocks

            //TODO payments

            //balances


        });


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
