import { EventsConfig } from "@pioneer-platform/pioneer-types";
export declare class Events {
    private wss;
    private username;
    private queryKey;
    private socket;
    private events;
    private isConnected;
    private isTestnet;
    private isPaired;
    private init;
    private emitter;
    private setUsername;
    private pair;
    private disconnect;
    private subscribeToKey;
    private subscribeToInvocation;
    private send;
    constructor(config: EventsConfig);
}
