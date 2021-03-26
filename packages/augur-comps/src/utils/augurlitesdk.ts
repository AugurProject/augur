import { AugurLite, NetworkId } from '@augurproject/sdk-lite';
import { ethers } from 'ethers';
import { getProviderOrSigner } from '../components/ConnectAccount/utils';
import { createBigNumber } from './create-big-number';
import { Web3Provider } from '@ethersproject/providers';

export class SDKLite {
  client: AugurLite | null = null;

  // Async to remain consistent with the sdk 'makeClient' method.
  async makeLiteClient(
    provider: ethers.providers.Provider,
    config: any,
    account?: string,
    ): Promise<AugurLite> {
    const networkId = config.networkId;

    let providerOrSigner = provider;
    if (account) {
      providerOrSigner = getProviderOrSigner(provider as Web3Provider, account) as ethers.providers.Provider;
    }
    // not sure why precsion is needed to create augur lite client
    this.client = new AugurLite(providerOrSigner, config, networkId as NetworkId, createBigNumber(18));

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
    console.error('API must be initialized before use.');
    return null;
  }

  ready(): boolean {
    return Boolean(this.client);
  }
}

export const augurSdkLite = new SDKLite();
window['augurSdkLite'] = augurSdkLite;
