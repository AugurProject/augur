import { Augur, UserSpecificEvent } from "@augurproject/api";
import { MetaDB, SequenceIds } from "./MetaDB";
import { PouchDBFactoryType } from "./AbstractDB";
import { SyncableDB } from "./SyncableDB";
import { SyncStatus } from "./SyncStatus";
import { TrackedUsers } from "./TrackedUsers";
import { UserSyncableDB } from "./UserSyncableDB";
import { IBlockAndLogStreamerListener, LogCallbackType } from "./BlockAndLogStreamerListener";
import {
  CompleteSetsPurchasedLog,
  CompleteSetsSoldLog,
  DisputeCrowdsourcerCompletedLog,
  InitialReportSubmittedLog,
  OrderFilledLog,
  OrderCreatedLog,
  MarketCreatedLog,
  MarketFinalizedLog,
  MarketMigratedLog,
  MarketVolumeChangedLog,
  ProfitLossChangedLog,
  UniverseForkedLog,
  TokenBalanceChangedLog
} from "../logs/types";


export class DB<TBigNumber> {
  private networkId: number;
  private blockstreamDelay: number;
  private trackedUsers: TrackedUsers;
  private genericEventNames: Array<string>;
  private userSpecificEvents: Array<UserSpecificEvent>;
  private syncableDatabases: { [eventName: string]: SyncableDB<TBigNumber> } = {};
  private metaDatabase: MetaDB<TBigNumber>; // TODO Remove this if derived DBs are not used.
  private blockAndLogStreamerListener: IBlockAndLogStreamerListener;
  public readonly pouchDBFactory: PouchDBFactoryType;
  public syncStatus: SyncStatus;

  public constructor(pouchDBFactory: PouchDBFactoryType) {
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
   * @param {Array<UserSpecificEvent>} userSpecificEvents Array of user-specific event objects
   * @param {PouchDBFactoryType} pouchDBFactory Factory function generatin PouchDB instance
   * @param {IBlockAndLogStreamerListener} blockAndLogStreamerListener Stream listener for blocks and logs
   * @returns {Promise<DB<TBigNumber>>} Promise to a DB controller object
   */
  public static async createAndInitializeDB<TBigNumber>(networkId: number, blockstreamDelay: number, defaultStartSyncBlockNumber: number, trackedUsers: Array<string>, genericEventNames: Array<string>, userSpecificEvents: Array<UserSpecificEvent>, pouchDBFactory: PouchDBFactoryType, blockAndLogStreamerListener: IBlockAndLogStreamerListener): Promise<DB<TBigNumber>> {
    const dbController = new DB<TBigNumber>(pouchDBFactory);
    await dbController.initializeDB(networkId, blockstreamDelay, defaultStartSyncBlockNumber, trackedUsers, genericEventNames, userSpecificEvents, blockAndLogStreamerListener);
    return dbController;
  }

  /**
   * Creates databases to be used for syncing.
   *
   * @param {number} networkId Network on which to sync events
   * @param {number} blockstreamDelay Number of blocks by which to delay blockstream
   * @param {number} defaultStartSyncBlockNumber Block number at which to start sycing (if no higher block number has been synced)
   * @param {Array<string>} trackedUsers Array of user addresses for which to sync user-specific events
   * @param {Array<string>} genericEventNames Array of names for generic event types
   * @param {Array<UserSpecificEvent>} userSpecificEvents Array of user-specific event objects
   * @param blockAndLogStreamerListener
   * @return {Promise<void>}
   */
  public async initializeDB(networkId: number, blockstreamDelay: number, defaultStartSyncBlockNumber: number, trackedUsers: Array<string>, genericEventNames: Array<string>, userSpecificEvents: Array<UserSpecificEvent>, blockAndLogStreamerListener:IBlockAndLogStreamerListener): Promise<void> {
    this.networkId = networkId;
    this.blockstreamDelay = blockstreamDelay;
    this.syncStatus = new SyncStatus(networkId, defaultStartSyncBlockNumber, this.pouchDBFactory);
    this.trackedUsers = new TrackedUsers(networkId, this.pouchDBFactory);
    this.metaDatabase = new MetaDB(this, networkId, this.pouchDBFactory);
    this.genericEventNames = genericEventNames;
    this.userSpecificEvents = userSpecificEvents;
    this.blockAndLogStreamerListener = blockAndLogStreamerListener;

    // Create SyncableDBs for generic event types & UserSyncableDBs for user-specific event types
    for (let eventName of genericEventNames) {
      new SyncableDB<TBigNumber>(this, networkId, eventName);
    }
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party.
    // Also update topics/indexes for user-specific events once these changes are made to the contracts.
    for (let trackedUser of trackedUsers) {
      await this.trackedUsers.setUserTracked(trackedUser);
      for (let userSpecificEvent of userSpecificEvents) {
        new UserSyncableDB<TBigNumber>(this, networkId, userSpecificEvent.name, trackedUser, userSpecificEvent.numAdditionalTopics, userSpecificEvent.userTopicIndicies, userSpecificEvent.idFields);
      }
    }

    // TODO Initialize full-text DB

    // Always start syncing from 10 blocks behind the lowest
    // last-synced block (in case of restarting after a crash)
    const startSyncBlockNumber = await this.getSyncStartingBlock();
    if (startSyncBlockNumber > this.syncStatus.defaultStartSyncBlockNumber) {
      console.log("Performing rollback of block " + startSyncBlockNumber + " onward");
      await this.rollback(startSyncBlockNumber);
    }

    // TODO If derived DBs are used, `this.metaDatabase.rollback` should also be called here
  }

  /**
   * Called from SyncableDB constructor once SyncableDB is successfully created.
   *
   * @param {SyncableDB<TBigNumber>} db dbController that utilizes the SyncableDB
   */
  public notifySyncableDBAdded(db: SyncableDB<TBigNumber>): void {
    this.syncableDatabases[db.dbName] = db;
  }

  public registerEventListener(eventName: string, callback: LogCallbackType): void {
      this.blockAndLogStreamerListener.listenForEvent(eventName, callback);
  }

  /**
   * Syncs generic events and user-specific events with blockchain and updates MetaDB info.
   *
   * @param {Augur<TBigNumber>} augur Augur object with which to sync
   * @param {number} chunkSize Number of blocks to retrieve at a time when syncing logs
   * @param {number} blockstreamDelay Number of blocks by which blockstream is behind the blockchain
   */
  public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockstreamDelay: number): Promise<void> {
    let dbSyncPromises = [];
    const highestAvailableBlockNumber = await augur.provider.getBlockNumber();

    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let userSpecificEvent of this.userSpecificEvents) {
        let dbName = this.getDatabaseName(userSpecificEvent.name, trackedUser);
          dbSyncPromises.push(
            this.syncableDatabases[dbName].sync(
              augur,
              chunkSize,
              blockstreamDelay,
              highestAvailableBlockNumber
            ));
      }
    }

    for (let genericEventName of this.genericEventNames) {
      let dbName = this.getDatabaseName(genericEventName);
      dbSyncPromises.push(
        this.syncableDatabases[dbName].sync(
          augur,
          chunkSize,
          blockstreamDelay,
          highestAvailableBlockNumber
        ));
    }

    return Promise.all(dbSyncPromises).then(() => undefined)

    // TODO Call `this.metaDatabase.addNewBlock` here if derived DBs end up getting used
  }

  /**
   * Gets the block number at which to begin syncing. (That is, the lowest last-synced
   * block across all event log databases or the upload block number for this network.)
   *
   * TODO If derived DBs are used, the last-synced block in `this.metaDatabase`
   * should also be taken into account here.
   *
   * @returns {Promise<number>} Promise to the block number at which to begin syncing.
   */
  public async getSyncStartingBlock(): Promise<number> {
    let highestSyncBlocks = [];
    for (let eventName of this.genericEventNames) {
      highestSyncBlocks.push(await this.syncStatus.getHighestSyncBlock(this.getDatabaseName(eventName)));
    }
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let userSpecificEvent of this.userSpecificEvents) {
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
  public getDatabaseName(eventName: string, trackableUserAddress?: string) {
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
  public getSyncableDatabase(dbName: string): SyncableDB<TBigNumber> {
    return this.syncableDatabases[dbName];
  }

  /**
   * Returns the current update_seqs from all SyncableDBs/UserSyncableDBs.
   *
   * TODO Remove this function if derived DBs are not used.
   *
   * @returns {Promise<SequenceIds>} Promise to a SequenceIds object
   */
  public async getAllSequenceIds(): Promise<SequenceIds> {
    let sequenceIds: SequenceIds = {};
    for (let eventName of this.genericEventNames) {
      let dbName = this.getDatabaseName(eventName);
      let dbInfo = await this.syncableDatabases[dbName].getInfo();
      sequenceIds[dbName] = dbInfo.update_seq.toString();
    }
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let userSpecificEvent of this.userSpecificEvents) {
        let dbName = this.getDatabaseName(userSpecificEvent.name, trackedUser);
        let dbInfo = await this.syncableDatabases[dbName].getInfo();
        sequenceIds[dbName] = dbInfo.update_seq.toString();
      }
    }
    return sequenceIds;
  }

  /**
   * Rolls back all blocks from blockNumber onward.
   *
   * @param {number} blockNumber Oldest block number to delete
   */
  public async rollback(blockNumber: number): Promise<void> {
    let dbRollbackPromises = [];
    // Perform rollback on SyncableDBs & UserSyncableDBs
    for (let eventName of this.genericEventNames) {
      let dbName = this.getDatabaseName(eventName);
      dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
    }
    // TODO Figure out a way to handle concurrent request limit of 40
    await Promise.all(dbRollbackPromises)
      .catch(error => {
        throw error;
      });

    // Perform rollback on UserSyncableDBs
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let userSpecificEvent of this.userSpecificEvents) {
        let dbName = this.getDatabaseName(userSpecificEvent.name, trackedUser);
        dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
      }
    }
    // TODO Figure out a way to handle concurrent request limit of 40
    await Promise.all(dbRollbackPromises)
      .catch(error => {
        throw error;
      });

    // TODO If derived DBs end up getting used, call `this.metaDatabase.find`
    // here to get sequenceIds for blocks >= blockNumber. Then call
    // `this.metaDatabase.rollback` to remove those documents from derived DBs.
  }

  /**
   * Adds a new block to a SyncableDB/UserSyncableDB and updates MetaDB.
   *
   * TODO Define blockLogs interface
   *
   * @param {string} dbName Name of the database to which the block should be added
   * @param {any} blockLogs Logs from a new block
   */
  public async addNewBlock(dbName: string, blockLogs: any): Promise<void> {
    let db = this.syncableDatabases[dbName];
    if (!db) {
      throw new Error("Unknown DB name: " + dbName);
    }
    try {
      await db.addNewBlock(blockLogs[0].blockNumber, blockLogs);

      const highestSyncBlock = await this.syncStatus.getHighestSyncBlock(dbName);
      if (highestSyncBlock !== blockLogs[0].blockNumber) {
        throw new Error("Highest sync block is " + highestSyncBlock + "; newest block number is " + blockLogs[0].blockNumber);
      }

      // TODO If derived DBs end up getting used, call `this.getAllSequenceIds` here
      // and pass the returned sequenceIds into `this.metaDatabase.addNewBlock`.
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
  public async findInSyncableDB(dbName: string, request: PouchDB.Find.FindRequest<{}>): Promise<PouchDB.Find.FindResponse<{}>> {
    return await this.syncableDatabases[dbName].find(request);
  }

  /**
   * Queries the MetaDB.
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<PouchDB.Find.FindResponse<{}>>} Promise to a FindResponse
   */
  public async findInMetaDB(request: PouchDB.Find.FindRequest<{}>): Promise<PouchDB.Find.FindResponse<{}>> {
    return await this.metaDatabase.find(request);
  }

  /**
   * Queries the CompleteSetsPurchased DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<CompleteSetsPurchasedLog>>}
   */
  public async findCompleteSetsPurchasedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<CompleteSetsPurchasedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("CompleteSetsPurchased"), request);
    return results.docs as unknown as Array<CompleteSetsPurchasedLog>;
  }

  /**
   * Queries the CompleteSetsSold DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<CompleteSetsSoldLog>>}
   */
  public async findCompleteSetsSoldLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<CompleteSetsSoldLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("CompleteSetsSold"), request);
    return results.docs as unknown as Array<CompleteSetsSoldLog>;
  }

  /**
   * Queries the DisputeCrowdsourcerCompleted DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<InitialReportSubmittedLog>>}
   */
  public async findDisputeCrowdsourcerCompletedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<DisputeCrowdsourcerCompletedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("DisputeCrowdsourcerCompleted"), request);
    return results.docs as unknown as Array<DisputeCrowdsourcerCompletedLog>;
  }

  /**
   * Queries the InitialReportSubmitted DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<InitialReportSubmittedLog>>}
   */
  public async findInitialReportSubmittedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<InitialReportSubmittedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("InitialReportSubmitted"), request);
    return results.docs as unknown as Array<InitialReportSubmittedLog>;
  }

  /**
   * Queries the MarketCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketCreatedLog>>}
   */
  public async findMarketCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<MarketCreatedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("MarketCreated"), request);
    return results.docs as unknown as Array<MarketCreatedLog>;
  }

  /**
   * Queries the MarketFinalized DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketFinalizedLog>>}
   */
  public async findMarketFinalizedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<MarketFinalizedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("MarketFinalized"), request);
    return results.docs as unknown as Array<MarketFinalizedLog>;
  }

  /**
   * Queries the MarketMigrated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketMigratedLog>>}
   */
  public async findMarketMigratedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<MarketMigratedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("MarketMigrated"), request);
    return results.docs as unknown as Array<MarketMigratedLog>;
  }

  /**
   * Queries the MarketVolumeChanged DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<MarketVolumeChangedLog>>}
   */
  public async findMarketVolumeChangedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<MarketVolumeChangedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("MarketVolumeChanged"), request);
    return results.docs as unknown as Array<MarketVolumeChangedLog>;
  }

  /**
   * Queries the OrderCreated DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<OrderCreatedLog>>}
   */
  public async findOrderCreatedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<OrderCreatedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("OrderCreated"), request);
    return results.docs as unknown as Array<OrderCreatedLog>;
  }

  /**
   * Queries the OrderFilled DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<OrderFilledLog>>}
   */
  public async findOrderFilledLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<OrderFilledLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("OrderFilled"), request);
    return results.docs as unknown as Array<OrderFilledLog>;
  }

  /*
   * Queries the ProfitLossChanged DB
   *
   * @param {string} the user whose logs are being retreived
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<ProfitLossChangedLog>>}
   */
  public async findProfitLossChangedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<Array<ProfitLossChangedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("ProfitLossChanged", user), request);
    return results.docs as unknown as Array<ProfitLossChangedLog>;
  }

  /**
   * Queries the UniverseForked DB
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<UniverseForkedLog>>}
   */
  public async findUniverseForkedLogs(request: PouchDB.Find.FindRequest<{}>): Promise<Array<UniverseForkedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("UniverseForked"), request);
    return results.docs as unknown as Array<UniverseForkedLog>;
  }

  /*
   * Queries the TokenBalanceChanged DB
   *
   * @param {string} the user whose logs are being retreived
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<Array<TokenBalanceChangedLog>>}
   */
  public async findTokenBalanceChangedLogs(user: string, request: PouchDB.Find.FindRequest<{}>): Promise<Array<TokenBalanceChangedLog>> {
    const results = await this.findInSyncableDB(this.getDatabaseName("TokenBalanceChanged", user), request);
    return results.docs as unknown as Array<TokenBalanceChangedLog>;
  }
}
