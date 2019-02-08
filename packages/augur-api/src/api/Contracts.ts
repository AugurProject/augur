import { Augur, Dependencies, Universe } from 'augur-core';
import { ContractAddresses } from 'augur-artifacts';

export class Contracts<TBigNumber> {
  public augur: Augur<TBigNumber>;
  public universe: Universe<TBigNumber>;

  public constructor (addresses: ContractAddresses, dependencies: Dependencies<TBigNumber>) {
    this.augur = new Augur<TBigNumber>(dependencies, addresses.Augur);
    this.universe = new Universe<TBigNumber>(dependencies, addresses.Universe);
  }
}
