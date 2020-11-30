import { AugurLite } from '@augurproject/sdk-lite';
import { Config, ContractAddresses, NetworkId } from '@augurproject/utils';
import { ethers } from 'ethers';


export class SDKLite {
  client: AugurLite | null = null;

  // Async to remain consistent with the sdk 'makeClient' method.
  async makeLiteClient(
    provider: ethers.providers.JsonRpcProvider,
    config: Config,
    networkId: NetworkId,
    ): Promise<AugurLite> {

    this.client = new AugurLite(provider, config, networkId);
    return this.client;
  }


  get(): AugurLite {
    if (this.client) {
      return this.client;
    }
    throw new Error('API must be initialized before use.');
  }

  ready(): boolean {
    return Boolean(this.client);
  }
}

export const augurSdkLite = new SDKLite();
window['augurSdkLite'] = augurSdkLite;
