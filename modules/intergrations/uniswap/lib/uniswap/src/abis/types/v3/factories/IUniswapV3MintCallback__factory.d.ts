import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { IUniswapV3MintCallback, IUniswapV3MintCallbackInterface } from "../IUniswapV3MintCallback";
export declare class IUniswapV3MintCallback__factory {
    static readonly abi: {
        inputs: {
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        outputs: any[];
        stateMutability: string;
        type: string;
    }[];
    static createInterface(): IUniswapV3MintCallbackInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IUniswapV3MintCallback;
}
