import { GenericAugurInterfaces } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";

export class Contracts<TBigNumber> {
  public augur: GenericAugurInterfaces.Augur<TBigNumber>;
  public universe: GenericAugurInterfaces.Universe<TBigNumber>;

  public constructor (addresses: ContractAddresses, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>) {
    this.augur = new GenericAugurInterfaces.Augur<TBigNumber>(dependencies, addresses.Augur);
    this.universe = new GenericAugurInterfaces.Universe<TBigNumber>(dependencies, addresses.Universe);
  }
}
