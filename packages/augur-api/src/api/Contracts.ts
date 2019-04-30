import { GenericAugurInterfaces } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";

export type SomeRepToken<TBigNumber> = GenericAugurInterfaces.ReputationToken<TBigNumber> | GenericAugurInterfaces.TestNetReputationToken<TBigNumber>;
export type SomeTime<TBigNumber> = GenericAugurInterfaces.Time<TBigNumber> | GenericAugurInterfaces.TimeControlled<TBigNumber>;

export class Contracts<TBigNumber> {
  public augur: GenericAugurInterfaces.Augur<TBigNumber>;
  public universe: GenericAugurInterfaces.Universe<TBigNumber>;
  public cash: GenericAugurInterfaces.Cash<TBigNumber>;
  public orders: GenericAugurInterfaces.Orders<TBigNumber>;
  public createOrder: GenericAugurInterfaces.CreateOrder<TBigNumber>;
  public cancelOrder: GenericAugurInterfaces.CancelOrder<TBigNumber>;
  public fillOrder: GenericAugurInterfaces.FillOrder<TBigNumber>;
  public trade: GenericAugurInterfaces.Trade<TBigNumber>;
  public completeSets: GenericAugurInterfaces.CompleteSets<TBigNumber>;
  public claimTradingProceeds: GenericAugurInterfaces.ClaimTradingProceeds<TBigNumber>;
  public time: SomeTime<TBigNumber> | void;
  public legacyReputationToken: GenericAugurInterfaces.LegacyReputationToken<TBigNumber>;

  public reputationToken: SomeRepToken<TBigNumber> | null = null;
  private readonly dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>;

  public constructor (addresses: ContractAddresses, dependencies: GenericAugurInterfaces.Dependencies<TBigNumber>) {
    this.dependencies = dependencies;
    this.augur = new GenericAugurInterfaces.Augur<TBigNumber>(dependencies, addresses.Augur);

    this.universe = new GenericAugurInterfaces.Universe<TBigNumber>(dependencies, addresses.Universe);
    this.cash = new GenericAugurInterfaces.Cash<TBigNumber>(dependencies, addresses.Cash);
    this.orders = new GenericAugurInterfaces.Orders<TBigNumber>(dependencies, addresses.Orders);
    this.createOrder = new GenericAugurInterfaces.CreateOrder<TBigNumber>(dependencies, addresses.CreateOrder);
    this.cancelOrder = new GenericAugurInterfaces.CancelOrder<TBigNumber>(dependencies, addresses.CancelOrder);
    this.fillOrder = new GenericAugurInterfaces.FillOrder<TBigNumber>(dependencies, addresses.FillOrder);
    this.trade = new GenericAugurInterfaces.Trade<TBigNumber>(dependencies, addresses.Trade);
    this.completeSets = new GenericAugurInterfaces.CompleteSets<TBigNumber>(dependencies, addresses.CompleteSets);
    this.claimTradingProceeds = new GenericAugurInterfaces.ClaimTradingProceeds<TBigNumber>(dependencies, addresses.ClaimTradingProceeds);
    this.legacyReputationToken = new GenericAugurInterfaces.LegacyReputationToken<TBigNumber>(dependencies, addresses.LegacyReputationToken);
    if (typeof addresses.Time !== "undefined") {
      this.time = new GenericAugurInterfaces.Time<TBigNumber>(dependencies, addresses.Time);
    }
    if (typeof addresses.TimeControlled !== "undefined") {
      this.time = new GenericAugurInterfaces.TimeControlled<TBigNumber>(dependencies, addresses.TimeControlled);
    }
  }

  public getTime(): SomeTime<TBigNumber> {
    if (typeof this.time === "undefined") {
      throw Error("Cannot use Time or TimeControlled contracts unless defined for Augur's addresses");
    } else {
      return this.time;
    }
  }

  public getReputationToken(): SomeRepToken<TBigNumber> {
    if (this.reputationToken === null) {
      throw Error("Must set reputationToken for Augur instance before using it");
    } else {
      return this.reputationToken;
    }
  }

  public async setReputationToken(networkId: string) {
    const address = await this.universe.getReputationToken_();
    this.reputationToken = this.reputationTokenFromAddress(address, networkId);
  }

  public reputationTokenFromAddress(address: string, networkId: string): SomeRepToken<TBigNumber> {
    const Class = networkId === "1" ? GenericAugurInterfaces.ReputationToken : GenericAugurInterfaces.TestNetReputationToken;
    return new Class<TBigNumber>(this.dependencies, address);
  }

  public universeFromAddress(address: string): GenericAugurInterfaces.Universe<TBigNumber> {
    return new GenericAugurInterfaces.Universe<TBigNumber>(this.dependencies, address);
  }

  public marketFromAddress(address: string): GenericAugurInterfaces.Market<TBigNumber> {
    return new GenericAugurInterfaces.Market<TBigNumber>(this.dependencies, address);
  }

  public shareTokenFromAddress(address: string): GenericAugurInterfaces.ShareToken<TBigNumber> {
    return new GenericAugurInterfaces.ShareToken<TBigNumber>(this.dependencies, address);
  }

  public disputeWindowFromAddress(address: string): GenericAugurInterfaces.DisputeWindow<TBigNumber> {
    return new GenericAugurInterfaces.DisputeWindow<TBigNumber>(this.dependencies, address);
  }

  public getReportingParticipant(reportingParticipantAddress: string): GenericAugurInterfaces.DisputeCrowdsourcer<TBigNumber> {
    return new GenericAugurInterfaces.DisputeCrowdsourcer<TBigNumber>(this.dependencies, reportingParticipantAddress);
  }

  public isTimeControlled(contract: SomeTime<TBigNumber>): contract is GenericAugurInterfaces.TimeControlled<TBigNumber> {
    return (contract as GenericAugurInterfaces.TimeControlled<TBigNumber>).setTimestamp !== undefined;
  }
}
