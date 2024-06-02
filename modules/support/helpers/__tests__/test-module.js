/*
        Test Module

 */


require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

let helpers = require("../lib")


let run_test = async function(){
    try{

        await helpers.AssetValue.loadStaticAssets();


        // let assetValue = helpers.AssetValue.fromIdentifierSync(
        //     'PRO-0xef743df8eda497bcf1977393c401a636518dd630',
        //     999422801215499116128328n,
        // );
        // console.log("assetValue: ",assetValue)
        // console.log("assetValue: ",assetValue.getValue('string'))

        //get save value
        let value = helpers.formatBigIntToSafeValue({
            value: 62128117093292225n,
            decimal: 18,
        })
        console.log("value: ",value)
        // console.log("value: ",typeof(value))

        let assetValue = helpers.AssetValue.fromChainOrSignature(
            'BASE',
            value,
        );
        console.log("assetValue: ",assetValue)
        console.log("assetValue: ",assetValue.getValue('string'))
        
        
        //formatBigIntToSafeValue
        // let value = helpers.formatBigIntToSafeValue({
        //     value: 62128117093292225n,
        //     decimal: 18,
        // })
        // console.log("value: ",value)
        
        
    }catch(e){
        console.error(e)
    }
}

run_test()
