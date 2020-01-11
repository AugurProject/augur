import { Augur } from '../../Augur';
import { SubscriptionEventName } from '../../constants';
import Dexie from 'dexie';
import { SyncableDB } from './SyncableDB';
import { SyncStatus } from './SyncStatus';
//import { LiquidityDB, LiquidityLastUpdated, MarketHourlyLiquidity } from './LiquidityDB';
import { DisputeDatabase } from './DisputeDB';
import { CurrentOrdersDatabase } from './CurrentOrdersDB';
import { MarketDB } from './MarketDB';
import { BlockAndLogStreamerListenerInterface, LogCallbackType } from './BlockAndLogStreamerListener';
import {
  CompleteSetsPurchasedLog,
  CompleteSetsSoldLog,
  DisputeCrowdsourcerCompletedLog,
  DisputeCrowdsourcerContributionLog,
  DisputeCrowdsourcerCreatedLog,
  DisputeCrowdsourcerRedeemedLog,
  DisputeWindowCreatedLog,
  GenericEventDBDescription,
  InitialReporterRedeemedLog,
  InitialReportSubmittedLog,
  InitialReporterTransferredLog,
  MarketCreatedLog,
  MarketData,
  DisputeDoc,
  MarketFinalizedLog,
  MarketMigratedLog,
  MarketVolumeChangedLog,
  MarketOIChangedLog,
  MarketParticipantsDisavowedLog,
  MarketTransferredLog,
  ParsedOrderEventLog,
  CancelLog,
  CancelledOrderLog,
  ParticipationTokensRedeemedLog,
  ProfitLossChangedLog,
  ReportingParticipantDisavowedLog,
  TimestampSetLog,
  TokenBalanceChangedLog,
  ShareTokenBalanceChangedLog,
  TokensMinted,
  TradingProceedsClaimedLog,
  TokensTransferredLog,
  TransferSingleLog,
  TransferBatchLog,
  UniverseForkedLog,
  UniverseCreatedLog,
  CurrentOrder,
} from '../logs/types';
import { ZeroXOrders, StoredOrder } from './ZeroXOrders';
import { CancelledOrdersDB } from './CancelledOrdersDB';

interface Schemas {
  [table: string]: string;
}

export interface DerivedDBConfiguration {
  name: string;
  eventNames?: string[];
  idFields?: string[];
}

export class DB {
  private networkId: number;
  private blockstreamDelay: number;
  private syncableDatabases: { [dbName: string]: SyncableDB } = {};
  //private liquidityDatabase: LiquidityDB;
  private disputeDatabase: DisputeDatabase;
  private currentOrdersDatabase: CurrentOrdersDatabase;
  private marketDatabase: MarketDB;
  private cancelledOrdersDatabase: CancelledOrdersDB;
  private zeroXOrders: ZeroXOrders;
  private blockAndLogStreamerListener: BlockAndLogStreamerListenerInterface;
  private augur: Augur;
  readonly dexieDB: Dexie;
  syncStatus: SyncStatus;

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

  constructor(dexieDB: Dexie) {
    this.dexieDB = dexieDB;
  }

  /**
   * Creates and returns a new dbController.
   *
   * @param {number} networkId Network on which to sync events
   * @param {number} blockstreamDelay Number of blocks by which to delay blockstream
   * @param {number} defaultStartSyncBlockNumber Block number at which to start sycing (if no higher block number has been synced)
   * @param {Array<string>} trackedUsers Array of user addresses for which to sync user-specific events
   * @param {Array<string>} genericEventNames Array of names for generic event types
   * @param {Array<DerivedDBConfiguration>} derivedDBConfigurations Array of custom event objects
   * @param {Array<UserSpecificDBConfiguration>} userSpecificDBConfiguration Array of user-specific event objects
   * @param {TableFactoryType} TableFactory Factory function generatin PouchDB instance
   * @param {BlockAndLogStreamerListenerInterface} blockAndLogStreamerListener Stream listener for blocks and logs
   * @returns {Promise<DB>} Promise to a DB controller object
   */
  static createAndInitializeDB(networkId: number, blockstreamDelay: number, defaultStartSyncBlockNumber: number, augur: Augur, blockAndLogStreamerListener: BlockAndLogStreamerListenerInterface): Promise<DB> {
    const dbName = `augur-${networkId}`;
    const dbController = new DB(new Dexie(dbName));

    dbController.augur = augur;

    return dbController.initializeDB(networkId, blockstreamDelay, defaultStartSyncBlockNumber, blockAndLogStreamerListener);
  }

  /**
   * Creates databases to be used for syncing.
   *
   * @param {number} networkId Network on which to sync events
   * @param {number} blockstreamDelay Number of blocks by which to delay blockstream
   * @param {number} defaultStartSyncBlockNumber Block number at which to start sycing (if no higher block number has been synced)
   * @param {Array<string>} trackedUsers Array of user addresses for which to sync user-specific events
   * @param {Array<string>} genericEventNames Array of names for generic event types
   * @param {Array<UserSpecificDBConfiguration>} userSpecificDBConfiguration Array of user-specific event objects
   * @param blockAndLogStreamerListener
   * @return {Promise<void>}
   */
  async initializeDB(networkId: number, blockstreamDelay: number, defaultStartSyncBlockNumber: number, blockAndLogStreamerListener: BlockAndLogStreamerListenerInterface): Promise<DB> {
    this.networkId = networkId;
    this.blockstreamDelay = blockstreamDelay;
    this.blockAndLogStreamerListener = blockAndLogStreamerListener;

    const schemas = this.generateSchemas();

    this.dexieDB.version(1).stores(schemas);

    await this.dexieDB.open();

    this.syncStatus = new SyncStatus(networkId, defaultStartSyncBlockNumber, this);

    // Create SyncableDBs for generic event types & UserSyncableDBs for user-specific event types
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      new SyncableDB(this.augur, this, networkId, genericEventDBDescription.EventName, genericEventDBDescription.EventName, genericEventDBDescription.indexes);
    }

    // TODO this.liquidityDatabase = new LiquidityDB(this.augur, this, networkId, 'Liquidity');

    // Custom Derived DBs here
    this.disputeDatabase = new DisputeDatabase(this, networkId, 'Dispute', ['InitialReportSubmitted', 'DisputeCrowdsourcerCreated', 'DisputeCrowdsourcerContribution', 'DisputeCrowdsourcerCompleted'], this.augur);
    this.currentOrdersDatabase = new CurrentOrdersDatabase(this, networkId, 'CurrentOrders', ['OrderEvent'], this.augur);
    this.marketDatabase = new MarketDB(this, networkId, this.augur);
    this.cancelledOrdersDatabase = new CancelledOrdersDB(this, networkId, this.augur);

    // Zero X Orders. Only on if a mesh client has been provided
    this.zeroXOrders = this.augur.zeroX ? await ZeroXOrders.create(this, networkId, this.augur): undefined;

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
      let primaryKey = '[blockNumber+logIndex]';
      if (genericEventDBDescription.primaryKey) primaryKey = genericEventDBDescription.primaryKey;
      const fields = [primaryKey,'blockNumber'].concat(genericEventDBDescription.indexes);
      schemas[genericEventDBDescription.EventName] = fields.join(',');
    }
    schemas['Markets'] = 'market,reportingState,universe,marketCreator,timestamp,finalized,blockNumber';
    schemas['CurrentOrders'] = 'orderId,[market+open],[market+outcome+orderType],orderCreator,orderFiller,blockNumber';
    schemas['Dispute'] = '[market+payoutNumerators],market,blockNumber';
    schemas['ZeroXOrders'] = 'orderHash,[market+outcome+orderType],orderCreator,blockNumber';
    schemas['CancelledOrders'] = 'orderHash,[makerAddress+market]';
    schemas['SyncStatus'] = 'eventName,blockNumber,syncing';
    schemas['Rollback'] = ',[tableName+rollbackBlockNumber]';
    return schemas;
  }

  /**
   * Called from SyncableDB constructor once SyncableDB is successfully created.
   *
   * @param {SyncableDB} db dbController that utilizes the SyncableDB
   */
  notifySyncableDBAdded(db: SyncableDB): void {
    this.syncableDatabases[db.dbName] = db;
  }

  registerEventListener(eventNames: string | string[], callback: LogCallbackType): void {
    this.blockAndLogStreamerListener.listenForEvent(eventNames, callback);
  }

  /**
   * Syncs generic events and user-specific events with blockchain and updates MetaDB info.
   *
   * @param {Augur} augur Augur object with which to sync
   * @param {number} chunkSize Number of blocks to retrieve at a time when syncing logs
   * @param {number} blockstreamDelay Number of blocks by which blockstream is behind the blockchain
   */
  async sync(augur: Augur, chunkSize: number, blockstreamDelay: number): Promise<void> {
    const dbSyncPromises = [];
    const highestAvailableBlockNumber = await augur.provider.getBlockNumber();

    console.log('Syncing generic log DBs');
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      const dbName = genericEventDBDescription.EventName;
      dbSyncPromises.push(
        this.syncableDatabases[dbName].sync(
          augur,
          chunkSize,
          blockstreamDelay,
          highestAvailableBlockNumber
        )
      );
    }

    await Promise.all(dbSyncPromises);

    // Derived DBs are synced after generic log DBs complete
    console.log('Syncing derived DBs');

    // If no meshCLient provided will not exists
    if (this.zeroXOrders) await this.zeroXOrders.sync();

    await this.disputeDatabase.sync(highestAvailableBlockNumber);
    await this.currentOrdersDatabase.sync(highestAvailableBlockNumber);
    await this.cancelledOrdersDatabase.sync(highestAvailableBlockNumber);

    // The Market DB syncs after the derived DBs, as it depends on a derived DB
    await this.marketDatabase.sync(highestAvailableBlockNumber);

    // Update LiquidityDatabase and set it to update whenever there's a new block
    //await this.liquidityDatabase.updateLiquidity(augur, this, (await augur.getTimestamp()).toNumber());

    //this.augur.events.on(SubscriptionEventName.NewBlock, (args) => this.liquidityDatabase.updateLiquidity(this.augur, this, args.timestamp));
    console.log('Syncing Complete - SDK Ready');
    this.augur.events.emit(SubscriptionEventName.SDKReady, {
      eventName: SubscriptionEventName.SDKReady,
    });
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
    const lowestLastSyncBlock = Math.min.apply(null, highestSyncBlocks);
    return Math.max.apply(null, [lowestLastSyncBlock - this.blockstreamDelay, this.syncStatus.defaultStartSyncBlockNumber]);
  }

  /**
   * Gets a syncable database based upon the name
   *
   * @param {string} dbName The name of the database
   */
  getSyncableDatabase(dbName: string): SyncableDB {
    return this.syncableDatabases[dbName];
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
   * @param {{}} Optional request Query object to narrow results
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

  get CompleteSetsPurchased() { return this.dexieDB['CompleteSetsPurchased'] as Dexie.Table<CompleteSetsPurchasedLog, any>; }
  get CompleteSetsSold() { return this.dexieDB['CompleteSetsSold'] as Dexie.Table<CompleteSetsSoldLog, any>; }
  get DisputeCrowdsourcerContribution() { return this.dexieDB['DisputeCrowdsourcerContribution'] as Dexie.Table<DisputeCrowdsourcerContributionLog, any>; }
  get DisputeCrowdsourcerCompleted() { return this.dexieDB['DisputeCrowdsourcerCompleted'] as Dexie.Table<DisputeCrowdsourcerCompletedLog, any>; }
  get DisputeCrowdsourcerCreated() { return this.dexieDB['DisputeCrowdsourcerCreated'] as Dexie.Table<DisputeCrowdsourcerCreatedLog, any>; }
  get DisputeCrowdsourcerRedeemed() { return this.dexieDB['DisputeCrowdsourcerRedeemed'] as Dexie.Table<DisputeCrowdsourcerRedeemedLog, any>; }
  get DisputeWindowCreated() { return this.dexieDB['DisputeWindowCreated'] as Dexie.Table<DisputeWindowCreatedLog, any>; }
  get InitialReporterRedeemed() { return this.dexieDB['InitialReporterRedeemed'] as Dexie.Table<InitialReporterRedeemedLog, any>; }
  get InitialReportSubmitted() { return this.dexieDB['InitialReportSubmitted'] as Dexie.Table<InitialReportSubmittedLog, any>; }
  get InitialReporterTransferred() { return this.dexieDB['InitialReporterTransferred'] as Dexie.Table<InitialReporterTransferredLog, any>; }
  get MarketCreated() { return this.dexieDB['MarketCreated'] as Dexie.Table<MarketCreatedLog, any>; }
  get MarketFinalized() { return this.dexieDB['MarketFinalized'] as Dexie.Table<MarketFinalizedLog, any>; }
  get MarketMigrated() { return this.dexieDB['MarketMigrated'] as Dexie.Table<MarketMigratedLog, any>; }
  get MarketParticipantsDisavowed() { return this.dexieDB['MarketParticipantsDisavowed'] as Dexie.Table<MarketParticipantsDisavowedLog, any>; }
  get MarketTransferred() { return this.dexieDB['MarketTransferred'] as Dexie.Table<MarketTransferredLog, any>; }
  get MarketVolumeChanged() { return this.dexieDB['MarketVolumeChanged'] as Dexie.Table<MarketVolumeChangedLog, any>; }
  get MarketOIChanged() { return this.dexieDB['MarketOIChanged'] as Dexie.Table<MarketOIChangedLog, any>; }
  get OrderEvent() { return this.dexieDB['OrderEvent'] as Dexie.Table<ParsedOrderEventLog, any>; }
  get Cancel() { return this.dexieDB['Cancel'] as Dexie.Table<CancelLog, any>; }
  get CancelledOrders() { return this.dexieDB['CancelledOrders'] as Dexie.Table<CancelledOrderLog, any>; }
  get ParticipationTokensRedeemed() { return this.dexieDB['ParticipationTokensRedeemed'] as Dexie.Table<ParticipationTokensRedeemedLog, any>; }
  get ProfitLossChanged() { return this.dexieDB['ProfitLossChanged'] as Dexie.Table<ProfitLossChangedLog, any>; }
  get ReportingParticipantDisavowed() { return this.dexieDB['ReportingParticipantDisavowed'] as Dexie.Table<ReportingParticipantDisavowedLog, any>; }
  get TimestampSet() { return this.dexieDB['TimestampSet'] as Dexie.Table<TimestampSetLog, any>; }
  get TokenBalanceChanged() { return this.dexieDB['TokenBalanceChanged'] as Dexie.Table<TokenBalanceChangedLog, any>; }
  get TokensMinted() { return this.dexieDB['TokensMinted'] as Dexie.Table<TokensMinted, any>; }
  get TokensTransferred() { return this.dexieDB['TokensTransferred'] as Dexie.Table<TokensTransferredLog, any>; }
  get TradingProceedsClaimed() { return this.dexieDB['TradingProceedsClaimed'] as Dexie.Table<TradingProceedsClaimedLog, any>; }
  get UniverseCreated() { return this.dexieDB['UniverseCreated'] as Dexie.Table<UniverseCreatedLog, any>; }
  get UniverseForked() { return this.dexieDB['UniverseForked'] as Dexie.Table<UniverseForkedLog, any>; }
  get TransferSingle() { return this.dexieDB['TransferSingle'] as Dexie.Table<TransferSingleLog, any>; }
  get TransferBatch() { return this.dexieDB['TransferBatch'] as Dexie.Table<TransferBatchLog, any>; }
  get ShareTokenBalanceChanged() { return this.dexieDB['ShareTokenBalanceChanged'] as Dexie.Table<ShareTokenBalanceChangedLog, any>; }
  get Markets() { return this.dexieDB['Markets'] as Dexie.Table<MarketData, any>; }
  get Dispute() { return this.dexieDB['Dispute'] as Dexie.Table<DisputeDoc, any>; }
  get CurrentOrders() { return this.dexieDB['CurrentOrders'] as Dexie.Table<CurrentOrder, any>; }
  get ZeroXOrders() { return this.dexieDB['ZeroXOrders'] as Dexie.Table<StoredOrder, any>; }

  /**
   * Queries the Liquidity DB for hourly liquidity of markets
   *
   * @param {number} currentTimestamp Timestamp of the latest block
   * @param {string?} marketIds Array of market IDs to filter by
   * @returns {Promise<MarketHourlyLiquidity[]>}
   */
  /*
  async findRecentMarketsLiquidityDocs(currentTimestamp: number, marketIds?: string[]): Promise<MarketHourlyLiquidity[]> {
    const secondsPerHour = SECONDS_IN_AN_HOUR.toNumber();
    const mostRecentOnTheHourTimestamp = currentTimestamp - (currentTimestamp % secondsPerHour);
    const selectorConditions: any[] = [
      { _id: { $ne: 'lastUpdated' } },
      { timestamp: { $gte: mostRecentOnTheHourTimestamp - (SECONDS_IN_A_DAY).toNumber() } },
    ];
    if (marketIds) {
      selectorConditions.push(
        { market: { $in: marketIds } }
      );
    }
    const marketsLiquidity = await this.liquidityDatabase.find({
      selector: {
        $and: selectorConditions,
      },
    });

    return marketsLiquidity.docs as unknown as MarketHourlyLiquidity[];
  }
  */
  /**
   * Queries the Liquidity DB for hourly liquidity of all markets
   *
   * @returns {Promise<number|undefined>}
   */
  /*
  async findLiquidityLastUpdatedTimestamp(): Promise<number|undefined> {
    const lastUpdatedResults = await this.liquidityDatabase.find({
      selector: {
        _id: { $eq: 'lastUpdated' },
      },
    });
    const lastUpdatedDocs = lastUpdatedResults.docs as unknown as LiquidityLastUpdated[];
    if (lastUpdatedDocs.length > 0) {
      return lastUpdatedDocs[0].timestamp;
    }
    return undefined;
  }
  */
}
