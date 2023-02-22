/*
    ShapeShift Exchange class

    Goals:
        Unify the multi-chain DEX and bridge tools into a uniform multi-chain swapping class



    High level
       * List available exchanges

    getAvailable routes

    getAvailable rates

    predict incurred fee's

    calcuate multiple hops

    find best route

    predict/observe/report/record fee's

 */



const TAG = " | shapeshift | "
const log = require("log")
import { SwapperManager, ZrxSwapper, ThorchainSwapper } from '@shapeshiftoss/swapper'
import { ChainAdapterManager } from '@shapeshiftoss/chain-adapters'
import { SwapperType, Asset } from '@shapeshiftoss/types'
import Web3 from 'web3'


export type TradeAsset = {
    currency: Asset
    amount?: string
    fiatRate?: string
}

export type MinMax = {
    minimum: string
    maximum: string
    minimumPrice?: string
    name?: string
}

module.exports = class shapeshift {
    private PROTOCOL_SUPPORT:any = [
        'osmosis',
        'thorchain',
        '0x'
    ]
    private ALL_ROUTES:any = []
    private manager:any
    private swappers:any
    private init: (config: any, HDwallet: any) => Promise<{ availableRoutes: any }>;
    private getAvailableRoutes: (asset: string) => Promise<{ availableRoutes: any }>;
    private getMinMax: (buyAsset: any, sellAsset: any) => Promise<any>;
    private canTradePair: (buyAsset: any, sellAsset: any) => Promise<any>;
    private buildQuoteTx: (input: any) => Promise<any>;
    private HDwallet:any
    constructor() {
        this.init = async function (HDwallet:any) {
            let tag = TAG + " | init | "
            try{

                let isInitialized = await HDwallet.isInitialized()
                if(!isInitialized) throw Error("Failed to start shapeshift! HDwallet not inited ")

                const zrxSwapperDeps = {
                    web3: <Web3>{},
                    adapterManager: <ChainAdapterManager>{}
                }

                //build manager
                this.manager = new SwapperManager()
                this.manager.addSwapper(SwapperType.Zrx, new ZrxSwapper(zrxSwapperDeps))

                //load fee data
                this.ALL_ROUTES.push({
                    assets:'ATOM_OSMO',
                    exchange:'osmosis',
                    isIBC:true
                })
                return {
                    availableRoutes:this.ALL_ROUTES
                }
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
        this.getAvailableRoutes = async function (asset:string) {
            let tag = TAG + " | getAvailableRoutes | "
            try{
                return {
                    availableRoutes:this.ALL_ROUTES
                }
            }catch(e){
                log.error(tag,e)
                throw e
            }
        },
        this.getMinMax = async function (buyAsset:any,sellAsset:any) {
            let tag = TAG + " | getAvailableRoutes | "
            try{
                log.info(tag,"buyAsset: ",buyAsset)
                //verify routes
                // @ts-ignore
                let swapper = this.manager.getSwapper('0x')
                let resp = await swapper.getMinMax({
                    sellAsset: sellAsset,
                    buyAsset: buyAsset
                })
                log.info(tag,"resp: ",resp)

                return resp
            }catch(e){
                log.error(tag,e)
                throw e
            }
        },
        this.canTradePair = async function (buyAsset:any,sellAsset:any) {
            let tag = TAG + " | canTradePair | "
            try{
                log.info(tag,"buyAsset: ",buyAsset)
                //verify routes
                // @ts-ignore
                let swapper = this.manager.getSwapper('0x')
                let resp = await swapper.canTradePair({
                    sellAsset,
                    buyAsset
                })
                log.info(tag,"resp: ",resp)

                return resp
            }catch(e){
                log.error(tag,e)
                throw e
            }
        },
        this.buildQuoteTx = async function (input:any) {
            let tag = TAG + " | buildQuoteTx | "
            try{
                log.info(tag,"input: ",input)
                //verify routes
                // @ts-ignore
                let swapper = this.manager.getSwapper('0x')
                let resp = await swapper.buildQuoteTx({input,wallet:this.HDwallet})
                log.info(tag,"resp: ",resp)

                return resp
            }catch(e){
                log.error(tag,e)
                throw e
            }
        }
    }
}
