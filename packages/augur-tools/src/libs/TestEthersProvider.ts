import { ContractAddresses } from '@augurproject/artifacts';
import { MemDown } from 'memdown';
import { EthersProvider } from '@augurproject/ethersjs-provider';
import { ethers } from 'ethers';
import { createSeed } from './ganache';
import { makeProvider } from './LocalAugur';
import { Account } from '../constants';

export class TestEthersProvider extends EthersProvider {
  constructor(provider: ethers.providers.JsonRpcProvider, private db:MemDown, private accounts:Account[], private contractAddresses:ContractAddresses) {
    super(provider, 5, 0, 40);
  }

  getSeed = async () => {
    return createSeed(this, this.db, this.contractAddresses);
  };

  fork = async ():Promise<TestEthersProvider> => {
    const seed = await this.getSeed();
    return makeProvider(seed, this.accounts);
  };

  getContractAddresses() {
    return this.contractAddresses;
  }
}
