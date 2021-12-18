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
    private events: any
    private isConnected: boolean
    private isTestnet: boolean
    private isPaired: boolean
    private init: () => Promise<boolean>;
    private audit: (date: any) => Promise<boolean>;
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
                //get last audit checkpoint



                return true
            } catch (e) {
                log.error(tag, e)
                throw e
            }
        }
        this.audit = async function (date:any) {
            let tag = TAG + " | audit_pubkeys | "
            try {
                //
                //get last audit checkpoint

                //if none

                //get oldest tx
                //must be a credit!

                //create first checkpoint


                //get page

                //audit events
                return true
            } catch (e) {
                log.error(tag, e)
                throw e
            }
        }
    }
}
