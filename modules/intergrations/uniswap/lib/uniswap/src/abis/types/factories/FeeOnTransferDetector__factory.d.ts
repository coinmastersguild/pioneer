import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { FeeOnTransferDetector, FeeOnTransferDetectorInterface } from "../FeeOnTransferDetector";
export declare class FeeOnTransferDetector__factory {
    static readonly abi: ({
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        name?: undefined;
        outputs?: undefined;
    } | {
        inputs: any[];
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
            components: {
                internalType: string;
                name: string;
                type: string;
            }[];
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    })[];
    static createInterface(): FeeOnTransferDetectorInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): FeeOnTransferDetector;
}
