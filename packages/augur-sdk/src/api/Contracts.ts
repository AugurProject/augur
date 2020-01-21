import { ContractInterfaces } from "@augurproject/core";
import { ContractAddresses } from "@augurproject/artifacts";
import { ContractDependenciesEthers } from "contract-dependencies-ethers";

export type SomeRepToken = ContractInterfaces.ReputationToken | ContractInterfaces.TestNetReputationToken;
export type SomeTime = ContractInterfaces.Time | ContractInterfaces.TimeControlled;

export class Contracts {
  augur: ContractInterfaces.Augur;
  augurTrading: ContractInterfaces.AugurTrading;
  universe: ContractInterfaces.Universe;
  cash: ContractInterfaces.Cash;
  orders: ContractInterfaces.Orders;
  createOrder: ContractInterfaces.CreateOrder;
  cancelOrder: ContractInterfaces.CancelOrder;
  fillOrder: ContractInterfaces.FillOrder;
  trade: ContractInterfaces.Trade;
  shareToken: ContractInterfaces.ShareToken;
  time: SomeTime | void;
  legacyReputationToken: ContractInterfaces.LegacyReputationToken;
  simulateTrade: ContractInterfaces.SimulateTrade;
  gnosisSafe: ContractInterfaces.GnosisSafe;
  proxyFactory: ContractInterfaces.ProxyFactory;
  ZeroXTrade: ContractInterfaces.ZeroXTrade;
  buyParticipationTokens: ContractInterfaces.BuyParticipationTokens;
  redeemStake: ContractInterfaces.RedeemStake;
  cashFaucet: ContractInterfaces.CashFaucet;
  gnosisSafeRegistry: ContractInterfaces.GnosisSafeRegistry;
  hotLoading: ContractInterfaces.HotLoading;
  zeroXExchange: ContractInterfaces.Exchange;
  affiliates: ContractInterfaces.Affiliates;
  affiliateValidator: ContractInterfaces.AffiliateValidator;
  profitLoss: ContractInterfaces.ProfitLoss;
  warpSync: ContractInterfaces.WarpSync;

  reputationToken: SomeRepToken | null = null;
  private readonly dependencies: ContractDependenciesEthers;

  constructor (addresses: ContractAddresses, dependencies: ContractDependenciesEthers) {
    this.dependencies = dependencies;
    this.augur = new ContractInterfaces.Augur(dependencies, addresses.Augur);
    this.augurTrading = new ContractInterfaces.AugurTrading(dependencies, addresses.AugurTrading);

    this.universe = new ContractInterfaces.Universe(dependencies, addresses.Universe);
    this.cash = new ContractInterfaces.Cash(dependencies, addresses.Cash);
    this.orders = new ContractInterfaces.Orders(dependencies, addresses.Orders);
    this.createOrder = new ContractInterfaces.CreateOrder(dependencies, addresses.CreateOrder);
    this.cancelOrder = new ContractInterfaces.CancelOrder(dependencies, addresses.CancelOrder);
    this.fillOrder = new ContractInterfaces.FillOrder(dependencies, addresses.FillOrder);
    this.trade = new ContractInterfaces.Trade(dependencies, addresses.Trade);
    this.shareToken = new ContractInterfaces.ShareToken(dependencies, addresses.ShareToken);
    this.legacyReputationToken = new ContractInterfaces.LegacyReputationToken(dependencies, addresses.LegacyReputationToken);
    this.simulateTrade = new ContractInterfaces.SimulateTrade(dependencies, addresses.SimulateTrade);
    this.gnosisSafe = new ContractInterfaces.GnosisSafe(dependencies, addresses.GnosisSafe);
    this.proxyFactory = new ContractInterfaces.ProxyFactory(dependencies, addresses.ProxyFactory);
    this.ZeroXTrade = new ContractInterfaces.ZeroXTrade(dependencies, addresses.ZeroXTrade);
    this.buyParticipationTokens = new ContractInterfaces.BuyParticipationTokens(dependencies, addresses.BuyParticipationTokens);
    this.redeemStake = new ContractInterfaces.RedeemStake(dependencies, addresses.RedeemStake);
    this.cashFaucet = new ContractInterfaces.CashFaucet(dependencies, addresses.CashFaucet);
    this.gnosisSafeRegistry = new ContractInterfaces.GnosisSafeRegistry(dependencies, addresses.GnosisSafeRegistry);
    this.hotLoading = new ContractInterfaces.HotLoading(dependencies, addresses.HotLoading);
    this.zeroXExchange = new ContractInterfaces.Exchange(dependencies, addresses.Exchange);
    this.affiliates = new ContractInterfaces.Affiliates(dependencies, addresses.Affiliates);
    this.affiliateValidator = new ContractInterfaces.AffiliateValidator(dependencies, addresses.AffiliateValidator);
    this.profitLoss= new ContractInterfaces.ProfitLoss(dependencies, addresses.ProfitLoss);
    this.warpSync= new ContractInterfaces.WarpSync(dependencies, addresses.WarpSync);

    if (typeof addresses.Time !== "undefined") {
      this.time = new ContractInterfaces.Time(dependencies, addresses.Time);
    }
    if (typeof addresses.TimeControlled !== "undefined") {
      this.time = new ContractInterfaces.TimeControlled(dependencies, addresses.TimeControlled);
    }
  }

  getTime(): SomeTime {
    if (typeof this.time === "undefined") {
      throw Error("Cannot use Time or TimeControlled contracts unless defined for Augur's addresses");
    } else {
      return this.time;
    }
  }

  getReputationToken(): SomeRepToken {
    if (this.reputationToken === null) {
      throw Error("Must set reputationToken for Augur instance before using it");
    } else {
      return this.reputationToken;
    }
  }

  async setReputationToken(networkId: string) {
    const address = await this.universe.getReputationToken_();
    this.reputationToken = this.reputationTokenFromAddress(address, networkId);
  }

  reputationTokenFromAddress(address: string, networkId: string): SomeRepToken {
    const Class = networkId === "1" ? ContractInterfaces.ReputationToken : ContractInterfaces.TestNetReputationToken;
    return new Class(this.dependencies, address);
  }

  universeFromAddress(address: string): ContractInterfaces.Universe {
    return new ContractInterfaces.Universe(this.dependencies, address);
  }

  marketFromAddress(address: string): ContractInterfaces.Market {
    return new ContractInterfaces.Market(this.dependencies, address);
  }

  shareTokenFromAddress(address: string): ContractInterfaces.ShareToken {
    return new ContractInterfaces.ShareToken(this.dependencies, address);
  }

  disputeWindowFromAddress(address: string): ContractInterfaces.DisputeWindow {
    return new ContractInterfaces.DisputeWindow(this.dependencies, address);
  }

  getInitialReporter(initialReporterAddress: string): ContractInterfaces.InitialReporter {
    return new ContractInterfaces.InitialReporter(this.dependencies, initialReporterAddress);
  }

  getReportingParticipant(reportingParticipantAddress: string): ContractInterfaces.DisputeCrowdsourcer {
    return new ContractInterfaces.DisputeCrowdsourcer(this.dependencies, reportingParticipantAddress);
  }

  isTimeControlled(contract: SomeTime): contract is ContractInterfaces.TimeControlled {
    return (contract as ContractInterfaces.TimeControlled).setTimestamp !== undefined;
  }

  gnosisSafeFromAddress(address: string): ContractInterfaces.GnosisSafe {
    return new ContractInterfaces.GnosisSafe(this.dependencies, address);
  }
}
