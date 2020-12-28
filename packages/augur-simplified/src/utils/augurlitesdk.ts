import { AugurLite } from '@augurproject/sdk-lite';
import { NetworkId } from '@augurproject/utils';
import { ethers } from 'ethers';
import { createBigNumber } from '../utils/create-big-number';

export class SDKLite {
  client: AugurLite | null = null;

  // Async to remain consistent with the sdk 'makeClient' method.
  async makeLiteClient(
    provider: ethers.providers.JsonRpcProvider,
    config: any,
    ): Promise<AugurLite> {
    const networkId = config.networkId;
    // not sure why precsion is needed to create augur lite client
    this.client = new AugurLite(provider, config, networkId as NetworkId, createBigNumber(18));
    return this.client;
  }

  destroy(): void {
    if (this.client) {
      this.client = null;
    }
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
