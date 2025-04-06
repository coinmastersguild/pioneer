import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { UniswapNftAirdropClaim, UniswapNftAirdropClaimInterface } from "../UniswapNftAirdropClaim";
export declare class UniswapNftAirdropClaim__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        name?: undefined;
        anonymous?: undefined;
        outputs?: undefined;
    } | {
        inputs: any[];
        name: string;
        type: string;
        stateMutability?: undefined;
        anonymous?: undefined;
        outputs?: undefined;
    } | {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
        stateMutability?: undefined;
        outputs?: undefined;
    } | {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): UniswapNftAirdropClaimInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): UniswapNftAirdropClaim;
}
