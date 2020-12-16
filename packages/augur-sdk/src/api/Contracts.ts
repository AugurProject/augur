import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';
import { ContractInterfaces } from '@augurproject/core';
import { ContractAddresses } from '@augurproject/utils';
import {
  AugurInterface,
  BaseContracts,
  UniverseInterface,
  ZeroXInterface,
} from './BaseContracts';

export type SomeRepToken =
  | ContractInterfaces.ReputationToken
  | ContractInterfaces.TestNetReputationToken;
export type SomeTime =
  | ContractInterfaces.Time
  | ContractInterfaces.TimeControlled;
const RELAY_HUB_ADDRESS = '0xD216153c06E857cD7f72665E0aF1d7D82172F494';

export class Contracts extends BaseContracts {
  augur: ContractInterfaces.Augur;
  augurTrading: ContractInterfaces.AugurTrading;
  universe: ContractInterfaces.Universe;
  zeroXTrade: ContractInterfaces.ZeroXTrade;

  reputationToken: SomeRepToken | null = null;

  constructor(
    addresses: ContractAddresses,
    dependencies: ContractDependenciesEthers
  ) {
    super(addresses, dependencies);
    this.augur = new ContractInterfaces.Augur(dependencies, addresses.Augur);
    this.augurTrading = new ContractInterfaces.AugurTrading(
      dependencies,
      addresses.AugurTrading
    );

    this.universe = new ContractInterfaces.Universe(
      dependencies,
      addresses.Universe
    );

    this.zeroXTrade = new ContractInterfaces.ZeroXTrade(
      dependencies,
      addresses.ZeroXTrade
    )
  }

  async setReputationToken(networkId: string) {
    const address = await this.universe.getReputationToken_();
    this.reputationToken = this.reputationTokenFromAddress(address, networkId);
  }

  getAugur(): AugurInterface {
    return this.augur;
  }

  async getOriginCash(): Promise<ContractInterfaces.Cash> {
    return this.cash;
  }

  async getOriginUniverse(): Promise<ContractInterfaces.Universe> {
    return this.universe;
  }

  async getOriginUniverseAddress(): Promise<string> {
    return this.universe.address;
  }

  getUniverse(): UniverseInterface {
    return this.universe;
  }

  getZeroXTrade(): ZeroXInterface {
    return this.zeroXTrade;
  }
}
