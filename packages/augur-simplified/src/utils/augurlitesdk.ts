import { AugurLite } from '@augurproject/sdk-lite';
import { NetworkId } from '@augurproject/utils';
import { ethers } from 'ethers';
import { getProviderOrSigner } from '../modules/ConnectAccount/utils';
import { createBigNumber } from '../utils/create-big-number';
import { Web3Provider } from '@ethersproject/providers'

export class SDKLite {
  client: AugurLite | null = null;

  // Async to remain consistent with the sdk 'makeClient' method.
  async makeLiteClient(
    provider: ethers.providers.Provider,
    config: any,
    account?: string,
    ): Promise<AugurLite> {
    const networkId = config.networkId;
    // not sure why precsion is needed to create augur lite client
    let signer: any = provider;
    if (account) {
      console.log('call to get signer from create augur lite client')
      signer = getProviderOrSigner(provider as Web3Provider, account);
    }
    this.client = new AugurLite(signer as ethers.providers.Provider, config, networkId as NetworkId, createBigNumber(18));
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
