import { Augur } from "../../Augur";
import { PouchDBFactoryType } from "./AbstractDB";
import { SyncableDB } from "./SyncableDB";
import { SyncStatus } from "./SyncStatus";
import { TrackedUsers } from "./TrackedUsers";
import { UserSyncableDB } from "./UserSyncableDB";
import { DerivedDB } from "./DerivedDB";
import { MarketDB } from "./MarketDB";
import { IBlockAndLogStreamerListener, LogCallbackType } from "./BlockAndLogStreamerListener";
import {
  CompleteSetsPurchasedLog,
  CompleteSetsSoldLog,
  DisputeCrowdsourcerCompletedLog,
  DisputeCrowdsourcerContributionLog,
  DisputeCrowdsourcerCreatedLog,
  DisputeCrowdsourcerRedeemedLog,
  DisputeWindowCreatedLog,
  InitialReporterRedeemedLog,
  InitialReportSubmittedLog,
  MarketCreatedLog,
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
  TradingProceedsClaimedLog,
  UniverseForkedLog,
  MarketData,
} from "../logs/types";

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
  private genericEventNames: string[];
  private syncableDatabases: { [dbName: string]: SyncableDB } = {};
  private derivedDatabases: { [dbName: string]: DerivedDB } = {};
  private marketDatabase: MarketDB;
  private blockAndLogStreamerListener: IBlockAndLogStreamerListener;
  private augur: Augur;
  readonly pouchDBFactory: PouchDBFactoryType;
  syncStatus: SyncStatus;

  readonly basicDerivedDBs: DerivedDBConfiguration[] = [
    {
      "name": "CurrentOrders",
      "eventNames": ["OrderEvent"],
      "idFields": ["orderId"],
    },
  ];

  // TODO Update numAdditionalTopics/userTopicIndexes once contract events are updated
  readonly userSpecificDBs: UserSpecificDBConfiguration[] = [
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
      "idFields": ["token"],
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
    dbController.genericEventNames = augur.genericEventNames;

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
    for (const eventName of this.genericEventNames) {
      new SyncableDB(this.augur, this, networkId, eventName, this.getDatabaseName(eventName), []);
    }

    for (const derivedDBConfiguration of this.basicDerivedDBs) {
      new DerivedDB(this, networkId, derivedDBConfiguration.name, derivedDBConfiguration.eventNames, derivedDBConfiguration.idFields);
    }

    // Custom Derived DBs here
    this.marketDatabase = new MarketDB(this, networkId, this.augur);

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
      console.log("Performing rollback of block " + startSyncBlockNumber + " onward");
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

    console.log(`Syncing generic log DBs`);
    for (const genericEventName of this.genericEventNames) {
      const dbName = this.getDatabaseName(genericEventName);
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
    console.log(`Syncing derived DBs`);
    dbSyncPromises = [];
    for (const derivedDBConfiguration of this.basicDerivedDBs) {
      const dbName = this.getDatabaseName(derivedDBConfiguration.name);
      dbSyncPromises.push(this.derivedDatabases[dbName].sync(highestAvailableBlockNumber));
    }

    await Promise.all(dbSyncPromises).then(() => undefined);


    // The Market DB syncs last as it depends on a derived DB
    return this.marketDatabase.sync(highestAvailableBlockNumber);
  }

  fullTextMarketSearch(query: string): object[] {
    return this.marketDatabase.fullTextSearch(query);
  }

  /**
   * Gets the block number at which to begin syncing. (That is, the lowest last-synced
   * block across all event log databases or the upload block number for this network.)
   *
   *
   * @returns {Promise<number>} Promise to the block number at which to begin syncing.
   */
  async getSyncStartingBlock(): Promise<number> {
    const highestSyncBlocks = [];
    for (const eventName of this.genericEventNames) {
      highestSyncBlocks.push(await this.syncStatus.getHighestSyncBlock(this.getDatabaseName(eventName)));
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
      return this.networkId + "-" + eventName + "-" + trackableUserAddress;
    }
    return this.networkId + "-" + eventName;
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
   * Rolls back all blocks from blockNumber onward.
   *
   * @param {number} blockNumber Oldest block number to delete
   */
  rollback = async (blockNumber: number): Promise<void> => {
    const dbRollbackPromises = [];
    // Perform rollback on SyncableDBs & UserSyncableDBs
    for (const eventName of this.genericEventNames) {
      const dbName = this.getDatabaseName(eventName);
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
      throw new Error("Unknown DB name: " + dbName);
    }
    try {
      await db.addNewBlock(blockLogs[0].blockNumber, blockLogs);

      const highestSyncBlock = await this.syncStatus.getHighestSyncBlock(dbName);
      if (highestSyncBlock !== blockLogs[0].blockNumber) {
        throw new Error("Highest sync block is " + highestSyncBlock + "; newest block number is " + blockLogs[0].blockNumber);
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
    return this.syncableDatabases[dbName].find(request);
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
   * Queries the CompleteSetsPurchased DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<CompleteSetsPurchasedLog>>}
   */
  async findCompleteSetsPurchasedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<CompleteSetsPurchasedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("CompleteSetsPurchased"), request);
    return results.docs as unknown as CompleteSetsPurchasedLog[];
  }

  /**
   * Queries the CompleteSetsSold DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<CompleteSetsSoldLog>>}
   */
  async findCompleteSetsSoldLogs(request: PouchDB.Find.FindRequest<{}>): Promise<CompleteSetsSoldLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("CompleteSetsSold"), request);
    return results.docs as unknown as CompleteSetsSoldLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerCompleted DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerCompletedLog>>}
   */
  async findDisputeCrowdsourcerCompletedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerCompletedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("DisputeCrowdsourcerCompleted"), request);
    return results.docs as unknown as DisputeCrowdsourcerCompletedLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerContribution DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerContributionLog>>}
   */
  async findDisputeCrowdsourcerContributionLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerContributionLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("DisputeCrowdsourcerContribution"), request);
    return results.docs as unknown as DisputeCrowdsourcerContributionLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerCreatedLog>>}
   */
  async findDisputeCrowdsourcerCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerCreatedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("DisputeCrowdsourcerCreated"), request);
    return results.docs as unknown as DisputeCrowdsourcerCreatedLog[];
  }

  /**
   * Queries the DisputeCrowdsourcerRedeemed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeCrowdsourcerRedeemedLog>>}
   */
  async findDisputeCrowdsourcerRedeemedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeCrowdsourcerRedeemedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("DisputeCrowdsourcerRedeemed"), request);
    return results.docs as unknown as DisputeCrowdsourcerRedeemedLog[];
  }

  /**
   * Queries the DisputeWindowCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<DisputeWindowCreatedLog>>}
   */
  async findDisputeWindowCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<DisputeWindowCreatedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("DisputeWindowCreated"), request);
    return results.docs as unknown as DisputeWindowCreatedLog[];
  }

  /**
   * Queries the InitialReporterRedeemed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<InitialReporterRedeemedLog>>}
   */
  async findInitialReporterRedeemedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<InitialReporterRedeemedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("InitialReporterRedeemed"), request);
    return results.docs as unknown as InitialReporterRedeemedLog[];
  }

  /**
   * Queries the InitialReportSubmitted DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<InitialReportSubmittedLog>>}
   */
  async findInitialReportSubmittedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<InitialReportSubmittedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("InitialReportSubmitted"), request);
    return results.docs as unknown as InitialReportSubmittedLog[];
  }

  /**
   * Queries the MarketCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketCreatedLog>>}
   */
  async findMarketCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketCreatedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("MarketCreated"), request);
    return results.docs as unknown as MarketCreatedLog[];
  }

  /**
   * Queries the MarketFinalized DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketFinalizedLog>>}
   */
  async findMarketFinalizedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketFinalizedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("MarketFinalized"), request);
    return results.docs as unknown as MarketFinalizedLog[];
  }

  /**
   * Queries the MarketMigrated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketMigratedLog>>}
   */
  async findMarketMigratedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketMigratedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("MarketMigrated"), request);
    return results.docs as unknown as MarketMigratedLog[];
  }

  /**
   * Queries the MarketVolumeChanged DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketVolumeChangedLog>>}
   */
  async findMarketVolumeChangedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketVolumeChangedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("MarketVolumeChanged"), request);
    return results.docs as unknown as MarketVolumeChangedLog[];
  }

  /**
   * Queries the MarketOIChanged DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketOIChangedLog>>}
   */
  async findMarketOIChangedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<MarketOIChangedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("MarketOIChanged"), request);
    return results.docs as unknown as MarketOIChangedLog[];
  }

  /**
   * Queries the OrderEvent DB for Cancel events
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findOrderCanceledLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    request.selector["eventType"] = OrderEventType.Cancel;
    const results = await this.findInSyncableDB(this.getDatabaseName("OrderEvent"), request);
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
    request.selector["eventType"] = OrderEventType.Create;
    const results = await this.findInSyncableDB(this.getDatabaseName("OrderEvent"), request);
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
    request.selector["eventType"] = OrderEventType.Fill;
    const results = await this.findInSyncableDB(this.getDatabaseName("OrderEvent"), request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the OrderEvent DB for PriceChanged events
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findOrderPriceChangedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    request.selector["eventType"] = OrderEventType.PriceChanged;
    const results = await this.findInSyncableDB(this.getDatabaseName("OrderEvent"), request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /*
   * Queries the ParticipationTokensRedeemed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParticipationTokensRedeemedLog>>}
   */
  async findParticipationTokensRedeemedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParticipationTokensRedeemedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("ParticipationTokensRedeemed"), request);
    return results.docs as unknown as ParticipationTokensRedeemedLog[];
  }

  /*
   * Queries the ProfitLossChanged DB
   *
   * @param {string} the user whose logs are being retreived
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ProfitLossChangedLog>>}
   */
  async findProfitLossChangedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<ProfitLossChangedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("ProfitLossChanged", user), request);
    return results.docs as unknown as ProfitLossChangedLog[];
  }

  /**
   * Queries the TimestampSet DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TimestampSetLog>>}
   */
  async findTimestampSetLogs(request: PouchDB.Find.FindRequest<{}>): Promise<TimestampSetLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("TimestampSet"), request);
    return results.docs as unknown as TimestampSetLog[];
  }

  /*
   * Queries the TokenBalanceChanged DB
   *
   * @param {string} the user whose logs are being retreived
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TokenBalanceChangedLog>>}
   */
  async findTokenBalanceChangedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<TokenBalanceChangedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("TokenBalanceChanged", user), request);
    return results.docs as unknown as TokenBalanceChangedLog[];
  }


  /**
   * Queries the TradingProceedsClaimed DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TradingProceedsClaimedLog>>}
   */
  async findTradingProceedsClaimedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<TradingProceedsClaimedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("TradingProceedsClaimed"), request);
    return results.docs as unknown as TradingProceedsClaimedLog[];
  }

  /**
   * Queries the UniverseForked DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<UniverseForkedLog>>}
   */
  async findUniverseForkedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<UniverseForkedLog[]> {
    const results = await this.findInSyncableDB(this.getDatabaseName("UniverseForked"), request);
    return results.docs as unknown as UniverseForkedLog[];
  }

  /**
   * Queries the CurrentOrders DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ParsedOrderEventLog>>}
   */
  async findCurrentOrderLogs(request: PouchDB.Find.FindRequest<{}>): Promise<ParsedOrderEventLog[]> {
    const results = await this.findInDerivedDB(this.getDatabaseName("CurrentOrders"), request);
    const logs = results.docs as unknown as ParsedOrderEventLog[];
    for (const log of logs) log.timestamp = log.timestamp;
    return logs;
  }

  /**
   * Queries the Markets DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketData>>}
   */
  async findMarkets(request: PouchDB.Find.FindRequest<{}>): Promise<MarketData[]> {
    const results = await this.findInDerivedDB(this.getDatabaseName("Markets"), request);
    return results.docs as unknown as MarketData[];
  }
}
