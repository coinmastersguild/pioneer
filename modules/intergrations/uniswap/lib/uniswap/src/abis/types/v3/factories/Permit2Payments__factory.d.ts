import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { Permit2Payments, Permit2PaymentsInterface } from "../Permit2Payments";
export declare class Permit2Payments__factory {
    static readonly abi: {
        inputs: any[];
        name: string;
        type: string;
    }[];
    static createInterface(): Permit2PaymentsInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Permit2Payments;
}
