import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { Payments, PaymentsInterface } from "../Payments";
export declare class Payments__factory {
    static readonly abi: {
        inputs: any[];
        name: string;
        type: string;
    }[];
    static createInterface(): PaymentsInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): Payments;
}
