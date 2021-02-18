declare const TAG = " | ws-client | ";
declare const log: any;
declare const EventEmitter: any;
declare const emitter: any;
declare const io: any;
declare let URL_PIONEER_WS: string | undefined;
declare let SOCKET: any;
declare let disconnect: () => Promise<void>;
declare let init_client: (config: any) => Promise<any>;
