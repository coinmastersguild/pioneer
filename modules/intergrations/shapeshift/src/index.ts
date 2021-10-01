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
const log = require("@pioneer-platform/loggerdog")()

module.exports = class shapeshift {
    private EXCHANGE_SUPPORT:any = [
        'osmosis',
        'thorchain',
        '0x'
    ]
    private ALL_ROUTES:any = []
    private init: (config: any) => Promise<{ availableRoutes: { assets: string; exchange: string; isIBC: boolean }[] }>;
    private getAvailableRoutes: (asset: string) => Promise<{ availableRoutes: any }>;
    constructor() {
        this.init = async function (config:any) {
            let tag = TAG + " | init | "
            try{
                //for each exchange, verify online

                //verify routes

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
        }
    }
}
