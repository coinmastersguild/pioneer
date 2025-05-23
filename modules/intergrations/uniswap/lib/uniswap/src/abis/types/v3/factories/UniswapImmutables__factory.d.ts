import { Provider, TransactionRequest } from "@ethersproject/providers";
import { BytesLike, ContractFactory, Overrides, Signer } from "ethers";
import type { UniswapImmutables, UniswapImmutablesInterface } from "../UniswapImmutables";
export declare class UniswapImmutables__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(params: {
        v2Factory: string;
        v3Factory: string;
        pairInitCodeHash: BytesLike;
        poolInitCodeHash: BytesLike;
    }, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<UniswapImmutables>;
    getDeployTransaction(params: {
        v2Factory: string;
        v3Factory: string;
        pairInitCodeHash: BytesLike;
        poolInitCodeHash: BytesLike;
    }, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): UniswapImmutables;
    connect(signer: Signer): UniswapImmutables__factory;
    static readonly bytecode = "0x610100346100e757601f61011238819003918201601f19168301926001600160401b03929091838511838610176100d15781608092849260409788528339810103126100e75782519160808301908111838210176100d1578352610062816100ec565b90818352610072602082016100ec565b6020840190815284820151858501908152606092830151929094019182526001600160a01b03928316608052925160a05291511660c0525160e0525160119081610101823960805181505060a05181505060c05181505060e051815050f35b634e487b7160e01b600052604160045260246000fd5b600080fd5b51906001600160a01b03821682036100e75756fe600080fdfea164736f6c6343000811000a";
    static readonly abi: {
        inputs: {
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
    }[];
    static createInterface(): UniswapImmutablesInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): UniswapImmutables;
}
