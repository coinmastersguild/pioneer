import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { IImmutableState, IImmutableStateInterface } from "../IImmutableState";
export declare class IImmutableState__factory {
    static readonly abi: {
        inputs: any[];
        name: string;
        outputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): IImmutableStateInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IImmutableState;
}
