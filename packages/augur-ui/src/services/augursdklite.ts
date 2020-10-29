import { AugurLite } from '@augurproject/sdk-lite';
import { Addresses } from '@augurproject/sdk-lite/build/AugurLite';
import { NetworkId } from '@augurproject/utils';
import { JsonRpcProvider } from 'ethers/providers';

export class SDKLite {
  client: AugurLite | null = null;

  // Async to remain consistent with the sdk 'makeClient' method.
  async makeLiteClient(
    provider: JsonRpcProvider,
    addresses: Addresses,
    networkId: NetworkId,
    ): Promise<AugurLite> {

    this.client = new AugurLite(provider, addresses, networkId);
    return this.client;
  }


  get(): AugurLite {
    if (this.client) {
      return this.client;
    }
    throw new Error('API must be initialized before use.');
  }

  ready(): boolean {
    if (this.client) return true;
    return false;
  }
}

export const augurSdkLite = new SDKLite();
