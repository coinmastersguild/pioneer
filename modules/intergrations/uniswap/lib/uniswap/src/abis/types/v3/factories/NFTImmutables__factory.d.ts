import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides, Signer } from "ethers";
import type { NFTImmutables, NFTImmutablesInterface } from "../NFTImmutables";
export declare class NFTImmutables__factory extends ContractFactory {
    constructor(...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>);
    deploy(params: {
        seaportV1_5: string;
        seaportV1_4: string;
        nftxZap: string;
        x2y2: string;
        foundation: string;
        sudoswap: string;
        elementMarket: string;
        nft20Zap: string;
        cryptopunks: string;
        looksRareV2: string;
        routerRewardsDistributor: string;
        looksRareRewardsDistributor: string;
        looksRareToken: string;
    }, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): Promise<NFTImmutables>;
    getDeployTransaction(params: {
        seaportV1_5: string;
        seaportV1_4: string;
        nftxZap: string;
        x2y2: string;
        foundation: string;
        sudoswap: string;
        elementMarket: string;
        nft20Zap: string;
        cryptopunks: string;
        looksRareV2: string;
        routerRewardsDistributor: string;
        looksRareRewardsDistributor: string;
        looksRareToken: string;
    }, overrides?: Overrides & {
        from?: string | Promise<string>;
    }): TransactionRequest;
    attach(address: string): NFTImmutables;
    connect(signer: Signer): NFTImmutables__factory;
    static readonly bytecode = "0x3461021657610200601f61024138819003918201601f19168301926001600160401b0392908385119085101761020057806101a09260409586526102003912610216578151906101a082019081118282101761020057825261006261020061021b565b8082529161007161022061021b565b60208301908152610085826102000161021b565b8383019081529361009761026061021b565b60608501908152936100aa61028061021b565b60808201908152906100bd6102a061021b565b60a08201526100cd6102c061021b565b60c082019081526100df6102e061021b565b9260e083019384526101009889916100fa836102000161021b565b948381019586526101209a8b93610114856102000161021b565b908584019182526101409861012c8a6102000161021b565b858b019081529c6101609b61014261036061021b565b988d8801998a526101809e8f61015b816102000161021b565b990198895260018060a01b039c8d9c8d809c81809c81809c81809c81809b16608052511660a052511660c052511660e052511690525116905251168a52511689525116885251166101a0525116946101c09586525116946101e0958652519560119788610230893960805188505060a05188505060c05188505060e05188505051875050518650505185505051845050518350506101a0518350505182505051815050f35b634e487b7160e01b600052604160045260246000fd5b600080fd5b51906001600160a01b03821682036102165756fe600080fdfea164736f6c6343000811000a";
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
    static createInterface(): NFTImmutablesInterface;
    static connect(address: string, signerOrProvider: Signer | Provider): NFTImmutables;
}
