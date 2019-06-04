import { Connector, Callback } from "./connector/connector";
import { ContractAddresses, NetworkId } from "@augurproject/artifacts";
import { ContractInterfaces } from "@augurproject/core";
import { Contracts } from "./api/Contracts";
import { EmptyConnector } from "./connector/empty-connector";
import { Events } from "./api/Events";
import { Provider } from "./ethereum/Provider";
import { SubscriptionEventNames, isSubscriptionEventName } from "./constants";
import { Trade } from "./api/Trade";
import { TransactionStatusCallback, ContractDependenciesEthers } from "contract-dependencies-ethers";
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
    Augur.connector = connector;

    // API
    this.addresses = addresses;
    this.contracts = new Contracts(this.addresses, this.dependencies);
    this.trade = new Trade(this);
    this.events = new Events(this.provider, this.addresses.Augur);
  }

  public static async create<TProvider extends Provider = Provider>(provider: TProvider, dependencies: ContractDependenciesEthers, addresses: ContractAddresses, connector: Connector = new EmptyConnector()): Promise<Augur> {
    // has to be static because of the way we instantiate boundTo methods 
    Augur.connector = connector;

    const networkId = await provider.getNetworkId();
    const augur = new Augur<TProvider>(provider, dependencies, networkId, addresses, connector);

    await augur.contracts.setReputationToken(networkId);

    return augur;
  }

  public async getAccount(): Promise<string> {
    return await this.dependencies.getDefaultAddress();
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

  public async connect(params?: any): Promise<any> {
    return Augur.connector.connect(params);
  }

  public async disconnect(): Promise<any> {
    return Augur.connector.disconnect();
  }

  public bindTo<R, P>(f: (db: any, augur: any, params: P) => R): (params: P) => Promise<R> {
    return Augur.connector.bindTo(f);
  }

  public on(eventName: SubscriptionEventNames | string, callback: Callback): void {
    if (isSubscriptionEventName(eventName)) {
      Augur.connector.on(eventName, callback);
    }
  }

  public off(eventName: SubscriptionEventNames | string): void {
    if (isSubscriptionEventName(eventName)) {
      Augur.connector.off(eventName);
    }
  }

  public getMarkets = this.bindTo(Markets.getMarkets);
  public getSyncData = this.bindTo(SyncData.getSyncData);
}
