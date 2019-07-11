import { Callback, SubscriptionType } from "./events";
import { Connector } from "./connector/connector";
import { ContractAddresses, NetworkId } from "@augurproject/artifacts";
import { ContractInterfaces } from "@augurproject/core";
import { Contracts } from "./api/Contracts";
import { EmptyConnector } from "./connector/empty-connector";
import { Events } from "./api/Events";
import { BigNumber } from 'bignumber.js';
import { Provider } from "./ethereum/Provider";
import { isSubscriptionEventName, SubscriptionEventName } from "./constants";
import { Trade, PlaceTradeDisplayParams, SimulateTradeData } from "./api/Trade";
import { ContractDependenciesEthers, TransactionStatusCallback } from "contract-dependencies-ethers";
import { Markets } from "./state/getter/Markets";
import { Status } from "./state/getter/status";
import { Trading } from "./state/getter/Trading";
import { CreateYesNoMarketParams, CreateCategoricalMarketParams, CreateScalarMarketParams, Market } from "./api/Market";
import { Users } from "./state/getter/Users";
import { Accounts } from "./state/getter/Accounts";
import { getAddress } from "ethers/utils/address";

export class Augur<TProvider extends Provider = Provider> {
  public readonly provider: TProvider;
  private readonly dependencies: ContractDependenciesEthers;

  public readonly networkId: NetworkId;
  public readonly events: Events;
  public readonly addresses: ContractAddresses;
  public readonly contracts: Contracts;
  public readonly trade: Trade;
  public readonly market: Market;
  public static connector: Connector;

  // TODO Set genericEventNames using GenericContractInterfaces instead of hardcoding them
  public readonly genericEventNames: Array<string> = [
    "CompleteSetsPurchased",
    "CompleteSetsSold",
    "DisputeCrowdsourcerCompleted",
    "DisputeCrowdsourcerContribution",
    "DisputeCrowdsourcerCreated",
    "DisputeCrowdsourcerRedeemed",
    "DisputeWindowCreated",
    "InitialReporterRedeemed",
    "InitialReportSubmitted",
    "InitialReporterTransferred",
    "MarketCreated",
    "MarketFinalized",
    "MarketMigrated",
    "MarketParticipantsDisavowed",
    "MarketTransferred",
    "MarketVolumeChanged",
    "MarketOIChanged",
    "OrderEvent",
    "ParticipationTokensRedeemed",
    "ReportingParticipantDisavowed",
    "TimestampSet",
    "TradingProceedsClaimed",
    "UniverseCreated",
    "UniverseForked",
  ];

  public constructor(provider: TProvider, dependencies: ContractDependenciesEthers, networkId: NetworkId, addresses: ContractAddresses, connector: Connector = new EmptyConnector()) {
    this.provider = provider;
    this.dependencies = dependencies;
    this.networkId = networkId;
    if (!Augur.connector || connector.constructor.name !== "EmptyConnector")
      Augur.connector = connector;

    // API
    this.addresses = addresses;
    this.contracts = new Contracts(this.addresses, this.dependencies);
    this.trade = new Trade(this);
    this.market = new Market(this);
    this.events = new Events(this.provider, this.addresses.Augur);
  }

  public static async create<TProvider extends Provider = Provider>(provider: TProvider, dependencies: ContractDependenciesEthers, addresses: ContractAddresses, connector: Connector = new EmptyConnector()): Promise<Augur> {
    // has to be static because of the way we instantiate boundTo methods
    if (!Augur.connector || connector.constructor.name !== "EmptyConnector")
      Augur.connector = connector;

    const networkId = await provider.getNetworkId();
    const augur = new Augur<TProvider>(provider, dependencies, networkId, addresses, connector);

    await augur.contracts.setReputationToken(networkId);

    return augur;
  }

  public async getTransaction(hash: string): Promise<string> {
    const tx = await this.dependencies.provider.getTransaction(hash);
    if (!tx) return "";
    return tx.from;
  }
  public async listAccounts() {
    return this.dependencies.provider.listAccounts();
  }

  public async getTimestamp() {
    return this.contracts.augur.getTimestamp_();
  }

  public async getEthBalance(address: string): Promise<string> {
    const balance = await this.dependencies.provider.getBalance(address);
    return balance.toString();
  }

  public async getGasPrice(): Promise<BigNumber> {
    const balance = await this.dependencies.provider.getGasPrice();
    return new BigNumber(balance.toString());
  }

  public async getAccount(): Promise<string | null> {
    const account = await this.dependencies.address;
    if (!account) return account;
    return getAddress(account);
  }

  public getUniverse(address: string): ContractInterfaces.Universe {
    return this.contracts.universeFromAddress(address);
  }

  public getMarket(address: string): ContractInterfaces.Market {
    return new ContractInterfaces.Market(this.dependencies, address);
  }

  public getOrders(): ContractInterfaces.Orders {
    return new ContractInterfaces.Orders(this.dependencies, this.addresses.Orders);
  }

  public registerTransactionStatusCallback(key: string, callback: TransactionStatusCallback): void {
    this.dependencies.registerTransactionStatusCallback(key, callback);
  }

  public deRegisterTransactionStatusCallback(key: string): void {
    this.dependencies.deRegisterTransactionStatusCallback(key);
  }

  public deRegisterAllTransactionStatusCallbacks(): void {
    this.dependencies.deRegisterAllTransactionStatusCallbacks();
  }

  public async connect(ethNodeUrl: string, account?: string): Promise<any> {
    return Augur.connector.connect(ethNodeUrl, account);
  }

  public async disconnect(): Promise<any> {
    return Augur.connector.disconnect();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return Augur.connector.bindTo(f);
  }

  public async on<T extends SubscriptionType>(eventName: SubscriptionEventName | string, callback: Callback): Promise<void> {
    if (isSubscriptionEventName(eventName)) {
      return Augur.connector.on(eventName, callback);
    }
  }

  public async off(eventName: SubscriptionEventName | string): Promise<void> {
    if (isSubscriptionEventName(eventName)) {
      return Augur.connector.off(eventName);
    }
  }

  public getMarkets = (params: Parameters<typeof Markets.getMarkets>[2]) => {
    // sortBy param broken. See #2437.
    delete params.sortBy;
    return this.bindTo(Markets.getMarkets)(params);
  }

  public getMarketsInfo = this.bindTo(Markets.getMarketsInfo);
  public getSyncData = () => {
    return this.bindTo(Status.getSyncData)({});
  }

  public getTradingHistory = this.bindTo(Trading.getTradingHistory);
  public getAllOrders = this.bindTo(Trading.getAllOrders);
  public getTradingOrders = this.bindTo(Trading.getOrders);
  public getMarketOrderBook = this.bindTo(Markets.getMarketOrderBook);

  public getMarketPriceCandlesticks = this.bindTo(Markets.getMarketPriceCandlesticks);

  public getUserTradingPositions = this.bindTo(Users.getUserTradingPositions);
  public getProfitLoss = this.bindTo(Users.getProfitLoss);
  public getAccountTransactionHistory = this.bindTo(Accounts.getAccountTransactionHistory);

  public async simulateTrade(params: PlaceTradeDisplayParams): Promise<SimulateTradeData> {
    return this.trade.simulateTrade(params);
  }

  public async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    return this.trade.placeTrade(params);
  }

  public async createYesNoMarket(params: CreateYesNoMarketParams): Promise<ContractInterfaces.Market> {
    return this.market.createYesNoMarket(params);
  }

  public async createCategoricalMarket(params: CreateCategoricalMarketParams): Promise<ContractInterfaces.Market> {
    return this.market.createCategoricalMarket(params);
  }

  public async createScalarMarket(params: CreateScalarMarketParams): Promise<ContractInterfaces.Market> {
    return this.market.createScalarMarket(params);
  }

  public async simulateTradeGasLimit(params: PlaceTradeDisplayParams): Promise<BigNumber> {
    return this.trade.simulateTradeGasLimit(params);
  }
}
