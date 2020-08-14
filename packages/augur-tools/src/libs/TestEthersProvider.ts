import { ContractAddresses, SDKConfiguration, RecursivePartial } from '@augurproject/utils';
import { BigNumber } from 'ethers/utils';
import { MemDown } from 'memdown';
import { ethers } from 'ethers';
import { createSeed } from './ganache';
import { makeProvider } from './LocalAugur';
import { Account } from '../constants';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { buildConfig } from '@augurproject/artifacts';

export class TestEthersProvider extends EthersProvider {
  constructor(
    provider: ethers.providers.JsonRpcProvider,
    private db: MemDown,
    private accounts: Account[],
    private contractAddresses: ContractAddresses) {
    super(provider, 5, 0, 40);
  }

  getSeed = async () => {
    return createSeed(this, this.db, this.contractAddresses);
  };

  fork = async (): Promise<TestEthersProvider> => {
    const seed = await this.getSeed();
    return makeProvider(seed, this.accounts);
  };

  getConfig(overwrites?: RecursivePartial<SDKConfiguration>): SDKConfiguration {
    return buildConfig('test', {
      addresses: this.contractAddresses,
      ...overwrites || {}
    });
  }
}
