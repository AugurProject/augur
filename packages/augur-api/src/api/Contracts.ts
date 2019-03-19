import { GenericAugurInterfaces } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";

export type SomeRepToken<TBigNumber> = GenericAugurInterfaces.ReputationToken<TBigNumber> | GenericAugurInterfaces.TestNetReputationToken<TBigNumber>;

export class Contracts<TBigNumber> {
  public augur: GenericAugurInterfaces.Augur<TBigNumber>;
  public universe: GenericAugurInterfaces.Universe<TBigNumber>;
  public cash: GenericAugurInterfaces.Cash<TBigNumber>;
  public reputationToken: SomeRepToken<TBigNumber> | null = null;
  private readonly dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>;

  public constructor (addresses: ContractAddresses, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>) {
    this.dependencies = dependencies;
    this.augur = new GenericAugurInterfaces.Augur<TBigNumber>(dependencies, addresses.Augur);
    this.universe = new GenericAugurInterfaces.Universe<TBigNumber>(dependencies, addresses.Universe);
    this.cash = new GenericAugurInterfaces.Cash<TBigNumber>(dependencies, addresses.Cash);
  }

  public async setReputationToken(testnet: boolean = false) {
    const Class = testnet ? GenericAugurInterfaces.TestNetReputationToken : GenericAugurInterfaces.ReputationToken;
    const address = await this.universe.getReputationToken_();
    this.reputationToken = new Class<TBigNumber>(this.dependencies, address);
  }
}
