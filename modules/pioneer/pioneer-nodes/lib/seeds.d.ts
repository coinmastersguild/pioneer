export declare let TIER_ONE_SEED: {
    COSMOS: {
        GAIAD: string;
    };
};
export declare let CURRENT_CONTEXT_NODE_MAP: {
    COSMOS: {
        GAIAD: string;
    };
};
export declare const blockbooks: ({
    symbol: string;
    blockchain: string;
    caip: string;
    networkId: string;
    type: string;
    service: string;
    websocket: string;
} | {
    symbol: string;
    blockchain: string;
    caip: string;
    type: string;
    service: string;
    websocket: string;
    networkId?: undefined;
} | {
    symbol: string;
    blockchain: string;
    caip: string;
    type: string;
    service: string;
    networkId?: undefined;
    websocket?: undefined;
})[];
export declare const shapeshift: ({
    key: string;
    value: string;
    swagger: string;
    network: string;
    protocol: string;
    type: string;
    nodeType?: undefined;
} | {
    key: string;
    value: string;
    network: string;
    protocol: string;
    type: string;
    swagger?: undefined;
    nodeType?: undefined;
} | {
    key: string;
    value: string;
    network: string;
    nodeType: string;
    type: string;
    swagger?: undefined;
    protocol?: undefined;
})[];
