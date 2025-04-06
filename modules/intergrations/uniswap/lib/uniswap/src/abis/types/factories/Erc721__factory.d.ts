import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { Erc721, Erc721Interface } from "../Erc721";
export declare class Erc721__factory {
    static readonly abi: ({
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
        payable?: undefined;
        anonymous?: undefined;
        constant?: undefined;
    } | {
        inputs: any[];
        payable: boolean;
        stateMutability: string;
        type: string;
        name?: undefined;
        outputs?: undefined;
        anonymous?: undefined;
        constant?: undefined;
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
        outputs?: undefined;
        stateMutability?: undefined;
        payable?: undefined;
        constant?: undefined;
    } | {
        constant: boolean;
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
        payable: boolean;
        stateMutability: string;
        type: string;
        anonymous?: undefined;
    })[];
    static createInterface(): Erc721Interface;
    static connect(address: string, signerOrProvider: Signer | Provider): Erc721;
}
