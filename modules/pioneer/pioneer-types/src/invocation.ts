

export interface Invocation {
    type?:string
    noBroadcast?:boolean
    invocationId?:string
    inboundAddress?:any
    address?:string,
    addressTo?:string,
    memo?:string
    fee:any
    asset:any
    blockchain?:string
    network:string
    coin?:string
    amount?:string
    context:string
    username:string

}

export interface InvocationBody {
    msg?: string;
    context: string;
    network:string;
    type:string
    username:string,
    invocation:Invocation
    invocationId?:string
    auth?:string
    service?:string
    servicePubkey?:string
    serviceHash?:string
    appName?:string
    mode?:'sync' | 'async'
}

export interface createAppBody {
    name:string
    image:string
    version:string
    description:string
}
