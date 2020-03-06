import { abi } from '@augurproject/artifacts';
import { Abi } from 'ethereum';
import { Provider } from '..';
import { Augur } from '../Augur';

export class GSN {
  constructor(
    private readonly provider: Provider,
    private readonly augur: Augur,
  ) {
    //this.provider.storeAbiData(abi.RelayHub as Abi, 'RelayHub');
    this.provider.storeAbiData(abi.AugurWalletRegistry as Abi, 'AugurWalletRegistry');
  }

  /**
   * @desc Calculates the wallet address for a user
   * @param {string} owner
   * @returns {Promise<string>}
   */
  async calculateWalletAddress(
    owner: string
  ): Promise<string> {
    return this.augur.contracts.augurWalletRegistry.getCreate2WalletAddress_(owner);
  }
}
