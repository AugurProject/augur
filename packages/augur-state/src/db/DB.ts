import { SyncableDB } from './SyncableDB';
import { Augur } from 'augur-api';
import { SyncStatus } from './SyncStatus';
import { TrackedUsers } from './TrackedUsers';
import { MetaDB, SequenceIds } from './MetaDB';
import { UserSyncableDB } from './UserSyncableDB';
import { getAllJSDocTagsOfKind } from 'typescript';
const uploadBlockNumbers = require('augur-artifacts/upload-block-numbers.json');

interface UserSpecificEvent {
  name: string;
  numAdditionalTopics: number;
  userTopicIndex: number;
}

// TODO Get these from GenericContractInterfaces (and do not include any that are unneeded)
const genericEventNames: Array<string> = [

  "DisputeCrowdsourcerCompleted",
  "DisputeCrowdsourcerCreated",
  "DisputeWindowCreated",
  "MarketCreated",
  "MarketFinalized",
  "MarketMigrated",
  "MarketParticipantsDisavowed",
  "ReportingParticipantDisavowed",
  "TimestampSet",
  "TokensBurned",
  "TokensMinted",
  "UniverseCreated",
  "UniverseForked",
];

// TODO Update numAdditionalTopics/userTopicIndexes once contract events are updated
const userSpecificEvents: Array<UserSpecificEvent> = [
  {
    "name": "CompleteSetsPurchased",
    "numAdditionalTopics": 3,
    "userTopicIndex": 2,
  },
  {
    "name": "CompleteSetsSold",
    "numAdditionalTopics": 3,
    "userTopicIndex": 2,
  },
  {
    "name": "DisputeCrowdsourcerContribution",
    "numAdditionalTopics": 3,
    "userTopicIndex": 1,
  },
  {
    "name": "DisputeCrowdsourcerRedeemed",
    "numAdditionalTopics": 3,
    "userTopicIndex": 1,
  },
  {
    "name": "InitialReporterRedeemed",
    "numAdditionalTopics": 3,
    "userTopicIndex": 1,
  },
  {
    "name": "InitialReportSubmitted",
    "numAdditionalTopics": 3,
    "userTopicIndex": 1,
  },
  {
    "name": "InitialReporterTransferred", 
    "numAdditionalTopics": 2,
    "userTopicIndex": 2,
  },
  {
    "name": "MarketMailboxTransferred",
    "numAdditionalTopics": 3,
    "userTopicIndex": 2,
  },
  {
    "name": "MarketTransferred",
    "numAdditionalTopics": 2,
    "userTopicIndex": 1,
  },
  {
    "name": "OrderCanceled",
    "numAdditionalTopics": 3,
    "userTopicIndex": 2,
  },
  {
    "name": "OrderCreated",
    "numAdditionalTopics": 3,
    "userTopicIndex": 0,
  },
  {
    "name": "OrderFilled",
    "numAdditionalTopics": 2,
    "userTopicIndex": 1,
  },
  {
    "name": "TokensTransferred",
    "numAdditionalTopics": 3,
    "userTopicIndex": 2,
  },
  {
    "name": "TradingProceedsClaimed",
    "numAdditionalTopics": 3,
    "userTopicIndex": 2,
  },
];

export class DB<TBigNumber> {
  private networkId: number;
  private trackedUsers: TrackedUsers;
  private syncableDatabases: { [eventName: string]: SyncableDB<TBigNumber> } = {};
  private userSyncableDatabases: { [userEventName: string]: UserSyncableDB<TBigNumber> } = {};
  private metaDatabase: MetaDB<TBigNumber>;
  public syncStatus: SyncStatus;

  public constructor () {}

  /**
   * Creates and returns a new dbController.
   * 
   * @param {number} networkId Network on which to sync events
   * @param {Array<string>} trackedUsers Array of user addresses for which to sync user-specific events
   * @returns {Promise<DB<TBigNumber>>} Promise to a DB controller object
   */
  public static async createAndInitializeDB<TBigNumber>(networkId: number, trackedUsers: Array<string>): Promise<DB<TBigNumber>> {
    const dbController = new DB<TBigNumber>();
    await dbController.initializeDB(networkId, trackedUsers);
    return dbController;
  }

  /**
   * Creates databases to be used for syncing.
   * 
   * @param {number} networkId Network on which to sync events
   * @param {Array<string>} trackedUsers Array of user addresses for which to sync user-specific events
   */
  public async initializeDB(networkId: number, trackedUsers: Array<string>): Promise<void> {
    this.networkId = networkId;
    this.syncStatus = new SyncStatus(networkId);
    this.trackedUsers = new TrackedUsers(networkId);

    // TODO Call function to clean up DBs if process is being restarted in a bad state

    // Create SyncableDBs for generic event types
    for (let eventName of genericEventNames) {
      new SyncableDB<TBigNumber>(this, networkId, eventName);
    }

    // Create UserSyncableDBs for user-specific event types
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party.
    // Also update topics/indexes for user-specific events once these changes are made to the contracts.
    for (let trackedUser of trackedUsers) {
      await this.trackedUsers.setUserTracked(trackedUser);
      for (let userSpecificEvent of userSpecificEvents) {
        new UserSyncableDB<TBigNumber>(this, networkId, userSpecificEvent.name, trackedUser, userSpecificEvent.numAdditionalTopics, userSpecificEvent.userTopicIndex);
      }
    }

    // TODO Initialize full-text DB

    this.metaDatabase = new MetaDB(networkId, networkId + "-BlockNumberEvents");
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
   * Called from UserSyncableDB constructor once UserSyncableDB is successfully created.
   * 
   * @param {UserSyncableDB<TBigNumber>} db dbController that utilizes the UserSyncableDB
   */
  public notifyUserSyncableDBAdded(db: UserSyncableDB<TBigNumber>): void {
    this.userSyncableDatabases[db.dbName] = db;
  }

  /**
   * Syncs generic events and user-specific events with blockchain and updates MetaDB info.
   * 
   * @param {Augur<TBigNumber>} augur Augur object with which to sync
   * @param {number} chunkSize Number of blocks to retrieve at a time when syncing logs
   * @param {number} blockstreamDelay Number of blocks by which blockstream is behind the blockchain
   * @param {number} uploadBlockNumber Block number at which Augur contracts were originally uploaded to the blockchain
   */
  public async sync(augur: Augur<TBigNumber>, chunkSize: number, blockstreamDelay: number, uploadBlockNumber: number): Promise<void> {
    // Sync generic event types & user-specific event types
    let dbSyncPromises = [];
    for (let eventName of genericEventNames) {
      let dbName = `${this.networkId}-${eventName}`;
      dbSyncPromises.push(this.syncableDatabases[dbName].sync(augur, chunkSize, blockstreamDelay, uploadBlockNumber));
      // TODO Set indexes
    }
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party.
    // Also update topics/indexes for user-specific events once these changes are made to the contracts.
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let userSpecificEvent of userSpecificEvents) {
        let dbName = `${this.networkId}-${userSpecificEvent.name}-${trackedUser}`;
        dbSyncPromises.push(this.userSyncableDatabases[dbName].sync(augur, chunkSize, blockstreamDelay, uploadBlockNumber));
        // TODO Set indexes
      }
    }
    await Promise.all(dbSyncPromises);

    // TODO Create way to get highest sync block across all DBs
    const highestSyncBlock = await this.syncStatus.getHighestSyncBlock(`${this.networkId}-${genericEventNames[0]}`, uploadBlockNumbers[this.networkId]);
    const sequenceIds = await this.getAllSequenceIds();
    await this.metaDatabase.addNewBlock(highestSyncBlock, sequenceIds);
  }

  /**
   * Returns the current update_seqs from all SyncableDBs/UserSyncableDBs. 
   * 
   * @returns {Promise<SequenceIds>} Promise to a SequenceIds object
   */
  public async getAllSequenceIds(): Promise<SequenceIds> {
    let sequenceIds: SequenceIds = {};
    for (let eventName of genericEventNames) {
      let dbName = `${this.networkId}-${eventName}`;
      let dbInfo = await this.syncableDatabases[dbName].getInfo();
      sequenceIds[dbName] = dbInfo.update_seq.toString();
    }
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let userSpecificEvent of userSpecificEvents) {
        let dbName = `${this.networkId}-${userSpecificEvent.name}-${trackedUser}`;
        let dbInfo = await this.userSyncableDatabases[dbName].getInfo();
        sequenceIds[dbName] = dbInfo.update_seq.toString();
      }
    }
    return sequenceIds;
  }

  /**
   * Rolls back all blocks from blockNumber onward.
   * 
   * TODO Add check to see if any rollbacks failed
   * 
   * @param {number} blockNumber Oldest block number to delete
   */
  public async rollback(blockNumber: number): Promise<void> {
    let dbRollbackPromises = [];
    // Perform rollback on SyncableDBs & UserSyncableDBs
    for (let eventName of genericEventNames) {
      let dbName = `${this.networkId}-${eventName}`;
      dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
    }
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let userSpecificEvent of userSpecificEvents) {
        let dbName = `${this.networkId}-${userSpecificEvent.name}-${trackedUser}`;
        dbRollbackPromises.push(this.userSyncableDatabases[dbName].rollback(blockNumber));
      }
    }
    await Promise.all(dbRollbackPromises);

    await this.metaDatabase.rollback(blockNumber);
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
    let db = this.syncableDatabases[dbName] ? this.syncableDatabases[dbName] : this.userSyncableDatabases[dbName];
    if (!db) {
      throw new Error("Unknown DB name: " + dbName);
    }
    try {
      await db.addNewBlock(uploadBlockNumbers[this.networkId], blockLogs);
      
      const highestSyncBlock = await this.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
      if (highestSyncBlock !== blockLogs[0].blockNumber) {
        throw new Error("Highest sync block is " + highestSyncBlock + "; newest block number is " + blockLogs[0].blockNumber);
      }

      const sequenceIds = await this.getAllSequenceIds();
      await this.metaDatabase.addNewBlock(highestSyncBlock, sequenceIds);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Queries a SyncableDB.
   * 
   * @param {string} dbName Name of the SyncableDB to query
   * @param {PouchDB.Find.FindRequest<{}>} request Query object 
   * @returns Promise<PouchDB.Find.FindResponse<{}>> Promise to a FindResponse 
   */
  public async findInSyncableDB(dbName: string, request: PouchDB.Find.FindRequest<{}>): Promise<PouchDB.Find.FindResponse<{}>> {
    return await this.syncableDatabases[dbName].find(request);
  }
}
