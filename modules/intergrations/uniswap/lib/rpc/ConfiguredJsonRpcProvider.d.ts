import { Networkish } from '@ethersproject/networks';
import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { SupportedInterfaceChain } from '../constants/chains';
export default class ConfiguredJsonRpcProvider extends StaticJsonRpcProvider {
    constructor(url: string | undefined, networkish: Networkish & {
        chainId: SupportedInterfaceChain;
    }, pollingInterval?: any);
}
