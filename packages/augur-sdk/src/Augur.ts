import { Accounts } from "./state/getter/Accounts";
import { BigNumber } from 'bignumber.js';
import { Callback, TXStatusCallback } from "./events";
import { BaseConnector } from "./connector/baseConnector";
import { ContractAddresses, NetworkId } from "@augurproject/artifacts";
import { TransactionStatusCallback, TransactionStatus, EthersSigner } from "contract-dependencies-ethers";
import { ContractDependenciesGnosis } from "contract-dependencies-gnosis";
import { IGnosisRelayAPI } from "@augurproject/gnosis-relay-api";
import { ContractInterfaces } from "@augurproject/core";
import { Contracts } from "./api/Contracts";
import { CreateYesNoMarketParams, CreateCategoricalMarketParams, CreateScalarMarketParams, Market } from "./api/Market";
import { Gnosis } from "./api/Gnosis";
import { HotLoading, DisputeWindow, GetDisputeWindowParams } from "./api/HotLoading";
import { EmptyConnector } from "./connector/empty-connector";
import { Events } from "./api/Events";
import { Markets } from "./state/getter/Markets";
import { Universe } from "./state/getter/Universe";
import { Platform } from "./state/getter/Platform";
import { ZeroXOrdersGetters } from "./state/getter/ZeroXOrdersGetters";
import { Provider } from "./ethereum/Provider";
import { Status } from "./state/getter/status";
import { TXStatus } from "./event-handlers";
import { Trade, PlaceTradeDisplayParams, SimulateTradeData } from "./api/Trade";
import { Trading } from "./state/getter/Trading";
import { Users } from "./state/getter/Users";
import { getAddress } from "ethers/utils/address";
import { isSubscriptionEventName, SubscriptionEventName, TXEventName } from "./constants";
import { Liquidity } from "./api/Liquidity";
import { Liquidity as LiquidityGetter } from "./state/getter/Liquidity";
import { TransactionResponse } from "ethers/providers";
import { SyncableFlexSearch } from "./state/db/SyncableFlexSearch";
import { WSClient } from '@0x/mesh-rpc-client';
import {
  GnosisSafeStateReponse,
} from '@augurproject/gnosis-relay-api';
import { Arrayish } from 'ethers/utils';
import { GnosisSafeStatusPayload } from './api/Gnosis';

import { BrowserMesh, ZeroX } from './api/ZeroX';
import { SingleThreadConnector } from './connector';
import {
  augurEmitter,
  EventNameEmitter,
} from './events';
import { Address, GenericEventDBDescription } from './state/logs/types';
import { Subscriptions } from './subscriptions';

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
  readonly zeroX: ZeroX;
  readonly universe: Universe;
  syncableFlexSearch: SyncableFlexSearch;
  connector: BaseConnector;
  readonly liquidity: Liquidity;
  readonly hotLoading: HotLoading;
  readonly subscriptions: Subscriptions;

  private txSuccessCallback: TXStatusCallback;
  private txAwaitingSigningCallback: TXStatusCallback;
  private txPendingCallback: TXStatusCallback;
  private txFailureCallback: TXStatusCallback;

  readonly genericEventDBDescriptions: GenericEventDBDescription[] = [
    { EventName: 'CompleteSetsPurchased', indexes: [] },
    { EventName: 'CompleteSetsSold', indexes: [] },
    { EventName: 'DisputeCrowdsourcerCompleted', indexes: ['market'] },
    { EventName: 'DisputeCrowdsourcerContribution', indexes: [] },
    { EventName: 'DisputeCrowdsourcerCreated', indexes: [] },
    { EventName: 'DisputeCrowdsourcerRedeemed', indexes: [] },
    { EventName: 'DisputeWindowCreated', indexes: [] },
    { EventName: 'InitialReporterRedeemed', indexes: [] },
    { EventName: 'InitialReportSubmitted', indexes: [] },
    { EventName: 'InitialReporterTransferred', indexes: [] },
    { EventName: 'MarketCreated', indexes: ['market'] },
    { EventName: 'MarketFinalized', indexes: ['market'] },
    { EventName: 'MarketMigrated', indexes: ['market'] },
    { EventName: 'MarketParticipantsDisavowed', indexes: [] },
    { EventName: 'MarketTransferred', indexes: [] },
    { EventName: 'MarketVolumeChanged', indexes: [] },
    { EventName: 'MarketOIChanged', indexes: [] },
    { EventName: 'OrderEvent', indexes: [] },
    { EventName: 'ParticipationTokensRedeemed', indexes: [] },
    { EventName: 'ReportingParticipantDisavowed', indexes: [] },
    { EventName: 'TimestampSet', indexes: ['newTimestamp'] },
    { EventName: 'TradingProceedsClaimed', indexes: [] },
    { EventName: 'UniverseCreated', indexes: [] },
    { EventName: 'UniverseForked', indexes: ['universe'] },
    { EventName: 'TransferSingle', indexes: []},
    { EventName: 'TransferBatch', indexes: []},
    { EventName: 'ShareTokenBalanceChanged', indexes: []},
  ];

  constructor(
    provider: TProvider,
    dependencies: ContractDependenciesGnosis,
    networkId: NetworkId,
    addresses: ContractAddresses,
    connector: BaseConnector = new EmptyConnector(),
    gnosisRelay: IGnosisRelayAPI = undefined,
    enableFlexSearch = false,
    meshClient: WSClient = undefined,
    browserMesh: BrowserMesh = undefined
  ) {
    this.provider = provider;
    this.dependencies = dependencies;
    this.networkId = networkId;
    if (!this.connector || connector.constructor.name !== 'EmptyConnector') {
      this.connector = connector;
    }

    this.subscriptions = new Subscriptions(augurEmitter);

    this.subscriptions.on(SubscriptionEventName.GnosisSafeStatus, this.updateGnosisSafe.bind(this));

    // API
    this.addresses = addresses;
    this.contracts = new Contracts(this.addresses, this.dependencies);
    this.trade = new Trade(this);
    this.market = new Market(this);
    this.liquidity = new Liquidity(this);
    this.events = new Events(this.provider, this.addresses.Augur, this.addresses.AugurTrading, this.addresses.ShareToken);
    this.gnosis = new Gnosis(this.provider, gnosisRelay, this, this.dependencies);
    this.hotLoading = new HotLoading(this);
    this.zeroX =
      meshClient && browserMesh
        ? new ZeroX(this, meshClient, browserMesh)
        : undefined;
    if (enableFlexSearch && !this.syncableFlexSearch) {
      this.syncableFlexSearch = new SyncableFlexSearch();
    }
    this.registerTransactionStatusEvents();
  }

  static async create<TProvider extends Provider = Provider>(
    provider: TProvider,
    dependencies: ContractDependenciesGnosis,
    addresses: ContractAddresses,
    connector: BaseConnector = new SingleThreadConnector(),
    gnosisRelay: IGnosisRelayAPI = undefined,
    enableFlexSearch = false,
    meshClient: WSClient = undefined,
    meshBrowser: BrowserMesh = undefined
  ): Promise<Augur> {
    const networkId = await provider.getNetworkId();
    const augur = new Augur<TProvider>(
      provider,
      dependencies,
      networkId,
      addresses,
      connector,
      gnosisRelay,
      enableFlexSearch,
      meshClient,
      meshBrowser
    );

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

  async signMessage(message: Arrayish) {
    return this.dependencies.signer.signMessage(message);
  }

  async getTimestamp(): Promise<BigNumber> {
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
      data: '0x00',
      value,
    };
    const ethersTransaction = this.dependencies.transactionToEthersTransaction(
      transaction
    );
    await this.dependencies.signer.sendTransaction(ethersTransaction);
  }

  async updateGnosisSafe(payload: GnosisSafeStatusPayload): Promise<void> {}

  setGnosisSafeAddress(safeAddress: string): void {
    this.dependencies.setSafeAddress(safeAddress);
  }

  setUseGnosisSafe(useSafe: boolean): void {
    this.dependencies.setUseSafe(useSafe);
  }

  setUseGnosisRelay(useRelay: boolean): void {
    this.dependencies.setUseRelay(useRelay);
  }

  checkSafe(owner:Address, safe: Address): Promise<GnosisSafeStateReponse> {
    return this.gnosis.getGnosisSafeDeploymentStatusViaRelay({
      owner,
      safe,
    });
  }

  getUniverse(address: string): ContractInterfaces.Universe {
    return this.contracts.universeFromAddress(address);
  }

  getMarket(address: string): ContractInterfaces.Market {
    return new ContractInterfaces.Market(this.dependencies, address);
  }

  getOrders(): ContractInterfaces.Orders {
    return new ContractInterfaces.Orders(
      this.dependencies,
      this.addresses.Orders
    );
  }

  registerTransactionStatusCallback(
    key: string,
    callback: TransactionStatusCallback
  ): void {
    this.dependencies.registerTransactionStatusCallback(key, callback);
  }

  deRegisterTransactionStatusCallback(key: string): void {
    this.dependencies.deRegisterTransactionStatusCallback(key);
  }

  deRegisterAllTransactionStatusCallbacks(): void {
    this.dependencies.deRegisterAllTransactionStatusCallbacks();
  }

  async connect(ethNodeUrl: string, account?: string): Promise<any> {
    return this.connector.connect(ethNodeUrl, account);
  }

  async disconnect(): Promise<any> {
    return this.connector.disconnect();
  }

  bindTo<R, P>(
    f: (db: any, augur: any, params: P) => Promise<R>
  ): (params: P) => Promise<R> {
    return this.connector && this.connector.bindTo(f);
  }

  async on(
    eventName: SubscriptionEventName | TXEventName | string,
    callback: Callback | TXStatusCallback
  ): Promise<void> {
    if (isSubscriptionEventName(eventName)) {
      return this.connector.on(eventName, callback as Callback);
    } else if (eventName === TXEventName.AwaitingSigning) {
      this.txAwaitingSigningCallback = callback;
    } else if (eventName === TXEventName.Pending) {
      this.txPendingCallback = callback;
    } else if (eventName === TXEventName.Success) {
      this.txSuccessCallback = callback;
    } else if (eventName === TXEventName.Failure) {
      this.txFailureCallback = callback;
    }
  }

  async off(
    eventName: SubscriptionEventName | TXEventName | string
  ): Promise<void> {
    if (isSubscriptionEventName(eventName)) {
      return this.connector.off(eventName);
    } else if (eventName === TXEventName.AwaitingSigning) {
      this.txAwaitingSigningCallback = null;
    } else if (eventName === TXEventName.Pending) {
      this.txPendingCallback = null;
    } else if (eventName === TXEventName.Success) {
      this.txSuccessCallback = null;
    } else if (eventName === TXEventName.Failure) {
      this.txFailureCallback = null;
    }
  }

  getMarkets = (
    params: Parameters<typeof Markets.getMarkets>[2]
  ): ReturnType<typeof Markets.getMarkets> => {
    return this.bindTo(Markets.getMarkets)(params);
  };

  getMarketsInfo = (
    params: Parameters<typeof Markets.getMarketsInfo>[2]
  ): ReturnType<typeof Markets.getMarketsInfo> => {
    return this.bindTo(Markets.getMarketsInfo)(params);
  };

  getSyncData = () => {
    return this.bindTo(Status.getSyncData)({});
  };

  getZeroXOrders = (
    params: Parameters<typeof ZeroXOrdersGetters.getZeroXOrders>[2]
  ) => {
    delete params.sortBy;
    return this.bindTo(ZeroXOrdersGetters.getZeroXOrders)(params);
  };

  syncUserData(account: string): void {
    this.connector.syncUserData(account);
  };

  get signer(): EthersSigner {
    return this.dependencies.signer;
  }

  set signer(signer: EthersSigner)  {
    this.dependencies.signer = signer;
  };

  getTradingHistory = (
    params: Parameters<typeof Trading.getTradingHistory>[2]
  ): ReturnType<typeof Trading.getTradingHistory> => {
    return this.bindTo(Trading.getTradingHistory)(params);
  };
  getAllOrders = (
    params: Parameters<typeof Trading.getAllOrders>[2]
  ): ReturnType<typeof Trading.getAllOrders> => {
    return this.bindTo(Trading.getAllOrders)(params);
  };
  getTradingOrders = (
    params: Parameters<typeof Trading.getOrders>[2]
  ): ReturnType<typeof Trading.getOrders> => {
    return this.bindTo(Trading.getOrders)(params);
  };
  getMarketOrderBook = (
    params: Parameters<typeof Markets.getMarketOrderBook>[2]
  ): ReturnType<typeof Markets.getMarketOrderBook> => {
    return this.bindTo(Markets.getMarketOrderBook)(params);
  };

  getMarketPriceCandlesticks = (
    params: Parameters<typeof Markets.getMarketPriceCandlesticks>[2]
  ): ReturnType<typeof Markets.getMarketPriceCandlesticks> => {
    return this.bindTo(Markets.getMarketPriceCandlesticks)(params);
  };
  getMarketLiquidityRanking = this.bindTo(
    LiquidityGetter.getMarketLiquidityRanking
  );
  getUserTradingPositions = (
    params: Parameters<typeof Users.getUserTradingPositions>[2]
  ): ReturnType<typeof Users.getUserTradingPositions> => {
    return this.bindTo(Users.getUserTradingPositions)(params);
  };
  getProfitLoss = (
    params: Parameters<typeof Users.getProfitLoss>[2]
  ): ReturnType<typeof Users.getProfitLoss> => {
    return this.bindTo(Users.getProfitLoss)(params);
  };
  getProfitLossSummary = (
    params: Parameters<typeof Users.getProfitLossSummary>[2]
  ): ReturnType<typeof Users.getProfitLossSummary> => {
    return this.bindTo(Users.getProfitLossSummary)(params);
  };
  getAccountTimeRangedStats = (
    params: Parameters<typeof Users.getAccountTimeRangedStats>[2]
  ): ReturnType<typeof Users.getAccountTimeRangedStats> => {
    return this.bindTo(Users.getAccountTimeRangedStats)(params);
  };
  getUserAccountData = this.bindTo(Users.getUserAccountData);
  getAccountTransactionHistory = this.bindTo(
    Accounts.getAccountTransactionHistory
  );
  getAccountRepStakeSummary = (
    params: Parameters<typeof Accounts.getAccountRepStakeSummary>[2]
  ): ReturnType<typeof Accounts.getAccountRepStakeSummary> => {
    return this.bindTo(Accounts.getAccountRepStakeSummary)(params);
  };

  getUserCurrentDisputeStake = (
    params: Parameters<typeof Accounts.getUserCurrentDisputeStake>[2]
  ): ReturnType<typeof Accounts.getUserCurrentDisputeStake> => {
    return this.bindTo(Accounts.getUserCurrentDisputeStake)(params);
  };
  getPlatformActivityStats = (
    params: Parameters<typeof Platform.getPlatformActivityStats>[2]
  ): ReturnType<typeof Platform.getPlatformActivityStats> => {
    return this.bindTo(Platform.getPlatformActivityStats)(params);
  };
  getCategoryStats = (
    params: Parameters<typeof Markets.getCategoryStats>[2]
  ): ReturnType<typeof Markets.getCategoryStats> => {
    return this.bindTo(Markets.getCategoryStats)(params);
  };

  async hotloadMarket(marketId: string) {
    return this.hotLoading.getMarketDataParams({ market: marketId });
  }

  async getDisputeWindow(params: GetDisputeWindowParams): Promise<DisputeWindow> {
    return this.hotLoading.getCurrentDisputeWindowData(params);
  }


  getAugurEventEmitter(): EventNameEmitter {
    return this.subscriptions;
  }

  async simulateTrade(
    params: PlaceTradeDisplayParams
  ): Promise<SimulateTradeData> {
    return this.trade.simulateTrade(params);
  }

  async placeTrade(params: PlaceTradeDisplayParams): Promise<void> {
    return this.trade.placeTrade(params);
  }

  async createYesNoMarket(
    params: CreateYesNoMarketParams
  ): Promise<ContractInterfaces.Market> {
    return this.market.createYesNoMarket(params);
  }

  async createCategoricalMarket(
    params: CreateCategoricalMarketParams
  ): Promise<ContractInterfaces.Market> {
    return this.market.createCategoricalMarket(params);
  }

  async createScalarMarket(
    params: CreateScalarMarketParams
  ): Promise<ContractInterfaces.Market> {
    return this.market.createScalarMarket(params);
  }

  async simulateTradeGasLimit(
    params: PlaceTradeDisplayParams
  ): Promise<BigNumber> {
    return this.trade.simulateTradeGasLimit(params);
  }

  getUniverseChildren = (
    params: Parameters<typeof Universe.getUniverseChildren>[2]
  ): ReturnType<typeof Universe.getUniverseChildren> => {
    return this.bindTo(Universe.getUniverseChildren)(params);
  };

  private registerTransactionStatusEvents() {
    this.registerTransactionStatusCallback(
      'Transaction Status Handler',
      (transaction, status, hash) => {
        if (status === TransactionStatus.SUCCESS && this.txSuccessCallback) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.Success,
            hash,
          } as TXStatus;
          this.txSuccessCallback(txn);
        } else if (
          status === TransactionStatus.AWAITING_SIGNING &&
          this.txAwaitingSigningCallback
        ) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.AwaitingSigning,
            hash,
          } as TXStatus;
          this.txAwaitingSigningCallback(txn);
        } else if (
          status === TransactionStatus.PENDING &&
          this.txPendingCallback
        ) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.Pending,
            hash,
          } as TXStatus;
          this.txPendingCallback(txn);
        } else if (
          status === TransactionStatus.FAILURE &&
          this.txFailureCallback
        ) {
          const txn: TXStatus = {
            transaction,
            eventName: TXEventName.Failure,
            hash,
          } as TXStatus;
          this.txFailureCallback(txn);
        }
      }
    );
  }
}
