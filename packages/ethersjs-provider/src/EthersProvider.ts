import { NetworkId } from 'augur-artifacts';
import { Provider } from 'augur-api';
import { Transaction } from 'contract-dependencies';
import { EthersProvider as EProvider} from 'contract-dependencies-ethers';
import { ethers } from 'ethers'

export class EthersProvider extends ethers.providers.JsonRpcProvider implements Provider, EProvider {
    public async call(transaction: Transaction<ethers.utils.BigNumber>): Promise<string> {
        return await super.call(transaction);
    }

    public async getNetworkId(): Promise<NetworkId> {
        return <NetworkId>(await this.getNetwork()).chainId.toString();
    }
}
