const TAG = " | foxitar | "

let Web3 = require('web3');
const axios = require('axios');
const https = require('https');

import {ERC721_ABI,FOXITAR_CONTRACT_ABI} from "./constants";

const FOX_CONTRACT_ABI = ""; // provide the ABI here
const FOXITAR_CONTRACT_ADDRESS = "0x2e727C425a11Ce6b8819B3004dB332C12D2aF2a2"; // provide the contract address here
const NETWORK_PROVIDER = "https://polygon.llamarpc.com";

const web3 = new Web3(new Web3.providers.HttpProvider(NETWORK_PROVIDER));

module.exports = {
    getContractInfo: async function () {
        return await getContractInfo();
    },
    getOwners: async function (skip: number, limit: number) {
        return await get_all_owners(skip, limit)
    },
    getTokenInfo: async function (id: number) {
        return await get_token_by_id(id);
    },
}

async function getContractInfo() {
    const nftContract = new web3.eth.Contract(FOX_CONTRACT_ABI, FOXITAR_CONTRACT_ADDRESS);
    const totalSupply = await nftContract.methods.totalSupply().call();

    return { totalSupply };
}

const get_all_owners = async function(skip: number, limit: number) {
    let tag = TAG + " | get_all_owners | ";
    try {
        let output: any = {};

        const nftContract = new web3.eth.Contract(ERC721_ABI, FOXITAR_CONTRACT_ADDRESS);

        // Fetch the total supply of the NFTs
        output['owners'] = [];

        let i = 1;
        let owner = '';
        let count = 0;
        while (count < limit) {
            try {
                owner = await nftContract.methods.ownerOf(i).call();
                if (i > skip) {
                    output['owners'].push(owner.toLowerCase());
                    count++;
                }
                //console.log(i + " address: ", owner.toLowerCase());
                i++;
            } catch (error) {
                // No owner found for the current index i
                output['totalSupply'] = i;
                break;
            }
        }

        return output;
    } catch(e) {
        console.error(tag, e);
    }
}


async function get_token_by_id(tokenId: number) {
    try{
        const nftContract = new web3.eth.Contract(FOXITAR_CONTRACT_ABI, FOXITAR_CONTRACT_ADDRESS);
        const tokenURI = await nftContract.methods.tokenURI(tokenId).call();

        //
        let result = await axios.get(tokenURI)

        return result.data;
    }catch(e){
        console.error(e)
    }
}
