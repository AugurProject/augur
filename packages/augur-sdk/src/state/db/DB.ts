import {
  CancelZeroXOrderLog,
  CompleteSetsPurchasedLog,
  CompleteSetsSoldLog,
  CurrentOrder,
  DisputeCrowdsourcerCompletedLog,
  DisputeCrowdsourcerContributionLog,
  DisputeCrowdsourcerCreatedLog,
  DisputeCrowdsourcerRedeemedLog,
  DisputeDoc,
  DisputeWindowCreatedLog,
  GenericEventDBDescription,
  InitialReporterRedeemedLog,
  InitialReporterTransferredLog,
  InitialReportSubmittedLog,
  MarketCreatedLog,
  MarketData,
  MarketFinalizedLog,
  MarketMigratedLog,
  MarketOIChangedLog,
  MarketParticipantsDisavowedLog,
  MarketTransferredLog,
  MarketVolumeChangedLog,
  OrderEventLog,
  ParsedOrderEventLog,
  ParticipationTokensRedeemedLog,
  ProfitLossChangedLog,
  ReportingFeeChangedLog,
  ReportingParticipantDisavowedLog,
  SECONDS_IN_A_DAY,
  ShareTokenBalanceChangedLog,
  SubscriptionEventName,
  TimestampSetLog,
  TokenBalanceChangedLog,
  TokensMinted,
  TokensTransferredLog,
  TradingProceedsClaimedLog,
  TransferBatchLog,
  TransferSingleLog,
  UniverseCreatedLog,
  UniverseForkedLog,
} from '@augurproject/sdk-lite';
import Dexie from 'dexie';
import { Augur } from '../../Augur';
import {
  LogCallbackType,
  LogFilterAggregatorInterface,
} from '../logs/LogFilterAggregator';
import { BaseSyncableDB } from './BaseSyncableDB';
import { DelayedSyncableDB } from './DelayedSyncableDB';
import { DisputeDatabase } from './DisputeDB';
import { MarketDB } from './MarketDB';
import { ParsedOrderEventDB } from './ParsedOrderEventDB';
import { SyncableDB } from './SyncableDB';
import { SyncStatus } from './SyncStatus';
import { WarpSyncCheckpointsDB } from './WarpSyncCheckpointsDB';
import { StoredOrder, ZeroXOrders } from './ZeroXOrders';
import { GetterCache } from './GetterCache';

interface Schemas {
  [table: string]: string;
}

// Prune horizon is 60 days.
const PRUNE_HORIZON = SECONDS_IN_A_DAY.multipliedBy(60).toNumber();

export class DB {
  private syncableDatabases: { [dbName: string]: BaseSyncableDB } = {};
  private disputeDatabase: DisputeDatabase;
  private currentOrdersDatabase: ParsedOrderEventDB;
  private _marketDatabase: MarketDB;
  private parsedOrderEventDatabase: ParsedOrderEventDB;
  private zeroXOrders: ZeroXOrders;
  getterCache: GetterCache;
  syncStatus: SyncStatus;
  warpCheckpoints: WarpSyncCheckpointsDB;

  readonly genericEventDBDescriptions: GenericEventDBDescription[] = [
    { EventName: 'CompleteSetsPurchased', indexes: ['timestamp', 'market'] },
    { EventName: 'CompleteSetsSold', indexes: ['timestamp', 'market'] },
    {
      EventName: 'DisputeCrowdsourcerCompleted',
      indexes: ['market', 'timestamp', 'disputeCrowdsourcer'],
    },
    {
      EventName: 'DisputeCrowdsourcerContribution',
      indexes: ['timestamp', 'market', '[universe+reporter]'],
    },
    {
      EventName: 'DisputeCrowdsourcerCreated',
      indexes: ['disputeCrowdsourcer', 'market'],
    },
    {
      EventName: 'DisputeCrowdsourcerRedeemed',
      indexes: ['timestamp', 'reporter', 'market'],
    },
    { EventName: 'DisputeWindowCreated', indexes: ['market'] },
    {
      EventName: 'InitialReporterRedeemed',
      indexes: ['timestamp', 'reporter', 'market'],
    },
    {
      EventName: 'InitialReportSubmitted',
      indexes: ['timestamp', 'reporter', '[universe+reporter]', 'market'],
    },
    { EventName: 'InitialReporterTransferred', indexes: ['market', 'to'] },
    {
      EventName: 'MarketCreated',
      indexes: ['market', 'timestamp', '[universe+timestamp]'],
    },
    { EventName: 'MarketFinalized', indexes: ['market', 'timestamp'] },
    { EventName: 'MarketMigrated', indexes: ['market'] },
    { EventName: 'MarketParticipantsDisavowed', indexes: ['market'] },
    { EventName: 'MarketTransferred', indexes: ['market'] },
    {
      EventName: 'MarketVolumeChanged',
      indexes: ['market'],
      primaryKey: 'market',
    },
    { EventName: 'MarketOIChanged', indexes: ['market'], primaryKey: 'market' },
    {
      EventName: 'OrderEvent',
      indexes: [
        'market',
        'timestamp',
        'orderId',
        '[universe+eventType+timestamp]',
        '[market+eventType]',
        'eventType',
        'orderCreator',
        'orderFiller',
      ],
    },
    { EventName: 'CancelZeroXOrder', indexes: ['[account+market]', 'market'] },
    { EventName: 'ParticipationTokensRedeemed', indexes: ['timestamp'] },
    {
      EventName: 'ProfitLossChanged',
      indexes: ['[universe+account+timestamp]', 'account', 'market'],
    },
    { EventName: 'ReportingParticipantDisavowed', indexes: ['market'] },
    { EventName: 'TimestampSet', indexes: ['newTimestamp'] },
    {
      EventName: 'TokenBalanceChanged',
      indexes: ['[universe+owner+tokenType]'],
      primaryKey: '[owner+token]',
    },
    { EventName: 'TokensMinted', indexes: [] },
    { EventName: 'TokensTransferred', indexes: [] },
    { EventName: 'ReportingFeeChanged', indexes: ['universe'] },
    { EventName: 'TradingProceedsClaimed', indexes: ['timestamp', 'market'] },
    {
      EventName: 'UniverseCreated',
      indexes: ['childUniverse', 'parentUniverse'],
    },
    { EventName: 'UniverseForked', indexes: ['universe'] },
    { EventName: 'TransferSingle', indexes: [] },
    { EventName: 'TransferBatch', indexes: [] },
    {
      EventName: 'ShareTokenBalanceChanged',
      indexes: ['[universe+account]', 'market'],
      primaryKey: '[account+market+outcome]',
    },
  ];

  constructor(
    readonly dexieDB: Dexie,
    readonly logFilters: LogFilterAggregatorInterface,
    private augur: Augur,
    private networkId: number,  // NB: Should pass in the config object here for simplicity
    private uploadBlockNumber: number,
    private enableZeroX: boolean
  ) {
    logFilters.listenForBlockRemoved(this.rollback.bind(this));
  }

  /**
   * Creates and returns a new dbController.
   *
   * @param {number} networkId Network on which to sync events
   * @param logFilterAggregator object responsible for routing logs to individual db tables.
   * @param augur
   * @param enableZeroX
   * @returns {Promise<DB>} Promise to a DB controller object
   */
  static createAndInitializeDB(
    networkId: number,
    uploadBlockNumber: number,
    logFilterAggregator: LogFilterAggregatorInterface,
    augur: Augur,
    enableZeroX = false
  ): Promise<DB> {
    const dbName = `augur-${networkId}`;
    const dbController = new DB(
      new Dexie(dbName),
      logFilterAggregator,
      augur,
      networkId,
      uploadBlockNumber,
      enableZeroX
    );

    return dbController.initializeDB();
  }

  /**
   * Creates databases to be used for syncing.
   *
   * @param {number} networkId Network on which to sync events
   * @param uploadBlockNumber
   * @return {Promise<void>}
   */
  async initializeDB(): Promise<DB> {
    const schemas = this.generateSchemas();

    this.dexieDB.version(1).stores(schemas);

    await this.dexieDB.open();

    this.syncStatus = new SyncStatus(this.networkId, this.uploadBlockNumber, this);
    this.warpCheckpoints = new WarpSyncCheckpointsDB(this.networkId, this);
    this.getterCache = GetterCache.create(this, this.networkId, this.augur);
    await this.getterCache.reset();

    // Create SyncableDBs for generic event types & UserSyncableDBs for user-specific event types
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      this.syncableDatabases[
        genericEventDBDescription.EventName
      ] = new SyncableDB(
        this.augur,
        this,
        this.networkId,
        genericEventDBDescription.EventName,
        genericEventDBDescription.EventName,
        genericEventDBDescription.indexes
      );

      if (genericEventDBDescription.primaryKey) {
        const dbName = `${genericEventDBDescription.EventName}Rollup`;
        this.syncableDatabases[dbName] = new DelayedSyncableDB(
          this.augur,
          this,
          this.networkId,
          genericEventDBDescription.EventName,
          dbName,
          genericEventDBDescription.indexes
        );
      }
    }
    // Custom Derived DBs here
    this.disputeDatabase = new DisputeDatabase(
      this,
      this.networkId,
      'Dispute',
      [
        'InitialReportSubmitted',
        'DisputeCrowdsourcerCreated',
        'DisputeCrowdsourcerContribution',
        'DisputeCrowdsourcerCompleted',
      ],
      this.augur
    );

    this.currentOrdersDatabase = new ParsedOrderEventDB(
      this,
      this.networkId,
      'CurrentOrders',
      ['OrderEvent'],
      this.augur
    );

    this._marketDatabase = new MarketDB(this, this.networkId, this.augur);

    this.parsedOrderEventDatabase = new ParsedOrderEventDB(
      this,
      this.networkId,
      'ParsedOrderEvents',
      ['OrderEvent'],
      this.augur
    );

    if (this.enableZeroX && !this.zeroXOrders) {
      this.zeroXOrders = ZeroXOrders.create(this, this.networkId, this.augur);
      if (this.augur.zeroX?.isReady()) {
        this.zeroXOrders.cacheOrdersAndSync(); // Don't await here -- this happens in the background
      } else {
        this.augur.events.once(SubscriptionEventName.ZeroXStatusReady, this.zeroXOrders.cacheOrdersAndSync);
      }
    }

    // Always start syncing from 10 blocks behind the lowest
    // last-synced block (in case of restarting after a crash)
    const startSyncBlockNumber = await this.getSyncStartingBlock() - 1;
    if (startSyncBlockNumber > this.syncStatus.defaultStartSyncBlockNumber) {
      console.log(
        `Performing rollback block ${startSyncBlockNumber} onward`
      );
      await this.rollback(startSyncBlockNumber);
    } else {
      console.log()
    }

    await this.disputeDatabase.reset();
    await this._marketDatabase.reset();


    const universeCreatedLogCount = await this.UniverseCreated.count();
    if (universeCreatedLogCount > 0) {
      const currentUniverseCreateLogCount = await this.UniverseCreated.where(
        'childUniverse'
      )
        .equalsIgnoreCase(this.augur.contracts.universe.address)
        .count();

      if (currentUniverseCreateLogCount === 0) {
        // Need to reset the db if we have universe created logs from a previous deployment.
        await this.delete();
        await this.initializeDB();
      }
    }

    return this;
  }

  get marketDatabase(): MarketDB {
    return this._marketDatabase;
  }

  // Remove databases and unregister event handlers.
  async delete() {
    for (const db of Object.values(this.syncableDatabases)) {
      await db.delete();
    }
    this.getterCache.delete();

    this.syncableDatabases = {};

    this.disputeDatabase = undefined;
    this.currentOrdersDatabase = undefined;
    this._marketDatabase = undefined;
    this.parsedOrderEventDatabase = undefined;
    this.getterCache = undefined;

    this.dexieDB.close();
  }

  generateSchemas(): Schemas {
    const schemas: Schemas = {};
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      if (genericEventDBDescription.primaryKey) {
        const fields = [
          genericEventDBDescription.primaryKey,
          'blockNumber',
        ].concat(genericEventDBDescription.indexes);
        schemas[`${genericEventDBDescription.EventName}Rollup`] = fields.join(
          ','
        );
      }
      const fields = ['[blockNumber+logIndex]', 'blockNumber'].concat(
        genericEventDBDescription.indexes
      );
      schemas[genericEventDBDescription.EventName] = fields.join(',');
    }
    schemas['Markets'] =
      'market,reportingState,universe,marketCreator,timestamp,finalized,blockNumber,groupHash,liquidityPool';
    schemas['CurrentOrders'] =
      'orderId,[market+open],[market+outcome+orderType],orderCreator,orderFiller,blockNumber';
    schemas['Dispute'] = '[market+payoutNumerators],market,blockNumber';
    schemas['ParsedOrderEvents'] =
      '[blockNumber+logIndex],blockNumber,market,timestamp,orderId,[universe+eventType+timestamp],[market+eventType],eventType,orderCreator,orderFiller';
    schemas['ZeroXOrders'] =
      'orderHash,[market+outcome+orderType],orderCreator,blockNumber';
    schemas['SyncStatus'] = 'eventName,blockNumber,syncing';
    schemas['Rollback'] = ',[tableName+rollbackBlockNumber]';
    schemas['WarpSync'] = '[begin.number+end.number],end.number';
    schemas['WarpSyncCheckpoints'] = '++_id,begin.number,end.number';
    schemas['GetterCache'] = '[name+params],name,timestamp';
    return schemas;
  }

  /**
   * Called from SyncableDB constructor once SyncableDB is successfully created.
   *
   * @param {SyncableDB} db dbController that utilizes the SyncableDB
   */
  notifySyncableDBAdded(db: BaseSyncableDB): void {
    this.syncableDatabases[db.dbName] = db;
  }

  registerEventListener(
    eventNames: string | string[],
    callback: LogCallbackType
  ): void {
    this.logFilters.listenForEvent(eventNames, callback);
  }

  unregisterEventListener(
    eventNames: string | string[],
    callback: LogCallbackType
  ): void {
    this.logFilters.unlistenForEvent(eventNames, callback);
  }

  /**
   * Gets the block number at which to begin syncing. (That is, the lowest last-synced
   * block across all event log databases or the upload block number for this network.)
   *
   * @returns {Promise<number>} Promise to the block number at which to begin syncing.
   */
  async getSyncStartingBlock(): Promise<number> {
    const highestSyncBlocks = [];
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      highestSyncBlocks.push(
        await this.syncStatus.getHighestSyncBlock(
          genericEventDBDescription.EventName
        )
      );
    }

    return Math.min(...highestSyncBlocks) + 1;
  }

  /**
   * Syncs generic events and user-specific events with blockchain and updates MetaDB info.
   */
  async sync(highestAvailableBlockNumber?: number): Promise<void> {
    const dbSyncPromises = [];
    if (!highestAvailableBlockNumber) {
      highestAvailableBlockNumber = await this.augur.provider.getBlockNumber();
    }

    for (const { EventName: dbName, primaryKey } of this
      .genericEventDBDescriptions) {
      if (primaryKey) {
        dbSyncPromises.push(
          this.syncableDatabases[`${dbName}Rollup`].sync(
            highestAvailableBlockNumber
          )
        );
      }
    }

    await Promise.all(dbSyncPromises);

    // Derived DBs are synced after generic log DBs complete
    console.log('Syncing derived DBs');

    await this.disputeDatabase.sync(highestAvailableBlockNumber);
    await this.currentOrdersDatabase.sync(highestAvailableBlockNumber);
    await this.parsedOrderEventDatabase.sync(highestAvailableBlockNumber);

    // The Market DB syncs after the derived DBs, as it depends on a derived DB
    await this._marketDatabase.sync(highestAvailableBlockNumber);
  }

  async prune(timestamp: number) {
    // Discover the markets whose time has come.
    const marketsToRemove = await this.MarketFinalized.where('timestamp')
      .belowOrEqual(`0x${(timestamp - PRUNE_HORIZON).toString(16)}`)
      .toArray();

    if (marketsToRemove.length === 0) return;

    const marketIdsToRemove = marketsToRemove.map(({ market }) => market);

    // This should probably be calculated in the constructor.
    const dbsToRemoveMarketsFrom = this.genericEventDBDescriptions
      .filter(({ indexes, primaryKey }) =>
        [...indexes, primaryKey].includes('market')
      )
      .map(({ EventName }) => EventName);

    await Promise.all(
      [
        ...dbsToRemoveMarketsFrom,
        'Markets',
        'MarketVolumeChangedRollup',
        'MarketOIChangedRollup',
        'ShareTokenBalanceChangedRollup',
      ].map(dbName =>
        this[dbName]
          .where('market')
          .anyOf(marketIdsToRemove)
          .delete()
      )
    );
  }

  /**
   * Rolls back all blocks from blockNumber onward.
   *
   * @param {number} blockNumber Oldest block number to delete
   */
  rollback = async (blockNumber: number): Promise<void> => {
    const dbRollbackPromises = [];
    // Perform rollback on SyncableDBs & rollups
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      const dbName = genericEventDBDescription.EventName;
      dbRollbackPromises.push(
        this.syncableDatabases[dbName].rollback(blockNumber)
      );

      if (genericEventDBDescription.primaryKey) {
        dbRollbackPromises.push(
          this.syncableDatabases[
            `${genericEventDBDescription.EventName}Rollup`
          ].rollback(blockNumber)
        );
      }
    }

    // Perform rollback on derived DBs
    dbRollbackPromises.push(this.disputeDatabase.rollback(blockNumber));
    dbRollbackPromises.push(this.currentOrdersDatabase.rollback(blockNumber));
    dbRollbackPromises.push(this.marketDatabase.rollback(blockNumber));
    dbRollbackPromises.push(
      this.parsedOrderEventDatabase.rollback(blockNumber)
    );

    // TODO Figure out a way to handle concurrent request limit of 40
    await Promise.all(dbRollbackPromises).catch(error => {
      throw error;
    });
  };

  /**
   * Adds a new block to a SyncableDB/UserSyncableDB and updates MetaDB.
   *
   * TODO Define blockLogs interface
   *
   * @param {string} dbName Name of the database to which the block should be added
   * @param {any} blockLogs Logs from a new block
   */
  async addNewBlock(dbName: string, blockLogs: any): Promise<void> {
    const db = this.syncableDatabases[dbName];
    if (!db) {
      throw new Error('Unknown DB name: ' + dbName);
    }
    try {
      await db.addNewBlock(blockLogs[0].blockNumber, blockLogs);

      const highestSyncBlock = await this.syncStatus.getHighestSyncBlock(
        dbName
      );
      if (highestSyncBlock !== blockLogs[0].blockNumber) {
        throw new Error(
          'Highest sync block is ' +
            highestSyncBlock +
            '; newest block number is ' +
            blockLogs[0].blockNumber
        );
      }
    } catch (err) {
      throw err;
    }
  }

  get CompleteSetsPurchased() {
    return this.dexieDB.table<CompleteSetsPurchasedLog>(
      'CompleteSetsPurchased'
    );
  }
  get CompleteSetsSold() {
    return this.dexieDB.table<CompleteSetsSoldLog>('CompleteSetsSold');
  }
  get DisputeCrowdsourcerContribution() {
    return this.dexieDB.table<DisputeCrowdsourcerContributionLog>(
      'DisputeCrowdsourcerContribution'
    );
  }
  get DisputeCrowdsourcerCompleted() {
    return this.dexieDB.table<DisputeCrowdsourcerCompletedLog>(
      'DisputeCrowdsourcerCompleted'
    );
  }
  get DisputeCrowdsourcerCreated() {
    return this.dexieDB.table<DisputeCrowdsourcerCreatedLog>(
      'DisputeCrowdsourcerCreated'
    );
  }
  get DisputeCrowdsourcerRedeemed() {
    return this.dexieDB.table<DisputeCrowdsourcerRedeemedLog>(
      'DisputeCrowdsourcerRedeemed'
    );
  }
  get DisputeWindowCreated() {
    return this.dexieDB.table<DisputeWindowCreatedLog>('DisputeWindowCreated');
  }
  get InitialReporterRedeemed() {
    return this.dexieDB.table<InitialReporterRedeemedLog>(
      'InitialReporterRedeemed'
    );
  }
  get InitialReportSubmitted() {
    return this.dexieDB.table<InitialReportSubmittedLog>(
      'InitialReportSubmitted'
    );
  }
  get InitialReporterTransferred() {
    return this.dexieDB.table<InitialReporterTransferredLog>(
      'InitialReporterTransferred'
    );
  }
  get MarketCreated() {
    return this.dexieDB.table<MarketCreatedLog>('MarketCreated');
  }
  get MarketFinalized() {
    return this.dexieDB.table<MarketFinalizedLog>('MarketFinalized');
  }
  get MarketMigrated() {
    return this.dexieDB.table<MarketMigratedLog>('MarketMigrated');
  }
  get MarketParticipantsDisavowed() {
    return this.dexieDB.table<MarketParticipantsDisavowedLog>(
      'MarketParticipantsDisavowed'
    );
  }
  get MarketTransferred() {
    return this.dexieDB.table<MarketTransferredLog>('MarketTransferred');
  }
  get MarketVolumeChanged() {
    return this.dexieDB.table<MarketVolumeChangedLog>('MarketVolumeChanged');
  }
  get MarketVolumeChangedRollup() {
    return this.dexieDB.table<MarketVolumeChangedLog>(
      'MarketVolumeChangedRollup'
    );
  }
  get MarketOIChanged() {
    return this.dexieDB.table<MarketOIChangedLog>('MarketOIChanged');
  }
  get MarketOIChangedRollup() {
    return this.dexieDB.table<MarketOIChangedLog>('MarketOIChangedRollup');
  }
  get OrderEvent() {
    return this.dexieDB.table<OrderEventLog>('OrderEvent');
  }
  get CancelZeroXOrder() {
    return this.dexieDB['CancelZeroXOrder'] as Dexie.Table<
      CancelZeroXOrderLog,
      any
    >;
  }
  get ParticipationTokensRedeemed() {
    return this.dexieDB.table<ParticipationTokensRedeemedLog>(
      'ParticipationTokensRedeemed'
    );
  }
  get ProfitLossChanged() {
    return this.dexieDB.table<ProfitLossChangedLog>('ProfitLossChanged');
  }
  get ReportingParticipantDisavowed() {
    return this.dexieDB.table<ReportingParticipantDisavowedLog>(
      'ReportingParticipantDisavowed'
    );
  }
  get TimestampSet() {
    return this.dexieDB.table<TimestampSetLog>('TimestampSet');
  }
  get TokenBalanceChanged() {
    return this.dexieDB.table<TokenBalanceChangedLog>('TokenBalanceChanged');
  }
  get TokenBalanceChangedRollup() {
    return this.dexieDB.table<TokenBalanceChangedLog>(
      'TokenBalanceChangedRollup'
    );
  }
  get TokensMinted() {
    return this.dexieDB.table<TokensMinted>('TokensMinted');
  }
  get TokensTransferred() {
    return this.dexieDB.table<TokensTransferredLog>('TokensTransferred');
  }
  get TradingProceedsClaimed() {
    return this.dexieDB.table<TradingProceedsClaimedLog>(
      'TradingProceedsClaimed'
    );
  }
  get UniverseCreated() {
    return this.dexieDB.table<UniverseCreatedLog>('UniverseCreated');
  }
  get UniverseForked() {
    return this.dexieDB.table<UniverseForkedLog>('UniverseForked');
  }
  get TransferSingle() {
    return this.dexieDB.table<TransferSingleLog>('TransferSingle');
  }
  get TransferBatch() {
    return this.dexieDB.table<TransferBatchLog>('TransferBatch');
  }
  get ShareTokenBalanceChanged() {
    return this.dexieDB.table<ShareTokenBalanceChangedLog>(
      'ShareTokenBalanceChanged'
    );
  }
  get ShareTokenBalanceChangedRollup() {
    return this.dexieDB.table<ShareTokenBalanceChangedLog>(
      'ShareTokenBalanceChangedRollup'
    );
  }
  get Markets() {
    return this.dexieDB.table<MarketData>('Markets');
  }
  get ParsedOrderEvent() {
    return this.dexieDB.table<ParsedOrderEventLog>('ParsedOrderEvents');
  }
  get Dispute() {
    return this.dexieDB.table<DisputeDoc>('Dispute');
  }
  get CurrentOrders() {
    return this.dexieDB.table<CurrentOrder>('CurrentOrders');
  }
  get ZeroXOrders() {
    return this.dexieDB.table<StoredOrder>('ZeroXOrders');
  }
  get ReportingFeeChanged() {
    return this.dexieDB.table<ReportingFeeChangedLog>('ReportingFeeChanged');
  }
}
