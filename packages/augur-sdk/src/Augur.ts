import { Accounts } from "./state/getter/Accounts";
import { BigNumber } from 'bignumber.js';
import { Callback, TXStatusCallback } from "./events";
import { BaseConnector } from "./connector/baseConnector";
import { ContractAddresses, NetworkId } from "@augurproject/artifacts";
import { TransactionStatusCallback, TransactionStatus } from "contract-dependencies-ethers";
import { ContractDependenciesGnosis } from "contract-dependencies-gnosis";
import { IGnosisRelayAPI } from "@augurproject/gnosis-relay-api";
import { ContractInterfaces } from "@augurproject/core";
import { Contracts } from "./api/Contracts";
import { CreateYesNoMarketParams, CreateCategoricalMarketParams, CreateScalarMarketParams, Market } from "./api/Market";
import { Gnosis } from "./api/Gnosis";
import { EmptyConnector } from "./connector/empty-connector";
import { Events } from "./api/Events";
import { Markets } from "./state/getter/Markets";
import { Provider } from "./ethereum/Provider";
import { Status } from "./state/getter/status";
import { TXStatus } from "./event-handlers";
import { Trade, PlaceTradeDisplayParams, SimulateTradeData } from "./api/Trade";
import { Trading } from "./state/getter/Trading";
import { Users } from "./state/getter/Users";
import { getAddress } from "ethers/utils/address";
import { isSubscriptionEventName, SubscriptionEventName, TXEventName } from "./constants";
import { Liquidity } from "./api/Liquidity";
import { TransactionResponse } from "ethers/providers";
import { SyncableFlexSearch } from "./state/db/SyncableFlexSearch";
import { GenericEventDBDescription } from "./state/logs/types";

export class Augur<TProvider extends Provider = Provider> {
  readonly provider: TProvider;
  private readonly dependencies: ContractDependenciesGnosis;

  readonly networkId: NetworkId;
  readonly events: Events;
  readonly addresses: ContractAddresses;
  readonly contracts: Contracts;
  readonly trade: Trade;
  readonly market: Market;
  readonly gnosis: Gnosis;
  static syncableFlexSearch: SyncableFlexSearch;
  static connector: BaseConnector;
  readonly liquidity: Liquidity;

  private txSuccessCallback: TXStatusCallback;
  private txAwaitingSigningCallback: TXStatusCallback;
  private txPendingCallback: TXStatusCallback;
  private txFailureCallback: TXStatusCallback;

  readonly genericEventDBDescriptions: GenericEventDBDescription[] = [
    { EventName: "CompleteSetsPurchased", indexes: []},
    { EventName: "CompleteSetsSold", indexes: []},
    { EventName: "DisputeCrowdsourcerCompleted", indexes: ["market"]},
    { EventName: "DisputeCrowdsourcerContribution", indexes: []},
    { EventName: "DisputeCrowdsourcerCreated", indexes: []},
    { EventName: "DisputeCrowdsourcerRedeemed", indexes: []},
    { EventName: "DisputeWindowCreated", indexes: []},
    { EventName: "InitialReporterRedeemed", indexes: []},
    { EventName: "InitialReportSubmitted", indexes: []},
    { EventName: "InitialReporterTransferred", indexes: []},
    { EventName: "MarketCreated", indexes: ["market"]},
    { EventName: "MarketFinalized", indexes: ["market"]},
    { EventName: "MarketMigrated", indexes: ["market"]},
    { EventName: "MarketParticipantsDisavowed", indexes: []},
    { EventName: "MarketTransferred", indexes: []},
    { EventName: "MarketVolumeChanged", indexes: []},
    { EventName: "MarketOIChanged", indexes: []},
    { EventName: "OrderEvent", indexes: []},
    { EventName: "ParticipationTokensRedeemed", indexes: []},
    { EventName: "ReportingParticipantDisavowed", indexes: []},
    { EventName: "TimestampSet", indexes: ["newTimestamp"]},
    { EventName: "TradingProceedsClaimed", indexes: []},
    { EventName: "UniverseCreated", indexes: []},
    { EventName: "UniverseForked", indexes: ["universe"]},
  ];

  constructor(provider: TProvider, dependencies: ContractDependenciesGnosis, networkId: NetworkId, addresses: ContractAddresses, connector: BaseConnector = new EmptyConnector(), gnosisRelay: IGnosisRelayAPI = undefined, enableFlexSearch = false) {
    this.provider = provider;
    this.dependencies = dependencies;
    this.networkId = networkId;
    if (!Augur.connector || connector.constructor.name !== "EmptyConnector") {
      Augur.connector = connector;
    }

    // API
    this.addresses = addresses;
    this.contracts = new Contracts(this.addresses, this.dependencies);
    this.trade = new Trade(this);
    this.market = new Market(this);
    this.liquidity = new Liquidity(this);
    this.events = new Events(this.provider, this.addresses.Augur);
    this.gnosis = new Gnosis(this.provider, gnosisRelay, this);
    if (enableFlexSearch && !Augur.syncableFlexSearch) {
      Augur.syncableFlexSearch = new SyncableFlexSearch();
    }
    this.registerTransactionStatusEvents();
  }

  static async create<TProvider extends Provider = Provider>(provider: TProvider, dependencies: ContractDependenciesGnosis, addresses: ContractAddresses, connector: BaseConnector = new EmptyConnector(), gnosisRelay: IGnosisRelayAPI = undefined, enableFlexSearch = false): Promise<Augur> {
    // has to be static because of the way we instantiate boundTo methods
    if (!Augur.connector || connector.constructor.name !== "EmptyConnector") {
      Augur.connector = connector;
    }

    const networkId = await provider.getNetworkId();
    const augur = new Augur<TProvider>(provider, dependencies, networkId, addresses, connector, gnosisRelay, enableFlexSearch);

    await augur.contracts.setReputationToken(networkId);

    return augur;
  }

  async getTransaction(hash: string): Promise<TransactionResponse> {
    const tx = await this.dependencies.provider.getTransaction(hash);
    return tx;
  }

  async listAccounts() {
    return this.dependencies.provider.listAccounts();
  }

  async getTimestamp() {
    return this.contracts.augur.getTimestamp_();
  }

  async getEthBalance(address: string): Promise<string> {
    const balance = await this.dependencies.provider.getBalance(address);
    return balance.toString();
  }

  async getGasPrice(): Promise<BigNumber> {
    const balance = await this.dependencies.provider.getGasPrice();
    return new BigNumber(balance.toString());
  }

  async getAccount(): Promise<string | null> {
    let account;
    if (this.dependencies.useSafe) {
      account = this.dependencies.safeAddress;
    } else {
      account = await this.dependencies.address;
    }
    if (!account) return account;
    return getAddress(account);
  }

  async sendETH(address: string, value: BigNumber): Promise<void> {
    const transaction = {
      to: address,
      data: "0x",
      value
    };
    const ethersTransaction = this.dependencies.transactionToEthersTransaction(transaction);
    await this.dependencies.signer.sendTransaction(ethersTransaction);
  }

  setGnosisSafeAddress(safeAddress: string): void {
    this.dependencies.setSafeAddress(safeAddress);
  }

  setUseGnosisSafe(useSafe: boolean): void {
    this.dependencies.setUseSafe(useSafe);
  }

  setUseGnosisRelay(useRelay: boolean): void {
    this.dependencies.setUseRelay(useRelay);
  }

  getUniverse(address: string): ContractInterfaces.Universe {
    return this.contracts.universeFromAddress(address);
  }

  getMarket(address: string): ContractInterfaces.Market {
    return new ContractInterfaces.Market(this.dependencies, address);
  }

  getOrders(): ContractInterfaces.Orders {
    return new ContractInterfaces.Orders(this.dependencies, this.addresses.Orders);
  }

  registerTransactionStatusCallback(key: string, callback: TransactionStatusCallback): void {
    this.dependencies.registerTransactionStatusCallback(key, callback);
  }

  deRegisterTransactionStatusCallback(key: string): void {
    this.dependencies.deRegisterTransactionStatusCallback(key);
  }

  deRegisterAllTransactionStatusCallbacks(): void {
    this.dependencies.deRegisterAllTransactionStatusCallbacks();
  }

  async connect(ethNodeUrl: string, account?: string): Promise<any> {
    return Augur.connector.connect(ethNodeUrl, account);
  }

  async disconnect(): Promise<any> {
    return Augur.connector.disconnect();
  }

  bindTo<R, P>(f: (db: any, augur: any, params: P) => Promise<R>): (params: P) => Promise<R> {
    return Augur.connector && Augur.connector.bindTo(f);
  }

  async on(eventName: SubscriptionEventName | TXEventName | string, callback: Callback | TXStatusCallback): Promise<void> {
    if (isSubscriptionEventName(eventName)) {
      return Augur.connector.on(eventName, callback as Callback);
    }
    else if (eventName === TXEventName.AwaitingSigning) {
      this.txAwaitingSigningCallback = callback;
    }
    else if (eventName === TXEventName.Pending) {
      this.txPendingCallback = callback;
    }
    else if (eventName === TXEventName.Success) {
      this.txSuccessCallback = callback;
    }
    else if (eventName === TXEventName.Failure) {
      this.txFailureCallback = callback;
    }
  }

  async off(eventName: SubscriptionEventName | TXEventName | string): Promise<void> {
    if (isSubscriptionEventName(eventName)) {
      return Augur.connector.off(eventName);
    }
    else if (eventName === TXEventName.AwaitingSigning) {
      this.txAwaitingSigningCallback = null;
    }
    else if (eventName === TXEventName.Pending) {
      this.txPendingCallback = null;
    }
    else if (eventName === TXEventName.Success) {
      this.txSuccessCallback = null;
    }
    else if (eventName === TXEventName.Failure) {
      this.txFailureCallback = null;
    }
  }

  getMarkets = (params: Parameters<typeof Markets.getMarkets>[2]) => {
    // sortBy param broken. See #2437.
    delete params.sortBy;
    return this.bindTo(Markets.getMarkets)(params);
  }

  getMarketsInfo = this.bindTo(Markets.getMarketsInfo);
  getSyncData = () => {
    return this.bindTo(Status.getSyncData)({});
  }

  getTradingHistory = this.bindTo(Trading.getTradingHistory);
  getAllOrders = this.bindTo(Trading.getAllOrders);
  getTradingOrders = this.bindTo(Trading.getOrders);
  getMarketOrderBook = this.bindTo(Markets.getMarketOrderBook);

  getMarketPriceCandlesticks = this.bindTo(Markets.getMarketPriceCandlesticks);

  getUserTradingPositions = this.bindTo(Users.getUserTradingPositions);
  getProfitLoss = this.bindTo(Users.getProfitLoss);
  getProfitLossSummary = this.bindTo(Users.getProfitLossSummary);
  getAccountTransactionHistory = this.bindTo(Accounts.getAccountTransactionHistory);
  getAccountReportingHistory = this.bindTo(Accounts.getAccountReportingHistory);

  async simulateTrade(params: PlaceTradeDisplayParams): Promise<SimulateTradeData> {
    return this.trade.simulateTrade(params);
  }

  async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    return this.trade.placeTrade(params);
  }

  async createYesNoMarket(params: CreateYesNoMarketParams): Promise<ContractInterfaces.Market> {
    return this.market.createYesNoMarket(params);
  }

  async createCategoricalMarket(params: CreateCategoricalMarketParams): Promise<ContractInterfaces.Market> {
    return this.market.createCategoricalMarket(params);
  }

  async createScalarMarket(params: CreateScalarMarketParams): Promise<ContractInterfaces.Market> {
    return this.market.createScalarMarket(params);
  }

  async simulateTradeGasLimit(params: PlaceTradeDisplayParams): Promise<BigNumber> {
    return this.trade.simulateTradeGasLimit(params);
  }

  private registerTransactionStatusEvents() {
    this.registerTransactionStatusCallback("Transaction Status Handler", (transaction, status, hash) => {

      if (status === TransactionStatus.SUCCESS && this.txSuccessCallback) {
        const txn: TXStatus = {
          transaction,
          eventName: TXEventName.Success,
          hash,
        } as TXStatus;
        this.txSuccessCallback(txn);
      } else if (status === TransactionStatus.AWAITING_SIGNING && this.txAwaitingSigningCallback) {
        const txn: TXStatus = {
          transaction,
          eventName: TXEventName.AwaitingSigning,
          hash,
        } as TXStatus;
        this.txAwaitingSigningCallback(txn);
      } else if (status === TransactionStatus.PENDING && this.txPendingCallback) {
        const txn: TXStatus = {
          transaction,
          eventName: TXEventName.Pending,
          hash,
        } as TXStatus;
        this.txPendingCallback(txn);
      } else if (status === TransactionStatus.FAILURE && this.txFailureCallback) {
        const txn: TXStatus = {
          transaction,
          eventName: TXEventName.Failure,
          hash,
        } as TXStatus;
        this.txFailureCallback(txn);
      }
    });
  }
}
