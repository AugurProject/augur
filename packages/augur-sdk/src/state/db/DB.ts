import Dexie from 'dexie';
import { Augur } from '../../Augur';
import { SubscriptionEventName } from '../../constants';
import {
  LogCallbackType,
  LogFilterAggregatorInterface,
} from '../logs/LogFilterAggregator';
import {
  CancelledOrderLog,
  CancelLog,
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
  MarketVolumeChangedLog, OrderEventLog,
  ParsedOrderEventLog,
  ParticipationTokensRedeemedLog,
  ProfitLossChangedLog,
  ReportingParticipantDisavowedLog,
  ShareTokenBalanceChangedLog,
  TimestampSetLog,
  TokenBalanceChangedLog,
  TokensMinted,
  TokensTransferredLog,
  TradingProceedsClaimedLog,
  TransferBatchLog,
  TransferSingleLog,
  UniverseCreatedLog,
  UniverseForkedLog,
} from '../logs/types';
import { BaseSyncableDB } from './BaseSyncableDB';
import { CancelledOrdersDB } from './CancelledOrdersDB';
import { CurrentOrdersDatabase } from './CurrentOrdersDB';
import { DelayedSyncableDB } from './DelayedSyncableDB';
import { DisputeDatabase } from './DisputeDB';
import { MarketDB } from './MarketDB';
import { ParsedOrderEventDB } from './ParsedOrderEventDB';
import { SyncableDB } from './SyncableDB';
import { SyncStatus } from './SyncStatus';
import { WarpCheckpoints } from './WarpCheckpoints';
import { StoredOrder, ZeroXOrders } from './ZeroXOrders';

interface Schemas {
  [table: string]: string;
}

export interface DerivedDBConfiguration {
  name: string;
  eventNames?: string[];
  idFields?: string[];
}

export class DB {
  private blockstreamDelay: number;
  private syncableDatabases: { [dbName: string]: BaseSyncableDB } = {};
  private disputeDatabase: DisputeDatabase;
  private currentOrdersDatabase: CurrentOrdersDatabase;
  private marketDatabase: MarketDB;
  private cancelledOrdersDatabase: CancelledOrdersDB;
  private parsedOrderEventDatabase: ParsedOrderEventDB;
  private zeroXOrders: ZeroXOrders;
  syncStatus: SyncStatus;
  warpCheckpoints: WarpCheckpoints;

  readonly genericEventDBDescriptions: GenericEventDBDescription[] = [
    { EventName: 'CompleteSetsPurchased', indexes: ['timestamp'] },
    { EventName: 'CompleteSetsSold', indexes: ['timestamp'] },
    { EventName: 'DisputeCrowdsourcerCompleted', indexes: ['market', 'timestamp', 'disputeCrowdsourcer'] },
    { EventName: 'DisputeCrowdsourcerContribution', indexes: ['timestamp', 'market', '[universe+reporter]'] },
    { EventName: 'DisputeCrowdsourcerCreated', indexes: ['disputeCrowdsourcer'] },
    { EventName: 'DisputeCrowdsourcerRedeemed', indexes: ['timestamp', 'reporter'] },
    { EventName: 'DisputeWindowCreated', indexes: [] },
    { EventName: 'InitialReporterRedeemed', indexes: ['timestamp', 'reporter'] },
    { EventName: 'InitialReportSubmitted', indexes: ['timestamp', 'reporter', '[universe+reporter]'] },
    { EventName: 'InitialReporterTransferred', indexes: [] },
    { EventName: 'MarketCreated', indexes: ['market', 'timestamp', '[universe+timestamp]'] },
    { EventName: 'MarketFinalized', indexes: ['market'] },
    { EventName: 'MarketMigrated', indexes: ['market'] },
    { EventName: 'MarketParticipantsDisavowed', indexes: [] },
    { EventName: 'MarketTransferred', indexes: [] },
    { EventName: 'MarketVolumeChanged', indexes: [], primaryKey: 'market' },
    { EventName: 'MarketOIChanged', indexes: [], primaryKey: 'market' },
    { EventName: 'OrderEvent', indexes: ['market', 'timestamp', 'orderId', '[universe+eventType+timestamp]', '[market+eventType]', 'eventType', 'orderCreator', 'orderFiller'] },
    { EventName: 'Cancel', indexes: [], primaryKey: 'orderHash' },
    { EventName: 'ParticipationTokensRedeemed', indexes: ['timestamp'] },
    { EventName: 'ProfitLossChanged', indexes: ['[universe+account+timestamp]', 'account'] },
    { EventName: 'ReportingParticipantDisavowed', indexes: [] },
    { EventName: 'TimestampSet', indexes: ['newTimestamp'] },
    { EventName: 'TokenBalanceChanged', indexes: ['[universe+owner+tokenType]'], primaryKey: '[owner+token]' },
    { EventName: 'TokensMinted', indexes: [] },
    { EventName: 'TokensTransferred', indexes: [] },
    { EventName: 'TradingProceedsClaimed', indexes: ['timestamp'] },
    { EventName: 'UniverseCreated', indexes: ['childUniverse', 'parentUniverse'] },
    { EventName: 'UniverseForked', indexes: ['universe'] },
    { EventName: 'TransferSingle', indexes: []},
    { EventName: 'TransferBatch', indexes: []},
    { EventName: 'ShareTokenBalanceChanged', indexes: ['[universe+account]'], primaryKey: '[account+market+outcome]'},
  ];

  constructor(readonly dexieDB: Dexie, readonly logFilters: LogFilterAggregatorInterface, private augur:Augur) {
    logFilters.listenForBlockRemoved(this.rollback.bind(this));
  }

  /**
   * Creates and returns a new dbController.
   *
   * @param {number} networkId Network on which to sync events
   * @param logFilterAggregator object responsible for routing logs to individual db tables.
   * @param augur
   * @param uploadBlockNumber
   * @returns {Promise<DB>} Promise to a DB controller object
   */
  static createAndInitializeDB(networkId: number, logFilterAggregator:LogFilterAggregatorInterface, augur: Augur, enableZeroX= false): Promise<DB> {
    const dbName = `augur-${networkId}`;
    const dbController = new DB(new Dexie(dbName), logFilterAggregator, augur);

    dbController.augur = augur;

    return dbController.initializeDB(networkId, enableZeroX);
  }

  /**
   * Creates databases to be used for syncing.
   *
   * @param {number} networkId Network on which to sync events
   * @param uploadBlockNumber
   * @return {Promise<void>}
   */
  async initializeDB(networkId: number, enableZeroX: boolean, uploadBlockNumber = 0): Promise<DB> {
    const schemas = this.generateSchemas();

    this.dexieDB.version(1).stores(schemas);

    await this.dexieDB.open();

    this.syncStatus = new SyncStatus(networkId, uploadBlockNumber, this);
    this.warpCheckpoints = new WarpCheckpoints(networkId, this);

    // Create SyncableDBs for generic event types & UserSyncableDBs for user-specific event types
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      new SyncableDB(this.augur, this, networkId, genericEventDBDescription.EventName, genericEventDBDescription.EventName, genericEventDBDescription.indexes);

      if(genericEventDBDescription.primaryKey) {
        new DelayedSyncableDB(this.augur, this, networkId, genericEventDBDescription.EventName, `${genericEventDBDescription.EventName}Rollup`, genericEventDBDescription.indexes);
      }
    }
    // Custom Derived DBs here
    this.disputeDatabase = new DisputeDatabase(this, networkId, 'Dispute', ['InitialReportSubmitted', 'DisputeCrowdsourcerCreated', 'DisputeCrowdsourcerContribution', 'DisputeCrowdsourcerCompleted'], this.augur);
    this.currentOrdersDatabase = new CurrentOrdersDatabase(this, networkId, 'CurrentOrders', ['OrderEvent'], this.augur);
    this.marketDatabase = new MarketDB(this, networkId, this.augur);
    this.parsedOrderEventDatabase = new ParsedOrderEventDB(this, networkId, this.augur);
    this.cancelledOrdersDatabase = new CancelledOrdersDB(this, networkId, this.augur);

    if (enableZeroX) {
      this.zeroXOrders = ZeroXOrders.create(this, networkId, this.augur);
    }

    // Always start syncing from 10 blocks behind the lowest
    // last-synced block (in case of restarting after a crash)
    const startSyncBlockNumber = await this.getSyncStartingBlock();
    if (startSyncBlockNumber > this.syncStatus.defaultStartSyncBlockNumber) {
      console.log('Performing rollback of block ' + startSyncBlockNumber + ' onward');
      await this.rollback(startSyncBlockNumber);
    }

    return this;
  }

  generateSchemas() : Schemas {
    const schemas: Schemas = {};
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      if (genericEventDBDescription.primaryKey) {
        const fields = [genericEventDBDescription.primaryKey,'blockNumber'].concat(genericEventDBDescription.indexes);
        schemas[`${genericEventDBDescription.EventName}Rollup`] = fields.join(',');
      }
      const fields = ['[blockNumber+logIndex]','blockNumber'].concat(genericEventDBDescription.indexes);
      schemas[genericEventDBDescription.EventName] = fields.join(',');
    }
    schemas['Markets'] = 'market,reportingState,universe,marketCreator,timestamp,finalized,blockNumber';
    schemas['CurrentOrders'] = 'orderId,[market+open],[market+outcome+orderType],orderCreator,orderFiller,blockNumber';
    schemas['Dispute'] = '[market+payoutNumerators],market,blockNumber';
    schemas['ParsedOrderEvents'] = '[blockNumber+logIndex],blockNumber,market,timestamp,orderId,[universe+eventType+timestamp],[market+eventType],eventType,orderCreator,orderFiller';
    schemas['ZeroXOrders'] = 'orderHash,[market+outcome+orderType],orderCreator,blockNumber';
    schemas['CancelledOrders'] = 'orderHash,[makerAddress+market]';
    schemas['SyncStatus'] = 'eventName,blockNumber,syncing';
    schemas['Rollback'] = ',[tableName+rollbackBlockNumber]';
    schemas['WarpCheckpoints'] = '++_id,begin.number,end.number';
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

  registerEventListener(eventNames: string | string[], callback: LogCallbackType): void {
    this.logFilters.listenForEvent(eventNames, callback);
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
      highestSyncBlocks.push(await this.syncStatus.getHighestSyncBlock(genericEventDBDescription.EventName));
    }

    return Math.min(...highestSyncBlocks);
  }

  /**
   * Rolls back all blocks from blockNumber onward.
   *
   * @param {number} blockNumber Oldest block number to delete
   */
  rollback = async (blockNumber: number): Promise<void> => {
    const dbRollbackPromises = [];
    // Perform rollback on SyncableDBs & UserSyncableDBs
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      const dbName = genericEventDBDescription.EventName;
      dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
    }

    // Perform rollback on derived DBs
    dbRollbackPromises.push(this.disputeDatabase.rollback(blockNumber));
    dbRollbackPromises.push(this.currentOrdersDatabase.rollback(blockNumber));
    dbRollbackPromises.push(this.marketDatabase.rollback(blockNumber));
    dbRollbackPromises.push(this.parsedOrderEventDatabase.rollback(blockNumber));

    // TODO Figure out a way to handle concurrent request limit of 40
    await Promise.all(dbRollbackPromises).catch(error => { throw error; });
  }

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

      const highestSyncBlock = await this.syncStatus.getHighestSyncBlock(dbName);
      if (highestSyncBlock !== blockLogs[0].blockNumber) {
        throw new Error('Highest sync block is ' + highestSyncBlock + '; newest block number is ' + blockLogs[0].blockNumber);
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Queries a DB to get a row count.
   *
   * @param {string} dbName Name of the DB to query
   * @param request Optional request Query object to narrow results
   * @returns {Promise<number>} Promise to a number of rows
   */
  async getNumRowsFromDB(dbName: string, request?: {}): Promise<number> {
    const fullDBName = dbName;
    const table: Dexie.Table<any, any> = this.dexieDB[fullDBName];

    if (request) {
      const results = await table.where(request);
      return results.count();
    }

    return table.count();
  }

  get CompleteSetsPurchased() { return this.dexieDB.table<CompleteSetsPurchasedLog>('CompleteSetsPurchased'); }
  get CompleteSetsSold() { return this.dexieDB.table<CompleteSetsSoldLog>('CompleteSetsSold'); }
  get DisputeCrowdsourcerContribution() { return this.dexieDB.table<DisputeCrowdsourcerContributionLog>('DisputeCrowdsourcerContribution'); }
  get DisputeCrowdsourcerCompleted() { return this.dexieDB.table<DisputeCrowdsourcerCompletedLog>('DisputeCrowdsourcerCompleted'); }
  get DisputeCrowdsourcerCreated() { return this.dexieDB.table<DisputeCrowdsourcerCreatedLog>('DisputeCrowdsourcerCreated'); }
  get DisputeCrowdsourcerRedeemed() { return this.dexieDB.table<DisputeCrowdsourcerRedeemedLog>('DisputeCrowdsourcerRedeemed'); }
  get DisputeWindowCreated() { return this.dexieDB.table<DisputeWindowCreatedLog>('DisputeWindowCreated'); }
  get InitialReporterRedeemed() { return this.dexieDB.table<InitialReporterRedeemedLog>('InitialReporterRedeemed'); }
  get InitialReportSubmitted() { return this.dexieDB.table<InitialReportSubmittedLog>('InitialReportSubmitted'); }
  get InitialReporterTransferred() { return this.dexieDB.table<InitialReporterTransferredLog>('InitialReporterTransferred'); }
  get MarketCreated() { return this.dexieDB.table<MarketCreatedLog>('MarketCreated'); }
  get MarketFinalized() { return this.dexieDB.table<MarketFinalizedLog>('MarketFinalized'); }
  get MarketMigrated() { return this.dexieDB.table<MarketMigratedLog>('MarketMigrated'); }
  get MarketParticipantsDisavowed() { return this.dexieDB.table<MarketParticipantsDisavowedLog>('MarketParticipantsDisavowed'); }
  get MarketTransferred() { return this.dexieDB.table<MarketTransferredLog>('MarketTransferred'); }
  get MarketVolumeChanged() { return this.dexieDB.table<MarketVolumeChangedLog>('MarketVolumeChanged'); }
  get MarketVolumeChangedRollup() { return this.dexieDB.table<MarketVolumeChangedLog>('MarketVolumeChangedRollup'); }
  get MarketOIChanged() { return this.dexieDB.table<MarketOIChangedLog>('MarketOIChanged'); }
  get MarketOIChangedRollup() { return this.dexieDB.table<MarketOIChangedLog>('MarketOIChangedRollup'); }
  get OrderEvent() { return this.dexieDB.table<OrderEventLog>('OrderEvent'); }
  get Cancel() { return this.dexieDB['Cancel'] as Dexie.Table<CancelLog, any>; }
  get CancelRollup() { return this.dexieDB['CancelRollup'] as Dexie.Table<CancelLog, any>; }
  get CancelledOrders() { return this.dexieDB['CancelledOrders'] as Dexie.Table<CancelledOrderLog, any>; }
  get ParticipationTokensRedeemed() { return this.dexieDB.table<ParticipationTokensRedeemedLog>('ParticipationTokensRedeemed'); }
  get ProfitLossChanged() { return this.dexieDB.table<ProfitLossChangedLog>('ProfitLossChanged'); }
  get ReportingParticipantDisavowed() { return this.dexieDB.table<ReportingParticipantDisavowedLog>('ReportingParticipantDisavowed'); }
  get TimestampSet() { return this.dexieDB.table<TimestampSetLog>('TimestampSet'); }
  get TokenBalanceChanged() { return this.dexieDB.table<TokenBalanceChangedLog>('TokenBalanceChanged'); }
  get TokenBalanceChangedRollup() { return this.dexieDB.table<TokenBalanceChangedLog>('TokenBalanceChangedRollup'); }
  get TokensMinted() { return this.dexieDB.table<TokensMinted>('TokensMinted'); }
  get TokensTransferred() { return this.dexieDB.table<TokensTransferredLog>('TokensTransferred'); }
  get TradingProceedsClaimed() { return this.dexieDB.table<TradingProceedsClaimedLog>('TradingProceedsClaimed'); }
  get UniverseCreated() { return this.dexieDB.table<UniverseCreatedLog>('UniverseCreated'); }
  get UniverseForked() { return this.dexieDB.table<UniverseForkedLog>('UniverseForked'); }
  get TransferSingle() { return this.dexieDB.table<TransferSingleLog>('TransferSingle'); }
  get TransferBatch() { return this.dexieDB.table<TransferBatchLog>('TransferBatch'); }
  get ShareTokenBalanceChanged() { return this.dexieDB.table<ShareTokenBalanceChangedLog>('ShareTokenBalanceChanged'); }
  get ShareTokenBalanceChangedRollup() { return this.dexieDB.table<ShareTokenBalanceChangedLog>('ShareTokenBalanceChangedRollup'); }
  get Markets() { return this.dexieDB.table<MarketData>('Markets'); }
  get ParsedOrderEvent() { return this.dexieDB.table<ParsedOrderEventLog>('ParsedOrderEvents'); }
  get Dispute() { return this.dexieDB.table<DisputeDoc>('Dispute'); }
  get CurrentOrders() { return this.dexieDB.table<CurrentOrder>('CurrentOrders'); }
  get ZeroXOrders() { return this.dexieDB.table<StoredOrder>('ZeroXOrders'); }
}
