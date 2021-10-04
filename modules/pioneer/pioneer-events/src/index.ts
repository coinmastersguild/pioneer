const TAG = " | ws-client | ";
const log = require("@pioneer-platform/loggerdog")()
const EventEmitter = require('events');
const io = require('socket.io-client');
const wait = require('wait-promise');
const sleep = wait.sleep;

import {
    EventsConfig
} from "@pioneer-platform/pioneer-types";

export class Events {
    private wss: string;
    private username: string | undefined
    private queryKey: string | undefined
    private socket: any
    private events: any
    private isConnected: boolean
    private isTestnet: boolean
    private isPaired: boolean
    private init: () => Promise<boolean>;
    private emitter: any;
    private setUsername: (username:string) => Promise<void>;
    private pair: (username?: string) => Promise<boolean>;
    private disconnect: () => Promise<void>;
    private subscribeToKey: () => Promise<boolean>;
    private subscribeToInvocation: (invocationId: string) => Promise<boolean>;
    constructor(config:EventsConfig) {
        this.wss = config.wss
        this.isConnected = false
        this.isTestnet = false
        this.username = config.username
        this.queryKey = config.queryKey
        this.isPaired = false
        this.events = new EventEmitter();
        this.init = async function () {
            let tag = TAG + " | init_events | "
            try {
                this.socket = io.connect(this.wss, {
                    reconnect: true,
                    rejectUnauthorized: false
                });

                //sub
                this.socket.on('connect', () => {
                    log.debug(tag,'Connected to '+this.wss);
                    this.isConnected = true
                    //rejoin
                    if(this.username){
                        this.pair()
                    } else {
                        this.subscribeToKey()
                    }
                });

                this.socket.on('subscribedToUsername', (event:any) => {
                    log.debug(tag,'subscribed to '+event.username," id: "+event.socketId);
                    this.isPaired = true
                    this.username = event.username
                });

                this.socket.on('message', (message: any) => {
                    //TODO only emit expected messages?
                    //if(message.type === "payment_request"){}
                    this.events.emit('message',message)
                })

                this.socket.on('blocks', (message: any) => {
                    //TODO only emit expected messages?
                    //if(message.type === "payment_request"){}
                    this.events.emit('message',message)
                })

                //sub to errors
                this.socket.on('errorMessage', function (message:any) {
                    log.error(tag,"error: ",message)
                    if(message.code && message.code === 6) throw Error(" Failed to connect!")
                });

                this.socket.on('invocation', (message: any) => {
                    log.debug('invocation: ',message);
                    this.events.emit('message',message)
                });

                //dont release to connect
                while(!this.isConnected){
                    await sleep(300)
                }

                return true
            } catch (e) {
                log.error(tag, e)
                throw e
            }
        }
        this.setUsername = async function (username) {
            let tag = TAG + " | startSocket | "
            try {
                this.username = username
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
        this.subscribeToInvocation = async function (invocationId:string) {
            let tag = TAG + " | subscribeToInvocation | "
            try {

                //attempt join
                this.socket.emit('join',{
                    invocationId
                })

                return true
            } catch (e) {
                log.error(tag, "e: ", e)
                throw e
            }
        }
        this.subscribeToKey = async function () {
            let tag = TAG + " | subscribeToKey | "
            try {

                //attempt join
                this.socket.emit('join',{
                    queryKey:config.queryKey
                })

                return true
            } catch (e) {
                log.error(tag, "e: ", e)
                throw e
            }
        }
        this.pair = async function (username?:string) {
            let tag = TAG + " | startSocket | "
            try {
                if(username) this.username = username
                if(!this.username) throw Error("103: can not pair without username!")

                //attempt join
                this.socket.emit('join',{
                    username:this.username,
                    queryKey:config.queryKey
                })

                //TODO validate paired?
                return true
            } catch (e) {
                log.error(tag, "e: ", e)
                throw e
            }
        }
        this.disconnect = async function () {
            let tag = TAG + " | disconnect | "
            try {
                return this.socket.disconnect()
            } catch (e) {
                log.error(tag, "e: ", e)
            }
        }
    }
}
