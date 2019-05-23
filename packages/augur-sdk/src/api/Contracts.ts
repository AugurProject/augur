import { ContractInterfaces } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";

export type SomeRepToken = ContractInterfaces.ReputationToken | ContractInterfaces.TestNetReputationToken;
export type SomeTime = ContractInterfaces.Time | ContractInterfaces.TimeControlled;

export class Contracts {
  public augur: ContractInterfaces.Augur;
  public universe: ContractInterfaces.Universe;
  public cash: ContractInterfaces.Cash;
  public orders: ContractInterfaces.Orders;
  public createOrder: ContractInterfaces.CreateOrder;
  public cancelOrder: ContractInterfaces.CancelOrder;
  public fillOrder: ContractInterfaces.FillOrder;
  public trade: ContractInterfaces.Trade;
  public completeSets: ContractInterfaces.CompleteSets;
  public claimTradingProceeds: ContractInterfaces.ClaimTradingProceeds;
  public time: SomeTime | void;
  public legacyReputationToken: ContractInterfaces.LegacyReputationToken;

  public reputationToken: SomeRepToken | null = null;
  private readonly dependencies: ContractDependenciesEthers;

  public constructor (addresses: ContractAddresses, dependencies: ContractDependenciesEthers) {
    this.dependencies = dependencies;
    this.augur = new ContractInterfaces.Augur(dependencies, addresses.Augur);

    this.universe = new ContractInterfaces.Universe(dependencies, addresses.Universe);
    this.cash = new ContractInterfaces.Cash(dependencies, addresses.Cash);
    this.orders = new ContractInterfaces.Orders(dependencies, addresses.Orders);
    this.createOrder = new ContractInterfaces.CreateOrder(dependencies, addresses.CreateOrder);
    this.cancelOrder = new ContractInterfaces.CancelOrder(dependencies, addresses.CancelOrder);
    this.fillOrder = new ContractInterfaces.FillOrder(dependencies, addresses.FillOrder);
    this.trade = new ContractInterfaces.Trade(dependencies, addresses.Trade);
    this.completeSets = new ContractInterfaces.CompleteSets(dependencies, addresses.CompleteSets);
    this.claimTradingProceeds = new ContractInterfaces.ClaimTradingProceeds(dependencies, addresses.ClaimTradingProceeds);
    this.legacyReputationToken = new ContractInterfaces.LegacyReputationToken(dependencies, addresses.LegacyReputationToken);
    if (typeof addresses.Time !== "undefined") {
      this.time = new ContractInterfaces.Time(dependencies, addresses.Time);
    }
    if (typeof addresses.TimeControlled !== "undefined") {
      this.time = new ContractInterfaces.TimeControlled(dependencies, addresses.TimeControlled);
    }
  }

  public getTime(): SomeTime {
    if (typeof this.time === "undefined") {
      throw Error("Cannot use Time or TimeControlled contracts unless defined for Augur's addresses");
    } else {
      return this.time;
    }
  }

  public getReputationToken(): SomeRepToken {
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

  public reputationTokenFromAddress(address: string, networkId: string): SomeRepToken {
    const Class = networkId === "1" ? ContractInterfaces.ReputationToken : ContractInterfaces.TestNetReputationToken;
    return new Class(this.dependencies, address);
  }

  public universeFromAddress(address: string): ContractInterfaces.Universe {
    return new ContractInterfaces.Universe(this.dependencies, address);
  }

  public marketFromAddress(address: string): ContractInterfaces.Market {
    return new ContractInterfaces.Market(this.dependencies, address);
  }

  public shareTokenFromAddress(address: string): ContractInterfaces.ShareToken {
    return new ContractInterfaces.ShareToken(this.dependencies, address);
  }

  public disputeWindowFromAddress(address: string): ContractInterfaces.DisputeWindow {
    return new ContractInterfaces.DisputeWindow(this.dependencies, address);
  }

  public getReportingParticipant(reportingParticipantAddress: string): ContractInterfaces.DisputeCrowdsourcer {
    return new ContractInterfaces.DisputeCrowdsourcer(this.dependencies, reportingParticipantAddress);
  }

  public isTimeControlled(contract: SomeTime): contract is ContractInterfaces.TimeControlled {
    return (contract as ContractInterfaces.TimeControlled).setTimestamp !== undefined;
  }
}
