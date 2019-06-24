import { Callback } from "./events";
import { Connector } from "./connector/connector";
import { ContractAddresses, NetworkId } from "@augurproject/artifacts";
import { ContractInterfaces } from "@augurproject/core";
import { Contracts } from "./api/Contracts";
import { EmptyConnector } from "./connector/empty-connector";
import { Events } from "./api/Events";
import { BigNumber } from 'bignumber.js';
import { Provider } from "./ethereum/Provider";
import { isSubscriptionEventName, SubscriptionEventNames } from "./constants";
import { Trade, PlaceTradeDisplayParams, SimulateTradeData } from "./api/Trade";
import { ContractDependenciesEthers, TransactionStatusCallback } from "contract-dependencies-ethers";
import { Markets } from "./state/getter/Markets";
import { SyncData } from "./state/getter/sync-data";

export interface CustomEvent {
  name: string;
  eventName?: string;
  idFields?: Array<string>;
}

export interface UserSpecificEvent extends CustomEvent {
  numAdditionalTopics: number;
  userTopicIndicies: Array<number>;
}

export class Augur<TProvider extends Provider = Provider> {
  public readonly provider: TProvider;
  private readonly dependencies: ContractDependenciesEthers;

  public readonly networkId: NetworkId;
  public readonly events: Events;
  public readonly addresses: ContractAddresses;
  public readonly contracts: Contracts;
  public readonly trade: Trade;
  public static connector: Connector;

  // TODO Set genericEventNames & userSpecificEvents using
  // GenericContractInterfaces instead of hardcoding them
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
    "OrderEvent",
    "ParticipationTokensRedeemed",
    "ReportingParticipantDisavowed",
    "TimestampSet",
    "TradingProceedsClaimed",
    "UniverseCreated",
    "UniverseForked",
  ];

  public readonly customEvents: Array<CustomEvent> = [
    {
      "name": "CurrentOrders",
      "eventName": "OrderEvent",
      "idFields": ["orderId"]
    },
  ]

  // TODO Update numAdditionalTopics/userTopicIndexes once contract events are updated
  public readonly userSpecificEvents: Array<UserSpecificEvent> = [
    {
      "name": "TokensTransferred",
      "numAdditionalTopics": 3,
      "userTopicIndicies": [1, 2],
    },
    {
      "name": "ProfitLossChanged",
      "numAdditionalTopics": 3,
      "userTopicIndicies": [2],
    },
    {
      "name": "TokenBalanceChanged",
      "numAdditionalTopics": 2,
      "userTopicIndicies": [1],
      "idFields": ["token"]
    },
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

  public async getAccount(): Promise<string> {
    return await this.dependencies.getDefaultAddress();
  }

  public getUniverse(address: string): ContractInterfaces.Universe {
    return new ContractInterfaces.Universe(this.dependencies, address);
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

  public async on(eventName: SubscriptionEventNames | string, callback: Callback): Promise<void> {
    if (isSubscriptionEventName(eventName)) {
      return Augur.connector.on(eventName, callback);
    }
  }

  public async off(eventName: SubscriptionEventNames | string): Promise<void> {
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
    return this.bindTo(SyncData.getSyncData)({});
  }

  public async simulateTrade(params: PlaceTradeDisplayParams): Promise<SimulateTradeData> {
    return this.trade.simulateTrade(params);
  }

  public async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    return this.trade.placeTrade(params);
  }
}
