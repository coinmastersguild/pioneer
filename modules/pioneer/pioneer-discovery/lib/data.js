"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.relatedAssets = exports.assetData = void 0;
/*
    Asset Tools
    
            -highlander

 */
var TAG = ' | pioneer-discovery | ';
var log = require('@pioneer-platform/loggerdog')();
// let router = require("@pioneer-platform/pioneer-router")
// router.init()
//dataByCaip
var generatedAssetData_json_1 = __importDefault(require("./generatedAssetData.json"));
exports.assetData = generatedAssetData_json_1.default;
var relatedAssetIndex_json_1 = __importDefault(require("./relatedAssetIndex.json"));
exports.relatedAssets = relatedAssetIndex_json_1.default;
var MEMOLESS_INTERGRATIONS = ['changelly', 'chainflip'];
//get assets
// export const getAssets = () => {
//     const tag = `${TAG} | getAssets | `;
//     try{
//         let tokenMap = new Map();
//         let chains = new Set();
//         let chainTokenCounts = {};
//         let allAssets:any = [];
//         // Function to add tokens with their source list
//         const addTokens = (tokens:any, sourceList:any) => {
//             tokens.forEach((token:any) => {
//                 chains.add(token.chain);
//                 // @ts-ignore
//                 chainTokenCounts[token.chain] = (chainTokenCounts[token.chain] || 0) + 1;
//                 // console.log('*** token: ', token);
//                 let expandedInfo = tokenToCaip(token);
//                 if (expandedInfo.caip) {
//                     expandedInfo.sourceList = sourceList;
//                     let assetInfoKey = expandedInfo.caip.toLowerCase();
//    
//                     let assetInfo =
//                         // @ts-ignore
//                         assetData[expandedInfo.caip] || assetData[expandedInfo.caip.toLowerCase()];
//                     if (assetInfo) {
//                         let combinedInfo = { ...expandedInfo, ...assetInfo, integrations: [] }; // Prepare integration array
//                         tokenMap.set(assetInfoKey, combinedInfo);
//                         allAssets.push(combinedInfo);
//                     } else {
//                         //TODO deal witht this at some point, generate caips on a the fly?
//                         // console.error('Missing assetData(PIONEER DATA) for: ', token);
//                     }
//                 } else {
//                     console.error('***  expandedInfo: ', expandedInfo);
//                     console.error('***  Failed to expand token: ', token);
//                 }
//             });
//         };
//    
//         // Add tokens from various lists with their source
//         let primaryAssets = [NativeList, MayaList, PioneerList];
//         let tokenAssets = [
//             StargateARBList,
//             SushiswapList,
//             ThorchainList,
//             TraderjoeList,
//             UniswapList,
//             WoofiList,
//             CoinGeckoList,
//             OneInchList,
//             PancakeswapETHList,
//             PancakeswapList,
//             PangolinList,
//         ];
//         let tokenLists: any[] = [];
//         tokenLists = [...tokenAssets, ...tokenLists];
//         tokenLists.forEach((list: any) => addTokens(list.tokens, list.name));
//    
//         // Get integration support by asset and enrich the token map with this data
//    
//         let integrationSupport = router.assetSupport()
//         integrationSupport = integrationSupport.data || {};
//         //console.log('integrationSupport: ', integrationSupport);
//    
//         // Enrich tokenMap directly with integration support
//         Object.keys(integrationSupport).forEach((key) => {
//             integrationSupport[key].forEach((id:any) => {
//                 if (id) {
//                     let asset = tokenMap.get(id.toLowerCase());
//                     if (asset) {
//                         if (MEMOLESS_INTERGRATIONS.indexOf(key) > -1) asset.memoless = true;
//                         asset.integrations.push(key);
//                     }
//                 }
//             });
//         });
//
//         return { tokenMap, allAssets };
//     }catch(e){
//         log.error("getAssets | e: ",e)
//         throw e
//     }
// }
