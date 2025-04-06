import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import type { IRewardsCollector, IRewardsCollectorInterface } from "../IRewardsCollector";
export declare class IRewardsCollector__factory {
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
    static createInterface(): IRewardsCollectorInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): IRewardsCollector;
}
