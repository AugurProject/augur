import { SyncableDB } from './SyncableDB';
import { Augur } from 'augur-api';
import { SyncStatus } from './SyncStatus';
import { TrackedUsers } from './TrackedUsers';
import { MetaDB } from './MetaDB';
import { UserSyncableDB } from './UserSyncableDB';
const uploadBlockNumbers = require('augur-artifacts/upload-block-numbers.json');

interface UserSpecificEvent {
  name: string;
  numAdditionalTopics: number;
  userTopicIndex: number;
}

interface SequenceIds { 
  [dbName: string]: string 
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
   * @param networkId Network on which to sync events
   * @param trackedUsers Array of user addresses for which to sync user-specific events
   */
  public static async createAndInitializeDB<TBigNumber>(networkId: number, trackedUsers: Array<string>): Promise<DB<TBigNumber>> {
    const dbController = new DB<TBigNumber>();
    await dbController.initializeDB(networkId, trackedUsers);
    return dbController;
  }

  /**
   * Creates databases to be used for syncing.
   * 
   * @param networkId Network on which to sync events
   * @param trackedUsers Array of user addresses for which to sync user-specific events
   */
  public async initializeDB(networkId: number, trackedUsers: Array<string>): Promise<void> {
    this.networkId = networkId;
    this.syncStatus = new SyncStatus();
    this.trackedUsers = new TrackedUsers();

    // Create SyncableDBs for generic event types
    for (let eventName of genericEventNames) {
      new SyncableDB<TBigNumber>(this, networkId, eventName);
    }

    // Create UserSyncableDBs for user-specific event types
    // TODO TokensTransferred should comprise all balance changes with additional metadata and with an index on the to party.
    // Also update topics/indexes for user-specific events once these changes are made to the contracts.
    for (let trackedUser of trackedUsers) {
      await this.trackedUsers.setUserTracked(trackedUser);
      for (let eventIndex in userSpecificEvents) {
        new UserSyncableDB<TBigNumber>(this, networkId, userSpecificEvents[eventIndex].name, trackedUser, userSpecificEvents[eventIndex].numAdditionalTopics, userSpecificEvents[eventIndex].userTopicIndex);
      }
    }

    // TODO Initialize full-text DB

    this.metaDatabase = new MetaDB(networkId + "-BlockNumberEvents");
/*
    // Update MetaDB to associate block numbers with SyncableDB/UserSyncableDB update_seqs
    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(`${this.networkId}-${genericEventNames[0]}`, uploadBlockNumbers[this.networkId]);
    let newDocument;
    let sequenceIds = await this.getAllSequenceIds();
    // TODO Check if sequenceIds matches the sequence IDs in MetaDB and update MetaDB accordingly, since MetaDB could be behind or ahead
*/
  }

  /**
   * Called from SyncableDB constructor once SyncableDB is successfully created.
   * 
   * @param eventName Generic event type on which the SyncableDB syncs
   * @param db dbController that utilizes the SyncableDB
   */
  public notifySyncableDBAdded(db: SyncableDB<TBigNumber>): void {
    this.syncableDatabases[db.dbName] = db;
  }

  /**
   * Called from UserSyncableDB constructor once UserSyncableDB is successfully created.
   * 
   * @param userSpecificEventName User-specific event type on which the UserSyncableDB syncs
   * @param trackedUser User address for which to sync the user-specific event type
   * @param db dbController that utilizes the UserSyncableDB
   */
  public notifyUserSyncableDBAdded(db: UserSyncableDB<TBigNumber>): void {
    this.userSyncableDatabases[db.dbName] = db;
  }

  /**
   * Syncs generic events and user-specific events with blockchain and updates MetaDB info.
   * 
   * @param augur Augur object with which to sync
   * @param chunkSize Number of blocks to retrieve at a time when syncing logs
   * @param blockstreamDelay Number of blocks by which blockstream is behind the blockchain
   * @param uploadBlockNumber Block number at which Augur contracts were originally uploaded to the blockchain
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
      for (let eventIndex in userSpecificEvents) {
        let dbName = `${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`;
        dbSyncPromises.push(this.userSyncableDatabases[dbName].sync(augur, chunkSize, blockstreamDelay, uploadBlockNumber));
        // TODO Set indexes
      }
    }
    await Promise.all(dbSyncPromises);

    // await this.updateMetaDB();



    // TODO Move this code to unit test
    // Add 2 new blocks to DisputeCrowdsourcerCompleted
    const dbName = this.networkId + "-DisputeCrowdsourcerCompleted";
    await this.addNewBlocks(dbName);

    // Find new blocks
    let queryObj = {
      selector: {universe: '0x11149d40d255fCeaC54A3ee3899807B0539bad60'},
      fields: ['_id', 'universe'],
      sort: ['_id']
    };
    let result = await this.syncableDatabases[dbName].find(queryObj);
    console.log("\n\nBefore rollback: ", result);
    console.log("\n\n");

    const highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
    await this.rollback(highestSyncedBlockNumber - 1);

    // New blocks should be gone
    result = await this.syncableDatabases[dbName].find(queryObj);
    console.log("\n\nAfter rollback: ", result);
  }

  public async getAllSequenceIds(): Promise<SequenceIds> {
    let sequenceIds: { [dbName: string]: string } = {};
    for (let eventName of genericEventNames) {
      let dbName = `${this.networkId}-${eventName}`;
      let dbInfo = await this.syncableDatabases[dbName].getInfo();
      sequenceIds[dbName] = dbInfo.update_seq.toString();
    }
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let eventIndex in userSpecificEvents) {
        let dbName = `${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`;
        let dbInfo = await this.userSyncableDatabases[dbName].getInfo();
        sequenceIds[dbName] = dbInfo.update_seq.toString();
      }
    }
    // console.log("SEQUENCE IDS: ", sequenceIds);
    return sequenceIds;
  }
/*
  public async updateMetaDB() {
    const sequenceIds = await this.getAllSequenceIds();

    // Update MetaDB to track highest synced block numbers & sequenceIds for each SyncableDB/UserSyncableDB
    for (let eventName of genericEventNames) {
      let dbName = `${this.networkId}-${eventName}`;
      let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
      const newDocument = {
        _id: dbName,
        blockNumber: highestSyncedBlockNumber,
        sequenceId: sequenceIds[dbName],
      };
      await this.metaDatabase.addNewBlock(dbName, newDocument);
    }
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let eventIndex in userSpecificEvents) {
        let dbName = `${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`;
        let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
        const newDocument = {
          _id: dbName,
          blockNumber: highestSyncedBlockNumber,
          sequenceId: sequenceIds[dbName],
        };
        await this.metaDatabase.addNewBlock(dbName, newDocument);
      }
    }
  }
*/
  // TODO Add check to see if any rollbacks failed
  public async rollback (blockNumber: number): Promise<void> {
/*
    console.log("Rolling back block numbers from " + blockNumber + " onward\n");

    let previousBlockSequenceIds = await this.metaDatabase.getBlockSequenceIds(blockNumber);
    console.log("previousBlockSequenceIds: ", previousBlockSequenceIds);

    let dbRollbackPromises = [];
    // Perform rollback on SyncableDBs & UserSyncableDBs
    for (let previousBlockSequenceId of previousBlockSequenceIds.docs) {
      let dbInfo = await this.syncableDatabases[previousBlockSequenceId["_id"]].getInfo();
      while (dbInfo.update_seq > previousBlockSequenceId["sequenceId"]) {
        console.log("dbInfo: ", dbInfo);
        dbRollbackPromises.push(this.syncableDatabases[previousBlockSequenceId["_id"]].rollback(previousBlockSequenceId["sequenceId"]));
      }
    }
    await Promise.all(dbRollbackPromises);

    // TODO Perform rollback on full-text DB

    // Update MetaDB
    await this.metaDatabase.rollback(blockNumber);
*/
    let dbRollbackPromises = [];
    // Perform rollback on SyncableDBs & UserSyncableDBs
    for (let eventName of genericEventNames) {
      let dbName = `${this.networkId}-${eventName}`;
      dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
    }
    for (let trackedUser of await this.trackedUsers.getUsers()) {
      for (let eventIndex in userSpecificEvents) {
        let dbName = `${this.networkId}-${userSpecificEvents[eventIndex].name}-${trackedUser}`;
        dbRollbackPromises.push(this.syncableDatabases[dbName].rollback(blockNumber));
      }
    }
    await Promise.all(dbRollbackPromises);
  }



  // TODO Move to unit test
  public async addNewBlocks(dbName: string): Promise<void> {
    let highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
    // console.log("\n\nHighest synced block number: ", highestSyncedBlockNumber);

    let newBlockNumber = highestSyncedBlockNumber + 1;
    // console.log("Adding new block number: ", newBlockNumber);
    await this.addNewBlock(dbName, newBlockNumber);
    highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
    // console.log("Highest synced block number: ", highestSyncedBlockNumber);

    newBlockNumber = highestSyncedBlockNumber + 1;
    // console.log("Adding new block number: " + newBlockNumber);
    await this.addNewBlock(dbName, newBlockNumber);
    highestSyncedBlockNumber = await this.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId]);
    // console.log("Highest synced block number: ", highestSyncedBlockNumber);
  }

  // TODO Move to unit test
  public async addNewBlock(dbName: string, newBlockNumber: number): Promise<void> {
    const logs = [
      {
        "universe":"0x11149d40d255fCeaC54A3ee3899807B0539bad60",
        "market":"0xC0ffe3F654d442589BAb472937F094970339d214",
        "disputeCrowdsourcer":"0x65d4f86927D1f10eFa2Fb884e4DEe0aB86137caD",
        "blockNumber":newBlockNumber,
        "blockHash":"0x8132a0cdb4226b3bbb5bcf8429ec0883859255751be2c321c58b488395188040",
        "transactionIndex":8,
        "removed":false,
        "transactionHash":"0xf750ebb0d039c623385f8227f7a6cbe49f5efbc5485ac0e38b5a7b0e389726d8",
        "logIndex":1,
      },
    ];
    try {
      await this.syncableDatabases[dbName].addNewBlock(newBlockNumber, logs);
    } catch (err) {
      console.error("ERROR Unable to add block: ", err);
    }
    const highestSyncBlock = await this.syncStatus.getHighestSyncBlock(dbName, uploadBlockNumbers[this.networkId])
    if (highestSyncBlock !== newBlockNumber) {
      console.error("ERROR Highest sync block is " + highestSyncBlock + "; newest block number is " + newBlockNumber);
    }
    let newSequenceIds = await this.getAllSequenceIds();
    
    // Update MetaDB
    // await this.updateMetaDB();
  }
}
