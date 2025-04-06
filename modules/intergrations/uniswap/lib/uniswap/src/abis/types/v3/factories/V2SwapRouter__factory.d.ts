import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { V2SwapRouter, V2SwapRouterInterface } from "../V2SwapRouter";
export declare class V2SwapRouter__factory {
    static readonly abi: {
        inputs: any[];
        name: string;
        type: string;
    }[];
    static createInterface(): V2SwapRouterInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): V2SwapRouter;
}
