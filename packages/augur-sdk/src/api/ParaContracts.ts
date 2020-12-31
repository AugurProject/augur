import { ContractAddresses } from '@augurproject/utils';
import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';
import { ContractInterfaces } from '@augurproject/core';
import {
  AugurInterface,
  BaseContracts,
  UniverseInterface,
  ZeroXInterface,
} from './BaseContracts';

export class ParaContracts extends BaseContracts {
  augur: ContractInterfaces.ParaAugur;
  augurTrading: ContractInterfaces.AugurTrading;
  universe: ContractInterfaces.ParaUniverse;
  zeroXTrade: ContractInterfaces.ParaZeroXTrade;

  constructor(
    addresses: ContractAddresses,
    dependencies: ContractDependenciesEthers
  ) {
    super(addresses, dependencies);

    this.universe = new ContractInterfaces.ParaUniverse(
      dependencies,
      addresses.Universe
    );
  }

  getAugur(): AugurInterface {
    return this.augur;
  }

  async getOriginUniverse(): Promise<ContractInterfaces.Universe> {
    const originUniverse = await this.universe.originUniverse_();
    return this.universeFromAddress(originUniverse);
  }

  async getOriginUniverseAddress(): Promise<string> {
    return this.universe.originUniverse_();
  }

  getUniverse(): UniverseInterface {
    return this.universe;
  }

  getZeroXTrade(): ZeroXInterface {
    return this.zeroXTrade;
  }

  async getOriginCash(): Promise<ContractInterfaces.Cash> {
    const cashAddress = await this.universe.cash_();
    return new ContractInterfaces.Cash(this.dependencies, cashAddress);
  }
}
