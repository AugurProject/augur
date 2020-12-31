import { ContractAddresses, SDKConfiguration, RecursivePartial, ParaDeploys, SideChain } from '@augurproject/utils';
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
    private contractAddresses: ContractAddresses,
    private uploadBlockNumber: number,
    private paraDeploys?: ParaDeploys,
    private sideChain?: SideChain,
  ) {
    super(provider, 5, 0, 40);
  }

  getSeed = async () => {
    return createSeed(this, this.db, this.contractAddresses, this.uploadBlockNumber);
  };

  fork = async (): Promise<TestEthersProvider> => {
    const seed = await this.getSeed();
    return makeProvider(seed, this.accounts);
  };

  getConfig(overwrites?: RecursivePartial<SDKConfiguration>): SDKConfiguration {
    let config: RecursivePartial<SDKConfiguration> = {
      addresses: this.contractAddresses,
      uploadBlockNumber: this.uploadBlockNumber,
    };
    if (this.paraDeploys) config.paraDeploys = this.paraDeploys;
    if (this.sideChain) config.sideChain = this.sideChain;
    if (overwrites) config = { ...config, ...overwrites };

    return buildConfig('test', config);
  }
}
