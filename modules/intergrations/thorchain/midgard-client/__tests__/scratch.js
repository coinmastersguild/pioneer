


let parseThorchainAssetString = function(input){
    try{
        let parts = input.split(".")
        let network = parts[0]
        let asset
        let symbol
        let contract
        if(parts[1].indexOf("-") >= 0){
            //is Token
            let parts2 = parts[1].split("-")
            contract = parts2[1]
            asset = parts2[0]
            symbol = parts2[0]
        }else{
            //is Native asset
            asset = parts[0]
            symbol = parts[0]
        }


        return output = {
            asset,
            symbol,
            network,
            contract
        }
    }catch(e){

    }
}

// let input = "ETH.DODO-0X43DFC4159D86F3A37A5A4B3D4580B888AD7D4DDD"
let input = "BTC.BTC"

console.log(parseThorchainAssetString(input))
