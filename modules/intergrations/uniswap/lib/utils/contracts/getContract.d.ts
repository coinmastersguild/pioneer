import { Contract, ContractInterface } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
export declare function getContract(address: string, ABI: ContractInterface, provider: JsonRpcProvider, account?: string): Contract;
