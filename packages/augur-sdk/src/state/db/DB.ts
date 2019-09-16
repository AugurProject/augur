import { Augur } from '../../Augur';
import { augurEmitter } from "../../events";
import { SECONDS_IN_A_DAY, SECONDS_IN_AN_HOUR, SubscriptionEventName } from '../../constants';
import { PouchDBFactoryType, AbstractDB } from './AbstractDB';
import { SyncableDB } from './SyncableDB';
import { SyncStatus } from './SyncStatus';
import { TrackedUsers } from './TrackedUsers';
import { UserSyncableDB } from './UserSyncableDB';
import { DerivedDB } from './DerivedDB';
import { LiquidityDB, LiquidityLastUpdated, MarketHourlyLiquidity } from './LiquidityDB';
import { MarketDB } from './MarketDB';
import { IBlockAndLogStreamerListener, LogCallbackType } from './BlockAndLogStreamerListener';
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
  MarketCreatedLog,
  MarketData,
  MarketFinalizedLog,
  MarketMigratedLog,
  MarketVolumeChangedLog,
  MarketOIChangedLog,
  OrderEventType,
  ParsedOrderEventLog,
  ParticipationTokensRedeemedLog,
  ProfitLossChangedLog,
  TimestampSetLog,
  TokenBalanceChangedLog,
  TokensMinted,
  TradingProceedsClaimedLog,
  UniverseForkedLog,
  UniverseCreatedLog,
} from '../logs/types';
import { ZeroXOrders, StoredOrder } from './ZeroXOrders';

export interface DerivedDBConfiguration {
  name: string;
  eventNames?: string[];
  idFields?: string[];
}

export interface UserSpecificDBConfiguration {
  name: string;
  eventName?: string;
  idFields?: string[];
  numAdditionalTopics: number;
  userTopicIndicies: number[];
}

export class DB {
  private networkId: number;
  private blockstreamDelay: number;
  private trackedUsers: TrackedUsers;
  private genericEventDBDescriptions: GenericEventDBDescription[];
  private syncableDatabases: { [dbName: string]: SyncableDB } = {};
  private derivedDatabases: { [dbName: string]: DerivedDB } = {};
  private liquidityDatabase: LiquidityDB;
  private marketDatabase: MarketDB;
  private zeroXOrders: ZeroXOrders;
  private blockAndLogStreamerListener: IBlockAndLogStreamerListener;
  private augur: Augur;
  readonly pouchDBFactory: PouchDBFactoryType;
  syncStatus: SyncStatus;

  readonly basicDerivedDBs: DerivedDBConfiguration[] = [
    {
      'name': 'CurrentOrders',
      'eventNames': ['OrderEvent'],
      'idFields': ['orderId'],
    },
  ];

  // TODO Update numAdditionalTopics/userTopicIndexes once contract events are updated
  readonly userSpecificDBs: UserSpecificDBConfiguration[] = [
    {
      'name': 'TokensMinted',
      'numAdditionalTopics': 3,
      'userTopicIndicies': [2],
    },
    {
      'name': 'TokensTransferred',
      'numAdditionalTopics': 3,
      'userTopicIndicies': [1, 2],
    },
    {
      'name': 'ProfitLossChanged',
      'numAdditionalTopics': 3,
      'userTopicIndicies': [2],
    },
    {
      'name': 'TokenBalanceChanged',
      'numAdditionalTopics': 2,
      'userTopicIndicies': [1],
      'idFields': ['token'],
    },
  ];

  constructor(pouchDBFactory: PouchDBFactoryType) {
    this.pouchDBFactory = pouchDBFactory;
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
   * @param {PouchDBFactoryType} pouchDBFactory Factory function generatin PouchDB instance
   * @param {IBlockAndLogStreamerListener} blockAndLogStreamerListener Stream listener for blocks and logs
   * @returns {Promise<DB>} Promise to a DB controller object
   */
  static createAndInitializeDB(networkId: number, blockstreamDelay: number, defaultStartSyncBlockNumber: number, trackedUsers: string[], augur: Augur, pouchDBFactory: PouchDBFactoryType, blockAndLogStreamerListener: IBlockAndLogStreamerListener): Promise<DB> {
    const dbController = new DB(pouchDBFactory);

    dbController.augur = augur;
    dbController.genericEventDBDescriptions = augur.genericEventDBDescriptions;

    return dbController.initializeDB(networkId, blockstreamDelay, defaultStartSyncBlockNumber, trackedUsers, blockAndLogStreamerListener);
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
  async initializeDB(networkId: number, blockstreamDelay: number, defaultStartSyncBlockNumber: number, trackedUsers: string[], blockAndLogStreamerListener: IBlockAndLogStreamerListener): Promise<DB> {
    this.networkId = networkId;
    this.blockstreamDelay = blockstreamDelay;
    this.syncStatus = new SyncStatus(networkId, defaultStartSyncBlockNumber, this.pouchDBFactory);
    this.trackedUsers = new TrackedUsers(networkId, this.pouchDBFactory);
    this.blockAndLogStreamerListener = blockAndLogStreamerListener;

    // Create SyncableDBs for generic event types & UserSyncableDBs for user-specific event types
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      new SyncableDB(this.augur, this, networkId, genericEventDBDescription.EventName, this.getDatabaseName(genericEventDBDescription.EventName), [], genericEventDBDescription.indexes);
    }

    for (const derivedDBConfiguration of this.basicDerivedDBs) {
      new DerivedDB(this, networkId, derivedDBConfiguration.name, derivedDBConfiguration.eventNames, derivedDBConfiguration.idFields);
    }

    this.liquidityDatabase = new LiquidityDB(this.augur, this, networkId, 'Liquidity');

    // Custom Derived DBs here
    this.marketDatabase = new MarketDB(this, networkId, this.augur);

    // Zero X Orders. Only on if a mesh client has been provided
    this.zeroXOrders = this.augur.zeroX ? await ZeroXOrders.create(this, networkId, this.augur): undefined;

    // add passed in tracked users to the tracked uses db
    for (const trackedUser of trackedUsers) {
      await this.trackedUsers.setUserTracked(trackedUser);
    }

    // iterate over all known tracked users
    for (const trackedUser of await this.trackedUsers.getUsers()) {
      for (const userSpecificEvent of this.userSpecificDBs) {
        new UserSyncableDB(this.augur, this, networkId, userSpecificEvent.name, trackedUser, userSpecificEvent.numAdditionalTopics, userSpecificEvent.userTopicIndicies, userSpecificEvent.idFields);
      }
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

  /**
   * Called from SyncableDB constructor once SyncableDB is successfully created.
   *
   * @param {SyncableDB} db dbController that utilizes the SyncableDB
   */
  notifySyncableDBAdded(db: SyncableDB): void {
    this.syncableDatabases[db.dbName] = db;
  }

  /**
   * Called from DerivedDB constructor once DerivedDB is successfully created.
   *
   * @param {DerivedDB} db dbController that utilizes the DerivedDB
   */
  notifyDerivedDBAdded(db: DerivedDB): void {
    this.derivedDatabases[db.dbName] = db;
  }

  notifyLiquidityDBAdded(db: LiquidityDB): void {
    this.liquidityDatabase = db;
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
    let dbSyncPromises = [];
    const highestAvailableBlockNumber = await augur.provider.getBlockNumber();

    console.log('Syncing generic log DBs');
    for (const genericEventDBDescription of this.genericEventDBDescriptions) {
      const dbName = this.getDatabaseName(genericEventDBDescription.EventName);
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
    dbSyncPromises = [];
    for (const derivedDBConfiguration of this.basicDerivedDBs) {
      const dbName = this.getDatabaseName(derivedDBConfiguration.name);
      dbSyncPromises.push(this.derivedDatabases[dbName].sync(highestAvailableBlockNumber));
    }

    await Promise.all(dbSyncPromises).then(() => undefined);

    // If no meshCLient provided will not exists
    if (this.zeroXOrders) await this.zeroXOrders.sync();

    // The Market DB syncs after the derived DBs, as it depends on a derived DB
    await this.marketDatabase.sync(highestAvailableBlockNumber);

    // Update LiquidityDatabase and set it to update whenever there's a new block
    await this.liquidityDatabase.updateLiquidity(augur, this, (await augur.getTimestamp()).toNumber());
    augurEmitter.on(SubscriptionEventName.NewBlock, (args) => this.liquidityDatabase.updateLiquidity(this.augur, this, args.timestamp));

    augurEmitter.emit(SubscriptionEventName.SDKReady, {
      eventName: SubscriptionEventName.SDKReady,
    });

    await this.syncUserData(chunkSize, blockstreamDelay, highestAvailableBlockNumber, augur);
  }

  /**
   * Syncs all UserSyncableDBs. (If a user has been added to this.trackedUsers and
   * does not have a UserSyncableDB, the UserSyncableDB will be created.)
   *
   * @param {Augur} augur Augur object with which to sync
   * @param {number} chunkSize Number of blocks to retrieve at a time when syncing logs
   * @param {number} blockstreamDelay Number of blocks by which blockstream is behind the blockchain
   * @param {number} highestAvailableBlockNumber Number of the highest available block
   */
  async syncUserData(chunkSize: number, blockstreamDelay: number, highestAvailableBlockNumber: number, augur: Augur): Promise<void> {
    const dbSyncPromises = [];
    console.log('Syncing user-specific log DBs');
    for (const trackedUser of await this.trackedUsers.getUsers()) {
      for (const userSpecificEvent of this.userSpecificDBs) {
        const dbName = this.getDatabaseName(userSpecificEvent.name, trackedUser);
        dbSyncPromises.push(
          this.syncableDatabases[dbName].sync(
            augur,
            chunkSize,
            blockstreamDelay,
            highestAvailableBlockNumber
          )
        );
      }
    }

    await Promise.all(dbSyncPromises);

    await this.emitUserDataSynced();
  }

  async addTrackedUser(account: string, chunkSize: number, blockstreamDelay: number): Promise<void> {
    const highestAvailableBlockNumber = await this.augur.provider.getBlockNumber();
    if (!(await this.trackedUsers.getUsers()).includes(account)) {
      await this.trackedUsers.setUserTracked(account);
      const dbSyncPromises = [];
      for (const userSpecificEvent of this.userSpecificDBs) {
        const dbName = this.getDatabaseName(userSpecificEvent.name, account);
        if (!this.getSyncableDatabase(dbName)) {
          // Create DB
          new UserSyncableDB(this.augur, this, this.networkId, userSpecificEvent.name, account, userSpecificEvent.numAdditionalTopics, userSpecificEvent.userTopicIndicies, userSpecificEvent.idFields);
          dbSyncPromises.push(
            this.syncableDatabases[dbName].sync(
              this.augur,
              chunkSize,
              blockstreamDelay,
              highestAvailableBlockNumber
            )
          );
        }
      }
    }

    await this.emitUserDataSynced();
  }

  async emitUserDataSynced(): Promise<void> {
    augurEmitter.emit(SubscriptionEventName.UserDataSynced, {
      eventName: SubscriptionEventName.UserDataSynced,
      trackedUsers: await this.trackedUsers.getUsers(),
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
      highestSyncBlocks.push(await this.syncStatus.getHighestSyncBlock(this.getDatabaseName(genericEventDBDescription.EventName)));
    }
    for (const trackedUser of await this.trackedUsers.getUsers()) {
      for (const userSpecificEvent of this.userSpecificDBs) {
        highestSyncBlocks.push(await this.syncStatus.getHighestSyncBlock(this.getDatabaseName(userSpecificEvent.name, trackedUser)));
      }
    }
    const lowestLastSyncBlock = Math.min.apply(null, highestSyncBlocks);
    return Math.max.apply(null, [lowestLastSyncBlock - this.blockstreamDelay, this.syncStatus.defaultStartSyncBlockNumber]);
  }

  /**
   * Creates a name for a SyncableDB/UserSyncableDB based on `eventName` & `trackableUserAddress`.
   *
   * @param {string} eventName Event log name
   * @param {string=} trackableUserAddress User address to append to DB name
   */
  getDatabaseName(eventName: string, trackableUserAddress?: string) {
    if (trackableUserAddress) {
      return this.networkId + '-' + eventName + '-' + trackableUserAddress;
    }
    return this.networkId + '-' + eventName;
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
   * Gets a derived database based upon the name
   *
   * @param {string} dbName The name of the database
   */
  getDerivedDatabase(dbName: string): DerivedDB {
    return this.derivedDatabases[dbName];
  }

  /**
   * Gets the liquidity database
   */
  getLiquidityDatabase(): LiquidityDB {
    return this.liquidityDatabase;
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
      const dbName = this.getDatabaseName(genericEventDBDescription.EventName);
      dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
    }

    // Perform rollback on UserSyncableDBs
    for (const trackedUser of await this.trackedUsers.getUsers()) {
      for (const userSpecificEvent of this.userSpecificDBs) {
        const dbName = this.getDatabaseName(userSpecificEvent.name, trackedUser);
        dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
      }
    }

    // Perform rollback on derived DBs
    for (const derivedDBConfiguration of this.basicDerivedDBs) {
      const dbName = this.getDatabaseName(derivedDBConfiguration.name);
      dbRollbackPromises.push(this.derivedDatabases[dbName].rollback(blockNumber));
    }

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

  // TODO Combine find functions into single function

  /**
   * Queries a SyncableDB.
   *
   * @param {string} dbName Name of the SyncableDB to query
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<PouchDB.Find.FindResponse<{}>>} Promise to a FindResponse
   */
  async findInSyncableDB(dbName: string, request: PouchDB.Find.FindRequest<{}>): Promise<PouchDB.Find.FindResponse<{}>> {
    if (this.syncableDatabases[dbName]) {
      return this.syncableDatabases[dbName].find(request);
    }
    else {
      return {} as PouchDB.Find.FindResponse<{}>;
    }
  }

  /**
   * Queries a DerivedDB.
   *
   * @param {string} dbName Name of the SyncableDB to query
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<PouchDB.Find.FindResponse<{}>>} Promise to a FindResponse
   */
  async findInDerivedDB(dbName: string, request: PouchDB.Find.FindRequest<{}>): Promise<PouchDB.Find.FindResponse<{}>> {
    return this.derivedDatabases[dbName].find(request);
  }

  /**
   * Queries a DB to get a row count.
   *
   * @param {string} dbName Name of the DB to query
   * @param {boolean} derived Boolean indicating if this is a derived DB
   * @param {PouchDB.Find.FindRequest<{}>} Optional request Query object to narrow results
   * @returns {Promise<number>} Promise to a number of rows
   */
  async getNumRowsFromDB(dbName: string, derived: boolean, request?: PouchDB.Find.FindRequest<{}>): Promise<number> {
    const fullDBName = this.getDatabaseName(dbName);
    const db: AbstractDB = derived ? this.derivedDatabases[fullDBName] : this.syncableDatabases[fullDBName];

    if (request) {
      const results = await db.find(request);
      return results.docs.length;
    }

    const info = await db.info();
    return info.doc_count;
  }

  /**
   * Queries the CompleteSetsPurchased DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<CompleteSetsPurchasedLog>>}
   */
  async findCompleteSetsPurchasedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<CompleteSetsPurchasedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('CompleteSetsPurchased'), request);
    return results.docs as unknown as CompleteSetsPurchasedLog[];
  }

  /**
   * Queries the CompleteSetsSold DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<CompleteSetsSoldLog>>}
   */
  async findCompleteSetsSoldLogs(request: PouchDB.Find.FindRequest<{}>): Promise<CompleteSetsSoldLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('CompleteSetsSold'), request);
    return results.docs as unknown as CompleteSetsSoldLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerCompleted DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerCompletedLog>>}
   */
  async findDisputeCrowdsourcerCompletedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerCompletedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('DisputeCrowdsourcerCompleted'), request);
    return results.docs as unknown as DisputeCrowdsourcerCompletedLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerContribution DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerContributionLog>>}
   */
  async findDisputeCrowdsourcerContributionLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerContributionLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('DisputeCrowdsourcerContribution'), request);
    return results.docs as unknown as DisputeCrowdsourcerContributionLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerCreatedLog>>}
   */
  async findDisputeCrowdsourcerCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerCreatedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('DisputeCrowdsourcerCreated'), request);
    return results.docs as unknown as DisputeCrowdsourcerCreatedLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerRedeemed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerRedeemedLog>>}
   */
  async findDisputeCrowdsourcerRedeemedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerRedeemedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('DisputeCrowdsourcerRedeemed'), request);
    return results.docs as unknown as DisputeCrowdsourcerRedeemedLog[];
  }

  /**
   * Queries the DisputeWindowCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeWindowCreatedLog>>}
   */
  async findDisputeWindowCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeWindowCreatedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('DisputeWindowCreated'), request);
    return results.docs as unknown as DisputeWindowCreatedLog[];
  }

  /**
   * Queries the InitialReporterRedeemed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<InitialReporterRedeemedLog>>}
   */
  async findInitialReporterRedeemedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<InitialReporterRedeemedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('InitialReporterRedeemed'), request);
    return results.docs as unknown as InitialReporterRedeemedLog[];
  }

  /**
   * Queries the InitialReportSubmitted DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<InitialReportSubmittedLog>>}
   */
  async findInitialReportSubmittedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<InitialReportSubmittedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('InitialReportSubmitted'), request);
    return results.docs as unknown as InitialReportSubmittedLog[];
  }

  /**
   * Queries the MarketCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketCreatedLog>>}
   */
  async findMarketCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketCreatedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('MarketCreated'), request);
    return results.docs as unknown as MarketCreatedLog[];
  }

  /**
   * Queries the MarketFinalized DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketFinalizedLog>>}
   */
  async findMarketFinalizedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketFinalizedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('MarketFinalized'), request);
    return results.docs as unknown as MarketFinalizedLog[];
  }

  /**
   * Queries the MarketMigrated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketMigratedLog>>}
   */
  async findMarketMigratedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketMigratedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('MarketMigrated'), request);
    return results.docs as unknown as MarketMigratedLog[];
  }

  /**
   * Queries the MarketVolumeChanged DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketVolumeChangedLog>>}
   */
  async findMarketVolumeChangedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketVolumeChangedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('MarketVolumeChanged'), request);
    return results.docs as unknown as MarketVolumeChangedLog[];
  }

  /**
   * Queries the MarketOIChanged DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketOIChangedLog>>}
   */
  async findMarketOIChangedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketOIChangedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('MarketOIChanged'), request);
    return results.docs as unknown as MarketOIChangedLog[];
  }

  /**
   * Queries the OrderEvent DB for Cancel events
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findOrderCanceledLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    request.selector['eventType'] = OrderEventType.Cancel;
    const results = await this.findInSyncableDB(this.getDatabaseName('OrderEvent'), request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the OrderEvent DB for Create events
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findOrderCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    request.selector['eventType'] = OrderEventType.Create;
    const results = await this.findInSyncableDB(this.getDatabaseName('OrderEvent'), request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the OrderEvent DB for Fill events
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findOrderFilledLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    request.selector['eventType'] = OrderEventType.Fill;
    const results = await this.findInSyncableDB(this.getDatabaseName('OrderEvent'), request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the ParticipationTokensRedeemed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParticipationTokensRedeemedLog>>}
   */
  async findParticipationTokensRedeemedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParticipationTokensRedeemedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('ParticipationTokensRedeemed'), request);
    return results.docs as unknown as ParticipationTokensRedeemedLog[];
  }

  /**
   * Queries the ProfitLossChanged DB
   *
   * @param {string} the user whose logs are being retreived
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ProfitLossChangedLog>>}
   */
  async findProfitLossChangedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<ProfitLossChangedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('ProfitLossChanged', user), request);
    return results.docs as unknown as ProfitLossChangedLog[];
  }

  /**
   * Queries the TimestampSet DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TimestampSetLog>>}
   */
  async findTimestampSetLogs(request: PouchDB.Find.FindRequest<{}>): Promise<TimestampSetLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('TimestampSet'), request);
    return results.docs as unknown as TimestampSetLog[];
  }

  async allUniverseForkedLogs(): Promise<UniverseForkedLog[]> {
    return this.syncableDatabases[this.getDatabaseName("UniverseForked")].allDocs()
    .then((docs) => {
      return docs.rows
      .filter((doc) => !/^_design/.test(doc.id))
      .map((doc) => doc.doc);
    }) as unknown as UniverseForkedLog[];
  }

  /**
   * Queries the TokenBalanceChanged DB
   *
   * @param {string} the user whose logs are being retreived
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TokenBalanceChangedLog>>}
   */
  async findTokenBalanceChangedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<TokenBalanceChangedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('TokenBalanceChanged', user), request);
    return results.docs as unknown as TokenBalanceChangedLog[];
  }

  async findTokensMintedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<TokensMinted[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('TokensMinted', user), request);
    return results.docs as unknown as TokensMinted[];
  }

  /**
   * Queries the TradingProceedsClaimed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TradingProceedsClaimedLog>>}
   */
  async findTradingProceedsClaimedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<TradingProceedsClaimedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('TradingProceedsClaimed'), request);
    return results.docs as unknown as TradingProceedsClaimedLog[];
  }

  /**
   * Queries the UniverseForked DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<UniverseForkedLog>>}
   */
  async findUniverseCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<UniverseCreatedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("UniverseCreated"), request);
    return results.docs as unknown as UniverseCreatedLog[];
  }

  /**
   * Queries the UniverseCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<UniverseForkedLog>>}
   */
  async findUniverseForkedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<UniverseForkedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName('UniverseForked'), request);
    return results.docs as unknown as UniverseForkedLog[];
  }

  /**
   * Queries the CurrentOrders DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findCurrentOrderLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    const results = await this.findInDerivedDB(this.getDatabaseName('CurrentOrders'), request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the ZeroXOrders DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<StoredOrder>>}
   */
  async findZeroXOrderLogs(request: PouchDB.Find.FindRequest<{}>): Promise<StoredOrder[]> {
    if (!this.zeroXOrders) throw new Error("ZeroX orders not available as no mesh client was provided");
    const results = await this.zeroXOrders.find(request);
    const logs = results.docs as unknown as StoredOrder[];
    return logs;
  }

  /**
   * Queries the Markets DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketData>>}
   */
  async findMarkets(request: PouchDB.Find.FindRequest<{}>): Promise<MarketData[]> {
    const results = await this.findInDerivedDB(this.getDatabaseName('Markets'), request);
    return results.docs as unknown as MarketData[];
  }

  /**
   * Returns the current time, either using the Time contract, or by using the latest block timestamp.
   */
  async getCurrentTime(): Promise<number>  {
    const time = this.augur.contracts.getTime();

    if (this.augur.contracts.isTimeControlled(time)) {
      return (await time.getTimestamp_()).toNumber();
    } else {
      return (await this.augur.provider.getBlock(await this.augur.provider.getBlockNumber())).timestamp;
    }
  }

  /**
   * Queries the Liquidity DB for hourly liquidity of markets
   *
   * @param {number} currentTimestamp Timestamp of the latest block
   * @param {string?} marketIds Array of market IDs to filter by
   * @returns {Promise<MarketHourlyLiquidity[]>}
   */
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

  /**
   * Queries the Liquidity DB for hourly liquidity of all markets
   *
   * @returns {Promise<number|undefined>}
   */
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
}
