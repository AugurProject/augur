import * as _ from "lodash";
import { Events, Log, ParsedLog, Provider, UserSpecificEvent } from "@augurproject/api";
import { BaseDocument, PouchDBFactoryType } from "./AbstractDB";
import { MetaDB, SequenceIds } from "./MetaDB";
import { SyncableDB } from "./SyncableDB";
import { SyncStatus } from "./SyncStatus";
import { TrackedUsers } from "./TrackedUsers";
import { UserSyncableDB } from "./UserSyncableDB";


export class DB<TBigNumber> {
  private networkId: number;
  private blockstreamDelay: number;
  private trackedUsers: TrackedUsers;
  private genericEventNames: Array<string>;
  private userSpecificEvents: Array<UserSpecificEvent>;
  private syncableDatabases: { [eventName: string]: SyncableDB<TBigNumber> } = {};
  private metaDatabase: MetaDB<TBigNumber>; // TODO Remove this if derived DBs are not used.
  public readonly pouchDBFactory: PouchDBFactoryType;
  public syncStatus: SyncStatus;

  public constructor (pouchDBFactory: PouchDBFactoryType) {
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
   * @returns {Promise<DB<TBigNumber>>} Promise to a DB controller object
   */
  public static async createAndInitializeDB<TBigNumber>(
    networkId: number,
    blockstreamDelay: number,
    defaultStartSyncBlockNumber: number,
    trackedUsers: Array<string>,
    genericEventNames: Array<string>,
    userSpecificEvents: Array<UserSpecificEvent>,
    pouchDBFactory: PouchDBFactoryType
  ): Promise<DB<TBigNumber>> {
    const dbController = new DB<TBigNumber>(pouchDBFactory);
    await dbController.initializeDB(
      networkId,
      blockstreamDelay,
      defaultStartSyncBlockNumber,
      trackedUsers, genericEventNames,
      userSpecificEvents
    );
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
   * @param {PouchDBFactoryType} pouchDBFactory Factory function generatin PouchDB instance
   */
  public async initializeDB(
    networkId: number,
    blockstreamDelay: number,
    defaultStartSyncBlockNumber: number,
    trackedUsers: Array<string>,
    genericEventNames: Array<string>,
    userSpecificEvents: Array<UserSpecificEvent>
  ): Promise<void> {
    this.networkId = networkId;
    this.blockstreamDelay = blockstreamDelay;
    this.syncStatus = new SyncStatus(networkId, defaultStartSyncBlockNumber, this.pouchDBFactory);
    this.trackedUsers = new TrackedUsers(networkId, this.pouchDBFactory);
    this.metaDatabase = new MetaDB(this, networkId, this.pouchDBFactory);
    this.genericEventNames = genericEventNames;
    this.userSpecificEvents = userSpecificEvents;

    // Create SyncableDBs for generic event types & UserSyncableDBs for user-specific event types
    for (let eventName of genericEventNames) {
      new SyncableDB<TBigNumber>(this, networkId, eventName);
    }
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party.
    // Also update topics/indexes for user-specific events once these changes are made to the contracts.
    for (let trackedUser of trackedUsers) {
      await this.trackedUsers.setUserTracked(trackedUser);
      for (let userSpecificEvent of userSpecificEvents) {
        new UserSyncableDB<TBigNumber>(this, networkId, userSpecificEvent.name, trackedUser);
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

  /**
   * Syncs generic events and user-specific events with blockchain and updates MetaDB info.
   *
   * TODO Make use of EventLogDBRouter
   *
   * @param {Provider} ethereumProvider Ethereum provider to use for syncing
   * @param {Events} events Object used for getting and parsing logs from the blockchain
   * @param {number} chunkSize Number of blocks to retrieve at a time when syncing logs
   */
  public async sync(ethereumProvider: Provider, events: Events, chunkSize: number): Promise<void> {
    const startSyncBlockNumber = await this.getSyncStartingBlock();
    const endSyncBlockNumber = await ethereumProvider.getBlockNumber() - this.blockstreamDelay;
    let firstBlockNumberInChunk = startSyncBlockNumber;

    while (firstBlockNumberInChunk < endSyncBlockNumber) {
      const lastBlockNumberInChunk = Math.min(firstBlockNumberInChunk + chunkSize, endSyncBlockNumber);
      const rawLogsPromises:Array<Promise<Array<Log>>> = [];

      // Get all generic event logs in chunk
      console.log(`SYNCING all generic events from blocks ${firstBlockNumberInChunk} to ${lastBlockNumberInChunk}`);
      rawLogsPromises.push(events.getLogs(this.genericEventNames, firstBlockNumberInChunk, lastBlockNumberInChunk));

      // Get all user-specific event logs in chunk
      for (let userSpecificEvent of this.userSpecificEvents) {
        const additionalTopics: Array<string | Array<string>> = [];
        additionalTopics.fill("", userSpecificEvent.numAdditionalTopics);
        const trackedUsers = await this.trackedUsers.getUsers();
        additionalTopics[userSpecificEvent.userTopicIndex] = trackedUsers.map(trackedUser => `0x000000000000000000000000${trackedUser.substr(2)}`);

        console.log(`SYNCING ${userSpecificEvent.name} events from blocks ${firstBlockNumberInChunk} to ${lastBlockNumberInChunk}`);
        rawLogsPromises.push(events.getLogs([userSpecificEvent.name], firstBlockNumberInChunk, lastBlockNumberInChunk, additionalTopics));
      }

      // Save event logs to their respective DBs
      await Promise.all(rawLogsPromises)
      .then(
        async rawLogs => {
          const flattenedRawLogs = _.flatten(rawLogs);
          await this.saveLogsToDBs(ethereumProvider, events, flattenedRawLogs, lastBlockNumberInChunk);
        }
      )
      .catch(
        error => {
          throw error;
        }
      );
      firstBlockNumberInChunk = lastBlockNumberInChunk + 1;
    }

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
   * Gets a syncable database based on `eventName` & `trackableUserAddress`.
   *
   * @param {string} eventName Event log name
   * @param {string=} trackableUserAddress User address to append to DB name
   */
  public getSyncableDatabase(eventName: string, trackableUserAddress?: string) : SyncableDB<TBigNumber> {
    return this.syncableDatabases[this.getDatabaseName(eventName, trackableUserAddress)];
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

    await Promise.all(dbRollbackPromises)
    .catch(
      error => {
        throw error;
      }
    );

    // Perform rollback on UserSyncableDBs
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let userSpecificEvent of this.userSpecificEvents) {
        let dbName = this.getDatabaseName(userSpecificEvent.name, trackedUser);
        dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
      }
    }

    await Promise.all(dbRollbackPromises)
    .catch(
      error => {
        throw error;
      }
    );

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
      await db.addNewBlock(blockLogs);

      const highestSyncBlock = await this.syncStatus.getHighestSyncBlock(dbName);
      if (highestSyncBlock !== blockLogs[0].blockNumber) {
        throw new Error("Highest sync block is " + highestSyncBlock + "; newest block number is " + blockLogs[0].blockNumber);
      }

      // TODO If derived DBs end up getting used, call `this.getAllSequenceIds` here
      // and pass the returned sequenceIds into `this.metaDatabase.addNewBlock`.
    } catch (error) {
      throw error;
    }
  }

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
   * Queries the MetaDB.
   *
   * TODO Remove this function if derived DBs are not used.
   *
   * @param {PouchDB.Find.FindRequest<{}>} request Query object
   * @returns {Promise<PouchDB.Find.FindResponse<{}>>} Promise to a FindResponse
   */
  public async findInMetaDB(request: PouchDB.Find.FindRequest<{}>): Promise<PouchDB.Find.FindResponse<{}>> {
    return await this.metaDatabase.find(request);
  }

  /**
   * Saves raw logs from the blockchain to DBs, based on the event type for each log.
   *
   * @param {Provider} ethereumProvider
   * @param {Events} events
   * @param {Array<Log>} rawLogs
   * @param {number} lastBlockNumberInChunk
   */
  private async saveLogsToDBs(ethereumProvider: Provider, events: Events, rawLogs: Array<Log>, lastBlockNumberInChunk: number): Promise<void> {
    const saveLogsPromises = [];

    // Save generic events to their respective DBs
    for (let genericEventName of this.genericEventNames) {
      const filteredLogs = rawLogs.filter((log) => log.topics.includes(ethereumProvider.getEventTopic("Augur", genericEventName)));
      const parsedFilteredLogs = events.parseLogs(filteredLogs);
      saveLogsPromises.push(this.getSyncableDatabase(genericEventName).saveLogs(parsedFilteredLogs, lastBlockNumberInChunk));
      console.log(`Saved ${filteredLogs.length} ${genericEventName} log(s)`);
    }

    // Save user-specific events to their respective DBs
    const trackedUsers = await this.trackedUsers.getUsers();
    const encodedTrackedUsers = trackedUsers.map(trackedUser => `0x000000000000000000000000${trackedUser.substr(2)}`)
    for (let userSpecificEvent of this.userSpecificEvents) {
      const eventFilteredLogs = rawLogs.filter((log) => log.topics.includes(ethereumProvider.getEventTopic("Augur", userSpecificEvent.name)));
        for (let trackedUserIndex = 0; trackedUserIndex < trackedUsers.length; trackedUserIndex++) {
          const userFilteredLogs = eventFilteredLogs.filter((log) => log.topics.includes(encodedTrackedUsers[trackedUserIndex]));
          const parsedUserFilteredLogs = events.parseLogs(userFilteredLogs);
          saveLogsPromises.push(this.getSyncableDatabase(userSpecificEvent.name, trackedUsers[trackedUserIndex]).saveLogs(parsedUserFilteredLogs, lastBlockNumberInChunk));
          console.log(`Saved ${userFilteredLogs.length} ${userSpecificEvent.name} log(s) for ${trackedUsers[trackedUserIndex]}`);
        }
    }

    await Promise.all(saveLogsPromises)
    .catch(
      error => {
        throw error;
      }
    );
  }
}
