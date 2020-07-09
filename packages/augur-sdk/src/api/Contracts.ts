import { ContractInterfaces } from '@augurproject/core';
import { ContractAddresses } from '@augurproject/utils';
import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';

export type SomeRepToken =
  | ContractInterfaces.ReputationToken
  | ContractInterfaces.TestNetReputationToken;
export type SomeTime =
  | ContractInterfaces.Time
  | ContractInterfaces.TimeControlled;
const RELAY_HUB_ADDRESS = '0xD216153c06E857cD7f72665E0aF1d7D82172F494';

export class Contracts {
  augur: ContractInterfaces.Augur;
  augurTrading: ContractInterfaces.AugurTrading;
  universe: ContractInterfaces.Universe;
  cash: ContractInterfaces.Cash;
  usdc: ContractInterfaces.USDC;
  usdt: ContractInterfaces.USDT;
  orders: ContractInterfaces.Orders;
  createOrder: ContractInterfaces.CreateOrder;
  cancelOrder: ContractInterfaces.CancelOrder;
  fillOrder: ContractInterfaces.FillOrder;
  trade: ContractInterfaces.Trade;
  shareToken: ContractInterfaces.ShareToken;
  time: SomeTime | void;
  legacyReputationToken: ContractInterfaces.LegacyReputationToken;
  simulateTrade: ContractInterfaces.SimulateTrade;
  ZeroXTrade: ContractInterfaces.ZeroXTrade;
  buyParticipationTokens: ContractInterfaces.BuyParticipationTokens;
  redeemStake: ContractInterfaces.RedeemStake;
  hotLoading: ContractInterfaces.HotLoading;
  zeroXExchange: ContractInterfaces.Exchange;
  affiliates: ContractInterfaces.Affiliates;
  affiliateValidator: ContractInterfaces.AffiliateValidator;
  profitLoss: ContractInterfaces.ProfitLoss;
  uniswapV2Factory: ContractInterfaces.UniswapV2Factory;
  ethExchange: ContractInterfaces.UniswapV2Pair;
  warpSync: ContractInterfaces.WarpSync;
  augurWalletRegistry: ContractInterfaces.AugurWalletRegistry;
  relayHub: ContractInterfaces.RelayHub;
  weth: ContractInterfaces.WETH9;
  uniswap: ContractInterfaces.UniswapV2Router02;
  auditFunds: ContractInterfaces.AuditFunds;

  reputationToken: SomeRepToken | null = null;
  private readonly dependencies: ContractDependenciesEthers;

  constructor(
    addresses: ContractAddresses,
    dependencies: ContractDependenciesEthers
  ) {
    this.dependencies = dependencies;
    this.augur = new ContractInterfaces.Augur(dependencies, addresses.Augur);
    this.augurTrading = new ContractInterfaces.AugurTrading(
      dependencies,
      addresses.AugurTrading
    );

    this.universe = new ContractInterfaces.Universe(
      dependencies,
      addresses.Universe
    );
    this.cash = new ContractInterfaces.Cash(dependencies, addresses.Cash);
    this.usdc = new ContractInterfaces.USDC(dependencies, addresses.USDC);
    this.usdt = new ContractInterfaces.USDT(dependencies, addresses.USDT);
    this.orders = new ContractInterfaces.Orders(dependencies, addresses.Orders);
    this.createOrder = new ContractInterfaces.CreateOrder(
      dependencies,
      addresses.CreateOrder
    );
    this.cancelOrder = new ContractInterfaces.CancelOrder(
      dependencies,
      addresses.CancelOrder
    );
    this.fillOrder = new ContractInterfaces.FillOrder(
      dependencies,
      addresses.FillOrder
    );
    this.trade = new ContractInterfaces.Trade(dependencies, addresses.Trade);
    this.shareToken = new ContractInterfaces.ShareToken(
      dependencies,
      addresses.ShareToken
    );
    this.legacyReputationToken = new ContractInterfaces.LegacyReputationToken(
      dependencies,
      addresses.LegacyReputationToken
    );
    this.simulateTrade = new ContractInterfaces.SimulateTrade(
      dependencies,
      addresses.SimulateTrade
    );
    this.ZeroXTrade = new ContractInterfaces.ZeroXTrade(
      dependencies,
      addresses.ZeroXTrade
    );
    this.buyParticipationTokens = new ContractInterfaces.BuyParticipationTokens(
      dependencies,
      addresses.BuyParticipationTokens
    );
    this.redeemStake = new ContractInterfaces.RedeemStake(
      dependencies,
      addresses.RedeemStake
    );
    this.hotLoading = new ContractInterfaces.HotLoading(
      dependencies,
      addresses.HotLoading
    );
    this.zeroXExchange = new ContractInterfaces.Exchange(
      dependencies,
      addresses.Exchange
    );
    this.affiliates = new ContractInterfaces.Affiliates(
      dependencies,
      addresses.Affiliates
    );
    this.affiliateValidator = new ContractInterfaces.AffiliateValidator(
      dependencies,
      addresses.AffiliateValidator
    );
    this.profitLoss = new ContractInterfaces.ProfitLoss(
      dependencies,
      addresses.ProfitLoss
    );
    this.uniswapV2Factory = new ContractInterfaces.UniswapV2Factory(
      dependencies,
      addresses.UniswapV2Factory
    );
    this.ethExchange = new ContractInterfaces.UniswapV2Pair(
      dependencies,
      addresses.EthExchange
    );
    this.warpSync = new ContractInterfaces.WarpSync(
      dependencies,
      addresses.WarpSync
    );
    this.augurWalletRegistry = new ContractInterfaces.AugurWalletRegistry(
      dependencies,
      addresses.AugurWalletRegistry
    );
    this.relayHub = new ContractInterfaces.RelayHub(
      dependencies,
      RELAY_HUB_ADDRESS
    );
    this.weth = new ContractInterfaces.WETH9(dependencies, addresses.WETH9);
    this.uniswap = new ContractInterfaces.UniswapV2Router02(
      dependencies,
      addresses.UniswapV2Router02
    );
    this.auditFunds = new ContractInterfaces.AuditFunds(
      dependencies,
      addresses.AuditFunds
    );

    if (typeof addresses.Time !== 'undefined') {
      this.time = new ContractInterfaces.Time(dependencies, addresses.Time);
    }
    if (typeof addresses.TimeControlled !== 'undefined') {
      this.time = new ContractInterfaces.TimeControlled(
        dependencies,
        addresses.TimeControlled
      );
    }
  }

  getTime(): SomeTime {
    if (typeof this.time === 'undefined') {
      throw Error(
        "Cannot use Time or TimeControlled contracts unless defined for Augur's addresses"
      );
    } else {
      return this.time;
    }
  }

  getReputationToken(): SomeRepToken {
    if (this.reputationToken === null) {
      throw Error(
        'Must set reputationToken for Augur instance before using it'
      );
    } else {
      return this.reputationToken;
    }
  }

  async setReputationToken(networkId: string) {
    const address = await this.universe.getReputationToken_();
    this.reputationToken = this.reputationTokenFromAddress(address, networkId);
  }

  reputationTokenFromAddress(address: string, networkId: string): SomeRepToken {
    const Class =
      networkId === '1'
        ? ContractInterfaces.ReputationToken
        : ContractInterfaces.TestNetReputationToken;
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

  getInitialReporter(
    initialReporterAddress: string
  ): ContractInterfaces.InitialReporter {
    return new ContractInterfaces.InitialReporter(
      this.dependencies,
      initialReporterAddress
    );
  }

  getReportingParticipant(
    reportingParticipantAddress: string
  ): ContractInterfaces.DisputeCrowdsourcer {
    return new ContractInterfaces.DisputeCrowdsourcer(
      this.dependencies,
      reportingParticipantAddress
    );
  }

  isTimeControlled(
    contract: SomeTime
  ): contract is ContractInterfaces.TimeControlled {
    return (
      (contract as ContractInterfaces.TimeControlled).setTimestamp !== undefined
    );
  }

  augurWalletFromAddress(address: string): ContractInterfaces.AugurWallet {
    return new ContractInterfaces.AugurWallet(this.dependencies, address);
  }

  uniswapExchangeFromAddress(
    address: string
  ): ContractInterfaces.UniswapV2Pair {
    return new ContractInterfaces.UniswapV2Pair(this.dependencies, address);
  }
}
