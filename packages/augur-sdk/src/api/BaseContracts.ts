import { ContractDependenciesEthers } from '@augurproject/contract-dependencies-ethers';
import { ContractInterfaces } from '@augurproject/core';
import { Event } from '@augurproject/core/build/libraries/GenericContractInterfaces';
import { ContractAddresses } from '@augurproject/utils';
import BigNumber from 'bignumber.js';

export type SomeRepToken =
  | ContractInterfaces.ReputationToken
  | ContractInterfaces.TestNetReputationToken;
export type SomeTime =
  | ContractInterfaces.Time
  | ContractInterfaces.TimeControlled;
const RELAY_HUB_ADDRESS = '0xD216153c06E857cD7f72665E0aF1d7D82172F494';

export interface AugurInterface {
  address: string;
  getTimestamp_(options?: { sender?: string }): Promise<BigNumber>;
  isKnownUniverse_(
    universe: string,
    options?: { sender?: string }
  ): Promise<boolean>;
  lookup_(key: string, options?: { sender?: string }): Promise<string>;
}

export interface UniverseInterface {
  getReportingFeeDivisor_(options?: { sender?: string }): Promise<BigNumber>;
}

export interface ZeroXInterface {
  cancelOrders(
    orders: Array<{
      makerAddress: string;
      takerAddress: string;
      feeRecipientAddress: string;
      senderAddress: string;
      makerAssetAmount: BigNumber;
      takerAssetAmount: BigNumber;
      makerFee: BigNumber;
      takerFee: BigNumber;
      expirationTimeSeconds: BigNumber;
      salt: BigNumber;
      makerAssetData: string;
      takerAssetData: string;
      makerFeeAssetData: string;
      takerFeeAssetData: string;
    }>,
    signatures: Array<string>,
    maxProtocolFeeDai: BigNumber,
    options?: {
      attachedEth?: BigNumber,
      sender?: string
    }
  ): Promise<Array<Event>>;

  createZeroXOrder_(
    type: number,
    attoshares: BigNumber,
    price: BigNumber,
    market: string,
    outcome: number,
    expirationTimeSeconds: BigNumber,
    salt: BigNumber,
    options?: { sender?: string }
  ): Promise<{
    _zeroXOrder: {
      makerAddress: string;
      takerAddress: string;
      feeRecipientAddress: string;
      senderAddress: string;
      makerAssetAmount: BigNumber;
      takerAssetAmount: BigNumber;
      makerFee: BigNumber;
      takerFee: BigNumber;
      expirationTimeSeconds: BigNumber;
      salt: BigNumber;
      makerAssetData: string;
      takerAssetData: string;
      makerFeeAssetData: string;
      takerFeeAssetData: string;
    };
    _orderHash: string;
  }>;

  createZeroXOrder_(
    type: number,
    attoshares: BigNumber,
    price: BigNumber,
    market: string,
    outcome: number,
    expirationTimeSeconds: BigNumber,
    salt: BigNumber,
    options?: { sender?: string }
  ): Promise<{
    _zeroXOrder: {
      makerAddress: string;
      takerAddress: string;
      feeRecipientAddress: string;
      senderAddress: string;
      makerAssetAmount: BigNumber;
      takerAssetAmount: BigNumber;
      makerFee: BigNumber;
      takerFee: BigNumber;
      expirationTimeSeconds: BigNumber;
      salt: BigNumber;
      makerAssetData: string;
      takerAssetData: string;
      makerFeeAssetData: string;
      takerFeeAssetData: string;
    };
    _orderHash: string;
  }>;

  encodeEIP1271OrderWithHash_(
    zeroXOrder: {
      makerAddress: string;
      takerAddress: string;
      feeRecipientAddress: string;
      senderAddress: string;
      makerAssetAmount: BigNumber;
      takerAssetAmount: BigNumber;
      makerFee: BigNumber;
      takerFee: BigNumber;
      expirationTimeSeconds: BigNumber;
      salt: BigNumber;
      makerAssetData: string;
      takerAssetData: string;
      makerFeeAssetData: string;
      takerFeeAssetData: string;
    },
    orderHash: string,
    options?: { sender?: string }
  ): Promise<string>;
  trade(
    requestedFillAmount: BigNumber,
    fingerprint: string,
    tradeGroupId: string,
    unused: BigNumber,
    maxTrades: BigNumber,
    orders: Array<{
      makerAddress: string;
      takerAddress: string;
      feeRecipientAddress: string;
      senderAddress: string;
      makerAssetAmount: BigNumber;
      takerAssetAmount: BigNumber;
      makerFee: BigNumber;
      takerFee: BigNumber;
      expirationTimeSeconds: BigNumber;
      salt: BigNumber;
      makerAssetData: string;
      takerAssetData: string;
      makerFeeAssetData: string;
      takerFeeAssetData: string;
    }>,
    signatures: Array<string>,
    options?: { sender?: string; attachedEth?: BigNumber }
  ): Promise<Array<Event>>;
}

export abstract class BaseContracts {
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
  erc20Proxy1155: ContractInterfaces.ERC20Proxy1155Nexus;
  ammFactory: ContractInterfaces.AMMFactory;
  wethWrapperForAMMExchange: ContractInterfaces.WethWrapperForAMMExchange;

  reputationToken: SomeRepToken | null = null;
  protected readonly dependencies: ContractDependenciesEthers;

  constructor(
    addresses: ContractAddresses,
    dependencies: ContractDependenciesEthers
  ) {
    this.dependencies = dependencies;
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
    this.erc20Proxy1155 = new ContractInterfaces.ERC20Proxy1155Nexus(
      dependencies,
      addresses.ERC20Proxy1155Nexus
    );
    this.ammFactory = new ContractInterfaces.AMMFactory(
      dependencies,
      addresses.AMMFactory
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
    const originUniverse = await this.getOriginUniverse();
    const address = await originUniverse.getReputationToken_();
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

  ammFromAddress(address: string): ContractInterfaces.AMMExchange {
    return new ContractInterfaces.AMMExchange(this.dependencies, address);
  }

  shareTokenFromAddress(address: string): ContractInterfaces.ShareToken {
    return new ContractInterfaces.ShareToken(this.dependencies, address);
  }

  disputeWindowFromAddress(address: string): ContractInterfaces.DisputeWindow {
    return new ContractInterfaces.DisputeWindow(this.dependencies, address);
  }

  feePotFromAddress(address: string): ContractInterfaces.FeePot {
    return new ContractInterfaces.FeePot(this.dependencies, address);
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

  async getReportingFeeDivisor(): Promise<BigNumber> {
    return this.getUniverse().getReportingFeeDivisor_();
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

  wethWrapperForAMMExchangeFromAddress(
    address: string
  ): ContractInterfaces.WethWrapperForAMMExchange {
    return new ContractInterfaces.WethWrapperForAMMExchange(
      this.dependencies,
      address
    );
  }

  abstract getAugur(): AugurInterface;

  abstract getZeroXTrade(): ZeroXInterface;


  abstract getUniverse(): UniverseInterface;

  abstract getOriginCash(): Promise<ContractInterfaces.Cash>;

  abstract async getOriginUniverse(): Promise<ContractInterfaces.Universe>;

  abstract async getOriginUniverseAddress(): Promise<string>;

  async getTimestamp(): Promise<BigNumber> {
    return this.getAugur().getTimestamp_();
  }
}
